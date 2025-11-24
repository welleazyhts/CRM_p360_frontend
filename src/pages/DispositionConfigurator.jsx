import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Switch, FormControl, InputLabel, Select, MenuItem,
  Accordion, AccordionSummary, AccordionDetails, Divider, Alert, Snackbar,
  Tooltip, Badge, alpha, useTheme, FormControlLabel, Checkbox, Avatar,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  PhoneCallback as PhoneCallbackIcon,
  PhoneMissed as PhoneMissedIcon,
  Block as BlockIcon,
  Assessment as StatsIcon,
  Category as CategoryIcon,
  AccountTree as TreeIcon,
  Timer as TimerIcon,
  Notifications as NotifyIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Task as TaskIcon
} from '@mui/icons-material';
import { useDisposition } from '../context/DispositionContext';

const DispositionConfigurator = () => {
  const theme = useTheme();
  const {
    dispositions,
    addDisposition,
    updateDisposition,
    deleteDisposition,
    toggleDisposition,
    addSubDisposition,
    updateSubDisposition,
    deleteSubDisposition,
    toggleSubDisposition,
    getStatistics
  } = useDisposition();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedDisp, setExpandedDisp] = useState(null);

  // Disposition Dialog
  const [dispDialog, setDispDialog] = useState({
    open: false,
    mode: 'add',
    data: {
      name: '',
      category: 'open',
      description: '',
      color: '#4CAF50',
      icon: 'CheckCircle',
      active: true,
      slaHours: 24,
      autoActions: {
        sendEmail: false,
        sendSMS: false,
        createTask: false,
        notifyManager: false
      }
    }
  });

  // Sub-disposition Dialog
  const [subDispDialog, setSubDispDialog] = useState({
    open: false,
    mode: 'add',
    parentId: null,
    data: {
      name: '',
      description: '',
      active: true,
      requiresFollowUp: false,
      followUpDays: 1
    }
  });

  const stats = getStatistics();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ============ DISPOSITION FUNCTIONS ============

  const handleOpenDispDialog = (mode, disp = null) => {
    if (mode === 'edit' && disp) {
      setDispDialog({
        open: true,
        mode: 'edit',
        data: { ...disp }
      });
    } else {
      setDispDialog({
        open: true,
        mode: 'add',
        data: {
          name: '',
          category: 'open',
          description: '',
          color: '#4CAF50',
          icon: 'CheckCircle',
          active: true,
          slaHours: 24,
          autoActions: {
            sendEmail: false,
            sendSMS: false,
            createTask: false,
            notifyManager: false
          }
        }
      });
    }
  };

  const handleCloseDispDialog = () => {
    setDispDialog(prev => ({ ...prev, open: false }));
  };

  const handleDispFieldChange = (field, value) => {
    setDispDialog(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handleAutoActionChange = (action, value) => {
    setDispDialog(prev => ({
      ...prev,
      data: {
        ...prev.data,
        autoActions: { ...prev.data.autoActions, [action]: value }
      }
    }));
  };

  const handleSaveDisposition = () => {
    const { mode, data } = dispDialog;

    if (!data.name) {
      showSnackbar('Please enter disposition name', 'error');
      return;
    }

    if (mode === 'add') {
      const result = addDisposition(data);
      if (result.success) {
        showSnackbar('Disposition added successfully');
        handleCloseDispDialog();
      }
    } else {
      const result = updateDisposition(data.id, data);
      if (result.success) {
        showSnackbar('Disposition updated successfully');
        handleCloseDispDialog();
      }
    }
  };

  const handleDeleteDisposition = (dispId) => {
    const result = deleteDisposition(dispId);
    if (result.success) {
      showSnackbar('Disposition deleted successfully');
    }
  };

  const handleToggleDisposition = (dispId) => {
    toggleDisposition(dispId);
    showSnackbar('Disposition status updated');
  };

  // ============ SUB-DISPOSITION FUNCTIONS ============

  const handleOpenSubDispDialog = (mode, parentId, subDisp = null) => {
    if (mode === 'edit' && subDisp) {
      setSubDispDialog({
        open: true,
        mode: 'edit',
        parentId,
        data: { ...subDisp }
      });
    } else {
      setSubDispDialog({
        open: true,
        mode: 'add',
        parentId,
        data: {
          name: '',
          description: '',
          active: true,
          requiresFollowUp: false,
          followUpDays: 1
        }
      });
    }
  };

  const handleCloseSubDispDialog = () => {
    setSubDispDialog(prev => ({ ...prev, open: false }));
  };

  const handleSubDispFieldChange = (field, value) => {
    setSubDispDialog(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const handleSaveSubDisposition = () => {
    const { mode, parentId, data } = subDispDialog;

    if (!data.name) {
      showSnackbar('Please enter sub-disposition name', 'error');
      return;
    }

    if (mode === 'add') {
      const result = addSubDisposition(parentId, data);
      if (result.success) {
        showSnackbar('Sub-disposition added successfully');
        handleCloseSubDispDialog();
      }
    } else {
      const result = updateSubDisposition(parentId, data.id, data);
      if (result.success) {
        showSnackbar('Sub-disposition updated successfully');
        handleCloseSubDispDialog();
      }
    }
  };

  const handleDeleteSubDisposition = (dispId, subDispId) => {
    if (window.confirm('Are you sure you want to delete this sub-disposition?')) {
      const result = deleteSubDisposition(dispId, subDispId);
      if (result.success) {
        showSnackbar('Sub-disposition deleted successfully');
      }
    }
  };

  const handleToggleSubDisposition = (dispId, subDispId) => {
    toggleSubDisposition(dispId, subDispId);
    showSnackbar('Sub-disposition status updated');
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'open': return 'primary';
      case 'won': return 'success';
      case 'lost': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Disposition & Sub-disposition Configurator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage lead statuses and their sub-categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDispDialog('add')}
        >
          Add Disposition
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
                    Total Dispositions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalDispositions}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {stats.activeDispositions} Active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <CategoryIcon />
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
                    Sub-dispositions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalSubDispositions}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {stats.activeSubDispositions} Active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <TreeIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Open
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {stats.byCategory.open}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Won
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.byCategory.won}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Lost
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.byCategory.lost}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dispositions List */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Disposition Library
          </Typography>

          {(dispositions || []).map((disp) => (
            <Accordion
              key={disp.id}
              expanded={expandedDisp === disp.id}
              onChange={() => setExpandedDisp(expandedDisp === disp.id ? null : disp.id)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <DragIcon sx={{ cursor: 'grab', color: 'text.secondary' }} />

                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: disp.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {disp.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {disp.description}
                    </Typography>
                  </Box>

                  <Chip
                    label={disp.category}
                    size="small"
                    color={getCategoryColor(disp.category)}
                  />

                  <Chip
                    label={`${disp.subDispositions?.length || 0} sub-items`}
                    size="small"
                    variant="outlined"
                  />

                  <Chip
                    label={`SLA: ${disp.slaHours}h`}
                    size="small"
                    icon={<TimerIcon />}
                  />

                  <Switch
                    checked={disp.active}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleDisposition(disp.id);
                    }}
                    size="small"
                  />

                  <Box onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDispDialog('edit', disp)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteDisposition(disp.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box sx={{ pl: 6 }}>
                  {/* Auto Actions */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Auto Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {disp.autoActions.sendEmail && (
                        <Chip icon={<EmailIcon />} label="Send Email" size="small" color="primary" />
                      )}
                      {disp.autoActions.sendSMS && (
                        <Chip icon={<SmsIcon />} label="Send SMS" size="small" color="primary" />
                      )}
                      {disp.autoActions.createTask && (
                        <Chip icon={<TaskIcon />} label="Create Task" size="small" color="primary" />
                      )}
                      {disp.autoActions.notifyManager && (
                        <Chip icon={<NotifyIcon />} label="Notify Manager" size="small" color="primary" />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Sub-dispositions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Sub-dispositions
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenSubDispDialog('add', disp.id)}
                    >
                      Add Sub-disposition
                    </Button>
                  </Box>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Follow-up</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {disp.subDispositions?.map((subDisp) => (
                          <TableRow key={subDisp.id}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {subDisp.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {subDisp.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {subDisp.requiresFollowUp ? (
                                <Chip
                                  label={`${subDisp.followUpDays} days`}
                                  size="small"
                                  color="warning"
                                />
                              ) : (
                                <Chip label="No" size="small" variant="outlined" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={subDisp.active}
                                onChange={() => handleToggleSubDisposition(disp.id, subDisp.id)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenSubDispDialog('edit', disp.id, subDisp)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteSubDisposition(disp.id, subDisp.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!disp.subDispositions || disp.subDispositions.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <Typography variant="caption" color="text.secondary">
                                No sub-dispositions added yet
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          {(dispositions?.length || 0) === 0 && (
            <Alert severity="info">
              No dispositions configured. Click "Add Disposition" to get started.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Disposition Dialog */}
      <Dialog
        open={dispDialog.open}
        onClose={handleCloseDispDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dispDialog.mode === 'add' ? 'Add Disposition' : 'Edit Disposition'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Disposition Name *"
              value={dispDialog.data.name}
              onChange={(e) => handleDispFieldChange('name', e.target.value)}
              placeholder="e.g., Interested, Not Interested"
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={dispDialog.data.description}
              onChange={(e) => handleDispFieldChange('description', e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={dispDialog.data.category}
                    label="Category *"
                    onChange={(e) => handleDispFieldChange('category', e.target.value)}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="won">Won</MenuItem>
                    <MenuItem value="lost">Lost</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="color"
                  label="Color"
                  value={dispDialog.data.color}
                  onChange={(e) => handleDispFieldChange('color', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="SLA Hours"
                  value={dispDialog.data.slaHours}
                  onChange={(e) => handleDispFieldChange('slaHours', parseInt(e.target.value))}
                  helperText="Expected response time in hours"
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Auto Actions
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={dispDialog.data.autoActions.sendEmail}
                  onChange={(e) => handleAutoActionChange('sendEmail', e.target.checked)}
                />
              }
              label="Send Email"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dispDialog.data.autoActions.sendSMS}
                  onChange={(e) => handleAutoActionChange('sendSMS', e.target.checked)}
                />
              }
              label="Send SMS"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dispDialog.data.autoActions.createTask}
                  onChange={(e) => handleAutoActionChange('createTask', e.target.checked)}
                />
              }
              label="Create Follow-up Task"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dispDialog.data.autoActions.notifyManager}
                  onChange={(e) => handleAutoActionChange('notifyManager', e.target.checked)}
                />
              }
              label="Notify Manager"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDispDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveDisposition}>
            {dispDialog.mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sub-disposition Dialog */}
      <Dialog
        open={subDispDialog.open}
        onClose={handleCloseSubDispDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {subDispDialog.mode === 'add' ? 'Add Sub-disposition' : 'Edit Sub-disposition'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Sub-disposition Name *"
              value={subDispDialog.data.name}
              onChange={(e) => handleSubDispFieldChange('name', e.target.value)}
              placeholder="e.g., Needs Quote, Already Insured"
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={subDispDialog.data.description}
              onChange={(e) => handleSubDispFieldChange('description', e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={subDispDialog.data.requiresFollowUp}
                  onChange={(e) => handleSubDispFieldChange('requiresFollowUp', e.target.checked)}
                />
              }
              label="Requires Follow-up"
            />

            {subDispDialog.data.requiresFollowUp && (
              <TextField
                fullWidth
                type="number"
                label="Follow-up Days"
                value={subDispDialog.data.followUpDays}
                onChange={(e) => handleSubDispFieldChange('followUpDays', parseInt(e.target.value))}
                helperText="Number of days for follow-up"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubDispDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSubDisposition}>
            {subDispDialog.mode === 'add' ? 'Add' : 'Save'}
          </Button>
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

export default DispositionConfigurator;
