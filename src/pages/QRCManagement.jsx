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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

import qrcService from '../services/qrcService';// <-- service import

const QRCManagement = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    communicationMode: 'Call',
    caller: '',
    callType: 'Query',
    resolution: '',
    callReason: '',
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

  useEffect(() => {
    // Fetch real data from backend via qrcService.list()
    // If the call fails, fall back to a small local mock so UI still shows something.
    const fetchEntries = async () => {
      try {
        const res = await qrcService.list();
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
        console.error('Failed to load QRC entries from API, using mock data as fallback:', err);
        // fallback mock data (same as previous mock)
        setEntries([
          {
            id: 1,
            communicationMode: 'Call',
            caller: 'Customer',
            callType: 'Query',
            resolution: 'Resolved',
            callReason: 'Policy Information',
            callDateTime: '2025-10-10 09:30 AM',
            callerName: 'Rajesh Kumar',
            taCode: 'TA123456',
            csrName: 'Firoz Khan Ummer',
            icName: 'Pnb Metlife IC',
            callerEmail: 'rajesh.kumar@email.com',
            state: 'Karnataka',
            city: 'Bangalore',
            contactNumber: '9876543210',
            remarks: 'Customer inquired about policy renewal process',
            callId: 'CALL001',
            isSuspiciousCase: false
          },
        ]);
      }
    };

    fetchEntries();
  }, []);

  const handleFormSubmit = async () => {
    // prepare payload - keep keys same as formData; qrcService will handle date conversion
    const payload = {
      ...formData,
    };
    try {
      if (selectedEntry && selectedEntry.id) {
        // update via API
        const updated = await qrcService.update(selectedEntry.id, payload);
        // normalize date for display
        const normalized = { ...updated, callDateTime: _formatDateTimeForDisplay(updated.callDateTime) };
        setEntries(prev => prev.map(entry => (entry.id === selectedEntry.id ? normalized : entry)));
      } else {
        // create via API
        const created = await qrcService.create(payload);
        const normalized = { ...created, callDateTime: _formatDateTimeForDisplay(created.callDateTime) };
        setEntries(prev => [...prev, normalized]);
      }
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      // If API persist fails (backend unavailable or network), fall back to a local in-memory save
      console.error('Failed to save entry to API, falling back to local:', err);
      try {
        if (selectedEntry && selectedEntry.id) {
          // local update
          const normalized = {
            ...selectedEntry,
            ...payload,
            callDateTime: _formatDateTimeForDisplay(payload.callDateTime || selectedEntry.callDateTime),
          };
          setEntries(prev => prev.map(entry => (entry.id === selectedEntry.id ? normalized : entry)));
        } else {
          // local create: synthesize an id and callId when backend is unavailable
          const id = Date.now();
          const callId = formData.callId || `CALL${id}`;
          const local = {
            id,
            callId,
            ...payload,
            callDateTime: _formatDateTimeForDisplay(payload.callDateTime),
          };
          setEntries(prev => [...prev, local]);
        }
        setOpenDialog(false);
        resetForm();
      } catch (localErr) {
        console.error('Failed to perform local fallback save:', localErr);
      }
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
    setFormData(prepared);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await qrcService.destroy(id);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Failed to delete entry:', err);
      // optionally show feedback to user
    }
  };

  const resetForm = () => {
    setFormData({
      communicationMode: 'Call',
      caller: '',
      callType: 'Query',
      resolution: '',
      callReason: '',
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

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = Object.values(entry).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesType = filterType === 'all' || entry.callType.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            QRC Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage Queries, Requests, and Complaints
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
          Add New Entry
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search..."
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
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  label="Filter by Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="query">Queries</MenuItem>
                  <MenuItem value="request">Requests</MenuItem>
                  <MenuItem value="complaint">Complaints</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* List View */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Caller Details</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>CSR</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>{entry.callId}</TableCell>
                  <TableCell>{entry.callDateTime}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {getTypeIcon(entry.callType)}
                      <Typography variant="body2">{entry.callType}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{entry.callerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.contactNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{entry.callReason}</TableCell>
                  <TableCell>{entry.csrName}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.resolution}
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
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(entry)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(entry.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
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
          {selectedEntry ? 'Edit Entry' : 'Add New Entry'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Communication Mode</InputLabel>
                <Select
                  value={formData.communicationMode}
                  label="Communication Mode"
                  onChange={(e) => setFormData({ ...formData, communicationMode: e.target.value })}
                >
                  {communicationModes.map(mode => (
                    <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Caller Type</InputLabel>
                <Select
                  value={formData.caller}
                  label="Caller Type"
                  onChange={(e) => setFormData({ ...formData, caller: e.target.value })}
                >
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Agent">Agent</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Call Type</InputLabel>
                <Select
                  value={formData.callType}
                  label="Call Type"
                  onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
                >
                  {callTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Resolution Status</InputLabel>
                <Select
                  value={formData.resolution}
                  label="Resolution Status"
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                >
                  {resolutions.map(resolution => (
                    <MenuItem key={resolution} value={resolution}>{resolution}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Call Reason</InputLabel>
                <Select
                  value={formData.callReason}
                  label="Call Reason"
                  onChange={(e) => setFormData({ ...formData, callReason: e.target.value })}
                >
                  {callReasons.map(reason => (
                    <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Call Date and Time"
                  value={formData.callDateTime}
                  onChange={(newValue) => setFormData({ ...formData, callDateTime: newValue })}
                  slots={{ textField: TextField }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name of the Caller"
                value={formData.callerName}
                onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TA/Case Code"
                value={formData.taCode}
                onChange={(e) => setFormData({ ...formData, taCode: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>CSR's Name</InputLabel>
                <Select
                  value={formData.csrName}
                  label="CSR's Name"
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
                <InputLabel>IC Name</InputLabel>
                <Select
                  value={formData.icName}
                  label="IC Name"
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
                label="Caller's Email ID"
                type="email"
                value={formData.callerEmail}
                onChange={(e) => setFormData({ ...formData, callerEmail: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  label="State"
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
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
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
                label="No"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.isSuspiciousCase}
                    onChange={(e) => setFormData({ ...formData, isSuspiciousCase: true })}
                  />
                }
                label="Yes"
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                Suspicious Case?
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {selectedEntry ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCManagement;
