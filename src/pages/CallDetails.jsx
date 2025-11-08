import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Grid, Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

const CallDetails = () => {
  const { callId } = useParams();
  const navigate = useNavigate();

  // Mock call data - in real app, fetch based on callId
  const callData = {
    id: callId,
    customerName: 'Rajesh Kumar',
    agent: 'Priya Sharma',
    callDateTime: '2025-01-20 10:15 AM',
    duration: '05:23',
    recordedAudio: 'call_recording_001.mp3',
    callerName: 'Priya Sharma',
    callReceiverName: 'Rajesh Kumar',
    conversation: [
      { speaker: 'Priya Sharma', message: 'Hello, good morning! This is Priya from ABC Insurance. Am I speaking with Mr. Rajesh Kumar?', timestamp: '10:15:02' },
      { speaker: 'Rajesh Kumar', message: 'Yes, this is Rajesh. Good morning.', timestamp: '10:15:08' },
      { speaker: 'Priya Sharma', message: 'Thank you for your time, Mr. Kumar. I am calling regarding your vehicle insurance policy that is expiring next month. Would you like to renew it?', timestamp: '10:15:15' },
      { speaker: 'Rajesh Kumar', message: 'Yes, I was planning to renew it. What are the premium rates for this year?', timestamp: '10:15:25' },
      { speaker: 'Priya Sharma', message: 'Based on your previous policy and no claim bonus, your premium would be ₹12,500 for comprehensive coverage. This includes third-party liability and own damage coverage.', timestamp: '10:15:35' },
      { speaker: 'Rajesh Kumar', message: 'That sounds reasonable. Can you also include roadside assistance?', timestamp: '10:15:50' },
      { speaker: 'Priya Sharma', message: 'Absolutely! Roadside assistance is included at no extra cost. I will send you the policy documents via email. Can you confirm your email address?', timestamp: '10:16:00' },
      { speaker: 'Rajesh Kumar', message: 'Yes, it is rajesh.kumar@email.com', timestamp: '10:16:15' },
      { speaker: 'Priya Sharma', message: 'Perfect! I will send the documents within the next hour. Is there anything else I can help you with today?', timestamp: '10:16:25' },
      { speaker: 'Rajesh Kumar', message: 'No, that covers everything. Thank you for your assistance.', timestamp: '10:16:35' },
      { speaker: 'Priya Sharma', message: 'Thank you for choosing ABC Insurance, Mr. Kumar. Have a great day!', timestamp: '10:16:40' }
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/call-recording')}
          sx={{ mb: 2 }}
        >
          Back to Call Recording
        </Button>
        
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Call Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side - Call Information and Participants */}
        <Grid item xs={12} md={4}>
          {/* Call Information Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Call Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Recorded Audio
              </Typography>
              <Box sx={{ mt: 1 }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={`/recordings/${callData.recordedAudio}`} type="audio/mpeg" />
                  <source src={`/recordings/${callData.recordedAudio}`} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Date & Time
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.callDateTime}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.duration}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Customer Name
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.customerName}
              </Typography>
            </Box>
          </Paper>

          {/* Call Participants Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              Call Participants
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Agent
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.callerName}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Customer
              </Typography>
              <Typography variant="body1" fontWeight="600">
                {callData.callReceiverName}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side - Conversation */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChatIcon color="primary" />
              Conversation
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
              {callData.conversation.map((message, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600" color="primary">
                      {message.speaker}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {message.timestamp}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {message.message}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallDetails;