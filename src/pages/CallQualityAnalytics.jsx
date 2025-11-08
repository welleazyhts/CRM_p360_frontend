import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Card, CardContent
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const CallQualityAnalytics = () => {
  const navigate = useNavigate();

  const analyticsData = {
    totalReviews: 150,
    averageRating: 4.2,
    ratingDistribution: {
      5: 45,
      4: 60,
      3: 30,
      2: 10,
      1: 5
    },
    agentPerformance: [
      { agent: 'Priya Sharma', avgRating: 4.8, totalCalls: 25, percentage: 96 },
      { agent: 'Vikram Singh', avgRating: 4.5, totalCalls: 30, percentage: 90 },
      { agent: 'Meera Joshi', avgRating: 4.2, totalCalls: 28, percentage: 84 },
      { agent: 'Amit Kumar', avgRating: 3.9, totalCalls: 22, percentage: 78 }
    ],
    monthlyTrends: {
      Jan: 4.1,
      Feb: 4.3,
      Mar: 4.2,
      Apr: 4.4,
      May: 4.2
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

      <Typography variant="h4" fontWeight="600" gutterBottom>
        Call Quality Analytics
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="primary">
                {analyticsData.totalReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="success.main">
                {analyticsData.averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {Math.round((analyticsData.ratingDistribution[4] + analyticsData.ratingDistribution[5]) / analyticsData.totalReviews * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Quality (4-5★)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="secondary.main">
                {analyticsData.agentPerformance.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Agents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Rating Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Rating Distribution
            </Typography>
            {Object.entries(analyticsData.ratingDistribution).reverse().map(([rating, count]) => (
              <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 30 }}>
                  {rating}★
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: 20,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    mx: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${(count / analyticsData.totalReviews) * 100}%`,
                      bgcolor: rating >= 4 ? 'success.main' : rating >= 3 ? 'warning.main' : 'error.main',
                      borderRadius: 1
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 40 }}>
                  {count}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Agent Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Agent Performance
            </Typography>
            {analyticsData.agentPerformance.map((agent, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" fontWeight="600">
                    {agent.agent}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {agent.percentage}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {agent.totalCalls} calls reviewed
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallQualityAnalytics;