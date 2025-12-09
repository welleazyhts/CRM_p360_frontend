import React, { useState, useEffect } from 'react';
import callService from '../services/callService';
import * as CustomerService from '../services/CustomerService';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Fade, alpha, useTheme, Tab, Tabs
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, Refresh as RefreshIcon,
  Assignment as TicketIcon, Person as PersonIcon, AccessTime as TimeIcon,
  CheckCircle as ResolvedIcon, Error as OpenIcon, Schedule as PendingIcon,
  Phone as PhoneIcon, CallReceived as IncomingCallIcon,
  Schedule as FollowUpIcon, Event as EventIcon
} from '@mui/icons-material';

const InboundCustomerService = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    subject: '',
    description: '',
    priority: 'Medium',
    category: 'General Inquiry',
    status: 'Open',
    callReason: '',
    followUpDate: '',
    followUpTime: '',
    followUpRequired: false,
    incomingCallerNumber: '',
    callDuration: '',
    callNotes: ''
  });

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, tabValue]);

  const loadTickets = async () => {
    try {
      const data = await CustomerService.fetchInboundTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load inbound tickets:', err);
      setTickets([]);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tab
    switch (tabValue) {
      case 1:
        filtered = filtered.filter(t => t.status === 'Open');
        break;
      case 2:
        filtered = filtered.filter(t => t.status === 'In Progress');
        break;
      case 3:
        filtered = filtered.filter(t => t.status === 'Resolved');
        break;
      default:
        break;
    }

    setFilteredTickets(filtered);
  };

  const handleAddTicket = async () => {
    setSelectedTicket(null);

    // Capture incoming call automatically
    const incomingCall = callService.captureIncomingCall();

    // Look up customer by phone number
    const customerLookup = await callService.lookupCustomerByPhone(incomingCall.callerNumber);

    setFormData({
      customerName: customerLookup.found ? customerLookup.customer.name : '',
      email: customerLookup.found ? customerLookup.customer.email : '',
      phone: incomingCall.callerNumber,
      subject: '',
      description: '',
      priority: 'Medium',
      category: 'General Inquiry',
      status: 'Open',
      callReason: '',
      followUpDate: '',
      followUpTime: '',
      followUpRequired: false,
      incomingCallerNumber: incomingCall.callerNumber,
      callDuration: '',
      callNotes: '',
      customerId: customerLookup.found ? customerLookup.customer.id : null
    });

    setTicketDialogOpen(true);
  };

  const handleSaveTicket = async () => {
    try {
      // End the active call and get duration (may be sync or async)
      const completedCall = await Promise.resolve(callService.endCall());

      if (selectedTicket) {
        const updated = {
          ...formData,
          id: selectedTicket.id,
          createdDate: selectedTicket.createdDate,
          lastUpdated: new Date().toISOString().split('T')[0],
          callDuration: completedCall?.duration || formData.callDuration
        };
        await CustomerService.updateInboundTicket(selectedTicket.id, updated);
        await callService.saveCallDetails({
          ...updated,
          customerName: formData.customerName,
          customerId: formData.customerId,
          callerNumber: formData.incomingCallerNumber,
          callReason: formData.callReason,
          callNotes: formData.callNotes,
          followUpRequired: formData.followUpRequired,
          followUpDate: formData.followUpDate,
          followUpTime: formData.followUpTime
        });
      } else {
        const newTicket = {
          ...formData,
          id: `TKT-${Date.now()}`,
          assignedTo: 'Unassigned',
          createdDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          callDuration: completedCall?.duration || formData.callDuration,
          subject: formData.callReason || formData.subject,
          description: formData.callNotes || formData.description
        };

        // save call details in callService (keeps old behavior)
        await callService.saveCallDetails({
          ...newTicket,
          customerName: formData.customerName,
          customerId: formData.customerId,
          callerNumber: formData.incomingCallerNumber,
          callReason: formData.callReason,
          callNotes: formData.callNotes,
          followUpRequired: formData.followUpRequired,
          followUpDate: formData.followUpDate,
          followUpTime: formData.followUpTime
        });

        await CustomerService.addInboundTicket(newTicket);
      }

      await loadTickets();
      setTicketDialogOpen(false);
    } catch (error) {
      console.error('Error saving call details:', error);
      setTicketDialogOpen(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <OpenIcon />;
      case 'In Progress': return <PendingIcon />;
      case 'Resolved': return <ResolvedIcon />;
      default: return <TicketIcon />;
    }
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Inbound Customer Service
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage customer service requests and tickets
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadTickets}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<PhoneIcon />} onClick={handleAddTicket}>
              Tag Inbound Call
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {tickets.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Tickets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.9)}, ${alpha(theme.palette.error.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {tickets.filter(t => t.status === 'Open').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Open Tickets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {tickets.filter(t => t.status === 'In Progress').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  In Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {tickets.filter(t => t.status === 'Resolved').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Resolved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Tickets" />
            <Tab label="Open" />
            <Tab label="In Progress" />
            <Tab label="Resolved" />
          </Tabs>
        </Paper>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search tickets..."
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
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{
                backgroundColor: theme.palette.grey.main,
                '&:hover': {
                  backgroundColor: theme.palette.grey.main,
                }
              }}>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Call Reason</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Follow-up</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} hover sx={{ cursor: 'pointer' }} onClick={() => {
                  setSelectedTicket(ticket);
                  setFormData(ticket);
                  setTicketDialogOpen(true);
                }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">{ticket.id}</Typography>
                    {ticket.incomingCallerNumber && (
                      <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IncomingCallIcon fontSize="small" />
                        {ticket.incomingCallerNumber}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ticket.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{ticket.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ticket.callReason || ticket.subject}</Typography>
                    {ticket.callDuration && (
                      <Typography variant="caption" color="text.secondary">Duration: {ticket.callDuration}</Typography>
                    )}
                  </TableCell>
                  <TableCell><Chip label={ticket.category} size="small" /></TableCell>
                  <TableCell>
                    <Chip label={ticket.priority} size="small" color={getPriorityColor(ticket.priority)} />
                  </TableCell>
                  <TableCell>
                    <Chip icon={getStatusIcon(ticket.status)} label={ticket.status} size="small" color={ticket.status === 'Resolved' ? 'success' : ticket.status === 'Open' ? 'error' : 'warning'} />
                  </TableCell>
                  <TableCell>
                    {ticket.followUpRequired ? (
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FollowUpIcon fontSize="small" color="primary" />
                          {ticket.followUpDate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{ticket.followUpTime}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">No follow-up</Typography>
                    )}
                  </TableCell>
                  <TableCell>{new Date(ticket.createdDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={ticketDialogOpen} onClose={() => setTicketDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" />
            {selectedTicket ? 'Edit Call Details' : 'Tag Inbound Call'}
          </DialogTitle>
          <DialogContent>
            {/* Incoming Call Alert */}
            {formData.incomingCallerNumber && (
              <Box sx={{ mb: 2, mt: 1 }}>
                <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IncomingCallIcon color="primary" />
                    <strong>Incoming Call Detected:</strong> {formData.incomingCallerNumber}
                  </Typography>
                </Paper>
              </Box>
            )}

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Call Duration"
                  value={formData.callDuration}
                  onChange={(e) => setFormData({ ...formData, callDuration: e.target.value })}
                  placeholder="e.g., 5 mins"
                  InputProps={{
                    startAdornment: <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              {/* Call Details */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Call Reason</InputLabel>
                  <Select
                    label="Call Reason"
                    value={formData.callReason}
                    onChange={(e) => setFormData({ ...formData, callReason: e.target.value })}
                  >
                    <MenuItem value="Renewal Query">Renewal Query</MenuItem>
                    <MenuItem value="Policy Information">Policy Information</MenuItem>
                    <MenuItem value="Claim Request">Claim Request</MenuItem>
                    <MenuItem value="Premium Payment">Premium Payment</MenuItem>
                    <MenuItem value="Policy Modification">Policy Modification</MenuItem>
                    <MenuItem value="Coverage Details">Coverage Details</MenuItem>
                    <MenuItem value="Complaint">Complaint</MenuItem>
                    <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <MenuItem value="Policy Related">Policy Related</MenuItem>
                    <MenuItem value="Claims">Claims</MenuItem>
                    <MenuItem value="Account Management">Account Management</MenuItem>
                    <MenuItem value="Technical Support">Technical Support</MenuItem>
                    <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Call Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Call Notes"
                  multiline
                  rows={3}
                  value={formData.callNotes}
                  onChange={(e) => setFormData({ ...formData, callNotes: e.target.value })}
                  placeholder="Notes about the conversation..."
                />
              </Grid>

              {/* Follow-up Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FollowUpIcon color="primary" />
                    Follow-up Required
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={formData.followUpRequired}
                            onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                            style={{ marginRight: 8 }}
                          />
                          <Typography>Schedule follow-up</Typography>
                        </Box>
                      </FormControl>
                    </Grid>

                    {formData.followUpRequired && (
                      <>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Follow-up Date"
                            type="date"
                            value={formData.followUpDate}
                            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: new Date().toISOString().split('T')[0] }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Follow-up Time"
                            type="time"
                            value={formData.followUpTime}
                            onChange={(e) => setFormData({ ...formData, followUpTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              {/* Status and Priority */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    label="Priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTicketDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveTicket} startIcon={<PhoneIcon />}>
              {selectedTicket ? 'Update Call' : 'Save Call Details'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default InboundCustomerService;
