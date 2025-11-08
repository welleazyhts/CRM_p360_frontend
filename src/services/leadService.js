import api from './api';

// Lead Management API Service
export const leadService = {
  // Get all leads with optional filtering
  getLeads: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.source) params.append('source', filters.source);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/leads?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  // Get a single lead by ID
  getLead: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  },

  // Create a new lead
  createLead: async (leadData) => {
    try {
      const response = await api.post('/leads', leadData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  // Update an existing lead
  updateLead: async (leadId, leadData) => {
    try {
      const response = await api.put(`/leads/${leadId}`, leadData);
      return response.data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  // Delete a lead
  deleteLead: async (leadId) => {
    try {
      const response = await api.delete(`/leads/${leadId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // Assign lead to a user
  assignLead: async (leadId, userId) => {
    try {
      const response = await api.post(`/leads/${leadId}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error assigning lead:', error);
      throw error;
    }
  },

  // Unassign lead
  unassignLead: async (leadId) => {
    try {
      const response = await api.post(`/leads/${leadId}/unassign`);
      return response.data;
    } catch (error) {
      console.error('Error unassigning lead:', error);
      throw error;
    }
  },

  // Update lead status
  updateLeadStatus: async (leadId, status, notes = '') => {
    try {
      const response = await api.post(`/leads/${leadId}/status`, { status, notes });
      return response.data;
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  },

  // Get lead activities/history
  getLeadActivities: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead activities:', error);
      throw error;
    }
  },

  // Add activity to lead
  addLeadActivity: async (leadId, activityData) => {
    try {
      const response = await api.post(`/leads/${leadId}/activities`, activityData);
      return response.data;
    } catch (error) {
      console.error('Error adding lead activity:', error);
      throw error;
    }
  },

  // Send email to lead
  sendEmailToLead: async (leadId, emailData) => {
    try {
      const response = await api.post(`/leads/${leadId}/email`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email to lead:', error);
      throw error;
    }
  },

  // Get lead analytics
  getLeadAnalytics: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.source) params.append('source', filters.source);

      const response = await api.get(`/leads/analytics?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead analytics:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkUpdateLeads: async (leadIds, updateData) => {
    try {
      const response = await api.post('/leads/bulk-update', {
        leadIds,
        updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating leads:', error);
      throw error;
    }
  },


  // Import/Export
  importLeads: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('file', fileData);
      
      const response = await api.post('/leads/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error importing leads:', error);
      throw error;
    }
  },

  exportLeads: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      if (filters.source) params.append('source', filters.source);
      if (filters.format) params.append('format', filters.format || 'csv');

      const response = await api.get(`/leads/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting leads:', error);
      throw error;
    }
  },

  // Get available users for assignment
  getAvailableUsers: async () => {
    try {
      const response = await api.get('/leads/available-users');
      return response.data;
    } catch (error) {
      console.error('Error fetching available users:', error);
      throw error;
    }
  },

  // Get lead sources
  getLeadSources: async () => {
    try {
      const response = await api.get('/leads/sources');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead sources:', error);
      throw error;
    }
  },

  // Get lead statuses
  getLeadStatuses: async () => {
    try {
      const response = await api.get('/leads/statuses');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
      throw error;
    }
  },

  // Get lead priorities
  getLeadPriorities: async () => {
    try {
      const response = await api.get('/leads/priorities');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead priorities:', error);
      throw error;
    }
  },

  // Duplicate lead
  duplicateLead: async (leadId) => {
    try {
      const response = await api.post(`/leads/${leadId}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating lead:', error);
      throw error;
    }
  },

  // Merge leads
  mergeLeads: async (primaryLeadId, secondaryLeadId) => {
    try {
      const response = await api.post('/leads/merge', {
        primaryLeadId,
        secondaryLeadId
      });
      return response.data;
    } catch (error) {
      console.error('Error merging leads:', error);
      throw error;
    }
  },

  // Get lead timeline
  getLeadTimeline: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead timeline:', error);
      throw error;
    }
  },

  // Add note to lead
  addNoteToLead: async (leadId, noteData) => {
    try {
      const response = await api.post(`/leads/${leadId}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error adding note to lead:', error);
      throw error;
    }
  },

  // Get lead notes
  getLeadNotes: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/notes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead notes:', error);
      throw error;
    }
  },

  // Update lead note
  updateLeadNote: async (leadId, noteId, noteData) => {
    try {
      const response = await api.put(`/leads/${leadId}/notes/${noteId}`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error updating lead note:', error);
      throw error;
    }
  },

  // Delete lead note
  deleteLeadNote: async (leadId, noteId) => {
    try {
      const response = await api.delete(`/leads/${leadId}/notes/${noteId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lead note:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkAssignLeads: async (leadIds, agentId) => {
    try {
      const response = await api.post('/leads/bulk-assign', {
        leadIds,
        agentId
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk assigning leads:', error);
      throw error;
    }
  },

  bulkUpdateLeadStatus: async (leadIds, status) => {
    try {
      const response = await api.post('/leads/bulk-update-status', {
        leadIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating lead status:', error);
      throw error;
    }
  },

  bulkDeleteLeads: async (leadIds) => {
    try {
      const response = await api.post('/leads/bulk-delete', {
        leadIds
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting leads:', error);
      throw error;
    }
  },

  bulkUpdateLeadNotes: async (leadIds, notes) => {
    try {
      const response = await api.post('/leads/bulk-update-notes', {
        leadIds,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating lead notes:', error);
      throw error;
    }
  }
};

export default leadService;
