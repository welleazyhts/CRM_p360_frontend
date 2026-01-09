import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Divider,
  Avatar,
  useTheme,
  alpha,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as ActiveIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon
} from '@mui/icons-material';

import AutoQuoteService from '../services/AutoQuoteService';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auto-quote-tabpanel-${index}`}
      aria-labelledby={`auto-quote-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AutoQuoteSharingSettings = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    enabled: true,
    frequency: 'Weekly',
    autoSendTime: '09:00',
    includeWeekends: false,
    maxQuotesPerDay: 50,
    retryFailedQuotes: true,
    retryAttempts: 3,
    enableAnalytics: true,
    requireApproval: false
  });

  const [customers, setCustomers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, customer: null });
  const [sendingCustomerId, setSendingCustomerId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsData, customersData] = await Promise.all([
        AutoQuoteService.fetchSettings(),
        AutoQuoteService.fetchCustomers()
      ]);
      setSettings(settingsData);
      setCustomers(Array.isArray(customersData) ? customersData : (customersData?.results || []));

      // Load other data if needed or lazy load on tab change
      if (tabValue === 2) loadAnalytics();
      if (tabValue === 3) loadNotifications();

    } catch (error) {
      console.error('Error loading auto-quote data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load data. Please check your connection.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await AutoQuoteService.fetchAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await AutoQuoteService.fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(() => {
    if (tabValue === 2 && !analytics) loadAnalytics();
    if (tabValue === 3 && !notifications) loadNotifications();
  }, [tabValue]);

  const handleSettingsChange = async (field, value) => {
    try {
      const newSettings = { ...settings, [field]: value };
      setSettings(newSettings);

      // Remove read-only fields before sending to API, BUT keep 'id' as backend seems to need it
      const { quickStats, created_at, updated_at, ...payload } = newSettings;

      await AutoQuoteService.updateSettings(payload);

      setSnackbar({
        open: true,
        message: `Auto-quote ${field} updated successfully!`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to update settings: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCustomerStatusToggle = async (customerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';

      setCustomers(prev => prev.map(customer =>
        customer.id === customerId
          ? { ...customer, status: newStatus }
          : customer
      ));

      await AutoQuoteService.toggleCustomerStatus(customerId, newStatus);

      setSnackbar({
        open: true,
        message: `Customer auto-quote sharing ${newStatus.toLowerCase()}!`,
        severity: 'success'
      });
    } catch (error) {
      // Revert on failure
      setCustomers(prev => prev.map(customer =>
        customer.id === customerId
          ? { ...customer, status: currentStatus }
          : customer
      ));

      setSnackbar({
        open: true,
        message: `Failed to update customer status: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleSendQuoteNow = async (customerId, customerName) => {
    setSendingCustomerId(customerId);
    try {
      await AutoQuoteService.sendQuoteNow(customerId);

      // Update last sent date
      setCustomers(prev => prev.map(customer =>
        customer.id === customerId
          ? {
            ...customer,
            lastQuoteSent: new Date().toISOString().split('T')[0],
            nextScheduled: getNextScheduledDate(settings.frequency)
          }
          : customer
      ));

      setSnackbar({
        open: true,
        message: `Quote sent successfully to ${customerName}!`,
        severity: 'success'
      });

      // Close confirmation dialog
      setConfirmDialog({ open: false, customer: null });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to send quote: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setSendingCustomerId(null);
    }
  };

  const handleOpenConfirmDialog = (customer) => {
    setConfirmDialog({ open: true, customer });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, customer: null });
  };

  const getNextScheduledDate = (frequency) => {
    const today = new Date();
    switch (frequency) {
      case 'Daily':
        today.setDate(today.getDate() + 1);
        break;
      case 'Weekly':
        today.setDate(today.getDate() + 7);
        break;
      case 'Monthly':
        today.setMonth(today.getMonth() + 1);
        break;
      default:
        today.setDate(today.getDate() + 7);
    }
    return today.toISOString().split('T')[0];
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'warning';
  };

  const getStatusIcon = (status) => {
    return status === 'Active' ? <ActiveIcon /> : <PauseIcon />;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefreshCustomers = async () => {
    try {
      setLoading(true);
      await AutoQuoteService.refreshCustomers();
      const customersData = await AutoQuoteService.fetchCustomers();
      setCustomers(Array.isArray(customersData) ? customersData : (customersData?.results || []));
      setSnackbar({
        open: true,
        message: 'Customers refreshed successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to refresh customers: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (notificationKey) => {
    try {
      // Optimistic update
      const newStatus = !notifications[notificationKey];
      setNotifications(prev => ({
        ...prev,
        [notificationKey]: newStatus
      }));

      await AutoQuoteService.toggleNotification(notificationKey);

      setSnackbar({
        open: true,
        message: 'Notification settings updated!',
        severity: 'success'
      });
    } catch (error) {
      // Revert
      const oldStatus = !notifications[notificationKey];
      setNotifications(prev => ({
        ...prev,
        [notificationKey]: oldStatus
      }));
      setSnackbar({
        open: true,
        message: `Failed to update notification: ${error.message}`,
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          📊 Auto-Quote Sharing Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure automated quote sharing, manage customer preferences, and monitor performance
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="auto-quote settings tabs">
          <Tab label="Settings" icon={<SettingsIcon />} />
          <Tab label="Customer Management" icon={<PersonIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="Notifications" icon={<NotificationsIcon />} />
        </Tabs>
      </Box>

      {/* Settings Tab */}
      <TabPanel value={tabValue} index={0}>

        {/* Basic Configuration */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SettingsIcon color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Basic Configuration
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.enabled}
                          onChange={(e) => handleSettingsChange('enabled', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="600">
                            Enable Auto-Quote Sharing
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Automatically send quotes to customers
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth disabled={!settings.enabled}>
                      <InputLabel>Sharing Frequency</InputLabel>
                      <Select
                        value={settings.frequency}
                        label="Sharing Frequency"
                        onChange={(e) => handleSettingsChange('frequency', e.target.value)}
                      >
                        <MenuItem value="Daily">📅 Daily</MenuItem>
                        <MenuItem value="Weekly">📆 Weekly</MenuItem>
                        <MenuItem value="Monthly">🗓️ Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Auto Send Time"
                      type="time"
                      value={settings.autoSendTime}
                      onChange={(e) => handleSettingsChange('autoSendTime', e.target.value)}
                      disabled={!settings.enabled}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Quotes Per Day"
                      type="number"
                      value={settings.maxQuotesPerDay}
                      onChange={(e) => handleSettingsChange('maxQuotesPerDay', parseInt(e.target.value))}
                      disabled={!settings.enabled}
                      inputProps={{ min: 1, max: 1000 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Advanced Options
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.includeWeekends}
                          onChange={(e) => handleSettingsChange('includeWeekends', e.target.checked)}
                          disabled={!settings.enabled}
                        />
                      }
                      label="Include Weekends"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.retryFailedQuotes}
                          onChange={(e) => handleSettingsChange('retryFailedQuotes', e.target.checked)}
                          disabled={!settings.enabled}
                        />
                      }
                      label="Retry Failed Quotes"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.enableAnalytics}
                          onChange={(e) => handleSettingsChange('enableAnalytics', e.target.checked)}
                          disabled={!settings.enabled}
                        />
                      }
                      label="Enable Analytics"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.requireApproval}
                          onChange={(e) => handleSettingsChange('requireApproval', e.target.checked)}
                          disabled={!settings.enabled}
                        />
                      }
                      label="Require Approval"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h6" color="white" fontWeight="600" gutterBottom>
                  📈 Quick Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" color="white" fontWeight="bold">
                      {customers.filter(c => c.status === 'Active').length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                      Active Customers
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="white" fontWeight="bold">
                      {settings.frequency}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                      Current Frequency
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="white" fontWeight="bold">
                      {settings.maxQuotesPerDay}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                      Daily Limit
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Customer Management Tab */}
      <TabPanel value={tabValue} index={1}>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="600">
                  Customer Auto-Quote Management
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<RefreshIcon className={loading ? 'spinning' : ''} />}
                onClick={handleRefreshCustomers}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>

            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100], '&:hover': { backgroundColor: theme.palette.grey[100] } }}>
                    <TableCell sx={{ fontWeight: 600, color: 'black' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'black' }}>Contact Info</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'black' }}>Product Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'black' }}>Last Quote Sent</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'black' }}>Next Scheduled</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'black' }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: 'black' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {customer.name && typeof customer.name === 'string' ? customer.name.charAt(0) : '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Premium: ₹{customer.premiumAmount?.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{customer.email}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{customer.phone}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.productType}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(customer.lastQuoteSent).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {new Date(customer.nextScheduled).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(customer.status)}
                          label={customer.status}
                          size="small"
                          color={getStatusColor(customer.status)}
                          onClick={() => handleCustomerStatusToggle(customer.id, customer.status)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={customer.status === 'Paused' ? 'Customer is paused' : 'Send Quote Now'}>
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenConfirmDialog(customer)}
                              disabled={sendingCustomerId === customer.id || customer.status === 'Paused'}
                              sx={{
                                color: theme.palette.success.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.success.main, 0.1)
                                }
                              }}
                            >
                              {sendingCustomerId === customer.id ? (
                                <RefreshIcon className="spinning" />
                              ) : (
                                <SendIcon />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>





      {/* Analytics Tab */}
      < TabPanel value={tabValue} index={2} >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  📊 Performance Metrics
                </Typography>
                {analytics ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Total Quotes Sent</Typography>
                      <Typography variant="h6" color="primary">{analytics.totalQuotesSent?.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Success Rate</Typography>
                      <Typography variant="h6" color="success.main">{analytics.successRate}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Response Rate</Typography>
                      <Typography variant="h6" color="info.main">{analytics.responseRate}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Conversion Rate</Typography>
                      <Typography variant="h6" color="warning.main">{analytics.conversionRate}%</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography color="text.secondary">Loading analytics...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  📈 Recent Activity
                </Typography>
                <List>
                  {analytics?.recentActivity?.map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={activity.title}
                        secondary={activity.description}
                      />
                      <Chip
                        label={activity.status}
                        color={activity.statusColor || 'default'}
                        size="small"
                      />
                    </ListItem>
                  )) || (
                      <ListItem>
                        <ListItemText primary="No recent activity available" />
                      </ListItem>
                    )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel >

      {/* Notifications Tab */}
      < TabPanel value={tabValue} index={3} >
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              🔔 Notification Settings
            </Typography>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive email alerts for quote activities"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications?.emailNotifications || false}
                    onChange={() => handleNotificationToggle('emailNotifications')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="SMS Notifications"
                  secondary="Receive SMS alerts for critical events"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications?.smsNotifications || false}
                    onChange={() => handleNotificationToggle('smsNotifications')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Daily Summary"
                  secondary="Daily report of quote sharing activities"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications?.dailySummary || false}
                    onChange={() => handleNotificationToggle('dailySummary')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Failure Alerts"
                  secondary="Immediate alerts for failed quote deliveries"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications?.failureAlerts || false}
                    onChange={() => handleNotificationToggle('failureAlerts')}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </TabPanel >

      {/* Confirmation Dialog */}
      < Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              Send Quote Now
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {confirmDialog.customer && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                You are about to send a quote to this customer. This will update their last sent date and schedule the next quote.
              </Alert>

              <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Customer Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {confirmDialog.customer.name && typeof confirmDialog.customer.name === 'string' ? confirmDialog.customer.name.charAt(0) : '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {confirmDialog.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {confirmDialog.customer.id}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{confirmDialog.customer.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{confirmDialog.customer.phone}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Product Type
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {confirmDialog.customer.productType}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Premium Amount
                    </Typography>
                    <Typography variant="body2" fontWeight="600" color="success.main">
                      ₹{(confirmDialog.customer.premiumAmount || 0).toLocaleString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Last Quote Sent
                    </Typography>
                    <Typography variant="body2">
                      {new Date(confirmDialog.customer.lastQuoteSent).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Current Next Scheduled
                    </Typography>
                    <Typography variant="body2">
                      {new Date(confirmDialog.customer.nextScheduled).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Alert severity="success" icon={<ScheduleIcon />}>
                <Typography variant="body2">
                  <strong>New schedule:</strong> Next quote will be scheduled for{' '}
                  <strong>{new Date(getNextScheduledDate(settings.frequency)).toLocaleDateString()}</strong>
                  {' '}({settings.frequency.toLowerCase()})
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseConfirmDialog}
            disabled={sendingCustomerId !== null}
          >
            Cancel
          </Button>
          <Button
            onClick={() => confirmDialog.customer && handleSendQuoteNow(confirmDialog.customer.id, confirmDialog.customer.name)}
            variant="contained"
            color="primary"
            disabled={sendingCustomerId !== null}
            startIcon={sendingCustomerId !== null ? <RefreshIcon className="spinning" /> : <SendIcon />}
          >
            {sendingCustomerId !== null ? 'Sending...' : 'Send Quote'}
          </Button>
        </DialogActions>
      </Dialog >

      {/* Snackbar for notifications */}
      < Snackbar
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
      </Snackbar >

      {/* Add spinning animation for loading icon */}
      < style >
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spinning {
            animation: spin 1s linear infinite;
          }
        `}
      </style >
    </Box >
  );
};

export default AutoQuoteSharingSettings;