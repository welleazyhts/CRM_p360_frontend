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
import {
  listPipelineItems,
  createPipelineItem,
  updatePipelineItem,
  partiallyUpdatePipelineItem,
  deletePipelineItem,
  filterByStage,
  searchPipelineItems,
  getPipelineSummary,
  getDashboardStats,
  resetFilters
} from '../services/pipelineService';
import { leadService } from '../services/leadService';
import { useTranslation } from 'react-i18next';

// Default stages based on Postman collection endpoints
const defaultPipelineStages = [
  { id: 'new_lead', name: 'New Leads', color: '#A4D7E1', order: 1 },
  { id: 'contacted', name: 'Contacted', color: '#B3EBD5', order: 2 },
  { id: 'qualified', name: 'Qualified', color: '#F2C94C', order: 3 },
  { id: 'proposal_sent', name: 'Proposal', color: '#00ACC1', order: 4 },
  { id: 'negotiation', name: 'Negotiation', color: '#6B8E23', order: 5 },
  { id: 'closed_won', name: 'Closed Won', color: '#4CAF50', order: 6 },
  { id: 'closed_lost', name: 'Closed Lost', color: '#F44336', order: 7 }
];

const SalesPipeline = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  // State
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [pipelineStages, setPipelineStages] = useState(defaultPipelineStages);
  // Removed multi-pipeline state (backend is single pipeline)

  // Stage dialog state (Keeping for UI interaction, though creating stages might not persist via API)
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

  // Metrics from API
  const [metrics, setMetrics] = useState({
    total_leads: 0,
    total_value: 0,
    won_leads: 0,
    won_value: 0,
    conversion_rate: 0
  });

  // Missing form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    value: 0,
    expectedCloseDate: '',
    assignedTo: '',
    assignedToId: '',
    stage: 'new_lead',
    priority: 'Medium',
    notes: '',
    tags: []
  });

  const priorityOptions = ['High', 'Medium', 'Low'];

  // Placeholder for users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await leadService.getAvailableUsers();
        if (Array.isArray(userList)) {
          setUsers(userList);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    loadUsers();
  }, []);

  const getLeadsByStage = (stageId) => {
    // If we are searching, we still want to filter by search term, so we use filteredLeads BUT ignore the stage filter logic from useEffect if we are manually placing them in columns
    // Actually, simpler: If filter is ACTIVE (not all), we are showing only that column. 
    // The previous issue was probably that 'filteredLeads' had nothing if logic was wrong.
    // Let's use 'leads' (all leads) and apply search filter manually here, or just use filteredLeads if the UE logic is correct.
    // The user moved columns. If I select "Qualified" filter, filteredLeads only has Qualified leads. 
    // If I map over ALL stages, other stages have 0 leads.
    // User wants: If I select "Qualified", ONLY "Qualified" column should show (implemented above) AND it should have data.

    // For safety, let's filter from the master search-filtered list if needed, or just rely on filteredLeads if the column filter logic matches.
    // Let's rely on filteredLeads which already has the stage filter applied.
    // wait.. if I select "Qualified", filteredLeads ONLY has qualified. 
    // Then getLeadsByStage('new_lead') returns empty. That's correct for hidden columns.
    // getLeadsByStage('qualified') returns leads. That's correct.
    // So the previous logic was likely fine, but maybe the state update was lagging or 'filter' value mismatch (name vs id).

    // Let's ensure we use the same key for filtering.
    // The Select uses 'stage.name' as value. My lead.stage uses 'stage.id'.
    // If I filter by "Qualified" (name), the useEffect: l.stage === filter (id vs name mismatch).

    // FIX in useEffect:
    return leads.filter(lead => {
      const matchesStage = lead.stage === stageId;
      const matchesSearch = !searchTerm || (
        (lead.firstName && lead.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.lastName && lead.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return matchesStage && matchesSearch;
    });
  };

  // Helpers for mapping
  const mapLeadFromBackend = (item) => ({
    id: item.id,
    firstName: item.first_name,
    lastName: item.last_name,
    email: item.email,
    phone: item.phone,
    company: item.company,
    position: item.position,
    value: parseFloat(item.value) || 0,
    expectedCloseDate: item.expected_close_date,
    stage: item.stage, // e.g., 'negotiation'
    priority: item.priority, // e.g., 'high'
    notes: item.notes,
    assignedTo: item.assigned_to_name || 'Unknown', // Backend might need to send this or we map ID
    assignedToId: item.assigned_to,
    createdAt: item.created_at,
    tags: [] // Backend doesn't seem to have tags in standard body, keeping empty or mapping if available
  });

  const mapLeadToBackend = (data) => ({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    company: data.company,
    position: data.position,
    value: data.value,
    expected_close_date: data.expectedCloseDate,
    stage: data.stage,
    priority: data.priority ? data.priority.toLowerCase() : 'medium',
    notes: data.notes,
    assigned_to: data.assignedToId || null // Send null if no user selected
  });

  // Load customer history when a lead is selected (Mock for now)
  useEffect(() => {
    if (selectedLead) {
      // Placeholder: in real app, fetch history
      setCustomerHistory([]);
    } else {
      setCustomerHistory([]);
    }
  }, [selectedLead]);

  // Load Initial Data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [items, summaryData, statsData] = await Promise.allSettled([
        listPipelineItems(),
        getPipelineSummary(),
        getDashboardStats()
      ]);

      if (items.status === 'fulfilled') {
        const responseData = items.value;
        // Handle both array and paginated response (DRF style)
        const leadsArray = Array.isArray(responseData)
          ? responseData
          : (responseData && Array.isArray(responseData.results) ? responseData.results : []);

        const mapped = leadsArray.map(item => ({
          ...mapLeadFromBackend(item),
          // Ensure stage exists, fallback to 'new_lead' if missing/null
          stage: item.stage || 'new_lead'
        }));
        setLeads(mapped);
        setFilteredLeads(mapped);

        // Calculate metrics client-side to ensure they appear even if API stats are missing/zero
        const totalLeads = mapped.length;
        const totalValue = mapped.reduce((sum, l) => sum + (l.value || 0), 0);
        const wonLeadsList = mapped.filter(l => l.stage === 'closed_won');
        const wonLeads = wonLeadsList.length;
        const wonValue = wonLeadsList.reduce((sum, l) => sum + (l.value || 0), 0);
        const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

        setMetrics({
          total_leads: totalLeads,
          total_value: totalValue,
          won_leads: wonLeads,
          won_value: wonValue,
          conversion_rate: parseFloat(conversionRate.toFixed(1))
        });
      }

      // If we want to use API stats data, we can merge it, but client calculation is often more reliable for immediate feedback
      // So we skip overriding with potentially empty API stats for now or prioritize client stats.

    } catch (error) {
      console.error('Error loading pipeline data:', error);
      setSnackbar({ open: true, message: 'Failed to load pipeline data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search Logic
  useEffect(() => {
    let result = leads;

    // Filter by stage
    if (filter !== 'all') {
      result = result.filter(l => l.stage === filter);
    }

    // Filter by search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(l =>
        (l.firstName && l.firstName.toLowerCase().includes(lower)) ||
        (l.lastName && l.lastName.toLowerCase().includes(lower)) ||
        (l.company && l.company.toLowerCase().includes(lower)) ||
        (l.email && l.email.toLowerCase().includes(lower))
      );
    }

    setFilteredLeads(result);
  }, [leads, filter, searchTerm]);

  // Stage CRUD handlers removed as backend uses standard stages
  const handleOpenStageDialog = (stage = null) => {
    // Optional: allow viewing stage details or editing name strictly for UI? 
    // For now disabling stage editing to match API simplicity
    setSnackbar({ open: true, message: 'Stage management not available in this version', severity: 'info' });
  };

  // Calculate stage totals (client-side from fetched leads)
  const getStageTotal = (stageId) => {
    const stageLeads = getLeadsByStage(stageId);
    return stageLeads.reduce((total, lead) => total + (lead.value || 0), 0);
  };

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

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    const element = e.currentTarget;
    if (element && element.style) {
      element.style.backgroundColor = 'transparent';
    }

    try {
      const leadData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (leadData.stage !== newStage) {
        // Optimistic Update
        const oldStage = leadData.stage;
        const updatedLeads = leads.map(l =>
          l.id === leadData.id
            ? { ...l, stage: newStage }
            : l
        );
        setLeads(updatedLeads);

        // API Call
        try {
          await partiallyUpdatePipelineItem(leadData.id, { stage: newStage });
          setSnackbar({ open: true, message: t('pipeline.messages.leadMoved'), severity: 'success' });
          // Refresh stats
          const stats = await getDashboardStats();
          if (stats) setMetrics(prev => ({ ...prev, ...stats }));
        } catch (err) {
          // Revert on error
          console.error(err);
          const revertedLeads = leads.map(l =>
            l.id === leadData.id
              ? { ...l, stage: oldStage }
              : l
          );
          setLeads(revertedLeads);
          setSnackbar({ open: true, message: 'Failed to move lead', severity: 'error' });
        }
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

  const handleDeleteLead = async (id) => {
    if (!window.confirm(t('pipeline.messages.deleteConfirm') || 'Are you sure you want to delete this lead?')) return;
    try {
      await deletePipelineItem(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      setFilteredLeads(prev => prev.filter(l => l.id !== id));
      setSnackbar({ open: true, message: t('pipeline.messages.leadDeleted') || 'Lead deleted', severity: 'success' });
      fetchData();
    } catch (error) {
      console.error('Error deleting lead:', error);
      setSnackbar({ open: true, message: 'Failed to delete lead', severity: 'error' });
    }
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
      // If assignedToId is missing or object, try to extract from lead or find in users
      assignedToId: (typeof lead.assignedToId === 'object' ? lead.assignedToId?.id : lead.assignedToId) ||
        (typeof lead.assigned_to === 'object' ? lead.assigned_to?.id : lead.assigned_to) || '',
      stage: lead.stage,
      priority: lead.priority,
      notes: lead.notes,
      tags: lead.tags || []
    });
    setOpenDialog(true);
  };

  // Handle save lead
  const handleSaveLead = async () => {
    // Validate assignedTo
    if (!formData.assignedToId) {
      setSnackbar({ open: true, message: 'Please select an assigned user', severity: 'error' });
      return;
    }

    // Check if user exists in the list (optional safety)
    const isValidUser = users.some(u => u.id === formData.assignedToId);
    if (!isValidUser && users.length > 0) {
      // If users were loaded but the ID is not found, it's invalid. 
      // If users list is empty (failed to load), we might skip this check or warn.
      setSnackbar({ open: true, message: 'Invalid assigned user selected', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const payload = mapLeadToBackend(formData);

      // Double check payload assigned_to is not object
      if (typeof payload.assigned_to === 'object' && payload.assigned_to !== null) {
        payload.assigned_to = payload.assigned_to.id;
      }

      if (editingLead) {
        await updatePipelineItem(editingLead.id, payload);
        setSnackbar({ open: true, message: t('pipeline.messages.leadUpdated'), severity: 'success' });
      } else {
        await createPipelineItem(payload);
        setSnackbar({ open: true, message: t('pipeline.messages.leadAdded'), severity: 'success' });
      }
      handleCloseDialog();
      fetchData(); // Reload all data/stats
    } catch (error) {
      console.error('Error saving lead:', error);
      // Extract error message if available
      const errMsg = error.response?.data?.errors?.assigned_to?.[0] || 'Failed to save lead';
      setSnackbar({ open: true, message: errMsg, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLead(null);
    setSelectedLead(null);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const p = (priority || '').toLowerCase();
    const colors = {
      'low': theme.palette.success.main,
      'medium': theme.palette.warning.main,
      'high': theme.palette.error.main,
      'urgent': theme.palette.error.dark
    };
    return colors[p] || theme.palette.grey[500];
  };

  // Use metrics from API
  const pipelineMetrics = {
    totalLeads: metrics.total_leads || 0,
    totalValue: metrics.total_value || 0,
    wonLeads: metrics.won_leads || metrics.closed_won_count || 0,
    wonValue: metrics.won_value || metrics.closed_won_value || 0,
    conversionRate: metrics.conversion_rate || 0
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600" color="primary">
          {t('pipeline.title')}
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
              stage: 'new_lead',
              priority: 'Medium',
              notes: '',
              tags: []
            });
            setOpenDialog(true);
          }}
        >
          {t('pipeline.buttons.addLead')}
        </Button>
      </Box>



      {/* Pipeline Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card className="healthcare-card">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="primary.main">
                {pipelineMetrics.totalLeads}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('pipeline.metrics.totalLeads')}
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
                {t('pipeline.metrics.totalValue')}
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
                {t('pipeline.metrics.wonDeals')}
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
                {t('pipeline.metrics.wonValue')}
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
                {t('pipeline.metrics.conversionRate')}
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
                placeholder={t('pipeline.filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('pipeline.filters.filterByStage')}</InputLabel>
                <Select
                  value={filter}
                  label={t('pipeline.filters.filterByStage')}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">{t('pipeline.filters.allStages')}</MenuItem>
                  {pipelineStages.map(stage => (
                    <MenuItem key={stage.id} value={stage.id}>{t(`pipeline.stages.${stage.id}`, { defaultValue: stage.name })}</MenuItem>
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
                {t('pipeline.buttons.resetFilters')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Pipeline Stages */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {pipelineStages
          .filter(stage => filter === 'all' || stage.name === filter || stage.id === filter)
          .map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <Paper
                key={stage.id}
                sx={{
                  minWidth: 360,
                  maxWidth: 360,
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
                        {t(`pipeline.stages.${stage.id}`, { defaultValue: stage.name })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stageLeads.length} {t('pipeline.stage.leads')} • ₹{stageTotal.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      {/* Stage management custom buttons removed */}
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
                  {stageLeads.map((lead) => {
                    // Calculate next stages logic
                    const currentStageIndex = pipelineStages.findIndex(s => s.id === lead.stage);
                    // Get next 2 stages if available, otherwise just remaining stages
                    let quickMoveStages = [];
                    if (currentStageIndex !== -1 && currentStageIndex < pipelineStages.length - 1) {
                      quickMoveStages = pipelineStages.slice(currentStageIndex + 1, currentStageIndex + 3);
                    } else {
                      // If last stage or not found, show 'new_lead' or others
                      quickMoveStages = pipelineStages.filter(s => s.id !== lead.stage).slice(0, 2);
                    }

                    return (
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
                                {lead.firstName && lead.firstName.charAt(0)}{lead.lastName && lead.lastName.charAt(0)}
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
                            <Box sx={{ minWidth: 65, display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditLead(lead);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLead(lead.id);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
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
                              label={t(`pipeline.priority.${lead.priority.toLowerCase()}`, { defaultValue: lead.priority })}
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

                          {/* Removed duplicate Box (lines 889-902 in original) as it showed duplicate data */}

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 1 }}>
                            {t('pipeline.leadCard.assignedTo')} {lead.assignedTo}
                          </Typography>

                          {lead.expectedCloseDate && (
                            <Typography variant="caption" color="text.secondary">
                              {t('pipeline.leadCard.expectedClose')} {new Date(lead.expectedCloseDate).toLocaleDateString()}
                            </Typography>
                          )}

                          {/* Stage Change Buttons */}
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                            {quickMoveStages
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
                                  {t(`pipeline.stages.${nextStage.id}`, { defaultValue: nextStage.name })}
                                </Button>
                              ))}
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </Paper>
            );
          })}
      </Box>

      {/* Lead Details/Edit Dialog */}
      {/* Stage Add/Edit Dialog */}

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
            {editingLead ? t('pipeline.dialog.editTitle') : selectedLead ? t('pipeline.dialog.detailsTitle') : t('pipeline.dialog.addTitle')}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Form Fields ... */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('pipeline.dialog.firstName')}
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!editingLead && selectedLead}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('pipeline.dialog.lastName')}
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!editingLead && selectedLead}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('pipeline.dialog.email')}
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
                label={t('pipeline.dialog.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editingLead && selectedLead}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('pipeline.dialog.company')}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!editingLead && selectedLead}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('pipeline.dialog.position')}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                disabled={!editingLead && selectedLead}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('pipeline.dialog.value')}
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
                label={t('pipeline.dialog.expectedCloseDate')}
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                disabled={!editingLead && selectedLead}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('pipeline.dialog.stage')}</InputLabel>
                <Select
                  value={formData.stage}
                  label={t('pipeline.dialog.stage')}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  disabled={!editingLead && selectedLead}
                >
                  {pipelineStages.map(stage => (
                    <MenuItem key={stage.id} value={stage.id}>{t(`pipeline.stages.${stage.id}`, { defaultValue: stage.name })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('pipeline.dialog.priority')}</InputLabel>
                <Select
                  value={formData.priority}
                  label={t('pipeline.dialog.priority')}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  disabled={!editingLead && selectedLead}
                >
                  {priorityOptions.map(priority => (
                    <MenuItem key={priority} value={priority}>{t(`pipeline.priority.${priority.toLowerCase()}`, { defaultValue: priority })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('pipeline.dialog.assignedTo')}</InputLabel>
                <Select
                  value={formData.assignedToId}
                  label={t('pipeline.dialog.assignedTo')}
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
                label={t('pipeline.dialog.notes')}
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
                      {t('pipeline.history.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('pipeline.history.subtitle')}
                    </Typography>
                  </Box>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('pipeline.history.policyNumber')}</TableCell>
                          <TableCell>{t('pipeline.history.type')}</TableCell>
                          <TableCell>{t('pipeline.history.period')}</TableCell>
                          <TableCell align="right">{t('pipeline.history.premium')}</TableCell>
                          <TableCell>{t('pipeline.history.status')}</TableCell>
                          <TableCell>{t('pipeline.history.coverage')}</TableCell>
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
                                label={t(`pipeline.status.${policy.status.toLowerCase()}`, { defaultValue: policy.status })}
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
                        <Typography variant="body2" color="text.secondary">{t('pipeline.history.totalPremium')}</Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="600">
                          ₹{customerHistory.reduce((sum, policy) => sum + policy.premium, 0).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">{t('pipeline.history.activePolicies')}</Typography>
                        <Typography variant="h6" fontWeight="600">
                          {customerHistory.filter(policy => policy.status === 'Active').length}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">{t('pipeline.history.totalPolicies')}</Typography>
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
            {t('pipeline.buttons.cancel')}
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
              {loading ? <CircularProgress size={24} /> : t('pipeline.buttons.update')}
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
              {loading ? <CircularProgress size={24} /> : t('pipeline.buttons.save')}
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
