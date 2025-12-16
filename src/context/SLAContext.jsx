import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import slaAPI from '../services/slaAPI';

const SLAContext = createContext();

export const useSLA = () => {
  const context = useContext(SLAContext);
  if (!context) {
    throw new Error('useSLA must be used within SLAProvider');
  }
  return context;
};

export const SLAProvider = ({ children }) => {
  // State
  const [templates, setTemplates] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [violations, setViolations] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all templates
   */
  const fetchTemplates = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.templates.getAll(filters);
      setTemplates(response.results || response.data || response);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching templates:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all policies
   */
  const fetchPolicies = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.getAll(filters);
      setPolicies(response.results || response.data || response);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching policies:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all violations
   */
  const fetchViolations = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.violations.getAll(filters);
      setViolations(response.results || response.data || response);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching violations:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all escalations
   */
  const fetchEscalations = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.escalations.getAll(filters);
      setEscalations(response.results || response.data || response);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching escalations:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch dashboard data
   */
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.analytics.getDashboard();
      setDashboardData(response.data);
      return response;
    } catch (err) {
      setError('Backend database error: SLA features unavailable.');
      console.warn('SLA Dashboard failed (likely DB migration issue):', err);
      // Set empty data to prevent UI crash
      setDashboardData({
        policies: [],
        violations: [],
        stats: {},
        trackings: [],
        approaching: [],
        metrics: { total: 0, active: 0, complianceRate: 100, met: 0, breachRate: 0 }
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create template
   */
  const createTemplate = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.templates.create(data);
      await fetchTemplates(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  /**
   * Update template
   */
  const updateTemplate = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.templates.update(id, data);
      await fetchTemplates(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error updating template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  /**
   * Delete template
   */
  const deleteTemplate = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.templates.delete(id);
      await fetchTemplates(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  /**
   * Create policy
   */
  const createPolicy = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.create(data);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error creating policy:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  /**
   * Update policy
   */
  const updatePolicy = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.update(id, data);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error updating policy:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  /**
   * Pause policy
   */
  const pausePolicy = useCallback(async (id, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.pause(id, reason);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error pausing policy:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  /**
   * Resume policy
   */
  const resumePolicy = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.resume(id);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error resuming policy:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  /**
   * Complete policy
   */
  const completePolicy = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.complete(id);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error completing policy:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  /**
   * Reassign policy
   */
  const reassignPolicy = useCallback(async (id, assigneeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.reassign(id, assigneeId);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error reassigning policy:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  /**
   * Get at-risk policies
   */
  const getAtRiskPolicies = useCallback(async (threshold = 80) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.getAtRisk(threshold);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching at-risk policies:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get policies by entity
   */
  const getPoliciesByEntity = useCallback(async (entityType, entityId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.getByEntity(entityType, entityId);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching policies by entity:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get templates by entity type
   */
  const getTemplatesByEntityType = useCallback(async (entityType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.templates.getByEntityType(entityType);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching templates by entity type:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resolve violation
   */
  const resolveViolation = useCallback(async (id, notes = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.violations.resolve(id, notes);
      await fetchViolations(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error resolving violation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchViolations]);

  /**
   * Get unresolved violations
   */
  const getUnresolvedViolations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.violations.getUnresolved();
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching unresolved violations:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get statistics
   */
  const getStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [templateStats, policyStats, violationStats, escalationStats] = await Promise.all([
        slaAPI.templates.getStatistics(),
        slaAPI.policies.getStatistics(),
        slaAPI.violations.getStatistics(),
        slaAPI.escalations.getStatistics()
      ]);

      return {
        templates: templateStats.data,
        policies: policyStats.data,
        violations: violationStats.data,
        escalations: escalationStats.data
      };
    } catch (err) {
      setError(err.message);
      console.error('Error fetching statistics:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Bulk operations
   */
  const bulkToggleTemplates = useCallback(async (templateIds, isActive) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.templates.bulkToggle(templateIds, isActive);
      await fetchTemplates(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error bulk toggling templates:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTemplates]);

  const bulkPausePolicies = useCallback(async (policyIds, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.bulkPause(policyIds, reason);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error bulk pausing policies:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  const bulkResumePolicies = useCallback(async (policyIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.bulkResume(policyIds);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error bulk resuming policies:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  const bulkCompletePolicies = useCallback(async (policyIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await slaAPI.policies.bulkComplete(policyIds);
      await fetchPolicies(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Error bulk completing policies:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPolicies]);

  // Derive helper data for potential missing backend structure
  const slaTrackings = dashboardData?.trackings || dashboardData?.policies || [];
  const metrics = dashboardData?.metrics || dashboardData?.stats || { total: 0, active: 0, complianceRate: 100 };
  const approaching = dashboardData?.approaching || dashboardData?.atRisk || [];

  const value = {
    // State
    templates,
    policies,
    violations, // Note: This comes from fetchViolations state, might differ from dashboardData.violations
    escalations,
    dashboardData,
    loading,
    error,

    // Derived State for Monitoring Dashboard
    slaTrackings,
    metrics,
    approaching,

    // Fetch methods
    fetchTemplates,
    fetchPolicies,
    fetchViolations,
    fetchEscalations,
    fetchDashboard,

    // Template operations
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByEntityType,

    // Policy operations
    createPolicy,
    updatePolicy,
    pausePolicy,
    resumePolicy,
    completePolicy,
    reassignPolicy,
    getAtRiskPolicies,
    getPoliciesByEntity,

    // Violation operations
    resolveViolation,
    getUnresolvedViolations,

    // Statistics
    getStatistics,

    // Bulk operations
    bulkToggleTemplates,
    bulkPausePolicies,
    bulkResumePolicies,
    bulkCompletePolicies
  };

  return <SLAContext.Provider value={value}>{children}</SLAContext.Provider>;
};

export default SLAContext;
