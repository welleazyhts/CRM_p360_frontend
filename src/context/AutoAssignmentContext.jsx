import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ASSIGNMENT_STRATEGIES,
  AGENT_SKILLS,
  autoAssignEntity,
  batchAutoAssign,
  calculateAgentWorkload,
  getAvailableAgents
} from '../services/autoAssignmentService';

const AutoAssignmentContext = createContext();

export const useAutoAssignment = () => {
  const context = useContext(AutoAssignmentContext);
  if (!context) {
    throw new Error('useAutoAssignment must be used within AutoAssignmentProvider');
  }
  return context;
};

export const AutoAssignmentProvider = ({ children }) => {
  // Configuration state
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('autoAssignmentConfig');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      defaultStrategy: ASSIGNMENT_STRATEGIES.HYBRID,
      maxCapacity: 50,
      considerSLA: true,
      considerScore: true,
      autoAssignOnCreate: true,
      reassignmentRules: {
        enabled: false,
        onOverload: true,
        onInactivity: true,
        inactivityThreshold: 24 // hours
      },
      strategies: {
        lead: ASSIGNMENT_STRATEGIES.HYBRID,
        case: ASSIGNMENT_STRATEGIES.LOAD_BASED,
        task: ASSIGNMENT_STRATEGIES.ROUND_ROBIN,
        email: ASSIGNMENT_STRATEGIES.LOAD_BASED,
        claim: ASSIGNMENT_STRATEGIES.SKILL_BASED
      }
    };
  });

  // Agents state
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('autoAssignmentAgents');
    return saved ? JSON.parse(saved) : [
      {
        id: 'priya.patel',
        name: 'Priya Patel',
        email: 'priya.patel@company.com',
        active: true,
        status: 'active',
        skills: [AGENT_SKILLS.MOTOR_INSURANCE, AGENT_SKILLS.RENEWAL, AGENT_SKILLS.RETAIL],
        territory: ['Mumbai', 'Maharashtra'],
        performanceTier: 'top',
        maxCapacity: 50
      },
      {
        id: 'amit.kumar',
        name: 'Amit Kumar',
        email: 'amit.kumar@company.com',
        active: true,
        status: 'active',
        skills: [AGENT_SKILLS.HEALTH_INSURANCE, AGENT_SKILLS.LIFE_INSURANCE, AGENT_SKILLS.CORPORATE],
        territory: ['Delhi', 'NCR'],
        performanceTier: 'high',
        maxCapacity: 45
      },
      {
        id: 'sneha.gupta',
        name: 'Sneha Gupta',
        email: 'sneha.gupta@company.com',
        active: true,
        status: 'active',
        skills: [AGENT_SKILLS.PROPERTY_INSURANCE, AGENT_SKILLS.HNI, AGENT_SKILLS.NEW_BUSINESS],
        territory: ['Bangalore', 'Karnataka'],
        performanceTier: 'high',
        maxCapacity: 40
      },
      {
        id: 'rajesh.kumar',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@company.com',
        active: true,
        status: 'active',
        skills: [AGENT_SKILLS.MOTOR_INSURANCE, AGENT_SKILLS.HEALTH_INSURANCE, AGENT_SKILLS.RETAIL],
        territory: ['Chennai', 'Tamil Nadu'],
        performanceTier: 'average',
        maxCapacity: 50
      },
      {
        id: 'deepak.sharma',
        name: 'Deepak Sharma',
        email: 'deepak.sharma@company.com',
        active: true,
        status: 'active',
        skills: [AGENT_SKILLS.CLAIMS, AGENT_SKILLS.RENEWAL],
        territory: ['Pune', 'Maharashtra'],
        performanceTier: 'average',
        maxCapacity: 45
      }
    ];
  });

  // Assignment history
  const [assignmentHistory, setAssignmentHistory] = useState(() => {
    const saved = localStorage.getItem('assignmentHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Last assigned index for round-robin
  const [lastAssignedIndex, setLastAssignedIndex] = useState(0);

  // Save configuration
  useEffect(() => {
    localStorage.setItem('autoAssignmentConfig', JSON.stringify(config));
  }, [config]);

  // Save agents
  useEffect(() => {
    localStorage.setItem('autoAssignmentAgents', JSON.stringify(agents));
  }, [agents]);

  // Save history
  useEffect(() => {
    localStorage.setItem('assignmentHistory', JSON.stringify(assignmentHistory));
  }, [assignmentHistory]);

  /**
   * Assign entity to agent
   */
  const assignEntity = useCallback((entity, entities = [], leadScores = {}) => {
    if (!config.enabled) {
      return { success: false, error: 'Auto-assignment is disabled' };
    }

    const strategy = config.strategies[entity.type] || config.defaultStrategy;

    const result = autoAssignEntity(entity, agents, entities, {
      strategy,
      leadScores,
      lastAssignedIndex,
      maxCapacity: config.maxCapacity
    });

    if (result.success) {
      // Update last assigned index
      if (result.metadata?.nextIndex !== undefined) {
        setLastAssignedIndex(result.metadata.nextIndex);
      }

      // Add to history
      const historyEntry = {
        id: `assign_${Date.now()}_${entity.id}`,
        entityId: entity.id,
        entityType: entity.type || 'unknown',
        agentId: result.agent.id,
        agentName: result.agent.name,
        strategy: result.strategy,
        reason: result.reason,
        assignedAt: result.assignedAt,
        metadata: result.metadata
      };

      setAssignmentHistory(prev => [historyEntry, ...prev].slice(0, 1000)); // Keep last 1000
    }

    return result;
  }, [config, agents, lastAssignedIndex]);

  /**
   * Batch assign entities
   */
  const assignMultipleEntities = useCallback((entities, existingEntities = [], leadScores = {}) => {
    if (!config.enabled) {
      return { assigned: [], failed: entities.map(e => ({ entityId: e.id, error: 'Auto-assignment is disabled' })) };
    }

    const strategy = config.defaultStrategy;

    const result = batchAutoAssign(entities, agents, existingEntities, {
      strategy,
      leadScores,
      lastAssignedIndex,
      maxCapacity: config.maxCapacity
    });

    // Update last assigned index
    if (result.lastAssignedIndex !== undefined) {
      setLastAssignedIndex(result.lastAssignedIndex);
    }

    // Add to history
    const historyEntries = result.assigned.map(item => ({
      id: `assign_${Date.now()}_${item.entityId}`,
      entityId: item.entityId,
      entityType: item.entityType,
      agentId: item.agent.id,
      agentName: item.agent.name,
      strategy: item.strategy,
      reason: item.reason,
      assignedAt: item.assignedAt
    }));

    setAssignmentHistory(prev => [...historyEntries, ...prev].slice(0, 1000));

    return result;
  }, [config, agents, lastAssignedIndex]);

  /**
   * Update configuration
   */
  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Update strategy for entity type
   */
  const updateStrategyForType = useCallback((entityType, strategy) => {
    setConfig(prev => ({
      ...prev,
      strategies: {
        ...prev.strategies,
        [entityType]: strategy
      }
    }));
  }, []);

  /**
   * Add or update agent
   */
  const upsertAgent = useCallback((agent) => {
    setAgents(prev => {
      const index = prev.findIndex(a => a.id === agent.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...agent };
        return updated;
      }
      return [...prev, agent];
    });
  }, []);

  /**
   * Remove agent
   */
  const removeAgent = useCallback((agentId) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
  }, []);

  /**
   * Toggle agent active status
   */
  const toggleAgentActive = useCallback((agentId) => {
    setAgents(prev => prev.map(a =>
      a.id === agentId ? { ...a, active: !a.active, status: !a.active ? 'active' : 'inactive' } : a
    ));
  }, []);

  /**
   * Get agent workload
   */
  const getAgentWorkload = useCallback((agentId, entities = []) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return null;

    return calculateAgentWorkload(agent, entities);
  }, [agents]);

  /**
   * Get all agent workloads
   */
  const getAllAgentWorkloads = useCallback((entities = []) => {
    return agents.map(agent => ({
      agent,
      workload: calculateAgentWorkload(agent, entities)
    }));
  }, [agents]);

  /**
   * Get available agents
   */
  const getAvailableAgentsList = useCallback((entities = []) => {
    return getAvailableAgents(agents, entities, config.maxCapacity);
  }, [agents, config.maxCapacity]);

  /**
   * Get assignment statistics
   */
  const getAssignmentStats = useCallback(() => {
    const total = assignmentHistory.length;
    const byStrategy = {};
    const byAgent = {};

    assignmentHistory.forEach(entry => {
      byStrategy[entry.strategy] = (byStrategy[entry.strategy] || 0) + 1;
      byAgent[entry.agentId] = (byAgent[entry.agentId] || 0) + 1;
    });

    return {
      total,
      byStrategy,
      byAgent,
      mostUsedStrategy: Object.keys(byStrategy).reduce((a, b) =>
        byStrategy[a] > byStrategy[b] ? a : b, Object.keys(byStrategy)[0]
      ),
      mostAssignedAgent: Object.keys(byAgent).reduce((a, b) =>
        byAgent[a] > byAgent[b] ? a : b, Object.keys(byAgent)[0]
      )
    };
  }, [assignmentHistory]);

  /**
   * Clear assignment history
   */
  const clearHistory = useCallback(() => {
    setAssignmentHistory([]);
    localStorage.removeItem('assignmentHistory');
  }, []);

  /**
   * Export configuration and agents
   */
  const exportConfiguration = useCallback(() => {
    return {
      config,
      agents,
      exportDate: new Date().toISOString()
    };
  }, [config, agents]);

  /**
   * Import configuration and agents
   */
  const importConfiguration = useCallback((data) => {
    if (data.config) setConfig(data.config);
    if (data.agents) setAgents(data.agents);
  }, []);

  const value = {
    // Configuration
    config,
    updateConfig,
    updateStrategyForType,

    // Agents
    agents,
    upsertAgent,
    removeAgent,
    toggleAgentActive,
    getAgentWorkload,
    getAllAgentWorkloads,
    getAvailableAgentsList,

    // Assignment
    assignEntity,
    assignMultipleEntities,
    assignmentHistory,
    lastAssignedIndex,

    // Analytics
    getAssignmentStats,
    clearHistory,

    // Import/Export
    exportConfiguration,
    importConfiguration
  };

  return <AutoAssignmentContext.Provider value={value}>{children}</AutoAssignmentContext.Provider>;
};

export default AutoAssignmentContext;
