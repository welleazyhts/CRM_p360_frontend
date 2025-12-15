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
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const DebtorManagementRecoveredClosed = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for recovered closed cases - payment completed and case closed
  const mockRecoveredDebtors = [
    {
      id: 'ACC-2024-101',
      workflowId: 'WF-2025-005',
      name: 'Suresh Sharma',
      phone: '+91-98765-11111',
      email: 'suresh.sharma@email.com',
      originalBalance: 18000.00,
      amountRecovered: 18000.00,
      recoveryRate: 100,
      closedDate: '2025-01-15',
      paymentMode: 'UPI',
      assignedAgent: 'Priya Patel',
      debtType: 'Personal Loan',
      dpd: 90,
      settlementAmount: null, // Full payment
      recoveryType: 'Full Payment'
    },
    {
      id: 'ACC-2024-102',
      workflowId: 'WF-2025-006',
      name: 'Anjali Verma',
      phone: '+91-98765-22222',
      email: 'anjali.verma@email.com',
      originalBalance: 25000.00,
      amountRecovered: 20000.00,
      recoveryRate: 80,
      closedDate: '2025-01-14',
      paymentMode: 'Net Banking',
      assignedAgent: 'Rahul Kumar',
      debtType: 'Credit Card',
      dpd: 120,
      settlementAmount: 20000.00,
      recoveryType: 'Settlement'
    },
    {
      id: 'ACC-2024-103',
      workflowId: 'WF-2025-007',
      name: 'Vikram Singh',
      phone: '+91-98765-33333',
      email: 'vikram.singh@email.com',
      originalBalance: 12000.00,
      amountRecovered: 12000.00,
      recoveryRate: 100,
      closedDate: '2025-01-13',
      paymentMode: 'RTGS',
      assignedAgent: 'Sarah Johnson',
      debtType: 'Medical',
      dpd: 60,
      settlementAmount: null,
      recoveryType: 'Full Payment'
    },
    {
      id: 'ACC-2024-104',
      workflowId: 'WF-2025-008',
      name: 'Meena Krishnan',
      phone: '+91-98765-44444',
      email: 'meena.k@email.com',
      originalBalance: 30000.00,
      amountRecovered: 22500.00,
      recoveryRate: 75,
      closedDate: '2025-01-12',
      paymentMode: 'Cheque',
      assignedAgent: 'Mike Wilson',
      debtType: 'Auto Loan',
      dpd: 150,
      settlementAmount: 22500.00,
      recoveryType: 'Settlement'
    },
    {
      id: 'ACC-2024-105',
      workflowId: 'WF-2025-009',
      name: 'Rajiv Malhotra',
      phone: '+91-98765-55555',
      email: 'rajiv.malhotra@email.com',
      originalBalance: 15000.00,
      amountRecovered: 15000.00,
      recoveryRate: 100,
      closedDate: '2025-01-11',
      paymentMode: 'UPI',
      assignedAgent: 'John Adams',
      debtType: 'Personal Loan',
      dpd: 75,
      settlementAmount: null,
      recoveryType: 'Full Payment'
    }
  ];

  const [debtors, setDebtors] = useState(mockRecoveredDebtors);

  useEffect(() => {
    setDebtors(mockRecoveredDebtors);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (debtor) => {
    navigate(`/collections/debtor-management/${debtor.id}`);
  };

  const filteredDebtors = debtors.filter(debtor =>
    debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debtor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debtor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecoveryRateColor = (rate) => {
    if (rate === 100) return 'success';
    if (rate >= 70) return 'info';
    return 'warning';
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Recovered Closed Cases
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cases where payment was completed and account was closed successfully
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.50', borderLeft: `4px solid ${theme.palette.success.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Recovered
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {debtors.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'primary.50', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <MoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Amount Recovered
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{debtors.reduce((sum, d) => sum + d.amountRecovered, 0).toLocaleString()}
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
                <PersonIcon sx={{ fontSize: 40, color: 'info.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Avg Recovery Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {(debtors.reduce((sum, d) => sum + d.recoveryRate, 0) / debtors.length).toFixed(1)}%
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
                <CalendarIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    This Month
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {debtors.filter(d => new Date(d.closedDate).getMonth() === new Date().getMonth()).length}
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
          {/* Search Bar */}
          <Box mb={3}>
            <TextField
              fullWidth
              placeholder="Search by name, account ID, or email..."
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
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account ID</TableCell>
                  <TableCell>Workflow ID</TableCell>
                  <TableCell>Debtor Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Original Balance</TableCell>
                  <TableCell>Amount Recovered</TableCell>
                  <TableCell>Recovery Rate</TableCell>
                  <TableCell>Recovery Type</TableCell>
                  <TableCell>Payment Mode</TableCell>
                  <TableCell>Closed Date</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDebtors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((debtor) => (
                    <TableRow key={debtor.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {debtor.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {debtor.debtType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debtor.workflowId}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'success.main' }}>
                            {debtor.name.charAt(0)}
                          </Avatar>
                          {debtor.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {debtor.phone}
                          </Typography>
                          <Typography variant="body2">
                            <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {debtor.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{debtor.originalBalance.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          ₹{debtor.amountRecovered.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${debtor.recoveryRate}%`}
                          size="small"
                          color={getRecoveryRateColor(debtor.recoveryRate)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debtor.recoveryType}
                          size="small"
                          color={debtor.recoveryType === 'Full Payment' ? 'success' : 'info'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {debtor.paymentMode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {debtor.closedDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {debtor.assignedAgent}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(debtor)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredDebtors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default DebtorManagementRecoveredClosed;
