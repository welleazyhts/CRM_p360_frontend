import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Rating, Grid, Card, CardContent,
  LinearProgress, Stack, Tooltip, useTheme, alpha
} from '@mui/material';
import {
  RateReview as ReviewIcon, Analytics as AnalyticsIcon,
  CheckCircle as ExcellentIcon, Cancel as PoorIcon, Warning as NeedsImprovementIcon
} from '@mui/icons-material';

import callService from '../services/callService';

const CallQualityMonitoring = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await callService.fetchCallLogs({ page: 1, limit: 20 });
        if (res && Array.isArray(res.calls)) {
          const mapped = res.calls.map((c, idx) => ({
            id: c.callId || c.id || `f-${idx}`,
            customerName: c.customerName || c.from || 'Unknown',
            agent: c.agent || c.agentId || 'Unassigned',
            date: c.timestamp ? new Date(c.timestamp).toLocaleString() : '',
            duration: typeof c.duration === 'number' ? `${c.duration} secs` : c.duration || '',
            recordedAudio: c.recording || '',
            rating: null,
            qaStatus: c.status === 'completed' ? 'Reviewed' : 'Pending',
            qualityScore: null,
            feedback: c.notes || ''
          }));
          if (mounted) setCalls(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch call logs', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const stats = {
    totalCalls: calls.length,
    reviewedCalls: calls.filter(c => c.qaStatus === 'Reviewed').length,
    pendingCalls: calls.filter(c => c.qaStatus === 'Pending').length,
    averageRating: calls.filter(c => c.rating).reduce((sum, c) => sum + c.rating, 0) / (calls.filter(c => c.rating).length || 1),
    averageQualityScore: calls.filter(c => c.qualityScore).reduce((sum, c) => sum + c.qualityScore, 0) / (calls.filter(c => c.qualityScore).length || 1)
  };

  const getStatusColor = (status) => {
    return status === 'Reviewed' ? 'success' : 'warning';
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getScoreIcon = (score) => {
    if (score >= 85) return <ExcellentIcon sx={{ fontSize: 18 }} />;
    if (score >= 70) return <NeedsImprovementIcon sx={{ fontSize: 18 }} />;
    return <PoorIcon sx={{ fontSize: 18 }} />;
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Call Quality Monitoring
        </Typography>
        <Button
          variant="contained"
          startIcon={<AnalyticsIcon />}
          onClick={() => navigate('/call-quality-analytics')}
        >
          View Analytics
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="primary">
                {stats.totalCalls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Calls
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {stats.reviewedCalls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reviewed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {stats.pendingCalls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="secondary.main">
                {stats.averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.2)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="info.main">
                {stats.averageQualityScore > 0 ? stats.averageQualityScore.toFixed(1) : '--'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Quality Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Calls Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          All Calls for QA Review
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Quality Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id} hover>
                  <TableCell>{call.customerName}</TableCell>
                  <TableCell>{call.agent}</TableCell>
                  <TableCell>{call.date}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>
                    {call.rating ? (
                      <Rating value={call.rating} readOnly size="small" />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not Rated
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {call.qualityScore ? (
                      <Tooltip title={getScoreLabel(call.qualityScore)} arrow>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              icon={getScoreIcon(call.qualityScore)}
                              label={`${call.qualityScore}%`}
                              color={getScoreColor(call.qualityScore)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={call.qualityScore}
                            color={getScoreColor(call.qualityScore)}
                            sx={{
                              mt: 0.5,
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: alpha(theme.palette.grey[300], 0.3)
                            }}
                          />
                        </Box>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not Scored
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={call.qaStatus}
                      color={getStatusColor(call.qaStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<ReviewIcon />}
                        onClick={() => navigate(`/call-quality-details/${call.id}`)}
                      >
                        Review
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CallQualityMonitoring;