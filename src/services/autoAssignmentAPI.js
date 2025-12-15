/**
 * Auto-Assignment API Service
 * Connects to backend Auto-Assignment API
 * Base URL: /api/auto-assignment/
 */

import { getApiUrl } from './api';

const API_BASE = '/api/auto-assignment';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('access_token');
};

/**
 * Auto-Assignment Settings API
 */
export const autoAssignmentSettingsAPI = {
  /**
   * Get all settings
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/settings/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch auto-assignment settings');
    }

    return response.json();
  },

  /**
   * Get settings by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/settings/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch auto-assignment setting');
    }

    return response.json();
  },

  /**
   * Create settings
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/settings/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create auto-assignment settings');
    }

    return response.json();
  },

  /**
   * Update settings
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/settings/${id}/`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update auto-assignment settings');
    }

    return response.json();
  },

  /**
   * Delete settings
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/settings/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete auto-assignment settings');
    }

    return response.json();
  }
};

/**
 * Assignment Agents API
 */
export const assignmentAgentsAPI = {
  /**
   * Get all agents
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/agents/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignment agents');
    }

    return response.json();
  },

  /**
   * Get agent by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/agents/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignment agent');
    }

    return response.json();
  },

  /**
   * Create agent
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/agents/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create assignment agent');
    }

    return response.json();
  },

  /**
   * Update agent
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/agents/${id}/`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update assignment agent');
    }

    return response.json();
  },

  /**
   * Delete agent
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/agents/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete assignment agent');
    }

    return response.json();
  }
};

/**
 * Assignment Rules API
 */
export const assignmentRulesAPI = {
  /**
   * Get all rules
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/rules/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignment rules');
    }

    return response.json();
  },

  /**
   * Get rule by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/rules/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignment rule');
    }

    return response.json();
  },

  /**
   * Create rule
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/rules/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create assignment rule');
    }

    return response.json();
  },

  /**
   * Update rule
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/rules/${id}/`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update assignment rule');
    }

    return response.json();
  },

  /**
   * Delete rule
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/rules/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete assignment rule');
    }

    return response.json();
  }
};

/**
 * Reassignment Rules API
 */
export const reassignmentRulesAPI = {
  /**
   * Get all reassignment rules
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/reassignment-rules/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reassignment rules');
    }

    return response.json();
  },

  /**
   * Get reassignment rule by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/reassignment-rules/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reassignment rule');
    }

    return response.json();
  },

  /**
   * Create reassignment rule
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/reassignment-rules/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create reassignment rule');
    }

    return response.json();
  },

  /**
   * Update reassignment rule
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/reassignment-rules/${id}/`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update reassignment rule');
    }

    return response.json();
  },

  /**
   * Delete reassignment rule
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/reassignment-rules/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete reassignment rule');
    }

    return response.json();
  }
};

/**
 * Assignment Logs API
 */
export const assignmentLogsAPI = {
  /**
   * Get all logs
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/logs/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignment logs');
    }

    return response.json();
  },

  /**
   * Get log by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/logs/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignment log');
    }

    return response.json();
  }
};

// Export all APIs
export default {
  settings: autoAssignmentSettingsAPI,
  agents: assignmentAgentsAPI,
  rules: assignmentRulesAPI,
  reassignmentRules: reassignmentRulesAPI,
  logs: assignmentLogsAPI
};
