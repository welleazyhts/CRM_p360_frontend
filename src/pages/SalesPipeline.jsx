import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  alpha,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  DragIndicator as DragIndicatorIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import { listPipelines, getPipeline, addStage, updateStage, deleteStage, reorderStages } from '../services/pipelineService';

// Default mock pipeline stages (will be replaced by service data when available)
const defaultPipelineStages = [
  { id: 'new', name: 'New Leads', color: '#A4D7E1', order: 1 },
  { id: 'contacted', name: 'Contacted', color: '#B3EBD5', order: 2 },
  { id: 'qualified', name: 'Qualified', color: '#F2C94C', order: 3 },
  { id: 'proposal', name: 'Proposal', color: '#E0F7FA', order: 4 },
  { id: 'negotiation', name: 'Negotiation', color: '#6B8E23', order: 5 },
  { id: 'closed-won', name: 'Closed Won', color: '#4CAF50', order: 6 },
  { id: 'closed-lost', name: 'Closed Lost', color: '#F44336', order: 7 }
];

// Mock leads data with pipeline stages
const mockPipelineLeads = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    company: 'Tech Solutions Inc.',
    position: 'CEO',
    value: 50000,
    expectedCloseDate: '2024-02-15',
    lastContactDate: '2024-01-15',
    assignedTo: 'Sarah Johnson',
    assignedToId: 'sarah.johnson',
    stage: 'new',
    priority: 'High',
    notes: 'Interested in premium insurance package.',
    tags: ['Premium', 'Enterprise'],
    createdAt: '2024-01-10'
  },
  {
    id: 2,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1-555-0456',
    company: 'Healthcare Plus',
    position: 'HR Director',
    value: 35000,
    expectedCloseDate: '2024-02-20',
    lastContactDate: '2024-01-12',
    assignedTo: 'Mike Wilson',
    assignedToId: 'mike.wilson',
    stage: 'contacted',
    priority: 'Medium',
    notes: 'Follow up scheduled for next week.',
    tags: ['Healthcare', 'Medium'],
    createdAt: '2024-01-08'
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@enterprise.com',
    phone: '+1-555-0789',
    company: 'Enterprise Corp',
    position: 'CFO',
    value: 75000,
    expectedCloseDate: '2024-03-01',
    lastContactDate: '2024-01-14',
    assignedTo: 'Sarah Johnson',
    assignedToId: 'sarah.johnson',
    stage: 'qualified',
    priority: 'High',
    notes: 'Budget approved, ready for proposal.',
    tags: ['Enterprise', 'High Value'],
    createdAt: '2024-01-05'
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.w@startup.com',
    phone: '+1-555-0321',
    company: 'StartupXYZ',
    position: 'Founder',
    value: 25000,
    expectedCloseDate: '2024-02-28',
    lastContactDate: '2024-01-16',
    assignedTo: 'Mike Wilson',
    assignedToId: 'mike.wilson',
    stage: 'proposal',
    priority: 'Medium',
    notes: 'Proposal sent, waiting for feedback.',
    tags: ['Startup', 'Small'],
    createdAt: '2024-01-12'
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.b@retail.com',
    phone: '+1-555-0654',
    company: 'Retail Chain',
    position: 'Operations Manager',
    value: 40000,
    expectedCloseDate: '2024-02-25',
    lastContactDate: '2024-01-17',
    assignedTo: 'Sarah Johnson',
    assignedToId: 'sarah.johnson',
    stage: 'negotiation',
    priority: 'High',
    notes: 'Negotiating terms and pricing.',
    tags: ['Retail', 'Chain'],
    createdAt: '2024-01-09'
  },
  {
    id: 6,
    firstName: 'Lisa',
    lastName: 'Garcia',
    email: 'lisa.g@tech.com',
    phone: '+1-555-0987',
    company: 'Tech Innovations',
    position: 'CTO',
    value: 60000,
    expectedCloseDate: '2024-01-30',
    lastContactDate: '2024-01-18',
    assignedTo: 'Mike Wilson',
    assignedToId: 'mike.wilson',
    stage: 'closed-won',
    priority: 'High',
    notes: 'Deal closed successfully!',
    tags: ['Tech', 'Won'],
    createdAt: '2024-01-03'
  }
];

// Mock customer history data
const mockCustomerHistory = {
  'lisa.g@tech.com': [
    {
      id: 'POL001',
      policyNumber: 'TECH2024001',
      type: 'Health Insurance',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premium: 45000,
      status: 'Active',
      coverage: '₹5,00,000',
      details: 'Group Health Insurance for 50 employees'
    },
    {
      id: 'POL002',
      policyNumber: 'TECH2023001',
      type: 'Cyber Insurance',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      premium: 35000,
      status: 'Expired',
      coverage: '₹2,00,000',
      details: 'Data breach and cyber liability coverage'
    }
  ],
  'john.doe@example.com': [
    {
      id: 'POL003',
      policyNumber: 'AUTO2024001',
      type: 'Vehicle Insurance',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      premium: 25000,
      status: 'Active',
      coverage: '₹1,50,000',
      details: 'Commercial fleet insurance - 5 vehicles'
    }
  ]
};

const SalesPipeline = () => {
  const theme = useTheme();
  const [leads, setLeads] = useState(mockPipelineLeads);
  const [filteredLeads, setFilteredLeads] = useState(mockPipelineLeads);
  const [pipelineStages, setPipelineStages] = useState(defaultPipelineStages);
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState(null);

  // Stage dialog state
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [stageEditing, setStageEditing] = useState(null);
  const [stageName, setStageName] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customerHistory, setCustomerHistory] = useState([]);

  // Load customer history when a lead is selected
  useEffect(() => {
    if (selectedLead) {
      const history = mockCustomerHistory[selectedLead.email] || [];
      setCustomerHistory(history);
    } else {
      setCustomerHistory([]);
    }
  }, [selectedLead]);

  // Load pipelines and stages from pipelineService
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await listPipelines({ page: 1, limit: 10 });
        if (!mounted) return;
        const fetched = res.pipelines || [];
        setPipelines(fetched);
        if (fetched.length > 0) setSelectedPipelineId(fetched[0].id);
        // If there is at least one pipeline, load its stages
        if (fetched.length > 0) {
          try {
            const p = await getPipeline(fetched[0].id);
            if (!mounted) return;
            if (p && p.stages) {
              // Map stages to UI shape with color placeholders
              const mapped = p.stages.map((s, idx) => ({
                id: s.id,
                name: s.name,
                color: ['#A4D7E1', '#B3EBD5', '#F2C94C', '#E0F7FA', '#6B8E23', '#4CAF50', '#F44336'][idx % 7],
                order: s.order || idx + 1
              }));
              setPipelineStages(mapped);
            }
          } catch (e) {
            // ignore pipeline fetch error, keep defaults
          }
        }
      } catch (e) {
        // keep defaults on error
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Stage CRUD handlers
  const handleOpenStageDialog = (stage = null) => {
    setStageEditing(stage);
    setStageName(stage ? stage.name : '');
    setStageDialogOpen(true);
  };

  const handleCloseStageDialog = () => {
    setStageDialogOpen(false);
    setStageEditing(null);
    setStageName('');
  };

  const handleSaveStage = async () => {
    if (!selectedPipelineId) {
      setSnackbar({ open: true, message: 'No pipeline selected', severity: 'error' });
      return;
    }
    try {
      if (stageEditing) {
        const updated = await updateStage(selectedPipelineId, stageEditing.id, { name: stageName });
        setPipelineStages(prev => prev.map(s => s.id === updated.id ? { ...s, name: updated.name } : s));
        setSnackbar({ open: true, message: 'Stage updated', severity: 'success' });
      } else {
        const created = await addStage(selectedPipelineId, { name: stageName });
        setPipelineStages(prev => [...prev, { id: created.id, name: created.name, color: '#E0F7FA', order: created.order || prev.length + 1 }]);
        setSnackbar({ open: true, message: 'Stage added', severity: 'success' });
      }
    } catch (e) {
      setSnackbar({ open: true, message: `Error saving stage: ${e.message}`, severity: 'error' });
    } finally {
      handleCloseStageDialog();
    }
  };

  const handleDeleteStage = async (stageId) => {
    if (!selectedPipelineId) {
      setSnackbar({ open: true, message: 'No pipeline selected', severity: 'error' });
      return;
    }
    if (!window.confirm('Delete stage? This cannot be undone.')) return;
    try {
      await deleteStage(selectedPipelineId, stageId);
      setPipelineStages(prev => prev.filter(s => s.id !== stageId));
      setSnackbar({ open: true, message: 'Stage deleted', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: `Error deleting stage: ${e.message}`, severity: 'error' });
    }
  };

  const handleSelectPipeline = async (id) => {
    setSelectedPipelineId(id);
    try {
      const p = await getPipeline(id);
      if (p && p.stages) {
        const mapped = p.stages.map((s, idx) => ({ id: s.id, name: s.name, color: ['#A4D7E1', '#B3EBD5', '#F2C94C', '#E0F7FA', '#6B8E23', '#4CAF50', '#F44336'][idx % 7], order: s.order || idx + 1 }));
        setPipelineStages(mapped);
      }
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to load pipeline stages', severity: 'warning' });
    }
  };

  const handleMoveStage = async (stageId, direction) => {
    const idx = pipelineStages.findIndex(s => s.id === stageId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= pipelineStages.length) return;
    const newStages = pipelineStages.slice();
    // swap order
    const a = newStages[idx];
    const b = newStages[targetIdx];
    const aOrder = a.order || idx + 1;
    const bOrder = b.order || targetIdx + 1;
    a.order = bOrder;
    b.order = aOrder;
    newStages[idx] = b;
    newStages[targetIdx] = a;
    newStages.sort((x, y) => (x.order || 0) - (y.order || 0));
    setPipelineStages(newStages);
    // persist order
    try {
      const orderPayload = newStages.map(s => ({ id: s.id, order: s.order }));
      await reorderStages(selectedPipelineId, orderPayload);
      setSnackbar({ open: true, message: 'Stages reordered', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Failed to persist reorder', severity: 'warning' });
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    value: '',
    expectedCloseDate: '',
    assignedTo: '',
    assignedToId: '',
    stage: 'new',
    priority: 'Medium',
    notes: '',
    tags: []
  });

  // Mock users for assignment
  const users = [
    { id: 'sarah.johnson', name: 'Sarah Johnson' },
    { id: 'mike.wilson', name: 'Mike Wilson' },
    { id: 'jane.doe', name: 'Jane Doe' },
    { id: 'bob.smith', name: 'Bob Smith' }
  ];

  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
  // Filter leads based on search and filter
  useEffect(() => {
    let filtered = leads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stage filter
    if (filter !== 'all') {
      const stageId = pipelineStages.find(s => s.name === filter)?.id;
      if (stageId) {
        filtered = filtered.filter(lead => lead.stage === stageId);
      }
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, filter, pipelineStages]);

  // Get leads by stage
  const getLeadsByStage = (stageId) => {
    return filteredLeads.filter(lead => lead.stage === stageId);
  };

  // Get stage info


  // Calculate stage totals
  const getStageTotal = (stageId) => {
    const stageLeads = getLeadsByStage(stageId);
    return stageLeads.reduce((total, lead) => total + (lead.value || 0), 0);
  };

  // Drag and drop handlers
  const handleDragStart = (e, lead) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(lead));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const element = e.currentTarget;
    if (element && element.style) {
      element.style.backgroundColor = alpha(theme.palette.primary.main, 0.05);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    const element = e.currentTarget;
    if (element && element.style) {
      element.style.backgroundColor = 'transparent';
    }
  };

  const handleDrop = (e, newStage) => {
    e.preventDefault();
    const element = e.currentTarget;
    if (element && element.style) {
      element.style.backgroundColor = 'transparent';
    }

    try {
      const lead = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (lead.stage !== newStage) {
        const updatedLeads = leads.map(l =>
          l.id === lead.id
            ? { ...l, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] }
            : l
        );
        setLeads(updatedLeads);
        setSnackbar({ open: true, message: 'Lead moved to new stage', severity: 'success' });
      }
    } catch (error) {
      console.error('Error moving lead:', error);
      setSnackbar({ open: true, message: 'Error moving lead', severity: 'error' });
    }
  };

  // Handle lead selection
  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setOpenDialog(true);
  };

  // Handle lead edit
  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setFormData({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      position: lead.position,
      value: lead.value,
      expectedCloseDate: lead.expectedCloseDate,
      assignedTo: lead.assignedTo,
      assignedToId: lead.assignedToId,
      stage: lead.stage,
      priority: lead.priority,
      notes: lead.notes,
      tags: lead.tags
    });
    setOpenDialog(true);
  };

  // Handle save lead
  const handleSaveLead = () => {
    setLoading(true);

    setTimeout(() => {
      if (editingLead) {
        // Update existing lead
        const updatedLeads = leads.map(lead =>
          lead.id === editingLead.id
            ? { ...lead, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : lead
        );
        setLeads(updatedLeads);
        setSnackbar({ open: true, message: 'Lead updated successfully!', severity: 'success' });
      } else {
        // Add new lead
        const newLead = {
          id: Math.max(...leads.map(l => l.id)) + 1,
          ...formData,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          lastContactDate: null
        };
        setLeads([...leads, newLead]);
        setSnackbar({ open: true, message: 'Lead added successfully!', severity: 'success' });
      }

      setLoading(false);
      handleCloseDialog();
    }, 1000);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLead(null);
    setSelectedLead(null);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      'Low': theme.palette.success.main,
      'Medium': theme.palette.warning.main,
      'High': theme.palette.error.main,
      'Urgent': theme.palette.error.dark
    };
    return colors[priority] || theme.palette.grey[500];
  };

  // Calculate pipeline metrics
  const pipelineMetrics = {
    totalLeads: leads.length,
    totalValue: leads.reduce((total, lead) => total + (lead.value || 0), 0),
    wonLeads: leads.filter(lead => lead.stage === 'closed-won').length,
    wonValue: leads.filter(lead => lead.stage === 'closed-won').reduce((total, lead) => total + (lead.value || 0), 0),
    conversionRate: leads.length > 0 ? (leads.filter(lead => lead.stage === 'closed-won').length / leads.length * 100).toFixed(1) : 0
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600" color="primary">
          Sales Pipeline
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingLead(null);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              company: '',
              position: '',
              value: '',
              expectedCloseDate: '',
              assignedTo: '',
              assignedToId: '',
              stage: 'new',
              priority: 'Medium',
              notes: '',
              tags: []
            });
            setOpenDialog(true);
          }}
        >
          Add Lead
        </Button>
      </Box>

      {/* Pipeline selector + stage management */}
      <Card className="healthcare-card" sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pipeline</InputLabel>
              <Select
                value={selectedPipelineId || ''}
                label="Pipeline"
                onChange={(e) => handleSelectPipeline(e.target.value)}
              >
                {pipelines.length === 0 && (
                  <MenuItem value="">Default Pipeline</MenuItem>
                )}
                {pipelines.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenStageDialog(null)}>
              Add Stage
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Pipeline Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="primary.main">
                {pipelineMetrics.totalLeads}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Leads
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="info.main">
                ₹{pipelineMetrics.totalValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pipeline Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {pipelineMetrics.wonLeads}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Won Deals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="secondary.main">
                ₹{pipelineMetrics.wonValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Won Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {pipelineMetrics.conversionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conversion Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card className="healthcare-card" sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Stage</InputLabel>
                <Select
                  value={filter}
                  label="Filter by Stage"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">All Stages</MenuItem>
                  {pipelineStages.map(stage => (
                    <MenuItem key={stage.id} value={stage.name}>{stage.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Pipeline Stages */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {pipelineStages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);

          return (
            <Paper
              key={stage.id}
              sx={{
                minWidth: 300,
                maxWidth: 300,
                backgroundColor: alpha(stage.color, 0.1),
                border: `2px solid ${alpha(stage.color, 0.3)}`,
                borderRadius: 2
              }}
            >
              {/* Stage Header */}
              <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(stage.color, 0.2)}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="600" color={stage.color}>
                      {stage.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stageLeads.length} leads • ₹{stageTotal.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMoveStage(stage.id, 'up'); }}>
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMoveStage(stage.id, 'down'); }}>
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenStageDialog(stage); }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteStage(stage.id); }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Stage Leads */}
              <Box
                sx={{ p: 1, minHeight: 400 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {stageLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    sx={{
                      mb: 1,
                      cursor: 'grab',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      '&:active': {
                        cursor: 'grabbing'
                      }
                    }}
                    onClick={() => handleLeadClick(lead)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {lead.firstName} {lead.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {lead.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {lead.phone}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLead(lead);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight="500">
                            {lead.company}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {lead.position}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Chip
                          label={lead.priority}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getPriorityColor(lead.priority), 0.1),
                            color: getPriorityColor(lead.priority),
                            borderRadius: 1
                          }}
                        />
                        <Typography variant="body2" fontWeight="600" color="primary">
                          ₹{lead.value?.toLocaleString() || '0'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="primary" fontWeight="600">
                          ₹{lead.value?.toLocaleString() || '0'}
                        </Typography>
                        <Chip
                          label={lead.priority}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getPriorityColor(lead.priority), 0.1),
                            color: getPriorityColor(lead.priority),
                            border: `1px solid ${alpha(getPriorityColor(lead.priority), 0.3)}`
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Assigned to: {lead.assignedTo}
                      </Typography>

                      {lead.expectedCloseDate && (
                        <Typography variant="caption" color="text.secondary">
                          Expected close: {new Date(lead.expectedCloseDate).toLocaleDateString()}
                        </Typography>
                      )}

                      {/* Stage Change Buttons */}
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        {pipelineStages
                          .filter(s => s.id !== lead.stage)
                          .slice(0, 2)
                          .map((nextStage) => (
                            <Button
                              key={nextStage.id}
                              size="small"
                              variant="outlined"
                              sx={{
                                minWidth: 'auto',
                                px: 1,
                                fontSize: '0.7rem',
                                borderColor: alpha(nextStage.color, 0.3),
                                color: nextStage.color,
                                '&:hover': {
                                  borderColor: nextStage.color,
                                  backgroundColor: alpha(nextStage.color, 0.1)
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const mockDragEvent = {
                                  preventDefault: () => { },
                                  dataTransfer: {
                                    getData: () => JSON.stringify(lead)
                                  }
                                };
                                handleDrop(mockDragEvent, nextStage.id);
                              }}
                            >
                              {nextStage.name}
                            </Button>
                          ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Lead Details/Edit Dialog */}
      {/* Stage Add/Edit Dialog */}
      <Dialog open={stageDialogOpen} onClose={handleCloseStageDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{stageEditing ? 'Edit Stage' : 'Add Stage'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Stage Name"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStageDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStage} disabled={!stageName.trim()}>
            {stageEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6">
            {editingLead ? 'Edit Lead' : selectedLead ? 'Lead Details' : 'Add New Lead'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!editingLead && selectedLead}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!editingLead && selectedLead}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editingLead && selectedLead}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editingLead && selectedLead}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!editingLead && selectedLead}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                disabled={!editingLead && selectedLead}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Value (₹)"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                disabled={!editingLead && selectedLead}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expected Close Date"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                disabled={!editingLead && selectedLead}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Stage</InputLabel>
                <Select
                  value={formData.stage}
                  label="Stage"
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  disabled={!editingLead && selectedLead}
                >
                  {pipelineStages.map(stage => (
                    <MenuItem key={stage.id} value={stage.id}>{stage.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  disabled={!editingLead && selectedLead}
                >
                  {priorityOptions.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={formData.assignedToId}
                  label="Assigned To"
                  onChange={(e) => {
                    const user = users.find(u => u.id === e.target.value);
                    setFormData({
                      ...formData,
                      assignedToId: e.target.value,
                      assignedTo: user?.name || ''
                    });
                  }}
                  disabled={!editingLead && selectedLead}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={!editingLead && selectedLead}
              />
            </Grid>

            {/* Customer History Section */}
            {selectedLead && !editingLead && customerHistory.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="600" color="primary.main">
                      Policy History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Previous policies and premium details
                    </Typography>
                  </Box>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Policy Number</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Premium</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Coverage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customerHistory.map((policy) => (
                          <TableRow key={policy.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {policy.policyNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {policy.type}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {policy.details}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(policy.startDate).toLocaleDateString()} -
                                {new Date(policy.endDate).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="600" color="primary">
                                ₹{policy.premium.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={policy.status}
                                size="small"
                                color={policy.status === 'Active' ? 'success' : 'default'}
                                sx={{ borderRadius: 1 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {policy.coverage}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Summary Box */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Total Premium Value</Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="600">
                          ₹{customerHistory.reduce((sum, policy) => sum + policy.premium, 0).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Active Policies</Typography>
                        <Typography variant="h6" fontWeight="600">
                          {customerHistory.filter(policy => policy.status === 'Active').length}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">Total Policies</Typography>
                        <Typography variant="h6" fontWeight="600">
                          {customerHistory.length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          {editingLead && (
            <Button
              variant="contained"
              onClick={handleSaveLead}
              disabled={loading}
              sx={{
                px: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          )}
          {!editingLead && !selectedLead && (
            <Button
              variant="contained"
              onClick={handleSaveLead}
              disabled={loading}
              sx={{
                px: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default SalesPipeline;
