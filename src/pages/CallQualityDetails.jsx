import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Divider, Alert, Container
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import QualityAssessmentForm from '../components/common/QualityAssessmentForm';
import { getCallStatus } from '../services/callService';

const CallQualityDetails = () => {
  const { callId } = useParams();
  const navigate = useNavigate();

  const [callData, setCallData] = useState({
    id: callId,
    customerName: 'Rajesh Kumar',
    agent: 'Priya Sharma',
    date: '2025-01-20',
    duration: '05:23',
    recordedAudio: 'call_recording_001.mp3'
  });

  useEffect(() => {
    let mounted = true;
    const loadStatus = async () => {
      if (!callId) return;
      try {
        const status = await getCallStatus(callId);
        if (!mounted) return;
        setCallData(prev => ({
          ...prev,
          agent: status.agentId || prev.agent,
          date: status.startTime ? new Date(status.startTime).toLocaleString() : prev.date,
          duration: status.duration && typeof status.duration === 'number' ? `${status.duration} secs` : (status.duration || prev.duration),
          recordedAudio: status.recordingUrl || prev.recordedAudio
        }));
      } catch (e) {
        // console.error('Failed to load call status', e);
      }
    };

    loadStatus();
    return () => { mounted = false; };
  }, [callId]);

  const [assessment, setAssessment] = useState({
    scores: {},
    assessmentData: {},
    criticalObservations: '',
    recommendations: ''
  });

  const handleAssessmentChange = (newAssessment) => {
    setAssessment(newAssessment);
  };

  const handleSave = () => {
    // Save complete assessment data
    console.log('Saving QA review:', {
      callId,
      assessment
    });
    navigate('/call-quality-monitoring');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
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

        {/* Call Information - Static Section at Top */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Call Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Customer Name
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {callData.customerName}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Agent
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {callData.agent}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {callData.date}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {callData.duration}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
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
            </Grid>
          </Grid>
        </Paper>

        {/* Quality Assessment Form */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Quality Assessment
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <QualityAssessmentForm onAssessmentChange={handleAssessmentChange} />

          {assessment.scores.overall && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Alert severity={
                assessment.scores.overall.percentage >= 80 ? 'success' :
                assessment.scores.overall.percentage >= 60 ? 'warning' : 'error'
              }>
                <Typography variant="subtitle1" gutterBottom>
                  Overall Score: {assessment.scores.overall.score} / {assessment.scores.overall.maxScore}
                  ({assessment.scores.overall.percentage.toFixed(1)}%)
                </Typography>
              </Alert>
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            fullWidth
            size="large"
            disabled={!assessment.scores.overall}
          >
            Save QA Review
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default CallQualityDetails;