import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Button, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Paper, FormControl, 
  InputLabel, Select, MenuItem, TextField, Chip, LinearProgress, Avatar, 
  Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  List, ListItem, ListItemText, ListItemIcon, Divider, Alert, Badge,
  useTheme, alpha, Fade, Grow, Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Launch as LaunchIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Campaign as CampaignIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as TemplateIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  TouchApp as TouchAppIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Block as BlockIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);

  useEffect(() => {
    loadCampaignDetails();
    setTimeout(() => setLoaded(true), 100);
  }, [campaignId]);

  const loadCampaignDetails = () => {
    // Mock campaign data - in real app, fetch from API
    const mockCampaign = {
      id: parseInt(campaignId),
      name: 'Q4 Policy Renewal Campaign',
      description: 'Multi-channel campaign for policy renewals targeting customers with policies expiring in Q4 2024',
      type: 'renewal',
      channels: ['email', 'sms', 'whatsapp'],
      audience: 'Policy Holders - Expiring Q4',
      audienceSize: 15420,
      status: 'active',
      progress: 67,
      createdDate: '2024-12-20',
      scheduledDate: '2024-12-25',
      launchDate: '2024-12-25',
      lastModified: '2024-12-28',
      tags: ['renewal', 'urgent', 'multi-channel'],
      templates: {
        email: 'Policy Renewal Reminder Email',
        sms: 'Renewal SMS Template',
        whatsapp: 'WhatsApp Renewal Template'
      },
      metrics: {
        sent: 10331,
        delivered: 9876,
        opened: 6543,
        clicked: 1234,
        converted: 456,
        bounced: 234,
        unsubscribed: 12,
        failed: 455
      },
      channelMetrics: {
        email: { sent: 5000, delivered: 4800, opened: 3200, clicked: 800, bounced: 200, unsubscribed: 8 },
        sms: { sent: 3000, delivered: 2950, opened: 2100, clicked: 300, failed: 50 },
        whatsapp: { sent: 2331, delivered: 2126, opened: 1243, clicked: 134, failed: 205 }
      },
      timeline: [
        { date: '2024-12-20', event: 'Campaign Created', type: 'create' },
        { date: '2024-12-22', event: 'Templates Configured', type: 'config' },
        { date: '2024-12-23', event: 'Audience Segmented', type: 'audience' },
        { date: '2024-12-25', event: 'Campaign Launched', type: 'launch' },
        { date: '2024-12-26', event: 'First Batch Sent', type: 'send' },
        { date: '2024-12-28', event: 'Analytics Updated', type: 'analytics' }
      ],
      consent: {
        email: 14200,
        sms: 13800,
        whatsapp: 12100,
        opted_out: 1220
      },
      compliance: {
        dltApproved: true,
        consentVerified: true,
        dndChecked: true,
        dataRetentionCompliant: true
      }
    };
    setCampaign(mockCampaign);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'info';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      default: return <CampaignIcon />;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'email': return '#1976d2';
      case 'sms': return '#388e3c';
      case 'whatsapp': return '#25d366';
      default: return theme.palette.primary.main;
    }
  };

  const handleCampaignAction = (action) => {
    switch (action) {
      case 'pause':
        setCampaign(prev => ({ ...prev, status: 'paused' }));
        break;
      case 'resume':
        setCampaign(prev => ({ ...prev, status: 'active' }));
        break;
      case 'stop':
        setCampaign(prev => ({ ...prev, status: 'stopped' }));
        break;
      default:
        break;
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`campaign-tabpanel-${index}`}
      aria-labelledby={`campaign-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const OverviewTab = () => (
    <Grid container spacing={3}>
      {/* Campaign Status Card */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Campaign Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip 
                label={campaign.status?.toUpperCase() || 'UNKNOWN'}
                color={getStatusColor(campaign.status)}
                size="large"
              />
              {campaign.status === 'active' && (
                <Chip 
                  label={`${campaign.progress}% Complete`}
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Campaign Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={campaign.progress} 
              sx={{ mb: 2, borderRadius: 1, height: 8 }}
            />
            
            <Typography variant="body2" color="text.secondary">
              <strong>Created:</strong> {new Date(campaign.createdDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Launched:</strong> {new Date(campaign.launchDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Last Modified:</strong> {new Date(campaign.lastModified).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Audience & Channels */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Audience & Channels</Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Target Audience
            </Typography>
            <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>
              {campaign.audience}
            </Typography>
            <Typography variant="h5" color="primary" fontWeight="600" sx={{ mb: 2 }}>
              {campaign.audienceSize.toLocaleString()} contacts
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Communication Channels
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {campaign.channels.map((channel) => (
                <Tooltip key={channel} title={channel?.toUpperCase() || 'UNKNOWN'}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: getChannelColor(channel)
                    }}
                  >
                    {getChannelIcon(channel)}
                  </Avatar>
                </Tooltip>
              ))}
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Campaign Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {campaign.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Key Metrics */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Key Metrics</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" fontWeight="600">
                    {campaign.metrics.sent.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Messages Sent
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" fontWeight="600">
                    {campaign.metrics.delivered.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Delivered
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" fontWeight="600">
                    {campaign.metrics.opened.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Opened
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" fontWeight="600">
                    {campaign.metrics.clicked.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Clicked
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary">
              <strong>Conversion Rate:</strong> {((campaign.metrics.converted / campaign.metrics.sent) * 100).toFixed(2)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Open Rate:</strong> {((campaign.metrics.opened / campaign.metrics.delivered) * 100).toFixed(2)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Click Rate:</strong> {((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const AnalyticsTab = () => {
    const channelData = Object.entries(campaign.channelMetrics).map(([channel, metrics]) => ({
      channel: channel ? channel.charAt(0).toUpperCase() + channel.slice(1) : 'Unknown',
      sent: metrics.sent,
      delivered: metrics.delivered,
      opened: metrics.opened || 0,
      clicked: metrics.clicked || 0
    }));

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Channel Performance</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                  <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
                  <Bar dataKey="opened" fill="#ffc658" name="Opened" />
                  <Bar dataKey="clicked" fill="#ff7300" name="Clicked" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Delivery Status</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Successfully Delivered"
                    secondary={`${campaign.metrics.delivered.toLocaleString()} messages`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TrendingDownIcon color="error" /></ListItemIcon>
                  <ListItemText 
                    primary="Bounced"
                    secondary={`${campaign.metrics.bounced.toLocaleString()} messages`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BlockIcon color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="Failed"
                    secondary={`${campaign.metrics.failed.toLocaleString()} messages`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SecurityIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Unsubscribed"
                    secondary={`${campaign.metrics.unsubscribed.toLocaleString()} users`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Engagement Metrics</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><VisibilityIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Open Rate"
                    secondary={`${((campaign.metrics.opened / campaign.metrics.delivered) * 100).toFixed(2)}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TouchAppIcon color="secondary" /></ListItemIcon>
                  <ListItemText 
                    primary="Click-Through Rate"
                    secondary={`${((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(2)}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TrendingUpIcon color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Conversion Rate"
                    secondary={`${((campaign.metrics.converted / campaign.metrics.sent) * 100).toFixed(2)}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><GroupIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Total Conversions"
                    secondary={`${campaign.metrics.converted.toLocaleString()} users`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const ComplianceTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Consent Management</Typography>
            <List>
              <ListItem>
                <ListItemIcon><VerifiedIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Email Consent"
                  secondary={`${campaign.consent.email.toLocaleString()} users opted in`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><VerifiedIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="SMS Consent"
                  secondary={`${campaign.consent.sms.toLocaleString()} users opted in`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><VerifiedIcon color="success" /></ListItemIcon>
                <ListItemText 
                  primary="WhatsApp Consent"
                  secondary={`${campaign.consent.whatsapp.toLocaleString()} users opted in`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><BlockIcon color="warning" /></ListItemIcon>
                <ListItemText 
                  primary="Opted Out"
                  secondary={`${campaign.consent.opted_out.toLocaleString()} users`}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Compliance Status</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  {campaign.compliance.dltApproved ? 
                    <CheckCircleIcon color="success" /> : 
                    <BlockIcon color="error" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary="DLT Template Approved"
                  secondary={campaign.compliance.dltApproved ? "All templates approved" : "Pending approval"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {campaign.compliance.consentVerified ? 
                    <CheckCircleIcon color="success" /> : 
                    <BlockIcon color="error" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary="Consent Verified"
                  secondary={campaign.compliance.consentVerified ? "All consents verified" : "Verification pending"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {campaign.compliance.dndChecked ? 
                    <CheckCircleIcon color="success" /> : 
                    <BlockIcon color="error" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary="DND Registry Checked"
                  secondary={campaign.compliance.dndChecked ? "DND check completed" : "DND check pending"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  {campaign.compliance.dataRetentionCompliant ? 
                    <CheckCircleIcon color="success" /> : 
                    <BlockIcon color="error" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary="Data Retention Compliant"
                  secondary={campaign.compliance.dataRetentionCompliant ? "Compliant with data retention policies" : "Non-compliant"}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const TimelineTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Campaign Timeline</Typography>
        <List>
          {campaign.timeline.map((event, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                {event.type === 'launch' && <LaunchIcon color="primary" />}
                {event.type === 'send' && <SendIcon color="success" />}
                {event.type === 'create' && <CampaignIcon color="info" />}
                {event.type === 'config' && <SettingsIcon color="secondary" />}
                {event.type === 'audience' && <PeopleIcon color="primary" />}
                {event.type === 'analytics' && <AnalyticsIcon color="warning" />}
              </ListItemIcon>
              <ListItemText
                primary={event.event}
                secondary={new Date(event.date).toLocaleDateString()}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  if (!campaign) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading campaign details...</Typography>
      </Box>
    );
  }

  return (
    <Fade in={loaded} timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/campaigns')}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="600">
                {campaign.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {campaign.description}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {campaign.status === 'active' && (
              <Button
                startIcon={<PauseIcon />}
                variant="outlined"
                color="warning"
                onClick={() => handleCampaignAction('pause')}
              >
                Pause
              </Button>
            )}
            {campaign.status === 'paused' && (
              <Button
                startIcon={<PlayIcon />}
                variant="outlined"
                color="success"
                onClick={() => handleCampaignAction('resume')}
              >
                Resume
              </Button>
            )}
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => setEditDialog(true)}
            >
              Edit
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
            >
              Export Report
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" />
            <Tab label="Analytics" />
            <Tab label="Compliance" />
            <Tab label="Timeline" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <OverviewTab />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <AnalyticsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ComplianceTab />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <TimelineTab />
        </TabPanel>
      </Box>
    </Fade>
  );
};

export default CampaignDetails; 