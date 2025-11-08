import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_SCORING_RULES,
  calculateLeadScore,
  getLeadGrade,
  getScoringBreakdown,
  getRecommendedAction,
  batchScoreLeads
} from '../services/leadScoringService';

const LeadScoringContext = createContext();

export const useLeadScoring = () => {
  const context = useContext(LeadScoringContext);
  if (!context) {
    throw new Error('useLeadScoring must be used within LeadScoringProvider');
  }
  return context;
};

export const LeadScoringProvider = ({ children }) => {
  // Scoring configuration
  const [scoringConfig, setScoringConfig] = useState(() => {
    const saved = localStorage.getItem('leadScoringConfig');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      autoScore: true, // Automatically score new leads
      rules: DEFAULT_SCORING_RULES,
      rescoreInterval: 7, // Re-score leads every 7 days
      decayEnabled: true, // Enable score decay over time
      thresholds: {
        hot: 80,
        warm: 60,
        qualified: 40,
        cold: 20
      }
    };
  });

  // Lead scores cache
  const [leadScores, setLeadScores] = useState(() => {
    const saved = localStorage.getItem('leadScores');
    return saved ? JSON.parse(saved) : {};
  });

  // Additional data for scoring (engagement, behavior, fit)
  const [leadAdditionalData, setLeadAdditionalData] = useState(() => {
    const saved = localStorage.getItem('leadAdditionalData');
    return saved ? JSON.parse(saved) : {};
  });

  // Save configuration to localStorage
  useEffect(() => {
    localStorage.setItem('leadScoringConfig', JSON.stringify(scoringConfig));
  }, [scoringConfig]);

  // Save scores to localStorage
  useEffect(() => {
    localStorage.setItem('leadScores', JSON.stringify(leadScores));
  }, [leadScores]);

  // Save additional data to localStorage
  useEffect(() => {
    localStorage.setItem('leadAdditionalData', JSON.stringify(leadAdditionalData));
  }, [leadAdditionalData]);

  /**
   * Score a single lead
   */
  const scoreLead = useCallback((lead, additionalData = null) => {
    if (!scoringConfig.enabled) return null;

    const data = additionalData || leadAdditionalData[lead.id] || {};
    const scoringResult = getScoringBreakdown(lead, data, scoringConfig.rules);

    const scoreData = {
      leadId: lead.id,
      score: scoringResult.totalScore,
      grade: scoringResult.grade,
      label: scoringResult.label,
      priority: scoringResult.priority,
      breakdown: scoringResult.breakdown,
      recommendedAction: getRecommendedAction(scoringResult.totalScore, lead),
      scoredAt: new Date().toISOString(),
      sourceMultiplier: scoringResult.sourceMultiplier
    };

    setLeadScores(prev => ({
      ...prev,
      [lead.id]: scoreData
    }));

    return scoreData;
  }, [scoringConfig, leadAdditionalData]);

  /**
   * Score multiple leads
   */
  const scoreMultipleLeads = useCallback((leads) => {
    if (!scoringConfig.enabled) return [];

    const scoredLeads = batchScoreLeads(leads, leadAdditionalData, scoringConfig.rules);

    const newScores = {};
    scoredLeads.forEach(lead => {
      newScores[lead.id] = {
        leadId: lead.id,
        score: lead.score,
        grade: lead.grade,
        label: lead.scoringLabel,
        priority: lead.suggestedPriority,
        breakdown: lead.scoringBreakdown,
        recommendedAction: lead.recommendedAction,
        scoredAt: lead.lastScored
      };
    });

    setLeadScores(prev => ({
      ...prev,
      ...newScores
    }));

    return scoredLeads;
  }, [scoringConfig, leadAdditionalData]);

  /**
   * Update additional data for a lead
   */
  const updateLeadAdditionalData = useCallback((leadId, dataType, data) => {
    setLeadAdditionalData(prev => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [dataType]: {
          ...prev[leadId]?.[dataType],
          ...data
        }
      }
    }));

    // Auto re-score if enabled
    if (scoringConfig.autoScore) {
      // Note: You would need to fetch the lead data here in a real implementation
      // For now, we'll just mark it as needing rescore
      setLeadScores(prev => ({
        ...prev,
        [leadId]: {
          ...prev[leadId],
          needsRescore: true
        }
      }));
    }
  }, [scoringConfig.autoScore]);

  /**
   * Increment engagement metric
   */
  const incrementEngagement = useCallback((leadId, metric) => {
    setLeadAdditionalData(prev => {
      const current = prev[leadId]?.engagement?.[metric] || 0;
      return {
        ...prev,
        [leadId]: {
          ...prev[leadId],
          engagement: {
            ...prev[leadId]?.engagement,
            [metric]: current + 1
          }
        }
      };
    });

    // Mark for re-scoring
    if (scoringConfig.autoScore) {
      setLeadScores(prev => ({
        ...prev,
        [leadId]: {
          ...prev[leadId],
          needsRescore: true
        }
      }));
    }
  }, [scoringConfig.autoScore]);

  /**
   * Get score for a lead
   */
  const getLeadScore = useCallback((leadId) => {
    return leadScores[leadId] || null;
  }, [leadScores]);

  /**
   * Get all scores
   */
  const getAllScores = useCallback(() => {
    return leadScores;
  }, [leadScores]);

  /**
   * Update scoring configuration
   */
  const updateScoringConfig = useCallback((updates) => {
    setScoringConfig(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Update scoring rules
   */
  const updateScoringRules = useCallback((category, updates) => {
    setScoringConfig(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        [category]: {
          ...prev.rules[category],
          ...updates
        }
      }
    }));
  }, []);

  /**
   * Reset scoring rules to defaults
   */
  const resetScoringRules = useCallback(() => {
    setScoringConfig(prev => ({
      ...prev,
      rules: DEFAULT_SCORING_RULES
    }));
  }, []);

  /**
   * Clear all scores
   */
  const clearAllScores = useCallback(() => {
    setLeadScores({});
    localStorage.removeItem('leadScores');
  }, []);

  /**
   * Clear all additional data
   */
  const clearAllAdditionalData = useCallback(() => {
    setLeadAdditionalData({});
    localStorage.removeItem('leadAdditionalData');
  }, []);

  /**
   * Get leads that need re-scoring
   */
  const getLeadsNeedingRescore = useCallback(() => {
    return Object.values(leadScores)
      .filter(score => score.needsRescore)
      .map(score => score.leadId);
  }, [leadScores]);

  /**
   * Get score distribution
   */
  const getScoreDistribution = useCallback(() => {
    const scores = Object.values(leadScores);
    const distribution = {
      A: 0, // 80-100
      B: 0, // 60-79
      C: 0, // 40-59
      D: 0, // 20-39
      F: 0  // 0-19
    };

    scores.forEach(scoreData => {
      distribution[scoreData.grade] = (distribution[scoreData.grade] || 0) + 1;
    });

    return distribution;
  }, [leadScores]);

  /**
   * Get average score
   */
  const getAverageScore = useCallback(() => {
    const scores = Object.values(leadScores);
    if (scores.length === 0) return 0;

    const total = scores.reduce((sum, scoreData) => sum + scoreData.score, 0);
    return Math.round(total / scores.length);
  }, [leadScores]);

  /**
   * Get top scored leads
   */
  const getTopScoredLeads = useCallback((limit = 10) => {
    return Object.values(leadScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [leadScores]);

  /**
   * Export scoring data
   */
  const exportScoringData = useCallback(() => {
    return {
      config: scoringConfig,
      scores: leadScores,
      additionalData: leadAdditionalData,
      distribution: getScoreDistribution(),
      averageScore: getAverageScore(),
      exportDate: new Date().toISOString()
    };
  }, [scoringConfig, leadScores, leadAdditionalData, getScoreDistribution, getAverageScore]);

  const value = {
    // Configuration
    scoringConfig,
    updateScoringConfig,
    updateScoringRules,
    resetScoringRules,

    // Scoring Operations
    scoreLead,
    scoreMultipleLeads,
    getLeadScore,
    getAllScores,
    clearAllScores,

    // Additional Data
    leadAdditionalData,
    updateLeadAdditionalData,
    incrementEngagement,
    clearAllAdditionalData,

    // Analytics
    getScoreDistribution,
    getAverageScore,
    getTopScoredLeads,
    getLeadsNeedingRescore,

    // Export
    exportScoringData
  };

  return <LeadScoringContext.Provider value={value}>{children}</LeadScoringContext.Provider>;
};

export default LeadScoringContext;
