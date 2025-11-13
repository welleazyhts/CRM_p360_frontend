import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText,
  Stack, Badge
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Visibility as ViewDetailsIcon,
  CallMerge as BargeInIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  CallEnd as CallEndIcon
} from '@mui/icons-material';

const CallRecording = () => {
  const navigate = useNavigate();
  const [activeCalls, setActiveCalls] = useState([
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      agent: 'Priya Sharma',
      duration: '05:23',
      callDateTime: '2025-01-20 10:15 AM',
      recordedAudio: 'call_recording_001.mp3',
      status: 'Active',
      bargedIn: false
    },
    {
      id: 2,
      customerName: 'Anita Patel',
      agent: 'Vikram Singh',
      duration: '12:45',
      callDateTime: '2025-01-20 11:30 AM',
      recordedAudio: 'call_recording_002.mp3',
      status: 'Active',
      bargedIn: false
    },
    {
      id: 3,
      customerName: 'Suresh Reddy',
      agent: 'Meera Joshi',
      duration: '03:12',
      callDateTime: '2025-01-20 02:45 PM',
      recordedAudio: 'call_recording_003.mp3',
      status: 'Active',
      bargedIn: false
    }
  ]);

  const [bargeState, setBargeState] = useState({
    open: false,
    callId: null,
    muted: false,
    speakerMuted: false
  });



  const agents = ['Priya Sharma', 'Vikram Singh', 'Meera Joshi', 'Amit Verma', 'Neha Agarwal'];

  const handleRecordingControl = (callId, action) => {
    setActiveCalls(prev => prev.map(call => {
      if (call.id === callId) {
        switch (action) {
          case 'start':
            return { ...call, recording: true, recordingPaused: false };
          case 'pause':
            return { ...call, recordingPaused: !call.recordingPaused };
          case 'stop':
            return { ...call, recording: false, recordingPaused: false };
          default:
            return call;
        }
      }
      return call;
    }));
  };

  const handleBargeIn = (callId) => {
    setBargeState({
      open: true,
      callId,
      muted: true, // Start muted by default for safety
      speakerMuted: false
    });
    
    // Update call status to indicate barge-in
    setActiveCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, bargedIn: true } : call
    ));
  };

  const handleBargeExit = () => {
    const callId = bargeState.callId;
    setBargeState({
      open: false,
      callId: null,
      muted: false,
      speakerMuted: false
    });
    
    // Update call status to remove barge-in indication
    setActiveCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, bargedIn: false } : call
    ));
  };

  const toggleMic = () => {
    setBargeState(prev => ({
      ...prev,
      muted: !prev.muted
    }));
  };

  const toggleSpeaker = () => {
    setBargeState(prev => ({
      ...prev,
      speakerMuted: !prev.speakerMuted
    }));
  };

  const getStatusColor = (status, bargedIn) => {
    if (bargedIn) return 'secondary';
    switch (status) {
      case 'Active': return 'success';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status, bargedIn) => {
    if (bargedIn) return 'Supervisor Connected';
    return status;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Call Recording Management
      </Typography>

      {/* Active Calls Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Active Calls
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Recorded Audio</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{call.customerName}</TableCell>
                  <TableCell>{call.agent}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(call.status, call.bargedIn)}
                      color={getStatusColor(call.status, call.bargedIn)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {call.callDateTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <audio controls style={{ width: '200px' }}>
                        <source src={`/recordings/${call.recordedAudio}`} type="audio/mpeg" />
                        <source src={`/recordings/${call.recordedAudio}`} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => navigate(`/call-details/${call.id}`)}
                          color="primary"
                          size="small"
                        >
                          <ViewDetailsIcon />
                        </IconButton>
                      </Tooltip>
                      {call.status === 'Active' && !call.bargedIn && (
                        <Tooltip title="Barge Into Call">
                          <IconButton
                            onClick={() => handleBargeIn(call.id)}
                            color="secondary"
                            size="small"
                          >
                            <BargeInIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>


      {/* Barge In Dialog */}
      <Dialog
        open={bargeState.open}
        onClose={handleBargeExit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Call Monitoring Controls
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {activeCalls.find(call => call.id === bargeState.callId)?.customerName}'s call with {activeCalls.find(call => call.id === bargeState.callId)?.agent}
          </DialogContentText>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Tooltip title={bargeState.muted ? "Unmute Microphone" : "Mute Microphone"}>
              <IconButton 
                onClick={toggleMic}
                color={bargeState.muted ? "error" : "success"}
                size="large"
              >
                {bargeState.muted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={bargeState.speakerMuted ? "Unmute Speaker" : "Mute Speaker"}>
              <IconButton
                onClick={toggleSpeaker}
                color={bargeState.speakerMuted ? "error" : "success"}
                size="large"
              >
                {bargeState.speakerMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="End Call Monitoring">
              <IconButton
                onClick={handleBargeExit}
                color="error"
                size="large"
              >
                <CallEndIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
            Call Duration: {activeCalls.find(call => call.id === bargeState.callId)?.duration}
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallRecording;