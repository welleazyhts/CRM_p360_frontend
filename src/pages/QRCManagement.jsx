import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tabs,
  Tab,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  PhoneInbound as PhoneInboundIcon,
  QuestionAnswer as QueryIcon,
  Assignment as RequestIcon,
  Warning as ComplaintIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Note as NoteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';

import qrcService from '../services/qrcService';

const QRCManagement = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    communicationMode: 'Call',
    caller: 'Customer',
    callType: 'Query',
    resolution: 'Pending',
    callReason: 'Policy Information',
    callDateTime: new Date(),
    callerName: '',
    taCode: '',
    csrName: '',
    icName: '',
    callerEmail: '',
    state: '',
    city: '',
    contactNumber: '',
    remarks: '',
    callId: '', // Display ID
    isSuspiciousCase: false
  });

  const communicationModes = ['Call', 'Email', 'WhatsApp', 'In Person'];
  const callTypes = ['Query', 'Request', 'Complaint'];
  const resolutions = ['Resolved', 'Pending', 'Escalated', 'Closed'];
  const callReasons = [
    'Policy Information',
    'Premium Payment',
    'Claim Status',
    'Document Request',
    'Complaint',
    'General Inquiry',
    'Technical Issue'
  ];

  const csrList = [
    'Firoz Khan Ummer',
    'Priya Sharma',
    'Rahul Verma',
    'Sarah Johnson',
    'Amit Kumar'
  ];

  const icNames = [
    'Pnb Metlife IC',
    'HDFC Life',
    'ICICI Prudential',
    'LIC',
    'Max Life'
  ];

  const states = [
    'Andaman & Nicobar Islands',
    'Andhra Pradesh',
    'Delhi',
    'Karnataka',
    'Kerala',
    'Maharashtra',
    'Tamil Nadu',
    // Add more states as needed
  ];

  // Helper: format incoming date/time values for display
  const _formatDateTimeForDisplay = (val) => {
    if (!val) return val;
    try {
      const d = new Date(val);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString(); // browser-local formatted string
      }
    } catch (e) {
      // ignore
    }
    return val; // fallback to original if not a date
  };

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchEntries();
    fetchStats();
  }, [debouncedSearchTerm, filterType]);

  const fetchStats = async () => {
    try {
      const data = await qrcService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      let res;
      if (debouncedSearchTerm) {
        // Assuming backend uses 'search' or 'q' param. Using 'search' as common Django DRF pattern
        res = await qrcService.search({ search: debouncedSearchTerm });
      } else if (filterType !== 'all') {
        res = await qrcService.filter({ call_type: filterType });
      } else {
        res = await qrcService.list();
      }

      // normalize any date fields for display
      if (Array.isArray(res)) {
        const normalized = res.map((item) => ({
          ...item,
          callDateTime: _formatDateTimeForDisplay(item.callDateTime),
        }));
        setEntries(normalized);
      } else if (res && Array.isArray(res.results)) {
        // handle paginated responses like { results: [...] }
        const normalized = res.results.map((item) => ({
          ...item,
          callDateTime: _formatDateTimeForDisplay(item.callDateTime),
        }));
        setEntries(normalized);
      } else {
        // unexpected structure: set empty array
        setEntries([]);
      }
    } catch (err) {
      console.error('Failed to load QRC entries from API:', err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    // prepare payload - keep keys same as formData; qrcService will handle date conversion
    const payload = {
      ...formData,
    };

    // Check for ID in either selectedEntry (if persistent) or formData (state)
    const entryId = selectedEntry?.id !== undefined ? selectedEntry.id : formData?.id;

    // Remove ID from payload to avoid sending it in the body
    const { id, ...cleanPayload } = payload;

    try {
      if (entryId !== null && entryId !== undefined) {
        // update via API using Partial Update (PATCH)
        const updated = await qrcService.partialUpdate(entryId, cleanPayload);
        // normalize date for display, and merge with formData to ensure UI updates immediately with user input
        // even if backend response is partial.
        const normalized = {
          ...selectedEntry,
          ...formData, // Trust user input for display (optimistic)
          ...updated, // Backend data overrides if present
          callDateTime: _formatDateTimeForDisplay(updated.callDateTime || formData.callDateTime)
        };
        setEntries(prev => prev.map(entry => (entry.id === entryId ? normalized : entry)));
      } else {
        // create via API
        const created = await qrcService.create(payload);
        const normalized = {
          ...formData, // Trust user input
          ...created,
          callDateTime: _formatDateTimeForDisplay(created.callDateTime || formData.callDateTime)
        };
        setEntries(prev => [...prev, normalized]);
      }
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save entry to API:', err);
      alert(t('qrc.messages.saveError'));
    }
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    // convert callDateTime back to Date for the DateTimePicker if possible
    const prepared = {
      ...entry,
    };
    try {
      const d = new Date(entry.callDateTime);
      if (!Number.isNaN(d.getTime())) prepared.callDateTime = d;
    } catch (e) {
      // leave as-is
    }
    // Ensure ID is explicitly in formData
    if (entry.id !== undefined && entry.id !== null) {
      prepared.id = entry.id;
    }
    setFormData(prepared);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    // Add confirmation dialog
    if (!window.confirm(t('qrc.messages.deleteConfirm'))) {
      return;
    }

    try {
      await qrcService.destroy(id);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Failed to delete entry via API:', err);
      alert(t('qrc.messages.deleteError'));
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      communicationMode: 'Call',
      caller: 'Customer',
      callType: 'Query',
      resolution: 'Pending',
      callReason: 'Policy Information',
      callDateTime: new Date(),
      callerName: '',
      taCode: '',
      csrName: '',
      icName: '',
      callerEmail: '',
      state: '',
      city: '',
      contactNumber: '',
      remarks: '',
      callId: '',
      isSuspiciousCase: false
    });
    setSelectedEntry(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Query':
        return <QueryIcon />;
      case 'Request':
        return <RequestIcon />;
      case 'Complaint':
        return <ComplaintIcon />;
      default:
        return <QueryIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return theme.palette.success.main;
      case 'Pending':
        return theme.palette.warning.main;
      case 'Escalated':
        return theme.palette.error.main;
      case 'Closed':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Optimized: No client-side filtering needed as we use server-side now
  const displayEntries = entries;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            {t('qrc.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('qrc.subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          {t('qrc.buttons.addNew')}
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder={t('qrc.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.filters.filterByType')}</InputLabel>
                <Select
                  value={filterType}
                  label={t('qrc.filters.filterByType')}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">{t('qrc.filters.allTypes')}</MenuItem>
                  <MenuItem value="query">{t('qrc.filters.queries')}</MenuItem>
                  <MenuItem value="request">{t('qrc.filters.requests')}</MenuItem>
                  <MenuItem value="complaint">{t('qrc.filters.complaints')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), border: `1px solid ${theme.palette.primary.main}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Cases</Typography>
                <Typography variant="h4" color="primary">{stats.total || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${theme.palette.warning.main}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Pending</Typography>
                <Typography variant="h4" color="warning.main">{stats.pending || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), border: `1px solid ${theme.palette.success.main}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Resolved</Typography>
                <Typography variant="h4" color="success.main">{stats.resolved || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), border: `1px solid ${theme.palette.error.main}` }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Escalated</Typography>
                <Typography variant="h4" color="error.main">{stats.escalated || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* List View */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('qrc.table.id')}</TableCell>
                <TableCell>{t('qrc.table.dateTime')}</TableCell>
                <TableCell>{t('qrc.table.type')}</TableCell>
                <TableCell>{t('qrc.table.callerDetails')}</TableCell>
                <TableCell>{t('qrc.table.reason')}</TableCell>
                <TableCell>{t('qrc.table.csr')}</TableCell>
                <TableCell>{t('qrc.table.status')}</TableCell>
                <TableCell align="center">{t('qrc.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : displayEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">No entries found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayEntries.map((entry) => (
                  <TableRow key={entry.id} hover>
                    <TableCell>{entry.callId}</TableCell>
                    <TableCell>{entry.callDateTime}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {getTypeIcon(entry.callType || 'Query')}
                        <Typography variant="body2">{t(`qrc.enums.callType.${(entry.callType || 'query').toLowerCase()}`, { defaultValue: entry.callType || 'Unknown' })}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{entry.callerName || 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {entry.contactNumber || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{t(`qrc.enums.callReason.${(entry.callReason || '').replace(/ /g, '').replace(/^(.)/, (c) => c.toLowerCase())}`, { defaultValue: entry.callReason || 'N/A' })}</TableCell>
                    <TableCell>{entry.csrName || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`qrc.enums.resolution.${(entry.resolution || 'pending').toLowerCase()}`, { defaultValue: entry.resolution })}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(entry.resolution), 0.1),
                          color: getStatusColor(entry.resolution),
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title={t('qrc.buttons.edit')}>
                          <IconButton size="small" onClick={() => handleEdit(entry)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('qrc.buttons.delete')}>
                          <IconButton size="small" onClick={() => handleDelete(entry.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEntry ? t('qrc.dialog.editTitle') : t('qrc.dialog.addTitle')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.communicationMode')}</InputLabel>
                <Select
                  value={formData.communicationMode}
                  label={t('qrc.dialog.communicationMode')}
                  onChange={(e) => setFormData({ ...formData, communicationMode: e.target.value })}
                >
                  {communicationModes.map(mode => (
                    <MenuItem key={mode} value={mode}>{t(`qrc.enums.communicationMode.${mode.replace(/ /g, '').replace(/^(.)/, (c) => c.toLowerCase())}`, { defaultValue: mode })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.callerType')}</InputLabel>
                <Select
                  value={formData.caller}
                  label={t('qrc.dialog.callerType')}
                  onChange={(e) => setFormData({ ...formData, caller: e.target.value })}
                >
                  <MenuItem value="Customer">{t('qrc.enums.caller.customer')}</MenuItem>
                  <MenuItem value="Agent">{t('qrc.enums.caller.agent')}</MenuItem>
                  <MenuItem value="Employee">{t('qrc.enums.caller.employee')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.callType')}</InputLabel>
                <Select
                  value={formData.callType}
                  label={t('qrc.dialog.callType')}
                  onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
                >
                  {callTypes.map(type => (
                    <MenuItem key={type} value={type}>{t(`qrc.enums.callType.${type.toLowerCase()}`, { defaultValue: type })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.resolutionStatus')}</InputLabel>
                <Select
                  value={formData.resolution}
                  label={t('qrc.dialog.resolutionStatus')}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                >
                  {resolutions.map(resolution => (
                    <MenuItem key={resolution} value={resolution}>{t(`qrc.enums.resolution.${resolution.toLowerCase()}`, { defaultValue: resolution })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.callReason')}</InputLabel>
                <Select
                  value={formData.callReason}
                  label={t('qrc.dialog.callReason')}
                  onChange={(e) => setFormData({ ...formData, callReason: e.target.value })}
                >
                  {callReasons.map(reason => (
                    <MenuItem key={reason} value={reason}>{t(`qrc.enums.callReason.${reason.replace(/ /g, '').replace(/^(.)/, (c) => c.toLowerCase())}`, { defaultValue: reason })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label={t('qrc.dialog.callDateTime')}
                  value={formData.callDateTime}
                  onChange={(newValue) => setFormData({ ...formData, callDateTime: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('qrc.dialog.callerName')}
                value={formData.callerName}
                onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('qrc.dialog.taCode')}
                value={formData.taCode}
                onChange={(e) => setFormData({ ...formData, taCode: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.csrName')}</InputLabel>
                <Select
                  value={formData.csrName}
                  label={t('qrc.dialog.csrName')}
                  onChange={(e) => setFormData({ ...formData, csrName: e.target.value })}
                >
                  {csrList.map(csr => (
                    <MenuItem key={csr} value={csr}>{csr}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.icName')}</InputLabel>
                <Select
                  value={formData.icName}
                  label={t('qrc.dialog.icName')}
                  onChange={(e) => setFormData({ ...formData, icName: e.target.value })}
                >
                  {icNames.map(ic => (
                    <MenuItem key={ic} value={ic}>{ic}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('qrc.dialog.callerEmail')}
                type="email"
                value={formData.callerEmail}
                onChange={(e) => setFormData({ ...formData, callerEmail: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('qrc.dialog.state')}</InputLabel>
                <Select
                  value={formData.state}
                  label={t('qrc.dialog.state')}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  {states.map(state => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('qrc.dialog.city')}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('qrc.dialog.contactNumber')}
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('qrc.dialog.remarks')}
                multiline
                rows={4}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio
                    checked={!formData.isSuspiciousCase}
                    onChange={(e) => setFormData({ ...formData, isSuspiciousCase: false })}
                  />
                }
                label={t('qrc.dialog.no')}
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.isSuspiciousCase}
                    onChange={(e) => setFormData({ ...formData, isSuspiciousCase: true })}
                  />
                }
                label={t('qrc.dialog.yes')}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {t('qrc.dialog.suspiciousCase')}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('qrc.buttons.cancel')}</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {selectedEntry ? t('qrc.buttons.update') : t('qrc.buttons.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCManagement;
