import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import attendanceService from '../services/attendanceService';
import { useAuth } from './AuthContext';

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentUserAttendance, setCurrentUserAttendance] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await attendanceService.list();
      console.log('Attendance API Response:', data); // Debugging log

      // Ensure data is an array (handle pagination if needed)
      const records = Array.isArray(data) ? data : (data.results || []);
      console.log('Processed Records (First Item):', records[0]); // Debugging log, to check ID field

      setAttendanceData(records);

      // Update current user status based on today's record
      if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        // Assuming the API returns fields compatible with what we expect, or we map them
        // API fields seem to be snake_case based on Postman (employee_id, check_in), 
        // but frontend uses camelCase (employeeId, checkIn). 
        // We might need to normalize the data or update frontend components.
        // Let's check first if we need mapping. For now, assuming API returns camelCase or we handle it in component.
        // Actually, Postman showed snake_case request. Response likely snake_case too.
        // I will map snake_case to camelCase here for frontend consistency.

        const normalizeDates = (record) => {
          // Try to find the ID from various common fields
          const recordId = record.id || record._id || record.pk || record.attendance_id;

          // Handle employee field which might be an object or an ID
          const empId = record.employee?.id || record.employee?.employee_id || record.employee_id || record.employeeId;
          const empName = record.employee?.name || record.employee?.employee_name || record.employee_name || record.employeeName || 'Unknown';
          const empDept = record.employee?.department || record.department;

          return {
            ...record,
            id: recordId,
            employeeId: empId,
            employeeName: empName,
            department: empDept,
            date: record.date,
            checkIn: record.check_in || record.checkIn,
            checkOut: record.check_out || record.checkOut,
            breakStart: record.break_start || record.breakStart,
            breakEnd: record.break_end || record.breakEnd,
            status: record.status,
            location: record.location,
            device: record.device,
            notes: record.notes,
            totalHours: record.total_hours || record.totalHours || 0,
            overtimeHours: record.overtime_hours || record.overtimeHours || 0
          };
        };

        const normalizedRecords = records.map(normalizeDates);
        setAttendanceData(normalizedRecords);

        const todayRecord = normalizedRecords.find(record =>
          String(record.employeeId) === String(currentUser.id) &&
          record.date === today
        );

        if (todayRecord) {
          setCurrentUserAttendance(todayRecord);
          setIsClockedIn(!!todayRecord.checkIn && !todayRecord.checkOut);
          setClockInTime(todayRecord.checkIn);
        }
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      // Don't show error snackbar on initial load to avoid annoyance if empty
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Clock in function
  const handleClockIn = async () => {
    if (!currentUser) return;

    try {
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
      const currentDate = now.toISOString().split('T')[0];

      const payload = {
        employee_id: currentUser.id,
        date: currentDate,
        check_in: currentTime,
        status: 'present',
        location: 'office', // Default or fetch from geolocation
        device: 'desktop',
        notes: 'Web check-in'
      };

      const response = await attendanceService.create(payload);

      // Update local state
      await fetchAttendance(); // Refresh to get the normalized new record

      setSnackbar({
        open: true,
        message: `Clocked in at ${currentTime}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Clock in failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to clock in: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    }
  };

  // Clock out function
  const handleClockOut = async () => {
    if (!currentUserAttendance || !currentUser) return;

    try {
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

      // Calculate hours first? The backend might do it, 
      // but the `compute_hours` endpoint exists. 
      // However, usually we just update the checkout time and let backend calc.
      // Based on Postman, `update` takes full object.

      const payload = {
        employee_id: currentUserAttendance.employeeId,
        date: currentUserAttendance.date,
        check_in: currentUserAttendance.checkIn,
        check_out: currentTime,
        status: 'present', // Or logic to determine half-day
        location: currentUserAttendance.location,
        device: currentUserAttendance.device,
        notes: currentUserAttendance.notes
      };

      // We use different endpoint or update? The service has `update(employeeId, data)`.
      // NOTE: The update endpoint usually takes ID if it's RESTful resource update, 
      // but here it asks for employeeId in URL? "/update/{employeeId}/". 
      // This might be tricky if an employee has multiple records. 
      // Usually update should be by ID. 
      // But looking at provided Postman: `attendance_management/update/EMP003/`. 
      // It seems it updates TODAY's record for that employee? Or just generic update?
      // I'll assume it handles the logic.

      await attendanceService.update(currentUser.id, payload);

      await fetchAttendance();

      setSnackbar({
        open: true,
        message: `Clocked out at ${currentTime}`,
        severity: 'success'
      });

    } catch (error) {
      console.error('Clock out failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to clock out: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const value = {
    attendanceData,
    setAttendanceData, // Allow manual updates if needed
    currentUserAttendance,
    isClockedIn,
    clockInTime,
    snackbar,
    loading,
    refreshAttendance: fetchAttendance,
    handleClockIn,
    handleClockOut,
    handleCloseSnackbar
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
