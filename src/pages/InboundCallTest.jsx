import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Alert,
  Chip,
  useTheme,
  Fade
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CallReceived as IncomingCallIcon,
  Schedule as FollowUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import QRCDialog from '../components/leads/QRCDialog';
import callService from '../services/callService';

const InboundCallTest = () => {
  const theme = useTheme();
  const [qrcDialogOpen, setQrcDialogOpen] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const handleOpenQRCDialog = () => {
    setQrcDialogOpen(true);
  };

  const handleCloseQRCDialog = () => {
    setQrcDialogOpen(false);
  };

  const handleQRCSubmit = (data) => {
    const newCall = {
      id: `CALL-${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString()
    };
    
    setCallHistory(prev => [newCall, ...prev]);
    setTestResults(prev => [...prev, {
      type: 'success',
      message: `Call tagged successfully: ${data.callerName || 'Unknown'} - ${data.reason}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const simulateIncomingCall = () => {
    const incomingCall = callService.captureIncomingCall();
    setActiveCall(incomingCall);
    setTestResults(prev => [...prev, {
      type: 'info',
      message: `Incoming call detected: ${incomingCall.callerNumber}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testCustomerLookup = async () => {
    const testNumber = '+91 98765 43210';
    const result = await callService.lookupCustomerByPhone(testNumber);
    
    setTestResults(prev => [...prev, {
      type: result.found ? 'success' : 'warning',
      message: result.found 
        ? `Customer found: ${result.customer.name} (${result.customer.email})`
        : `No customer found for ${testNumber}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
    setCallHistory([]);
    setActiveCall(null);
  };

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Inbound Call Tagging Test
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Test the automatic caller number capture and call tagging functionality
        </Typography>

        <Grid container spacing={3}>
          {/* Test Controls */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="primary" />
                  Test Controls
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<IncomingCallIcon />}
                    onClick={simulateIncomingCall}
                    fullWidth
                  >
                    Simulate Incoming Call
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    onClick={handleOpenQRCDialog}
                    fullWidth
                  >
                    Open Call Tagging Dialog
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={testCustomerLookup}
                    fullWidth
                  >
                    Test Customer Lookup
                  </Button>
                  
                  <Button
                    variant="text"
                    onClick={clearResults}
                    fullWidth
                  >
                    Clear Results
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Active Call Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Call Status
                </Typography>
                
                {activeCall ? (
                  <Alert severity="info" icon={<IncomingCallIcon />}>
                    <Typography variant="body2">
                      <strong>Incoming Call:</strong> {activeCall.callerNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Started: {activeCall.startTime.toLocaleTimeString()}
                    </Typography>
                  </Alert>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No active call
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Test Results */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Results
                </Typography>
                
                {testResults.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No test results yet. Use the controls above to test functionality.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {testResults.map((result, index) => (
                      <Alert key={index} severity={result.type}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <Typography variant="body2">
                            {result.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {result.timestamp}
                          </Typography>
                        </Box>
                      </Alert>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Call History */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FollowUpIcon color="primary" />
                  Tagged Calls History
                </Typography>
                
                {callHistory.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No calls tagged yet.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {callHistory.map((call, index) => (
                      <Paper key={index} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="600">
                            {call.callerName || 'Unknown Caller'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(call.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip label={call.communicationMode} size="small" />
                          <Chip label={call.type} size="small" color="primary" />
                          <Chip label={call.resolution} size="small" color={call.resolution === 'Resolved' ? 'success' : 'warning'} />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Reason:</strong> {call.reason}
                        </Typography>
                        
                        {call.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Notes:</strong> {call.notes}
                          </Typography>
                        )}
                        
                        {call.followUpRequired && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FollowUpIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color="primary">
                              Follow-up scheduled: {call.followUpDate ? new Date(call.followUpDate).toLocaleDateString() : 'Date TBD'}
                              {call.followUpTime && ` at ${call.followUpTime}`}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Feature Overview */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'background.default' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  Implemented Features
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      ✅ Automatic Caller Number Capture
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      System automatically captures incoming caller number from telephony integration
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      ✅ Customer Database Lookup
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Automatically searches customer database using captured phone number
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      ✅ Call Reason Tagging
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Comprehensive call reason categories including renewal queries, claims, etc.
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      ✅ Follow-up Date & Time
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Schedule follow-up appointments with specific date and time
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      ✅ Conversation Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Detailed notes about the conversation and customer requirements
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      ✅ Call Duration Tracking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Automatic calculation of call duration for performance metrics
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* QRC Dialog */}
        <QRCDialog
          open={qrcDialogOpen}
          onClose={handleCloseQRCDialog}
          onSubmit={handleQRCSubmit}
        />
      </Box>
    </Fade>
  );
};

export default InboundCallTest;