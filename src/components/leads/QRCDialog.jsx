import React, { useState, useEffect } from 'react';
import callService from '../../services/callService';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  Paper,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Alert,
  Chip,
  Divider,
  Avatar,
  Card,
  CardContent,
  Badge,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slide,
  Fade,
  LinearProgress,
  Stack,
  alpha,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  AccountCircle as PersonIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  AssignmentTurnedIn as ResolutionIcon,
  LocalOffer as TagIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Schedule as FollowUpIcon,
  CallReceived as IncomingCallIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  PersonSearch as PersonSearchIcon,
  CallEnd as CallEndIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const QRCDialog = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);

  const [formData, setFormData] = useState({
    leadId: '',
    searchPhone: '',
    communicationMode: 'Call',
    type: 'Query',
    resolution: 'Pending',
    reason: '',
    dateTime: new Date(),
    callerName: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    notes: '',
    tag: '',
    followUpDate: null,
    followUpTime: null,
    followUpRequired: false,
    incomingCallerNumber: '',
    priority: 'Medium'
  });

  // Search state
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [customerFound, setCustomerFound] = useState(false);
  const [customerHistory, setCustomerHistory] = useState([]);

  // Quick tags for common scenarios
  const quickTags = [
    { label: 'Hot Lead', color: 'error', icon: '🔥' },
    { label: 'Renewal', color: 'warning', icon: '🔄' },
    { label: 'Urgent', color: 'error', icon: '⚡' },
    { label: 'VIP', color: 'success', icon: '⭐' },
    { label: 'Follow-up', color: 'info', icon: '📅' },
    { label: 'Complaint', color: 'warning', icon: '⚠️' },
  ];

  // Call timer
  useEffect(() => {
    let interval;
    if (open && callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, callStartTime]);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-capture incoming caller number on component mount
  useEffect(() => {
    const captureIncomingCall = async () => {
      setCallStartTime(Date.now());
      setCallDuration(0);

      // Capture incoming call using call service
      const incomingCall = callService.captureIncomingCall();

      setFormData(prev => ({
        ...prev,
        incomingCallerNumber: incomingCall.callerNumber,
        searchPhone: incomingCall.callerNumber.replace(/[^0-9]/g, '').slice(-10),
        phone: incomingCall.callerNumber
      }));

      // Auto-search for existing customer
      const customerLookup = await callService.lookupCustomerByPhone(incomingCall.callerNumber);

      if (customerLookup.found) {
        setCustomerFound(true);
        setFormData(prev => ({
          ...prev,
          leadId: customerLookup.customer.id,
          callerName: customerLookup.customer.name,
          email: customerLookup.customer.email,
          phone: customerLookup.customer.phone,
          company: customerLookup.customer.company || '',
          location: customerLookup.customer.location || ''
        }));

        // Mock customer history
        setCustomerHistory([
          { date: '2025-01-05', type: 'Call', reason: 'Policy Renewal Query', resolved: true },
          { date: '2024-12-15', type: 'Email', reason: 'Premium Payment', resolved: true },
          { date: '2024-11-20', type: 'Call', reason: 'General Inquiry', resolved: true },
        ]);

        setSearchError('');
      } else {
        setCustomerFound(false);
        setSearchError('New customer - please enter details to create profile');
      }
    };

    if (open) {
      captureIncomingCall();
    } else {
      // Reset on close
      setCallStartTime(null);
      setCallDuration(0);
      setCustomerFound(false);
      setCustomerHistory([]);
      setActiveTab(0);
    }
  }, [open]);

  // Use call service for customer lookup
  const lookupLead = async (searchTerm) => {
    setSearching(true);
    setSearchError('');

    try {
      const customerLookup = await callService.lookupCustomerByPhone(searchTerm);

      if (customerLookup.found) {
        const customer = customerLookup.customer;
        setCustomerFound(true);
        setFormData(prev => ({
          ...prev,
          leadId: customer.id,
          callerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company || '',
          location: customer.location || ''
        }));
        setSearchError('');

        // Load customer history
        setCustomerHistory([
          { date: '2025-01-05', type: 'Call', reason: 'Policy Renewal Query', resolved: true },
          { date: '2024-12-15', type: 'Email', reason: 'Premium Payment', resolved: true },
        ]);
      } else {
        setCustomerFound(false);
        setSearchError('No customer found - New customer profile will be created');
      }
    } catch (error) {
      setSearchError('Error looking up customer details');
      setCustomerFound(false);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async () => {
    const searchTerm = formData.leadId || formData.searchPhone;
    if (searchTerm) {
      await lookupLead(searchTerm);
    } else {
      setSearchError('Please enter a Lead ID or phone number');
    }
  };

  const handleQuickTagClick = (tag) => {
    setFormData(prev => ({
      ...prev,
      tag: prev.tag ? `${prev.tag}, ${tag.label}` : tag.label
    }));
  };

  const communicationModes = ['Call', 'Email', 'WhatsApp'];
  const types = ['Query', 'Request', 'Complaint'];
  const resolutions = ['Pending', 'In Progress', 'Resolved', 'Escalated'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const reasonTypes = [
    'Renewal Query',
    'Policy Information',
    'Claim Request',
    'Premium Payment',
    'Policy Modification',
    'Coverage Details',
    'Complaint',
    'Technical Support',
    'Billing Query',
    'General Inquiry',
    'Other'
  ];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleDateChange = (newValue) => {
    setFormData({
      ...formData,
      dateTime: newValue
    });
  };

  const handleFollowUpDateChange = (newValue) => {
    setFormData({
      ...formData,
      followUpDate: newValue
    });
  };

  const handleFollowUpTimeChange = (newValue) => {
    setFormData({
      ...formData,
      followUpTime: newValue
    });
  };

  const handleFollowUpRequiredChange = (event) => {
    setFormData({
      ...formData,
      followUpRequired: event.target.checked
    });
  };

  const handleSubmit = async () => {
    try {
      // Save call details using call service
      await callService.saveCallDetails({
        customerId: formData.leadId,
        customerName: formData.callerName,
        callerNumber: formData.incomingCallerNumber,
        callReason: formData.reason,
        callNotes: formData.notes,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate,
        followUpTime: formData.followUpTime,
        communicationMode: formData.communicationMode,
        type: formData.type,
        resolution: formData.resolution,
        tag: formData.tag,
        priority: formData.priority,
        duration: callDuration
      });

      onSubmit({ ...formData, callDuration });

      // Reset form
      setFormData({
        leadId: '',
        searchPhone: '',
        communicationMode: 'Call',
        type: 'Query',
        resolution: 'Pending',
        reason: '',
        dateTime: new Date(),
        callerName: '',
        company: '',
        email: '',
        phone: '',
        location: '',
        notes: '',
        tag: '',
        followUpDate: null,
        followUpTime: null,
        followUpRequired: false,
        incomingCallerNumber: '',
        priority: 'Medium'
      });

      onClose();
    } catch (error) {
      console.error('Error saving call details:', error);
      onSubmit(formData);
      onClose();
    }
  };

  const getIcon = (mode) => {
    switch (mode) {
      case 'Call':
        return <PhoneIcon />;
      case 'Email':
        return <EmailIcon />;
      case 'WhatsApp':
        return <WhatsAppIcon />;
      default:
        return <PhoneIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 1)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
        }
      }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Enhanced Header */}
        <DialogTitle sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                badgeContent={
                  <Box sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 }
                    }
                  }} />
                }
                overlap="circular"
              >
                <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 48, height: 48 }}>
                  <IncomingCallIcon />
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="h5" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Inbound Call Tagging
                  {customerFound && (
                    <Chip
                      icon={<VerifiedIcon sx={{ color: 'white !important' }} />}
                      label="Existing Customer"
                      size="small"
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Chip
                    icon={<TimerIcon sx={{ color: 'white !important' }} />}
                    label={`Duration: ${formatDuration(callDuration)}`}
                    size="small"
                    sx={{
                      bgcolor: alpha('#fff', 0.15),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  {formData.incomingCallerNumber && (
                    <Chip
                      icon={<PhoneIcon sx={{ color: 'white !important' }} />}
                      label={formData.incomingCallerNumber}
                      size="small"
                      sx={{
                        bgcolor: alpha('#fff', 0.15),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'white',
                bgcolor: alpha('#fff', 0.1),
                '&:hover': {
                  bgcolor: alpha('#fff', 0.2)
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Progress indicator */}
        <LinearProgress
          variant="determinate"
          value={(activeTab + 1) * 33.33}
          sx={{ height: 3 }}
        />

        <DialogContent sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.3) }}>
          {/* Customer Status Banner */}
          {customerFound ? (
            <Fade in={customerFound}>
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 28
                  }
                }}
                action={
                  <Chip
                    label={`ID: ${formData.leadId}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                }
              >
                <Typography variant="body1" fontWeight="600">
                  Customer Found in Database!
                </Typography>
                <Typography variant="body2">
                  {formData.callerName} • {formData.email}
                </Typography>
              </Alert>
            </Fade>
          ) : searchError && (
            <Alert
              severity="info"
              icon={<InfoIcon />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="body2">{searchError}</Typography>
            </Alert>
          )}

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem'
                }
              }}
            >
              <Tab icon={<PersonSearchIcon />} iconPosition="start" label="Customer Lookup" />
              <Tab icon={<DescriptionIcon />} iconPosition="start" label="Call Details" />
              <Tab icon={<FollowUpIcon />} iconPosition="start" label="Actions & Follow-up" />
            </Tabs>
          </Paper>

          {/* Tab 0: Customer Lookup */}
          {activeTab === 0 && (
            <Fade in={activeTab === 0}>
              <Box>
                <Grid container spacing={3}>
                  {/* Search Section */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <SearchIcon color="primary" />
                          <Typography variant="h6" fontWeight="600">
                            Search Customer Database
                          </Typography>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={5}>
                            <TextField
                              fullWidth
                              label="Customer/Lead ID"
                              value={formData.leadId}
                              onChange={handleInputChange('leadId')}
                              placeholder="Enter Customer ID"
                              InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={formData.searchPhone}
                              onChange={handleInputChange('searchPhone')}
                              placeholder="Enter 10-digit phone"
                              InputProps={{
                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={handleSearch}
                              disabled={searching}
                              sx={{
                                height: 56,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                              }}
                            >
                              {searching ? <CircularProgress size={24} /> : 'Search'}
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Customer Info Section */}
                  <Grid item xs={12} md={customerFound ? 8 : 12}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          Customer Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Caller Name"
                              value={formData.callerName}
                              onChange={handleInputChange('callerName')}
                              InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Company"
                              value={formData.company}
                              onChange={handleInputChange('company')}
                              InputProps={{
                                startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Email Address"
                              value={formData.email}
                              onChange={handleInputChange('email')}
                              InputProps={{
                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={formData.phone}
                              onChange={handleInputChange('phone')}
                              InputProps={{
                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Location"
                              value={formData.location}
                              onChange={handleInputChange('location')}
                              InputProps={{
                                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Customer History (Only if found) */}
                  {customerFound && customerHistory.length > 0 && (
                    <Grid item xs={12} md={4}>
                      <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <HistoryIcon color="primary" />
                            <Typography variant="h6" fontWeight="600">
                              Recent Activity
                            </Typography>
                          </Box>
                          <List dense>
                            {customerHistory.map((item, index) => (
                              <ListItem
                                key={index}
                                sx={{
                                  px: 0,
                                  borderLeft: `3px solid ${theme.palette.primary.main}`,
                                  pl: 2,
                                  mb: 1,
                                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                                  borderRadius: 1
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  {item.resolved ? (
                                    <CheckCircleIcon color="success" fontSize="small" />
                                  ) : (
                                    <AccessTimeIcon color="warning" fontSize="small" />
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" fontWeight="600">
                                      {item.reason}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" color="text.secondary">
                                      {item.type} • {item.date}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(1)}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Continue to Call Details
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}

          {/* Tab 1: Call Details */}
          {activeTab === 1 && (
            <Fade in={activeTab === 1}>
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          Call Classification
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Communication Mode</InputLabel>
                              <Select
                                value={formData.communicationMode}
                                onChange={handleInputChange('communicationMode')}
                                label="Communication Mode"
                                startAdornment={
                                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                                    {getIcon(formData.communicationMode)}
                                  </Box>
                                }
                              >
                                {communicationModes.map((mode) => (
                                  <MenuItem key={mode} value={mode}>
                                    {mode}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Type</InputLabel>
                              <Select
                                value={formData.type}
                                onChange={handleInputChange('type')}
                                label="Type"
                              >
                                {types.map((type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Priority</InputLabel>
                              <Select
                                value={formData.priority}
                                onChange={handleInputChange('priority')}
                                label="Priority"
                              >
                                {priorities.map((priority) => (
                                  <MenuItem key={priority} value={priority}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: 8,
                                          height: 8,
                                          borderRadius: '50%',
                                          bgcolor: `${getPriorityColor(priority)}.main`
                                        }}
                                      />
                                      {priority}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                              <InputLabel>Resolution Status</InputLabel>
                              <Select
                                value={formData.resolution}
                                onChange={handleInputChange('resolution')}
                                label="Resolution Status"
                              >
                                {resolutions.map((res) => (
                                  <MenuItem key={res} value={res}>
                                    {res}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <InputLabel>Call Reason</InputLabel>
                              <Select
                                value={formData.reason}
                                onChange={handleInputChange('reason')}
                                label="Call Reason"
                              >
                                {reasonTypes.map((reason) => (
                                  <MenuItem key={reason} value={reason}>
                                    {reason}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <DateTimePicker
                              label="Call Date & Time"
                              value={formData.dateTime}
                              onChange={handleDateChange}
                              renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Quick Tags */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LabelIcon color="primary" />
                          <Typography variant="h6" fontWeight="600">
                            Quick Tags
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {quickTags.map((tag) => (
                            <Chip
                              key={tag.label}
                              label={`${tag.icon} ${tag.label}`}
                              color={tag.color}
                              onClick={() => handleQuickTagClick(tag)}
                              sx={{
                                fontWeight: 600,
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: 'scale(1.05)'
                                },
                                transition: 'transform 0.2s'
                              }}
                            />
                          ))}
                        </Stack>
                        <TextField
                          fullWidth
                          label="Custom Tags"
                          value={formData.tag}
                          onChange={handleInputChange('tag')}
                          placeholder="Add custom tags (comma separated)"
                          sx={{ mt: 2 }}
                          InputProps={{
                            startAdornment: <TagIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Notes Section */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <DescriptionIcon color="primary" />
                          <Typography variant="h6" fontWeight="600">
                            Call Notes & Summary
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth
                          label="Detailed Notes"
                          value={formData.notes}
                          onChange={handleInputChange('notes')}
                          multiline
                          rows={4}
                          placeholder="Document the call conversation, customer concerns, and any commitments made..."
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab(0)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(2)}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Continue to Actions
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}

          {/* Tab 2: Actions & Follow-up */}
          {activeTab === 2 && (
            <Fade in={activeTab === 2}>
              <Box>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <FollowUpIcon color="primary" />
                      <Typography variant="h6" fontWeight="600">
                        Follow-up & Next Steps
                      </Typography>
                    </Box>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.followUpRequired}
                          onChange={handleFollowUpRequiredChange}
                          color="primary"
                          size="large"
                        />
                      }
                      label={
                        <Typography variant="body1" fontWeight="600">
                          Schedule Follow-up
                        </Typography>
                      }
                    />

                    {formData.followUpRequired && (
                      <Fade in={formData.followUpRequired}>
                        <Box sx={{ mt: 3, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <DatePicker
                                label="Follow-up Date"
                                value={formData.followUpDate}
                                onChange={handleFollowUpDateChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                minDate={new Date()}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TimePicker
                                label="Follow-up Time"
                                value={formData.followUpTime}
                                onChange={handleFollowUpTimeChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Alert severity="info" icon={<InfoIcon />}>
                                A reminder will be created and the customer will be notified via their preferred communication channel.
                              </Alert>
                            </Grid>
                          </Grid>
                        </Box>
                      </Fade>
                    )}
                  </CardContent>
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveTab(1)}
                  >
                    Back
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </DialogContent>

        {/* Enhanced Footer */}
        <DialogActions sx={{
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.background.default, 0.5)
        }}>
          <Button
            onClick={onClose}
            variant="outlined"
            size="large"
            startIcon={<CallEndIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            size="large"
            startIcon={<CheckCircleIcon />}
            sx={{
              px: 4,
              background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                transform: 'translateY(-2px)',
                boxShadow: 6
              },
              transition: 'all 0.3s ease'
            }}
          >
            Complete & Save Call
          </Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
};

export default QRCDialog;
