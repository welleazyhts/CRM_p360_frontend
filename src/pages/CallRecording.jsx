import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon, Visibility as ViewDetailsIcon
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
      recordedAudio: 'call_recording_001.mp3'
    },
    {
      id: 2,
      customerName: 'Anita Patel',
      agent: 'Vikram Singh',
      duration: '12:45',
      callDateTime: '2025-01-20 11:30 AM',
      recordedAudio: 'call_recording_002.mp3'
    },
    {
      id: 3,
      customerName: 'Suresh Reddy',
      agent: 'Meera Joshi',
      duration: '03:12',
      callDateTime: '2025-01-20 02:45 PM',
      recordedAudio: 'call_recording_003.mp3'
    }
  ]);



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

  const handleBarge = (callId) => {
    alert('Manager joined silently');
  };

  const handleTransfer = (callId, newAgent) => {
    setActiveCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, agent: newAgent } : call
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
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
                <TableCell>Duration</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Recorded Audio</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{call.customerName}</TableCell>
                  <TableCell>{call.agent}</TableCell>
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
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => navigate(`/call-details/${call.id}`)}
                        color="primary"
                        size="small"
                      >
                        <ViewDetailsIcon />
                      </IconButton>
                    </Tooltip>
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

export default CallRecording;