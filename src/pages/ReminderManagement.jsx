import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Alert,
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Notifications as ReminderIcon,
  NotificationsActive as ActiveReminderIcon,
  NotificationsOff as MutedReminderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CompleteIcon,
  Snooze as SnoozeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  EventNote as EventIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Reminder Types
const REMINDER_TYPES = {
  CALL: 'call',
  FOLLOW_UP: 'follow_up',
  QUOTE: 'quote',
  DOCUMENT: 'document',
  PAYMENT: 'payment',
  RENEWAL: 'renewal',
  CUSTOM: 'custom'
};

// Reminder Priority
const REMINDER_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Reminder Status
const REMINDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  SNOOZED: 'snoozed',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

const ReminderManagement = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);

  // New reminder form
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    type: REMINDER_TYPES.FOLLOW_UP,
    priority: REMINDER_PRIORITY.MEDIUM,
    dueDate: '',
    dueTime: '',
    leadId: '',
    leadName: '',
    recurring: false,
    recurringInterval: 'daily',
    notifyVia: {
      email: false,
      sms: false,
      whatsapp: false,
      inApp: true
    }
  });

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = () => {
    setLoading(true);
    // Mock data
    const mockReminders = [
      {
        id: 'REM-001',
        title: 'Follow-up call with Rajesh Kumar',
        description: 'Discuss premium quote and answer queries',
        type: REMINDER_TYPES.CALL,
        priority: REMINDER_PRIORITY.HIGH,
        status: REMINDER_STATUS.OVERDUE,
        dueDate: '2025-01-17T10:00:00',
        leadId: 'LEAD-001',
        leadName: 'Rajesh Kumar',
        createdBy: 'Agent A',
        recurring: false,
        notifyVia: ['email', 'in_app']
      },
      {
        id: 'REM-002',
        title: 'Send quote to Priya Sharma',
        description: 'Two-wheeler comprehensive insurance quote',
        type: REMINDER_TYPES.QUOTE,
        priority: REMINDER_PRIORITY.MEDIUM,
        status: REMINDER_STATUS.PENDING,
        dueDate: '2025-01-19T14:00:00',
        leadId: 'LEAD-002',
        leadName: 'Priya Sharma',
        createdBy: 'Agent B',
        recurring: false,
        notifyVia: ['in_app']
      },
      {
        id: 'REM-003',
        title: 'Collect RC copy from Amit Patel',
        description: 'Required for policy issuance',
        type: REMINDER_TYPES.DOCUMENT,
        priority: REMINDER_PRIORITY.HIGH,
        status: REMINDER_STATUS.PENDING,
        dueDate: '2025-01-18T16:30:00',
        leadId: 'LEAD-003',
        leadName: 'Amit Patel',
        createdBy: 'Agent A',
        recurring: false,
        notifyVia: ['whatsapp', 'in_app']
      },
      {
        id: 'REM-004',
        title: 'Payment follow-up - Sneha Reddy',
        description: 'Policy pending due to payment',
        type: REMINDER_TYPES.PAYMENT,
        priority: REMINDER_PRIORITY.HIGH,
        status: REMINDER_STATUS.SNOOZED,
        dueDate: '2025-01-20T11:00:00',
        snoozedUntil: '2025-01-19T09:00:00',
        leadId: 'LEAD-004',
        leadName: 'Sneha Reddy',
        createdBy: 'Agent C',
        recurring: false,
        notifyVia: ['sms', 'email', 'in_app']
      },
      {
        id: 'REM-005',
        title: 'Policy renewal reminder - Vikram Singh',
        description: 'Policy expiring in 15 days',
        type: REMINDER_TYPES.RENEWAL,
        priority: REMINDER_PRIORITY.MEDIUM,
        status: REMINDER_STATUS.PENDING,
        dueDate: '2025-01-25T09:00:00',
        leadId: 'LEAD-005',
        leadName: 'Vikram Singh',
        createdBy: 'System',
        recurring: true,
        recurringInterval: 'weekly',
        notifyVia: ['email', 'whatsapp', 'in_app']
      },
      {
        id: 'REM-006',
        title: 'Follow-up completed - Maria Garcia',
        description: 'Successfully converted to customer',
        type: REMINDER_TYPES.FOLLOW_UP,
        priority: REMINDER_PRIORITY.LOW,
        status: REMINDER_STATUS.COMPLETED,
        dueDate: '2025-01-15T14:00:00',
        completedAt: '2025-01-15T14:30:00',
        leadId: 'LEAD-006',
        leadName: 'Maria Garcia',
        createdBy: 'Agent B',
        recurring: false,
        notifyVia: ['in_app']
      }
    ];

    setReminders(mockReminders);
    setLoading(false);
  };

  const handleCreateReminder = () => {
    const reminder = {
      id: `REM-${Date.now()}`,
      ...newReminder,
      status: REMINDER_STATUS.PENDING,
      dueDate: `${newReminder.dueDate}T${newReminder.dueTime}:00`,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      notifyVia: Object.keys(newReminder.notifyVia).filter(key => newReminder.notifyVia[key])
    };

    setReminders([...reminders, reminder]);
    setCreateDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setNewReminder({
      title: '',
      description: '',
      type: REMINDER_TYPES.FOLLOW_UP,
      priority: REMINDER_PRIORITY.MEDIUM,
      dueDate: '',
      dueTime: '',
      leadId: '',
      leadName: '',
      recurring: false,
      recurringInterval: 'daily',
      notifyVia: {
        email: false,
        sms: false,
        whatsapp: false,
        inApp: true
      }
    });
  };

  const handleCompleteReminder = (id) => {
    setReminders(reminders.map(r =>
      r.id === id
        ? { ...r, status: REMINDER_STATUS.COMPLETED, completedAt: new Date().toISOString() }
        : r
    ));
  };

  const handleSnoozeReminder = (id, hours = 2) => {
    const snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    setReminders(reminders.map(r =>
      r.id === id
        ? { ...r, status: REMINDER_STATUS.SNOOZED, snoozedUntil }
        : r
    ));
  };

  const handleDeleteReminder = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      [REMINDER_PRIORITY.HIGH]: 'error',
      [REMINDER_PRIORITY.MEDIUM]: 'warning',
      [REMINDER_PRIORITY.LOW]: 'info'
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      [REMINDER_STATUS.PENDING]: 'primary',
      [REMINDER_STATUS.COMPLETED]: 'success',
      [REMINDER_STATUS.SNOOZED]: 'warning',
      [REMINDER_STATUS.OVERDUE]: 'error',
      [REMINDER_STATUS.CANCELLED]: 'default'
    };
    return colors[status] || 'default';
  };

  const getTypeIcon = (type) => {
    const icons = {
      [REMINDER_TYPES.CALL]: <PhoneIcon />,
      [REMINDER_TYPES.FOLLOW_UP]: <EventIcon />,
      [REMINDER_TYPES.QUOTE]: <EmailIcon />,
      [REMINDER_TYPES.DOCUMENT]: <EventIcon />,
      [REMINDER_TYPES.PAYMENT]: <EmailIcon />,
      [REMINDER_TYPES.RENEWAL]: <ActiveReminderIcon />,
      [REMINDER_TYPES.CUSTOM]: <ReminderIcon />
    };
    return icons[type] || <ReminderIcon />;
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.leadName.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (tabValue === 1) matchesTab = reminder.status === REMINDER_STATUS.PENDING;
    if (tabValue === 2) matchesTab = reminder.status === REMINDER_STATUS.OVERDUE;
    if (tabValue === 3) matchesTab = reminder.status === REMINDER_STATUS.COMPLETED;

    return matchesSearch && matchesTab;
  });

  const stats = {
    total: reminders.length,
    pending: reminders.filter(r => r.status === REMINDER_STATUS.PENDING).length,
    overdue: reminders.filter(r => r.status === REMINDER_STATUS.OVERDUE).length,
    completed: reminders.filter(r => r.status === REMINDER_STATUS.COMPLETED).length,
    today: reminders.filter(r => {
      const dueDate = new Date(r.dueDate);
      const today = new Date();
      return dueDate.toDateString() === today.toDateString();
    }).length
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Reminder Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your follow-up reminders
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadReminders}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            Create Reminder
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Reminders
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="primary">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" color="error">{stats.overdue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Due Today
              </Typography>
              <Typography variant="h4" color="warning.main">{stats.today}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search reminders by title or lead name..."
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
        </CardContent>
      </Card>

      {/* Reminders Table */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${stats.total})`} />
          <Tab label={`Pending (${stats.pending})`} />
          <Tab label={`Overdue (${stats.overdue})`} />
          <Tab label={`Completed (${stats.completed})`} />
        </Tabs>

        <CardContent>
          {loading && <LinearProgress />}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notify Via</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReminders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((reminder) => (
                    <TableRow key={reminder.id} hover>
                      <TableCell>
                        <Tooltip title={reminder.type}>
                          <IconButton size="small">
                            {getTypeIcon(reminder.type)}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {reminder.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reminder.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{reminder.leadName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reminder.leadId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(reminder.dueDate).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reminder.priority}
                          size="small"
                          color={getPriorityColor(reminder.priority)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reminder.status}
                          size="small"
                          color={getStatusColor(reminder.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          {reminder.notifyVia.includes('email') && (
                            <Tooltip title="Email"><EmailIcon fontSize="small" color="primary" /></Tooltip>
                          )}
                          {reminder.notifyVia.includes('sms') && (
                            <Tooltip title="SMS"><SmsIcon fontSize="small" color="primary" /></Tooltip>
                          )}
                          {reminder.notifyVia.includes('whatsapp') && (
                            <Tooltip title="WhatsApp"><WhatsAppIcon fontSize="small" color="success" /></Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          {reminder.status !== REMINDER_STATUS.COMPLETED && (
                            <>
                              <Tooltip title="Complete">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleCompleteReminder(reminder.id)}
                                >
                                  <CompleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Snooze 2h">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleSnoozeReminder(reminder.id, 2)}
                                >
                                  <SnoozeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteReminder(reminder.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredReminders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Create Reminder Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Reminder</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newReminder.type}
                  label="Type"
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                >
                  <MenuItem value={REMINDER_TYPES.CALL}>Call</MenuItem>
                  <MenuItem value={REMINDER_TYPES.FOLLOW_UP}>Follow-up</MenuItem>
                  <MenuItem value={REMINDER_TYPES.QUOTE}>Quote</MenuItem>
                  <MenuItem value={REMINDER_TYPES.DOCUMENT}>Document</MenuItem>
                  <MenuItem value={REMINDER_TYPES.PAYMENT}>Payment</MenuItem>
                  <MenuItem value={REMINDER_TYPES.RENEWAL}>Renewal</MenuItem>
                  <MenuItem value={REMINDER_TYPES.CUSTOM}>Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newReminder.priority}
                  label="Priority"
                  onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
                >
                  <MenuItem value={REMINDER_PRIORITY.HIGH}>High</MenuItem>
                  <MenuItem value={REMINDER_PRIORITY.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={REMINDER_PRIORITY.LOW}>Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lead ID"
                value={newReminder.leadId}
                onChange={(e) => setNewReminder({ ...newReminder, leadId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lead Name"
                value={newReminder.leadName}
                onChange={(e) => setNewReminder({ ...newReminder, leadName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={newReminder.dueDate}
                onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Time"
                type="time"
                value={newReminder.dueTime}
                onChange={(e) => setNewReminder({ ...newReminder, dueTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Notify Via</Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <FormControlLabel
                  control={
                    <Switch
                      checked={newReminder.notifyVia.email}
                      onChange={(e) => setNewReminder({
                        ...newReminder,
                        notifyVia: { ...newReminder.notifyVia, email: e.target.checked }
                      })}
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newReminder.notifyVia.sms}
                      onChange={(e) => setNewReminder({
                        ...newReminder,
                        notifyVia: { ...newReminder.notifyVia, sms: e.target.checked }
                      })}
                    />
                  }
                  label="SMS"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newReminder.notifyVia.whatsapp}
                      onChange={(e) => setNewReminder({
                        ...newReminder,
                        notifyVia: { ...newReminder.notifyVia, whatsapp: e.target.checked }
                      })}
                    />
                  }
                  label="WhatsApp"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={newReminder.notifyVia.inApp}
                      onChange={(e) => setNewReminder({
                        ...newReminder,
                        notifyVia: { ...newReminder.notifyVia, inApp: e.target.checked }
                      })}
                    />
                  }
                  label="In-App"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newReminder.recurring}
                    onChange={(e) => setNewReminder({ ...newReminder, recurring: e.target.checked })}
                  />
                }
                label="Recurring Reminder"
              />
            </Grid>
            {newReminder.recurring && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Recurring Interval</InputLabel>
                  <Select
                    value={newReminder.recurringInterval}
                    label="Recurring Interval"
                    onChange={(e) => setNewReminder({ ...newReminder, recurringInterval: e.target.value })}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialog(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateReminder}
            disabled={!newReminder.title || !newReminder.dueDate || !newReminder.dueTime}
          >
            Create Reminder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReminderManagement;
