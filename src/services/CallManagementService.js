import api from './api';

const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

// In‑memory fallback state (deep clone of defaultState)
let mockState = {
  dialerConfig: {
    enabled: true,
    mode: 'predictive',
    callsPerAgent: 1.5,
    dialTimeout: 30,
    officeHours: {
      monday: { enabled: true, start: '09:00', end: '18:00' },
      tuesday: { enabled: true, start: '09:00', end: '18:00' },
      wednesday: { enabled: true, start: '09:00', end: '18:00' },
      thursday: { enabled: true, start: '09:00', end: '18:00' },
      friday: { enabled: true, start: '09:00', end: '18:00' },
      saturday: { enabled: false, start: '09:00', end: '14:00' },
      sunday: { enabled: false, start: '00:00', end: '00:00' }
    },
    holidays: [
      { date: '2025-01-26', name: 'Republic Day' },
      { date: '2025-03-14', name: 'Holi' },
      { date: '2025-08-15', name: 'Independence Day' },
      { date: '2025-10-02', name: 'Gandhi Jayanti' },
      { date: '2025-10-24', name: 'Diwali' },
      { date: '2025-12-25', name: 'Christmas' }
    ],
    breaks: [
      { name: 'Lunch Break', start: '13:00', end: '14:00', enabled: true },
      { name: 'Tea Break', start: '16:00', end: '16:15', enabled: true }
    ],
    maxConcurrentCalls: 50,
    abandonCallThreshold: 5,
    callRecordingEnabled: true,
    callRecordingAnnouncement: true
  },
  ivrConfig: {
    enabled: true,
    welcomeMessage: 'Thank you for calling ACE Insurance. Please select from the following options.',
    menuOptions: [
      { key: '1', label: 'New Policy Inquiry', route: 'sales-queue', priority: 'medium' },
      { key: '2', label: 'Policy Renewal', route: 'renewal-queue', priority: 'high' },
      { key: '3', label: 'Claims Support', route: 'claims-queue', priority: 'high' },
      { key: '4', label: 'Customer Service', route: 'service-queue', priority: 'medium' },
      { key: '0', label: 'Speak to Representative', route: 'general-queue', priority: 'low' }
    ],
    timeout: 10,
    maxRetries: 3,
    invalidInputMessage: 'Invalid selection. Please try again.',
    timeoutMessage: 'We did not receive your input. Transferring you to a representative.',
    callbackEnabled: true,
    queueMusicEnabled: true,
    estimatedWaitTimeEnabled: true
  },
  activeCalls: [],
  callHistory: [],
  missedCalls: [],
  agentStatus: {}
};

/** Helper to deep‑clone state when returning mock data */
const clone = (obj) => JSON.parse(JSON.stringify(obj));

/** Fetch the whole state */
export const fetchState = async () => {
  try {
    const response = await api.get('/call-management/state');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching call state, using mock:', error);
    await delay();
    return clone(mockState);
  }
};

/** Dialer config */
export const fetchDialerConfig = async () => {
  try {
    const response = await api.get('/call-management/dialer');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching dialer config, using mock:', error);
    await delay();
    return clone(mockState.dialerConfig);
  }
};

export const saveDialerConfig = async (updates) => {
  try {
    const response = await api.put('/call-management/dialer', updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving dialer config, using mock:', error);
    await delay();
    mockState.dialerConfig = { ...mockState.dialerConfig, ...updates };
    return clone(mockState.dialerConfig);
  }
};

/** IVR config */
export const fetchIvrConfig = async () => {
  try {
    const response = await api.get('/call-management/ivr');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching IVR config, using mock:', error);
    await delay();
    return clone(mockState.ivrConfig);
  }
};

export const saveIvrConfig = async (updates) => {
  try {
    const response = await api.put('/call-management/ivr', updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving IVR config, using mock:', error);
    await delay();
    mockState.ivrConfig = { ...mockState.ivrConfig, ...updates };
    return clone(mockState.ivrConfig);
  }
};

/** Holiday helpers */
export const addHoliday = async (holiday) => {
  try {
    const response = await api.post('/call-management/holidays', holiday);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding holiday, using mock:', error);
    await delay();
    mockState.dialerConfig.holidays.push(holiday);
    return holiday;
  }
};

export const removeHoliday = async (date) => {
  try {
    const response = await api.delete(`/call-management/holidays/${encodeURIComponent(date)}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error removing holiday, using mock:', error);
    await delay();
    mockState.dialerConfig.holidays = mockState.dialerConfig.holidays.filter(h => h.date !== date);
    return { success: true };
  }
};

/** Break helpers */
export const addBreak = async (breakData) => {
  try {
    const response = await api.post('/call-management/breaks', breakData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding break, using mock:', error);
    await delay();
    mockState.dialerConfig.breaks.push(breakData);
    return breakData;
  }
};

export const removeBreak = async (name) => {
  try {
    const response = await api.delete(`/call-management/breaks/${encodeURIComponent(name)}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error removing break, using mock:', error);
    await delay();
    mockState.dialerConfig.breaks = mockState.dialerConfig.breaks.filter(b => b.name !== name);
    return { success: true };
  }
};

export const updateBreak = async (name, updates) => {
  try {
    const response = await api.put(`/call-management/breaks/${encodeURIComponent(name)}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating break, using mock:', error);
    await delay();
    mockState.dialerConfig.breaks = mockState.dialerConfig.breaks.map(b => b.name === name ? { ...b, ...updates } : b);
    return clone(mockState.dialerConfig.breaks);
  }
};

/** IVR option helpers */
export const addIvrOption = async (option) => {
  try {
    const response = await api.post('/call-management/ivr/options', option);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding IVR option, using mock:', error);
    await delay();
    mockState.ivrConfig.menuOptions.push(option);
    return option;
  }
};

export const removeIvrOption = async (key) => {
  try {
    const response = await api.delete(`/call-management/ivr/options/${encodeURIComponent(key)}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error removing IVR option, using mock:', error);
    await delay();
    mockState.ivrConfig.menuOptions = mockState.ivrConfig.menuOptions.filter(o => o.key !== key);
    return { success: true };
  }
};

export const updateIvrOption = async (key, updates) => {
  try {
    const response = await api.put(`/call-management/ivr/options/${encodeURIComponent(key)}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating IVR option, using mock:', error);
    await delay();
    mockState.ivrConfig.menuOptions = mockState.ivrConfig.menuOptions.map(o => o.key === key ? { ...o, ...updates } : o);
    return clone(mockState.ivrConfig.menuOptions);
  }
};

/** Call lifecycle */
export const makeCall = async (phoneNumber, leadId = null, agentId = null, opts = {}) => {
  try {
    const response = await api.post('/call-management/calls', { phoneNumber, leadId, agentId, opts });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error making call, using mock:', error);
    await delay();
    const newCall = {
      id: `call-${Date.now()}`,
      phoneNumber,
      customerName: opts.customerName || 'Unknown',
      leadId,
      agent: opts.agentName || (agentId ? `agent-${agentId}` : 'Agent'),
      agentId,
      status: 'ringing',
      duration: 0,
      startTime: new Date().toISOString(),
      callType: 'outbound',
      disposition: null,
      recording: mockState.dialerConfig.callRecordingEnabled
    };
    mockState.activeCalls.push(newCall);
    return clone(newCall);
  }
};

export const endCall = async (callId, disposition = null) => {
  try {
    const response = await api.post(`/call-management/calls/${callId}/end`, { disposition });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error ending call, using mock:', error);
    await delay();
    const idx = mockState.activeCalls.findIndex(c => c.id === callId);
    if (idx === -1) return { success: false, error: 'Call not found' };
    const call = mockState.activeCalls[idx];
    const completed = { ...call, status: 'completed', endTime: new Date().toISOString(), disposition };
    mockState.activeCalls.splice(idx, 1);
    mockState.callHistory.unshift(completed);
    return { success: true, call: clone(completed) };
  }
};

export const transferCall = async (callId, toAgentId) => {
  try {
    const response = await api.post(`/call-management/calls/${callId}/transfer`, { toAgentId });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error transferring call, using mock:', error);
    await delay();
    mockState.activeCalls = mockState.activeCalls.map(c => c.id === callId ? { ...c, agentId: toAgentId, status: 'transferring' } : c);
    return { success: true };
  }
};

export const holdCall = async (callId) => {
  try {
    const response = await api.post(`/call-management/calls/${callId}/hold`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error holding call, using mock:', error);
    await delay();
    mockState.activeCalls = mockState.activeCalls.map(c => c.id === callId ? { ...c, status: 'on-hold' } : c);
    return { success: true };
  }
};

export const resumeCall = async (callId) => {
  try {
    const response = await api.post(`/call-management/calls/${callId}/resume`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error resuming call, using mock:', error);
    await delay();
    mockState.activeCalls = mockState.activeCalls.map(c => c.id === callId ? { ...c, status: 'active' } : c);
    return { success: true };
  }
};

export const bargeInCall = async (callId, supervisorId) => {
  try {
    const response = await api.post(`/call-management/calls/${callId}/barge`, { supervisorId });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error barging in, using mock:', error);
    await delay();
    mockState.activeCalls = mockState.activeCalls.map(c => c.id === callId ? { ...c, bargedBy: supervisorId } : c);
    return { success: true };
  }
};

export const whisperToAgent = async (callId, supervisorId) => {
  // purely local simulation – no backend needed
  await delay();
  return { success: true, message: 'Whisper mode activated' };
};

/** Missed call handling */
export const addMissedCall = async (missed) => {
  try {
    const response = await api.post('/call-management/missed', missed);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding missed call, using mock:', error);
    await delay();
    const newMissed = { ...missed, id: missed.id || `missed-${Date.now()}`, time: new Date().toISOString() };
    mockState.missedCalls.unshift(newMissed);
    return { success: true, missed: clone(newMissed) };
  }
};

export const getMissedCalls = async () => {
  try {
    const response = await api.get('/call-management/missed');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching missed calls, using mock:', error);
    await delay();
    return clone(mockState.missedCalls);
  }
};

export const redistributeMissedCall = async (callId, agentId) => {
  try {
    const response = await api.post(`/call-management/missed/${callId}/redistribute`, { agentId });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error redistributing missed call, using mock:', error);
    await delay();
    const idx = mockState.missedCalls.findIndex(c => c.id === callId);
    if (idx === -1) return { success: false, error: 'Missed call not found' };
    const missed = mockState.missedCalls.splice(idx, 1)[0];
    const newCall = await makeCall(missed.phoneNumber, missed.leadId, agentId);
    return { success: true, call: clone(newCall) };
  }
};

/** Agent status */
export const updateAgentStatus = async (agentId, status) => {
  try {
    const response = await api.put(`/call-management/agents/${agentId}/status`, { status });
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating agent status, using mock:', error);
    await delay();
    mockState.agentStatus = mockState.agentStatus || {};
    mockState.agentStatus[agentId] = { status, lastUpdated: new Date().toISOString() };
    return clone(mockState.agentStatus[agentId]);
  }
};

export const getAgentStatus = async (agentId) => {
  try {
    const response = await api.get(`/call-management/agents/${agentId}/status`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching agent status, using mock:', error);
    await delay();
    return mockState.agentStatus?.[agentId] || { status: 'offline', lastUpdated: null };
  }
};

/** Statistics */
export const getCallStatistics = async () => {
  try {
    const response = await api.get('/call-management/stats');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching call stats, using mock:', error);
    await delay();
    const s = mockState;
    const activeCalls = s.activeCalls.length;
    const activeOutbound = s.activeCalls.filter(c => c.callType === 'outbound').length;
    const activeInbound = s.activeCalls.filter(c => c.callType === 'inbound').length;
    const queuedCalls = s.activeCalls.filter(c => c.status === 'queued').length;
    const totalCallsToday = s.callHistory.length + s.activeCalls.length;
    const missedCallsToday = s.missedCalls.length;
    const avgCallDuration = s.callHistory.length > 0 ? s.callHistory.reduce((sum, c) => sum + (c.duration || 0), 0) / s.callHistory.length : 0;
    return {
      activeCalls,
      activeOutbound,
      activeInbound,
      queuedCalls,
      totalCallsToday,
      missedCallsToday,
      avgCallDuration,
      dialerEnabled: s.dialerConfig.enabled,
      ivrEnabled: s.ivrConfig.enabled
    };
  }
};

export default {
  fetchState,
  fetchDialerConfig,
  saveDialerConfig,
  fetchIvrConfig,
  saveIvrConfig,
  addHoliday,
  removeHoliday,
  addBreak,
  removeBreak,
  updateBreak,
  addIvrOption,
  removeIvrOption,
  updateIvrOption,
  makeCall,
  endCall,
  transferCall,
  holdCall,
  resumeCall,
  bargeInCall,
  whisperToAgent,
  addMissedCall,
  getMissedCalls,
  redistributeMissedCall,
  updateAgentStatus,
  getAgentStatus,
  getCallStatistics
};
