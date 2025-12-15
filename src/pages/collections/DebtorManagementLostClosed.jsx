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
  Cancel as CancelIcon,
  MoneyOff as MoneyOffIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const DebtorManagementLostClosed = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data for lost closed cases - no payment recovered and case closed
  const mockLostDebtors = [
    {
      id: 'ACC-2024-201',
      workflowId: 'WF-2025-010',
      name: 'Ramesh Patel',
      phone: '+91-98765-66666',
      email: null,
      originalBalance: 22000.00,
      amountRecovered: 0,
      closedDate: '2025-01-10',
      closureReason: 'Skip Trace Failed',
      assignedAgent: 'Priya Patel',
      debtType: 'Personal Loan',
      dpd: 540,
      lastContactDate: '2024-11-15',
      attempts: 45
    },
    {
      id: 'ACC-2024-202',
      workflowId: 'WF-2025-011',
      name: 'Sunita Reddy',
      phone: null,
      email: null,
      originalBalance: 18000.00,
      amountRecovered: 0,
      closedDate: '2025-01-09',
      closureReason: 'Debtor Deceased',
      assignedAgent: 'Rahul Kumar',
      debtType: 'Credit Card',
      dpd: 720,
      lastContactDate: '2024-09-20',
      attempts: 32
    },
    {
      id: 'ACC-2024-203',
      workflowId: 'WF-2025-012',
      name: 'Karthik Nair',
      phone: '+91-98765-77777',
      email: 'karthik.old@email.com',
      originalBalance: 35000.00,
      amountRecovered: 0,
      closedDate: '2025-01-08',
      closureReason: 'Bankruptcy Filed',
      assignedAgent: 'Sarah Johnson',
      debtType: 'Auto Loan',
      dpd: 650,
      lastContactDate: '2024-10-05',
      attempts: 28
    },
    {
      id: 'ACC-2024-204',
      workflowId: 'WF-2025-013',
      name: 'Lakshmi Iyer',
      phone: '+91-98765-88888',
      email: null,
      originalBalance: 12000.00,
      amountRecovered: 0,
      closedDate: '2025-01-07',
      closureReason: 'Statute of Limitations',
      assignedAgent: 'Mike Wilson',
      debtType: 'Medical',
      dpd: 1825,
      lastContactDate: '2022-06-10',
      attempts: 15
    },
    {
      id: 'ACC-2024-205',
      workflowId: 'WF-2025-014',
      name: 'Deepak Joshi',
      phone: null,
      email: null,
      originalBalance: 28000.00,
      amountRecovered: 0,
      closedDate: '2025-01-06',
      closureReason: 'Unlocatable - Skip Trace Failed',
      assignedAgent: 'John Adams',
      debtType: 'Personal Loan',
      dpd: 600,
      lastContactDate: '2024-08-15',
      attempts: 52
    },
    {
      id: 'ACC-2024-206',
      workflowId: 'WF-2025-015',
      name: 'Priya Deshmukh',
      phone: '+91-98765-99999',
      email: 'priya.d@email.com',
      originalBalance: 16000.00,
      amountRecovered: 0,
      closedDate: '2025-01-05',
      closureReason: 'Disputed - Identity Theft',
      assignedAgent: 'Priya Patel',
      debtType: 'Credit Card',
      dpd: 420,
      lastContactDate: '2024-12-01',
      attempts: 18
    }
  ];

  const [debtors, setDebtors] = useState(mockLostDebtors);

  useEffect(() => {
    setDebtors(mockLostDebtors);
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

  const getClosureReasonColor = (reason) => {
    if (reason.includes('Deceased')) return 'default';
    if (reason.includes('Bankruptcy')) return 'warning';
    if (reason.includes('Statute')) return 'default';
    if (reason.includes('Skip Trace')) return 'error';
    if (reason.includes('Disputed')) return 'info';
    return 'error';
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Lost Closed Cases
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Cases closed without recovery due to various reasons
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'error.50', borderLeft: `4px solid ${theme.palette.error.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CancelIcon sx={{ fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Lost Cases
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
          <Card sx={{ bgcolor: 'warning.50', borderLeft: `4px solid ${theme.palette.warning.main}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <MoneyOffIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Loss Amount
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ₹{debtors.reduce((sum, d) => sum + d.originalBalance, 0).toLocaleString()}
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
                    Avg Attempts
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {(debtors.reduce((sum, d) => sum + d.attempts, 0) / debtors.length).toFixed(0)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'default.50', borderLeft: `4px solid ${theme.palette.grey[500]}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CalendarIcon sx={{ fontSize: 40, color: 'grey.600' }} />
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
                  <TableCell>Loss Amount</TableCell>
                  <TableCell>Closure Reason</TableCell>
                  <TableCell>DPD</TableCell>
                  <TableCell>Attempts</TableCell>
                  <TableCell>Last Contact</TableCell>
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
                          <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'error.main' }}>
                            {debtor.name.charAt(0)}
                          </Avatar>
                          {debtor.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          {debtor.phone ? (
                            <Typography variant="body2">
                              <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {debtor.phone}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No phone
                            </Typography>
                          )}
                          {debtor.email ? (
                            <Typography variant="body2">
                              <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {debtor.email}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No email
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{debtor.originalBalance.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="error.main">
                          ₹{debtor.originalBalance.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debtor.closureReason}
                          size="small"
                          color={getClosureReasonColor(debtor.closureReason)}
                          icon={<WarningIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${debtor.dpd} days`}
                          size="small"
                          color="error"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {debtor.attempts}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {debtor.lastContactDate || 'Never'}
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

export default DebtorManagementLostClosed;
