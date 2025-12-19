import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField,
  Switch, FormControlLabel, Divider, Alert, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Tooltip, Avatar, alpha, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment,
  Tabs, Tab, Badge, CircularProgress
} from '@mui/material';
import {
  DirectionsCar as VehicleIcon,
  CheckCircle as VerifiedIcon,
  Cancel as FailedIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
  VpnKey as KeyIcon,
  Settings as SettingsIcon,
  Assessment as StatsIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  PlayArrow as TestIcon,
  History as HistoryIcon,
  CloudSync as SyncIcon
} from '@mui/icons-material';
import { useVahan } from '../context/VahanContext';

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: value === index ? 24 : 0 }}>
      {value === index && children}
    </div>
  );
}
const VahanIntegration = () => {
  const theme = useTheme();
  const {
    config,
    verifications,
    loading,
    updateConfig,
    testConnection,
    retryVerification,
    deleteVerification,
    getStatistics
  } = useVahan();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [configEditing, setConfigEditing] = useState(false);
  const [editedConfig, setEditedConfig] = useState(config);
  const [testingConnection, setTestingConnection] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, verification: null });

  const stats = getStatistics();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ============ CONFIGURATION FUNCTIONS ============

  const handleEditConfig = () => {
    setEditedConfig(config);
    setConfigEditing(true);
  };

  const handleCancelEdit = () => {
    setConfigEditing(false);
    setEditedConfig(config);
  };

  const handleSaveConfig = () => {
    const result = updateConfig(editedConfig);
    if (result.success) {
      setConfigEditing(false);
      showSnackbar('Configuration updated successfully');
    }
  };

  const handleConfigChange = (field, value) => {
    setEditedConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const result = await testConnection();
    setTestingConnection(false);

    if (result.success) {
      showSnackbar(result.message, 'success');
    } else {
      showSnackbar(result.error, 'error');
    }
  };

  // ============ VERIFICATION FUNCTIONS ============

  const handleRetryVerification = async (verificationId) => {
    const result = await retryVerification(verificationId);
    if (result.success) {
      showSnackbar('Verification successful', 'success');
    } else {
      showSnackbar(`Verification failed: ${result.error}`, 'error');
    }
  };

  const handleDeleteVerification = (verificationId) => {
    if (window.confirm('Are you sure you want to delete this verification record?')) {
      const result = deleteVerification(verificationId);
      if (result.success) {
        showSnackbar('Verification record deleted');
      }
    }
  };

  const handleViewDetails = (verification) => {
    setDetailsDialog({ open: true, verification });
  };

  const handleCloseDetails = () => {
    setDetailsDialog({ open: false, verification: null });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <VerifiedIcon />;
      case 'failed': return <FailedIcon />;
      case 'pending': return <PendingIcon />;
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Vahan API Integration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vehicle verification and registration details from Government of India Vahan database
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={testingConnection ? <CircularProgress size={20} /> : <TestIcon />}
          onClick={handleTestConnection}
          disabled={testingConnection}
        >
          Test Connection
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Verifications
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <VehicleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Verified
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {stats.verified}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <VerifiedIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Failed
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {stats.failed}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                  <FailedIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.successRate}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <StatsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<SettingsIcon />} label="Configuration" iconPosition="start" />
          <Tab
            icon={
              <Badge badgeContent={stats.total} color="primary">
                <HistoryIcon />
              </Badge>
            }
            label="Verification History"
            iconPosition="start"
          />
        </Tabs>

        {/* Configuration Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                API Configuration
              </Typography>
              {!configEditing && (
                <Button variant="outlined" onClick={handleEditConfig}>
                  Edit Configuration
                </Button>
              )}
            </Box>

            {configEditing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Alert severity="info">
                  Update your Vahan API credentials and settings below
                </Alert>

                <TextField
                  fullWidth
                  label="API URL"
                  value={editedConfig.apiUrl}
                  onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    )
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="API Key"
                      type="password"
                      value={editedConfig.apiKey}
                      onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="API Secret"
                      type="password"
                      value={editedConfig.apiSecret}
                      onChange={(e) => handleConfigChange('apiSecret', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Retry Attempts"
                      value={editedConfig.retryAttempts}
                      onChange={(e) => handleConfigChange('retryAttempts', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Timeout (ms)"
                      value={editedConfig.timeout}
                      onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                    />
                  </Grid>
                </Grid>

                <Divider />

                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Automation Settings
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={editedConfig.enabled}
                      onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                    />
                  }
                  label="Enable Vahan Integration"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editedConfig.autoVerifyOnLeadCreation}
                      onChange={(e) => handleConfigChange('autoVerifyOnLeadCreation', e.target.checked)}
                    />
                  }
                  label="Auto-verify vehicle on lead creation"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editedConfig.storeVehicleDetails}
                      onChange={(e) => handleConfigChange('storeVehicleDetails', e.target.checked)}
                    />
                  }
                  label="Store vehicle details in database"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editedConfig.notifyOnVerification}
                      onChange={(e) => handleConfigChange('notifyOnVerification', e.target.checked)}
                    />
                  }
                  label="Notify agent on verification completion"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editedConfig.allowManualOverride}
                      onChange={(e) => handleConfigChange('allowManualOverride', e.target.checked)}
                    />
                  }
                  label="Allow manual data override"
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSaveConfig}>
                    Save Configuration
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      API URL
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {config.apiUrl}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={config.enabled ? 'Enabled' : 'Disabled'}
                      color={config.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Auto-verify on Lead Creation
                    </Typography>
                    <Chip
                      label={config.autoVerifyOnLeadCreation ? 'Yes' : 'No'}
                      size="small"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Retry Attempts
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {config.retryAttempts}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </TabPanel>

        {/* Verification History Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Verifications ({verifications.length})
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle Number</TableCell>
                    <TableCell>Lead ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verified At</TableCell>
                    <TableCell>Verified By</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {verifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VehicleIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {verification.vehicleNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={verification.leadId} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(verification.status)}
                          label={verification.status}
                          size="small"
                          color={getStatusColor(verification.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(verification.verifiedAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>{verification.verifiedBy}</TableCell>
                      <TableCell align="right">
                        {verification.status === 'verified' && (
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(verification)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {verification.status === 'failed' && (
                          <Tooltip title="Retry Verification">
                            <IconButton
                              size="small"
                              onClick={() => handleRetryVerification(verification.id)}
                              disabled={loading}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteVerification(verification.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {verifications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No verification records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Vehicle Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Vehicle Details - {detailsDialog.verification?.vehicleNumber}
        </DialogTitle>
        <DialogContent>
          {detailsDialog.verification?.vehicleDetails && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Owner Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {detailsDialog.verification.vehicleDetails.ownerName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Vehicle Class
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.vehicleClass}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Manufacturer
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.manufacturer}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Model
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.model}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Fuel Type
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.fuelType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Color
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.color}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Registration Date
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.registrationDate}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Registration Expiry
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.expiryDate}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Insurance Expiry
                  </Typography>
                  <Typography variant="body1" sx={{
                    color: new Date(detailsDialog.verification.vehicleDetails.insuranceExpiryDate) < new Date()
                      ? 'error.main'
                      : 'text.primary'
                  }}>
                    {detailsDialog.verification.vehicleDetails.insuranceExpiryDate}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    RC Status
                  </Typography>
                  <Chip
                    label={detailsDialog.verification.vehicleDetails.rcStatus}
                    size="small"
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    State
                  </Typography>
                  <Typography variant="body1">
                    {detailsDialog.verification.vehicleDetails.state}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Chassis Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {detailsDialog.verification.vehicleDetails.chassisNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Engine Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {detailsDialog.verification.vehicleDetails.engineNumber}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VahanIntegration;
