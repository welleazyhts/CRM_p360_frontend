import api from './api.js';

const attendanceService = {
  // Get attendance records
  getAttendanceRecords: async (filters = {}) => {
    try {
      const response = await api.get('/attendance/records', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  },

  // Get attendance record by ID
  getAttendanceRecord: async (recordId) => {
    try {
      const response = await api.get(`/attendance/records/${recordId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      throw error;
    }
  },

  // Create attendance record
  createAttendanceRecord: async (attendanceData) => {
    try {
      const response = await api.post('/attendance/records', attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance record:', error);
      throw error;
    }
  },

  // Update attendance record
  updateAttendanceRecord: async (recordId, attendanceData) => {
    try {
      const response = await api.put(`/attendance/records/${recordId}`, attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
  },

  // Delete attendance record
  deleteAttendanceRecord: async (recordId) => {
    try {
      const response = await api.delete(`/attendance/records/${recordId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  },

  // Check in employee
  checkIn: async (employeeId, checkInData) => {
    try {
      const response = await api.post(`/attendance/check-in/${employeeId}`, checkInData);
      return response.data;
    } catch (error) {
      console.error('Error checking in employee:', error);
      throw error;
    }
  },

  // Check out employee
  checkOut: async (employeeId, checkOutData) => {
    try {
      const response = await api.post(`/attendance/check-out/${employeeId}`, checkOutData);
      return response.data;
    } catch (error) {
      console.error('Error checking out employee:', error);
      throw error;
    }
  },

  // Get employee attendance summary
  getEmployeeAttendanceSummary: async (employeeId, dateRange) => {
    try {
      const response = await api.get(`/attendance/employees/${employeeId}/summary`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee attendance summary:', error);
      throw error;
    }
  },

  // Get attendance statistics
  getAttendanceStatistics: async (dateRange) => {
    try {
      const response = await api.get('/attendance/statistics', {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      throw error;
    }
  },

  // Get attendance reports
  getAttendanceReports: async (reportType, filters = {}) => {
    try {
      const response = await api.get(`/attendance/reports/${reportType}`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance reports:', error);
      throw error;
    }
  },

  // Bulk update attendance
  bulkUpdateAttendance: async (attendanceUpdates) => {
    try {
      const response = await api.post('/attendance/bulk-update', attendanceUpdates);
      return response.data;
    } catch (error) {
      console.error('Error bulk updating attendance:', error);
      throw error;
    }
  },

  // Get attendance calendar
  getAttendanceCalendar: async (employeeId, month, year) => {
    try {
      const response = await api.get(`/attendance/calendar/${employeeId}`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance calendar:', error);
      throw error;
    }
  },

  // Get overtime records
  getOvertimeRecords: async (filters = {}) => {
    try {
      const response = await api.get('/attendance/overtime', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching overtime records:', error);
      throw error;
    }
  },

  // Approve overtime
  approveOvertime: async (overtimeId, approvalData) => {
    try {
      const response = await api.post(`/attendance/overtime/${overtimeId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      console.error('Error approving overtime:', error);
      throw error;
    }
  },

  // Get leave requests
  getLeaveRequests: async (filters = {}) => {
    try {
      const response = await api.get('/attendance/leave-requests', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  },

  // Submit leave request
  submitLeaveRequest: async (leaveRequestData) => {
    try {
      const response = await api.post('/attendance/leave-requests', leaveRequestData);
      return response.data;
    } catch (error) {
      console.error('Error submitting leave request:', error);
      throw error;
    }
  },

  // Approve leave request
  approveLeaveRequest: async (requestId, approvalData) => {
    try {
      const response = await api.post(`/attendance/leave-requests/${requestId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      console.error('Error approving leave request:', error);
      throw error;
    }
  },

  // --- Leave management APIs (with api.js and fallback) ---
  // In-memory fallback storage
  _mockLeaves: [
    { id: '1', cscName: 'Priya Patel', fromDate: '2025-02-01', toDate: '2025-02-03', leaveType: 'Casual', status: 'Approved', reason: 'Personal work' },
    { id: '2', cscName: 'Amit Kumar', fromDate: '2025-02-15', toDate: '2025-02-15', leaveType: 'Sick', status: 'Approved', reason: 'Medical appointment' }
  ],

  listLeaves: async (filters = {}) => {
    try {
      const response = await api.get('/attendance/leaves', { params: filters });
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error fetching leaves, using mock:', error);
      const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));
      await delay();
      return [...attendanceService._mockLeaves].reverse();
    }
  },

  getLeave: async (id) => {
    try {
      const response = await api.get(`/attendance/leaves/${id}`);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error fetching leave, using mock:', error);
      const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));
      await delay();
      return attendanceService._mockLeaves.find(l => l.id === String(id)) || null;
    }
  },

  requestLeave: async (leaveData) => {
    try {
      const response = await api.post('/attendance/leaves', leaveData);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error requesting leave, using mock:', error);
      const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));
      await delay();
      const id = String(Date.now());
      const item = {
        id,
        cscName: leaveData.cscName || 'Current User',
        fromDate: leaveData.fromDate,
        toDate: leaveData.toDate,
        leaveType: leaveData.leaveType,
        status: 'Pending',
        reason: leaveData.reason || ''
      };
      attendanceService._mockLeaves.push(item);
      return item;
    }
  },

  updateLeave: async (id, updates) => {
    try {
      const response = await api.put(`/attendance/leaves/${id}`, updates);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error updating leave, using mock:', error);
      const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));
      await delay();
      const idx = attendanceService._mockLeaves.findIndex(l => l.id === String(id));
      if (idx === -1) throw new Error('Leave not found');
      attendanceService._mockLeaves[idx] = { ...attendanceService._mockLeaves[idx], ...updates };
      return attendanceService._mockLeaves[idx];
    }
  },

  cancelLeave: async (id) => {
    return attendanceService.updateLeave(id, { status: 'Cancelled' });
  },

  approveLeave: async (id, approver) => {
    return attendanceService.updateLeave(id, { status: 'Approved', approvedBy: approver || 'admin', approvedAt: new Date().toISOString() });
  },

  rejectLeave: async (id, reason) => {
    return attendanceService.updateLeave(id, { status: 'Rejected', rejectedReason: reason || '', rejectedAt: new Date().toISOString() });
  },

  // Get attendance alerts
  getAttendanceAlerts: async () => {
    try {
      const response = await api.get('/attendance/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance alerts:', error);
      throw error;
    }
  },

  // Mark attendance alert as read
  markAttendanceAlertAsRead: async (alertId) => {
    try {
      const response = await api.put(`/attendance/alerts/${alertId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking attendance alert as read:', error);
      throw error;
    }
  },

  // Export attendance data
  exportAttendanceData: async (format = 'csv', filters = {}) => {
    try {
      const response = await api.post('/attendance/export', {
        format,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting attendance data:', error);
      throw error;
    }
  },

  // Import attendance data
  importAttendanceData: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('file', fileData);

      const response = await api.post('/attendance/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing attendance data:', error);
      throw error;
    }
  },

  // Get attendance settings
  getAttendanceSettings: async () => {
    try {
      const response = await api.get('/attendance/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance settings:', error);
      throw error;
    }
  },

  // Update attendance settings
  updateAttendanceSettings: async (settingsData) => {
    try {
      const response = await api.put('/attendance/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance settings:', error);
      throw error;
    }
  },

  // Get work schedules
  getWorkSchedules: async () => {
    try {
      const response = await api.get('/attendance/work-schedules');
      return response.data;
    } catch (error) {
      console.error('Error fetching work schedules:', error);
      throw error;
    }
  },

  // Create work schedule
  createWorkSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/attendance/work-schedules', scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating work schedule:', error);
      throw error;
    }
  },

  // Update work schedule
  updateWorkSchedule: async (scheduleId, scheduleData) => {
    try {
      const response = await api.put(`/attendance/work-schedules/${scheduleId}`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error updating work schedule:', error);
      throw error;
    }
  },

  // Delete work schedule
  deleteWorkSchedule: async (scheduleId) => {
    try {
      const response = await api.delete(`/attendance/work-schedules/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting work schedule:', error);
      throw error;
    }
  }
};

export default attendanceService;
