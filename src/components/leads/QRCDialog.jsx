import React, { useState } from 'react';
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
} from '@mui/icons-material';

const QRCDialog = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  
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
    incomingCallerNumber: ''
  });

  // Search state
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Auto-capture incoming caller number on component mount
  React.useEffect(() => {
    const captureIncomingCall = async () => {
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
        setFormData(prev => ({
          ...prev,
          leadId: customerLookup.customer.id,
          callerName: customerLookup.customer.name,
          email: customerLookup.customer.email,
          phone: customerLookup.customer.phone
        }));
        setSearchError('');
      } else {
        setSearchError('Customer not found in database - please enter details manually');
      }
    };
    
    if (open) {
      captureIncomingCall();
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
      } else {
        setSearchError('No customer found with the provided ID or phone number');
      }
    } catch (error) {
      setSearchError('Error looking up customer details');
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

  const communicationModes = ['Call', 'Email', 'WhatsApp'];
  const types = ['Query', 'Request', 'Complaint'];
  const resolutions = ['Pending', 'In Progress', 'Resolved', 'Escalated'];
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
        tag: formData.tag
      });
      
      onSubmit(formData);
      
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
        incomingCallerNumber: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving call details:', error);
      // Still submit the form data to parent component
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" />
            <Typography variant="h6">Inbound Call Tagging</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Incoming Call Info */}
            {formData.incomingCallerNumber && (
              <Grid item xs={12}>
                <Alert 
                  severity="info" 
                  icon={<IncomingCallIcon />}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2">
                    <strong>Incoming Call Detected:</strong> {formData.incomingCallerNumber}
                  </Typography>
                </Alert>
              </Grid>
            )}
            
            {/* Lead Search Section */}
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Lead ID"
                      value={formData.leadId}
                      onChange={handleInputChange('leadId')}
                      placeholder="Enter Lead ID"
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.searchPhone}
                      onChange={handleInputChange('searchPhone')}
                      placeholder="Enter phone number"
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
                      sx={{ height: '56px' }}
                    >
                      {searching ? <CircularProgress size={24} /> : 'Search'}
                    </Button>
                  </Grid>
                  {searchError && (
                    <Grid item xs={12}>
                      <Typography color="error" variant="body2">
                        {searchError}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Communication Mode */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Mode</InputLabel>
                <Select
                  value={formData.communicationMode}
                  onChange={handleInputChange('communicationMode')}
                  label="Mode"
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

            {/* QRC Type */}
            <Grid item xs={12} md={4}>
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

            {/* Resolution Status */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Resolution</InputLabel>
                <Select
                  value={formData.resolution}
                  onChange={handleInputChange('resolution')}
                  label="Resolution"
                >
                  {resolutions.map((res) => (
                    <MenuItem key={res} value={res}>
                      {res}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Reason */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Reason</InputLabel>
                <Select
                  value={formData.reason}
                  onChange={handleInputChange('reason')}
                  label="Reason"
                >
                  {reasonTypes.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Date Time */}
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Date & Time"
                value={formData.dateTime}
                onChange={handleDateChange}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </Grid>

            {/* Caller Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Caller Name"
                value={formData.callerName}
                onChange={handleInputChange('callerName')}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>

            {/* Company */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={handleInputChange('company')}
                InputProps={{
                  startAdornment: (
                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleInputChange('email')}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleInputChange('location')}
                InputProps={{
                  startAdornment: (
                    <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>

            {/* Tag */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tag"
                value={formData.tag}
                onChange={handleInputChange('tag')}
                InputProps={{
                  startAdornment: (
                    <TagIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={handleInputChange('notes')}
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon sx={{ mr: 1, mt: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>
            
            {/* Follow-up Section */}
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FollowUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" fontWeight="600">
                    Follow-up Details
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.followUpRequired}
                          onChange={handleFollowUpRequiredChange}
                          color="primary"
                        />
                      }
                      label="Follow-up Required"
                    />
                  </Grid>
                  
                  {formData.followUpRequired && (
                    <>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Follow-up Date"
                          value={formData.followUpDate}
                          onChange={handleFollowUpDateChange}
                          renderInput={(props) => <TextField {...props} fullWidth />}
                          minDate={new Date()}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TimePicker
                          label="Follow-up Time"
                          value={formData.followUpTime}
                          onChange={handleFollowUpTimeChange}
                          renderInput={(props) => <TextField {...props} fullWidth />}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              px: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  );
};

export default QRCDialog;
