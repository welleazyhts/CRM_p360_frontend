import React, { useState, useEffect } from 'react';
import trainingAnalysisService from '../services/trainingAnalysisService';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemIcon, Divider,
  Fade, alpha, useTheme, LinearProgress, Tabs, Tab
} from '@mui/material';
import {
  Add as AddIcon, Refresh as RefreshIcon, School as TrainingIcon,
  Assessment as AnalyticsIcon, TrendingUp as TrendingUpIcon,
  Person as PersonIcon, CheckCircle as CheckIcon, Schedule as ScheduleIcon,
  PlayCircle as PlayIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrainingAnalysis = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [trainingModules, setTrainingModules] = useState([]);
  const [trainingRecords, setTrainingRecords] = useState([]);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: 'Product Knowledge',
    difficulty: 'Intermediate'
  });

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      const [modules, records] = await Promise.all([
        trainingAnalysisService.getTrainingModules(),
        trainingAnalysisService.getTrainingRecords()
      ]);
      setTrainingModules(modules);
      setTrainingRecords(records);
    } catch (error) {
      console.error('Error loading training data:', error);
      // Fallback to empty arrays on error
      setTrainingModules([]);
      setTrainingRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      category: 'Product Knowledge',
      difficulty: 'Intermediate'
    });
    setModuleDialogOpen(true);
  };

  const handleSaveModule = async () => {
    try {
      const newModule = await trainingAnalysisService.createTrainingModule(formData);
      setTrainingModules([...trainingModules, newModule]);
      setModuleDialogOpen(false);
    } catch (error) {
      console.error('Error saving module:', error);
      // Still close dialog on error, user can retry
      setModuleDialogOpen(false);
    }
  };

  const avgCompletionRate = trainingModules.reduce((sum, m) => sum + m.completionRate, 0) / trainingModules.length || 0;
  const totalEnrolled = trainingModules.reduce((sum, m) => sum + m.enrolledCount, 0);
  const completedCount = trainingRecords.filter(r => r.status === 'Completed').length;
  const avgScore = trainingRecords
    .filter(r => r.score)
    .reduce((sum, r) => sum + r.score, 0) / trainingRecords.filter(r => r.score).length || 0;

  // Performance trend data
  const performanceData = [
    { month: 'Jul', avgScore: 78, completionRate: 65 },
    { month: 'Aug', avgScore: 82, completionRate: 70 },
    { month: 'Sep', avgScore: 85, completionRate: 75 },
    { month: 'Oct', avgScore: 88, completionRate: 78 },
    { month: 'Nov', avgScore: 90, completionRate: 82 },
    { month: 'Dec', avgScore: 92, completionRate: 85 }
  ];

  // Category distribution
  const categoryData = [
    { name: 'Soft Skills', count: trainingModules.filter(m => m.category === 'Soft Skills').length },
    { name: 'Technical', count: trainingModules.filter(m => m.category === 'Technical').length },
    { name: 'Product Knowledge', count: trainingModules.filter(m => m.category === 'Product Knowledge').length },
    { name: 'Compliance', count: trainingModules.filter(m => m.category === 'Compliance').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Not Started': return 'default';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Training & Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Training programs and performance analytics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadTrainingData}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddModule}>
              Add Module
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {trainingModules.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Training Modules
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.9)}, ${alpha(theme.palette.info.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {totalEnrolled}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Enrolled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {avgCompletionRate.toFixed(0)}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Avg Completion Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {avgScore.toFixed(0)}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Average Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Analytics Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Performance Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgScore" stroke={theme.palette.primary.main} name="Avg Score %" />
                  <Line type="monotone" dataKey="completionRate" stroke={theme.palette.success.main} name="Completion Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Module Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Training Modules" />
            <Tab label="Training Records" />
          </Tabs>
        </Paper>

        {/* Training Modules Tab */}
        {tabValue === 0 && (
          <Grid container spacing={2}>
            {trainingModules.map((module) => (
              <Grid item xs={12} md={6} key={module.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {module.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {module.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip label={module.category} size="small" />
                          <Chip label={module.difficulty} size="small" color={getDifficultyColor(module.difficulty)} />
                          <Chip icon={<ScheduleIcon />} label={module.duration} size="small" variant="outlined" />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Completion Rate</Typography>
                        <Typography variant="body2" fontWeight="600">{module.completionRate}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={module.completionRate} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {module.enrolledCount} enrolled
                      </Typography>
                      <Button size="small" startIcon={<PlayIcon />}>
                        Start
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Training Records Tab */}
        {tabValue === 1 && (
          <Paper>
            <List>
              {trainingRecords.map((record, index) => (
                <React.Fragment key={record.id}>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {record.employeeName}
                          </Typography>
                          <Chip
                            label={record.status}
                            size="small"
                            color={getStatusColor(record.status)}
                            icon={record.status === 'Completed' ? <CheckIcon /> : <ScheduleIcon />}
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {record.moduleTitle}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {record.status === 'Completed'
                              ? `Score: ${record.score}% • Completed: ${new Date(record.completedDate).toLocaleDateString()}`
                              : `Progress: ${record.progress}% • Started: ${new Date(record.startedDate).toLocaleDateString()}`
                            }
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            Time Spent: {record.timeSpent}
                          </Typography>
                          {record.status === 'In Progress' && (
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress variant="determinate" value={record.progress} />
                            </Box>
                          )}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < trainingRecords.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}

        {/* Add Module Dialog */}
        <Dialog open={moduleDialogOpen} onClose={() => setModuleDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Training Module</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2 hours"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Product Knowledge">Product Knowledge</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Technical">Technical</option>
                  <option value="Compliance">Compliance</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveModule}>
              Add Module
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default TrainingAnalysis;