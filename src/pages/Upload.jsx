import React, { useState } from 'react';
import { useProviders } from '../context/ProvidersContext';
import { 
  Box, Typography, Paper, Button, Grid, 
  LinearProgress, Alert, AlertTitle, List, 
  ListItem, ListItemText, Divider, Chip,
  Card, CardContent, alpha, useTheme,
  Fade, Grow, Zoom, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, Avatar,
  Stepper, Step, StepLabel, StepContent, Accordion,
  AccordionSummary, AccordionDetails, FormGroup, Checkbox
} from '@mui/material';
import { 
  CloudUpload as UploadIcon, 
  Download as DownloadIcon,
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon,
  HourglassEmpty as PendingIcon,
  GetApp as FileDownloadIcon,
  Campaign as CampaignIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  Timeline as TimelineIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { deduplicateContacts } from '../services/api';

const Upload = () => {
  const theme = useTheme();
  const { getProviders, getActiveProvider } = useProviders();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  // Campaign state
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: ['email'], // Changed to array to support multiple selections
    template: {}, // Changed to object to store templates for each type
    providers: {}, // Store selected providers for each channel
    scheduleType: 'immediate',
    scheduleDate: '',
    scheduleTime: '',
    targetAudience: 'all',
    advancedScheduling: {
      enabled: false,
      intervals: []
    }
  });
  
  // File upload state for edit mode
  const [editModeFile, setEditModeFile] = useState(null);
  
  // Predefined templates
  const [templates] = useState({
    email: [
      { id: 'email-1', name: 'Renewal Reminder - 30 Days', subject: 'Your Policy Renewal is Due Soon', content: 'Dear {name}, your policy expires in 30 days...' },
      { id: 'email-2', name: 'Renewal Reminder - 7 Days', subject: 'Urgent: Policy Renewal Required', content: 'Dear {name}, your policy expires in 7 days...' },
      { id: 'email-3', name: 'Welcome New Customer', subject: 'Welcome to Our Insurance Family', content: 'Dear {name}, thank you for choosing us...' }
    ],
    whatsapp: [
      { id: 'wa-1', name: 'Quick Renewal Reminder', content: 'Hi {name}! Your policy {policy_number} expires on {expiry_date}. Renew now: {renewal_link}' },
      { id: 'wa-2', name: 'Payment Confirmation', content: 'Thank you {name}! Your payment of ₹{amount} has been received. Policy renewed successfully.' }
    ],
    sms: [
      { id: 'sms-1', name: 'Renewal Alert', content: 'Dear {name}, your policy expires on {expiry_date}. Renew at {link} or call {phone}' },
      { id: 'sms-2', name: 'Payment Due', content: 'Payment of ₹{amount} due for policy {policy_number}. Pay now: {payment_link}' }
    ],
    call: [
      { id: 'call-1', name: 'Renewal Follow-up Call', script: 'Hello {name}, this is regarding your policy {policy_number} renewal. We wanted to discuss your renewal options...' },
      { id: 'call-2', name: 'Payment Reminder Call', script: 'Hi {name}, we wanted to remind you about your pending payment of ₹{amount} for policy {policy_number}...' }
    ],
    'bot-calling': [
      { id: 'bot-call-1', name: 'Automated Renewal Reminder', script: 'Hello {name}, this is an automated reminder about your policy {policy_number} renewal. Your policy expires on {expiry_date}. Press 1 to renew now or press 2 to speak with an agent.' },
      { id: 'bot-call-2', name: 'Payment Due Bot Call', script: 'Hi {name}, this is an automated call regarding your payment of ₹{amount} for policy {policy_number}. Press 1 to make payment or press 2 for assistance.' }
    ]
  });
  
  // Active campaigns
  const [activeCampaigns, setActiveCampaigns] = useState([
    {
      id: 'camp-1',
      name: 'May Renewals Email Campaign',
      type: 'email',
      status: 'active',
      uploadId: 'upload-128',
      uploadFilename: 'may_renewals_batch1.xlsx',
      targetCount: 238,
      sent: 156,
      opened: 89,
      clicked: 34,
      converted: 12,
      createdAt: '2025-05-15T11:00:00',
      scheduledAt: '2025-05-15T14:00:00'
    },
    {
      id: 'camp-2',
      name: 'April Follow-up WhatsApp',
      type: 'whatsapp',
      status: 'paused',
      uploadId: 'upload-127',
      uploadFilename: 'april_end_policies.xlsx',
      targetCount: 175,
      sent: 98,
      delivered: 94,
      read: 67,
      replied: 23,
      createdAt: '2025-04-30T16:30:00',
      scheduledAt: '2025-05-01T09:00:00'
    }
  ]);

  const [uploadHistory, setUploadHistory] = useState([
    {
      id: 'upload-128',
      filename: 'may_renewals_batch1.xlsx',
      timestamp: '2025-05-15T10:45:00',
      status: 'Completed',
      records: 245,
      successful: 238,
      failed: 7,
      fileSize: '2.4 MB',
      downloadUrl: '/api/downloads/may_renewals_batch1.xlsx'
    },
    {
      id: 'upload-127',
      filename: 'april_end_policies.xlsx',
      timestamp: '2025-04-30T16:20:00',
      status: 'Completed',
      records: 189,
      successful: 175,
      failed: 14,
      fileSize: '1.8 MB',
      downloadUrl: '/api/downloads/april_end_policies.xlsx'
    },
    {
      id: 'upload-126',
      filename: 'quarterly_review_q1.csv',
      timestamp: '2025-04-28T11:30:00',
      status: 'Processing',
      records: 312,
      successful: '...',
      failed: '...',
      fileSize: '3.1 MB',
      downloadUrl: '/api/downloads/quarterly_review_q1.csv'
    },
    {
      id: 'upload-125',
      filename: 'branch_mumbai_renewals.xlsx',
      timestamp: '2025-04-25T14:15:00',
      status: 'Completed',
      records: 167,
      successful: 159,
      failed: 8,
      fileSize: '1.5 MB',
      downloadUrl: '/api/downloads/branch_mumbai_renewals.xlsx'
    },
    {
      id: 'upload-124',
      filename: 'corporate_policies_april.xlsx',
      timestamp: '2025-04-22T09:45:00',
      status: 'Failed',
      records: 95,
      successful: 0,
      failed: 95,
      fileSize: '890 KB',
      downloadUrl: '/api/downloads/corporate_policies_april.xlsx'
    },
    {
      id: 'upload-123',
      filename: 'april_renewals.xlsx',
      timestamp: '2025-04-10T09:30:00',
      status: 'Completed',
      records: 156,
      successful: 142,
      failed: 14,
      fileSize: '1.2 MB',
      downloadUrl: '/api/downloads/april_renewals.xlsx'
    },
    {
      id: 'upload-122',
      filename: 'march_end_batch.xlsx',
      timestamp: '2025-03-28T14:15:00',
      status: 'Completed',
      records: 203,
      successful: 189,
      failed: 14,
      fileSize: '1.9 MB',
      downloadUrl: '/api/downloads/march_end_batch.xlsx'
    },
    {
      id: 'upload-121',
      filename: 'regional_data_south.csv',
      timestamp: '2025-03-25T13:20:00',
      status: 'Completed',
      records: 278,
      successful: 265,
      failed: 13,
      fileSize: '2.7 MB',
      downloadUrl: '/api/downloads/regional_data_south.csv'
    },
    {
      id: 'upload-120',
      filename: 'bulk_import_march.xlsx',
      timestamp: '2025-03-20T10:10:00',
      status: 'Completed',
      records: 445,
      successful: 421,
      failed: 24,
      fileSize: '4.2 MB',
      downloadUrl: '/api/downloads/bulk_import_march.xlsx'
    },
    {
      id: 'upload-119',
      filename: 'agent_submissions_week12.csv',
      timestamp: '2025-03-18T15:30:00',
      status: 'Completed',
      records: 134,
      successful: 128,
      failed: 6,
      fileSize: '1.1 MB',
      downloadUrl: '/api/downloads/agent_submissions_week12.csv'
    }
  ]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    try {
      // In a real app, this would call your API
      // const result = await uploadPolicyData(file);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Mock successful upload
      const newUpload = {
        id: `upload-${Date.now()}`,
        filename: file.name,
        timestamp: new Date().toISOString(),
        status: 'Processing',
        records: 178,
        successful: '...',
        failed: '...',
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        downloadUrl: '/api/downloads/' + file.name
      };
      
      setUploadHistory([newUpload, ...uploadHistory]);
      
      setUploadStatus({
        type: 'success',
        message: 'File uploaded successfully. Processing has begun.'
      });
      
      // Simulate status change after processing
      setTimeout(() => {
        setUploadHistory(prev => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            status: 'Completed',
            successful: 165,
            failed: 13
          };
          return updated;
        });
      }, 8000);
      
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload file. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download a template file
    alert('Template download would start here');
  };

  const handleDownloadFile = (upload) => {
    // In a real app, this would trigger the actual file download
    const link = document.createElement('a');
    link.href = upload.downloadUrl;
    link.download = upload.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    // console.log(`Downloading ${upload.filename}...`);
  };

  // Campaign handlers
  const handleCreateCampaign = (upload) => {
    setSelectedUpload(upload);
    setIsEditMode(false);
    setEditingCampaign(null);
    setEditModeFile(null);
    setCampaignData({
      name: `${upload.filename.split('.')[0]} Campaign`,
      type: ['email'], // Initialize as array
      template: {}, // Initialize as empty object
      providers: {}, // Initialize as empty object
      scheduleType: 'immediate',
      scheduleDate: '',
      scheduleTime: '',
      targetAudience: 'all',
      advancedScheduling: {
        enabled: false,
        intervals: []
      }
    });
    setActiveStep(0);
    setCampaignDialog(true);
  };

  const handleChangeCampaign = (campaign = null) => {
    // If no campaign is provided, use the most recent active campaign
    const targetCampaign = campaign || activeCampaigns.find(c => c.status === 'active') || activeCampaigns[0];
    
    if (!targetCampaign) {
      setUploadStatus({
        type: 'error',
        message: 'No campaigns available to modify. Please create a campaign first.'
      });
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }
    
    setEditingCampaign(targetCampaign);
    setIsEditMode(true);
    setEditModeFile(null);
    
    // Find the associated upload
    const associatedUpload = uploadHistory.find(upload => upload.id === targetCampaign.uploadId);
    setSelectedUpload(associatedUpload);
    
    // Pre-fill campaign data
    setCampaignData({
      name: targetCampaign.name,
      type: [targetCampaign.type], // Convert single type to array for consistency
      template: { [targetCampaign.type]: targetCampaign.template || '' }, // Pre-fill template if available
      providers: targetCampaign.provider ? { [targetCampaign.type]: targetCampaign.provider.id } : {},
      scheduleType: targetCampaign.status === 'scheduled' ? 'scheduled' : 'immediate',
      scheduleDate: targetCampaign.scheduledAt ? targetCampaign.scheduledAt.split('T')[0] : '',
      scheduleTime: targetCampaign.scheduledAt ? targetCampaign.scheduledAt.split('T')[1]?.substring(0, 5) : '',
      targetAudience: 'all', // Default, could be enhanced to store this in campaign
      advancedScheduling: targetCampaign.advancedScheduling || {
        enabled: false,
        intervals: []
      }
    });
    setActiveStep(0);
    setCampaignDialog(true);
  };

  const handleCampaignSubmit = async () => {
    try {
      // Handle file upload if in edit mode and new file is selected
      if (isEditMode && editModeFile) {
        // In a real implementation, you would upload the new file here
        // For now, we'll simulate the upload process
        // Uploading new file for campaign: editModeFile.name
        
        // Update the selected upload to reflect the new file
        const newUploadEntry = {
          ...selectedUpload,
          filename: editModeFile.name,
          timestamp: new Date().toISOString(),
          fileSize: `${(editModeFile.size / 1024 / 1024).toFixed(2)} MB`,
          // Keep the same records count for simulation
        };
        
        // Update upload history with the new file
        setUploadHistory(prev => prev.map(upload => 
          upload.id === selectedUpload.id ? newUploadEntry : upload
        ));
        
        setSelectedUpload(newUploadEntry);
      }
      
      // Mock contacts from selected upload
      const mockContacts = [
        { phone: '9876543210', email: 'arjun.sharma@gmail.com', name: 'Arjun Sharma' },
        { phone: '9876543211', email: 'meera.kapoor@gmail.com', name: 'Meera Kapoor' },
        { phone: '9876543212', email: 'vikram.singh@gmail.com', name: 'Vikram Singh' },
        { phone: '9876543213', email: 'priyanka.gupta@gmail.com', name: 'Priyanka Gupta' }
      ];
      
      // Perform deduplication and DNC filtering
      const filteredData = await deduplicateContacts(mockContacts, 'CLIENT-001');
      
      if (isEditMode) {
        // Update existing campaign
        const selectedProvider = getProviders(campaignData.type[0]).find(p => p.id === campaignData.providers[campaignData.type[0]]) || getActiveProvider(campaignData.type[0]);
        
        const updatedCampaign = {
          ...editingCampaign,
          name: campaignData.name,
          type: campaignData.type[0], // For edit mode, we only handle single type
          provider: selectedProvider ? {
            id: selectedProvider.id,
            name: selectedProvider.name,
            type: selectedProvider.type
          } : editingCampaign.provider,
          status: campaignData.scheduleType === 'immediate' ? 'active' : 'scheduled',
          uploadId: selectedUpload.id,
          uploadFilename: selectedUpload.filename,
          targetCount: filteredData.allowed.length,
          originalCount: mockContacts.length,
          dncBlocked: filteredData.dncBlocked,
          duplicatesRemoved: filteredData.duplicatesRemoved,
          scheduledAt: campaignData.scheduleType === 'scheduled' 
            ? `${campaignData.scheduleDate}T${campaignData.scheduleTime}:00`
            : editingCampaign.scheduledAt,
          advancedScheduling: campaignData.advancedScheduling.enabled ? {
            enabled: true,
            intervals: campaignData.advancedScheduling.intervals.filter(interval => interval.enabled)
          } : {
            enabled: false,
            intervals: []
          },
          updatedAt: new Date().toISOString()
        };
        
        setActiveCampaigns(prev => prev.map(campaign => 
          campaign.id === editingCampaign.id ? updatedCampaign : campaign
        ));
        setCampaignDialog(false);
      } else {
        // Create separate campaigns for each selected type
        const newCampaigns = campaignData.type.map((type, index) => {
          const selectedProvider = getProviders(type).find(p => p.id === campaignData.providers[type]) || getActiveProvider(type);
          
          return {
          id: `camp-${Date.now()}-${index}`,
          name: campaignData.type.length > 1 
            ? `${campaignData.name} (${type.charAt(0).toUpperCase() + type.slice(1)})`
            : campaignData.name,
          type: type,
            provider: selectedProvider ? {
              id: selectedProvider.id,
              name: selectedProvider.name,
              type: selectedProvider.type
            } : null,
          status: campaignData.scheduleType === 'immediate' ? 'active' : 'scheduled',
          uploadId: selectedUpload.id,
          uploadFilename: selectedUpload.filename,
          targetCount: filteredData.allowed.length,
          originalCount: mockContacts.length,
          dncBlocked: filteredData.dncBlocked,
          duplicatesRemoved: filteredData.duplicatesRemoved,
          sent: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          createdAt: new Date().toISOString(),
          scheduledAt: campaignData.scheduleType === 'scheduled' 
            ? `${campaignData.scheduleDate}T${campaignData.scheduleTime}:00`
              : new Date().toISOString(),
            advancedScheduling: campaignData.advancedScheduling.enabled ? {
              enabled: true,
              intervals: campaignData.advancedScheduling.intervals.filter(interval => interval.enabled)
            } : {
              enabled: false,
              intervals: []
            }
          };
        });
        
        setActiveCampaigns([...newCampaigns, ...activeCampaigns]);
        setCampaignDialog(false);
      }
      
      // Show success message with filtering details
      if (isEditMode) {
        const scheduleText = campaignData.advancedScheduling.enabled 
          ? ` with ${campaignData.advancedScheduling.intervals.filter(i => i.enabled).length} scheduled intervals`
          : '';
        
        let filteringSummary = '';
        if (filteredData.dncBlocked > 0 || filteredData.duplicatesRemoved > 0) {
          const filterDetails = [];
          if (filteredData.duplicatesRemoved > 0) {
            filterDetails.push(`${filteredData.duplicatesRemoved} duplicates removed`);
          }
          if (filteredData.dncBlocked > 0) {
            filterDetails.push(`${filteredData.dncBlocked} blocked by DNC`);
          }
          filteringSummary = ` (${filterDetails.join(', ')})`;
        }
        
        const fileUpdateText = editModeFile ? ` with new file (${editModeFile.name})` : '';
        
        setUploadStatus({
          type: 'success',
          message: `Campaign updated successfully! (${campaignData.type.join(', ').toUpperCase()})${scheduleText}${filteringSummary}${fileUpdateText}`
        });
      } else {
        const campaignCount = campaignData.type.length;
        const campaignText = campaignCount > 1 ? `${campaignCount} campaigns` : 'campaign';
        const scheduleText = campaignData.advancedScheduling.enabled 
          ? ` with ${campaignData.advancedScheduling.intervals.filter(i => i.enabled).length} scheduled intervals`
          : '';
        
        let filteringSummary = '';
        if (filteredData.dncBlocked > 0 || filteredData.duplicatesRemoved > 0) {
          const filterDetails = [];
          if (filteredData.duplicatesRemoved > 0) {
            filterDetails.push(`${filteredData.duplicatesRemoved} duplicates removed`);
          }
          if (filteredData.dncBlocked > 0) {
            filterDetails.push(`${filteredData.dncBlocked} blocked by DNC`);
          }
          filteringSummary = ` (${filterDetails.join(', ')})`;
        }
        
        setUploadStatus({
          type: 'success',
          message: `${campaignText} created successfully! (${campaignData.type.join(', ').toUpperCase()})${scheduleText}${filteringSummary}`
        });
      }
      
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Failed to create campaign. Please try again.'
      });
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
    }
  };

  const handleCampaignAction = (campaignId, action) => {
    setActiveCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: action === 'pause' ? 'paused' : 'active' }
          : campaign
      )
    );
  };

  const getCampaignIcon = (type) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'sms': return <SmsIcon />;
      case 'call': return <PhoneIcon />;
      case 'bot-calling': return <PhoneIcon />;
      default: return <CampaignIcon />;
    }
  };

  const getCampaignStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'scheduled': return 'info';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckIcon color="success" />;
      case 'Processing': return <PendingIcon color="warning" />;
      case 'Failed': return <ErrorIcon color="error" />;
      default: return null;
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Upload Policy Data
          </Typography>
          <Button
            variant="contained"
            startIcon={<CampaignIcon />}
            onClick={() => handleChangeCampaign()}
            disabled={activeCampaigns.length === 0}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
              },
              '&:disabled': {
                opacity: 0.6,
                transform: 'none',
                boxShadow: 'none'
              }
            }}
          >
            Change Campaign
          </Button>
        </Box>
        
                <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={800}>
              <Card 
                elevation={0} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'visible',
                  height: '600px'
                }}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Upload New File
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Upload cases using our template format. Only Excel (.xlsx) or CSV files are supported.
                    </Typography>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadTemplate}
                      sx={{ 
                        mt: 2, 
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Download Template
                    </Button>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      border: `2px dashed ${theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.main, 0.2)}`,
                      borderRadius: 3, 
                      p: 4, 
                      textAlign: 'center',
                      mb: 3,
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.03),
                      transition: 'all 0.2s ease',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: '300px',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.05),
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    <input
                      accept=".xlsx,.csv"
                      style={{ display: 'none' }}
                      id="upload-file-button"
                      type="file"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <label htmlFor="upload-file-button">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <UploadIcon 
                          sx={{ 
                            fontSize: 60, 
                            color: theme.palette.primary.main,
                            opacity: 0.7,
                            mb: 2
                          }} 
                        />
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<UploadIcon />}
                          disabled={uploading}
                          sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                            }
                          }}
                        >
                          {file ? 'Change File' : 'Select File'}
                        </Button>
                        
                        <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                          Drag and drop or click to select
                        </Typography>
                      </Box>
                    </label>
                    
                    {file && (
                      <Zoom in={Boolean(file)}>
                        <Box sx={{ 
                          mt: 3, 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 0.8),
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {file.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {(file.size / 1024).toFixed(2)} KB • {file.type}
                          </Typography>
                        </Box>
                      </Zoom>
                    )}
                  </Box>
                  
                  {file && !uploading && (
                    <Fade in={Boolean(file && !uploading)}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleUpload}
                        fullWidth
                        size="large"
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                          }
                        }}
                      >
                        Upload and Process File
                      </Button>
                    </Fade>
                  )}
                  
                  {uploading && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 500 }}>
                        Uploading... {uploadProgress}%
                      </Typography>
                    </Box>
                  )}
                  
                  {uploadStatus && (
                    <Grow in={Boolean(uploadStatus)}>
                      <Alert 
                        severity={uploadStatus.type} 
                        sx={{ 
                          mt: 3,
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        icon={uploadStatus.type === 'success' ? <CheckIcon /> : <ErrorIcon />}
                      >
                        <AlertTitle>{uploadStatus.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                        {uploadStatus.message}
                      </Alert>
                    </Grow>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={1000}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Uploads ({uploadHistory.length})
                  </Typography>
                  
                  <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.1),
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      }
                    }
                  }}>
                    <List sx={{ px: 1 }}>
                      {uploadHistory.map((upload, index) => (
                        <Grow key={upload.id} in={true} timeout={(index + 1) * 200}>
                          <Box>
                            {index > 0 && <Divider sx={{ my: 2 }} />}
                            <ListItem 
                              alignItems="flex-start" 
                              disableGutters
                              sx={{ px: 1 }}
                            >
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ flex: 1, mr: 2 }}>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        {upload.filename}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {upload.fileSize}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Tooltip title="Create Campaign">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleCreateCampaign(upload)}
                                          disabled={upload.status !== 'Completed'}
                                          sx={{
                                            color: theme.palette.success.main,
                                            '&:hover': {
                                              backgroundColor: alpha(theme.palette.success.main, 0.1),
                                              transform: 'scale(1.1)'
                                            },
                                            '&:disabled': {
                                              color: theme.palette.action.disabled
                                            }
                                          }}
                                        >
                                          <CampaignIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Download File">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleDownloadFile(upload)}
                                          sx={{
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                              transform: 'scale(1.1)'
                                            }
                                          }}
                                        >
                                          <FileDownloadIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Chip 
                                        label={upload.status} 
                                        color={getStatusColor(upload.status)}
                                        size="small"
                                        icon={getStatusIcon(upload.status)}
                                        sx={{ 
                                          fontWeight: 500,
                                          '& .MuiChip-icon': { fontSize: '0.8rem' }
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                      {new Date(upload.timestamp).toLocaleString()}
                                    </Typography>
                                    <Box sx={{ 
                                      mt: 1, 
                                      p: 1.5, 
                                      borderRadius: 2, 
                                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                                      border: `1px solid ${theme.palette.divider}`
                                    }}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="text.secondary">
                                            Total Records
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {upload.records}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="success.main">
                                            Successful
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                            {upload.successful}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Typography variant="body2" color="error.main">
                                            Failed
                                          </Typography>
                                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                                            {upload.failed}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </>
                                }
                              />
                            </ListItem>
                          </Box>
                        </Grow>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          
          <Grid item xs={12}>
            <Grow in={true} timeout={1200}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 3, height: '600px', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Active Campaigns ({activeCampaigns.length})
                  </Typography>
                  
                  <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.1),
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '3px',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      }
                    }
                  }}>
                    {activeCampaigns.length === 0 ? (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center'
                      }}>
                        <CampaignIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Active Campaigns
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Create campaigns from completed uploads to engage with your customers
                        </Typography>
                      </Box>
                    ) : (
                      <List sx={{ px: 1 }}>
                        {activeCampaigns.map((campaign, index) => (
                          <Grow key={campaign.id} in={true} timeout={(index + 1) * 200}>
                            <Box>
                              {index > 0 && <Divider sx={{ my: 2 }} />}
                              <ListItem 
                                alignItems="flex-start" 
                                disableGutters
                                sx={{ px: 1 }}
                              >
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                      <Box sx={{ flex: 1, mr: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                          <Avatar sx={{ 
                                            width: 24, 
                                            height: 24, 
                                            mr: 1, 
                                            bgcolor: theme.palette.primary.main 
                                          }}>
                                            {getCampaignIcon(campaign.type)}
                                          </Avatar>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {campaign.name}
                                          </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                          {campaign.uploadFilename}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {campaign.status === 'active' ? (
                                          <Tooltip title="Pause Campaign">
                                            <IconButton
                                              size="small"
                                              onClick={() => handleCampaignAction(campaign.id, 'pause')}
                                              sx={{ color: theme.palette.warning.main }}
                                            >
                                              <PauseIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        ) : (
                                          <Tooltip title="Resume Campaign">
                                            <IconButton
                                              size="small"
                                              onClick={() => handleCampaignAction(campaign.id, 'resume')}
                                              sx={{ color: theme.palette.success.main }}
                                            >
                                              <PlayIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        )}
                                        <Tooltip title="View Details">
                                          <IconButton
                                            size="small"
                                            sx={{ color: theme.palette.primary.main }}
                                          >
                                            <ViewIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Chip 
                                          label={campaign.status} 
                                          color={getCampaignStatusColor(campaign.status)}
                                          size="small"
                                          sx={{ 
                                            fontWeight: 500,
                                            textTransform: 'capitalize'
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  }
                                  secondary={
                                    <>
                                      <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                        Created: {new Date(campaign.createdAt).toLocaleDateString()}
                                      </Typography>
                                      <Box sx={{ 
                                        mt: 1, 
                                        p: 1.5, 
                                        borderRadius: 2, 
                                        backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                                        border: `1px solid ${theme.palette.divider}`
                                      }}>
                                        <Grid container spacing={2}>
                                          <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                              Target
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                              {campaign.targetCount}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Typography variant="body2" color="primary.main">
                                              Sent
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                              {campaign.sent}
                                            </Typography>
                                          </Grid>
                                          {campaign.type === 'email' && (
                                            <>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="success.main">
                                                  Opened
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                  {campaign.opened}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="warning.main">
                                                  Clicked
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                                  {campaign.clicked}
                                                </Typography>
                                              </Grid>
                                            </>
                                          )}
                                          {campaign.type === 'whatsapp' && (
                                            <>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="success.main">
                                                  Delivered
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                  {campaign.delivered}
                                                </Typography>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Typography variant="body2" color="info.main">
                                                  Read
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                                                  {campaign.read}
                                                </Typography>
                                              </Grid>
                                            </>
                                          )}
                                        </Grid>
                                      </Box>
                                    </>
                                  }
                                />
                              </ListItem>
                            </Box>
                          </Grow>
                        ))}
                      </List>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Campaign Creation Dialog */}
        <Dialog
          open={campaignDialog}
          onClose={() => setCampaignDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <CampaignIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {isEditMode ? 'Change Campaign' : 'Create New Campaign'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUpload?.filename} • {selectedUpload?.successful} customers
                </Typography>
              </Box>
              <IconButton
                onClick={() => setCampaignDialog(false)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Campaign Details</StepLabel>
                <StepContent>
                  {/* File Upload Section - Only in Edit Mode (Change Campaign) */}
                  {isEditMode && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Upload New File
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Upload a new file to replace the current campaign data, or keep the existing file
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          border: `2px dashed ${theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.main, 0.2)}`,
                          borderRadius: 2, 
                          p: 3, 
                          textAlign: 'center',
                          mt: 2,
                          backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.03),
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.05),
                            borderColor: theme.palette.primary.main,
                          }
                        }}
                      >
                        <input
                          accept=".xlsx,.csv"
                          style={{ display: 'none' }}
                          id="campaign-upload-file-button"
                          type="file"
                          onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile) {
                              setEditModeFile(selectedFile);
                            }
                          }}
                        />
                        <label htmlFor="campaign-upload-file-button">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <UploadIcon 
                              sx={{ 
                                fontSize: 40, 
                                color: theme.palette.primary.main,
                                opacity: 0.7,
                                mb: 1
                              }} 
                            />
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<UploadIcon />}
                              size="small"
                              sx={{
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                              }}
                            >
                              {editModeFile ? 'Change File' : 'Select New File'}
                            </Button>
                            
                            <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                              Upload new data file
                            </Typography>
                          </Box>
                        </label>
                        
                        {editModeFile && (
                          <Zoom in={Boolean(editModeFile)}>
                            <Box sx={{ 
                              mt: 2, 
                              p: 1.5, 
                              borderRadius: 2, 
                              backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : alpha(theme.palette.background.paper, 0.8),
                              border: `1px solid ${theme.palette.divider}`
                            }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {editModeFile.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {(editModeFile.size / 1024).toFixed(2)} KB • {editModeFile.type}
                              </Typography>
                            </Box>
                          </Zoom>
                        )}
                      </Box>
                    </Box>
                  )}

                  <Grid container spacing={3} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Campaign Name"
                        value={campaignData.name}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </Grid>
                                         <Grid item xs={12} sm={6}>
                       <FormControl fullWidth>
                         <InputLabel>Campaign Channel</InputLabel>
                         <Select
                           multiple
                           value={campaignData.type}
                           label="Campaign Channel"
                           onChange={(e) => setCampaignData(prev => ({ ...prev, type: e.target.value, template: {} }))}
                           renderValue={(selected) => (
                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                               {selected.map((value) => (
                                 <Chip 
                                   key={value} 
                                   label={value === 'bot-calling' ? 'Bot Calling' : value.charAt(0).toUpperCase() + value.slice(1)}
                                   size="small"
                                   icon={
                                     value === 'email' ? <EmailIcon fontSize="small" /> :
                                     value === 'whatsapp' ? <WhatsAppIcon fontSize="small" /> :
                                     value === 'sms' ? <SmsIcon fontSize="small" /> :
                                     value === 'call' ? <PhoneIcon fontSize="small" /> :
                                     value === 'bot-calling' ? <PhoneIcon fontSize="small" /> :
                                     <PhoneIcon fontSize="small" />
                                   }
                                   sx={{ 
                                     height: 24,
                                     '& .MuiChip-icon': { fontSize: '0.8rem' }
                                   }}
                                 />
                               ))}
                             </Box>
                           )}
                         >
                           <MenuItem value="email">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <EmailIcon fontSize="small" />
                               Email Campaign
                             </Box>
                           </MenuItem>
                           <MenuItem value="whatsapp">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <WhatsAppIcon fontSize="small" />
                               WhatsApp Campaign
                             </Box>
                           </MenuItem>
                           <MenuItem value="sms">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <SmsIcon fontSize="small" />
                               SMS Campaign
                             </Box>
                           </MenuItem>
                           <MenuItem value="call">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <PhoneIcon fontSize="small" />
                               Call Campaign
                             </Box>
                           </MenuItem>
                           <MenuItem value="bot-calling">
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <PhoneIcon fontSize="small" />
                               Bot Calling
                             </Box>
                           </MenuItem>
                         </Select>
                       </FormControl>
                     </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Target Audience</InputLabel>
                        <Select
                          value={campaignData.targetAudience}
                          label="Target Audience"
                          onChange={(e) => setCampaignData(prev => ({ ...prev, targetAudience: e.target.value }))}
                        >
                          <MenuItem value="all">All Customers</MenuItem>
                          <MenuItem value="pending">Pending Renewals Only</MenuItem>
                          <MenuItem value="expired">Expired Policies Only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Provider Selection */}
                  {campaignData.type.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Select Communication Providers
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Choose specific providers for each communication channel
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        {campaignData.type.map((channel) => {
                          const availableProviders = getProviders(channel).filter(p => p.isActive);
                          const defaultProvider = getActiveProvider(channel);
                          
                          return (
                            <Grid item xs={12} md={6} key={channel}>
                              <FormControl fullWidth>
                                <InputLabel>
                                  {channel.charAt(0).toUpperCase() + channel.slice(1)} Provider
                                </InputLabel>
                                <Select
                                  value={campaignData.providers[channel] || defaultProvider?.id || ''}
                                  label={`${channel.charAt(0).toUpperCase() + channel.slice(1)} Provider`}
                                  onChange={(e) => setCampaignData(prev => ({
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
                    <Button onClick={() => setCampaignDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(1)}
                      disabled={!campaignData.name || !campaignData.type}
                    >
                      {isEditMode ? 'Next: Update Template' : 'Next: Select Template'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Template Selection</StepLabel>
                <StepContent>
                                     <Typography variant="body2" color="text.secondary" gutterBottom>
                     {campaignData.type.length > 1 
                       ? 'Choose templates for each selected campaign type'
                       : 'Choose from predefined templates or create a custom one'
                     }
                   </Typography>
                   
                   {campaignData.type.map((type) => (
                     <Box key={type} sx={{ mt: 3 }}>
                       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                         {type === 'email' && <EmailIcon fontSize="small" />}
                         {type === 'whatsapp' && <WhatsAppIcon fontSize="small" />}
                         {type === 'sms' && <SmsIcon fontSize="small" />}
                         {type === 'call' && <PhoneIcon fontSize="small" />}
                         {type === 'bot-calling' && <PhoneIcon fontSize="small" />}
                         {type === 'bot-calling' ? 'Bot Calling' : type.charAt(0).toUpperCase() + type.slice(1)} Template
                       </Typography>
                       
                       <FormControl fullWidth>
                         <InputLabel>Select {type === 'bot-calling' ? 'Bot Calling' : type.charAt(0).toUpperCase() + type.slice(1)} Template</InputLabel>
                         <Select
                           value={campaignData.template[type] || ''}
                           label={`Select ${type === 'bot-calling' ? 'Bot Calling' : type.charAt(0).toUpperCase() + type.slice(1)} Template`}
                           onChange={(e) => setCampaignData(prev => ({ 
                             ...prev, 
                             template: { ...prev.template, [type]: e.target.value }
                           }))}
                         >
                           {templates[type]?.map((template) => (
                             <MenuItem key={template.id} value={template.id}>
                               <Box>
                                 <Typography variant="body1">{template.name}</Typography>
                                 <Typography variant="caption" color="text.secondary">
                                   {template.subject || template.script || template.content.substring(0, 50) + '...'}
                                 </Typography>
                               </Box>
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                       
                       {campaignData.template[type] && (
                         <Box sx={{ 
                           mt: 2, 
                           p: 2, 
                           borderRadius: 2, 
                           backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.default, 0.8),
                           border: `1px solid ${theme.palette.divider}`
                         }}>
                           <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                             Template Preview:
                           </Typography>
                           {(() => {
                             const template = templates[type]?.find(t => t.id === campaignData.template[type]);
                             return (
                               <Box>
                                 {template?.subject && (
                                   <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                     Subject: {template.subject}
                                   </Typography>
                                 )}
                                 <Typography variant="body2" color="text.secondary">
                                   {template?.content}
                                 </Typography>
                               </Box>
                             );
                           })()}
                         </Box>
                       )}
                     </Box>
                   ))}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setActiveStep(0)}>
                      Back
                    </Button>
                                         <Button
                       variant="contained"
                       onClick={() => setActiveStep(2)}
                       disabled={!campaignData.type.every(type => campaignData.template[type])}
                     >
                       Next: Basic Schedule
                     </Button>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Basic Schedule</StepLabel>
                <StepContent>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Schedule Type</InputLabel>
                    <Select
                      value={campaignData.scheduleType}
                      label="Schedule Type"
                      onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleType: e.target.value }))}
                    >
                      <MenuItem value="immediate">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PlayIcon fontSize="small" />
                          Send Immediately
                        </Box>
                      </MenuItem>
                      <MenuItem value="scheduled">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon fontSize="small" />
                          Schedule for Later
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  
                  {campaignData.scheduleType === 'scheduled' && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Schedule Date"
                          value={campaignData.scheduleDate}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleDate: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: new Date().toISOString().split('T')[0] }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Schedule Time"
                          value={campaignData.scheduleTime}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  )}

                  <FormControlLabel
                    control={
                      <Switch
                        checked={campaignData.advancedScheduling.enabled}
                        onChange={(e) => setCampaignData(prev => ({ 
                          ...prev, 
                          advancedScheduling: { ...prev.advancedScheduling, enabled: e.target.checked }
                        }))}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimelineIcon fontSize="small" />
                        <Typography variant="body2">
                          Enable Advanced Scheduling (Multi-channel intervals)
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />

                  {campaignData.advancedScheduling.enabled && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Advanced scheduling allows you to set up multiple communications at different intervals across various channels.
                        This will be configured in the next step.
                      </Typography>
                    </Alert>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setActiveStep(1)}>
                      Back
                    </Button>
                    {campaignData.advancedScheduling.enabled ? (
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                        disabled={campaignData.scheduleType === 'scheduled' && (!campaignData.scheduleDate || !campaignData.scheduleTime)}
                      >
                        Next: Advanced Schedule
                      </Button>
                    ) : (
                    <Button
                      variant="contained"
                      onClick={handleCampaignSubmit}
                      disabled={campaignData.scheduleType === 'scheduled' && (!campaignData.scheduleDate || !campaignData.scheduleTime)}
                    >
                      {isEditMode ? 'Update Campaign' : 'Create Campaign'}
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
                            channel: 'email',
                            delay: 1,
                            delayUnit: 'days',
                            template: '',
                            enabled: true,
                            conditions: {
                              sendIfNoResponse: true,
                              sendIfNoAction: false
                            }
                          };
                          setCampaignData(prev => ({
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

                    {campaignData.advancedScheduling.intervals.length === 0 ? (
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          No intervals configured yet. Add your first communication interval above.
                        </Typography>
                      </Paper>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {campaignData.advancedScheduling.intervals.map((interval, index) => (
                          <Accordion key={interval.id} defaultExpanded={index === 0}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Avatar sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  bgcolor: interval.channel === 'email' ? '#1976d2' : 
                                           interval.channel === 'whatsapp' ? '#25d366' : 
                                           interval.channel === 'sms' ? '#ff9800' : 
                                           interval.channel === 'call' ? '#9c27b0' : 
                                           interval.channel === 'bot-calling' ? '#673ab7' : '#9c27b0'
                                }}>
                                  {interval.channel === 'email' && <EmailIcon fontSize="small" />}
                                  {interval.channel === 'whatsapp' && <WhatsAppIcon fontSize="small" />}
                                  {interval.channel === 'sms' && <SmsIcon fontSize="small" />}
                                  {interval.channel === 'call' && <PhoneIcon fontSize="small" />}
                                  {interval.channel === 'bot-calling' && <PhoneIcon fontSize="small" />}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {interval.channel === 'bot-calling' ? 'Bot Calling' : interval.channel.charAt(0).toUpperCase() + interval.channel.slice(1)} - 
                                    After {interval.delay} {interval.delayUnit}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {interval.template ? templates[interval.channel]?.find(t => t.id === interval.template)?.name : 'No template selected'}
                                  </Typography>
                                </Box>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={interval.enabled}
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, enabled: e.target.checked } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  }
                                  label=""
                                  sx={{ mr: 1 }}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>Channel</InputLabel>
                                    <Select
                                      value={interval.channel}
                                      label="Channel"
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, channel: e.target.value, template: '' } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                    >
                                      <MenuItem value="email">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <EmailIcon fontSize="small" />
                                          Email
                                        </Box>
                                      </MenuItem>
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
                                      <MenuItem value="call">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <PhoneIcon fontSize="small" />
                                          Call
                                        </Box>
                                      </MenuItem>
                                      <MenuItem value="bot-calling">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <PhoneIcon fontSize="small" />
                                          Bot Calling
                                        </Box>
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                      label="Delay"
                                      type="number"
                                      value={interval.delay}
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, delay: parseInt(e.target.value) || 1 } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                      inputProps={{ min: 1 }}
                                      sx={{ width: '70px' }}
                                    />
                                    <FormControl sx={{ minWidth: 100 }}>
                                      <InputLabel>Unit</InputLabel>
                                      <Select
                                        value={interval.delayUnit}
                                        label="Unit"
                                        onChange={(e) => {
                                          const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                            int.id === interval.id ? { ...int, delayUnit: e.target.value } : int
                                          );
                                          setCampaignData(prev => ({
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
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <FormControl fullWidth>
                                    <InputLabel>Template</InputLabel>
                                    <Select
                                      value={interval.template}
                                      label="Template"
                                      onChange={(e) => {
                                        const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                          int.id === interval.id ? { ...int, template: e.target.value } : int
                                        );
                                        setCampaignData(prev => ({
                                          ...prev,
                                          advancedScheduling: {
                                            ...prev.advancedScheduling,
                                            intervals: updatedIntervals
                                          }
                                        }));
                                      }}
                                    >
                                      {templates[interval.channel]?.map((template) => (
                                        <MenuItem key={template.id} value={template.id}>
                                          {template.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Trigger Conditions
                                  </Typography>
                                  <FormGroup row>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={interval.conditions.sendIfNoResponse}
                                          onChange={(e) => {
                                            const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                              int.id === interval.id ? { 
                                                ...int, 
                                                conditions: { ...int.conditions, sendIfNoResponse: e.target.checked }
                                              } : int
                                            );
                                            setCampaignData(prev => ({
                                              ...prev,
                                              advancedScheduling: {
                                                ...prev.advancedScheduling,
                                                intervals: updatedIntervals
                                              }
                                            }));
                                          }}
                                        />
                                      }
                                      label="Send if no response to previous message"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={interval.conditions.sendIfNoAction}
                                          onChange={(e) => {
                                            const updatedIntervals = campaignData.advancedScheduling.intervals.map(int => 
                                              int.id === interval.id ? { 
                                                ...int, 
                                                conditions: { ...int.conditions, sendIfNoAction: e.target.checked }
                                              } : int
                                            );
                                            setCampaignData(prev => ({
                                              ...prev,
                                              advancedScheduling: {
                                                ...prev.advancedScheduling,
                                                intervals: updatedIntervals
                                              }
                                            }));
                                          }}
                                        />
                                      }
                                      label="Send if no action taken (click/conversion)"
                                    />
                                  </FormGroup>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                      const updatedIntervals = campaignData.advancedScheduling.intervals.filter(int => int.id !== interval.id);
                                      setCampaignData(prev => ({
                                        ...prev,
                                        advancedScheduling: {
                                          ...prev.advancedScheduling,
                                          intervals: updatedIntervals
                                        }
                                      }));
                                    }}
                                  >
                                    Remove Interval
                                  </Button>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button onClick={() => setActiveStep(2)}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCampaignSubmit}
                      disabled={campaignData.advancedScheduling.intervals.length === 0 || 
                               campaignData.advancedScheduling.intervals.some(int => int.enabled && !int.template)}
                    >
                      {isEditMode ? 'Update Advanced Campaign' : 'Create Advanced Campaign'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Upload;