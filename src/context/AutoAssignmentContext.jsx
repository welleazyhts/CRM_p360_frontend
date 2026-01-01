import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ASSIGNMENT_STRATEGIES,
  AGENT_SKILLS,
  autoAssignEntity,
  batchAutoAssign,
  calculateAgentWorkload,
  getAvailableAgents
} from '../services/autoAssignmentService';
import settingsService from '../services/autoAssignmentSettingsService';

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
  const [config, setConfig] = useState({
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
  });

  // Agents state - will be loaded from API
  const [agents, setAgents] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assignment history
  const [assignmentHistory, setAssignmentHistory] = useState(() => {
    const saved = localStorage.getItem('assignmentHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Last assigned index for round-robin
  const [lastAssignedIndex, setLastAssignedIndex] = useState(0);

  // Load settings and agents from backend on mount
  useEffect(() => {
    loadSettingsFromBackend();
  }, []);

  const loadSettingsFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use the default config since there's no GET endpoint for settings
      // The agents will be managed through the API
      // If backend returns settings in the future, we can fetch them here

      // Note: The backend doesn't have a GET endpoint for agents list yet
      // We'll start with empty array and agents will be added through the UI
      setAgents([]);

    } catch (err) {
      console.error('Error loading settings from backend:', err);
      setError(err.message);
      // Keep default config on error
    } finally {
      setLoading(false);
    }
  };



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
  const updateConfig = useCallback(async (updates) => {
    try {
      const newConfig = { ...config, ...updates };
      // Update local state immediately
      setConfig(newConfig);
      // Call backend API
      await settingsService.updateSettings(newConfig);
    } catch (error) {
      console.error('Error updating config:', error);
      // Could revert state here if needed
      throw error;
    }
  }, [config]);

  /**
   * Update strategy for entity type
   */
  const updateStrategyForType = useCallback(async (entityType, strategy) => {
    try {
      const newStrategies = {
        ...config.strategies,
        [entityType]: strategy
      };

      // Update local state
      setConfig(prev => ({
        ...prev,
        strategies: newStrategies
      }));

      // Call backend API
      await settingsService.updateStrategies([
        { entity_type: entityType, strategy }
      ]);
    } catch (error) {
      console.error('Error updating strategy:', error);
      throw error;
    }
  }, [config]);

  /**
   * Add or update agent
   */
  const upsertAgent = useCallback(async (agent) => {
    try {
      const isUpdate = agents.some(a => a.id === agent.id);

      const agentData = {
        agent_id: agent.id,
        name: agent.name,
        email: agent.email,
        skills: agent.skills || [],
        territory: agent.territory || [],
        performance_tier: agent.performanceTier || 'average',
        max_capacity: agent.maxCapacity || 50
      };

      if (isUpdate) {
        // Update existing agent
        // Exclude ID fields for update to avoid redundancy/conflicts
        const { id, agent_id, ...updateData } = agentData;

        await settingsService.updateAgent(agent.id, updateData);

        // Update local state
        setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, ...agent } : a));
      } else {
        // Create new agent
        await settingsService.createAgent(agentData);

        // Add to local state
        setAgents(prev => [...prev, agent]);
      }
    } catch (error) {
      console.error('Error upserting agent:', error);
      alert('Failed to save agent: ' + error.message);
      throw error;
    }
  }, [agents]);

  /**
   * Remove agent
   */
  const removeAgent = useCallback(async (agentId) => {
    try {
      // Call backend API
      await settingsService.deleteAgent(agentId);

      // Update local state
      setAgents(prev => prev.filter(a => a.id !== agentId));
    } catch (error) {
      console.error('Error removing agent:', error);
      alert('Failed to delete agent: ' + error.message);
      throw error;
    }
  }, []);

  /**
   * Toggle agent active status
   */
  const toggleAgentActive = useCallback(async (agentId) => {
    try {
      // Call backend API
      await settingsService.toggleAgentActivation(agentId);

      // Update local state
      setAgents(prev => prev.map(a =>
        a.id === agentId ? { ...a, active: !a.active, status: !a.active ? 'active' : 'inactive' } : a
      ));
    } catch (error) {
      console.error('Error toggling agent status:', error);
      alert('Failed to toggle agent status: ' + error.message);
      throw error;
    }
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
  const exportConfiguration = useCallback(async () => {
    try {
      const blob = await settingsService.exportSettings();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `auto-assignment-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting configuration:', error);
      alert('Failed to export configuration: ' + error.message);
      throw error;
    }
  }, []);

  /**
   * Import configuration and agents
   */
  const importConfiguration = useCallback(async (data) => {
    try {
      // Call backend API
      await settingsService.importSettings(data);

      // Update local state
      if (data.config) setConfig(data.config);
      if (data.agents) setAgents(data.agents);

      // Reload from backend to ensure sync
      await loadSettingsFromBackend();

      return { success: true };
    } catch (error) {
      console.error('Error importing configuration:', error);
      alert('Failed to import configuration: ' + error.message);
      throw error;
    }
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
