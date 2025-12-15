import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Grid,
  Divider
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Search as SearchIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Payment as PaymentIcon,
  Gavel as LegalIcon,
  Handshake as SettlementIcon,
  Phone as ContactIcon,
  Update as UpdateIcon,
  CloudUpload as PortfolioIcon,
  EventNote as PTPIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';

const ActivityLogViewer = ({ open, onClose, entityId = null, entityName = null }) => {
  const { logs, getFilteredLogs, getEntityLogs } = useActivityLog();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get filtered logs
  const displayLogs = useMemo(() => {
    let filteredLogs = entityId ? getEntityLogs(entityId) : logs;

    // Apply additional filters
    if (categoryFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.action.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term) ||
        log.entityName?.toLowerCase().includes(term) ||
        log.entityId?.toLowerCase().includes(term)
      );
    }

    return filteredLogs;
  }, [logs, entityId, getEntityLogs, categoryFilter, statusFilter, searchTerm]);

  const getCategoryIcon = (category) => {
    const icons = {
      payment: <PaymentIcon />,
      ptp: <PTPIcon />,
      settlement: <SettlementIcon />,
      legal: <LegalIcon />,
      contact: <ContactIcon />,
      update: <UpdateIcon />,
      portfolio: <PortfolioIcon />
    };
    return icons[category] || <UpdateIcon />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      payment: 'success',
      ptp: 'info',
      settlement: 'warning',
      legal: 'error',
      contact: 'primary',
      update: 'default',
      portfolio: 'secondary'
    };
    return colors[category] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      success: <SuccessIcon fontSize="small" />,
      failed: <ErrorIcon fontSize="small" />,
      pending: <PendingIcon fontSize="small" />
    };
    return icons[status] || <SuccessIcon fontSize="small" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'success',
      failed: 'error',
      pending: 'warning'
    };
    return colors[status] || 'default';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Activity Logs {entityName && `- ${entityName}`}
          </Typography>
          <Button startIcon={<ExportIcon />} size="small" variant="outlined">
            Export
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search logs..."
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
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="payment">Payment</MenuItem>
                <MenuItem value="ptp">PTP</MenuItem>
                <MenuItem value="settlement">Settlement</MenuItem>
                <MenuItem value="legal">Legal</MenuItem>
                <MenuItem value="contact">Contact</MenuItem>
                <MenuItem value="update">Update</MenuItem>
                <MenuItem value="portfolio">Portfolio</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Logs Timeline */}
        {displayLogs.length > 0 ? (
          <Timeline position="right">
            {displayLogs.map((log, index) => (
              <TimelineItem key={log.id}>
                <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3, paddingLeft: 0 }}>
                  <Typography variant="caption" display="block">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={getCategoryColor(log.category)}>
                    {getCategoryIcon(log.category)}
                  </TimelineDot>
                  {index < displayLogs.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {log.action}
                      </Typography>
                      <Chip
                        label={log.status}
                        size="small"
                        color={getStatusColor(log.status)}
                        icon={getStatusIcon(log.status)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {log.details}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                      {log.entityId && (
                        <Chip label={log.entityId} size="small" variant="outlined" />
                      )}
                      {log.entityName && (
                        <Chip label={log.entityName} size="small" variant="outlined" />
                      )}
                      <Chip
                        label={log.user}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <Chip
                        label={log.category}
                        size="small"
                        color={getCategoryColor(log.category)}
                      />
                    </Box>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No activity logs found
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityLogViewer;
