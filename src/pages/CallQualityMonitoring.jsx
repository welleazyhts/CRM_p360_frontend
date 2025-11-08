import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Rating, TextField, Grid, Card, CardContent
} from '@mui/material';
import {
  RateReview as ReviewIcon, Analytics as AnalyticsIcon, PlayArrow as PlayIcon
} from '@mui/icons-material';

const CallQualityMonitoring = () => {
  const navigate = useNavigate();
  
  const [calls] = useState([
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      agent: 'Priya Sharma',
      date: '2025-01-20',
      duration: '05:23',
      recordedAudio: 'call_recording_001.mp3',
      rating: 4,
      qaStatus: 'Reviewed',
      feedback: 'Good communication, clear explanation of policy terms'
    },
    {
      id: 2,
      customerName: 'Anita Patel',
      agent: 'Vikram Singh',
      date: '2025-01-19',
      duration: '12:45',
      recordedAudio: 'call_recording_002.mp3',
      rating: null,
      qaStatus: 'Pending',
      feedback: ''
    },
    {
      id: 3,
      customerName: 'Suresh Reddy',
      agent: 'Meera Joshi',
      date: '2025-01-18',
      duration: '08:12',
      recordedAudio: 'call_recording_003.mp3',
      rating: 5,
      qaStatus: 'Reviewed',
      feedback: 'Excellent customer service, resolved all queries efficiently'
    }
  ]);

  const stats = {
    totalCalls: calls.length,
    reviewedCalls: calls.filter(c => c.qaStatus === 'Reviewed').length,
    pendingCalls: calls.filter(c => c.qaStatus === 'Pending').length,
    averageRating: calls.filter(c => c.rating).reduce((sum, c) => sum + c.rating, 0) / calls.filter(c => c.rating).length || 0
  };

  const getStatusColor = (status) => {
    return status === 'Reviewed' ? 'success' : 'warning';
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
        <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} sm={6} md={3}>
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