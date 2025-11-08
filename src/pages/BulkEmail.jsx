import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Grow
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Merge as MergeIcon,
  Settings as SettingsIcon,
  Pause as PauseIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const BulkEmail = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Main states
  const [recipients, setRecipients] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [mailMergeEnabled, setMailMergeEnabled] = useState(false);
  const [selectedMergeTemplate, setSelectedMergeTemplate] = useState('');
  
  // Dialog states
  const [recipientDialog, setRecipientDialog] = useState({ open: false });
  const [templatePreviewDialog, setTemplatePreviewDialog] = useState({ open: false, template: null });

  const [mergeConfigDialog, setMergeConfigDialog] = useState({ open: false });
  const [sendConfirmDialog, setSendConfirmDialog] = useState({ open: false });
  
  // Campaign states
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaignProgress, setCampaignProgress] = useState(0);
  
  // Form states
  const [newRecipient, setNewRecipient] = useState({ email: '', name: '', company: '' });
  const [bulkRecipientText, setBulkRecipientText] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  // Email templates (same as EmailInbox)
  const emailTemplates = [
    {
      id: 'policy_renewal',
      name: 'Policy Renewal Reminder',
      category: 'renewal',
      subject: 'Important: Your {{policyType}} Policy Renewal - {{policyNumber}}',
      body: `Dear {{customerName}},

We hope this message finds you well. This is a friendly reminder that your {{policyType}} policy (Policy #{{policyNumber}}) is due for renewal on {{renewalDate}}.

Policy Details:
- Policy Number: {{policyNumber}}
- Policy Type: {{policyType}}
- Current Premium: {{currentPremium}}
- Renewal Date: {{renewalDate}}

To ensure continuous coverage, please review and renew your policy before the expiration date. You can:
- Renew online at our customer portal
- Call our customer service at (555) 123-4567
- Visit any of our branch offices

Thank you for choosing Renew-iQ Insurance for your insurance needs.

Best regards,
{{agentName}}
Renew-iQ Insurance Team`
    },
    {
      id: 'policy_document',
      name: 'Policy Document Delivery',
      category: 'document',
      subject: 'Your {{policyType}} Policy Documents - {{policyNumber}}',
      body: `Dear {{customerName}},

Thank you for choosing Renew-iQ Insurance. Please find attached your policy documents for {{policyType}} policy.

Policy Information:
- Policy Number: {{policyNumber}}
- Policy Type: {{policyType}}
- Effective Date: {{effectiveDate}}
- Premium Amount: {{premiumAmount}}

The attached documents include:
- Policy Certificate
- Terms and Conditions
- Coverage Summary
- Payment Schedule

Please review these documents carefully and contact us if you have any questions.

Best regards,
{{agentName}}
Renew-iQ Insurance Team`
    },
    {
      id: 'payment_reminder',
      name: 'Payment Reminder',
      category: 'payment',
      subject: 'Payment Reminder - Policy {{policyNumber}}',
      body: `Dear {{customerName}},

This is a friendly reminder that your premium payment for policy {{policyNumber}} is due on {{dueDate}}.

Payment Details:
- Policy Number: {{policyNumber}}
- Amount Due: {{amountDue}}
- Due Date: {{dueDate}}
- Payment Method: {{paymentMethod}}

To avoid any interruption in coverage, please make your payment by the due date. You can pay:
- Online through our customer portal
- By phone at (555) 123-4567
- At any of our branch locations

Thank you for your prompt attention to this matter.

Best regards,
Customer Service Team
Renew-iQ Insurance`
    },
    {
      id: 'welcome_new_customer',
      name: 'Welcome New Customer',
      category: 'welcome',
      subject: 'Welcome to Renew-iQ Insurance - {{customerName}}',
      body: `Dear {{customerName}},

Welcome to the Renew-iQ Insurance family! We're thrilled to have you as our valued customer.

Your Policy Details:
- Policy Number: {{policyNumber}}
- Policy Type: {{policyType}}
- Agent: {{agentName}}
- Start Date: {{startDate}}

What's Next:
1. You'll receive your policy documents within 2-3 business days
2. Download our mobile app for easy policy management
3. Set up your online account at our customer portal
4. Save our customer service number: (555) 123-4567

We're committed to providing you with exceptional service and comprehensive coverage. If you have any questions, please don't hesitate to contact us.

Welcome aboard!

{{agentName}}
Renew-iQ Insurance Team`
    },
    {
      id: 'claim_update',
      name: 'Claim Status Update',
      category: 'claim',
      subject: 'Claim Update - {{claimNumber}}',
      body: `Dear {{customerName}},

We wanted to update you on the status of your insurance claim.

Claim Information:
- Claim Number: {{claimNumber}}
- Policy Number: {{policyNumber}}
- Date of Loss: {{lossDate}}
- Current Status: {{claimStatus}}

{{updateMessage}}

Next Steps:
{{nextSteps}}

If you have any questions about your claim, please contact your claims adjuster {{adjusterName}} at {{adjusterPhone}} or email {{adjusterEmail}}.

Thank you for your patience as we work to resolve your claim.

Sincerely,
Claims Department
Renew-iQ Insurance`
    }
  ];

  // Mail merge templates
  const mailMergeTemplates = [
    {
      id: 'policy_certificates',
      name: 'Policy Certificates',
      description: 'Send personalized policy certificates to customers',
      documentType: 'PDF',
      fields: ['customerName', 'policyNumber', 'policyType', 'effectiveDate', 'expiryDate', 'premiumAmount']
    },
    {
      id: 'renewal_notices',
      name: 'Renewal Notices',
      description: 'Automated renewal notices with policy details',
      documentType: 'PDF',
      fields: ['customerName', 'policyNumber', 'renewalDate', 'currentPremium', 'newPremium']
    },
    {
      id: 'payment_receipts',
      name: 'Payment Receipts',
      description: 'Payment confirmation receipts',
      documentType: 'PDF',
      fields: ['customerName', 'policyNumber', 'paymentAmount', 'paymentDate', 'receiptNumber']
    }
  ];

  const loadCampaigns = () => {
    // Mock campaign data
    const mockCampaigns = [
      {
        id: 1,
        name: 'Q4 Policy Renewals',
        status: 'completed',
        recipients: 1247,
        sent: 1247,
        delivered: 1198,
        opened: 856,
        clicked: 234,
        createdDate: '2024-07-10',
        scheduledDate: '2024-07-15'
      },
      {
        id: 2,
        name: 'New Customer Welcome',
        status: 'in_progress',
        recipients: 89,
        sent: 67,
        delivered: 65,
        opened: 23,
        clicked: 8,
        createdDate: '2024-07-14',
        scheduledDate: '2024-07-14'
      }
    ];
    setCampaigns(mockCampaigns);
  };

  const handleAddRecipient = () => {
    if (newRecipient.email && newRecipient.name) {
      setRecipients([...recipients, { ...newRecipient, id: Date.now() }]);
      setNewRecipient({ email: '', name: '', company: '' });
    }
  };

  const handleBulkAddRecipients = () => {
    const lines = bulkRecipientText.split('\n').filter(line => line.trim());
    const newRecipients = lines.map((line, index) => {
      const parts = line.split(',').map(part => part.trim());
      return {
        id: Date.now() + index,
        email: parts[0] || '',
        name: parts[1] || '',
        company: parts[2] || ''
      };
    }).filter(recipient => recipient.email);
    
    setRecipients([...recipients, ...newRecipients]);
    setBulkRecipientText('');
  };

  const handleRemoveRecipient = (id) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const processTemplate = (template, recipient) => {
    let processedSubject = template.subject;
    let processedBody = template.body;
    
    const variables = {
      customerName: recipient.name || 'Valued Customer',
      policyNumber: 'POL-2024-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      policyType: 'Comprehensive Auto Insurance',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      currentPremium: '$1,250.00',
      agentName: 'Sarah Johnson',
      effectiveDate: new Date().toLocaleDateString(),
      premiumAmount: '$1,250.00',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      amountDue: '$312.50',
      paymentMethod: 'Auto-Pay',
      startDate: new Date().toLocaleDateString(),
      claimNumber: 'CLM-2024-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      lossDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      claimStatus: 'Under Review',
      updateMessage: 'Your claim is currently being reviewed by our claims team.',
      nextSteps: 'We will contact you within 3-5 business days with an update.',
      adjusterName: 'Mike Wilson',
      adjusterPhone: '(555) 123-4567',
      adjusterEmail: 'mike.wilson@renewiq.com'
    };
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedSubject = processedSubject.replace(regex, value);
      processedBody = processedBody.replace(regex, value);
    });
    
    return { subject: processedSubject, body: processedBody };
  };

  const handleSendCampaign = () => {
    const campaign = {
      id: Date.now(),
      name: `Campaign ${new Date().toLocaleDateString()}`,
      status: 'sending',
      recipients: recipients.length,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      createdDate: new Date().toISOString().split('T')[0],
      scheduledDate: isScheduled ? `${scheduledDate} ${scheduledTime}` : new Date().toISOString().split('T')[0]
    };
    
    setActiveCampaign(campaign);
    setCampaigns([campaign, ...campaigns]);
    
    // Simulate sending progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setActiveCampaign({ ...campaign, status: 'completed', sent: recipients.length });
      }
      setCampaignProgress(progress);
    }, 500);
    
    setSendConfirmDialog({ open: false });
  };



  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Box>
            <Typography variant="h4" fontWeight="600">
              Bulk Email Campaign
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Send personalized emails to multiple recipients with templates and mail merge
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<SettingsIcon />}
              variant="outlined"
              onClick={() => setMergeConfigDialog({ open: true })}
              sx={{ borderRadius: 2 }}
            >
              Mail Merge Settings
            </Button>
            <Button
              startIcon={<SendIcon />}
              variant="contained"
              onClick={() => setSendConfirmDialog({ open: true })}
              disabled={recipients.length === 0 || !selectedTemplate}
              sx={{ borderRadius: 2 }}
            >
              Send Campaign
            </Button>
          </Box>
        </Box>

        {/* Campaign Progress */}
        {activeCampaign && activeCampaign.status === 'sending' && (
          <Grow in={true}>
            <Alert 
              severity="info" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {Math.round(campaignProgress)}%
                  </Typography>
                  <IconButton size="small" color="inherit">
                    {/* eslint-disable-next-line */}
                    <PauseIcon />
                  </IconButton>
                </Box>
              }
            >
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Sending Campaign: {activeCampaign.name}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={campaignProgress} 
                  sx={{ mt: 1, borderRadius: 1 }}
                />
              </Box>
            </Alert>
          </Grow>
        )}

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Panel - Campaign Builder */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {/* Step 1: Recipients */}
                <Step>
                  <StepLabel>
                    <Typography variant="h6" fontWeight={600}>
                      Select Recipients ({recipients.length})
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Email"
                            value={newRecipient.email}
                            onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Name"
                            value={newRecipient.name}
                            onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Company"
                            value={newRecipient.company}
                            onChange={(e) => setNewRecipient({ ...newRecipient, company: e.target.value })}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={handleAddRecipient}
                            startIcon={<AddIcon />}
                            size="small"
                            sx={{ height: 40 }}
                          >
                            Add
                          </Button>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button
                          startIcon={<UploadIcon />}
                          variant="outlined"
                          onClick={() => setRecipientDialog({ open: true })}
                          size="small"
                        >
                          Bulk Import
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          variant="outlined"
                          size="small"
                        >
                          Export Template
                        </Button>
                      </Box>

                      {recipients.length > 0 && (
                        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell width={50}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {recipients.map((recipient) => (
                                <TableRow key={recipient.id}>
                                  <TableCell>{recipient.email}</TableCell>
                                  <TableCell>{recipient.name}</TableCell>
                                  <TableCell>{recipient.company}</TableCell>
                                  <TableCell>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleRemoveRecipient(recipient.id)}
                                      color="error"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(1)}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={recipients.length === 0}
                      >
                        Continue
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 2: Template Selection */}
                <Step>
                  <StepLabel>
                    <Typography variant="h6" fontWeight={600}>
                      Choose Email Template
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      {emailTemplates.map((template) => (
                        <Grid item xs={12} sm={6} key={template.id}>
                          <Card 
                            sx={{ 
                              cursor: 'pointer',
                              border: selectedTemplate === template.id ? 2 : 1,
                              borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: 'primary.main',
                                boxShadow: 2
                              }
                            }}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    {template.name}
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTemplatePreviewDialog({ open: true, template });
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Chip 
                                label={template.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ mb: 1 }}
                              />
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                {template.body.substring(0, 100)}...
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Custom Subject (Optional)"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Additional Message (Optional)"
                        multiline
                        rows={3}
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(2)}
                        sx={{ mt: 1, mr: 1 }}
                        disabled={!selectedTemplate}
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={() => setActiveStep(0)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 3: Settings */}
                <Step>
                  <StepLabel>
                    <Typography variant="h6" fontWeight={600}>
                      Configure Settings
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Grid container spacing={3} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Scheduling
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={isScheduled}
                                onChange={(e) => setIsScheduled(e.target.checked)}
                              />
                            }
                            label="Schedule for later"
                            sx={{ mb: 2 }}
                          />
                          
                          {isScheduled && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <TextField
                                type="date"
                                label="Date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                              />
                              <TextField
                                type="time"
                                label="Time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                              />
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Mail Merge
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch 
                                checked={mailMergeEnabled}
                                onChange={(e) => setMailMergeEnabled(e.target.checked)}
                              />
                            }
                            label="Enable mail merge documents"
                            sx={{ mb: 2 }}
                          />
                          
                          {mailMergeEnabled && (
                            <FormControl fullWidth size="small">
                              <InputLabel>Merge Template</InputLabel>
                              <Select
                                value={selectedMergeTemplate}
                                label="Merge Template"
                                onChange={(e) => setSelectedMergeTemplate(e.target.value)}
                              >
                                {mailMergeTemplates.map((template) => (
                                  <MenuItem key={template.id} value={template.id}>
                                    {template.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mb: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(3)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={() => setActiveStep(1)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 4: Review */}
                <Step>
                  <StepLabel>
                    <Typography variant="h6" fontWeight={600}>
                      Review & Send
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Campaign Summary
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon><GroupIcon /></ListItemIcon>
                              <ListItemText primary={`${recipients.length} recipients`} />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><EmailIcon /></ListItemIcon>
                              <ListItemText primary={emailTemplates.find(t => t.id === selectedTemplate)?.name || 'No template'} />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><ScheduleIcon /></ListItemIcon>
                              <ListItemText primary={isScheduled ? `${scheduledDate} at ${scheduledTime}` : 'Send immediately'} />
                            </ListItem>
                            {mailMergeEnabled && (
                              <ListItem>
                                <ListItemIcon><MergeIcon /></ListItemIcon>
                                <ListItemText primary={mailMergeTemplates.find(t => t.id === selectedMergeTemplate)?.name || 'No merge template'} />
                              </ListItem>
                            )}
                          </List>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Preview
                          </Typography>
                          {selectedTemplate && recipients.length > 0 && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Sample for: {recipients[0].name}
                              </Typography>
                              <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                  {processTemplate(emailTemplates.find(t => t.id === selectedTemplate), recipients[0]).subject}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    mt: 1
                                  }}
                                >
                                  {processTemplate(emailTemplates.find(t => t.id === selectedTemplate), recipients[0]).body}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mb: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => setSendConfirmDialog({ open: true })}
                        sx={{ mt: 1, mr: 1 }}
                        startIcon={<SendIcon />}
                      >
                        Send Campaign
                      </Button>
                      <Button
                        onClick={() => setActiveStep(2)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </Paper>
          </Grid>

          {/* Right Panel - Campaign History */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Campaigns
              </Typography>
              
              {campaigns.map((campaign) => (
                <Card key={campaign.id} sx={{ mb: 2, borderRadius: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {campaign.name}
                      </Typography>
                      <Chip 
                        label={campaign.status} 
                        size="small" 
                        color={campaign.status === 'completed' ? 'success' : campaign.status === 'in_progress' ? 'primary' : 'default'}
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      {campaign.recipients} recipients • {campaign.createdDate}
                    </Typography>
                    
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">Delivered</Typography>
                        <Typography variant="caption">{campaign.delivered}/{campaign.recipients}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(campaign.delivered / campaign.recipients) * 100} 
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Opened: {campaign.opened}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Clicked: {campaign.clicked}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Dialogs */}
        
        {/* Bulk Recipients Dialog */}
        <Dialog 
          open={recipientDialog.open} 
          onClose={() => setRecipientDialog({ open: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Bulk Import Recipients</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter one recipient per line in the format: email, name, company
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              placeholder="arjun@example.com, Arjun Sharma, ABC Company&#10;meera@example.com, Meera Kapoor, XYZ Corp"
              value={bulkRecipientText}
              onChange={(e) => setBulkRecipientText(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecipientDialog({ open: false })}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                handleBulkAddRecipients();
                setRecipientDialog({ open: false });
              }}
              variant="contained"
            >
              Import Recipients
            </Button>
          </DialogActions>
        </Dialog>

        {/* Template Preview Dialog */}
        <Dialog 
          open={templatePreviewDialog.open} 
          onClose={() => setTemplatePreviewDialog({ open: false, template: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Template Preview: {templatePreviewDialog.template?.name}
          </DialogTitle>
          <DialogContent>
            {templatePreviewDialog.template && recipients.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Subject:
                </Typography>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body1">
                    {processTemplate(templatePreviewDialog.template, recipients[0]).subject}
                  </Typography>
                </Paper>
                
                <Typography variant="subtitle2" gutterBottom>
                  Message Body:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ whiteSpace: 'pre-line' }}
                  >
                    {processTemplate(templatePreviewDialog.template, recipients[0]).body}
                  </Typography>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTemplatePreviewDialog({ open: false, template: null })}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setSelectedTemplate(templatePreviewDialog.template.id);
                setTemplatePreviewDialog({ open: false, template: null });
              }}
              variant="contained"
            >
              Use This Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Send Confirmation Dialog */}
        <Dialog 
          open={sendConfirmDialog.open} 
          onClose={() => setSendConfirmDialog({ open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Send Campaign</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to send this email campaign?
            </Typography>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2">
                • {recipients.length} recipients
              </Typography>
              <Typography variant="body2">
                • Template: {emailTemplates.find(t => t.id === selectedTemplate)?.name}
              </Typography>
              <Typography variant="body2">
                • {isScheduled ? `Scheduled for ${scheduledDate} at ${scheduledTime}` : 'Send immediately'}
              </Typography>
              {mailMergeEnabled && (
                <Typography variant="body2">
                  • Mail merge: {mailMergeTemplates.find(t => t.id === selectedMergeTemplate)?.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSendConfirmDialog({ open: false })}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendCampaign}
              variant="contained"
              color="primary"
            >
              {isScheduled ? 'Schedule Campaign' : 'Send Now'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mail Merge Configuration Dialog */}
        <Dialog 
          open={mergeConfigDialog.open} 
          onClose={() => setMergeConfigDialog({ open: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Mail Merge Configuration</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Configure mail merge templates for automated document generation
            </Typography>
            
            {mailMergeTemplates.map((template) => (
              <Card key={template.id} sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {template.name}
                    </Typography>
                    <Chip label={template.documentType} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Available Fields:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {template.fields.map((field) => (
                      <Chip key={field} label={field} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMergeConfigDialog({ open: false })}>
              Close
            </Button>
            <Button variant="contained">
              Save Configuration
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default BulkEmail; 