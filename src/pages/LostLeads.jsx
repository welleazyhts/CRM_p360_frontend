import React, { useState, useEffect } from 'react';
import leadService from '../services/leadService';
import { useTranslation } from 'react-i18next';
import {
  Box, Card, CardContent, Typography, Button, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Stack,
  TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, useTheme, alpha, Divider, Snackbar, Alert, CircularProgress,
  List, ListItem, ListItemIcon, ListItemText, Avatar
} from '@mui/material';
import {
  Visibility as VisibilityIcon, History as HistoryIcon, FilterList as FilterIcon,
  Search as SearchIcon, Sort as SortIcon, PictureAsPdf as PdfIcon,
  Download as DownloadIcon, Call as CallIcon, Restore as RestoreIcon,
  CheckCircle as CheckCircleIcon, Phone as PhoneIcon, Note as NoteIcon,
  Email as EmailIcon, Upload as UploadIcon, Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LostLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getReasonKey = (reason) => {
    if (!reason) return '';
    const lowerReason = reason.toLowerCase().trim();
    const map = {
      'high premium': 'highPremium',
      'not interested': 'notInterested',
      'bought from competitor': 'boughtFromCompetitor',
      'invalid contact': 'invalidContact',
      'budget constraints': 'budgetConstraints',
      'coverage not sufficient': 'coverageNotSufficient',
      'already insured': 'alreadyInsured',
      'switched provider': 'switchedProvider'
    };
    return map[lowerReason] || reason;
  };

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
  const [filterReason, setFilterReason] = useState('All');
  const [sortField, setSortField] = useState('closedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallLead, setSelectedCallLead] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedHistoryLead, setSelectedHistoryLead] = useState(null);
  const [leadHistory, setLeadHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const lostReasonOptions = [
    'High Premium', 'Not Interested', 'Bought from Competitor', 'Invalid Contact',
    'Budget Constraints', 'Coverage Not Sufficient', 'Already Insured', 'Switched Provider'
  ];

  const dateRangeOptions = [
    { value: 'all', label: t('leads.lost.dateRanges.allTime', 'All Time') },
    { value: 'last7', label: t('leads.lost.dateRanges.last7Days', 'Last 7 Days') },
    { value: 'last30', label: t('leads.lost.dateRanges.last30Days', 'Last 30 Days') },
    { value: 'last90', label: t('leads.lost.dateRanges.last90Days', 'Last 90 Days') }
  ];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getLostLeads();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error('Error fetching lost leads:', error);
      }
    };
    fetchLeads();
  }, []);

  // Apply filters whenever search term, filter reason, or date range changes
  useEffect(() => {
    let filtered = [...leads];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.id.toString().includes(searchTerm)
      );
    }

    // Apply reason filter
    if (filterReason !== 'All') {
      filtered = filtered.filter(lead => lead.lostReason === filterReason);
    }

    // Apply date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const dateThreshold = new Date();

      switch (selectedDateRange) {
        case 'last7':
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case 'last30':
          dateThreshold.setDate(now.getDate() - 30);
          break;
        case 'last90':
          dateThreshold.setDate(now.getDate() - 90);
          break;
        default:
          break;
      }

      filtered = filtered.filter(lead => {
        const closedDate = new Date(lead.closedDate);
        return closedDate >= dateThreshold;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'closedDate') {
        aValue = new Date(a.closedDate);
        bValue = new Date(b.closedDate);
      } else if (sortField === 'quotedPremium') {
        aValue = a.quotedPremium || 0;
        bValue = b.quotedPremium || 0;
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeads(filtered);
  }, [searchTerm, filterReason, selectedDateRange, sortField, sortOrder, leads]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterReason(event.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const filters = {
        reason: filterReason !== 'All' ? filterReason : null,
        dateRange: selectedDateRange,
        searchTerm: searchTerm
      };

      const blob = await leadService.exportLostLeads(filters, 'csv');

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lost-leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSnackbar({ open: true, message: t('leads.lost.messages.exportSuccess', 'Data exported successfully'), severity: 'success' });
      } else {
        // Fallback: client-side CSV generation
        const csvContent = generateCSV(filteredLeads);
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lost-leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSnackbar({ open: true, message: t('leads.lost.messages.exportSuccess'), severity: 'success' });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setSnackbar({ open: true, message: t('leads.lost.messages.exportFailed', 'Failed to export data'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const filters = {
        reason: filterReason !== 'All' ? filterReason : null,
        dateRange: selectedDateRange,
        searchTerm: searchTerm
      };

      const blob = await leadService.generateLostLeadsReport(filters);

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lost-leads-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSnackbar({ open: true, message: t('leads.lost.messages.reportSuccess', 'Report generated successfully'), severity: 'success' });
      } else {
        setSnackbar({ open: true, message: t('leads.lost.messages.reportNotAvailable'), severity: 'warning' });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setSnackbar({ open: true, message: t('leads.lost.messages.reportFailed'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async (lead) => {
    if (window.confirm(t('leads.lost.dialogs.reopen.confirm', 'Are you sure you want to reopen lead {{name}}?', { name: `${lead.firstName} ${lead.lastName}` }))) {
      try {
        setLoading(true);
        const result = await leadService.reopenLead(lead.id);

        if (result.success) {
          // Remove from current list
          setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));
          setSnackbar({ open: true, message: t('leads.lost.messages.reopenSuccess'), severity: 'success' });
        } else {
          setSnackbar({ open: true, message: t('leads.lost.messages.reopenFailed'), severity: 'error' });
        }
      } catch (error) {
        console.error('Error reopening lead:', error);
        setSnackbar({ open: true, message: t('leads.lost.messages.reopenFailed'), severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewHistory = async (lead) => {
    try {
      setLoading(true);
      setSelectedHistoryLead(lead);
      const history = await leadService.getLeadHistory(lead.id);
      setLeadHistory(history);
      setHistoryDialogOpen(true);
    } catch (error) {
      console.error('Error fetching lead history:', error);
      setSnackbar({ open: true, message: t('leads.lost.messages.historyFailed'), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data) => {
    const headers = ['Lead ID', 'Name', 'Phone', 'Email', 'Lost Reason', 'Policy Type', 'Quoted Premium', 'Closed Date', 'Closed By', 'Source', 'Remarks'];
    const rows = data.map(lead => [
      lead.id,
      `${lead.firstName} ${lead.lastName}`,
      lead.phone,
      lead.email,
      lead.lostReason,
      lead.policyType,
      lead.quotedPremium || '',
      lead.closedDate,
      lead.closedBy,
      lead.source || '',
      lead.remarks || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const getHistoryIcon = (iconName) => {
    const icons = {
      CheckCircle: <CheckCircleIcon />,
      Phone: <PhoneIcon />,
      Note: <NoteIcon />,
      Email: <EmailIcon />,
      Upload: <UploadIcon />,
      Add: <AddIcon />
    };
    return icons[iconName] || <NoteIcon />;
  };

  const getHistoryColor = (type) => {
    const colors = {
      status_change: theme.palette.success.main,
      call: theme.palette.info.main,
      note: theme.palette.warning.main,
      email: theme.palette.primary.main,
      document: theme.palette.secondary.main,
      created: theme.palette.grey[500]
    };
    return colors[type] || theme.palette.grey[500];
  };

  const getReasonColor = (reason) => {
    const colors = {
      'High Premium': theme.palette.warning.main,
      'Not Interested': theme.palette.error.main,
      'Bought from Competitor': theme.palette.error.light,
      'Invalid Contact': theme.palette.grey[500],
      'Budget Constraints': theme.palette.warning.light,
      'Coverage Not Sufficient': theme.palette.info.main,
      'Already Insured': theme.palette.grey[600],
      'Switched Provider': theme.palette.error.dark
    };
    return colors[reason] || theme.palette.grey[500];
  };

  // Calculate stats from filtered leads
  const totalLostLeads = filteredLeads.length;
  const lostRevenue = filteredLeads.reduce((sum, lead) => sum + (lead.quotedPremium || 0), 0);
  const avgPremium = totalLostLeads > 0 ? Math.round(lostRevenue / totalLostLeads) : 0;
  const thisMonthCount = filteredLeads.filter(l => new Date(l.closedDate).getMonth() === new Date().getMonth()).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">
            {t('leads.lost.title', 'Lost Leads')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('leads.lost.subtitle', 'Manage and analyze lost opportunities')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
            onClick={handleExportData}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            {t('leads.lost.exportData', 'Export Data')}
          </Button>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <PdfIcon />}
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {t('leads.lost.generateReport', 'Generate Report')}
          </Button>
        </Grid>
      </Grid>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.lost.stats.totalLostLeads', 'Total Lost Leads')}</Typography>
              <Typography variant="h4" fontWeight="600" color="error.main">
                {totalLostLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.lost.stats.lostRevenue', 'Lost Revenue')}</Typography>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                ₹{lostRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.lost.stats.averagePremium', 'Average Premium')}</Typography>
              <Typography variant="h4" fontWeight="600" color="info.main">
                ₹{avgPremium.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.lost.stats.thisMonth', 'This Month')}</Typography>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {thisMonthCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                placeholder={t('leads.lost.searchPlaceholder', 'Search lost leads...')}
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label={t('leads.lost.filterByReason', 'Filter by Reason')}
                value={filterReason}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <FilterIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                <MenuItem value="All">{t('leads.lost.allReasons', 'All Reasons')}</MenuItem>
                {lostReasonOptions.map(reason => (
                  <MenuItem key={reason} value={reason}>{t(`leads.lost.reasons.${getReasonKey(reason)}`, reason)}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label={t('leads.lost.dateRange')}
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                {dateRangeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={() => handleSort('closedDate')}
                fullWidth
              >
                {t('leads.lost.sortByDate', 'Sort By Date')} {sortField === 'closedDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </Button>
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
                <TableCell>{t('leads.lost.table.leadDetails', 'Lead Details')}</TableCell>
                <TableCell>{t('leads.lost.table.contact', 'Contact Details')}</TableCell>
                <TableCell>{t('leads.lost.table.lostReason', 'Lost Reason')}</TableCell>
                <TableCell>{t('leads.lost.table.policyType', 'Policy Type')}</TableCell>
                <TableCell>{t('leads.lost.table.quotedPremium', 'Quoted Premium')}</TableCell>
                <TableCell>{t('leads.lost.table.closedDate', 'Closed Date')}</TableCell>
                <TableCell>{t('leads.lost.table.closedBy', 'Closed By')}</TableCell>
                <TableCell align="center">{t('leads.lost.table.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {lead.firstName} {lead.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: LD{new Date().getFullYear()}{String(lead.id).padStart(6, '0')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{lead.phone}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lead.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`leads.lost.reasons.${getReasonKey(lead.lostReason)}`, lead.lostReason)}
                      size="small"
                      sx={{
                        backgroundColor: alpha(getReasonColor(lead.lostReason), 0.1),
                        color: getReasonColor(lead.lostReason),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{lead.policyType ? t(`leads.details.values.policyTypes.${getPolicyTypeKey(lead.policyType)}`, lead.policyType) : '-'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('leads.lost.table.source', 'Source')}: {lead.source}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="warning.main">
                      ₹{lead.quotedPremium?.toLocaleString() || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>{lead.closedDate}</TableCell>
                  <TableCell>{lead.closedBy}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title={t('leads.lost.actions.reopenLead', 'Reopen Lead')}>
                        <IconButton
                          size="small"
                          onClick={() => handleReopen(lead)}
                          sx={{
                            color: theme.palette.success.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.success.main, 0.1)
                            }
                          }}
                        >
                          <RestoreIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('leads.lost.actions.callLead', 'Call Lead')}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCallLead(lead);
                            setCallDialogOpen(true);
                          }}
                          sx={{
                            color: theme.palette.info.main,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.1)
                            }
                          }}
                        >
                          <CallIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('leads.lost.actions.viewDetails', 'View Details')}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/lead-management/${lead.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('leads.lost.actions.viewHistory', 'View History')}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewHistory(lead)}
                          sx={{ color: theme.palette.warning.main }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Call Dialog */}
      <Dialog
        open={callDialogOpen}
        onClose={() => setCallDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="info" />
            <Typography variant="h6" fontWeight="600">
              {t('leads.lost.dialogs.call.title', 'Call Details')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                {t('leads.lost.dialogs.call.leadId', 'Lead ID')}
              </Typography>
              <Typography variant="body1" fontWeight="600" color="primary">
                LD{new Date().getFullYear()}{String(selectedCallLead?.id || 0).padStart(6, '0')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                {t('leads.lost.dialogs.call.leadName', 'Lead Name')}
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {selectedCallLead?.firstName} {selectedCallLead?.lastName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                {t('leads.lost.dialogs.call.lostReason', 'Lost Reason')}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={selectedCallLead?.lostReason ? t(`leads.lost.reasons.${getReasonKey(selectedCallLead.lostReason)}`, selectedCallLead.lostReason) : '-'}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getReasonColor(selectedCallLead?.lostReason), 0.1),
                    color: getReasonColor(selectedCallLead?.lostReason),
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                {t('leads.lost.dialogs.call.policyDetails', 'Policy Details')}
              </Typography>
              <Typography variant="body1">{selectedCallLead?.policyType ? t(`leads.details.values.policyTypes.${getPolicyTypeKey(selectedCallLead.policyType)}`, selectedCallLead.policyType) : '-'}</Typography>
              <Typography variant="body2" color="warning.main" fontWeight="600">
                {t('leads.lost.dialogs.call.quotedPremium', 'Quoted Premium')}: ₹{selectedCallLead?.quotedPremium?.toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                {t('leads.lost.dialogs.call.closureDetails', 'Closure Details')}
              </Typography>
              <Typography variant="body2">
                {t('leads.lost.dialogs.call.closedBy')}: {selectedCallLead?.closedBy}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('leads.lost.dialogs.call.closedOn')}: {selectedCallLead?.closedDate}
              </Typography>
              {selectedCallLead?.remarks && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  "{selectedCallLead?.remarks}"
                </Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                {t('leads.lost.dialogs.call.phoneNumber')}
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1
              }}>
                <Typography variant="h6" fontWeight="600">
                  {selectedCallLead?.phone}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  component="a"
                  href={`tel:${selectedCallLead?.phone}`}
                  startIcon={<CallIcon />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`
                    }
                  }}
                >
                  {t('leads.lost.dialogs.call.dial', 'Dial')}
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                {t('leads.lost.dialogs.call.email')}
              </Typography>
              <Typography variant="body1">{selectedCallLead?.email}</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialogOpen(false)}>{t('common.close')}</Button>
          <Button variant="contained" color="success" onClick={() => handleReopen(selectedCallLead)}>
            {t('leads.lost.dialogs.call.reopenLead', 'Reopen Lead')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="warning" />
            <Typography variant="h6" fontWeight="600">
              {t('leads.lost.dialogs.history.title', 'Lead History')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Lead Info */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">
                {t('leads.lost.dialogs.history.leadDetails')}
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {selectedHistoryLead?.firstName} {selectedHistoryLead?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {selectedHistoryLead?.id} | {selectedHistoryLead?.phone}
              </Typography>
            </Box>

            <Divider />

            {/* Activity List */}
            <Box>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                {t('leads.lost.dialogs.history.activityTimeline')}
              </Typography>
              <List sx={{ width: '100%' }}>
                {leadHistory.map((activity) => (
                  <ListItem
                    key={activity.id}
                    alignItems="flex-start"
                    sx={{
                      borderLeft: `3px solid ${getHistoryColor(activity.type)}`,
                      mb: 1,
                      bgcolor: alpha(getHistoryColor(activity.type), 0.05),
                      borderRadius: 1
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getHistoryColor(activity.type), 0.1),
                          color: getHistoryColor(activity.type),
                          width: 40,
                          height: 40
                        }}
                      >
                        {getHistoryIcon(activity.icon)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="600">
                            {activity.type.replace('_', ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t('leads.lost.dialogs.history.by')}: {activity.user}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LostLeads;