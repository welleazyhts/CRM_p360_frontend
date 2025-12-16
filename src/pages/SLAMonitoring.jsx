import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Button,
  TextField,
  MenuItem,
  useTheme,
  alpha,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Assessment as AssessmentIcon,
  Phone as PhoneIcon,
  Replay as RetryIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';
import { useSLA } from '../context/SLAContext';
import { getSLAStatus, calculateTimeRemaining } from '../services/slaService';
import { useNavigate } from 'react-router-dom';

const SLAMonitoring = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    slaTrackings,
    metrics,
    violations,
    approaching,
    getComplianceByEntityType,
    exportSLAData,
    error // Destructure error from context
  } = useSLA();

  const [currentTab, setCurrentTab] = useState(0);
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredTrackings, setFilteredTrackings] = useState([]);

  // Retry attempt tracking states
  const [retryRuleEnabled, setRetryRuleEnabled] = useState(true);
  const maxAttempts = 5; // Fixed value for 5 Attempts in 5 Days Rule
  const daysLimit = 5; // Fixed value for 5 Attempts in 5 Days Rule
  const [retryTab, setRetryTab] = useState(0);
  const [retryLeads, setRetryLeads] = useState([]);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [retryInterval, setRetryInterval] = useState(24); // hours

  // Initialize retry leads data
  useEffect(() => {
    const mockRetryLeads = [
      {
        id: 1,
        customerName: 'Rajesh Sharma',
        phone: '+91-9876543210',
        attemptCount: 3,
        lastAttemptDate: '2024-01-20',
        status: 'Retry in Progress',
        firstAttemptDate: '2024-01-18',
        nextRetryDate: '2024-01-21',
        autoRetryScheduled: true
      },
      {
        id: 2,
        customerName: 'Priya Verma',
        phone: '+91-9876543211',
        attemptCount: 5,
        lastAttemptDate: '2024-01-19',
        status: 'Unreachable',
        firstAttemptDate: '2024-01-15',
        nextRetryDate: null,
        autoRetryScheduled: false
      },
      {
        id: 3,
        customerName: 'Vikram Singh',
        phone: '+91-9876543212',
        attemptCount: 1,
        lastAttemptDate: '2024-01-22',
        status: 'Active Leads',
        firstAttemptDate: '2024-01-22',
        nextRetryDate: '2024-01-23',
        autoRetryScheduled: true
      },
      {
        id: 4,
        customerName: 'Anjali Desai',
        phone: '+91-9876543213',
        attemptCount: 4,
        lastAttemptDate: '2024-01-21',
        status: 'Retry in Progress',
        firstAttemptDate: '2024-01-18',
        nextRetryDate: '2024-01-22',
        autoRetryScheduled: true
      },
      {
        id: 5,
        customerName: 'Arjun Reddy',
        phone: '+91-9876543214',
        attemptCount: 2,
        lastAttemptDate: '2024-01-21',
        status: 'Active Leads',
        firstAttemptDate: '2024-01-20',
        nextRetryDate: '2024-01-22',
        autoRetryScheduled: true
      }
    ];
    setRetryLeads(mockRetryLeads);
  }, []);

  // Update filtered trackings when filters change
  useEffect(() => {
    let filtered = slaTrackings;

    if (filterEntity !== 'all') {
      filtered = filtered.filter(t => t.entityType === filterEntity);
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(t => t.status === 'active');
      } else if (filterStatus === 'breached') {
        filtered = filtered.filter(t => t.breached);
      } else if (filterStatus === 'met') {
        filtered = filtered.filter(t => t.status === 'met');
      } else if (filterStatus === 'at-risk') {
        filtered = filtered.filter(t => {
          if (!t.deadline || t.status !== 'active') return false;
          const status = getSLAStatus(t.deadline);
          return ['critical', 'warning'].includes(status.status);
        });
      }
    }

    setFilteredTrackings(filtered);
  }, [slaTrackings, filterEntity, filterStatus]);

  const handleExport = () => {
    const data = exportSLAData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sla-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Auto-retry logic
  useEffect(() => {
    if (!autoRetryEnabled || !retryRuleEnabled) return;

    const checkAndExecuteRetries = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      setRetryLeads(prevLeads =>
        prevLeads.map(lead => {
          // Check if lead is due for auto-retry
          if (lead.nextRetryDate === today &&
            lead.attemptCount < maxAttempts &&
            lead.autoRetryScheduled) {

            // Check if within 5-day window
            const daysSinceFirst = Math.floor(
              (now - new Date(lead.firstAttemptDate)) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceFirst <= daysLimit) {
              const newAttemptCount = lead.attemptCount + 1;
              const newStatus = newAttemptCount >= maxAttempts ? 'Unreachable' :
                newAttemptCount >= 3 ? 'Retry in Progress' : 'Active Leads';

              return {
                ...lead,
                attemptCount: newAttemptCount,
                lastAttemptDate: today,
                status: newStatus,
                nextRetryDate: newAttemptCount >= maxAttempts ? null :
                  new Date(Date.now() + retryInterval * 60 * 60 * 1000).toISOString().split('T')[0],
                autoRetryScheduled: newAttemptCount < maxAttempts
              };
            } else {
              // Exceeded 5-day window, mark as unreachable
              return {
                ...lead,
                status: 'Unreachable',
                nextRetryDate: null,
                autoRetryScheduled: false
              };
            }
          }
          return lead;
        })
      );
    };

    // Check every minute for demo purposes (in production, use longer intervals)
    const interval = setInterval(checkAndExecuteRetries, 60000);

    // Initial check
    checkAndExecuteRetries();

    return () => clearInterval(interval);
  }, [autoRetryEnabled, retryRuleEnabled, maxAttempts, daysLimit, retryInterval]);

  // Retry attempt functions
  const handleSaveRule = () => {
    const ruleConfig = {
      enabled: retryRuleEnabled,
      autoRetryEnabled,
      retryInterval
    };
    localStorage.setItem('retryRule', JSON.stringify(ruleConfig));
    alert('Retry rule saved successfully!');
  };

  const handleRetryNow = (leadId) => {
    setRetryLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId && lead.attemptCount < maxAttempts) {
          const newAttemptCount = lead.attemptCount + 1;
          const newStatus = newAttemptCount >= maxAttempts ? 'Unreachable' :
            newAttemptCount >= 3 ? 'Retry in Progress' : 'Active Leads';
          return {
            ...lead,
            attemptCount: newAttemptCount,
            lastAttemptDate: new Date().toISOString().split('T')[0],
            status: newStatus,
            nextRetryDate: newAttemptCount >= maxAttempts ? null :
              new Date(Date.now() + retryInterval * 60 * 60 * 1000).toISOString().split('T')[0],
            autoRetryScheduled: newAttemptCount < maxAttempts
          };
        }
        return lead;
      })
    );
  };

  const getProgressColor = (attemptCount) => {
    if (attemptCount >= maxAttempts) return 'error';
    if (attemptCount >= 3) return 'warning';
    return 'primary';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Leads': return 'success';
      case 'Retry in Progress': return 'warning';
      case 'Unreachable': return 'error';
      default: return 'default';
    }
  };

  const getFilteredRetryLeads = () => {
    switch (retryTab) {
      case 0: return retryLeads.filter(lead => lead.status === 'Active Leads');
      case 1: return retryLeads.filter(lead => lead.status === 'Retry in Progress');
      case 2: return retryLeads.filter(lead => lead.status === 'Unreachable');
      default: return retryLeads;
    }
  };

  // Load saved rule on component mount
  useEffect(() => {
    const savedRule = localStorage.getItem('retryRule');
    if (savedRule) {
      const rule = JSON.parse(savedRule);
      setRetryRuleEnabled(rule.enabled || true);
      setAutoRetryEnabled(rule.autoRetryEnabled !== undefined ? rule.autoRetryEnabled : true);
      setRetryInterval(rule.retryInterval || 24);
    }
  }, []);

  // Get retry statistics
  const getRetryStats = () => {
    const totalLeads = retryLeads.length;
    const activeLeads = retryLeads.filter(l => l.status === 'Active Leads').length;
    const inProgress = retryLeads.filter(l => l.status === 'Retry in Progress').length;
    const unreachable = retryLeads.filter(l => l.status === 'Unreachable').length;
    const autoScheduled = retryLeads.filter(l => l.autoRetryScheduled).length;

    return { totalLeads, activeLeads, inProgress, unreachable, autoScheduled };
  };

  const getStatusChip = (tracking) => {
    if (tracking.status === 'met') {
      return <Chip label="Met" size="small" color="success" icon={<CheckCircleIcon />} />;
    } else if (tracking.breached || tracking.status === 'breached') {
      return <Chip label="Breached" size="small" color="error" icon={<ErrorIcon />} />;
    } else if (tracking.status === 'active' && tracking.deadline) {
      const status = getSLAStatus(tracking.deadline);
      const colors = {
        'on-track': 'success',
        'approaching': 'info',
        'warning': 'warning',
        'critical': 'error',
        'breached': 'error'
      };
      return (
        <Chip
          label={status.label}
          size="small"
          color={colors[status.status]}
          icon={status.status === 'on-track' ? <CheckCircleIcon /> : <WarningIcon />}
        />
      );
    }
    return <Chip label={tracking.status} size="small" />;
  };

  const getTimeRemainingDisplay = (tracking) => {
    if (tracking.status !== 'active' || !tracking.deadline) {
      return tracking.completedAt ? new Date(tracking.completedAt).toLocaleString() : 'N/A';
    }

    const timeRemaining = calculateTimeRemaining(tracking.deadline);
    return (
      <Typography
        variant="body2"
        sx={{
          color: timeRemaining.overdue ? theme.palette.error.main : 'inherit',
          fontWeight: timeRemaining.overdue ? 600 : 400
        }}
      >
        {timeRemaining.formatted}
      </Typography>
    );
  };

  const handleViewEntity = (tracking) => {
    const routes = {
      lead: `/lead-management/${tracking.entityId}`,
      case: `/case-details/${tracking.entityId}`,
      task: `/tasks/${tracking.entityId}`,
      email: `/emails/${tracking.entityId}`,
      claim: `/claims/${tracking.entityId}`
    };
    const route = routes[tracking.entityType];
    if (route) {
      navigate(route);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="600">
            SLA Monitoring Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage SLA compliance across all entities
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExport}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Backend Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<ErrorIcon />}>
          <strong>Check Backend:</strong> {error}
        </Alert>
      )}

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Trackings
                  </Typography>
                  <Typography variant="h4" fontWeight="600">
                    {metrics?.total || 0}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Active: {metrics?.active || 0}
                    </Typography>
                  </Box>
                </Box>
                <TimerIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Compliance Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {metrics?.complianceRate || 0}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
                    <Typography variant="caption" color="success.main">
                      {metrics?.met || 0} met
                    </Typography>
                  </Box>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={metrics?.complianceRate || 0}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    SLA Violations
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="error.main">
                    {violations?.length || 0}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <Typography variant="caption" color="error.main">
                      {metrics?.breachRate || 0}% breach rate
                    </Typography>
                  </Box>
                </Box>
                <ErrorIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    At Risk
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="warning.main">
                    {approaching?.length || 0}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <Typography variant="caption" color="warning.main">
                      Approaching deadline
                    </Typography>
                  </Box>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts for Violations and At-Risk Items */}
      {violations && violations.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <strong>{violations.length} SLA violation(s) detected!</strong> Immediate action required.
        </Alert>
      )}

      {approaching && approaching.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>{approaching.length} SLA(s) approaching deadline.</strong> Review and prioritize these items.
        </Alert>
      )}

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label={`All Trackings (${filteredTrackings.length})`} />
            <Tab label={`Violations (${violations?.length || 0})`} />
            <Tab label={`At Risk (${approaching?.length || 0})`} />
            <Tab label="Compliance by Type" icon={<AssessmentIcon />} iconPosition="end" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Filters */}
          {currentTab === 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                select
                label="Entity Type"
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="lead">Leads</MenuItem>
                <MenuItem value="case">Cases</MenuItem>
                <MenuItem value="task">Tasks</MenuItem>
                <MenuItem value="email">Emails</MenuItem>
                <MenuItem value="claim">Claims</MenuItem>
              </TextField>

              <TextField
                select
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="small"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="at-risk">At Risk</MenuItem>
                <MenuItem value="met">Met</MenuItem>
                <MenuItem value="breached">Breached</MenuItem>
              </TextField>
            </Box>
          )}

          {/* All Trackings Tab */}
          {currentTab === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entity</TableCell>
                    <TableCell>SLA Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Time Remaining</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTrackings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No SLA trackings found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrackings.map((tracking) => (
                      <TableRow key={tracking.id} hover>
                        <TableCell>
                          <Chip
                            label={tracking.entityType}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {tracking.slaType.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {tracking.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tracking.priority}
                            size="small"
                            color={
                              tracking.priority === 'urgent'
                                ? 'error'
                                : tracking.priority === 'high'
                                  ? 'warning'
                                  : 'default'
                            }
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>{getStatusChip(tracking)}</TableCell>
                        <TableCell>{getTimeRemainingDisplay(tracking)}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {tracking.deadline ? new Date(tracking.deadline).toLocaleString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Entity">
                            <IconButton size="small" onClick={() => handleViewEntity(tracking)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Violations Tab */}
          {currentTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entity</TableCell>
                    <TableCell>SLA Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Overdue By</TableCell>
                    <TableCell>Deadline Was</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {violations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box sx={{ py: 3 }}>
                          <CheckCircleIcon sx={{ fontSize: 48, color: theme.palette.success.main, mb: 1 }} />
                          <Typography variant="body1" color="success.main" fontWeight="600">
                            No SLA violations!
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            All SLAs are being met or are on track
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    violations.map((tracking) => {
                      const timeRemaining = calculateTimeRemaining(tracking.deadline);
                      return (
                        <TableRow key={tracking.id} hover>
                          <TableCell>
                            <Chip
                              label={tracking.entityType}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {tracking.slaType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={tracking.priority} size="small" color="error" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="error" fontWeight="600">
                              {timeRemaining.formatted}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(tracking.deadline).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Entity">
                              <IconButton size="small" onClick={() => handleViewEntity(tracking)} color="error">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* At Risk Tab */}
          {currentTab === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entity</TableCell>
                    <TableCell>SLA Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Risk Level</TableCell>
                    <TableCell>Time Remaining</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approaching.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 3 }}>
                          <CheckCircleIcon sx={{ fontSize: 48, color: theme.palette.success.main, mb: 1 }} />
                          <Typography variant="body1" fontWeight="600">
                            No SLAs at risk
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            All active SLAs have sufficient time remaining
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    approaching.map((tracking) => {
                      const status = getSLAStatus(tracking.deadline);
                      return (
                        <TableRow key={tracking.id} hover>
                          <TableCell>
                            <Chip
                              label={tracking.entityType}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {tracking.slaType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={tracking.priority} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={status.label}
                              size="small"
                              sx={{
                                bgcolor: alpha(status.color, 0.1),
                                color: status.color,
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>{getTimeRemainingDisplay(tracking)}</TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(tracking.deadline).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Entity">
                              <IconButton size="small" onClick={() => handleViewEntity(tracking)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}



          {/* Compliance by Type Tab */}
          {currentTab === 3 && (
            <Grid container spacing={3}>
              {['lead', 'case', 'task', 'email', 'claim'].map((entityType) => {
                const typeMetrics = getComplianceByEntityType(entityType);
                return (
                  <Grid item xs={12} sm={6} md={4} key={entityType}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" fontWeight="600" sx={{ textTransform: 'capitalize', mb: 2 }}>
                          {entityType}s
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Compliance Rate</Typography>
                            <Typography variant="body2" fontWeight="600" color="success.main">
                              {typeMetrics.complianceRate}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={typeMetrics.complianceRate}
                            sx={{ height: 8, borderRadius: 4 }}
                            color="success"
                          />
                        </Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Total
                            </Typography>
                            <Typography variant="h6">{typeMetrics.total}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Active
                            </Typography>
                            <Typography variant="h6">{typeMetrics.active}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="success.main">
                              Met
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              {typeMetrics.met}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="error.main">
                              Breached
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              {typeMetrics.breached}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SLAMonitoring;
