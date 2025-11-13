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
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
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
  Shield as ShieldIcon,
  ExpandMore as ExpandMoreIcon,
  Rule as RuleIcon,
  Block as BlockIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  FilterList as FilterIcon
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
  const [conditionDialog, setConditionDialog] = useState(false);
  const [exceptionDialog, setExceptionDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingCondition, setEditingCondition] = useState(null);
  const [editingException, setEditingException] = useState(null);
  const [customFieldForm, setCustomFieldForm] = useState({
    fieldName: '',
    label: '',
    severity: 'medium'
  });
  const [conditionForm, setConditionForm] = useState({
    name: '',
    field: '',
    operator: 'equals',
    value: '',
    description: ''
  });
  const [exceptionForm, setExceptionForm] = useState({
    name: '',
    type: 'value',
    field: '',
    value: '',
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock data for conditions and exceptions
  const [conditions, setConditions] = useState([
    {
      id: 1,
      name: 'Active Records Only',
      field: 'status',
      operator: 'equals',
      value: 'Active',
      description: 'Only check duplicates for active records',
      enabled: true
    },
    {
      id: 2,
      name: 'Recent Leads',
      field: 'createdDate',
      operator: 'within_days',
      value: '30',
      description: 'Check duplicates only for leads created in last 30 days',
      enabled: false
    }
  ]);

  const [exceptions, setExceptions] = useState([
    {
      id: 1,
      name: 'VIP Customers',
      type: 'value',
      field: 'customerType',
      value: 'VIP',
      description: 'Skip duplicate check for VIP customers',
      enabled: true
    },
    {
      id: 2,
      name: 'Test Records',
      type: 'value',
      field: 'email',
      value: '*@test.com',
      description: 'Allow duplicate test email addresses',
      enabled: true
    },
    {
      id: 3,
      name: 'Migration Data',
      type: 'source',
      field: 'source',
      value: 'Migration',
      description: 'Skip duplicate check for migrated data',
      enabled: false
    }
  ]);

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

  // Condition handlers
  const handleAddCondition = () => {
    if (!conditionForm.name || !conditionForm.field) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (editingCondition) {
      setConditions(conditions.map(c =>
        c.id === editingCondition.id ? { ...conditionForm, id: c.id, enabled: c.enabled } : c
      ));
      setSuccessMessage('Condition updated successfully');
    } else {
      setConditions([...conditions, { ...conditionForm, id: Date.now(), enabled: true }]);
      setSuccessMessage('Condition added successfully');
    }

    setConditionDialog(false);
    setConditionForm({ name: '', field: '', operator: 'equals', value: '', description: '' });
    setEditingCondition(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditCondition = (condition) => {
    setEditingCondition(condition);
    setConditionForm({
      name: condition.name,
      field: condition.field,
      operator: condition.operator,
      value: condition.value,
      description: condition.description
    });
    setConditionDialog(true);
  };

  const handleDeleteCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
    setSuccessMessage('Condition deleted successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleCondition = (id) => {
    setConditions(conditions.map(c =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  // Exception handlers
  const handleAddException = () => {
    if (!exceptionForm.name || !exceptionForm.field) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (editingException) {
      setExceptions(exceptions.map(e =>
        e.id === editingException.id ? { ...exceptionForm, id: e.id, enabled: e.enabled } : e
      ));
      setSuccessMessage('Exception updated successfully');
    } else {
      setExceptions([...exceptions, { ...exceptionForm, id: Date.now(), enabled: true }]);
      setSuccessMessage('Exception added successfully');
    }

    setExceptionDialog(false);
    setExceptionForm({ name: '', type: 'value', field: '', value: '', description: '' });
    setEditingException(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditException = (exception) => {
    setEditingException(exception);
    setExceptionForm({
      name: exception.name,
      type: exception.type,
      field: exception.field,
      value: exception.value,
      description: exception.description
    });
    setExceptionDialog(true);
  };

  const handleDeleteException = (id) => {
    setExceptions(exceptions.filter(e => e.id !== id));
    setSuccessMessage('Exception deleted successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleException = (id) => {
    setExceptions(exceptions.map(e =>
      e.id === id ? { ...e, enabled: !e.enabled } : e
    ));
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

      {/* Deduplication Conditions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Deduplication Conditions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Define when deduplication checks should be applied
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingCondition(null);
                setConditionForm({ name: '', field: '', operator: 'equals', value: '', description: '' });
                setConditionDialog(true);
              }}
            >
              Add Condition
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Conditions define criteria that must be met for records to be checked for duplicates. Only records matching these conditions will undergo deduplication.
          </Alert>

          {conditions.length > 0 ? (
            <List>
              {conditions.map((condition) => (
                <Paper key={condition.id} variant="outlined" sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemIcon>
                      <RuleIcon color={condition.enabled ? 'primary' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight="600">
                            {condition.name}
                          </Typography>
                          <Chip
                            label={condition.enabled ? 'Active' : 'Inactive'}
                            size="small"
                            color={condition.enabled ? 'success' : 'default'}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {condition.description}
                          </Typography>
                          <Typography variant="caption" color="primary.main" sx={{ mt: 0.5, display: 'block' }}>
                            Rule: {condition.field} {condition.operator} "{condition.value}"
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={condition.enabled ? 'Disable' : 'Enable'}>
                          <Switch
                            checked={condition.enabled}
                            onChange={() => handleToggleCondition(condition.id)}
                            color="success"
                          />
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditCondition(condition)} size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteCondition(condition.id)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No conditions defined. Deduplication will apply to all records.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Deduplication Exceptions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Deduplication Exceptions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Define when to skip duplicate checking
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="warning"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingException(null);
                setExceptionForm({ name: '', type: 'value', field: '', value: '', description: '' });
                setExceptionDialog(true);
              }}
            >
              Add Exception
            </Button>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            Exceptions allow specific records to bypass deduplication checks. Use carefully to avoid unwanted duplicates.
          </Alert>

          {exceptions.length > 0 ? (
            <List>
              {exceptions.map((exception) => (
                <Paper key={exception.id} variant="outlined" sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemIcon>
                      <BlockIcon color={exception.enabled ? 'warning' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight="600">
                            {exception.name}
                          </Typography>
                          <Chip
                            label={exception.enabled ? 'Active' : 'Inactive'}
                            size="small"
                            color={exception.enabled ? 'warning' : 'default'}
                          />
                          <Chip
                            label={exception.type}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {exception.description}
                          </Typography>
                          <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                            Exception: Skip if {exception.field} matches "{exception.value}"
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title={exception.enabled ? 'Disable' : 'Enable'}>
                          <Switch
                            checked={exception.enabled}
                            onChange={() => handleToggleException(exception.id)}
                            color="warning"
                          />
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditException(exception)} size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteException(exception.id)} size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              No exceptions defined. All records will be subject to deduplication checks.
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

      {/* Add/Edit Condition Dialog */}
      <Dialog open={conditionDialog} onClose={() => setConditionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCondition ? 'Edit Condition' : 'Add Condition'}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
            Conditions determine which records should be checked for duplicates. Only records meeting these criteria will undergo deduplication.
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Condition Name"
                value={conditionForm.name}
                onChange={(e) => setConditionForm({ ...conditionForm, name: e.target.value })}
                helperText="A descriptive name for this condition"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Field"
                value={conditionForm.field}
                onChange={(e) => setConditionForm({ ...conditionForm, field: e.target.value })}
                helperText="The field to check (e.g., 'status', 'source', 'createdDate')"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={conditionForm.operator}
                  label="Operator"
                  onChange={(e) => setConditionForm({ ...conditionForm, operator: e.target.value })}
                >
                  <MenuItem value="equals">Equals</MenuItem>
                  <MenuItem value="not_equals">Not Equals</MenuItem>
                  <MenuItem value="contains">Contains</MenuItem>
                  <MenuItem value="starts_with">Starts With</MenuItem>
                  <MenuItem value="ends_with">Ends With</MenuItem>
                  <MenuItem value="greater_than">Greater Than</MenuItem>
                  <MenuItem value="less_than">Less Than</MenuItem>
                  <MenuItem value="within_days">Within Days</MenuItem>
                  <MenuItem value="in_list">In List</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Value"
                value={conditionForm.value}
                onChange={(e) => setConditionForm({ ...conditionForm, value: e.target.value })}
                helperText="The value to match against"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={conditionForm.description}
                onChange={(e) => setConditionForm({ ...conditionForm, description: e.target.value })}
                helperText="Explain when this condition should apply"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConditionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCondition}>
            {editingCondition ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Exception Dialog */}
      <Dialog open={exceptionDialog} onClose={() => setExceptionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingException ? 'Edit Exception' : 'Add Exception'}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2, mb: 3 }}>
            Exceptions allow specific records to bypass deduplication checks. Use with caution to prevent unwanted duplicates.
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Exception Name"
                value={exceptionForm.name}
                onChange={(e) => setExceptionForm({ ...exceptionForm, name: e.target.value })}
                helperText="A descriptive name for this exception"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Exception Type</InputLabel>
                <Select
                  value={exceptionForm.type}
                  label="Exception Type"
                  onChange={(e) => setExceptionForm({ ...exceptionForm, type: e.target.value })}
                >
                  <MenuItem value="value">Field Value</MenuItem>
                  <MenuItem value="source">Data Source</MenuItem>
                  <MenuItem value="user">User/Role</MenuItem>
                  <MenuItem value="pattern">Pattern Match</MenuItem>
                  <MenuItem value="time">Time-based</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Field"
                value={exceptionForm.field}
                onChange={(e) => setExceptionForm({ ...exceptionForm, field: e.target.value })}
                helperText="The field to check for exception (e.g., 'customerType', 'email', 'source')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Value/Pattern"
                value={exceptionForm.value}
                onChange={(e) => setExceptionForm({ ...exceptionForm, value: e.target.value })}
                helperText="Value or pattern to match. Use * for wildcards (e.g., '*@test.com')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={exceptionForm.description}
                onChange={(e) => setExceptionForm({ ...exceptionForm, description: e.target.value })}
                helperText="Explain why this exception is needed"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExceptionDialog(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleAddException}>
            {editingException ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DedupeSettings;
