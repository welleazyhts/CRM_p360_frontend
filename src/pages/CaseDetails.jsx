import React, { useState, useEffect } from 'react';
// No need to import getCaseById here as we're using dynamic import in the useEffect
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Alert,
  Card,
  CardContent,
  Stack,
  Avatar,
  Tooltip,
  TextField,
  Grow,
  Fade,
  Zoom,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  Snackbar,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon,
  LocalOffer as LocalOfferIcon,
  DirectionsCar as DirectionsCarIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  MailOutline as MailOutlineIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  WhatsApp as WhatsAppIcon,
  CreditCard as CreditCardIcon,
  Home as HomeIcon,
  Verified as VerifiedIcon,
  Sms as SmsIcon,
  SmartToy as SmartToyIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  Pending as PendingIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
  Notifications as NotificationsIcon,
  Link as LinkIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  StarRate as StarRateIcon,
  Assessment as AssessmentIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '@mui/material/styles';
import ChannelDetails from '../components/common/ChannelDetails';

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`case-tabpanel-${index}`}
      aria-labelledby={`case-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `case-tab-${index}`,
    'aria-controls': `case-tabpanel-${index}`,
  };
}

const CaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const theme = useTheme();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [renewalNoticeDialog, setRenewalNoticeDialog] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingNotice, setSendingNotice] = useState(false);
  const [messageType, setMessageType] = useState('renewal_notice');
  
  // New state for tab management
  const [currentTab, setCurrentTab] = useState(0);
  const [isConsolidatedView, setIsConsolidatedView] = useState(false);
  
  // Verification states
  const [verificationStatus, setVerificationStatus] = useState({
    email: { verified: false, verifiedAt: null, verifying: false },
    phone: { verified: false, verifiedAt: null, verifying: false },
    pan: { verified: false, verifiedAt: null, verifying: false }
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Communication Logs states
  const [communicationTab, setCommunicationTab] = useState(0);
  const [viewMessageDialog, setViewMessageDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      setLoading(true);
      try {
        // Import the API function to get case by ID
        const { getCaseById } = await import('../services/api');
        
        // Fetch case data using the caseId from URL parameters
        const caseData = await getCaseById(caseId);
        
        setCaseData(caseData);
      } catch (err) {
        setError(`Failed to fetch case details: ${err.message}`);
        console.error('Error fetching case details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  // Add loaded state for animations
  useEffect(() => {
    if (!loading && caseData) {
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    }
  }, [loading, caseData]);

  // Verification API functions (configurable endpoints)
  const verificationConfig = {
    email: {
      endpoint: '/api/verify/email',
      method: 'POST'
    },
    phone: {
      endpoint: '/api/verify/phone', 
      method: 'POST'
    },
    pan: {
      endpoint: '/api/verify/pan',
      method: 'POST'
    }
  };

  const handleVerification = async (type, value) => {
    if (!value) {
      setSnackbar({ 
        open: true, 
        message: `No ${type} provided to verify`, 
        severity: 'error' 
      });
      return;
    }

    // Set verifying state
    setVerificationStatus(prev => ({
      ...prev,
      [type]: { ...prev[type], verifying: true }
    }));

    try {
      const config = verificationConfig[type];
      
      // Simulated API call - replace with actual API implementation
      const response = await fetch(config.endpoint, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth if needed
        },
        body: JSON.stringify({
          [type]: value,
          caseId: caseId,
          customerName: caseData?.customerName
        })
      });

      if (response.ok) {
        await response.json(); // Response received successfully
        const verifiedAt = new Date().toISOString();
        
        setVerificationStatus(prev => ({
          ...prev,
          [type]: { 
            verified: true, 
            verifiedAt: verifiedAt, 
            verifying: false 
          }
        }));

        setSnackbar({ 
          open: true, 
          message: `${type.toUpperCase()} verified successfully`, 
          severity: 'success' 
        });
      } else {
        throw new Error(`Verification failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`${type} verification error:`, error);
      
      // For demo purposes, simulate successful verification after 2 seconds
      setTimeout(() => {
        const verifiedAt = new Date().toISOString();
        setVerificationStatus(prev => ({
          ...prev,
          [type]: { 
            verified: true, 
            verifiedAt: verifiedAt, 
            verifying: false 
          }
        }));

        setSnackbar({ 
          open: true, 
          message: `${type.toUpperCase()} verified successfully (Demo Mode)`, 
          severity: 'success' 
        });
      }, 2000);
    }
  };

  const formatVerificationDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6">Loading case details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="error" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>{error}</Alert>
      </Box>
    );
  }

  if (!caseData) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Alert severity="warning" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>Case not found</Alert>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'renewed': return 'success';
      case 'in progress': return 'info';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getDefaultMessage = (channel, type) => {
    const customerName = caseData?.customerName || 'Customer';
    const policyNumber = caseData?.policyNumber || 'Policy';
    const expiryDate = caseData?.policyDetails?.expiryDate || 'Soon';
    const premium = caseData?.policyDetails?.premium || 'N/A';
    const policyType = caseData?.policyDetails?.type || 'Insurance';
    
    const renewalMessages = {
      whatsapp: `🔔 *Renewal Reminder*\n\nDear ${customerName},\n\nYour ${policyType} policy (${policyNumber}) is expiring on ${expiryDate}.\n\n📋 *Policy Details:*\n• Premium: ₹${premium}\n• Coverage: ${policyType}\n• Expiry: ${expiryDate}\n\n📞 Need assistance? Call us at 1800-XXX-XXXX\n\nThanks,\nRenew-iQ Insurance Team`,
      sms: `RENEWAL ALERT: Dear ${customerName}, your policy ${policyNumber} expires on ${expiryDate}. Premium: ₹${premium}. Call 1800-XXX-XXXX for renewal. -Renew-iQ Insurance`,
      email: `Subject: Renewal Reminder - ${policyType} Policy ${policyNumber}\n\nDear ${customerName},\n\nThis is a friendly reminder that your ${policyType} policy (${policyNumber}) is due for renewal on ${expiryDate}.\n\nPolicy Details:\n- Policy Number: ${policyNumber}\n- Premium: ₹${premium}\n- Coverage: ${policyType}\n- Expiry Date: ${expiryDate}\n\nTo proceed with renewal, please contact us at 1800-XXX-XXXX or visit our nearest branch.\n\nWe appreciate your continued trust in our services.\n\nBest regards,\nRenew-iQ Insurance Team`
    };

    const paymentMessages = {
      whatsapp: `💳 *Payment Link - Policy Renewal*\n\nDear ${customerName},\n\nYour ${policyType} policy (${policyNumber}) renewal payment is ready.\n\n💰 *Amount: ₹${premium}*\n\n🔗 *Secure Payment Link:*\n[Payment Link]\n\n✅ *Benefits:*\n• Instant policy activation\n• Secure payment gateway\n• 24/7 customer support\n\n⏰ Link expires in 48 hours\n\nThanks,\nRenew-iQ Insurance Team`,
      sms: `PAYMENT LINK: Dear ${customerName}, renew policy ${policyNumber} (₹${premium}). Secure link: [Payment Link]. Expires in 48hrs. -Renew-iQ Insurance`,
      email: `Subject: Secure Payment Link - Renew Policy ${policyNumber}\n\nDear ${customerName},\n\nYour ${policyType} policy renewal payment is now ready for processing.\n\nPayment Details:\n- Policy Number: ${policyNumber}\n- Premium Amount: ₹${premium}\n- Policy Type: ${policyType}\n- Expiry Date: ${expiryDate}\n\nSecure Payment Link:\n[Payment Link]\n\nImportant Notes:\n• This link is valid for 48 hours\n• Your policy will be activated immediately after payment\n• You will receive a confirmation email after successful payment\n• For any assistance, call us at 1800-XXX-XXXX\n\nThank you for choosing Renew-iQ Insurance.\n\nBest regards,\nRenew-iQ Insurance Team`
    };
    
    const messages = type === 'payment_link' ? paymentMessages : renewalMessages;
    return messages[channel] || messages.whatsapp;
  };

  const handleSendRenewalNotice = async () => {
    setSendingNotice(true);
    
    try {
      // Simulate API call for sending renewal notice or payment link
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call an API endpoint
      // await sendRenewalNotice(caseData.id, selectedChannel, customMessage || getDefaultMessage(selectedChannel, messageType), messageType);
      
      const messageTypeText = messageType === 'payment_link' ? 'Payment link' : 'Renewal notice';
      setSuccessMessage(`${messageTypeText} sent successfully via ${selectedChannel.toUpperCase()}!`);
      setRenewalNoticeDialog(false);
      setCustomMessage('');
      
      // Add to case history
      const newHistoryEntry = {
        date: new Date().toISOString(),
        action: `${messageTypeText} Sent`,
        details: `${messageTypeText} sent via ${selectedChannel.toUpperCase()} to ${caseData.contactInfo.email || caseData.contactInfo.phone}`,
        user: 'Current User'
      };
      
      setCaseData(prev => ({
        ...prev,
        history: [newHistoryEntry, ...prev.history]
      }));
      
    } catch (error) {
      setError(`Failed to send ${messageType === 'payment_link' ? 'payment link' : 'renewal notice'}. Please try again.`);
    } finally {
      setSendingNotice(false);
    }
  };

  const handleOpenRenewalDialog = () => {
    setCustomMessage(getDefaultMessage(selectedChannel, messageType));
    setRenewalNoticeDialog(true);
  };

  // Communication Logs handlers
  const handleCommunicationTabChange = (event, newValue) => {
    setCommunicationTab(newValue);
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setViewMessageDialog(true);
  };

  const handleCloseViewMessage = () => {
    setViewMessageDialog(false);
    setSelectedMessage(null);
  };

  const handleResendMessage = (message) => {
    setSnackbar({
      open: true,
      message: `${message.type || 'Message'} resent successfully!`,
      severity: 'success'
    });
  };

  const handleEditAndResend = (message) => {
    // Open renewal dialog with the message content
    setSelectedMessage(message);
    setCustomMessage(message.body || message.message);
    if (message.type === 'email') {
      setSelectedChannel('email');
    } else if (message.type === 'sms') {
      setSelectedChannel('sms');
    } else if (message.type === 'whatsapp') {
      setSelectedChannel('whatsapp');
    }
    setRenewalNoticeDialog(true);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Zoom in={loaded} style={{ transitionDelay: '100ms' }}>
            <IconButton 
              onClick={() => navigate('/cases')} 
              sx={{ 
                bgcolor: 'background.paper', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Zoom>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
              Case Details - {caseData.id}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={caseData.status}
                color={getStatusColor(caseData.status)}
                sx={{ fontWeight: 500, borderRadius: 5 }}
              />
              <Chip
                icon={<PriorityHighIcon />}
                label={caseData.isPriority ? 'Priority' : 'Normal'}
                color={caseData.isPriority ? 'error' : 'primary'}
                variant={caseData.isPriority ? 'filled' : 'outlined'}
                onClick={async () => {
                  try {
                    const { updateCase } = await import('../services/api');
                    await updateCase(caseId, { isPriority: !caseData.isPriority });
                    setCaseData({ ...caseData, isPriority: !caseData.isPriority });
                    setSuccessMessage(`Priority status ${!caseData.isPriority ? 'enabled' : 'disabled'}`);
                  } catch (err) {
                    setError('Failed to update priority status');
                  }
                }}
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: 5,
                  fontWeight: 500,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)'
                  },
                  ...(caseData.isPriority ? {} : {
                    borderWidth: '1px',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '& .MuiChip-icon': {
                      color: 'primary.main'
                    }
                  })
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(caseData.uploadDate).toLocaleString()}
              </Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={2}>
            {/* Consolidated View Toggle Button */}
            <Zoom in={loaded} style={{ transitionDelay: '150ms' }}>
              <Tooltip title={isConsolidatedView ? "Switch to Tab View" : "Switch to Consolidated View"}>
                <Button
                  variant={isConsolidatedView ? "contained" : "outlined"}
                  startIcon={isConsolidatedView ? <ViewModuleIcon /> : <ViewListIcon />}
                  onClick={() => setIsConsolidatedView(!isConsolidatedView)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: isConsolidatedView ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    background: isConsolidatedView ? 'linear-gradient(45deg, #FF6B35 30%, #FF8E53 90%)' : 'transparent',
                    borderColor: 'primary.main',
                    color: isConsolidatedView ? 'white' : 'primary.main',
                    '&:hover': {
                      background: isConsolidatedView 
                        ? 'linear-gradient(45deg, #E55A2B 30%, #E57A47 90%)'
                        : alpha(theme.palette.primary.main, 0.04),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  {isConsolidatedView ? 'Tab View' : 'Consolidated View'}
                </Button>
              </Tooltip>
            </Zoom>
            <Zoom in={loaded} style={{ transitionDelay: '200ms' }}>
              <Tooltip title="Send Renewal Notice or Payment Link">
                <Button
                  variant="contained"
                  startIcon={<NotificationsIcon />}
                  onClick={handleOpenRenewalDialog}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Send Communication
                </Button>
              </Tooltip>
            </Zoom>
            {settings?.showEditCaseButton !== false && (
              <Zoom in={loaded} style={{ transitionDelay: '300ms' }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => {}}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 3,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                    }
                  }}
                >
                  Edit Case
                </Button>
              </Zoom>
            )}
          </Stack>
        </Box>

        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
              onClose={() => setSuccessMessage('')}
            >
              {successMessage}
            </Alert>
          </Grow>
        )}

        {/* Tab Navigation - Only show when not in consolidated view */}
        {!isConsolidatedView && (
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  minHeight: 48,
                  borderRadius: 2,
                  mr: 1,
                  '&.Mui-selected': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 2
                }
              }}
            >
              <Tab icon={<InfoIcon />} label="Overview & Policy" {...a11yProps(0)} />
              <Tab icon={<GroupIcon />} label="Policy Members" {...a11yProps(1)} />
              <Tab icon={<SettingsIcon />} label="Preferences" {...a11yProps(2)} />
              <Tab icon={<LightbulbIcon />} label="Insights" {...a11yProps(3)} />
              <Tab icon={<AssessmentIcon />} label="Analytics" {...a11yProps(4)} />
              <Tab icon={<StarRateIcon />} label="Offers" {...a11yProps(5)} />
              <Tab icon={<MonetizationOnIcon />} label="Outstanding Amounts" {...a11yProps(6)} />
              <Tab icon={<HistoryIcon />} label="History & Timeline" {...a11yProps(7)} />
            </Tabs>
          </Box>
        )}

        {/* Content Area */}
        {isConsolidatedView ? (
          // Consolidated View - Show all content in original layout
          <Grid container spacing={3}>
            {/* Customer Information */}
          <Grid item xs={12} md={4}>
            <Grow in={loaded} timeout={400}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600">{caseData.customerName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Customer Details
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    {/* Email with Verification */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <EmailIcon color="primary" />
                        <Typography>{caseData.contactInfo.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {verificationStatus.email.verified ? (
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label="Verified" 
                              color="success" 
                              size="small" 
                              icon={<CheckCircleIcon />}
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                              Verified on {formatVerificationDate(verificationStatus.email.verifiedAt)}
                            </Typography>
                          </Box>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleVerification('email', caseData.contactInfo.email)}
                            disabled={verificationStatus.email.verifying}
                            startIcon={verificationStatus.email.verifying ? <CircularProgress size={16} /> : <VerifiedIcon />}
                          >
                            {verificationStatus.email.verifying ? 'Verifying...' : 'Verify'}
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* Phone with Verification */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <PhoneIcon color="primary" />
                        <Typography>{caseData.contactInfo.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {verificationStatus.phone.verified ? (
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label="Verified" 
                              color="success" 
                              size="small" 
                              icon={<CheckCircleIcon />}
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                              Verified on {formatVerificationDate(verificationStatus.phone.verifiedAt)}
                            </Typography>
                          </Box>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleVerification('phone', caseData.contactInfo.phone)}
                            disabled={verificationStatus.phone.verifying}
                            startIcon={verificationStatus.phone.verifying ? <CircularProgress size={16} /> : <VerifiedIcon />}
                          >
                            {verificationStatus.phone.verifying ? 'Verifying...' : 'Verify'}
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* PAN with Verification */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <CreditCardIcon color="primary" />
                        <Typography>{caseData.contactInfo.pan}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {verificationStatus.pan.verified ? (
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label="Verified" 
                              color="success" 
                              size="small" 
                              icon={<CheckCircleIcon />}
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                              Verified on {formatVerificationDate(verificationStatus.pan.verifiedAt)}
                            </Typography>
                          </Box>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleVerification('pan', caseData.contactInfo.pan)}
                            disabled={verificationStatus.pan.verifying}
                            startIcon={verificationStatus.pan.verifying ? <CircularProgress size={16} /> : <VerifiedIcon />}
                          >
                            {verificationStatus.pan.verifying ? 'Verifying...' : 'Verify'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Policy Information */}
          <Grid item xs={12} md={8}>
            <Grow in={loaded} timeout={500}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <DescriptionIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Policy Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Stack spacing={2.5}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                            Policy Number
                          </Typography>
                          <Typography variant="body1" fontWeight="500">{caseData.policyNumber}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                            Policy Type
                          </Typography>
                          <Typography variant="body1" fontWeight="500">{caseData.policyDetails.type}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Stack spacing={2.5}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                            Premium
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            ₹{caseData.policyDetails.premium.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                            Expiry Date
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {new Date(caseData.policyDetails.expiryDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Stack spacing={2.5}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                            Annual Income
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            ₹{(caseData.policyDetails.premium * 8).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                            Channel Partner
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {caseData.policyDetails.type === 'Health' ? 'Corporate Sales - Rajesh Kumar' :
                             caseData.policyDetails.type === 'Auto' ? 'Agent Network - Priya Sharma' :
                             caseData.policyDetails.type === 'Life' ? 'Branch Office - Mumbai Central' :
                             'Online Portal - Direct Sales'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Stack spacing={2.5}>
                        {caseData.policyProposer && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                              Policy Proposer
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {caseData.policyProposer.name}
                            </Typography>
                          </Box>
                        )}
                        {caseData.lifeAssured && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                              Life Assured
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {caseData.lifeAssured.name}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Channel Details */}
          <ChannelDetails caseData={caseData} loaded={loaded} timeout={500} />

          {/* Policy Features */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={550}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <HealthAndSafetyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Policy Features</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    {caseData.policyDetails.type === 'Health' && (
                      <>
                        {/* Health Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <HealthAndSafetyIcon fontSize="small" sx={{ mr: 1 }} /> Health Insurance (Corporate/Group)
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Sum Insured: ₹1L–₹10L; family floater available.</Typography>
                            <Typography variant="body2">PED Coverage: Included from Day 1.</Typography>
                            <Typography variant="body2">Cashless Network: 7000+ hospitals PAN-India.</Typography>
                            <Typography variant="body2">Maternity: ₹50K–₹1L, includes newborn.</Typography>
                            <Typography variant="body2">Daycare Surgeries: 500+ procedures covered.</Typography>
                            <Typography variant="body2">Room Rent: No cap; private AC room eligibility.</Typography>
                            <Typography variant="body2">AYUSH: Coverage up to ₹25K/year.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* Wellness Benefits Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <WorkspacePremiumIcon fontSize="small" sx={{ mr: 1 }} /> Wellness Benefits
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Health Checkups: Annual, 35+ parameters.</Typography>
                            <Typography variant="body2">Doctor at Home: 2 visits/year.</Typography>
                            <Typography variant="body2">Mental Wellness: Quarterly sessions.</Typography>
                            <Typography variant="body2">Fitness Access: Subsidized gyms/yoga.</Typography>
                            <Typography variant="body2">Nutrition Plans: Personalized counseling.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* Preventive Care Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Preventive Care
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Chronic Condition Support: Diabetes, hypertension, etc.</Typography>
                            <Typography variant="body2">Digital Health Records: ABDM-compliant.</Typography>
                            <Typography variant="body2">Teleconsultation: 24x7 access to doctors.</Typography>
                            <Typography variant="body2">Medicine Delivery: With discounts.</Typography>
                            <Typography variant="body2">Lab Tests: 15–30% discounted diagnostics.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* OPD, Dental & Vision Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> OPD, Dental & Vision
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">OPD Cover: ₹2.5K–₹15K annually.</Typography>
                            <Typography variant="body2">Dental: Annual cleaning & basic procedures.</Typography>
                            <Typography variant="body2">Vision: Eye check + spectacles up to ₹2K.</Typography>
                            <Typography variant="body2">Vaccinations: Flu, COVID, travel vaccines included.</Typography>
                          </Stack>
                        </Grid>
                        
                        {/* Value-Added Services Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} /> Value-Added Services
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Second Opinions: Global/National access.</Typography>
                            <Typography variant="body2">Claims Helpdesk: Virtual & onsite support.</Typography>
                            <Typography variant="body2">Health Risk Assessments: With scoring.</Typography>
                            <Typography variant="body2">Emergency Ambulance: Up to ₹2K per case.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                    
                    {caseData.policyDetails.type === 'Auto' && (
                      <>
                        {/* Auto Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} /> Vehicle Insurance
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Comprehensive Coverage: Own damage + third-party liability.</Typography>
                            <Typography variant="body2">Zero Depreciation: Full claim without depreciation deduction.</Typography>
                            <Typography variant="body2">Roadside Assistance: 24x7 emergency support.</Typography>
                            <Typography variant="body2">NCB Protection: No claims bonus safeguard.</Typography>
                            <Typography variant="body2">Engine Protection: Coverage for hydrostatic lock damage.</Typography>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Additional Benefits
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Key Replacement: Coverage for lost or damaged keys.</Typography>
                            <Typography variant="body2">Return to Invoice: Full invoice value in case of total loss.</Typography>
                            <Typography variant="body2">Personal Accident Cover: ₹15 lakh for owner-driver.</Typography>
                            <Typography variant="body2">Passenger Cover: ₹1 lakh per passenger.</Typography>
                            <Typography variant="body2">Consumables Cover: For oils, lubricants, etc.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                    
                    {caseData.policyDetails.type === 'Life' && (
                      <>
                        {/* Life Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <WorkspacePremiumIcon fontSize="small" sx={{ mr: 1 }} /> Life Insurance
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Term Coverage: Up to ₹2 Crore sum assured.</Typography>
                            <Typography variant="body2">Critical Illness: Coverage for 36 critical conditions.</Typography>
                            <Typography variant="body2">Accidental Death: Double sum assured payout.</Typography>
                            <Typography variant="body2">Premium Waiver: On disability or critical illness.</Typography>
                            <Typography variant="body2">Tax Benefits: Under Section 80C and 10(10D).</Typography>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} /> Investment Benefits
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Guaranteed Returns: 5-6% annual guaranteed returns.</Typography>
                            <Typography variant="body2">Maturity Benefits: Lump sum payment at policy maturity.</Typography>
                            <Typography variant="body2">Loyalty Additions: Extra bonus for long-term policyholders.</Typography>
                            <Typography variant="body2">Partial Withdrawals: Available after lock-in period.</Typography>
                            <Typography variant="body2">Loan Facility: Up to 80% of surrender value.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                    
                    {caseData.policyDetails.type === 'Home' && (
                      <>
                        {/* Home Insurance Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <HomeIcon fontSize="small" sx={{ mr: 1 }} /> Home Insurance
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Structure Coverage: Up to ₹5 Crore building value.</Typography>
                            <Typography variant="body2">Contents Protection: Furniture, appliances, valuables.</Typography>
                            <Typography variant="body2">Natural Disasters: Flood, earthquake, storm damage.</Typography>
                            <Typography variant="body2">Burglary & Theft: Coverage for stolen possessions.</Typography>
                            <Typography variant="body2">Temporary Accommodation: If home becomes uninhabitable.</Typography>
                          </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Additional Protections
                          </Typography>
                          <Stack spacing={1.5} sx={{ ml: 1 }}>
                            <Typography variant="body2">Liability Coverage: For third-party injuries on property.</Typography>
                            <Typography variant="body2">Electrical Equipment: Protection against short circuits.</Typography>
                            <Typography variant="body2">Rent Loss Cover: Compensation for lost rental income.</Typography>
                            <Typography variant="body2">Renovation Coverage: Protection during home improvements.</Typography>
                            <Typography variant="body2">Jewelry & Valuables: Special coverage for high-value items.</Typography>
                          </Stack>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Policy Members Details - Only for Health Insurance */}
          {caseData.policyDetails.type === 'Health' && caseData.policyMembers && (
            <Grid item xs={12}>
              <Grow in={loaded} timeout={575}>
                <Card 
                  elevation={0}
                  sx={{ 
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                    overflow: 'visible',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight="600">Policy Members Details</Typography>
                      <Chip 
                        label={`${caseData.policyMembers.length} Members`} 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                      {caseData.policyMembers.map((member, index) => (
                        <Grid item xs={12} md={6} lg={4} key={member.id}>
                          <Zoom in={loaded} timeout={600 + (index * 100)}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                height: '100%',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: member.relationship === 'Self' ? 'primary.main' : 'divider',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2.5 }}>
                                {/* Member Header */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: member.relationship === 'Self' ? 'primary.main' : 'secondary.main',
                                      width: 48,
                                      height: 48,
                                      mr: 2,
                                      fontSize: '1.2rem',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </Avatar>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                                      {member.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip 
                                        label={member.relationship} 
                                        size="small" 
                                        color={member.relationship === 'Self' ? 'primary' : 'default'}
                                        sx={{ fontSize: '0.75rem' }}
                                      />
                                      <Typography variant="caption" color="text.secondary">
                                        {member.age} years
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Member Details */}
                                <Stack spacing={1.5}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Date of Birth:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="500">
                                      {new Date(member.dateOfBirth).toLocaleDateString('en-IN')}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Gender:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="500">
                                      {member.gender}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Sum Insured:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="600" color="primary.main">
                                      {member.sumInsured}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Premium Share:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="500" color="success.main">
                                      {member.premiumContribution}
                                    </Typography>
                                  </Box>
                                  
                                  <Divider sx={{ my: 1 }} />
                                  
                                  {/* Medical History */}
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                      <HealthAndSafetyIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      Medical History
                                    </Typography>
                                    {member.medicalHistory && member.medicalHistory.length > 0 ? (
                                      <Stack spacing={0.5}>
                                        {member.medicalHistory.map((condition, idx) => (
                                          <Typography key={idx} variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                            • {condition}
                                          </Typography>
                                        ))}
                                      </Stack>
                                    ) : (
                                      <Typography variant="caption" color="text.secondary">
                                        No medical history recorded
                                      </Typography>
                                    )}
                                  </Box>
                                  
                                  <Divider sx={{ my: 1 }} />
                                  
                                  {/* Last Claim Info */}
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                      <PaymentsIcon fontSize="small" sx={{ mr: 0.5 }} />
                                      Recent Claim
                                    </Typography>
                                    {member.lastClaimDate ? (
                                      <Stack spacing={0.5}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="caption" color="text.secondary">
                                            Date:
                                          </Typography>
                                          <Typography variant="caption" fontWeight="500">
                                            {new Date(member.lastClaimDate).toLocaleDateString('en-IN')}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="caption" color="text.secondary">
                                            Amount:
                                          </Typography>
                                          <Typography variant="caption" fontWeight="600" color="error.main">
                                            {member.lastClaimAmount}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    ) : (
                                      <Typography variant="caption" color="text.secondary">
                                        No claims made
                                      </Typography>
                                    )}
                                  </Box>
                                  
                                  {/* Claim History Count */}
                                  {member.claimHistory && member.claimHistory.length > 0 && (
                                    <Box sx={{ 
                                      mt: 1, 
                                      p: 1, 
                                      bgcolor: alpha(theme.palette.info.main, 0.1),
                                      borderRadius: 1,
                                      textAlign: 'center'
                                    }}>
                                      <Typography variant="caption" color="info.main" fontWeight="500">
                                        Total Claims: {member.claimHistory.length}
                                      </Typography>
                                    </Box>
                                  )}
                                </Stack>
                              </CardContent>
                            </Card>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>
                    
                    {/* Family Summary */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, color: 'primary.main' }}>
                        Family Policy Summary
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                              {caseData.policyMembers.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Members
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                              ₹{caseData.policyDetails.premium.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Annual Premium
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" color="info.main">
                              {caseData.policyMembers.reduce((total, member) => total + (member.claimHistory?.length || 0), 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Claims
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="bold" color="warning.main">
                              ₹{caseData.policyMembers.reduce((total, member) => {
                                const lastClaim = member.lastClaimAmount;
                                return total + (lastClaim ? parseInt(lastClaim.replace(/[₹,]/g, '')) : 0);
                              }, 0).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Recent Claims Value
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          )}

          {/* Other Policies */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={575}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <WorkspacePremiumIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Other Policies</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    {[
                      {
                        id: 'POL-2024-001',
                        type: 'Term Life',
                        premium: '15,000',
                        status: 'Active',
                        expiryDate: '2026-03-15',
                        coverage: '50,00,000'
                      },
                      {
                        id: 'POL-2023-045',
                        type: 'Personal Accident',
                        premium: '3,500',
                        status: 'Active',
                        expiryDate: '2025-12-31',
                        coverage: '25,00,000'
                      },
                      {
                        id: 'POL-2023-089',
                        type: 'Critical Illness',
                        premium: '8,000',
                        status: 'Pending Renewal',
                        expiryDate: '2025-11-30',
                        coverage: '15,00,000'
                      }
                    ].map((policy) => (
                      <Grid item xs={12} md={4} key={policy.id}>
                        <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), p: 2, borderRadius: 2 }}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                              Policy ID: {policy.id}
                            </Typography>
                            <Typography variant="h6">{policy.type}</Typography>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Premium (₹/yr)
                              </Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {policy.premium}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Coverage (₹)
                              </Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {policy.coverage}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                Expiry Date
                              </Typography>
                              <Typography variant="subtitle1">
                                {policy.expiryDate}
                              </Typography>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              <Chip 
                                label={policy.status} 
                                color={policy.status === 'Active' ? 'success' : 'warning'}
                                size="small"
                              />
                            </Box>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Coverage Details */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={600}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Coverage Details</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Primary Coverage */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                      Primary Coverage
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'primary.main', color: '#fff' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                              ₹{(caseData.policyDetails.premium * 20).toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle2">
                              Sum Insured
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'success.main' }}>
                              ₹{Math.round(caseData.policyDetails.premium * 0.05).toLocaleString()}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Deductible
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'info.main' }}>
                              100%
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Coverage Ratio
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                              24/7
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Support Coverage
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Coverage Types - Dynamic based on Policy Type */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                      Coverage Types & Limits
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Auto/Vehicle Insurance Coverage */}
                      {caseData.policyDetails.type === 'Auto' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🚗 Vehicle Protection
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Comprehensive Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Own Damage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 15).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Engine Protection:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 8).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Zero Depreciation:</Typography>
                                <Chip label="Included" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                👥 Liability Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Third Party Liability:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹7,50,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Personal Accident (Owner):</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹15,00,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Passenger Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹2,00,000/person</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Legal Liability:</Typography>
                                <Chip label="Unlimited" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}

                      {/* Health Insurance Coverage */}
                      {caseData.policyDetails.type === 'Health' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                ⚕️ Medical Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Individual Sum Insured:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Family Floater:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 25).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Room Rent Limit:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹8,000/day</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">ICU Charges:</Typography>
                                <Chip label="No Limit" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🤱 Special Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Maternity Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹1,50,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">New Born Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹1,00,000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Pre-existing Diseases:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>After 2 Years</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Ambulance Coverage:</Typography>
                                <Chip label="Included" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}

                      {/* Life Insurance Coverage */}
                      {caseData.policyDetails.type === 'Life' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                💰 Life Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Death Benefit:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 100).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Accidental Death:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 200).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Terminal Illness:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 50).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Waiver of Premium:</Typography>
                                <Chip label="Included" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                📈 Investment Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Maturity Benefit:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 80).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Survival Benefits:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 5).toLocaleString()}/year</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Bonus Rate:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹45/₹1000</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Loan Facility:</Typography>
                                <Chip label="Available" size="small" color="info" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}

                      {/* Home Insurance Coverage */}
                      {caseData.policyDetails.type === 'Home' && (
                        <>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🏠 Property Coverage
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Building Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 50).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Contents Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Jewelry & Valuables:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 5).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Electronics:</Typography>
                                <Chip label="Covered" size="small" color="success" />
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                🌪️ Natural Disasters
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Fire & Lightning:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 40).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Earthquake Coverage:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 30).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Flood & Storm:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 25).toLocaleString()}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Temporary Accommodation:</Typography>
                                <Chip label="₹5,000/day" size="small" color="info" />
                              </Box>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>

                  {/* Additional Benefits & Riders - Dynamic based on Policy Type */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                      Additional Benefits & Riders
                    </Typography>
                    <Grid container spacing={2}>
                      {/* Auto Insurance Benefits */}
                      {caseData.policyDetails.type === 'Auto' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🛡️ Enhanced Protection
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="No Claim Bonus: 50%" size="small" />
                                <Chip label="Roadside Assistance" size="small" />
                                <Chip label="Key Replacement" size="small" />
                                <Chip label="Emergency Towing" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🔧 Add-on Covers
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Engine Protection" size="small" />
                                <Chip label="Return to Invoice" size="small" />
                                <Chip label="Consumable Cover" size="small" />
                                <Chip label="Depreciation Cover" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Financial Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Cashless Garages: 4500+" size="small" />
                                <Chip label="Quick Settlement" size="small" />
                                <Chip label="Online Claim Filing" size="small" />
                                <Chip label="Premium Discount: 15%" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}

                      {/* Health Insurance Benefits */}
                      {caseData.policyDetails.type === 'Health' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🏥 Health Add-ons
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Annual Health Check-up" size="small" />
                                <Chip label="Ambulance Coverage" size="small" />
                                <Chip label="Day Care Procedures" size="small" />
                                <Chip label="AYUSH Treatment" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                👨‍⚕️ Wellness Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Telemedicine" size="small" />
                                <Chip label="Second Opinion" size="small" />
                                <Chip label="Health Coaching" size="small" />
                                <Chip label="Mental Health Support" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Financial Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Tax Benefits: 80D" size="small" />
                                <Chip label="Cashless Hospitals: 7000+" size="small" />
                                <Chip label="No Room Rent Capping" size="small" />
                                <Chip label="Family Discount: 10%" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}

                      {/* Life Insurance Benefits */}
                      {caseData.policyDetails.type === 'Life' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💎 Premium Features
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Guaranteed Returns" size="small" />
                                <Chip label="Loyalty Additions" size="small" />
                                <Chip label="Flexible Premium" size="small" />
                                <Chip label="Policy Loan Available" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🛡️ Protection Riders
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Accidental Death Benefit" size="small" />
                                <Chip label="Critical Illness Cover" size="small" />
                                <Chip label="Disability Benefit" size="small" />
                                <Chip label="Waiver of Premium" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Tax & Investment
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Tax Benefits: 80C" size="small" />
                                <Chip label="Tax-free Maturity" size="small" />
                                <Chip label="Wealth Creation" size="small" />
                                <Chip label="Estate Planning" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}

                      {/* Home Insurance Benefits */}
                      {caseData.policyDetails.type === 'Home' && (
                        <>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🏠 Property Protection
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Replacement Cost Cover" size="small" />
                                <Chip label="Debris Removal" size="small" />
                                <Chip label="Architect Fees" size="small" />
                                <Chip label="Loss of Rent" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                🔧 Additional Covers
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="Electrical Equipment" size="small" />
                                <Chip label="Plumbing Repairs" size="small" />
                                <Chip label="Garden & Landscaping" size="small" />
                                <Chip label="Alternative Accommodation" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                💰 Financial Benefits
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Chip label="No Claim Bonus: 20%" size="small" />
                                <Chip label="Cashless Claims" size="small" />
                                <Chip label="24/7 Helpline" size="small" />
                                <Chip label="Multi-policy Discount" size="small" />
                              </Box>
                            </Card>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>

                  {/* Coverage Exclusions - Dynamic based on Policy Type */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'error.main' }}>
                      Important Exclusions
                    </Typography>
                    <Card variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), border: '1px solid', borderColor: 'error.light' }}>
                      <Grid container spacing={2}>
                        {/* Auto Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Auto' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Driving under influence of alcohol/drugs</Typography>
                                <Typography variant="body2" color="text.secondary">• Racing, speed testing, competitions</Typography>
                                <Typography variant="body2" color="text.secondary">• War, terrorism, nuclear risks</Typography>
                                <Typography variant="body2" color="text.secondary">• Consequential losses</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Valid driving license required</Typography>
                                <Typography variant="body2" color="text.secondary">• Immediate reporting of accidents</Typography>
                                <Typography variant="body2" color="text.secondary">• Regular maintenance required</Typography>
                                <Typography variant="body2" color="text.secondary">• Geographical restrictions apply</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}

                        {/* Health Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Health' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Pre-existing conditions (first 2 years)</Typography>
                                <Typography variant="body2" color="text.secondary">• Cosmetic & aesthetic treatments</Typography>
                                <Typography variant="body2" color="text.secondary">• Self-inflicted injuries</Typography>
                                <Typography variant="body2" color="text.secondary">• Experimental treatments</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Waiting period for specific treatments</Typography>
                                <Typography variant="body2" color="text.secondary">• Age-related sub-limits</Typography>
                                <Typography variant="body2" color="text.secondary">• Network hospital restrictions</Typography>
                                <Typography variant="body2" color="text.secondary">• Medical examination may be required</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}

                        {/* Life Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Life' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Suicide within first year</Typography>
                                <Typography variant="body2" color="text.secondary">• Death due to intoxication</Typography>
                                <Typography variant="body2" color="text.secondary">• Death during criminal activity</Typography>
                                <Typography variant="body2" color="text.secondary">• War and nuclear risks</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Premium payment continuity required</Typography>
                                <Typography variant="body2" color="text.secondary">• Medical examination for high sum assured</Typography>
                                <Typography variant="body2" color="text.secondary">• Grace period for premium payment</Typography>
                                <Typography variant="body2" color="text.secondary">• Policy terms and conditions apply</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}

                        {/* Home Insurance Exclusions */}
                        {caseData.policyDetails.type === 'Home' && (
                          <>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                ❌ Not Covered
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• War, terrorism, nuclear risks</Typography>
                                <Typography variant="body2" color="text.secondary">• Intentional damage or negligence</Typography>
                                <Typography variant="body2" color="text.secondary">• Normal wear and tear</Typography>
                                <Typography variant="body2" color="text.secondary">• Unoccupied property (over 30 days)</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                ⚠️ Conditions Apply
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">• Property security measures required</Typography>
                                <Typography variant="body2" color="text.secondary">• Immediate reporting of incidents</Typography>
                                <Typography variant="body2" color="text.secondary">• Regular property maintenance</Typography>
                                <Typography variant="body2" color="text.secondary">• Geographical location restrictions</Typography>
                              </Box>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Card>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Case Flow */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={600}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Case Flow</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Stepper 
                    activeStep={caseData.flowSteps.indexOf(caseData.status)} 
                    alternativeLabel 
                    sx={{
                      '.MuiStepLabel-label': {
                        fontWeight: 500,
                        mt: 1
                      }
                    }}
                  >
                    {caseData.flowSteps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Add Comment */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={700}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Add Comment</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      InputProps={{
                        sx: {
                          borderRadius: 2,
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      disabled={!comment.trim()}
                      onClick={async () => {
                        try {
                          const { updateCase } = await import('../services/api');
                          const newHistory = [
                            {
                              date: new Date().toISOString(),
                              action: 'Comment Added',
                              details: comment,
                              user: 'Current User', // In a real app, this would come from auth context
                              level: 'info'
                            },
                            ...caseData.history
                          ];
                          await updateCase(caseId, { history: newHistory });
                          setCaseData({ ...caseData, history: newHistory });
                          setComment('');
                          setSuccessMessage('Comment added successfully');
                        } catch (err) {
                          setError('Failed to add comment');
                        }
                      }}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                        }
                      }}
                    >
                      Add Comment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Customer Preferences */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={800}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Customer Preferences</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    {/* Communication Preferences */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <ChatIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Communication Preferences
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">Email</Typography>
                            </Box>
                            <Chip 
                              label="Preferred" 
                              size="small" 
                              color="primary" 
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">Phone Call</Typography>
                            </Box>
                            <Chip 
                              label="Backup" 
                              size="small" 
                              variant="outlined" 
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <WhatsAppIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">WhatsApp</Typography>
                            </Box>
                            <Chip 
                              label="Accepted" 
                              size="small" 
                              variant="outlined"
                              color="success" 
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SmsIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">SMS</Typography>
                            </Box>
                            <Chip 
                              label="Preferred" 
                              size="small" 
                              color="primary" 
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SmartToyIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">AI Call</Typography>
                            </Box>
                            <Chip 
                              label="Accepted" 
                              size="small" 
                              variant="outlined"
                              color="info" 
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MailOutlineIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                              <Typography variant="body2">Postal Mail</Typography>
                            </Box>
                            <Chip 
                              label="Opted Out" 
                              size="small" 
                              variant="outlined"
                              color="error" 
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Renewal Timeline Preferences */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Renewal Timeline
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Typical Renewal Pattern:
                              </Typography>
                            </Box>
                            <Box 
                              sx={{ 
                                p: 1.5, 
                                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                color: theme.palette.primary.main, 
                                borderRadius: 2, 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <ArrowCircleUpIcon />
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Pays 7-14 days before due date
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Reminder Schedule:
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Typography variant="body2">• 30 days before due date (Email)</Typography>
                              <Typography variant="body2">• 14 days before due date (Email)</Typography>
                              <Typography variant="body2">• 7 days before due date (Phone)</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Payment Method Preferences */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PaymentsIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Payment Methods
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Primary Payment Method:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
                                <CreditCardIcon color="primary" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  Credit Card
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  **** **** **** 5678 • Expires 06/26
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Alternate Methods Used:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                avatar={<Avatar sx={{ bgcolor: 'transparent !important' }}><AccountBalanceIcon fontSize="small" /></Avatar>}
                                label="Bank Transfer"
                                size="small"
                                sx={{ borderRadius: 5 }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Language Preferences */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LanguageIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Language Preferences
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Preferred Language:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  p: 1.5, 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: alpha(theme.palette.primary.main, 0.2)
                                }}
                              >
                                <span style={{ fontSize: '20px' }}>🇮🇳</span>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    हिन्दी (Hindi)
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Primary communication language
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Alternative Languages:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label="🇬🇧 English"
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 5, fontWeight: 'medium' }}
                              />
                              <Chip 
                                label="🇮🇳 मराठी"
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 5, fontWeight: 'medium' }}
                              />
                            </Box>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Document Language:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label="Hindi & English"
                                size="small"
                                color="primary"
                                sx={{ borderRadius: 5, fontWeight: 'medium' }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Customer Payment Schedule */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={850}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Customer Payment Schedule</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    {/* Upcoming Payments */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <EventIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Upcoming Payments
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {/* Next Payment */}
                          <Box 
                            sx={{ 
                              p: 2, 
                              bgcolor: alpha(theme.palette.success.main, 0.1), 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: alpha(theme.palette.success.main, 0.2)
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                Next Payment Due
                              </Typography>
                              <Chip 
                                label="7 days" 
                                size="small" 
                                color="success"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                              ₹12,500
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due Date: March 15, 2024
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Policy: Health Insurance Premium
                            </Typography>
                          </Box>
                          
                          {/* Subsequent Payments */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  ₹8,750
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Motor Insurance - Apr 20, 2024
                                </Typography>
                              </Box>
                              <Chip 
                                label="43 days" 
                                size="small" 
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  ₹15,200
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Life Insurance - Jun 10, 2024
                                </Typography>
                              </Box>
                              <Chip 
                                label="94 days" 
                                size="small" 
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Payment History & Patterns */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PendingIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            Payment Patterns & History
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {/* Payment Statistics */}
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Payment Statistics (Last 12 Months):
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                    11/12
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    On-time Payments
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                    ₹42,650
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Total Paid
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                          
                          {/* Payment Behavior */}
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Payment Behavior:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Average Payment Timing</Typography>
                                <Chip 
                                  label="5 days early" 
                                  size="small" 
                                  color="success"
                                  variant="outlined"
                                  sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Preferred Payment Method</Typography>
                                <Chip 
                                  label="Auto-debit" 
                                  size="small" 
                                  color="primary"
                                  sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Payment Reliability</Typography>
                                <Chip 
                                  label="Excellent" 
                                  size="small" 
                                  color="success"
                                  sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                />
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Recent Payment Activity */}
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Recent Payment Activity:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                  ₹12,500 - Paid
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Feb 10, 2024 • Health Insurance
                                </Typography>
                              </Box>
                              <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                  ₹8,750 - Paid
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Jan 18, 2024 • Motor Insurance
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Last 10 Years Premium Payment History */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={875}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <HistoryIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                    <Typography variant="h6" fontWeight="600">Last 10 Years Premium Payment History</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    {/* Payment History Table */}
                    <Grid item xs={12}>
                      <Box sx={{ 
                        overflow: 'auto',
                        maxHeight: '500px',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: alpha(theme.palette.secondary.main, 0.1),
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: alpha(theme.palette.secondary.main, 0.3),
                          borderRadius: '4px',
                          '&:hover': {
                            background: alpha(theme.palette.secondary.main, 0.5),
                          }
                        }
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {/* Year 2024 */}
                          <Box sx={{ 
                            p: 3, 
                            bgcolor: alpha(theme.palette.success.main, 0.05), 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.2)
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                2024 (Current Year)
                              </Typography>
                              <Chip 
                                label="₹36,450 Total" 
                                size="small" 
                                color="success"
                                sx={{ fontWeight: 'bold', borderRadius: 5 }} 
                              />
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹12,500 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Feb 10, 2024 • Health Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Auto-debit
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹8,750 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Jan 18, 2024 • Motor Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Online Banking
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹15,200 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Jan 05, 2024 • Life Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: UPI
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Year 2023 */}
                          <Box sx={{ 
                            p: 3, 
                            bgcolor: alpha(theme.palette.primary.main, 0.05), 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.2)
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                2023
                              </Typography>
                              <Chip 
                                label="₹42,650 Total" 
                                size="small" 
                                color="primary"
                                sx={{ fontWeight: 'bold', borderRadius: 5 }} 
                              />
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹12,500 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Dec 15, 2023 • Health Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Auto-debit
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹8,750 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Sep 20, 2023 • Motor Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Credit Card
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹15,200 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Jun 10, 2023 • Life Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Online Banking
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹6,200 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Mar 25, 2023 • Travel Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: UPI
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Year 2022 */}
                          <Box sx={{ 
                            p: 3, 
                            bgcolor: alpha(theme.palette.info.main, 0.05), 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.info.main, 0.2)
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                2022
                              </Typography>
                              <Chip 
                                label="₹38,900 Total" 
                                size="small" 
                                color="info"
                                sx={{ fontWeight: 'bold', borderRadius: 5 }} 
                              />
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹11,800 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Nov 12, 2022 • Health Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Auto-debit
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹8,200 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Aug 15, 2022 • Motor Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Cheque
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                    ₹18,900 - Paid
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    May 20, 2022 • Life Insurance
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                    Mode: Online Banking
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Years 2021-2015 (Collapsed View) */}
                          {[2021, 2020, 2019, 2018, 2017, 2016, 2015].map((year) => (
                            <Box key={year} sx={{ 
                              p: 2, 
                              bgcolor: alpha(theme.palette.grey[500], 0.05), 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: alpha(theme.palette.grey[500], 0.2)
                            }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                  {year}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Chip 
                                    label={`₹${(Math.random() * 20000 + 25000).toFixed(0)} Total`}
                                    size="small" 
                                    variant="outlined"
                                    sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    {Math.floor(Math.random() * 4) + 2} payments
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                                    100% paid
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Payment Summary Statistics */}
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 3, 
                        bgcolor: alpha(theme.palette.warning.main, 0.05), 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.warning.main, 0.2)
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 2 }}>
                          10-Year Payment Summary
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                ₹3,24,850
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Premiums Paid
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                98.5%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                On-time Payment Rate
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                32
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Payments Made
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                                Auto-debit
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Most Used Mode
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Customer Profiling */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={900}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Customer Profiling</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Payment History */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      Payment History
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                              95%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              On-time Payments
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              5 years
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Customer Since
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              Excellent
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Payment Rating
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              ₹4,850
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Paid (YTD)
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Policy Information */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      Policy Information
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              3
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Active Policies
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              2
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Family Policies
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              1
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Expired/Lapsed
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Communication & Claims History */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      Communication & Claims History
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                            Communication History
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Total Communications: 8
                              </Typography>
                            </Box>
                            <Divider />
                            <Box>
                              <Typography variant="body2">
                                • Policy Inquiries: 3
                              </Typography>
                              <Typography variant="body2">
                                • Billing Questions: 2
                              </Typography>
                              <Typography variant="body2">
                                • Coverage Updates: 2
                              </Typography>
                              <Typography variant="body2">
                                • Complaints: 1
                              </Typography>
                            </Box>
                            <Divider />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'info.main' }}>
                                Last Contact: 3 weeks ago (Policy Renewal)
                              </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/communication-details/${caseId}`)}
                                endIcon={<ArrowForwardIcon />}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'medium',
                                  width: '100%'
                                }}
                              >
                                View Detailed Communication History
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                            Claims History
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Total Claims: 2
                              </Typography>
                            </Box>
                            <Divider />
                            <Box>
                              <Typography variant="body2">
                                • Vehicle Accident (2023): ₹3,200
                              </Typography>
                              <Typography variant="body2">
                                • Home Water Damage (2022): ₹1,850
                              </Typography>
                            </Box>
                            <Divider />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                Claim Rating: Low Risk
                              </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/claims-history/${caseId}`)}
                                endIcon={<ArrowForwardIcon />}
                                sx={{ 
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 'medium',
                                  width: '100%'
                                }}
                              >
                                View Detailed Claims History
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Available Offers */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={1000}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalOfferIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Available Offers</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Payment Options */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      Flexible Payment Options
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'primary.light' }}>
                          <CardContent>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                              <Typography variant="h6" color="primary.main" gutterBottom>
                                EMI Payment Plan
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary">
                                Split your premium into easy monthly payments
                              </Typography>
                            </Box>
                            <Box sx={{ p: 1, mb: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • No additional charges
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • Flexible payment schedule
                              </Typography>
                              <Typography variant="body2">
                                • Easy auto-debit option
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                ₹{Math.round(caseData.policyDetails.premium / 12)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none' }}>
                          <CardContent>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                              <Typography variant="h6" gutterBottom>
                                Quarterly Payment
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary">
                                Pay every three months
                              </Typography>
                            </Box>
                            <Box sx={{ p: 1, mb: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • 2% discount on total premium
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • Reduced payment frequency
                              </Typography>
                              <Typography variant="body2">
                                • Scheduled reminders
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                ₹{Math.round((caseData.policyDetails.premium * 0.98) / 4)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none' }}>
                          <CardContent>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                              <Typography variant="h6" gutterBottom>
                                Annual Payment
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary">
                                Pay once and save
                              </Typography>
                            </Box>
                            <Box sx={{ p: 1, mb: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • 5% discount on total premium
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • No hassle of multiple payments
                              </Typography>
                              <Typography variant="body2">
                                • Get it done in one go
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                ₹{Math.round(caseData.policyDetails.premium * 0.95)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'warning.light' }}>
                          <CardContent>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                              <Typography variant="h6" color="warning.main" gutterBottom>
                                Premium Funding
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary">
                                Finance your premium with third-party funding
                              </Typography>
                            </Box>
                            <Box sx={{ p: 1, mb: 2 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • Preserve cash flow & liquidity
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                • Flexible repayment terms
                              </Typography>
                              <Typography variant="body2">
                                • Tax benefits available*
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.main', borderRadius: 1, color: '#000' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Interest from 3.5% p.a.
                              </Typography>
                              <Typography variant="caption">
                                *Terms & conditions apply
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Product Recommendations */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                      Recommended Insurance Products
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { sm: 'center' },
                          gap: 2,
                          boxShadow: 'none',
                          border: '1px solid',
                          borderColor: 'secondary.light'
                        }}>
                          <Avatar sx={{ bgcolor: 'secondary.light', width: 60, height: 60, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                            <DirectionsCarIcon sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              Enhanced Vehicle Protection
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Based on your existing Vehicle policy and claims history, we recommend upgrading to our Enhanced Vehicle Protection plan.
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              <Chip label="Roadside Assistance" size="small" />
                              <Chip label="Rental Coverage" size="small" />
                              <Chip label="Gap Insurance" size="small" />
                            </Box>
                            <Typography variant="body2" color="secondary" sx={{ fontWeight: 'bold' }}>
                              Special offer: 15% discount for multi-policy holders
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { sm: 'center' },
                          gap: 2,
                          boxShadow: 'none'
                        }}>
                          <Avatar sx={{ bgcolor: 'info.light', width: 60, height: 60, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                            <HealthAndSafetyIcon sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              Family Health Insurance
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              With 2 family policies already, complement your coverage with our comprehensive health insurance plan.
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              <Chip label="Preventive Care" size="small" />
                              <Chip label="Hospital Coverage" size="small" />
                              <Chip label="Prescription Benefits" size="small" />
                            </Box>
                            <Typography variant="body2" color="info.main" sx={{ fontWeight: 'bold' }}>
                              Family package: Cover all members at a flat rate
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Card variant="outlined" sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: { xs: 'column', md: 'row' },
                          alignItems: { md: 'center' },
                          gap: 2,
                          boxShadow: 'none',
                          bgcolor: 'success.light',
                          color: 'white'
                        }}>
                          <Avatar sx={{ bgcolor: 'white', color: 'success.main', width: 60, height: 60, alignSelf: { xs: 'center', md: 'flex-start' } }}>
                            <WorkspacePremiumIcon sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              Premium Bundle Discount
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Bundle your Vehicle, Home, and Life policies to receive our maximum discount package.
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                              Save up to 25% on all policies
                            </Typography>
                          </Box>
                          <Button variant="contained" color="secondary">
                            View Bundle Options
                          </Button>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>



          {/* Case History */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} timeout={1200}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '520px',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <HistoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Case History</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box 
                    sx={{ 
                      maxHeight: '400px', 
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#a1a1a1',
                        },
                      },
                    }}
                  >
                    <List>
                      {caseData.history.map((event, index) => (
                        <React.Fragment key={event.date}>
                          {index > 0 && <Divider />}
                          <ListItem>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle2">{event.action}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(event.date).toLocaleString()}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {event.details}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    By: {event.user}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          {/* Journey Summary */}
          <Grid item xs={12} md={6}>
            <Grow in={loaded} timeout={1300}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '520px',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TimelineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Journey Summary</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Case Started
                          </Typography>
                          <Typography variant="body1">
                            {new Date(caseData.uploadDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Current Status
                          </Typography>
                          <Typography variant="body1">
                            <Chip
                              label={caseData.status}
                              color={getStatusColor(caseData.status)}
                              size="small"
                            />
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Handling Agent
                          </Typography>
                          <Typography variant="body1">
                            {caseData.agent || "Unassigned"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Processing Time
                          </Typography>
                          <Typography variant="body1">
                            {Math.ceil((new Date() - new Date(caseData.uploadDate)) / (1000 * 60 * 60 * 24))} days
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Journey Progress
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {caseData.flowSteps.map((step, index) => {
                          const isCompleted = caseData.flowSteps.indexOf(caseData.status) >= index;
                          return (
                            <Box 
                              key={step} 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                opacity: isCompleted ? 1 : 0.5
                              }}
                            >
                              <Box 
                                sx={{ 
                                  width: 24, 
                                  height: 24, 
                                  borderRadius: '50%', 
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  bgcolor: isCompleted ? 'success.main' : 'grey.500',
                                  fontSize: '0.8rem'
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Typography 
                                variant="body2" 
                                sx={{ fontWeight: isCompleted ? 'bold' : 'normal' }}
                              >
                                {step}
                                {step === caseData.status && ' (Current)'}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Outstanding Amounts Section - Consolidated View */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={600}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <MonetizationOnIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                    <Typography variant="h6" fontWeight="600">Outstanding Amounts</Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Summary Section */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="700" color="error.main">
                          ₹{caseData.outstandingAmounts?.reduce((total, amount) => total + amount.amount, 0)?.toLocaleString('en-IN') || '0'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Outstanding
                        </Typography>
                      </Box>
                    </Grid>
                                         <Grid item xs={12} md={3}>
                       <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2 }}>
                         <Typography variant="h4" fontWeight="700" color="warning.main">
                           {caseData.outstandingAmounts?.length || 0}
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                           Pending Installments
                         </Typography>
                       </Box>
                     </Grid>
                     <Grid item xs={12} md={3}>
                       <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                         <Typography variant="h4" fontWeight="700" color="info.main">
                           ₹{caseData.outstandingAmounts?.length > 0 ? 
                             Math.round(caseData.outstandingAmounts.reduce((total, amount) => total + amount.amount, 0) / caseData.outstandingAmounts.length).toLocaleString('en-IN') : '0'}
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                           Average Amount
                         </Typography>
                       </Box>
                     </Grid>
                    <Grid item xs={12} md={3}>
                      <Stack spacing={1}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="error"
                          startIcon={<PaymentsIcon />}
                          sx={{ borderRadius: 2 }}
                          onClick={() => {
                            setSnackbar({
                              open: true,
                              message: 'Payment portal functionality would be implemented here',
                              severity: 'info'
                            });
                          }}
                        >
                          Pay All Outstanding
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="secondary"
                          startIcon={<ScheduleIcon />}
                          sx={{ borderRadius: 2 }}
                          onClick={() => {
                            setSnackbar({
                              open: true,
                              message: 'Payment plan setup functionality would be implemented here',
                              severity: 'info'
                            });
                          }}
                        >
                          Setup Payment Plan
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Outstanding Installments List */}
                  <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ReceiptIcon fontSize="small" sx={{ mr: 1 }} /> Outstanding Installments
                  </Typography>
                  
                  <Box
                    sx={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: alpha(theme.palette.divider, 0.1),
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: alpha(theme.palette.primary.main, 0.3),
                        borderRadius: '4px',
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.5),
                        },
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      {caseData.outstandingAmounts?.map((outstandingAmount, index) => {
                        const daysOverdue = Math.floor((new Date() - new Date(outstandingAmount.dueDate)) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysOverdue > 0;
                        
                        return (
                          <Card 
                            key={index}
                            elevation={0}
                            sx={{ 
                              border: `1px solid ${isOverdue ? theme.palette.error.main : theme.palette.divider}`,
                              borderRadius: 2,
                              bgcolor: isOverdue ? alpha(theme.palette.error.main, 0.02) : 'background.paper',
                              transition: 'all 0.2s ease',
                              minHeight: '100px',
                              '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    PERIOD
                                  </Typography>
                                  <Typography variant="body1" fontWeight="600">
                                    {outstandingAmount.period}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    AMOUNT
                                  </Typography>
                                  <Typography variant="h6" fontWeight="700" color={isOverdue ? 'error.main' : 'primary.main'}>
                                    ₹{outstandingAmount.amount.toLocaleString('en-IN')}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    DUE DATE
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {new Date(outstandingAmount.dueDate).toLocaleDateString('en-IN')}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    STATUS
                                  </Typography>
                                  <Chip 
                                    label={isOverdue ? `${daysOverdue} days overdue` : `Due in ${Math.abs(daysOverdue)} days`}
                                    color={isOverdue ? 'error' : 'warning'}
                                    size="small"
                                    icon={isOverdue ? <WarningIcon /> : <ScheduleIcon />}
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                      startIcon={<PaymentsIcon />}
                                      sx={{ fontSize: '0.75rem' }}
                                      onClick={() => {
                                        setSnackbar({
                                          open: true,
                                          message: `Payment for ${outstandingAmount.period} - ₹${outstandingAmount.amount.toLocaleString('en-IN')}`,
                                          severity: 'info'
                                        });
                                      }}
                                    >
                                      Pay Now
                                    </Button>
                                    <IconButton 
                                      size="small"
                                      onClick={() => {
                                        setSnackbar({
                                          open: true,
                                          message: `Reminder sent for ${outstandingAmount.period}`,
                                          severity: 'success'
                                        });
                                      }}
                                    >
                                      <NotificationsIcon fontSize="small" />
                                    </IconButton>
                                  </Stack>
                                </Grid>
                              </Grid>
                              
                              {outstandingAmount.description && (
                                <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                  <Typography variant="body2" color="text.secondary">
                                    <DescriptionIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                    {outstandingAmount.description}
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        );
                      }) || (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                            <CheckCircleIcon sx={{ fontSize: 32 }} />
                          </Avatar>
                          <Typography variant="h6" fontWeight="600" color="success.main">
                            No Outstanding Amounts
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            All payments are up to date
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
        ) : (
          // Tab-based View
          <Box>
            <TabPanel value={currentTab} index={0}>
              {/* Overview & Policy Tab - Customer Info, Policy Info, Policy Features, Coverage Details */}
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Overview & Policy Details</Typography>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12} md={4}>
                  <Grow in={loaded} timeout={400}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%', 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="600">{caseData.customerName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Customer Details
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                          {/* Email with Verification */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                              <EmailIcon color="primary" />
                              <Typography>{caseData.contactInfo.email}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {verificationStatus.email.verified ? (
                                <Box sx={{ textAlign: 'right' }}>
                                  <Chip 
                                    label="Verified" 
                                    color="success" 
                                    size="small" 
                                    icon={<CheckCircleIcon />}
                                  />
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Verified on {formatVerificationDate(verificationStatus.email.verifiedAt)}
                                  </Typography>
                                </Box>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleVerification('email', caseData.contactInfo.email)}
                                  disabled={verificationStatus.email.verifying}
                                  startIcon={verificationStatus.email.verifying ? <CircularProgress size={16} /> : <VerifiedIcon />}
                                >
                                  {verificationStatus.email.verifying ? 'Verifying...' : 'Verify'}
                                </Button>
                              )}
                            </Box>
                          </Box>

                          {/* Phone with Verification */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                              <PhoneIcon color="primary" />
                              <Typography>{caseData.contactInfo.phone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {verificationStatus.phone.verified ? (
                                <Box sx={{ textAlign: 'right' }}>
                                  <Chip 
                                    label="Verified" 
                                    color="success" 
                                    size="small" 
                                    icon={<CheckCircleIcon />}
                                  />
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Verified on {formatVerificationDate(verificationStatus.phone.verifiedAt)}
                                  </Typography>
                                </Box>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleVerification('phone', caseData.contactInfo.phone)}
                                  disabled={verificationStatus.phone.verifying}
                                  startIcon={verificationStatus.phone.verifying ? <CircularProgress size={16} /> : <VerifiedIcon />}
                                >
                                  {verificationStatus.phone.verifying ? 'Verifying...' : 'Verify'}
                                </Button>
                              )}
                            </Box>
                          </Box>

                          {/* PAN with Verification */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                              <CreditCardIcon color="primary" />
                              <Typography>{caseData.contactInfo.pan}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {verificationStatus.pan.verified ? (
                                <Box sx={{ textAlign: 'right' }}>
                                  <Chip 
                                    label="Verified" 
                                    color="success" 
                                    size="small" 
                                    icon={<CheckCircleIcon />}
                                  />
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Verified on {formatVerificationDate(verificationStatus.pan.verifiedAt)}
                                  </Typography>
                                </Box>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleVerification('pan', caseData.contactInfo.pan)}
                                  disabled={verificationStatus.pan.verifying}
                                  startIcon={verificationStatus.pan.verifying ? <CircularProgress size={16} /> : <VerifiedIcon />}
                                >
                                  {verificationStatus.pan.verifying ? 'Verifying...' : 'Verify'}
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Policy Information */}
                <Grid item xs={12} md={8}>
                  <Grow in={loaded} timeout={500}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%', 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <DescriptionIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Policy Information</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={4}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Stack spacing={2.5}>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                  Policy Number
                                </Typography>
                                <Typography variant="body1" fontWeight="500">{caseData.policyNumber}</Typography>
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                  Policy Type
                                </Typography>
                                <Typography variant="body1" fontWeight="500">{caseData.policyDetails.type}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Stack spacing={2.5}>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                  Premium
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  ₹{caseData.policyDetails.premium.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                  Expiry Date
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  {new Date(caseData.policyDetails.expiryDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Stack spacing={2.5}>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                  Annual Income
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  ₹{(caseData.policyDetails.premium * 8).toLocaleString()}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                  Channel Partner
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  {caseData.policyDetails.type === 'Health' ? 'Corporate Sales - Rajesh Kumar' :
                                   caseData.policyDetails.type === 'Auto' ? 'Agent Network - Priya Sharma' :
                                   caseData.policyDetails.type === 'Life' ? 'Branch Office - Mumbai Central' :
                                   'Online Portal - Direct Sales'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Stack spacing={2.5}>
                              {caseData.policyProposer && (
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                    Policy Proposer
                                  </Typography>
                                  <Typography variant="body1" fontWeight="500">
                                    {caseData.policyProposer.name}
                                  </Typography>
                                </Box>
                              )}
                              {caseData.lifeAssured && (
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                                    Life Assured
                                  </Typography>
                                  <Typography variant="body1" fontWeight="500">
                                    {caseData.lifeAssured.name}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Channel Details */}
                <ChannelDetails caseData={caseData} loaded={loaded} timeout={500} />

                {/* Policy Features */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={550}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <HealthAndSafetyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Policy Features</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={3}>
                          {caseData.policyDetails.type === 'Health' && (
                            <>
                              {/* Health Insurance Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <HealthAndSafetyIcon fontSize="small" sx={{ mr: 1 }} /> Health Insurance (Corporate/Group)
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Sum Insured: ₹1L–₹10L; family floater available.</Typography>
                                  <Typography variant="body2">PED Coverage: Included from Day 1.</Typography>
                                  <Typography variant="body2">Cashless Network: 7000+ hospitals PAN-India.</Typography>
                                  <Typography variant="body2">Maternity: ₹50K–₹1L, includes newborn.</Typography>
                                  <Typography variant="body2">Daycare Surgeries: 500+ procedures covered.</Typography>
                                  <Typography variant="body2">Room Rent: No cap; private AC room eligibility.</Typography>
                                  <Typography variant="body2">AYUSH: Coverage up to ₹25K/year.</Typography>
                                </Stack>
                              </Grid>
                              
                              {/* Wellness Benefits Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <WorkspacePremiumIcon fontSize="small" sx={{ mr: 1 }} /> Wellness Benefits
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Health Checkups: Annual, 35+ parameters.</Typography>
                                  <Typography variant="body2">Doctor at Home: 2 visits/year.</Typography>
                                  <Typography variant="body2">Mental Wellness: Quarterly sessions.</Typography>
                                  <Typography variant="body2">Fitness Access: Subsidized gyms/yoga.</Typography>
                                  <Typography variant="body2">Nutrition Plans: Personalized counseling.</Typography>
                                </Stack>
                              </Grid>
                              
                              {/* Preventive Care Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Preventive Care
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Chronic Condition Support: Diabetes, hypertension, etc.</Typography>
                                  <Typography variant="body2">Digital Health Records: ABDM-compliant.</Typography>
                                  <Typography variant="body2">Teleconsultation: 24x7 access to doctors.</Typography>
                                  <Typography variant="body2">Medicine Delivery: With discounts.</Typography>
                                  <Typography variant="body2">Lab Tests: 15–30% discounted diagnostics.</Typography>
                                </Stack>
                              </Grid>
                              
                              {/* OPD, Dental & Vision Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> OPD, Dental & Vision
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">OPD Cover: ₹2.5K–₹15K annually.</Typography>
                                  <Typography variant="body2">Dental: Annual cleaning & basic procedures.</Typography>
                                  <Typography variant="body2">Vision: Eye check + spectacles up to ₹2K.</Typography>
                                  <Typography variant="body2">Vaccinations: Flu, COVID, travel vaccines included.</Typography>
                                </Stack>
                              </Grid>
                              
                              {/* Value-Added Services Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} /> Value-Added Services
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Second Opinions: Global/National access.</Typography>
                                  <Typography variant="body2">Claims Helpdesk: Virtual & onsite support.</Typography>
                                  <Typography variant="body2">Health Risk Assessments: With scoring.</Typography>
                                  <Typography variant="body2">Emergency Ambulance: Up to ₹2K per case.</Typography>
                                </Stack>
                              </Grid>
                            </>
                          )}
                          
                          {caseData.policyDetails.type === 'Auto' && (
                            <>
                              {/* Auto Insurance Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} /> Vehicle Insurance
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Comprehensive Coverage: Own damage + third-party liability.</Typography>
                                  <Typography variant="body2">Zero Depreciation: Full claim without depreciation deduction.</Typography>
                                  <Typography variant="body2">Roadside Assistance: 24x7 emergency support.</Typography>
                                  <Typography variant="body2">NCB Protection: No claims bonus safeguard.</Typography>
                                  <Typography variant="body2">Engine Protection: Coverage for hydrostatic lock damage.</Typography>
                                </Stack>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Additional Benefits
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Key Replacement: Coverage for lost or damaged keys.</Typography>
                                  <Typography variant="body2">Return to Invoice: Full invoice value in case of total loss.</Typography>
                                  <Typography variant="body2">Personal Accident Cover: ₹15 lakh for owner-driver.</Typography>
                                  <Typography variant="body2">Passenger Cover: ₹1 lakh per passenger.</Typography>
                                  <Typography variant="body2">Consumables Cover: For oils, lubricants, etc.</Typography>
                                </Stack>
                              </Grid>
                            </>
                          )}
                          
                          {caseData.policyDetails.type === 'Life' && (
                            <>
                              {/* Life Insurance Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <WorkspacePremiumIcon fontSize="small" sx={{ mr: 1 }} /> Life Insurance
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Term Coverage: Up to ₹2 Crore sum assured.</Typography>
                                  <Typography variant="body2">Critical Illness: Coverage for 36 critical conditions.</Typography>
                                  <Typography variant="body2">Accidental Death: Double sum assured payout.</Typography>
                                  <Typography variant="body2">Premium Waiver: On disability or critical illness.</Typography>
                                  <Typography variant="body2">Tax Benefits: Under Section 80C and 10(10D).</Typography>
                                </Stack>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} /> Investment Benefits
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Guaranteed Returns: 5-6% annual guaranteed returns.</Typography>
                                  <Typography variant="body2">Maturity Benefits: Lump sum payment at policy maturity.</Typography>
                                  <Typography variant="body2">Loyalty Additions: Extra bonus for long-term policyholders.</Typography>
                                  <Typography variant="body2">Partial Withdrawals: Available after lock-in period.</Typography>
                                  <Typography variant="body2">Loan Facility: Up to 80% of surrender value.</Typography>
                                </Stack>
                              </Grid>
                            </>
                          )}
                          
                          {caseData.policyDetails.type === 'Home' && (
                            <>
                              {/* Home Insurance Section */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <HomeIcon fontSize="small" sx={{ mr: 1 }} /> Home Insurance
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Structure Coverage: Up to ₹5 Crore building value.</Typography>
                                  <Typography variant="body2">Contents Protection: Furniture, appliances, valuables.</Typography>
                                  <Typography variant="body2">Natural Disasters: Flood, earthquake, storm damage.</Typography>
                                  <Typography variant="body2">Burglary & Theft: Coverage for stolen possessions.</Typography>
                                  <Typography variant="body2">Temporary Accommodation: If home becomes uninhabitable.</Typography>
                                </Stack>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                  <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} /> Additional Protections
                                </Typography>
                                <Stack spacing={1.5} sx={{ ml: 1 }}>
                                  <Typography variant="body2">Liability Coverage: For third-party injuries on property.</Typography>
                                  <Typography variant="body2">Electrical Equipment: Protection against short circuits.</Typography>
                                  <Typography variant="body2">Rent Loss Cover: Compensation for lost rental income.</Typography>
                                  <Typography variant="body2">Renovation Coverage: Protection during home improvements.</Typography>
                                  <Typography variant="body2">Jewelry & Valuables: Special coverage for high-value items.</Typography>
                                </Stack>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Other Policies */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={575}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <WorkspacePremiumIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Other Policies</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                          {(
                            caseData.otherPolicies || [
                              { id: 'POL-2024-001', type: 'Term Life', premium: '15,000', status: 'Active', expiryDate: '2026-03-15', coverage: '50,00,000' },
                              { id: 'POL-2023-045', type: 'Personal Accident', premium: '3,500', status: 'Active', expiryDate: '2025-12-31', coverage: '25,00,000' },
                              { id: 'POL-2023-089', type: 'Critical Illness', premium: '8,000', status: 'Pending Renewal', expiryDate: '2025-11-30', coverage: '15,00,000' }
                            ]
                          ).map((policy) => (
                            <Grid item xs={12} md={4} key={policy.id}>
                              <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), p: 2, borderRadius: 2 }}>
                                <Stack spacing={1}>
                                  <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>Policy ID: {policy.id}</Typography>
                                  <Typography variant="h6">{policy.type}</Typography>
                                  <Divider />
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Premium (₹/yr)</Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{policy.premium}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Coverage (₹)</Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{policy.coverage}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Expiry Date</Typography>
                                    <Typography variant="subtitle1">{policy.expiryDate}</Typography>
                                  </Box>
                                  <Box sx={{ mt: 1 }}>
                                    <Chip label={policy.status} color={policy.status === 'Active' ? 'success' : 'warning'} size="small" />
                                  </Box>
                                </Stack>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Coverage Details */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={600}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Coverage Details</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        {/* Primary Coverage */}
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                            Primary Coverage
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'primary.main', color: '#fff' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    ₹{(caseData.policyDetails.premium * 20).toLocaleString()}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    Sum Insured
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'success.main' }}>
                                    ₹{Math.round(caseData.policyDetails.premium * 0.05).toLocaleString()}
                                  </Typography>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Deductible
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'info.main' }}>
                                    100%
                                  </Typography>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Coverage Ratio
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                    24/7
                                  </Typography>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Support Coverage
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Coverage Types - Dynamic based on Policy Type */}
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                            Coverage Types & Limits
                          </Typography>
                          <Grid container spacing={2}>
                            {/* Auto/Vehicle Insurance Coverage */}
                            {caseData.policyDetails.type === 'Auto' && (
                              <>
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      🚗 Vehicle Protection
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Comprehensive Coverage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Own Damage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 15).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Engine Protection:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 8).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">Zero Depreciation:</Typography>
                                      <Chip label="Included" size="small" color="success" />
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      👥 Liability Coverage
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Third Party Liability:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹7,50,000</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Personal Accident (Owner):</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹15,00,000</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Passenger Coverage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹2,00,000/person</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">Legal Liability:</Typography>
                                      <Chip label="Unlimited" size="small" color="success" />
                                    </Box>
                                  </Box>
                                </Grid>
                              </>
                            )}

                            {/* Health Insurance Coverage */}
                            {caseData.policyDetails.type === 'Health' && (
                              <>
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      ⚕️ Medical Coverage
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Individual Sum Insured:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Family Floater:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 25).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Room Rent Limit:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹8,000/day</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">ICU Charges:</Typography>
                                      <Chip label="No Limit" size="small" color="success" />
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      🤱 Special Benefits
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Maternity Coverage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹1,50,000</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">New Born Coverage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹1,00,000</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Pre-existing Diseases:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>After 2 Years</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">Ambulance Coverage:</Typography>
                                      <Chip label="Included" size="small" color="success" />
                                    </Box>
                                  </Box>
                                </Grid>
                              </>
                            )}

                            {/* Life Insurance Coverage */}
                            {caseData.policyDetails.type === 'Life' && (
                              <>
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      💰 Life Coverage
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Death Benefit:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 100).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Accidental Death:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 200).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Terminal Illness:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 50).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">Waiver of Premium:</Typography>
                                      <Chip label="Included" size="small" color="success" />
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      📈 Investment Benefits
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Maturity Benefit:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 80).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Survival Benefits:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 5).toLocaleString()}/year</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Bonus Rate:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹45/₹1000</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">Loan Facility:</Typography>
                                      <Chip label="Available" size="small" color="info" />
                                    </Box>
                                  </Box>
                                </Grid>
                              </>
                            )}

                            {/* Home Insurance Coverage */}
                            {caseData.policyDetails.type === 'Home' && (
                              <>
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      🏠 Property Coverage
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Building Coverage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 50).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Contents Coverage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 20).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Jewelry & Valuables:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 5).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">Electronics:</Typography>
                                      <Chip label="Covered" size="small" color="success" />
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                                      🌪️ Natural Disasters
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Fire & Lightning:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 40).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Earthquake Coverage:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 30).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2" color="text.secondary">Flood & Storm:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>₹{(caseData.policyDetails.premium * 25).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" color="text.secondary">Temporary Accommodation:</Typography>
                                      <Chip label="₹5,000/day" size="small" color="info" />
                                    </Box>
                                  </Box>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Box>

                        {/* Additional Benefits & Riders - Dynamic based on Policy Type */}
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'primary.main' }}>
                            Additional Benefits & Riders
                          </Typography>
                          <Grid container spacing={2}>
                            {/* Auto Insurance Benefits */}
                            {caseData.policyDetails.type === 'Auto' && (
                              <>
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      🛡️ Enhanced Protection
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="No Claim Bonus: 50%" size="small" />
                                      <Chip label="Roadside Assistance" size="small" />
                                      <Chip label="Key Replacement" size="small" />
                                      <Chip label="Emergency Towing" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      🔧 Add-on Covers
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Engine Protection" size="small" />
                                      <Chip label="Return to Invoice" size="small" />
                                      <Chip label="Consumable Cover" size="small" />
                                      <Chip label="Depreciation Cover" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      💰 Financial Benefits
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Cashless Garages: 4500+" size="small" />
                                      <Chip label="Quick Settlement" size="small" />
                                      <Chip label="Online Claim Filing" size="small" />
                                      <Chip label="Premium Discount: 15%" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                              </>
                            )}

                            {/* Health Insurance Benefits */}
                            {caseData.policyDetails.type === 'Health' && (
                              <>
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      🏥 Health Add-ons
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Annual Health Check-up" size="small" />
                                      <Chip label="Ambulance Coverage" size="small" />
                                      <Chip label="Day Care Procedures" size="small" />
                                      <Chip label="AYUSH Treatment" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      👨‍⚕️ Wellness Benefits
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Telemedicine" size="small" />
                                      <Chip label="Second Opinion" size="small" />
                                      <Chip label="Health Coaching" size="small" />
                                      <Chip label="Mental Health Support" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      💰 Financial Benefits
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Tax Benefits: 80D" size="small" />
                                      <Chip label="Cashless Hospitals: 7000+" size="small" />
                                      <Chip label="No Room Rent Capping" size="small" />
                                      <Chip label="Family Discount: 10%" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                              </>
                            )}

                            {/* Life Insurance Benefits */}
                            {caseData.policyDetails.type === 'Life' && (
                              <>
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      💎 Premium Features
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Guaranteed Returns" size="small" />
                                      <Chip label="Loyalty Additions" size="small" />
                                      <Chip label="Flexible Premium" size="small" />
                                      <Chip label="Policy Loan Available" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      🛡️ Protection Riders
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Accidental Death Benefit" size="small" />
                                      <Chip label="Critical Illness Cover" size="small" />
                                      <Chip label="Disability Benefit" size="small" />
                                      <Chip label="Waiver of Premium" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      💰 Tax & Investment
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Tax Benefits: 80C" size="small" />
                                      <Chip label="Tax-free Maturity" size="small" />
                                      <Chip label="Wealth Creation" size="small" />
                                      <Chip label="Estate Planning" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                              </>
                            )}

                            {/* Home Insurance Benefits */}
                            {caseData.policyDetails.type === 'Home' && (
                              <>
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      🏠 Property Protection
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Replacement Cost Cover" size="small" />
                                      <Chip label="Debris Removal" size="small" />
                                      <Chip label="Architect Fees" size="small" />
                                      <Chip label="Loss of Rent" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      🔧 Additional Covers
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="Electrical Equipment" size="small" />
                                      <Chip label="Plumbing Repairs" size="small" />
                                      <Chip label="Garden & Landscaping" size="small" />
                                      <Chip label="Alternative Accommodation" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: '#000' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                      💰 Financial Benefits
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      <Chip label="No Claim Bonus: 20%" size="small" />
                                      <Chip label="Cashless Claims" size="small" />
                                      <Chip label="24/7 Helpline" size="small" />
                                      <Chip label="Multi-policy Discount" size="small" />
                                    </Box>
                                  </Card>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Box>

                        {/* Coverage Exclusions - Dynamic based on Policy Type */}
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: 'error.main' }}>
                            Important Exclusions
                          </Typography>
                          <Card variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), border: '1px solid', borderColor: 'error.light' }}>
                            <Grid container spacing={2}>
                              {/* Auto Insurance Exclusions */}
                              {caseData.policyDetails.type === 'Auto' && (
                                <>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                      ❌ Not Covered
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• Driving under influence of alcohol/drugs</Typography>
                                      <Typography variant="body2" color="text.secondary">• Racing, speed testing, competitions</Typography>
                                      <Typography variant="body2" color="text.secondary">• War, terrorism, nuclear risks</Typography>
                                      <Typography variant="body2" color="text.secondary">• Consequential losses</Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                      ⚠️ Conditions Apply
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• Valid driving license required</Typography>
                                      <Typography variant="body2" color="text.secondary">• Immediate reporting of accidents</Typography>
                                      <Typography variant="body2" color="text.secondary">• Regular maintenance required</Typography>
                                      <Typography variant="body2" color="text.secondary">• Geographical restrictions apply</Typography>
                                    </Box>
                                  </Grid>
                                </>
                              )}

                              {/* Health Insurance Exclusions */}
                              {caseData.policyDetails.type === 'Health' && (
                                <>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                      ❌ Not Covered
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• Pre-existing conditions (first 2 years)</Typography>
                                      <Typography variant="body2" color="text.secondary">• Cosmetic & aesthetic treatments</Typography>
                                      <Typography variant="body2" color="text.secondary">• Self-inflicted injuries</Typography>
                                      <Typography variant="body2" color="text.secondary">• Experimental treatments</Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                      ⚠️ Conditions Apply
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• Waiting period for specific treatments</Typography>
                                      <Typography variant="body2" color="text.secondary">• Age-related sub-limits</Typography>
                                      <Typography variant="body2" color="text.secondary">• Network hospital restrictions</Typography>
                                      <Typography variant="body2" color="text.secondary">• Medical examination may be required</Typography>
                                    </Box>
                                  </Grid>
                                </>
                              )}

                              {/* Life Insurance Exclusions */}
                              {caseData.policyDetails.type === 'Life' && (
                                <>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                      ❌ Not Covered
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• Suicide within first year</Typography>
                                      <Typography variant="body2" color="text.secondary">• Death due to intoxication</Typography>
                                      <Typography variant="body2" color="text.secondary">• Death during criminal activity</Typography>
                                      <Typography variant="body2" color="text.secondary">• War and nuclear risks</Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                      ⚠️ Conditions Apply
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• Premium payment continuity required</Typography>
                                      <Typography variant="body2" color="text.secondary">• Medical examination for high sum assured</Typography>
                                      <Typography variant="body2" color="text.secondary">• Grace period for premium payment</Typography>
                                      <Typography variant="body2" color="text.secondary">• Policy terms and conditions apply</Typography>
                                    </Box>
                                  </Grid>
                                </>
                              )}

                              {/* Home Insurance Exclusions */}
                              {caseData.policyDetails.type === 'Home' && (
                                <>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'error.main' }}>
                                      ❌ Not Covered
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• War, terrorism, nuclear risks</Typography>
                                      <Typography variant="body2" color="text.secondary">• Intentional damage or negligence</Typography>
                                      <Typography variant="body2" color="text.secondary">• Normal wear and tear</Typography>
                                      <Typography variant="body2" color="text.secondary">• Unoccupied property (over 30 days)</Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
                                      ⚠️ Conditions Apply
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary">• Property security measures required</Typography>
                                      <Typography variant="body2" color="text.secondary">• Immediate reporting of incidents</Typography>
                                      <Typography variant="body2" color="text.secondary">• Regular property maintenance</Typography>
                                      <Typography variant="body2" color="text.secondary">• Geographical location restrictions</Typography>
                                    </Box>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </Card>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </TabPanel>



            {/* Tab 2: Policy Members */}
            <TabPanel value={currentTab} index={1}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Policy Members</Typography>
              {caseData.policyDetails.type === 'Health' && caseData.policyMembers ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grow in={loaded} timeout={575}>
                      <Card 
                        elevation={0}
                        sx={{ 
                          borderRadius: 3,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                          overflow: 'visible',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="h6" fontWeight="600">Policy Members Details</Typography>
                            <Chip 
                              label={`${caseData.policyMembers.length} Members`} 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          <Divider sx={{ mb: 3 }} />
                          
                          <Grid container spacing={3}>
                            {caseData.policyMembers.map((member, index) => (
                              <Grid item xs={12} md={6} lg={4} key={member.id}>
                                <Zoom in={loaded} timeout={600 + (index * 100)}>
                                  <Card 
                                    variant="outlined" 
                                    sx={{ 
                                      height: '100%',
                                      borderRadius: 2,
                                      border: '2px solid',
                                      borderColor: member.relationship === 'Self' ? 'primary.main' : 'divider',
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                      }
                                    }}
                                  >
                                    <CardContent sx={{ p: 2.5 }}>
                                      {/* Member Header */}
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar 
                                          sx={{ 
                                            bgcolor: member.relationship === 'Self' ? 'primary.main' : 'secondary.main',
                                            width: 48,
                                            height: 48,
                                            mr: 2,
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold'
                                          }}
                                        >
                                          {member.name.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                          <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                                            {member.name}
                                          </Typography>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip 
                                              label={member.relationship} 
                                              size="small" 
                                              color={member.relationship === 'Self' ? 'primary' : 'default'}
                                              sx={{ fontSize: '0.75rem' }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                              {member.age} years
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Box>

                                      {/* Member Details */}
                                      <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Date of Birth:
                                          </Typography>
                                          <Typography variant="body2" fontWeight="500">
                                            {new Date(member.dateOfBirth).toLocaleDateString('en-IN')}
                                          </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Gender:
                                          </Typography>
                                          <Typography variant="body2" fontWeight="500">
                                            {member.gender}
                                          </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Sum Insured:
                                          </Typography>
                                          <Typography variant="body2" fontWeight="600" color="primary.main">
                                            {member.sumInsured}
                                          </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Typography variant="body2" color="text.secondary">
                                            Premium Share:
                                          </Typography>
                                          <Typography variant="body2" fontWeight="500" color="success.main">
                                            {member.premiumContribution}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    </CardContent>
                                  </Card>
                                </Zoom>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  Policy member details are only available for Health Insurance policies.
                </Alert>
              )}
            </TabPanel>

            {/* Tab 3: Preferences */}
            <TabPanel value={currentTab} index={2}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Customer Preferences</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={800}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Customer Preferences</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={3}>
                          {/* Communication Preferences */}
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ChatIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  Communication Preferences
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <EmailIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">Email</Typography>
                                  </Box>
                                  <Chip 
                                    label="Preferred" 
                                    size="small" 
                                    color="primary" 
                                    sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                  />
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">Phone Call</Typography>
                                  </Box>
                                  <Chip 
                                    label="Backup" 
                                    size="small" 
                                    variant="outlined" 
                                    sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                  />
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <WhatsAppIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">WhatsApp</Typography>
                                  </Box>
                                  <Chip 
                                    label="Accepted" 
                                    size="small" 
                                    variant="outlined"
                                    color="success" 
                                    sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                  />
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SmsIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">SMS</Typography>
                                  </Box>
                                  <Chip 
                                    label="Preferred" 
                                    size="small" 
                                    color="primary" 
                                    sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                  />
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SmartToyIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">AI Call</Typography>
                                  </Box>
                                  <Chip 
                                    label="Accepted" 
                                    size="small" 
                                    variant="outlined"
                                    color="info" 
                                    sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                  />
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MailOutlineIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2">Postal Mail</Typography>
                                  </Box>
                                  <Chip 
                                    label="Opted Out" 
                                    size="small" 
                                    variant="outlined"
                                    color="error" 
                                    sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                          
                          {/* Renewal Timeline Preferences */}
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  Renewal Timeline
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ mb: 2 }}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Typical Renewal Pattern:
                                    </Typography>
                                  </Box>
                                  <Box 
                                    sx={{ 
                                      p: 1.5, 
                                      bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                      color: theme.palette.primary.main, 
                                      borderRadius: 2, 
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1
                                    }}
                                  >
                                    <ArrowCircleUpIcon />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                      Pays 7-14 days before due date
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Reminder Schedule:
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2">• 30 days before due date (Email)</Typography>
                                    <Typography variant="body2">• 14 days before due date (Email)</Typography>
                                    <Typography variant="body2">• 7 days before due date (Phone)</Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                          
                          {/* Payment Method Preferences */}
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PaymentsIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  Payment Methods
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Primary Payment Method:
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
                                      <CreditCardIcon color="primary" />
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        Credit Card
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        **** **** **** 5678 • Expires 06/26
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                                
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Alternate Methods Used:
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip 
                                      avatar={<Avatar sx={{ bgcolor: 'transparent !important' }}><AccountBalanceIcon fontSize="small" /></Avatar>}
                                      label="Bank Transfer"
                                      size="small"
                                      sx={{ borderRadius: 5 }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                          
                          {/* Language Preferences */}
                          <Grid item xs={12} md={3}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LanguageIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  Language Preferences
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Preferred Language:
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        p: 1.5, 
                                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.primary.main, 0.2)
                                      }}
                                    >
                                      <span style={{ fontSize: '20px' }}>🇮🇳</span>
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                          हिन्दी (Hindi)
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Primary communication language
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                                
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Alternative Languages:
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip 
                                      label="🇬🇧 English"
                                      size="small"
                                      variant="outlined"
                                      sx={{ borderRadius: 5, fontWeight: 'medium' }}
                                    />
                                    <Chip 
                                      label="🇮🇳 मराठी"
                                      size="small"
                                      variant="outlined"
                                      sx={{ borderRadius: 5, fontWeight: 'medium' }}
                                    />
                                  </Box>
                                </Box>
                                
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Document Language:
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip 
                                      label="Hindi & English"
                                      size="small"
                                      color="primary"
                                      sx={{ borderRadius: 5, fontWeight: 'medium' }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 3: Insights */}
            <TabPanel value={currentTab} index={3}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Customer Insights</Typography>
              <Grid container spacing={3}>
                {/* Customer Payment Schedule */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={850}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Customer Payment Schedule</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={3}>
                          {/* Upcoming Payments */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <EventIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  Upcoming Payments
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Next Payment */}
                                <Box 
                                  sx={{ 
                                    p: 2, 
                                    bgcolor: alpha(theme.palette.success.main, 0.1), 
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.success.main, 0.2)
                                  }}
                                >
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                      Next Payment Due
                                    </Typography>
                                    <Chip 
                                      label="7 days" 
                                      size="small" 
                                      color="success"
                                      sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                    />
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    ₹12,500
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Due Date: March 15, 2024
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Policy: Health Insurance Premium
                                  </Typography>
                                </Box>
                                
                                {/* Subsequent Payments */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        ₹8,750
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Motor Insurance - Apr 20, 2024
                                      </Typography>
                                    </Box>
                                    <Chip 
                                      label="43 days" 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                    />
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        ₹15,200
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Life Insurance - Jun 10, 2024
                                      </Typography>
                                    </Box>
                                    <Chip 
                                      label="94 days" 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                          
                          {/* Payment History & Patterns */}
                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PendingIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  Payment Patterns & History
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Payment Statistics */}
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Payment Statistics (Last 12 Months):
                                  </Typography>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                          11/12
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          On-time Payments
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                          ₹42,650
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Total Paid
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                                
                                {/* Payment Behavior */}
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Payment Behavior:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <Typography variant="body2">Average Payment Timing</Typography>
                                      <Chip 
                                        label="5 days early" 
                                        size="small" 
                                        color="success"
                                        variant="outlined"
                                        sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                      />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <Typography variant="body2">Preferred Payment Method</Typography>
                                      <Chip 
                                        label="Auto-debit" 
                                        size="small" 
                                        color="primary"
                                        sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                      />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <Typography variant="body2">Payment Reliability</Typography>
                                      <Chip 
                                        label="Excellent" 
                                        size="small" 
                                        color="success"
                                        sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                                
                                {/* Recent Payment Activity */}
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Recent Payment Activity:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                        ₹12,500 - Paid
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Feb 10, 2024 • Health Insurance
                                      </Typography>
                                    </Box>
                                    <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                        ₹8,750 - Paid
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Jan 18, 2024 • Motor Insurance
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Last 10 Years Premium Payment History */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={875}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <HistoryIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                          <Typography variant="h6" fontWeight="600">Last 10 Years Premium Payment History</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Grid container spacing={3}>
                          {/* Payment History Table */}
                          <Grid item xs={12}>
                            <Box sx={{ 
                              overflow: 'auto',
                              maxHeight: '500px',
                              '&::-webkit-scrollbar': {
                                width: '8px',
                              },
                              '&::-webkit-scrollbar-track': {
                                background: alpha(theme.palette.secondary.main, 0.1),
                                borderRadius: '4px',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: alpha(theme.palette.secondary.main, 0.3),
                                borderRadius: '4px',
                                '&:hover': {
                                  background: alpha(theme.palette.secondary.main, 0.5),
                                }
                              }
                            }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Year 2024 */}
                                <Box sx={{ 
                                  p: 3, 
                                  bgcolor: alpha(theme.palette.success.main, 0.05), 
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: alpha(theme.palette.success.main, 0.2)
                                }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                      2024 (Current Year)
                                    </Typography>
                                    <Chip 
                                      label="₹36,450 Total" 
                                      size="small" 
                                      color="success"
                                      sx={{ fontWeight: 'bold', borderRadius: 5 }} 
                                    />
                                  </Box>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹12,500 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Feb 10, 2024 • Health Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Auto-debit
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹8,750 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Jan 18, 2024 • Motor Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Online Banking
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹15,200 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Jan 05, 2024 • Life Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: UPI
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>

                                {/* Year 2023 */}
                                <Box sx={{ 
                                  p: 3, 
                                  bgcolor: alpha(theme.palette.primary.main, 0.05), 
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: alpha(theme.palette.primary.main, 0.2)
                                }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                      2023
                                    </Typography>
                                    <Chip 
                                      label="₹42,650 Total" 
                                      size="small" 
                                      color="primary"
                                      sx={{ fontWeight: 'bold', borderRadius: 5 }} 
                                    />
                                  </Box>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹12,500 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Dec 15, 2023 • Health Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Auto-debit
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹8,750 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Sep 20, 2023 • Motor Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Credit Card
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹15,200 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Jun 10, 2023 • Life Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Online Banking
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹6,200 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Mar 25, 2023 • Travel Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: UPI
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>

                                {/* Year 2022 */}
                                <Box sx={{ 
                                  p: 3, 
                                  bgcolor: alpha(theme.palette.info.main, 0.05), 
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: alpha(theme.palette.info.main, 0.2)
                                }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                      2022
                                    </Typography>
                                    <Chip 
                                      label="₹38,900 Total" 
                                      size="small" 
                                      color="info"
                                      sx={{ fontWeight: 'bold', borderRadius: 5 }} 
                                    />
                                  </Box>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹11,800 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Nov 12, 2022 • Health Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Auto-debit
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹8,200 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Aug 15, 2022 • Motor Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Cheque
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                          ₹18,900 - Paid
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          May 20, 2022 • Life Insurance
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', color: 'primary.main' }}>
                                          Mode: Online Banking
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>

                                {/* Years 2021-2015 (Collapsed View) */}
                                {[2021, 2020, 2019, 2018, 2017, 2016, 2015].map((year) => (
                                  <Box key={year} sx={{ 
                                    p: 2, 
                                    bgcolor: alpha(theme.palette.grey[500], 0.05), 
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.grey[500], 0.2)
                                  }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                        {year}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip 
                                          label={`₹${(Math.random() * 20000 + 25000).toFixed(0)} Total`}
                                          size="small" 
                                          variant="outlined"
                                          sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                          {Math.floor(Math.random() * 4) + 2} payments
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                                          100% paid
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Grid>

                          {/* Payment Summary Statistics */}
                          <Grid item xs={12}>
                            <Box sx={{ 
                              p: 3, 
                              bgcolor: alpha(theme.palette.warning.main, 0.05), 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: alpha(theme.palette.warning.main, 0.2)
                            }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 2 }}>
                                10-Year Payment Summary
                              </Typography>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                      ₹3,24,850
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Total Premiums Paid
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                      98.5%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      On-time Payment Rate
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                      32
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Total Payments Made
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                                      Auto-debit
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Most Used Mode
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Customer Profiling */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={900}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Customer Profiling</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        {/* Payment History */}
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            Payment History
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                    95%
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    On-time Payments
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    5 years
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Customer Since
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                    Excellent
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Payment Rating
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    ₹4,850
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Total Paid (YTD)
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>

                        {/* Policy Information */}
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            Policy Information
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    3
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Active Policies
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    2
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Family Policies
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    1
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Expired/Lapsed
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>

                        {/* Communication & Claims History */}
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            Communication & Claims History
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                  Communication History
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                      Total Communications: 8
                                    </Typography>
                                  </Box>
                                  <Divider />
                                  <Box>
                                    <Typography variant="body2">
                                      • Policy Inquiries: 3
                                    </Typography>
                                    <Typography variant="body2">
                                      • Billing Questions: 2
                                    </Typography>
                                    <Typography variant="body2">
                                      • Coverage Updates: 2
                                    </Typography>
                                    <Typography variant="body2">
                                      • Complaints: 1
                                    </Typography>
                                  </Box>
                                  <Divider />
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'info.main' }}>
                                      Last Contact: 3 weeks ago (Policy Renewal)
                                    </Typography>
                                  </Box>
                                  <Divider />
                                  <Box sx={{ mt: 2 }}>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => navigate(`/communication-details/${caseId}`)}
                                      endIcon={<ArrowForwardIcon />}
                                      sx={{ 
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'medium',
                                        width: '100%'
                                      }}
                                    >
                                      View Detailed Communication History
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: '100%' }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                  Claims History
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                      Total Claims: 2
                                    </Typography>
                                  </Box>
                                  <Divider />
                                  <Box>
                                    <Typography variant="body2">
                                      • Vehicle Accident (2023): ₹3,200
                                    </Typography>
                                    <Typography variant="body2">
                                      • Home Water Damage (2022): ₹1,850
                                    </Typography>
                                  </Box>
                                  <Divider />
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                      Claim Rating: Low Risk
                                    </Typography>
                                  </Box>
                                  <Divider />
                                  <Box sx={{ mt: 2 }}>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => navigate(`/claims-history/${caseId}`)}
                                      endIcon={<ArrowForwardIcon />}
                                      sx={{ 
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 'medium',
                                        width: '100%'
                                      }}
                                    >
                                      View Detailed Claims History
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 4: Analytics */}
            <TabPanel value={currentTab} index={4}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Analytics</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={900}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        minHeight: '500px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        {/* Animated Background Elements */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            animation: 'float 3s ease-in-out infinite',
                            '@keyframes float': {
                              '0%, 100%': { transform: 'translateY(0px)' },
                              '50%': { transform: 'translateY(-20px)' }
                            }
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 30,
                            left: 30,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            animation: 'float 4s ease-in-out infinite reverse',
                            '@keyframes float': {
                              '0%, 100%': { transform: 'translateY(0px)' },
                              '50%': { transform: 'translateY(-20px)' }
                            }
                          }}
                        />
                        
                        {/* Main Content */}
                        <Box sx={{ mt: 4, mb: 3 }}>
                          {/* Animated People Building */}
                          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2 }}>
                            {/* Person 1 - Architect/Designer */}
                            <Box
                              sx={{
                                fontSize: '50px',
                                animation: 'work1 3s ease-in-out infinite',
                                '@keyframes work1': {
                                  '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                                  '25%': { transform: 'translateY(-5px) rotate(-5deg)' },
                                  '50%': { transform: 'translateY(0) rotate(0deg)' },
                                  '75%': { transform: 'translateY(-3px) rotate(3deg)' }
                                }
                              }}
                            >
                              👷‍♂️
                            </Box>
                            
                            {/* Building/Construction */}
                            <Box
                              sx={{
                                fontSize: '60px',
                                animation: 'building 4s ease-in-out infinite',
                                '@keyframes building': {
                                  '0%': { transform: 'scale(0.8)' },
                                  '25%': { transform: 'scale(0.9)' },
                                  '50%': { transform: 'scale(1)' },
                                  '75%': { transform: 'scale(1.05)' },
                                  '100%': { transform: 'scale(0.8)' }
                                }
                              }}
                            >
                              🏗️
                            </Box>
                            
                            {/* Person 2 - Developer */}
                            <Box
                              sx={{
                                fontSize: '50px',
                                animation: 'work2 2.5s ease-in-out infinite 0.5s',
                                '@keyframes work2': {
                                  '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                                  '30%': { transform: 'translateY(-8px) rotate(5deg)' },
                                  '60%': { transform: 'translateY(-2px) rotate(-3deg)' }
                                }
                              }}
                            >
                              👨‍💻
                            </Box>
                            
                            {/* Person 3 - Engineer */}
                            <Box
                              sx={{
                                fontSize: '50px',
                                animation: 'work3 3.5s ease-in-out infinite 1s',
                                '@keyframes work3': {
                                  '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                                  '20%': { transform: 'translateY(-6px) rotate(-8deg)' },
                                  '40%': { transform: 'translateY(-2px) rotate(2deg)' },
                                  '80%': { transform: 'translateY(-4px) rotate(-2deg)' }
                                }
                              }}
                            >
                              👩‍🔧
                            </Box>
                          </Box>
                          

                          
                          {/* Animated Title */}
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              fontWeight: 'bold', 
                              mb: 2,
                              background: 'linear-gradient(45deg, #FFE066, #FF6B6B)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              animation: 'glow 2s ease-in-out infinite alternate',
                              '@keyframes glow': {
                                '0%': { textShadow: '0 0 5px rgba(255,255,255,0.5)' },
                                '100%': { textShadow: '0 0 20px rgba(255,255,255,0.8)' }
                              }
                            }}
                          >
                            Something Exciting is Coming!
                          </Typography>
                          
                          {/* Animated Subtitle */}
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 4, 
                              opacity: 0.9,
                              animation: 'fadeInOut 3s ease-in-out infinite',
                              '@keyframes fadeInOut': {
                                '0%, 100%': { opacity: 0.7 },
                                '50%': { opacity: 1 }
                              }
                            }}
                          >
                            Stay Tuned!
                          </Typography>
                          
                          {/* Progress Indicators */}
                          <Box sx={{ mb: 4 }}>
                            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                              Our team is building amazing analytics features:
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Box
                                  sx={{
                                    fontSize: '24px',
                                    mb: 1,
                                    animation: 'buildPulse 1.5s ease-in-out infinite',
                                    '@keyframes buildPulse': {
                                      '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                                      '50%': { transform: 'scale(1.1) rotate(5deg)' }
                                    }
                                  }}
                                >
                                  🔧
                                </Box>
                                <Typography variant="caption">Building Tools</Typography>
                              </Box>
                              <Box sx={{ textAlign: 'center' }}>
                                <Box
                                  sx={{
                                    fontSize: '24px',
                                    mb: 1,
                                    animation: 'buildPulse 1.5s ease-in-out infinite 0.3s',
                                    '@keyframes buildPulse': {
                                      '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                                      '50%': { transform: 'scale(1.1) rotate(5deg)' }
                                    }
                                  }}
                                >
                                  📋
                                </Box>
                                <Typography variant="caption">Project Planning</Typography>
                              </Box>
                              <Box sx={{ textAlign: 'center' }}>
                                <Box
                                  sx={{
                                    fontSize: '24px',
                                    mb: 1,
                                    animation: 'buildPulse 1.5s ease-in-out infinite 0.6s',
                                    '@keyframes buildPulse': {
                                      '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                                      '50%': { transform: 'scale(1.1) rotate(5deg)' }
                                    }
                                  }}
                                >
                                  ⚙️
                                </Box>
                                <Typography variant="caption">System Integration</Typography>
                              </Box>
                              <Box sx={{ textAlign: 'center' }}>
                                <Box
                                  sx={{
                                    fontSize: '24px',
                                    mb: 1,
                                    animation: 'buildPulse 1.5s ease-in-out infinite 0.9s',
                                    '@keyframes buildPulse': {
                                      '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
                                      '50%': { transform: 'scale(1.1) rotate(5deg)' }
                                    }
                                  }}
                                >
                                  🚀
                                </Box>
                                <Typography variant="caption">Launch Ready</Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Loading Animation */}
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Construction in progress
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {[0, 1, 2].map((index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.8)',
                                    animation: `loading 1.4s ease-in-out infinite ${index * 0.2}s`,
                                    '@keyframes loading': {
                                      '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                                      '40%': { transform: 'scale(1.2)', opacity: 1 }
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                          
                          {/* Call to Action */}
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)'
                            }}
                          >
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              🏗️ <strong>Under Construction:</strong> Our team is building an advanced analytics dashboard 
                              with real-time insights, interactive visualizations, and AI-powered recommendations!
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 5: Offers */}
            <TabPanel value={currentTab} index={5}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Available Offers</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={1000}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <LocalOfferIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Available Offers</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        
                        {/* Payment Options */}
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            Flexible Payment Options
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'primary.light' }}>
                                <CardContent>
                                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography variant="h6" color="primary.main" gutterBottom>
                                      EMI Payment Plan
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      Split your premium into easy monthly payments
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 1, mb: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • No additional charges
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • Flexible payment schedule
                                    </Typography>
                                    <Typography variant="body2">
                                      • Easy auto-debit option
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                      ₹{Math.round(caseData.policyDetails.premium / 12)}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none' }}>
                                <CardContent>
                                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                      Quarterly Payment
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      Pay every three months
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 1, mb: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • 2% discount on total premium
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • Reduced payment frequency
                                    </Typography>
                                    <Typography variant="body2">
                                      • Scheduled reminders
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                      ₹{Math.round((caseData.policyDetails.premium * 0.98) / 4)}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none' }}>
                                <CardContent>
                                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                      Annual Payment
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      Pay once and save
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 1, mb: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • 5% discount on total premium
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • No hassle of multiple payments
                                    </Typography>
                                    <Typography variant="body2">
                                      • Get it done in one go
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                      ₹{Math.round(caseData.policyDetails.premium * 0.95)}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={3}>
                              <Card variant="outlined" sx={{ height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'warning.light' }}>
                                <CardContent>
                                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography variant="h6" color="warning.main" gutterBottom>
                                      Premium Funding
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      Finance your premium with third-party funding
                                    </Typography>
                                  </Box>
                                  <Box sx={{ p: 1, mb: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • Preserve cash flow & liquidity
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      • Flexible repayment terms
                                    </Typography>
                                    <Typography variant="body2">
                                      • Tax benefits available*
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.main', borderRadius: 1, color: '#000' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                      Interest from 3.5% p.a.
                                    </Typography>
                                    <Typography variant="caption">
                                      *Terms & conditions apply
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </Box>
                        
                        {/* Product Recommendations */}
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            Recommended Insurance Products
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined" sx={{ 
                                p: 2, 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { sm: 'center' },
                                gap: 2,
                                boxShadow: 'none',
                                border: '1px solid',
                                borderColor: 'secondary.light'
                              }}>
                                <Avatar sx={{ bgcolor: 'secondary.light', width: 60, height: 60, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                                  <DirectionsCarIcon sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    Enhanced Vehicle Protection
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    Based on your existing Vehicle policy and claims history, we recommend upgrading to our Enhanced Vehicle Protection plan.
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    <Chip label="Roadside Assistance" size="small" />
                                    <Chip label="Rental Coverage" size="small" />
                                    <Chip label="Gap Insurance" size="small" />
                                  </Box>
                                  <Typography variant="body2" color="secondary" sx={{ fontWeight: 'bold' }}>
                                    Special offer: 15% discount for multi-policy holders
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined" sx={{ 
                                p: 2, 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { sm: 'center' },
                                gap: 2,
                                boxShadow: 'none'
                              }}>
                                <Avatar sx={{ bgcolor: 'info.light', width: 60, height: 60, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                                  <HealthAndSafetyIcon sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    Family Health Insurance
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    With 2 family policies already, complement your coverage with our comprehensive health insurance plan.
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    <Chip label="Preventive Care" size="small" />
                                    <Chip label="Hospital Coverage" size="small" />
                                    <Chip label="Prescription Benefits" size="small" />
                                  </Box>
                                  <Typography variant="body2" color="info.main" sx={{ fontWeight: 'bold' }}>
                                    Family package: Cover all members at a flat rate
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Card variant="outlined" sx={{ 
                                p: 2, 
                                display: 'flex', 
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { md: 'center' },
                                gap: 2,
                                boxShadow: 'none',
                                bgcolor: 'success.light',
                                color: 'white'
                              }}>
                                <Avatar sx={{ bgcolor: 'white', color: 'success.main', width: 60, height: 60, alignSelf: { xs: 'center', md: 'flex-start' } }}>
                                  <WorkspacePremiumIcon sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="h6" gutterBottom>
                                    Premium Bundle Discount
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    Bundle your Vehicle, Home, and Life policies to receive our maximum discount package.
                                  </Typography>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Save up to 25% on all policies
                                  </Typography>
                                </Box>
                                <Button variant="contained" color="secondary">
                                  View Bundle Options
                                </Button>
                              </Card>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 6: Outstanding Amounts */}
            <TabPanel value={currentTab} index={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Outstanding Amounts</Typography>
              <Grid container spacing={3}>
                {/* Outstanding Amounts Summary */}
                <Grid item xs={12} lg={4}>
                  <Grow in={loaded} timeout={400}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%', 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2, width: 48, height: 48 }}>
                            <WarningIcon sx={{ fontSize: 28 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="600" color="error.main">
                              Total Outstanding
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Consolidated Amount
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ textAlign: 'center', py: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 2, mb: 3 }}>
                          <Typography variant="h3" fontWeight="700" color="error.main">
                            ₹{caseData.outstandingAmounts?.reduce((total, amount) => total + amount.amount, 0)?.toLocaleString('en-IN') || '0'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Across {caseData.outstandingAmounts?.length || 0} installments
                          </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />
                        
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Oldest Due:</Typography>
                            <Typography variant="body2" fontWeight="600">
                              {caseData.outstandingAmounts?.length > 0 ? 
                                new Date(Math.min(...caseData.outstandingAmounts.map(a => new Date(a.dueDate)))).toLocaleDateString('en-IN') : 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Latest Due:</Typography>
                            <Typography variant="body2" fontWeight="600">
                              {caseData.outstandingAmounts?.length > 0 ? 
                                new Date(Math.max(...caseData.outstandingAmounts.map(a => new Date(a.dueDate)))).toLocaleDateString('en-IN') : 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Average Amount:</Typography>
                            <Typography variant="body2" fontWeight="600">
                              ₹{caseData.outstandingAmounts?.length > 0 ? 
                                Math.round(caseData.outstandingAmounts.reduce((total, amount) => total + amount.amount, 0) / caseData.outstandingAmounts.length).toLocaleString('en-IN') : '0'}
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          fullWidth
                          variant="contained"
                          color="error"
                          startIcon={<PaymentsIcon />}
                          sx={{ mt: 3, borderRadius: 2 }}
                          onClick={() => {
                            // Handle payment action
                            setSnackbar({
                              open: true,
                              message: 'Payment portal functionality would be implemented here',
                              severity: 'info'
                            });
                          }}
                        >
                          Initiate Payment
                        </Button>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Outstanding Amounts List */}
                <Grid item xs={12} lg={8}>
                  <Grow in={loaded} timeout={600}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%', 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                              <ReceiptIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="600">
                                Outstanding Installments
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Detailed breakdown by period
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={`${caseData.outstandingAmounts?.length || 0} Pending`}
                            color="error"
                            variant="outlined"
                          />
                        </Box>

                        <Box
                          sx={{
                            maxHeight: '400px', // Height to show approximately 3 cards
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            pr: 1, // Add padding for scrollbar
                            '&::-webkit-scrollbar': {
                              width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                              background: alpha(theme.palette.divider, 0.1),
                              borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: alpha(theme.palette.primary.main, 0.3),
                              borderRadius: '4px',
                              '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.5),
                              },
                            },
                          }}
                        >
                          <Stack spacing={2}>
                            {caseData.outstandingAmounts?.map((outstandingAmount, index) => {
                            const daysOverdue = Math.floor((new Date() - new Date(outstandingAmount.dueDate)) / (1000 * 60 * 60 * 24));
                            const isOverdue = daysOverdue > 0;
                            
                            return (
                                                              <Card 
                                  key={index}
                                  elevation={0}
                                  sx={{ 
                                    border: `1px solid ${isOverdue ? theme.palette.error.main : theme.palette.divider}`,
                                    borderRadius: 2,
                                    bgcolor: isOverdue ? alpha(theme.palette.error.main, 0.02) : 'background.paper',
                                    transition: 'all 0.2s ease',
                                    minHeight: '120px', // Ensure consistent card height for better scrolling
                                    '&:hover': {
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                      transform: 'translateY(-2px)'
                                    }
                                  }}
                                >
                                <CardContent sx={{ p: 2.5 }}>
                                  <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={3}>
                                      <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                          PERIOD
                                        </Typography>
                                        <Typography variant="body1" fontWeight="600">
                                          {outstandingAmount.period}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                      <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                          AMOUNT
                                        </Typography>
                                        <Typography variant="h6" fontWeight="700" color={isOverdue ? 'error.main' : 'primary.main'}>
                                          ₹{outstandingAmount.amount.toLocaleString('en-IN')}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                      <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                          DUE DATE
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                          {new Date(outstandingAmount.dueDate).toLocaleDateString('en-IN')}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                      <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                          STATUS
                                        </Typography>
                                        <Chip 
                                          label={isOverdue ? `${daysOverdue} days overdue` : `Due in ${Math.abs(daysOverdue)} days`}
                                          color={isOverdue ? 'error' : 'warning'}
                                          size="small"
                                          icon={isOverdue ? <WarningIcon /> : <ScheduleIcon />}
                                          sx={{ fontSize: '0.7rem' }}
                                        />
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                      <Stack direction="row" spacing={1}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="primary"
                                          startIcon={<PaymentsIcon />}
                                          sx={{ fontSize: '0.75rem' }}
                                          onClick={() => {
                                            setSnackbar({
                                              open: true,
                                              message: `Payment for ${outstandingAmount.period} - ₹${outstandingAmount.amount.toLocaleString('en-IN')}`,
                                              severity: 'info'
                                            });
                                          }}
                                        >
                                          Pay Now
                                        </Button>
                                        <IconButton 
                                          size="small"
                                          onClick={() => {
                                            setSnackbar({
                                              open: true,
                                              message: `Reminder sent for ${outstandingAmount.period}`,
                                              severity: 'success'
                                            });
                                          }}
                                        >
                                          <NotificationsIcon fontSize="small" />
                                        </IconButton>
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                  
                                  {outstandingAmount.description && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                                      <Typography variant="body2" color="text.secondary">
                                        <DescriptionIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                        {outstandingAmount.description}
                                      </Typography>
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          }) || (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                                <CheckCircleIcon sx={{ fontSize: 32 }} />
                              </Avatar>
                              <Typography variant="h6" fontWeight="600" color="success.main">
                                No Outstanding Amounts
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                All payments are up to date
                              </Typography>
                            </Box>
                          )}
                          </Stack>
                        </Box>

                        {caseData.outstandingAmounts && caseData.outstandingAmounts.length > 0 && (
                          <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                  startIcon={<PaymentsIcon />}
                                  sx={{ borderRadius: 2 }}
                                  onClick={() => {
                                    setSnackbar({
                                      open: true,
                                      message: 'Bulk payment functionality would be implemented here',
                                      severity: 'info'
                                    });
                                  }}
                                >
                                  Pay All Outstanding
                                </Button>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  color="secondary"
                                  startIcon={<ScheduleIcon />}
                                  sx={{ borderRadius: 2 }}
                                  onClick={() => {
                                    setSnackbar({
                                      open: true,
                                      message: 'Payment plan setup functionality would be implemented here',
                                      severity: 'info'
                                    });
                                  }}
                                >
                                  Setup Payment Plan
                                </Button>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 7: History & Timeline */}
            <TabPanel value={currentTab} index={7}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>History & Timeline</Typography>
              <Grid container spacing={3}>
                {/* Case Flow */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={400}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <TimelineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Case Flow</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Stepper 
                          activeStep={caseData.flowSteps.indexOf(caseData.status)} 
                          alternativeLabel 
                          sx={{
                            '.MuiStepLabel-label': {
                              fontWeight: 500,
                              mt: 1
                            }
                          }}
                        >
                          {caseData.flowSteps.map((label) => (
                            <Step key={label}>
                              <StepLabel>{label}</StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grow in={loaded} timeout={500}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        height: '520px',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <HistoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Case History</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Box 
                          sx={{ 
                            maxHeight: '400px', 
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                              width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                              background: '#f1f1f1',
                              borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: '#c1c1c1',
                              borderRadius: '4px',
                              '&:hover': {
                                background: '#a1a1a1',
                              },
                            },
                          }}
                        >
                          <List>
                            {caseData.history.map((item, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemText
                                  primary={item.action}
                                  secondary={
                                    <Box>
                                      <Typography variant="body2" color="text.secondary">
                                        {item.details}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {new Date(item.date).toLocaleString()} • {item.user}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grow in={loaded} timeout={600}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        height: '520px',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <TimelineIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" fontWeight="600">Journey Summary</Typography>
                      </Box>
                      <Divider sx={{ mb: 3 }} />
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Case Started
                              </Typography>
                              <Typography variant="body1">
                                {new Date(caseData.uploadDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Current Status
                              </Typography>
                              <Typography variant="body1">
                                <Chip
                                  label={caseData.status}
                                  color={getStatusColor(caseData.status)}
                                  size="small"
                                />
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Handling Agent
                              </Typography>
                              <Typography variant="body1">
                                {caseData.agent || "Unassigned"}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Processing Time
                              </Typography>
                              <Typography variant="body1">
                                {Math.ceil((new Date() - new Date(caseData.uploadDate)) / (1000 * 60 * 60 * 24))} days
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Journey Progress
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {caseData.flowSteps.map((step, index) => {
                              const isCompleted = caseData.flowSteps.indexOf(caseData.status) >= index;
                              return (
                                <Box 
                                  key={step} 
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    opacity: isCompleted ? 1 : 0.5
                                  }}
                                >
                                  <Box 
                                    sx={{ 
                                      width: 24, 
                                      height: 24, 
                                      borderRadius: '50%', 
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      bgcolor: isCompleted ? 'success.main' : 'grey.500',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    {index + 1}
                                  </Box>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ fontWeight: isCompleted ? 'bold' : 'normal' }}
                                  >
                                    {step}
                                    {step === caseData.status && ' (Current)'}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  </Grow>
                </Grid>

                {/* Communication Logs */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={650}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Communication Logs</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        {/* Communication Type Tabs */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                          <Tabs
                            value={communicationTab}
                            onChange={(e, newValue) => setCommunicationTab(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                          >
                            <Tab
                              icon={<PhoneIcon />}
                              iconPosition="start"
                              label="Calls"
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            />
                            <Tab
                              icon={<EmailIcon />}
                              iconPosition="start"
                              label="Emails"
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            />
                            <Tab
                              icon={<SmsIcon />}
                              iconPosition="start"
                              label="SMS"
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            />
                            <Tab
                              icon={<WhatsAppIcon />}
                              iconPosition="start"
                              label="WhatsApp"
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            />
                          </Tabs>
                        </Box>

                        {/* Call Logs Tab */}
                        {communicationTab === 0 && (
                          <Box
                            sx={{
                              maxHeight: '500px',
                              overflowY: 'auto',
                              '&::-webkit-scrollbar': { width: '8px' },
                              '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                              '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                            }}
                          >
                            <List>
                              {[
                                {
                                  id: 1,
                                  caller: 'Priya Patel',
                                  callerRole: 'Agent',
                                  number: '+91-98765-43210',
                                  customerNumber: '+91-98765-12345',
                                  status: 'Connected',
                                  duration: '5 mins 32 secs',
                                  date: '2024-01-15 14:30',
                                  notes: 'Discussed policy renewal, customer interested in upgrading coverage.'
                                },
                                {
                                  id: 2,
                                  caller: 'Amit Kumar',
                                  callerRole: 'Agent',
                                  number: '+91-98765-43211',
                                  customerNumber: '+91-98765-12345',
                                  status: 'Not Connected',
                                  duration: null,
                                  date: '2024-01-14 10:15',
                                  notes: 'No answer after 3 rings.'
                                },
                                {
                                  id: 3,
                                  caller: 'Sarah Johnson',
                                  callerRole: 'Supervisor',
                                  number: '+91-98765-43212',
                                  customerNumber: '+91-98765-12345',
                                  status: 'Connected',
                                  duration: '12 mins 45 secs',
                                  date: '2024-01-12 16:45',
                                  notes: 'Customer complaint resolved. Policy premium refund processed.'
                                }
                              ].map((call) => (
                                <ListItem
                                  key={call.id}
                                  sx={{
                                    px: 0,
                                    py: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' }
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Avatar
                                          sx={{
                                            bgcolor: call.status === 'Connected' ? 'success.main' : 'error.main',
                                            width: 32,
                                            height: 32
                                          }}
                                        >
                                          <PhoneIcon fontSize="small" />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                          <Typography variant="subtitle2" fontWeight="600">
                                            {call.caller} ({call.callerRole})
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {call.date}
                                          </Typography>
                                        </Box>
                                        <Chip
                                          label={call.status}
                                          size="small"
                                          color={call.status === 'Connected' ? 'success' : 'error'}
                                        />
                                      </Box>
                                    }
                                    secondary={
                                      <Box sx={{ mt: 1 }}>
                                        <Grid container spacing={1} sx={{ mb: 1 }}>
                                          <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                              <strong>Agent Number:</strong> {call.number}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                              <strong>Customer Number:</strong> {call.customerNumber}
                                            </Typography>
                                          </Grid>
                                          {call.duration && (
                                            <Grid item xs={12}>
                                              <Typography variant="body2" color="text.secondary">
                                                <strong>Duration:</strong> {call.duration}
                                              </Typography>
                                            </Grid>
                                          )}
                                        </Grid>
                                        {call.notes && (
                                          <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1, mb: 1 }}>
                                            <Typography variant="body2">
                                              <strong>Notes:</strong> {call.notes}
                                            </Typography>
                                          </Box>
                                        )}
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<PhoneIcon />}
                                            onClick={() => handleViewMessage({ type: 'call', ...call })}
                                          >
                                            View Details
                                          </Button>
                                        </Box>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                        {/* Email Logs Tab */}
                        {communicationTab === 1 && (
                          <Box
                            sx={{
                              maxHeight: '500px',
                              overflowY: 'auto',
                              '&::-webkit-scrollbar': { width: '8px' },
                              '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                              '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                            }}
                          >
                            <List>
                              {[
                                {
                                  id: 1,
                                  subject: 'Policy Renewal Reminder',
                                  from: 'renewals@insurance.com',
                                  to: 'customer@email.com',
                                  status: 'Opened',
                                  date: '2024-01-15 09:30',
                                  preview: 'Your health insurance policy is due for renewal on Feb 1, 2024. Please renew to continue coverage...',
                                  body: 'Dear Customer,\n\nYour health insurance policy #POL123456 is due for renewal on February 1, 2024.\n\nPlease click the link below to renew your policy and ensure uninterrupted coverage.\n\nBest regards,\nInsurance Team'
                                },
                                {
                                  id: 2,
                                  subject: 'Claim Status Update',
                                  from: 'claims@insurance.com',
                                  to: 'customer@email.com',
                                  status: 'Sent',
                                  date: '2024-01-12 14:20',
                                  preview: 'Your claim #CLM456789 has been approved and the payment will be processed within 3 business days...',
                                  body: 'Dear Customer,\n\nWe are pleased to inform you that your claim #CLM456789 has been approved.\n\nApproved Amount: ₹45,000\nPayment will be processed within 3 business days.\n\nThank you for your patience.\n\nBest regards,\nClaims Team'
                                }
                              ].map((email) => (
                                <ListItem
                                  key={email.id}
                                  sx={{
                                    px: 0,
                                    py: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' }
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Avatar
                                          sx={{
                                            bgcolor: email.status === 'Opened' ? 'success.main' : 'info.main',
                                            width: 32,
                                            height: 32
                                          }}
                                        >
                                          <EmailIcon fontSize="small" />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                          <Typography variant="subtitle2" fontWeight="600">
                                            {email.subject}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {email.date}
                                          </Typography>
                                        </Box>
                                        <Chip
                                          label={email.status}
                                          size="small"
                                          color={email.status === 'Opened' ? 'success' : 'info'}
                                        />
                                      </Box>
                                    }
                                    secondary={
                                      <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                          <strong>From:</strong> {email.from} <br />
                                          <strong>To:</strong> {email.to}
                                        </Typography>
                                        <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1, mb: 1 }}>
                                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                            {email.preview}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<MailOutlineIcon />}
                                            onClick={() => handleViewMessage({ type: 'email', ...email })}
                                          >
                                            View Full Email
                                          </Button>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<SendIcon />}
                                            onClick={() => handleResendMessage({ type: 'email', ...email })}
                                          >
                                            Resend
                                          </Button>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditAndResend({ type: 'email', ...email })}
                                          >
                                            Edit & Resend
                                          </Button>
                                        </Box>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                        {/* SMS Logs Tab */}
                        {communicationTab === 2 && (
                          <Box
                            sx={{
                              maxHeight: '500px',
                              overflowY: 'auto',
                              '&::-webkit-scrollbar': { width: '8px' },
                              '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                              '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                            }}
                          >
                            <List>
                              {[
                                {
                                  id: 1,
                                  to: '+91-98765-12345',
                                  status: 'Delivered',
                                  date: '2024-01-15 10:00',
                                  message: 'Your policy renewal payment of ₹15,000 has been received. Policy renewed successfully till 01/02/2025. Thank you!'
                                },
                                {
                                  id: 2,
                                  to: '+91-98765-12345',
                                  status: 'Sent',
                                  date: '2024-01-10 15:30',
                                  message: 'Reminder: Your policy is expiring on 01/02/2024. Please renew at the earliest to avoid coverage lapse. Call us at 1800-XXX-XXXX'
                                },
                                {
                                  id: 3,
                                  to: '+91-98765-12345',
                                  status: 'Failed',
                                  date: '2024-01-08 11:20',
                                  message: 'Your claim has been approved. Amount ₹45,000 will be credited to your account in 3 days.'
                                }
                              ].map((sms) => (
                                <ListItem
                                  key={sms.id}
                                  sx={{
                                    px: 0,
                                    py: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' }
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Avatar
                                          sx={{
                                            bgcolor: sms.status === 'Delivered' ? 'success.main' : sms.status === 'Failed' ? 'error.main' : 'info.main',
                                            width: 32,
                                            height: 32
                                          }}
                                        >
                                          <SmsIcon fontSize="small" />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                          <Typography variant="subtitle2" fontWeight="600">
                                            SMS to {sms.to}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {sms.date}
                                          </Typography>
                                        </Box>
                                        <Chip
                                          label={sms.status}
                                          size="small"
                                          color={sms.status === 'Delivered' ? 'success' : sms.status === 'Failed' ? 'error' : 'info'}
                                        />
                                      </Box>
                                    }
                                    secondary={
                                      <Box sx={{ mt: 1 }}>
                                        <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1, mb: 1 }}>
                                          <Typography variant="body2">
                                            {sms.message}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<MailOutlineIcon />}
                                            onClick={() => handleViewMessage({ type: 'sms', ...sms })}
                                          >
                                            View Message
                                          </Button>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<SendIcon />}
                                            onClick={() => handleResendMessage({ type: 'sms', ...sms })}
                                          >
                                            Resend
                                          </Button>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditAndResend({ type: 'sms', ...sms })}
                                          >
                                            Edit & Resend
                                          </Button>
                                        </Box>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                        {/* WhatsApp Logs Tab */}
                        {communicationTab === 3 && (
                          <Box
                            sx={{
                              maxHeight: '500px',
                              overflowY: 'auto',
                              '&::-webkit-scrollbar': { width: '8px' },
                              '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                              '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                            }}
                          >
                            <List>
                              {[
                                {
                                  id: 1,
                                  to: '+91-98765-12345',
                                  status: 'Read',
                                  date: '2024-01-15 11:45',
                                  message: 'Hi! Your policy renewal is confirmed. Download your updated policy document here: [Link]\n\nThank you for choosing us! 😊'
                                },
                                {
                                  id: 2,
                                  to: '+91-98765-12345',
                                  status: 'Delivered',
                                  date: '2024-01-13 16:20',
                                  message: 'Your claim approval letter is ready. Click here to download: [Link]\n\nFor any queries, reply to this message.'
                                },
                                {
                                  id: 3,
                                  to: '+91-98765-12345',
                                  status: 'Sent',
                                  date: '2024-01-11 09:00',
                                  message: 'Hello! This is a reminder that your policy premium payment is due in 2 days. Please make payment to avoid service interruption.'
                                }
                              ].map((whatsapp) => (
                                <ListItem
                                  key={whatsapp.id}
                                  sx={{
                                    px: 0,
                                    py: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' }
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                        <Avatar
                                          sx={{
                                            bgcolor: whatsapp.status === 'Read' ? 'success.main' : 'info.main',
                                            width: 32,
                                            height: 32
                                          }}
                                        >
                                          <WhatsAppIcon fontSize="small" />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                          <Typography variant="subtitle2" fontWeight="600">
                                            WhatsApp to {whatsapp.to}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {whatsapp.date}
                                          </Typography>
                                        </Box>
                                        <Chip
                                          label={whatsapp.status}
                                          size="small"
                                          color={whatsapp.status === 'Read' ? 'success' : 'info'}
                                        />
                                      </Box>
                                    }
                                    secondary={
                                      <Box sx={{ mt: 1 }}>
                                        <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 1, mb: 1 }}>
                                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                            {whatsapp.message}
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<MailOutlineIcon />}
                                            onClick={() => handleViewMessage({ type: 'whatsapp', ...whatsapp })}
                                          >
                                            View Message
                                          </Button>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<SendIcon />}
                                            onClick={() => handleResendMessage({ type: 'whatsapp', ...whatsapp })}
                                          >
                                            Resend
                                          </Button>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditAndResend({ type: 'whatsapp', ...whatsapp })}
                                          >
                                            Edit & Resend
                                          </Button>
                                        </Box>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Add Comment */}
                <Grid item xs={12}>
                  <Grow in={loaded} timeout={700}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                        overflow: 'visible',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="h6" fontWeight="600">Add Comment</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            InputProps={{
                              sx: {
                                borderRadius: 2,
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: alpha(theme.palette.primary.main, 0.2),
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: theme.palette.primary.main,
                                },
                              }
                            }}
                          />
                          <Button
                            variant="contained"
                            disabled={!comment.trim()}
                            onClick={async () => {
                              try {
                                const { updateCase } = await import('../services/api');
                                const newHistory = [
                                  {
                                    date: new Date().toISOString(),
                                    action: 'Comment Added',
                                    details: comment,
                                    user: 'Current User',
                                    level: 'info'
                                  },
                                  ...caseData.history
                                ];
                                await updateCase(caseId, { history: newHistory });
                                setCaseData({ ...caseData, history: newHistory });
                                setComment('');
                                setSuccessMessage('Comment added successfully');
                              } catch (err) {
                                setError('Failed to add comment');
                              }
                            }}
                            sx={{
                              borderRadius: 2,
                              px: 4,
                              fontWeight: 600,
                              boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                              }
                            }}
                          >
                            Add Comment
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        )}

        {/* Renewal Notice/Payment Link Dialog */}
        <Dialog 
          open={renewalNoticeDialog} 
          onClose={() => setRenewalNoticeDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon color="primary" />
              <Typography variant="h6" fontWeight="600">
                Send Customer Communication
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ pb: 0 }}>
            {/* Message Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Message Type
              </Typography>
              <RadioGroup
                value={messageType}
                onChange={(e) => {
                  setMessageType(e.target.value);
                  setCustomMessage(getDefaultMessage(selectedChannel, e.target.value));
                }}
                row
              >
                <FormControlLabel 
                  value="renewal_notice" 
                  control={<Radio />} 
                  label="Renewal Notice" 
                />
                <FormControlLabel 
                  value="payment_link" 
                  control={<Radio />} 
                  label="Payment Link" 
                />
              </RadioGroup>
            </Box>

            {/* Channel Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Communication Channel
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Channel</InputLabel>
                    <Select
                      value={selectedChannel}
                      label="Channel"
                      onChange={(e) => {
                        setSelectedChannel(e.target.value);
                        setCustomMessage(getDefaultMessage(e.target.value, messageType));
                      }}
                    >
                      <MenuItem value="whatsapp">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WhatsAppIcon fontSize="small" />
                          WhatsApp
                        </Box>
                      </MenuItem>
                      <MenuItem value="sms">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SmsIcon fontSize="small" />
                          SMS
                        </Box>
                      </MenuItem>
                      <MenuItem value="email">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MailOutlineIcon fontSize="small" />
                          Email
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Recipient"
                    value={selectedChannel === 'email' ? caseData.contactInfo.email : caseData.contactInfo.phone}
                    disabled
                    InputProps={{
                      startAdornment: selectedChannel === 'email' ? <EmailIcon /> : <PhoneIcon />
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Message Preview/Editor */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Message Content
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={selectedChannel === 'email' ? 12 : 8}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={`Enter your ${selectedChannel} message...`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  }
                }}
              />
              <Box sx={{ 
                mt: 1, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="caption" color="text.secondary">
                  {selectedChannel === 'sms' && `${customMessage.length}/160 characters`}
                  {selectedChannel === 'whatsapp' && `${customMessage.length} characters`}
                  {selectedChannel === 'email' && `${customMessage.split('\n').length} lines`}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setCustomMessage(getDefaultMessage(selectedChannel, messageType))}
                  sx={{ textTransform: 'none' }}
                >
                  Reset to Default
                </Button>
              </Box>
            </Box>

            {/* Payment Link Info - Only show for payment link messages */}
            {messageType === 'payment_link' && (
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.success.main, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LinkIcon fontSize="small" color="success" />
                  <Typography variant="subtitle2" fontWeight="600" color="success.main">
                    Payment Link Information
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  The [Payment Link] placeholder will be automatically replaced with a secure payment link 
                  when the message is sent. This link will be valid for 48 hours and will redirect to our 
                  secure payment gateway.
                </Typography>
              </Box>
            )}

            {/* Renewal Notice Info - Only show for renewal notice messages */}
            {messageType === 'renewal_notice' && (
              <Box sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.info.main, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <NotificationsIcon fontSize="small" color="info" />
                  <Typography variant="subtitle2" fontWeight="600" color="info.main">
                    Renewal Notice Information
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  This renewal notice will remind the customer about their upcoming policy expiration 
                  and provide them with contact information to proceed with the renewal process.
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setRenewalNoticeDialog(false)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendRenewalNotice}
              disabled={sendingNotice || !customMessage.trim()}
              startIcon={sendingNotice ? <CircularProgress size={16} /> : <SendIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 120,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                },
                '&:disabled': {
                  background: 'rgba(0,0,0,0.12)'
                }
              }}
            >
              {sendingNotice 
                ? 'Sending...' 
                : `Send ${messageType === 'payment_link' ? 'Payment Link' : 'Notice'} via ${selectedChannel.toUpperCase()}`
              }
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Message Dialog */}
        <Dialog
          open={viewMessageDialog}
          onClose={handleCloseViewMessage}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {selectedMessage?.type === 'email' && <MailOutlineIcon color="primary" />}
                {selectedMessage?.type === 'sms' && <SmsIcon color="primary" />}
                {selectedMessage?.type === 'whatsapp' && <WhatsAppIcon color="primary" />}
                {selectedMessage?.type === 'call' && <PhoneIcon color="primary" />}
                <Typography variant="h6" fontWeight="600">
                  {selectedMessage?.type === 'email' && 'Email Details'}
                  {selectedMessage?.type === 'sms' && 'SMS Details'}
                  {selectedMessage?.type === 'whatsapp' && 'WhatsApp Message Details'}
                  {selectedMessage?.type === 'call' && 'Call Details'}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseViewMessage} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            {selectedMessage && (
              <Box>
                {/* Email Content */}
                {selectedMessage.type === 'email' && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Subject
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {selectedMessage.subject}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        From
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.from}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        To
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.to}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.date}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={selectedMessage.status}
                        size="small"
                        color={selectedMessage.status === 'Delivered' ? 'success' : selectedMessage.status === 'Sent' ? 'primary' : 'error'}
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Message Body
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mt: 1,
                          bgcolor: 'background.default',
                          maxHeight: 400,
                          overflow: 'auto'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
                        >
                          {selectedMessage.body}
                        </Typography>
                      </Paper>
                    </Box>
                  </>
                )}

                {/* SMS/WhatsApp Content */}
                {(selectedMessage.type === 'sms' || selectedMessage.type === 'whatsapp') && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        To
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.to}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.date}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={selectedMessage.status}
                        size="small"
                        color={
                          selectedMessage.status === 'Delivered' || selectedMessage.status === 'Read' ? 'success' :
                          selectedMessage.status === 'Sent' ? 'primary' :
                          'error'
                        }
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Message
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mt: 1,
                          bgcolor: 'background.default'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-wrap' }}
                        >
                          {selectedMessage.message}
                        </Typography>
                      </Paper>
                    </Box>
                  </>
                )}

                {/* Call Content */}
                {selectedMessage.type === 'call' && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Caller
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {selectedMessage.caller} ({selectedMessage.callerRole})
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Called Number
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.number}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Customer Number
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.customerNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.date}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={selectedMessage.status}
                        size="small"
                        color={selectedMessage.status === 'Connected' ? 'success' : 'error'}
                      />
                    </Box>

                    {selectedMessage.duration && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Duration
                        </Typography>
                        <Typography variant="body2">
                          {selectedMessage.duration}
                        </Typography>
                      </Box>
                    )}

                    {selectedMessage.notes && (
                      <>
                        <Divider sx={{ my: 3 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Call Notes
                          </Typography>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              mt: 1,
                              bgcolor: 'background.default'
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: 'pre-wrap' }}
                            >
                              {selectedMessage.notes}
                            </Typography>
                          </Paper>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleCloseViewMessage}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleCloseViewMessage();
                handleResendMessage(selectedMessage);
              }}
              startIcon={<SendIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Resend
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleCloseViewMessage();
                handleEditAndResend(selectedMessage);
              }}
              startIcon={<EditIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Edit & Resend
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSuccessMessage('')} 
            severity="success"
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Verification Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default CaseDetails;