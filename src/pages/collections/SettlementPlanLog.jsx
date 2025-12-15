import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  Stack,
  Alert,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DocumentIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';

const SettlementPlanLog = () => {
  const theme = useTheme();
  const { logs, getFilteredLogs } = useActivityLog();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  // Mock settlement plan logs - In production, this would come from backend
  const [settlementLogs] = useState([
    {
      id: 'SL-001',
      timestamp: '2025-01-20 14:30:00',
      user: 'Sarah Johnson',
      action: 'Settlement Plan Created',
      debtorId: 'ACC-10001',
      debtorName: 'John Smith',
      settlementId: 'SET-2025-001',
      originalBalance: 15000,
      settlementAmount: 9000,
      discountPercent: 40,
      paymentTerms: 'Lump Sum',
      status: 'Approved',
      category: 'settlement',
      details: 'Settlement plan created for 40% discount. Lump sum payment of $9,000 agreed.',
      approvedBy: 'Mike Wilson',
      approvedDate: '2025-01-20 15:00:00'
    },
    {
      id: 'SL-002',
      timestamp: '2025-01-20 11:15:00',
      user: 'John Adams',
      action: 'Settlement Payment Received',
      debtorId: 'ACC-10004',
      debtorName: 'Maria Garcia',
      settlementId: 'SET-2025-002',
      originalBalance: 8000,
      settlementAmount: 4800,
      discountPercent: 40,
      paymentAmount: 4800,
      paymentMethod: 'Wire Transfer',
      paymentTerms: 'Lump Sum',
      status: 'Completed',
      category: 'settlement',
      details: 'Full settlement payment of $4,800 received via wire transfer. Account closed.',
      approvedBy: 'Sarah Johnson',
      approvedDate: '2025-01-19 10:00:00'
    },
    {
      id: 'SL-003',
      timestamp: '2025-01-19 16:45:00',
      user: 'Mike Wilson',
      action: 'Settlement Plan Rejected',
      debtorId: 'ACC-10007',
      debtorName: 'David Lee',
      settlementId: 'SET-2025-003',
      originalBalance: 25000,
      settlementAmount: 10000,
      discountPercent: 60,
      paymentTerms: '6 Installments',
      status: 'Rejected',
      category: 'settlement',
      details: 'Settlement proposal rejected. Discount percentage exceeds approval threshold.',
      rejectedBy: 'Mike Wilson',
      rejectedDate: '2025-01-19 16:45:00',
      rejectionReason: 'Discount exceeds maximum threshold of 50%'
    },
    {
      id: 'SL-004',
      timestamp: '2025-01-19 14:20:00',
      user: 'Sarah Johnson',
      action: 'Settlement Installment Received',
      debtorId: 'ACC-10012',
      debtorName: 'Robert Brown',
      settlementId: 'SET-2025-004',
      originalBalance: 12000,
      settlementAmount: 7200,
      discountPercent: 40,
      paymentAmount: 1200,
      installmentNumber: 2,
      totalInstallments: 6,
      paymentMethod: 'Credit Card',
      paymentTerms: '6 Installments',
      status: 'In Progress',
      category: 'settlement',
      details: 'Installment 2 of 6 received. Amount: $1,200. Remaining balance: $4,800.',
      approvedBy: 'John Adams',
      approvedDate: '2025-01-15 09:00:00'
    },
    {
      id: 'SL-005',
      timestamp: '2025-01-18 10:30:00',
      user: 'John Adams',
      action: 'Settlement Plan Modified',
      debtorId: 'ACC-10015',
      debtorName: 'Emily Davis',
      settlementId: 'SET-2025-005',
      originalBalance: 18000,
      settlementAmount: 12600,
      discountPercent: 30,
      paymentTerms: '12 Installments',
      status: 'Pending Approval',
      category: 'settlement',
      details: 'Settlement plan modified from 6 to 12 installments upon debtor request. Pending re-approval.',
      modifiedFields: 'Payment Terms: 6 months → 12 months'
    },
    {
      id: 'SL-006',
      timestamp: '2025-01-18 09:00:00',
      user: 'Sarah Johnson',
      action: 'Settlement Plan Created',
      debtorId: 'ACC-10020',
      debtorName: 'James Wilson',
      settlementId: 'SET-2025-006',
      originalBalance: 20000,
      settlementAmount: 14000,
      discountPercent: 30,
      paymentTerms: 'Lump Sum',
      status: 'Pending Approval',
      category: 'settlement',
      details: 'Settlement plan created for 30% discount. Awaiting manager approval.',
      submittedFor: 'Manager Approval'
    },
    {
      id: 'SL-007',
      timestamp: '2025-01-17 15:45:00',
      user: 'Mike Wilson',
      action: 'Settlement Installment Missed',
      debtorId: 'ACC-10025',
      debtorName: 'Lisa Anderson',
      settlementId: 'SET-2025-007',
      originalBalance: 10000,
      settlementAmount: 6500,
      discountPercent: 35,
      installmentNumber: 3,
      totalInstallments: 5,
      paymentTerms: '5 Installments',
      status: 'Defaulted',
      category: 'settlement',
      details: 'Installment 3 of 5 missed. Payment of $1,300 was due on 2025-01-15. Account marked for follow-up.',
      dueDate: '2025-01-15',
      approvedBy: 'Sarah Johnson',
      approvedDate: '2025-01-10 10:00:00'
    },
    {
      id: 'SL-008',
      timestamp: '2025-01-17 11:20:00',
      user: 'John Adams',
      action: 'Settlement Agreement Sent',
      debtorId: 'ACC-10030',
      debtorName: 'Michael Chen',
      settlementId: 'SET-2025-008',
      originalBalance: 22000,
      settlementAmount: 15400,
      discountPercent: 30,
      paymentTerms: 'Lump Sum',
      status: 'Approved',
      category: 'settlement',
      details: 'Settlement agreement sent to debtor via email and postal mail for signature.',
      approvedBy: 'Mike Wilson',
      approvedDate: '2025-01-17 10:00:00',
      sentMethod: 'Email & Postal Mail'
    },
    {
      id: 'SL-009',
      timestamp: '2025-01-16 13:30:00',
      user: 'Sarah Johnson',
      action: 'Settlement Plan Cancelled',
      debtorId: 'ACC-10035',
      debtorName: 'Patricia Martinez',
      settlementId: 'SET-2025-009',
      originalBalance: 16000,
      settlementAmount: 9600,
      discountPercent: 40,
      paymentTerms: '4 Installments',
      status: 'Cancelled',
      category: 'settlement',
      details: 'Settlement plan cancelled by debtor. Debtor opted for full payment instead.',
      cancelledBy: 'Sarah Johnson',
      cancelledDate: '2025-01-16 13:30:00',
      cancellationReason: 'Debtor chose full payment option'
    },
    {
      id: 'SL-010',
      timestamp: '2025-01-16 10:15:00',
      user: 'Mike Wilson',
      action: 'Settlement Plan Completed',
      debtorId: 'ACC-10040',
      debtorName: 'Thomas Anderson',
      settlementId: 'SET-2025-010',
      originalBalance: 14000,
      settlementAmount: 9800,
      discountPercent: 30,
      paymentTerms: '7 Installments',
      status: 'Completed',
      category: 'settlement',
      details: 'Final installment received. Settlement plan completed successfully. Account closed with full satisfaction.',
      approvedBy: 'John Adams',
      approvedDate: '2025-01-05 14:00:00',
      completedDate: '2025-01-16 10:15:00'
    }
  ]);

  // Get unique users and combine with activity logs
  const allUsers = useMemo(() => {
    const users = new Set(['all']);
    settlementLogs.forEach(log => users.add(log.user));
    return Array.from(users);
  }, [settlementLogs]);

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    let filtered = [...settlementLogs];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.debtorName?.toLowerCase().includes(term) ||
        log.debtorId?.toLowerCase().includes(term) ||
        log.settlementId?.toLowerCase().includes(term) ||
        log.action?.toLowerCase().includes(term) ||
        log.details?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(log => log.user === userFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const logDate = (timestamp) => new Date(timestamp);

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(log => {
            const date = logDate(log.timestamp);
            return date.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => logDate(log.timestamp) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => logDate(log.timestamp) >= monthAgo);
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [settlementLogs, searchTerm, statusFilter, userFilter, dateFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = settlementLogs.length;
    const approved = settlementLogs.filter(l => l.status === 'Approved').length;
    const completed = settlementLogs.filter(l => l.status === 'Completed').length;
    const pending = settlementLogs.filter(l => l.status === 'Pending Approval').length;
    const rejected = settlementLogs.filter(l => l.status === 'Rejected').length;
    const defaulted = settlementLogs.filter(l => l.status === 'Defaulted').length;

    const totalAmount = settlementLogs.reduce((sum, log) => sum + (log.settlementAmount || 0), 0);
    const totalOriginal = settlementLogs.reduce((sum, log) => sum + (log.originalBalance || 0), 0);

    return {
      total,
      approved,
      completed,
      pending,
      rejected,
      defaulted,
      totalAmount,
      totalOriginal,
      averageDiscount: totalOriginal ? ((totalOriginal - totalAmount) / totalOriginal * 100).toFixed(1) : 0
    };
  }, [settlementLogs]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Completed':
        return 'primary';
      case 'Pending Approval':
        return 'warning';
      case 'Rejected':
        return 'error';
      case 'Cancelled':
        return 'default';
      case 'Defaulted':
        return 'error';
      case 'In Progress':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'Pending Approval':
      case 'In Progress':
        return <PendingIcon fontSize="small" />;
      case 'Rejected':
      case 'Cancelled':
      case 'Defaulted':
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailsDialog(true);
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting settlement logs...');
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setUserFilter('all');
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Settlement Plan Activity Log
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive log of all settlement plan activities, approvals, payments, and status changes
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
                  <DocumentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {statistics.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Entries
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.success.main, width: 56, height: 56 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {statistics.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Plans
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 56, height: 56 }}>
                  <PendingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {statistics.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Approval
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.info.main, width: 56, height: 56 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    ${(statistics.totalAmount / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Settlement Amount
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by debtor, settlement ID, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Defaulted">Defaulted</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date Range"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>User</InputLabel>
                <Select
                  value={userFilter}
                  label="User"
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  {allUsers.map(user => (
                    <MenuItem key={user} value={user}>
                      {user === 'all' ? 'All Users' : user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                  fullWidth
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  fullWidth
                >
                  Export
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all' || userFilter !== 'all') && (
            <Box mt={2}>
              <Alert severity="info" icon={<FilterIcon />}>
                Showing {filteredLogs.length} of {settlementLogs.length} entries
                {searchTerm && ` matching "${searchTerm}"`}
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Debtor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Settlement ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary" py={4}>
                        No settlement logs found matching your criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(log.timestamp).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {log.action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {log.debtorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {log.debtorId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.settlementId}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ${log.settlementAmount?.toLocaleString()}
                        </Typography>
                        {log.originalBalance && (
                          <Typography variant="caption" color="text.secondary">
                            from ${log.originalBalance.toLocaleString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.discountPercent && (
                          <Chip
                            label={`${log.discountPercent}%`}
                            size="small"
                            color="warning"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          size="small"
                          color={getStatusColor(log.status)}
                          icon={getStatusIcon(log.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                            {log.user.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body2">
                            {log.user}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(log)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Settlement Plan Log Details</Typography>
            <IconButton onClick={() => setDetailsDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedLog.action}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedLog.details}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Settlement ID</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedLog.settlementId}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Box mt={0.5}>
                  <Chip
                    label={selectedLog.status}
                    size="small"
                    color={getStatusColor(selectedLog.status)}
                    icon={getStatusIcon(selectedLog.status)}
                  />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Debtor Name</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedLog.debtorName}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Debtor ID</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedLog.debtorId}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Original Balance</Typography>
                <Typography variant="body1" fontWeight={600} color="error">
                  ${selectedLog.originalBalance?.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Settlement Amount</Typography>
                <Typography variant="body1" fontWeight={600} color="success.main">
                  ${selectedLog.settlementAmount?.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Discount Percentage</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.discountPercent}%
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Payment Terms</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedLog.paymentTerms}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Created By</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedLog.user}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </Typography>
              </Grid>

              {selectedLog.approvedBy && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Approved By</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedLog.approvedBy}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Approved Date</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(selectedLog.approvedDate).toLocaleString()}
                    </Typography>
                  </Grid>
                </>
              )}

              {selectedLog.paymentAmount && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Payment Amount</Typography>
                  <Typography variant="body1" fontWeight={600} color="success.main">
                    ${selectedLog.paymentAmount.toLocaleString()}
                  </Typography>
                </Grid>
              )}

              {selectedLog.paymentMethod && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                  <Typography variant="body1" fontWeight={600}>{selectedLog.paymentMethod}</Typography>
                </Grid>
              )}

              {selectedLog.installmentNumber && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    Installment {selectedLog.installmentNumber} of {selectedLog.totalInstallments}
                  </Alert>
                </Grid>
              )}

              {selectedLog.rejectionReason && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="body2" fontWeight={600}>Rejection Reason:</Typography>
                    <Typography variant="body2">{selectedLog.rejectionReason}</Typography>
                  </Alert>
                </Grid>
              )}

              {selectedLog.cancellationReason && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    <Typography variant="body2" fontWeight={600}>Cancellation Reason:</Typography>
                    <Typography variant="body2">{selectedLog.cancellationReason}</Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<PrintIcon />} variant="outlined">
            Print
          </Button>
          <Button startIcon={<DownloadIcon />} variant="outlined">
            Download
          </Button>
          <Button onClick={() => setDetailsDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettlementPlanLog;
