/**
 * SLA Service - Business Logic for SLA Tracking
 * Handles SLA calculations, violations, and compliance tracking
 */

/**
 * SLA Service - Business Logic for SLA Tracking
 * Handles SLA calculations, violations, and compliance tracking
 */

// SLA_TEMPLATES removed - fetched from API

/**
 * SLA Priority Multipliers
 */

/**
 * SLA Priority Multipliers
 */
export const PRIORITY_MULTIPLIERS = {
  urgent: 0.5,   // 50% of standard time
  high: 0.75,    // 75% of standard time
  medium: 1.0,   // 100% standard time
  low: 1.5       // 150% of standard time
};

/**
 * Calculate SLA deadline from start time
 */
export const calculateSLADeadline = (startTime, slaConfig, priority = 'medium') => {
  const start = new Date(startTime);
  const multiplier = PRIORITY_MULTIPLIERS[priority.toLowerCase()] || 1.0;

  let deadlineMs = start.getTime();

  if (slaConfig.hours) {
    deadlineMs += slaConfig.hours * 60 * 60 * 1000 * multiplier;
  } else if (slaConfig.days) {
    deadlineMs += slaConfig.days * 24 * 60 * 60 * 1000 * multiplier;
  } else if (slaConfig.minutes) {
    deadlineMs += slaConfig.minutes * 60 * 1000 * multiplier;
  }

  return new Date(deadlineMs);
};

/**
 * Calculate time remaining until SLA breach
 */
export const calculateTimeRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();

  if (diffMs < 0) {
    return {
      expired: true,
      overdue: true,
      milliseconds: Math.abs(diffMs),
      hours: Math.abs(Math.floor(diffMs / (1000 * 60 * 60))),
      minutes: Math.abs(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))),
      formatted: 'Overdue'
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let formatted = '';
  if (days > 0) formatted += `${days}d `;
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0 || (!days && !hours)) formatted += `${minutes}m`;

  return {
    expired: false,
    overdue: false,
    milliseconds: diffMs,
    days,
    hours,
    minutes,
    formatted: formatted.trim()
  };
};

/**
 * Get SLA status based on time remaining
 */
export const getSLAStatus = (deadline) => {
  const timeRemaining = calculateTimeRemaining(deadline);

  if (timeRemaining.overdue) {
    return {
      status: 'breached',
      color: '#d32f2f',
      label: 'SLA Breached',
      severity: 'critical'
    };
  }

  const percentRemaining = (timeRemaining.milliseconds / (new Date(deadline).getTime() - new Date().getTime() + timeRemaining.milliseconds)) * 100;

  if (percentRemaining < 10) {
    return {
      status: 'critical',
      color: '#f44336',
      label: 'Critical - < 10% time left',
      severity: 'high'
    };
  } else if (percentRemaining < 25) {
    return {
      status: 'warning',
      color: '#ff9800',
      label: 'Warning - < 25% time left',
      severity: 'medium'
    };
  } else if (percentRemaining < 50) {
    return {
      status: 'approaching',
      color: '#ffc107',
      label: 'Approaching deadline',
      severity: 'low'
    };
  } else {
    return {
      status: 'on-track',
      color: '#4caf50',
      label: 'On Track',
      severity: 'none'
    };
  }
};

/**
 * Calculate SLA compliance percentage
 */
export const calculateSLACompliance = (items) => {
  if (!items || items.length === 0) return 100;

  const completedWithinSLA = items.filter(item => {
    if (!item.completedAt || !item.slaDeadline) return false;
    return new Date(item.completedAt) <= new Date(item.slaDeadline);
  }).length;

  const total = items.filter(item => item.completedAt).length;

  return total > 0 ? Math.round((completedWithinSLA / total) * 100) : 100;
};

/**
 * Get SLA violations
 */
export const getSLAViolations = (items) => {
  return items.filter(item => {
    if (!item.slaDeadline) return false;

    // If completed, check if it was completed after deadline
    if (item.completedAt) {
      return new Date(item.completedAt) > new Date(item.slaDeadline);
    }

    // If not completed, check if deadline has passed
    return new Date() > new Date(item.slaDeadline);
  });
};

/**
 * Get items approaching SLA deadline
 */
export const getApproachingSLA = (items, threshold = 25) => {
  return items.filter(item => {
    if (!item.slaDeadline || item.completedAt) return false;

    const timeRemaining = calculateTimeRemaining(item.slaDeadline);
    if (timeRemaining.overdue) return false;

    const totalTime = new Date(item.slaDeadline).getTime() - new Date(item.createdAt).getTime();
    const percentRemaining = (timeRemaining.milliseconds / totalTime) * 100;

    return percentRemaining < threshold;
  });
};

/**
 * Create SLA tracking object for an entity
 */
export const createSLATracking = (entityType, entityId, slaType, startTime, priority = 'medium', customConfig = null) => {
  // Use customConfig if provided, otherwise the caller must ensure config is passed. 
  // We removed SLA_TEMPLATES hardcoded fallback.
  const config = customConfig;

  if (!config) {
    // Return minimal tracking object or throw error. 
    // Throwing error is safer to detect missing config issues.
    throw new Error(`SLA configuration missing for ${entityType}.${slaType}. Please pass config implicitly.`);
  }

  const deadline = calculateSLADeadline(startTime, config, priority);

  return {
    id: `sla_${entityType}_${entityId}_${slaType}_${Date.now()}`,
    entityType,
    entityId,
    slaType,
    description: config.description || 'SLA Tracking',
    startTime,
    deadline,
    priority,
    status: 'active',
    createdAt: new Date().toISOString(),
    completedAt: null,
    breached: false,
    config
  };
};

/**
 * Mark SLA as completed
 */
export const completeSLA = (slaTracking) => {
  const completedAt = new Date();
  const deadline = new Date(slaTracking.deadline);
  const breached = completedAt > deadline;

  return {
    ...slaTracking,
    completedAt: completedAt.toISOString(),
    status: breached ? 'breached' : 'met',
    breached,
    completionTime: completedAt.getTime() - new Date(slaTracking.startTime).getTime()
  };
};

/**
 * Get SLA metrics for reporting
 */
export const getSLAMetrics = (slaTrackings) => {
  const total = slaTrackings.length;
  const completed = slaTrackings.filter(s => s.completedAt).length;
  const met = slaTrackings.filter(s => s.status === 'met').length;
  const breached = slaTrackings.filter(s => s.breached).length;
  const active = slaTrackings.filter(s => s.status === 'active').length;

  const activeWithDeadline = slaTrackings.filter(s => s.status === 'active' && s.deadline);
  const atRisk = activeWithDeadline.filter(s => {
    const slaStatus = getSLAStatus(s.deadline);
    return ['critical', 'warning'].includes(slaStatus.status);
  }).length;

  return {
    total,
    completed,
    met,
    breached,
    active,
    atRisk,
    complianceRate: completed > 0 ? Math.round((met / completed) * 100) : 100,
    breachRate: completed > 0 ? Math.round((breached / completed) * 100) : 0
  };
};

/**
 * Get escalation level based on SLA status
 */
export const getEscalationLevel = (slaTracking) => {
  if (!slaTracking.deadline) return null;

  const timeRemaining = calculateTimeRemaining(slaTracking.deadline);

  if (timeRemaining.overdue) {
    if (timeRemaining.hours > 24) {
      return { level: 3, description: 'Critical - Escalate to senior management', urgent: true };
    } else if (timeRemaining.hours > 4) {
      return { level: 2, description: 'High - Escalate to manager', urgent: true };
    } else {
      return { level: 1, description: 'Moderate - Escalate to team lead', urgent: false };
    }
  }

  const slaStatus = getSLAStatus(slaTracking.deadline);
  if (slaStatus.status === 'critical') {
    return { level: 1, description: 'Alert - Requires immediate attention', urgent: false };
  }

  return null;
};

export default {
  // SLA_TEMPLATES, // Removed
  PRIORITY_MULTIPLIERS,
  calculateSLADeadline,
  calculateTimeRemaining,
  getSLAStatus,
  calculateSLACompliance,
  getSLAViolations,
  getApproachingSLA,
  createSLATracking,
  completeSLA,
  getSLAMetrics,
  getEscalationLevel
};
