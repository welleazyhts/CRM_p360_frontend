import api from './api';

// Campaign Service - Handles all campaign-related API operations
export const campaignService = {
  // Get all campaigns
  getCampaigns: async () => {
    try {
      const response = await api.get('/campaigns');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      throw new Error('No data returned from API');
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Mock fallback data matching Campaigns.jsx structure
      return [
        {
          id: 1,
          name: 'Q4 Policy Renewal Campaign',
          description: 'Multi-channel campaign for policy renewals',
          type: 'renewal',
          channels: ['email', 'sms', 'whatsapp'],
          audience: 'Policy Holders - Expiring Q4',
          audienceSize: 15420,
          status: 'active',
          progress: 67,
          createdDate: '2024-12-20',
          scheduledDate: '2024-12-25',
          tags: ['renewal', 'urgent', 'multi-channel'],
          metrics: {
            sent: 10331,
            delivered: 9876,
            opened: 6543,
            clicked: 1234,
            bounced: 234
          }
        },
        {
          id: 2,
          name: 'New Customer Welcome Series',
          description: 'Welcome campaign for new customers',
          type: 'welcome',
          channels: ['email', 'whatsapp'],
          audience: 'New Customers - December',
          audienceSize: 2340,
          status: 'scheduled',
          progress: 0,
          createdDate: '2024-12-22',
          scheduledDate: '2025-01-01',
          tags: ['welcome', 'onboarding'],
          metrics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            bounced: 0
          }
        },
        {
          id: 3,
          name: 'Payment Reminder Campaign',
          description: 'Automated payment reminders',
          type: 'payment',
          channels: ['sms', 'email'],
          audience: 'High Value Customers',
          audienceSize: 5670,
          status: 'completed',
          progress: 100,
          createdDate: '2024-12-15',
          scheduledDate: '2024-12-18',
          tags: ['payment', 'automated'],
          metrics: {
            sent: 5670,
            delivered: 5580,
            opened: 4200,
            clicked: 890,
            bounced: 90
          }
        }
      ];
    }
  },

  // Get campaign details by ID
  getCampaignDetails: async (campaignId) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      // Mock fallback data
      return {
        id: parseInt(campaignId),
        name: 'Q4 Policy Renewal Campaign',
        description: 'Multi-channel campaign for policy renewals targeting customers with policies expiring in Q4 2024',
        type: 'renewal',
        channels: ['email', 'sms', 'whatsapp'],
        audience: 'Policy Holders - Expiring Q4',
        audienceSize: 15420,
        status: 'active',
        progress: 67,
        createdDate: '2024-12-20',
        scheduledDate: '2024-12-25',
        launchDate: '2024-12-25',
        lastModified: '2024-12-28',
        tags: ['renewal', 'urgent', 'multi-channel'],
        templates: {
          email: 'Policy Renewal Reminder Email',
          sms: 'Renewal SMS Template',
          whatsapp: 'WhatsApp Renewal Template'
        },
        metrics: {
          sent: 10331,
          delivered: 9876,
          opened: 6543,
          clicked: 1234,
          converted: 456,
          bounced: 234,
          unsubscribed: 12,
          failed: 455
        },
        channelMetrics: {
          email: { sent: 5000, delivered: 4800, opened: 3200, clicked: 800, bounced: 200, unsubscribed: 8 },
          sms: { sent: 3000, delivered: 2950, opened: 2100, clicked: 300, failed: 50 },
          whatsapp: { sent: 2331, delivered: 2126, opened: 1243, clicked: 134, failed: 205 }
        },
        timeline: [
          { date: '2024-12-20', event: 'Campaign Created', type: 'create' },
          { date: '2024-12-22', event: 'Templates Configured', type: 'config' },
          { date: '2024-12-23', event: 'Audience Segmented', type: 'audience' },
          { date: '2024-12-25', event: 'Campaign Launched', type: 'launch' },
          { date: '2024-12-26', event: 'First Batch Sent', type: 'send' },
          { date: '2024-12-28', event: 'Analytics Updated', type: 'analytics' }
        ],
        consent: {
          email: 14200,
          sms: 13800,
          whatsapp: 12100,
          opted_out: 1220
        },
        compliance: {
          dltApproved: true,
          consentVerified: true,
          dndChecked: true,
          dataRetentionCompliant: true
        }
      };
    }
  },

  // Update campaign
  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(`/campaigns/${campaignId}`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  // Campaign actions (pause, resume, stop)
  updateCampaignStatus: async (campaignId, status) => {
    try {
      const response = await api.patch(`/campaigns/${campaignId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  },

  // Get campaign analytics
  getCampaignAnalytics: async (campaignId, dateRange = '30d') => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/analytics?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
  },

  // Get campaign timeline
  getCampaignTimeline: async (campaignId) => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign timeline:', error);
      throw error;
    }
  },

  // Delete campaign
  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  // Export campaign data
  exportCampaignData: async (campaignId, format = 'csv') => {
    try {
      const response = await api.get(`/campaigns/${campaignId}/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting campaign data:', error);
      throw error;
    }
  }
};

export default campaignService;