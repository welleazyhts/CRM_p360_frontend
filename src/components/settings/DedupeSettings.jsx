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
  IconButton,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  FileUpload as UploadIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  CreditCard as CardIcon,
  DirectionsCar as VehicleIcon,
  Fingerprint as FingerprintIcon,
  Description as DocumentIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { useDedupe } from '../../context/DedupeContext';

const DedupeSettings = () => {
  const theme = useTheme();
  const {
    config,
    toggleDedupeField,
    setStrictMode,
    addCustomField,
    removeCustomField,
    updateCustomField,
    exportConfig,
    importConfig
  } = useDedupe();

  const [customFieldDialog, setCustomFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [customFieldForm, setCustomFieldForm] = useState({
    fieldName: '',
    label: '',
    severity: 'medium'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Default dedupe fields configuration
  const defaultFields = [
    { key: 'phone', label: 'Phone Number', icon: <PhoneIcon />, description: 'Check for duplicate phone numbers', severity: 'high' },
    { key: 'email', label: 'Email Address', icon: <EmailIcon />, description: 'Check for duplicate email addresses', severity: 'high' },
    { key: 'address', label: 'Physical Address', icon: <HomeIcon />, description: 'Check for duplicate addresses', severity: 'medium' },
    { key: 'panNumber', label: 'PAN Number', icon: <CardIcon />, description: 'Check for duplicate PAN numbers', severity: 'critical' },
    { key: 'vehicleNumber', label: 'Vehicle Registration Number', icon: <VehicleIcon />, description: 'Check for duplicate vehicle numbers', severity: 'high' },
    { key: 'aadhaar', label: 'Aadhaar Number', icon: <FingerprintIcon />, description: 'Check for duplicate Aadhaar numbers', severity: 'critical' },
    { key: 'passport', label: 'Passport Number', icon: <DocumentIcon />, description: 'Check for duplicate passport numbers', severity: 'critical' },
    { key: 'drivingLicense', label: 'Driving License', icon: <ShieldIcon />, description: 'Check for duplicate driving license numbers', severity: 'medium' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return theme.palette.error.main;
      case 'high':
        return theme.palette.warning.main;
      case 'medium':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleAddCustomField = () => {
    if (!customFieldForm.fieldName || !customFieldForm.label) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (editingField) {
      updateCustomField(editingField.id, customFieldForm);
      setSuccessMessage('Custom field updated successfully');
    } else {
      addCustomField(customFieldForm);
      setSuccessMessage('Custom field added successfully');
    }

    setCustomFieldDialog(false);
    setCustomFieldForm({ fieldName: '', label: '', severity: 'medium' });
    setEditingField(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditCustomField = (field) => {
    setEditingField(field);
    setCustomFieldForm({
      fieldName: field.fieldName,
      label: field.label,
      severity: field.severity
    });
    setCustomFieldDialog(true);
  };

  const handleRemoveCustomField = (fieldId) => {
    removeCustomField(fieldId);
    setSuccessMessage('Custom field removed successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = importConfig(e.target.result);
          if (result.success) {
            setSuccessMessage('Configuration imported successfully');
          } else {
            setErrorMessage('Failed to import configuration: ' + result.error);
          }
        } catch (error) {
          setErrorMessage('Failed to import configuration');
        }
        setTimeout(() => {
          setSuccessMessage('');
          setErrorMessage('');
        }, 3000);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        Deduplication Settings
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {/* Overview Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Duplicate Detection Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control how the system handles duplicate records
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={config.strictMode}
                  onChange={(e) => setStrictMode(e.target.checked)}
                  color="error"
                />
              }
              label={config.strictMode ? 'Strict Mode (Reject)' : 'Warning Mode'}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Alert severity={config.strictMode ? 'error' : 'warning'} sx={{ mt: 2 }}>
            {config.strictMode ? (
              <strong>Strict Mode:</strong>
            ) : (
              <strong>Warning Mode:</strong>
            )}{' '}
            {config.strictMode
              ? 'Duplicates will be automatically rejected and prevented from being added.'
              : 'Duplicates will be flagged with a warning, but users can manually override and add them.'}
          </Alert>
        </CardContent>
      </Card>

      {/* Default Dedupe Fields */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Standard Dedupe Fields
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enable or disable duplicate checking for standard fields
          </Typography>

          <Grid container spacing={2}>
            {defaultFields.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.key}>
                <Card
                  variant="outlined"
                  sx={{
                    bgcolor: config.enabledFields[field.key]
                      ? alpha(theme.palette.success.main, 0.05)
                      : 'background.paper',
                    borderColor: config.enabledFields[field.key]
                      ? theme.palette.success.main
                      : 'divider',
                    transition: 'all 0.2s'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: getSeverityColor(field.severity) }}>
                          {field.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {field.label}
                          </Typography>
                          <Chip
                            label={field.severity}
                            size="small"
                            sx={{
                              mt: 0.5,
                              bgcolor: alpha(getSeverityColor(field.severity), 0.1),
                              color: getSeverityColor(field.severity),
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>
                      </Box>
                      <Switch
                        checked={config.enabledFields[field.key] || false}
                        onChange={(e) => toggleDedupeField(field.key, e.target.checked)}
                        color="success"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {field.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Custom Dedupe Fields */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Custom Dedupe Fields
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add custom fields for duplicate checking
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingField(null);
                setCustomFieldForm({ fieldName: '', label: '', severity: 'medium' });
                setCustomFieldDialog(true);
              }}
            >
              Add Custom Field
            </Button>
          </Box>

          {config.customFields && config.customFields.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Field Name</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {config.customFields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {field.fieldName}
                        </Typography>
                      </TableCell>
                      <TableCell>{field.label}</TableCell>
                      <TableCell>
                        <Chip
                          label={field.severity}
                          size="small"
                          sx={{
                            bgcolor: alpha(getSeverityColor(field.severity), 0.1),
                            color: getSeverityColor(field.severity),
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={field.enabled ? <CheckCircleIcon /> : <CancelIcon />}
                          label={field.enabled ? 'Enabled' : 'Disabled'}
                          size="small"
                          color={field.enabled ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditCustomField(field)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveCustomField(field.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              No custom fields added yet. Click "Add Custom Field" to create one.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import/Export Configuration */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Configuration Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Export or import your deduplication configuration
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportConfig}
            >
              Export Configuration
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
            >
              Import Configuration
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleImportConfig}
              />
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add/Edit Custom Field Dialog */}
      <Dialog open={customFieldDialog} onClose={() => setCustomFieldDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Field Name"
                value={customFieldForm.fieldName}
                onChange={(e) => setCustomFieldForm({ ...customFieldForm, fieldName: e.target.value })}
                helperText="The actual field name in your data (e.g., 'customerId', 'licenseNumber')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Display Label"
                value={customFieldForm.label}
                onChange={(e) => setCustomFieldForm({ ...customFieldForm, label: e.target.value })}
                helperText="User-friendly label for this field"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Severity Level</InputLabel>
                <Select
                  value={customFieldForm.severity}
                  label="Severity Level"
                  onChange={(e) => setCustomFieldForm({ ...customFieldForm, severity: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomFieldDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCustomField}>
            {editingField ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DedupeSettings;
