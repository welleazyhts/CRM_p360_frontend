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
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

  // Mock attendance data with current dates
  const mockAttendanceData = [
    // Today's attendance
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Sales',
      position: 'Sales Executive',
      date: today,
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
      createdAt: `${today}T09:15:00Z`
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      position: 'Marketing Manager',
      date: today,
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
      createdAt: `${today}T08:45:00Z`
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Mike Wilson',
      department: 'IT',
      position: 'Software Developer',
      date: today,
      checkIn: '09:30',
      checkOut: '18:45',
      breakStart: '13:00',
      breakEnd: '14:00',
      totalHours: 8.25,
      overtimeHours: 0.25,
      status: 'Present',
      location: 'Remote',
      device: 'Laptop',
      ipAddress: '192.168.1.102',
      notes: 'Working from home',
      isLate: true,
      isEarlyLeave: false,
      createdAt: `${today}T09:30:00Z`
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      department: 'HR',
      position: 'HR Specialist',
      date: today,
      checkIn: '09:00',
      checkOut: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.103',
      notes: 'Employee interviews',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${today}T09:00:00Z`
    },
    {
      id: 5,
      employeeId: 'EMP005',
      employeeName: 'David Brown',
      department: 'Finance',
      position: 'Accountant',
      date: today,
      checkIn: '08:30',
      checkOut: '17:30',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.104',
      notes: 'Monthly reports',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${today}T08:30:00Z`
    },
    // Yesterday's attendance
    {
      id: 6,
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Sales',
      position: 'Sales Executive',
      date: yesterday,
      checkIn: '09:00',
      checkOut: '19:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 9.0,
      overtimeHours: 1.0,
      status: 'Overtime',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.100',
      notes: 'Important client meeting',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${yesterday}T09:00:00Z`
    },
    {
      id: 7,
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      position: 'Marketing Manager',
      date: yesterday,
      checkIn: '09:10',
      checkOut: '17:00',
      breakStart: '12:30',
      breakEnd: '13:30',
      totalHours: 6.83,
      overtimeHours: 0,
      status: 'Early Leave',
      location: 'Office',
      device: 'Laptop',
      ipAddress: '192.168.1.101',
      notes: 'Doctor appointment',
      isLate: true,
      isEarlyLeave: true,
      createdAt: `${yesterday}T09:10:00Z`
    },
    {
      id: 8,
      employeeId: 'EMP003',
      employeeName: 'Mike Wilson',
      department: 'IT',
      position: 'Software Developer',
      date: yesterday,
      checkIn: '09:00',
      checkOut: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Remote',
      device: 'Laptop',
      ipAddress: '192.168.1.102',
      notes: 'Sprint planning',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${yesterday}T09:00:00Z`
    },
    {
      id: 9,
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      department: 'HR',
      position: 'HR Specialist',
      date: yesterday,
      checkIn: null,
      checkOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 0,
      overtimeHours: 0,
      status: 'Absent',
      location: null,
      device: null,
      ipAddress: null,
      notes: 'Sick leave',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${yesterday}T00:00:00Z`
    },
    {
      id: 10,
      employeeId: 'EMP005',
      employeeName: 'David Brown',
      department: 'Finance',
      position: 'Accountant',
      date: yesterday,
      checkIn: '08:45',
      checkOut: '17:45',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.104',
      notes: 'Budget review',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${yesterday}T08:45:00Z`
    },
    // Two days ago
    {
      id: 11,
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Sales',
      position: 'Sales Executive',
      date: twoDaysAgo,
      checkIn: '09:00',
      checkOut: '14:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 4.0,
      overtimeHours: 0,
      status: 'Half Day',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.100',
      notes: 'Personal work',
      isLate: false,
      isEarlyLeave: true,
      createdAt: `${twoDaysAgo}T09:00:00Z`
    },
    {
      id: 12,
      employeeId: 'EMP002',
      employeeName: 'Sarah Johnson',
      department: 'Marketing',
      position: 'Marketing Manager',
      date: twoDaysAgo,
      checkIn: '09:00',
      checkOut: '18:00',
      breakStart: '12:30',
      breakEnd: '13:30',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Client Site',
      device: 'Laptop',
      ipAddress: '192.168.1.101',
      notes: 'Client presentation',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${twoDaysAgo}T09:00:00Z`
    },
    {
      id: 13,
      employeeId: 'EMP003',
      employeeName: 'Mike Wilson',
      department: 'IT',
      position: 'Software Developer',
      date: twoDaysAgo,
      checkIn: '10:00',
      checkOut: '19:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Late',
      location: 'Remote',
      device: 'Laptop',
      ipAddress: '192.168.1.102',
      notes: 'Traffic issues',
      isLate: true,
      isEarlyLeave: false,
      createdAt: `${twoDaysAgo}T10:00:00Z`
    },
    {
      id: 14,
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      department: 'HR',
      position: 'HR Specialist',
      date: twoDaysAgo,
      checkIn: '09:00',
      checkOut: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.103',
      notes: 'Training session',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${twoDaysAgo}T09:00:00Z`
    },
    {
      id: 15,
      employeeId: 'EMP005',
      employeeName: 'David Brown',
      department: 'Finance',
      position: 'Accountant',
      date: twoDaysAgo,
      checkIn: '08:30',
      checkOut: '17:30',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.0,
      overtimeHours: 0,
      status: 'Present',
      location: 'Office',
      device: 'Desktop',
      ipAddress: '192.168.1.104',
      notes: 'Audit preparation',
      isLate: false,
      isEarlyLeave: false,
      createdAt: `${twoDaysAgo}T08:30:00Z`
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
