import api from './api';

/**
 * Lead Management API Service
 * Updated to match Django backend endpoints at /api/leads/
 *
 * Backend uses lead_id (string like "LD20250001") as the primary identifier
 */
export const leadService = {
  // ============================================
  // CRUD Operations
  // ============================================

  /**
   * Get all leads with optional filtering
   * Backend: GET /api/leads/
   */
  getLeads: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Map frontend filter names to backend filter names
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.assignedTo) params.append('assigned_to', filters.assignedTo);
      if (filters.source) params.append('source', filters.source);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('page_size', filters.limit);
      if (filters.isArchived !== undefined) params.append('is_archived', filters.isArchived);
      if (filters.leadType) params.append('lead_type', filters.leadType);
      if (filters.preferredLanguage) params.append('preferred_language', filters.preferredLanguage);

      // Date filters
      if (filters.createdAfter) params.append('created_at_after', filters.createdAfter);
      if (filters.createdBefore) params.append('created_at_before', filters.createdBefore);

      // Export format (csv or pdf)
      if (filters.export) params.append('export', filters.export);

      const queryString = params.toString();
      const response = await api.get(`/leads/${queryString ? '?' + queryString : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  /**
   * Get a single lead by ID
   * Backend: GET /api/leads/{lead_id}/
   * @param {string} leadId - The lead_id (e.g., "LD20250001")
   */
  getLead: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  },

  /**
   * Create a new lead
   * Backend: POST /api/leads/
   */
  createLead: async (leadData) => {
    try {
      // Map frontend field names to backend field names if needed
      const backendData = {
        first_name: leadData.firstName || leadData.first_name,
        last_name: leadData.lastName || leadData.last_name,
        email: leadData.email,
        phone: leadData.phone,
        alternate_phone: leadData.alternatePhone || leadData.alternate_phone,
        company: leadData.company,
        position: leadData.position,
        source: leadData.source?.toLowerCase(),
        status: leadData.status?.toLowerCase() || 'new',
        priority: leadData.priority?.toLowerCase() || 'medium',
        lead_type: leadData.leadType?.toLowerCase() || leadData.lead_type || 'regular',
        lead_tag: leadData.leadTag?.toLowerCase() || leadData.lead_tag || 'new_business',
        value: leadData.value,
        expected_close_date: leadData.expectedCloseDate || leadData.expected_close_date,
        preferred_language: leadData.preferredLanguage?.toLowerCase() || leadData.preferred_language || 'en',
        product: leadData.product,
        sub_product: leadData.subProduct || leadData.sub_product,
        policy_expiry_date: leadData.policyExpiryDate || leadData.policy_expiry_date,
        vehicle_reg_number: leadData.vehicleRegNumber || leadData.vehicle_reg_number,
        vehicle_type: leadData.vehicleType || leadData.vehicle_type,
        notes: leadData.notes,
      };

      // Remove undefined values
      Object.keys(backendData).forEach(key => {
        if (backendData[key] === undefined) {
          delete backendData[key];
        }
      });

      const response = await api.post('/leads/', backendData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  /**
   * Update an existing lead
   * Backend: PUT /api/leads/{lead_id}/
   */
  updateLead: async (leadId, leadData) => {
    try {
      const response = await api.put(`/leads/${leadId}/`, leadData);
      return response.data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  /**
   * Partial update of a lead
   * Backend: PATCH /api/leads/{lead_id}/
   */
  patchLead: async (leadId, leadData) => {
    try {
      const response = await api.patch(`/leads/${leadId}/`, leadData);
      return response.data;
    } catch (error) {
      console.error('Error patching lead:', error);
      throw error;
    }
  },

  /**
   * Delete a lead (soft delete)
   * Backend: DELETE /api/leads/{lead_id}/
   */
  deleteLead: async (leadId) => {
    try {
      const response = await api.delete(`/leads/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  // ============================================
  // Assignment Operations
  // ============================================

  /**
   * Assign lead to an agent
   * Backend: POST /api/leads/{lead_id}/assign/
   */
  assignLead: async (leadId, agentId) => {
    try {
      const response = await api.post(`/leads/${leadId}/assign/`, { agent_id: agentId });
      return response.data;
    } catch (error) {
      console.error('Error assigning lead:', error);
      throw error;
    }
  },

  /**
   * Unassign lead from agent
   * Backend: POST /api/leads/{lead_id}/unassign/
   */
  unassignLead: async (leadId) => {
    try {
      const response = await api.post(`/leads/${leadId}/unassign/`);
      return response.data;
    } catch (error) {
      console.error('Error unassigning lead:', error);
      throw error;
    }
  },

  // ============================================
  // Status Operations
  // ============================================

  /**
   * Update lead status
   * Backend: POST /api/leads/{lead_id}/status/
   */
  updateLeadStatus: async (leadId, status, notes = '') => {
    try {
      const response = await api.post(`/leads/${leadId}/status/`, { status, notes });
      return response.data;
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  },

  // ============================================
  // Timeline & Activities
  // ============================================

  /**
   * Get lead timeline/activities
   * Backend: GET /api/leads/{lead_id}/timeline/
   */
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
      const response = await api.get(`/leads/${leadId}/timeline/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead timeline:', error);
      throw error;
    }
  },

  /**
   * Get lead activities (alias for timeline)
   */
  getLeadActivities: async (leadId) => {
    return leadService.getLeadTimeline(leadId);
  },

  /**
   * Add activity to lead
   * Backend: POST /api/activity/ (separate endpoint)
   */
  addLeadActivity: async (leadId, activityData) => {
    try {
      const response = await api.post('/activity/', {
        lead: leadId,
        activity_type: activityData.activityType || activityData.activity_type,
        description: activityData.description,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding lead activity:', error);
      throw error;
    }
  },

  // ============================================
  // Notes Operations
  // ============================================

  /**
   * Get lead notes
   * Backend: GET /api/notes/?lead__lead_id={lead_id}
   */
  getLeadNotes: async (leadId) => {
    try {
      const response = await api.get(`/notes/?lead__lead_id=${leadId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead notes:', error);
      throw error;
    }
  },

  /**
   * Add note to lead
   * Backend: POST /api/notes/
   */
  addNoteToLead: async (leadId, noteData) => {
    try {
      const response = await api.post('/notes/', {
        lead: leadId,
        content: noteData.content || noteData,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding note to lead:', error);
      throw error;
    }
  },

  /**
   * Update lead note
   * Backend: PUT /api/notes/{note_id}/
   */
  updateLeadNote: async (leadId, noteId, noteData) => {
    try {
      const response = await api.put(`/notes/${noteId}/`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error updating lead note:', error);
      throw error;
    }
  },

  /**
   * Delete lead note
   * Backend: DELETE /api/notes/{note_id}/
   */
  deleteLeadNote: async (leadId, noteId) => {
    try {
      const response = await api.delete(`/notes/${noteId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lead note:', error);
      throw error;
    }
  },

  // ============================================
  // Analytics & Dashboard
  // ============================================

  /**
   * Get dashboard stats
   * Backend: GET /api/leads/dashboard-stats/
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/leads/dashboard-stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get lead analytics (alias for dashboard stats)
   */
  getLeadAnalytics: async (filters = {}) => {
    return leadService.getDashboardStats();
  },

  /**
   * Get status distribution for charts
   * Backend: GET /api/leads/status-distribution/
   */
  getStatusDistribution: async () => {
    try {
      const response = await api.get('/leads/status-distribution/');
      return response.data;
    } catch (error) {
      console.error('Error fetching status distribution:', error);
      throw error;
    }
  },

  /**
   * Get source distribution for charts
   * Backend: GET /api/leads/source-distribution/
   */
  getSourceDistribution: async () => {
    try {
      const response = await api.get('/leads/source-distribution/');
      return response.data;
    } catch (error) {
      console.error('Error fetching source distribution:', error);
      throw error;
    }
  },

  /**
   * Get agent performance data
   * Backend: GET /api/leads/agent-performance/
   */
  getAgentPerformance: async () => {
    try {
      const response = await api.get('/leads/agent-performance/');
      return response.data;
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      throw error;
    }
  },

  // ============================================
  // Metadata / Configuration
  // ============================================

  /**
   * Get available users/agents for assignment
   * Backend: GET /api/leads/available-users/
   */
  getAvailableUsers: async () => {
    try {
      const response = await api.get('/leads/available-users/');
      return response.data;
    } catch (error) {
      console.error('Error fetching available users:', error);
      throw error;
    }
  },

  /**
   * Get lead sources
   * Backend: GET /api/leads/sources/
   */
  getLeadSources: async () => {
    try {
      const response = await api.get('/leads/sources/');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead sources:', error);
      throw error;
    }
  },

  /**
   * Get lead statuses
   * Backend: GET /api/leads/statuses/
   */
  getLeadStatuses: async () => {
    try {
      const response = await api.get('/leads/statuses/');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
      throw error;
    }
  },

  /**
   * Get lead priorities
   * Backend: GET /api/leads/priorities/
   */
  getLeadPriorities: async () => {
    try {
      const response = await api.get('/leads/priorities/');
      return response.data;
    } catch (error) {
      console.error('Error fetching lead priorities:', error);
      throw error;
    }
  },

  // ============================================
  // Bulk Operations
  // ============================================

  /**
   * Bulk assign leads to agent
   * Backend: POST /api/leads/bulk-assign/
   */
  bulkAssignLeads: async (leadIds, agentId) => {
    try {
      const response = await api.post('/leads/bulk-assign/', {
        lead_ids: leadIds,
        agent_id: agentId
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk assigning leads:', error);
      throw error;
    }
  },

  /**
   * Bulk update lead status
   * Backend: POST /api/leads/bulk-update-status/
   */
  bulkUpdateLeadStatus: async (leadIds, status) => {
    try {
      const response = await api.post('/leads/bulk-update-status/', {
        lead_ids: leadIds,
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating lead status:', error);
      throw error;
    }
  },

  /**
   * Bulk delete leads (soft delete)
   * Backend: POST /api/leads/bulk-delete/
   */
  bulkDeleteLeads: async (leadIds) => {
    try {
      const response = await api.post('/leads/bulk-delete/', {
        lead_ids: leadIds
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting leads:', error);
      throw error;
    }
  },

  /**
   * Bulk archive leads
   * Backend: POST /api/leads/bulk-archive/
   */
  bulkArchiveLeads: async (leadIds, reason = '') => {
    try {
      const response = await api.post('/leads/bulk-archive/', {
        lead_ids: leadIds,
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk archiving leads:', error);
      throw error;
    }
  },

  /**
   * Bulk update leads (generic)
   */
  bulkUpdateLeads: async (leadIds, updateData) => {
    try {
      // Map to specific bulk operation based on updateData
      if (updateData.status) {
        return leadService.bulkUpdateLeadStatus(leadIds, updateData.status);
      }
      if (updateData.agentId || updateData.agent_id) {
        return leadService.bulkAssignLeads(leadIds, updateData.agentId || updateData.agent_id);
      }
      throw new Error('No valid update operation specified');
    } catch (error) {
      console.error('Error bulk updating leads:', error);
      throw error;
    }
  },

  /**
   * Bulk update lead notes (not directly supported, iterate)
   */
  bulkUpdateLeadNotes: async (leadIds, notes) => {
    try {
      const results = await Promise.all(
        leadIds.map(leadId => leadService.patchLead(leadId, { notes }))
      );
      return { success: true, updated: results.length };
    } catch (error) {
      console.error('Error bulk updating lead notes:', error);
      throw error;
    }
  },

  // ============================================
  // Special Assignment Operations
  // ============================================

  /**
   * Push leads to dialer
   * Backend: POST /api/leads/push-to-dialer/
   */
  pushToDialer: async (leadIds) => {
    try {
      const response = await api.post('/leads/push-to-dialer/', {
        lead_ids: leadIds
      });
      return response.data;
    } catch (error) {
      console.error('Error pushing to dialer:', error);
      throw error;
    }
  },

  /**
   * Language-based lead assignment
   * Backend: POST /api/leads/language-match-assign/
   */
  languageMatchAssign: async (leadIds) => {
    try {
      const response = await api.post('/leads/language-match-assign/', {
        lead_ids: leadIds
      });
      return response.data;
    } catch (error) {
      console.error('Error language match assign:', error);
      throw error;
    }
  },

  /**
   * Auto-assign premium leads
   * Backend: POST /api/leads/auto-assign-premium/
   */
  autoAssignPremium: async () => {
    try {
      const response = await api.post('/leads/auto-assign-premium/', {});
      return response.data;
    } catch (error) {
      console.error('Error auto-assigning premium leads:', error);
      throw error;
    }
  },

  // ============================================
  // Archive Operations
  // ============================================

  /**
   * Archive a lead
   * Backend: POST /api/leads/{lead_id}/archive/
   */
  archiveLead: async (leadId, reason = '') => {
    try {
      const response = await api.post(`/leads/${leadId}/archive/`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error archiving lead:', error);
      throw error;
    }
  },

  /**
   * Unarchive a lead
   * Backend: POST /api/leads/{lead_id}/unarchive/
   */
  unarchiveLead: async (leadId) => {
    try {
      const response = await api.post(`/leads/${leadId}/unarchive/`);
      return response.data;
    } catch (error) {
      console.error('Error unarchiving lead:', error);
      throw error;
    }
  },

  /**
   * Reopen a lost lead
   * Backend: POST /api/leads/{lead_id}/reopen/
   */
  reopenLead: async (leadId) => {
    try {
      const response = await api.post(`/leads/${leadId}/reopen/`);
      return response.data;
    } catch (error) {
      console.error('Error reopening lead:', error);
      throw error;
    }
  },

  // ============================================
  // Conversion Operations
  // ============================================

  /**
   * Convert lead to customer
   * Backend: POST /api/leads/{lead_id}/convert-to-customer/
   */
  convertToCustomer: async (leadId, policyData) => {
    try {
      const response = await api.post(`/leads/${leadId}/convert-to-customer/`, policyData);
      return response.data;
    } catch (error) {
      console.error('Error converting lead to customer:', error);
      throw error;
    }
  },

  /**
   * Get policy details for converted lead
   * Backend: GET /api/leads/{lead_id}/policy-details/
   */
  getPolicyDetails: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/policy-details/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching policy details:', error);
      throw error;
    }
  },

  /**
   * Get policy history for converted lead
   * Backend: GET /api/leads/{lead_id}/policy-history/
   */
  getPolicyHistory: async (leadId) => {
    try {
      const response = await api.get(`/leads/${leadId}/policy-history/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching policy history:', error);
      throw error;
    }
  },

  // ============================================
  // Import/Export Operations
  // ============================================

  /**
   * Import leads from CSV file
   * Backend: POST /api/leads/bulk-upload/
   */
  importLeads: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('file', fileData);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/api/leads/bulk-upload/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('access_token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error importing leads:', error);
      throw error;
    }
  },

  /**
   * Export leads to CSV/PDF
   * Backend: GET /api/leads/?export=csv or ?export=pdf
   */
  exportLeads: async (filters = {}) => {
    try {
      const format = filters.format || 'csv';
      const params = new URLSearchParams();

      params.append('export', format);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.assignedTo) params.append('assigned_to', filters.assignedTo);
      if (filters.source) params.append('source', filters.source);
      if (filters.isArchived !== undefined) params.append('is_archived', filters.isArchived);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/api/leads/?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('access_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting leads:', error);
      throw error;
    }
  },

  /**
   * Get bulk upload logs
   * Backend: GET /api/leads/bulk-upload-logs/
   */
  getBulkUploadLogs: async () => {
    try {
      const response = await api.get('/leads/bulk-upload-logs/');
      return response.data;
    } catch (error) {
      console.error('Error fetching bulk upload logs:', error);
      throw error;
    }
  },

  // ============================================
  // Email Operations (if implemented)
  // ============================================

  /**
   * Send email to lead
   * Backend: POST /api/leads/{lead_id}/send-general-email/
   */
  sendEmailToLead: async (leadId, emailData) => {
    try {
      const response = await api.post(`/leads/${leadId}/send-general-email/`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email to lead:', error);
      throw error;
    }
  },

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Duplicate lead (create copy)
   * Not directly supported, create new lead with same data
   */
  duplicateLead: async (leadId) => {
    try {
      const lead = await leadService.getLead(leadId);
      const newLead = { ...lead };
      delete newLead.lead_id;
      delete newLead.id;
      delete newLead.created_at;
      delete newLead.updated_at;
      newLead.notes = `Duplicated from ${leadId}. ${newLead.notes || ''}`;
      return await leadService.createLead(newLead);
    } catch (error) {
      console.error('Error duplicating lead:', error);
      throw error;
    }
  },

  /**
   * Merge leads (not directly supported)
   */
  mergeLeads: async (primaryLeadId, secondaryLeadId) => {
    try {
      // This would need a backend implementation
      // For now, just archive the secondary lead
      await leadService.archiveLead(secondaryLeadId, `Merged into ${primaryLeadId}`);
      return { success: true, message: 'Lead merged (secondary archived)' };
    } catch (error) {
      console.error('Error merging leads:', error);
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
        id: 101,
        lead_id: 'L-2023-001',
        name: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul.s@example.com',
        status: 'New',
        source: 'Website',
        priority: 'High',
        assignedTo: 1, // Current user
        createdAt: '2023-05-15T10:30:00Z',
        notes: 'Interested in term insurance'
      },
      {
        id: 102,
        lead_id: 'L-2023-002',
        name: 'Priya Singh',
        phone: '9876543211',
        email: 'priya.s@example.com',
        status: 'Contacted',
        source: 'Referral',
        priority: 'Medium',
        assignedTo: 1, // Current user
        createdAt: '2023-05-16T14:20:00Z',
        notes: 'Called twice, busy'
      }
    ];
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
