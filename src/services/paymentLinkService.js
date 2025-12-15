import api from './api';

// Payment Gateway Providers
export const PAYMENT_PROVIDERS = {
  RAZORPAY: 'razorpay',
  PAYU: 'payu',
  STRIPE: 'stripe',
  CCAVENUE: 'ccavenue',
  PHONEPE: 'phonepe',
  PAYTM: 'paytm'
};

// Payment Link Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment Type
export const PAYMENT_TYPE = {
  PREMIUM: 'premium',
  RENEWAL: 'renewal',
  ENDORSEMENT: 'endorsement',
  INSPECTION: 'inspection',
  OTHER: 'other'
};

const paymentLinkService = {
  /**
   * Create a new payment link
   * @param {Object} paymentData - Payment link details
   * @returns {Promise<Object>} Created payment link
   */
  async createPaymentLink(paymentData) {
    try {
      // In production, this would call the actual backend API
      // const response = await api.post('/api/payments/create-link', paymentData);
      // return response.data;

      // Mock implementation for frontend
      const mockLink = {
        id: `PAY-${Date.now()}`,
        linkId: `LINK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        shortUrl: `https://pay.veriright.com/${Math.random().toString(36).substr(2, 6)}`,
        longUrl: `https://payment.veriright.com/pay?id=${Date.now()}&token=${Math.random().toString(36).substr(2, 20)}`,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        description: paymentData.description,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
        policyNumber: paymentData.policyNumber,
        leadId: paymentData.leadId,
        paymentType: paymentData.paymentType,
        provider: paymentData.provider || PAYMENT_PROVIDERS.RAZORPAY,
        status: PAYMENT_STATUS.PENDING,
        expiryDate: paymentData.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: paymentData.createdBy || 'System',
        metadata: paymentData.metadata || {},
        sendSMS: paymentData.sendSMS || false,
        sendEmail: paymentData.sendEmail || false,
        sendWhatsApp: paymentData.sendWhatsApp || false,
        reminderEnabled: paymentData.reminderEnabled || false,
        reminderDays: paymentData.reminderDays || 3
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        data: mockLink,
        message: 'Payment link created successfully'
      };
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  },

  /**
   * Get all payment links with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of payment links
   */
  async getPaymentLinks(filters = {}) {
    try {
      // In production: const response = await api.get('/api/payments/links', { params: filters });

      // Mock data
      const mockLinks = [
        {
          id: 'PAY-001',
          linkId: 'LINK-ABC123',
          shortUrl: 'https://pay.veriright.com/abc123',
          amount: 15000,
          currency: 'INR',
          description: 'Car Insurance Premium - Honda City',
          customerName: 'Rajesh Kumar',
          customerEmail: 'rajesh.kumar@email.com',
          customerPhone: '+91-9876543210',
          policyNumber: 'POL-2024-001',
          leadId: 'LEAD-001',
          paymentType: PAYMENT_TYPE.PREMIUM,
          provider: PAYMENT_PROVIDERS.RAZORPAY,
          status: PAYMENT_STATUS.PAID,
          paidAmount: 15000,
          paidAt: '2025-01-15T10:30:00',
          expiryDate: '2025-01-25T23:59:59',
          createdAt: '2025-01-10T09:00:00',
          createdBy: 'Agent A',
          transactionId: 'TXN-ABC123XYZ'
        },
        {
          id: 'PAY-002',
          linkId: 'LINK-DEF456',
          shortUrl: 'https://pay.veriright.com/def456',
          amount: 8500,
          currency: 'INR',
          description: 'Two Wheeler Insurance Renewal',
          customerName: 'Priya Sharma',
          customerEmail: 'priya.s@email.com',
          customerPhone: '+91-9876543211',
          policyNumber: 'POL-2024-002',
          leadId: 'LEAD-002',
          paymentType: PAYMENT_TYPE.RENEWAL,
          provider: PAYMENT_PROVIDERS.PAYU,
          status: PAYMENT_STATUS.PENDING,
          expiryDate: '2025-01-28T23:59:59',
          createdAt: '2025-01-16T14:20:00',
          createdBy: 'Agent B',
          sentVia: ['sms', 'whatsapp'],
          lastReminderSent: '2025-01-17T10:00:00'
        },
        {
          id: 'PAY-003',
          linkId: 'LINK-GHI789',
          shortUrl: 'https://pay.veriright.com/ghi789',
          amount: 25000,
          currency: 'INR',
          description: 'Commercial Vehicle Insurance',
          customerName: 'Amit Patel',
          customerEmail: 'amit.p@email.com',
          customerPhone: '+91-9876543212',
          policyNumber: null,
          leadId: 'LEAD-003',
          paymentType: PAYMENT_TYPE.PREMIUM,
          provider: PAYMENT_PROVIDERS.RAZORPAY,
          status: PAYMENT_STATUS.EXPIRED,
          expiryDate: '2025-01-12T23:59:59',
          createdAt: '2025-01-05T11:00:00',
          createdBy: 'Agent C'
        },
        {
          id: 'PAY-004',
          linkId: 'LINK-JKL012',
          shortUrl: 'https://pay.veriright.com/jkl012',
          amount: 5000,
          currency: 'INR',
          description: 'Vehicle Inspection Fee',
          customerName: 'Sneha Reddy',
          customerEmail: 'sneha.r@email.com',
          customerPhone: '+91-9876543213',
          policyNumber: 'POL-2024-004',
          leadId: 'LEAD-004',
          paymentType: PAYMENT_TYPE.INSPECTION,
          provider: PAYMENT_PROVIDERS.PHONEPE,
          status: PAYMENT_STATUS.FAILED,
          failureReason: 'Insufficient funds',
          expiryDate: '2025-01-30T23:59:59',
          createdAt: '2025-01-17T16:45:00',
          createdBy: 'Agent A'
        },
        {
          id: 'PAY-005',
          linkId: 'LINK-MNO345',
          shortUrl: 'https://pay.veriright.com/mno345',
          amount: 12000,
          currency: 'INR',
          description: 'Policy Endorsement - NCB Transfer',
          customerName: 'Vikram Singh',
          customerEmail: 'vikram.s@email.com',
          customerPhone: '+91-9876543214',
          policyNumber: 'POL-2024-005',
          leadId: 'LEAD-005',
          paymentType: PAYMENT_TYPE.ENDORSEMENT,
          provider: PAYMENT_PROVIDERS.RAZORPAY,
          status: PAYMENT_STATUS.PENDING,
          expiryDate: '2025-01-22T23:59:59',
          createdAt: '2025-01-15T13:15:00',
          createdBy: 'Agent B',
          partialPayment: true,
          paidAmount: 6000,
          remainingAmount: 6000
        }
      ];

      // Apply filters
      let filteredLinks = [...mockLinks];

      if (filters.status) {
        filteredLinks = filteredLinks.filter(link => link.status === filters.status);
      }

      if (filters.paymentType) {
        filteredLinks = filteredLinks.filter(link => link.paymentType === filters.paymentType);
      }

      if (filters.provider) {
        filteredLinks = filteredLinks.filter(link => link.provider === filters.provider);
      }

      if (filters.leadId) {
        filteredLinks = filteredLinks.filter(link => link.leadId === filters.leadId);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLinks = filteredLinks.filter(link =>
          link.customerName.toLowerCase().includes(searchLower) ||
          link.customerPhone.includes(searchLower) ||
          link.linkId.toLowerCase().includes(searchLower) ||
          link.policyNumber?.toLowerCase().includes(searchLower)
        );
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: filteredLinks,
        total: filteredLinks.length
      };
    } catch (error) {
      console.error('Error fetching payment links:', error);
      throw error;
    }
  },

  /**
   * Get payment link by ID
   * @param {String} linkId - Payment link ID
   * @returns {Promise<Object>} Payment link details
   */
  async getPaymentLinkById(linkId) {
    try {
      // In production: const response = await api.get(`/api/payments/links/${linkId}`);

      const response = await this.getPaymentLinks({});
      const link = response.data.find(l => l.linkId === linkId || l.id === linkId);

      if (!link) {
        throw new Error('Payment link not found');
      }

      return {
        success: true,
        data: link
      };
    } catch (error) {
      console.error('Error fetching payment link:', error);
      throw error;
    }
  },

  /**
   * Send payment link via SMS/Email/WhatsApp
   * @param {String} linkId - Payment link ID
   * @param {Object} channels - Channels to send {sms, email, whatsapp}
   * @returns {Promise<Object>} Send status
   */
  async sendPaymentLink(linkId, channels) {
    try {
      // In production: const response = await api.post(`/api/payments/links/${linkId}/send`, channels);

      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        success: true,
        message: 'Payment link sent successfully',
        channels: {
          sms: channels.sms ? 'sent' : 'not_requested',
          email: channels.email ? 'sent' : 'not_requested',
          whatsapp: channels.whatsapp ? 'sent' : 'not_requested'
        }
      };
    } catch (error) {
      console.error('Error sending payment link:', error);
      throw error;
    }
  },

  /**
   * Cancel a payment link
   * @param {String} linkId - Payment link ID
   * @param {String} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation status
   */
  async cancelPaymentLink(linkId, reason) {
    try {
      // In production: const response = await api.post(`/api/payments/links/${linkId}/cancel`, { reason });

      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        message: 'Payment link cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling payment link:', error);
      throw error;
    }
  },

  /**
   * Resend reminder for pending payment
   * @param {String} linkId - Payment link ID
   * @returns {Promise<Object>} Reminder status
   */
  async sendReminder(linkId) {
    try {
      // In production: const response = await api.post(`/api/payments/links/${linkId}/reminder`);

      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        success: true,
        message: 'Payment reminder sent successfully'
      };
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  },

  /**
   * Get payment statistics
   * @param {Object} filters - Date range and other filters
   * @returns {Promise<Object>} Payment statistics
   */
  async getPaymentStats(filters = {}) {
    try {
      // In production: const response = await api.get('/api/payments/stats', { params: filters });

      const mockStats = {
        totalLinks: 45,
        pendingLinks: 18,
        paidLinks: 22,
        expiredLinks: 3,
        failedLinks: 2,
        totalAmount: 785000,
        paidAmount: 520000,
        pendingAmount: 235000,
        conversionRate: 48.9,
        avgPaymentTime: '2.3 days',
        topPaymentMethod: PAYMENT_PROVIDERS.RAZORPAY,
        recentPayments: [
          { date: '2025-01-18', amount: 15000, count: 3 },
          { date: '2025-01-17', amount: 28500, count: 5 },
          { date: '2025-01-16', amount: 42000, count: 7 }
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 400));

      return {
        success: true,
        data: mockStats
      };
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  },

  /**
   * Verify payment status (webhook simulation)
   * @param {String} linkId - Payment link ID
   * @returns {Promise<Object>} Payment verification status
   */
  async verifyPayment(linkId) {
    try {
      // In production: const response = await api.get(`/api/payments/links/${linkId}/verify`);

      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        data: {
          linkId,
          status: PAYMENT_STATUS.PAID,
          transactionId: `TXN-${Date.now()}`,
          paidAmount: 15000,
          paidAt: new Date().toISOString(),
          paymentMethod: 'UPI',
          bankReference: 'REF123456'
        }
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  /**
   * Copy payment link to clipboard
   * @param {String} url - Payment link URL
   * @returns {Promise<Boolean>} Success status
   */
  async copyToClipboard(url) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
};

export default paymentLinkService;
