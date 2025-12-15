import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Switch, FormControlLabel, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  List, ListItem, ListItemText, ListItemIcon, Divider, Badge,
  LinearProgress, alpha, useTheme, Stack, Tooltip, Select, MenuItem,
  FormControl, InputLabel, Tabs, Tab,
  Slider, Checkbox, FormGroup, RadioGroup, Radio
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  VoiceOverOff as VoiceOverOffIcon,
  Info as InfoIcon,
  AutoMode as AutoModeIcon,
  Route as RouteIcon,
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Close as CloseIcon,
  Campaign as CampaignIcon,
  SmartToy as AIIcon,
  AccountBalance as MoneyIcon,
  Gavel as LegalIcon,
  RecordVoiceOver as VoiceIcon,
  Psychology as BrainIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

const WorkflowManager = () => {
  const theme = useTheme();
  const [dialerActive, setDialerActive] = useState(false);
  const [dialerPaused, setDialerPaused] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [amdEnabled, setAmdEnabled] = useState(true);
  const [multiChannelEnabled, setMultiChannelEnabled] = useState(true);

  // Workflow Creation Dialog
  const [createWorkflowDialog, setCreateWorkflowDialog] = useState(false);
  const [workflowTab, setWorkflowTab] = useState(0);

  // Workflow Details Dialog
  const [workflowDetailsDialog, setWorkflowDetailsDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    type: 'payment_reminder',
    startDate: '',
    scheduleType: 'immediate', // immediate, scheduled, recurring
    // Channel Selection
    channels: ['call'],
    // Channel Configuration (provider, line, template, interval, triggers for each channel)
    channelConfigs: {
      call: { provider: '', line: '', template: '', intervalValue: 30, intervalUnit: 'minutes', triggerConditions: [] },
      sms: { provider: '', line: '', template: '', intervalValue: 30, intervalUnit: 'minutes', triggerConditions: ['no_response'] },
      email: { provider: '', line: '', template: '', intervalValue: 24, intervalUnit: 'hours', triggerConditions: ['no_response'] },
      whatsapp: { provider: '', line: '', template: '', intervalValue: 48, intervalUnit: 'hours', triggerConditions: ['no_response', 'no_action'] }
    },
    // Dialer Settings
    callStrategy: 'preview',
    maxAttempts: 3,
    callTimeStart: '09:00',
    callTimeEnd: '18:00',
    amdEnabled: true,
    recordCalls: true,
    // AI Features
    aiAgentMatching: true,
    recoveryScoring: true,
    bestTimePredict: true,
    sentimentAnalysis: false,
    autoDisposition: false,
    // Multi-Channel
    channelSequence: [
      { id: 1, channel: 'Call', enabled: true, delay: 0, delayUnit: 'minutes', template: '' },
      { id: 2, channel: 'SMS', enabled: false, delay: 30, delayUnit: 'minutes', template: 'Payment Reminder SMS' },
      { id: 3, channel: 'Email', enabled: false, delay: 24, delayUnit: 'hours', template: 'Payment Notice Email' },
      { id: 4, channel: 'WhatsApp', enabled: false, delay: 48, delayUnit: 'hours', template: 'Payment Link WhatsApp' }
    ],
    // Target Audience
    segments: [],
    dpdMin: '',
    dpdMax: '',
    balanceMin: '',
    balanceMax: '',
    status: []
  });

  // Multi-Channel Sequence Configuration
  const [channelSequence, setChannelSequence] = useState([
    { id: 1, channel: 'SMS', enabled: true, delay: 5, delayUnit: 'minutes', template: 'Payment Reminder SMS' },
    { id: 2, channel: 'Email', enabled: true, delay: 24, delayUnit: 'hours', template: 'Detailed Statement' },
    { id: 3, channel: 'WhatsApp', enabled: true, delay: 48, delayUnit: 'hours', template: 'Interactive Payment Link' }
  ]);

  // Created Workflows List
  const [workflows, setWorkflows] = useState([
    // Example workflow
    {
      id: 1,
      workflowId: 'WF-2025-001',
      name: 'Q1 Payment Recovery Campaign',
      description: 'Automated payment reminders for Q1 overdue accounts',
      type: 'payment_reminder',
      status: 'active',
      channels: ['call', 'sms', 'email', 'whatsapp'],
      channelConfigs: {
        call: { provider: 'Exotel', line: '+91-8010012345', template: 'payment_reminder_script', intervalValue: 30, intervalUnit: 'minutes', triggerConditions: [] },
        sms: { provider: 'MSG91', line: 'VRICHT', template: 'payment_reminder_sms', intervalValue: 30, intervalUnit: 'minutes', triggerConditions: ['no_response'] },
        email: { provider: 'SendGrid', line: 'collections@veriright.com', template: 'payment_notice_email', intervalValue: 24, intervalUnit: 'hours', triggerConditions: ['no_response'] },
        whatsapp: { provider: 'Gupshup', line: '+91-8010098765', template: 'payment_reminder_wa', intervalValue: 48, intervalUnit: 'hours', triggerConditions: ['no_response', 'no_action'] }
      },
      segments: ['Ready-to-Pay', 'Contactable'],
      scheduleType: 'immediate',
      createdDate: '2025-01-18',
      lastRun: '2025-01-20',
      totalContacts: 1245,
      successRate: 32,
      channelMetrics: {
        call: {
          sent: 1245,
          delivered: 1120,
          connected: 809,
          answered: 652,
          avgDuration: '4:32',
          responseRate: 52.3,
          conversionRate: 28.5,
          deliveryRate: 89.9,
          failureReasons: { busy: 158, no_answer: 157, invalid: 125 }
        },
        sms: {
          sent: 809,
          delivered: 785,
          bounced: 24,
          opened: 612,
          clicked: 247,
          replied: 156,
          deliveryRate: 97.0,
          openRate: 77.9,
          clickRate: 31.5,
          responseRate: 19.9,
          conversionRate: 15.2
        },
        email: {
          sent: 785,
          delivered: 758,
          bounced: 27,
          opened: 523,
          clicked: 189,
          replied: 95,
          unsubscribed: 8,
          spamReports: 2,
          deliveryRate: 96.6,
          openRate: 69.0,
          clickRate: 24.9,
          responseRate: 12.5,
          conversionRate: 18.3
        },
        whatsapp: {
          sent: 758,
          delivered: 742,
          read: 698,
          replied: 245,
          deliveryRate: 97.9,
          readRate: 94.1,
          responseRate: 33.0,
          conversionRate: 21.7
        }
      }
    }
  ]);

  // Mock data for dialer queue
  const [dialerQueue, setDialerQueue] = useState([
    {
      id: 1,
      debtorName: 'Rajesh Kumar',
      accountNumber: 'ACC-2024-001',
      phone: '+91 98765 43210',
      debtAmount: 45000,
      dpd: 145,
      priority: 'High',
      bestTimeToCall: '10:00 AM - 11:00 AM',
      previousAttempts: 3,
      lastContactDate: '2025-01-15',
      recoveryProbability: 85,
      assignedAgent: 'Priya Sharma',
      skillMatch: 92,
      status: 'Ready',
      nextAction: 'Call',
      callHistory: [
        { date: '2025-01-15', result: 'No Answer', duration: '0:00' },
        { date: '2025-01-10', result: 'Busy', duration: '0:00' },
        { date: '2025-01-05', result: 'Connected', duration: '5:23' }
      ]
    },
    {
      id: 2,
      debtorName: 'Priya Mehta',
      accountNumber: 'ACC-2024-002',
      phone: '+91 98123 45678',
      debtAmount: 82000,
      dpd: 212,
      priority: 'Critical',
      bestTimeToCall: '2:00 PM - 3:00 PM',
      previousAttempts: 7,
      lastContactDate: '2025-01-18',
      recoveryProbability: 45,
      assignedAgent: 'Amit Patel',
      skillMatch: 88,
      status: 'In Call',
      nextAction: 'Call',
      callHistory: []
    },
    {
      id: 3,
      debtorName: 'Amit Singh',
      accountNumber: 'ACC-2024-003',
      phone: '+91 99887 65432',
      debtAmount: 125000,
      dpd: 89,
      priority: 'Medium',
      bestTimeToCall: '6:00 PM - 7:00 PM',
      previousAttempts: 2,
      lastContactDate: '2025-01-12',
      recoveryProbability: 72,
      assignedAgent: 'Neha Gupta',
      skillMatch: 95,
      status: 'Scheduled',
      nextAction: 'SMS',
      callHistory: []
    }
  ]);

  // Mock agent performance data
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      avatar: 'PS',
      status: 'On Call',
      callsToday: 47,
      contactRate: 68,
      recoveryRate: 32,
      avgCallDuration: '4:35',
      activeCall: 'ACC-2024-002'
    },
    {
      id: 2,
      name: 'Amit Patel',
      avatar: 'AP',
      status: 'Available',
      callsToday: 52,
      contactRate: 74,
      recoveryRate: 38,
      avgCallDuration: '5:12',
      activeCall: null
    },
    {
      id: 3,
      name: 'Neha Gupta',
      avatar: 'NG',
      status: 'Break',
      callsToday: 38,
      contactRate: 65,
      recoveryRate: 28,
      avgCallDuration: '3:58',
      activeCall: null
    },
    {
      id: 4,
      name: 'Rahul Verma',
      avatar: 'RV',
      status: 'Available',
      callsToday: 44,
      contactRate: 71,
      recoveryRate: 35,
      avgCallDuration: '4:48',
      activeCall: null
    }
  ]);

  const handleDialerStart = () => {
    setDialerActive(true);
    setDialerPaused(false);
  };

  const handleDialerPause = () => {
    setDialerPaused(!dialerPaused);
  };

  const handleDialerStop = () => {
    setDialerActive(false);
    setDialerPaused(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Call':
        return 'success';
      case 'Available':
        return 'primary';
      case 'Break':
        return 'warning';
      case 'Offline':
        return 'default';
      default:
        return 'default';
    }
  };

  const renderDialerControls = () => (
    <Card sx={{ mb: 3, boxShadow: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Smart Dialer Control Center
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                AI-powered predictive dialing with intelligent routing
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {!dialerActive ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayIcon />}
                  onClick={handleDialerStart}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': { bgcolor: alpha('#fff', 0.9) },
                    fontWeight: 600,
                    px: 4
                  }}
                >
                  Start Dialer
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={dialerPaused ? <PlayIcon /> : <PauseIcon />}
                    onClick={handleDialerPause}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.warning.main,
                      '&:hover': { bgcolor: alpha('#fff', 0.9) }
                    }}
                  >
                    {dialerPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<StopIcon />}
                    onClick={handleDialerStop}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.error.main,
                      '&:hover': { bgcolor: alpha('#fff', 0.9) }
                    }}
                  >
                    Stop
                  </Button>
                </>
              )}
              <IconButton
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: alpha('#fff', 0.9) } }}
                onClick={() => setSettingsDialog(true)}
              >
                <SettingsIcon color="primary" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        {dialerActive && (
          <Box sx={{ mt: 3, p: 2, bgcolor: alpha('#fff', 0.1), borderRadius: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 0.5 }}>
                  Status
                </Typography>
                <Chip
                  label={dialerPaused ? 'Paused' : 'Active'}
                  color={dialerPaused ? 'warning' : 'success'}
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 0.5 }}>
                  Calls in Queue
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  {dialerQueue.filter(d => d.status === 'Ready').length}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 0.5 }}>
                  Active Calls
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  {dialerQueue.filter(d => d.status === 'In Call').length}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 0.5 }}>
                  Available Agents
                </Typography>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  {agents.filter(a => a.status === 'Available').length}/{agents.length}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderDialerQueue = () => (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon color="primary" />
          Smart Dialer Queue ({dialerQueue.length})
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }} icon={<AutoModeIcon />}>
          Queue is automatically prioritized by recovery probability, best time to call, and agent skill matching
        </Alert>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Debtor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Recovery Score</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Best Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assigned Agent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Next Action</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dialerQueue.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Chip
                      label={`#${index + 1}`}
                      size="small"
                      sx={{ fontWeight: 600, minWidth: 45 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        {item.debtorName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {item.debtorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.dpd} DPD
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {item.accountNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {item.phone}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.previousAttempts} attempts
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{item.debtAmount.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.priority}
                      color={getPriorityColor(item.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.recoveryProbability}
                        sx={{
                          width: 60,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: item.recoveryProbability >= 70 ? theme.palette.success.main :
                                     item.recoveryProbability >= 50 ? theme.palette.warning.main :
                                     theme.palette.error.main
                          }
                        }}
                      />
                      <Typography variant="caption" fontWeight={600}>
                        {item.recoveryProbability}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<ScheduleIcon fontSize="small" />}
                      label={item.bestTimeToCall}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {item.assignedAgent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Match: {item.skillMatch}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      {item.nextAction === 'Call' && (
                        <Chip icon={<PhoneIcon fontSize="small" />} label="Call" size="small" color="primary" />
                      )}
                      {item.nextAction === 'SMS' && (
                        <Chip icon={<SmsIcon fontSize="small" />} label="SMS" size="small" color="info" />
                      )}
                      {multiChannelEnabled && (
                        <>
                          <Tooltip title="Auto-Email followup">
                            <EmailIcon fontSize="small" color="action" />
                          </Tooltip>
                          <Tooltip title="WhatsApp sequence">
                            <WhatsAppIcon fontSize="small" color="action" />
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={
                        item.status === 'In Call' ? 'success' :
                        item.status === 'Ready' ? 'primary' :
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderAgentPerformance = () => (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon color="primary" />
          Agent Performance & Availability
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {agents.map((agent) => (
            <Grid item xs={12} sm={6} lg={3} key={agent.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: agent.status === 'On Call' ? theme.palette.success.main :
                                     agent.status === 'Available' ? theme.palette.primary.main :
                                     agent.status === 'Break' ? theme.palette.warning.main :
                                     theme.palette.grey[400],
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: `2px solid ${theme.palette.background.paper}`
                          }
                        }}
                      >
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                          {agent.avatar}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {agent.name}
                        </Typography>
                        <Chip
                          label={agent.status}
                          size="small"
                          color={getStatusColor(agent.status)}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Calls Today
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {agent.callsToday}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Contact Rate
                      </Typography>
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        {agent.contactRate}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Recovery Rate
                      </Typography>
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        {agent.recoveryRate}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Avg Duration
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {agent.avgCallDuration}
                      </Typography>
                    </Grid>
                  </Grid>

                  {agent.activeCall && (
                    <Alert severity="info" sx={{ mt: 1.5 }} icon={<PhoneIcon fontSize="small" />}>
                      <Typography variant="caption">
                        Active: {agent.activeCall}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderSettingsDialog = () => (
    <Dialog
      open={settingsDialog}
      onClose={() => setSettingsDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Smart Dialer Configuration
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Dialer Settings
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Dialing Mode</InputLabel>
              <Select defaultValue="predictive" label="Dialing Mode">
                <MenuItem value="preview">Preview Dialing</MenuItem>
                <MenuItem value="progressive">Progressive Dialing</MenuItem>
                <MenuItem value="predictive">Predictive Dialing</MenuItem>
                <MenuItem value="power">Power Dialing</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Lines Per Agent"
              type="number"
              defaultValue={2.5}
              inputProps={{ min: 1, max: 5, step: 0.5 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Ring Time (seconds)"
              type="number"
              defaultValue={30}
              inputProps={{ min: 10, max: 60 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Retry Attempts"
              type="number"
              defaultValue={7}
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              AI Features
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={amdEnabled}
                  onChange={(e) => setAmdEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Answering Machine Detection (AMD)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically detect and drop voicemail messages
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={multiChannelEnabled}
                  onChange={(e) => setMultiChannelEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Multi-Channel Orchestration
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically send SMS/Email/WhatsApp based on call outcome
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Best Time to Call Prediction
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    AI predicts optimal calling times based on historical patterns
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Skill-Based Routing
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Match debtors to agents based on expertise and success rates
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Multi-Channel Sequence
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Define the automated communication sequence after failed call attempts
            </Typography>
          </Grid>

          {multiChannelEnabled && (
            <>
              <Grid item xs={12}>
                <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                  <Typography variant="caption">
                    Configure the automated follow-up sequence. Channels will be triggered in order after a failed call attempt.
                  </Typography>
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {/* Fixed Initial Step */}
                  <Box sx={{ mb: 2, pb: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PhoneIcon color="primary" />
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight={600}>
                          Step 1: Call Attempt
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Initial call to debtor (fixed)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Editable Channel Sequence */}
                  {channelSequence.map((item, index) => {
                    const getChannelIcon = (channel) => {
                      switch (channel) {
                        case 'SMS': return <SmsIcon color="info" />;
                        case 'Email': return <EmailIcon color="secondary" />;
                        case 'WhatsApp': return <WhatsAppIcon sx={{ color: '#25D366' }} />;
                        default: return <PhoneIcon />;
                      }
                    };

                    return (
                      <Box
                        key={item.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: item.enabled ? 'background.default' : alpha(theme.palette.action.disabled, 0.05),
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          {/* Channel Icon & Number */}
                          <Box display="flex" alignItems="center" gap={1}>
                            {getChannelIcon(item.channel)}
                            <Chip label={`Step ${index + 2}`} size="small" />
                          </Box>

                          {/* Channel Configuration */}
                          <Box flex={1}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Channel</InputLabel>
                                  <Select
                                    value={item.channel}
                                    label="Channel"
                                    disabled={!item.enabled}
                                    onChange={(e) => {
                                      const newSequence = [...channelSequence];
                                      newSequence[index].channel = e.target.value;
                                      setChannelSequence(newSequence);
                                    }}
                                  >
                                    <MenuItem value="SMS">SMS</MenuItem>
                                    <MenuItem value="Email">Email</MenuItem>
                                    <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>

                              <Grid item xs={6} sm={2}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Delay"
                                  type="number"
                                  value={item.delay}
                                  disabled={!item.enabled}
                                  onChange={(e) => {
                                    const newSequence = [...channelSequence];
                                    newSequence[index].delay = parseInt(e.target.value);
                                    setChannelSequence(newSequence);
                                  }}
                                  inputProps={{ min: 1 }}
                                />
                              </Grid>

                              <Grid item xs={6} sm={2}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Unit</InputLabel>
                                  <Select
                                    value={item.delayUnit}
                                    label="Unit"
                                    disabled={!item.enabled}
                                    onChange={(e) => {
                                      const newSequence = [...channelSequence];
                                      newSequence[index].delayUnit = e.target.value;
                                      setChannelSequence(newSequence);
                                    }}
                                  >
                                    <MenuItem value="minutes">Minutes</MenuItem>
                                    <MenuItem value="hours">Hours</MenuItem>
                                    <MenuItem value="days">Days</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>

                              <Grid item xs={12} sm={5}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Template</InputLabel>
                                  <Select
                                    value={item.template}
                                    label="Template"
                                    disabled={!item.enabled}
                                    onChange={(e) => {
                                      const newSequence = [...channelSequence];
                                      newSequence[index].template = e.target.value;
                                      setChannelSequence(newSequence);
                                    }}
                                  >
                                    <MenuItem value="Payment Reminder SMS">Payment Reminder</MenuItem>
                                    <MenuItem value="Detailed Statement">Detailed Statement</MenuItem>
                                    <MenuItem value="Interactive Payment Link">Payment Link</MenuItem>
                                    <MenuItem value="Urgent Notice">Urgent Notice</MenuItem>
                                    <MenuItem value="Settlement Offer">Settlement Offer</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Action Buttons */}
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <Tooltip title={item.enabled ? "Disable" : "Enable"}>
                              <Switch
                                size="small"
                                checked={item.enabled}
                                onChange={(e) => {
                                  const newSequence = [...channelSequence];
                                  newSequence[index].enabled = e.target.checked;
                                  setChannelSequence(newSequence);
                                }}
                              />
                            </Tooltip>

                            <Box display="flex" gap={0.5}>
                              <Tooltip title="Move Up">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={index === 0}
                                    onClick={() => {
                                      if (index > 0) {
                                        const newSequence = [...channelSequence];
                                        [newSequence[index], newSequence[index - 1]] = [newSequence[index - 1], newSequence[index]];
                                        setChannelSequence(newSequence);
                                      }
                                    }}
                                  >
                                    <ArrowUpIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              <Tooltip title="Move Down">
                                <span>
                                  <IconButton
                                    size="small"
                                    disabled={index === channelSequence.length - 1}
                                    onClick={() => {
                                      if (index < channelSequence.length - 1) {
                                        const newSequence = [...channelSequence];
                                        [newSequence[index], newSequence[index + 1]] = [newSequence[index + 1], newSequence[index]];
                                        setChannelSequence(newSequence);
                                      }
                                    }}
                                  >
                                    <ArrowDownIcon fontSize="small" />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              <Tooltip title="Remove">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setChannelSequence(channelSequence.filter((_, i) => i !== index));
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}

                  {/* Add Channel Button */}
                  {channelSequence.length < 5 && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      fullWidth
                      onClick={() => {
                        const newId = Math.max(...channelSequence.map(c => c.id), 0) + 1;
                        setChannelSequence([
                          ...channelSequence,
                          { id: newId, channel: 'SMS', enabled: true, delay: 1, delayUnit: 'hours', template: 'Payment Reminder SMS' }
                        ]);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Add Channel
                    </Button>
                  )}
                </Paper>
              </Grid>
            </>
          )}

          {!multiChannelEnabled && (
            <Grid item xs={12}>
              <Alert severity="warning" variant="outlined">
                <Typography variant="body2">
                  Multi-Channel Orchestration is disabled. Enable it above to configure the automated follow-up sequence.
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setSettingsDialog(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setSettingsDialog(false)}>
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderWorkflowsList = () => (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CampaignIcon color="primary" />
          Active Workflows ({workflows.length})
        </Typography>

        {workflows.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              No workflows created yet. Click "Create New Workflow" to get started.
            </Typography>
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableCell sx={{ fontWeight: 600 }}>Workflow ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Workflow Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Channels</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Target Segments</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Schedule</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Performance</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow key={workflow.id} hover>
                    <TableCell>
                      <Chip
                        label={workflow.workflowId || `WF-${workflow.id}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {workflow.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {workflow.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          workflow.type === 'payment_reminder' ? 'Payment Reminder' :
                          workflow.type === 'settlement_negotiation' ? 'Settlement' :
                          workflow.type === 'legal_notice' ? 'Legal Notice' :
                          workflow.type === 'ptp_followup' ? 'PTP Follow-up' :
                          'Recovery'
                        }
                        size="small"
                        icon={
                          workflow.type === 'payment_reminder' ? <MoneyIcon fontSize="small" /> :
                          workflow.type === 'settlement_negotiation' ? <CheckCircleIcon fontSize="small" /> :
                          workflow.type === 'legal_notice' ? <LegalIcon fontSize="small" /> :
                          <TrendingUpIcon fontSize="small" />
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {workflow.channels.map((channel) => (
                          <Tooltip key={channel} title={channel.toUpperCase()}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor:
                              channel === 'call' ? '#4CAF50' :
                              channel === 'sms' ? '#FF9800' :
                              channel === 'email' ? '#2196F3' :
                              '#25D366'
                            }}>
                              {channel === 'call' && <PhoneIcon sx={{ fontSize: 14 }} />}
                              {channel === 'sms' && <SmsIcon sx={{ fontSize: 14 }} />}
                              {channel === 'email' && <EmailIcon sx={{ fontSize: 14 }} />}
                              {channel === 'whatsapp' && <WhatsAppIcon sx={{ fontSize: 14 }} />}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {workflow.segments.slice(0, 2).map((segment, idx) => (
                          <Chip key={idx} label={segment} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                        {workflow.segments.length > 2 && (
                          <Chip label={`+${workflow.segments.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={workflow.status === 'active' ? 'Active' : workflow.status === 'paused' ? 'Paused' : 'Scheduled'}
                        color={workflow.status === 'active' ? 'success' : workflow.status === 'paused' ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {workflow.scheduleType === 'immediate' ? 'Immediate' :
                         workflow.scheduleType === 'scheduled' ? 'Scheduled' : 'Recurring'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Contacts: {workflow.totalContacts}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={workflow.successRate}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            mt: 0.5,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: workflow.successRate >= 30 ? theme.palette.success.main : theme.palette.warning.main
                            }
                          }}
                        />
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          {workflow.successRate}% Success
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title={workflow.status === 'active' ? 'Pause' : 'Activate'}>
                          <IconButton
                            size="small"
                            color={workflow.status === 'active' ? 'warning' : 'success'}
                            onClick={() => {
                              const updated = workflows.map(w =>
                                w.id === workflow.id
                                  ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
                                  : w
                              );
                              setWorkflows(updated);
                            }}
                          >
                            {workflow.status === 'active' ? <PauseIcon fontSize="small" /> : <PlayIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedWorkflow(workflow);
                              setWorkflowDetailsDialog(true);
                            }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
                                setWorkflows(workflows.filter(w => w.id !== workflow.id));
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderWorkflowDetailsDialog = () => {
    if (!selectedWorkflow) return null;

    return (
      <Dialog
        open={workflowDetailsDialog}
        onClose={() => {
          setWorkflowDetailsDialog(false);
          setSelectedWorkflow(null);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white', pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#fff', 0.2) }}>
                <CampaignIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedWorkflow.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={selectedWorkflow.workflowId || `WF-${selectedWorkflow.id}`}
                    size="small"
                    sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', fontWeight: 600 }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Workflow Details & Performance Metrics
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Chip
              label={selectedWorkflow.status === 'active' ? 'Active' : selectedWorkflow.status === 'paused' ? 'Paused' : 'Scheduled'}
              color={selectedWorkflow.status === 'active' ? 'success' : selectedWorkflow.status === 'paused' ? 'warning' : 'default'}
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {/* Overview Section */}
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">
                  {selectedWorkflow.description || 'No description provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="caption" color="text.secondary">
                    Workflow Type
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedWorkflow.type === 'payment_reminder' ? 'Payment Reminder' :
                     selectedWorkflow.type === 'settlement_negotiation' ? 'Settlement' :
                     selectedWorkflow.type === 'legal_notice' ? 'Legal Notice' :
                     selectedWorkflow.type === 'ptp_followup' ? 'PTP Follow-up' : 'Recovery'}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="caption" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedWorkflow.createdDate}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last Run
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedWorkflow.lastRun || 'Not run yet'}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Performance Metrics */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                  <PeopleIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight={600}>
                    {selectedWorkflow.totalContacts.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Contacts
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight={600}>
                    {selectedWorkflow.successRate}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Success Rate
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                  <PhoneIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight={600}>
                    {Math.round(selectedWorkflow.totalContacts * 0.65)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Calls Made
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                  <TrendingUpIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" fontWeight={600}>
                    ₹{((selectedWorkflow.totalContacts * selectedWorkflow.successRate / 100) * 15000).toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Amount Recovered
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Channel Analytics & Performance */}
          {selectedWorkflow.channelMetrics && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Channel-wise Analytics & Engagement
              </Typography>
              <Grid container spacing={3}>
                {selectedWorkflow.channels.map((channelKey) => {
                  const metrics = selectedWorkflow.channelMetrics[channelKey];
                  if (!metrics || metrics.sent === 0) return null;

                  const channelInfo = {
                    call: { label: 'Phone Call', icon: <PhoneIcon />, color: '#4CAF50' },
                    sms: { label: 'SMS', icon: <SmsIcon />, color: '#FF9800' },
                    email: { label: 'Email', icon: <EmailIcon />, color: '#2196F3' },
                    whatsapp: { label: 'WhatsApp', icon: <WhatsAppIcon />, color: '#25D366' }
                  }[channelKey];

                  return (
                    <Grid item xs={12} key={channelKey}>
                      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
                        {/* Header */}
                        <Box sx={{
                          p: 2,
                          bgcolor: alpha(channelInfo.color, 0.1),
                          borderBottom: `3px solid ${channelInfo.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <Avatar sx={{ bgcolor: channelInfo.color, width: 40, height: 40 }}>
                            {channelInfo.icon}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight={600}>
                              {channelInfo.label} Performance
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {metrics.sent.toLocaleString()} messages sent
                            </Typography>
                          </Box>
                          <Chip
                            label={`${metrics.deliveryRate.toFixed(1)}% Delivered`}
                            color="success"
                            variant="outlined"
                          />
                        </Box>

                        {/* Metrics Grid */}
                        <Box sx={{ p: 3 }}>
                          <Grid container spacing={3}>
                            {/* Call-specific metrics */}
                            {channelKey === 'call' && (
                              <>
                                <Grid item xs={6} md={3}>
                                  <Box>
                                    <Typography variant="h5" fontWeight={600} color="primary.main">
                                      {metrics.delivered.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Delivered</Typography>
                                    <LinearProgress
                                      variant="determinate"
                                      value={metrics.deliveryRate}
                                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Box>
                                    <Typography variant="h5" fontWeight={600} color="success.main">
                                      {metrics.answered.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Answered</Typography>
                                    <LinearProgress
                                      variant="determinate"
                                      value={metrics.responseRate}
                                      color="success"
                                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                    />
                                    <Typography variant="caption" fontWeight={600}>
                                      {metrics.responseRate.toFixed(1)}% Response Rate
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Box>
                                    <Typography variant="h5" fontWeight={600} color="warning.main">
                                      {metrics.avgDuration}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Avg Duration</Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Box>
                                    <Typography variant="h5" fontWeight={600} color="error.main">
                                      {metrics.conversionRate.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Conversion Rate</Typography>
                                    <LinearProgress
                                      variant="determinate"
                                      value={metrics.conversionRate}
                                      color="error"
                                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Alert severity="info" sx={{ mt: 1 }}>
                                    <Typography variant="caption">
                                      <strong>Call Failures:</strong> Busy ({metrics.failureReasons.busy}),
                                      No Answer ({metrics.failureReasons.no_answer}),
                                      Invalid Number ({metrics.failureReasons.invalid})
                                    </Typography>
                                  </Alert>
                                </Grid>
                              </>
                            )}

                            {/* SMS-specific metrics */}
                            {channelKey === 'sms' && (
                              <>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.sent}</Typography>
                                    <Typography variant="caption" color="text.secondary">Sent</Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.delivered}</Typography>
                                    <Typography variant="caption" color="text.secondary">Delivered</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.deliveryRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.opened}</Typography>
                                    <Typography variant="caption" color="text.secondary">Opened</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.openRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.clicked}</Typography>
                                    <Typography variant="caption" color="text.secondary">Clicked</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.clickRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.replied}</Typography>
                                    <Typography variant="caption" color="text.secondary">Replied</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.responseRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.bounced}</Typography>
                                    <Typography variant="caption" color="text.secondary">Bounced</Typography>
                                  </Box>
                                </Grid>
                              </>
                            )}

                            {/* Email-specific metrics */}
                            {channelKey === 'email' && (
                              <>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.sent}</Typography>
                                    <Typography variant="caption" color="text.secondary">Sent</Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.delivered}</Typography>
                                    <Typography variant="caption" color="text.secondary">Delivered</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.deliveryRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.opened}</Typography>
                                    <Typography variant="caption" color="text.secondary">Opened</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.openRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.clicked}</Typography>
                                    <Typography variant="caption" color="text.secondary">Clicked</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.clickRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.replied}</Typography>
                                    <Typography variant="caption" color="text.secondary">Replied</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.responseRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.bounced}</Typography>
                                    <Typography variant="caption" color="text.secondary">Bounced</Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                                    <Typography variant="caption">
                                      <strong>Email Health:</strong> Unsubscribed: {metrics.unsubscribed}, Spam Reports: {metrics.spamReports}
                                    </Typography>
                                  </Alert>
                                </Grid>
                              </>
                            )}

                            {/* WhatsApp-specific metrics */}
                            {channelKey === 'whatsapp' && metrics.sent > 0 && (
                              <>
                                <Grid item xs={6} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.delivered}</Typography>
                                    <Typography variant="caption" color="text.secondary">Delivered</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.deliveryRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.read}</Typography>
                                    <Typography variant="caption" color="text.secondary">Read</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.readRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.replied}</Typography>
                                    <Typography variant="caption" color="text.secondary">Replied</Typography>
                                    <Typography variant="caption" display="block" fontWeight={600}>
                                      {metrics.responseRate.toFixed(1)}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 2 }}>
                                    <Typography variant="h5" fontWeight={600}>{metrics.conversionRate.toFixed(1)}%</Typography>
                                    <Typography variant="caption" color="text.secondary">Conversion</Typography>
                                  </Box>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          <Divider />

          {/* Channel Configuration */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Channel Configuration
            </Typography>
            <Grid container spacing={2}>
              {selectedWorkflow.channels.map((channelKey) => {
                const config = selectedWorkflow.channelConfigs[channelKey];
                const channelInfo = {
                  call: { label: 'Phone Call', icon: <PhoneIcon />, color: '#4CAF50' },
                  sms: { label: 'SMS', icon: <SmsIcon />, color: '#FF9800' },
                  email: { label: 'Email', icon: <EmailIcon />, color: '#2196F3' },
                  whatsapp: { label: 'WhatsApp', icon: <WhatsAppIcon />, color: '#25D366' }
                }[channelKey];

                return (
                  <Grid item xs={12} md={6} key={channelKey}>
                    <Card variant="outlined" sx={{ p: 2, borderLeft: 4, borderLeftColor: channelInfo.color }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar sx={{ bgcolor: channelInfo.color, width: 32, height: 32 }}>
                          {channelInfo.icon}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {channelInfo.label}
                        </Typography>
                      </Box>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Provider</Typography>
                          <Typography variant="body2" fontWeight={500}>{config.provider}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Line / Number</Typography>
                          <Typography variant="body2" fontWeight={500}>{config.line}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Template</Typography>
                          <Typography variant="body2" fontWeight={500}>{config.template}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Send Interval</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {config.intervalValue} {config.intervalUnit}
                          </Typography>
                        </Box>
                        {config.triggerConditions && config.triggerConditions.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">Trigger Conditions</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                              {config.triggerConditions.map((trigger, idx) => (
                                <Chip
                                  key={idx}
                                  label={
                                    trigger === 'no_response' ? 'No Response' :
                                    trigger === 'no_action' ? 'No Action' : 'Always Send'
                                  }
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Stack>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Divider />

          {/* Dialer & AI Settings */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Dialer & AI Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Dialer Settings
                  </Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Call Strategy</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedWorkflow.callStrategy?.charAt(0).toUpperCase() + selectedWorkflow.callStrategy?.slice(1) || 'Preview'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Max Attempts</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedWorkflow.maxAttempts || 3}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Call Window</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedWorkflow.callTimeStart || '09:00'} - {selectedWorkflow.callTimeEnd || '18:00'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">AMD Enabled</Typography>
                      <Chip
                        label={selectedWorkflow.amdEnabled ? 'Yes' : 'No'}
                        size="small"
                        color={selectedWorkflow.amdEnabled ? 'success' : 'default'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Call Recording</Typography>
                      <Chip
                        label={selectedWorkflow.recordCalls ? 'Enabled' : 'Disabled'}
                        size="small"
                        color={selectedWorkflow.recordCalls ? 'success' : 'default'}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    AI Features
                  </Typography>
                  <Stack spacing={1}>
                    <FormControlLabel
                      control={<Checkbox checked={selectedWorkflow.aiAgentMatching} size="small" disabled />}
                      label={<Typography variant="body2">AI Agent Matching</Typography>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedWorkflow.recoveryScoring} size="small" disabled />}
                      label={<Typography variant="body2">Recovery Probability Scoring</Typography>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedWorkflow.bestTimePredict} size="small" disabled />}
                      label={<Typography variant="body2">Best Time to Call Prediction</Typography>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedWorkflow.sentimentAnalysis} size="small" disabled />}
                      label={<Typography variant="body2">Sentiment Analysis</Typography>}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={selectedWorkflow.autoDisposition} size="small" disabled />}
                      label={<Typography variant="body2">Auto-Disposition</Typography>}
                    />
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Target Audience */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Target Audience
            </Typography>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Segments
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedWorkflow.segments.map((segment, idx) => (
                      <Chip key={idx} label={segment} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
                {(selectedWorkflow.dpdMin || selectedWorkflow.dpdMax) && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      DPD Range
                    </Typography>
                    <Typography variant="body2">
                      {selectedWorkflow.dpdMin || '0'} - {selectedWorkflow.dpdMax || '∞'} days
                    </Typography>
                  </Grid>
                )}
                {(selectedWorkflow.balanceMin || selectedWorkflow.balanceMax) && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Balance Range
                    </Typography>
                    <Typography variant="body2">
                      ₹{selectedWorkflow.balanceMin || '0'} - ₹{selectedWorkflow.balanceMax || '∞'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => {
            setWorkflowDetailsDialog(false);
            setSelectedWorkflow(null);
          }}>
            Close
          </Button>
          <Button
            variant="outlined"
            startIcon={selectedWorkflow.status === 'active' ? <PauseIcon /> : <PlayIcon />}
            color={selectedWorkflow.status === 'active' ? 'warning' : 'success'}
            onClick={() => {
              const updated = workflows.map(w =>
                w.id === selectedWorkflow.id
                  ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
                  : w
              );
              setWorkflows(updated);
              setSelectedWorkflow({ ...selectedWorkflow, status: selectedWorkflow.status === 'active' ? 'paused' : 'active' });
            }}
          >
            {selectedWorkflow.status === 'active' ? 'Pause Workflow' : 'Activate Workflow'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Workflow Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage debt collection workflows with AI-powered automation
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setCreateWorkflowDialog(true)}
          sx={{ px: 3 }}
        >
          Create New Workflow
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          <strong>AI-Powered Workflows:</strong> Create automated collection workflows with predictive dialing, answering machine detection,
          best time to call prediction, skill-based routing, and multi-channel orchestration (Call → SMS → Email → WhatsApp).
        </Typography>
      </Alert>

      {renderWorkflowsList()}
      {renderDialerControls()}
      {renderDialerQueue()}
      {renderAgentPerformance()}
      {renderSettingsDialog()}
      {renderWorkflowDetailsDialog()}

      {/* Create Workflow Dialog */}
      <Dialog
        open={createWorkflowDialog}
        onClose={() => setCreateWorkflowDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <CampaignIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">Create Debt Collection Workflow</Typography>
                <Typography variant="caption" color="text.secondary">
                  Configure automated workflow with AI-powered features
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setCreateWorkflowDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: 500, p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={workflowTab}
              onChange={(e, newValue) => setWorkflowTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Workflow & Channels" icon={<CampaignIcon />} iconPosition="start" />
              <Tab label="Dialer Settings" icon={<PhoneIcon />} iconPosition="start" />
              <Tab label="AI Features" icon={<AIIcon />} iconPosition="start" />
              <Tab label="Multi-Channel Sequence" icon={<RouteIcon />} iconPosition="start" />
              <Tab label="Target & Schedule" icon={<ScheduleIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Tab 1: Workflow Information & Channel Selection */}
            {workflowTab === 0 && (
              <Box>
                {/* TAB CONTENT */}
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Workflow Information & Channel Selection
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Set up your debt collection workflow and select communication channels
                </Typography>

                {/* Basic Information */}
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Workflow Name"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                      placeholder="e.g., Q1 Payment Recovery Campaign"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={newWorkflow.description}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Workflow Type</InputLabel>
                      <Select
                        value={newWorkflow.type}
                        label="Workflow Type"
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, type: e.target.value })}
                      >
                        <MenuItem value="payment_reminder">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MoneyIcon fontSize="small" />
                            Payment Reminder
                          </Box>
                        </MenuItem>
                        <MenuItem value="settlement_negotiation">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon fontSize="small" />
                            Settlement Negotiation
                          </Box>
                        </MenuItem>
                        <MenuItem value="legal_notice">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LegalIcon fontSize="small" />
                            Legal Notice
                          </Box>
                        </MenuItem>
                        <MenuItem value="ptp_followup">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon fontSize="small" />
                            PTP Follow-up
                          </Box>
                        </MenuItem>
                        <MenuItem value="recovery_campaign">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpIcon fontSize="small" />
                            Recovery Campaign
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Channel Selection - PRIMARY FOCUS */}
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Select Communication Channels
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose which channels to use for this workflow
                </Typography>

                <Grid container spacing={2}>
                  {[
                    { key: 'call', label: 'Phone Call', icon: <PhoneIcon />, color: '#4CAF50' },
                    { key: 'sms', label: 'SMS', icon: <SmsIcon />, color: '#FF9800' },
                    { key: 'email', label: 'Email', icon: <EmailIcon />, color: '#2196F3' },
                    { key: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppIcon />, color: '#25D366' }
                  ].map((channel) => (
                    <Grid item xs={6} md={3} key={channel.key}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: 2,
                          borderColor: newWorkflow.channels.includes(channel.key) ? channel.color : 'divider',
                          bgcolor: newWorkflow.channels.includes(channel.key) ? alpha(channel.color, 0.1) : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: channel.color,
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => {
                          if (newWorkflow.channels.includes(channel.key)) {
                            setNewWorkflow({
                              ...newWorkflow,
                              channels: newWorkflow.channels.filter(c => c !== channel.key)
                            });
                          } else {
                            setNewWorkflow({
                              ...newWorkflow,
                              channels: [...newWorkflow.channels, channel.key]
                            });
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Avatar
                            sx={{
                              bgcolor: channel.color,
                              mx: 'auto',
                              mb: 1,
                              width: 56,
                              height: 56
                            }}
                          >
                            {channel.icon}
                          </Avatar>
                          <Typography variant="body2" fontWeight="600">
                            {channel.label}
                          </Typography>
                          {newWorkflow.channels.includes(channel.key) && (
                            <Chip
                              label="Selected"
                              size="small"
                              color="success"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {newWorkflow.channels.length === 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Please select at least one communication channel
                  </Alert>
                )}

                {/* Channel Configuration - Provider, Line, Template */}
                {newWorkflow.channels.length > 0 && (
                  <>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h6" gutterBottom fontWeight="600">
                      Configure Selected Channels
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Set up provider, line, and template for each channel
                    </Typography>

                    <Grid container spacing={3}>
                      {newWorkflow.channels.map((channelKey) => {
                        const channelInfo = {
                          call: { label: 'Phone Call', icon: <PhoneIcon />, color: '#4CAF50', providers: ['Twilio', 'Exotel', 'Ozonetel', 'Knowlarity'] },
                          sms: { label: 'SMS', icon: <SmsIcon />, color: '#FF9800', providers: ['Twilio', 'MSG91', 'Gupshup', 'AWS SNS'] },
                          email: { label: 'Email', icon: <EmailIcon />, color: '#2196F3', providers: ['SendGrid', 'AWS SES', 'Mailgun', 'Postmark'] },
                          whatsapp: { label: 'WhatsApp', icon: <WhatsAppIcon />, color: '#25D366', providers: ['Twilio', 'Gupshup', 'MessageBird', 'WATI'] }
                        }[channelKey];

                        return (
                          <Grid item xs={12} key={channelKey}>
                            <Card variant="outlined" sx={{ p: 3, bgcolor: alpha(channelInfo.color, 0.03) }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Avatar sx={{ bgcolor: channelInfo.color }}>
                                  {channelInfo.icon}
                                </Avatar>
                                <Typography variant="h6" fontWeight="600">
                                  {channelInfo.label} Configuration
                                </Typography>
                              </Box>

                              <Grid container spacing={2}>
                                {/* Provider Selection */}
                                <Grid item xs={12} md={4}>
                                  <FormControl fullWidth required>
                                    <InputLabel>Provider</InputLabel>
                                    <Select
                                      value={newWorkflow.channelConfigs[channelKey].provider}
                                      label="Provider"
                                      onChange={(e) => {
                                        setNewWorkflow({
                                          ...newWorkflow,
                                          channelConfigs: {
                                            ...newWorkflow.channelConfigs,
                                            [channelKey]: {
                                              ...newWorkflow.channelConfigs[channelKey],
                                              provider: e.target.value,
                                              line: '', // Reset line when provider changes
                                              template: '' // Reset template when provider changes
                                            }
                                          }
                                        });
                                      }}
                                    >
                                      {channelInfo.providers.map((provider) => (
                                        <MenuItem key={provider} value={provider}>
                                          {provider}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>

                                {/* Line/Number Selection - Only show if provider is selected */}
                                {newWorkflow.channelConfigs[channelKey].provider && (
                                  <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                      <InputLabel>Line / Number</InputLabel>
                                      <Select
                                        value={newWorkflow.channelConfigs[channelKey].line}
                                        label="Line / Number"
                                        onChange={(e) => {
                                          setNewWorkflow({
                                            ...newWorkflow,
                                            channelConfigs: {
                                              ...newWorkflow.channelConfigs,
                                              [channelKey]: {
                                                ...newWorkflow.channelConfigs[channelKey],
                                                line: e.target.value
                                              }
                                            }
                                          });
                                        }}
                                      >
                                        {channelKey === 'call' && [
                                          <MenuItem key="1" value="+91-8010012345">+91-8010012345 (Primary)</MenuItem>,
                                          <MenuItem key="2" value="+91-8010012346">+91-8010012346 (Secondary)</MenuItem>,
                                          <MenuItem key="3" value="+91-8010012347">+91-8010012347 (Backup)</MenuItem>
                                        ]}
                                        {channelKey === 'sms' && [
                                          <MenuItem key="1" value="VRICHT">VRICHT (6-char Sender ID)</MenuItem>,
                                          <MenuItem key="2" value="VRIGHT">VRIGHT (6-char Sender ID)</MenuItem>,
                                          <MenuItem key="3" value="+91-8010012345">+91-8010012345 (Long Code)</MenuItem>
                                        ]}
                                        {channelKey === 'email' && [
                                          <MenuItem key="1" value="noreply@veriright.com">noreply@veriright.com</MenuItem>,
                                          <MenuItem key="2" value="collections@veriright.com">collections@veriright.com</MenuItem>,
                                          <MenuItem key="3" value="recovery@veriright.com">recovery@veriright.com</MenuItem>
                                        ]}
                                        {channelKey === 'whatsapp' && [
                                          <MenuItem key="1" value="+91-8010098765">+91-8010098765 (Business)</MenuItem>,
                                          <MenuItem key="2" value="+91-8010098766">+91-8010098766 (Support)</MenuItem>,
                                          <MenuItem key="3" value="+91-8010098767">+91-8010098767 (Recovery)</MenuItem>
                                        ]}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                )}

                                {/* Template Selection - Only show if provider is selected */}
                                {newWorkflow.channelConfigs[channelKey].provider && (
                                  <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                      <InputLabel>Template</InputLabel>
                                      <Select
                                        value={newWorkflow.channelConfigs[channelKey].template}
                                        label="Template"
                                        onChange={(e) => {
                                          setNewWorkflow({
                                            ...newWorkflow,
                                            channelConfigs: {
                                              ...newWorkflow.channelConfigs,
                                              [channelKey]: {
                                                ...newWorkflow.channelConfigs[channelKey],
                                                template: e.target.value
                                              }
                                            }
                                          });
                                        }}
                                      >
                                        {channelKey === 'call' && [
                                          <MenuItem key="1" value="payment_reminder_script">Payment Reminder Script</MenuItem>,
                                          <MenuItem key="2" value="settlement_negotiation">Settlement Negotiation</MenuItem>,
                                          <MenuItem key="3" value="ptp_followup">PTP Follow-up</MenuItem>,
                                          <MenuItem key="4" value="legal_notice">Legal Notice</MenuItem>
                                        ]}
                                        {channelKey === 'sms' && [
                                          <MenuItem key="1" value="payment_reminder_sms">Payment Reminder SMS</MenuItem>,
                                          <MenuItem key="2" value="payment_link_sms">Payment Link SMS</MenuItem>,
                                          <MenuItem key="3" value="settlement_offer_sms">Settlement Offer SMS</MenuItem>,
                                          <MenuItem key="4" value="urgent_notice_sms">Urgent Notice SMS</MenuItem>
                                        ]}
                                        {channelKey === 'email' && [
                                          <MenuItem key="1" value="payment_notice_email">Payment Notice Email</MenuItem>,
                                          <MenuItem key="2" value="detailed_statement">Detailed Statement</MenuItem>,
                                          <MenuItem key="3" value="settlement_proposal">Settlement Proposal</MenuItem>,
                                          <MenuItem key="4" value="legal_notice_email">Legal Notice Email</MenuItem>
                                        ]}
                                        {channelKey === 'whatsapp' && [
                                          <MenuItem key="1" value="payment_reminder_wa">Payment Reminder</MenuItem>,
                                          <MenuItem key="2" value="interactive_payment_link">Interactive Payment Link</MenuItem>,
                                          <MenuItem key="3" value="settlement_offer_wa">Settlement Offer</MenuItem>,
                                          <MenuItem key="4" value="statement_wa">Account Statement</MenuItem>
                                        ]}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                )}

                                {/* Interval Configuration - Only show if provider is selected */}
                                {newWorkflow.channelConfigs[channelKey].provider && (
                                  <>
                                    <Grid item xs={12}>
                                      <Divider sx={{ my: 2 }}>
                                        <Chip label="Timing & Trigger Configuration" size="small" />
                                      </Divider>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2" gutterBottom>
                                        Send Interval
                                      </Typography>
                                      <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                          <TextField
                                            fullWidth
                                            type="number"
                                            label="Interval"
                                            size="small"
                                            value={newWorkflow.channelConfigs[channelKey].intervalValue}
                                            onChange={(e) => {
                                              setNewWorkflow({
                                                ...newWorkflow,
                                                channelConfigs: {
                                                  ...newWorkflow.channelConfigs,
                                                  [channelKey]: {
                                                    ...newWorkflow.channelConfigs[channelKey],
                                                    intervalValue: parseInt(e.target.value) || 0
                                                  }
                                                }
                                              });
                                            }}
                                            InputProps={{ inputProps: { min: 1 } }}
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <FormControl fullWidth size="small">
                                            <InputLabel>Unit</InputLabel>
                                            <Select
                                              value={newWorkflow.channelConfigs[channelKey].intervalUnit}
                                              label="Unit"
                                              onChange={(e) => {
                                                setNewWorkflow({
                                                  ...newWorkflow,
                                                  channelConfigs: {
                                                    ...newWorkflow.channelConfigs,
                                                    [channelKey]: {
                                                      ...newWorkflow.channelConfigs[channelKey],
                                                      intervalUnit: e.target.value
                                                    }
                                                  }
                                                });
                                              }}
                                            >
                                              <MenuItem value="minutes">Minutes</MenuItem>
                                              <MenuItem value="hours">Hours</MenuItem>
                                              <MenuItem value="days">Days</MenuItem>
                                            </Select>
                                          </FormControl>
                                        </Grid>
                                      </Grid>
                                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        Time to wait before sending this message
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2" gutterBottom>
                                        Trigger Conditions
                                      </Typography>
                                      <FormGroup>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              checked={newWorkflow.channelConfigs[channelKey].triggerConditions.includes('no_response')}
                                              onChange={(e) => {
                                                const conditions = newWorkflow.channelConfigs[channelKey].triggerConditions;
                                                const newConditions = e.target.checked
                                                  ? [...conditions, 'no_response']
                                                  : conditions.filter(c => c !== 'no_response');
                                                setNewWorkflow({
                                                  ...newWorkflow,
                                                  channelConfigs: {
                                                    ...newWorkflow.channelConfigs,
                                                    [channelKey]: {
                                                      ...newWorkflow.channelConfigs[channelKey],
                                                      triggerConditions: newConditions
                                                    }
                                                  }
                                                });
                                              }}
                                            />
                                          }
                                          label={
                                            <Typography variant="body2">
                                              Send if no response to previous message
                                            </Typography>
                                          }
                                        />
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              checked={newWorkflow.channelConfigs[channelKey].triggerConditions.includes('no_action')}
                                              onChange={(e) => {
                                                const conditions = newWorkflow.channelConfigs[channelKey].triggerConditions;
                                                const newConditions = e.target.checked
                                                  ? [...conditions, 'no_action']
                                                  : conditions.filter(c => c !== 'no_action');
                                                setNewWorkflow({
                                                  ...newWorkflow,
                                                  channelConfigs: {
                                                    ...newWorkflow.channelConfigs,
                                                    [channelKey]: {
                                                      ...newWorkflow.channelConfigs[channelKey],
                                                      triggerConditions: newConditions
                                                    }
                                                  }
                                                });
                                              }}
                                            />
                                          }
                                          label={
                                            <Typography variant="body2">
                                              Send if no action taken (click/conversion)
                                            </Typography>
                                          }
                                        />
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              checked={newWorkflow.channelConfigs[channelKey].triggerConditions.includes('always_send')}
                                              onChange={(e) => {
                                                const conditions = newWorkflow.channelConfigs[channelKey].triggerConditions;
                                                const newConditions = e.target.checked
                                                  ? [...conditions, 'always_send']
                                                  : conditions.filter(c => c !== 'always_send');
                                                setNewWorkflow({
                                                  ...newWorkflow,
                                                  channelConfigs: {
                                                    ...newWorkflow.channelConfigs,
                                                    [channelKey]: {
                                                      ...newWorkflow.channelConfigs[channelKey],
                                                      triggerConditions: newConditions
                                                    }
                                                  }
                                                });
                                              }}
                                            />
                                          }
                                          label={
                                            <Typography variant="body2">
                                              Always send (regardless of response)
                                            </Typography>
                                          }
                                        />
                                      </FormGroup>
                                    </Grid>
                                  </>
                                )}
                              </Grid>

                              {/* Show configuration summary if all required fields are filled */}
                              {newWorkflow.channelConfigs[channelKey].provider &&
                               newWorkflow.channelConfigs[channelKey].line &&
                               newWorkflow.channelConfigs[channelKey].template && (
                                <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon />}>
                                  <Typography variant="body2" fontWeight="600" gutterBottom>
                                    Configuration Complete
                                  </Typography>
                                  <Typography variant="caption" component="div">
                                    <strong>Provider:</strong> {newWorkflow.channelConfigs[channelKey].provider} |
                                    <strong> Line:</strong> {newWorkflow.channelConfigs[channelKey].line}
                                  </Typography>
                                  <Typography variant="caption" component="div">
                                    <strong>Template:</strong> {newWorkflow.channelConfigs[channelKey].template}
                                  </Typography>
                                  <Typography variant="caption" component="div">
                                    <strong>Interval:</strong> {newWorkflow.channelConfigs[channelKey].intervalValue} {newWorkflow.channelConfigs[channelKey].intervalUnit}
                                  </Typography>
                                  {newWorkflow.channelConfigs[channelKey].triggerConditions.length > 0 && (
                                    <Typography variant="caption" component="div">
                                      <strong>Triggers:</strong> {newWorkflow.channelConfigs[channelKey].triggerConditions.map(t =>
                                        t === 'no_response' ? 'No Response' :
                                        t === 'no_action' ? 'No Action' :
                                        'Always Send'
                                      ).join(', ')}
                                    </Typography>
                                  )}
                                </Alert>
                              )}
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </>
                )}
              </Box>
            )}

            {/* Tab 2: Dialer Settings */}
            {workflowTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Dialer Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Configure call settings and dialing strategy
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Call Strategy</InputLabel>
                      <Select
                        value={newWorkflow.callStrategy}
                        label="Call Strategy"
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, callStrategy: e.target.value })}
                      >
                        <MenuItem value="preview">
                          <Box>
                            <Typography variant="body2" fontWeight="600">Preview Dialing</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Agent reviews debtor info before call is placed
                            </Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="power">
                          <Box>
                            <Typography variant="body2" fontWeight="600">Power Dialing</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Auto-dial when agent becomes available
                            </Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="predictive">
                          <Box>
                            <Typography variant="body2" fontWeight="600">Predictive Dialing</Typography>
                            <Typography variant="caption" color="text.secondary">
                              AI-optimized dialing based on agent availability
                            </Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Max Attempts per Debtor"
                      value={newWorkflow.maxAttempts}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, maxAttempts: parseInt(e.target.value) })}
                      InputProps={{ inputProps: { min: 1, max: 10 } }}
                      helperText="Number of call attempts before moving to next channel"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Call Time Start"
                      value={newWorkflow.callTimeStart}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, callTimeStart: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Call Time End"
                      value={newWorkflow.callTimeEnd}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, callTimeEnd: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={newWorkflow.amdEnabled}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, amdEnabled: e.target.checked })}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="500">Enable Answering Machine Detection (AMD)</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Automatically detect and handle voicemail
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={newWorkflow.recordCalls}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, recordCalls: e.target.checked })}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="500">Enable Call Recording</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Record calls for compliance and quality assurance
                            </Typography>
                          </Box>
                        }
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 3: AI Features */}
            {workflowTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  AI-Powered Features
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Enable AI features to optimize recovery rates and agent productivity
                  </Typography>
                </Alert>

                <Card variant="outlined" sx={{ p: 2 }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newWorkflow.aiAgentMatching}
                          onChange={(e) => setNewWorkflow({ ...newWorkflow, aiAgentMatching: e.target.checked })}
                        />
                      }
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BrainIcon fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="600">AI-Powered Agent Matching</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Match debtors with best-performing agents based on historical success
                          </Typography>
                        </Box>
                      }
                    />
                    <Divider sx={{ my: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newWorkflow.recoveryScoring}
                          onChange={(e) => setNewWorkflow({ ...newWorkflow, recoveryScoring: e.target.checked })}
                        />
                      }
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssessmentIcon fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="600">Recovery Probability Scoring</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            AI predicts likelihood of successful recovery for prioritization
                          </Typography>
                        </Box>
                      }
                    />
                    <Divider sx={{ my: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newWorkflow.bestTimePredict}
                          onChange={(e) => setNewWorkflow({ ...newWorkflow, bestTimePredict: e.target.checked })}
                        />
                      }
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimerIcon fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="600">Best Time to Call Prediction</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Predict optimal calling times based on debtor behavior patterns
                          </Typography>
                        </Box>
                      }
                    />
                    <Divider sx={{ my: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newWorkflow.sentimentAnalysis}
                          onChange={(e) => setNewWorkflow({ ...newWorkflow, sentimentAnalysis: e.target.checked })}
                        />
                      }
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VoiceIcon fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="600">Real-time Sentiment Analysis</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Analyze debtor sentiment during calls for better outcomes
                          </Typography>
                        </Box>
                      }
                    />
                    <Divider sx={{ my: 2 }} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newWorkflow.autoDisposition}
                          onChange={(e) => setNewWorkflow({ ...newWorkflow, autoDisposition: e.target.checked })}
                        />
                      }
                      label={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AIIcon fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="600">Auto-Disposition</Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Automatically categorize call outcomes using AI
                          </Typography>
                        </Box>
                      }
                    />
                  </FormGroup>
                </Card>
              </Box>
            )}

            {/* Tab 4: Multi-Channel Sequence */}
            {workflowTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Multi-Channel Communication Sequence
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Define the order and timing of communication channels. Automatically escalate through channels if previous attempts fail.
                  </Typography>
                </Alert>

                <Grid container spacing={2}>
                  {newWorkflow.channelSequence.map((channel, index) => (
                    <Grid item xs={12} key={channel.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: channel.enabled ? alpha(theme.palette.primary.main, 0.05) : 'transparent'
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={channel.enabled}
                                  onChange={(e) => {
                                    const updated = [...newWorkflow.channelSequence];
                                    updated[index].enabled = e.target.checked;
                                    setNewWorkflow({ ...newWorkflow, channelSequence: updated });
                                  }}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {channel.channel === 'Call' && <PhoneIcon fontSize="small" />}
                                  {channel.channel === 'SMS' && <SmsIcon fontSize="small" />}
                                  {channel.channel === 'Email' && <EmailIcon fontSize="small" />}
                                  {channel.channel === 'WhatsApp' && <WhatsAppIcon fontSize="small" />}
                                  <Typography variant="body2" fontWeight="600">{channel.channel}</Typography>
                                </Box>
                              }
                            />
                          </Grid>
                          {channel.enabled && index > 0 && (
                            <>
                              <Grid item xs={6} md={3}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  size="small"
                                  label="Delay"
                                  value={channel.delay}
                                  onChange={(e) => {
                                    const updated = [...newWorkflow.channelSequence];
                                    updated[index].delay = parseInt(e.target.value);
                                    setNewWorkflow({ ...newWorkflow, channelSequence: updated });
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <FormControl fullWidth size="small">
                                  <Select
                                    value={channel.delayUnit}
                                    onChange={(e) => {
                                      const updated = [...newWorkflow.channelSequence];
                                      updated[index].delayUnit = e.target.value;
                                      setNewWorkflow({ ...newWorkflow, channelSequence: updated });
                                    }}
                                  >
                                    <MenuItem value="minutes">Minutes</MenuItem>
                                    <MenuItem value="hours">Hours</MenuItem>
                                    <MenuItem value="days">Days</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Template"
                                  value={channel.template}
                                  onChange={(e) => {
                                    const updated = [...newWorkflow.channelSequence];
                                    updated[index].template = e.target.value;
                                    setNewWorkflow({ ...newWorkflow, channelSequence: updated });
                                  }}
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Tab 5: Target Audience & Scheduling */}
            {workflowTab === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Target Audience & Scheduling
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Define your target audience and schedule the workflow
                </Typography>

                {/* Scheduling Options */}
                <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Schedule Workflow
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={newWorkflow.scheduleType}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, scheduleType: e.target.value })}
                    >
                      <FormControlLabel
                        value="immediate"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="500">Start Immediately</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Begin workflow as soon as it's created
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="scheduled"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="500">Schedule for Later</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Choose a specific date and time to start
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="recurring"
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="500">Recurring Workflow</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Run workflow on a regular schedule
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {newWorkflow.scheduleType !== 'immediate' && (
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Start Date & Time"
                      value={newWorkflow.startDate}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, startDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mt: 2 }}
                    />
                  )}
                </Card>

                {/* Target Audience */}
                <Typography variant="subtitle2" gutterBottom>
                  Target Debtor Segments
                </Typography>
                <FormGroup sx={{ mb: 2 }}>
                  {['Ready-to-Pay', 'Contactable', 'Hard-to-Contact', 'Skip-trace', 'Legal'].map(segment => (
                    <FormControlLabel
                      key={segment}
                      control={
                        <Checkbox
                          checked={newWorkflow.segments.includes(segment)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewWorkflow({ ...newWorkflow, segments: [...newWorkflow.segments, segment] });
                            } else {
                              setNewWorkflow({ ...newWorkflow, segments: newWorkflow.segments.filter(s => s !== segment) });
                            }
                          }}
                        />
                      }
                      label={segment}
                    />
                  ))}
                </FormGroup>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="DPD Min (Days)"
                      value={newWorkflow.dpdMin}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, dpdMin: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="DPD Max (Days)"
                      value={newWorkflow.dpdMax}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, dpdMax: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Balance Min ($)"
                      value={newWorkflow.balanceMin}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, balanceMin: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Balance Max ($)"
                      value={newWorkflow.balanceMax}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, balanceMax: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <Alert severity="success" sx={{ mt: 3 }}>
                  <Typography variant="body2" fontWeight="600">
                    Estimated Audience Size: 1,245 debtors
                  </Typography>
                  <Typography variant="caption">
                    Based on your filter criteria
                  </Typography>
                </Alert>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              setCreateWorkflowDialog(false);
              setWorkflowTab(0);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              // Generate workflow ID
              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const workflowNumber = (workflows.length + 1).toString().padStart(3, '0');
              const workflowId = `WF-${year}-${workflowNumber}`;

              // Create new workflow object
              const workflow = {
                id: workflows.length + 1,
                workflowId: workflowId,
                ...newWorkflow,
                status: newWorkflow.scheduleType === 'immediate' ? 'active' : 'scheduled',
                createdDate: new Date().toISOString().split('T')[0],
                lastRun: null,
                totalContacts: 0,
                successRate: 0,
                // Initialize empty channel metrics
                channelMetrics: {
                  call: { sent: 0, delivered: 0, connected: 0, answered: 0, avgDuration: '0:00', responseRate: 0, conversionRate: 0, deliveryRate: 0, failureReasons: { busy: 0, no_answer: 0, invalid: 0 } },
                  sms: { sent: 0, delivered: 0, bounced: 0, opened: 0, clicked: 0, replied: 0, deliveryRate: 0, openRate: 0, clickRate: 0, responseRate: 0, conversionRate: 0 },
                  email: { sent: 0, delivered: 0, bounced: 0, opened: 0, clicked: 0, replied: 0, unsubscribed: 0, spamReports: 0, deliveryRate: 0, openRate: 0, clickRate: 0, responseRate: 0, conversionRate: 0 },
                  whatsapp: { sent: 0, delivered: 0, read: 0, replied: 0, deliveryRate: 0, readRate: 0, responseRate: 0, conversionRate: 0 }
                }
              };

              // Add to workflows list
              setWorkflows([...workflows, workflow]);

              // Reset form
              setNewWorkflow({
                name: '',
                description: '',
                type: 'payment_reminder',
                startDate: '',
                scheduleType: 'immediate',
                channels: ['call'],
                channelConfigs: {
                  call: { provider: '', line: '', template: '', intervalValue: 30, intervalUnit: 'minutes', triggerConditions: [] },
                  sms: { provider: '', line: '', template: '', intervalValue: 30, intervalUnit: 'minutes', triggerConditions: ['no_response'] },
                  email: { provider: '', line: '', template: '', intervalValue: 24, intervalUnit: 'hours', triggerConditions: ['no_response'] },
                  whatsapp: { provider: '', line: '', template: '', intervalValue: 48, intervalUnit: 'hours', triggerConditions: ['no_response', 'no_action'] }
                },
                callStrategy: 'preview',
                maxAttempts: 3,
                callTimeStart: '09:00',
                callTimeEnd: '18:00',
                amdEnabled: true,
                recordCalls: true,
                aiAgentMatching: true,
                recoveryScoring: true,
                bestTimePredict: true,
                sentimentAnalysis: false,
                autoDisposition: false,
                channelSequence: [
                  { id: 1, channel: 'Call', enabled: true, delay: 0, delayUnit: 'minutes', template: '' },
                  { id: 2, channel: 'SMS', enabled: false, delay: 30, delayUnit: 'minutes', template: 'Payment Reminder SMS' },
                  { id: 3, channel: 'Email', enabled: false, delay: 24, delayUnit: 'hours', template: 'Payment Notice Email' },
                  { id: 4, channel: 'WhatsApp', enabled: false, delay: 48, delayUnit: 'hours', template: 'Payment Link WhatsApp' }
                ],
                segments: [],
                dpdMin: '',
                dpdMax: '',
                balanceMin: '',
                balanceMax: '',
                status: []
              });

              setCreateWorkflowDialog(false);
              setWorkflowTab(0);
            }}
            disabled={
              !newWorkflow.name ||
              newWorkflow.channels.length === 0 ||
              newWorkflow.segments.length === 0 ||
              // Check if all selected channels have complete configuration
              !newWorkflow.channels.every(channel =>
                newWorkflow.channelConfigs[channel].provider &&
                newWorkflow.channelConfigs[channel].line &&
                newWorkflow.channelConfigs[channel].template
              )
            }
          >
            Create Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowManager;
