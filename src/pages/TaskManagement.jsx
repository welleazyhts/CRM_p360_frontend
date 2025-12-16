import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Tabs,
  Tab,
  Alert,
  IconButton,
  Menu,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ListIcon,
  ViewKanban as KanbanIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  FileDownload as DownloadIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useTaskManagement } from '../context/TaskManagementContext';
import TaskListView from '../components/tasks/TaskListView';
import TaskKanbanView from '../components/tasks/TaskKanbanView';
import TaskCalendarView from '../components/tasks/TaskCalendarView';
import TaskDialog from '../components/tasks/TaskDialog';
import taskService from '../services/taskManagementService';

const TaskManagement = () => {
  const {
    tasks,
    config,
    getStatistics,
    getFilteredTasks,
    getOverdueTasks,
    getTasksDueSoon,
    TASK_STATUS,
    TASK_PRIORITY,
    TASK_TYPE
  } = useTaskManagement();

  const [view, setView] = useState(config.defaultView || 'list');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    assignedTo: ''
  });

  // Sorting
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Get statistics
  const stats = useMemo(() => getStatistics(), [tasks]);
  const overdueTasks = useMemo(() => getOverdueTasks(), [tasks]);
  const dueSoonTasks = useMemo(() => getTasksDueSoon(), [tasks]);

  // Get filtered and sorted tasks
  const displayTasks = useMemo(() => {
    let taskFilters = { ...filters };

    // Apply tab filters
    if (currentTab === 1) {
      // My Tasks
      taskFilters.assignedTo = 'current_user'; // This should be the actual user ID
    } else if (currentTab === 2) {
      // Overdue
      taskFilters.overdue = true;
    } else if (currentTab === 3) {
      // Due Soon
      taskFilters.dueSoon = true;
    }

    return getFilteredTasks(taskFilters, sortBy, sortOrder);
  }, [tasks, filters, currentTab, sortBy, sortOrder]);

  // Quick verification: call service list once (no UI change) — safe fallback
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await taskService.listTasks();
        if (mounted) console.debug('taskService.listTasks sample:', Array.isArray(list) ? list.length : list);
      } catch (e) {
        // ignore — fallback/mock may not require action
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Handle view change
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Handle create task
  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle export
  const handleExport = () => {
    const data = {
      tasks: displayTasks,
      stats,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'error',
      high: 'warning',
      medium: 'info',
      low: 'success'
    };
    return colors[priority] || 'default';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      todo: 'default',
      in_progress: 'primary',
      on_hold: 'warning',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Task Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage tasks, deadlines, and assignments
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
          >
            New Task
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.inProgress || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4" color="error">
                {overdueTasks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4" color="success">
                {stats.completionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {overdueTasks.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          You have {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}
        </Alert>
      )}
      {dueSoonTasks.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {dueSoonTasks.length} task{dueSoonTasks.length !== 1 ? 's' : ''} due within 24 hours
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="All Tasks" />
          <Tab label="My Tasks" />
          <Tab
            label={
              <Badge badgeContent={overdueTasks.length} color="error">
                Overdue
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={dueSoonTasks.length} color="warning">
                Due Soon
              </Badge>
            }
          />
        </Tabs>
      </Paper>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(TASK_STATUS).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                label="Priority"
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(TASK_PRIORITY).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                label="Type"
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(TASK_TYPE).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title="Sort">
                <IconButton onClick={(e) => setSortMenuAnchor(e.currentTarget)}>
                  <SortIcon />
                </IconButton>
              </Tooltip>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                size="small"
              >
                <ToggleButton value="list">
                  <ListIcon />
                </ToggleButton>
                <ToggleButton value="kanban">
                  <KanbanIcon />
                </ToggleButton>
                <ToggleButton value="calendar">
                  <CalendarIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
        disablePortal
      >
        <MenuItem onClick={() => { handleSortChange('dueDate'); setSortMenuAnchor(null); }}>
          Due Date {sortBy === 'dueDate' && `(${sortOrder})`}
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange('priority'); setSortMenuAnchor(null); }}>
          Priority {sortBy === 'priority' && `(${sortOrder})`}
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange('status'); setSortMenuAnchor(null); }}>
          Status {sortBy === 'status' && `(${sortOrder})`}
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange('createdAt'); setSortMenuAnchor(null); }}>
          Created Date {sortBy === 'createdAt' && `(${sortOrder})`}
        </MenuItem>
        <MenuItem onClick={() => { handleSortChange('title'); setSortMenuAnchor(null); }}>
          Title {sortBy === 'title' && `(${sortOrder})`}
        </MenuItem>
      </Menu>

      {/* Task Views */}
      <Box>
        {view === 'list' && (
          <TaskListView
            tasks={displayTasks}
            onEditTask={handleEditTask}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        )}
        {view === 'kanban' && (
          <TaskKanbanView
            tasks={displayTasks}
            onEditTask={handleEditTask}
            getPriorityColor={getPriorityColor}
          />
        )}
        {view === 'calendar' && (
          <TaskCalendarView
            tasks={displayTasks}
            onEditTask={handleEditTask}
            onCreateTask={handleCreateTask}
          />
        )}
      </Box>

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        task={editingTask}
        onClose={() => {
          setTaskDialogOpen(false);
          setEditingTask(null);
        }}
      />
    </Box>
  );
};

export default TaskManagement;
