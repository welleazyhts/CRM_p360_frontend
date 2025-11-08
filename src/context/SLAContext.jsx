import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SLA_TEMPLATES,
  createSLATracking,
  completeSLA,
  getSLAStatus,
  getSLAViolations,
  getApproachingSLA,
  getSLAMetrics,
  calculateTimeRemaining,
  getEscalationLevel
} from '../services/slaService';

const SLAContext = createContext();

export const useSLA = () => {
  const context = useContext(SLAContext);
  if (!context) {
    throw new Error('useSLA must be used within SLAProvider');
  }
  return context;
};

export const SLAProvider = ({ children }) => {
  // SLA Configuration State
  const [slaConfig, setSLAConfig] = useState(() => {
    const saved = localStorage.getItem('slaConfig');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      templates: SLA_TEMPLATES,
      notifications: {
        enabled: true,
        warning: 25, // Notify when 25% time remaining
        critical: 10, // Critical alert when 10% time remaining
        breach: true // Notify on breach
      },
      escalation: {
        enabled: true,
        levels: [
          { threshold: 10, action: 'notify_team_lead', description: 'Notify team lead' },
          { threshold: 0, action: 'notify_manager', description: 'Notify manager' },
          { threshold: -24, action: 'notify_senior_management', description: 'Escalate to senior management' }
        ]
      },
      autoAssignment: {
        enabled: false,
        considerSLA: true // Consider SLA workload when auto-assigning
      }
    };
  });

  // SLA Trackings State (in real app, this would be from backend)
  const [slaTrackings, setSLATrackings] = useState(() => {
    const saved = localStorage.getItem('slaTrackings');
    return saved ? JSON.parse(saved) : [];
  });

  // Violations and alerts state
  const [violations, setViolations] = useState([]);
  const [approaching, setApproaching] = useState([]);
  const [metrics, setMetrics] = useState(null);

  // Save configuration to localStorage
  useEffect(() => {
    localStorage.setItem('slaConfig', JSON.stringify(slaConfig));
  }, [slaConfig]);

  // Save trackings to localStorage
  useEffect(() => {
    localStorage.setItem('slaTrackings', JSON.stringify(slaTrackings));
  }, [slaTrackings]);

  // Calculate metrics, violations, and approaching deadlines
  useEffect(() => {
    if (slaTrackings.length > 0) {
      setViolations(getSLAViolations(slaTrackings));
      setApproaching(getApproachingSLA(slaTrackings, slaConfig.notifications.warning));
      setMetrics(getSLAMetrics(slaTrackings));
    } else {
      setViolations([]);
      setApproaching([]);
      setMetrics({
        total: 0,
        completed: 0,
        met: 0,
        breached: 0,
        active: 0,
        atRisk: 0,
        complianceRate: 100,
        breachRate: 0
      });
    }
  }, [slaTrackings, slaConfig.notifications.warning]);

  /**
   * Create new SLA tracking
   */
  const trackSLA = useCallback((entityType, entityId, slaType, priority = 'medium', startTime = null) => {
    try {
      const tracking = createSLATracking(
        entityType,
        entityId,
        slaType,
        startTime || new Date().toISOString(),
        priority,
        slaConfig.templates[entityType]?.[slaType]
      );

      setSLATrackings(prev => [...prev, tracking]);
      return tracking;
    } catch (error) {
      console.error('Error creating SLA tracking:', error);
      return null;
    }
  }, [slaConfig.templates]);

  /**
   * Complete SLA tracking
   */
  const completeSLATracking = useCallback((trackingId) => {
    setSLATrackings(prev => prev.map(tracking => {
      if (tracking.id === trackingId && tracking.status === 'active') {
        return completeSLA(tracking);
      }
      return tracking;
    }));
  }, []);

  /**
   * Update SLA tracking
   */
  const updateSLATracking = useCallback((trackingId, updates) => {
    setSLATrackings(prev => prev.map(tracking => {
      if (tracking.id === trackingId) {
        return { ...tracking, ...updates };
      }
      return tracking;
    }));
  }, []);

  /**
   * Delete SLA tracking
   */
  const deleteSLATracking = useCallback((trackingId) => {
    setSLATrackings(prev => prev.filter(tracking => tracking.id !== trackingId));
  }, []);

  /**
   * Get SLA trackings for specific entity
   */
  const getSLATrackingsForEntity = useCallback((entityType, entityId) => {
    return slaTrackings.filter(t => t.entityType === entityType && t.entityId === entityId);
  }, [slaTrackings]);

  /**
   * Get active SLA trackings
   */
  const getActiveSLATrackings = useCallback(() => {
    return slaTrackings.filter(t => t.status === 'active');
  }, [slaTrackings]);

  /**
   * Update SLA configuration
   */
  const updateSLAConfig = useCallback((updates) => {
    setSLAConfig(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Update SLA templates
   */
  const updateSLATemplates = useCallback((entityType, slaType, config) => {
    setSLAConfig(prev => ({
      ...prev,
      templates: {
        ...prev.templates,
        [entityType]: {
          ...prev.templates[entityType],
          [slaType]: config
        }
      }
    }));
  }, []);

  /**
   * Get SLA status for tracking
   */
  const getSLATrackingStatus = useCallback((trackingId) => {
    const tracking = slaTrackings.find(t => t.id === trackingId);
    if (!tracking || !tracking.deadline) return null;
    return getSLAStatus(tracking.deadline);
  }, [slaTrackings]);

  /**
   * Get time remaining for tracking
   */
  const getTimeRemainingForTracking = useCallback((trackingId) => {
    const tracking = slaTrackings.find(t => t.id === trackingId);
    if (!tracking || !tracking.deadline) return null;
    return calculateTimeRemaining(tracking.deadline);
  }, [slaTrackings]);

  /**
   * Get escalation info for tracking
   */
  const getTrackingEscalation = useCallback((trackingId) => {
    const tracking = slaTrackings.find(t => t.id === trackingId);
    if (!tracking) return null;
    return getEscalationLevel(tracking);
  }, [slaTrackings]);

  /**
   * Clear all SLA trackings (for testing/reset)
   */
  const clearAllSLATrackings = useCallback(() => {
    setSLATrackings([]);
    localStorage.removeItem('slaTrackings');
  }, []);

  /**
   * Get SLA compliance by entity type
   */
  const getComplianceByEntityType = useCallback((entityType) => {
    const entityTrackings = slaTrackings.filter(t => t.entityType === entityType);
    return getSLAMetrics(entityTrackings);
  }, [slaTrackings]);

  /**
   * Get SLA compliance by SLA type
   */
  const getComplianceBySLAType = useCallback((slaType) => {
    const typeTrackings = slaTrackings.filter(t => t.slaType === slaType);
    return getSLAMetrics(typeTrackings);
  }, [slaTrackings]);

  /**
   * Export SLA data
   */
  const exportSLAData = useCallback((startDate, endDate) => {
    let filteredTrackings = slaTrackings;

    if (startDate) {
      filteredTrackings = filteredTrackings.filter(t =>
        new Date(t.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredTrackings = filteredTrackings.filter(t =>
        new Date(t.createdAt) <= new Date(endDate)
      );
    }

    return {
      trackings: filteredTrackings,
      metrics: getSLAMetrics(filteredTrackings),
      violations: getSLAViolations(filteredTrackings),
      exportDate: new Date().toISOString()
    };
  }, [slaTrackings]);

  const value = {
    // Configuration
    slaConfig,
    updateSLAConfig,
    updateSLATemplates,

    // Trackings
    slaTrackings,
    trackSLA,
    completeSLATracking,
    updateSLATracking,
    deleteSLATracking,
    getSLATrackingsForEntity,
    getActiveSLATrackings,
    clearAllSLATrackings,

    // Status and Info
    getSLATrackingStatus,
    getTimeRemainingForTracking,
    getTrackingEscalation,

    // Metrics and Reporting
    metrics,
    violations,
    approaching,
    getComplianceByEntityType,
    getComplianceBySLAType,
    exportSLAData
  };

  return <SLAContext.Provider value={value}>{children}</SLAContext.Provider>;
};

export default SLAContext;
