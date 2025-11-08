import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  FormGroup,
  Checkbox,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAutoAssignment } from '../../context/AutoAssignmentContext';
import { ASSIGNMENT_STRATEGIES, AGENT_SKILLS } from '../../services/autoAssignmentService';

const AutoAssignmentSettings = () => {
  const {
    config,
    agents,
    updateConfig,
    updateStrategyForType,
    upsertAgent,
    removeAgent,
    toggleAgentActive,
    getAllAgentWorkloads,
    exportConfiguration,
    importConfiguration
  } = useAutoAssignment();

  const [currentTab, setCurrentTab] = useState(0);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({
    id: '',
    name: '',
    email: '',
    active: true,
    status: 'active',
    skills: [],
    territory: [],
    performanceTier: 'average',
    maxCapacity: 50
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Handle configuration updates
  const handleConfigChange = (field, value) => {
    updateConfig({ [field]: value });
  };

  // Handle strategy change for entity type
  const handleStrategyChange = (entityType, strategy) => {
    updateStrategyForType(entityType, strategy);
  };

  // Open agent dialog for add/edit
  const handleOpenAgentDialog = (agent = null) => {
    if (agent) {
      setAgentForm({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        active: agent.active,
        status: agent.status,
        skills: agent.skills || [],
        territory: agent.territory || [],
        performanceTier: agent.performanceTier || 'average',
        maxCapacity: agent.maxCapacity || 50
      });
      setEditingAgent(agent.id);
    } else {
      setAgentForm({
        id: '',
        name: '',
        email: '',
        active: true,
        status: 'active',
        skills: [],
        territory: [],
        performanceTier: 'average',
        maxCapacity: 50
      });
      setEditingAgent(null);
    }
    setAgentDialogOpen(true);
  };

  // Close agent dialog
  const handleCloseAgentDialog = () => {
    setAgentDialogOpen(false);
    setEditingAgent(null);
  };

  // Save agent
  const handleSaveAgent = () => {
    if (!agentForm.id || !agentForm.name || !agentForm.email) {
      alert('Please fill in all required fields');
      return;
    }

    upsertAgent(agentForm);
    handleCloseAgentDialog();
  };

  // Delete agent
  const handleDeleteAgent = (agentId) => {
    if (window.confirm('Are you sure you want to remove this agent?')) {
      removeAgent(agentId);
    }
  };

  // Toggle agent active status
  const handleToggleAgent = (agentId) => {
    toggleAgentActive(agentId);
  };

  // Export configuration
  const handleExport = () => {
    const data = exportConfiguration();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auto-assignment-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import configuration
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          importConfiguration(data);
          alert('Configuration imported successfully');
        } catch (error) {
          alert('Failed to import configuration: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  // Render general settings tab
  const renderGeneralSettings = () => (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Auto-Assignment System
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={config.enabled}
                onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                color="primary"
              />
            }
            label="Enable Auto-Assignment"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
            Automatically assign new leads, cases, and tasks to agents
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Default Configuration
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Default Strategy</InputLabel>
                <Select
                  value={config.defaultStrategy}
                  onChange={(e) => handleConfigChange('defaultStrategy', e.target.value)}
                  label="Default Strategy"
                >
                  {Object.entries(ASSIGNMENT_STRATEGIES).map(([key, value]) => (
                    <MenuItem key={value} value={value}>
                      {key.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Capacity per Agent"
                value={config.maxCapacity}
                onChange={(e) => handleConfigChange('maxCapacity', parseInt(e.target.value))}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Assignment Options
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.considerSLA}
                  onChange={(e) => handleConfigChange('considerSLA', e.target.checked)}
                />
              }
              label="Consider SLA when assigning"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.considerScore}
                  onChange={(e) => handleConfigChange('considerScore', e.target.checked)}
                />
              }
              label="Consider lead score when assigning"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.autoAssignOnCreate}
                  onChange={(e) => handleConfigChange('autoAssignOnCreate', e.target.checked)}
                />
              }
              label="Auto-assign immediately when created"
            />
          </FormGroup>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reassignment Rules
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={config.reassignmentRules?.enabled}
                onChange={(e) => handleConfigChange('reassignmentRules', {
                  ...config.reassignmentRules,
                  enabled: e.target.checked
                })}
              />
            }
            label="Enable Automatic Reassignment"
          />
          {config.reassignmentRules?.enabled && (
            <Box sx={{ mt: 2, ml: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.reassignmentRules?.onOverload}
                    onChange={(e) => handleConfigChange('reassignmentRules', {
                      ...config.reassignmentRules,
                      onOverload: e.target.checked
                    })}
                  />
                }
                label="Reassign when agent is overloaded"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.reassignmentRules?.onInactivity}
                    onChange={(e) => handleConfigChange('reassignmentRules', {
                      ...config.reassignmentRules,
                      onInactivity: e.target.checked
                    })}
                  />
                }
                label="Reassign after inactivity"
              />
              {config.reassignmentRules?.onInactivity && (
                <TextField
                  type="number"
                  label="Inactivity Threshold (hours)"
                  value={config.reassignmentRules?.inactivityThreshold || 24}
                  onChange={(e) => handleConfigChange('reassignmentRules', {
                    ...config.reassignmentRules,
                    inactivityThreshold: parseInt(e.target.value)
                  })}
                  size="small"
                  sx={{ ml: 4, width: 200 }}
                  inputProps={{ min: 1, max: 168 }}
                />
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  // Render strategies tab
  const renderStrategiesSettings = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Configure assignment strategies for different entity types. Each type can use a different strategy.
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Entity Type Strategies
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(config.strategies || {}).map(([entityType, strategy]) => (
              <Grid item xs={12} md={6} key={entityType}>
                <FormControl fullWidth>
                  <InputLabel>{entityType.toUpperCase()}</InputLabel>
                  <Select
                    value={strategy}
                    onChange={(e) => handleStrategyChange(entityType, e.target.value)}
                    label={entityType.toUpperCase()}
                  >
                    {Object.entries(ASSIGNMENT_STRATEGIES).map(([key, value]) => (
                      <MenuItem key={value} value={value}>
                        {key.replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Strategy Descriptions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="primary">Round Robin</Typography>
              <Typography variant="body2" color="text.secondary">
                Distributes entities evenly by rotating through available agents in sequence.
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="primary">Load Based</Typography>
              <Typography variant="body2" color="text.secondary">
                Assigns to the agent with the lowest current workload and available capacity.
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="primary">Skill Based</Typography>
              <Typography variant="body2" color="text.secondary">
                Matches entity requirements to agent skills (e.g., motor insurance to motor specialists).
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="primary">Geographic</Typography>
              <Typography variant="body2" color="text.secondary">
                Assigns based on location/territory matching between entity and agent.
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="primary">Score Based</Typography>
              <Typography variant="body2" color="text.secondary">
                High-value leads (high scores) go to top performers, lower scores to average performers.
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="primary">Hybrid</Typography>
              <Typography variant="body2" color="text.secondary">
                Combines multiple factors: workload, skills, performance, score match, and geography for optimal assignment.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  // Render agents tab
  const renderAgentsSettings = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Agent Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenAgentDialog()}
        >
          Add Agent
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Territory</TableCell>
              <TableCell>Performance Tier</TableCell>
              <TableCell>Max Capacity</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agents.map((agent) => (
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
                    icon={agent.active ? <CheckCircleIcon /> : <CancelIcon />}
                    label={agent.active ? 'Active' : 'Inactive'}
                    color={agent.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {agent.skills?.slice(0, 2).map((skill) => (
                      <Chip key={skill} label={skill} size="small" />
                    ))}
                    {agent.skills?.length > 2 && (
                      <Tooltip title={agent.skills.slice(2).join(', ')}>
                        <Chip label={`+${agent.skills.length - 2}`} size="small" />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {agent.territory?.slice(0, 2).join(', ')}
                    {agent.territory?.length > 2 && ` +${agent.territory.length - 2}`}
                  </Typography>
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
                <TableCell>{agent.maxCapacity || 50}</TableCell>
                <TableCell align="right">
                  <Tooltip title={agent.active ? 'Deactivate' : 'Activate'}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleAgent(agent.id)}
                      color={agent.active ? 'default' : 'primary'}
                    >
                      {agent.active ? <CancelIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenAgentDialog(agent)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Agent Dialog */}
      <Dialog open={agentDialogOpen} onClose={handleCloseAgentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAgent ? 'Edit Agent' : 'Add New Agent'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Agent ID"
                value={agentForm.id}
                onChange={(e) => setAgentForm({ ...agentForm, id: e.target.value })}
                disabled={!!editingAgent}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={agentForm.name}
                onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={agentForm.email}
                onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Performance Tier</InputLabel>
                <Select
                  value={agentForm.performanceTier}
                  onChange={(e) => setAgentForm({ ...agentForm, performanceTier: e.target.value })}
                  label="Performance Tier"
                >
                  <MenuItem value="top">Top Performer</MenuItem>
                  <MenuItem value="high">High Performer</MenuItem>
                  <MenuItem value="average">Average</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Capacity"
                value={agentForm.maxCapacity}
                onChange={(e) => setAgentForm({ ...agentForm, maxCapacity: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Skills</InputLabel>
                <Select
                  multiple
                  value={agentForm.skills}
                  onChange={(e) => setAgentForm({ ...agentForm, skills: e.target.value })}
                  label="Skills"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(AGENT_SKILLS).map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Territory (comma-separated)"
                value={agentForm.territory?.join(', ') || ''}
                onChange={(e) => setAgentForm({
                  ...agentForm,
                  territory: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                })}
                placeholder="e.g., Mumbai, Maharashtra"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAgentDialog}>Cancel</Button>
          <Button onClick={handleSaveAgent} variant="contained" startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // Render import/export tab
  const renderImportExport = () => (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Export Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Export your auto-assignment configuration and agent data to a JSON file.
          </Typography>
          <Button variant="contained" onClick={handleExport}>
            Export Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Import Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Import a previously exported configuration file.
          </Typography>
          <input
            accept="application/json"
            style={{ display: 'none' }}
            id="import-config-file"
            type="file"
            onChange={handleImport}
          />
          <label htmlFor="import-config-file">
            <Button variant="outlined" component="span">
              Import Configuration
            </Button>
          </label>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Auto-Assignment Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure automatic assignment rules for leads, cases, and tasks
        </Typography>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="General" />
          <Tab label="Strategies" />
          <Tab label="Agents" />
          <Tab label="Import/Export" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && renderGeneralSettings()}
        {currentTab === 1 && renderStrategiesSettings()}
        {currentTab === 2 && renderAgentsSettings()}
        {currentTab === 3 && renderImportExport()}
      </Box>
    </Box>
  );
};

export default AutoAssignmentSettings;
