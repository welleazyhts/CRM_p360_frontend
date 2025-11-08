import React, { createContext, useContext, useState, useEffect } from 'react';

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  // Mock attendance data
  const mockAttendanceData = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Sales',
      position: 'Sales Executive',
      date: '2024-01-15',
      checkIn: '09:15',
      checkOut: '18:30',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.25,
      overtimeHours: 0.25,
      status: 'Present',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.100',
      notes: 'Regular working day',
      isLate: false,
      isEarlyLeave: false,
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      position: 'Marketing Manager',
      date: '2024-01-15',
      checkIn: '08:45',
      checkOut: '17:45',
      breakStart: '12:30',
      breakEnd: '13:30',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Office',
      device: 'Laptop',
      ipAddress: '192.168.1.101',
      notes: 'Team meeting in the morning',
      isLate: false,
      isEarlyLeave: false,
      createdAt: '2024-01-15T08:45:00Z'
    }
  ];

  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [currentUserAttendance, setCurrentUserAttendance] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Check current user's attendance status on component mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const currentUser = 'EMP001'; // Mock current user ID
    
    const todayAttendance = attendanceData.find(record => 
      record.employeeId === currentUser && record.date === today
    );
    
    if (todayAttendance) {
      setCurrentUserAttendance(todayAttendance);
      setIsClockedIn(!!todayAttendance.checkIn && !todayAttendance.checkOut);
      setClockInTime(todayAttendance.checkIn);
    }
  }, [attendanceData]);

  // Clock in function
  const handleClockIn = () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    const currentDate = now.toISOString().split('T')[0];
    
    // Mock current user (in real app, this would come from auth context)
    const currentUser = {
      id: 'EMP001',
      name: 'John Smith',
      department: 'Sales',
      position: 'Sales Executive'
    };

    const newAttendance = {
      id: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      position: currentUser.position,
      date: currentDate,
      checkIn: currentTime,
      checkOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.100',
      notes: 'Quick clock in',
      isLate: false,
      isEarlyLeave: false,
      createdAt: now.toISOString()
    };

    setAttendanceData(prev => [newAttendance, ...prev]);
    setCurrentUserAttendance(newAttendance);
    setIsClockedIn(true);
    setClockInTime(currentTime);
    
    setSnackbar({
      open: true,
      message: `Clocked in at ${currentTime}`,
      severity: 'success'
    });
  };

  // Clock out function
  const handleClockOut = () => {
    if (!currentUserAttendance) return;

    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    
    // Calculate total hours
    const checkInTime = new Date(`${currentUserAttendance.date}T${currentUserAttendance.checkIn}:00`);
    const checkOutTime = new Date(`${currentUserAttendance.date}T${currentTime}:00`);
    const totalMs = checkOutTime - checkInTime;
    const totalHours = Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
    const overtimeHours = totalHours > 8 ? totalHours - 8 : 0;

    const updatedAttendance = {
      ...currentUserAttendance,
      checkOut: currentTime,
      totalHours,
      overtimeHours,
      status: totalHours >= 8 ? 'Present' : 'Half Day'
    };

    setAttendanceData(prev => 
      prev.map(record => 
        record.id === currentUserAttendance.id ? updatedAttendance : record
      )
    );
    
    setCurrentUserAttendance(null);
    setIsClockedIn(false);
    setClockInTime(null);
    
    setSnackbar({
      open: true,
      message: `Clocked out at ${currentTime}. Total hours: ${totalHours}h`,
      severity: 'success'
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const value = {
    attendanceData,
    setAttendanceData,
    currentUserAttendance,
    isClockedIn,
    clockInTime,
    snackbar,
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
