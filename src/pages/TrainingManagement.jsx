import React, { useState, useEffect } from 'react';
import trainingService from '../services/trainingAnalysisService';
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
      // data might be array or { results: [] }
      const list = Array.isArray(data) ? data : (data.results || []);

      const categoryMap = {
        'soft_skills': 'Soft Skills',
        'technical': 'Technical',
        'product_knowledge': 'Product Knowledge',
        'compliance': 'Compliance',
        'process_training': 'Process Training',
        'portal_training': 'Portal Training',
      };

      const levelMap = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
      };

      const mappedList = list.map(m => ({
        ...m,
        id: m.id,
        title: m.title || m.module_title || m.moduleTitle || 'Untitled Module',
        category: categoryMap[m.category] || m.category || 'General',
        level: levelMap[m.level] || m.level || 'Beginner',
        duration: m.duration || '0m',
        enrolledAgents: m.enrolledAgents || m.enrolled || 0,
        completionRate: m.completionRate || m.completion_rate || 0,
        documents: m.documents || [],
        assessments: m.assessments || [],
        description: m.description || '',
        status: m.status || 'Active',
        topics: m.topics || m.topics_covered || [],
      }));

      setModules(mappedList);
    } catch (error) {
      console.error('Error loading training modules:', error);
      setSnackbar({ open: true, message: 'Failed to load training modules', severity: 'error' });
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAgentProgress = async () => {
    try {
      const data = await trainingService.getAgentProgress();
      const list = Array.isArray(data) ? data : (data.results || []);
      const mappedList = list.map((item, index) => ({
        agentId: item.agent_id || item.agentId || `AG-${index}`,
        agentName: item.agent_name || item.agentName || 'Unknown Agent',
        department: item.department || 'N/A',
        totalModules: item.modules_total || item.totalModules || 0,
        completedModules: item.modules_completed || item.completedModules || 0,
        totalHours: item.hours_target || item.totalHours || 0,
        completedHours: item.hours_completed || item.completedHours || 0,
        averageScore: item.score || item.averageScore || 0,
        certificatesEarned: item.certificates || item.certificatesEarned || 0,
        lastActivity: item.last_activity || item.lastActivity || '-',
        rank: item.rank || index + 1,
      }));
      setAgentProgress(mappedList);
    } catch (error) {
      console.error('Error loading agent progress:', error);
      setAgentProgress([]);
    }
  };

  // Training Modules State
  const [modules, setModules] = useState([]);
  const [agentProgress, setAgentProgress] = useState([]);

  // Derived states or separate states if needed
  // We will filter from 'modules' for specific tabs if the API returns everything in one list
  const processModules = modules.filter(m => m.category === 'process_training' || m.category === 'Process Training');
  const portalModules = modules.filter(m => m.category === 'portal_training' || m.category === 'Portal Training');
  const trainingModules = modules.filter(m => !['process_training', 'portal_training', 'Process Training', 'Portal Training'].includes(m.category));


  // Module Form
  const [moduleForm, setModuleForm] = useState({
    title: '',
    category: '',
    level: '',
    duration: '',
    passingScore: 70,
    description: '',
    status: 'Active',
    topics: [], // Added for topics_covered
  });

  // Document Form
  const [documentForm, setDocumentForm] = useState({
    name: '',
    type: '',
    size: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

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
    setSelectedFile(null);
    setDocumentDialog(true);
  };

  const handleCloseDocumentDialog = () => {
    setDocumentDialog(false);
    setSelectedModule(null);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Auto-fill form fields
      const fileName = file.name;
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const fileExtension = fileName.split('.').pop().toLowerCase();

      let fileType = 'doc';
      if (fileExtension === 'pdf') fileType = 'pdf';
      else if (['mp4', 'avi', 'mov', 'wmv'].includes(fileExtension)) fileType = 'video';

      setDocumentForm({
        name: fileName,
        type: fileType,
        size: fileSize,
      });
    }
  };

  const handleUploadDocument = async () => {
    if (selectedModule && documentForm.name && selectedFile) {
      try {
        // In a real app, you would upload the file to a server
        // For now, we'll create a document record with the file info
        const newDocument = await trainingService.uploadDocument(selectedModule.id, {
          ...documentForm,
          file: selectedFile,
        });

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
    } else {
      setSnackbar({ open: true, message: 'Please select a file to upload', severity: 'warning' });
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
                        {(trainingModules || []).length}
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
                        {(trainingModules || []).reduce((sum, m) => sum + (m.enrolledAgents || 0), 0)}
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
                        {Math.round((trainingModules || []).reduce((sum, m) => sum + (m.completionRate || 0), 0) / (trainingModules?.length || 1))}%
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
                        {(trainingModules || []).reduce((sum, m) => sum + (m.documents?.length || 0), 0)}
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
            {(trainingModules || []).map((module) => (
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
                            {(Array.isArray(module.enrolledAgents) ? module.enrolledAgents.length : (module.enrolledAgents || 0))} enrolled
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DocIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {(module.documents || []).length} documents
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssessmentIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {(Array.isArray(module.assessments) ? module.assessments.length : (typeof module.assessments === 'number' ? module.assessments : 0))} assessments
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

                    {(module.documents || []).length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="600" gutterBottom>
                          Training Materials
                        </Typography>
                        <List dense>
                          {(module.documents || []).slice(0, 2).map((doc) => (
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
                        {(module.documents || []).length > 2 && (
                          <Typography variant="caption" color="text.secondary">
                            +{(module.documents || []).length - 2} more documents
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
                        {(module.topics || module.topics_covered || []).map((topic, index) => (
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
                        {(module.topics || module.topics_covered || []).map((topic, index) => (
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
              <input
                type="file"
                accept=".pdf,.mp4,.avi,.mov,.wmv,.doc,.docx,.ppt,.pptx"
                style={{ display: 'none' }}
                id="file-upload-input"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload-input" style={{ width: '100%', display: 'block' }}>
                <Button
                  variant="outlined"
                  fullWidth
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{ height: 100, borderStyle: 'dashed' }}
                >
                  {selectedFile ? selectedFile.name : 'Click to Upload or Drag & Drop'}
                </Button>
              </label>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Supported formats: PDF, MP4, DOCX, PPTX (Max 100MB)
              </Typography>
              {selectedFile && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </Typography>
              )}
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
