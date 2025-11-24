// Call Service - Handles automatic caller number capture and customer lookup
import customers from '../mock/customerMocks';
import api from './api';

class CallService {
  constructor() {
    this.activeCall = null;
    this.callHistory = [];
    // In-memory mock store for initiated calls (fallback when backend is unavailable)
    this._mockCalls = new Map();
  }

  // Simulate automatic caller number capture from telephony system
  captureIncomingCall() {
    // In real implementation, this would integrate with telephony systems like:
    // - Asterisk PBX
    // - Avaya
    // - Cisco CallManager
    // - Cloud telephony providers (Twilio, etc.)
    
    const simulatedIncomingNumbers = [
      '+91 98765 43210',
      '+91 98765 43211', 
      '+91 98765 43212',
      '+91 98765 43213',
      '+91 98765 43214'
    ];
    
    const randomNumber = simulatedIncomingNumbers[Math.floor(Math.random() * simulatedIncomingNumbers.length)];
    
    this.activeCall = {
      callerNumber: randomNumber,
      startTime: new Date(),
      callId: `CALL-${Date.now()}`,
      status: 'incoming'
    };
    
    return this.activeCall;
  }

  // Search customer database using phone number
  async lookupCustomerByPhone(phoneNumber) {
    try {
      // Clean phone number (remove spaces, dashes, country code)
      const cleanNumber = phoneNumber.replace(/[^\d]/g, '').slice(-10);
      
      // Search in customer database
      const customer = customers.find(customer => {
        const customerPhone = customer.phone?.replace(/[^\d]/g, '').slice(-10);
        return customerPhone === cleanNumber;
      });

      if (customer) {
        return {
          found: true,
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            policies: customer.policies || [],
            lastContact: customer.lastContact,
            status: customer.status
          }
        };
      }

      return {
        found: false,
        customer: null
      };
    } catch (error) {
      console.error('Error looking up customer:', error);
      return {
        found: false,
        customer: null,
        error: error.message
      };
    }
  }

  // Save call details with tagging information
  async saveCallDetails(callData) {
    try {
      const callRecord = {
        id: `CALL-${Date.now()}`,
        ...callData,
        timestamp: new Date().toISOString(),
        duration: this.calculateCallDuration(),
        status: 'completed'
      };

      // In real implementation, this would save to database
      this.callHistory.push(callRecord);
      
      // If follow-up is required, schedule it
      if (callData.followUpRequired && callData.followUpDate && callData.followUpTime) {
        await this.scheduleFollowUp(callRecord);
      }

      return {
        success: true,
        callId: callRecord.id,
        message: 'Call details saved successfully'
      };
    } catch (error) {
      console.error('Error saving call details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Schedule follow-up reminder
  async scheduleFollowUp(callRecord) {
    try {
      const followUpDateTime = new Date(`${callRecord.followUpDate}T${callRecord.followUpTime}`);
      
      const followUpReminder = {
        id: `FOLLOWUP-${Date.now()}`,
        callId: callRecord.id,
        customerId: callRecord.customerId,
        customerName: callRecord.customerName,
        scheduledDateTime: followUpDateTime,
        reason: callRecord.callReason,
        notes: callRecord.callNotes,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      // In real implementation, this would:
      // 1. Save to database
      // 2. Create calendar event
      // 3. Set up notification/reminder system
      
      return followUpReminder;
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      throw error;
    }
  }

  // Calculate call duration
  calculateCallDuration() {
    if (!this.activeCall || !this.activeCall.startTime) {
      return '0 mins';
    }
    
    const endTime = new Date();
    const durationMs = endTime - this.activeCall.startTime;
    const durationMins = Math.floor(durationMs / (1000 * 60));
    const durationSecs = Math.floor((durationMs % (1000 * 60)) / 1000);
    
    if (durationMins > 0) {
      return `${durationMins} mins ${durationSecs} secs`;
    } else {
      return `${durationSecs} secs`;
    }
  }

  // End current call
  endCall() {
    if (this.activeCall) {
      this.activeCall.endTime = new Date();
      this.activeCall.duration = this.calculateCallDuration();
      this.activeCall.status = 'ended';
      
      const completedCall = { ...this.activeCall };
      this.activeCall = null;
      
      return completedCall;
    }
    return null;
  }

  // Get call history
  getCallHistory() {
    return this.callHistory;
  }

  // Get active call information
  getActiveCall() {
    return this.activeCall;
  }

  // Fetch paginated & filterable list of calls
  async fetchCallLogs(filters = {}) {
    const { page = 1, limit = 10, from, to, status, agentId, direction, search } = filters;
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', limit);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (status) params.set('status', status);
      if (agentId) params.set('agentId', agentId);
      if (direction) params.set('direction', direction);
      if (search) params.set('search', search);

      const resp = await api.get(`/calls?${params.toString()}`);
      // Expecting backend to return { calls, pagination }
      if (resp && resp.data && (resp.data.calls || resp.data.pagination)) {
        return resp.data;
      }
      // If backend returns empty shape, fall through to mock
      throw new Error('Unexpected backend response');
    } catch (err) {
      // Deterministic mock: generate calls based on page & limit
      const total = 137; // deterministic total
      const calls = [];
      const start = (page - 1) * limit;
      for (let i = 0; i < limit; i++) {
        const idx = start + i + 1;
        if (idx > total) break;
        calls.push({
          callId: `MOCK-CALL-${String(idx).padStart(4, '0')}`,
          timestamp: new Date(Date.now() - idx * 60000).toISOString(),
          from: `+91 9${String(700000000 + idx).slice(-9)}`,
          to: `+91 8${String(700000000 + idx).slice(-9)}`,
          agentId: `agent-${(idx % 5) + 1}`,
          direction: idx % 2 === 0 ? 'outbound' : 'inbound',
          status: ['queued', 'in-progress', 'completed', 'failed'][idx % 4],
          duration: `${Math.floor((idx % 7) + 1)} mins ${Math.floor((idx % 60))} secs`,
          notes: `Mock call record #${idx}`
        });
      }

      return {
        calls,
        pagination: { page, limit, total }
      };
    }
  }

  // Initiate an outbound call (real backend or mock)
  async initiateCall(payload = {}) {
    const { to, from, agentId, clientId, metadata } = payload;

    // Basic validation
    if (!to) {
      throw new Error('Missing required field: to');
    }
    if (!from && !agentId) {
      throw new Error('Either "from" or "agentId" must be provided');
    }

    try {
      const resp = await api.post('/calls/initiate', payload);
      // If backend responds with useful data, normalize and return
      if (resp && resp.data) {
        return resp.data;
      }
      throw new Error('Unexpected backend response');
    } catch (err) {
      // Fallback mock: create synthetic call and simulate lifecycle
      const callId = `MOCK-CALL-${Date.now()}`;
      const queuedAt = new Date().toISOString();
      const dialerQueueId = `DQ-${Math.floor(Math.random() * 1000000)}`;

      const record = {
        callId,
        to,
        from: from || null,
        agentId: agentId || null,
        clientId: clientId || null,
        metadata: metadata || null,
        status: 'queued',
        queuedAt,
        dialerQueueId,
        history: [{ status: 'queued', at: queuedAt }]
      };

      // Store in in-memory mock store
      this._mockCalls.set(callId, record);

      // Simulate transitions: queued -> in-progress -> completed
      // queued -> in-progress after 2s
      setTimeout(() => {
        const r = this._mockCalls.get(callId);
        if (!r) return;
        r.status = 'in-progress';
        r.startTime = new Date().toISOString();
        r.history.push({ status: 'in-progress', at: r.startTime });
        this._mockCalls.set(callId, r);
      }, 2000);

      // in-progress -> completed after additional 4s
      setTimeout(() => {
        const r = this._mockCalls.get(callId);
        if (!r) return;
        r.status = 'completed';
        r.endTime = new Date().toISOString();
        // duration in seconds
        const durationSec = Math.floor((new Date(r.endTime) - new Date(r.startTime || r.queuedAt)) / 1000);
        r.duration = durationSec;
        r.history.push({ status: 'completed', at: r.endTime });
        this._mockCalls.set(callId, r);
      }, 6000);

      return {
        success: true,
        callId,
        status: 'queued',
        queuedAt,
        dialerQueueId,
        message: 'Call queued in mock dialer'
      };
    }
  }

  // Get status of a call (backend or mock)
  async getCallStatus(callId) {
    if (!callId) throw new Error('Missing callId');
    try {
      const resp = await api.get(`/calls/${encodeURIComponent(callId)}/status`);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      // Fallback to in-memory store
      const record = this._mockCalls.get(callId);
      if (!record) {
        return {
          callId,
          status: 'unknown'
        };
      }
      return {
        callId: record.callId,
        status: record.status,
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.duration,
        agentId: record.agentId,
        notes: record.notes || null,
        recordingUrl: record.recordingUrl || null,
        history: record.history || []
      };
    }
  }

  // Optional: hangup a call
  async hangupCall(callId) {
    if (!callId) throw new Error('Missing callId');
    try {
      const resp = await api.post(`/calls/${encodeURIComponent(callId)}/hangup`);
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const record = this._mockCalls.get(callId);
      if (!record) throw new Error('Call not found in mock store');
      record.status = 'hungup';
      record.endTime = new Date().toISOString();
      record.duration = Math.floor((new Date(record.endTime) - new Date(record.startTime || record.queuedAt)) / 1000);
      record.history.push({ status: 'hungup', at: record.endTime });
      this._mockCalls.set(callId, record);
      return { success: true, callId, status: record.status };
    }
  }

  // Optional: transfer call to another agent/target
  async transferCall(callId, target) {
    if (!callId) throw new Error('Missing callId');
    if (!target) throw new Error('Missing transfer target');
    try {
      const resp = await api.post(`/calls/${encodeURIComponent(callId)}/transfer`, { target });
      if (resp && resp.data) return resp.data;
      throw new Error('Unexpected backend response');
    } catch (err) {
      const record = this._mockCalls.get(callId);
      if (!record) throw new Error('Call not found in mock store');
      record.status = 'transferred';
      record.transferredTo = target;
      const at = new Date().toISOString();
      record.history.push({ status: 'transferred', at, target });
      this._mockCalls.set(callId, record);
      return { success: true, callId, status: record.status, transferredTo: target };
    }
  }

  // Simulate integration with different telephony systems
  integrateWithTelephonySystem(systemType) {
    const integrations = {
      asterisk: {
        endpoint: 'http://asterisk-server/api/calls',
        method: 'GET',
        headers: { 'Authorization': 'Bearer <token>' }
      },
      twilio: {
        endpoint: 'https://api.twilio.com/2010-04-01/Accounts/<SID>/Calls',
        method: 'GET',
        headers: { 'Authorization': 'Basic <credentials>' }
      },
      avaya: {
        endpoint: 'https://avaya-server/api/v1/calls',
        method: 'GET',
        headers: { 'X-API-Key': '<api-key>' }
      }
    };

    return integrations[systemType] || null;
  }
}

// Create singleton instance
const callService = new CallService();

export default callService;

// Export individual functions for easier importing
export const {
  captureIncomingCall,
  lookupCustomerByPhone,
  saveCallDetails,
  scheduleFollowUp,
  endCall,
  getCallHistory,
  getActiveCall,
  fetchCallLogs,
  initiateCall,
  getCallStatus,
  hangupCall,
  transferCall
} = callService;