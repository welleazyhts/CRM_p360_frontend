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

  // ---------------------- New Pipeline CRUD API surface ----------------------
  ,
  // In-memory seeded store for pipelines (fallback when backend is unavailable)
  _mockPipelines: [
    {
      id: 'PIPE-001',
      name: 'Sales Pipeline',
      description: 'Default sales pipeline',
      stages: [
        { id: 'STAGE-1', name: 'New', order: 1 },
        { id: 'STAGE-2', name: 'Contacted', order: 2 },
        { id: 'STAGE-3', name: 'Qualified', order: 3 },
        { id: 'STAGE-4', name: 'Proposal', order: 4 },
        { id: 'STAGE-5', name: 'Won', order: 5 }
      ],
      createdAt: new Date().toISOString()
    }
  ],

  listPipelines: async (options = {}) => {
    const { page = 1, limit = 10, search } = options;
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', limit);
      if (search) params.set('search', search);

      const resp = await api.get(`/pipelines?${params.toString()}`);
      if (resp && resp.data && (resp.data.pipelines || resp.data.pagination)) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      // Mock paginated response
      const all = pipelineService._mockPipelines.slice();
      const filtered = search ? all.filter(p => p.name.toLowerCase().includes(String(search).toLowerCase())) : all;
      const total = filtered.length;
      const start = (page - 1) * limit;
      const pipelines = filtered.slice(start, start + limit);
      return { pipelines, pagination: { page, limit, total } };
    }
  },

  getPipeline: async (pipelineId) => {
    if (!pipelineId) throw new Error('Missing pipelineId');
    try {
      const resp = await api.get(`/pipelines/${encodeURIComponent(pipelineId)}`);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const found = pipelineService._mockPipelines.find(p => p.id === pipelineId);
      if (!found) throw new Error(`Pipeline ${pipelineId} not found`);
      return found;
    }
  },

  createPipeline: async (payload) => {
    if (!payload || !payload.name) throw new Error('Missing required field: name');
    try {
      const resp = await api.post('/pipelines', payload);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      // Mock create
      const newPipeline = {
        id: `PIPE-${Date.now()}`,
        name: payload.name,
        description: payload.description || '',
        stages: payload.stages || [],
        createdAt: new Date().toISOString()
      };
      pipelineService._mockPipelines.push(newPipeline);
      return newPipeline;
    }
  },

  updatePipeline: async (pipelineId, payload) => {
    if (!pipelineId) throw new Error('Missing pipelineId');
    try {
      const resp = await api.put(`/pipelines/${encodeURIComponent(pipelineId)}`, payload);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const idx = pipelineService._mockPipelines.findIndex(p => p.id === pipelineId);
      if (idx === -1) throw new Error(`Pipeline ${pipelineId} not found`);
      const updated = { ...pipelineService._mockPipelines[idx], ...payload };
      pipelineService._mockPipelines[idx] = updated;
      return updated;
    }
  },

  deletePipeline: async (pipelineId) => {
    if (!pipelineId) throw new Error('Missing pipelineId');
    try {
      const resp = await api.delete(`/pipelines/${encodeURIComponent(pipelineId)}`);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const idx = pipelineService._mockPipelines.findIndex(p => p.id === pipelineId);
      if (idx === -1) throw new Error(`Pipeline ${pipelineId} not found`);
      pipelineService._mockPipelines.splice(idx, 1);
      return { success: true, id: pipelineId };
    }
  },

  addStage: async (pipelineId, stage) => {
    if (!pipelineId) throw new Error('Missing pipelineId');
    if (!stage || !stage.name) throw new Error('Missing required field: stage.name');
    try {
      const resp = await api.post(`/pipelines/${encodeURIComponent(pipelineId)}/stages`, stage);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const p = pipelineService._mockPipelines.find(x => x.id === pipelineId);
      if (!p) throw new Error(`Pipeline ${pipelineId} not found`);
      const newStage = { id: `STAGE-${Date.now()}`, name: stage.name, order: (p.stages.length || 0) + 1 };
      p.stages.push(newStage);
      return newStage;
    }
  },

  updateStage: async (pipelineId, stageId, payload) => {
    if (!pipelineId) throw new Error('Missing pipelineId');
    if (!stageId) throw new Error('Missing stageId');
    try {
      const resp = await api.put(`/pipelines/${encodeURIComponent(pipelineId)}/stages/${encodeURIComponent(stageId)}`, payload);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const p = pipelineService._mockPipelines.find(x => x.id === pipelineId);
      if (!p) throw new Error(`Pipeline ${pipelineId} not found`);
      const sIdx = p.stages.findIndex(s => s.id === stageId);
      if (sIdx === -1) throw new Error(`Stage ${stageId} not found`);
      const updated = { ...p.stages[sIdx], ...payload };
      p.stages[sIdx] = updated;
      return updated;
    }
  },

  deleteStage: async (pipelineId, stageId) => {
    if (!pipelineId) throw new Error('Missing pipelineId');
    if (!stageId) throw new Error('Missing stageId');
    try {
      const resp = await api.delete(`/pipelines/${encodeURIComponent(pipelineId)}/stages/${encodeURIComponent(stageId)}`);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const p = pipelineService._mockPipelines.find(x => x.id === pipelineId);
      if (!p) throw new Error(`Pipeline ${pipelineId} not found`);
      const sIdx = p.stages.findIndex(s => s.id === stageId);
      if (sIdx === -1) throw new Error(`Stage ${stageId} not found`);
      const removed = p.stages.splice(sIdx, 1);
      return removed[0] || { success: true };
    }
  },

  reorderStages: async (pipelineId, orderPayload = []) => {
    if (!pipelineId) throw new Error('Missing pipelineId');
    try {
      const resp = await api.put(`/pipelines/${encodeURIComponent(pipelineId)}/stages/reorder`, { stageOrder: orderPayload });
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const p = pipelineService._mockPipelines.find(x => x.id === pipelineId);
      if (!p) throw new Error(`Pipeline ${pipelineId} not found`);
      // orderPayload: [{ id, order }]
      for (const o of orderPayload) {
        const s = p.stages.find(st => st.id === o.id);
        if (s) s.order = o.order;
      }
      p.stages.sort((a, b) => (a.order || 0) - (b.order || 0));
      return p.stages;
    }
  }
};

export default pipelineService;

// Named exports for convenience
export const {
  listPipelines,
  getPipeline,
  createPipeline,
  updatePipeline,
  deletePipeline,
  addStage,
  updateStage,
  deleteStage,
  reorderStages
} = pipelineService;
