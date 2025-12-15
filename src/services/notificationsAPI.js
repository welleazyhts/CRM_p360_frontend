/**
 * Notifications API Service
 * Connects to backend Notifications Management API
 * Base URL: /api/notifications/
 */

import { getApiUrl } from './api';

const API_BASE = '/api/notifications';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('access_token');
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  /**
   * Get all notifications for current user
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`${API_BASE}/${queryParams ? `?${queryParams}` : ''}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  /**
   * Get single notification by ID
   */
  getById: async (id) => {
    const url = getApiUrl(`${API_BASE}/${id}/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification');
    }

    return response.json();
  },

  /**
   * Create notification (admin/system use)
   */
  create: async (data) => {
    const url = getApiUrl(`${API_BASE}/`);

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
      throw new Error(error.message || 'Failed to create notification');
    }

    return response.json();
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id) => {
    const url = getApiUrl(`${API_BASE}/${id}/mark_as_read/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const url = getApiUrl(`${API_BASE}/mark_all_as_read/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },

  /**
   * Get unread notifications
   */
  getUnread: async () => {
    const url = getApiUrl(`${API_BASE}/unread/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread notifications');
    }

    return response.json();
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    const url = getApiUrl(`${API_BASE}/unread_count/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    return response.json();
  },

  /**
   * Delete notification
   */
  delete: async (id) => {
    const url = getApiUrl(`${API_BASE}/${id}/`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }

    return response.json();
  },

  /**
   * Bulk delete notifications
   */
  bulkDelete: async (notificationIds) => {
    const url = getApiUrl(`${API_BASE}/bulk_delete/`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notification_ids: notificationIds })
    });

    if (!response.ok) {
      throw new Error('Failed to bulk delete notifications');
    }

    return response.json();
  },

  /**
   * Get notification preferences
   */
  getPreferences: async () => {
    const url = getApiUrl(`${API_BASE}/preferences/`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }

    return response.json();
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences) => {
    const url = getApiUrl(`${API_BASE}/preferences/`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferences)
    });

    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }

    return response.json();
  }
};

export default notificationsAPI;
