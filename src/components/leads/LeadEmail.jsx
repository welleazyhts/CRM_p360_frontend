import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Template as TemplateIcon
} from '@mui/icons-material';

// Mock email templates
const emailTemplates = [
  {
    id: 1,
    name: 'Initial Contact',
    subject: 'Welcome to Our Insurance Services',
    body: `Dear {{firstName}},

Thank you for your interest in our insurance services. We're excited to help you find the perfect coverage for your needs.

Our team of experts is ready to provide you with personalized solutions that fit your budget and requirements.

Would you be available for a brief call this week to discuss your insurance needs?

Best regards,
{{assignedTo}}`
  },
  {
    id: 2,
    name: 'Follow-up',
    subject: 'Following up on your insurance inquiry',
    body: `Hi {{firstName}},

I wanted to follow up on our previous conversation about insurance options for {{company}}.

I've prepared some customized quotes based on your requirements. Would you be available for a call to review these options?

Looking forward to hearing from you.

Best regards,
{{assignedTo}}`
  },
  {
    id: 3,
    name: 'Proposal',
    subject: 'Insurance Proposal for {{company}}',
    body: `Dear {{firstName}},

As discussed, I'm pleased to present our comprehensive insurance proposal for {{company}}.

The proposal includes:
- Comprehensive coverage options
- Competitive pricing
- Flexible payment terms
- 24/7 customer support

Please review the attached proposal and let me know if you have any questions.

Best regards,
{{assignedTo}}`
  },
  {
    id: 4,
    name: 'Meeting Reminder',
    subject: 'Reminder: Meeting scheduled for {{meetingDate}}',
    body: `Hi {{firstName}},

This is a friendly reminder about our scheduled meeting on {{meetingDate}} at {{meetingTime}}.

We'll be discussing:
- Your insurance requirements
- Available coverage options
- Pricing and terms

If you need to reschedule, please let me know as soon as possible.

Best regards,
{{assignedTo}}`
  }
];

const LeadEmail = ({ open, onClose, lead, onSend }) => {
  const theme = useTheme();
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    template: '',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open && lead) {
      setEmailData({
        to: lead.email,
        cc: '',
        bcc: '',
        subject: '',
        body: '',
        template: '',
        attachments: []
      });
      setError('');
      setSuccess('');
    }
  }, [open, lead]);

  const handleTemplateChange = (templateId) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      const processedSubject = processTemplate(template.subject);
      const processedBody = processTemplate(template.body);
      
      setEmailData(prev => ({
        ...prev,
        template: templateId,
        subject: processedSubject,
        body: processedBody
      }));
    }
  };

  const processTemplate = (text) => {
    if (!lead) return text;
    
    return text
      .replace(/\{\{firstName\}\}/g, lead.firstName || '')
      .replace(/\{\{lastName\}\}/g, lead.lastName || '')
      .replace(/\{\{company\}\}/g, lead.company || '')
      .replace(/\{\{assignedTo\}\}/g, lead.assignedTo || '')
      .replace(/\{\{meetingDate\}\}/g, new Date().toLocaleDateString())
      .replace(/\{\{meetingTime\}\}/g, '2:00 PM');
  };

  const handleSend = async () => {
    if (!emailData.subject.trim() || !emailData.body.trim()) {
      setError('Please fill in both subject and body');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the onSend callback with email data
      if (onSend) {
        onSend({
          ...emailData,
          leadId: lead?.id,
          sentAt: new Date().toISOString()
        });
      }
      
      setSuccess('Email sent successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttachFile = () => {
    // In a real app, this would open a file picker
    const mockFile = {
      id: Date.now(),
      name: 'insurance_proposal.pdf',
      size: '2.3 MB',
      type: 'application/pdf'
    };
    
    setEmailData(prev => ({
      ...prev,
      attachments: [...prev.attachments, mockFile]
    }));
  };

  const handleRemoveAttachment = (attachmentId) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon color="primary" />
          <Typography variant="h6">
            Send Email
          </Typography>
        </Box>
        {lead && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip
              icon={<PersonIcon />}
              label={`${lead.firstName} ${lead.lastName}`}
              size="small"
              sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
            />
            <Chip
              icon={<BusinessIcon />}
              label={lead.company}
              size="small"
              sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.1) }}
            />
          </Box>
        )}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Email Template</InputLabel>
            <Select
              value={emailData.template}
              label="Email Template"
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <MenuItem value="">
                <em>Custom Email</em>
              </MenuItem>
              {emailTemplates.map(template => (
                <MenuItem key={template.id} value={template.id}>
                  <Box>
                    <Typography variant="subtitle2">{template.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {template.subject}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="To"
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="CC"
              value={emailData.cc}
              onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Subject"
          value={emailData.subject}
          onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Message"
          multiline
          rows={12}
          value={emailData.body}
          onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
          required
          sx={{ mb: 2 }}
        />

        {/* Attachments */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2">Attachments</Typography>
            <Button
              size="small"
              startIcon={<AttachFileIcon />}
              onClick={handleAttachFile}
            >
              Attach File
            </Button>
          </Box>
          
          {emailData.attachments.length > 0 && (
            <List dense>
              {emailData.attachments.map((attachment) => (
                <ListItem key={attachment.id}>
                  <ListItemIcon>
                    <AttachFileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={attachment.name}
                    secondary={`${attachment.size} • ${attachment.type}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Email Preview */}
        {emailData.subject && emailData.body && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview
            </Typography>
            <Box
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Subject: {emailData.subject}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {emailData.body}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={loading || !emailData.subject.trim() || !emailData.body.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadEmail;
