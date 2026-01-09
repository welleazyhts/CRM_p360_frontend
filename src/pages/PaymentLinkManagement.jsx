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
  Divider,
  Checkbox,
  FormGroup,
  FormControlLabel
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
import { useTranslation } from 'react-i18next';

const PaymentLinkManagement = () => {
  const { t } = useTranslation();
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
  const [reminderDialog, setReminderDialog] = useState(false);
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
    setPage(0); // Reset to first page on filter/search change
    loadPaymentLinks();
    loadStats();
  }, [statusFilter, searchTerm, tabValue]);

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
        setSearchTerm(''); // Ensure search term is cleared
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
      alert(t('paymentLinks.messages.copySuccess'));
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

  const handleOpenReminderDialog = (link) => {
    setSelectedLink(link);
    // Determine default channels based on customer info presence
    setSendChannels({
      sms: !!link.customerPhone,
      email: !!link.customerEmail,
      whatsapp: !!link.customerPhone
    });
    setReminderDialog(true);
  };

  const handleSendReminder = async () => {
    try {
      await paymentLinkService.sendReminder(selectedLink.linkId, sendChannels);
      setReminderDialog(false);
      setSendChannels({ sms: false, email: false, whatsapp: false });
      loadPaymentLinks();
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const handleCancelLink = async (linkId) => {
    if (window.confirm(t('paymentLinks.messages.cancelConfirm'))) {
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
            {t('paymentLinks.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('paymentLinks.subtitle')}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadPaymentLinks}
            sx={{ mr: 1 }}
          >
            {t('paymentLinks.buttons.refresh')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            {t('paymentLinks.buttons.create')}
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
                  {t('paymentLinks.stats.totalLinks')}
                </Typography>
                <Typography variant="h4">{stats.totalLinks}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {t('paymentLinks.stats.totalAmount')}: ₹{(stats.totalAmount / 1000).toFixed(0)}K
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  {t('paymentLinks.stats.pending')}
                </Typography>
                <Typography variant="h4" color="warning.main">{stats.pendingLinks}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  ₹{(stats.pendingAmount / 1000).toFixed(0)}K {t('paymentLinks.stats.pendingAmount')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  {t('paymentLinks.stats.successful')}
                </Typography>
                <Typography variant="h4" color="success.main">{stats.paidLinks}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  ₹{(stats.paidAmount / 1000).toFixed(0)}K {t('paymentLinks.stats.collected')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  {t('paymentLinks.stats.conversionRate')}
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
                autoComplete="off"
                placeholder={t('paymentLinks.filters.searchPlaceholder')}
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
                <InputLabel>{t('paymentLinks.filters.status')}</InputLabel>
                <Select
                  value={statusFilter}
                  label={t('paymentLinks.filters.status')}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">{t('paymentLinks.filters.allStatus')}</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.PENDING}>{t('paymentLinks.status.Pending')}</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.PAID}>{t('paymentLinks.status.Paid')}</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.FAILED}>{t('paymentLinks.status.Failed')}</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.EXPIRED}>{t('paymentLinks.status.Expired')}</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.CANCELLED}>{t('paymentLinks.status.Cancelled')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Links Table */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`${t('paymentLinks.tabs.all')} (${paymentLinks.length})`} />
          <Tab label={`${t('paymentLinks.tabs.pending')} (${paymentLinks.filter(l => l.status === PAYMENT_STATUS.PENDING).length})`} />
          <Tab label={`${t('paymentLinks.tabs.paid')} (${paymentLinks.filter(l => l.status === PAYMENT_STATUS.PAID).length})`} />
          <Tab label={`${t('paymentLinks.tabs.others')}`} />
        </Tabs>

        <CardContent>
          {loading && <LinearProgress />}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('paymentLinks.table.linkId')}</TableCell>
                  <TableCell>{t('paymentLinks.table.customerDetails')}</TableCell>
                  <TableCell>{t('paymentLinks.table.amount')}</TableCell>
                  <TableCell>{t('paymentLinks.table.type')}</TableCell>
                  <TableCell>{t('paymentLinks.table.status')}</TableCell>
                  <TableCell>{t('paymentLinks.table.created')}</TableCell>
                  <TableCell>{t('paymentLinks.table.expiry')}</TableCell>
                  <TableCell>{t('paymentLinks.table.actions')}</TableCell>
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
                          {link.policyNumber || t('paymentLinks.table.noPolicy')}
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
                            {t('paymentLinks.table.paid')}: ₹{link.paidAmount.toLocaleString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={t(`paymentLinks.type.${link.paymentType}`, link.paymentType)} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(link.status)}
                          label={t(`paymentLinks.status.${link.status}`, link.status)}
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
                          <Tooltip title={t('paymentLinks.tooltips.view')}>
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
                          <Tooltip title={t('paymentLinks.tooltips.copy')}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyLink(link.shortUrl)}
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {link.status === PAYMENT_STATUS.PENDING && (
                            <>
                              <Tooltip title={t('paymentLinks.tooltips.send')}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedLink(link);
                                    // Pre-check channels based on available info
                                    setSendChannels({
                                      sms: !!link.customerPhone,
                                      email: !!link.customerEmail,
                                      whatsapp: !!link.customerPhone
                                    });
                                    setSendDialog(true);
                                  }}
                                >
                                  <SendIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('paymentLinks.tooltips.reminder')}>
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleOpenReminderDialog(link)}
                                >
                                  <ReminderIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('paymentLinks.tooltips.cancel')}>
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
        <DialogTitle>{t('paymentLinks.dialogs.createTitle')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('paymentLinks.form.customerName')}
                value={newPayment.customerName}
                onChange={(e) => setNewPayment({ ...newPayment, customerName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('paymentLinks.form.customerPhone')}
                value={newPayment.customerPhone}
                onChange={(e) => setNewPayment({ ...newPayment, customerPhone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('paymentLinks.form.customerEmail')}
                type="email"
                value={newPayment.customerEmail}
                onChange={(e) => setNewPayment({ ...newPayment, customerEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('paymentLinks.form.amount')}
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
                label={t('paymentLinks.form.description')}
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
                label={t('paymentLinks.form.policyNumber')}
                value={newPayment.policyNumber}
                onChange={(e) => setNewPayment({ ...newPayment, policyNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('paymentLinks.form.leadId')}
                value={newPayment.leadId}
                onChange={(e) => setNewPayment({ ...newPayment, leadId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t('paymentLinks.form.paymentType')}</InputLabel>
                <Select
                  value={newPayment.paymentType}
                  label={t('paymentLinks.form.paymentType')}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentType: e.target.value })}
                >
                  <MenuItem value={PAYMENT_TYPE.PREMIUM}>{t('paymentLinks.type.Premium')}</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.RENEWAL}>{t('paymentLinks.type.Renewal')}</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.ENDORSEMENT}>{t('paymentLinks.type.Endorsement')}</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.INSPECTION}>{t('paymentLinks.type.Inspection')}</MenuItem>
                  <MenuItem value={PAYMENT_TYPE.OTHER}>{t('paymentLinks.type.Other')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t('paymentLinks.form.paymentProvider')}</InputLabel>
                <Select
                  value={newPayment.provider}
                  label={t('paymentLinks.form.paymentProvider')}
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
                label={t('paymentLinks.form.expiryDays')}
                type="number"
                value={newPayment.expiryDays}
                onChange={(e) => setNewPayment({ ...newPayment, expiryDays: e.target.value })}
                InputProps={{ inputProps: { min: 1, max: 30 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>{t('paymentLinks.buttons.cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleCreatePaymentLink}
            disabled={!newPayment.amount || !newPayment.customerName || !newPayment.customerPhone}
          >
            {t('paymentLinks.buttons.createLink')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Payment Link Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('paymentLinks.dialogs.viewTitle')}</DialogTitle>
        <DialogContent>
          {selectedLink && (
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">{t('paymentLinks.table.linkId')}</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedLink.linkId}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">{t('paymentLinks.dialogs.url')}</Typography>
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
                  <Typography variant="body2" color="text.secondary">{t('paymentLinks.table.amount')}</Typography>
                  <Typography variant="h6" color="primary">₹{selectedLink.amount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">{t('paymentLinks.table.status')}</Typography>
                  <Chip
                    icon={getStatusIcon(selectedLink.status)}
                    label={t(`paymentLinks.status.${selectedLink.status}`, selectedLink.status)}
                    color={getStatusColor(selectedLink.status)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">{t('paymentLinks.form.customerName')}</Typography>
                  <Typography variant="body1">{selectedLink.customerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">{t('paymentLinks.form.customerPhone')}</Typography>
                  <Typography variant="body1">{selectedLink.customerPhone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">{t('paymentLinks.form.customerEmail')}</Typography>
                  <Typography variant="body1">{selectedLink.customerEmail || 'N/A'}</Typography>
                </Grid>
                {selectedLink.transactionId && (
                  <Grid item xs={12}>
                    <Alert severity="success">
                      <Typography variant="body2">{t('paymentLinks.table.transactionId')}: {selectedLink.transactionId}</Typography>
                      <Typography variant="body2">{t('paymentLinks.table.paidAt')}: {new Date(selectedLink.paidAt).toLocaleString()}</Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>{t('paymentLinks.buttons.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Send Payment Link Dialog */}
      <Dialog open={sendDialog} onClose={() => setSendDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('paymentLinks.dialogs.sendTitle')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              {t('paymentLinks.dialogs.selectChannels')}
            </Typography>
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendChannels.sms}
                    onChange={(e) => setSendChannels({ ...sendChannels, sms: e.target.checked })}
                    disabled={!selectedLink?.customerPhone}
                  />
                }
                label={t('paymentLinks.dialogs.channels.sms')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendChannels.email}
                    onChange={(e) => setSendChannels({ ...sendChannels, email: e.target.checked })}
                    disabled={!selectedLink?.customerEmail}
                  />
                }
                label={t('paymentLinks.dialogs.channels.email')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendChannels.whatsapp}
                    onChange={(e) => setSendChannels({ ...sendChannels, whatsapp: e.target.checked })}
                    disabled={!selectedLink?.customerPhone}
                  />
                }
                label={t('paymentLinks.dialogs.channels.whatsapp')}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialog(false)}>{t('paymentLinks.buttons.cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSendLink}
            disabled={!sendChannels.sms && !sendChannels.email && !sendChannels.whatsapp}
          >
            {t('paymentLinks.buttons.send')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={reminderDialog} onClose={() => setReminderDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('paymentLinks.dialogs.reminderTitle')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              {t('paymentLinks.dialogs.selectChannelsReminder')}
            </Typography>
            <FormGroup sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendChannels.sms}
                    onChange={(e) => setSendChannels({ ...sendChannels, sms: e.target.checked })}
                    disabled={!selectedLink?.customerPhone}
                  />
                }
                label={t('paymentLinks.dialogs.channels.sms')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendChannels.email}
                    onChange={(e) => setSendChannels({ ...sendChannels, email: e.target.checked })}
                    disabled={!selectedLink?.customerEmail}
                  />
                }
                label={t('paymentLinks.dialogs.channels.email')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendChannels.whatsapp}
                    onChange={(e) => setSendChannels({ ...sendChannels, whatsapp: e.target.checked })}
                    disabled={!selectedLink?.customerPhone}
                  />
                }
                label={t('paymentLinks.dialogs.channels.whatsapp')}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderDialog(false)}>{t('paymentLinks.buttons.cancel')}</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleSendReminder}
            disabled={!sendChannels.sms && !sendChannels.email && !sendChannels.whatsapp}
          >
            {t('paymentLinks.buttons.sendReminder')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default PaymentLinkManagement;
