import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Rating, TextField, Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';

const CallQualityDetails = () => {
  const { callId } = useParams();
  const navigate = useNavigate();

  const [callData] = useState({
    id: callId,
    customerName: 'Rajesh Kumar',
    agent: 'Priya Sharma',
    date: '2025-01-20',
    duration: '05:23',
    recordedAudio: 'call_recording_001.mp3'
  });

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSave = () => {
    // Save rating and feedback
    console.log('Saving QA review:', { callId, rating, feedback });
    navigate('/call-quality-monitoring');
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
        Call Quality Review
      </Typography>

      <Grid container spacing={3}>
        {/* Call Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Call Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Customer Name
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.customerName}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Agent
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.agent}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Date & Duration
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.date} - {callData.duration}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Recorded Audio
              </Typography>
              <Box sx={{ mt: 1 }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={`/recordings/${callData.recordedAudio}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* QA Review Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Quality Assessment
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Overall Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Rate from 1 (Poor) to 5 (Excellent)
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Feedback & Comments
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter detailed feedback about call quality, agent performance, customer satisfaction, etc."
                variant="outlined"
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              fullWidth
              size="large"
            >
              Save QA Review
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallQualityDetails;