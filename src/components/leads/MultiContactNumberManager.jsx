import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Tooltip,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Block as BlockIcon,
  CheckCircle as VerifiedIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Phone number type constants
export const PHONE_TYPES = {
  MOBILE: 'mobile',
  HOME: 'home',
  WORK: 'work',
  OTHER: 'other'
};

// Phone number status
export const PHONE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  INVALID: 'invalid',
  DND: 'dnd'
};

const MultiContactNumberManager = ({ leadId, initialNumbers = [], onUpdate }) => {
  const [numbers, setNumbers] = useState(initialNumbers);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // New number form state
  const [newNumber, setNewNumber] = useState({
    phone: '',
    type: PHONE_TYPES.MOBILE,
    isPrimary: false,
    isVerified: false,
    isDND: false,
    status: PHONE_STATUS.ACTIVE,
    bestTimeToCall: '',
    notes: '',
    callAttempts: 0,
    lastCalled: null
  });

  useEffect(() => {
    setNumbers(initialNumbers);
  }, [initialNumbers]);

  // Phone number validation
  const validatePhoneNumber = (phone) => {
    // Indian phone number validation
    const indianMobileRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    const cleanedPhone = phone.replace(/[\s-]/g, '');

    if (!cleanedPhone) {
      return { valid: false, message: 'Phone number is required' };
    }

    if (!indianMobileRegex.test(cleanedPhone)) {
      return { valid: false, message: 'Invalid Indian phone number format' };
    }

    return { valid: true, message: '' };
  };

  // Format phone number
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, '');

    // Add +91 prefix if not present
    if (cleaned.startsWith('91')) {
      return '+' + cleaned;
    } else if (!cleaned.startsWith('+91')) {
      return '+91' + cleaned.replace(/^0/, '');
    }

    return cleaned;
  };

  // Check for duplicate
  const isDuplicateNumber = (phone, excludeId = null) => {
    const formatted = formatPhoneNumber(phone);
    return numbers.some(num =>
      num.id !== excludeId && formatPhoneNumber(num.phone) === formatted
    );
  };

  // Handle add number
  const handleAddNumber = () => {
    const validation = validatePhoneNumber(newNumber.phone);

    if (!validation.valid) {
      setValidationErrors({ phone: validation.message });
      return;
    }

    if (isDuplicateNumber(newNumber.phone)) {
      setValidationErrors({ phone: 'This phone number already exists' });
      return;
    }

    const formattedNumber = {
      ...newNumber,
      id: `PHONE-${Date.now()}`,
      phone: formatPhoneNumber(newNumber.phone),
      addedAt: new Date().toISOString()
    };

    // If this is set as primary, remove primary from others
    let updatedNumbers = numbers.map(num => ({
      ...num,
      isPrimary: formattedNumber.isPrimary ? false : num.isPrimary
    }));

    updatedNumbers = [...updatedNumbers, formattedNumber];
    setNumbers(updatedNumbers);

    // Call parent callback
    if (onUpdate) {
      onUpdate(updatedNumbers);
    }

    // Reset form
    setNewNumber({
      phone: '',
      type: PHONE_TYPES.MOBILE,
      isPrimary: false,
      isVerified: false,
      isDND: false,
      status: PHONE_STATUS.ACTIVE,
      bestTimeToCall: '',
      notes: '',
      callAttempts: 0,
      lastCalled: null
    });
    setValidationErrors({});
    setAddDialog(false);
  };

  // Handle edit number
  const handleEditNumber = () => {
    const validation = validatePhoneNumber(selectedNumber.phone);

    if (!validation.valid) {
      setValidationErrors({ phone: validation.message });
      return;
    }

    if (isDuplicateNumber(selectedNumber.phone, selectedNumber.id)) {
      setValidationErrors({ phone: 'This phone number already exists' });
      return;
    }

    let updatedNumbers = numbers.map(num => {
      if (num.id === selectedNumber.id) {
        return {
          ...selectedNumber,
          phone: formatPhoneNumber(selectedNumber.phone)
        };
      }
      // If edited number is set as primary, remove primary from others
      if (selectedNumber.isPrimary) {
        return { ...num, isPrimary: false };
      }
      return num;
    });

    setNumbers(updatedNumbers);

    if (onUpdate) {
      onUpdate(updatedNumbers);
    }

    setValidationErrors({});
    setEditDialog(false);
    setSelectedNumber(null);
  };

  // Handle delete number
  const handleDeleteNumber = (id) => {
    if (window.confirm('Are you sure you want to delete this phone number?')) {
      const updatedNumbers = numbers.filter(num => num.id !== id);
      setNumbers(updatedNumbers);

      if (onUpdate) {
        onUpdate(updatedNumbers);
      }
    }
  };

  // Handle set primary
  const handleSetPrimary = (id) => {
    const updatedNumbers = numbers.map(num => ({
      ...num,
      isPrimary: num.id === id
    }));
    setNumbers(updatedNumbers);

    if (onUpdate) {
      onUpdate(updatedNumbers);
    }
  };

  // Handle toggle DND
  const handleToggleDND = (id) => {
    const updatedNumbers = numbers.map(num => {
      if (num.id === id) {
        return { ...num, isDND: !num.isDND };
      }
      return num;
    });
    setNumbers(updatedNumbers);

    if (onUpdate) {
      onUpdate(updatedNumbers);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [PHONE_STATUS.ACTIVE]: 'success',
      [PHONE_STATUS.INACTIVE]: 'default',
      [PHONE_STATUS.INVALID]: 'error',
      [PHONE_STATUS.DND]: 'warning'
    };
    return colors[status] || 'default';
  };

  // Handle SMS click
  const handleSMS = (phone) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[\s-]/g, '');
    window.open(`sms:${cleanPhone}`, '_blank');
  };

  // Handle WhatsApp click
  const handleWhatsApp = (phone) => {
    if (!phone) return;
    // Remove all non-numeric characters first
    let cleanPhone = phone.replace(/\D/g, '');

    // If it starts with 0, replace with 91
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '91' + cleanPhone.substring(1);
    }
    // If it doesn't start with 91 (and is 10 digits), add 91
    else if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Contact Numbers ({numbers.length})
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAddDialog(true)}
            >
              Add Number
            </Button>
          </Box>

          {numbers.length === 0 ? (
            <Alert severity="info">
              No contact numbers added yet. Click "Add Number" to add a phone number.
            </Alert>
          ) : (
            <List>
              {numbers.map((number) => (
                <ListItem
                  key={number.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: number.isPrimary ? 'action.selected' : 'background.paper'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        {number.isPrimary ? (
                          <StarIcon fontSize="small" color="primary" />
                        ) : (
                          <StarBorderIcon fontSize="small" color="disabled" />
                        )}
                        <Typography variant="body1" fontWeight={number.isPrimary ? 'bold' : 'normal'}>
                          {number.phone}
                        </Typography>
                        {number.isVerified && (
                          <VerifiedIcon fontSize="small" color="success" />
                        )}
                        {number.isDND && (
                          <Chip icon={<BlockIcon />} label="DND" size="small" color="warning" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                        <Chip label={number.type} size="small" variant="outlined" />
                        <Chip
                          label={number.status}
                          size="small"
                          color={getStatusColor(number.status)}
                        />
                        {number.callAttempts > 0 && (
                          <Chip
                            label={`${number.callAttempts} calls`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {number.bestTimeToCall && (
                          <Chip
                            label={`Best: ${number.bestTimeToCall}`}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="Call">
                        <IconButton
                          size="small"
                          color="primary"
                          component="a"
                          href={`tel:${number.phone}`}
                        >
                          <PhoneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="SMS">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleSMS(number.phone)}
                        >
                          <SmsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="WhatsApp">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleWhatsApp(number.phone)}
                        >
                          <WhatsAppIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!number.isPrimary && (
                        <Tooltip title="Set as Primary">
                          <IconButton
                            size="small"
                            onClick={() => handleSetPrimary(number.id)}
                          >
                            <StarBorderIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedNumber({ ...number });
                            setEditDialog(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteNumber(number.id)}
                          disabled={numbers.length === 1}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Number Dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Contact Number</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newNumber.phone}
                onChange={(e) => setNewNumber({ ...newNumber, phone: e.target.value })}
                placeholder="+91-98765-43210"
                error={!!validationErrors.phone}
                helperText={validationErrors.phone || 'Enter 10-digit mobile number'}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Number Type</InputLabel>
                <Select
                  value={newNumber.type}
                  label="Number Type"
                  onChange={(e) => setNewNumber({ ...newNumber, type: e.target.value })}
                >
                  <MenuItem value={PHONE_TYPES.MOBILE}>Mobile</MenuItem>
                  <MenuItem value={PHONE_TYPES.HOME}>Home</MenuItem>
                  <MenuItem value={PHONE_TYPES.WORK}>Work</MenuItem>
                  <MenuItem value={PHONE_TYPES.OTHER}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Best Time to Call"
                value={newNumber.bestTimeToCall}
                onChange={(e) => setNewNumber({ ...newNumber, bestTimeToCall: e.target.value })}
                placeholder="e.g., 6-8 PM"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={newNumber.notes}
                onChange={(e) => setNewNumber({ ...newNumber, notes: e.target.value })}
                multiline
                rows={2}
                placeholder="Add any notes about this number..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newNumber.isPrimary}
                    onChange={(e) => setNewNumber({ ...newNumber, isPrimary: e.target.checked })}
                  />
                }
                label="Set as Primary Number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newNumber.isDND}
                    onChange={(e) => setNewNumber({ ...newNumber, isDND: e.target.checked })}
                  />
                }
                label="Do Not Disturb (DND)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAddDialog(false);
            setValidationErrors({});
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddNumber}>
            Add Number
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Number Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Contact Number</DialogTitle>
        <DialogContent>
          {selectedNumber && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={selectedNumber.phone}
                  onChange={(e) => setSelectedNumber({ ...selectedNumber, phone: e.target.value })}
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Number Type</InputLabel>
                  <Select
                    value={selectedNumber.type}
                    label="Number Type"
                    onChange={(e) => setSelectedNumber({ ...selectedNumber, type: e.target.value })}
                  >
                    <MenuItem value={PHONE_TYPES.MOBILE}>Mobile</MenuItem>
                    <MenuItem value={PHONE_TYPES.HOME}>Home</MenuItem>
                    <MenuItem value={PHONE_TYPES.WORK}>Work</MenuItem>
                    <MenuItem value={PHONE_TYPES.OTHER}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedNumber.status}
                    label="Status"
                    onChange={(e) => setSelectedNumber({ ...selectedNumber, status: e.target.value })}
                  >
                    <MenuItem value={PHONE_STATUS.ACTIVE}>Active</MenuItem>
                    <MenuItem value={PHONE_STATUS.INACTIVE}>Inactive</MenuItem>
                    <MenuItem value={PHONE_STATUS.INVALID}>Invalid</MenuItem>
                    <MenuItem value={PHONE_STATUS.DND}>DND</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Best Time to Call"
                  value={selectedNumber.bestTimeToCall}
                  onChange={(e) => setSelectedNumber({ ...selectedNumber, bestTimeToCall: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={selectedNumber.notes}
                  onChange={(e) => setSelectedNumber({ ...selectedNumber, notes: e.target.value })}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedNumber.isPrimary}
                      onChange={(e) => setSelectedNumber({ ...selectedNumber, isPrimary: e.target.checked })}
                    />
                  }
                  label="Set as Primary Number"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedNumber.isDND}
                      onChange={(e) => setSelectedNumber({ ...selectedNumber, isDND: e.target.checked })}
                    />
                  }
                  label="Do Not Disturb (DND)"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedNumber.isVerified}
                      onChange={(e) => setSelectedNumber({ ...selectedNumber, isVerified: e.target.checked })}
                    />
                  }
                  label="Verified Number"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialog(false);
            setValidationErrors({});
          }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditNumber}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultiContactNumberManager;
