import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  TablePagination,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Tooltip, Avatar, Menu, Fade, alpha, useTheme,
  Slider, FormControlLabel, Switch, Snackbar, Alert, Stack, Divider
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Search as SearchIcon, FilterList as FilterIcon, GetApp as ExportIcon,
  Phone as PhoneIcon, Call as CallIcon, Email as EmailIcon, Person as PersonIcon,
  VerifiedUser as ActiveIcon, Block as InactiveIcon, MoreVert as MoreVertIcon,
  Refresh as RefreshIcon, Info as InfoIcon, CloudUpload as CloudUploadIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useCustomerManagement } from '../context/CustomerManagementContext';
import BulkUpload from '../components/common/BulkUpload';
import FailedRecordsViewer from '../components/common/FailedRecordsViewer';
import { useDedupe } from '../context/DedupeContext';
import {
  searchCustomers as apiSearchCustomers,
  refreshDatabase,
  filterCustomers as apiFilterCustomers
} from '../services/CustomerService';

const CustomerDatabase = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { customers, setCustomers, addCustomer, updateCustomer, deleteCustomer } = useCustomerManagement();
  const { checkDuplicate } = useDedupe();

  // Use filteredCustomers for display. Initialize with loaded customers.
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Update local state when context customers change (initial load)
  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [showUploadHistory, setShowUploadHistory] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallCustomer, setSelectedCallCustomer] = useState(null);

  // Advanced filter states
  const [filters, setFilters] = useState({
    productType: 'all',
    status: 'all',
    ageRange: [18, 80],
    policyStatus: 'all',
    gender: 'all',
    premiumRange: [0, 100000]
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    productType: 'Health Insurance',
    policyNumber: '',
    policyStatus: 'Active',
    premiumAmount: '',
    status: 'Active',
    registrationDate: '',
    lastContact: ''
  });

  // Handle Search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If empty, just reset to all customers (or call refresh logic)
      setFilteredCustomers(customers);
      return;
    }
    try {
      const results = await apiSearchCustomers(searchTerm);
      setFilteredCustomers(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSnackbar({ open: true, message: 'Search failed', severity: 'error' });
    }
  };

  // Handle Refresh
  const handleRefresh = async () => {
    try {
      setSearchTerm('');
      // Call refresh API
      await refreshDatabase();
      // Then explicitly reload context/list
      // Ideally context should reload, but if context reload isn't exposed, we might need a force reload or fetch directly
      // Assuming context listens to changes or we fetch manually to update local view
      const { fetchCustomers } = await import('../services/CustomerService');
      const latest = await fetchCustomers();
      setCustomers(latest); // Update context
      setFilteredCustomers(latest);
      setSnackbar({ open: true, message: 'Database refreshed successfully', severity: 'success' });
    } catch (error) {
      console.error('Refresh failed:', error);
      setSnackbar({ open: true, message: 'Refresh failed', severity: 'error' });
    }
  };

  // Handle Filters
  const applyFilters = async () => {
    try {
      const results = await apiFilterCustomers(filters);
      setFilteredCustomers(results);
      setFilterDialogOpen(false);
    } catch (error) {
      console.error('Filter failed:', error);
      setSnackbar({ open: true, message: 'Filtering failed', severity: 'error' });
    }
  };

  // Replace default client-side filterCustomers with effect only for initial load checks?
  // Actually, we replaced the useEffect that called filterCustomers.
  // We don't need a separate filterCustomers function anymore, we use handleSearch and applyFilters.

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: 'Male',
      address: '',
      city: '',
      state: '',
      productType: 'Health Insurance',
      policyNumber: '',
      policyStatus: 'Active',
      premiumAmount: '',
      status: 'Active',
      registrationDate: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0]
    });
    setCustomerDialogOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setCustomerDialogOpen(true);
    setAnchorEl(null);
  };

  const handleSaveCustomer = () => {
    // Real-time duplicate check for new customers
    if (!selectedCustomer) {
      const dedupeCheck = checkDuplicate(formData, customers, 'customers');
      if (dedupeCheck.isDuplicate) {
        const duplicateInfo = dedupeCheck.duplicates.map(d =>
          `• ${d.field.toUpperCase()}: "${d.value}" (Found in ${d.matches.length} existing record${d.matches.length > 1 ? 's' : ''})`
        ).join('\n');

        const confirmMessage = `⚠️ DUPLICATE DETECTED\n\n${duplicateInfo}\n\nDo you want to add this customer anyway?`;

        if (!window.confirm(confirmMessage)) {
          return;
        }
      }
    }

    const customerData = {
      ...formData,
      age: parseInt(formData.age) || 0,
      premiumAmount: parseFloat(formData.premiumAmount) || 0,
      customerStatus: formData.status
    };

    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, customerData);
      setSnackbar({ open: true, message: 'Customer updated successfully!', severity: 'success' });
    } else {
      addCustomer(customerData);
      setSnackbar({ open: true, message: 'Customer added successfully!', severity: 'success' });
    }
    setCustomerDialogOpen(false);
  };

  const handleMenuOpen = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (customer) => {
    navigate(`/customer-management/customer-database/${customer.id}`);
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error';
  };

  const getPolicyStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Customer Database
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage customer information and policies
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
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </Box>
        </Box>

        {/* Upload History Section */}
        {showUploadHistory && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <FailedRecordsViewer source="customers" limit={10} />
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* ... (Stats content unchanged) ... */}
          {/* Re-using existing stats logic based on full 'customers' list which is context based */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {customers.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {customers.filter(c => c.status === 'Active').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Active Customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.9)}, ${alpha(theme.palette.error.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {customers.filter(c => c.status === 'Inactive').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Inactive Customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.9)}, ${alpha(theme.palette.info.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  ₹{(customers.reduce((sum, c) => sum + c.premiumAmount, 0) / 1000).toFixed(0)}K
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Premium
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or policy number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button size="small" onClick={handleSearch}>Search</Button>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterDialogOpen(true)}
                >
                  Advanced Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Customers Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{
                backgroundColor: theme.palette.grey.main,
                '&:hover': {
                  backgroundColor: theme.palette.grey.main,
                }
              }}>
                <TableCell>Customer</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Age/Gender</TableCell>
                <TableCell>Product Type</TableCell>
                <TableCell>Policy Details</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {customer.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.city}, {customer.state}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{customer.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{customer.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{customer.age} years</Typography>
                    <Typography variant="caption" color="text.secondary">{customer.gender}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={customer.productType} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {customer.policyNumber}
                      </Typography>
                      <Chip
                        label={customer.policyStatus}
                        size="small"
                        color={getPolicyStatusColor(customer.policyStatus)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      �{customer.premiumAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={customer.status === 'Active' ? <ActiveIcon /> : <InactiveIcon />}
                      label={customer.status}
                      size="small"
                      color={getStatusColor(customer.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="Call Customer">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCallCustomer(customer);
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
                        onClick={(e) => handleMenuOpen(e, customer)}
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

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredCustomers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleViewDetails(selectedCustomer)}>
            <InfoIcon fontSize="small" sx={{ mr: 1 }} /> View Details
          </MenuItem>
          <MenuItem onClick={() => handleEditCustomer(selectedCustomer)}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
        </Menu>

        {/* Add/Edit Customer Dialog */}
        <Dialog open={customerDialogOpen} onClose={() => setCustomerDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
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
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Product Type</InputLabel>
                  <Select
                    label="Product Type"
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  >
                    <MenuItem value="health">Health Insurance</MenuItem>
                    <MenuItem value="life">Life Insurance</MenuItem>
                    <MenuItem value="vehicle">Vehicle Insurance</MenuItem>
                    <MenuItem value="property">Property Insurance</MenuItem>
                    <MenuItem value="travel">Travel Insurance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Policy Number"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Policy Status</InputLabel>
                  <Select
                    label="Policy Status"
                    value={formData.policyStatus}
                    onChange={(e) => setFormData({ ...formData, policyStatus: e.target.value })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Premium Amount"
                  type="number"
                  value={formData.premiumAmount}
                  onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Customer Status</InputLabel>
                  <Select
                    label="Customer Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCustomerDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveCustomer}>
              {selectedCustomer ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Advanced Filter Dialog */}
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Product Type</InputLabel>
                  <Select
                    label="Product Type"
                    value={filters.productType}
                    onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
                  >
                    <MenuItem value="all">All Products</MenuItem>
                    <MenuItem value="health">Health Insurance</MenuItem>
                    <MenuItem value="life">Life Insurance</MenuItem>
                    <MenuItem value="vehicle">Vehicle Insurance</MenuItem>
                    <MenuItem value="property">Property Insurance</MenuItem>
                    <MenuItem value="travel">Travel Insurance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Customer Status</InputLabel>
                  <Select
                    label="Customer Status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Policy Status</InputLabel>
                  <Select
                    label="Policy Status"
                    value={filters.policyStatus}
                    onChange={(e) => setFilters({ ...filters, policyStatus: e.target.value })}
                  >
                    <MenuItem value="all">All Policy Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                  >
                    <MenuItem value="all">All Genders</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years</Typography>
                <Slider
                  value={filters.ageRange}
                  onChange={(e, newValue) => setFilters({ ...filters, ageRange: newValue })}
                  valueLabelDisplay="auto"
                  min={18}
                  max={80}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Premium Range: �{filters.premiumRange[0].toLocaleString()} - �{filters.premiumRange[1].toLocaleString()}
                </Typography>
                <Slider
                  value={filters.premiumRange}
                  onChange={(e, newValue) => setFilters({ ...filters, premiumRange: newValue })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100000}
                  step={5000}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setFilters({
                productType: 'all',
                status: 'all',
                ageRange: [18, 80],
                policyStatus: 'all',
                gender: 'all',
                premiumRange: [0, 100000]
              });
              // Reload full list logic
              handleRefresh();
            }}>
              Reset
            </Button>
            <Button variant="contained" onClick={applyFilters}>
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Upload Component */}
        <BulkUpload
          open={bulkUploadOpen}
          onClose={() => setBulkUploadOpen(false)}
          title="Bulk Upload Customers"
          source="customers"
          existingData={customers}
          requiredFields={['name', 'email', 'phone']}
          fieldMapping={{
            'Name': 'name',
            'Email': 'email',
            'Phone': 'phone',
            'Age': 'age',
            'Gender': 'gender',
            'Address': 'address',
            'City': 'city',
            'State': 'state',
            'Product Type': 'productType',
            'Policy Number': 'policyNumber',
            'Policy Status': 'policyStatus',
            'Premium Amount': 'premiumAmount',
            'Status': 'status'
          }}
          onUploadComplete={(validRecords, failedRecords) => {
            // Add uploaded customers
            validRecords.forEach(record => {
              const customerData = {
                ...record.record,
                age: parseInt(record.record.age) || 0,
                premiumAmount: parseFloat(record.record.premiumAmount) || 0
              };
              addCustomer(customerData);
            });

            setBulkUploadOpen(false);
            setSnackbar({
              open: true,
              message: `${validRecords.length} customers uploaded successfully! ${failedRecords.length > 0 ? `${failedRecords.length} records failed.` : ''}`,
              severity: 'success'
            });

            if (failedRecords.length > 0) {
              setShowUploadHistory(true);
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
                Contact Customer
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Customer Name */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Customer Name
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedCallCustomer?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedCallCustomer?.city}, {selectedCallCustomer?.state}
                </Typography>
              </Box>

              {/* Personal Information */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Age
                  </Typography>
                  <Typography variant="body1">{selectedCallCustomer?.age} years</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Gender
                  </Typography>
                  <Typography variant="body1">{selectedCallCustomer?.gender}</Typography>
                </Box>
              </Box>

              {/* Policy Information */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Policy Details
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={selectedCallCustomer?.productType}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Policy #: {selectedCallCustomer?.policyNumber}
                </Typography>
              </Box>

              {/* Status & Premium */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Policy Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCallCustomer?.policyStatus}
                      size="small"
                      color={getPolicyStatusColor(selectedCallCustomer?.policyStatus)}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Customer Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCallCustomer?.status}
                      size="small"
                      color={getStatusColor(selectedCallCustomer?.status)}
                      icon={selectedCallCustomer?.status === 'Active' ? <ActiveIcon /> : <InactiveIcon />}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Premium Amount */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Premium Amount
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="600">
                  ₹{selectedCallCustomer?.premiumAmount.toLocaleString()}
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
                    {selectedCallCustomer?.phone}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    component="a"
                    href={`tel:${selectedCallCustomer?.phone}`}
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
                <Typography variant="body1">{selectedCallCustomer?.email}</Typography>
              </Box>

              {/* Address */}
              {selectedCallCustomer?.address && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Address
                  </Typography>
                  <Typography variant="body2">{selectedCallCustomer?.address}</Typography>
                </Box>
              )}
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

export default CustomerDatabase;
