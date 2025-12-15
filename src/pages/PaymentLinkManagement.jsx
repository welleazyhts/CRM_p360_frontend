import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  EventBusy as ExpiredIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Visibility as ViewIcon,
  Notifications as ReminderIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import paymentLinkService, { PAYMENT_PROVIDERS, PAYMENT_STATUS, PAYMENT_TYPE } from '../services/paymentLinkService';

const PaymentLinkManagement = () => {
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [createDialog, setCreateDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [sendDialog, setSendDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [stats, setStats] = useState(null);

  // Create payment link form state
  const [newPayment, setNewPayment] = useState({
    amount: '',
    description: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    policyNumber: '',
    leadId: '',
    paymentType: PAYMENT_TYPE.PREMIUM,
    provider: PAYMENT_PROVIDERS.RAZORPAY,
    expiryDays: 7,
    sendSMS: false,
    sendEmail: false,
    sendWhatsApp: false
  });

  // Send channels state
  const [sendChannels, setSendChannels] = useState({
    sms: false,
    email: false,
    whatsapp: false
  });

  useEffect(() => {
    loadPaymentLinks();
    loadStats();
  }, [statusFilter, searchTerm]);

  const loadPaymentLinks = async () => {
    setLoading(true);
    try {
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      };
      const response = await paymentLinkService.getPaymentLinks(filters);
      setPaymentLinks(response.data);
    } catch (error) {
      console.error('Error loading payment links:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await paymentLinkService.getPaymentStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreatePaymentLink = async () => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(newPayment.expiryDays));

      const paymentData = {
        ...newPayment,
        expiryDate: expiryDate.toISOString(),
        createdBy: 'Current User' // Replace with actual user from auth context
      };

      const response = await paymentLinkService.createPaymentLink(paymentData);

      if (response.success) {
        setCreateDialog(false);
        loadPaymentLinks();
        loadStats();
        // Reset form
        setNewPayment({
          amount: '',
          description: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          policyNumber: '',
          leadId: '',
          paymentType: PAYMENT_TYPE.PREMIUM,
          provider: PAYMENT_PROVIDERS.RAZORPAY,
          expiryDays: 7,
          sendSMS: false,
          sendEmail: false,
          sendWhatsApp: false
        });
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  };

  const handleCopyLink = async (url) => {
    const success = await paymentLinkService.copyToClipboard(url);
    if (success) {
      // Show success message (you can use a snackbar here)
      alert('Payment link copied to clipboard!');
    }
  };

  const handleSendLink = async () => {
    try {
      await paymentLinkService.sendPaymentLink(selectedLink.linkId, sendChannels);
      setSendDialog(false);
      setSendChannels({ sms: false, email: false, whatsapp: false });
      loadPaymentLinks();
    } catch (error) {
      console.error('Error sending payment link:', error);
    }
  };

  const handleSendReminder = async (linkId) => {
    try {
      await paymentLinkService.sendReminder(linkId);
      loadPaymentLinks();
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const handleCancelLink = async (linkId) => {
    if (window.confirm('Are you sure you want to cancel this payment link?')) {
      try {
        await paymentLinkService.cancelPaymentLink(linkId, 'Cancelled by user');
        loadPaymentLinks();
        loadStats();
      } catch (error) {
        console.error('Error cancelling payment link:', error);
      }
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      [PAYMENT_STATUS.PENDING]: <PendingIcon />,
      [PAYMENT_STATUS.PAID]: <CheckIcon />,
      [PAYMENT_STATUS.FAILED]: <ErrorIcon />,
      [PAYMENT_STATUS.EXPIRED]: <ExpiredIcon />,
      [PAYMENT_STATUS.CANCELLED]: <CancelIcon />
    };
    return icons[status] || <PendingIcon />;
  };

  const getStatusColor = (status) => {
    const colors = {
      [PAYMENT_STATUS.PENDING]: 'warning',
      [PAYMENT_STATUS.PAID]: 'success',
      [PAYMENT_STATUS.FAILED]: 'error',
      [PAYMENT_STATUS.EXPIRED]: 'default',
      [PAYMENT_STATUS.CANCELLED]: 'secondary'
    };
    return colors[status] || 'default';
  };

  const filteredLinks = paymentLinks.filter(link => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return link.status === PAYMENT_STATUS.PENDING;
    if (tabValue === 2) return link.status === PAYMENT_STATUS.PAID;
    if (tabValue === 3) return [PAYMENT_STATUS.EXPIRED, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.CANCELLED].includes(link.status);
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Payment Link Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage payment links for insurance premiums
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadPaymentLinks}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            Create Payment Link
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Total Links
                </Typography>
                <Typography variant="h4">{stats.totalLinks}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Total Amount: ₹{(stats.totalAmount / 1000).toFixed(0)}K
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4" color="warning.main">{stats.pendingLinks}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  ₹{(stats.pendingAmount / 1000).toFixed(0)}K pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Successful
                </Typography>
                <Typography variant="h4" color="success.main">{stats.paidLinks}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  ₹{(stats.paidAmount / 1000).toFixed(0)}K collected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Conversion Rate
                </Typography>
                <Typography variant="h4" color="primary.main">{stats.conversionRate}%</Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.conversionRate}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by customer name, phone, link ID, or policy number..."
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.PENDING}>Pending</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.PAID}>Paid</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.FAILED}>Failed</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.EXPIRED}>Expired</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.CANCELLED}>Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Links Table */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All (${paymentLinks.length})`} />
          <Tab label={`Pending (${paymentLinks.filter(l => l.status === PAYMENT_STATUS.PENDING).length})`} />
          <Tab label={`Paid (${paymentLinks.filter(l => l.status === PAYMENT_STATUS.PAID).length})`} />
          <Tab label={`Others`} />
        </Tabs>

        <CardContent>
          {loading && <LinearProgress />}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Link ID</TableCell>
                  <TableCell>Customer Details</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLinks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((link) => (
                    <TableRow key={link.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {link.linkId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {link.policyNumber || 'No policy'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {link.customerName}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {link.customerPhone}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {link.customerEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          ₹{link.amount.toLocaleString()}
                        </Typography>
                        {link.paidAmount && (
                          <Typography variant="caption" color="success.main">
                            Paid: ₹{link.paidAmount.toLocaleString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={link.paymentType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(link.status)}
                          label={link.status}
                          size="small"
                          color={getStatusColor(link.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(link.expiryDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedLink(link);
                                setViewDialog(true);
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy Link">
                            <IconButton
                              size="small"
                              onClick={() => handleCopyLink(link.shortUrl)}
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {link.status === PAYMENT_STATUS.PENDING && (
                            <>
                              <Tooltip title="Send Link">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedLink(link);
                                    setSendDialog(true);
                                  }}
                                >
                                  <SendIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Send Reminder">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleSendReminder(link.linkId)}
                                >
                                  <ReminderIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel Link">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleCancelLink(link.linkId)}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredLinks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Create Payment Link Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Payment Link</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newPayment.customerName}
                onChange={(e) => setNewPayment({ ...newPayment, customerName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Phone"
                value={newPayment.customerPhone}
                onChange={(e) => setNewPayment({ ...newPayment, customerPhone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Email"
                type="email"
                value={newPayment.customerEmail}
                onChange={(e) => setNewPayment({ ...newPayment, customerEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                InputProps={{ startAdornment: '₹' }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Policy Number"
                value={newPayment.policyNumber}
                onChange={(e) => setNewPayment({ ...newPayment, policyNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lead ID"
                value={newPayment.leadId}
                onChange={(e) => setNewPayment({ ...newPayment, leadId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={newPayment.paymentType}
                  label="Payment Type"
                  onChange={(e) => setNewPayment({ ...newPayment, paymentType: e.target.value })}
                >
                  <MenuItem value={PAYMENT_TYPE.PREMIUM}>Premium</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.RENEWAL}>Renewal</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.ENDORSEMENT}>Endorsement</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.INSPECTION}>Inspection</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.OTHER}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Payment Provider</InputLabel>
                <Select
                  value={newPayment.provider}
                  label="Payment Provider"
                  onChange={(e) => setNewPayment({ ...newPayment, provider: e.target.value })}
                >
                  <MenuItem value={PAYMENT_PROVIDERS.RAZORPAY}>Razorpay</MenuItem>
                  <MenuItem value={PAYMENT_PROVIDERS.PAYU}>PayU</MenuItem>
                  <MenuItem value={PAYMENT_PROVIDERS.PHONEPE}>PhonePe</MenuItem>
                  <MenuItem value={PAYMENT_PROVIDERS.PAYTM}>Paytm</MenuItem>
                  <MenuItem value={PAYMENT_PROVIDERS.STRIPE}>Stripe</MenuItem>
                  <MenuItem value={PAYMENT_PROVIDERS.CCAVENUE}>CCAvenue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Expiry (Days)"
                type="number"
                value={newPayment.expiryDays}
                onChange={(e) => setNewPayment({ ...newPayment, expiryDays: e.target.value })}
                InputProps={{ inputProps: { min: 1, max: 30 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreatePaymentLink}
            disabled={!newPayment.amount || !newPayment.customerName || !newPayment.customerPhone}
          >
            Create Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Payment Link Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Link Details</DialogTitle>
        <DialogContent>
          {selectedLink && (
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Link ID</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedLink.linkId}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Payment URL</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {selectedLink.shortUrl}
                    </Typography>
                    <IconButton size="small" onClick={() => handleCopyLink(selectedLink.shortUrl)}>
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Amount</Typography>
                  <Typography variant="h6" color="primary">₹{selectedLink.amount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedLink.status)}
                    label={selectedLink.status}
                    color={getStatusColor(selectedLink.status)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Customer Name</Typography>
                  <Typography variant="body1">{selectedLink.customerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedLink.customerPhone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedLink.customerEmail || 'N/A'}</Typography>
                </Grid>
                {selectedLink.transactionId && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      <Typography variant="body2">Transaction ID: {selectedLink.transactionId}</Typography>
                      <Typography variant="body2">Paid At: {new Date(selectedLink.paidAt).toLocaleString()}</Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Send Payment Link Dialog */}
      <Dialog open={sendDialog} onClose={() => setSendDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Send Payment Link</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Select channels to send payment link:
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  color={sendChannels.sms ? 'primary' : 'default'}
                  onClick={() => setSendChannels({ ...sendChannels, sms: !sendChannels.sms })}
                >
                  <SmsIcon />
                </IconButton>
                <Typography>SMS</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  color={sendChannels.email ? 'primary' : 'default'}
                  onClick={() => setSendChannels({ ...sendChannels, email: !sendChannels.email })}
                >
                  <EmailIcon />
                </IconButton>
                <Typography>Email</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  color={sendChannels.whatsapp ? 'success' : 'default'}
                  onClick={() => setSendChannels({ ...sendChannels, whatsapp: !sendChannels.whatsapp })}
                >
                  <WhatsAppIcon />
                </IconButton>
                <Typography>WhatsApp</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendLink}
            disabled={!sendChannels.sms && !sendChannels.email && !sendChannels.whatsapp}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentLinkManagement;
