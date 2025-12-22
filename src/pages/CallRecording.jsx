import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CallRecordingService from '../services/CallRecordingService';
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
  const [activeCalls, setActiveCalls] = useState([]);

  const [bargeState, setBargeState] = useState({
    open: false,
    callId: null,
    muted: false,
    speakerMuted: false
  });



  useEffect(() => {
    const fetchActiveCalls = async () => {
      try {
        const calls = await CallRecordingService.getActiveCalls();
        setActiveCalls(calls);
      } catch (error) {
        console.error('Error fetching active calls:', error);
      }
    };
    fetchActiveCalls();
  }, []);

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
  const handleBargeIn = async (callId) => {
    try {
      await CallRecordingService.bargeIntoCall(callId);
      setBargeState({
        open: true,
        callId,
        muted: true,
        speakerMuted: false
      });
      setActiveCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, bargedIn: true } : call
      ));
    } catch (error) {
      console.error('Error barging into call:', error);
    }
  };

  const handleBargeExit = async () => {
    const callId = bargeState.callId;
    try {
      await CallRecordingService.exitBarge(callId);
      setBargeState({
        open: false,
        callId: null,
        muted: false,
        speakerMuted: false
      });
      setActiveCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, bargedIn: false } : call
      ));
    } catch (error) {
      console.error('Error exiting barge:', error);
    }
  };

  const toggleMic = async () => {
    const newMuted = !bargeState.muted;
    try {
      await CallRecordingService.setSupervisorMute(bargeState.callId, newMuted);
      setBargeState(prev => ({ ...prev, muted: newMuted }));
    } catch (error) {
      console.error('Error toggling mic:', error);
    }
  };

  const toggleSpeaker = async () => {
    const newSpeakerMuted = !bargeState.speakerMuted;
    try {
      await CallRecordingService.setSupervisorSpeakerMute(bargeState.callId, newSpeakerMuted);
      setBargeState(prev => ({ ...prev, speakerMuted: newSpeakerMuted }));
    } catch (error) {
      console.error('Error toggling speaker:', error);
    }
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
                        <source src={CallRecordingService.getRecordingUrl(call.recordedAudio)} type="audio/mpeg" />
                        <source src={CallRecordingService.getRecordingUrl(call.recordedAudio)} type="audio/wav" />
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