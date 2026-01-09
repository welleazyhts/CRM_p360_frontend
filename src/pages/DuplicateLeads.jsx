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
  IconButton,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Merge as MergeIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  FileCopy as DuplicateIcon,
  CheckCircle as ResolveIcon,
  Info as InfoIcon,
  Radar as RadarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DuplicateLeads = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getDuplicateTypeKey = (type) => {
    if (!type) return '';
    const lowerType = type.toLowerCase().trim();
    const map = {
      'all': 'all',
      'phone number': 'phoneNumber',
      'email': 'email',
      'both (phone & email)': 'both'
    };
    return map[lowerType] || type;
  };

  const getStatusKey = (status) => {
    if (!status) return '';
    const lowerStatus = status.toLowerCase().trim();
    const map = {
      'all': 'all',
      'pending': 'pending',
      'resolved': 'resolved',
      'ignored': 'ignored'
    };
    return map[lowerStatus] || status;
  };

  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortField, setSortField] = useState('detectedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, groupId: null, action: '' });

  useEffect(() => {
    // Mock data for Duplicate Leads - Replace with API call
    setDuplicateGroups([
      {
        id: 1,
        duplicateType: 'Phone Number',
        matchField: '+91-98765-43210',
        count: 3,
        detectedDate: '2025-11-14',
        uploadBatch: 'Batch_2025_11_14_001',
        leads: [
          {
            id: 1001,
            firstName: 'Rajesh',
            lastName: 'Kumar',
            phone: '+91-98765-43210',
            email: 'rajesh.kumar@email.com',
            policyType: 'Health Insurance',
            premium: 35000,
            uploadDate: '2025-11-14',
            source: 'Campaign Upload',
            status: 'New Lead'
          },
          {
            id: 1002,
            firstName: 'Rajesh',
            lastName: 'Kumar',
            phone: '+91-98765-43210',
            email: 'raj.kumar@gmail.com',
            policyType: 'Health Insurance',
            premium: 35000,
            uploadDate: '2025-11-14',
            source: 'Campaign Upload',
            status: 'New Lead'
          },
          {
            id: 1003,
            firstName: 'R',
            lastName: 'Kumar',
            phone: '+91-98765-43210',
            email: 'rajeshk@yahoo.com',
            policyType: 'Motor Insurance',
            premium: 15000,
            uploadDate: '2025-11-12',
            source: 'Website',
            status: 'Follow Up'
          }
        ],
        status: 'Pending'
      },
      {
        id: 2,
        duplicateType: 'Email',
        matchField: 'priya.sharma@email.com',
        count: 2,
        detectedDate: '2025-11-13',
        uploadBatch: 'Batch_2025_11_13_002',
        leads: [
          {
            id: 2001,
            firstName: 'Priya',
            lastName: 'Sharma',
            phone: '+91-99876-54321',
            email: 'priya.sharma@email.com',
            policyType: 'Life Insurance',
            premium: 50000,
            uploadDate: '2025-11-13',
            source: 'Campaign Upload',
            status: 'New Lead'
          },
          {
            id: 2002,
            firstName: 'Priya',
            lastName: 'Sharma',
            phone: '+91-98888-88888',
            email: 'priya.sharma@email.com',
            policyType: 'Life Insurance',
            premium: 50000,
            uploadDate: '2025-11-13',
            source: 'Campaign Upload',
            status: 'New Lead'
          }
        ],
        status: 'Pending'
      },
      {
        id: 3,
        duplicateType: 'Both (Phone & Email)',
        matchField: '+91-97654-32109 / amit.patel@email.com',
        count: 2,
        detectedDate: '2025-11-10',
        uploadBatch: 'Batch_2025_11_10_003',
        leads: [
          {
            id: 3001,
            firstName: 'Amit',
            lastName: 'Patel',
            phone: '+91-97654-32109',
            email: 'amit.patel@email.com',
            policyType: 'Motor Insurance',
            premium: 22000,
            uploadDate: '2025-11-10',
            source: 'Referral',
            status: 'Contacted'
          },
          {
            id: 3002,
            firstName: 'Amit',
            lastName: 'Patel',
            phone: '+91-97654-32109',
            email: 'amit.patel@email.com',
            policyType: 'Motor Insurance',
            premium: 22000,
            uploadDate: '2025-11-10',
            source: 'Campaign Upload',
            status: 'New Lead'
          }
        ],
        status: 'Resolved'
      }
    ]);
  }, []);

  const duplicateTypeOptions = ['All', 'Phone Number', 'Email', 'Both (Phone & Email)'];
  const statusOptions = ['All', 'Pending', 'Resolved', 'Ignored'];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleCloseDialog = () => {
    setSelectedGroup(null);
  };

  const handleMergeLeads = (groupId) => {
    alert(t('leads.duplicate.messages.mergeAlert', { groupId }));
    // TODO: Implement merge logic
  };

  const handleDeleteDuplicate = (groupId, leadId) => {
    alert(t('leads.duplicate.messages.deleteAlert', { groupId, leadId }));
    // TODO: Implement delete logic
  };

  const handleMarkAsResolved = (groupId) => {
    setDuplicateGroups(duplicateGroups.map(group =>
      group.id === groupId ? { ...group, status: 'Resolved' } : group
    ));
    setSelectedGroup(null);
  };

  const handleIgnore = (groupId) => {
    setDuplicateGroups(duplicateGroups.map(group =>
      group.id === groupId ? { ...group, status: 'Ignored' } : group
    ));
    setSelectedGroup(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': theme.palette.warning.main,
      'Resolved': theme.palette.success.main,
      'Ignored': theme.palette.grey[500]
    };
    return colors[status] || theme.palette.grey[500];
  };

  const getDuplicateTypeColor = (type) => {
    const colors = {
      'Phone Number': theme.palette.info.main,
      'Email': theme.palette.primary.main,
      'Both (Phone & Email)': theme.palette.error.main
    };
    return colors[type] || theme.palette.grey[500];
  };

  const filteredGroups = duplicateGroups.filter(group => {
    const matchesSearch =
      group.matchField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.uploadBatch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || group.duplicateType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">
            {t('leads.duplicate.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('leads.duplicate.subtitle')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ mr: 1 }}
          >
            {t('leads.duplicate.exportReport')}
          </Button>
          <Button
            variant="contained"
            startIcon={<RadarIcon />}
            onClick={() => {
              // TODO: Implement scan logic
              console.log('Scan Now clicked');
            }}
          >
            {t('leads.duplicate.scanNow')}
          </Button>
        </Grid>
      </Grid>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.duplicate.stats.totalGroups')}</Typography>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {duplicateGroups.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.duplicate.stats.duplicateRecords')}</Typography>
              <Typography variant="h4" fontWeight="600" color="error.main">
                {duplicateGroups.reduce((sum, group) => sum + group.count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.duplicate.stats.pendingResolution')}</Typography>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {duplicateGroups.filter(g => g.status === 'Pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.05)} 100%)` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.duplicate.stats.resolved')}</Typography>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {duplicateGroups.filter(g => g.status === 'Resolved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Info Alert */}
      <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.2)}` }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <InfoIcon sx={{ color: 'info.main', mt: 0.5 }} />
            <Box>
              <Typography variant="body2" color="info.dark">
                <strong>{t('leads.duplicate.infoTitle')}</strong> {t('leads.duplicate.infoNote')}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder={t('leads.duplicate.searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label={t('leads.duplicate.duplicateType')}
                value={filterType}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <FilterIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                {duplicateTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {t(`leads.duplicate.types.${getDuplicateTypeKey(option)}`)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label={t('leads.duplicate.sortBy')}
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                InputProps={{
                  startAdornment: <SortIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                <MenuItem value="detectedDate">{t('leads.duplicate.sortOptions.detectedDate')}</MenuItem>
                <MenuItem value="count">{t('leads.duplicate.sortOptions.count')}</MenuItem>
                <MenuItem value="status">{t('leads.duplicate.sortOptions.status')}</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Duplicate Groups Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell><strong>{t('leads.duplicate.table.duplicateType')}</strong></TableCell>
                <TableCell><strong>{t('leads.duplicate.table.matchField')}</strong></TableCell>
                <TableCell><strong>{t('leads.duplicate.table.count')}</strong></TableCell>
                <TableCell><strong>{t('leads.duplicate.table.uploadBatch')}</strong></TableCell>
                <TableCell><strong>{t('leads.duplicate.table.detectedDate')}</strong></TableCell>
                <TableCell><strong>{t('leads.duplicate.table.status')}</strong></TableCell>
                <TableCell align="center"><strong>{t('leads.duplicate.table.actions')}</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <DuplicateIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      {t('leads.duplicate.table.noDuplicates')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => (
                  <TableRow
                    key={group.id}
                    sx={{
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={t(`leads.duplicate.types.${getDuplicateTypeKey(group.duplicateType)}`)}
                        size="small"
                        sx={{
                          bgcolor: alpha(getDuplicateTypeColor(group.duplicateType), 0.1),
                          color: getDuplicateTypeColor(group.duplicateType),
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {group.matchField}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${group.count} ${t('leads.duplicate.table.leads')}`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {group.uploadBatch}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(group.detectedDate).toLocaleDateString('en-IN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t(`leads.duplicate.statuses.${getStatusKey(group.status)}`)}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(group.status), 0.1),
                          color: getStatusColor(group.status),
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title={t('leads.duplicate.actions.viewDetails')}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewGroup(group)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {group.status === 'Pending' && (
                          <>
                            <Tooltip title={t('leads.duplicate.actions.mergeLeads')}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleMergeLeads(group.id)}
                              >
                                <MergeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('leads.duplicate.actions.markAsResolved')}>
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => handleMarkAsResolved(group.id)}
                              >
                                <ResolveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Duplicate Group Detail Dialog */}
      <Dialog
        open={Boolean(selectedGroup)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedGroup && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={2} alignItems="center">
                <DuplicateIcon color="primary" />
                <Box>
                  <Typography variant="h6">{t('leads.duplicate.dialog.title')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedGroup.duplicateType} - {selectedGroup.matchField}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                {t('leads.duplicate.dialog.found', { count: selectedGroup.count })}
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableCell><strong>{t('leads.duplicate.dialog.table.leadId')}</strong></TableCell>
                      <TableCell><strong>{t('leads.duplicate.dialog.table.name')}</strong></TableCell>
                      <TableCell><strong>{t('leads.duplicate.dialog.table.phone')}</strong></TableCell>
                      <TableCell><strong>{t('leads.duplicate.dialog.table.email')}</strong></TableCell>
                      <TableCell><strong>{t('leads.duplicate.dialog.table.policyType')}</strong></TableCell>
                      <TableCell><strong>{t('leads.duplicate.dialog.table.status')}</strong></TableCell>
                      <TableCell><strong>{t('leads.duplicate.dialog.table.uploadDate')}</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedGroup.leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{lead.id}</TableCell>
                        <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.policyType}</TableCell>
                        <TableCell>
                          <Chip label={lead.status} size="small" />
                        </TableCell>
                        <TableCell>
                          {new Date(lead.uploadDate).toLocaleDateString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>{t('leads.duplicate.dialog.buttons.cancel')}</Button>
              <Button
                onClick={() => handleIgnore(selectedGroup.id)}
                color="warning"
              >
                {t('leads.duplicate.dialog.buttons.ignore')}
              </Button>
              <Button
                onClick={() => handleMergeLeads(selectedGroup.id)}
                variant="contained"
                startIcon={<MergeIcon />}
              >
                {t('leads.duplicate.dialog.buttons.mergeLeads')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DuplicateLeads;
