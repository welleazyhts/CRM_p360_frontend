import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
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
  Stack,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  BeachAccess as VacationIcon,
  LocalHospital as SickIcon,
  Work as WorkIcon,
  Event as EventIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as RegularizationIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import leaveService from '../../services/leaveService';

const LeaveManagementCalendar = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRegularizationDialog, setOpenRegularizationDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsType, setDetailsType] = useState('leave'); // 'leave' or 'regularization'
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [regularizationForm, setRegularizationForm] = useState({
    date: '',
    actualCheckIn: '',
    actualCheckOut: '',
    reason: '',
  });

  // Leave and regularization data from API
  const [leaves, setLeaves] = useState([]);
  const [regularizations, setRegularizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaves and regularizations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [leavesData, regularizationsData] = await Promise.all([
          leaveService.fetchLeaves(),
          leaveService.fetchRegularizations(),
        ]);
        setLeaves(leavesData);
        setRegularizations(regularizationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load data. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const leaveTypes = {
    'Casual Leave': { icon: EventIcon, color: theme.palette.info.main },
    'Sick Leave': { icon: SickIcon, color: theme.palette.error.main },
    'Earned Leave': { icon: VacationIcon, color: theme.palette.success.main },
    'Work From Home': { icon: WorkIcon, color: theme.palette.warning.main },
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getLeaveForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaves.filter((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
  };

  const handleAddLeave = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLeaveForm({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  const handleSubmitLeave = async () => {
    try {
      const leaveData = {
        employee: 'Current User',
        employeeId: 'EMP001',
        type: leaveForm.type,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        days: leaveService.calculateLeaveDays(leaveForm.startDate, leaveForm.endDate),
        reason: leaveForm.reason,
      };

      const newLeave = await leaveService.createLeave(leaveData);
      setLeaves([...leaves, newLeave]);
      setSnackbar({ open: true, message: 'Leave request submitted successfully!', severity: 'success' });
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting leave:', error);
      setSnackbar({ open: true, message: 'Failed to submit leave request.', severity: 'error' });
    }
  };

  // Approve leave
  const handleApproveLeave = async (leaveId) => {
    try {
      await leaveService.updateLeaveStatus(leaveId, 'Approved');
      setLeaves(leaves.map(leave =>
        leave.id === leaveId ? { ...leave, status: 'Approved' } : leave
      ));
      setSnackbar({ open: true, message: 'Leave request approved!', severity: 'success' });
    } catch (error) {
      console.error('Error approving leave:', error);
      setSnackbar({ open: true, message: 'Failed to approve leave request.', severity: 'error' });
    }
  };

  // Reject leave
  const handleRejectLeave = async (leaveId) => {
    try {
      await leaveService.updateLeaveStatus(leaveId, 'Rejected');
      setLeaves(leaves.map(leave =>
        leave.id === leaveId ? { ...leave, status: 'Rejected' } : leave
      ));
      setSnackbar({ open: true, message: 'Leave request rejected!', severity: 'error' });
    } catch (error) {
      console.error('Error rejecting leave:', error);
      setSnackbar({ open: true, message: 'Failed to reject leave request.', severity: 'error' });
    }
  };

  // Handle regularization dialog
  const handleOpenRegularizationDialog = () => {
    setOpenRegularizationDialog(true);
  };

  const handleCloseRegularizationDialog = () => {
    setOpenRegularizationDialog(false);
    setRegularizationForm({
      date: '',
      actualCheckIn: '',
      actualCheckOut: '',
      reason: '',
    });
  };

  const handleSubmitRegularization = async () => {
    try {
      const regularizationData = {
        employee: 'Current User',
        employeeId: 'EMP001',
        date: regularizationForm.date,
        scheduledCheckIn: '09:00',
        actualCheckIn: regularizationForm.actualCheckIn,
        scheduledCheckOut: '18:00',
        actualCheckOut: regularizationForm.actualCheckOut,
        reason: regularizationForm.reason,
      };

      const newRegularization = await leaveService.createRegularization(regularizationData);
      setRegularizations([...regularizations, newRegularization]);
      setSnackbar({ open: true, message: 'Regularization request submitted successfully!', severity: 'success' });
      handleCloseRegularizationDialog();
    } catch (error) {
      console.error('Error submitting regularization:', error);
      setSnackbar({ open: true, message: 'Failed to submit regularization request.', severity: 'error' });
    }
  };

  // Approve regularization
  const handleApproveRegularization = async (regId) => {
    try {
      await leaveService.updateRegularizationStatus(regId, 'Approved');
      setRegularizations(regularizations.map(reg =>
        reg.id === regId ? { ...reg, status: 'Approved' } : reg
      ));
      setSnackbar({ open: true, message: 'Regularization request approved!', severity: 'success' });
    } catch (error) {
      console.error('Error approving regularization:', error);
      setSnackbar({ open: true, message: 'Failed to approve regularization request.', severity: 'error' });
    }
  };

  // Reject regularization
  const handleRejectRegularization = async (regId) => {
    try {
      await leaveService.updateRegularizationStatus(regId, 'Rejected');
      setRegularizations(regularizations.map(reg =>
        reg.id === regId ? { ...reg, status: 'Rejected' } : reg
      ));
      setSnackbar({ open: true, message: 'Regularization request rejected!', severity: 'error' });
    } catch (error) {
      console.error('Error rejecting regularization:', error);
      setSnackbar({ open: true, message: 'Failed to reject regularization request.', severity: 'error' });
    }
  };

  // Handle view details
  const handleViewLeaveDetails = (leave) => {
    setSelectedItem(leave);
    setDetailsType('leave');
    setOpenDetailsDialog(true);
  };

  const handleViewRegularizationDetails = (reg) => {
    setSelectedItem(reg);
    setDetailsType('regularization');
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedItem(null);
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <ApprovedIcon />;
      case 'Pending':
        return <PendingIcon />;
      case 'Rejected':
        return <RejectedIcon />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.15), color: 'info.main' }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    12
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Leaves
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.15), color: 'success.main' }}>
                  <ApprovedIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    8
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Available
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.15), color: 'warning.main' }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    4
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Used
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.15), color: 'error.main' }}>
                  <VacationIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    2
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Calendar View" />
            <Tab label={`Leave Requests (${leaves.filter(l => l.status === 'Pending').length})`} />
            <Tab label={`Regularization Requests (${regularizations.filter(r => r.status === 'Pending').length})`} />
          </Tabs>
        </Box>
      </Card>

      <Grid container spacing={3}>
        {/* Calendar */}
        {activeTab === 0 && (
          <>
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Calendar Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight="700">
                      {monthName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={handlePrevMonth} size="small">
                        <ChevronLeftIcon />
                      </IconButton>
                      <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddLeave}>
                        Request Leave
                      </Button>
                      <IconButton onClick={handleNextMonth} size="small">
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Calendar Grid */}
                  <Box>
                    {/* Day Headers */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <Grid item xs key={day}>
                          <Typography
                            variant="caption"
                            fontWeight="700"
                            color="text.secondary"
                            align="center"
                            display="block"
                          >
                            {day}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Calendar Days */}
                    <Grid container spacing={1}>
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                        <Grid item xs key={`empty-${index}`}>
                          <Box sx={{ height: 80 }} />
                        </Grid>
                      ))}

                      {/* Calendar days */}
                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const leavesOnDate = getLeaveForDate(date);
                        const isToday =
                          date.toDateString() === new Date().toDateString();

                        return (
                          <Grid item xs key={day}>
                            <Box
                              onClick={() => handleDateClick(day)}
                              sx={{
                                height: 80,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                p: 1,
                                cursor: 'pointer',
                                bgcolor: isToday ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  transform: 'scale(1.02)',
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight={isToday ? 700 : 400}
                                color={isToday ? 'primary' : 'text.primary'}
                              >
                                {day}
                              </Typography>

                              {/* Leave indicators */}
                              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                                {leavesOnDate.slice(0, 2).map((leave) => {
                                  const LeaveIcon = leaveTypes[leave.type].icon;
                                  return (
                                    <Tooltip key={leave.id} title={`${leave.employee} - ${leave.type}`}>
                                      <Chip
                                        icon={<LeaveIcon sx={{ fontSize: 12 }} />}
                                        label={leave.employee.split(' ')[0]}
                                        size="small"
                                        sx={{
                                          height: 18,
                                          fontSize: 9,
                                          bgcolor: alpha(leaveTypes[leave.type].color, 0.1),
                                          color: leaveTypes[leave.type].color,
                                          '& .MuiChip-label': {
                                            px: 0.5,
                                          },
                                          '& .MuiChip-icon': {
                                            fontSize: 10,
                                            color: leaveTypes[leave.type].color,
                                          },
                                        }}
                                      />
                                    </Tooltip>
                                  );
                                })}
                                {leavesOnDate.length > 2 && (
                                  <Typography variant="caption" fontSize={8} color="text.secondary">
                                    +{leavesOnDate.length - 2} more
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>

                  {/* Legend */}
                  <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" fontWeight="600" gutterBottom display="block">
                      Leave Types:
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                      {Object.entries(leaveTypes).map(([type, config]) => {
                        const Icon = config.icon;
                        return (
                          <Chip
                            key={type}
                            icon={<Icon />}
                            label={type}
                            size="small"
                            sx={{
                              bgcolor: alpha(config.color, 0.1),
                              color: config.color,
                              '& .MuiChip-icon': {
                                color: config.color,
                              },
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Leave Requests List (Calendar View) */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="700" gutterBottom>
                    Recent Leave Requests
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    {leaves.slice(0, 5).map((leave) => {
                      const LeaveIcon = leaveTypes[leave.type].icon;
                      return (
                        <Paper
                          key={leave.id}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${alpha(leaveTypes[leave.type].color, 0.3)}`,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                bgcolor: alpha(leaveTypes[leave.type].color, 0.15),
                                color: leaveTypes[leave.type].color,
                                width: 40,
                                height: 40,
                              }}
                            >
                              <LeaveIcon fontSize="small" />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="600">
                                {leave.employee}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {leave.type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {leave.startDate} to {leave.endDate} ({leave.days} days)
                              </Typography>
                              <Chip
                                icon={getStatusIcon(leave.status)}
                                label={leave.status}
                                size="small"
                                color={getStatusColor(leave.status)}
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* Tab 1: Leave Requests */}
      {activeTab === 1 && (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="700">
                Leave Requests Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddLeave}
              >
                Request Leave
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Days</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Applied On</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((leave) => {
                    const LeaveIcon = leaveTypes[leave.type].icon;
                    return (
                      <TableRow key={leave.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {leave.employee}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {leave.employeeId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<LeaveIcon />}
                            label={leave.type}
                            size="small"
                            sx={{
                              bgcolor: alpha(leaveTypes[leave.type].color, 0.1),
                              color: leaveTypes[leave.type].color,
                              '& .MuiChip-icon': { color: leaveTypes[leave.type].color },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {leave.startDate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            to {leave.endDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={`${leave.days} day${leave.days > 1 ? 's' : ''}`} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {leave.reason}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {leave.appliedDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(leave.status)}
                            label={leave.status}
                            size="small"
                            color={getStatusColor(leave.status)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {leave.status === 'Pending' ? (
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleApproveLeave(leave.id)}
                                  sx={{
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                                  }}
                                >
                                  <CheckIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRejectLeave(leave.id)}
                                  sx={{
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          ) : (
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewLeaveDetails(leave)}
                                sx={{
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Regularization Requests */}
      {activeTab === 2 && (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="700">
                Attendance Regularization Requests
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenRegularizationDialog}
              >
                Request Regularization
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Applied On</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regularizations.map((reg) => (
                    <TableRow key={reg.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                            <RegularizationIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {reg.employee}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {reg.employeeId}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {reg.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Scheduled: {reg.scheduledCheckIn}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color={reg.actualCheckIn > reg.scheduledCheckIn ? 'error.main' : 'success.main'}
                          >
                            Actual: {reg.actualCheckIn}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Scheduled: {reg.scheduledCheckOut}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color={reg.actualCheckOut < reg.scheduledCheckOut ? 'error.main' : 'success.main'}
                          >
                            Actual: {reg.actualCheckOut}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {reg.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {reg.appliedDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(reg.status)}
                          label={reg.status}
                          size="small"
                          color={getStatusColor(reg.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {reg.status === 'Pending' ? (
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveRegularization(reg.id)}
                                sx={{
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectRegularization(reg.id)}
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewRegularizationDetails(reg)}
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Leave Request Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Request Leave</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={leaveForm.type}
                onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                label="Leave Type"
              >
                {Object.keys(leaveTypes).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Reason"
              multiline
              rows={3}
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitLeave}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Regularization Request Dialog */}
      <Dialog open={openRegularizationDialog} onClose={handleCloseRegularizationDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Request Attendance Regularization</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
            Use this form to regularize your attendance if you forgot to check-in/out or had timing issues.
          </Alert>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={regularizationForm.date}
              onChange={(e) => setRegularizationForm({ ...regularizationForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Actual Check-In Time"
                  type="time"
                  value={regularizationForm.actualCheckIn}
                  onChange={(e) => setRegularizationForm({ ...regularizationForm, actualCheckIn: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  helperText="Enter your actual check-in time"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Actual Check-Out Time"
                  type="time"
                  value={regularizationForm.actualCheckOut}
                  onChange={(e) => setRegularizationForm({ ...regularizationForm, actualCheckOut: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  helperText="Enter your actual check-out time"
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Reason for Regularization"
              multiline
              rows={4}
              value={regularizationForm.reason}
              onChange={(e) => setRegularizationForm({ ...regularizationForm, reason: e.target.value })}
              placeholder="Explain why you need to regularize your attendance..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseRegularizationDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitRegularization}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {detailsType === 'leave' ? 'Leave Request Details' : 'Regularization Request Details'}
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ pt: 2 }}>
              {detailsType === 'leave' ? (
                // Leave Details
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Employee Information
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {selectedItem.employee}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Employee ID: {selectedItem.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Leave Type
                      </Typography>
                      <Chip
                        icon={React.createElement(leaveTypes[selectedItem.type].icon)}
                        label={selectedItem.type}
                        sx={{
                          mt: 1,
                          bgcolor: alpha(leaveTypes[selectedItem.type].color, 0.1),
                          color: leaveTypes[selectedItem.type].color,
                          '& .MuiChip-icon': { color: leaveTypes[selectedItem.type].color },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status
                      </Typography>
                      <Chip
                        icon={getStatusIcon(selectedItem.status)}
                        label={selectedItem.status}
                        color={getStatusColor(selectedItem.status)}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Start Date
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                        {selectedItem.startDate}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        End Date
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                        {selectedItem.endDate}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Number of Days
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                        {selectedItem.days} day{selectedItem.days > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Applied On
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                        {selectedItem.appliedDate}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Reason for Leave
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Typography variant="body2">
                          {selectedItem.reason}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                // Regularization Details
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Employee Information
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                          <RegularizationIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {selectedItem.employee}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Employee ID: {selectedItem.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Date
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                        {selectedItem.date}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status
                      </Typography>
                      <Chip
                        icon={getStatusIcon(selectedItem.status)}
                        label={selectedItem.status}
                        color={getStatusColor(selectedItem.status)}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Check-In Time
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Scheduled
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {selectedItem.scheduledCheckIn}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Actual
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="600"
                          color={selectedItem.actualCheckIn > selectedItem.scheduledCheckIn ? 'error.main' : 'success.main'}
                        >
                          {selectedItem.actualCheckIn}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Check-Out Time
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Scheduled
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {selectedItem.scheduledCheckOut}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Actual
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="600"
                          color={selectedItem.actualCheckOut < selectedItem.scheduledCheckOut ? 'error.main' : 'success.main'}
                        >
                          {selectedItem.actualCheckOut}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Applied On
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5 }}>
                        {selectedItem.appliedDate}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Reason for Regularization
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Typography variant="body2">
                          {selectedItem.reason}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDetailsDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default LeaveManagementCalendar;
