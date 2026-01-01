import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  FileDownload as DownloadIcon
} from '@mui/icons-material';
import { useAutoAssignment } from '../context/AutoAssignmentContext';
import {
  ASSIGNMENT_STRATEGIES,
  getOverview,
  getWorkload,
  getHistory,
  searchHistory,
  exportHistory
} from '../services/autoAssignmentService';

const AutoAssignmentMonitoring = () => {
  const {
    config,
    agents,
    assignmentHistory: contextHistory,
    getAssignmentStats,
    getAllAgentWorkloads,
    getAvailableAgentsList
  } = useAutoAssignment();

  const [currentTab, setCurrentTab] = useState(0);
  const [filterStrategy, setFilterStrategy] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // API State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiOverview, setApiOverview] = useState(null);
  const [apiWorkload, setApiWorkload] = useState([]);
  const [apiHistory, setApiHistory] = useState([]);
  const [exporting, setExporting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overview, workload, history] = await Promise.all([
        getOverview().catch(err => {
          console.warn('Overview API failed, using fallback:', err);
          return null;
        }),
        getWorkload().catch(err => {
          console.warn('Workload API failed, using fallback:', err);
          return [];
        }),
        getHistory().catch(err => {
          console.warn('History API failed, using fallback:', err);
          return [];
        })
      ]);

      setApiOverview(overview);
      setApiWorkload(workload);
      setApiHistory(history);
    } catch (err) {
      console.error('Error loading auto-assignment data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with API
  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      // Reload all history
      loadData();
      return;
    }

    try {
      setLoading(true);
      const results = await searchHistory(query);
      setApiHistory(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        // If search query is cleared, reload all data
        loadData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Mock data for demonstration
  const MOCK_STATS = {
    total: 1250,
    byStrategy: {
      'ROUND_ROBIN': 450,
      'LOAD_BALANCED': 320,
      'SKILL_BASED': 280,
      'PERFORMANCE_BASED': 150,
      'GEOGRAPHIC': 50
    },
    byAgent: {
      'AGT-001': 145,
      'AGT-002': 132,
      'AGT-003': 120,
      'AGT-004': 98,
      'AGT-005': 85
    }
  };

  const MOCK_HISTORY = [
    { id: 'HIST-001', entityId: 'LEAD-2024-001', entityType: 'Lead', agentId: 'AGT-001', agentName: 'Sarah Johnson', strategy: 'ROUND_ROBIN', reason: 'Next in rotation', assignedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'HIST-002', entityId: 'CASE-2024-089', entityType: 'Case', agentId: 'AGT-003', agentName: 'Mike Wilson', strategy: 'SKILL_BASED', reason: 'Best skill match: Support', assignedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 'HIST-003', entityId: 'LEAD-2024-002', entityType: 'Lead', agentId: 'AGT-002', agentName: 'John Doe', strategy: 'LOAD_BALANCED', reason: 'Lowest utilization (45%)', assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'HIST-004', entityId: 'TASK-2024-567', entityType: 'Task', agentId: 'AGT-001', agentName: 'Sarah Johnson', strategy: 'PERFORMANCE_BASED', reason: 'Top performer for high value', assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    { id: 'HIST-005', entityId: 'LEAD-2024-003', entityType: 'Lead', agentId: 'AGT-004', agentName: 'Emily Davis', strategy: 'GEOGRAPHIC', reason: 'Region match: North', assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'HIST-006', entityId: 'CASE-2024-090', entityType: 'Case', agentId: 'AGT-003', agentName: 'Mike Wilson', strategy: 'ROUND_ROBIN', reason: 'Next in rotation', assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 'HIST-007', entityId: 'LEAD-2024-004', entityType: 'Lead', agentId: 'AGT-005', agentName: 'David Brown', strategy: 'LOAD_BALANCED', reason: 'Lowest utilization (20%)', assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
    { id: 'HIST-008', entityId: 'LEAD-2024-005', entityType: 'Lead', agentId: 'AGT-001', agentName: 'Sarah Johnson', strategy: 'SKILL_BASED', reason: 'Best skill match: Sales', assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString() }
  ];

  // Calculate statistics from API data or fallback to context
  const stats = useMemo(() => {
    if (apiOverview) {
      // Use API overview data
      return {
        total: apiOverview.total_assignments || 0,
        byStrategy: apiOverview.by_strategy || {},
        byAgent: apiOverview.by_agent || {}
      };
    }

    // Fallback to context stats
    const contextStats = getAssignmentStats();
    if (contextStats && contextStats.total && contextStats.total > 0) {
      return contextStats;
    }

    // Last resort: mock data
    return MOCK_STATS;
  }, [apiOverview, contextHistory]);

  // Use API workload data or fallback to context
  const agentWorkloads = useMemo(() => {
    if (apiWorkload && apiWorkload.length > 0) {
      // Transform API workload data to match expected format
      return apiWorkload.map(w => ({
        agent: {
          id: w.agent_id,
          name: w.agent_name,
          email: w.agent_email || '',
          active: w.is_active !== false,
          performanceTier: w.performance_tier || 'average'
        },
        workload: {
          assigned: w.current_leads || 0,
          capacity: w.capacity || 50,
          utilizationPercent: w.utilization || 0
        }
      }));
    }
    return getAllAgentWorkloads([]);
  }, [apiWorkload, agents]);

  // Use API history or fallback to context
  const assignmentHistory = useMemo(() => {
    if (apiHistory && apiHistory.length > 0) {
      return apiHistory;
    }
    if (contextHistory && contextHistory.length > 0) {
      return contextHistory;
    }
    return MOCK_HISTORY;
  }, [apiHistory, contextHistory]);

  const availableAgents = useMemo(() => getAvailableAgentsList([]), [agents, config.maxCapacity]);

  // Filter assignment history
  const filteredHistory = useMemo(() => {
    let filtered = assignmentHistory;

    if (filterStrategy !== 'all') {
      filtered = filtered.filter(h => h.strategy === filterStrategy);
    }

    if (filterAgent !== 'all') {
      filtered = filtered.filter(h => h.agentId === filterAgent || h.agent_id === filterAgent);
    }

    // Note: Search is now handled by API, not client-side filtering

    return filtered;
  }, [assignmentHistory, filterStrategy, filterAgent]);

  // Calculate workload metrics
  const workloadStats = useMemo(() => {
    const totalCapacity = agents.reduce((sum, a) => sum + (a.maxCapacity || 50), 0);
    const activeAgents = agents.filter(a => a.active).length;
    const totalAgents = agents.length;
    const avgWorkload = agentWorkloads.length > 0
      ? agentWorkloads.reduce((sum, w) => sum + w.workload.utilizationPercent, 0) / agentWorkloads.length
      : 0;

    return {
      totalCapacity,
      activeAgents,
      totalAgents,
      avgWorkload: Math.round(avgWorkload),
      availableAgents: availableAgents.length
    };
  }, [agents, agentWorkloads, availableAgents]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Export assignment history using API
  const handleExportHistory = async () => {
    try {
      setExporting(true);
      const blob = await exportHistory();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `assignment_history_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export history. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Get workload color
  const getWorkloadColor = (percent) => {
    if (percent >= 90) return 'error';
    if (percent >= 75) return 'warning';
    if (percent >= 50) return 'info';
    return 'success';
  };

  // Render overview tab
  const renderOverview = () => (
    <Box>
      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Assignments
                </Typography>
              </Box>
              <Typography variant="h4">{stats.total || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Active Agents
                </Typography>
              </Box>
              <Typography variant="h4">
                {workloadStats.activeAgents}/{workloadStats.totalAgents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Avg. Workload
                </Typography>
              </Box>
              <Typography variant="h4">{workloadStats.avgWorkload}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Available Agents
                </Typography>
              </Box>
              <Typography variant="h4">{workloadStats.availableAgents}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Strategy Distribution */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignments by Strategy
              </Typography>
              {stats.byStrategy && Object.keys(stats.byStrategy).length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {Object.entries(stats.byStrategy).map(([strategy, count]) => (
                    <Box key={strategy} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">
                          {strategy.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {count} ({Math.round((count / stats.total) * 100)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(count / stats.total) * 100}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No assignments yet
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignments by Agent
              </Typography>
              {stats.byAgent && Object.keys(stats.byAgent).length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {Object.entries(stats.byAgent)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([agentId, count]) => {
                      const agent = agents.find(a => a.id === agentId);
                      return (
                        <Box key={agentId} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">
                              {agent?.name || agentId}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {count} ({Math.round((count / stats.total) * 100)}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(count / stats.total) * 100}
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>
                      );
                    })}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No assignments yet
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Render agent workloads tab
  const renderAgentWorkloads = () => (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Agent Workload Distribution
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned Items</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Utilization</TableCell>
                  <TableCell>Performance Tier</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agentWorkloads
                  .sort((a, b) => b.workload.utilizationPercent - a.workload.utilizationPercent)
                  .map(({ agent, workload }) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {agent.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {agent.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={agent.active ? <CheckCircleIcon /> : <WarningIcon />}
                          label={agent.active ? 'Active' : 'Inactive'}
                          color={agent.active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {workload.assigned}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {workload.capacity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flexGrow: 1, minWidth: 100 }}>
                            <LinearProgress
                              variant="determinate"
                              value={workload.utilizationPercent}
                              color={getWorkloadColor(workload.utilizationPercent)}
                              sx={{ height: 8, borderRadius: 1 }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="bold">
                            {workload.utilizationPercent}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={agent.performanceTier || 'average'}
                          size="small"
                          color={
                            agent.performanceTier === 'top' ? 'success' :
                              agent.performanceTier === 'high' ? 'primary' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  // Render assignment history tab
  const renderAssignmentHistory = () => (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <InputLabel>Strategy</InputLabel>
                <Select
                  value={filterStrategy}
                  onChange={(e) => setFilterStrategy(e.target.value)}
                  label="Strategy"
                >
                  <MenuItem value="all">All Strategies</MenuItem>
                  {Object.entries(ASSIGNMENT_STRATEGIES).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {key.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Agent</InputLabel>
                <Select
                  value={filterAgent}
                  onChange={(e) => setFilterAgent(e.target.value)}
                  label="Agent"
                >
                  <MenuItem value="all">All Agents</MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportHistory}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Assignment History Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Assignment History ({filteredHistory.length})
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Entity</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Strategy</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.length > 0 ? (
                  filteredHistory.slice(0, 100).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {entry.entityId}
                          </Typography>
                          <Chip
                            label={entry.entityType}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.agentName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.strategy.replace(/_/g, ' ')}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {entry.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(entry.assignedAt).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Alert severity="info">
                        No assignments found. Try adjusting your filters.
                      </Alert>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredHistory.length > 100 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Showing first 100 results. Use filters to narrow down.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || exporting}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {exporting ? 'Exporting data...' : 'Loading...'}
          </Typography>
        </Box>
      </Backdrop>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Auto-Assignment Monitoring
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor agent workloads and assignment distribution
          </Typography>
        </Box>
        {!config.enabled && (
          <Alert severity="warning">
            Auto-assignment is currently disabled
          </Alert>
        )}
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Agent Workloads" />
          <Tab label="Assignment History" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && renderOverview()}
        {currentTab === 1 && renderAgentWorkloads()}
        {currentTab === 2 && renderAssignmentHistory()}
      </Box>
    </Box>
  );
};

export default AutoAssignmentMonitoring;
