import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent, Chip,
  LinearProgress, List, ListItem, ListItemIcon, ListItemText, Divider,
  Stack, Avatar, Alert, Tabs, Tab, useTheme, alpha, Tooltip, IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, TrendingUp as TrendingUpIcon,
  School as TrainingIcon, EmojiObjects as IdeaIcon, Warning as WarningIcon,
  CheckCircle as SuccessIcon, Error as ErrorIcon, Person as PersonIcon,
  MenuBook as CourseIcon, VideoLibrary as VideoIcon, Assignment as AssignmentIcon,
  Timer as TimerIcon, Star as StarIcon, TrendingDown as TrendingDownIcon,
  Group as GroupIcon, LocalLibrary as LibraryIcon
} from '@mui/icons-material';

const CallQualityAnalytics = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const analyticsData = {
    totalReviews: 150,
    averageRating: 4.2,
    averageQualityScore: 77.5,
    ratingDistribution: {
      5: 45,
      4: 60,
      3: 30,
      2: 10,
      1: 5
    },
    agentPerformance: [
      {
        agent: 'Priya Sharma',
        avgRating: 4.8,
        totalCalls: 25,
        percentage: 96,
        qualityScore: 92,
        weakAreas: ['Closing techniques'],
        strengths: ['Product knowledge', 'Communication', 'Empathy']
      },
      {
        agent: 'Vikram Singh',
        avgRating: 4.5,
        totalCalls: 30,
        percentage: 90,
        qualityScore: 85,
        weakAreas: ['Objection handling', 'Call pacing'],
        strengths: ['Technical knowledge', 'Problem solving']
      },
      {
        agent: 'Meera Joshi',
        avgRating: 4.2,
        totalCalls: 28,
        percentage: 84,
        qualityScore: 78,
        weakAreas: ['Product knowledge', 'Upselling'],
        strengths: ['Communication', 'Active listening']
      },
      {
        agent: 'Amit Kumar',
        avgRating: 3.9,
        totalCalls: 22,
        percentage: 78,
        qualityScore: 68,
        weakAreas: ['Communication skills', 'Product knowledge', 'Call structure'],
        strengths: ['Patience', 'Documentation']
      }
    ],
    monthlyTrends: {
      Jan: 4.1,
      Feb: 4.3,
      Mar: 4.2,
      Apr: 4.4,
      May: 4.2
    },
    commonIssues: [
      {
        issue: 'Poor Product Knowledge',
        frequency: 35,
        severity: 'high',
        affectedAgents: 2,
        impact: 'Customer dissatisfaction, longer call times'
      },
      {
        issue: 'Weak Objection Handling',
        frequency: 28,
        severity: 'high',
        affectedAgents: 3,
        impact: 'Lost sales opportunities, lower conversion rates'
      },
      {
        issue: 'Inadequate Call Structure',
        frequency: 22,
        severity: 'medium',
        affectedAgents: 1,
        impact: 'Inefficient calls, missed information'
      },
      {
        issue: 'Limited Upselling Skills',
        frequency: 18,
        severity: 'medium',
        affectedAgents: 2,
        impact: 'Reduced revenue per call'
      },
      {
        issue: 'Closing Technique Issues',
        frequency: 15,
        severity: 'medium',
        affectedAgents: 1,
        impact: 'Lower conversion rates'
      }
    ],
    trainingSuggestions: [
      {
        id: 1,
        title: 'Advanced Product Knowledge Workshop',
        priority: 'High',
        targetAgents: ['Meera Joshi', 'Amit Kumar'],
        duration: '3 days',
        type: 'Workshop',
        description: 'Comprehensive training on all insurance products, features, benefits, and competitive advantages',
        expectedImprovement: '15-20% improvement in quality scores',
        modules: [
          'Health Insurance Products Deep Dive',
          'Life Insurance Policy Variants',
          'Motor Insurance Coverage Options',
          'Comparative Analysis & Competitor Products'
        ]
      },
      {
        id: 2,
        title: 'Objection Handling Mastery',
        priority: 'High',
        targetAgents: ['Vikram Singh', 'Meera Joshi'],
        duration: '2 days',
        type: 'Training Course',
        description: 'Learn proven techniques to handle customer objections and convert resistance into opportunities',
        expectedImprovement: '12-15% improvement in conversion rates',
        modules: [
          'Understanding Customer Psychology',
          'Common Objections in Insurance',
          'Reframing Techniques',
          'Practice & Role-play Sessions'
        ]
      },
      {
        id: 3,
        title: 'Communication Skills Enhancement',
        priority: 'Medium',
        targetAgents: ['Amit Kumar'],
        duration: '5 days',
        type: 'Certification Program',
        description: 'Develop clear, confident, and persuasive communication for better customer engagement',
        expectedImprovement: '18-22% improvement in overall scores',
        modules: [
          'Voice Modulation & Tone',
          'Active Listening Techniques',
          'Building Rapport',
          'Clear & Concise Communication'
        ]
      },
      {
        id: 4,
        title: 'Effective Call Structuring',
        priority: 'Medium',
        targetAgents: ['Amit Kumar'],
        duration: '1 day',
        type: 'Workshop',
        description: 'Master the art of structuring sales calls for maximum effectiveness and efficiency',
        expectedImprovement: '10-12% reduction in average call time',
        modules: [
          'Opening & Introduction',
          'Needs Analysis',
          'Solution Presentation',
          'Closing Techniques'
        ]
      },
      {
        id: 5,
        title: 'Upselling & Cross-selling Strategies',
        priority: 'Low',
        targetAgents: ['Meera Joshi', 'Priya Sharma'],
        duration: '2 days',
        type: 'Workshop',
        description: 'Learn to identify opportunities and present additional products naturally during customer conversations',
        expectedImprovement: '8-10% increase in average deal value',
        modules: [
          'Identifying Upsell Opportunities',
          'Product Bundling Strategies',
          'Value-based Selling',
          'Timing & Approach'
        ]
      }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/call-quality-monitoring')}
        sx={{ mb: 2 }}
      >
        Back to QA Dashboard
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Call Quality Analytics & Training
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Performance insights and personalized training recommendations
          </Typography>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="700" color="primary">
                {analyticsData.totalReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.2)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="700" color="success.main">
                {analyticsData.averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.2)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="700" color="info.main">
                {analyticsData.averageQualityScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Quality Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.2)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="700" color="warning.main">
                {analyticsData.trainingSuggestions.filter(t => t.priority === 'High').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority Trainings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              py: 2,
            },
          }}
        >
          <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Overview" />
          <Tab icon={<TrainingIcon />} iconPosition="start" label="Training Suggestions" />
          <Tab icon={<LibraryIcon />} iconPosition="start" label="Skill Gap Analysis" />
        </Tabs>
      </Paper>

      {/* Tab 0: Overview */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {/* Rating Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Rating Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {Object.entries(analyticsData.ratingDistribution).reverse().map(([rating, count]) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" fontWeight="600" sx={{ minWidth: 40 }}>
                    {rating}★
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 24,
                      bgcolor: alpha(theme.palette.grey[300], 0.3),
                      borderRadius: 2,
                      mx: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${(count / analyticsData.totalReviews) * 100}%`,
                        bgcolor: rating >= 4 ? 'success.main' : rating >= 3 ? 'warning.main' : 'error.main',
                        borderRadius: 2,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" fontWeight="600" sx={{ minWidth: 60 }}>
                    {count} ({Math.round((count / analyticsData.totalReviews) * 100)}%)
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Common Issues */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Common Issues Identified
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {analyticsData.commonIssues.map((issue, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{
                          bgcolor: alpha(getSeverityColor(issue.severity), 0.1),
                          color: getSeverityColor(issue.severity),
                          width: 40,
                          height: 40
                        }}>
                          <WarningIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" fontWeight="600">
                              {issue.issue}
                            </Typography>
                            <Chip
                              label={issue.severity}
                              size="small"
                              color={issue.severity === 'high' ? 'error' : 'warning'}
                            />
                          </Stack>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Frequency: {issue.frequency} occurrences • {issue.affectedAgents} agents affected
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Impact: {issue.impact}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < analyticsData.commonIssues.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Agent Performance */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Agent Performance & Development Areas
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {analyticsData.agentPerformance.map((agent, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{
                      border: `2px solid ${alpha(
                        agent.qualityScore >= 85 ? theme.palette.success.main :
                        agent.qualityScore >= 70 ? theme.palette.warning.main :
                        theme.palette.error.main, 0.3
                      )}`,
                      borderRadius: 2
                    }}>
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                          <Avatar sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            width: 56,
                            height: 56
                          }}>
                            <PersonIcon />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="700">
                              {agent.agent}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {agent.totalCalls} calls reviewed
                            </Typography>
                          </Box>
                          <Chip
                            label={`${agent.qualityScore}%`}
                            color={
                              agent.qualityScore >= 85 ? 'success' :
                              agent.qualityScore >= 70 ? 'warning' : 'error'
                            }
                            sx={{ fontWeight: 700, fontSize: '1rem' }}
                          />
                        </Stack>

                        <Box sx={{ mb: 2 }}>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Quality Score
                            </Typography>
                            <Typography variant="caption" fontWeight="600">
                              {agent.qualityScore}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={agent.qualityScore}
                            color={
                              agent.qualityScore >= 85 ? 'success' :
                              agent.qualityScore >= 70 ? 'warning' : 'error'
                            }
                            sx={{ height: 8, borderRadius: 2 }}
                          />
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600">
                              Strengths
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              {agent.strengths.map((strength, idx) => (
                                <Chip
                                  key={idx}
                                  label={strength}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600">
                              Needs Improvement
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              {agent.weakAreas.map((weak, idx) => (
                                <Chip
                                  key={idx}
                                  label={weak}
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                          </Grid>
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
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              Based on call quality analysis, we've identified {analyticsData.trainingSuggestions.length} training programs
              that can help improve team performance. High-priority trainings address the most critical skill gaps.
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            {analyticsData.trainingSuggestions.map((training) => (
              <Grid item xs={12} key={training.id}>
                <Card sx={{
                  borderRadius: 3,
                  border: `2px solid ${alpha(
                    training.priority === 'High' ? theme.palette.error.main :
                    training.priority === 'Medium' ? theme.palette.warning.main :
                    theme.palette.info.main, 0.3
                  )}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar sx={{
                        bgcolor: alpha(
                          training.priority === 'High' ? theme.palette.error.main :
                          training.priority === 'Medium' ? theme.palette.warning.main :
                          theme.palette.info.main, 0.1
                        ),
                        color: training.priority === 'High' ? 'error.main' :
                               training.priority === 'Medium' ? 'warning.main' : 'info.main',
                        width: 56,
                        height: 56
                      }}>
                        <TrainingIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography variant="h6" fontWeight="700">
                            {training.title}
                          </Typography>
                          <Chip
                            label={training.priority}
                            color={getPriorityColor(training.priority)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                          <Chip
                            icon={training.type === 'Workshop' ? <GroupIcon /> :
                                  training.type === 'Training Course' ? <CourseIcon /> :
                                  <VideoIcon />}
                            label={training.type}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {training.description}
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} sm={4}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TimerIcon fontSize="small" color="action" />
                              <Box>
                                <Typography variant="caption" color="text.secondary">Duration</Typography>
                                <Typography variant="body2" fontWeight="600">{training.duration}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PersonIcon fontSize="small" color="action" />
                              <Box>
                                <Typography variant="caption" color="text.secondary">Target Agents</Typography>
                                <Typography variant="body2" fontWeight="600">{training.targetAgents.length}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TrendingUpIcon fontSize="small" color="action" />
                              <Box>
                                <Typography variant="caption" color="text.secondary">Expected Impact</Typography>
                                <Typography variant="body2" fontWeight="600" color="success.main">
                                  {training.expectedImprovement}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                            Recommended for:
                          </Typography>
                          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            {training.targetAgents.map((agent, idx) => (
                              <Chip
                                key={idx}
                                label={agent}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>

                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                            Training Modules:
                          </Typography>
                          <Grid container spacing={1} sx={{ mt: 0.5 }}>
                            {training.modules.map((module, idx) => (
                              <Grid item xs={12} sm={6} key={idx}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <AssignmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="caption">{module}</Typography>
                                </Stack>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                      <Button variant="outlined" startIcon={<IdeaIcon />}>
                        View Details
                      </Button>
                      <Button variant="contained" startIcon={<TrainingIcon />}>
                        Schedule Training
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 2: Skill Gap Analysis */}
      {currentTab === 2 && (
        <Box>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              Skill gap analysis compares current team performance levels against target benchmarks.
              Focus on skills with the largest gaps for maximum impact.
            </Typography>
          </Alert>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Team Skill Gap Matrix
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {analyticsData.skillGapAnalysis.map((skill, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="body1" fontWeight="600">
                    {skill.skill}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Current: {skill.currentLevel}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Target: {skill.targetLevel}%
                    </Typography>
                    <Chip
                      label={`Gap: ${skill.gap}%`}
                      color={skill.gap >= 15 ? 'error' : skill.gap >= 10 ? 'warning' : 'info'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                </Stack>

                <Box sx={{ position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={skill.currentLevel}
                    sx={{
                      height: 24,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.grey[300], 0.3),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: skill.gap >= 15 ? 'error.main' : skill.gap >= 10 ? 'warning.main' : 'info.main',
                        borderRadius: 2
                      }
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${skill.targetLevel}%`,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      bgcolor: 'success.main',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -4,
                        left: -3,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'success.main'
                      }
                    }}
                  />
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Alert severity="info" icon={<IdeaIcon />} sx={{ borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="600" gutterBottom>
                Recommended Action Plan
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Critical Gaps (≥15%): Immediate training required"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <WarningIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Moderate Gaps (10-14%): Schedule within next month"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <SuccessIcon color="info" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Minor Gaps (<10%): Ongoing coaching and development"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Alert>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default CallQualityAnalytics;