import api from './api.js';

const BASE_PATH = '/attendance_management';

const attendanceService = {
  /**
   * Create attendance record
   * POST /api/attendance_management/create/
   */
  create: async (data) => {
    try {
      const response = await api.post(`${BASE_PATH}/create/`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  },

  /**
   * List attendance history
   * GET /api/attendance_management/list/
   */
  list: async (filters = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/list/`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance list:', error);
      throw error;
    }
  },

  /**
   * Search attendance
   * GET /api/attendance_management/search/
   */
  search: async (filters = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/search/`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching attendance:', error);
      throw error;
    }
  },

  /**
   * Update attendance record
   * PUT /api/attendance_management/update/{id}/
   */
  update: async (id, data) => {
    try {
      const response = await api.put(`${BASE_PATH}/update/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating attendance for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete attendance record
   * DELETE /api/attendance_management/delete/{id}/
   */
  delete: async (id, data = {}) => {
    try {
      const response = await api.delete(`${BASE_PATH}/delete/${id}/`, { data });
      return response.data;
    } catch (error) {
      console.error(`Error deleting attendance for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get dashboard summary
   * GET /api/attendance_management/dashboard_summary/
   */
  getDashboardSummary: async (filters = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/dashboard_summary/`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  /**
   * Filter attendance
   * GET /api/attendance_management/filter/
   */
  filter: async (filters = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/filter/`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error filtering attendance:', error);
      throw error;
    }
  },

  /**
   * Compute hours
   * POST /api/attendance_management/compute_hours/
   */
  computeHours: async (data) => {
    try {
      const response = await api.post(`${BASE_PATH}/compute_hours/`, data);
      return response.data;
    } catch (error) {
      console.error('Error computing hours:', error);
      throw error;
    }
  },

  /**
   * Get today's attendance
   * GET /api/attendance_management/today_attendance/
   */
  getTodayAttendance: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/today_attendance/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      throw error;
    }
  },

  /**
   * Get reports data
   * GET /api/attendance_management/reports_data/
   */
  getReportsData: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/reports_data/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports data:', error);
      throw error;
    }
  }
};

export default attendanceService;
