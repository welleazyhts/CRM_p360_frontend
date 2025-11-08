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
  Chip,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  Unarchive as UnarchiveIcon,
  Delete as DeleteIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ArchivedLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('archivedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, leadId: null, action: '' });

  useEffect(() => {
    // Mock data for Archived Leads - Replace with API call
    setLeads([
      {
        id: 201,
        firstName: 'Vikram',
        lastName: 'Singh',
        phone: '+91-91234-56789',
        email: 'vikram.singh@email.com',
        previousStatus: 'New Lead',
        policyType: 'Health Insurance',
        premium: 28000,
        archivedDate: '2025-09-20',
        archivedBy: 'Admin User',
        archivedReason: 'Duplicate Lead',
        source: 'Website',
        assignedTo: 'Priya Patel'
      },
      {
        id: 202,
        firstName: 'Kavita',
        lastName: 'Reddy',
        phone: '+91-92345-67890',
        email: 'kavita.reddy@email.com',
        previousStatus: 'Follow Up',
        policyType: 'Motor Insurance',
        premium: 18500,
        archivedDate: '2025-09-18',
        archivedBy: 'Manager',
        archivedReason: 'Invalid Data',
        source: 'Referral',
        assignedTo: 'Rahul Kumar'
      },
      {
        id: 203,
        firstName: 'Manoj',
        lastName: 'Patel',
        phone: '+91-93456-78901',
        email: 'manoj.patel@email.com',
        previousStatus: 'Qualified',
        policyType: 'Life Insurance',
        premium: 52000,
        archivedDate: '2025-09-15',
        archivedBy: 'Sarah Johnson',
        archivedReason: 'Spam Lead',
        source: 'Direct',
        assignedTo: 'Sarah Johnson'
      }
    ]);
  }, []);

  const statusOptions = ['New Lead', 'Contacted', 'Follow Up', 'Qualified', 'Proposal Sent'];
  const archivedReasonOptions = [
    'Duplicate Lead',
    'Invalid Data',
    'Spam Lead',
    'Test Lead',
    'Incomplete Information',
    'Other'
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

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

  const handleUnarchive = (leadId) => {
    setConfirmDialog({ open: true, leadId, action: 'unarchive' });
  };

  const handlePermanentDelete = (leadId) => {
    setConfirmDialog({ open: true, leadId, action: 'delete' });
  };

  const handleConfirmAction = () => {
    const { leadId, action } = confirmDialog;
    if (action === 'unarchive') {
      alert(`Lead ${leadId} has been unarchived and restored to active leads`);
      setLeads(leads.filter(l => l.id !== leadId));
    } else if (action === 'delete') {
      alert(`Lead ${leadId} has been permanently deleted`);
      setLeads(leads.filter(l => l.id !== leadId));
    }
    setConfirmDialog({ open: false, leadId: null, action: '' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'New Lead': theme.palette.info.main,
      'Contacted': theme.palette.primary.main,
      'Follow Up': theme.palette.warning.main,
      'Qualified': theme.palette.success.main,
      'Proposal Sent': theme.palette.purple || theme.palette.secondary.main
    };
    return colors[status] || theme.palette.grey[500];
  };

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
            startIcon={<DownloadIcon />}
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
                {leads.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">This Month</Typography>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {leads.filter(l => new Date(l.archivedDate).getMonth() === new Date().getMonth()).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Value</Typography>
              <Typography variant="h4" fontWeight="600" color="info.main">
                ₹{leads.reduce((sum, lead) => sum + lead.premium, 0).toLocaleString()}
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
              {leads.map((lead) => (
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
                      ₹{lead.premium.toLocaleString()}
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
                          onClick={() => handleUnarchive(lead.id)}
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
                          sx={{ color: theme.palette.info.main }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Permanent Delete">
                        <IconButton
                          size="small"
                          onClick={() => handlePermanentDelete(lead.id)}
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
        onClose={() => setConfirmDialog({ open: false, leadId: null, action: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            {confirmDialog.action === 'unarchive' ? 'Unarchive Lead' : 'Permanent Delete'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {confirmDialog.action === 'unarchive'
              ? 'Are you sure you want to unarchive this lead? It will be restored to active leads.'
              : 'Are you sure you want to permanently delete this lead? This action cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, leadId: null, action: '' })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.action === 'unarchive' ? 'success' : 'error'}
            onClick={handleConfirmAction}
          >
            {confirmDialog.action === 'unarchive' ? 'Unarchive' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArchivedLeads;
