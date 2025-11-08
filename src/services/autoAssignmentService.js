/**
 * Auto-Assignment Service - Intelligent assignment of leads, cases, and tasks
 * Supports multiple assignment strategies: round-robin, skill-based, load-based, geographic
 */

/**
 * Assignment Strategies
 */
export const ASSIGNMENT_STRATEGIES = {
  ROUND_ROBIN: 'round_robin',
  SKILL_BASED: 'skill_based',
  LOAD_BASED: 'load_based',
  GEOGRAPHIC: 'geographic',
  SCORE_BASED: 'score_based',
  HYBRID: 'hybrid'
};

/**
 * Agent Skills Configuration
 */
export const AGENT_SKILLS = {
  MOTOR_INSURANCE: 'motor_insurance',
  HEALTH_INSURANCE: 'health_insurance',
  LIFE_INSURANCE: 'life_insurance',
  PROPERTY_INSURANCE: 'property_insurance',
  CORPORATE: 'corporate',
  RETAIL: 'retail',
  HNI: 'hni',
  RENEWAL: 'renewal',
  NEW_BUSINESS: 'new_business',
  CLAIMS: 'claims'
};

/**
 * Get agent workload
 */
export const calculateAgentWorkload = (agent, entities = []) => {
  const assignedToAgent = entities.filter(e =>
    e.assignedToId === agent.id || e.assignedTo === agent.name
  );

  const activeItems = assignedToAgent.filter(e =>
    !['Closed Won', 'Closed Lost', 'Completed', 'Cancelled'].includes(e.status)
  );

  const urgentItems = activeItems.filter(e =>
    e.priority === 'urgent' || e.priority === 'high'
  );

  return {
    totalAssigned: assignedToAgent.length,
    activeItems: activeItems.length,
    urgentItems: urgentItems.length,
    workloadScore: (activeItems.length * 1) + (urgentItems.length * 2)
  };
};

/**
 * Get available agents (not at capacity)
 */
export const getAvailableAgents = (agents, entities, maxCapacity = 50) => {
  return agents.filter(agent => {
    if (!agent.active || agent.status === 'inactive') return false;

    const workload = calculateAgentWorkload(agent, entities);
    return workload.activeItems < maxCapacity;
  });
};

/**
 * Round-robin assignment strategy
 */
export const roundRobinAssignment = (agents, entities, lastAssignedIndex = -1) => {
  const availableAgents = getAvailableAgents(agents, entities);

  if (availableAgents.length === 0) {
    return null; // No available agents
  }

  // Find next agent in rotation
  let nextIndex = (lastAssignedIndex + 1) % availableAgents.length;
  return {
    agent: availableAgents[nextIndex],
    strategy: ASSIGNMENT_STRATEGIES.ROUND_ROBIN,
    reason: 'Next agent in rotation',
    nextIndex: nextIndex
  };
};

/**
 * Load-based assignment strategy (assign to agent with lowest workload)
 */
export const loadBasedAssignment = (agents, entities) => {
  const availableAgents = getAvailableAgents(agents, entities);

  if (availableAgents.length === 0) {
    return null;
  }

  // Calculate workload for each agent and find the one with lowest
  const agentsWithWorkload = availableAgents.map(agent => ({
    agent,
    workload: calculateAgentWorkload(agent, entities)
  }));

  const leastBusyAgent = agentsWithWorkload.reduce((min, current) =>
    current.workload.workloadScore < min.workload.workloadScore ? current : min
  );

  return {
    agent: leastBusyAgent.agent,
    strategy: ASSIGNMENT_STRATEGIES.LOAD_BASED,
    reason: `Lowest workload (${leastBusyAgent.workload.activeItems} active items)`,
    workload: leastBusyAgent.workload
  };
};

/**
 * Skill-based assignment strategy
 */
export const skillBasedAssignment = (entity, agents, entities) => {
  const availableAgents = getAvailableAgents(agents, entities);

  if (availableAgents.length === 0) {
    return null;
  }

  // Determine required skills based on entity type and attributes
  const requiredSkills = determineRequiredSkills(entity);

  // Filter agents with matching skills
  const skilledAgents = availableAgents.filter(agent => {
    if (!agent.skills || agent.skills.length === 0) return true; // No skills defined = can handle anything

    return requiredSkills.some(skill => agent.skills.includes(skill));
  });

  if (skilledAgents.length === 0) {
    // No skilled agents, fall back to load-based
    return loadBasedAssignment(agents, entities);
  }

  // Among skilled agents, pick the one with lowest workload
  const agentsWithWorkload = skilledAgents.map(agent => ({
    agent,
    workload: calculateAgentWorkload(agent, entities),
    matchingSkills: agent.skills?.filter(s => requiredSkills.includes(s)) || []
  }));

  const bestMatch = agentsWithWorkload.reduce((best, current) => {
    // Prefer agents with more matching skills
    if (current.matchingSkills.length > best.matchingSkills.length) return current;
    if (current.matchingSkills.length < best.matchingSkills.length) return best;

    // If equal skills, prefer lower workload
    return current.workload.workloadScore < best.workload.workloadScore ? current : best;
  });

  return {
    agent: bestMatch.agent,
    strategy: ASSIGNMENT_STRATEGIES.SKILL_BASED,
    reason: `Best skill match (${bestMatch.matchingSkills.join(', ')})`,
    matchingSkills: bestMatch.matchingSkills,
    workload: bestMatch.workload
  };
};

/**
 * Determine required skills for an entity
 */
const determineRequiredSkills = (entity) => {
  const skills = [];

  // Based on product/subProduct
  if (entity.subProduct) {
    const product = entity.subProduct.toLowerCase();
    if (product.includes('motor') || product.includes('vehicle')) {
      skills.push(AGENT_SKILLS.MOTOR_INSURANCE);
    }
    if (product.includes('health')) {
      skills.push(AGENT_SKILLS.HEALTH_INSURANCE);
    }
    if (product.includes('life')) {
      skills.push(AGENT_SKILLS.LIFE_INSURANCE);
    }
    if (product.includes('property') || product.includes('home')) {
      skills.push(AGENT_SKILLS.PROPERTY_INSURANCE);
    }
  }

  // Based on entity type
  if (entity.type === 'renewal' || entity.status === 'Renewal') {
    skills.push(AGENT_SKILLS.RENEWAL);
  } else {
    skills.push(AGENT_SKILLS.NEW_BUSINESS);
  }

  // Based on customer profile
  if (entity.customerProfile === 'HNI' || entity.value > 1000000) {
    skills.push(AGENT_SKILLS.HNI);
  }

  // Based on company size
  if (entity.companySize === 'enterprise' || entity.companySize === 'large') {
    skills.push(AGENT_SKILLS.CORPORATE);
  } else {
    skills.push(AGENT_SKILLS.RETAIL);
  }

  return skills;
};

/**
 * Geographic assignment strategy
 */
export const geographicAssignment = (entity, agents, entities) => {
  const availableAgents = getAvailableAgents(agents, entities);

  if (availableAgents.length === 0) {
    return null;
  }

  // Extract location from entity
  const entityLocation = extractLocation(entity);

  if (!entityLocation) {
    // No location info, fall back to load-based
    return loadBasedAssignment(agents, entities);
  }

  // Filter agents by territory/region
  const localAgents = availableAgents.filter(agent => {
    if (!agent.territory) return false;

    return matchesTerritory(entityLocation, agent.territory);
  });

  if (localAgents.length === 0) {
    // No local agents, fall back to load-based
    return loadBasedAssignment(agents, entities);
  }

  // Among local agents, pick lowest workload
  const agentsWithWorkload = localAgents.map(agent => ({
    agent,
    workload: calculateAgentWorkload(agent, entities)
  }));

  const bestMatch = agentsWithWorkload.reduce((min, current) =>
    current.workload.workloadScore < min.workload.workloadScore ? current : min
  );

  return {
    agent: bestMatch.agent,
    strategy: ASSIGNMENT_STRATEGIES.GEOGRAPHIC,
    reason: `Territory match (${bestMatch.agent.territory})`,
    territory: bestMatch.agent.territory,
    workload: bestMatch.workload
  };
};

/**
 * Extract location from entity
 */
const extractLocation = (entity) => {
  // Try various location fields
  if (entity.state) return { state: entity.state, city: entity.city };
  if (entity.address && typeof entity.address === 'string') {
    // Parse address for state/city
    const addressParts = entity.address.split(',').map(p => p.trim());
    if (addressParts.length >= 2) {
      return {
        city: addressParts[addressParts.length - 2],
        state: addressParts[addressParts.length - 1]
      };
    }
  }
  return null;
};

/**
 * Check if location matches agent's territory
 */
const matchesTerritory = (location, territory) => {
  if (!location || !territory) return false;

  // Territory can be an array of states/cities or a string
  if (Array.isArray(territory)) {
    return territory.some(t =>
      t.toLowerCase() === location.state?.toLowerCase() ||
      t.toLowerCase() === location.city?.toLowerCase()
    );
  }

  if (typeof territory === 'string') {
    return territory.toLowerCase() === location.state?.toLowerCase() ||
           territory.toLowerCase() === location.city?.toLowerCase();
  }

  return false;
};

/**
 * Score-based assignment (assign high-value leads to top performers)
 */
export const scoreBasedAssignment = (entity, agents, entities, leadScores = {}) => {
  const availableAgents = getAvailableAgents(agents, entities);

  if (availableAgents.length === 0) {
    return null;
  }

  // Get entity score
  const entityScore = leadScores[entity.id]?.score || entity.score || 0;

  // Categorize entity
  const isHighValue = entityScore >= 80;
  const isMediumValue = entityScore >= 60 && entityScore < 80;

  // Filter agents by performance tier
  let eligibleAgents = availableAgents;

  if (isHighValue) {
    // High-value leads go to top performers
    eligibleAgents = availableAgents.filter(a =>
      a.performanceTier === 'top' || a.performanceTier === 'high'
    );
    if (eligibleAgents.length === 0) eligibleAgents = availableAgents; // Fallback
  } else if (isMediumValue) {
    // Medium-value leads go to average+ performers
    eligibleAgents = availableAgents.filter(a =>
      ['top', 'high', 'average'].includes(a.performanceTier)
    );
    if (eligibleAgents.length === 0) eligibleAgents = availableAgents; // Fallback
  }

  // Among eligible agents, pick lowest workload
  const agentsWithWorkload = eligibleAgents.map(agent => ({
    agent,
    workload: calculateAgentWorkload(agent, entities)
  }));

  const bestMatch = agentsWithWorkload.reduce((min, current) =>
    current.workload.workloadScore < min.workload.workloadScore ? current : min
  );

  return {
    agent: bestMatch.agent,
    strategy: ASSIGNMENT_STRATEGIES.SCORE_BASED,
    reason: `Performance tier match (${bestMatch.agent.performanceTier || 'standard'}) for ${entityScore >= 80 ? 'high' : 'medium'}-value lead`,
    entityScore: entityScore,
    performanceTier: bestMatch.agent.performanceTier,
    workload: bestMatch.workload
  };
};

/**
 * Hybrid assignment strategy (combines multiple factors)
 */
export const hybridAssignment = (entity, agents, entities, options = {}) => {
  const { leadScores = {}, prioritizeSkills = true, prioritizeLoad = true } = options;

  const availableAgents = getAvailableAgents(agents, entities);

  if (availableAgents.length === 0) {
    return null;
  }

  // Score each agent based on multiple factors
  const agentScores = availableAgents.map(agent => {
    let score = 100; // Start with base score

    // Factor 1: Workload (lower is better)
    const workload = calculateAgentWorkload(agent, entities);
    const workloadPenalty = workload.workloadScore * 2; // Penalty for high workload
    score -= workloadPenalty;

    // Factor 2: Skill match
    if (prioritizeSkills) {
      const requiredSkills = determineRequiredSkills(entity);
      const matchingSkills = agent.skills?.filter(s => requiredSkills.includes(s)) || [];
      const skillBonus = matchingSkills.length * 20;
      score += skillBonus;
    }

    // Factor 3: Performance tier
    const performanceBonuses = {
      'top': 30,
      'high': 20,
      'average': 10,
      'low': 0
    };
    score += performanceBonuses[agent.performanceTier] || 0;

    // Factor 4: Lead score match
    const entityScore = leadScores[entity.id]?.score || entity.score || 0;
    if (entityScore >= 80 && ['top', 'high'].includes(agent.performanceTier)) {
      score += 25; // Bonus for high-value lead + top performer match
    }

    // Factor 5: Geographic match
    const entityLocation = extractLocation(entity);
    if (entityLocation && agent.territory && matchesTerritory(entityLocation, agent.territory)) {
      score += 15; // Bonus for local match
    }

    return {
      agent,
      score,
      workload,
      breakdown: {
        workloadPenalty,
        skillBonus: prioritizeSkills ? (agent.skills?.filter(s => determineRequiredSkills(entity).includes(s)) || []).length * 20 : 0,
        performanceBonus: performanceBonuses[agent.performanceTier] || 0
      }
    };
  });

  // Get agent with highest score
  const bestMatch = agentScores.reduce((best, current) =>
    current.score > best.score ? current : best
  );

  return {
    agent: bestMatch.agent,
    strategy: ASSIGNMENT_STRATEGIES.HYBRID,
    reason: `Best overall match (score: ${Math.round(bestMatch.score)})`,
    matchScore: bestMatch.score,
    breakdown: bestMatch.breakdown,
    workload: bestMatch.workload
  };
};

/**
 * Auto-assign entity (main function)
 */
export const autoAssignEntity = (entity, agents, entities, config = {}) => {
  const {
    strategy = ASSIGNMENT_STRATEGIES.HYBRID,
    leadScores = {},
    lastAssignedIndex = -1,
    maxCapacity = 50
  } = config;

  // Pre-filter: only active agents
  const activeAgents = agents.filter(a => a.active !== false && a.status !== 'inactive');

  if (activeAgents.length === 0) {
    return {
      success: false,
      error: 'No active agents available',
      agent: null
    };
  }

  let result = null;

  switch (strategy) {
    case ASSIGNMENT_STRATEGIES.ROUND_ROBIN:
      result = roundRobinAssignment(activeAgents, entities, lastAssignedIndex);
      break;

    case ASSIGNMENT_STRATEGIES.LOAD_BASED:
      result = loadBasedAssignment(activeAgents, entities);
      break;

    case ASSIGNMENT_STRATEGIES.SKILL_BASED:
      result = skillBasedAssignment(entity, activeAgents, entities);
      break;

    case ASSIGNMENT_STRATEGIES.GEOGRAPHIC:
      result = geographicAssignment(entity, activeAgents, entities);
      break;

    case ASSIGNMENT_STRATEGIES.SCORE_BASED:
      result = scoreBasedAssignment(entity, activeAgents, entities, leadScores);
      break;

    case ASSIGNMENT_STRATEGIES.HYBRID:
    default:
      result = hybridAssignment(entity, activeAgents, entities, { leadScores });
      break;
  }

  if (!result) {
    return {
      success: false,
      error: 'No suitable agent found',
      agent: null
    };
  }

  return {
    success: true,
    agent: result.agent,
    strategy: result.strategy,
    reason: result.reason,
    metadata: result,
    assignedAt: new Date().toISOString()
  };
};

/**
 * Batch auto-assign multiple entities
 */
export const batchAutoAssign = (entities, agents, existingEntities, config = {}) => {
  const results = [];
  let lastIndex = config.lastAssignedIndex || -1;

  entities.forEach(entity => {
    const result = autoAssignEntity(entity, agents, existingEntities, {
      ...config,
      lastAssignedIndex: lastIndex
    });

    if (result.success) {
      results.push({
        entityId: entity.id,
        entityType: entity.type || 'unknown',
        agent: result.agent,
        strategy: result.strategy,
        reason: result.reason,
        assignedAt: result.assignedAt
      });

      // Update last index for round-robin
      if (result.metadata?.nextIndex !== undefined) {
        lastIndex = result.metadata.nextIndex;
      }

      // Add to existing entities for next iteration workload calculation
      existingEntities.push({
        ...entity,
        assignedTo: result.agent.name,
        assignedToId: result.agent.id
      });
    } else {
      results.push({
        entityId: entity.id,
        entityType: entity.type || 'unknown',
        error: result.error,
        agent: null
      });
    }
  });

  return {
    assigned: results.filter(r => r.agent),
    failed: results.filter(r => !r.agent),
    lastAssignedIndex: lastIndex
  };
};

export default {
  ASSIGNMENT_STRATEGIES,
  AGENT_SKILLS,
  calculateAgentWorkload,
  getAvailableAgents,
  roundRobinAssignment,
  loadBasedAssignment,
  skillBasedAssignment,
  geographicAssignment,
  scoreBasedAssignment,
  hybridAssignment,
  autoAssignEntity,
  batchAutoAssign
};
