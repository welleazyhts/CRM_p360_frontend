import React, { useState, useEffect } from 'react';
import leadService from '../services/leadService';
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
  alpha,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Call as CallIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LostLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('All');
  const [sortField, setSortField] = useState('closedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDateRange, setSelectedDateRange] = useState('last30');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallLead, setSelectedCallLead] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getLostLeads();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching lost leads:', error);
      }
    };
    fetchLeads();
  }, []);

  const lostReasonOptions = [
    'High Premium',
    'Not Interested',
    'Bought from Competitor',
    'Invalid Contact',
    'Budget Constraints',
    'Coverage Not Sufficient',
    'Already Insured',
    'Switched Provider'
  ];

  const dateRangeOptions = [
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterReason(event.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleReopen = (leadId) => {
    if (window.confirm('Are you sure you want to reopen this lost lead?')) {
      // Logic to reopen the lead
      alert(`Lead ${leadId} reopened and moved to active leads`);
    }
  };

  const getReasonColor = (reason) => {
    const colors = {
      'High Premium': theme.palette.warning.main,
      'Not Interested': theme.palette.error.main,
      'Bought from Competitor': theme.palette.error.light,
      'Invalid Contact': theme.palette.grey[500],
      'Budget Constraints': theme.palette.warning.light,
      'Coverage Not Sufficient': theme.palette.info.main,
      'Already Insured': theme.palette.grey[600],
      'Switched Provider': theme.palette.error.dark
    };
    return colors[reason] || theme.palette.grey[500];
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">
            Lost Leads
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Leads that were closed as lost or not converted
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
          <Button
            variant="outlined"
            startIcon={<PdfIcon />}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Lost Leads</Typography>
              <Typography variant="h4" fontWeight="600" color="error.main">
                {leads.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Lost Revenue</Typography>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                ₹{leads.reduce((sum, lead) => sum + lead.quotedPremium, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Average Premium</Typography>
              <Typography variant="h4" fontWeight="600" color="info.main">
                ₹{Math.round(leads.reduce((sum, lead) => sum + lead.quotedPremium, 0) / leads.length).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">This Month</Typography>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {leads.filter(l => new Date(l.closedDate).getMonth() === new Date().getMonth()).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                placeholder="Search lost leads..."
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
                label="Filter by Reason"
                value={filterReason}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <FilterIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                <MenuItem value="All">All Reasons</MenuItem>
                {lostReasonOptions.map(reason => (
                  <MenuItem key={reason} value={reason}>{reason}</MenuItem>
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
                onClick={() => handleSort('closedDate')}
                fullWidth
              >
                Sort by Date {sortField === 'closedDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
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
                <TableCell>Lost Reason</TableCell>
                <TableCell>Policy Type</TableCell>
                <TableCell>Quoted Premium</TableCell>
                <TableCell>Closed Date</TableCell>
                <TableCell>Closed By</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} hover>
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
                      label={lead.lostReason}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getReasonColor(lead.lostReason), 0.1),
                        color: getReasonColor(lead.lostReason),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.policyType}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Source: {lead.source}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="warning.main">
                      ₹{lead.quotedPremium.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{lead.closedDate}</TableCell>
                  <TableCell>{lead.closedBy}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Reopen Lead">
                        <IconButton
                          size="small"
                          onClick={() => handleReopen(lead.id)}
                          sx={{
                            color: theme.palette.success.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.success.main, 0.1)
                            }
                          }}
                        >
                          <RestoreIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Call Lead">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCallLead(lead);
                            setCallDialogOpen(true);
                          }}
                          sx={{
                            color: theme.palette.info.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.1)
                            }
                          }}
                        >
                          <CallIcon />
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
                          sx={{ color: theme.palette.warning.main }}
                        >
                          <HistoryIcon />
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

      {/* Call Dialog */}
      <Dialog
        open={callDialogOpen}
        onClose={() => setCallDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="info" />
            <Typography variant="h6" fontWeight="600">
              Contact Lost Lead
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Lead Details */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Lead ID
              </Typography>
              <Typography variant="body1" fontWeight="600" color="primary">
                LD{new Date().getFullYear()}{String(selectedCallLead?.id || 0).padStart(6, '0')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Lead Name
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {selectedCallLead?.firstName} {selectedCallLead?.lastName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Lost Reason
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={selectedCallLead?.lostReason}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getReasonColor(selectedCallLead?.lostReason), 0.1),
                    color: getReasonColor(selectedCallLead?.lostReason),
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Policy Details
              </Typography>
              <Typography variant="body1">{selectedCallLead?.policyType}</Typography>
              <Typography variant="body2" color="warning" fontWeight="600">
                Quoted Premium: ₹{selectedCallLead?.quotedPremium?.toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Closure Details
              </Typography>
              <Typography variant="body2">
                Closed By: {selectedCallLead?.closedBy}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Closed On: {selectedCallLead?.closedDate}
              </Typography>
              {selectedCallLead?.remarks && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  "{selectedCallLead?.remarks}"
                </Typography>
              )}
            </Box>

            <Divider />

            {/* Contact Information */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                Phone Number
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1
              }}>
                <Typography variant="h6" fontWeight="600">
                  {selectedCallLead?.phone}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  component="a"
                  href={`tel:${selectedCallLead?.phone}`}
                  startIcon={<CallIcon />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`
                    }
                  }}
                >
                  Dial
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Email
              </Typography>
              <Typography variant="body1">{selectedCallLead?.email}</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialogOpen(false)}>Close</Button>
          <Button variant="contained" color="success" onClick={() => handleReopen(selectedCallLead?.id)}>
            Reopen Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LostLeads;