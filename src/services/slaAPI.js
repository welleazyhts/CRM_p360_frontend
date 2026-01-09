/**
 * SLA Management API Service
 *
 * Connects to the backend SLA Management API endpoints
 * Base URL: /api/sla-settings/
 */

import { getApiUrl } from './api';

const API_BASE = '/api/sla';
const SETTINGS_BASE = '/api/sla-settings';

/**
 * SLA Settings API
 */
export const slaSettingsAPI = {
  /**
   * Get global SLA settings
   */
  getGlobal: async () => {
    const url = getApiUrl(`${SETTINGS_BASE}/global/`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch global settings');
    return response.json();
  },

  /**
   * Enable/Disable SLA tracking (PATCH global?) - guessing implementation based on getGlobal
   * Using notifications_enable pattern if global supports it, otherwise generic update
   */
  updateGlobal: async (data) => {
    // Note: Postman only showed GET for enable_sla_tracking, but usually toggle needs POST/PATCH
    // Assuming PATCH /global/ similar to notifications
    const url = getApiUrl(`${SETTINGS_BASE}/global/`);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update global settings');
    return response.json();
  },

  /**
   * Get notification settings
   */
  getNotifications: async () => {
    const url = getApiUrl(`${SETTINGS_BASE}/notifications/`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch notification settings');
    return response.json();
  },

  /**
   * Update notification settings
   */
  updateNotifications: async (data) => {
    const url = getApiUrl(`${SETTINGS_BASE}/notifications/`);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update notification settings');
    return response.json();
  },

  /**
   * Get escalation rules
   */
  getEscalationRules: async () => {
    const url = getApiUrl(`${SETTINGS_BASE}/escalation-rules/`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch escalation rules');
    return response.json();
  },

  /**
   * Get advanced settings
   */
  getAdvanced: async () => {
    const url = getApiUrl(`${SETTINGS_BASE}/advanced/`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch advanced settings');
    return response.json();
  },

  /**
   * Execute danger zone action (Reset/Clear)
   */
  dangerZone: async (action) => {
    const url = getApiUrl(`${SETTINGS_BASE}/advanced/danger-zone/`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
    });
    if (!response.ok) throw new Error('Failed to execute danger zone action');
    return response.json();
  }
};

/**
 * SLA Templates API
 */
export const slaTemplatesAPI = {
  /**
   * Get all SLA templates
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${SETTINGS_BASE}/templates/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SLA templates');
    }

    return response.json();
  },

  /**
   * Get single SLA template
   */
  getById: async (id) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SLA template');
    }

    return response.json();
  },

  /**
   * Create SLA template
   */
  create: async (data) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create SLA template');
    }

    return response.json();
  },

  /**
   * Update SLA template
   */
  update: async (id, data) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/${id}/`);

    const response = await fetch(url, {
      method: 'PATCH', // Postman uses PATCH for edit template
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update SLA template');
    }

    return response.json();
  },

  /**
   * Delete SLA template
   */
  delete: async (id) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete SLA template');
    }

    return response.json();
  },

  /**
   * Restore Defaults
   */
  restoreDefaults: async () => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/restore-defaults/`);
    const response = await fetch(url, {
      method: 'GET', // Postman says GET
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to restore default templates');
    return response.json();
  },

  /**
   * Bulk toggle templates
   */
  bulkToggle: async (templateIds, isActive) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/bulk_toggle/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_ids: templateIds,
        is_active: isActive
      })
    });

    if (!response.ok) {
      throw new Error('Failed to toggle templates');
    }

    return response.json();
  },

  /**
   * Set template as default
   */
  setAsDefault: async (id) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/${id}/set_as_default/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to set template as default');
    }

    return response.json();
  },

  /**
   * Get templates by entity type
   */
  getByEntityType: async (entityType) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/by_entity_type/?entity_type=${entityType}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch templates by entity type');
    }

    return response.json();
  },

  /**
   * Get template statistics
   */
  getStatistics: async () => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/statistics/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch template statistics');
    }

    return response.json();
  },

  /**
   * Duplicate template
   */
  duplicate: async (templateId, newName) => {
    const url = getApiUrl(`${SETTINGS_BASE}/templates/duplicate/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: templateId,
        name: newName
      })
    });

    if (!response.ok) {
      throw new Error('Failed to duplicate template');
    }

    return response.json();
  }
};

/**
 * SLA Policies API
 */
export const slaPoliciesAPI = {
  /**
   * Get all SLA policies
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/policies/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SLA policies');
    }

    return response.json();
  },

  /**
   * Get single SLA policy
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/policies/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch SLA policy');
    }

    return response.json();
  },

  /**
   * Create SLA policy
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/policies/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create SLA policy');
    }

    return response.json();
  },

  /**
   * Update SLA policy
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/policies/${id}/`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update SLA policy');
    }

    return response.json();
  },

  /**
   * Pause SLA policy
   */
  pause: async (id, reason = '') => {
    const url = getApiUrl(`${API_BASE}/policies/${id}/pause/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to pause SLA policy');
    }

    return response.json();
  },

  /**
   * Resume SLA policy
   */
  resume: async (id) => {
    const url = getApiUrl(`${API_BASE}/policies/${id}/resume/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resume SLA policy');
    }

    return response.json();
  },

  /**
   * Complete SLA policy
   */
  complete: async (id) => {
    const url = getApiUrl(`${API_BASE}/policies/${id}/complete/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to complete SLA policy');
    }

    return response.json();
  },

  /**
   * Reassign SLA policy
   */
  reassign: async (id, assigneeId) => {
    const url = getApiUrl(`${API_BASE}/policies/${id}/reassign/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assignee_id: assigneeId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reassign SLA policy');
    }

    return response.json();
  },

  /**
   * Bulk pause policies
   */
  bulkPause: async (policyIds, reason = '') => {
    const url = getApiUrl(`${API_BASE}/policies/bulk_pause/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        policy_ids: policyIds,
        reason
      })
    });

    if (!response.ok) {
      throw new Error('Failed to bulk pause policies');
    }

    return response.json();
  },

  /**
   * Bulk resume policies
   */
  bulkResume: async (policyIds) => {
    const url = getApiUrl(`${API_BASE}/policies/bulk_resume/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        policy_ids: policyIds
      })
    });

    if (!response.ok) {
      throw new Error('Failed to bulk resume policies');
    }

    return response.json();
  },

  /**
   * Bulk complete policies
   */
  bulkComplete: async (policyIds) => {
    const url = getApiUrl(`${API_BASE}/policies/bulk_complete/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        policy_ids: policyIds
      })
    });

    if (!response.ok) {
      throw new Error('Failed to bulk complete policies');
    }

    return response.json();
  },

  /**
   * Get at-risk policies
   */
  getAtRisk: async (threshold = 80) => {
    const url = getApiUrl(`${API_BASE}/policies/at_risk/?threshold=${threshold}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch at-risk policies');
    }

    return response.json();
  },

  /**
   * Get policies by entity
   */
  getByEntity: async (entityType, entityId) => {
    const url = getApiUrl(`${API_BASE}/policies/by_entity/?entity_type=${entityType}&entity_id=${entityId}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch policies by entity');
    }

    return response.json();
  },

  /**
   * Get policy statistics
   */
  getStatistics: async () => {
    const url = getApiUrl(`${API_BASE}/policies/statistics/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch policy statistics');
    }

    return response.json();
  }
};

/**
 * SLA Violations API
 */
export const slaViolationsAPI = {
  /**
   * Get all violations
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/violations/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch violations');
    }

    return response.json();
  },

  /**
   * Get violation by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/violations/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch violation');
    }

    return response.json();
  },

  /**
   * Resolve violation
   */
  resolve: async (id, notes = '') => {
    const url = getApiUrl(`${API_BASE}/violations/${id}/resolve/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    });

    if (!response.ok) {
      throw new Error('Failed to resolve violation');
    }

    return response.json();
  },

  /**
   * Get unresolved violations
   */
  getUnresolved: async () => {
    const url = getApiUrl(`${API_BASE}/violations/unresolved/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unresolved violations');
    }

    return response.json();
  },

  /**
   * Get violation statistics
   */
  getStatistics: async () => {
    const url = getApiUrl(`${API_BASE}/violations/statistics/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch violation statistics');
    }

    return response.json();
  }
};

/**
 * SLA Escalations API
 */
export const slaEscalationsAPI = {
  /**
   * Get all escalations
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/escalations/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch escalations');
    }

    return response.json();
  },

  /**
   * Execute escalation
   */
  execute: async (id) => {
    const url = getApiUrl(`${API_BASE}/escalations/${id}/execute/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to execute escalation');
    }

    return response.json();
  },

  /**
   * Get pending escalations
   */
  getPending: async () => {
    const url = getApiUrl(`${API_BASE}/escalations/pending/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pending escalations');
    }

    return response.json();
  },

  /**
   * Get escalation statistics
   */
  getStatistics: async () => {
    const url = getApiUrl(`${API_BASE}/escalations/statistics/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch escalation statistics');
    }

    return response.json();
  }
};

/**
 * SLA Analytics API
 */
export const slaAnalyticsAPI = {
  /**
   * Get analytics data
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/analytics/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  },

  /**
   * Get dashboard data
   */
  getDashboard: async () => {
    const url = getApiUrl(`${API_BASE}/analytics/dashboard/`);
    const token = localStorage.getItem('authToken');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
  }
};

// Export all APIs
export default {
  settings: slaSettingsAPI,
  templates: slaTemplatesAPI,
  policies: slaPoliciesAPI,
  violations: slaViolationsAPI,
  escalations: slaEscalationsAPI,
  analytics: slaAnalyticsAPI
};
