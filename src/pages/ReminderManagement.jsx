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
  FormControlLabel,
  Snackbar
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
import { useTranslation } from 'react-i18next';
import { remainderService } from '../services/remainderService';

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
  const { t } = useTranslation();
  const [reminders, setReminders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    overdue: 0,
    completed: 0,
    today: 0
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [remindersData, statsData] = await Promise.all([
        remainderService.list(),
        remainderService.getDashboardStats()
      ]);

      setReminders(Array.isArray(remindersData) ? remindersData : []);

      // Calculate stats from the fetched reminders to ensure consistency
      const items = Array.isArray(remindersData) ? remindersData : [];
      setStats({
        total: items.length,
        pending: items.filter(r => (r.status || 'pending').toLowerCase() === 'pending').length,
        overdue: items.filter(r => (r.status || '').toLowerCase() === 'overdue').length,
        completed: items.filter(r => (r.status || '').toLowerCase() === 'completed').length,
        today: items.filter(r => {
          if (!r.due_date) return false;
          return new Date(r.due_date).toDateString() === new Date().toDateString();
        }).length
      });

    } catch (error) {
      console.error('Failed to load reminders:', error);
      setSnackbar({ open: true, message: 'Failed to load reminders', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = async () => {
    try {
      const payload = {
        title: newReminder.title,
        description: newReminder.description,
        remainder_type: newReminder.type,
        priority: newReminder.priority,
        status: 'pending',
        lead_id: newReminder.leadId,
        lead_name: newReminder.leadName,
        due_date: newReminder.dueDate,
        due_time: newReminder.dueTime ? (newReminder.dueTime.length === 5 ? newReminder.dueTime + ':00' : newReminder.dueTime) : null,
        notify_email: newReminder.notifyVia.email,
        notify_sms: newReminder.notifyVia.sms,
        notify_whatsapp: newReminder.notifyVia.whatsapp,
        notify_in_app: newReminder.notifyVia.inApp,
        is_recurring: newReminder.recurring
      };

      await remainderService.create(payload);
      setSnackbar({ open: true, message: 'Reminder created successfully', severity: 'success' });
      setCreateDialog(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Create failed:', error);
      setSnackbar({ open: true, message: 'Failed to create reminder', severity: 'error' });
    }
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

  const handleCompleteReminder = async (id) => {
    try {
      await remainderService.complete(id);
      setSnackbar({ open: true, message: 'Reminder marked as completed', severity: 'success' });
      loadData();
    } catch (error) {
      console.error('Complete failed', error);
      setSnackbar({ open: true, message: 'Failed to complete reminder', severity: 'error' });
    }
  };

  const handleSnoozeReminder = async (id) => {
    try {
      await remainderService.snooze(id);
      setSnackbar({ open: true, message: 'Reminder snoozed', severity: 'success' });
      loadData();
    } catch (error) {
      console.error('Snooze failed', error);
      setSnackbar({ open: true, message: 'Failed to snooze reminder', severity: 'error' });
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm(t('reminders.dialogs.deleteConfirm'))) {
      try {
        await remainderService.delete(id);
        setSnackbar({ open: true, message: 'Reminder deleted', severity: 'success' });
        loadData();
      } catch (error) {
        console.error('Delete failed', error);
        setSnackbar({ open: true, message: 'Failed to delete reminder', severity: 'error' });
      }
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
    const title = reminder.title || '';
    const leadName = reminder.lead_name || reminder.leadName || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leadName.toLowerCase().includes(searchTerm.toLowerCase());

    const status = (reminder.status || 'pending').toLowerCase();
    let matchesTab = true;
    if (tabValue === 1) matchesTab = status === REMINDER_STATUS.PENDING.toLowerCase();
    if (tabValue === 2) matchesTab = status === REMINDER_STATUS.OVERDUE.toLowerCase();
    if (tabValue === 3) matchesTab = status === REMINDER_STATUS.COMPLETED.toLowerCase();

    return matchesSearch && matchesTab;
  });

  const handleSendNotification = (reminder, channel) => {
    // In a real app, this would call an API
    const message = `Sending ${channel} notification for reminder: ${reminder.title}`;
    console.log(message);
    setSnackbar({ open: true, message: t('reminders.dialogs.msgSent'), severity: 'success' });
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            {t('reminders.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('reminders.subtitle')}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            sx={{ mr: 1 }}
          >
            {t('reminders.buttons.refresh')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            {t('reminders.buttons.create')}
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                {t('reminders.stats.total')}
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                {t('reminders.stats.pending')}
              </Typography>
              <Typography variant="h4" color="primary">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                {t('reminders.stats.overdue')}
              </Typography>
              <Typography variant="h4" color="error">{stats.overdue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                {t('reminders.stats.dueToday')}
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
            placeholder={t('reminders.filters.searchPlaceholder')}
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
          <Tab label={`${t('reminders.tabs.all')} (${stats.total})`} />
          <Tab label={`${t('reminders.tabs.pending')} (${stats.pending})`} />
          <Tab label={`${t('reminders.tabs.overdue')} (${stats.overdue})`} />
          <Tab label={`${t('reminders.tabs.completed')} (${stats.completed})`} />
        </Tabs>

        <CardContent>
          {loading && <LinearProgress />}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('reminders.table.type')}</TableCell>
                  <TableCell>{t('reminders.table.title')}</TableCell>
                  <TableCell>{t('reminders.table.lead')}</TableCell>
                  <TableCell>{t('reminders.table.dueDate')}</TableCell>
                  <TableCell>{t('reminders.table.priority')}</TableCell>
                  <TableCell>{t('reminders.table.status')}</TableCell>
                  <TableCell>{t('reminders.table.notifyVia')}</TableCell>
                  <TableCell>{t('reminders.table.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReminders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((reminder) => (
                    <TableRow key={reminder.id} hover>
                      <TableCell>
                        <Tooltip title={t(`reminders.types.${reminder.remainder_type || reminder.type}`)}>
                          <IconButton size="small">
                            {getTypeIcon(reminder.remainder_type || reminder.type)}
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
                        <Typography variant="body2">{reminder.lead_name || reminder.leadName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reminder.lead_id || reminder.leadId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {reminder.due_date ? new Date(reminder.due_date).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reminder.due_time || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`reminders.priorities.${reminder.priority}`)}
                          size="small"
                          color={getPriorityColor(reminder.priority)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`reminders.status.${reminder.status}`)}
                          size="small"
                          color={getStatusColor(reminder.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          {(reminder.notify_email || (Array.isArray(reminder.notifyVia) && reminder.notifyVia.includes('email'))) && (
                            <Tooltip title={t('reminders.buttons.sendEmail')}>
                              <IconButton
                                size="small"
                                onClick={() => handleSendNotification(reminder, 'Email')}
                              >
                                <EmailIcon fontSize="small" color="primary" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(reminder.notify_sms || (Array.isArray(reminder.notifyVia) && reminder.notifyVia.includes('sms'))) && (
                            <Tooltip title={t('reminders.buttons.sendSMS')}>
                              <IconButton
                                size="small"
                                onClick={() => handleSendNotification(reminder, 'SMS')}
                              >
                                <SmsIcon fontSize="small" color="secondary" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(reminder.notify_whatsapp || (Array.isArray(reminder.notifyVia) && reminder.notifyVia.includes('whatsapp'))) && (
                            <Tooltip title={t('reminders.buttons.sendWhatsapp')}>
                              <IconButton
                                size="small"
                                onClick={() => handleSendNotification(reminder, 'WhatsApp')}
                              >
                                <WhatsAppIcon fontSize="small" color="success" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          {reminder.status !== REMINDER_STATUS.COMPLETED && (
                            <>
                              <Tooltip title={t('reminders.buttons.complete')}>
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => handleCompleteReminder(reminder.id)}
                                >
                                  <CompleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('reminders.buttons.snooze')}>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleSnoozeReminder(reminder.id)}
                                >
                                  <SnoozeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title={t('reminders.buttons.delete')}>
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
        <DialogTitle>{t('reminders.dialogs.createTitle')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('reminders.form.title')}
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('reminders.form.description')}
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('reminders.form.type')}</InputLabel>
                <Select
                  value={newReminder.type}
                  label={t('reminders.form.type')}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                >
                  <MenuItem value={REMINDER_TYPES.CALL}>{t('reminders.types.call')}</MenuItem>
                  <MenuItem value={REMINDER_TYPES.FOLLOW_UP}>{t('reminders.types.follow_up')}</MenuItem>
                  <MenuItem value={REMINDER_TYPES.QUOTE}>{t('reminders.types.quote')}</MenuItem>
                  <MenuItem value={REMINDER_TYPES.DOCUMENT}>{t('reminders.types.document')}</MenuItem>
                  <MenuItem value={REMINDER_TYPES.PAYMENT}>{t('reminders.types.payment')}</MenuItem>
                  <MenuItem value={REMINDER_TYPES.RENEWAL}>{t('reminders.types.renewal')}</MenuItem>
                  <MenuItem value={REMINDER_TYPES.CUSTOM}>{t('reminders.types.custom')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('reminders.form.priority')}</InputLabel>
                <Select
                  value={newReminder.priority}
                  label={t('reminders.form.priority')}
                  onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
                >
                  <MenuItem value={REMINDER_PRIORITY.HIGH}>{t('reminders.priorities.high')}</MenuItem>
                  <MenuItem value={REMINDER_PRIORITY.MEDIUM}>{t('reminders.priorities.medium')}</MenuItem>
                  <MenuItem value={REMINDER_PRIORITY.LOW}>{t('reminders.priorities.low')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('reminders.form.leadId')}
                value={newReminder.leadId}
                onChange={(e) => setNewReminder({ ...newReminder, leadId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('reminders.form.leadName')}
                value={newReminder.leadName}
                onChange={(e) => setNewReminder({ ...newReminder, leadName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('reminders.form.dueDate')}
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
                label={t('reminders.form.dueTime')}
                type="time"
                value={newReminder.dueTime}
                onChange={(e) => setNewReminder({ ...newReminder, dueTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>{t('reminders.dialogs.notifyVia')}</Typography>
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
                  label={t('reminders.form.channels.email')}
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
                  label={t('reminders.form.channels.sms')}
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
                  label={t('reminders.form.channels.whatsapp')}
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
                  label={t('reminders.form.channels.inApp')}
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
                label={t('reminders.form.recurring')}
              />
            </Grid>
            {newReminder.recurring && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('reminders.form.recurringInterval')}</InputLabel>
                  <Select
                    value={newReminder.recurringInterval}
                    label={t('reminders.form.recurringInterval')}
                    onChange={(e) => setNewReminder({ ...newReminder, recurringInterval: e.target.value })}
                  >
                    <MenuItem value="daily">{t('reminders.form.intervals.daily')}</MenuItem>
                    <MenuItem value="weekly">{t('reminders.form.intervals.weekly')}</MenuItem>
                    <MenuItem value="monthly">{t('reminders.form.intervals.monthly')}</MenuItem>
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
            {t('reminders.buttons.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateReminder}
            disabled={!newReminder.title || !newReminder.dueDate || !newReminder.dueTime}
          >
            {t('reminders.buttons.create')}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReminderManagement;
