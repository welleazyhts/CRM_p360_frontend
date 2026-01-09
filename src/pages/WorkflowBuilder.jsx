import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  Menu,
  Badge,
  useTheme,
  alpha,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Collapse,
  CardHeader,
  CardActions
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Add as AddIcon,
  PlayArrow as RunIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  CheckCircle as ActiveIcon,
  PlaylistAdd as TemplateIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Webhook as WebhookIcon,
  Code as CodeIcon,
  FilterAlt as FilterIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
  AccountTree as NodeIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon,
  Visibility as ViewIcon,
  FlashOn as TriggerIcon,
  Extension as ActionIcon,
  Loop as LoopIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  QueryBuilder as TimelineIcon,
  CheckCircle
} from '@mui/icons-material';
import { useWorkflow } from '../context/WorkflowContext';

const WorkflowBuilder = () => {
  const theme = useTheme();
  const {
    workflows,
    executions,
    loading,
    error,
    createWorkflow,
    createFromTemplate,
    updateWorkflow,
    deleteWorkflow,
    activateWorkflow,
    pauseWorkflow,
    runWorkflow,
    refreshWorkflows,
    getExecutionStats,
    WORKFLOW_STATUS,
    TRIGGER_TYPE,
    WORKFLOW_TEMPLATES
  } = useWorkflow();

  const [currentTab, setCurrentTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [executionDetailsOpen, setExecutionDetailsOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [expandedWorkflows, setExpandedWorkflows] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: TRIGGER_TYPE.MANUAL
  });
  const [runData, setRunData] = useState('{}');
  const [isEditing, setIsEditing] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get statistics
  const stats = useMemo(() => getExecutionStats(), [executions]);

  // Handle delete click (opens confirmation)
  const handleDeleteClick = (workflow) => {
    setSelectedWorkflow(workflow);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  // Perform actual delete
  const handleDeleteConfirm = async () => {
    if (!selectedWorkflow) return;

    try {
      await deleteWorkflow(selectedWorkflow.id);
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false); // Close details if open
      setSelectedWorkflow(null);
    } catch (error) {
      alert('Failed to delete workflow: ' + error.message);
    }
  };

  // ... (handleSave, handleEdit)
  const activeWorkflows = workflows.filter(wf => wf.status === WORKFLOW_STATUS.ACTIVE);
  const draftWorkflows = workflows.filter(wf => wf.status === WORKFLOW_STATUS.DRAFT);

  // Handle save (create or update)
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    if (isEditing && selectedWorkflow) {
      updateWorkflow(selectedWorkflow.id, formData);
    } else {
      createWorkflow(formData);
    }

    setCreateDialogOpen(false);
    setIsEditing(false);
    setSelectedWorkflow(null);
    setFormData({ name: '', description: '', trigger: TRIGGER_TYPE.MANUAL });
  };

  // Handle edit
  const handleEdit = (workflow) => {
    setFormData({
      name: workflow.name,
      description: workflow.description || '',
      trigger: workflow.trigger
    });
    setIsEditing(true);
    setSelectedWorkflow(workflow);
    setCreateDialogOpen(true);
    handleMenuClose();
  };

  // Handle create from template
  const handleCreateFromTemplate = (templateKey) => {
    createFromTemplate(templateKey);
    setTemplateDialogOpen(false);
  };

  // Handle activate
  const handleActivate = async (workflow) => {
    // Determine the ID safely
    const workflowId = workflow?.id || workflow?._id;
    console.log('Activating workflow:', workflow, 'ID:', workflowId);

    if (!workflowId) {
      alert('Error: Workflow ID is missing. Cannot activate.');
      return;
    }

    const result = await activateWorkflow(workflowId);
    if (!result.success) {
      alert(`Failed to activate: ${result.errors?.join(', ') || result.error}`);
    }
    handleMenuClose();
  };

  // Handle pause
  const handlePause = async (workflowId) => {
    await pauseWorkflow(workflowId);
    handleMenuClose();
  };

  // Handle delete
  const handleDelete = (workflowId) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(workflowId);
    }
    handleMenuClose();
  };

  // Handle run
  const handleRun = async () => {
    if (!selectedWorkflow) return;

    try {
      const data = JSON.parse(runData);
      const result = await runWorkflow(selectedWorkflow.id, data);

      if (result.success) {
        alert('Workflow executed successfully!');
      } else {
        alert(`Execution failed: ${result.error}`);
      }

      setRunDialogOpen(false);
      setRunData('{}');
    } catch (error) {
      alert(`Invalid JSON data: ${error.message}`);
    }
  };

  // open run dialog and optionally prefill sample data for known templates
  const openRunDialogForWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    // If the workflow matches the leadApproval template, prefill with sample data
    try {
      if (workflow?.name === WORKFLOW_TEMPLATES?.leadApproval?.name) {
        const sample = {
          leadId: 'L-1001',
          leadValue: 150000,
          agentEmail: 'agent@example.com',
          customer: {
            name: 'Rohit Sharma',
            phone: '9876543210',
            email: 'rohit@example.com'
          }
        };
        setRunData(JSON.stringify(sample, null, 2));
      } else {
        setRunData('{}');
      }
    } catch (e) {
      setRunData('{}');
    }
    setRunDialogOpen(true);
  };

  // Handle menu
  const handleMenuOpen = (event, workflow) => {
    setMenuAnchor(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedWorkflow(null);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      active: 'success',
      paused: 'warning',
      completed: 'info',
      failed: 'error'
    };
    return colors[status] || 'default';
  };

  // Get trigger icon
  const getTriggerIcon = (trigger) => {
    const icons = {
      manual: <TriggerIcon />,
      schedule: <ScheduleIcon />,
      webhook: <WebhookIcon />,
      lead_created: <AddIcon />,
      lead_updated: <EditIcon />,
      email_received: <EmailIcon />,
    };
    return icons[trigger] || <CodeIcon />;
  };

  // Toggle workflow expansion
  const toggleExpand = (workflowId) => {
    setExpandedWorkflows(prev => ({
      ...prev,
      [workflowId]: !prev[workflowId]
    }));
  };

  // Calculate average execution time
  const getAverageExecutionTime = () => {
    const completedExecutions = executions.filter(e => e.completedAt && e.startedAt);
    if (completedExecutions.length === 0) return 0;

    const totalTime = completedExecutions.reduce((acc, exec) => {
      const duration = new Date(exec.completedAt) - new Date(exec.startedAt);
      return acc + duration;
    }, 0);

    return Math.round(totalTime / completedExecutions.length / 1000); // seconds
  };

  // Get recent activity
  const getRecentActivity = () => {
    return executions.slice(0, 5).map(exec => ({
      ...exec,
      timeAgo: getTimeAgo(exec.startedAt)
    }));
  };

  // Time ago helper
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Render workflows tab
  const renderWorkflowsTab = () => (
    <Box>
      {loading && workflows.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : workflows.length > 0 ? (
        <Grid container spacing={3}>
          {workflows.map((workflow) => (
            <Grid item xs={12} md={6} lg={4} key={workflow.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: `2px solid ${alpha(
                    workflow.status === WORKFLOW_STATUS.ACTIVE
                      ? theme.palette.success.main
                      : theme.palette.grey[300],
                    0.3
                  )}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main'
                      }}
                    >
                      {getTriggerIcon(workflow.trigger)}
                    </Avatar>
                  }
                  action={
                    <IconButton onClick={(e) => handleMenuOpen(e, workflow)}>
                      <MoreIcon />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" fontWeight="700">
                      {workflow.name}
                    </Typography>
                  }
                  subheader={
                    <Chip
                      label={workflow.status}
                      color={getStatusColor(workflow.status)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  }
                />

                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {workflow.description || 'No description provided'}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={getTriggerIcon(workflow.trigger)}
                      label={workflow.trigger.replace(/_/g, ' ')}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<NodeIcon />}
                      label={`${workflow.nodes?.length || 0} steps`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <TimeIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                      Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Stack>

                  {/* Node visualization */}
                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(workflow.id)}
                    sx={{ mt: 1 }}
                  >
                    {expandedWorkflows[workflow.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {expandedWorkflows[workflow.id] ? 'Hide' : 'Show'} Workflow Steps
                    </Typography>
                  </IconButton>

                  <Collapse in={expandedWorkflows[workflow.id]}>
                    <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                      {workflow.nodes && workflow.nodes.length > 0 ? (
                        <Timeline sx={{ p: 0, m: 0 }}>
                          {workflow.nodes.map((node, index) => (
                            <TimelineItem key={index} sx={{ '&::before': { display: 'none' } }}>
                              <TimelineSeparator>
                                <TimelineDot color="primary" variant="outlined">
                                  <ActionIcon sx={{ fontSize: 14 }} />
                                </TimelineDot>
                                {index < workflow.nodes.length - 1 && <TimelineConnector />}
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="caption" fontWeight="600">
                                  {node.type}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                  {node.config?.description || 'No description'}
                                </Typography>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No steps configured
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  {workflow.status === WORKFLOW_STATUS.ACTIVE ? (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<RunIcon />}
                      onClick={() => openRunDialogForWorkflow(workflow)}
                    >
                      Run Now
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ActiveIcon />}
                      onClick={() => handleActivate(workflow.id)}
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => {
                      setSelectedWorkflow(workflow);
                      setDetailsDialogOpen(true);
                    }}
                  >
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <NodeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No workflows yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first workflow to automate your business processes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Workflow
          </Button>
        </Paper>
      )}
    </Box>
  );

  // Render executions tab
  const renderExecutionsTab = () => (
    <Box>
      {executions.length > 0 ? (
        <Stack spacing={2}>
          {executions.slice(0, 20).map((execution) => {
            const duration = execution.completedAt
              ? Math.round((new Date(execution.completedAt) - new Date(execution.startedAt)) / 1000)
              : null;

            return (
              <Paper
                key={execution.id}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${alpha(
                    execution.status === 'completed'
                      ? theme.palette.success.main
                      : execution.status === 'failed'
                        ? theme.palette.error.main
                        : theme.palette.grey[300],
                    0.3
                  )}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 3,
                    cursor: 'pointer',
                  },
                }}
                onClick={() => {
                  setSelectedExecution(execution);
                  setExecutionDetailsOpen(true);
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(
                          execution.status === 'completed'
                            ? theme.palette.success.main
                            : execution.status === 'failed'
                              ? theme.palette.error.main
                              : theme.palette.info.main,
                          0.1
                        ),
                        color:
                          execution.status === 'completed'
                            ? 'success.main'
                            : execution.status === 'failed'
                              ? 'error.main'
                              : 'info.main',
                      }}
                    >
                      {execution.status === 'completed' ? (
                        <CheckCircle />
                      ) : execution.status === 'failed' ? (
                        <ErrorIcon />
                      ) : (
                        <RunIcon />
                      )}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {execution.workflowName}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          <TimeIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                          {getTimeAgo(execution.startedAt)}
                        </Typography>
                        {duration !== null && (
                          <Typography variant="caption" color="text.secondary">
                            <SpeedIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                            {duration}s duration
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          <NodeIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                          {execution.result?.executionLog?.length || 0} steps
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>

                  <Chip
                    label={execution.status}
                    color={getStatusColor(execution.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>

                {/* Progress bar for duration */}
                {execution.status === 'running' && (
                  <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
                )}
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <TimelineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No executions yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Run a workflow to see execution history
          </Typography>
        </Paper>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Workflow Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build and manage automated workflows
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<LoopIcon />}
            onClick={() => refreshWorkflows()}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<TemplateIcon />}
            onClick={() => setTemplateDialogOpen(true)}
          >
            Templates
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            New Workflow
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Total Workflows
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="primary.main">
                    {workflows.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {draftWorkflows.length} drafts
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    color: 'primary.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <NodeIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Active Workflows
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="success.main">
                    {activeWorkflows.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Running now
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    color: 'success.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <ActiveIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Total Executions
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="info.main">
                    {stats.total}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {stats.successful} successful
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    color: 'info.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <RunIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Success Rate
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="warning.main">
                    {stats.total > 0
                      ? Math.round((stats.successful / stats.total) * 100)
                      : 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Avg: {getAverageExecutionTime()}s
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    color: 'warning.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
          <Tab label="Workflows" />
          <Tab
            label={
              <Badge badgeContent={executions.length} color="primary" max={999}>
                Executions
              </Badge>
            }
          />
        </Tabs>
      </Paper>

      {/* Content */}
      {currentTab === 0 && renderWorkflowsTab()}
      {currentTab === 1 && renderExecutionsTab()}

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEdit(selectedWorkflow)}>
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        {/* Run Option (Only for Active) */}
        {selectedWorkflow && selectedWorkflow.status?.toLowerCase() === 'active' && (
          <MenuItem onClick={() => {
            handleMenuClose();
            openRunDialogForWorkflow(selectedWorkflow);
          }}>
            <RunIcon sx={{ mr: 1, color: 'success.main' }} /> Run Workflow
          </MenuItem>
        )}

        {/* Activate / Resume */}
        {selectedWorkflow && (selectedWorkflow.status?.toLowerCase() === 'draft' || selectedWorkflow.status?.toLowerCase() === 'paused') && (
          <MenuItem onClick={() => handleActivate(selectedWorkflow)}>
            <ActiveIcon sx={{ mr: 1, color: 'primary.main' }} /> {selectedWorkflow.status?.toLowerCase() === 'paused' ? 'Resume' : 'Activate'}
          </MenuItem>
        )}

        {/* Pause Option (Only for Active) */}
        {selectedWorkflow && selectedWorkflow.status?.toLowerCase() === 'active' && (
          <MenuItem onClick={() => handlePause(selectedWorkflow.id)}>
            <PauseIcon sx={{ mr: 1, color: 'warning.main' }} /> Pause
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDeleteClick(selectedWorkflow)}>
          <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen} onClose={() => { setCreateDialogOpen(false); setIsEditing(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Workflow' : 'Create New Workflow'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trigger</InputLabel>
                <Select
                  value={formData.trigger}
                  onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                  label="Trigger"
                >
                  {Object.entries(TRIGGER_TYPE).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {key.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateDialogOpen(false); setIsEditing(false); }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">{isEditing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Choose Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(WORKFLOW_TEMPLATES).map(([key, template]) => (
              <Grid item xs={12} key={key}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                  onClick={() => handleCreateFromTemplate(key)}
                >
                  <CardContent>
                    <Typography variant="h6">{template.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label={template.trigger} size="small" />
                      <Chip label={`${template.nodes.length} steps`} size="small" sx={{ ml: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Run Dialog */}
      <Dialog open={runDialogOpen} onClose={() => setRunDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Run Workflow: {selectedWorkflow?.name}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Enter the data to pass to the workflow in JSON format
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Workflow Data (JSON)"
            value={runData}
            onChange={(e) => setRunData(e.target.value)}
            sx={{ mt: 1 }}
            placeholder='{"leadValue": 150000, "agentEmail": "agent@example.com"}'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRunDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRun} variant="contained" startIcon={<RunIcon />}>
            Run
          </Button>
        </DialogActions>
      </Dialog>

      {/* Workflow Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            {selectedWorkflow && getTriggerIcon(selectedWorkflow.trigger)}
            <Box>
              <Typography variant="h6" fontWeight="700">
                {selectedWorkflow?.name}
              </Typography>
              <Chip
                label={selectedWorkflow?.status}
                color={getStatusColor(selectedWorkflow?.status)}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedWorkflow.description || 'No description provided'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Trigger Type
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {selectedWorkflow.trigger.replace(/_/g, ' ')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Workflow Steps
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {selectedWorkflow.nodes?.length || 0} steps
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {new Date(selectedWorkflow.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {new Date(selectedWorkflow.updatedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight="700" gutterBottom>
                Workflow Steps
              </Typography>

              {selectedWorkflow.nodes && selectedWorkflow.nodes.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {selectedWorkflow.nodes.map((node, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            {node.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {node.config?.description || 'No description'}
                          </Typography>
                        </Box>
                        <ActionIcon color="action" />
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No steps configured yet
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {selectedWorkflow && (
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={() => handleDeleteClick(selectedWorkflow)}
            >
              Delete
            </Button>
          )}
          {selectedWorkflow && selectedWorkflow.status === WORKFLOW_STATUS.ACTIVE && (
            <Button
              variant="contained"
              startIcon={<RunIcon />}
              onClick={() => {
                setDetailsDialogOpen(false);
                openRunDialogForWorkflow(selectedWorkflow);
              }}
            >
              Run Workflow
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the workflow "{selectedWorkflow?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Execution Details Dialog */}
      <Dialog
        open={executionDetailsOpen}
        onClose={() => setExecutionDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: alpha(
                  selectedExecution?.status === 'completed'
                    ? theme.palette.success.main
                    : selectedExecution?.status === 'failed'
                      ? theme.palette.error.main
                      : theme.palette.info.main,
                  0.1
                ),
                color:
                  selectedExecution?.status === 'completed'
                    ? 'success.main'
                    : selectedExecution?.status === 'failed'
                      ? 'error.main'
                      : 'info.main',
              }}
            >
              {selectedExecution?.status === 'completed' ? (
                <CheckCircle />
              ) : selectedExecution?.status === 'failed' ? (
                <ErrorIcon />
              ) : (
                <RunIcon />
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="700">
                {selectedExecution?.workflowName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Execution #{selectedExecution?.id}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedExecution && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box>
                    <Chip
                      label={selectedExecution.status}
                      color={getStatusColor(selectedExecution.status)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {selectedExecution.completedAt
                      ? `${Math.round(
                        (new Date(selectedExecution.completedAt) -
                          new Date(selectedExecution.startedAt)) /
                        1000
                      )}s`
                      : 'Running...'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Started At
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {new Date(selectedExecution.startedAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Completed At
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {selectedExecution.completedAt
                      ? new Date(selectedExecution.completedAt).toLocaleString()
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight="700" gutterBottom>
                Execution Timeline
              </Typography>

              {selectedExecution.result?.executionLog &&
                selectedExecution.result.executionLog.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Timeline>
                    {selectedExecution.result.executionLog.map((log, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2 }}>
                          <Typography variant="caption">
                            Step {index + 1}
                          </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot
                            color={
                              log.status === 'success'
                                ? 'success'
                                : log.status === 'error'
                                  ? 'error'
                                  : 'primary'
                            }
                          />
                          {index < selectedExecution.result.executionLog.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.background.default, 0.5),
                            }}
                          >
                            <Typography variant="body2" fontWeight="600">
                              {log.step}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {log.message}
                            </Typography>
                          </Paper>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No execution logs available
                </Alert>
              )}

              {selectedExecution.error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="600">
                    Error Message:
                  </Typography>
                  <Typography variant="caption">{selectedExecution.error}</Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecutionDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default WorkflowBuilder;
