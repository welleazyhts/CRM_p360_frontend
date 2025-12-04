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
  },

  // --- Merged from leadServices.js ---

  getAssignedLeads: async (params = {}) => {
    try {
      const res = await api.get('/leads/assigned', { params });
      if (res && res.data && Array.isArray(res.data)) return res.data;
    } catch (e) {
      // ignore and fall through to mock
    }

    // Mock fallback
    return [
      {
        id: 1,
        firstName: 'Rahul',
        lastName: 'Sharma',
        phone: '+91-98765-43210',
        email: 'rahul.sharma@email.com',
        status: 'New',
        priority: 'High',
        createdAt: '2025-10-08',
        assignedTo: 'Sarah Johnson',
        lastContact: '2025-10-09',
        policyType: 'Motor Insurance',
        policyNumber: 'POL123456',
        vehicleNumber: 'MH01AB1234'
      }
    ];
  },

  getLostLeads: async (params = {}) => {
    try {
      const res = await api.get('/leads/lost', { params });
      if (res && res.data && Array.isArray(res.data)) return res.data;
    } catch (e) { }

    return [
      {
        id: 101,
        firstName: 'Amit',
        lastName: 'Sharma',
        phone: '+91-98123-45678',
        email: 'amit.sharma@email.com',
        status: 'Closed Lost',
        lostReason: 'High Premium',
        policyType: 'Health Insurance',
        quotedPremium: 35000,
        closedDate: '2025-10-15',
        closedBy: 'Priya Patel',
        remarks: 'Customer found premium too expensive, considering competitor options',
        source: 'Website'
      }
    ];
  },

  getArchivedLeads: async (params = {}) => {
    try {
      const res = await api.get('/leads/archived', { params });
      if (res && res.data && Array.isArray(res.data)) return res.data;
    } catch (e) { }

    return [
      {
        id: 201,
        firstName: 'Vikram',
        lastName: 'Singh',
        phone: '+91-91234-56789',
        email: 'vikram.singh@email.com',
        previousStatus: 'New Lead',
        policyType: 'Health Insurance',
        premium: 28000,
        archivedDate: '2025-09-20',
        archivedBy: 'Admin User',
        archivedReason: 'Duplicate Lead',
        source: 'Website',
        assignedTo: 'Priya Patel'
      }
    ];
  },

  getClosedLeads: async (params = {}) => {
    try {
      const res = await api.get('/leads/closed', { params });
      if (res && res.data && Array.isArray(res.data)) return res.data;
    } catch (e) { }

    return [
      {
        id: 1,
        firstName: 'Rohit',
        lastName: 'Kumar',
        phone: '+91-98765-43210',
        email: 'rohit.kumar@email.com',
        status: 'Closed Won',
        result: 'Policy Issued',
        policyType: 'Motor Insurance',
        policyNumber: 'POL789012',
        premium: 25000,
        closedDate: '2025-10-01',
        closedBy: 'Sarah Johnson',
        remarks: 'Customer satisfied with premium and coverage'
      }
    ];
  },

  closeLead: async (leadId, payload = {}) => {
    try {
      const res = await api.post(`/leads/${leadId}/close`, payload);
      return res.data;
    } catch (e) {
      throw e;
    }
  },

  archiveLead: async (leadId) => {
    try {
      const res = await api.post(`/leads/${leadId}/archive`);
      return res.data;
    } catch (e) {
      throw e;
    }
  },

  restoreLead: async (leadId) => {
    try {
      const res = await api.post(`/leads/${leadId}/restore`);
      return res.data;
    } catch (e) {
      throw e;
    }
  },

  // Export closed leads to CSV/Excel
  exportClosedLeads: async (filters = {}, format = 'csv') => {
    try {
      const params = new URLSearchParams();
      if (filters.result) params.append('result', filters.result);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      params.append('format', format);

      const response = await api.get(`/leads/closed/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting closed leads:', error);
      // Fallback to client-side CSV generation
      return null;
    }
  },

  // Generate PDF report for closed leads
  generateClosedLeadsReport: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.result) params.append('result', filters.result);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await api.get(`/leads/closed/report?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating closed leads report:', error);
      return null;
    }
  },

  // Get lead history/timeline
  getLeadHistory: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead history:', error);
      // Mock fallback
      return [
        {
          id: 1,
          type: 'status_change',
          description: 'Lead status changed from "In Progress" to "Closed Won"',
          timestamp: '2025-10-01 14:30:00',
          user: 'Sarah Johnson',
          icon: 'CheckCircle'
        },
        {
          id: 2,
          type: 'call',
          description: 'Outbound call made - Duration: 15 minutes',
          timestamp: '2025-09-28 11:20:00',
          user: 'Sarah Johnson',
          icon: 'Phone'
        },
        {
          id: 3,
          type: 'note',
          description: 'Customer agreed to policy terms and premium amount',
          timestamp: '2025-09-28 11:35:00',
          user: 'Sarah Johnson',
          icon: 'Note'
        },
        {
          id: 4,
          type: 'email',
          description: 'Quote sent to customer via email',
          timestamp: '2025-09-25 10:15:00',
          user: 'Sarah Johnson',
          icon: 'Email'
        },
        {
          id: 5,
          type: 'document',
          description: 'Vehicle documents uploaded',
          timestamp: '2025-09-24 16:45:00',
          user: 'Rohit Kumar',
          icon: 'Upload'
        },
        {
          id: 6,
          type: 'created',
          description: 'Lead created from Website',
          timestamp: '2025-09-20 09:00:00',
          user: 'System',
          icon: 'Add'
        }
      ];
    }
  },

  // Download lead documents
  downloadLeadDocuments: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/documents/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading lead documents:', error);
      return null;
    }
  },

  // Export lost leads to CSV/Excel
  exportLostLeads: async (filters = {}, format = 'csv') => {
    try {
      const params = new URLSearchParams();
      if (filters.reason) params.append('reason', filters.reason);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      params.append('format', format);

      const response = await api.get(`/leads/lost/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting lost leads:', error);
      return null;
    }
  },

  // Generate PDF report for lost leads
  generateLostLeadsReport: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.reason) params.append('reason', filters.reason);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.searchTerm) params.append('search', filters.searchTerm);

      const response = await api.get(`/leads/lost/report?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating lost leads report:', error);
      return null;
    }
  },

  // Reopen a lost lead
  reopenLead: async (leadId) => {
    try {
      const response = await api.post(`/leads/${leadId}/reopen`);
      return response.data;
    } catch (error) {
      console.error('Error reopening lead:', error);
      // Mock success response for demo
      return { success: true, message: 'Lead reopened successfully' };
    }
  },

  // Export archived leads to CSV/Excel
  exportArchivedLeads: async (filters = {}, format = 'csv') => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      params.append('format', format);

      const response = await api.get(`/leads/archived/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting archived leads:', error);
      return null;
    }
  },

  // Unarchive a lead
  unarchiveLead: async (leadId) => {
    try {
      const response = await api.post(`/leads/${leadId}/unarchive`);
      return response.data;
    } catch (error) {
      console.error('Error unarchiving lead:', error);
      // Mock success response for demo
      return { success: true, message: 'Lead unarchived successfully' };
    }
  },

  // Permanently delete a lead
  permanentlyDeleteLead: async (leadId) => {
    try {
      const response = await api.delete(`/leads/${leadId}/permanent`);
      return response.data;
    } catch (error) {
      console.error('Error permanently deleting lead:', error);
      // Mock success response for demo
      return { success: true, message: 'Lead deleted permanently' };
    }
  }
};

export default leadService;
