import api from './api.js';

const pipelineService = {
  // Get pipeline stages
  getPipelineStages: async () => {
    try {
      const response = await api.get('/pipeline/stages');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline stages:', error);
      throw error;
    }
  },

  // Get leads by pipeline stage
  getLeadsByStage: async (stageId) => {
    try {
      const response = await api.get(`/pipeline/stages/${stageId}/leads`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leads by stage:', error);
      throw error;
    }
  },

  // Move lead to different stage
  moveLeadToStage: async (leadId, newStageId) => {
    try {
      const response = await api.put(`/pipeline/leads/${leadId}/stage`, {
        stageId: newStageId
      });
      return response.data;
    } catch (error) {
      console.error('Error moving lead to stage:', error);
      throw error;
    }
  },

  // Bulk move leads to stage
  bulkMoveLeadsToStage: async (leadIds, newStageId) => {
    try {
      const response = await api.post('/pipeline/bulk-move', {
        leadIds,
        stageId: newStageId
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk moving leads to stage:', error);
      throw error;
    }
  },

  // Get pipeline metrics
  getPipelineMetrics: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/pipeline/metrics?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline metrics:', error);
      throw error;
    }
  },

  // Get pipeline conversion rates
  getConversionRates: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/pipeline/conversion-rates?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversion rates:', error);
      throw error;
    }
  },

  // Get pipeline velocity (average time in each stage)
  getPipelineVelocity: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/pipeline/velocity?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline velocity:', error);
      throw error;
    }
  },

  // Get stage performance analytics
  getStagePerformance: async (stageId, dateRange = '30d') => {
    try {
      const response = await api.get(`/pipeline/stages/${stageId}/performance?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stage performance:', error);
      throw error;
    }
  },

  // Create custom pipeline stage
  createPipelineStage: async (stageData) => {
    try {
      const response = await api.post('/pipeline/stages', stageData);
      return response.data;
    } catch (error) {
      console.error('Error creating pipeline stage:', error);
      throw error;
    }
  },

  // Update pipeline stage
  updatePipelineStage: async (stageId, stageData) => {
    try {
      const response = await api.put(`/pipeline/stages/${stageId}`, stageData);
      return response.data;
    } catch (error) {
      console.error('Error updating pipeline stage:', error);
      throw error;
    }
  },

  // Delete pipeline stage
  deletePipelineStage: async (stageId) => {
    try {
      const response = await api.delete(`/pipeline/stages/${stageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting pipeline stage:', error);
      throw error;
    }
  },

  // Reorder pipeline stages
  reorderPipelineStages: async (stageOrder) => {
    try {
      const response = await api.put('/pipeline/stages/reorder', {
        stageOrder
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering pipeline stages:', error);
      throw error;
    }
  },

  // Get pipeline forecast
  getPipelineForecast: async (forecastPeriod = '30d') => {
    try {
      const response = await api.get(`/pipeline/forecast?period=${forecastPeriod}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline forecast:', error);
      throw error;
    }
  },

  // Get pipeline trends
  getPipelineTrends: async (trendPeriod = '90d') => {
    try {
      const response = await api.get(`/pipeline/trends?period=${trendPeriod}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline trends:', error);
      throw error;
    }
  },

  // Get pipeline health score
  getPipelineHealth: async () => {
    try {
      const response = await api.get('/pipeline/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline health:', error);
      throw error;
    }
  },

  // Get stage bottleneck analysis
  getStageBottlenecks: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/pipeline/bottlenecks?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stage bottlenecks:', error);
      throw error;
    }
  },

  // Get pipeline alerts
  getPipelineAlerts: async () => {
    try {
      const response = await api.get('/pipeline/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline alerts:', error);
      throw error;
    }
  },

  // Mark pipeline alert as read
  markAlertAsRead: async (alertId) => {
    try {
      const response = await api.put(`/pipeline/alerts/${alertId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking pipeline alert as read:', error);
      throw error;
    }
  },

  // Export pipeline data
  exportPipelineData: async (format = 'csv', filters = {}) => {
    try {
      const response = await api.post('/pipeline/export', {
        format,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting pipeline data:', error);
      throw error;
    }
  },

  // Import pipeline data
  importPipelineData: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('file', fileData);
      
      const response = await api.post('/pipeline/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing pipeline data:', error);
      throw error;
    }
  },

  // Get pipeline templates
  getPipelineTemplates: async () => {
    try {
      const response = await api.get('/pipeline/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline templates:', error);
      throw error;
    }
  },

  // Apply pipeline template
  applyPipelineTemplate: async (templateId) => {
    try {
      const response = await api.post(`/pipeline/templates/${templateId}/apply`);
      return response.data;
    } catch (error) {
      console.error('Error applying pipeline template:', error);
      throw error;
    }
  }
};

export default pipelineService;
