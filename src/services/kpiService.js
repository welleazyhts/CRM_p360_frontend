import api from './api.js';

const kpiService = {
  // Get KPIs
  getKPIs: async (filters = {}) => {
    try {
      const response = await api.get('/kpis', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  },

  // Get KPI by ID
  getKPI: async (kpiId) => {
    try {
      const response = await api.get(`/kpis/${kpiId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI:', error);
      throw error;
    }
  },

  // Create KPI
  createKPI: async (kpiData) => {
    try {
      const response = await api.post('/kpis', kpiData);
      return response.data;
    } catch (error) {
      console.error('Error creating KPI:', error);
      throw error;
    }
  },

  // Update KPI
  updateKPI: async (kpiId, kpiData) => {
    try {
      const response = await api.put(`/kpis/${kpiId}`, kpiData);
      return response.data;
    } catch (error) {
      console.error('Error updating KPI:', error);
      throw error;
    }
  },

  // Delete KPI
  deleteKPI: async (kpiId) => {
    try {
      const response = await api.delete(`/kpis/${kpiId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting KPI:', error);
      throw error;
    }
  },

  // Get employee KPIs
  getEmployeeKPIs: async (employeeId, dateRange) => {
    try {
      const response = await api.get(`/kpis/employees/${employeeId}`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee KPIs:', error);
      throw error;
    }
  },

  // Get department KPIs
  getDepartmentKPIs: async (departmentId, dateRange) => {
    try {
      const response = await api.get(`/kpis/departments/${departmentId}`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching department KPIs:', error);
      throw error;
    }
  },

  // Update KPI value
  updateKPIValue: async (kpiId, value, notes = '') => {
    try {
      const response = await api.post(`/kpis/${kpiId}/update-value`, {
        value,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error updating KPI value:', error);
      throw error;
    }
  },

  // Get KPI history
  getKPIHistory: async (kpiId, dateRange) => {
    try {
      const response = await api.get(`/kpis/${kpiId}/history`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI history:', error);
      throw error;
    }
  },

  // Get KPI trends
  getKPITrends: async (kpiId, period) => {
    try {
      const response = await api.get(`/kpis/${kpiId}/trends`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI trends:', error);
      throw error;
    }
  },

  // Get KPI performance dashboard
  getKPIPerformanceDashboard: async (filters = {}) => {
    try {
      const response = await api.get('/kpis/dashboard', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI performance dashboard:', error);
      throw error;
    }
  },

  // Get KPI analytics
  getKPIAnalytics: async (analyticsType, filters = {}) => {
    try {
      const response = await api.get(`/kpis/analytics/${analyticsType}`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI analytics:', error);
      throw error;
    }
  },

  // Get KPI reports
  getKPIReports: async (reportType, filters = {}) => {
    try {
      const response = await api.get(`/kpis/reports/${reportType}`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI reports:', error);
      throw error;
    }
  },

  // Bulk update KPIs
  bulkUpdateKPIs: async (kpiUpdates) => {
    try {
      const response = await api.post('/kpis/bulk-update', kpiUpdates);
      return response.data;
    } catch (error) {
      console.error('Error bulk updating KPIs:', error);
      throw error;
    }
  },

  // Get KPI categories
  getKPICategories: async () => {
    try {
      const response = await api.get('/kpis/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI categories:', error);
      throw error;
    }
  },

  // Create KPI category
  createKPICategory: async (categoryData) => {
    try {
      const response = await api.post('/kpis/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating KPI category:', error);
      throw error;
    }
  },

  // Update KPI category
  updateKPICategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/kpis/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating KPI category:', error);
      throw error;
    }
  },

  // Delete KPI category
  deleteKPICategory: async (categoryId) => {
    try {
      const response = await api.delete(`/kpis/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting KPI category:', error);
      throw error;
    }
  },

  // Get KPI templates
  getKPITemplates: async () => {
    try {
      const response = await api.get('/kpis/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI templates:', error);
      throw error;
    }
  },

  // Create KPI template
  createKPITemplate: async (templateData) => {
    try {
      const response = await api.post('/kpis/templates', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating KPI template:', error);
      throw error;
    }
  },

  // Apply KPI template
  applyKPITemplate: async (templateId, employeeIds) => {
    try {
      const response = await api.post(`/kpis/templates/${templateId}/apply`, {
        employeeIds
      });
      return response.data;
    } catch (error) {
      console.error('Error applying KPI template:', error);
      throw error;
    }
  },

  // Get KPI alerts
  getKPIAlerts: async () => {
    try {
      const response = await api.get('/kpis/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI alerts:', error);
      throw error;
    }
  },

  // Mark KPI alert as read
  markKPIAlertAsRead: async (alertId) => {
    try {
      const response = await api.put(`/kpis/alerts/${alertId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking KPI alert as read:', error);
      throw error;
    }
  },

  // Get KPI goals
  getKPIGoals: async (filters = {}) => {
    try {
      const response = await api.get('/kpis/goals', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI goals:', error);
      throw error;
    }
  },

  // Create KPI goal
  createKPIGoal: async (goalData) => {
    try {
      const response = await api.post('/kpis/goals', goalData);
      return response.data;
    } catch (error) {
      console.error('Error creating KPI goal:', error);
      throw error;
    }
  },

  // Update KPI goal
  updateKPIGoal: async (goalId, goalData) => {
    try {
      const response = await api.put(`/kpis/goals/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      console.error('Error updating KPI goal:', error);
      throw error;
    }
  },

  // Delete KPI goal
  deleteKPIGoal: async (goalId) => {
    try {
      const response = await api.delete(`/kpis/goals/${goalId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting KPI goal:', error);
      throw error;
    }
  },

  // Get KPI comparisons
  getKPIComparisons: async (comparisonType, filters = {}) => {
    try {
      const response = await api.get(`/kpis/comparisons/${comparisonType}`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI comparisons:', error);
      throw error;
    }
  },

  // Get KPI forecasts
  getKPIForecasts: async (kpiId, forecastPeriod) => {
    try {
      const response = await api.get(`/kpis/${kpiId}/forecast`, {
        params: { period: forecastPeriod }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI forecasts:', error);
      throw error;
    }
  },

  // Export KPI data
  exportKPIData: async (format = 'csv', filters = {}) => {
    try {
      const response = await api.post('/kpis/export', {
        format,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting KPI data:', error);
      throw error;
    }
  },

  // Import KPI data
  importKPIData: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('file', fileData);
      
      const response = await api.post('/kpis/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing KPI data:', error);
      throw error;
    }
  },

  // Get KPI settings
  getKPISettings: async () => {
    try {
      const response = await api.get('/kpis/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI settings:', error);
      throw error;
    }
  },

  // Update KPI settings
  updateKPISettings: async (settingsData) => {
    try {
      const response = await api.put('/kpis/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating KPI settings:', error);
      throw error;
    }
  }
};

export default kpiService;
