import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Tooltip, Avatar, Menu, Fade, alpha, useTheme, Snackbar, Alert,
  Stack, Divider, CircularProgress
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, FilterList as FilterIcon, GetApp as ExportIcon,
  Phone as PhoneIcon, Call as CallIcon, Email as EmailIcon, Person as PersonIcon,
  Business as BusinessIcon, MoreVert as MoreVertIcon, Refresh as RefreshIcon,
  ContactPhone as ContactPhoneIcon, CloudUpload as CloudUploadIcon,
  History as HistoryIcon, Lightbulb as IntelligenceIcon
} from '@mui/icons-material';
import { useCustomerManagement } from '../context/CustomerManagementContext';
import BulkUpload from '../components/common/BulkUpload';
import FailedRecordsViewer from '../components/common/FailedRecordsViewer';
import { useDedupe } from '../context/DedupeContext';
import CrossSellUpSellIntelligence from '../components/intelligence/CrossSellUpSellIntelligence';
import * as contactDatabaseService from '../services/contactDatabaseService';

const ContactDatabase = () => {
  const theme = useTheme();
  // const { contacts, addContact, updateContact, deleteContact } = useCustomerManagement(); // Replaced with API
  const { checkDuplicate } = useDedupe();

  // API State
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [showUploadHistory, setShowUploadHistory] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallContact, setSelectedCallContact] = useState(null);
  const [intelligenceDialogOpen, setIntelligenceDialogOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    source: 'all',
    status: 'all',
    assignedTo: 'all'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    source: 'Website',
    status: 'New',
    assignedTo: '',
    notes: ''
  });

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContactsData();
  }, []);

  // Fetch contacts from API
  const fetchContactsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactDatabaseService.fetchContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.message || 'Failed to load contacts');
      setSnackbar({ open: true, message: 'Failed to load contacts', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filters]);

  const filterContacts = () => {
    let filtered = [...contacts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(contact => contact.source === filters.source);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(contact => contact.status === filters.status);
    }

    // Assigned to filter
    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(contact => contact.assignedTo === filters.assignedTo);
    }

    setFilteredContacts(filtered);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      designation: '',
      source: 'Website',
      status: 'New',
      assignedTo: '',
      notes: ''
    });
    setContactDialogOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setFormData(contact);
    setContactDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await contactDatabaseService.deleteContact(selectedContact.id);
      setSnackbar({ open: true, message: 'Contact deleted successfully!', severity: 'success' });

      // Update local state
      setContacts(prev => prev.filter(c => c.id !== selectedContact.id));

      setDeleteDialogOpen(false);
      setSelectedContact(null);
    } catch (err) {
      console.error('Error deleting contact:', err);
      setSnackbar({ open: true, message: err.message || 'Failed to delete contact', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    // Real-time duplicate check for new contacts
    if (!selectedContact) {
      const dedupeCheck = checkDuplicate(formData, contacts, 'contacts');
      if (dedupeCheck.isDuplicate) {
        const duplicateInfo = dedupeCheck.duplicates.map(d =>
          `• ${d.field.toUpperCase()}: "${d.value}" (Found in ${d.matches.length} existing record${d.matches.length > 1 ? 's' : ''})`
        ).join('\n');

        const confirmMessage = `⚠️ DUPLICATE DETECTED\n\n${duplicateInfo}\n\nDo you want to add this contact anyway?`;

        if (!window.confirm(confirmMessage)) {
          return;
        }
      }
    }

    try {
      setLoading(true);
      if (selectedContact) {
        // Update existing contact via API
        const updatedContact = await contactDatabaseService.updateContact(selectedContact.id, formData);
        setSnackbar({ open: true, message: 'Contact updated successfully!', severity: 'success' });

        // Update local state safely
        if (updatedContact && updatedContact.id) {
          setContacts(prev => prev.map(c => c.id === selectedContact.id ? updatedContact : c));
        } else {
          await fetchContactsData();
        }
      } else {
        // Add new contact via API
        const newContact = await contactDatabaseService.addContact(formData);
        setSnackbar({ open: true, message: 'Contact added successfully!', severity: 'success' });

        // Update local state safely
        if (newContact && newContact.id) {
          setContacts(prev => [newContact, ...prev]);
        } else {
          await fetchContactsData();
        }
      }
      setContactDialogOpen(false);
    } catch (err) {
      console.error('Error saving contact:', err);
      setSnackbar({ open: true, message: err.message || 'Failed to save contact', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'info';
      case 'Contacted': return 'primary';
      case 'Qualified': return 'success';
      case 'Not Interested': return 'error';
      default: return 'default';
    }
  };

  const handleMenuOpen = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Contact Database
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage leads and prospects
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setBulkUploadOpen(true)}
            >
              Bulk Upload
            </Button>
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => setShowUploadHistory(!showUploadHistory)}
            >
              History
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchContactsData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddContact}
            >
              Add Contact
            </Button>
          </Box>
        </Box>

        {/* Upload History Section */}
        {showUploadHistory && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <FailedRecordsViewer source="contacts" limit={10} />
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {contacts.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Contacts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.9)}, ${alpha(theme.palette.info.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {contacts.filter(c => c.status === 'New').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  New Contacts
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {contacts.filter(c => c.status === 'Qualified').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Qualified Leads
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {contacts.filter(c => c.status === 'Contacted').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Contacted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search contacts..."
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
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterDialogOpen(true)}
                >
                  Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Contacts Table */}
        {!loading && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{
                  backgroundColor: theme.palette.grey.main,
                  '&:hover': {
                    backgroundColor: theme.palette.grey.main,
                  }
                }}>
                  <TableCell>Contact</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Last Contact</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {contact.name?.charAt(0) || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {contact.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {contact.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">{contact.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">{contact.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={contact.source} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contact.status}
                        size="small"
                        color={getStatusColor(contact.status)}
                      />
                    </TableCell>
                    <TableCell>{contact.assignedTo}</TableCell>
                    <TableCell>{new Date(contact.lastContact).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Call Contact">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedCallContact(contact);
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
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, contact)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            setIntelligenceDialogOpen(true);
            handleMenuClose();
          }}>
            <IntelligenceIcon fontSize="small" sx={{ mr: 1 }} /> Cross-Sell / Up-Sell
          </MenuItem>
          <MenuItem onClick={() => handleEditContact(selectedContact)}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={() => handleDeleteClick(selectedContact)}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

        {/* Add/Edit Contact Dialog */}
        <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedContact ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Source</InputLabel>
                  <Select
                    label="Source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  >
                    <MenuItem value="Website">Website</MenuItem>
                    <MenuItem value="Referral">Referral</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Cold Call">Cold Call</MenuItem>
                    <MenuItem value="Event">Event</MenuItem>
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
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Contacted">Contacted</MenuItem>
                    <MenuItem value="Qualified">Qualified</MenuItem>
                    <MenuItem value="Not Interested">Not Interested</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveContact}>
              {selectedContact ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Filter Dialog */}
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Filter Contacts</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Source</InputLabel>
                  <Select
                    label="Source"
                    value={filters.source}
                    onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  >
                    <MenuItem value="all">All Sources</MenuItem>
                    <MenuItem value="Website">Website</MenuItem>
                    <MenuItem value="Referral">Referral</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Cold Call">Cold Call</MenuItem>
                    <MenuItem value="Event">Event</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Contacted">Contacted</MenuItem>
                    <MenuItem value="Qualified">Qualified</MenuItem>
                    <MenuItem value="Not Interested">Not Interested</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Assigned To</InputLabel>
                  <Select
                    label="Assigned To"
                    value={filters.assignedTo}
                    onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="Priya Sharma">Priya Sharma</MenuItem>
                    <MenuItem value="Amit Patel">Amit Patel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setFilters({ source: 'all', status: 'all', assignedTo: 'all' });
              setFilterDialogOpen(false);
            }}>
              Reset
            </Button>
            <Button variant="contained" onClick={() => setFilterDialogOpen(false)}>
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the contact "{selectedContact?.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Upload Component */}
        <BulkUpload
          open={bulkUploadOpen}
          onClose={() => setBulkUploadOpen(false)}
          title="Bulk Upload Contacts"
          source="contacts"
          existingData={contacts}
          requiredFields={['name', 'email', 'phone']}
          fieldMapping={{
            'Name': 'name',
            'Email': 'email',
            'Phone': 'phone',
            'Company': 'company',
            'Designation': 'designation',
            'Source': 'source',
            'Status': 'status',
            'Assigned To': 'assignedTo',
            'Notes': 'notes'
          }}
          onUploadComplete={async (validRecords, failedRecords) => {
            try {
              setLoading(true);
              // Use bulk upload API
              // Note: The API expects a file, so we'll need to handle this differently
              // For now, we'll add contacts individually
              for (const record of validRecords) {
                await contactDatabaseService.addContact(record.record);
              }

              setBulkUploadOpen(false);
              setSnackbar({
                open: true,
                message: `${validRecords.length} contacts uploaded successfully! ${failedRecords.length > 0 ? `${failedRecords.length} records failed.` : ''}`,
                severity: 'success'
              });

              if (failedRecords.length > 0) {
                setShowUploadHistory(true);
              }

              // Refresh contacts list
              await fetchContactsData();
            } catch (err) {
              console.error('Error uploading contacts:', err);
              setSnackbar({ open: true, message: 'Failed to upload some contacts', severity: 'error' });
            } finally {
              setLoading(false);
            }
          }}
          allowOverride={true}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Cross-Sell / Up-Sell Intelligence Dialog */}
        <Dialog
          open={intelligenceDialogOpen}
          onClose={() => setIntelligenceDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Cross-Sell / Up-Sell Intelligence
          </DialogTitle>
          <DialogContent>
            <CrossSellUpSellIntelligence
              customer={selectedContact}
              onRecommendationSelect={(recommendation) => {
                setSnackbar({
                  open: true,
                  message: `Recommendation for ${recommendation.title} has been noted for follow-up!`,
                  severity: 'success'
                });
                setIntelligenceDialogOpen(false);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIntelligenceDialogOpen(false)}>Close</Button>
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
              {/* Contact Name */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Contact Name
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedCallContact?.name}
                </Typography>
                {selectedCallContact?.designation && (
                  <Typography variant="caption" color="text.secondary">
                    {selectedCallContact?.designation}
                  </Typography>
                )}
              </Box>

              {/* Company */}
              {selectedCallContact?.company && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Company
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body1">{selectedCallContact?.company}</Typography>
                  </Box>
                </Box>
              )}

              {/* Status & Source */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCallContact?.status}
                      size="small"
                      color={getStatusColor(selectedCallContact?.status)}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Source
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCallContact?.source}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Assigned To & Last Contact */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Assignment Details
                </Typography>
                <Typography variant="body2">
                  Assigned to: {selectedCallContact?.assignedTo || 'Unassigned'}
                </Typography>
                {selectedCallContact?.lastContact && (
                  <Typography variant="body2" color="text.secondary">
                    Last Contact: {new Date(selectedCallContact?.lastContact).toLocaleDateString()}
                  </Typography>
                )}
              </Box>

              {/* Notes */}
              {selectedCallContact?.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{selectedCallContact?.notes}"
                  </Typography>
                </Box>
              )}

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
                    {selectedCallContact?.phone}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    component="a"
                    href={`tel:${selectedCallContact?.phone}`}
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
                <Typography variant="body1">{selectedCallContact?.email}</Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCallDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ContactDatabase;
