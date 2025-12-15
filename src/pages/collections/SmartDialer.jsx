import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Switch, FormControlLabel, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  List, ListItem, ListItemText, ListItemIcon, Divider, Badge,
  LinearProgress, alpha, useTheme, Stack, Tooltip, Select, MenuItem,
  FormControl, InputLabel
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
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';

const SmartDialer = () => {
  const theme = useTheme();
  const [dialerActive, setDialerActive] = useState(false);
  const [dialerPaused, setDialerPaused] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [amdEnabled, setAmdEnabled] = useState(true);
  const [multiChannelEnabled, setMultiChannelEnabled] = useState(true);

  // Multi-Channel Sequence Configuration
  const [channelSequence, setChannelSequence] = useState([
    { id: 1, channel: 'SMS', enabled: true, delay: 5, delayUnit: 'minutes', template: 'Payment Reminder SMS' },
    { id: 2, channel: 'Email', enabled: true, delay: 24, delayUnit: 'hours', template: 'Detailed Statement' },
    { id: 3, channel: 'WhatsApp', enabled: true, delay: 48, delayUnit: 'hours', template: 'Interactive Payment Link' }
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Smart Dialer & Routing
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          <strong>AI-Powered Dialing:</strong> Predictive dialer with answering machine detection, best time to call prediction,
          skill-based routing, and automated multi-channel orchestration (Call → SMS → Email → WhatsApp).
        </Typography>
      </Alert>

      {renderDialerControls()}
      {renderDialerQueue()}
      {renderAgentPerformance()}
      {renderSettingsDialog()}
    </Box>
  );
};

export default SmartDialer;
