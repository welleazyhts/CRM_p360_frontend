import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const TemplateManager = ({ open, onClose, onSave }) => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Flow',
      status: 'approved',
      language: 'en',
      category: 'onboarding',
      screens: 3,
      lastModified: '2024-01-15',
      usage: 1250
    },
    {
      id: 2,
      name: 'Policy Renewal',
      status: 'pending',
      language: 'en',
      category: 'renewal',
      screens: 5,
      lastModified: '2024-01-14',
      usage: 890
    }
  ]);

  const [createDialog, setCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'general',
    language: 'en',
    description: ''
  });

  const handleCreateTemplate = () => {
    setNewTemplate({
      name: '',
      category: 'general',
      language: 'en',
      description: ''
    });
    setCreateDialog(true);
  };

  const handleSaveTemplate = () => {
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
    onSave && onSave(template);
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
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      {template.name}
                    </Typography>
                    <Chip
                      label={template.status}
                      color={template.status === 'approved' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {template.screens} screens • {template.language.toUpperCase()}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Category: {template.category}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Used {template.usage} times
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    Last modified: {template.lastModified}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      startIcon={<PreviewIcon />}
                    >
                      Preview
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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
                  rows={3}
                  label="Description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and usage of this template..."
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
      </DialogContent>
    </Dialog>
  );
};

export default TemplateManager;
