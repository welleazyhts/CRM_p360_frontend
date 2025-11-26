import React, { useState, useEffect } from 'react';
import trainingService from '../services/trainingService';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Stack,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Badge,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  Checkbox,
  FormGroup,
} from '@mui/material';
import {
  School as TrainingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  PlayCircle as PlayIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  Description as DocIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  EmojiEvents as TrophyIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  Code as CodeIcon,
  Computer as ComputerIcon,
  Laptop as LaptopIcon,
} from '@mui/icons-material';

const TrainingManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [moduleDialog, setModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [documentDialog, setDocumentDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);

  // Process Training states
  const [processDetailDialog, setProcessDetailDialog] = useState(false);
  const [selectedProcessModule, setSelectedProcessModule] = useState(null);

  // Load data from API on component mount
  useEffect(() => {
    loadTrainingModules();
    loadAgentProgress();
  }, []);

  const loadTrainingModules = async () => {
    try {
      setLoading(true);
      const data = await trainingService.getTrainingModules();
      setModules(data);
    } catch (error) {
      console.error('Error loading training modules:', error);
      setSnackbar({ open: true, message: 'Failed to load training modules', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadAgentProgress = async () => {
    try {
      const data = await trainingService.getAgentProgress();
      setAgentProgress(data);
    } catch (error) {
      console.error('Error loading agent progress:', error);
    }
  };

  // Training Modules State
  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Insurance Products Deep Dive',
      category: 'Product Knowledge',
      level: 'Advanced',
      duration: '4 hours',
      enrolledAgents: 15,
      completionRate: 87,
      documents: [
        { id: 1, name: 'Health Insurance Guide.pdf', type: 'pdf', size: '2.5 MB', uploadDate: '2025-01-05' },
        { id: 2, name: 'Product Overview Video.mp4', type: 'video', size: '45 MB', uploadDate: '2025-01-05' },
        { id: 3, name: 'Policy Terms.docx', type: 'doc', size: '1.2 MB', uploadDate: '2025-01-06' },
      ],
      assessments: 3,
      passingScore: 80,
      createdBy: 'Admin',
      createdDate: '2025-01-05',
      status: 'Active',
      description: 'Comprehensive training on all insurance products including health, life, and motor insurance',
    },
    {
      id: 2,
      title: 'Customer Communication Skills',
      category: 'Soft Skills',
      level: 'Intermediate',
      duration: '3 hours',
      enrolledAgents: 22,
      completionRate: 95,
      documents: [
        { id: 4, name: 'Communication Techniques.pdf', type: 'pdf', size: '1.8 MB', uploadDate: '2025-01-03' },
        { id: 5, name: 'Role Play Examples.mp4', type: 'video', size: '32 MB', uploadDate: '2025-01-03' },
      ],
      assessments: 2,
      passingScore: 75,
      createdBy: 'Admin',
      createdDate: '2025-01-03',
      status: 'Active',
      description: 'Essential communication skills for effective customer interactions and objection handling',
    },
    {
      id: 3,
      title: 'CRM System Navigation',
      category: 'Portal Training',
      level: 'Beginner',
      duration: '2 hours',
      enrolledAgents: 30,
      completionRate: 78,
      documents: [
        { id: 6, name: 'CRM User Manual.pdf', type: 'pdf', size: '3.2 MB', uploadDate: '2025-01-01' },
        { id: 7, name: 'CRM Tutorial.mp4', type: 'video', size: '28 MB', uploadDate: '2025-01-01' },
        { id: 8, name: 'Quick Reference Guide.pdf', type: 'pdf', size: '800 KB', uploadDate: '2025-01-02' },
      ],
      assessments: 1,
      passingScore: 70,
      createdBy: 'Admin',
      createdDate: '2025-01-01',
      status: 'Active',
      description: 'Learn how to navigate and utilize all features of our CRM portal effectively',
    },
    {
      id: 4,
      title: 'Sales Process & Best Practices',
      category: 'Process Training',
      level: 'Intermediate',
      duration: '5 hours',
      enrolledAgents: 18,
      completionRate: 72,
      documents: [
        { id: 9, name: 'Sales Process Guide.pdf', type: 'pdf', size: '2.1 MB', uploadDate: '2024-12-28' },
        { id: 10, name: 'Best Practices Video.mp4', type: 'video', size: '52 MB', uploadDate: '2024-12-28' },
        { id: 11, name: 'Sales Scripts.docx', type: 'doc', size: '1.5 MB', uploadDate: '2024-12-29' },
      ],
      assessments: 4,
      passingScore: 85,
      createdBy: 'Admin',
      createdDate: '2024-12-28',
      status: 'Active',
      description: 'Complete sales process from lead generation to policy closure with proven techniques',
    },
  ]);

  // Agent Training Progress
  const [agentProgress, setAgentProgress] = useState([
    {
      agentId: 'EMP001',
      agentName: 'Rajesh Kumar',
      department: 'Sales',
      totalModules: 12,
      completedModules: 10,
      inProgressModules: 2,
      totalHours: 48,
      completedHours: 42,
      averageScore: 88,
      certificatesEarned: 8,
      lastActivity: '2025-01-10',
      rank: 1,
    },
    {
      agentId: 'EMP002',
      agentName: 'Priya Sharma',
      department: 'Sales',
      totalModules: 12,
      completedModules: 11,
      inProgressModules: 1,
      totalHours: 48,
      completedHours: 46,
      averageScore: 92,
      certificatesEarned: 10,
      lastActivity: '2025-01-11',
      rank: 2,
    },
    {
      agentId: 'EMP003',
      agentName: 'Amit Patel',
      department: 'Sales',
      totalModules: 10,
      completedModules: 7,
      inProgressModules: 2,
      totalHours: 40,
      completedHours: 28,
      averageScore: 76,
      certificatesEarned: 5,
      lastActivity: '2025-01-09',
      rank: 3,
    },
  ]);

  // Process Training Modules
  const [processModules] = useState([
    {
      id: 'P1',
      title: 'Lead Qualification Process',
      description: 'Learn to qualify leads effectively using BANT methodology',
      duration: '1.5 hours',
      topics: ['BANT Framework', 'Questioning Techniques', 'Lead Scoring', 'Documentation'],
      completionRate: 85,
      enrolled: 25,
    },
    {
      id: 'P2',
      title: 'Policy Issuance Workflow',
      description: 'Step-by-step guide for processing and issuing insurance policies',
      duration: '2 hours',
      topics: ['Document Verification', 'Premium Calculation', 'Policy Generation', 'Quality Checks'],
      completionRate: 78,
      enrolled: 20,
    },
    {
      id: 'P3',
      title: 'Claims Processing Fundamentals',
      description: 'Understanding claims workflow from initiation to settlement',
      duration: '3 hours',
      topics: ['Claim Registration', 'Document Review', 'Approval Process', 'Settlement'],
      completionRate: 72,
      enrolled: 15,
    },
    {
      id: 'P4',
      title: 'Compliance & Regulatory Guidelines',
      description: 'Essential compliance requirements and regulatory standards',
      duration: '2.5 hours',
      topics: ['IRDAI Regulations', 'Data Protection', 'Ethical Practices', 'Audit Requirements'],
      completionRate: 90,
      enrolled: 28,
    },
  ]);

  // Portal Training Modules
  const [portalModules] = useState([
    {
      id: 'PT1',
      title: 'Dashboard & Analytics',
      description: 'Navigate dashboards and interpret key performance metrics',
      duration: '1 hour',
      topics: ['Dashboard Layout', 'KPI Widgets', 'Custom Reports', 'Data Export'],
      completionRate: 92,
      enrolled: 30,
    },
    {
      id: 'PT2',
      title: 'Lead Management System',
      description: 'Master lead capture, assignment, and tracking features',
      duration: '1.5 hours',
      topics: ['Lead Import', 'Lead Assignment', 'Follow-up Tracking', 'Disposition Management'],
      completionRate: 88,
      enrolled: 28,
    },
    {
      id: 'PT3',
      title: 'Call Management Features',
      description: 'Utilize dialer, recording, and call quality features',
      duration: '2 hours',
      topics: ['Dialer Configuration', 'Call Recording', 'Quality Assessment', 'Analytics'],
      completionRate: 75,
      enrolled: 22,
    },
    {
      id: 'PT4',
      title: 'Quote & Policy Management',
      description: 'Create quotes and manage policy lifecycle in the system',
      duration: '2.5 hours',
      topics: ['Quote Generation', 'Premium Calculator', 'Policy Tracking', 'Renewal Management'],
      completionRate: 82,
      enrolled: 25,
    },
    {
      id: 'PT5',
      title: 'Reporting & Insights',
      description: 'Generate custom reports and analyze performance data',
      duration: '1.5 hours',
      topics: ['Report Builder', 'Custom Filters', 'Scheduled Reports', 'Data Visualization'],
      completionRate: 68,
      enrolled: 18,
    },
  ]);

  // Module Form
  const [moduleForm, setModuleForm] = useState({
    title: '',
    category: '',
    level: '',
    duration: '',
    passingScore: 70,
    description: '',
    status: 'Active',
  });

  // Document Form
  const [documentForm, setDocumentForm] = useState({
    name: '',
    type: '',
    size: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModuleDialog = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({
        title: module.title,
        category: module.category,
        level: module.level,
        duration: module.duration,
        passingScore: module.passingScore,
        description: module.description,
        status: module.status,
      });
    } else {
      setEditingModule(null);
      setModuleForm({
        title: '',
        category: '',
        level: '',
        duration: '',
        passingScore: 70,
        description: '',
        status: 'Active',
      });
    }
    setModuleDialog(true);
  };

  const handleCloseModuleDialog = () => {
    setModuleDialog(false);
    setEditingModule(null);
  };

  const handleSaveModule = async () => {
    try {
      if (editingModule) {
        const updatedModule = await trainingService.updateTrainingModule(editingModule.id, moduleForm);
        setModules(modules.map(m => m.id === editingModule.id ? {
          ...m,
          ...moduleForm,
        } : m));
        setSnackbar({ open: true, message: 'Module updated successfully!', severity: 'success' });
      } else {
        const newModule = await trainingService.createTrainingModule(moduleForm);
        setModules([...modules, {
          ...newModule,
          enrolledAgents: 0,
          completionRate: 0,
          documents: [],
          assessments: 0,
        }]);
        setSnackbar({ open: true, message: 'Module created successfully!', severity: 'success' });
      }
      handleCloseModuleDialog();
    } catch (error) {
      console.error('Error saving module:', error);
      setSnackbar({ open: true, message: 'Failed to save module', severity: 'error' });
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await trainingService.deleteTrainingModule(moduleId);
      setModules(modules.filter(m => m.id !== moduleId));
      setSnackbar({ open: true, message: 'Module deleted successfully!', severity: 'warning' });
    } catch (error) {
      console.error('Error deleting module:', error);
      setSnackbar({ open: true, message: 'Failed to delete module', severity: 'error' });
    }
  };

  const handleOpenDocumentDialog = (module) => {
    setSelectedModule(module);
    setDocumentForm({ name: '', type: '', size: '' });
    setDocumentDialog(true);
  };

  const handleCloseDocumentDialog = () => {
    setDocumentDialog(false);
    setSelectedModule(null);
  };

  const handleUploadDocument = async () => {
    if (selectedModule && documentForm.name) {
      try {
        const newDocument = await trainingService.uploadDocument(selectedModule.id, documentForm);

        setModules(modules.map(m => m.id === selectedModule.id ? {
          ...m,
          documents: [...m.documents, newDocument],
        } : m));

        setSnackbar({ open: true, message: 'Document uploaded successfully!', severity: 'success' });
        handleCloseDocumentDialog();
      } catch (error) {
        console.error('Error uploading document:', error);
        setSnackbar({ open: true, message: 'Failed to upload document', severity: 'error' });
      }
    }
  };

  const handleDeleteDocument = async (moduleId, documentId) => {
    try {
      await trainingService.deleteDocument(moduleId, documentId);
      setModules(modules.map(m => m.id === moduleId ? {
        ...m,
        documents: m.documents.filter(d => d.id !== documentId),
      } : m));
      setSnackbar({ open: true, message: 'Document deleted successfully!', severity: 'warning' });
    } catch (error) {
      console.error('Error deleting document:', error);
      setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
    }
  };

  // Process Training Handlers
  const handleViewDetails = (module) => {
    setSelectedProcessModule(module);
    setProcessDetailDialog(true);
  };

  const handleStartModule = (module) => {
    setSnackbar({
      open: true,
      message: `Starting module: ${module.title}. Redirecting to training portal...`,
      severity: 'info'
    });
    // TODO: Implement actual module start logic (e.g., navigate to training portal)
    console.log('Starting module:', module);
  };

  const handleDownloadMaterials = (module) => {
    setSnackbar({
      open: true,
      message: `Downloading materials for: ${module.title}`,
      severity: 'success'
    });
    // TODO: Implement actual download logic
    console.log('Downloading materials for module:', module);

    // Simulate download
    const materials = {
      moduleName: module.title,
      topics: module.topics,
      duration: module.duration,
      description: module.description
    };

    // Create a blob and download as JSON (placeholder for actual materials)
    const blob = new Blob([JSON.stringify(materials, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${module.title.replace(/\s+/g, '_')}_Materials.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCloseProcessDetailDialog = () => {
    setProcessDetailDialog(false);
    setSelectedProcessModule(null);
  };


  const getCategoryColor = (category) => {
    const colors = {
      'Product Knowledge': 'primary',
      'Soft Skills': 'secondary',
      'Portal Training': 'info',
      'Process Training': 'success',
    };
    return colors[category] || 'default';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'error',
    };
    return colors[level] || 'default';
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf': return <PdfIcon color="error" />;
      case 'video': return <VideoIcon color="primary" />;
      case 'doc': return <DocIcon color="info" />;
      default: return <DocIcon />;
    }
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrainingIcon fontSize="large" color="primary" />
          Training & Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage training modules, track agent progress, and analyze training effectiveness
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<TrainingIcon />} label="Training Modules" iconPosition="start" />
          <Tab icon={<CodeIcon />} label="Process Training" iconPosition="start" />
          <Tab icon={<ComputerIcon />} label="Portal Training" iconPosition="start" />
          <Tab icon={<TrendingUpIcon />} label="Analytics & Reports" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab 0: Training Modules */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="600">
              Training Modules
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModuleDialog()}
            >
              Create Module
            </Button>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Modules
                      </Typography>
                      <Typography variant="h4" fontWeight="700">
                        {modules.length}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                      <TrainingIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Enrollments
                      </Typography>
                      <Typography variant="h4" fontWeight="700">
                        {modules.reduce((sum, m) => sum + m.enrolledAgents, 0)}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                      <GroupIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Avg. Completion
                      </Typography>
                      <Typography variant="h4" fontWeight="700">
                        {Math.round(modules.reduce((sum, m) => sum + m.completionRate, 0) / modules.length)}%
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                      <TrendingUpIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Documents
                      </Typography>
                      <Typography variant="h4" fontWeight="700">
                        {modules.reduce((sum, m) => sum + m.documents.length, 0)}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                      <DocIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Training Modules Grid */}
          <Grid container spacing={3}>
            {modules.map((module) => (
              <Grid item xs={12} md={6} lg={4} key={module.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {module.title}
                      </Typography>
                      <Chip
                        label={module.status}
                        color={module.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={module.category}
                        color={getCategoryColor(module.category)}
                        size="small"
                      />
                      <Chip
                        label={module.level}
                        color={getLevelColor(module.level)}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimerIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {module.duration}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GroupIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {module.enrolledAgents} enrolled
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DocIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {module.documents.length} documents
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssessmentIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {module.assessments} assessments
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Completion Rate
                        </Typography>
                        <Typography variant="body2" fontWeight="600" color={getCompletionColor(module.completionRate)}>
                          {module.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={module.completionRate}
                        color={getCompletionColor(module.completionRate)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    {module.documents.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="600" gutterBottom>
                          Training Materials
                        </Typography>
                        <List dense>
                          {module.documents.slice(0, 2).map((doc) => (
                            <ListItem
                              key={doc.id}
                              sx={{ px: 0 }}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  size="small"
                                  onClick={() => handleDeleteDocument(module.id, doc.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              }
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {getDocumentIcon(doc.type)}
                              </ListItemIcon>
                              <ListItemText
                                primary={doc.name}
                                secondary={doc.size}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                        {module.documents.length > 2 && (
                          <Typography variant="caption" color="text.secondary">
                            +{module.documents.length - 2} more documents
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<UploadIcon />}
                      onClick={() => handleOpenDocumentDialog(module)}
                    >
                      Add Document
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenModuleDialog(module)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteModule(module.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 1: Process Training */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Process Training Modules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Learn core business processes and operational workflows
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {processModules.map((module) => (
              <Grid item xs={12} md={6} key={module.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <CodeIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {module.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {module.duration}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={`${module.enrolled} enrolled`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="600" gutterBottom>
                        Topics Covered:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {module.topics.map((topic, index) => (
                          <Chip
                            key={index}
                            label={topic}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Completion Rate
                        </Typography>
                        <Typography variant="body2" fontWeight="600" color={getCompletionColor(module.completionRate)}>
                          {module.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={module.completionRate}
                        color={getCompletionColor(module.completionRate)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button size="small" startIcon={<PlayIcon />} onClick={() => handleStartModule(module)}>
                      Start Module
                    </Button>
                    <Button size="small" startIcon={<ViewIcon />} onClick={() => handleViewDetails(module)}>
                      View Details
                    </Button>
                    <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownloadMaterials(module)}>
                      Download Materials
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 2: Portal Training */}
      {activeTab === 2 && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Portal & Application Training
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Master the CRM portal and application features
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {portalModules.map((module) => (
              <Grid item xs={12} md={6} key={module.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'info.main' }}>
                          <LaptopIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {module.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {module.duration}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={`${module.enrolled} enrolled`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="600" gutterBottom>
                        Topics Covered:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {module.topics.map((topic, index) => (
                          <Chip
                            key={index}
                            label={topic}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Completion Rate
                        </Typography>
                        <Typography variant="body2" fontWeight="600" color={getCompletionColor(module.completionRate)}>
                          {module.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={module.completionRate}
                        color={getCompletionColor(module.completionRate)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button size="small" startIcon={<PlayIcon />} onClick={() => handleStartModule(module)}>
                      Start Module
                    </Button>
                    <Button size="small" startIcon={<ViewIcon />} onClick={() => handleViewDetails(module)}>
                      View Details
                    </Button>
                    <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownloadMaterials(module)}>
                      Download Materials
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 3: Analytics & Reports */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Training Analytics & Reports
          </Typography>

          {/* Performance Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Training Hours
                  </Typography>
                  <Typography variant="h4" fontWeight="700">
                    {agentProgress.reduce((sum, a) => sum + a.completedHours, 0)}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +12% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Score
                  </Typography>
                  <Typography variant="h4" fontWeight="700">
                    {Math.round(agentProgress.reduce((sum, a) => sum + a.averageScore, 0) / agentProgress.length)}%
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +5% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Certificates Issued
                  </Typography>
                  <Typography variant="h4" fontWeight="700">
                    {agentProgress.reduce((sum, a) => sum + a.certificatesEarned, 0)}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +8 this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Agent Progress Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Agent Training Progress
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Agent Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell align="center">Modules Progress</TableCell>
                      <TableCell align="center">Hours Completed</TableCell>
                      <TableCell align="center">Avg. Score</TableCell>
                      <TableCell align="center">Certificates</TableCell>
                      <TableCell>Last Activity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agentProgress.map((agent) => (
                      <TableRow key={agent.agentId}>
                        <TableCell>
                          <Chip
                            label={`#${agent.rank}`}
                            color={agent.rank === 1 ? 'warning' : 'default'}
                            size="small"
                            icon={agent.rank === 1 ? <TrophyIcon /> : undefined}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {agent.agentName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {agent.agentName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {agent.agentId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{agent.department}</TableCell>
                        <TableCell align="center">
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {agent.completedModules}/{agent.totalModules}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(agent.completedModules / agent.totalModules) * 100}
                              sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="600">
                            {agent.completedHours}h
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            / {agent.totalHours}h
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${agent.averageScore}%`}
                            color={getCompletionColor(agent.averageScore)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <TrophyIcon fontSize="small" color="warning" />
                            <Typography variant="body2" fontWeight="600">
                              {agent.certificatesEarned}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {agent.lastActivity}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Module Create/Edit Dialog */}
      <Dialog open={moduleDialog} onClose={handleCloseModuleDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingModule ? 'Edit Training Module' : 'Create Training Module'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Title"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={moduleForm.category}
                  label="Category"
                  onChange={(e) => setModuleForm({ ...moduleForm, category: e.target.value })}
                >
                  <MenuItem value="Product Knowledge">Product Knowledge</MenuItem>
                  <MenuItem value="Soft Skills">Soft Skills</MenuItem>
                  <MenuItem value="Portal Training">Portal Training</MenuItem>
                  <MenuItem value="Process Training">Process Training</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Level</InputLabel>
                <Select
                  value={moduleForm.level}
                  label="Level"
                  onChange={(e) => setModuleForm({ ...moduleForm, level: e.target.value })}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={moduleForm.duration}
                onChange={(e) => setModuleForm({ ...moduleForm, duration: e.target.value })}
                placeholder="e.g., 4 hours"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Passing Score (%)"
                type="number"
                value={moduleForm.passingScore}
                onChange={(e) => setModuleForm({ ...moduleForm, passingScore: parseInt(e.target.value) })}
                inputProps={{ min: 0, max: 100 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={moduleForm.status}
                  label="Status"
                  onChange={(e) => setModuleForm({ ...moduleForm, status: e.target.value })}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModuleDialog}>Cancel</Button>
          <Button onClick={handleSaveModule} variant="contained">
            {editingModule ? 'Update Module' : 'Create Module'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog open={documentDialog} onClose={handleCloseDocumentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Training Document</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
            Upload training materials such as PDFs, videos, or documents
          </Alert>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Document Name"
                value={documentForm.name}
                onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
                placeholder="e.g., Training Guide.pdf"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={documentForm.type}
                  label="Document Type"
                  onChange={(e) => setDocumentForm({ ...documentForm, type: e.target.value })}
                >
                  <MenuItem value="pdf">PDF Document</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="doc">Word Document</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="File Size"
                value={documentForm.size}
                onChange={(e) => setDocumentForm({ ...documentForm, size: e.target.value })}
                placeholder="e.g., 2.5 MB"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<UploadIcon />}
                sx={{ height: 100, borderStyle: 'dashed' }}
              >
                Click to Upload or Drag & Drop
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Supported formats: PDF, MP4, DOCX, PPTX (Max 100MB)
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocumentDialog}>Cancel</Button>
          <Button onClick={handleUploadDocument} variant="contained" startIcon={<UploadIcon />}>
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Process Training Detail Dialog */}
      <Dialog
        open={processDetailDialog}
        onClose={handleCloseProcessDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <CodeIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {selectedProcessModule?.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Process Training Module
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProcessModule && (
            <Grid container spacing={3}>
              {/* Module Description */}
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  {selectedProcessModule.description}
                </Typography>
              </Grid>

              {/* Module Stats */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <TimerIcon color="action" />
                      <Typography variant="h6" fontWeight="600" sx={{ mt: 1 }}>
                        {selectedProcessModule.duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Duration
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <GroupIcon color="action" />
                      <Typography variant="h6" fontWeight="600" sx={{ mt: 1 }}>
                        {selectedProcessModule.enrolled}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Enrolled
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <TrendingUpIcon color="action" />
                      <Typography variant="h6" fontWeight="600" sx={{ mt: 1 }}>
                        {selectedProcessModule.completionRate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completion
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <StarIcon color="warning" />
                      <Typography variant="h6" fontWeight="600" sx={{ mt: 1 }}>
                        4.5
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Rating
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Topics Covered */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Topics Covered
                </Typography>
                <List>
                  {selectedProcessModule.topics.map((topic, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={topic} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Completion Progress */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Overall Progress
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Completion Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {selectedProcessModule.completionRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={selectedProcessModule.completionRate}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Grid>

              {/* Additional Info */}
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    This module is part of the Process Training curriculum. Complete all topics to earn your certification.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProcessDetailDialog}>
            Close
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              handleDownloadMaterials(selectedProcessModule);
              handleCloseProcessDetailDialog();
            }}
          >
            Download Materials
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={() => {
              handleStartModule(selectedProcessModule);
              handleCloseProcessDetailDialog();
            }}
          >
            Start Module
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TrainingManagement;
