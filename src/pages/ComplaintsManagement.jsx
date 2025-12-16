import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Fade, alpha, useTheme, LinearProgress, InputAdornment
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector,
  TimelineContent, TimelineDot
} from '@mui/lab';
import {
  Add as AddIcon, Search as SearchIcon, Refresh as RefreshIcon,
  Warning as ComplaintIcon, CheckCircle as ResolvedIcon,
  Schedule as PendingIcon, Error as CriticalIcon
} from '@mui/icons-material';
import {
  fetchComplaints,
  createComplaint,
  updateComplaint,
  getComplaintStats
} from '../services/ComplaintService';

const ComplaintsManagement = () => {
  const theme = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    complaintType: 'Service Quality',
    severity: 'Medium',
    subject: '',
    description: '',
    status: 'Open',
    deadline: ''
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm]);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const [data, statsData] = await Promise.all([
        fetchComplaints(),
        getComplaintStats()
      ]);
      setComplaints(data);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
  };

  const handleAddComplaint = () => {
    setSelectedComplaint(null);
    setFormData({
      customerName: '',
      email: '',
      phone: '',
      complaintType: 'Service Quality',
      severity: 'Medium',
      subject: '',
      description: '',
      status: 'Open',
      deadline: ''
    });
    setComplaintDialogOpen(true);
  };

  const handleSaveComplaint = async () => {
    try {
      if (selectedComplaint) {
        const updated = await updateComplaint(selectedComplaint.id, formData);
        setComplaints(complaints.map(c => c.id === selectedComplaint.id ? updated : c));
      } else {
        const newComplaint = await createComplaint(formData);
        setComplaints([newComplaint, ...complaints]); // Add new complaint at the beginning
      }
      setComplaintDialogOpen(false);
      // Refresh only stats, not the entire complaints list
      const statsData = await getComplaintStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to save complaint:', error);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailDialogOpen(true);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Medium': return 'info';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'error';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <ComplaintIcon />;
      case 'In Progress': return <PendingIcon />;
      case 'Resolved': return <ResolvedIcon />;
      default: return <ComplaintIcon />;
    }
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Complaints Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and resolve customer complaints
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadComplaints}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddComplaint}>
              New Complaint
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Complaints
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.9)}, ${alpha(theme.palette.error.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {stats.open}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Open
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {stats.inProgress}
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
                  {stats.resolved}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Resolved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search complaints..."
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
                <TableCell>Complaint ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">{complaint.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{complaint.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{complaint.email}</Typography>
                  </TableCell>
                  <TableCell>{complaint.subject}</TableCell>
                  <TableCell>
                    <Chip label={complaint.complaintType} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.severity}
                      size="small"
                      color={getSeverityColor(complaint.severity)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(complaint.status)}
                      label={complaint.status}
                      size="small"
                      color={getStatusColor(complaint.status)}
                    />
                  </TableCell>
                  <TableCell>{complaint.assignedTo}</TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(complaint.resolutionDeadline).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleViewDetails(complaint)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Complaint Dialog */}
        <Dialog open={complaintDialogOpen} onClose={() => setComplaintDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedComplaint ? 'Edit Complaint' : 'Register New Complaint'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Complaint Type</InputLabel>
                  <Select
                    label="Complaint Type"
                    value={formData.complaintType}
                    onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                  >
                    <MenuItem value="Service Quality">Service Quality</MenuItem>
                    <MenuItem value="Claim Processing">Claim Processing</MenuItem>
                    <MenuItem value="Policy Terms">Policy Terms</MenuItem>
                    <MenuItem value="Billing">Billing</MenuItem>
                    <MenuItem value="Product Issues">Product Issues</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    label="Severity"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  >
                    <MenuItem value="Critical">Critical</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
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
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  value={formData.deadline || ''}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComplaintDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveComplaint}>
              {selectedComplaint ? 'Update' : 'Register'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Complaint Details - {selectedComplaint?.id}</DialogTitle>
          <DialogContent>
            {selectedComplaint && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1" fontWeight="600">{selectedComplaint.customerName}</Typography>
                  <Typography variant="body2">{selectedComplaint.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedComplaint.status)}
                    label={selectedComplaint.status}
                    color={getStatusColor(selectedComplaint.status)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Subject</Typography>
                  <Typography variant="body1">{selectedComplaint.subject}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selectedComplaint.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Timeline</Typography>
                  <Timeline>
                    {selectedComplaint.timeline.map((event, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          {index < selectedComplaint.timeline.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body2" fontWeight="600">{event.action}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.date} - {event.user}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ComplaintsManagement;
