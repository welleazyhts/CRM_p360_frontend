import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent, Chip,
  LinearProgress, List, ListItem, ListItemIcon, ListItemText, Divider,
  Stack, Avatar, Alert, Tabs, Tab, useTheme, alpha, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, TrendingUp as TrendingUpIcon,
  School as TrainingIcon, EmojiObjects as IdeaIcon, Warning as WarningIcon,
  CheckCircle as SuccessIcon, Error as ErrorIcon, Person as PersonIcon,
  MenuBook as CourseIcon, VideoLibrary as VideoIcon, Assignment as AssignmentIcon,
  Timer as TimerIcon, Group as GroupIcon, LocalLibrary as LibraryIcon,
  Close as CloseIcon, CalendarMonth as CalendarIcon
} from '@mui/icons-material';

const CallQualityAnalytics = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [scheduleData, setScheduleData] = useState({ startDate: '', endDate: '', venue: '', trainer: '', notes: '' });

  const analyticsData = {
    totalReviews: 150, averageRating: 4.2, averageQualityScore: 77.5,
    ratingDistribution: { 5: 45, 4: 60, 3: 30, 2: 10, 1: 5 },
    agentPerformance: [
      { agent: 'Priya Sharma', avgRating: 4.8, totalCalls: 25, qualityScore: 92, weakAreas: ['Closing techniques'], strengths: ['Product knowledge', 'Communication', 'Empathy'] },
      { agent: 'Vikram Singh', avgRating: 4.5, totalCalls: 30, qualityScore: 85, weakAreas: ['Objection handling', 'Call pacing'], strengths: ['Technical knowledge', 'Problem solving'] },
      { agent: 'Meera Joshi', avgRating: 4.2, totalCalls: 28, qualityScore: 78, weakAreas: ['Product knowledge', 'Upselling'], strengths: ['Communication', 'Active listening'] },
      { agent: 'Amit Kumar', avgRating: 3.9, totalCalls: 22, qualityScore: 68, weakAreas: ['Communication skills', 'Product knowledge'], strengths: ['Patience', 'Documentation'] }
    ],
    commonIssues: [
      { issue: 'Poor Product Knowledge', frequency: 35, severity: 'high', affectedAgents: 2, impact: 'Customer dissatisfaction' },
      { issue: 'Weak Objection Handling', frequency: 28, severity: 'high', affectedAgents: 3, impact: 'Lost sales opportunities' },
      { issue: 'Inadequate Call Structure', frequency: 22, severity: 'medium', affectedAgents: 1, impact: 'Inefficient calls' }
    ],
    trainingSuggestions: [
      { id: 1, title: 'Advanced Product Knowledge Workshop', priority: 'High', targetAgents: ['Meera Joshi', 'Amit Kumar'], duration: '3 days', type: 'Workshop', description: 'Comprehensive training on all insurance products', expectedImprovement: '15-20% improvement', modules: ['Health Insurance Deep Dive', 'Life Insurance Variants', 'Motor Insurance Options', 'Competitor Analysis'] },
      { id: 2, title: 'Objection Handling Mastery', priority: 'High', targetAgents: ['Vikram Singh', 'Meera Joshi'], duration: '2 days', type: 'Training Course', description: 'Learn proven objection handling techniques', expectedImprovement: '12-15% improvement', modules: ['Customer Psychology', 'Common Objections', 'Reframing Techniques', 'Role-play Sessions'] },
      { id: 3, title: 'Communication Skills Enhancement', priority: 'Medium', targetAgents: ['Amit Kumar'], duration: '5 days', type: 'Certification', description: 'Develop clear and persuasive communication', expectedImprovement: '18-22% improvement', modules: ['Voice Modulation', 'Active Listening', 'Building Rapport', 'Clear Communication'] },
      { id: 4, title: 'Effective Call Structuring', priority: 'Medium', targetAgents: ['Amit Kumar'], duration: '1 day', type: 'Workshop', description: 'Master call structuring for effectiveness', expectedImprovement: '10-12% reduction in call time', modules: ['Opening', 'Needs Analysis', 'Solution Presentation', 'Closing'] },
      { id: 5, title: 'Upselling Strategies', priority: 'Low', targetAgents: ['Meera Joshi', 'Priya Sharma'], duration: '2 days', type: 'Workshop', description: 'Learn upselling and cross-selling techniques', expectedImprovement: '8-10% increase in deal value', modules: ['Upsell Opportunities', 'Product Bundling', 'Value-based Selling', 'Timing'] }
    ],
    skillGapAnalysis: [
      { skill: 'Product Knowledge', currentLevel: 72, targetLevel: 90, gap: 18 },
      { skill: 'Communication', currentLevel: 78, targetLevel: 85, gap: 7 },
      { skill: 'Objection Handling', currentLevel: 68, targetLevel: 85, gap: 17 },
      { skill: 'Call Structure', currentLevel: 75, targetLevel: 88, gap: 13 },
      { skill: 'Closing Techniques', currentLevel: 80, targetLevel: 90, gap: 10 },
      { skill: 'Upselling', currentLevel: 65, targetLevel: 80, gap: 15 }
    ]
  };

  const getPriorityColor = (p) => p === 'High' ? 'error' : p === 'Medium' ? 'warning' : 'info';
  const getSeverityColor = (s) => s === 'high' ? theme.palette.error.main : s === 'medium' ? theme.palette.warning.main : theme.palette.info.main;

  const handleViewDetails = (training) => { setSelectedTraining(training); setDetailsDialogOpen(true); };
  const handleScheduleTraining = (training) => { setSelectedTraining(training); setScheduleData({ startDate: '', endDate: '', venue: '', trainer: '', notes: '' }); setScheduleDialogOpen(true); };
  const handleConfirmSchedule = () => {
    setScheduleDialogOpen(false);
    setSnackbar({ open: true, message: `Training "${selectedTraining?.title}" scheduled successfully!`, severity: 'success' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/call-quality-monitoring')} sx={{ mb: 2 }}>Back to QA Dashboard</Button>
      <Typography variant="h4" fontWeight="700" gutterBottom>Call Quality Analytics & Training</Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[{ label: 'Total Reviews', value: analyticsData.totalReviews, color: 'primary' }, { label: 'Avg Rating', value: analyticsData.averageRating, color: 'success' }, { label: 'Quality Score', value: `${analyticsData.averageQualityScore}%`, color: 'info' }, { label: 'High Priority', value: analyticsData.trainingSuggestions.filter(t => t.priority === 'High').length, color: 'warning' }].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette[stat.color].main, 0.1)} 0%, ${alpha(theme.palette[stat.color].dark, 0.2)} 100%)` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700" color={`${stat.color}.main`}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} variant="fullWidth">
          <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Overview" />
          <Tab icon={<TrainingIcon />} iconPosition="start" label="Training Suggestions" />
          <Tab icon={<LibraryIcon />} iconPosition="start" label="Skill Gap Analysis" />
        </Tabs>
      </Paper>

      {/* Tab 0: Overview */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom>Rating Distribution</Typography>
              <Divider sx={{ mb: 2 }} />
              {Object.entries(analyticsData.ratingDistribution).reverse().map(([rating, count]) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" fontWeight="600" sx={{ minWidth: 40 }}>{rating}★</Typography>
                  <Box sx={{ flex: 1, height: 24, bgcolor: alpha(theme.palette.grey[300], 0.3), borderRadius: 2, mx: 2, overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${(count / analyticsData.totalReviews) * 100}%`, bgcolor: rating >= 4 ? 'success.main' : rating >= 3 ? 'warning.main' : 'error.main', borderRadius: 2 }} />
                  </Box>
                  <Typography variant="body2" fontWeight="600" sx={{ minWidth: 60 }}>{count} ({Math.round((count / analyticsData.totalReviews) * 100)}%)</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom>Common Issues</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {analyticsData.commonIssues.map((issue, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemIcon><Avatar sx={{ bgcolor: alpha(getSeverityColor(issue.severity), 0.1), color: getSeverityColor(issue.severity) }}><WarningIcon /></Avatar></ListItemIcon>
                    <ListItemText primary={<Stack direction="row" spacing={1} alignItems="center"><Typography variant="body2" fontWeight="600">{issue.issue}</Typography><Chip label={issue.severity} size="small" color={issue.severity === 'high' ? 'error' : 'warning'} /></Stack>} secondary={`Frequency: ${issue.frequency} • ${issue.affectedAgents} agents • ${issue.impact}`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom>Agent Performance</Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {analyticsData.agentPerformance.map((agent, i) => (
                  <Grid item xs={12} md={6} key={i}>
                    <Card sx={{ border: `2px solid ${alpha(agent.qualityScore >= 85 ? theme.palette.success.main : agent.qualityScore >= 70 ? theme.palette.warning.main : theme.palette.error.main, 0.3)}` }}>
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 56, height: 56 }}><PersonIcon /></Avatar>
                          <Box sx={{ flex: 1 }}><Typography variant="h6" fontWeight="700">{agent.agent}</Typography><Typography variant="caption" color="text.secondary">{agent.totalCalls} calls</Typography></Box>
                          <Chip label={`${agent.qualityScore}%`} color={agent.qualityScore >= 85 ? 'success' : agent.qualityScore >= 70 ? 'warning' : 'error'} sx={{ fontWeight: 700 }} />
                        </Stack>
                        <LinearProgress variant="determinate" value={agent.qualityScore} color={agent.qualityScore >= 85 ? 'success' : agent.qualityScore >= 70 ? 'warning' : 'error'} sx={{ height: 8, borderRadius: 2, mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={6}><Typography variant="caption" color="text.secondary" fontWeight="600">Strengths</Typography><Box sx={{ mt: 0.5 }}>{agent.strengths.map((s, idx) => <Chip key={idx} label={s} size="small" color="success" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />)}</Box></Grid>
                          <Grid item xs={6}><Typography variant="caption" color="text.secondary" fontWeight="600">Needs Improvement</Typography><Box sx={{ mt: 0.5 }}>{agent.weakAreas.map((w, idx) => <Chip key={idx} label={w} size="small" color="warning" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />)}</Box></Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Training Suggestions */}
      {currentTab === 1 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>Based on analysis, we've identified {analyticsData.trainingSuggestions.length} training programs to improve performance.</Alert>
          <Grid container spacing={3}>
            {analyticsData.trainingSuggestions.map((training) => (
              <Grid item xs={12} key={training.id}>
                <Card sx={{ borderRadius: 3, border: `2px solid ${alpha(training.priority === 'High' ? theme.palette.error.main : training.priority === 'Medium' ? theme.palette.warning.main : theme.palette.info.main, 0.3)}`, '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(training.priority === 'High' ? theme.palette.error.main : training.priority === 'Medium' ? theme.palette.warning.main : theme.palette.info.main, 0.1), color: training.priority === 'High' ? 'error.main' : training.priority === 'Medium' ? 'warning.main' : 'info.main', width: 56, height: 56 }}><TrainingIcon /></Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography variant="h6" fontWeight="700">{training.title}</Typography>
                          <Chip label={training.priority} color={getPriorityColor(training.priority)} size="small" />
                          <Chip icon={training.type === 'Workshop' ? <GroupIcon /> : <CourseIcon />} label={training.type} size="small" variant="outlined" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{training.description}</Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={4}><Stack direction="row" spacing={1} alignItems="center"><TimerIcon fontSize="small" color="action" /><Box><Typography variant="caption" color="text.secondary">Duration</Typography><Typography variant="body2" fontWeight="600">{training.duration}</Typography></Box></Stack></Grid>
                          <Grid item xs={4}><Stack direction="row" spacing={1} alignItems="center"><PersonIcon fontSize="small" color="action" /><Box><Typography variant="caption" color="text.secondary">Target Agents</Typography><Typography variant="body2" fontWeight="600">{training.targetAgents.length}</Typography></Box></Stack></Grid>
                          <Grid item xs={4}><Stack direction="row" spacing={1} alignItems="center"><TrendingUpIcon fontSize="small" color="action" /><Box><Typography variant="caption" color="text.secondary">Expected Impact</Typography><Typography variant="body2" fontWeight="600" color="success.main">{training.expectedImprovement}</Typography></Box></Stack></Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mb: 2 }}><Typography variant="caption" color="text.secondary" fontWeight="600">Recommended for:</Typography><Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>{training.targetAgents.map((agent, idx) => <Chip key={idx} label={agent} size="small" color="primary" variant="outlined" />)}</Stack></Box>
                        <Box><Typography variant="caption" color="text.secondary" fontWeight="600">Training Modules:</Typography><Grid container spacing={1} sx={{ mt: 0.5 }}>{training.modules.map((m, idx) => <Grid item xs={6} key={idx}><Stack direction="row" spacing={0.5} alignItems="center"><AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="caption">{m}</Typography></Stack></Grid>)}</Grid></Box>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                      <Button variant="outlined" startIcon={<IdeaIcon />} onClick={() => handleViewDetails(training)}>View Details</Button>
                      <Button variant="contained" startIcon={<CalendarIcon />} onClick={() => handleScheduleTraining(training)}>Schedule Training</Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 2: Skill Gap */}
      {currentTab === 2 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="700" gutterBottom>Team Skill Gap Matrix</Typography>
          <Divider sx={{ mb: 3 }} />
          {analyticsData.skillGapAnalysis.map((skill, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body1" fontWeight="600">{skill.skill}</Typography>
                <Stack direction="row" spacing={2}><Typography variant="caption" color="text.secondary">Current: {skill.currentLevel}%</Typography><Typography variant="caption" color="text.secondary">Target: {skill.targetLevel}%</Typography><Chip label={`Gap: ${skill.gap}%`} color={skill.gap >= 15 ? 'error' : skill.gap >= 10 ? 'warning' : 'info'} size="small" /></Stack>
              </Stack>
              <Box sx={{ position: 'relative' }}>
                <LinearProgress variant="determinate" value={skill.currentLevel} sx={{ height: 24, borderRadius: 2, bgcolor: alpha(theme.palette.grey[300], 0.3), '& .MuiLinearProgress-bar': { bgcolor: skill.gap >= 15 ? 'error.main' : skill.gap >= 10 ? 'warning.main' : 'info.main' } }} />
                <Box sx={{ position: 'absolute', left: `${skill.targetLevel}%`, top: 0, bottom: 0, width: 2, bgcolor: 'success.main' }} />
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {/* View Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h6" fontWeight="600">Training Details</Typography><Button onClick={() => setDetailsDialogOpen(false)}><CloseIcon /></Button></Box></DialogTitle>
        <DialogContent dividers>
          {selectedTraining && (
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}><Chip label={selectedTraining.priority} color={getPriorityColor(selectedTraining.priority)} /><Chip label={selectedTraining.type} variant="outlined" /></Stack>
              <Typography variant="h5" fontWeight="700" gutterBottom>{selectedTraining.title}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{selectedTraining.description}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}><Card sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}><Typography variant="caption" color="text.secondary">Duration</Typography><Typography variant="h6">{selectedTraining.duration}</Typography></Card></Grid>
                <Grid item xs={6}><Card sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}><Typography variant="caption" color="text.secondary">Expected Improvement</Typography><Typography variant="h6" color="success.main">{selectedTraining.expectedImprovement}</Typography></Card></Grid>
              </Grid>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 3, mb: 2 }}>Target Agents ({selectedTraining.targetAgents.length})</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">{selectedTraining.targetAgents.map((a, i) => <Chip key={i} label={a} avatar={<Avatar><PersonIcon /></Avatar>} sx={{ mb: 1 }} />)}</Stack>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 3, mb: 2 }}>Training Modules ({selectedTraining.modules.length})</Typography>
              <List>{selectedTraining.modules.map((m, i) => <ListItem key={i}><ListItemIcon><Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 32, height: 32 }}>{i + 1}</Avatar></ListItemIcon><ListItemText primary={m} /></ListItem>)}</List>
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setDetailsDialogOpen(false)}>Close</Button><Button variant="contained" startIcon={<CalendarIcon />} onClick={() => { setDetailsDialogOpen(false); handleScheduleTraining(selectedTraining); }}>Schedule Training</Button></DialogActions>
      </Dialog>

      {/* Schedule Training Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle><Typography variant="h6" fontWeight="600">Schedule Training</Typography></DialogTitle>
        <DialogContent dividers>
          {selectedTraining && <Alert severity="info" sx={{ mb: 3 }}>Scheduling: <strong>{selectedTraining.title}</strong> for {selectedTraining.targetAgents.length} agents</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth label="Start Date" type="date" value={scheduleData.startDate} onChange={(e) => setScheduleData({ ...scheduleData, startDate: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="End Date" type="date" value={scheduleData.endDate} onChange={(e) => setScheduleData({ ...scheduleData, endDate: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Venue/Location" value={scheduleData.venue} onChange={(e) => setScheduleData({ ...scheduleData, venue: e.target.value })} placeholder="Conference Room A / Online" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Trainer Name" value={scheduleData.trainer} onChange={(e) => setScheduleData({ ...scheduleData, trainer: e.target.value })} placeholder="Enter trainer name" /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Additional Notes" value={scheduleData.notes} onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })} placeholder="Any special requirements or notes..." /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleConfirmSchedule} disabled={!scheduleData.startDate || !scheduleData.venue}>Confirm Schedule</Button></DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CallQualityAnalytics;