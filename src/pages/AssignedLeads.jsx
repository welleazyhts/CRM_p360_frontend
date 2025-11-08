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
  Paper,
  Tooltip,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  Call as CallIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AssignedLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Dialog states
  const [quickNoteDialog, setQuickNoteDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [statusChangeDialog, setStatusChangeDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallLead, setSelectedCallLead] = useState(null);

  useEffect(() => {
    // Mock data - Replace with API call
    setLeads([
      {
        id: 1,
        firstName: 'Rahul',
        lastName: 'Sharma',
        phone: '+91-98765-43210',
        email: 'rahul.sharma@email.com',
        status: 'New',
        priority: 'High',
        createdAt: '2025-10-08',
        assignedTo: 'Sarah Johnson',
        lastContact: '2025-10-09',
        policyType: 'Motor Insurance',
        policyNumber: 'POL123456',
        vehicleNumber: 'MH01AB1234'
      },
      // Add more mock data as needed
    ]);
  }, []);

  const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

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

  const handleQuickNote = (lead) => {
    setSelectedLead(lead);
    setQuickNoteDialog(true);
  };

  const handleStatusChange = (lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setStatusChangeDialog(true);
  };

  const saveQuickNote = () => {
    // Implement note saving logic
    setQuickNoteDialog(false);
    setNoteText('');
  };

  const saveStatusChange = () => {
    // Implement status change logic
    setStatusChangeDialog(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': theme.palette.info.main,
      'Contacted': theme.palette.warning.main,
      'Qualified': theme.palette.primary.main,
      'Proposal': theme.palette.secondary.main,
      'Negotiation': theme.palette.warning.dark,
      'Closed Won': theme.palette.success.main,
      'Closed Lost': theme.palette.error.main
    };
    return colors[status] || theme.palette.grey[500];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': theme.palette.error.main,
      'Medium': theme.palette.warning.main,
      'Low': theme.palette.success.main
    };
    return colors[priority] || theme.palette.grey[500];
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">
            Assigned Leads
          </Typography>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Search leads..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
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
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={() => handleSort('createdAt')}
                fullWidth
              >
                Sort by {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
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
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Policy Type</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Last Contact</TableCell>
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
                      label={lead.status}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                        color: getStatusColor(lead.status),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lead.priority}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getPriorityColor(lead.priority), 0.1),
                        color: getPriorityColor(lead.priority),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>{lead.policyType}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>{lead.lastContact}</TableCell>
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
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/lead-management/${lead.id}?edit=true`)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Email">
                        <IconButton
                          size="small"
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share Quote">
                        <IconButton
                          size="small"
                          sx={{ color: theme.palette.warning.main }}
                        >
                          <MoneyIcon />
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

      {/* Quick Note Dialog */}
      <Dialog open={quickNoteDialog} onClose={() => setQuickNoteDialog(false)}>
        <DialogTitle>Add Quick Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter your note here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickNoteDialog(false)}>Cancel</Button>
          <Button onClick={saveQuickNote} variant="contained">Save Note</Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={statusChangeDialog} onClose={() => setStatusChangeDialog(false)}>
        <DialogTitle>Change Lead Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusChangeDialog(false)}>Cancel</Button>
          <Button onClick={saveStatusChange} variant="contained">Update Status</Button>
        </DialogActions>
      </Dialog>

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

            {/* Policy Information */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Policy Type
              </Typography>
              <Typography variant="body1">{selectedCallLead?.policyType}</Typography>
              {selectedCallLead?.policyNumber && (
                <Typography variant="body2" color="text.secondary">
                  Policy #: {selectedCallLead?.policyNumber}
                </Typography>
              )}
              {selectedCallLead?.vehicleNumber && (
                <Typography variant="body2" color="text.secondary">
                  Vehicle: {selectedCallLead?.vehicleNumber}
                </Typography>
              )}
            </Box>

            {/* Status & Priority */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedCallLead?.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(selectedCallLead?.status), 0.1),
                      color: getStatusColor(selectedCallLead?.status),
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Priority
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedCallLead?.priority}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getPriorityColor(selectedCallLead?.priority), 0.1),
                      color: getPriorityColor(selectedCallLead?.priority),
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Assigned To & Last Contact */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                Assigned To
              </Typography>
              <Typography variant="body1">{selectedCallLead?.assignedTo}</Typography>
              <Typography variant="body2" color="text.secondary">
                Last Contact: {selectedCallLead?.lastContact}
              </Typography>
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

export default AssignedLeads;