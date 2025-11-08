import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Pagination,
  useTheme,
  alpha,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  PlayArrow as CheckInIcon,
  Stop as CheckOutIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Computer as ComputerIcon,
  Tablet as TabletIcon
} from '@mui/icons-material';


const AttendanceManagement = () => {
  const theme = useTheme();
  const { attendanceData, setAttendanceData } = useAttendance();
  const [filteredData, setFilteredData] = useState(attendanceData);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    position: '',
    date: '',
    checkIn: '',
    checkOut: '',
    breakStart: '',
    breakEnd: '',
    status: 'Present',
    location: 'Office',
    device: 'Desktop',
    notes: ''
  });

  // Mock employees
  const employees = [
    { id: 'EMP001', name: 'John Smith', department: 'Sales', position: 'Sales Executive' },
    { id: 'EMP002', name: 'Sarah Johnson', department: 'Marketing', position: 'Marketing Manager' },
    { id: 'EMP003', name: 'Mike Wilson', department: 'IT', position: 'Software Developer' },
    { id: 'EMP004', name: 'Emily Davis', department: 'HR', position: 'HR Specialist' },
    { id: 'EMP005', name: 'David Brown', department: 'Finance', position: 'Accountant' }
  ];

  const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];
  const statusOptions = ['Present', 'Absent', 'Half Day', 'Late', 'Early Leave', 'Overtime'];
  const locationOptions = ['Office', 'Remote', 'Client Site', 'Field'];
  const deviceOptions = ['Desktop', 'Laptop', 'Mobile', 'Tablet'];

  // Filter data
  useEffect(() => {
    let filtered = attendanceData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== 'All') {
      filtered = filtered.filter(record => record.department === departmentFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(record => record.date === dateFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [attendanceData, searchTerm, statusFilter, departmentFilter, dateFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate attendance statistics
  const attendanceStats = {
    totalEmployees: employees.length,
    presentToday: attendanceData.filter(record => record.status === 'Present').length,
    absentToday: attendanceData.filter(record => record.status === 'Absent').length,
    lateToday: attendanceData.filter(record => record.isLate).length,
    averageHours: attendanceData.reduce((sum, record) => sum + record.totalHours, 0) / attendanceData.length,
    totalOvertime: attendanceData.reduce((sum, record) => sum + record.overtimeHours, 0)
  };

  // Handle dialog operations
  const handleOpenDialog = (attendance = null) => {
    if (attendance) {
      setEditingAttendance(attendance);
      setFormData({
        employeeId: attendance.employeeId,
        employeeName: attendance.employeeName,
        department: attendance.department,
        position: attendance.position,
        date: attendance.date,
        checkIn: attendance.checkIn || '',
        checkOut: attendance.checkOut || '',
        breakStart: attendance.breakStart || '',
        breakEnd: attendance.breakEnd || '',
        status: attendance.status,
        location: attendance.location || 'Office',
        device: attendance.device || 'Desktop',
        notes: attendance.notes || ''
      });
    } else {
      setEditingAttendance(null);
      setFormData({
        employeeId: '',
        employeeName: '',
        department: '',
        position: '',
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        breakStart: '',
        breakEnd: '',
        status: 'Present',
        location: 'Office',
        device: 'Desktop',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAttendance(null);
  };

  const handleSaveAttendance = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (editingAttendance) {
        // Update existing attendance
        const updatedData = attendanceData.map(record =>
          record.id === editingAttendance.id
            ? {
                ...record,
                ...formData,
                totalHours: calculateTotalHours(formData.checkIn, formData.checkOut, formData.breakStart, formData.breakEnd),
                updatedAt: new Date().toISOString()
              }
            : record
        );
        setAttendanceData(updatedData);
        setSnackbar({ open: true, message: 'Attendance updated successfully!', severity: 'success' });
      } else {
        // Add new attendance
        const newAttendance = {
          id: Math.max(...attendanceData.map(r => r.id)) + 1,
          ...formData,
          totalHours: calculateTotalHours(formData.checkIn, formData.checkOut, formData.breakStart, formData.breakEnd),
          overtimeHours: 0,
          isLate: false,
          isEarlyLeave: false,
          ipAddress: '192.168.1.100',
          createdAt: new Date().toISOString()
        };
        setAttendanceData([...attendanceData, newAttendance]);
        setSnackbar({ open: true, message: 'Attendance record added successfully!', severity: 'success' });
      }
      
      setLoading(false);
      handleCloseDialog();
    }, 1000);
  };

  // Calculate total hours
  const calculateTotalHours = (checkIn, checkOut, breakStart, breakEnd) => {
    if (!checkIn || !checkOut) return 0;
    
    const checkInTime = new Date(`2000-01-01T${checkIn}`);
    const checkOutTime = new Date(`2000-01-01T${checkOut}`);
    const breakStartTime = breakStart ? new Date(`2000-01-01T${breakStart}`) : null;
    const breakEndTime = breakEnd ? new Date(`2000-01-01T${breakEnd}`) : null;
    
    let totalMs = checkOutTime - checkInTime;
    
    if (breakStartTime && breakEndTime) {
      totalMs -= (breakEndTime - breakStartTime);
    }
    
    return Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Present': theme.palette.success.main,
      'Absent': theme.palette.error.main,
      'Half Day': theme.palette.warning.main,
      'Late': theme.palette.error.dark,
      'Early Leave': theme.palette.warning.dark,
      'Overtime': theme.palette.info.main
    };
    return colors[status] || theme.palette.grey[500];
  };


  // Handle employee selection
  const handleEmployeeChange = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setFormData({
        ...formData,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        position: employee.position
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600" color="primary">
          Attendance Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Attendance
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="primary.main">
                {attendanceStats.totalEmployees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {attendanceStats.presentToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="error.main">
                {attendanceStats.absentToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Absent Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {attendanceStats.lateToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Late Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="info.main">
                {attendanceStats.averageHours.toFixed(1)}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card className="healthcare-card" sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Today's Attendance" />
            <Tab label="Attendance History" />
            <Tab label="Reports" />
          </Tabs>
        </Box>
      </Card>

      {/* Filters */}
      <Card className="healthcare-card" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Department"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="All">All Departments</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setDepartmentFilter('All');
                  setDateFilter('');
                }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="healthcare-card">
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {record.employeeName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {record.employeeId} • {record.department}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(record.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckInIcon sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                        <Typography variant="body2">
                          {record.checkIn || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckOutIcon sx={{ mr: 1, color: 'error.main', fontSize: 16 }} />
                        <Typography variant="body2">
                          {record.checkOut || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {record.totalHours}h
                        {record.overtimeHours > 0 && (
                          <Chip
                            label={`+${record.overtimeHours}h OT`}
                            size="small"
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                            color="info"
                          />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(record.status), 0.1),
                          color: getStatusColor(record.status),
                          border: `1px solid ${alpha(getStatusColor(record.status), 0.3)}`
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {record.location || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {record.device === 'Desktop' && <ComputerIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />}
                        {record.device === 'Laptop' && <ComputerIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />}
                        {record.device === 'Mobile' && <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />}
                        {record.device === 'Tablet' && <TabletIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />}
                        <Typography variant="body2">
                          {record.device || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleOpenDialog(record)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Attendance">
                          <IconButton size="small" onClick={() => handleOpenDialog(record)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Actions">
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Attendance Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAttendance ? 'Edit Attendance' : 'Add Attendance Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={formData.employeeId}
                  label="Employee"
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                >
                  {employees.map(employee => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.department})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check In Time"
                type="time"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Check Out Time"
                type="time"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Break Start"
                type="time"
                value={formData.breakStart}
                onChange={(e) => setFormData({ ...formData, breakStart: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Break End"
                type="time"
                value={formData.breakEnd}
                onChange={(e) => setFormData({ ...formData, breakEnd: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location}
                  label="Location"
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  {locationOptions.map(location => (
                    <MenuItem key={location} value={location}>{location}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select
                  value={formData.device}
                  label="Device"
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                >
                  {deviceOptions.map(device => (
                    <MenuItem key={device} value={device}>{device}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about attendance..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveAttendance}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (editingAttendance ? 'Update' : 'Save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendanceManagement;
