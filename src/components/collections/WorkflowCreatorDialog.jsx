import React, { useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Select, MenuItem, FormControl, InputLabel, Tabs, Tab,
  Card, Avatar, IconButton, Switch, FormControlLabel, Alert,
  Divider, FormGroup, Checkbox, alpha, useTheme, Chip
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Campaign as CampaignIcon,
  SmartToy as AIIcon,
  AccountBalance as MoneyIcon,
  Gavel as LegalIcon,
  RecordVoiceOver as VoiceIcon,
  Psychology as BrainIcon,
  Route as RouteIcon,
  Assessment as AssessmentIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const WorkflowCreatorDialog = ({ open, onClose, onSave }) => {
  const theme = useTheme();
  const [workflowTab, setWorkflowTab] = useState(0);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    type: 'payment_reminder',
    startDate: '',
    scheduleType: 'immediate',
    // Channel Selection
    channels: ['call'],
    // Channel Configuration
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

  const handleClose = () => {
    setWorkflowTab(0);
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
    onClose();
  };

  const handleSave = () => {
    onSave(newWorkflow);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          <IconButton onClick={handleClose}>
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

              {/* Channel Selection */}
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

              {/* Warning if no channels selected */}
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
                                    </FormGroup>
                                  </Grid>
                                </>
                              )}
                            </Grid>
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

              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Configure channel sequence and timing in the WorkflowManager for full control
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Tab 5: Target & Schedule */}
          {workflowTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Target Audience & Schedule
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  The workflow will automatically apply to the uploaded portfolio data
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Schedule Type</InputLabel>
                    <Select
                      value={newWorkflow.scheduleType}
                      label="Schedule Type"
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, scheduleType: e.target.value })}
                    >
                      <MenuItem value="immediate">Start Immediately</MenuItem>
                      <MenuItem value="scheduled">Schedule for Later</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {newWorkflow.scheduleType === 'scheduled' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Start Date & Time"
                      value={newWorkflow.startDate}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, startDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleSave}
          disabled={!newWorkflow.name || newWorkflow.channels.length === 0}
        >
          Create Workflow
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkflowCreatorDialog;
