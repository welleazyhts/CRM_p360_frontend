import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import campaignService from '../services/campaignService';
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

  const loadCampaignDetails = async () => {
    try {
      const campaignData = await campaignService.getCampaignDetails(campaignId);
      setCampaign(campaignData);
    } catch (error) {
      console.error('Error loading campaign details:', error);
    }
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

  const handleCampaignAction = async (action) => {
    try {
      let newStatus;
      switch (action) {
        case 'pause':
          newStatus = 'paused';
          break;
        case 'resume':
          newStatus = 'active';
          break;
        case 'stop':
          newStatus = 'stopped';
          break;
        default:
          return;
      }

      await campaignService.updateCampaignStatus(campaignId, newStatus);
      setCampaign(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating campaign status:', error);
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

  const OverviewTab = () => {
    const metrics = campaign.metrics || {};

    return (
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
                    label={`${campaign.progress || 0}% Complete`}
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
                value={campaign.progress || 0}
                sx={{ mb: 2, borderRadius: 1, height: 8 }}
              />

              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong> {campaign.createdDate ? new Date(campaign.createdDate).toLocaleDateString() : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Launched:</strong> {campaign.launchDate ? new Date(campaign.launchDate).toLocaleDateString() : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Last Modified:</strong> {campaign.lastModified ? new Date(campaign.lastModified).toLocaleDateString() : 'N/A'}
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
                {campaign.audience || 'All Customers'}
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="600" sx={{ mb: 2 }}>
                {campaign.audienceSize?.toLocaleString() || '0'} contacts
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Communication Channels
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {campaign.channels?.map((channel) => (
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
                {campaign.tags?.map((tag, index) => (
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
                      {metrics.sent?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Messages Sent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" fontWeight="600">
                      {metrics.delivered?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Delivered
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" fontWeight="600">
                      {metrics.opened?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Opened
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" fontWeight="600">
                      {metrics.clicked?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Clicked
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                <strong>Conversion Rate:</strong> {metrics.sent ? ((metrics.converted || 0) / metrics.sent * 100).toFixed(2) : '0.00'}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Open Rate:</strong> {metrics.delivered ? ((metrics.opened || 0) / metrics.delivered * 100).toFixed(2) : '0.00'}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Click Rate:</strong> {metrics.opened ? ((metrics.clicked || 0) / metrics.opened * 100).toFixed(2) : '0.00'}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const AnalyticsTab = () => {
    const metrics = campaign.metrics || {};
    const channelData = Object.entries(campaign.channelMetrics || {}).map(([channel, metrics]) => ({
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
                    secondary={`${metrics.delivered?.toLocaleString() || '0'} messages`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TrendingDownIcon color="error" /></ListItemIcon>
                  <ListItemText
                    primary="Bounced"
                    secondary={`${metrics.bounced?.toLocaleString() || '0'} messages`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BlockIcon color="warning" /></ListItemIcon>
                  <ListItemText
                    primary="Failed"
                    secondary={`${metrics.failed?.toLocaleString() || '0'} messages`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SecurityIcon color="info" /></ListItemIcon>
                  <ListItemText
                    primary="Unsubscribed"
                    secondary={`${metrics.unsubscribed?.toLocaleString() || '0'} users`}
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
                    secondary={`${metrics.delivered ? ((metrics.opened || 0) / metrics.delivered * 100).toFixed(2) : '0.00'}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TouchAppIcon color="secondary" /></ListItemIcon>
                  <ListItemText
                    primary="Click-Through Rate"
                    secondary={`${metrics.opened ? ((metrics.clicked || 0) / metrics.opened * 100).toFixed(2) : '0.00'}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><TrendingUpIcon color="success" /></ListItemIcon>
                  <ListItemText
                    primary="Conversion Rate"
                    secondary={`${metrics.sent ? ((metrics.converted || 0) / metrics.sent * 100).toFixed(2) : '0.00'}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><GroupIcon color="info" /></ListItemIcon>
                  <ListItemText
                    primary="Total Conversions"
                    secondary={`${metrics.converted?.toLocaleString() || '0'} users`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const ComplianceTab = () => {
    const consent = campaign.consent || {};
    const compliance = campaign.compliance || {};

    return (
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
                    secondary={`${consent.email?.toLocaleString() || '0'} users opted in`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><VerifiedIcon color="success" /></ListItemIcon>
                  <ListItemText
                    primary="SMS Consent"
                    secondary={`${consent.sms?.toLocaleString() || '0'} users opted in`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><VerifiedIcon color="success" /></ListItemIcon>
                  <ListItemText
                    primary="WhatsApp Consent"
                    secondary={`${consent.whatsapp?.toLocaleString() || '0'} users opted in`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BlockIcon color="warning" /></ListItemIcon>
                  <ListItemText
                    primary="Opted Out"
                    secondary={`${consent.opted_out?.toLocaleString() || '0'} users`}
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
                    {compliance.dltApproved ?
                      <CheckCircleIcon color="success" /> :
                      <BlockIcon color="error" />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary="DLT Template Approved"
                    secondary={compliance.dltApproved ? "All templates approved" : "Pending approval"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {compliance.consentVerified ?
                      <CheckCircleIcon color="success" /> :
                      <BlockIcon color="error" />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary="Consent Verified"
                    secondary={compliance.consentVerified ? "All consents verified" : "Verification pending"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {compliance.dndChecked ?
                      <CheckCircleIcon color="success" /> :
                      <BlockIcon color="error" />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary="DND Registry Checked"
                    secondary={compliance.dndChecked ? "DND check completed" : "DND check pending"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {compliance.dataRetentionCompliant ?
                      <CheckCircleIcon color="success" /> :
                      <BlockIcon color="error" />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary="Data Retention Compliant"
                    secondary={compliance.dataRetentionCompliant ? "Compliant with data retention policies" : "Non-compliant"}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const TimelineTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Campaign Timeline</Typography>
        <List>
          {campaign.timeline?.map((event, index) => (
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