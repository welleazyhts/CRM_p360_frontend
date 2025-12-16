// CallRecordingService.js
// Service for CallRecording.jsx — uses the project's api wrapper (imported from './api').
// Provides mock-friendly implementations for local development.

import api from './api';

/**
 * Return the list of active calls.
 * In production this would call GET /calls?status=active (example)
 */
export const getActiveCalls = async () => {
  try {
    // Example backend call (uncomment when backend available):
    // const res = await api.get('/calls?status=active');
    // return res.data;
    
    // Mock data (matches the JSX initial-state shape)
    return [
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
    ];
  } catch (err) {
    console.error('getActiveCalls error', err);
    return [];
  }
};

/**
 * Barge into a call (supervisor connects). Returns updated call info.
 * Example backend: POST /calls/{id}/barge
 */
export const bargeIntoCall = async (callId) => {
  try {
    // const res = await api.post(`/calls/${callId}/barge`);
    // return res.data;

    // Mock response
    return {
      success: true,
      call: {
        id: callId,
        bargedIn: true,
        status: 'Active'
      }
    };
  } catch (err) {
    console.error('bargeIntoCall error', err);
    throw err;
  }
};

/**
 * Exit barge-in for a call (supervisor disconnects).
 * Example backend: POST /calls/{id}/barge/exit
 */
export const exitBarge = async (callId) => {
  try {
    // const res = await api.post(`/calls/${callId}/barge/exit`);
    // return res.data;

    // Mock response
    return {
      success: true,
      call: {
        id: callId,
        bargedIn: false,
        status: 'Active'
      }
    };
  } catch (err) {
    console.error('exitBarge error', err);
    throw err;
  }
};

/**
 * Toggle microphone (mute/unmute) for supervisor voice during barge.
 * Example backend: PUT /calls/{id}/supervisor/mute { muted: true/false }
 */
export const setSupervisorMute = async (callId, muted = true) => {
  try {
    // const res = await api.put(`/calls/${callId}/supervisor/mute`, { muted });
    // return res.data;

    // Mock response
    return { success: true, callId, muted };
  } catch (err) {
    console.error('setSupervisorMute error', err);
    throw err;
  }
};

/**
 * Toggle speaker for supervisor (local playback).
 * Example backend: PUT /calls/{id}/supervisor/speaker { speakerMuted: true/false }
 */
export const setSupervisorSpeakerMute = async (callId, speakerMuted = true) => {
  try {
    // const res = await api.put(`/calls/${callId}/supervisor/speaker`, { speakerMuted });
    // return res.data;

    // Mock response
    return { success: true, callId, speakerMuted };
  } catch (err) {
    console.error('setSupervisorSpeakerMute error', err);
    throw err;
  }
};

/**
 * Return list of agents (so you can show a dropdown, etc.)
 * Example backend: GET /agents
 */
export const getAgents = async () => {
  try {
    // const res = await api.get('/agents');
    // return res.data;

    // Mock list
    return ['Priya Sharma', 'Vikram Singh', 'Meera Joshi', 'Amit Verma', 'Neha Agarwal'];
  } catch (err) {
    console.error('getAgents error', err);
    return [];
  }
};

/**
 * Helper: Build or verify recording URL for the audio element
 * If you store recordings on CDN or backend, this method centralizes the logic.
 */
export const getRecordingUrl = (filename) => {
  if (!filename) return null;
  // If recordings are served from /recordings/ as in your JSX:
  return `/recordings/${filename}`;
  // Or if using API-based temporary URL:
  // return api.get(`/recordings/url?file=${encodeURIComponent(filename)}`).then(r => r.data.url);
};

const CallRecordingService = {
  getActiveCalls,
  bargeIntoCall,
  exitBarge,
  setSupervisorMute,
  setSupervisorSpeakerMute,
  getAgents,
  getRecordingUrl
};

export default CallRecordingService;
