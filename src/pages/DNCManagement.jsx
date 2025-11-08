import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel,
  Select, MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Chip, IconButton, Tooltip,
  Paper, Tabs, Tab, Alert, Grow, Fade, alpha,
  FormControlLabel, Switch, Checkbox
} from '@mui/material';
import {
  Block as BlockIcon, Upload as UploadIcon,
  Add as AddIcon,
  Security as OverrideIcon, History as HistoryIcon,
  Search as SearchIcon,
  Info as InfoIcon, Phone as PhoneIcon,
  Email as EmailIcon, Person as PersonIcon, Business as BusinessIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const DNCManagement = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // DNC Registry State
  const [dncRegistry, setDncRegistry] = useState([]);
  const [filteredRegistry, setFilteredRegistry] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  
  // Dialog States
  const [addDNCDialog, setAddDNCDialog] = useState(false);
  const [bulkUploadDialog, setBulkUploadDialog] = useState(false);
  const [overrideDialog, setOverrideDialog] = useState(false);

  
  // Form States
  const [dncForm, setDncForm] = useState({
    customerPhone: '',
    customerEmail: '',
    customerName: '',
    dncType: 'phone',
    dncSource: 'manual',
    reason: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    overrideAllowed: false
  });
  
  const [overrideForm, setOverrideForm] = useState({
    dncId: null,
    overrideType: 'temporary',
    reason: '',
    endDate: ''
  });
  
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error] = useState(''); // Error state ready for future API error handling
  const [selectedDNC, setSelectedDNC] = useState(null);
  
  // Mock DNC Registry Data
  const mockDNCRegistry = useMemo(() => [
    {
      id: 'DNC-001',
      customerPhone: '9876543210',
      customerEmail: 'arjun.sharma@gmail.com',
      customerName: 'Arjun Sharma',
      clientId: 'CLIENT-001',
      clientName: 'HDFC Life Insurance',
      dncType: 'phone',
      dncSource: 'customer',
      reason: 'Customer requested to be removed from marketing calls',
      effectiveDate: '2024-01-15',
      expiryDate: null,
      isActive: true,
      overrideAllowed: false,
      createdBy: 'System',
      createdAt: '2024-01-15T10:30:00Z',
      lastOverride: null
    },
    {
      id: 'DNC-002',
      customerPhone: '9876543211',
      customerEmail: 'meera.kapoor@gmail.com',
      customerName: 'Meera Kapoor',
      clientId: 'CLIENT-002',
      clientName: 'ICICI Prudential',
      dncType: 'both',
      dncSource: 'government',
      reason: 'Registered in TRAI DNC Registry',
      effectiveDate: '2024-02-01',
      expiryDate: null,
      isActive: true,
      overrideAllowed: true,
      createdBy: 'System',
      createdAt: '2024-02-01T09:00:00Z',
      lastOverride: '2024-03-15T14:30:00Z'
    },
    {
      id: 'DNC-003',
      customerPhone: '9876543212',
      customerEmail: 'vikram.singh@gmail.com',
      customerName: 'Vikram Singh',
      clientId: 'CLIENT-001',
      clientName: 'HDFC Life Insurance',
      dncType: 'email',
      dncSource: 'manual',
      reason: 'Compliance team added - multiple complaints',
      effectiveDate: '2024-03-10',
      expiryDate: '2024-12-31',
      isActive: true,
      overrideAllowed: true,
      createdBy: 'Admin User',
      createdAt: '2024-03-10T16:45:00Z',
      lastOverride: null
    }
  ], []);
  
  // Override History Mock Data
  const mockOverrideHistory = [
    {
      id: 'OVERRIDE-001',
      dncId: 'DNC-002',
      overrideType: 'temporary',
      reason: 'Urgent policy renewal - customer consent obtained',
      authorizedBy: 'Manager',
      overrideStartDate: '2024-03-15T14:30:00Z',
      overrideEndDate: '2024-03-20T23:59:59Z',
      status: 'expired',
      createdAt: '2024-03-15T14:30:00Z'
    }
  ];
  
  // Initialize data
  useEffect(() => {
    setDncRegistry(mockDNCRegistry);
    setFilteredRegistry(mockDNCRegistry);
    setTimeout(() => setLoaded(true), 100);
  }, [mockDNCRegistry]);
  
  // Filter registry based on search and filters
  useEffect(() => {
    let filtered = dncRegistry;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerPhone.includes(searchTerm) ||
        item.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        statusFilter === 'active' ? item.isActive : !item.isActive
      );
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.dncType === typeFilter);
    }
    
    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(item => item.dncSource === sourceFilter);
    }
    
    setFilteredRegistry(filtered);
    setPage(0);
  }, [dncRegistry, searchTerm, statusFilter, typeFilter, sourceFilter]);
  
  // Handle form submissions
  const handleAddDNC = () => {
    const newDNC = {
      id: `DNC-${Date.now()}`,
      ...dncForm,
      clientId: currentUser.clientId || 'CLIENT-001',
      clientName: currentUser.clientName || 'Default Client',
      isActive: true,
      createdBy: currentUser.name || 'Current User',
      createdAt: new Date().toISOString(),
      lastOverride: null
    };
    
    setDncRegistry(prev => [newDNC, ...prev]);
    setAddDNCDialog(false);
    setDncForm({
      customerPhone: '',
      customerEmail: '',
      customerName: '',
      dncType: 'phone',
      dncSource: 'manual',
      reason: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      overrideAllowed: false
    });
    
    setSuccessMessage('DNC entry added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleRequestOverride = () => {
    if (!selectedDNC) return;
    
    const overrideRequest = {
      id: `OVERRIDE-${Date.now()}`,
      dncId: selectedDNC.id,
      ...overrideForm,
      authorizedBy: currentUser.name || 'Current User',
      overrideStartDate: new Date().toISOString(),
      overrideEndDate: overrideForm.overrideType === 'temporary' ? 
        new Date(overrideForm.endDate).toISOString() : null,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    // Update DNC registry with override info
    setDncRegistry(prev => prev.map(item => 
      item.id === selectedDNC.id 
        ? { ...item, lastOverride: overrideRequest.overrideStartDate }
        : item
    ));
    
    setOverrideDialog(false);
    setOverrideForm({
      dncId: null,
      overrideType: 'temporary',
      reason: '',
      endDate: ''
    });
    
    setSuccessMessage(`Override ${overrideForm.overrideType === 'temporary' ? 'granted temporarily' : 'approved permanently'}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleBulkUpload = () => {
    if (!bulkUploadFile) return;
    
    // Simulate bulk upload processing
    setSuccessMessage(`Processing ${bulkUploadFile.name}... This may take a few minutes.`);
    setBulkUploadDialog(false);
    setBulkUploadFile(null);
    
    // Simulate adding bulk entries after processing
    setTimeout(() => {
      const bulkEntries = [
        {
          id: `DNC-BULK-${Date.now()}`,
          customerPhone: '9876543220',
          customerEmail: 'bulk.customer1@gmail.com',
          customerName: 'Bulk Customer 1',
          clientId: currentUser.clientId || 'CLIENT-001',
          clientName: currentUser.clientName || 'Default Client',
          dncType: 'phone',
          dncSource: 'manual',
          reason: 'Bulk upload - customer request',
          effectiveDate: new Date().toISOString().split('T')[0],
          expiryDate: null,
          isActive: true,
          overrideAllowed: false,
          createdBy: currentUser.name || 'Current User',
          createdAt: new Date().toISOString(),
          lastOverride: null
        }
      ];
      
      setDncRegistry(prev => [...bulkEntries, ...prev]);
      setSuccessMessage('Bulk upload completed successfully. 1 entry added.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 3000);
  };
  
  const handleToggleStatus = (dncId) => {
    setDncRegistry(prev => prev.map(item => 
      item.id === dncId ? { ...item, isActive: !item.isActive } : item
    ));
  };
  
  const getDNCTypeIcon = (type) => {
    switch (type) {
      case 'phone': return <PhoneIcon fontSize="small" />;
      case 'email': return <EmailIcon fontSize="small" />;
      case 'both': return <PersonIcon fontSize="small" />;
      default: return <BlockIcon fontSize="small" />;
    }
  };
  
  const getDNCTypeColor = (type) => {
    switch (type) {
      case 'phone': return 'warning';
      case 'email': return 'info';
      case 'both': return 'error';
      default: return 'default';
    }
  };
  
  const getSourceColor = (source) => {
    switch (source) {
      case 'government': return 'error';
      case 'customer': return 'warning';
      case 'manual': return 'info';
      case 'system': return 'success';
      default: return 'default';
    }
  };
  
  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="600">
            DNC Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setBulkUploadDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Bulk Upload
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDNCDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Add DNC Entry
            </Button>
          </Box>
        </Box>
        
        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          </Grow>
        )}
        
        {error && (
          <Grow in={!!error}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </Grow>
        )}
        
        <Grow in={loaded} timeout={400}>
          <Card elevation={0} sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="DNC Registry" icon={<BlockIcon />} />
                <Tab label="Override History" icon={<HistoryIcon />} />
                <Tab label="Statistics" icon={<InfoIcon />} />
              </Tabs>
              
              {activeTab === 0 && (
                <Box>
                  {/* Search and Filters */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <TextField
                      placeholder="Search by name, phone, email, or client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{ minWidth: 300 }}
                    />
                    
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={typeFilter}
                        label="Type"
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="phone">Phone</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="both">Both</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Source</InputLabel>
                      <Select
                        value={sourceFilter}
                        label="Source"
                        onChange={(e) => setSourceFilter(e.target.value)}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="government">Government</MenuItem>
                        <MenuItem value="customer">Customer</MenuItem>
                        <MenuItem value="manual">Manual</MenuItem>
                        <MenuItem value="system">System</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* DNC Registry Table */}
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Effective Date</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRegistry.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="500">
                                  {item.customerName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.id}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                {(item.dncType === 'phone' || item.dncType === 'both') && (
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <PhoneIcon fontSize="small" color="action" />
                                    {item.customerPhone}
                                  </Typography>
                                )}
                                {(item.dncType === 'email' || item.dncType === 'both') && (
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <EmailIcon fontSize="small" color="action" />
                                    {item.customerEmail}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <BusinessIcon fontSize="small" color="action" />
                                <Typography variant="body2">{item.clientName}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getDNCTypeIcon(item.dncType)}
                                label={item.dncType.charAt(0).toUpperCase() + item.dncType.slice(1)}
                                color={getDNCTypeColor(item.dncType)}
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={item.dncSource.charAt(0).toUpperCase() + item.dncSource.slice(1)}
                                color={getSourceColor(item.dncSource)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Switch
                                  checked={item.isActive}
                                  onChange={() => handleToggleStatus(item.id)}
                                  size="small"
                                />
                                <Typography variant="body2" color={item.isActive ? 'success.main' : 'text.secondary'}>
                                  {item.isActive ? 'Active' : 'Inactive'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(item.effectiveDate).toLocaleDateString()}
                              </Typography>
                              {item.expiryDate && (
                                <Typography variant="caption" color="text.secondary">
                                  Expires: {new Date(item.expiryDate).toLocaleDateString()}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {item.overrideAllowed && (
                                  <Tooltip title="Request Override">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedDNC(item);
                                        setOverrideDialog(true);
                                      }}
                                      sx={{ color: 'warning.main' }}
                                    >
                                      <OverrideIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                                                  <Tooltip title="View History">
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setSelectedDNC(item);
                                        // History dialog functionality would be implemented here
                                      }}
                                      sx={{ color: 'info.main' }}
                                    >
                                      <HistoryIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={filteredRegistry.length}
                      page={page}
                      onPageChange={(e, newPage) => setPage(newPage)}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </TableContainer>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Override History</Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>DNC ID</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Override Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Reason</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Authorized By</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockOverrideHistory.map((override) => (
                          <TableRow key={override.id}>
                            <TableCell>{override.dncId}</TableCell>
                            <TableCell>
                              <Chip
                                label={override.overrideType}
                                color={override.overrideType === 'temporary' ? 'warning' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{override.reason}</TableCell>
                            <TableCell>{override.authorizedBy}</TableCell>
                            <TableCell>
                              {override.overrideType === 'temporary' ? (
                                <Box>
                                  <Typography variant="body2">
                                    {new Date(override.overrideStartDate).toLocaleDateString()} - 
                                    {new Date(override.overrideEndDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography variant="body2">Permanent</Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={override.status}
                                color={override.status === 'active' ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>DNC Statistics</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                    <Card sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <Typography variant="h4" color="primary" fontWeight="600">
                        {dncRegistry.filter(item => item.isActive).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active DNC Entries
                      </Typography>
                    </Card>
                    <Card sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                      <Typography variant="h4" color="warning.main" fontWeight="600">
                        {dncRegistry.filter(item => item.dncType === 'phone').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone DNC Entries
                      </Typography>
                    </Card>
                    <Card sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                      <Typography variant="h4" color="info.main" fontWeight="600">
                        {dncRegistry.filter(item => item.dncType === 'email').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email DNC Entries
                      </Typography>
                    </Card>
                    <Card sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                      <Typography variant="h4" color="error.main" fontWeight="600">
                        {dncRegistry.filter(item => item.dncSource === 'government').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Government DNC
                      </Typography>
                    </Card>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grow>
        
        {/* Add DNC Dialog */}
        <Dialog open={addDNCDialog} onClose={() => setAddDNCDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add DNC Entry</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
              <TextField
                label="Customer Name"
                fullWidth
                value={dncForm.customerName}
                onChange={(e) => setDncForm({...dncForm, customerName: e.target.value})}
              />
              <TextField
                label="Phone Number"
                fullWidth
                value={dncForm.customerPhone}
                onChange={(e) => setDncForm({...dncForm, customerPhone: e.target.value})}
              />
              <TextField
                label="Email Address"
                fullWidth
                value={dncForm.customerEmail}
                onChange={(e) => setDncForm({...dncForm, customerEmail: e.target.value})}
              />
              <FormControl fullWidth>
                <InputLabel>DNC Type</InputLabel>
                <Select
                  value={dncForm.dncType}
                  label="DNC Type"
                  onChange={(e) => setDncForm({...dncForm, dncType: e.target.value})}
                >
                  <MenuItem value="phone">Phone Only</MenuItem>
                  <MenuItem value="email">Email Only</MenuItem>
                  <MenuItem value="both">Both Phone & Email</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={dncForm.dncSource}
                  label="Source"
                  onChange={(e) => setDncForm({...dncForm, dncSource: e.target.value})}
                >
                  <MenuItem value="customer">Customer Request</MenuItem>
                  <MenuItem value="government">Government Registry</MenuItem>
                  <MenuItem value="manual">Manual Entry</MenuItem>
                  <MenuItem value="system">System Generated</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Effective Date"
                type="date"
                fullWidth
                value={dncForm.effectiveDate}
                onChange={(e) => setDncForm({...dncForm, effectiveDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Expiry Date (Optional)"
                type="date"
                fullWidth
                value={dncForm.expiryDate}
                onChange={(e) => setDncForm({...dncForm, expiryDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ gridColumn: 'span 2' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dncForm.overrideAllowed}
                      onChange={(e) => setDncForm({...dncForm, overrideAllowed: e.target.checked})}
                    />
                  }
                  label="Allow Override Requests"
                />
              </Box>
            </Box>
            <TextField
              label="Reason"
              fullWidth
              multiline
              rows={3}
              value={dncForm.reason}
              onChange={(e) => setDncForm({...dncForm, reason: e.target.value})}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDNCDialog(false)}>Cancel</Button>
            <Button onClick={handleAddDNC} variant="contained">Add DNC Entry</Button>
          </DialogActions>
        </Dialog>
        
        {/* Override Request Dialog */}
        <Dialog open={overrideDialog} onClose={() => setOverrideDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Request DNC Override</DialogTitle>
          <DialogContent>
            {selectedDNC && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Requesting override for: {selectedDNC.customerName}
                  </Typography>
                  <Typography variant="body2">
                    Contact: {selectedDNC.customerPhone} | {selectedDNC.customerEmail}
                  </Typography>
                </Alert>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Override Type</InputLabel>
                  <Select
                    value={overrideForm.overrideType}
                    label="Override Type"
                    onChange={(e) => setOverrideForm({...overrideForm, overrideType: e.target.value})}
                  >
                    <MenuItem value="temporary">Temporary Override</MenuItem>
                    <MenuItem value="permanent">Permanent Override</MenuItem>
                  </Select>
                </FormControl>
                
                {overrideForm.overrideType === 'temporary' && (
                  <TextField
                    label="Override End Date"
                    type="datetime-local"
                    fullWidth
                    value={overrideForm.endDate}
                    onChange={(e) => setOverrideForm({...overrideForm, endDate: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                )}
                
                <TextField
                  label="Reason for Override"
                  fullWidth
                  multiline
                  rows={3}
                  value={overrideForm.reason}
                  onChange={(e) => setOverrideForm({...overrideForm, reason: e.target.value})}
                  placeholder="Please provide a detailed reason for requesting this override..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOverrideDialog(false)}>Cancel</Button>
            <Button onClick={handleRequestOverride} variant="contained" color="warning">
              Request Override
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Bulk Upload Dialog */}
        <Dialog open={bulkUploadDialog} onClose={() => setBulkUploadDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Bulk Upload DNC Entries</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Upload a CSV file with columns: Customer Name, Phone, Email, DNC Type, Source, Reason
              </Alert>
              
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => setBulkUploadFile(e.target.files[0])}
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              
              {bulkUploadFile && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Selected file: {bulkUploadFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size: {(bulkUploadFile.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkUploadDialog(false)}>Cancel</Button>
            <Button onClick={handleBulkUpload} variant="contained" disabled={!bulkUploadFile}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default DNCManagement; 