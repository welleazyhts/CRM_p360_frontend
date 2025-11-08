// Call Service - Handles automatic caller number capture and customer lookup
import customers from '../mock/customerMocks';

class CallService {
  constructor() {
    this.activeCall = null;
    this.callHistory = [];
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
      
      console.log('Follow-up scheduled:', followUpReminder);
      
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
  getActiveCall
} = callService;