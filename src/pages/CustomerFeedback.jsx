import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Rating, Fade, alpha, useTheme, LinearProgress
} from '@mui/material';
import {
  Add as AddIcon, Refresh as RefreshIcon, ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon, SentimentSatisfied as NeutralIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomerFeedback = () => {
  const theme = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    rating: 5,
    category: 'Service Quality',
    comments: ''
  });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    const mockFeedbacks = [
      {
        id: 1,
        customerName: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        rating: 5,
        category: 'Service Quality',
        comments: 'Excellent service! Very satisfied with the prompt response.',
        date: '2025-01-12',
        sentiment: 'Positive'
      },
      {
        id: 2,
        customerName: 'Anita Desai',
        email: 'anita@example.com',
        rating: 4,
        category: 'Product Quality',
        comments: 'Good product but could be improved in some areas.',
        date: '2025-01-11',
        sentiment: 'Positive'
      },
      {
        id: 3,
        customerName: 'Vikram Singh',
        email: 'vikram@example.com',
        rating: 3,
        category: 'Claims Process',
        comments: 'Average experience. Claims process took longer than expected.',
        date: '2025-01-10',
        sentiment: 'Neutral'
      },
      {
        id: 4,
        customerName: 'Priya Sharma',
        email: 'priya@example.com',
        rating: 2,
        category: 'Customer Support',
        comments: 'Not satisfied with the support provided.',
        date: '2025-01-09',
        sentiment: 'Negative'
      },
      {
        id: 5,
        customerName: 'Amit Patel',
        email: 'amit@example.com',
        rating: 5,
        category: 'Overall Experience',
        comments: 'Outstanding! Will definitely recommend to others.',
        date: '2025-01-08',
        sentiment: 'Positive'
      }
    ];
    setFeedbacks(mockFeedbacks);
  };

  const handleAddFeedback = () => {
    setFormData({
      customerName: '',
      email: '',
      rating: 5,
      category: 'Service Quality',
      comments: ''
    });
    setFeedbackDialogOpen(true);
  };

  const handleSaveFeedback = () => {
    const newFeedback = {
      ...formData,
      id: feedbacks.length + 1,
      date: new Date().toISOString().split('T')[0],
      sentiment: formData.rating >= 4 ? 'Positive' : formData.rating === 3 ? 'Neutral' : 'Negative'
    };
    setFeedbacks([...feedbacks, newFeedback]);
    setFeedbackDialogOpen(false);
  };

  const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0;
  const positiveCount = feedbacks.filter(f => f.sentiment === 'Positive').length;
  const neutralCount = feedbacks.filter(f => f.sentiment === 'Neutral').length;
  const negativeCount = feedbacks.filter(f => f.sentiment === 'Negative').length;

  const sentimentData = [
    { name: 'Positive', value: positiveCount, color: theme.palette.success.main },
    { name: 'Neutral', value: neutralCount, color: theme.palette.warning.main },
    { name: 'Negative', value: negativeCount, color: theme.palette.error.main }
  ];

  const categoryData = [
    { name: 'Service Quality', count: feedbacks.filter(f => f.category === 'Service Quality').length },
    { name: 'Product Quality', count: feedbacks.filter(f => f.category === 'Product Quality').length },
    { name: 'Claims Process', count: feedbacks.filter(f => f.category === 'Claims Process').length },
    { name: 'Customer Support', count: feedbacks.filter(f => f.category === 'Customer Support').length },
    { name: 'Overall Experience', count: feedbacks.filter(f => f.category === 'Overall Experience').length }
  ];

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return <ThumbUpIcon sx={{ color: theme.palette.success.main }} />;
      case 'Neutral': return <NeutralIcon sx={{ color: theme.palette.warning.main }} />;
      case 'Negative': return <ThumbDownIcon sx={{ color: theme.palette.error.main }} />;
      default: return null;
    }
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Customer Feedback Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Collect and analyze customer feedback
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadFeedbacks}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddFeedback}>
              Add Feedback
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {feedbacks.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Feedback
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: 'white', fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" color="white" fontWeight="bold">
                      {averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                      Average Rating
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {positiveCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Positive
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {neutralCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Neutral
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.9)}, ${alpha(theme.palette.error.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {negativeCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Negative
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Sentiment Analysis</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Feedback by Category</Typography>
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

        {/* Feedback List */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Feedback</Typography>
          <Grid container spacing={2}>
            {feedbacks.map((feedback) => (
              <Grid item xs={12} key={feedback.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {feedback.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {feedback.email} • {new Date(feedback.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={feedback.rating} readOnly size="small" />
                        {getSentimentIcon(feedback.sentiment)}
                      </Box>
                    </Box>
                    <Chip label={feedback.category} size="small" sx={{ mb: 1 }} />
                    <Typography variant="body2">{feedback.comments}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Add Feedback Dialog */}
        <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Customer Feedback</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  value={formData.rating}
                  onChange={(e, newValue) => setFormData({ ...formData, rating: newValue })}
                  size="large"
                />
              </Grid>
              <Grid item xs={12}>
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
                  <option value="Service Quality">Service Quality</option>
                  <option value="Product Quality">Product Quality</option>
                  <option value="Claims Process">Claims Process</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Overall Experience">Overall Experience</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Comments"
                  multiline
                  rows={4}
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveFeedback}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CustomerFeedback;
