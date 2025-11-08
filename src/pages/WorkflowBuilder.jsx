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
  Badge
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as RunIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  CheckCircle as ActiveIcon,
  PlaylistAdd as TemplateIcon
} from '@mui/icons-material';
import { useWorkflow } from '../context/WorkflowContext';

const WorkflowBuilder = () => {
  const {
    workflows,
    executions,
    createWorkflow,
    createFromTemplate,
    updateWorkflow,
    deleteWorkflow,
    activateWorkflow,
    pauseWorkflow,
    runWorkflow,
    getExecutionStats,
    WORKFLOW_STATUS,
    TRIGGER_TYPE,
    WORKFLOW_TEMPLATES
  } = useWorkflow();

  const [currentTab, setCurrentTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: TRIGGER_TYPE.MANUAL
  });
  const [runData, setRunData] = useState('{}');

  // Get statistics
  const stats = useMemo(() => getExecutionStats(), [executions]);
  const activeWorkflows = workflows.filter(wf => wf.status === WORKFLOW_STATUS.ACTIVE);
  const draftWorkflows = workflows.filter(wf => wf.status === WORKFLOW_STATUS.DRAFT);

  // Handle create
  const handleCreate = () => {
    if (!formData.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    createWorkflow(formData);
    setCreateDialogOpen(false);
    setFormData({ name: '', description: '', trigger: TRIGGER_TYPE.MANUAL });
  };

  // Handle create from template
  const handleCreateFromTemplate = (templateKey) => {
    createFromTemplate(templateKey);
    setTemplateDialogOpen(false);
  };

  // Handle activate
  const handleActivate = (workflowId) => {
    const result = activateWorkflow(workflowId);
    if (!result.success) {
      alert(`Failed to activate: ${result.errors?.join(', ') || result.error}`);
    }
    handleMenuClose();
  };

  // Handle pause
  const handlePause = (workflowId) => {
    pauseWorkflow(workflowId);
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

  // Render workflows tab
  const renderWorkflowsTab = () => (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Trigger</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Nodes</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.length > 0 ? (
              workflows.map((workflow) => (
                <TableRow key={workflow.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {workflow.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{workflow.description}</TableCell>
                  <TableCell>
                    <Chip label={workflow.trigger} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={workflow.status}
                      color={getStatusColor(workflow.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{workflow.nodes?.length || 0}</TableCell>
                  <TableCell>
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {workflow.status === WORKFLOW_STATUS.ACTIVE && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          setRunDialogOpen(true);
                        }}
                      >
                        <RunIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, workflow)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    No workflows yet. Create one to get started!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Render executions tab
  const renderExecutionsTab = () => (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Workflow</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Started</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Steps Executed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executions.length > 0 ? (
              executions.slice(0, 50).map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell>{execution.workflowName}</TableCell>
                  <TableCell>
                    <Chip
                      label={execution.status}
                      color={getStatusColor(execution.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(execution.startedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {execution.completedAt
                      ? new Date(execution.completedAt).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {execution.result?.executionLog?.length || 0}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">No executions yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Workflows
              </Typography>
              <Typography variant="h4">{workflows.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active
              </Typography>
              <Typography variant="h4" color="success.main">
                {activeWorkflows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Executions
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.total > 0
                  ? Math.round((stats.successful / stats.total) * 100)
                  : 0}%
              </Typography>
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
        {selectedWorkflow && selectedWorkflow.status === WORKFLOW_STATUS.DRAFT && (
          <MenuItem onClick={() => handleActivate(selectedWorkflow.id)}>
            <ActiveIcon sx={{ mr: 1 }} /> Activate
          </MenuItem>
        )}
        {selectedWorkflow && selectedWorkflow.status === WORKFLOW_STATUS.ACTIVE && (
          <MenuItem onClick={() => handlePause(selectedWorkflow.id)}>
            <PauseIcon sx={{ mr: 1 }} /> Pause
          </MenuItem>
        )}
        <MenuItem onClick={() => selectedWorkflow && handleDelete(selectedWorkflow.id)}>
          <DeleteIcon sx={{ mr: 1 }} color="error" /> Delete
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Workflow</DialogTitle>
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
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
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
    </Box>
  );
};

export default WorkflowBuilder;
