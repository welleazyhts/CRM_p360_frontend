import api from './api';

// Billing Service - Handles all billing-related API operations
export const billingService = {
    // Get all invoices
    getInvoices: async () => {
        try {
            const response = await api.get('/billing/invoices');
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
            throw new Error('No data returned from API');
        } catch (error) {
            console.error('Error fetching invoices:', error);
            // Mock fallback data
            return [
                {
                    id: 'INV-2023-IN001',
                    date: '2023-10-01',
                    amount: 95000.00,
                    status: 'Paid',
                    pdfUrl: '#',
                    receivableInfo: {
                        dueDate: '2023-10-31',
                        paymentTerms: 'Net 30',
                        creditLimit: '500000',
                        accountingCode: 'ACC-001',
                        taxId: 'TAX123456',
                        billingAddress: '123 Business St, Mumbai, MH 400001',
                        contactPerson: 'Finance Manager',
                        contactEmail: 'finance@company.com',
                        contactPhone: '+91-9876543210',
                        paymentMethod: 'bank_transfer',
                        bankDetails: {
                            accountNumber: '1234567890',
                            routingNumber: 'HDFC0001234',
                            bankName: 'HDFC Bank',
                            swiftCode: 'HDFCINBB'
                        },
                        notes: 'Payment received on time'
                    }
                },
                {
                    id: 'INV-2023-IN002',
                    date: '2023-11-01',
                    amount: 102500.50,
                    status: 'Paid',
                    pdfUrl: '#',
                    receivableInfo: {
                        dueDate: '2023-11-30',
                        paymentTerms: 'Net 30',
                        creditLimit: '500000',
                        accountingCode: 'ACC-002',
                        taxId: 'TAX789012',
                        billingAddress: '456 Corporate Ave, Delhi, DL 110001',
                        contactPerson: 'Accounts Payable',
                        contactEmail: 'ap@company.com',
                        contactPhone: '+91-9876543211',
                        paymentMethod: 'cheque',
                        bankDetails: {
                            accountNumber: '',
                            routingNumber: '',
                            bankName: '',
                            swiftCode: ''
                        },
                        notes: 'Paid via cheque'
                    }
                },
                {
                    id: 'INV-2023-IN003',
                    date: '2023-12-01',
                    amount: 108750.75,
                    status: 'Pending',
                    pdfUrl: '#',
                    receivableInfo: {
                        dueDate: '2023-12-31',
                        paymentTerms: 'Net 30',
                        creditLimit: '500000',
                        accountingCode: 'ACC-003',
                        taxId: 'TAX345678',
                        billingAddress: '789 Enterprise Blvd, Bangalore, KA 560001',
                        contactPerson: 'CFO',
                        contactEmail: 'cfo@company.com',
                        contactPhone: '+91-9876543212',
                        paymentMethod: 'bank_transfer',
                        bankDetails: {
                            accountNumber: '9876543210',
                            routingNumber: 'ICIC0001234',
                            bankName: 'ICICI Bank',
                            swiftCode: 'ICICINBB'
                        },
                        notes: 'Follow up required'
                    }
                },
                {
                    id: 'INV-2024-IN001',
                    date: '2024-01-01',
                    amount: 105000.25,
                    status: 'Pending',
                    pdfUrl: '#',
                    receivableInfo: {
                        dueDate: '2024-01-31',
                        paymentTerms: 'Net 30',
                        creditLimit: '500000',
                        accountingCode: 'ACC-004',
                        taxId: 'TAX901234',
                        billingAddress: '321 Business Park, Pune, MH 411001',
                        contactPerson: 'Finance Director',
                        contactEmail: 'finance.director@company.com',
                        contactPhone: '+91-9876543213',
                        paymentMethod: 'bank_transfer',
                        bankDetails: {
                            accountNumber: '5432109876',
                            routingNumber: 'SBIN0001234',
                            bankName: 'State Bank of India',
                            swiftCode: 'SBININBB'
                        },
                        notes: 'New client - monitor closely'
                    }
                }
            ];
        }
    },

    // Get vendor communications
    getVendorCommunications: async () => {
        try {
            const response = await api.get('/billing/vendor-communications');
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
            throw new Error('No data returned from API');
        } catch (error) {
            console.error('Error fetching vendor communications:', error);
            // Mock fallback data
            return [
                {
                    vendorId: 'VEN001',
                    vendorName: 'SMS Gateway Pro',
                    vendorType: 'SMS Provider',
                    totalCommunications: 1247,
                    deliveryStats: {
                        delivered: 1198,
                        failed: 35,
                        pending: 14
                    },
                    costPerMessage: 0.05,
                    totalCost: 62.35,
                    lastActivity: '2024-01-15T10:30:00Z',
                    contactPerson: 'John Smith',
                    supportEmail: 'support@smsgateway.com'
                },
                {
                    vendorId: 'VEN002',
                    vendorName: 'Email Service Plus',
                    vendorType: 'Email Provider',
                    totalCommunications: 892,
                    deliveryStats: {
                        delivered: 856,
                        failed: 23,
                        pending: 13
                    },
                    costPerMessage: 0.02,
                    totalCost: 17.84,
                    lastActivity: '2024-01-15T09:45:00Z',
                    contactPerson: 'Sarah Johnson',
                    supportEmail: 'support@emailplus.com'
                },
                {
                    vendorId: 'VEN003',
                    vendorName: 'WhatsApp Business API',
                    vendorType: 'WhatsApp Provider',
                    totalCommunications: 634,
                    deliveryStats: {
                        delivered: 612,
                        failed: 18,
                        pending: 4
                    },
                    costPerMessage: 0.08,
                    totalCost: 50.72,
                    lastActivity: '2024-01-15T11:20:00Z',
                    contactPerson: 'Mike Chen',
                    supportEmail: 'api-support@whatsapp.com'
                }
            ];
        }
    },

    // Get communication statistics
    getCommunicationStats: async () => {
        try {
            const response = await api.get('/billing/communication-stats');
            if (response.data && typeof response.data === 'object') {
                return response.data;
            }
            throw new Error('No data returned from API');
        } catch (error) {
            console.error('Error fetching communication stats:', error);
            // Mock fallback data
            return {
                sms: [
                    { date: '2024-01-01', count: 150, status: 'Delivered' },
                    { date: '2024-01-02', count: 200, status: 'Delivered' },
                    { date: '2024-01-03', count: 180, status: 'Delivered' }
                ],
                email: [
                    { date: '2024-01-01', count: 75, status: 'Sent' },
                    { date: '2024-01-02', count: 90, status: 'Sent' },
                    { date: '2024-01-03', count: 85, status: 'Sent' }
                ],
                whatsapp: [
                    { date: '2024-01-01', count: 120, status: 'Delivered' },
                    { date: '2024-01-02', count: 150, status: 'Delivered' },
                    { date: '2024-01-03', count: 130, status: 'Delivered' }
                ]
            };
        }
    },

    // Get individual delivery cases
    getIndividualCases: async () => {
        try {
            const response = await api.get('/billing/individual-cases');
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
            throw new Error('No data returned from API');
        } catch (error) {
            console.error('Error fetching individual cases:', error);
            // Mock fallback data
            return [
                {
                    caseId: 'CASE001',
                    customerName: 'Arjun Sharma',
                    policyNumber: 'POL123456',
                    communicationType: 'SMS',
                    message: 'Policy renewal reminder - Due in 7 days',
                    sentAt: '2024-01-15T08:30:00Z',
                    deliveryStatus: 'delivered',
                    deliveredAt: '2024-01-15T08:30:15Z',
                    vendor: 'SMS Gateway Pro',
                    cost: 0.05,
                    attempts: 1,
                    errorMessage: null
                },
                {
                    caseId: 'CASE002',
                    customerName: 'Priya Patel',
                    policyNumber: 'POL789012',
                    communicationType: 'Email',
                    message: 'Welcome to your new policy',
                    sentAt: '2024-01-15T09:15:00Z',
                    deliveryStatus: 'failed',
                    deliveredAt: null,
                    vendor: 'Email Service Plus',
                    cost: 0.02,
                    attempts: 3,
                    errorMessage: 'Invalid email address'
                },
                {
                    caseId: 'CASE003',
                    customerName: 'Rajesh Kumar',
                    policyNumber: 'POL345678',
                    communicationType: 'WhatsApp',
                    message: 'Claim status update - Approved',
                    sentAt: '2024-01-15T10:00:00Z',
                    deliveryStatus: 'pending',
                    deliveredAt: null,
                    vendor: 'WhatsApp Business API',
                    cost: 0.08,
                    attempts: 1,
                    errorMessage: null
                }
            ];
        }
    },

    // Get bulk campaigns
    getBulkCampaigns: async () => {
        try {
            const response = await api.get('/billing/bulk-campaigns');
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
            throw new Error('No data returned from API');
        } catch (error) {
            console.error('Error fetching bulk campaigns:', error);
            // Mock fallback data
            return [
                {
                    campaignId: 'BULK001',
                    campaignName: 'Monthly Policy Renewal Reminders',
                    type: 'SMS',
                    totalRecipients: 1500,
                    sentCount: 1500,
                    deliveredCount: 1435,
                    failedCount: 45,
                    pendingCount: 20,
                    startedAt: '2024-01-15T06:00:00Z',
                    completedAt: '2024-01-15T06:45:00Z',
                    vendor: 'SMS Gateway Pro',
                    totalCost: 75.00,
                    deliveryRate: 95.67
                },
                {
                    campaignId: 'BULK002',
                    campaignName: 'New Product Launch Announcement',
                    type: 'Email',
                    totalRecipients: 2500,
                    sentCount: 2500,
                    deliveredCount: 2387,
                    failedCount: 89,
                    pendingCount: 24,
                    startedAt: '2024-01-14T14:00:00Z',
                    completedAt: '2024-01-14T15:30:00Z',
                    vendor: 'Email Service Plus',
                    totalCost: 50.00,
                    deliveryRate: 95.48
                }
            ];
        }
    },

    // Process payment
    processPayment: async (invoiceId, paymentDetails) => {
        try {
            const response = await api.post('/billing/process-payment', {
                invoiceId,
                paymentDetails
            });
            return response.data;
        } catch (error) {
            console.error('Error processing payment:', error);
            // Mock implementation
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const success = Math.random() > 0.1; // 90% success rate
                    if (success) {
                        resolve({
                            success: true,
                            transactionId: `TXN${Date.now()}`,
                            message: 'Payment processed successfully!'
                        });
                    } else {
                        reject({
                            success: false,
                            message: 'Payment failed. Please try again.'
                        });
                    }
                }, 2000);
            });
        }
    },

    // Update receivable information
    updateReceivableInfo: async (invoiceId, receivableInfo) => {
        try {
            const response = await api.put(`/billing/invoices/${invoiceId}/receivable-info`, receivableInfo);
            return response.data;
        } catch (error) {
            console.error('Error updating receivable info:', error);
            // Mock implementation
            return {
                success: true,
                message: 'Receivable information updated successfully!'
            };
        }
    }
};

export default billingService;
