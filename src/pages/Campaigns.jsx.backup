import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProviders } from '../context/ProvidersContext';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Alert, useTheme, alpha, Fade, Grow, IconButton, Tooltip, Avatar,
  Paper, Switch, FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Stepper, Step, StepLabel, StepContent,
  LinearProgress, Checkbox, FormGroup
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon,
  Pause as PauseIcon, PlayArrow as PlayIcon, Visibility as ViewIcon,
  Analytics as AnalyticsIcon, Email as EmailIcon, Sms as SmsIcon,
  WhatsApp as WhatsAppIcon, Campaign as CampaignIcon, People as PeopleIcon,
  Assignment as AssignmentIcon, Schedule as ScheduleIcon, FilterList as FilterIcon,
  Search as SearchIcon, Refresh as RefreshIcon, GetApp as GetAppIcon,
  TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon, Close as CloseIcon,
  Save as SaveIcon, MoreVert as MoreVertIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';

// Dialog Components (defined before main component to avoid hoisting issues)
const TemplateDialog = ({ 
  open, 
  onClose, 
  mockTemplates, 
  getChannelColor, 
  getChannelIcon, 
  handleTemplateAction, 
  navigate 
}) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    maxWidth="md"
    fullWidth
  >
    <DialogTitle>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Template Manager</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Manage your campaign templates across all channels
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {mockTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: getChannelColor(template.type)
                    }}
                  >
                    {getChannelIcon(template.type)}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight="600">
                    {template.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={template.type?.toUpperCase() || 'UNKNOWN'}
                    size="small"
                    sx={{ bgcolor: getChannelColor(template.type), color: 'white' }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleTemplateAction('edit', template)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleTemplateAction('duplicate', template)}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
        onClick={() => navigate('/templates')}
      >
        Create New Template
      </Button>
    </DialogActions>
  </Dialog>
);

const CampaignManager = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getProviders, getActiveProvider } = useProviders();
  const [loaded, setLoaded] = useState(false);

  // StatCard component matching Renewal Dashboard styling
  const StatCard = ({ title, value, color, icon, index, isCurrency, subtitle }) => {
    // Create a gradient background
    const gradientFrom = alpha(color, theme.palette.mode === 'dark' ? 0.7 : 0.9);
    const gradientTo = alpha(color, theme.palette.mode === 'dark' ? 0.4 : 0.6);
    
    // Safe number conversion and formatting
    let displayValue = value;
    if (isCurrency) {
      // Ensure we have a valid number before formatting
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        displayValue = new Intl.NumberFormat('en-IN', { 
          style: 'currency', 
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numericValue);
      } else {
        displayValue = '₹0'; // Default fallback for NaN values
      }
    }
    
    return (
      <Grow in={loaded} style={{ transformOrigin: '0 0 0' }} timeout={(index + 1) * 200}>
        <Card 
          sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            borderRadius: 4,
            boxShadow: `0 10px 20px ${alpha(color, 0.2)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              opacity: 0.15,
              transform: 'rotate(25deg)',
              fontSize: '8rem'
            }}
          >
            {icon}
          </Box>
          <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h6" component="div" color="white" fontWeight="500" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color="white" fontWeight="bold">
              {displayValue}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.9, color: 'white', mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grow>
    );
  };
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  
  // Dialog states
  const [createCampaignDialog, setCreateCampaignDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [audienceDialog, setAudienceDialog] = useState(false);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  const [advancedFiltersDialog, setAdvancedFiltersDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);
  
  // Campaign creation states
  const [campaignStep, setCampaignStep] = useState(0);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    type: 'promotional',
    channels: [],
    providers: {},
    audience: '',
    template: '',
    scheduledDate: '',
    status: 'draft',
    advancedScheduling: {
      enabled: false,
      intervals: []
    }
  });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { start: '', end: '' },
    campaignType: 'all',
    audienceSize: { min: '', max: '' },
    performance: 'all',
    tags: []
  });
  
  // Export states
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportData, setExportData] = useState('all');
  
  // Mock data
  const [templates] = useState([
    { 
      id: 1, 
      name: 'Policy Renewal Email', 
      type: 'email', 
      category: 'renewal',
      description: 'Professional email template for policy renewals',
      lastModified: '2024-12-20',
      usage: 45
    },
    { 
      id: 2, 
      name: 'Welcome WhatsApp', 
      type: 'whatsapp', 
      category: 'welcome',
      description: 'Friendly welcome message for new customers',
      lastModified: '2024-12-18',
      usage: 23
    },
    { 
      id: 3, 
      name: 'Payment Reminder SMS', 
      type: 'sms', 
      category: 'payment',
      description: 'Concise payment reminder message',
      lastModified: '2024-12-15',
      usage: 67
    },
    { 
      id: 4, 
      name: 'Claim Update Email', 
      type: 'email', 
      category: 'claims',
      description: 'Template for claim status updates',
      lastModified: '2024-12-22',
      usage: 12
    }
  ]);
  
  const [audiences] = useState([
    { 
      id: 1, 
      name: 'Policy Holders - Expiring Q4', 
      size: 15420,
      description: 'Customers with policies expiring in Q4 2024',
      segments: ['High Value', 'Auto Insurance', 'Health Insurance'],
      lastUpdated: '2024-12-20'
    },
    { 
      id: 2, 
      name: 'New Customers - December', 
      size: 2340,
      description: 'Customers who joined in December 2024',
      segments: ['New Joiners', 'Auto Insurance'],
      lastUpdated: '2024-12-22'
    },
    { 
      id: 3, 
      name: 'High Value Customers', 
      size: 5670,
      description: 'Premium customers with high policy values',
      segments: ['Premium', 'Multi-Policy', 'Long Term'],
      lastUpdated: '2024-12-19'
    },
    { 
      id: 4, 
      name: 'Lapsed Policy Holders', 
      size: 8920,
      description: 'Customers with recently lapsed policies',
      segments: ['Lapsed', 'Re-engagement'],
      lastUpdated: '2024-12-21'
    }
  ]);

  const filterCampaigns = useCallback(() => {
    let filtered = campaigns;

    // Basic filters
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    if (channelFilter !== 'all') {
      filtered = filtered.filter(campaign => 
        campaign.channels.includes(channelFilter)
      );
    }

    // Advanced filters
    if (advancedFilters.campaignType !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === advancedFilters.campaignType);
    }

    if (advancedFilters.audienceSize.min) {
      filtered = filtered.filter(campaign => 
        campaign.audienceSize >= parseInt(advancedFilters.audienceSize.min)
      );
    }

    if (advancedFilters.audienceSize.max) {
      filtered = filtered.filter(campaign => 
        campaign.audienceSize <= parseInt(advancedFilters.audienceSize.max)
      );
    }

    if (advancedFilters.performance !== 'all') {
      filtered = filtered.filter(campaign => {
        const openRate = campaign.metrics.delivered > 0 
          ? (campaign.metrics.opened / campaign.metrics.delivered) * 100 
          : 0;
        
        switch (advancedFilters.performance) {
          case 'high': return openRate >= 70;
          case 'medium': return openRate >= 40 && openRate < 70;
          case 'low': return openRate < 40;
          default: return true;
        }
      });
    }

    if (advancedFilters.tags.length > 0) {
      filtered = filtered.filter(campaign => 
        campaign.tags?.some(tag => advancedFilters.tags.includes(tag))
      );
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter, channelFilter, advancedFilters]);

  useEffect(() => {
    loadCampaigns();
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [filterCampaigns]);

  const loadCampaigns = () => {
    const mockCampaigns = [
      {
        id: 1,
        name: 'Q4 Policy Renewal Campaign',
        description: 'Multi-channel campaign for policy renewals',
        type: 'renewal',
        channels: ['email', 'sms', 'whatsapp'],
        audience: 'Policy Holders - Expiring Q4',
        audienceSize: 15420,
        status: 'active',
        progress: 67,
        createdDate: '2024-12-20',
        scheduledDate: '2024-12-25',
        tags: ['renewal', 'urgent', 'multi-channel'],
        metrics: {
          sent: 10331,
          delivered: 9876,
          opened: 6543,
          clicked: 1234,
          bounced: 234
        }
      },
      {
        id: 2,
        name: 'New Customer Welcome Series',
        description: 'Welcome campaign for new customers',
        type: 'welcome',
        channels: ['email', 'whatsapp'],
        audience: 'New Customers - December',
        audienceSize: 2340,
        status: 'scheduled',
        progress: 0,
        createdDate: '2024-12-22',
        scheduledDate: '2025-01-01',
        tags: ['welcome', 'onboarding'],
        metrics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0
        }
      },
      {
        id: 3,
        name: 'Payment Reminder Campaign',
        description: 'Automated payment reminders',
        type: 'payment',
        channels: ['sms', 'email'],
        audience: 'High Value Customers',
        audienceSize: 5670,
        status: 'completed',
        progress: 100,
        createdDate: '2024-12-15',
        scheduledDate: '2024-12-18',
        tags: ['payment', 'automated'],
        metrics: {
          sent: 5670,
          delivered: 5580,
          opened: 4200,
          clicked: 890,
          bounced: 90
        }
      }
    ];
    setCampaigns(mockCampaigns);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'info';
      case 'paused': return 'warning';
      case 'completed': return 'default';
      case 'draft': return 'secondary';
      default: return 'default';
    }
  };

  const handleCreateCampaign = (e) => {
    if (e) e.preventDefault();
    
    setNewCampaign({
      name: '',
      description: '',
      type: 'promotional',
      channels: [],
      providers: {},
      audience: '',
      template: '',
      scheduledDate: '',
      status: 'draft',
      advancedScheduling: {
        enabled: false,
        intervals: []
      }
    });
    setCampaignStep(0);
    setCreateCampaignDialog(true);
  };

  const handleSaveCampaign = () => {
    const campaign = {
      ...newCampaign,
      id: campaigns.length + 1,
      audienceSize: audiences.find(a => a.name === newCampaign.audience)?.size || 0,
      progress: 0,
      createdDate: new Date().toISOString().split('T')[0],
      tags: newCampaign.advancedScheduling.enabled ? ['advanced-scheduling'] : [],
      metrics: { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 },
      advancedScheduling: newCampaign.advancedScheduling.enabled ? {
        enabled: true,
        intervals: newCampaign.advancedScheduling.intervals.filter(interval => interval.enabled)
      } : {
        enabled: false,
        intervals: []
      }
    };
    
    setCampaigns(prev => [...prev, campaign]);
    setCreateCampaignDialog(false);
  };

  const handleLaunchCampaign = (campaignId) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status: 'active' } : campaign
    ));
  };

  const handlePauseCampaign = (campaignId) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status: 'paused' } : campaign
    ));
  };

  const handleViewDetails = (campaignId) => {
    navigate(`/campaigns/${campaignId}`);
  };

  const handleAnalytics = (_campaignId) => {
    setAnalyticsDialog(true);
  };

  const handleAdvancedFilters = () => {
    setAdvancedFiltersDialog(true);
  };

  const handleExport = () => {
    setExportDialog(true);
  };

  const handleExportConfirm = () => {
    // In a real app, this would generate and download the file
    setExportDialog(false);
  };

  const handleApplyAdvancedFilters = () => {
    setAdvancedFiltersDialog(false);
    // Filters are applied automatically via useEffect
  };

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters({
      dateRange: { start: '', end: '' },
      campaignType: 'all',
      audienceSize: { min: '', max: '' },
      performance: 'all',
      tags: []
    });
  };

  const handleTemplateAction = (action, template) => {
    switch (action) {
      case 'edit':
        navigate('/templates', { state: { editTemplate: template } });
        break;
      case 'duplicate':
        // Handle template duplication
        break;
      case 'delete':
        // Handle template deletion
        break;
      case 'preview':
        // Handle template preview
        break;
      default:
        break;
    }
  };

  const handleAudienceAction = (action, _audience) => {
    switch (action) {
      case 'edit':
        // Handle audience editing
        break;
      case 'duplicate':
        // Handle audience duplication
        break;
      case 'delete':
        // Handle audience deletion
        break;
      case 'view':
        // Handle audience view
        break;
      default:
        break;
    }
  };

  const handleEditCampaign = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setNewCampaign(campaign);
      setCampaignStep(0);
      setCreateCampaignDialog(true);
    }
  };

  const handleResumeCampaign = (campaignId) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status: 'active' } : campaign
    ));
  };

  // const handleStopCampaign = (campaignId) => {
  //   setCampaigns(prev => prev.map(campaign => 
  //     campaign.id === campaignId ? { ...campaign, status: 'completed' } : campaign
  //   ));
  // };

  const CampaignCard = ({ campaign }) => (
    <Grow in={loaded} timeout={300}>
          <Card sx={{ 
        mb: 2, 
            borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h6" fontWeight="600">
                  {campaign.name}
                </Typography>
                <Chip 
                  label={campaign.status?.toUpperCase()}
                  color={getStatusColor(campaign.status)}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {campaign.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {campaign.channels.map((channel, index) => (
                    <Tooltip key={index} title={channel?.toUpperCase() || 'UNKNOWN'}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: getChannelColor(channel),
                          fontSize: '0.875rem'
                        }}
                      >
                        {getChannelIcon(channel)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {campaign.audienceSize?.toLocaleString()} recipients
              </Typography>
              </Box>
              
              {campaign.status === 'active' && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{campaign.progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={campaign.progress} 
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem' }}>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(campaign.createdDate).toLocaleDateString()}
                </Typography>
                {campaign.scheduledDate && (
                  <Typography variant="caption" color="text.secondary">
                    Scheduled: {new Date(campaign.scheduledDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {campaign.status === 'draft' && (
                <Tooltip title="Launch Campaign">
                  <IconButton 
                    size="small" 
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchCampaign(campaign.id);
                    }}
                  >
                    <LaunchIcon />
                  </IconButton>
                </Tooltip>
              )}
              {campaign.status === 'active' && (
                <Tooltip title="Pause Campaign">
                  <IconButton 
                    size="small" 
                    color="warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePauseCampaign(campaign.id);
                    }}
                  >
                    <PauseIcon />
                  </IconButton>
                </Tooltip>
              )}
              {campaign.status === 'paused' && (
                <Tooltip title="Resume Campaign">
                  <IconButton 
                    size="small" 
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResumeCampaign(campaign.id);
                    }}
                  >
                    <PlayIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="View Details">
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(campaign.id);
                  }}
                >
                  <ViewIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Analytics">
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnalytics(campaign.id);
                  }}
                >
                  <AnalyticsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Campaign">
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCampaign(campaign.id);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {campaign.status === 'active' && (
              <Box sx={{ 
                display: 'flex', 
              justifyContent: 'space-between', 
              pt: 2, 
              borderTop: `1px solid ${theme.palette.divider}`,
              fontSize: '0.875rem'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {campaign.metrics.sent?.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">Sent</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {campaign.metrics.delivered?.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">Delivered</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {campaign.metrics.opened?.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">Opened</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {campaign.metrics.clicked?.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">Clicked</Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  const CreateCampaignDialog = () => (
    <Dialog 
      open={createCampaignDialog} 
      onClose={() => setCreateCampaignDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Create New Campaign</Typography>
          <IconButton 
            onClick={(e) => {
              e.preventDefault();
              setCreateCampaignDialog(false);
            }}
            type="button"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stepper activeStep={campaignStep} orientation="vertical">
          <Step>
            <StepLabel>Campaign Information</StepLabel>
            <StepContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Campaign Name"
                    value={newCampaign.name}
                    onChange={(e) => {
                      e.preventDefault();
                      setNewCampaign(prev => ({ ...prev, name: e.target.value }));
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={newCampaign.description}
                    onChange={(e) => {
                      e.preventDefault();
                      setNewCampaign(prev => ({ ...prev, description: e.target.value }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Campaign Type</InputLabel>
                    <Select
                      value={newCampaign.type}
                      onChange={(e) => {
                        e.preventDefault();
                        setNewCampaign(prev => ({ ...prev, type: e.target.value }));
                      }}
                    >
                      <MenuItem value="promotional">Promotional</MenuItem>
                      <MenuItem value="transactional">Transactional</MenuItem>
                      <MenuItem value="renewal">Renewal</MenuItem>
                      <MenuItem value="welcome">Welcome</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Scheduled Date"
                    value={newCampaign.scheduledDate}
                    onChange={(e) => {
                      e.preventDefault();
                      setNewCampaign(prev => ({ ...prev, scheduledDate: e.target.value }));
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    setCampaignStep(1);
                  }}
                  disabled={!newCampaign.name}
                  type="button"
                >
                  Continue
                </Button>
              </Box>
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Select Channels</StepLabel>
            <StepContent>
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {['email', 'sms', 'whatsapp'].map((channel) => (
                    <FormControlLabel
                      key={channel}
                      control={
                        <Switch
                          checked={newCampaign.channels.includes(channel)}
                          onChange={(e) => {
                            e.preventDefault();
                            if (e.target.checked) {
                              setNewCampaign(prev => ({
                                ...prev,
                                channels: [...prev.channels, channel]
                              }));
                            } else {
                              setNewCampaign(prev => ({
                                ...prev,
                                channels: prev.channels.filter(c => c !== channel)
                              }));
                            }
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getChannelIcon(channel)}
                          {channel.toUpperCase()}
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </FormControl>
              
              {/* Provider Selection */}
              {newCampaign.channels.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Select Providers
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Choose specific providers for each selected channel
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {newCampaign.channels.map((channel) => {
                      const availableProviders = getProviders(channel).filter(p => p.isActive);
                      const defaultProvider = getActiveProvider(channel);
                      
                      return (
                        <Grid item xs={12} md={6} key={channel}>
                          <FormControl fullWidth>
                            <InputLabel>
                              {channel.charAt(0).toUpperCase() + channel.slice(1)} Provider
                            </InputLabel>
                            <Select
                              value={newCampaign.providers[channel] || defaultProvider?.id || ''}
                              label={`${channel.charAt(0).toUpperCase() + channel.slice(1)} Provider`}
                              onChange={(e) => setNewCampaign(prev => ({
                                ...prev,
                                providers: { ...prev.providers, [channel]: e.target.value }
                              }))}
                              disabled={availableProviders.length === 0}
                            >
                              {availableProviders.map((provider) => (
                                <MenuItem key={provider.id} value={provider.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ 
                                      width: 8, 
                                      height: 8, 
                                      borderRadius: '50%', 
                                      bgcolor: provider.status === 'connected' ? 'success.main' : 'error.main' 
                                    }} />
                                    {provider.name}
                                    {provider.isDefault && (
                                      <Chip label="Default" size="small" sx={{ ml: 1 }} />
                                    )}
                                  </Box>
                                </MenuItem>
                              ))}
                              {availableProviders.length === 0 && (
                                <MenuItem disabled>
                                  No active {channel} providers configured
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                          {availableProviders.length === 0 && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                              Configure {channel} providers in Settings → Providers
                            </Typography>
                          )}
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    setCampaignStep(0);
                  }}
                  type="button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    setCampaignStep(2);
                  }}
                  disabled={newCampaign.channels.length === 0}
                  type="button"
                >
                  Continue
                </Button>
              </Box>
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Select Audience</StepLabel>
            <StepContent>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={newCampaign.audience}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewCampaign(prev => ({ ...prev, audience: e.target.value }));
                  }}
                >
                  {audiences.map((audience) => (
                    <MenuItem key={audience.id} value={audience.name}>
                      {audience.name} ({audience.size.toLocaleString()} contacts)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Advanced Scheduling Toggle */}
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newCampaign.advancedScheduling.enabled}
                      onChange={(e) => setNewCampaign(prev => ({
                        ...prev,
                        advancedScheduling: {
                          ...prev.advancedScheduling,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  }
                  label="Enable Advanced Scheduling"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Set up automated follow-up communications across multiple channels at specific intervals
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    setCampaignStep(1);
                  }}
                  type="button"
                >
                  Back
                </Button>
                {newCampaign.advancedScheduling.enabled ? (
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      setCampaignStep(3);
                    }}
                    disabled={!newCampaign.audience}
                    type="button"
                  >
                    Next: Advanced Scheduling
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSaveCampaign();
                    }}
                    disabled={!newCampaign.audience}
                    startIcon={<SaveIcon />}
                    type="button"
                  >
                    Create Campaign
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Advanced Scheduling</StepLabel>
            <StepContent>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                Configure Multi-Channel Communication Intervals
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set up automated follow-up communications across different channels at specific intervals to maximize customer engagement.
              </Typography>

              {/* Interval Configuration */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Communication Intervals</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const newInterval = {
                        id: Date.now(),
                        channel: newCampaign.channels[0] || 'email',
                        delay: 1,
                        delayUnit: 'days',
                        template: '',
                        enabled: true,
                        conditions: {
                          sendIfNoResponse: true,
                          sendIfNoAction: false
                        }
                      };
                      setNewCampaign(prev => ({
                        ...prev,
                        advancedScheduling: {
                          ...prev.advancedScheduling,
                          intervals: [...prev.advancedScheduling.intervals, newInterval]
                        }
                      }));
                    }}
                  >
                    Add Interval
                  </Button>
                </Box>

                {newCampaign.advancedScheduling.intervals.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                    <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No intervals configured
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Add communication intervals to create automated follow-up sequences
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      onClick={() => {
                        const newInterval = {
                          id: Date.now(),
                          channel: newCampaign.channels[0] || 'email',
                          delay: 1,
                          delayUnit: 'days',
                          template: '',
                          enabled: true,
                          conditions: {
                            sendIfNoResponse: true,
                            sendIfNoAction: false
                          }
                        };
                        setNewCampaign(prev => ({
                          ...prev,
                          advancedScheduling: {
                            ...prev.advancedScheduling,
                            intervals: [...prev.advancedScheduling.intervals, newInterval]
                          }
                        }));
                      }}
                    >
                      Add First Interval
                    </Button>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {newCampaign.advancedScheduling.intervals.map((interval, index) => (
                      <Card key={interval.id} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: getChannelColor(interval.channel)
                              }}>
                                {getChannelIcon(interval.channel)}
                              </Avatar>
                              <Typography variant="subtitle1" fontWeight="600">
                                Interval {index + 1}
                              </Typography>
                              <Chip 
                                label={interval.enabled ? 'Enabled' : 'Disabled'} 
                                color={interval.enabled ? 'success' : 'default'}
                                size="small"
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Switch
                                checked={interval.enabled}
                                onChange={(e) => {
                                  const updatedIntervals = newCampaign.advancedScheduling.intervals.map(int =>
                                    int.id === interval.id ? { ...int, enabled: e.target.checked } : int
                                  );
                                  setNewCampaign(prev => ({
                                    ...prev,
                                    advancedScheduling: {
                                      ...prev.advancedScheduling,
                                      intervals: updatedIntervals
                                    }
                                  }));
                                }}
                                size="small"
                              />
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const updatedIntervals = newCampaign.advancedScheduling.intervals.filter(int => int.id !== interval.id);
                                  setNewCampaign(prev => ({
                                    ...prev,
                                    advancedScheduling: {
                                      ...prev.advancedScheduling,
                                      intervals: updatedIntervals
                                    }
                                  }));
                                }}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Channel</InputLabel>
                                <Select
                                  value={interval.channel}
                                  label="Channel"
                                  onChange={(e) => {
                                    const updatedIntervals = newCampaign.advancedScheduling.intervals.map(int =>
                                      int.id === interval.id ? { ...int, channel: e.target.value } : int
                                    );
                                    setNewCampaign(prev => ({
                                      ...prev,
                                      advancedScheduling: {
                                        ...prev.advancedScheduling,
                                        intervals: updatedIntervals
                                      }
                                    }));
                                  }}
                                >
                                  {newCampaign.channels.map((channel) => (
                                    <MenuItem key={channel} value={channel}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getChannelIcon(channel)}
                                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                                      </Box>
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Delay"
                                type="number"
                                value={interval.delay}
                                onChange={(e) => {
                                  const updatedIntervals = newCampaign.advancedScheduling.intervals.map(int =>
                                    int.id === interval.id ? { ...int, delay: parseInt(e.target.value) } : int
                                  );
                                  setNewCampaign(prev => ({
                                    ...prev,
                                    advancedScheduling: {
                                      ...prev.advancedScheduling,
                                      intervals: updatedIntervals
                                    }
                                  }));
                                }}
                                inputProps={{ min: 1 }}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Unit</InputLabel>
                                <Select
                                  value={interval.delayUnit}
                                  label="Unit"
                                  onChange={(e) => {
                                    const updatedIntervals = newCampaign.advancedScheduling.intervals.map(int =>
                                      int.id === interval.id ? { ...int, delayUnit: e.target.value } : int
                                    );
                                    setNewCampaign(prev => ({
                                      ...prev,
                                      advancedScheduling: {
                                        ...prev.advancedScheduling,
                                        intervals: updatedIntervals
                                      }
                                    }));
                                  }}
                                >
                                  <MenuItem value="minutes">Minutes</MenuItem>
                                  <MenuItem value="hours">Hours</MenuItem>
                                  <MenuItem value="days">Days</MenuItem>
                                  <MenuItem value="weeks">Weeks</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Template"
                                value={interval.template}
                                onChange={(e) => {
                                  const updatedIntervals = newCampaign.advancedScheduling.intervals.map(int =>
                                    int.id === interval.id ? { ...int, template: e.target.value } : int
                                  );
                                  setNewCampaign(prev => ({
                                    ...prev,
                                    advancedScheduling: {
                                      ...prev.advancedScheduling,
                                      intervals: updatedIntervals
                                    }
                                  }));
                                }}
                                placeholder="Template ID"
                              />
                            </Grid>
                          </Grid>

                          {/* Conditions */}
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Trigger Conditions
                            </Typography>
                            <FormGroup row>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={interval.conditions.sendIfNoResponse}
                                    onChange={(e) => {
                                      const updatedIntervals = newCampaign.advancedScheduling.intervals.map(int =>
                                        int.id === interval.id ? { 
                                          ...int, 
                                          conditions: { ...int.conditions, sendIfNoResponse: e.target.checked }
                                        } : int
                                      );
                                      setNewCampaign(prev => ({
                                        ...prev,
                                        advancedScheduling: {
                                          ...prev.advancedScheduling,
                                          intervals: updatedIntervals
                                        }
                                      }));
                                    }}
                                    size="small"
                                  />
                                }
                                label="Send if no response"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={interval.conditions.sendIfNoAction}
                                    onChange={(e) => {
                                      const updatedIntervals = newCampaign.advancedScheduling.intervals.map(int =>
                                        int.id === interval.id ? { 
                                          ...int, 
                                          conditions: { ...int.conditions, sendIfNoAction: e.target.checked }
                                        } : int
                                      );
                                      setNewCampaign(prev => ({
                                        ...prev,
                                        advancedScheduling: {
                                          ...prev.advancedScheduling,
                                          intervals: updatedIntervals
                                        }
                                      }));
                                    }}
                                    size="small"
                                  />
                                }
                                label="Send if no action taken"
                              />
                            </FormGroup>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setCampaignStep(2);
                  }}
                  type="button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSaveCampaign();
                  }}
                  startIcon={<SaveIcon />}
                  type="button"
                >
                  Create Campaign
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <Fade in timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 4
        }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Campaign Manager
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create, manage, and track multi-channel marketing campaigns
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<AssignmentIcon />}
              variant="outlined"
              onClick={() => setTemplateDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Templates
            </Button>
            <Button
              startIcon={<PeopleIcon />}
              variant="outlined"
              onClick={() => setAudienceDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Audiences
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={(e) => handleCreateCampaign(e)}
              sx={{ borderRadius: 2 }}
            >
              Create Campaign
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Campaigns"
              value={campaigns.length}
              color={theme.palette.primary.main}
              icon={<CampaignIcon />}
              index={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Active Campaigns"
              value={campaigns.filter(c => c.status === 'active').length}
              color={theme.palette.success.main}
              icon={<CheckCircleIcon />}
              index={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Scheduled"
              value={campaigns.filter(c => c.status === 'scheduled').length}
              color={theme.palette.info.main}
              icon={<ScheduleIcon />}
              index={2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Reach"
              value={campaigns.reduce((sum, c) => sum + (c.audienceSize || 0), 0)}
              color={theme.palette.warning.main}
              icon={<TrendingUpIcon />}
              index={3}
              isCurrency={false}
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                >
                  <MenuItem value="all">All Channels</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<FilterIcon />}
                  variant="outlined"
                  onClick={handleAdvancedFilters}
                >
                  Advanced Filters
                </Button>
                <Button
                  startIcon={<GetAppIcon />}
                  variant="outlined"
                  onClick={handleExport}
                >
                  Export
                </Button>
                <Button
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                  onClick={loadCampaigns}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Campaigns List */}
        <Box>
          {filteredCampaigns.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <CampaignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No campaigns found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || statusFilter !== 'all' || channelFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first campaign to get started'
                }
              </Typography>
              {!searchTerm && statusFilter === 'all' && channelFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={(e) => handleCreateCampaign(e)}
                >
                  Create Your First Campaign
                </Button>
              )}
            </Paper>
          ) : (
            filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          )}
        </Box>

        {/* Dialogs */}
        <CreateCampaignDialog />
        <TemplateDialog 
          open={templateDialog}
          onClose={() => setTemplateDialog(false)}
          mockTemplates={templates}
          getChannelColor={getChannelColor}
          getChannelIcon={getChannelIcon}
          handleTemplateAction={handleTemplateAction}
          navigate={navigate}
        />
        
        {/* Audience Dialog */}
        <Dialog 
          open={audienceDialog} 
          onClose={() => setAudienceDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Audience Manager</Typography>
              <IconButton onClick={() => setAudienceDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Create New Audience
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {audiences.map((audience) => (
                <Grid item xs={12} md={6} key={audience.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">{audience.name}</Typography>
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {audience.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h5" color="primary" fontWeight="600">
                          {audience.size.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          contacts
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          Segments
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {audience.segments.map((segment, index) => (
                            <Chip key={index} label={segment} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {new Date(audience.lastUpdated).toLocaleDateString()}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleAudienceAction('view', audience)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleAudienceAction('edit', audience)}
                        >
                          Edit
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>

        {/* Advanced Filters Dialog */}
        <Dialog 
          open={advancedFiltersDialog} 
          onClose={() => setAdvancedFiltersDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Advanced Filters</Typography>
              <IconButton onClick={() => setAdvancedFiltersDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Campaign Type</InputLabel>
                  <Select
                    value={advancedFilters.campaignType}
                    onChange={(e) => setAdvancedFilters(prev => ({ 
                      ...prev, 
                      campaignType: e.target.value 
                    }))}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="renewal">Renewal</MenuItem>
                    <MenuItem value="welcome">Welcome</MenuItem>
                    <MenuItem value="payment">Payment</MenuItem>
                    <MenuItem value="promotional">Promotional</MenuItem>
                    <MenuItem value="claims">Claims</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Audience Size"
                  type="number"
                  value={advancedFilters.audienceSize.min}
                  onChange={(e) => setAdvancedFilters(prev => ({ 
                    ...prev, 
                    audienceSize: { ...prev.audienceSize, min: e.target.value }
                  }))}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Audience Size"
                  type="number"
                  value={advancedFilters.audienceSize.max}
                  onChange={(e) => setAdvancedFilters(prev => ({ 
                    ...prev, 
                    audienceSize: { ...prev.audienceSize, max: e.target.value }
                  }))}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Performance</InputLabel>
                  <Select
                    value={advancedFilters.performance}
                    onChange={(e) => setAdvancedFilters(prev => ({ 
                      ...prev, 
                      performance: e.target.value 
                    }))}
                  >
                    <MenuItem value="all">All Performance</MenuItem>
                    <MenuItem value="high">High (70%+ open rate)</MenuItem>
                    <MenuItem value="medium">Medium (40-70% open rate)</MenuItem>
                    <MenuItem value="low">Low (&lt;40% open rate)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Tags</Typography>
                <FormGroup>
                  {['renewal', 'urgent', 'multi-channel', 'welcome', 'onboarding', 'payment', 'automated'].map((tag) => (
                    <FormControlLabel
                      key={tag}
                      control={
                        <Checkbox
                          checked={advancedFilters.tags.includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAdvancedFilters(prev => ({ 
                                ...prev, 
                                tags: [...prev.tags, tag]
                              }));
                            } else {
                              setAdvancedFilters(prev => ({ 
                                ...prev, 
                                tags: prev.tags.filter(t => t !== tag)
                              }));
                            }
                          }}
                        />
                      }
                      label={tag}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetAdvancedFilters}>Reset</Button>
            <Button onClick={() => setAdvancedFiltersDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleApplyAdvancedFilters}>
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Dialog */}
        <Dialog 
          open={exportDialog} 
          onClose={() => setExportDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Export Campaigns</Typography>
              <IconButton onClick={() => setExportDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
                    <MenuItem value="pdf">PDF Report</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Data to Export</InputLabel>
                  <Select
                    value={exportData}
                    onChange={(e) => setExportData(e.target.value)}
                  >
                    <MenuItem value="all">All Campaigns ({campaigns.length})</MenuItem>
                    <MenuItem value="filtered">Filtered Results ({filteredCampaigns.length})</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info">
                  The export will include campaign details, metrics, audience information, and performance data.
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleExportConfirm} startIcon={<GetAppIcon />}>
              Export
            </Button>
          </DialogActions>
        </Dialog>

        {/* Analytics Dialog */}
        <Dialog 
          open={analyticsDialog} 
          onClose={() => setAnalyticsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Campaign Analytics</Typography>
              <IconButton onClick={() => setAnalyticsDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight="600">
                      {campaigns.reduce((sum, c) => sum + c.metrics.sent, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Messages Sent
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" fontWeight="600">
                      {campaigns.reduce((sum, c) => sum + c.metrics.delivered, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Delivered
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" fontWeight="600">
                      {campaigns.reduce((sum, c) => sum + c.metrics.opened, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Opened
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" fontWeight="600">
                      {campaigns.reduce((sum, c) => sum + c.metrics.clicked, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Clicked
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Campaign Performance</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Campaign</TableCell>
                            <TableCell align="right">Sent</TableCell>
                            <TableCell align="right">Delivered</TableCell>
                            <TableCell align="right">Open Rate</TableCell>
                            <TableCell align="right">Click Rate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {campaigns.map((campaign) => {
                            const openRate = campaign.metrics.delivered > 0 
                              ? ((campaign.metrics.opened / campaign.metrics.delivered) * 100).toFixed(1)
                              : '0.0';
                            const clickRate = campaign.metrics.opened > 0 
                              ? ((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(1)
                              : '0.0';
                            
                            return (
                              <TableRow key={campaign.id}>
                                <TableCell>{campaign.name}</TableCell>
                                <TableCell align="right">{campaign.metrics.sent.toLocaleString()}</TableCell>
                                <TableCell align="right">{campaign.metrics.delivered.toLocaleString()}</TableCell>
                                <TableCell align="right">{openRate}%</TableCell>
                                <TableCell align="right">{clickRate}%</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnalyticsDialog(false)}>Close</Button>
            <Button variant="contained" onClick={() => navigate('/campaigns/analytics')}>
              View Detailed Analytics
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CampaignManager; 