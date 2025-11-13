import React, { createContext, useContext, useState, useEffect } from 'react';

const CallManagementContext = createContext();

export const useCallManagement = () => {
  const context = useContext(CallManagementContext);
  if (!context) {
    throw new Error('useCallManagement must be used within CallManagementProvider');
  }
  return context;
};

// Initial Dialer Configuration
const INITIAL_DIALER_CONFIG = {
  enabled: true,
  mode: 'predictive', // preview, progressive, predictive
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
  abandonCallThreshold: 5, // percentage
  callRecordingEnabled: true,
  callRecordingAnnouncement: true
};

// Initial IVR Configuration
const INITIAL_IVR_CONFIG = {
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
};

// Mock Active Calls
const MOCK_ACTIVE_CALLS = [
  {
    id: 'call-001',
    phoneNumber: '+91-9876543210',
    customerName: 'Rahul Sharma',
    leadId: '1',
    agent: 'Priya Patel',
    agentId: 'agent-001',
    status: 'active',
    duration: 245,
    startTime: new Date(Date.now() - 245000).toISOString(),
    callType: 'outbound',
    disposition: null,
    recording: true
  },
  {
    id: 'call-002',
    phoneNumber: '+91-9876543211',
    customerName: 'Priya Verma',
    leadId: '2',
    agent: 'Amit Kumar',
    agentId: 'agent-002',
    status: 'ringing',
    duration: 5,
    startTime: new Date(Date.now() - 5000).toISOString(),
    callType: 'outbound',
    disposition: null,
    recording: true
  },
  {
    id: 'call-003',
    phoneNumber: '+91-9876543212',
    customerName: 'Unknown',
    leadId: null,
    agent: 'Queue',
    agentId: null,
    status: 'queued',
    duration: 120,
    startTime: new Date(Date.now() - 120000).toISOString(),
    callType: 'inbound',
    queuePosition: 2,
    disposition: null,
    recording: false
  }
];

export const CallManagementProvider = ({ children }) => {
  const [dialerConfig, setDialerConfig] = useState(INITIAL_DIALER_CONFIG);
  const [ivrConfig, setIvrConfig] = useState(INITIAL_IVR_CONFIG);
  const [activeCalls, setActiveCalls] = useState(MOCK_ACTIVE_CALLS);
  const [callHistory, setCallHistory] = useState([]);
  const [missedCalls, setMissedCalls] = useState([]);
  const [agentStatus, setAgentStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // Load configuration from localStorage
  useEffect(() => {
    const savedDialerConfig = localStorage.getItem('dialerConfig');
    const savedIvrConfig = localStorage.getItem('ivrConfig');

    if (savedDialerConfig) {
      setDialerConfig(JSON.parse(savedDialerConfig));
    }

    if (savedIvrConfig) {
      setIvrConfig(JSON.parse(savedIvrConfig));
    }
  }, []);

  // Save configuration to localStorage
  useEffect(() => {
    if (dialerConfig) {
      localStorage.setItem('dialerConfig', JSON.stringify(dialerConfig));
    }
  }, [dialerConfig]);

  useEffect(() => {
    if (ivrConfig) {
      localStorage.setItem('ivrConfig', JSON.stringify(ivrConfig));
    }
  }, [ivrConfig]);

  // ============ DIALER FUNCTIONS ============

  const updateDialerConfig = (updates) => {
    setDialerConfig(prev => ({ ...prev, ...updates }));
    return { success: true };
  };

  const updateOfficeHours = (day, hours) => {
    setDialerConfig(prev => ({
      ...prev,
      officeHours: {
        ...prev.officeHours,
        [day]: hours
      }
    }));
    return { success: true };
  };

  const addHoliday = (holiday) => {
    setDialerConfig(prev => ({
      ...prev,
      holidays: [...prev.holidays, holiday]
    }));
    return { success: true };
  };

  const removeHoliday = (date) => {
    setDialerConfig(prev => ({
      ...prev,
      holidays: prev.holidays.filter(h => h.date !== date)
    }));
    return { success: true };
  };

  const addBreak = (breakData) => {
    setDialerConfig(prev => ({
      ...prev,
      breaks: [...prev.breaks, breakData]
    }));
    return { success: true };
  };

  const removeBreak = (name) => {
    setDialerConfig(prev => ({
      ...prev,
      breaks: prev.breaks.filter(b => b.name !== name)
    }));
    return { success: true };
  };

  const updateBreak = (name, updates) => {
    setDialerConfig(prev => ({
      ...prev,
      breaks: prev.breaks.map(b =>
        b.name === name ? { ...b, ...updates } : b
      )
    }));
    return { success: true };
  };

  // ============ IVR FUNCTIONS ============

  const updateIvrConfig = (updates) => {
    setIvrConfig(prev => ({ ...prev, ...updates }));
    return { success: true };
  };

  const addIvrOption = (option) => {
    setIvrConfig(prev => ({
      ...prev,
      menuOptions: [...prev.menuOptions, option]
    }));
    return { success: true };
  };

  const removeIvrOption = (key) => {
    setIvrConfig(prev => ({
      ...prev,
      menuOptions: prev.menuOptions.filter(opt => opt.key !== key)
    }));
    return { success: true };
  };

  const updateIvrOption = (key, updates) => {
    setIvrConfig(prev => ({
      ...prev,
      menuOptions: prev.menuOptions.map(opt =>
        opt.key === key ? { ...opt, ...updates } : opt
      )
    }));
    return { success: true };
  };

  // ============ CALL FUNCTIONS ============

  const makeCall = async (phoneNumber, leadId, agentId) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCall = {
      id: `call-${Date.now()}`,
      phoneNumber,
      customerName: 'Unknown',
      leadId,
      agent: 'Agent Name',
      agentId,
      status: 'ringing',
      duration: 0,
      startTime: new Date().toISOString(),
      callType: 'outbound',
      disposition: null,
      recording: dialerConfig.callRecordingEnabled
    };

    setActiveCalls(prev => [...prev, newCall]);
    setLoading(false);
    return { success: true, call: newCall };
  };

  const endCall = (callId, disposition) => {
    const call = activeCalls.find(c => c.id === callId);
    if (call) {
      const completedCall = {
        ...call,
        status: 'completed',
        endTime: new Date().toISOString(),
        disposition
      };

      setActiveCalls(prev => prev.filter(c => c.id !== callId));
      setCallHistory(prev => [completedCall, ...prev]);

      return { success: true };
    }
    return { success: false, error: 'Call not found' };
  };

  const transferCall = (callId, toAgentId) => {
    setActiveCalls(prev => prev.map(call =>
      call.id === callId
        ? { ...call, agentId: toAgentId, status: 'transferring' }
        : call
    ));
    return { success: true };
  };

  const holdCall = (callId) => {
    setActiveCalls(prev => prev.map(call =>
      call.id === callId
        ? { ...call, status: 'on-hold' }
        : call
    ));
    return { success: true };
  };

  const resumeCall = (callId) => {
    setActiveCalls(prev => prev.map(call =>
      call.id === callId
        ? { ...call, status: 'active' }
        : call
    ));
    return { success: true };
  };

  const bargeInCall = (callId, supervisorId) => {
    // Supervisor joins the call
    setActiveCalls(prev => prev.map(call =>
      call.id === callId
        ? { ...call, bargedBy: supervisorId }
        : call
    ));
    return { success: true, message: 'Successfully joined call' };
  };

  const whisperToAgent = (callId, supervisorId) => {
    // Supervisor can speak to agent without customer hearing
    return { success: true, message: 'Whisper mode activated' };
  };

  // ============ MISSED CALLS ============

  const getMissedCalls = () => {
    return missedCalls;
  };

  const redistributeMissedCall = (callId, agentId) => {
    const missedCall = missedCalls.find(c => c.id === callId);
    if (missedCall) {
      setMissedCalls(prev => prev.filter(c => c.id !== callId));
      // Create new outbound call
      makeCall(missedCall.phoneNumber, missedCall.leadId, agentId);
      return { success: true };
    }
    return { success: false, error: 'Missed call not found' };
  };

  // ============ AGENT STATUS ============

  const updateAgentStatus = (agentId, status) => {
    setAgentStatus(prev => ({
      ...prev,
      [agentId]: {
        status,
        lastUpdated: new Date().toISOString()
      }
    }));
    return { success: true };
  };

  const getAgentStatus = (agentId) => {
    return agentStatus[agentId] || { status: 'offline', lastUpdated: null };
  };

  // ============ STATISTICS ============

  const getCallStatistics = () => {
    return {
      activeCalls: activeCalls.length,
      activeOutbound: activeCalls.filter(c => c.callType === 'outbound').length,
      activeInbound: activeCalls.filter(c => c.callType === 'inbound').length,
      queuedCalls: activeCalls.filter(c => c.status === 'queued').length,
      totalCallsToday: callHistory.length + activeCalls.length,
      missedCallsToday: missedCalls.length,
      avgCallDuration: callHistory.length > 0
        ? callHistory.reduce((sum, call) => sum + (call.duration || 0), 0) / callHistory.length
        : 0,
      dialerEnabled: dialerConfig.enabled,
      ivrEnabled: ivrConfig.enabled
    };
  };

  // Update call durations every second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls(prev => prev.map(call => {
        if (call.status === 'active' || call.status === 'ringing') {
          const startTime = new Date(call.startTime);
          const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
          return { ...call, duration };
        }
        return call;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    // State
    dialerConfig,
    ivrConfig,
    activeCalls,
    callHistory,
    missedCalls,
    agentStatus,
    loading,

    // Dialer Functions
    updateDialerConfig,
    updateOfficeHours,
    addHoliday,
    removeHoliday,
    addBreak,
    removeBreak,
    updateBreak,

    // IVR Functions
    updateIvrConfig,
    addIvrOption,
    removeIvrOption,
    updateIvrOption,

    // Call Functions
    makeCall,
    endCall,
    transferCall,
    holdCall,
    resumeCall,
    bargeInCall,
    whisperToAgent,

    // Missed Calls
    getMissedCalls,
    redistributeMissedCall,

    // Agent Status
    updateAgentStatus,
    getAgentStatus,

    // Statistics
    getCallStatistics
  };

  return (
    <CallManagementContext.Provider value={value}>
      {children}
    </CallManagementContext.Provider>
  );
};
