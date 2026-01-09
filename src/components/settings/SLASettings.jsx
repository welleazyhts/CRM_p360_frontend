import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as EscalateIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useSLA } from '../../context/SLAContext';

const SLASettings = () => {
  const theme = useTheme();
  const { slaConfig, updateSLAConfig, updateSLATemplates, clearAllSLATrackings, restoreDefaultTemplates } = useSLA();

  const [currentTab, setCurrentTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Provide safe defaults if slaConfig is undefined
  const safeSlaConfig = slaConfig || {
    enabled: false,
    templates: {},
    notifications: {
      enabled: false,
      warning: 25,
      critical: 10,
      breach: true
    },
    escalation: {
      enabled: false,
      levels: []
    },
    autoAssignment: {
      enabled: false
    }
  };

  const entityTypes = ['lead', 'case', 'task', 'email', 'claim'];

  const handleEditTemplate = (entityType, slaType, template) => {
    setEditingTemplate({
      entityType,
      slaType,
      ...template
    });
    setEditDialog(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    const { entityType, slaType, hours, days, minutes, description } = editingTemplate;

    const config = {};
    if (hours) config.hours = parseFloat(hours);
    if (days) config.days = parseFloat(days);
    if (minutes) config.minutes = parseFloat(minutes);
    config.description = description;

    updateSLATemplates(entityType, slaType, config);
    setEditDialog(false);
    setEditingTemplate(null);
    setSuccessMessage('SLA template updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRestoreDefaults = async () => {
    if (window.confirm('Are you sure you want to restore default SLA templates? This cannot be undone.')) {
      await restoreDefaultTemplates();
      setSuccessMessage('Default SLA templates restored');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleClearAllTrackings = () => {
    if (window.confirm('Are you sure you want to clear all SLA trackings? This will remove all historical SLA data and cannot be undone.')) {
      clearAllSLATrackings();
      setSuccessMessage('All SLA trackings cleared');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        SLA Management Settings
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Main Settings Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                SLA Tracking System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enable or disable SLA tracking across the system
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={safeSlaConfig.enabled}
                  onChange={(e) => updateSLAConfig({ enabled: e.target.checked })}
                  color="primary"
                />
              }
              label={safeSlaConfig.enabled ? 'Enabled' : 'Disabled'}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Alert severity={safeSlaConfig.enabled ? 'info' : 'warning'} sx={{ mt: 2 }}>
            {safeSlaConfig.enabled
              ? 'SLA tracking is active. All new leads, cases, and tasks will be monitored against configured SLAs.'
              : 'SLA tracking is disabled. No SLA monitoring will occur until re-enabled.'}
          </Alert>
        </CardContent>
      </Card>

      {/* Tabs for different settings */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab icon={<TimerIcon />} label="SLA Templates" iconPosition="start" />
            <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
            <Tab icon={<EscalateIcon />} label="Escalation Rules" iconPosition="start" />
            <Tab icon={<AssessmentIcon />} label="Advanced" iconPosition="start" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* SLA Templates Tab */}
          {currentTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">
                  SLA Templates Configuration
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={handleRestoreDefaults}
                  size="small"
                >
                  Restore Defaults
                </Button>
              </Box>

              {entityTypes.map((entityType) => (
                <Box key={entityType} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, textTransform: 'capitalize' }}>
                    {entityType} SLAs
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>SLA Type</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {safeSlaConfig.templates[entityType] &&
                          Object.entries(safeSlaConfig.templates[entityType]).map(([slaType, config]) => (
                            <TableRow key={slaType} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                                  {(slaType || '').toString().replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {config.description}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    config.hours
                                      ? `${config.hours} hours`
                                      : config.days
                                        ? `${config.days} days`
                                        : `${config.minutes} minutes`
                                  }
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditTemplate(entityType, slaType, config)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
            </Box>
          )}

          {/* Notifications Tab */}
          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Notification Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure when to send SLA alerts and notifications
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={safeSlaConfig.notifications.enabled}
                        onChange={(e) =>
                          updateSLAConfig({
                            notifications: {
                              ...safeSlaConfig.notifications,
                              enabled: e.target.checked
                            }
                          })
                        }
                      />
                    }
                    label="Enable SLA Notifications"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Warning Threshold (%)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Send warning when this percentage of time remains
                  </Typography>
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Slider
                      value={safeSlaConfig.notifications.warning}
                      onChange={(e, value) =>
                        updateSLAConfig({
                          notifications: {
                            ...safeSlaConfig.notifications,
                            warning: value
                          }
                        })
                      }
                      min={10}
                      max={50}
                      step={5}
                      marks
                      valueLabelDisplay="on"
                      disabled={!safeSlaConfig.notifications.enabled}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Critical Threshold (%)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Send critical alert when this percentage of time remains
                  </Typography>
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Slider
                      value={safeSlaConfig.notifications.critical}
                      onChange={(e, value) =>
                        updateSLAConfig({
                          notifications: {
                            ...safeSlaConfig.notifications,
                            critical: value
                          }
                        })
                      }
                      min={5}
                      max={25}
                      step={5}
                      marks
                      valueLabelDisplay="on"
                      disabled={!safeSlaConfig.notifications.enabled}
                      color="error"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={safeSlaConfig.notifications.breach}
                        onChange={(e) =>
                          updateSLAConfig({
                            notifications: {
                              ...safeSlaConfig.notifications,
                              breach: e.target.checked
                            }
                          })
                        }
                        disabled={!safeSlaConfig.notifications.enabled}
                      />
                    }
                    label="Notify on SLA Breach"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Escalation Rules Tab */}
          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Escalation Rules
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Define automatic escalation when SLAs are at risk or breached
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={safeSlaConfig.escalation.enabled}
                    onChange={(e) =>
                      updateSLAConfig({
                        escalation: {
                          ...safeSlaConfig.escalation,
                          enabled: e.target.checked
                        }
                      })
                    }
                  />
                }
                label="Enable Automatic Escalation"
                sx={{ mb: 3 }}
              />

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Threshold</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {safeSlaConfig.escalation.levels.map((level, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip
                            label={level.threshold > 0 ? `${level.threshold}% remaining` : `${Math.abs(level.threshold)}h overdue`}
                            size="small"
                            color={level.threshold > 0 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {(level.action || '').toString().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {level.description}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Advanced Tab */}
          {currentTab === 3 && (
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Advanced Settings
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Auto-Assignment Integration
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Consider SLA workload when automatically assigning leads and cases
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={safeSlaConfig.autoAssignment?.enabled}
                            onChange={(e) =>
                              updateSLAConfig({
                                autoAssignment: {
                                  ...safeSlaConfig.autoAssignment,
                                  enabled: e.target.checked
                                }
                              })
                            }
                          />
                        }
                        label="Enable SLA-aware Auto-Assignment"
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom color="error">
                        Danger Zone
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        These actions cannot be undone. Use with caution.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleClearAllTrackings}
                      >
                        Clear All SLA Trackings
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit SLA Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={editingTemplate?.description || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Days"
                type="number"
                value={editingTemplate?.days || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, days: e.target.value, hours: '', minutes: '' })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Hours"
                type="number"
                value={editingTemplate?.hours || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, hours: e.target.value, days: '', minutes: '' })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minutes"
                type="number"
                value={editingTemplate?.minutes || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, minutes: e.target.value, days: '', hours: '' })}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Specify duration in days, hours, OR minutes (not combined). The system will use priority multipliers to adjust deadlines.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTemplate} startIcon={<SaveIcon />}>
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SLASettings;
