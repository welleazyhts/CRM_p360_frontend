/**
 * Deduplication API Service
 * Connects to backend Deduplication API
 * Base URL: /api/deduplication/
 */

import { getApiUrl } from './api';

const API_BASE = '/api/deduplication';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('access_token');
};

/**
 * Deduplication Settings API
 */
export const deduplicationSettingsAPI = {
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
      throw new Error('Failed to fetch deduplication settings');
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
      throw new Error('Failed to fetch deduplication setting');
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
      throw new Error(error.message || 'Failed to create deduplication settings');
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
      throw new Error(error.message || 'Failed to update deduplication settings');
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
      throw new Error('Failed to delete deduplication settings');
    }

    return response.json();
  }
};

/**
 * Dedupe Fields API
 */
export const dedupeFieldsAPI = {
  /**
   * Get all fields
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/fields/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dedupe fields');
    }

    return response.json();
  },

  /**
   * Get field by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/fields/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dedupe field');
    }

    return response.json();
  },

  /**
   * Create field
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/fields/`);

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
      throw new Error(error.message || 'Failed to create dedupe field');
    }

    return response.json();
  },

  /**
   * Update field
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/fields/${id}/`);

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
      throw new Error(error.message || 'Failed to update dedupe field');
    }

    return response.json();
  },

  /**
   * Delete field
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/fields/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete dedupe field');
    }

    return response.json();
  }
};

/**
 * Dedupe Conditions API
 */
export const dedupeConditionsAPI = {
  /**
   * Get all conditions
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/conditions/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dedupe conditions');
    }

    return response.json();
  },

  /**
   * Get condition by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/conditions/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dedupe condition');
    }

    return response.json();
  },

  /**
   * Create condition
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/conditions/`);

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
      throw new Error(error.message || 'Failed to create dedupe condition');
    }

    return response.json();
  },

  /**
   * Update condition
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/conditions/${id}/`);

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
      throw new Error(error.message || 'Failed to update dedupe condition');
    }

    return response.json();
  },

  /**
   * Delete condition
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/conditions/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete dedupe condition');
    }

    return response.json();
  }
};

/**
 * Dedupe Exceptions API
 */
export const dedupeExceptionsAPI = {
  /**
   * Get all exceptions
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/exceptions/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dedupe exceptions');
    }

    return response.json();
  },

  /**
   * Get exception by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/exceptions/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dedupe exception');
    }

    return response.json();
  },

  /**
   * Create exception
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/exceptions/`);

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
      throw new Error(error.message || 'Failed to create dedupe exception');
    }

    return response.json();
  },

  /**
   * Update exception
   */
  update: async (id, data) => {
    const url = getApiUrl(`${API_BASE}/exceptions/${id}/`);

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
      throw new Error(error.message || 'Failed to update dedupe exception');
    }

    return response.json();
  },

  /**
   * Delete exception
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/exceptions/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete dedupe exception');
    }

    return response.json();
  }
};

/**
 * Duplicate Records API
 */
export const duplicateRecordsAPI = {
  /**
   * Get all duplicate records
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/duplicate-records/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch duplicate records');
    }

    return response.json();
  },

  /**
   * Get duplicate record by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/duplicate-records/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch duplicate record');
    }

    return response.json();
  },

  /**
   * Check for duplicates
   */
  checkDuplicates: async (data) => {
    const url = getApiUrl(`${API_BASE}/duplicate-records/check_duplicates/`);

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
      throw new Error(error.message || 'Failed to check for duplicates');
    }

    return response.json();
  },

  /**
   * Merge duplicate records
   */
  mergeDuplicates: async (data) => {
    const url = getApiUrl(`${API_BASE}/duplicate-records/merge/`);

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
      throw new Error(error.message || 'Failed to merge duplicates');
    }

    return response.json();
  }
};

// Export all APIs
export default {
  settings: deduplicationSettingsAPI,
  fields: dedupeFieldsAPI,
  conditions: dedupeConditionsAPI,
  exceptions: dedupeExceptionsAPI,
  duplicateRecords: duplicateRecordsAPI
};
