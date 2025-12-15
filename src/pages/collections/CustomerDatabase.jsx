import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Avatar,
  useTheme,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const CustomerDatabase = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    creditScore: 'all',
    hasActiveDebt: 'all'
  });

  // Mock customer data
  const mockCustomers = [
    {
      id: 'CUST-001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91-98765-43210',
      type: 'Individual',
      status: 'Active',
      creditScore: 720,
      totalAccounts: 3,
      activeDebts: 1,
      totalDebtAmount: 12500,
      totalCreditLimit: 150000,
      joinDate: '2022-03-15',
      lastTransaction: '2025-01-15',
      address: '123 MG Road, Bangalore',
      occupation: 'Software Engineer',
      annualIncome: 1200000,
      hasActiveDebt: true
    },
    {
      id: 'CUST-002',
      name: 'Priya Mehta',
      email: 'priya.mehta@email.com',
      phone: '+91-98765-43213',
      type: 'Individual',
      status: 'Active',
      creditScore: 750,
      totalAccounts: 2,
      activeDebts: 0,
      totalDebtAmount: 0,
      totalCreditLimit: 100000,
      joinDate: '2021-05-20',
      lastTransaction: '2025-01-16',
      address: '321 Lake View, Pune',
      occupation: 'Nurse',
      annualIncome: 800000,
      hasActiveDebt: false
    },
    {
      id: 'CUST-003',
      name: 'Amit Singh',
      email: 'amit.singh@email.com',
      phone: '+91-98765-43211',
      type: 'Individual',
      status: 'Active',
      creditScore: 620,
      totalAccounts: 4,
      activeDebts: 2,
      totalDebtAmount: 8900,
      totalCreditLimit: 80000,
      joinDate: '2020-11-10',
      lastTransaction: '2025-01-10',
      address: '456 Oak Avenue, Mumbai',
      occupation: 'Administrative Assistant',
      annualIncome: 600000,
      hasActiveDebt: true
    },
    {
      id: 'CUST-004',
      name: 'Tech Solutions Pvt Ltd',
      email: 'accounts@techsolutions.com',
      phone: '+91-98765-54321',
      type: 'Business',
      status: 'Active',
      creditScore: 780,
      totalAccounts: 5,
      activeDebts: 0,
      totalDebtAmount: 0,
      totalCreditLimit: 500000,
      joinDate: '2019-08-01',
      lastTransaction: '2025-01-14',
      address: '789 Tech Park, Bangalore',
      occupation: 'IT Services',
      annualIncome: 15000000,
      hasActiveDebt: false
    },
    {
      id: 'CUST-005',
      name: 'Neha Gupta',
      email: 'neha.gupta@email.com',
      phone: '+91-98765-43212',
      type: 'Individual',
      status: 'Inactive',
      creditScore: 580,
      totalAccounts: 2,
      activeDebts: 1,
      totalDebtAmount: 15600,
      totalCreditLimit: 50000,
      joinDate: '2020-03-25',
      lastTransaction: '2024-08-15',
      address: '654 Park Street, Delhi',
      occupation: 'Warehouse Worker',
      annualIncome: 400000,
      hasActiveDebt: true
    },
    {
      id: 'CUST-006',
      name: 'Vikram Patel',
      email: 'vikram.patel@email.com',
      phone: '+91-98765-11111',
      type: 'Individual',
      status: 'Active',
      creditScore: 690,
      totalAccounts: 3,
      activeDebts: 0,
      totalDebtAmount: 0,
      totalCreditLimit: 120000,
      joinDate: '2021-01-15',
      lastTransaction: '2025-01-12',
      address: '456 Marine Drive, Chennai',
      occupation: 'Business Owner',
      annualIncome: 1800000,
      hasActiveDebt: false
    }
  ];

  const [customers, setCustomers] = useState(mockCustomers);

  useEffect(() => {
    setCustomers(mockCustomers);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewProfile = (customer) => {
    navigate(`/collections/customer-database/${customer.id}`);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleApplyFilters = () => {
    setFilterAnchor(null);
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      type: 'all',
      creditScore: 'all',
      hasActiveDebt: 'all'
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);

    const matchesStatus = filters.status === 'all' || customer.status === filters.status;
    const matchesType = filters.type === 'all' || customer.type === filters.type;
    const matchesDebt = filters.hasActiveDebt === 'all' ||
      (filters.hasActiveDebt === 'yes' && customer.hasActiveDebt) ||
      (filters.hasActiveDebt === 'no' && !customer.hasActiveDebt);

    const matchesCreditScore =
      filters.creditScore === 'all' ||
      (filters.creditScore === 'excellent' && customer.creditScore >= 750) ||
      (filters.creditScore === 'good' && customer.creditScore >= 650 && customer.creditScore < 750) ||
      (filters.creditScore === 'fair' && customer.creditScore >= 550 && customer.creditScore < 650) ||
      (filters.creditScore === 'poor' && customer.creditScore < 550);

    return matchesSearch && matchesStatus && matchesType && matchesDebt && matchesCreditScore;
  });

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'default';
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'success';
    if (score >= 650) return 'info';
    if (score >= 550) return 'warning';
    return 'error';
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Customer Database
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and view all customer information
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh Data">
            <IconButton color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Customer
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'primary.50', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {customers.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.50', borderLeft: `4px solid ${theme.palette.success.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Customers
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {customers.filter(c => c.status === 'Active').length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'warning.50', borderLeft: `4px solid ${theme.palette.warning.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CreditCardIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    With Active Debts
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {customers.filter(c => c.hasActiveDebt).length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'info.50', borderLeft: `4px solid ${theme.palette.info.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <BusinessIcon sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Business Customers
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {customers.filter(c => c.type === 'Business').length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Card>
        <CardContent>
          {/* Search and Filter Bar */}
          <Box mb={3} display="flex" gap={2}>
            <TextField
              fullWidth
              placeholder="Search by name, customer ID, email, or phone..."
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
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
            >
              Filters
            </Button>
          </Box>

          {/* Active Filters Display */}
          {(filters.status !== 'all' || filters.type !== 'all' || filters.creditScore !== 'all' || filters.hasActiveDebt !== 'all') && (
            <Box mb={2} display="flex" gap={1} flexWrap="wrap" alignItems="center">
              <Typography variant="body2" color="text.secondary">Active Filters:</Typography>
              {filters.status !== 'all' && (
                <Chip
                  label={`Status: ${filters.status}`}
                  size="small"
                  onDelete={() => setFilters({ ...filters, status: 'all' })}
                />
              )}
              {filters.type !== 'all' && (
                <Chip
                  label={`Type: ${filters.type}`}
                  size="small"
                  onDelete={() => setFilters({ ...filters, type: 'all' })}
                />
              )}
              {filters.creditScore !== 'all' && (
                <Chip
                  label={`Credit: ${filters.creditScore}`}
                  size="small"
                  onDelete={() => setFilters({ ...filters, creditScore: 'all' })}
                />
              )}
              {filters.hasActiveDebt !== 'all' && (
                <Chip
                  label={`Active Debt: ${filters.hasActiveDebt}`}
                  size="small"
                  onDelete={() => setFilters({ ...filters, hasActiveDebt: 'all' })}
                />
              )}
              <Button size="small" onClick={handleResetFilters}>Clear All</Button>
            </Box>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Credit Score</TableCell>
                  <TableCell>Total Accounts</TableCell>
                  <TableCell>Active Debts</TableCell>
                  <TableCell>Total Debt</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {customer.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {customer.type === 'Business' ? (
                              <BusinessIcon fontSize="small" />
                            ) : (
                              customer.name.charAt(0)
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {customer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {customer.occupation}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.type}
                          size="small"
                          icon={customer.type === 'Business' ? <BusinessIcon /> : <PersonIcon />}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {customer.phone}
                          </Typography>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {customer.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.status}
                          size="small"
                          color={getStatusColor(customer.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Chip
                            label={customer.creditScore}
                            size="small"
                            color={getCreditScoreColor(customer.creditScore)}
                          />
                          <Typography variant="caption" display="block" color="text.secondary">
                            {getCreditScoreLabel(customer.creditScore)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {customer.totalAccounts}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.activeDebts}
                          size="small"
                          color={customer.activeDebts > 0 ? 'warning' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={customer.totalDebtAmount > 0 ? 'error.main' : 'success.main'}
                        >
                          ₹{customer.totalDebtAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {customer.joinDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="View Profile">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewProfile(customer)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Call Customer">
                            <IconButton size="small" color="info">
                              <PhoneIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Message">
                            <IconButton size="small" color="secondary">
                              <MessageIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More Actions">
                            <IconButton size="small">
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredCustomers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { width: 320, p: 2 }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filter Customers
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Customer Type</InputLabel>
          <Select
            value={filters.type}
            label="Customer Type"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Individual">Individual</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Credit Score</InputLabel>
          <Select
            value={filters.creditScore}
            label="Credit Score"
            onChange={(e) => setFilters({ ...filters, creditScore: e.target.value })}
          >
            <MenuItem value="all">All Scores</MenuItem>
            <MenuItem value="excellent">Excellent (750+)</MenuItem>
            <MenuItem value="good">Good (650-749)</MenuItem>
            <MenuItem value="fair">Fair (550-649)</MenuItem>
            <MenuItem value="poor">Poor (&lt;550)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Has Active Debt</InputLabel>
          <Select
            value={filters.hasActiveDebt}
            label="Has Active Debt"
            onChange={(e) => setFilters({ ...filters, hasActiveDebt: e.target.value })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button variant="contained" onClick={handleApplyFilters}>Apply</Button>
        </Stack>
      </Menu>
    </Box>
  );
};

export default CustomerDatabase;
