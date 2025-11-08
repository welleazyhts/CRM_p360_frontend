/**
 * Lead Scoring Service - Automatic lead scoring and prioritization
 * Scores leads based on multiple factors: demographics, engagement, behavior, fit
 */

/**
 * Default Scoring Rules
 */
export const DEFAULT_SCORING_RULES = {
  demographic: {
    weight: 25,
    factors: {
      companySize: {
        'enterprise': 10,
        'large': 8,
        'medium': 6,
        'small': 4,
        'startup': 2
      },
      jobTitle: {
        'c-level': 10, // CEO, CFO, CTO, etc.
        'director': 8,
        'manager': 6,
        'specialist': 4,
        'other': 2
      },
      industry: {
        'technology': 9,
        'finance': 9,
        'healthcare': 8,
        'manufacturing': 7,
        'retail': 6,
        'other': 5
      }
    }
  },
  engagement: {
    weight: 30,
    factors: {
      emailOpens: { // Number of email opens
        threshold: [0, 3, 6, 10],
        scores: [0, 3, 6, 10]
      },
      emailClicks: {
        threshold: [0, 2, 4, 7],
        scores: [0, 4, 7, 10]
      },
      websiteVisits: {
        threshold: [0, 2, 5, 10],
        scores: [0, 3, 6, 10]
      },
      formSubmissions: {
        threshold: [0, 1, 2, 3],
        scores: [0, 5, 8, 10]
      },
      callsAnswered: {
        threshold: [0, 1, 2, 4],
        scores: [0, 4, 7, 10]
      }
    }
  },
  behavior: {
    weight: 25,
    factors: {
      responseTime: { // Average response time in hours
        threshold: [24, 12, 4, 1],
        scores: [2, 5, 8, 10]
      },
      meetingsScheduled: {
        threshold: [0, 1, 2, 3],
        scores: [0, 5, 8, 10]
      },
      documentsDownloaded: {
        threshold: [0, 1, 3, 5],
        scores: [0, 3, 6, 10]
      },
      pricingPageViews: {
        threshold: [0, 1, 2, 4],
        scores: [0, 5, 8, 10]
      }
    }
  },
  fit: {
    weight: 20,
    factors: {
      budgetRange: {
        'above-target': 10,
        'at-target': 8,
        'below-target': 5,
        'unknown': 3
      },
      decisionTimeframe: {
        'immediate': 10,
        '1-month': 8,
        '3-months': 6,
        '6-months': 4,
        'longer': 2
      },
      currentSolution: {
        'none': 10, // No current solution
        'basic': 8,
        'competitor': 6,
        'advanced': 4
      },
      painPoints: { // Number of pain points identified
        threshold: [0, 1, 2, 3],
        scores: [0, 4, 7, 10]
      }
    }
  }
};

/**
 * Score multipliers based on source
 */
export const SOURCE_MULTIPLIERS = {
  'referral': 1.2,
  'website': 1.1,
  'email campaign': 1.0,
  'social media': 0.9,
  'cold call': 0.8,
  'trade show': 1.0,
  'other': 0.9
};

/**
 * Calculate demographic score
 */
export const calculateDemographicScore = (lead, rules = DEFAULT_SCORING_RULES.demographic) => {
  let score = 0;
  const factors = rules.factors;

  // Company size scoring
  if (lead.companySize && factors.companySize[lead.companySize.toLowerCase()]) {
    score += factors.companySize[lead.companySize.toLowerCase()];
  }

  // Job title scoring
  if (lead.position) {
    const position = lead.position.toLowerCase();
    if (position.includes('ceo') || position.includes('cfo') || position.includes('cto') || position.includes('chief')) {
      score += factors.jobTitle['c-level'];
    } else if (position.includes('director')) {
      score += factors.jobTitle['director'];
    } else if (position.includes('manager')) {
      score += factors.jobTitle['manager'];
    } else if (position.includes('specialist') || position.includes('analyst')) {
      score += factors.jobTitle['specialist'];
    } else {
      score += factors.jobTitle['other'];
    }
  }

  // Industry scoring
  if (lead.industry && factors.industry[lead.industry.toLowerCase()]) {
    score += factors.industry[lead.industry.toLowerCase()];
  } else if (lead.industry) {
    score += factors.industry['other'];
  }

  return Math.min(score, 30); // Cap at 30 points
};

/**
 * Calculate engagement score
 */
export const calculateEngagementScore = (lead, engagementData = {}, rules = DEFAULT_SCORING_RULES.engagement) => {
  let score = 0;
  const factors = rules.factors;

  Object.keys(factors).forEach(factor => {
    const value = engagementData[factor] || 0;
    const config = factors[factor];

    // Find the appropriate score based on threshold
    for (let i = config.threshold.length - 1; i >= 0; i--) {
      if (value >= config.threshold[i]) {
        score += config.scores[i];
        break;
      }
    }
  });

  return Math.min(score, 50); // Cap at 50 points
};

/**
 * Calculate behavior score
 */
export const calculateBehaviorScore = (lead, behaviorData = {}, rules = DEFAULT_SCORING_RULES.behavior) => {
  let score = 0;
  const factors = rules.factors;

  // Response time (inverted - lower is better)
  if (behaviorData.responseTime !== undefined) {
    const config = factors.responseTime;
    for (let i = 0; i < config.threshold.length; i++) {
      if (behaviorData.responseTime <= config.threshold[i]) {
        score += config.scores[i];
        break;
      }
    }
  }

  // Other behavioral factors
  ['meetingsScheduled', 'documentsDownloaded', 'pricingPageViews'].forEach(factor => {
    const value = behaviorData[factor] || 0;
    const config = factors[factor];

    for (let i = config.threshold.length - 1; i >= 0; i--) {
      if (value >= config.threshold[i]) {
        score += config.scores[i];
        break;
      }
    }
  });

  return Math.min(score, 40); // Cap at 40 points
};

/**
 * Calculate fit score
 */
export const calculateFitScore = (lead, fitData = {}, rules = DEFAULT_SCORING_RULES.fit) => {
  let score = 0;
  const factors = rules.factors;

  // Budget range
  if (fitData.budgetRange && factors.budgetRange[fitData.budgetRange]) {
    score += factors.budgetRange[fitData.budgetRange];
  }

  // Decision timeframe
  if (fitData.decisionTimeframe && factors.decisionTimeframe[fitData.decisionTimeframe]) {
    score += factors.decisionTimeframe[fitData.decisionTimeframe];
  }

  // Current solution
  if (fitData.currentSolution && factors.currentSolution[fitData.currentSolution]) {
    score += factors.currentSolution[fitData.currentSolution];
  }

  // Pain points
  if (fitData.painPoints !== undefined) {
    const config = factors.painPoints;
    for (let i = config.threshold.length - 1; i >= 0; i--) {
      if (fitData.painPoints >= config.threshold[i]) {
        score += config.scores[i];
        break;
      }
    }
  }

  return Math.min(score, 40); // Cap at 40 points
};

/**
 * Calculate overall lead score
 */
export const calculateLeadScore = (lead, additionalData = {}, customRules = null) => {
  const rules = customRules || DEFAULT_SCORING_RULES;

  const demographicScore = calculateDemographicScore(lead, rules.demographic);
  const engagementScore = calculateEngagementScore(lead, additionalData.engagement, rules.engagement);
  const behaviorScore = calculateBehaviorScore(lead, additionalData.behavior, rules.behavior);
  const fitScore = calculateFitScore(lead, additionalData.fit, rules.fit);

  // Apply weights
  const weightedScore =
    (demographicScore * (rules.demographic.weight / 100)) +
    (engagementScore * (rules.engagement.weight / 100)) +
    (behaviorScore * (rules.behavior.weight / 100)) +
    (fitScore * (rules.fit.weight / 100));

  // Apply source multiplier
  const sourceMultiplier = SOURCE_MULTIPLIERS[lead.source?.toLowerCase()] || 1.0;
  const finalScore = Math.round(weightedScore * sourceMultiplier);

  // Cap at 100
  return Math.min(finalScore, 100);
};

/**
 * Get lead grade based on score
 */
export const getLeadGrade = (score) => {
  if (score >= 80) return { grade: 'A', label: 'Hot Lead', color: '#d32f2f', priority: 'urgent' };
  if (score >= 60) return { grade: 'B', label: 'Warm Lead', color: '#f57c00', priority: 'high' };
  if (score >= 40) return { grade: 'C', label: 'Qualified Lead', color: '#fbc02d', priority: 'medium' };
  if (score >= 20) return { grade: 'D', label: 'Cold Lead', color: '#1976d2', priority: 'low' };
  return { grade: 'F', label: 'Poor Fit', color: '#757575', priority: 'low' };
};

/**
 * Get scoring breakdown
 */
export const getScoringBreakdown = (lead, additionalData = {}, customRules = null) => {
  const rules = customRules || DEFAULT_SCORING_RULES;

  const demographic = calculateDemographicScore(lead, rules.demographic);
  const engagement = calculateEngagementScore(lead, additionalData.engagement, rules.engagement);
  const behavior = calculateBehaviorScore(lead, additionalData.behavior, rules.behavior);
  const fit = calculateFitScore(lead, additionalData.fit, rules.fit);

  const totalScore = calculateLeadScore(lead, additionalData, customRules);
  const grade = getLeadGrade(totalScore);

  return {
    totalScore,
    grade: grade.grade,
    label: grade.label,
    priority: grade.priority,
    breakdown: {
      demographic: {
        score: demographic,
        weight: rules.demographic.weight,
        weighted: demographic * (rules.demographic.weight / 100)
      },
      engagement: {
        score: engagement,
        weight: rules.engagement.weight,
        weighted: engagement * (rules.engagement.weight / 100)
      },
      behavior: {
        score: behavior,
        weight: rules.behavior.weight,
        weighted: behavior * (rules.behavior.weight / 100)
      },
      fit: {
        score: fit,
        weight: rules.fit.weight,
        weighted: fit * (rules.fit.weight / 100)
      }
    },
    sourceMultiplier: SOURCE_MULTIPLIERS[lead.source?.toLowerCase()] || 1.0
  };
};

/**
 * Calculate score decay (leads get colder over time)
 */
export const calculateScoreDecay = (score, leadAgeDays) => {
  // Reduce score by 1% per week, max 30% reduction
  const weeksOld = Math.floor(leadAgeDays / 7);
  const decayPercent = Math.min(weeksOld * 1, 30);
  return Math.round(score * (1 - decayPercent / 100));
};

/**
 * Get recommended next action based on score
 */
export const getRecommendedAction = (score, leadData) => {
  const grade = getLeadGrade(score);

  if (score >= 80) {
    return {
      action: 'immediate_call',
      description: 'Schedule immediate call or meeting',
      urgency: 'critical',
      timeline: 'within 1 hour'
    };
  } else if (score >= 60) {
    return {
      action: 'priority_follow_up',
      description: 'Follow up with personalized email and call',
      urgency: 'high',
      timeline: 'within 4 hours'
    };
  } else if (score >= 40) {
    return {
      action: 'nurture',
      description: 'Add to nurture campaign and schedule follow-up',
      urgency: 'medium',
      timeline: 'within 24 hours'
    };
  } else if (score >= 20) {
    return {
      action: 'automated_nurture',
      description: 'Add to automated email sequence',
      urgency: 'low',
      timeline: 'within 48 hours'
    };
  } else {
    return {
      action: 'disqualify_or_long_term',
      description: 'Consider disqualifying or moving to long-term nurture',
      urgency: 'low',
      timeline: 'review in 1 week'
    };
  }
};

/**
 * Batch score multiple leads
 */
export const batchScoreLeads = (leads, additionalDataMap = {}, customRules = null) => {
  return leads.map(lead => {
    const additionalData = additionalDataMap[lead.id] || {};
    const scoringData = getScoringBreakdown(lead, additionalData, customRules);

    return {
      ...lead,
      score: scoringData.totalScore,
      grade: scoringData.grade,
      scoringLabel: scoringData.label,
      suggestedPriority: scoringData.priority,
      scoringBreakdown: scoringData.breakdown,
      recommendedAction: getRecommendedAction(scoringData.totalScore, lead),
      lastScored: new Date().toISOString()
    };
  });
};

export default {
  DEFAULT_SCORING_RULES,
  SOURCE_MULTIPLIERS,
  calculateLeadScore,
  getLeadGrade,
  getScoringBreakdown,
  calculateScoreDecay,
  getRecommendedAction,
  batchScoreLeads,
  calculateDemographicScore,
  calculateEngagementScore,
  calculateBehaviorScore,
  calculateFitScore
};
