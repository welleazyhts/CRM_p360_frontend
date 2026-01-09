import api from './api.js';

const pipelineService = {
  /**
   * List all pipeline items
   * GET /api/sales_pipeline/
   */
  listPipelineItems: async () => {
    try {
      const response = await api.get('/sales_pipeline/');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline items:', error);
      throw error;
    }
  },

  /**
   * Create a new pipeline item
   * POST /api/sales_pipeline/
   * @param {Object} data - { first_name, last_name, email, phone, company, position, value, expected_close_date, stage, priority, notes, assigned_to }
   */
  createPipelineItem: async (data) => {
    try {
      const response = await api.post('/sales_pipeline/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating pipeline item:', error);
      throw error;
    }
  },

  /**
   * Update a pipeline item
   * PUT /api/sales_pipeline/{id}/
   */
  updatePipelineItem: async (id, data) => {
    try {
      const response = await api.put(`/sales_pipeline/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating pipeline item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Partially update a pipeline item
   * PATCH /api/sales_pipeline/{id}/
   */
  partiallyUpdatePipelineItem: async (id, data) => {
    try {
      const response = await api.patch(`/sales_pipeline/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error partially updating pipeline item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a pipeline item
   * DELETE /api/sales_pipeline/delete/{id}/
   */
  deletePipelineItem: async (id) => {
    try {
      // confirm path from Postman: /delete/{id}/
      const response = await api.delete(`/sales_pipeline/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting pipeline item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Filter pipeline items by stage
   * GET /api/sales_pipeline/filter_by_stage/?stage={stage}
   * The Postman collection also suggests paths like /filter_by_stage/closed_won/
   * We'll implement the query param version as default, or we can add a flag.
   */
  filterByStage: async (stage) => {
    try {
      // Using query param as it's cleaner for variable input
      const response = await api.get(`/sales_pipeline/filter_by_stage/?stage=${stage}`);
      return response.data;
    } catch (error) {
      console.error(`Error filtering pipeline by stage ${stage}:`, error);
      throw error;
    }
  },

  /**
   * Search pipeline items
   * GET /api/sales_pipeline/search/?q={query}
   */
  searchPipelineItems: async (query) => {
    try {
      const response = await api.get(`/sales_pipeline/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching pipeline items:`, error);
      throw error;
    }
  },

  /**
   * Get pipeline summary
   * GET /api/sales_pipeline/pipeline-summary/
   */
  getPipelineSummary: async () => {
    try {
      const response = await api.get('/sales_pipeline/pipeline-summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline summary:', error);
      throw error;
    }
  },

  /**
   * Get dashboard stats
   * GET /api/sales_pipeline/dashboard-stats/
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/sales_pipeline/dashboard-stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get conversion rate
   * GET /api/sales_pipeline/conversion-rate/
   */
  getConversionRate: async () => {
    try {
      const response = await api.get('/sales_pipeline/conversion-rate/');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
      throw error;
    }
  },

  /**
   * Reset filters
   * GET /api/sales_pipeline/reset_filters/
   */
  resetFilters: async () => {
    try {
      const response = await api.get('/sales_pipeline/reset_filters/');
      return response.data;
    } catch (error) {
      console.error('Error resetting filters:', error);
      throw error;
    }
  }
};

export default pipelineService;

export const {
  listPipelineItems,
  createPipelineItem,
  updatePipelineItem,
  partiallyUpdatePipelineItem,
  deletePipelineItem,
  filterByStage,
  searchPipelineItems,
  getPipelineSummary,
  getDashboardStats,
  getConversionRate,
  resetFilters
} = pipelineService;
