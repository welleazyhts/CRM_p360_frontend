import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Checkbox,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  CheckCircle as ApproveIcon,
  Payment as PaymentIcon,
  FileDownload as ExportIcon,
  Receipt as StatementIcon
} from '@mui/icons-material';
import { useCommission } from '../context/CommissionContext';

const CommissionTracking = () => {
  const {
    commissions,
    config,
    getStatistics,
    getPendingCommissions,
    getApprovedCommissions,
    getPaidCommissions,
    approveCommission,
    markAsPaid,
    batchApprove,
    batchMarkAsPaid,
    getFilteredCommissions,
    PAYMENT_STATUS,
    PRODUCT_TYPE
  } = useCommission();

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCommissions, setSelectedCommissions] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({
    productType: '',
    paymentStatus: ''
  });

  // Get statistics
  const stats = useMemo(() => getStatistics(), [commissions]);
  const pendingComms = useMemo(() => getPendingCommissions(), [commissions]);
  const approvedComms = useMemo(() => getApprovedCommissions(), [commissions]);
  const paidComms = useMemo(() => getPaidCommissions(), [commissions]);

  // Get display commissions based on tab
  const displayCommissions = useMemo(() => {
    let comms = commissions;

    if (currentTab === 1) comms = pendingComms;
    else if (currentTab === 2) comms = approvedComms;
    else if (currentTab === 3) comms = paidComms;

    return getFilteredCommissions(filters, 'policyDate', 'desc');
  }, [commissions, currentTab, filters, pendingComms, approvedComms, paidComms]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSelectedCommissions([]);
  };

  // Handle menu
  const handleMenuOpen = (event, commission) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCommission(commission);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCommission(null);
  };

  // Handle approve
  const handleApprove = (commissionId) => {
    approveCommission(commissionId);
    handleMenuClose();
  };

  // Handle mark as paid
  const handleMarkAsPaid = () => {
    if (selectedCommission) {
      markAsPaid(selectedCommission.id, paymentDate);
      setPaymentDialogOpen(false);
      handleMenuClose();
    }
  };

  // Handle batch operations
  const handleBatchApprove = () => {
    batchApprove(selectedCommissions);
    setSelectedCommissions([]);
  };

  const handleBatchMarkAsPaid = () => {
    batchMarkAsPaid(selectedCommissions, paymentDate);
    setSelectedCommissions([]);
    setPaymentDialogOpen(false);
  };

  // Handle selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCommissions(displayCommissions.map(c => c.id));
    } else {
      setSelectedCommissions([]);
    }
  };

  const handleSelectOne = (commissionId) => {
    setSelectedCommissions(prev =>
      prev.includes(commissionId)
        ? prev.filter(id => id !== commissionId)
        : [...prev, commissionId]
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get payment status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'info',
      paid: 'success',
      on_hold: 'error',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  // Handle export
  const handleExport = () => {
    const data = {
      commissions: displayCommissions,
      stats,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Commission Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage agent commissions and payments
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExport}>
          Export
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Commissions
              </Typography>
              <Typography variant="h5">
                {formatCurrency(stats.totalNet || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.total} policies
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Pending Approval
              </Typography>
              <Typography variant="h5" color="warning.main">
                {formatCurrency(
                  pendingComms.reduce((sum, c) => sum + (c.netCommission || 0), 0)
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {pendingComms.length} items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Approved (Unpaid)
              </Typography>
              <Typography variant="h5" color="info.main">
                {formatCurrency(
                  approvedComms.reduce((sum, c) => sum + (c.netCommission || 0), 0)
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {approvedComms.length} items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Paid This Month
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatCurrency(
                  paidComms
                    .filter(c => {
                      const paymentDate = new Date(c.paymentDate);
                      const now = new Date();
                      return paymentDate.getMonth() === now.getMonth() &&
                             paymentDate.getFullYear() === now.getFullYear();
                    })
                    .reduce((sum, c) => sum + (c.netCommission || 0), 0)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab
            label={
              <Badge badgeContent={pendingComms.length} color="warning">
                Pending
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={approvedComms.length} color="info">
                Approved
              </Badge>
            }
          />
          <Tab label="Paid" />
        </Tabs>
      </Paper>

      {/* Batch Actions */}
      {selectedCommissions.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>{selectedCommissions.length} selected</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {currentTab === 1 && (
                <Button size="small" onClick={handleBatchApprove} startIcon={<ApproveIcon />}>
                  Approve Selected
                </Button>
              )}
              {currentTab === 2 && (
                <Button
                  size="small"
                  onClick={() => setPaymentDialogOpen(true)}
                  startIcon={<PaymentIcon />}
                >
                  Mark as Paid
                </Button>
              )}
            </Box>
          </Box>
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Product Type</InputLabel>
              <Select
                value={filters.productType}
                onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
                label="Product Type"
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(PRODUCT_TYPE).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                label="Payment Status"
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(PAYMENT_STATUS).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Commissions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCommissions.length === displayCommissions.length && displayCommissions.length > 0}
                  indeterminate={selectedCommissions.length > 0 && selectedCommissions.length < displayCommissions.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Policy #</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Product</TableCell>
              <TableCell align="right">Premium</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Gross</TableCell>
              <TableCell align="right">TDS</TableCell>
              <TableCell align="right">Net</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayCommissions.length > 0 ? (
              displayCommissions.map((comm) => (
                <TableRow key={comm.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCommissions.includes(comm.id)}
                      onChange={() => handleSelectOne(comm.id)}
                    />
                  </TableCell>
                  <TableCell>{comm.policyNumber || comm.policyId}</TableCell>
                  <TableCell>{comm.agentName}</TableCell>
                  <TableCell>
                    <Chip label={comm.productType} size="small" />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(comm.premium)}</TableCell>
                  <TableCell align="right">{comm.rate}%</TableCell>
                  <TableCell align="right">{formatCurrency(comm.grossCommission)}</TableCell>
                  <TableCell align="right">{formatCurrency(comm.tds)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(comm.netCommission)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={comm.paymentStatus.replace(/_/g, ' ')}
                      color={getStatusColor(comm.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(comm.policyDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, comm)}>
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Typography color="text.secondary">No commissions found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {selectedCommission && selectedCommission.paymentStatus === PAYMENT_STATUS.PENDING && (
          <MenuItem onClick={() => handleApprove(selectedCommission.id)}>
            <ApproveIcon sx={{ mr: 1 }} /> Approve
          </MenuItem>
        )}
        {selectedCommission && selectedCommission.paymentStatus === PAYMENT_STATUS.APPROVED && (
          <MenuItem
            onClick={() => {
              setPaymentDialogOpen(true);
              handleMenuClose();
            }}
          >
            <PaymentIcon sx={{ mr: 1 }} /> Mark as Paid
          </MenuItem>
        )}
      </Menu>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Mark as Paid</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="date"
            label="Payment Date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={selectedCommissions.length > 0 ? handleBatchMarkAsPaid : handleMarkAsPaid}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionTracking;
