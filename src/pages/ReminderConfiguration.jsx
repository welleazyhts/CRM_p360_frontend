import React, { useState } from 'react';
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
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
  FormGroup,
  Checkbox,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Notifications as NotificationIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Product Types
const PRODUCT_TYPES = {
  MOTOR: 'Motor Insurance',
  HEALTH: 'Health Insurance',
  LIFE: 'Life Insurance',
  TRAVEL: 'Travel Insurance',
  HOME: 'Home Insurance',
  COMMERCIAL: 'Commercial Insurance'
};

// Sub-Product Types by Product
const SUB_PRODUCT_TYPES = {
  'Motor Insurance': ['Two Wheeler', 'Four Wheeler', 'Commercial Vehicle', 'Electric Vehicle'],
  'Health Insurance': ['Individual', 'Family Floater', 'Senior Citizen', 'Critical Illness', 'Group Health'],
  'Life Insurance': ['Term Life', 'Whole Life', 'Endowment', 'ULIP', 'Money Back'],
  'Travel Insurance': ['Domestic', 'International', 'Student Travel', 'Family Travel'],
  'Home Insurance': ['Building', 'Contents', 'Comprehensive'],
  'Commercial Insurance': ['Shop', 'Office', 'Industrial', 'Liability']
};

// Reminder Types
const REMINDER_TYPES = {
  POLICY_EXPIRY: 'Policy Expiry',
  RENEWAL_DUE: 'Renewal Due',
  PAYMENT_DUE: 'Payment Due',
  DOCUMENT_PENDING: 'Document Pending',
  INSPECTION_DUE: 'Inspection Due',
  CLAIM_FOLLOWUP: 'Claim Follow-up',
  KYC_PENDING: 'KYC Pending',
  CUSTOM: 'Custom Reminder'
};

// Trigger Events
const TRIGGER_EVENTS = {
  DAYS_BEFORE_EXPIRY: 'Days Before Expiry',
  DAYS_AFTER_PURCHASE: 'Days After Purchase',
  DAYS_BEFORE_RENEWAL: 'Days Before Renewal',
  DOCUMENT_NOT_RECEIVED: 'Document Not Received',
  PAYMENT_OVERDUE: 'Payment Overdue',
  CUSTOM_DATE: 'Custom Date'
};

const ReminderConfiguration = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [configDialog, setConfigDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    productType: PRODUCT_TYPES.MOTOR,
    subProductType: '',
    reminderType: REMINDER_TYPES.POLICY_EXPIRY,
    triggerEvent: TRIGGER_EVENTS.DAYS_BEFORE_EXPIRY,
    triggerValue: 30,
    enabled: true,
    channels: {
      email: true,
      sms: true,
      whatsapp: false,
      inApp: true
    },
    emailTemplate: {
      subject: '',
      body: ''
    },
    smsTemplate: '',
    whatsappTemplate: '',
    frequency: 'once', // once, daily, weekly
    maxReminders: 1,
    priority: 'medium'
  });

  // Mock configurations
  const [configurations, setConfigurations] = useState([
    {
      id: 1,
      name: 'Motor Insurance - 30 Days Before Expiry',
      productType: PRODUCT_TYPES.MOTOR,
      subProductType: 'Four Wheeler',
      reminderType: REMINDER_TYPES.POLICY_EXPIRY,
      triggerEvent: TRIGGER_EVENTS.DAYS_BEFORE_EXPIRY,
      triggerValue: 30,
      enabled: true,
      channels: { email: true, sms: true, whatsapp: true, inApp: true },
      emailTemplate: {
        subject: 'Your Motor Insurance is Expiring Soon - Renew Now!',
        body: 'Dear {{customer_name}},\n\nYour motor insurance policy {{policy_number}} for vehicle {{vehicle_number}} will expire on {{expiry_date}}.\n\nRenew now to avoid any lapse in coverage.\n\nBest regards,\nVeriright Team'
      },
      smsTemplate: 'Hi {{customer_name}}, your motor insurance policy expires on {{expiry_date}}. Renew now: {{renewal_link}}',
      whatsappTemplate: 'Hello {{customer_name}}! Your vehicle insurance {{policy_number}} expires on {{expiry_date}}. Click here to renew: {{renewal_link}}',
      frequency: 'once',
      maxReminders: 1,
      priority: 'high',
      createdAt: '2025-01-15',
      stats: { sent: 1250, opened: 890, clicked: 450 }
    },
    {
      id: 2,
      name: 'Motor Insurance - 15 Days Before Expiry',
      productType: PRODUCT_TYPES.MOTOR,
      subProductType: 'Two Wheeler',
      reminderType: REMINDER_TYPES.POLICY_EXPIRY,
      triggerEvent: TRIGGER_EVENTS.DAYS_BEFORE_EXPIRY,
      triggerValue: 15,
      enabled: true,
      channels: { email: true, sms: true, whatsapp: true, inApp: true },
      emailTemplate: {
        subject: 'Urgent: Only 15 Days Left - Renew Your Motor Insurance',
        body: 'Dear {{customer_name}},\n\nThis is an urgent reminder that your motor insurance expires in just 15 days on {{expiry_date}}.\n\nPolicy Number: {{policy_number}}\nVehicle: {{vehicle_number}}\n\nDon\'t risk driving without insurance. Renew now!'
      },
      smsTemplate: 'URGENT: Only 15 days left! Your motor insurance expires {{expiry_date}}. Renew: {{renewal_link}}',
      whatsappTemplate: '⚠️ Only 15 days to renew! Policy {{policy_number}} expires {{expiry_date}}. Quick renew: {{renewal_link}}',
      frequency: 'once',
      maxReminders: 1,
      priority: 'high',
      createdAt: '2025-01-15',
      stats: { sent: 980, opened: 750, clicked: 520 }
    },
    {
      id: 3,
      name: 'Health Insurance - Document Pending',
      productType: PRODUCT_TYPES.HEALTH,
      subProductType: 'Family Floater',
      reminderType: REMINDER_TYPES.DOCUMENT_PENDING,
      triggerEvent: TRIGGER_EVENTS.DOCUMENT_NOT_RECEIVED,
      triggerValue: 7,
      enabled: true,
      channels: { email: true, sms: false, whatsapp: true, inApp: true },
      emailTemplate: {
        subject: 'Document Submission Required - Health Insurance',
        body: 'Dear {{customer_name}},\n\nWe are awaiting the following documents for your health insurance policy {{policy_number}}:\n\n{{pending_documents}}\n\nPlease upload at your earliest convenience.'
      },
      smsTemplate: '',
      whatsappTemplate: 'Hi {{customer_name}}, we need documents for policy {{policy_number}}. Upload here: {{upload_link}}',
      frequency: 'weekly',
      maxReminders: 3,
      priority: 'medium',
      createdAt: '2025-01-10',
      stats: { sent: 450, opened: 320, clicked: 180 }
    }
  ]);

  const handleOpenDialog = (config = null) => {
    if (config) {
      setEditingConfig(config);
      setFormData(config);
    } else {
      setEditingConfig(null);
      setFormData({
        name: '',
        productType: PRODUCT_TYPES.MOTOR,
        subProductType: '',
        reminderType: REMINDER_TYPES.POLICY_EXPIRY,
        triggerEvent: TRIGGER_EVENTS.DAYS_BEFORE_EXPIRY,
        triggerValue: 30,
        enabled: true,
        channels: {
          email: true,
          sms: true,
          whatsapp: false,
          inApp: true
        },
        emailTemplate: {
          subject: '',
          body: ''
        },
        smsTemplate: '',
        whatsappTemplate: '',
        frequency: 'once',
        maxReminders: 1,
        priority: 'medium'
      });
    }
    setConfigDialog(true);
  };

  const handleSaveConfig = () => {
    if (editingConfig) {
      setConfigurations(configurations.map(c =>
        c.id === editingConfig.id
          ? { ...c, ...formData }
          : c
      ));
    } else {
      const newConfig = {
        id: Math.max(...configurations.map(c => c.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        stats: { sent: 0, opened: 0, clicked: 0 }
      };
      setConfigurations([...configurations, newConfig]);
    }
    setConfigDialog(false);
  };

  const handleDeleteConfig = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder configuration?')) {
      setConfigurations(configurations.filter(c => c.id !== id));
    }
  };

  const handleToggleEnabled = (id) => {
    setConfigurations(configurations.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const handleDuplicateConfig = (config) => {
    const newConfig = {
      ...config,
      id: Math.max(...configurations.map(c => c.id)) + 1,
      name: `${config.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      stats: { sent: 0, opened: 0, clicked: 0 }
    };
    setConfigurations([...configurations, newConfig]);
  };

  const handlePreview = (template, type) => {
    const sampleData = {
      customer_name: 'John Doe',
      policy_number: 'POL-2024-12345',
      vehicle_number: 'MH-12-AB-1234',
      expiry_date: '31-Dec-2025',
      renewal_link: 'https://veriright.com/renew/abc123',
      upload_link: 'https://veriright.com/upload/xyz456',
      pending_documents: '• Aadhar Card\n• Driving License\n• RC Copy'
    };

    let content = type === 'email' ? template.body : template;
    Object.entries(sampleData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    setPreviewContent(content);
    setPreviewDialog(true);
  };

  const getChannelIcons = (channels) => {
    const icons = [];
    if (channels.email) icons.push(<EmailIcon key="email" fontSize="small" color="primary" />);
    if (channels.sms) icons.push(<SmsIcon key="sms" fontSize="small" color="secondary" />);
    if (channels.whatsapp) icons.push(<WhatsAppIcon key="whatsapp" fontSize="small" color="success" />);
    if (channels.inApp) icons.push(<NotificationIcon key="inapp" fontSize="small" color="info" />);
    return icons;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'default';
  };

  const filteredConfigs = configurations.filter(config => {
    if (activeTab === 0) return true;
    const productTypes = Object.values(PRODUCT_TYPES);
    return config.productType === productTypes[activeTab - 1];
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Reminder Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure automated reminder messages for different product types
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Configuration
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary.main">{configurations.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Configurations</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {configurations.filter(c => c.enabled).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Active</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {configurations.reduce((sum, c) => sum + c.stats.sent, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Sent</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {configurations.reduce((sum, c) => sum + c.stats.clicked, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Clicks</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
            <Tab label="All" />
            {Object.values(PRODUCT_TYPES).map((type, idx) => (
              <Tab key={idx} label={type} />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Configuration Name</TableCell>
                  <TableCell>Reminder Type</TableCell>
                  <TableCell>Trigger</TableCell>
                  <TableCell>Channels</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredConfigs.map((config) => (
                  <TableRow key={config.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">{config.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {config.productType} {config.subProductType && `- ${config.subProductType}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={config.reminderType} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        {config.triggerEvent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {config.triggerValue} days
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        {getChannelIcons(config.channels)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={config.priority}
                        size="small"
                        color={getPriorityColor(config.priority)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={config.enabled}
                        onChange={() => handleToggleEnabled(config.id)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        Sent: {config.stats.sent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Clicked: {config.stats.clicked} ({((config.stats.clicked / config.stats.sent) * 100).toFixed(1)}%)
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(config)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" onClick={() => handleDuplicateConfig(config)}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteConfig(config.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={configDialog} onClose={() => setConfigDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingConfig ? 'Edit Reminder Configuration' : 'Add Reminder Configuration'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Configuration Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Motor Insurance - 30 Days Before Expiry"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Product Type</InputLabel>
                <Select
                  value={formData.productType}
                  label="Product Type"
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value, subProductType: '' })}
                >
                  {Object.entries(PRODUCT_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sub-Product Type</InputLabel>
                <Select
                  value={formData.subProductType}
                  label="Sub-Product Type"
                  onChange={(e) => setFormData({ ...formData, subProductType: e.target.value })}
                  disabled={!formData.productType}
                >
                  <MenuItem value="">
                    <em>All Sub-Types</em>
                  </MenuItem>
                  {formData.productType && SUB_PRODUCT_TYPES[formData.productType]?.map((subType) => (
                    <MenuItem key={subType} value={subType}>{subType}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Reminder Type</InputLabel>
                <Select
                  value={formData.reminderType}
                  label="Reminder Type"
                  onChange={(e) => setFormData({ ...formData, reminderType: e.target.value })}
                >
                  {Object.entries(REMINDER_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trigger Event</InputLabel>
                <Select
                  value={formData.triggerEvent}
                  label="Trigger Event"
                  onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}
                >
                  {Object.entries(TRIGGER_EVENTS).map(([key, value]) => (
                    <MenuItem key={key} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Trigger Value (Days)"
                value={formData.triggerValue}
                onChange={(e) => setFormData({ ...formData, triggerValue: parseInt(e.target.value) })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Notification Channels</Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.channels.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        channels: { ...formData.channels, email: e.target.checked }
                      })}
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.channels.sms}
                      onChange={(e) => setFormData({
                        ...formData,
                        channels: { ...formData.channels, sms: e.target.checked }
                      })}
                    />
                  }
                  label="SMS"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.channels.whatsapp}
                      onChange={(e) => setFormData({
                        ...formData,
                        channels: { ...formData.channels, whatsapp: e.target.checked }
                      })}
                    />
                  }
                  label="WhatsApp"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.channels.inApp}
                      onChange={(e) => setFormData({
                        ...formData,
                        channels: { ...formData.channels, inApp: e.target.checked }
                      })}
                    />
                  }
                  label="In-App"
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>Email Template</Typography>
            </Grid>

            {formData.channels.email && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Subject"
                    value={formData.emailTemplate.subject}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailTemplate: { ...formData.emailTemplate, subject: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Body"
                    multiline
                    rows={4}
                    value={formData.emailTemplate.body}
                    onChange={(e) => setFormData({
                      ...formData,
                      emailTemplate: { ...formData.emailTemplate, body: e.target.value }
                    })}
                    placeholder="Use {{customer_name}}, {{policy_number}}, {{expiry_date}}, {{vehicle_number}}, {{renewal_link}}"
                  />
                  <Button
                    size="small"
                    startIcon={<InfoIcon />}
                    onClick={() => handlePreview(formData.emailTemplate, 'email')}
                    sx={{ mt: 1 }}
                  >
                    Preview
                  </Button>
                </Grid>
              </>
            )}

            {formData.channels.sms && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SMS Template"
                  multiline
                  rows={2}
                  value={formData.smsTemplate}
                  onChange={(e) => setFormData({ ...formData, smsTemplate: e.target.value })}
                  placeholder="Use {{customer_name}}, {{policy_number}}, {{expiry_date}}, {{renewal_link}}"
                />
                <Typography variant="caption" color="text.secondary">
                  Character count: {formData.smsTemplate.length}/160
                </Typography>
              </Grid>
            )}

            {formData.channels.whatsapp && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="WhatsApp Template"
                  multiline
                  rows={3}
                  value={formData.whatsappTemplate}
                  onChange={(e) => setFormData({ ...formData, whatsappTemplate: e.target.value })}
                  placeholder="Use {{customer_name}}, {{policy_number}}, {{expiry_date}}, {{renewal_link}}"
                />
              </Grid>
            )}

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  label="Frequency"
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <MenuItem value="once">Once</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Max Reminders"
                value={formData.maxReminders}
                onChange={(e) => setFormData({ ...formData, maxReminders: parseInt(e.target.value) })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" icon={<InfoIcon />}>
                Available variables: {'{{customer_name}}'}, {'{{policy_number}}'}, {'{{expiry_date}}'},
                {' {{vehicle_number}}'}, {'{{renewal_link}}'}, {'{{upload_link}}'}
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveConfig}
            disabled={!formData.name || !formData.productType}
          >
            {editingConfig ? 'Update' : 'Create'} Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Message Preview</DialogTitle>
        <DialogContent>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
              {previewContent}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReminderConfiguration;
