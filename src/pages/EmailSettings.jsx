import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Grid,
  useTheme,
  alpha,
  Fade,
  Grow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Rule as RuleIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const EmailSettings = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState({
    pollingInterval: 5,
    autoTagging: true,
    fallbackTagging: true,
    imapConnected: true,
    webhookEnabled: false,
    webhookUrl: 'https://api.renewiq.com/webhooks/emails'
  });
  const [rules, setRules] = useState([
    {
      id: 1,
      keyword: 'refund',
      category: 'refund',
      priority: 'high',
      enabled: true
    },
    {
      id: 2,
      keyword: 'complaint',
      category: 'complaint',
      priority: 'high',
      enabled: true
    },
    {
      id: 3,
      keyword: 'appointment',
      category: 'appointment',
      priority: 'medium',
      enabled: true
    },
    {
      id: 4,
      keyword: 'feedback',
      category: 'feedback',
      priority: 'low',
      enabled: true
    }
  ]);
  const [ruleDialog, setRuleDialog] = useState({ open: false, rule: null, mode: 'add' });
  const [newRule, setNewRule] = useState({
    keyword: '',
    category: 'uncategorized',
    priority: 'medium',
    enabled: true
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setSuccessMessage('Settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddRule = () => {
    setRuleDialog({ open: true, rule: null, mode: 'add' });
    setNewRule({
      keyword: '',
      category: 'uncategorized',
      priority: 'medium',
      enabled: true
    });
  };

  const handleEditRule = (rule) => {
    setRuleDialog({ open: true, rule, mode: 'edit' });
    setNewRule({ ...rule });
  };

  const handleDeleteRule = (ruleId) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const handleSaveRule = () => {
    if (ruleDialog.mode === 'add') {
      const newRuleWithId = {
        ...newRule,
        id: Math.max(...rules.map(r => r.id), 0) + 1
      };
      setRules(prev => [...prev, newRuleWithId]);
    } else {
      setRules(prev => prev.map(rule => 
        rule.id === ruleDialog.rule.id ? { ...newRule } : rule
      ));
    }
    setRuleDialog({ open: false, rule: null, mode: 'add' });
  };

  const handleToggleRule = (ruleId) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'complaint': return 'error';
      case 'feedback': return 'info';
      case 'refund': return 'warning';
      case 'appointment': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
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
          <Typography variant="h4" fontWeight="600">
            Email Settings
          </Typography>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleSaveSettings}
            sx={{ borderRadius: 2 }}
          >
            Save All Settings
          </Button>
        </Box>

        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              {successMessage}
            </Alert>
          </Grow>
        )}

        <Grid container spacing={3}>
          {/* Connection Settings */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} timeout={400}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                mb: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SecurityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">
                      Connection Settings
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* IMAP Connection Status */}
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: alpha(settings.imapConnected ? theme.palette.success.main : theme.palette.error.main, 0.1),
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {settings.imapConnected ? (
                          <WifiIcon sx={{ color: theme.palette.success.main }} />
                        ) : (
                          <WifiOffIcon sx={{ color: theme.palette.error.main }} />
                        )}
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            IMAP Connection
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {settings.imapConnected ? 'Connected' : 'Disconnected'}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Test Connection
                      </Button>
                    </Box>

                    {/* Webhook Settings */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.webhookEnabled}
                            onChange={(e) => handleSettingChange('webhookEnabled', e.target.checked)}
                          />
                        }
                        label="Enable Webhook Notifications"
                      />
                      
                      {settings.webhookEnabled && (
                        <TextField
                          fullWidth
                          label="Webhook URL"
                          value={settings.webhookUrl}
                          onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                          sx={{ mt: 2 }}
                          InputProps={{ sx: { borderRadius: 2 } }}
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Processing Settings */}
          <Grid item xs={12} lg={6}>
            <Grow in={loaded} timeout={600}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                mb: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <ScheduleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">
                      Processing Settings
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Polling Interval */}
                    <FormControl fullWidth>
                      <InputLabel>Email Polling Interval</InputLabel>
                      <Select
                        value={settings.pollingInterval}
                        label="Email Polling Interval"
                        onChange={(e) => handleSettingChange('pollingInterval', e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={1}>1 minute</MenuItem>
                        <MenuItem value={5}>5 minutes</MenuItem>
                        <MenuItem value={10}>10 minutes</MenuItem>
                        <MenuItem value={15}>15 minutes</MenuItem>
                        <MenuItem value={30}>30 minutes</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Auto-tagging Settings */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.autoTagging}
                            onChange={(e) => handleSettingChange('autoTagging', e.target.checked)}
                          />
                        }
                        label="Enable Auto-categorization"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                        Automatically categorize emails based on classification rules
                      </Typography>
                    </Box>

                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.fallbackTagging}
                            onChange={(e) => handleSettingChange('fallbackTagging', e.target.checked)}
                          />
                        }
                        label="Enable Fallback Tagging"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                        Tag emails as 'Uncategorized' when no rules match
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Classification Rules */}
          <Grid item xs={12}>
            <Grow in={loaded} timeout={800}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RuleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight="600">
                        Classification Rules
                      </Typography>
                    </Box>
                    <Button
                      startIcon={<AddIcon />}
                      variant="contained"
                      onClick={handleAddRule}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Rule
                    </Button>
                  </Box>

                  <List>
                    {rules.map((rule, index) => (
                      <ListItem
                        key={rule.id}
                        sx={{ 
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: rule.enabled ? 'transparent' : alpha(theme.palette.action.disabled, 0.08)
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="600">
                                Keyword: "{rule.keyword}"
                              </Typography>
                              {!rule.enabled && (
                                <Chip label="Disabled" size="small" color="default" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label={`Category: ${rule.category}`}
                                color={getCategoryColor(rule.category)}
                                size="small"
                              />
                              <Chip 
                                label={`Priority: ${rule.priority}`}
                                color={getPriorityColor(rule.priority)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Switch
                              checked={rule.enabled}
                              onChange={() => handleToggleRule(rule.id)}
                              size="small"
                            />
                            <IconButton 
                              size="small"
                              onClick={() => handleEditRule(rule)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => handleDeleteRule(rule.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Rule Dialog */}
        <Dialog 
          open={ruleDialog.open} 
          onClose={() => setRuleDialog({ open: false, rule: null, mode: 'add' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {ruleDialog.mode === 'add' ? 'Add Classification Rule' : 'Edit Classification Rule'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Keyword"
                value={newRule.keyword}
                onChange={(e) => setNewRule(prev => ({ ...prev, keyword: e.target.value }))}
                InputProps={{ sx: { borderRadius: 2 } }}
                helperText="Enter keyword to match in email subject or content"
              />
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newRule.category}
                  label="Category"
                  onChange={(e) => setNewRule(prev => ({ ...prev, category: e.target.value }))}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                  <MenuItem value="uncategorized">Uncategorized</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newRule.priority}
                  label="Priority"
                  onChange={(e) => setNewRule(prev => ({ ...prev, priority: e.target.value }))}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={newRule.enabled}
                    onChange={(e) => setNewRule(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                }
                label="Enable this rule"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRuleDialog({ open: false, rule: null, mode: 'add' })}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleSaveRule}
              disabled={!newRule.keyword.trim()}
            >
              {ruleDialog.mode === 'add' ? 'Add Rule' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default EmailSettings; 