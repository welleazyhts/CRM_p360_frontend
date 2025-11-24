import React, { useState, useEffect } from 'react';
import leadService from '../services/leadService';
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tooltip, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, useTheme, alpha, Divider
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterIcon, Sort as SortIcon,
  Download as DownloadIcon, PictureAsPdf as PdfIcon, Call as CallIcon,
  Visibility as VisibilityIcon, History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ClosedLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [sortField, setSortField] = useState('closedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallLead, setSelectedCallLead] = useState(null);

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
      } catch (error) {
        console.error('Error fetching closed leads:', error);
      }
    };
    fetchLeads();
  }, []);

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
            {leads.map((lead) => (
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
                    ₹{lead.premium.toLocaleString()}
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
                        sx={{ color: theme.palette.info.main }}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Documents">
                      <IconButton
                        size="small"
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
          {/* Lead ID */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="600">
              Lead ID
            </Typography>
            <Typography variant="body1" fontWeight="600" color="primary">
              LD{new Date().getFullYear()}{String(selectedCallLead?.id || 0).padStart(6, '0')}
            </Typography>
          </Box>

          {/* Lead Name */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="600">
              Lead Name
            </Typography>
            <Typography variant="body1" fontWeight="600">
              {selectedCallLead?.firstName} {selectedCallLead?.lastName}
            </Typography>
          </Box>

          {/* Result Status */}
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

          {/* Policy Information */}
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
                Premium: ₹{selectedCallLead?.premium.toLocaleString()}
              </Typography>
            )}
          </Box>

          {/* Closed Details */}
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

          {/* Phone Number */}
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

          {/* Email */}
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
  </Box>
);
};

export default ClosedLeads;