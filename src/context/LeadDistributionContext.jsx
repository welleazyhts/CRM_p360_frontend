import React, { createContext, useContext, useState, useEffect } from 'react';

const LeadDistributionContext = createContext();

export const useLeadDistribution = () => {
  const context = useContext(LeadDistributionContext);
  if (!context) {
    throw new Error('useLeadDistribution must be used within LeadDistributionProvider');
  }
  return context;
};

// Indian States
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman and Nicobar', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep'
];

// Initial Distribution Rules
const INITIAL_RULES = [
  {
    id: 'rule-001',
    name: 'Maharashtra Premium Leads',
    type: 'state-based',
    priority: 1,
    active: true,
    description: 'Distribute Maharashtra premium leads to top performers',
    conditions: {
      states: ['Maharashtra'],
      leadType: 'premium',
      minLeadScore: 80
    },
    distribution: {
      method: 'top-performers', // round-robin, weighted, top-performers
      agents: ['agent-001', 'agent-002'],
      percentageToTopPerformers: 70
    },
    scheduling: {
      workingDays: [1, 2, 3, 4, 5], // Mon-Fri
      workingHours: { start: '09:00', end: '18:00' }
    },
    limits: {
      maxLeadsPerAgent: 50,
      maxLeadsPerDay: 100
    }
  },
  {
    id: 'rule-002',
    name: 'Hindi Speaking Leads',
    type: 'language-based',
    priority: 2,
    active: true,
    description: 'Distribute Hindi speaking leads to Hindi agents',
    conditions: {
      languages: ['Hindi'],
      states: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan']
    },
    distribution: {
      method: 'round-robin',
      agents: ['agent-003', 'agent-004', 'agent-005']
    },
    scheduling: {
      workingDays: [1, 2, 3, 4, 5, 6],
      workingHours: { start: '09:00', end: '18:00' }
    },
    limits: {
      maxLeadsPerAgent: 30,
      maxLeadsPerDay: 150
    }
  },
  {
    id: 'rule-003',
    name: 'Motor Insurance - Two Wheeler',
    type: 'product-based',
    priority: 3,
    active: true,
    description: 'Distribute two-wheeler motor insurance leads',
    conditions: {
      productCategory: 'motor',
      productSubCategory: 'two-wheeler'
    },
    distribution: {
      method: 'weighted',
      agents: [
        { id: 'agent-006', weight: 40 },
        { id: 'agent-007', weight: 35 },
        { id: 'agent-008', weight: 25 }
      ]
    },
    scheduling: {
      workingDays: [1, 2, 3, 4, 5],
      workingHours: { start: '10:00', end: '19:00' }
    },
    limits: {
      maxLeadsPerAgent: 40,
      maxLeadsPerDay: 120
    }
  },
  {
    id: 'rule-004',
    name: 'Tamil Nadu Health Insurance',
    type: 'state-product-based',
    priority: 4,
    active: true,
    description: 'Tamil Nadu health insurance leads to Tamil speaking agents',
    conditions: {
      states: ['Tamil Nadu'],
      productCategory: 'health',
      languages: ['Tamil', 'English']
    },
    distribution: {
      method: 'round-robin',
      agents: ['agent-009', 'agent-010']
    },
    scheduling: {
      workingDays: [1, 2, 3, 4, 5, 6],
      workingHours: { start: '09:00', end: '18:00' }
    },
    limits: {
      maxLeadsPerAgent: 35,
      maxLeadsPerDay: 70
    }
  }
];

export const LeadDistributionProvider = ({ children }) => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('leadDistributionRules');
    if (saved) {
      setRules(JSON.parse(saved));
    } else {
      setRules(INITIAL_RULES);
      localStorage.setItem('leadDistributionRules', JSON.stringify(INITIAL_RULES));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (rules.length > 0) {
      localStorage.setItem('leadDistributionRules', JSON.stringify(rules));
    }
  }, [rules]);

  // ============ RULE FUNCTIONS ============

  const addRule = (ruleData) => {
    const newRule = {
      ...ruleData,
      id: `rule-${Date.now()}`
    };
    setRules(prev => [...prev, newRule].sort((a, b) => a.priority - b.priority));
    return { success: true, rule: newRule };
  };

  const updateRule = (ruleId, updates) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ).sort((a, b) => a.priority - b.priority));
    return { success: true };
  };

  const deleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
      return { success: true };
    }
    return { success: false };
  };

  const toggleRule = (ruleId) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
    return { success: true };
  };

  const reorderRules = (newOrder) => {
    const reorderedRules = newOrder.map((rule, index) => ({
      ...rule,
      priority: index + 1
    }));
    setRules(reorderedRules);
    return { success: true };
  };

  const duplicateRule = (ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      const duplicated = {
        ...rule,
        id: `rule-${Date.now()}`,
        name: `${rule.name} (Copy)`,
        active: false,
        priority: rules.length + 1
      };
      setRules(prev => [...prev, duplicated]);
      return { success: true, rule: duplicated };
    }
    return { success: false, error: 'Rule not found' };
  };

  // ============ QUERY FUNCTIONS ============

  const getRuleById = (ruleId) => {
    return rules.find(rule => rule.id === ruleId);
  };

  const getRulesByType = (type) => {
    return rules.filter(rule => rule.type === type);
  };

  const getActiveRules = () => {
    return rules.filter(rule => rule.active).sort((a, b) => a.priority - b.priority);
  };

  // ============ DISTRIBUTION SIMULATION ============

  const simulateDistribution = (leadData) => {
    // Simulate which rule would apply to this lead
    const applicableRules = getActiveRules().filter(rule => {
      const { conditions } = rule;

      // Check state
      if (conditions.states && !conditions.states.includes(leadData.state)) {
        return false;
      }

      // Check language
      if (conditions.languages && !conditions.languages.includes(leadData.language)) {
        return false;
      }

      // Check product
      if (conditions.productCategory && conditions.productCategory !== leadData.productCategory) {
        return false;
      }

      // Check lead type
      if (conditions.leadType && conditions.leadType !== leadData.leadType) {
        return false;
      }

      // Check lead score
      if (conditions.minLeadScore && leadData.leadScore < conditions.minLeadScore) {
        return false;
      }

      return true;
    });

    if (applicableRules.length > 0) {
      const selectedRule = applicableRules[0]; // Highest priority
      return {
        success: true,
        rule: selectedRule,
        assignedAgent: selectAgentByDistributionMethod(selectedRule)
      };
    }

    return {
      success: false,
      message: 'No matching rule found. Lead will be distributed using default logic.'
    };
  };

  const selectAgentByDistributionMethod = (rule) => {
    const { method, agents } = rule.distribution;

    if (method === 'round-robin') {
      // Simple round-robin simulation
      const index = Math.floor(Math.random() * agents.length);
      return agents[index];
    } else if (method === 'weighted') {
      // Weighted random selection
      const totalWeight = agents.reduce((sum, agent) => sum + (agent.weight || 1), 0);
      let random = Math.random() * totalWeight;

      for (const agent of agents) {
        random -= agent.weight || 1;
        if (random <= 0) {
          return agent.id || agent;
        }
      }
      return agents[0].id || agents[0];
    } else if (method === 'top-performers') {
      // Randomly select from top performers
      const index = Math.floor(Math.random() * agents.length);
      return agents[index];
    }

    return agents[0];
  };

  // ============ STATISTICS ============

  const getStatistics = () => {
    return {
      totalRules: rules.length,
      activeRules: rules.filter(r => r.active).length,
      inactiveRules: rules.filter(r => r.active === false).length,
      byType: {
        stateBased: rules.filter(r => r.type === 'state-based').length,
        languageBased: rules.filter(r => r.type === 'language-based').length,
        productBased: rules.filter(r => r.type === 'product-based').length,
        combined: rules.filter(r => r.type === 'state-product-based').length
      },
      totalAgentsCovered: new Set(
        rules.flatMap(r =>
          Array.isArray(r.distribution.agents)
            ? r.distribution.agents.map(a => typeof a === 'object' ? a.id : a)
            : []
        )
      ).size
    };
  };

  const value = {
    // State
    rules,
    loading,
    INDIAN_STATES,

    // Rule Functions
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    reorderRules,
    duplicateRule,
    getRuleById,
    getRulesByType,
    getActiveRules,

    // Distribution
    simulateDistribution,

    // Statistics
    getStatistics
  };

  return (
    <LeadDistributionContext.Provider value={value}>
      {children}
    </LeadDistributionContext.Provider>
  );
};
