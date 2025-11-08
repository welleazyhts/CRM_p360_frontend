import React, { useState, useMemo } from 'react';
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
  Alert
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
import { ASSIGNMENT_STRATEGIES } from '../services/autoAssignmentService';

const AutoAssignmentMonitoring = () => {
  const {
    config,
    agents,
    assignmentHistory,
    getAssignmentStats,
    getAllAgentWorkloads,
    getAvailableAgentsList
  } = useAutoAssignment();

  const [currentTab, setCurrentTab] = useState(0);
  const [filterStrategy, setFilterStrategy] = useState('all');
  const [filterAgent, setFilterAgent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const stats = useMemo(() => getAssignmentStats(), [assignmentHistory]);
  const agentWorkloads = useMemo(() => getAllAgentWorkloads([]), [agents]);
  const availableAgents = useMemo(() => getAvailableAgentsList([]), [agents, config.maxCapacity]);

  // Filter assignment history
  const filteredHistory = useMemo(() => {
    let filtered = assignmentHistory;

    if (filterStrategy !== 'all') {
      filtered = filtered.filter(h => h.strategy === filterStrategy);
    }

    if (filterAgent !== 'all') {
      filtered = filtered.filter(h => h.agentId === filterAgent);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h =>
        h.agentName.toLowerCase().includes(query) ||
        h.entityId.toLowerCase().includes(query) ||
        h.entityType.toLowerCase().includes(query) ||
        h.reason.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [assignmentHistory, filterStrategy, filterAgent, searchQuery]);

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

  // Export assignment history
  const handleExportHistory = () => {
    const data = {
      exportDate: new Date().toISOString(),
      stats,
      workloadStats,
      history: filteredHistory
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assignment-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
