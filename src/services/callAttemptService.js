/**
 * Call Attempt Counter and Enforcement Service
 * Tracks call attempts and enforces business rules (minimum 7 attempts)
 */

import api from './api';

// Call Outcome Types
export const CALL_OUTCOMES = {
  CONNECTED: 'connected',
  NOT_REACHABLE: 'not_reachable',
  BUSY: 'busy',
  NO_ANSWER: 'no_answer',
  SWITCHED_OFF: 'switched_off',
  INVALID_NUMBER: 'invalid_number',
  CALL_BACK_LATER: 'call_back_later',
  VOICEMAIL: 'voicemail',
  WRONG_NUMBER: 'wrong_number'
};

// Status Change Eligibility
export const ELIGIBILITY_STATUS = {
  ELIGIBLE: 'eligible',
  NOT_ELIGIBLE: 'not_eligible',
  WARNING: 'warning'
};

// Minimum attempts required
const MIN_ATTEMPTS_REQUIRED = 7;

const callAttemptService = {
  /**
   * Record a call attempt
   * @param {Object} callData - Call details
   * @returns {Promise<Object>} Recorded call attempt
   */
  async recordCallAttempt(callData) {
    try {
      // In production: const response = await api.post('/api/call-attempts', callData);

      const callAttempt = {
        id: `CALL-${Date.now()}`,
        leadId: callData.leadId,
        phoneNumber: callData.phoneNumber,
        callDateTime: callData.callDateTime || new Date().toISOString(),
        duration: callData.duration || 0,
        outcome: callData.outcome,
        notes: callData.notes || '',
        agent: callData.agent || 'Current User',
        callType: callData.callType || 'outbound', // outbound, inbound, callback
        recording: callData.recording || null,
        followUpRequired: callData.followUpRequired || false,
        followUpDate: callData.followUpDate || null
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: callAttempt,
        message: 'Call attempt recorded successfully'
      };
    } catch (error) {
      console.error('Error recording call attempt:', error);
      throw error;
    }
  },

  /**
   * Get all call attempts for a lead
   * @param {String} leadId - Lead ID
   * @returns {Promise<Array>} List of call attempts
   */
  async getCallAttempts(leadId) {
    try {
      // In production: const response = await api.get(`/api/call-attempts/lead/${leadId}`);

      // Mock data
      const mockAttempts = [
        {
          id: 'CALL-001',
          leadId,
          phoneNumber: '+91-98765-43210',
          callDateTime: '2025-01-10T10:30:00',
          duration: 180,
          outcome: CALL_OUTCOMES.CONNECTED,
          notes: 'Customer interested, requested quote',
          agent: 'Agent A',
          callType: 'outbound'
        },
        {
          id: 'CALL-002',
          leadId,
          phoneNumber: '+91-98765-43210',
          callDateTime: '2025-01-12T14:15:00',
          duration: 0,
          outcome: CALL_OUTCOMES.NO_ANSWER,
          notes: 'No response',
          agent: 'Agent A',
          callType: 'outbound'
        },
        {
          id: 'CALL-003',
          leadId,
          phoneNumber: '+91-98765-43210',
          callDateTime: '2025-01-13T11:00:00',
          duration: 45,
          outcome: CALL_OUTCOMES.CALL_BACK_LATER,
          notes: 'Customer requested callback after 3 PM',
          agent: 'Agent B',
          callType: 'outbound',
          followUpRequired: true,
          followUpDate: '2025-01-13T15:00:00'
        },
        {
          id: 'CALL-004',
          leadId,
          phoneNumber: '+91-98765-43210',
          callDateTime: '2025-01-14T09:30:00',
          duration: 0,
          outcome: CALL_OUTCOMES.SWITCHED_OFF,
          notes: 'Phone switched off',
          agent: 'Agent A',
          callType: 'outbound'
        },
        {
          id: 'CALL-005',
          leadId,
          phoneNumber: '+91-98765-43210',
          callDateTime: '2025-01-15T16:20:00',
          duration: 120,
          outcome: CALL_OUTCOMES.CONNECTED,
          notes: 'Quote shared via WhatsApp',
          agent: 'Agent A',
          callType: 'outbound'
        },
        {
          id: 'CALL-006',
          leadId,
          phoneNumber: '+91-98765-43210',
          callDateTime: '2025-01-16T10:45:00',
          duration: 0,
          outcome: CALL_OUTCOMES.BUSY,
          notes: 'Line busy',
          agent: 'Agent C',
          callType: 'outbound'
        },
        {
          id: 'CALL-007',
          leadId,
          phoneNumber: '+91-98765-43210',
          callDateTime: '2025-01-17T13:00:00',
          duration: 90,
          outcome: CALL_OUTCOMES.CONNECTED,
          notes: 'Customer confirmed purchase',
          agent: 'Agent A',
          callType: 'outbound'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        data: mockAttempts,
        total: mockAttempts.length
      };
    } catch (error) {
      console.error('Error fetching call attempts:', error);
      throw error;
    }
  },

  /**
   * Get call attempt statistics for a lead
   * @param {String} leadId - Lead ID
   * @returns {Promise<Object>} Call statistics
   */
  async getCallStatistics(leadId) {
    try {
      const response = await this.getCallAttempts(leadId);
      const attempts = response.data;

      const stats = {
        totalAttempts: attempts.length,
        connectedCalls: attempts.filter(a => a.outcome === CALL_OUTCOMES.CONNECTED).length,
        totalDuration: attempts.reduce((sum, a) => sum + a.duration, 0),
        averageDuration: 0,
        lastCallDate: attempts.length > 0 ? attempts[attempts.length - 1].callDateTime : null,
        lastCallOutcome: attempts.length > 0 ? attempts[attempts.length - 1].outcome : null,
        outcomeBreakdown: {},
        eligibleForStatusChange: attempts.length >= MIN_ATTEMPTS_REQUIRED,
        attemptsRemaining: Math.max(0, MIN_ATTEMPTS_REQUIRED - attempts.length),
        minAttemptsRequired: MIN_ATTEMPTS_REQUIRED
      };

      // Calculate average duration (only for connected calls)
      if (stats.connectedCalls > 0) {
        const connectedDuration = attempts
          .filter(a => a.outcome === CALL_OUTCOMES.CONNECTED)
          .reduce((sum, a) => sum + a.duration, 0);
        stats.averageDuration = Math.round(connectedDuration / stats.connectedCalls);
      }

      // Outcome breakdown
      Object.values(CALL_OUTCOMES).forEach(outcome => {
        stats.outcomeBreakdown[outcome] = attempts.filter(a => a.outcome === outcome).length;
      });

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching call statistics:', error);
      throw error;
    }
  },

  /**
   * Check if lead is eligible for status change
   * @param {String} leadId - Lead ID
   * @param {String} proposedStatus - New status to set
   * @returns {Promise<Object>} Eligibility check result
   */
  async checkStatusChangeEligibility(leadId, proposedStatus) {
    try {
      const statsResponse = await this.getCallStatistics(leadId);
      const stats = statsResponse.data;

      const restrictedStatuses = ['not_interested', 'lost', 'closed_lost', 'do_not_contact'];

      let result = {
        eligible: true,
        status: ELIGIBILITY_STATUS.ELIGIBLE,
        message: 'Lead is eligible for status change',
        currentAttempts: stats.totalAttempts,
        requiredAttempts: MIN_ATTEMPTS_REQUIRED,
        attemptsRemaining: stats.attemptsRemaining
      };

      // Check if status change requires minimum attempts
      if (restrictedStatuses.includes(proposedStatus.toLowerCase())) {
        if (stats.totalAttempts < MIN_ATTEMPTS_REQUIRED) {
          result = {
            eligible: false,
            status: ELIGIBILITY_STATUS.NOT_ELIGIBLE,
            message: `Minimum ${MIN_ATTEMPTS_REQUIRED} call attempts required before marking as "${proposedStatus}". Current attempts: ${stats.totalAttempts}`,
            currentAttempts: stats.totalAttempts,
            requiredAttempts: MIN_ATTEMPTS_REQUIRED,
            attemptsRemaining: stats.attemptsRemaining
          };
        } else if (stats.connectedCalls === 0) {
          result = {
            eligible: true,
            status: ELIGIBILITY_STATUS.WARNING,
            message: `You have made ${stats.totalAttempts} attempts but never connected with the customer. Are you sure you want to proceed?`,
            currentAttempts: stats.totalAttempts,
            requiredAttempts: MIN_ATTEMPTS_REQUIRED,
            attemptsRemaining: 0
          };
        }
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error checking status change eligibility:', error);
      throw error;
    }
  },

  /**
   * Get call attempt summary for dashboard
   * @param {Object} filters - Date range and other filters
   * @returns {Promise<Object>} Call attempt summary
   */
  async getCallAttemptSummary(filters = {}) {
    try {
      // In production: const response = await api.get('/api/call-attempts/summary', { params: filters });

      const mockSummary = {
        totalCalls: 1250,
        connectedCalls: 780,
        connectionRate: 62.4,
        avgCallDuration: 145, // seconds
        totalCallTime: 34200, // seconds
        leadsWithMinAttempts: 450,
        leadsNeedingAttempts: 200,
        outcomeDistribution: {
          [CALL_OUTCOMES.CONNECTED]: 780,
          [CALL_OUTCOMES.NO_ANSWER]: 215,
          [CALL_OUTCOMES.NOT_REACHABLE]: 120,
          [CALL_OUTCOMES.BUSY]: 85,
          [CALL_OUTCOMES.SWITCHED_OFF]: 50
        },
        topPerformers: [
          { agent: 'Agent A', attempts: 320, connected: 210, rate: 65.6 },
          { agent: 'Agent B', attempts: 280, connected: 180, rate: 64.3 },
          { agent: 'Agent C', attempts: 250, connected: 155, rate: 62.0 }
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 400));

      return {
        success: true,
        data: mockSummary
      };
    } catch (error) {
      console.error('Error fetching call attempt summary:', error);
      throw error;
    }
  },

  /**
   * Get leads needing call attempts
   * @param {Number} maxAttempts - Maximum current attempts
   * @returns {Promise<Array>} Leads needing calls
   */
  async getLeadsNeedingAttempts(maxAttempts = MIN_ATTEMPTS_REQUIRED - 1) {
    try {
      // In production: const response = await api.get(`/api/call-attempts/leads-needing-attempts?max=${maxAttempts}`);

      const mockLeads = [
        {
          leadId: 'LEAD-001',
          leadName: 'Rajesh Kumar',
          phone: '+91-98765-43210',
          currentAttempts: 3,
          lastAttempt: '2025-01-15T10:00:00',
          lastOutcome: CALL_OUTCOMES.NO_ANSWER,
          priority: 'High',
          daysSinceLastAttempt: 2
        },
        {
          leadId: 'LEAD-002',
          leadName: 'Priya Sharma',
          phone: '+91-98765-43211',
          currentAttempts: 5,
          lastAttempt: '2025-01-16T14:30:00',
          lastOutcome: CALL_OUTCOMES.BUSY,
          priority: 'Medium',
          daysSinceLastAttempt: 1
        },
        {
          leadId: 'LEAD-003',
          leadName: 'Amit Patel',
          phone: '+91-98765-43212',
          currentAttempts: 2,
          lastAttempt: '2025-01-14T09:00:00',
          lastOutcome: CALL_OUTCOMES.SWITCHED_OFF,
          priority: 'High',
          daysSinceLastAttempt: 3
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: mockLeads.filter(lead => lead.currentAttempts < maxAttempts),
        total: mockLeads.filter(lead => lead.currentAttempts < maxAttempts).length
      };
    } catch (error) {
      console.error('Error fetching leads needing attempts:', error);
      throw error;
    }
  },

  /**
   * Validate call attempt before recording
   * @param {Object} callData - Call attempt data
   * @returns {Object} Validation result
   */
  validateCallAttempt(callData) {
    const errors = [];
    const warnings = [];

    if (!callData.leadId) {
      errors.push('Lead ID is required');
    }

    if (!callData.phoneNumber) {
      errors.push('Phone number is required');
    }

    if (!callData.outcome) {
      errors.push('Call outcome is required');
    }

    if (callData.duration && callData.duration > 0 && callData.outcome !== CALL_OUTCOMES.CONNECTED) {
      warnings.push('Call duration is set but outcome is not "connected"');
    }

    if (callData.outcome === CALL_OUTCOMES.CONNECTED && callData.duration === 0) {
      warnings.push('Connected call should have a duration greater than 0');
    }

    if (callData.followUpRequired && !callData.followUpDate) {
      warnings.push('Follow-up required but follow-up date not set');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  },

  /**
   * Get recommended next call time based on previous attempts
   * @param {String} leadId - Lead ID
   * @returns {Promise<Object>} Recommended call time
   */
  async getRecommendedCallTime(leadId) {
    try {
      const response = await this.getCallAttempts(leadId);
      const attempts = response.data;

      if (attempts.length === 0) {
        return {
          success: true,
          data: {
            recommended: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
            reason: 'First call attempt'
          }
        };
      }

      const lastAttempt = attempts[attempts.length - 1];
      const lastAttemptTime = new Date(lastAttempt.callDateTime);
      const hoursSinceLastAttempt = (Date.now() - lastAttemptTime.getTime()) / (1000 * 60 * 60);

      let waitHours = 24; // Default wait time
      let reason = 'Standard follow-up interval';

      // Adjust based on last outcome
      switch (lastAttempt.outcome) {
        case CALL_OUTCOMES.CONNECTED:
          waitHours = 48;
          reason = 'Customer was reached, wait before next contact';
          break;
        case CALL_OUTCOMES.BUSY:
        case CALL_OUTCOMES.NO_ANSWER:
          waitHours = 4;
          reason = 'Customer may be available soon';
          break;
        case CALL_OUTCOMES.SWITCHED_OFF:
          waitHours = 12;
          reason = 'Phone was off, wait before retry';
          break;
        case CALL_OUTCOMES.CALL_BACK_LATER:
          if (lastAttempt.followUpDate) {
            return {
              success: true,
              data: {
                recommended: lastAttempt.followUpDate,
                reason: 'Customer requested specific callback time'
              }
            };
          }
          waitHours = 24;
          reason = 'Customer requested callback';
          break;
        case CALL_OUTCOMES.INVALID_NUMBER:
        case CALL_OUTCOMES.WRONG_NUMBER:
          return {
            success: true,
            data: {
              recommended: null,
              reason: 'Number is invalid or wrong, update contact details first'
            }
          };
      }

      const recommendedTime = new Date(lastAttemptTime.getTime() + waitHours * 60 * 60 * 1000);

      return {
        success: true,
        data: {
          recommended: recommendedTime.toISOString(),
          reason,
          hoursSinceLastAttempt: Math.round(hoursSinceLastAttempt),
          recommendedWaitHours: waitHours
        }
      };
    } catch (error) {
      console.error('Error getting recommended call time:', error);
      throw error;
    }
  }
};

export default callAttemptService;
