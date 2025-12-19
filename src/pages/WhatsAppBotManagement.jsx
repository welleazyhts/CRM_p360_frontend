import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Chip, Avatar, IconButton, Tooltip, Alert, Badge, Tabs, Tab,
  List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction,
  useTheme, alpha, Fade
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  Notifications as NotificationIcon,
  Message as MessageIcon,
  CheckCircle as ActiveIcon,
  Error as InactiveIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Api as ApiIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import ExecutiveChatInterface from '../components/whatsapp/ExecutiveChatInterface';

const WhatsAppBotManagement = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [executives, setExecutives] = useState([]);
  const [bots, setBots] = useState([]);
  const [businessConfig, setBusinessConfig] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  const [newExecutive, setNewExecutive] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: 'Executive',
    botEnabled: true,
    autoReply: true,
    notifications: true
  });

  useEffect(() => {
    loadExecutives();
    loadBusinessConfig();
  }, []);

  const loadExecutives = () => {
    const mockExecutives = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        email: 'rajesh@company.com',
        phone: '+91 98765 43210',
        department: 'Sales',
        role: 'Senior Executive',
        botEnabled: true,
        autoReply: true,
        notifications: true,
        botId: 'BOT-001',
        status: 'active',
        lastActive: '2025-01-12T10:30:00Z',
        messagesHandled: 45,
        responseTime: '2.3 mins'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@company.com',
        phone: '+91 98765 43211',
        department: 'Customer Service',
        role: 'Executive',
        botEnabled: true,
        autoReply: false,
        notifications: true,
        botId: 'BOT-002',
        status: 'active',
        lastActive: '2025-01-12T09:15:00Z',
        messagesHandled: 32,
        responseTime: '1.8 mins'
      },
      {
        id: 3,
        name: 'Amit Patel',
        email: 'amit@company.com',
        phone: '+91 98765 43212',
        department: 'Claims',
        role: 'Claims Executive',
        botEnabled: false,
        autoReply: false,
        notifications: true,
        botId: null,
        status: 'inactive',
        lastActive: '2025-01-11T16:45:00Z',
        messagesHandled: 0,
        responseTime: 'N/A'
      }
    ];
    setExecutives(mockExecutives);
  };

  const loadBusinessConfig = () => {
    const config = {
      businessNumber: '+91 98765 00000',
      businessName: 'Insurance Company Ltd',
      metaBusinessId: 'META-BIZ-12345',
      apiProvider: 'twilio',
      apiStatus: 'connected',
      webhookUrl: 'https://api.company.com/whatsapp/webhook',
      verificationStatus: 'verified',
      lastSync: '2025-01-12T08:00:00Z'
    };
    setBusinessConfig(config);
  };

  const handleCreateExecutive = () => {
    const executive = {
      id: executives.length + 1,
      ...newExecutive,
      botId: newExecutive.botEnabled ? `BOT-${String(executives.length + 1).padStart(3, '0')}` : null,
      status: newExecutive.botEnabled ? 'active' : 'inactive',
      lastActive: new Date().toISOString(),
      messagesHandled: 0,
      responseTime: 'N/A' 
    };
    setExecutives([...executives, executive]);
    setNewExecutive({
      name: '',
      email: '',
      phone: '',
      department: '',
      role: 'Executive',
      botEnabled: true,
      autoReply: true,
      notifications: true
    });
    setDialogOpen(false);
  };

  const handleToggleBotStatus = (executiveId) => {
    setExecutives(executives.map(exec => {
      if (exec.id === executiveId) {
        const botEnabled = !exec.botEnabled;
        return {
          ...exec,
          botEnabled,
          status: botEnabled ? 'active' : 'inactive',
          botId: botEnabled ? `BOT-${String(executiveId).padStart(3, '0')}` : null
        };
      }
      return exec;
    }));
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );

  const ExecutiveManagementTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="600">
          Executive Bot Management ({executives.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Executive
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {executives.filter(e => e.botEnabled).length}
              </Typography>
              <Typography variant="body2">Active Bots</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {executives.reduce((sum, e) => sum + e.messagesHandled, 0)}
              </Typography>
              <Typography variant="body2">Messages Today</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                2.1 mins
              </Typography>
              <Typography variant="body2">Avg Response Time</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                94.5%
              </Typography>
              <Typography variant="body2">Bot Efficiency</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell>Executive</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Bot Status</TableCell>
              <TableCell>Messages</TableCell>
              <TableCell>Response Time</TableCell>
              <TableCell>Settings</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executives.map((executive) => (
              <TableRow key={executive.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: executive.botEnabled ? 'success.main' : 'grey.400' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {executive.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {executive.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={executive.department} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {executive.botEnabled ? (
                      <Chip
                        icon={<ActiveIcon />}
                        label="Active"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<InactiveIcon />}
                        label="Inactive"
                        color="error"
                        size="small"
                      />
                    )}
                    {executive.botId && (
                      <Typography variant="caption" color="text.secondary">
                        {executive.botId}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600">
                    {executive.messagesHandled}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    today
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {executive.responseTime}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label="Auto-Reply"
                      size="small"
                      color={executive.autoReply ? 'success' : 'default'}
                      variant={executive.autoReply ? 'filled' : 'outlined'}
                    />
                    <Chip
                      label="Notifications"
                      size="small"
                      color={executive.notifications ? 'info' : 'default'}
                      variant={executive.notifications ? 'filled' : 'outlined'}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Toggle Bot">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleBotStatus(executive.id)}
                        color={executive.botEnabled ? 'success' : 'default'}
                      >
                        <BotIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton size="small">
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const BusinessConfigTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="600">
          WhatsApp Business Configuration
        </Typography>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={() => setConfigDialogOpen(true)}
        >
          Update Configuration
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Business Account</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Business Number"
                    secondary={businessConfig.businessNumber || 'Not configured'}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={businessConfig.verificationStatus || 'pending'}
                      color={businessConfig.verificationStatus === 'verified' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Business Name"
                    secondary={businessConfig.businessName || 'Not set'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Meta Business ID"
                    secondary={businessConfig.metaBusinessId || 'Not linked'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ApiIcon sx={{ mr: 2, color: 'secondary.main' }} />
                <Typography variant="h6">API Configuration</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="API Provider"
                    secondary={businessConfig.apiProvider || 'Not configured'}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={businessConfig.apiStatus || 'disconnected'}
                      color={businessConfig.apiStatus === 'connected' ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Webhook URL"
                    secondary={businessConfig.webhookUrl || 'Not configured'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Sync"
                    secondary={businessConfig.lastSync ? new Date(businessConfig.lastSync).toLocaleString() : 'Never'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> To use WhatsApp Business API, you need a Meta-verified business number. 
              Personal numbers cannot be used for business messaging.
            </Typography>
          </Alert>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Setup Instructions
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="1. Get Meta Business Account"
                    secondary="Create a Meta Business Account and get your business number verified"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ApiIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="2. Choose API Provider"
                    secondary="Select from Twilio, 360Dialog, or Meta's Cloud API"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="3. Configure Webhooks"
                    secondary="Set up webhook endpoints for receiving messages"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
            <WhatsAppIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              WhatsApp Bot Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure WhatsApp bots for individual executives and manage business integration
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<PersonIcon />} label="Executive Bots" />
            <Tab icon={<BusinessIcon />} label="Business Config" />
            <Tab icon={<ChatIcon />} label="Live Chat" />
            <Tab icon={<MessageIcon />} label="Auto Replies" />
            <Tab icon={<NotificationIcon />} label="Notifications" />
          </Tabs>
        </Paper>

        <TabPanel value={activeTab} index={0}>
          <ExecutiveManagementTab />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <BusinessConfigTab />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Live Chat Interface
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage customer conversations and bot interactions in real-time
            </Typography>
            <ExecutiveChatInterface executiveId={1} />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <Box>
            <Typography variant="h6" gutterBottom>Auto Reply Configuration</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure automated responses for common customer queries
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Common Triggers
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Greeting Messages"
                          secondary="hello, hi, hey, good morning"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Policy Queries"
                          secondary="policy, renewal, premium, coverage"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Claims"
                          secondary="claim, status, process, settlement"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Response Templates
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Welcome Message"
                          secondary="Hello! I'm {executiveName} from {department}. How can I help you?"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Policy Help"
                          secondary="I'd be happy to help with your policy. Please share your policy number."
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Claims Assistance"
                          secondary="I can help with your claim. Please provide your claim reference number."
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <Box>
            <Typography variant="h6" gutterBottom>Notification Settings</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage notification preferences for executives
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Notification Types
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="New Message Alerts" />
                        <ListItemSecondaryAction>
                          <Switch defaultChecked />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Bot Handover Notifications" />
                        <ListItemSecondaryAction>
                          <Switch defaultChecked />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Customer Escalations" />
                        <ListItemSecondaryAction>
                          <Switch defaultChecked />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Delivery Methods
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="In-App Notifications" />
                        <ListItemSecondaryAction>
                          <Switch defaultChecked />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Email Notifications" />
                        <ListItemSecondaryAction>
                          <Switch defaultChecked />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="SMS Alerts" />
                        <ListItemSecondaryAction>
                          <Switch />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Add Executive Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Executive</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={newExecutive.name}
                  onChange={(e) => setNewExecutive({ ...newExecutive, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={newExecutive.email}
                  onChange={(e) => setNewExecutive({ ...newExecutive, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={newExecutive.phone}
                  onChange={(e) => setNewExecutive({ ...newExecutive, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={newExecutive.department}
                    onChange={(e) => setNewExecutive({ ...newExecutive, department: e.target.value })}
                  >
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Customer Service">Customer Service</MenuItem>
                    <MenuItem value="Claims">Claims</MenuItem>
                    <MenuItem value="Renewals">Renewals</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newExecutive.botEnabled}
                      onChange={(e) => setNewExecutive({ ...newExecutive, botEnabled: e.target.checked })}
                    />
                  }
                  label="Enable WhatsApp Bot"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newExecutive.autoReply}
                      onChange={(e) => setNewExecutive({ ...newExecutive, autoReply: e.target.checked })}
                    />
                  }
                  label="Auto Reply"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newExecutive.notifications}
                      onChange={(e) => setNewExecutive({ ...newExecutive, notifications: e.target.checked })}
                    />
                  }
                  label="Notifications"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateExecutive}>
              Add Executive
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default WhatsAppBotManagement;