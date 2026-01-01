import React, { useState, useEffect } from 'react';
import leadService from '../services/leadService';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tooltip, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, useTheme, alpha, Divider, FormControl, InputLabel,
  Select, Snackbar, Alert, InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterIcon, Sort as SortIcon,
  Call as CallIcon, Visibility as ViewIcon, Edit as EditIcon,
  Email as EmailIcon, AttachMoney as MoneyIcon, Send as SendIcon,
  Close as CloseIcon, Share as ShareIcon, DateRange as DateIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AssignedLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getPolicyTypeKey = (policyType) => {
    if (!policyType) return '';
    const lowerType = policyType.toLowerCase().trim();
    const map = {
      'health insurance': 'healthInsurance',
      'life insurance': 'lifeInsurance',
      'motor insurance': 'motorInsurance',
      'vehicle insurance': 'vehicleInsurance',
      'home insurance': 'homeInsurance',
      'travel insurance': 'travelInsurance'
    };
    return map[lowerType] || policyType;
  };
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterPolicyType, setFilterPolicyType] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [quickNoteDialog, setQuickNoteDialog] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [shareQuoteDialogOpen, setShareQuoteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedCallLead, setSelectedCallLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Email form state
  const [emailData, setEmailData] = useState({ subject: '', body: '', cc: '' });

  // Quote form state
  const [quoteData, setQuoteData] = useState({ quoteType: 'standard', premium: '', coverage: '', validTill: '', notes: '' });

  const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const priorityOptions = ['High', 'Medium', 'Low'];
  const policyTypeOptions = ['Health Insurance', 'Life Insurance', 'Motor Insurance', 'Home Insurance', 'Travel Insurance'];
  const dateRangeOptions = [
    { value: 'All', label: t('leads.assigned.filters.allTime', 'All Time') },
    { value: '7', label: t('leads.assigned.filters.last7Days', 'Last 7 Days') },
    { value: '30', label: t('leads.assigned.filters.last30Days', 'Last 30 Days') },
    { value: '90', label: t('leads.assigned.filters.last90Days', 'Last 90 Days') }
  ];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getAssignedLeads();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error('Error fetching assigned leads:', error);
      }
    };
    fetchLeads();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...leads];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(lead =>
        `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.phone?.includes(term) ||
        lead.id?.toString().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== 'All') {
      result = result.filter(lead => lead.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'All') {
      result = result.filter(lead => lead.priority === filterPriority);
    }

    // Policy type filter
    if (filterPolicyType !== 'All') {
      result = result.filter(lead => lead.policyType === filterPolicyType);
    }

    // Date range filter
    if (filterDateRange !== 'All') {
      const days = parseInt(filterDateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter(lead => {
        const leadDate = new Date(lead.createdAt || lead.lastContact);
        return leadDate >= cutoffDate;
      });
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    setFilteredLeads(result);
  }, [leads, searchTerm, filterStatus, filterPriority, filterPolicyType, filterDateRange, sortField, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setFilterPriority('All');
    setFilterPolicyType('All');
    setFilterDateRange('All');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Email functionality
  const handleOpenEmail = (lead) => {
    setSelectedLead(lead);
    setEmailData({
      subject: `Regarding Your ${lead.policyType} Inquiry`,
      body: `Dear ${lead.firstName} ${lead.lastName},\n\nThank you for your interest in our ${lead.policyType} services.\n\n`,
      cc: ''
    });
    setEmailDialogOpen(true);
  };

  const handleSendEmail = () => {
    // In production, this would call an API to send the email
    setEmailDialogOpen(false);
    setSnackbar({ open: true, message: t('leads.assigned.dialogs.email.success', 'Email sent successfully to {{email}}', { email: selectedLead.email }), severity: 'success' });
    setEmailData({ subject: '', body: '', cc: '' });
  };

  // Share Quote functionality
  const handleOpenShareQuote = (lead) => {
    setSelectedLead(lead);
    setQuoteData({
      quoteType: 'standard',
      premium: '',
      coverage: '',
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setShareQuoteDialogOpen(true);
  };

  const handleShareQuote = () => {
    // In production, this would generate and share the quote
    setShareQuoteDialogOpen(false);
    setSnackbar({ open: true, message: t('leads.assigned.dialogs.quote.success', 'Quote shared with {{name}}', { name: `${selectedLead.firstName} ${selectedLead.lastName}` }), severity: 'success' });
    setQuoteData({ quoteType: 'standard', premium: '', coverage: '', validTill: '', notes: '' });
  };

  const saveQuickNote = () => {
    setQuickNoteDialog(false);
    setNoteText('');
  };

  const saveStatusChange = () => {
    setStatusChangeDialog(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': theme.palette.info.main,
      'Contacted': theme.palette.warning.main,
      'Qualified': theme.palette.primary.main,
      'Proposal': theme.palette.secondary.main,
      'Negotiation': theme.palette.warning.dark,
      'Closed Won': theme.palette.success.main,
      'Closed Lost': theme.palette.error.main
    };
    return colors[status] || theme.palette.grey[500];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': theme.palette.error.main,
      'Medium': theme.palette.warning.main,
      'Low': theme.palette.success.main
    };
    return colors[priority] || theme.palette.grey[500];
  };

  const activeFiltersCount = [filterStatus, filterPriority, filterPolicyType, filterDateRange].filter(f => f !== 'All').length + (searchTerm ? 1 : 0);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">{t('navigation.assignedLeads')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('leads.assigned.subtitle', 'Displaying {{count}} of {{total}} assigned leads', { count: filteredLeads.length, total: leads.length })}
          </Typography>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('leads.assigned.searchPlaceholder', 'Search leads by name, email, phone...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}><ClearIcon fontSize="small" /></IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('leads.assigned.filters.status')}</InputLabel>
                <Select value={filterStatus} label={t('leads.assigned.filters.status')} onChange={(e) => setFilterStatus(e.target.value)}>
                  <MenuItem value="All">{t('leads.assigned.filters.allStatus', 'All Status')}</MenuItem>
                  {statusOptions.map(s => <MenuItem key={s} value={s}>{t(`leads.details.values.leadStatuses.${s}`, s)}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('leads.assigned.filters.priority')}</InputLabel>
                <Select value={filterPriority} label={t('leads.assigned.filters.priority')} onChange={(e) => setFilterPriority(e.target.value)}>
                  <MenuItem value="All">{t('leads.assigned.filters.allPriority', 'All Priority')}</MenuItem>
                  {priorityOptions.map(p => <MenuItem key={p} value={p}>{t(`leads.details.values.priorities.${p.toLowerCase()}`, p)}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('leads.assigned.filters.policyType')}</InputLabel>
                <Select value={filterPolicyType} label={t('leads.assigned.filters.policyType')} onChange={(e) => setFilterPolicyType(e.target.value)}>
                  <MenuItem value="All">{t('leads.assigned.filters.allTypes', 'All Types')}</MenuItem>
                  {policyTypeOptions.map(p => <MenuItem key={p} value={p}>{t(`leads.details.values.policyTypes.${getPolicyTypeKey(p)}`, p)}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('leads.assigned.filters.dateRange')}</InputLabel>
                <Select value={filterDateRange} label={t('leads.assigned.filters.dateRange')} onChange={(e) => setFilterDateRange(e.target.value)}>
                  {dateRangeOptions.map(d => <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Tooltip title={t('leads.assigned.clearFilters')}>
                <span>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFilters}
                    disabled={activeFiltersCount === 0}
                    fullWidth
                    size="small"
                  >
                    {t('leads.assigned.clear', 'Clear Filters')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('firstName')} sx={{ cursor: 'pointer' }}>{t('leads.assigned.table.name', 'Name')} {sortField === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}</TableCell>
                <TableCell>{t('leads.assigned.table.contact', 'Contact Details')}</TableCell>
                <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer' }}>{t('leads.assigned.filters.status', 'Status')} {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}</TableCell>
                <TableCell onClick={() => handleSort('priority')} sx={{ cursor: 'pointer' }}>{t('leads.assigned.filters.priority', 'Priority')} {sortField === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}</TableCell>
                <TableCell>{t('leads.assigned.filters.policyType', 'Policy Type')}</TableCell>
                <TableCell>{t('leads.assignedTo', 'Assigned To')}</TableCell>
                <TableCell onClick={() => handleSort('lastContact')} sx={{ cursor: 'pointer' }}>{t('leads.assigned.table.lastContact', 'Last Contact')} {sortField === 'lastContact' && (sortOrder === 'asc' ? '↑' : '↓')}</TableCell>
                <TableCell align="center">{t('leads.assigned.table.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center"><Typography color="text.secondary" sx={{ py: 4 }}>{t('leads.assigned.noLeads', 'No assigned leads found')}</Typography></TableCell></TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" fontWeight="600">{lead.firstName} {lead.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">ID: {lead.id}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{lead.phone}</Typography>
                        <Typography variant="caption" color="text.secondary">{lead.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={t(`leads.details.values.leadStatuses.${lead.status}`, lead.status)} size="small" sx={{ backgroundColor: alpha(getStatusColor(lead.status), 0.1), color: getStatusColor(lead.status), fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={t(`leads.details.values.priorities.${lead.priority?.toLowerCase()}`, lead.priority)} size="small" sx={{ backgroundColor: alpha(getPriorityColor(lead.priority), 0.1), color: getPriorityColor(lead.priority), fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{lead.policyType ? t(`leads.details.values.policyTypes.${getPolicyTypeKey(lead.policyType)}`, lead.policyType) : '-'}</TableCell>
                    <TableCell>{lead.assignedTo}</TableCell>
                    <TableCell>{lead.lastContact}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title={t('leads.assigned.actions.call', 'Call Lead')}><IconButton size="small" onClick={() => { setSelectedCallLead(lead); setCallDialogOpen(true); }} sx={{ color: theme.palette.success.main }}><CallIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title={t('leads.assigned.actions.viewDetails', 'View Details')}><IconButton size="small" onClick={() => navigate(`/lead-management/${lead.id}`)}><ViewIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title={t('leads.assigned.actions.edit', 'Edit Lead')}><IconButton size="small" onClick={() => navigate(`/lead-management/${lead.id}?edit=true`)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title={t('leads.assigned.actions.sendEmail', 'Send Email')}><IconButton size="small" onClick={() => handleOpenEmail(lead)} sx={{ color: theme.palette.primary.main }}><EmailIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title={t('leads.assigned.actions.shareQuote', 'Share Quote')}><IconButton size="small" onClick={() => handleOpenShareQuote(lead)} sx={{ color: theme.palette.warning.main }}><MoneyIcon fontSize="small" /></IconButton></Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmailIcon color="primary" /><Typography variant="h6">{t('leads.assigned.dialogs.email.title', 'Compose Email')}</Typography></Box>
            <IconButton onClick={() => setEmailDialogOpen(false)}><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLead && (
            <Stack spacing={2}>
              <Alert severity="info">{t('leads.assigned.dialogs.email.sendingTo', 'Sending email to:')} <strong>{selectedLead.firstName} {selectedLead.lastName}</strong> ({selectedLead.email})</Alert>
              <TextField fullWidth label={t('leads.assigned.dialogs.email.subject', 'Subject')} value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
              <TextField fullWidth label={t('leads.assigned.dialogs.email.cc', 'CC')} value={emailData.cc} onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })} placeholder={t('leads.assigned.dialogs.email.ccPlaceholder', 'e.g. manager@example.com')} />
              <TextField fullWidth multiline rows={8} label={t('leads.assigned.dialogs.email.body', 'Message Body')} value={emailData.body} onChange={(e) => setEmailData({ ...emailData, body: e.target.value })} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendEmail} disabled={!emailData.subject || !emailData.body}>{t('leads.assigned.dialogs.email.send')}</Button>
        </DialogActions>
      </Dialog>

      {/* Share Quote Dialog */}
      <Dialog open={shareQuoteDialogOpen} onClose={() => setShareQuoteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><MoneyIcon color="warning" /><Typography variant="h6">{t('leads.assigned.dialogs.quote.title', 'Share Quote')}</Typography></Box>
            <IconButton onClick={() => setShareQuoteDialogOpen(false)}><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLead && (
            <Stack spacing={2}>
              <Alert severity="info">{t('leads.assigned.dialogs.quote.creatingFor', 'Creating quote for:')} <strong>{selectedLead.firstName} {selectedLead.lastName}</strong> - {selectedLead.policyType}</Alert>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.values.quoteTypes.type')}</InputLabel>
                <Select value={quoteData.quoteType} label={t('leads.details.values.quoteTypes.type')} onChange={(e) => setQuoteData({ ...quoteData, quoteType: e.target.value })}>
                  <MenuItem value="standard">{t('leads.details.values.quoteTypes.standard')}</MenuItem>
                  <MenuItem value="premium">{t('leads.details.values.quoteTypes.premium')}</MenuItem>
                  <MenuItem value="custom">{t('leads.details.values.quoteTypes.custom')}</MenuItem>
                </Select>
              </FormControl>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth label={t('leads.assigned.dialogs.quote.premium', 'Premium Amount')} type="number" value={quoteData.premium} onChange={(e) => setQuoteData({ ...quoteData, premium: e.target.value })} /></Grid>
                <Grid item xs={6}><TextField fullWidth label={t('leads.assigned.dialogs.quote.coverage', 'Coverage Amount')} type="number" value={quoteData.coverage} onChange={(e) => setQuoteData({ ...quoteData, coverage: e.target.value })} /></Grid>
              </Grid>
              <TextField fullWidth label={t('leads.assigned.dialogs.quote.validTill', 'Valid Until')} type="date" value={quoteData.validTill} onChange={(e) => setQuoteData({ ...quoteData, validTill: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth multiline rows={3} label={t('leads.assigned.dialogs.quote.notes', 'Additional Notes')} value={quoteData.notes} onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })} placeholder={t('leads.assigned.dialogs.quote.notesPlaceholder', 'Enter any additional notes...')} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareQuoteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="warning" startIcon={<ShareIcon />} onClick={handleShareQuote} disabled={!quoteData.premium || !quoteData.coverage}>{t('leads.assigned.dialogs.quote.share')}</Button>
        </DialogActions>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CallIcon color="success" /><Typography variant="h6" fontWeight="600">{t('leads.assigned.dialogs.call.title')}</Typography></Box></DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box><Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.assigned.table.name')}</Typography><Typography variant="body1" fontWeight="600">{selectedCallLead?.firstName} {selectedCallLead?.lastName}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.assigned.filters.policyType')}</Typography><Typography variant="body1">{selectedCallLead?.policyType ? t(`leads.details.values.policyTypes.${getPolicyTypeKey(selectedCallLead?.policyType)}`) : '-'}</Typography></Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}><Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.assigned.filters.status')}</Typography><Box sx={{ mt: 0.5 }}><Chip label={selectedCallLead?.status} size="small" sx={{ backgroundColor: alpha(getStatusColor(selectedCallLead?.status), 0.1), color: getStatusColor(selectedCallLead?.status), fontWeight: 600 }} /></Box></Box>
              <Box sx={{ flex: 1 }}><Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.assigned.filters.priority')}</Typography><Box sx={{ mt: 0.5 }}><Chip label={selectedCallLead?.priority} size="small" sx={{ backgroundColor: alpha(getPriorityColor(selectedCallLead?.priority), 0.1), color: getPriorityColor(selectedCallLead?.priority), fontWeight: 600 }} /></Box></Box>
            </Box>
            <Divider />
            <Box><Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.fields.phone')}</Typography><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}><Typography variant="h6" fontWeight="600">{selectedCallLead?.phone}</Typography><Button variant="contained" size="small" component="a" href={`tel:${selectedCallLead?.phone}`} startIcon={<CallIcon />} sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)` }}>{t('leads.assigned.dialogs.call.dial')}</Button></Box></Box>
            <Box><Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.fields.email')}</Typography><Typography variant="body1">{selectedCallLead?.email}</Typography></Box>
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setCallDialogOpen(false)}>{t('common.close')}</Button></DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignedLeads;