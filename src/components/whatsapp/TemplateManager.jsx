import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip,
  useTheme, alpha, Snackbar, Alert, Divider, Stack, Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Smartphone as PhoneIcon,
  Message as MessageIcon,
  Send as SendIcon
} from '@mui/icons-material';

const TemplateManager = ({ open, onClose, onSave }) => {
  const theme = useTheme();
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Flow',
      status: 'approved',
      language: 'en',
      category: 'onboarding',
      screens: 3,
      lastModified: '2024-01-15',
      usage: 1250,
      description: 'Welcome message for new customers with policy options',
      content: 'Hello {{customer_name}}! 👋\n\nWelcome to our insurance services. We are here to help you find the best policy for your needs.\n\nPlease select an option below:\n1. Get a Quote\n2. View Existing Policies\n3. Speak to an Agent'
    },
    {
      id: 2,
      name: 'Policy Renewal',
      status: 'pending',
      language: 'en',
      category: 'renewal',
      screens: 5,
      lastModified: '2024-01-14',
      usage: 890,
      description: 'Reminder for policy renewal with payment link',
      content: 'Dear {{customer_name}},\n\nYour {{policy_type}} policy ({{policy_number}}) is due for renewal on {{renewal_date}}.\n\nRenewal Amount: ₹{{premium_amount}}\n\nClick below to renew instantly:\n{{renewal_link}}\n\nContact us for any assistance.'
    },
    {
      id: 3,
      name: 'Claim Status Update',
      status: 'approved',
      language: 'en',
      category: 'support',
      screens: 2,
      lastModified: '2024-01-10',
      usage: 456,
      description: 'Automated claim status notification',
      content: 'Hi {{customer_name}},\n\nYour claim ({{claim_id}}) status has been updated.\n\nCurrent Status: {{claim_status}}\nExpected Resolution: {{resolution_date}}\n\nFor more details, visit: {{claim_link}}'
    }
  ]);

  const [createDialog, setCreateDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'general',
    language: 'en',
    description: '',
    content: ''
  });

  const [editTemplate, setEditTemplate] = useState({
    id: null,
    name: '',
    category: 'general',
    language: 'en',
    description: '',
    content: ''
  });

  const handleCreateTemplate = () => {
    setNewTemplate({
      name: '',
      category: 'general',
      language: 'en',
      description: '',
      content: ''
    });
    setCreateDialog(true);
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) {
      setSnackbar({ open: true, message: 'Template name is required', severity: 'error' });
      return;
    }

    const template = {
      id: templates.length + 1,
      ...newTemplate,
      status: 'draft',
      screens: 1,
      lastModified: new Date().toISOString().split('T')[0],
      usage: 0
    };
    setTemplates([...templates, template]);
    setCreateDialog(false);
    setSnackbar({ open: true, message: 'Template created successfully!', severity: 'success' });
    onSave && onSave(template);
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setPreviewDialog(true);
  };

  const handleEdit = (template) => {
    setEditTemplate({
      id: template.id,
      name: template.name,
      category: template.category,
      language: template.language,
      description: template.description || '',
      content: template.content || ''
    });
    setEditDialog(true);
  };

  const handleUpdateTemplate = () => {
    if (!editTemplate.name.trim()) {
      setSnackbar({ open: true, message: 'Template name is required', severity: 'error' });
      return;
    }

    setTemplates(prevTemplates =>
      prevTemplates.map(t =>
        t.id === editTemplate.id
          ? {
            ...t,
            ...editTemplate,
            lastModified: new Date().toISOString().split('T')[0],
            status: 'pending' // Set to pending after edit
          }
          : t
      )
    );
    setEditDialog(false);
    setSnackbar({ open: true, message: 'Template updated successfully!', severity: 'success' });
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      draft: 'default',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const getCategoryColor = (category) => {
    const colors = {
      onboarding: theme.palette.info.main,
      renewal: theme.palette.warning.main,
      support: theme.palette.success.main,
      marketing: theme.palette.primary.main,
      general: theme.palette.grey[600]
    };
    return colors[category] || theme.palette.grey[600];
  };

  // Replace template variables with sample values for preview
  const getPreviewContent = (content) => {
    if (!content) return '';
    return content
      .replace(/\{\{customer_name\}\}/g, 'John Doe')
      .replace(/\{\{policy_type\}\}/g, 'Health Insurance')
      .replace(/\{\{policy_number\}\}/g, 'POL-2024-001234')
      .replace(/\{\{renewal_date\}\}/g, '15 Feb 2024')
      .replace(/\{\{premium_amount\}\}/g, '12,500')
      .replace(/\{\{renewal_link\}\}/g, '🔗 Click here to renew')
      .replace(/\{\{claim_id\}\}/g, 'CLM-2024-0567')
      .replace(/\{\{claim_status\}\}/g, 'Under Review')
      .replace(/\{\{resolution_date\}\}/g, '20 Feb 2024')
      .replace(/\{\{claim_link\}\}/g, '🔗 View claim details');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">WhatsApp Flow Templates</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="600">
            Template Library
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTemplate}
          >
            Create Template
          </Button>
        </Box>

        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      {template.name}
                    </Typography>
                    <Chip
                      label={template.status}
                      color={getStatusColor(template.status)}
                      size="small"
                    />
                  </Box>

                  <Chip
                    label={template.category}
                    size="small"
                    sx={{
                      mb: 2,
                      bgcolor: alpha(getCategoryColor(template.category), 0.1),
                      color: getCategoryColor(template.category),
                      fontWeight: 600
                    }}
                  />

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {template.screens} screens • {template.language.toUpperCase()}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Used {template.usage} times
                  </Typography>

                  {template.description && (
                    <Typography variant="body2" color="text.secondary" sx={{
                      mt: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {template.description}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Last modified: {template.lastModified}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PreviewIcon />}
                      onClick={() => handlePreview(template)}
                      sx={{ flex: 1 }}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(template)}
                      sx={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Create Template Dialog */}
        <Dialog
          open={createDialog}
          onClose={() => setCreateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Template</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Template Name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTemplate.category}
                    label="Category"
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="onboarding">Onboarding</MenuItem>
                    <MenuItem value="renewal">Renewal</MenuItem>
                    <MenuItem value="support">Support</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={newTemplate.language}
                    label="Language"
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                    <MenuItem value="bn">বাংলা (Bengali)</MenuItem>
                    <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
                    <MenuItem value="mr">मराठी (Marathi)</MenuItem>
                    <MenuItem value="ta">தமிழ் (Tamil)</MenuItem>
                    <MenuItem value="gu">ગુજરાતી (Gujarati)</MenuItem>
                    <MenuItem value="ml">മലയാളം (Malayalam)</MenuItem>
                    <MenuItem value="kn">ಕನ್ನಡ (Kannada)</MenuItem>
                    <MenuItem value="pa">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                    <MenuItem value="as">অসমীয়া (Assamese)</MenuItem>
                    <MenuItem value="or">ଓଡ଼ିଆ (Odia)</MenuItem>
                    <MenuItem value="ur">اردو (Urdu)</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and usage of this template..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Message Content"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your WhatsApp message template content here...&#10;&#10;Use variables like {{customer_name}}, {{policy_number}}, etc."
                  helperText="Use {{variable_name}} for dynamic content. Available: customer_name, policy_type, policy_number, renewal_date, premium_amount"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveTemplate}
              disabled={!newTemplate.name}
            >
              Create Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog
          open={previewDialog}
          onClose={() => setPreviewDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="success" />
                <Typography variant="h6">Template Preview</Typography>
              </Box>
              <IconButton onClick={() => setPreviewDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTemplate && (
              <Stack spacing={3}>
                {/* Template Info */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    {selectedTemplate.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={selectedTemplate.status}
                      color={getStatusColor(selectedTemplate.status)}
                      size="small"
                    />
                    <Chip
                      label={selectedTemplate.category}
                      size="small"
                      sx={{
                        bgcolor: alpha(getCategoryColor(selectedTemplate.category), 0.1),
                        color: getCategoryColor(selectedTemplate.category)
                      }}
                    />
                    <Chip
                      label={selectedTemplate.language.toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  {selectedTemplate.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {selectedTemplate.description}
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Phone Mockup */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper
                    sx={{
                      width: 320,
                      borderRadius: 4,
                      overflow: 'hidden',
                      bgcolor: '#075E54',
                      boxShadow: theme.shadows[10]
                    }}
                  >
                    {/* Phone Header */}
                    <Box sx={{
                      p: 1.5,
                      bgcolor: '#075E54',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: '#25D366',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <MessageIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                          Insurance Bot
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                          Online
                        </Typography>
                      </Box>
                    </Box>

                    {/* Chat Area */}
                    <Box sx={{
                      bgcolor: '#ECE5DD',
                      p: 2,
                      minHeight: 300,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'%23d9fdd3\' fill-opacity=\'.1\'/%3E%3C/svg%3E")'
                    }}>
                      {/* Message Bubble */}
                      <Box sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        borderTopLeftRadius: 0,
                        p: 1.5,
                        maxWidth: '90%',
                        boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)'
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: 1.5
                          }}
                        >
                          {getPreviewContent(selectedTemplate.content)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            textAlign: 'right',
                            color: 'text.secondary',
                            mt: 0.5
                          }}
                        >
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Input Area */}
                    <Box sx={{
                      p: 1,
                      bgcolor: '#F0F0F0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Box sx={{
                        flex: 1,
                        bgcolor: 'white',
                        borderRadius: 4,
                        px: 2,
                        py: 1
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Type a message...
                        </Typography>
                      </Box>
                      <IconButton sx={{ bgcolor: '#25D366', color: 'white', '&:hover': { bgcolor: '#128C7E' } }}>
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Box>

                {/* Template Variables */}
                <Box>
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                    Template Variables
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {['customer_name', 'policy_type', 'policy_number', 'renewal_date', 'premium_amount'].map(variable => (
                      <Chip
                        key={variable}
                        label={`{{${variable}}}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialog(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                setPreviewDialog(false);
                handleEdit(selectedTemplate);
              }}
            >
              Edit Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editDialog}
          onClose={() => setEditDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon color="primary" />
                <Typography variant="h6">Edit Template</Typography>
              </Box>
              <IconButton onClick={() => setEditDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Template Name"
                  value={editTemplate.name}
                  onChange={(e) => setEditTemplate(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editTemplate.category}
                    label="Category"
                    onChange={(e) => setEditTemplate(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="onboarding">Onboarding</MenuItem>
                    <MenuItem value="renewal">Renewal</MenuItem>
                    <MenuItem value="support">Support</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={editTemplate.language}
                    label="Language"
                    onChange={(e) => setEditTemplate(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                    <MenuItem value="bn">বাংলা (Bengali)</MenuItem>
                    <MenuItem value="te">తెలుగు (Telugu)</MenuItem>
                    <MenuItem value="mr">मराठी (Marathi)</MenuItem>
                    <MenuItem value="ta">தமிழ் (Tamil)</MenuItem>
                    <MenuItem value="gu">ગુજરાતી (Gujarati)</MenuItem>
                    <MenuItem value="ml">മലയാളം (Malayalam)</MenuItem>
                    <MenuItem value="kn">ಕನ್ನಡ (Kannada)</MenuItem>
                    <MenuItem value="pa">ਪੰਜਾਬੀ (Punjabi)</MenuItem>
                    <MenuItem value="as">অসমীয়া (Assamese)</MenuItem>
                    <MenuItem value="or">ଓଡ଼ିଆ (Odia)</MenuItem>
                    <MenuItem value="ur">اردو (Urdu)</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={editTemplate.description}
                  onChange={(e) => setEditTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and usage of this template..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Message Content"
                  value={editTemplate.content}
                  onChange={(e) => setEditTemplate(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your WhatsApp message template content here..."
                  helperText="Use {{variable_name}} for dynamic content. Available: customer_name, policy_type, policy_number, renewal_date, premium_amount"
                />
              </Grid>

              {/* Live Preview Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  Live Preview
                </Typography>
                <Paper sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  borderRadius: 2
                }}>
                  <Box sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.6,
                        color: editTemplate.content ? 'text.primary' : 'text.secondary'
                      }}
                    >
                      {editTemplate.content ? getPreviewContent(editTemplate.content) : 'Your message preview will appear here...'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleUpdateTemplate}
              disabled={!editTemplate.name}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default TemplateManager;
