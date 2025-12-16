import api from './api';
import quoteEmailService from './quoteEmailService';

// In-memory fallback storage
let mockQuotes = [
  {
    id: 'Q001',
    leadId: 'L1234',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh.k@example.com',
    customerPhone: '+91 98765 43210',
    productType: 'Health Insurance',
    productPlan: 'Health Insurance Premium Plus',
    coverageAmount: '₹10,00,000',
    premium: '₹12,000',
    sumInsured: '₹10,00,000',
    tenure: '1 Year',
    quoteAmount: '₹12,000',
    status: 'Pending',
    validUntil: '2025-02-15',
    raisedDate: '2025-01-15',
    raisedBy: 'Admin User',
    lastUpdated: '2025-01-15',
    version: 1,
    conversionProbability: 75,
    attachments: [],
    timeline: []
  }
];

let mockHistory = [];

const QuoteService = {
  async listQuotes(params = {}) {
    try {
      const response = await api.get('/quotes', { params });
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error fetching quotes, using mock:', error);
      let quotes = [...mockQuotes];
      if (params.q) {
        const q = params.q.toLowerCase();
        quotes = quotes.filter(item =>
          (item.customerName || '').toLowerCase().includes(q) ||
          (item.id || '').toLowerCase().includes(q) ||
          (item.productPlan || '').toLowerCase().includes(q)
        );
      }
      if (params.status && params.status !== 'all') {
        quotes = quotes.filter(qt => qt.status === params.status);
      }
      return quotes;
    }
  },

  async getQuote(id) {
    try {
      const response = await api.get(`/quotes/${id}`);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error fetching quote, using mock:', error);
      const q = mockQuotes.find(x => x.id === id);
      if (!q) throw new Error('Quote not found (mock)');
      return q;
    }
  },

  async createQuote(payload) {
    try {
      const response = await api.post('/quotes', payload);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error creating quote, using mock:', error);
      const newId = `Q${String(mockQuotes.length + 1).padStart(3, '0')}`;
      const created = {
        id: newId,
        ...payload,
        status: payload.status || 'Draft',
        raisedDate: payload.raisedDate || (new Date().toLocaleDateString('en-GB')),
        conversionProbability: payload.conversionProbability || 50,
        lastUpdated: (new Date()).toLocaleDateString('en-GB'),
        version: 1,
        attachments: payload.attachments || [],
        timeline: payload.timeline || [{ action: 'Quote Created', user: 'System', timestamp: (new Date()).toLocaleString(), details: 'Created (mock)' }]
      };
      mockQuotes = [created, ...mockQuotes];
      return created;
    }
  },

  async updateQuote(id, payload) {
    try {
      const response = await api.put(`/quotes/${id}`, payload);
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error updating quote, using mock:', error);
      const idx = mockQuotes.findIndex(q => q.id === id);
      if (idx === -1) throw new Error('Quote not found (mock)');
      const updated = { ...mockQuotes[idx], ...payload, lastUpdated: (new Date()).toISOString().split('T')[0] };
      mockQuotes[idx] = updated;
      return updated;
    }
  },

  async deleteQuote(id) {
    try {
      const response = await api.delete(`/quotes/${id}`);
      return response.data || { success: true };
    } catch (error) {
      console.error('Error deleting quote, using mock:', error);
      mockQuotes = mockQuotes.filter(q => q.id !== id);
      return { success: true };
    }
  },

  async changeStatus(quoteId, newStatus, note = '') {
    try {
      const response = await api.post(`/quotes/${quoteId}/status`, { status: newStatus, note });
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error changing quote status, using mock:', error);
      const idx = mockQuotes.findIndex(q => q.id === quoteId);
      if (idx === -1) throw new Error('Quote not found (mock)');
      const now = (new Date()).toLocaleString();
      mockQuotes[idx].status = newStatus;
      mockQuotes[idx].lastUpdated = (new Date()).toISOString().split('T')[0];
      mockQuotes[idx].timeline = mockQuotes[idx].timeline || [];
      mockQuotes[idx].timeline.push({ action: `Status Changed to ${newStatus}`, user: 'Current User', timestamp: now, details: note });

      mockHistory.unshift({ id: mockHistory.length + 1, quoteId, action: `Status Changed to ${newStatus}`, user: 'Current User', timestamp: now, details: note });

      return mockQuotes[idx];
    }
  },

  async sendQuote(quoteId, { channel = 'email', to } = {}) {
    try {
      const response = await api.post(`/quotes/${quoteId}/send`, { channel, to });
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error sending quote, using mock:', error);
      const now = (new Date()).toLocaleString();
      const idx = mockQuotes.findIndex(q => q.id === quoteId);
      if (idx === -1) throw new Error('Quote not found (mock)');

      const quote = mockQuotes[idx];
      const recipientEmail = to || quote.customerEmail;

      // Use email service to generate and send formatted email
      if (channel === 'email') {
        try {
          const emailResult = await quoteEmailService.sendQuoteEmail(quoteId, quote, recipientEmail);

          // Update quote timeline
          mockQuotes[idx].timeline = mockQuotes[idx].timeline || [];
          mockQuotes[idx].timeline.push({
            action: 'Quote Sent via Email',
            user: 'System',
            timestamp: now,
            details: `Sent to: ${recipientEmail}`
          });

          return {
            success: true,
            message: `Quote sent successfully to ${recipientEmail}`,
            emailPreview: emailResult.emailPreview,
            sentAt: emailResult.sentAt
          };
        } catch (emailError) {
          console.error('Email service error:', emailError);
          throw emailError;
        }
      }

      // Fallback for other channels
      mockQuotes[idx].timeline = mockQuotes[idx].timeline || [];
      mockQuotes[idx].timeline.push({
        action: `Sent via ${channel}`,
        user: 'System',
        timestamp: now,
        details: `To: ${recipientEmail}`
      });

      return { success: true, message: `Mock sent via ${channel}` };
    }
  },

  async downloadQuotePDF(quoteId) {
    try {
      const response = await api.get(`/quotes/${quoteId}/download`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error downloading quote PDF, using mock:', error);
      const blob = new Blob([`Mock PDF content for ${quoteId}`], { type: 'application/pdf' });
      return blob;
    }
  },

  async uploadAttachment(quoteId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(`/quotes/${quoteId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading attachment, using mock:', error);
      const idx = mockQuotes.findIndex(q => q.id === quoteId);
      if (idx === -1) throw new Error('Quote not found (mock)');
      const filename = file.name || `attachment-${Date.now()}`;
      mockQuotes[idx].attachments = mockQuotes[idx].attachments || [];
      mockQuotes[idx].attachments.push(filename);
      return { success: true, filename };
    }
  },

  async listHistory(params = {}) {
    try {
      const response = await api.get('/quotes/history', { params });
      if (response.data) {
        return response.data;
      }
      throw new Error('No data from API');
    } catch (error) {
      console.error('Error fetching quote history, using mock:', error);
      return [...mockHistory];
    }
  }
};

export default QuoteService;
