import React, { useState, useEffect } from 'react';
import leadService from '../services/leadService';
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tooltip, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, useTheme, alpha, Divider, Snackbar, Alert,
  CircularProgress, List, ListItem, ListItemIcon, ListItemText, Avatar
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterIcon, Sort as SortIcon,
  Download as DownloadIcon, PictureAsPdf as PdfIcon, Call as CallIcon,
  Visibility as VisibilityIcon, History as HistoryIcon, CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon, Note as NoteIcon, Email as EmailIcon, Upload as UploadIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ClosedLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [sortField, setSortField] = useState('closedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallLead, setSelectedCallLead] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedHistoryLead, setSelectedHistoryLead] = useState(null);
  const [leadHistory, setLeadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const resultOptions = ['Policy Issued', 'Not Interested', 'High Premium', 'Bought from Competitor', 'Invalid Lead'];
  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getClosedLeads();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error('Error fetching closed leads:', error);
      }
    };
    fetchLeads();
  }, []);

  // Apply filters whenever search term, filter result, or date range changes
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

    // Apply result filter
    if (filterResult !== 'All') {
      filtered = filtered.filter(lead => lead.result === filterResult);
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

      if (selectedDateRange !== 'all') {
        filtered = filtered.filter(lead => {
          const closedDate = new Date(lead.closedDate);
          return closedDate >= dateThreshold;
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'closedDate') {
        aValue = new Date(a.closedDate);
        bValue = new Date(b.closedDate);
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
  }, [searchTerm, filterResult, selectedDateRange, sortField, sortOrder, leads]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterResult(event.target.value);
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
        result: filterResult !== 'All' ? filterResult : null,
        dateRange: selectedDateRange,
        searchTerm: searchTerm
      };

      const blob = await leadService.exportClosedLeads(filters, 'csv');

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `closed-leads-${new Date().toISOString().split('T')[0]}.csv`;
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
        link.download = `closed-leads-${new Date().toISOString().split('T')[0]}.csv`;
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

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const filters = {
        result: filterResult !== 'All' ? filterResult : null,
        dateRange: selectedDateRange,
        searchTerm: searchTerm
      };

      const blob = await leadService.generateClosedLeadsReport(filters);

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `closed-leads-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSnackbar({ open: true, message: 'Report generated successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Report generation not available. Please try export instead.', severity: 'warning' });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setSnackbar({ open: true, message: 'Failed to generate report', severity: 'error' });
    } finally {
      setLoading(false);
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

  const handleDownloadDocuments = async (lead) => {
    try {
      setLoading(true);
      const blob = await leadService.downloadLeadDocuments(lead.id);

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lead-${lead.id}-documents.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSnackbar({ open: true, message: 'Documents downloaded successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'No documents available for this lead', severity: 'warning' });
      }
    } catch (error) {
      console.error('Error downloading documents:', error);
      setSnackbar({ open: true, message: 'Failed to download documents', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data) => {
    const headers = ['Lead ID', 'Name', 'Phone', 'Email', 'Result', 'Policy Type', 'Policy Number', 'Premium', 'Closed Date', 'Closed By', 'Remarks'];
    const rows = data.map(lead => [
      lead.id,
      `${lead.firstName} ${lead.lastName}`,
      lead.phone,
      lead.email,
      lead.result,
      lead.policyType,
      lead.policyNumber || '',
      lead.premium || '',
      lead.closedDate,
      lead.closedBy,
      lead.remarks || ''
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

  const getResultColor = (result) => {
    const colors = {
      'Policy Issued': theme.palette.success.main,
      'Not Interested': theme.palette.error.main,
      'High Premium': theme.palette.warning.main,
      'Bought from Competitor': theme.palette.error.light,
      'Invalid Lead': theme.palette.grey[500]
    };
    return colors[result] || theme.palette.grey[500];
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">
            Closed Leads
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
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <PdfIcon />}
            onClick={handleGenerateReport}
            disabled={loading}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                placeholder="Search closed leads..."
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
                label="Filter by Result"
                value={filterResult}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <FilterIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                <MenuItem value="All">All Results</MenuItem>
                {resultOptions.map(result => (
                  <MenuItem key={result} value={result}>{result}</MenuItem>
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
                Sort by {sortField === 'closedDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
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
                <TableCell>Result</TableCell>
                <TableCell>Policy Details</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Closed Date</TableCell>
                <TableCell>Closed By</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {lead.firstName} {lead.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {lead.id}
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
                      label={lead.result}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getResultColor(lead.result), 0.1),
                        color: getResultColor(lead.result),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{lead.policyType}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lead.policyNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="primary.main">
                      ₹{lead.premium?.toLocaleString() || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>{lead.closedDate}</TableCell>
                  <TableCell>{lead.closedBy}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Call Lead">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCallLead(lead);
                            setCallDialogOpen(true);
                          }}
                          sx={{
                            color: theme.palette.success.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.success.main, 0.1)
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
                          onClick={() => handleViewHistory(lead)}
                          sx={{ color: theme.palette.info.main }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Documents">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadDocuments(lead)}
                          sx={{ color: theme.palette.warning.main }}
                        >
                          <PdfIcon />
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
            <CallIcon color="success" />
            <Typography variant="h6" fontWeight="600">
              Contact Lead
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
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
                Result
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={selectedCallLead?.result}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getResultColor(selectedCallLead?.result), 0.1),
                    color: getResultColor(selectedCallLead?.result),
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
              {selectedCallLead?.policyNumber && (
                <Typography variant="body2" color="text.secondary">
                  Policy #: {selectedCallLead?.policyNumber}
                </Typography>
              )}
              {selectedCallLead?.premium && (
                <Typography variant="body2" color="primary" fontWeight="600">
                  Premium: ₹{selectedCallLead?.premium?.toLocaleString()}
                </Typography>
              )}
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
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`
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
                {leadHistory.map((activity, index) => (
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

export default ClosedLeads;