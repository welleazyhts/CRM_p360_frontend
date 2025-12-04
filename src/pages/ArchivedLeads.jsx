import React, { useState, useEffect } from 'react';
import leadService from '../services/leadService';
import {
  Box, Card, CardContent, Typography, Button, Grid, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  IconButton, Tooltip, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  useTheme, alpha, Snackbar, Alert, CircularProgress, List, ListItem,
  ListItemIcon, ListItemText, Avatar, Divider
} from '@mui/material';
import {
  Download as DownloadIcon, Search as SearchIcon, FilterList as FilterIcon,
  Sort as SortIcon, History as HistoryIcon, Visibility as VisibilityIcon,
  Unarchive as UnarchiveIcon, Delete as DeleteIcon, DateRange as DateRangeIcon,
  CheckCircle as CheckCircleIcon, Phone as PhoneIcon, Note as NoteIcon,
  Email as EmailIcon, Upload as UploadIcon, Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchivedLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [sortField, setSortField] = useState('archivedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, lead: null, action: '' });
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedHistoryLead, setSelectedHistoryLead] = useState(null);
  const [leadHistory, setLeadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const statusOptions = ['New Lead', 'Contacted', 'Follow Up', 'Qualified', 'Proposal Sent'];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const data = await leadService.getArchivedLeads();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error('Error fetching archived leads:', error);
      }
    };
    fetchArchived();
  }, []);

  // Apply filters whenever search term, filter status, or date range changes
  useEffect(() => {
    let filtered = [...leads];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.id.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter(lead => lead.previousStatus === filterStatus);
    }

    // Apply date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const dateThreshold = new Date();

      switch (selectedDateRange) {
        case 'last7':
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case 'last30':
          dateThreshold.setDate(now.getDate() - 30);
          break;
        case 'last90':
          dateThreshold.setDate(now.getDate() - 90);
          break;
        default:
          break;
      }

      filtered = filtered.filter(lead => {
        const archivedDate = new Date(lead.archivedDate);
        return archivedDate >= dateThreshold;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'archivedDate') {
        aValue = new Date(a.archivedDate);
        bValue = new Date(b.archivedDate);
      } else if (sortField === 'premium') {
        aValue = a.premium || 0;
        bValue = b.premium || 0;
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeads(filtered);
  }, [searchTerm, filterStatus, selectedDateRange, sortField, sortOrder, leads]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const filters = {
        status: filterStatus !== 'All' ? filterStatus : null,
        dateRange: selectedDateRange,
        searchTerm: searchTerm
      };

      const blob = await leadService.exportArchivedLeads(filters, 'csv');

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `archived-leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSnackbar({ open: true, message: 'Data exported successfully!', severity: 'success' });
      } else {
        // Fallback: client-side CSV generation
        const csvContent = generateCSV(filteredLeads);
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `archived-leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSnackbar({ open: true, message: 'Data exported successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setSnackbar({ open: true, message: 'Failed to export data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = (lead) => {
    setConfirmDialog({ open: true, lead, action: 'unarchive' });
  };

  const handlePermanentDelete = (lead) => {
    setConfirmDialog({ open: true, lead, action: 'delete' });
  };

  const handleConfirmAction = async () => {
    try {
      setLoading(true);
      const { lead, action } = confirmDialog;

      if (action === 'unarchive') {
        const result = await leadService.unarchiveLead(lead.id);
        if (result.success) {
          setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));
          setSnackbar({ open: true, message: 'Lead unarchived successfully and moved to active leads!', severity: 'success' });
        }
      } else if (action === 'delete') {
        const result = await leadService.permanentlyDeleteLead(lead.id);
        if (result.success) {
          setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));
          setSnackbar({ open: true, message: 'Lead permanently deleted!', severity: 'success' });
        }
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setSnackbar({ open: true, message: 'Failed to perform action', severity: 'error' });
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, lead: null, action: '' });
    }
  };

  const handleViewHistory = async (lead) => {
    try {
      setLoading(true);
      setSelectedHistoryLead(lead);
      const history = await leadService.getLeadHistory(lead.id);
      setLeadHistory(history);
      setHistoryDialogOpen(true);
    } catch (error) {
      console.error('Error fetching lead history:', error);
      setSnackbar({ open: true, message: 'Failed to fetch lead history', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data) => {
    const headers = ['Lead ID', 'Name', 'Phone', 'Email', 'Previous Status', 'Policy Type', 'Premium', 'Archived Date', 'Archived Reason', 'Archived By'];
    const rows = data.map(lead => [
      lead.id,
      `${lead.firstName} ${lead.lastName}`,
      lead.phone,
      lead.email,
      lead.previousStatus,
      lead.policyType,
      lead.premium || '',
      lead.archivedDate,
      lead.archivedReason || '',
      lead.archivedBy
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const getHistoryIcon = (iconName) => {
    const icons = {
      CheckCircle: <CheckCircleIcon />,
      Phone: <PhoneIcon />,
      Note: <NoteIcon />,
      Email: <EmailIcon />,
      Upload: <UploadIcon />,
      Add: <AddIcon />
    };
    return icons[iconName] || <NoteIcon />;
  };

  const getHistoryColor = (type) => {
    const colors = {
      status_change: theme.palette.success.main,
      call: theme.palette.info.main,
      note: theme.palette.warning.main,
      email: theme.palette.primary.main,
      document: theme.palette.secondary.main,
      created: theme.palette.grey[500]
    };
    return colors[type] || theme.palette.grey[500];
  };

  const getStatusColor = (status) => {
    const colors = {
      'New Lead': theme.palette.info.main,
      'Contacted': theme.palette.primary.main,
      'Follow Up': theme.palette.warning.main,
      'Qualified': theme.palette.success.main,
      'Proposal Sent': theme.palette.secondary.main
    };
    return colors[status] || theme.palette.grey[500];
  };

  // Calculate stats from filtered leads
  const totalArchived = filteredLeads.length;
  const thisMonthCount = filteredLeads.filter(l => new Date(l.archivedDate).getMonth() === new Date().getMonth()).length;
  const totalValue = filteredLeads.reduce((sum, lead) => sum + (lead.premium || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">
            Archived Leads
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Leads that have been archived from active database
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={handleExportData}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Export Data
          </Button>
        </Grid>
      </Grid>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.grey[600], 0.1)} 0%, ${alpha(theme.palette.grey[700], 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Archived</Typography>
              <Typography variant="h4" fontWeight="600" color="grey.700">
                {totalArchived}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">This Month</Typography>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {thisMonthCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Value</Typography>
              <Typography variant="h4" fontWeight="600" color="info.main">
                ₹{totalValue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Warning Alert */}
      <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.warning.main, 0.05), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}` }}>
        <CardContent>
          <Typography variant="body2" color="warning.dark">
            <strong>Note:</strong> Archived leads can be restored or permanently deleted. Permanent deletion cannot be undone.
          </Typography>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                placeholder="Search archived leads..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Filter by Previous Status"
                value={filterStatus}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <FilterIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                <MenuItem value="All">All Status</MenuItem>
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Date Range"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                InputProps={{
                  startAdornment: <DateRangeIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                {dateRangeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={() => handleSort('archivedDate')}
                fullWidth
              >
                Sort by Date {sortField === 'archivedDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lead Details</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Previous Status</TableCell>
                <TableCell>Policy Type</TableCell>
                <TableCell>Archived Date</TableCell>
                <TableCell>Archived Reason</TableCell>
                <TableCell>Archived By</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} hover sx={{ bgcolor: alpha(theme.palette.grey[500], 0.02) }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {lead.firstName} {lead.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: LD{new Date().getFullYear()}{String(lead.id).padStart(6, '0')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{lead.phone}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lead.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lead.previousStatus}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(lead.previousStatus), 0.1),
                        color: getStatusColor(lead.previousStatus),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.policyType}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ₹{lead.premium?.toLocaleString() || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.archivedDate}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="warning.dark">
                      {lead.archivedReason}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.archivedBy}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Unarchive Lead">
                        <IconButton
                          size="small"
                          onClick={() => handleUnarchive(lead)}
                          sx={{
                            color: theme.palette.success.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.success.main, 0.1)
                            }
                          }}
                        >
                          <UnarchiveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/lead-management/${lead.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View History">
                        <IconButton
                          size="small"
                          onClick={() => handleViewHistory(lead)}
                          sx={{ color: theme.palette.info.main }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Permanent Delete">
                        <IconButton
                          size="small"
                          onClick={() => handlePermanentDelete(lead)}
                          sx={{
                            color: theme.palette.error.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1)
                            }
                          }}
                        >
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, lead: null, action: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            {confirmDialog.action === 'unarchive' ? 'Unarchive Lead' : 'Permanent Delete'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {confirmDialog.lead && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Lead: <strong>{confirmDialog.lead.firstName} {confirmDialog.lead.lastName}</strong>
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {confirmDialog.action === 'unarchive'
                  ? 'Are you sure you want to unarchive this lead? It will be restored to active leads.'
                  : 'Are you sure you want to permanently delete this lead? This action cannot be undone.'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, lead: null, action: '' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.action === 'unarchive' ? 'success' : 'error'}
            onClick={handleConfirmAction}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {confirmDialog.action === 'unarchive' ? 'Unarchive' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="info" />
            <Typography variant="h6" fontWeight="600">
              Lead History
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Lead Info */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Lead Details
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {selectedHistoryLead?.firstName} {selectedHistoryLead?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {selectedHistoryLead?.id} | {selectedHistoryLead?.phone}
              </Typography>
            </Box>

            <Divider />

            {/* Activity List */}
            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Activity Timeline
              </Typography>
              <List sx={{ width: '100%' }}>
                {leadHistory.map((activity) => (
                  <ListItem
                    key={activity.id}
                    alignItems="flex-start"
                    sx={{
                      borderLeft: `3px solid ${getHistoryColor(activity.type)}`,
                      mb: 1,
                      bgcolor: alpha(getHistoryColor(activity.type), 0.05),
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getHistoryColor(activity.type), 0.1),
                          color: getHistoryColor(activity.type),
                          width: 40,
                          height: 40
                        }}
                      >
                        {getHistoryIcon(activity.icon)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="600">
                            {activity.type.replace('_', ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            By: {activity.user}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArchivedLeads;
