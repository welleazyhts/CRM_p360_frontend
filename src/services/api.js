// This file would contain all API calls to the backend
// For now, it's just a placeholder with mock implementations

// Base URL for API calls - configured from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://65.0.124.182/api';

/**
 * Helper function to construct full API URL
 * @param {string} endpoint - API endpoint (e.g., '/api/v1/policies')
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If base URL includes '/api' and endpoint also starts with '/api', remove it from endpoint
  if (API_BASE_URL.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${API_BASE_URL}${cleanEndpoint.substring(4)}`;
  }

  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('access_token');
};

/**
 * Create a default API client with real HTTP requests
 */
const api = {
  get: async (endpoint, config = {}) => {
    const url = getApiUrl(endpoint);
    const { params, ...restConfig } = config;

    // Build query string from params
    let queryString = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });
      const qs = searchParams.toString();
      if (qs) queryString = `?${qs}`;
    }

    const response = await fetch(`${url}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...restConfig.headers
      },
      ...restConfig
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  },

  post: async (endpoint, data, config = {}) => {
    const url = getApiUrl(endpoint);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...config.headers
      },
      body: JSON.stringify(data),
      ...config
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    return { data: responseData };
  },

  put: async (endpoint, data, config = {}) => {
    const url = getApiUrl(endpoint);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...config.headers
      },
      body: JSON.stringify(data),
      ...config
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    return { data: responseData };
  },

  patch: async (endpoint, data, config = {}) => {
    const url = getApiUrl(endpoint);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...config.headers
      },
      body: JSON.stringify(data),
      ...config
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    return { data: responseData };
  },

  delete: async (endpoint, config = {}) => {
    const url = getApiUrl(endpoint);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
        ...config.headers
      },
      ...config
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    // DELETE might return empty response
    const text = await response.text();
    const responseData = text ? JSON.parse(text) : {};
    return { data: responseData };
  }
};

export default api;

// Provider configuration endpoints
// const PROVIDER_ENDPOINTS = {
//   email: {
//     sendgrid: 'https://api.sendgrid.com/v3',
//     'aws-ses': 'https://email.{region}.amazonaws.com',
//     mailgun: 'https://api.mailgun.net/v3',
//     smtp: 'custom-smtp-endpoint'
//   },
//   sms: {
//     twilio: 'https://api.twilio.com/2010-04-01',
//     msg91: 'https://api.msg91.com/api/v5',
//     'aws-sns': 'https://sns.{region}.amazonaws.com',
//     textlocal: 'https://api.textlocal.in'
//   },
//   whatsapp: {
//     meta: 'https://graph.facebook.com/v17.0',
//     gupshup: 'https://api.gupshup.io/sm/api/v1',
//     '360dialog': 'https://waba.360dialog.io/v1'
//   },
//   call: {
//     'twilio-voice': 'https://api.twilio.com/2010-04-01',
//     exotel: 'https://api.exotel.com/v1',
//     ubona: 'https://api.ubona.com/v1'
//   }
// };

// Helper function for API requests
// const apiRequest = async (endpoint, options = {}) => {
//   try {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('API request error:', error);
//     throw error;
//   }
// };

// Dashboard API calls
export const fetchDashboardStats = async (_dateRange, _policyType, _caseStatus) => {
  // In a real app, this would call the API
  // return apiRequest(`/dashboard/stats?dateRange=${dateRange}&policyType=${policyType}&caseStatus=${caseStatus}`);

  // Mock implementation
  return {
    totalCases: 1250,
    inProgress: 320,
    renewed: 780,
    pendingAction: 95,
    errors: 55
  };
};

export const fetchTrendData = async (_dateRange, _policyType, _caseStatus) => {
  // In a real app, this would call the API
  // return apiRequest(`/dashboard/trends?dateRange=${dateRange}&policyType=${policyType}&caseStatus=${caseStatus}`);

  // Mock implementation
  if (_dateRange === 'week') {
    return [
      { name: 'Mon', newCases: 65, renewals: 42, successRate: 0.85 },
      { name: 'Tue', newCases: 59, renewals: 38, successRate: 0.82 },
      { name: 'Wed', newCases: 80, renewals: 56, successRate: 0.88 },
      { name: 'Thu', newCases: 81, renewals: 61, successRate: 0.91 },
      { name: 'Fri', newCases: 56, renewals: 48, successRate: 0.89 },
      { name: 'Sat', newCases: 25, renewals: 20, successRate: 0.92 },
      { name: 'Sun', newCases: 15, renewals: 12, successRate: 0.90 },
    ];
  } else if (_dateRange === 'month') {
    // Generate mock data for a month
    return Array.from({ length: 30 }, (_, i) => ({
      name: `Day ${i + 1}`,
      newCases: Math.floor(Math.random() * 100) + 10,
      renewals: Math.floor(Math.random() * 80) + 5,
      successRate: (Math.random() * 0.2) + 0.75,
    }));
  } else {
    // Daily data
    return Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      newCases: Math.floor(Math.random() * 20) + 1,
      renewals: Math.floor(Math.random() * 15),
      successRate: (Math.random() * 0.3) + 0.7,
    }));
  }
};

// Upload API calls
export const uploadPolicyData = async (file) => {
  // In a real app, this would use FormData to upload the file
  const formData = new FormData();
  formData.append('file', file);

  // return apiRequest('/upload', {
  //   method: 'POST',
  //   body: formData,
  //   headers: {} // Let the browser set the content type for FormData
  // });

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        uploadId: `upload-${Date.now()}`,
        recordCount: Math.floor(Math.random() * 200) + 50,
      });
    }, 2000);
  });
};

// Case Tracking API calls
export const getCaseById = async (caseId) => {
  // In a real app, this would call the API
  // return apiRequest(`/cases/${caseId}`);

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Find the case in our mock data
      const mockCases = [
        {
          id: 'CASE-001',
          customerName: 'Arjun Sharma',
          policyNumber: 'POL-12345',
          status: 'In Progress',
          agent: 'Priya Patel',
          uploadDate: '2025-04-08',
          isPriority: false,
          contactInfo: {
            email: 'john.smith@example.com',
            phone: '555-123-4567',
            pan: 'ABCDE1234F'
          },
          policyProposer: {
            name: 'Arjun Sharma',
            relationship: 'Self',
            age: 42,
            dateOfBirth: '1982-08-20',
            gender: 'Male',
            occupation: 'Business Owner',
            annualIncome: '₹8,50,000'
          },
          lifeAssured: {
            name: 'Arjun Sharma',
            relationship: 'Self',
            age: 42,
            dateOfBirth: '1982-08-20',
            gender: 'Male',
            sumAssured: '₹25,00,000',
            nomineeDetails: 'Kavya Sharma (Spouse)'
          },
          policyDetails: {
            type: 'Auto',
            expiryDate: '2025-05-15',
            premium: 1250.00,
            coverage: {
              liability: '$300,000',
              collision: '$500 deductible',
              comprehensive: '$250 deductible'
            }
          },
          channelDetails: {
            businessChannel: 'Agent Network',
            region: 'North India',
            salesManager: 'Rajesh Kumar',
            agentName: 'Priya Patel',
            agentStatus: 'Active'
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress'],
          history: [
            {
              date: '2025-04-08T09:15:30',
              action: 'Case Created',
              details: 'Case uploaded via bulk upload',
              user: 'System'
            },
            {
              date: '2025-04-08T09:15:35',
              action: 'Validation',
              details: 'All required fields present and valid',
              user: 'System'
            },
            {
              date: '2025-04-08T10:30:12',
              action: 'Assignment',
              details: 'Case assigned to agent Priya Patel',
              user: 'System'
            }
          ],
          outstandingAmounts: [
            {
              period: 'March 2024',
              amount: 15000,
              dueDate: '2024-03-15',
              description: 'Premium installment for March 2024 - Auto Insurance'
            },
            {
              period: 'April 2024',
              amount: 15000,
              dueDate: '2024-04-15',
              description: 'Premium installment for April 2024 - Auto Insurance'
            },
            {
              period: 'May 2024',
              amount: 15000,
              dueDate: '2024-05-15',
              description: 'Premium installment for May 2024 - Auto Insurance'
            },
            {
              period: 'June 2024',
              amount: 15000,
              dueDate: '2024-06-15',
              description: 'Premium installment for June 2024 - Auto Insurance'
            },
            {
              period: 'July 2024',
              amount: 15000,
              dueDate: '2024-07-15',
              description: 'Premium installment for July 2024 - Auto Insurance'
            },
            {
              period: 'August 2024',
              amount: 18500,
              dueDate: '2024-08-15',
              description: 'Premium installment for August 2024 - Auto Insurance (Rate Increase)'
            },
            {
              period: 'September 2024',
              amount: 18500,
              dueDate: '2024-09-15',
              description: 'Premium installment for September 2024 - Auto Insurance'
            },
            {
              period: 'October 2024',
              amount: 18500,
              dueDate: '2024-10-15',
              description: 'Premium installment for October 2024 - Auto Insurance'
            }
          ]
        },
        {
          id: 'CASE-002',
          customerName: 'Meera Kapoor',
          policyNumber: 'POL-23456',
          status: 'Renewed',
          agent: 'Ravi Gupta',
          uploadDate: '2025-04-07',
          isPriority: true,
          contactInfo: {
            email: 'sarah.w@example.com',
            phone: '555-234-5678'
          },
          policyProposer: {
            name: 'Meera Kapoor',
            relationship: 'Self',
            age: 38,
            dateOfBirth: '1986-12-05',
            gender: 'Female',
            occupation: 'Marketing Manager',
            annualIncome: '₹9,75,000'
          },
          lifeAssured: {
            name: 'Meera Kapoor',
            relationship: 'Self',
            age: 38,
            dateOfBirth: '1986-12-05',
            gender: 'Female',
            sumAssured: '₹30,00,000',
            nomineeDetails: 'Michael Williams (Spouse)'
          },
          policyDetails: {
            type: 'Home',
            expiryDate: '2025-05-10',
            premium: 950.00,
            coverage: {
              dwelling: '$500,000',
              personalProperty: '$250,000',
              liability: '$300,000'
            }
          },
          channelDetails: {
            businessChannel: 'Branch Office',
            region: 'West India',
            salesManager: 'Priya Sharma',
            agentName: 'Ravi Gupta',
            agentStatus: 'Active'
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed'],
          history: [
            {
              date: '2025-04-07T14:22:10',
              action: 'Case Created',
              details: 'Case uploaded via API',
              user: 'System'
            },
            {
              date: '2025-04-07T14:22:15',
              action: 'Validation',
              details: 'All required fields present and valid',
              user: 'System'
            },
            {
              date: '2025-04-07T15:10:45',
              action: 'Assignment',
              details: 'Case assigned to agent Ravi Gupta',
              user: 'System'
            },
            {
              date: '2025-04-08T09:30:22',
              action: 'Processing',
              details: 'Agent has begun renewal processing',
              user: 'Ravi Gupta'
            },
            {
              date: '2025-04-09T11:15:33',
              action: 'Payment Processed',
              details: 'Payment of $950.00 processed successfully',
              user: 'System'
            },
            {
              date: '2025-04-09T11:16:05',
              action: 'Renewed',
              details: 'Policy renewed successfully',
              user: 'System'
            }
          ]
        },
        {
          id: 'CASE-003',
          customerName: 'Michael Johnson',
          policyNumber: 'POL-34567',
          status: 'Failed',
          agent: 'Carol Davis',
          uploadDate: '2025-04-06',
          isPriority: false,
          contactInfo: {
            email: 'michael.j@example.com',
            phone: '555-345-6789'
          },
          policyProposer: {
            name: 'Vikram Singh',
            relationship: 'Self',
            age: 45,
            dateOfBirth: '1979-11-12',
            gender: 'Male',
            occupation: 'Senior Manager',
            annualIncome: '₹15,00,000'
          },
          lifeAssured: {
            name: 'Vikram Singh',
            relationship: 'Self',
            age: 45,
            dateOfBirth: '1979-11-12',
            gender: 'Male',
            sumAssured: '₹50,00,000',
            nomineeDetails: 'Emily Johnson (Spouse)'
          },
          policyDetails: {
            type: 'Life',
            expiryDate: '2025-05-05',
            premium: 2100.00,
            coverage: {
              deathBenefit: '$500,000',
              cashValue: '$25,000',
              accidentalDeath: '$1,000,000'
            }
          },
          channelDetails: {
            businessChannel: 'Corporate Sales',
            region: 'South India',
            salesManager: 'Anita Desai',
            agentName: 'Neha Sharma',
            agentStatus: 'Inactive'
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Failed'],
          history: [
            {
              date: '2025-04-06T10:45:30',
              action: 'Case Created',
              details: 'Case created manually',
              user: 'Admin'
            },
            {
              date: '2025-04-06T10:46:15',
              action: 'Validation',
              details: 'All required fields present and valid',
              user: 'System'
            },
            {
              date: '2025-04-06T11:30:45',
              action: 'Assignment',
              details: 'Case assigned to agent Neha Sharma',
              user: 'System'
            },
            {
              date: '2025-04-07T14:22:10',
              action: 'Processing',
              details: 'Agent has begun renewal processing',
              user: 'Carol Davis'
            },
            {
              date: '2025-04-08T16:05:22',
              action: 'Failed',
              details: 'Customer declined renewal due to premium increase',
              user: 'Carol Davis'
            }
          ]
        },
        {
          id: 'CASE-004',
          customerName: 'Rajesh Kumar',
          policyNumber: 'POL-45678',
          status: 'In Progress',
          agent: 'Priya Sharma',
          uploadDate: '2025-04-09',
          isPriority: true,
          contactInfo: {
            email: 'rajesh.kumar@example.com',
            phone: '9876543210'
          },
          policyProposer: {
            name: 'Rajesh Kumar',
            relationship: 'Self',
            age: 35,
            dateOfBirth: '1989-03-15',
            gender: 'Male',
            occupation: 'Software Engineer',
            annualIncome: '₹12,00,000'
          },
          lifeAssured: {
            name: 'Rajesh Kumar',
            relationship: 'Self',
            age: 35,
            dateOfBirth: '1989-03-15',
            gender: 'Male',
            sumAssured: '₹50,00,000',
            nomineeDetails: 'Sunita Kumar (Spouse)'
          },
          policyDetails: {
            type: 'Health',
            expiryDate: '2025-05-20',
            premium: 18500.00,
            coverage: {
              sumInsured: '₹10,00,000',
              roomRent: '₹8,000/day',
              maternityBenefit: '₹1,50,000',
              ambulanceCover: '₹2,000'
            }
          },
          channelDetails: {
            businessChannel: 'Online Portal',
            region: 'East India',
            salesManager: 'Vikram Singh',
            agentName: 'Priya Sharma',
            agentStatus: 'Active'
          },
          policyMembers: [
            {
              id: 'member-1',
              name: 'Rajesh Kumar',
              relationship: 'Self',
              age: 35,
              dateOfBirth: '1989-03-15',
              gender: 'Male',
              sumInsured: '₹10,00,000',
              premiumContribution: '₹8,500',
              medicalHistory: [
                'Diabetes Type 2 (2018)',
                'Hypertension (2020)'
              ],
              lastClaimDate: '2024-08-15',
              lastClaimAmount: '₹45,000',
              claimHistory: [
                {
                  date: '2024-08-15',
                  amount: '₹45,000',
                  description: 'Hospitalization for diabetes complications',
                  status: 'Approved'
                },
                {
                  date: '2024-02-10',
                  amount: '₹12,000',
                  description: 'Regular health checkup',
                  status: 'Approved'
                }
              ]
            },
            {
              id: 'member-2',
              name: 'Sunita Kumar',
              relationship: 'Spouse',
              age: 32,
              dateOfBirth: '1992-07-22',
              gender: 'Female',
              sumInsured: '₹10,00,000',
              premiumContribution: '₹7,500',
              medicalHistory: [
                'Pregnancy (2021)',
                'Thyroid (2019)'
              ],
              lastClaimDate: '2024-11-20',
              lastClaimAmount: '₹85,000',
              claimHistory: [
                {
                  date: '2024-11-20',
                  amount: '₹85,000',
                  description: 'Maternity expenses - Normal delivery',
                  status: 'Approved'
                },
                {
                  date: '2024-05-15',
                  amount: '₹8,500',
                  description: 'Thyroid treatment',
                  status: 'Approved'
                }
              ]
            },
            {
              id: 'member-3',
              name: 'Aarav Kumar',
              relationship: 'Son',
              age: 8,
              dateOfBirth: '2016-09-10',
              gender: 'Male',
              sumInsured: '₹5,00,000',
              premiumContribution: '₹2,500',
              medicalHistory: [
                'Asthma (2022)',
                'Allergic Rhinitis (2023)'
              ],
              lastClaimDate: '2024-09-05',
              lastClaimAmount: '₹15,000',
              claimHistory: [
                {
                  date: '2024-09-05',
                  amount: '₹15,000',
                  description: 'Asthma treatment and nebulization',
                  status: 'Approved'
                },
                {
                  date: '2024-03-20',
                  amount: '₹5,500',
                  description: 'Allergy testing',
                  status: 'Approved'
                }
              ]
            },
            {
              id: 'member-4',
              name: 'Ananya Kumar',
              relationship: 'Daughter',
              age: 5,
              dateOfBirth: '2019-12-03',
              gender: 'Female',
              sumInsured: '₹5,00,000',
              premiumContribution: '₹2,000',
              medicalHistory: [
                'Vaccination completed',
                'No major illnesses'
              ],
              lastClaimDate: '2024-06-12',
              lastClaimAmount: '₹3,500',
              claimHistory: [
                {
                  date: '2024-06-12',
                  amount: '₹3,500',
                  description: 'Routine pediatric checkup and vaccinations',
                  status: 'Approved'
                }
              ]
            }
          ],
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress'],
          history: [
            {
              date: '2025-04-09T08:30:15',
              action: 'Case Created',
              details: 'Health insurance family policy uploaded',
              user: 'System'
            },
            {
              date: '2025-04-09T08:30:45',
              action: 'Validation',
              details: 'All family members verified and valid',
              user: 'System'
            },
            {
              date: '2025-04-09T09:15:30',
              action: 'Assignment',
              details: 'Case assigned to agent Priya Sharma',
              user: 'System'
            },
            {
              date: '2025-04-09T10:30:22',
              action: 'Processing',
              details: 'Agent reviewing family medical history',
              user: 'Priya Sharma'
            }
          ],
          outstandingAmounts: [
            {
              period: 'Q1 2024 (Jan-Mar)',
              amount: 46250,
              dueDate: '2024-03-31',
              description: 'Quarterly premium for family health insurance - Q1 2024'
            },
            {
              period: 'Q2 2024 (Apr-Jun)',
              amount: 46250,
              dueDate: '2024-06-30',
              description: 'Quarterly premium for family health insurance - Q2 2024'
            },
            {
              period: 'Q3 2024 (Jul-Sep)',
              amount: 48500,
              dueDate: '2024-09-30',
              description: 'Quarterly premium for family health insurance - Q3 2024 (Premium Adjustment)'
            },
            {
              period: 'Q4 2024 (Oct-Dec)',
              amount: 48500,
              dueDate: '2024-12-31',
              description: 'Quarterly premium for family health insurance - Q4 2024'
            },
            {
              period: 'Q1 2025 (Jan-Mar)',
              amount: 51000,
              dueDate: '2025-03-31',
              description: 'Quarterly premium for family health insurance - Q1 2025 (Rate Increase)'
            }
          ]
        }
      ];

      const foundCase = mockCases.find(c => c.id === caseId);

      if (foundCase) {
        resolve(foundCase);
      } else {
        reject(new Error(`Case with ID ${caseId} not found`));
      }
    }, 800);
  });
};

export const fetchCases = async (_page, _rowsPerPage, _searchTerm, _statusFilter, _dateFilter, _agentFilter) => {
  // In a real app, this would call the API
  // return apiRequest(
  //   `/cases?page=${page}&limit=${rowsPerPage}&search=${searchTerm}&status=${statusFilter}&date=${dateFilter}&agent=${agentFilter}`
  // );

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data with more comprehensive information
      const mockCases = [
        {
          id: 'CASE-001',
          customerName: 'Arjun Sharma',
          policyNumber: 'POL-12345',
          status: 'Assigned',
          agent: 'Priya Patel',
          uploadDate: '2025-04-08',
          isPriority: false,
          contactInfo: {
            email: 'john.smith@example.com',
            phone: '555-123-4567'
          },
          policyDetails: {
            type: 'Auto',
            expiryDate: '2025-05-15',
            premium: 1250.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
        },
        {
          id: 'CASE-002',
          customerName: 'Sarah Williams',
          policyNumber: 'POL-23456',
          status: 'Renewed',
          agent: 'Bob Miller',
          uploadDate: '2025-04-07',
          isPriority: true,
          contactInfo: {
            email: 'sarah.w@example.com',
            phone: '555-234-5678'
          },
          policyDetails: {
            type: 'Home',
            expiryDate: '2025-05-10',
            premium: 950.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
        },
        {
          id: 'CASE-003',
          customerName: 'Michael Johnson',
          policyNumber: 'POL-34567',
          status: 'Failed',
          agent: 'Carol Davis',
          uploadDate: '2025-04-06',
          isPriority: false,
          contactInfo: {
            email: 'michael.j@example.com',
            phone: '555-345-6789'
          },
          policyDetails: {
            type: 'Auto',
            expiryDate: '2025-05-20',
            premium: 1450.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
        },
        {
          id: 'CASE-004',
          customerName: 'Emily Brown',
          policyNumber: 'POL-45678',
          status: 'In Progress',
          agent: 'David Wilson',
          uploadDate: '2025-04-05',
          isPriority: false,
          contactInfo: {
            email: 'emily.b@example.com',
            phone: '555-456-7890'
          },
          policyDetails: {
            type: 'Auto',
            expiryDate: '2025-05-20',
            premium: 1450.00
          },
          flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
        },
        {
          id: 'CASE-005',
          customerName: 'Robert Taylor',
          policyNumber: 'POL-56789',
          status: 'Uploaded',
          agent: 'Unassigned',
          uploadDate: '2025-04-10',
          isPriority: false,
          contactInfo: {
            email: 'robert.t@example.com',
            phone: '555-567-8901'
          },
          policyDetails: {
            type: 'Home',
            expiryDate: '2025-06-01',
            premium: 1050.00
          },
          flowSteps: ['Uploaded']
        },
      ];

      resolve(mockCases);
    }, 500);
  });
};

export const updateCase = async (caseId, _caseData) => {
  // In a real app, this would call the API
  // return apiRequest(`/cases/${caseId}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(caseData)
  // });

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        caseId,
        message: 'Case updated successfully'
      });
    }, 500);
  });
};

// Logs API calls
export const fetchLogs = async (searchType, searchValue) => {
  // In a real app, this would call the API
  // return apiRequest(`/logs?type=${searchType}&value=${searchValue}`);

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      if (searchType === 'caseId' && searchValue === 'CASE-001') {
        resolve([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Alice Johnson',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-004',
            timestamp: '2025-04-09T11:45:22',
            action: 'Contact Update',
            details: 'Customer phone number updated from 555-123-4567 to 555-123-9876',
            user: 'Alice Johnson',
            level: 'warning'
          },
          {
            id: 'log-005',
            timestamp: '2025-04-09T14:20:05',
            action: 'Processing',
            details: 'Agent has begun renewal processing',
            user: 'Alice Johnson',
            level: 'info'
          },
          {
            id: 'log-006',
            timestamp: '2025-04-10T09:05:18',
            action: 'Comment Added',
            details: 'Customer requested additional coverage options. Will follow up tomorrow.',
            user: 'Alice Johnson',
            level: 'info'
          }
        ]);
      } else if (searchType === 'policyNumber' && searchValue === 'POL-12345') {
        resolve([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Alice Johnson',
            user: 'System',
            level: 'info'
          }
        ]);
      } else {
        resolve([]);
      }
    }, 1000);
  });
};

// Notifications API calls
export const fetchNotifications = async () => {
  // In a real app, this would call the API
  // return apiRequest('/notifications');

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'notif-001',
          title: 'New case assigned',
          message: 'Case CASE-006 has been assigned to you',
          timestamp: '2025-04-10T14:30:00',
          read: false,
          type: 'assignment'
        },
        {
          id: 'notif-002',
          title: 'Priority case update',
          message: 'Case CASE-003 has been marked as priority',
          timestamp: '2025-04-10T11:45:00',
          read: false,
          type: 'update'
        },
        {
          id: 'notif-003',
          title: 'System update',
          message: 'The system will be under maintenance tonight',
          timestamp: '2025-04-10T09:15:00',
          read: false,
          type: 'system'
        },
        {
          id: 'notif-004',
          title: 'Case status changed',
          message: 'Case CASE-002 status changed to "In Review"',
          timestamp: '2025-04-09T16:22:00',
          read: true,
          type: 'update'
        },
        {
          id: 'notif-005',
          title: 'Document uploaded',
          message: 'New document uploaded for case CASE-005',
          timestamp: '2025-04-09T14:10:00',
          read: true,
          type: 'document'
        }
      ]);
    }, 800);
  });
};

export const markNotificationAsRead = async (notificationId) => {
  // In a real app, this would call the API
  // return apiRequest(`/notifications/${notificationId}/read`, { method: 'PUT' });

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        notificationId,
        message: 'Notification marked as read'
      });
    }, 300);
  });
};

export const markAllNotificationsAsRead = async () => {
  // In a real app, this would call the API
  // return apiRequest('/notifications/read-all', { method: 'PUT' });

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'All notifications marked as read'
      });
    }, 500);
  });
};

// Case Priority Management
export const updateCasePriority = async (caseId, isPriority) => {
  // In a real app, this would call the API
  // return apiRequest(`/cases/${caseId}/priority`, {
  //   method: 'PUT',
  //   body: JSON.stringify({ isPriority })
  // });

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        caseId,
        isPriority,
        message: `Case priority ${isPriority ? 'set' : 'removed'} successfully`
      });
    }, 400);
  });
};

// Bulk Case Operations
export const bulkUpdateCaseStatus = async (caseIds, newStatus) => {
  // In a real app, this would call the API
  // return apiRequest('/cases/bulk-update-status', {
  //   method: 'PUT',
  //   body: JSON.stringify({ caseIds, status: newStatus })
  // });

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional failures for demonstration
      if (Math.random() < 0.1) {
        reject(new Error('Bulk status update failed due to server error'));
        return;
      }

      resolve({
        success: true,
        updatedCount: caseIds.length,
        newStatus,
        message: `Successfully updated ${caseIds.length} case(s) to status "${newStatus}"`
      });
    }, 800);
  });
};

export const bulkAssignCases = async (caseIds, agentId) => {
  // In a real app, this would call the API
  // return apiRequest('/cases/bulk-assign', {
  //   method: 'PUT',
  //   body: JSON.stringify({ caseIds, agentId })
  // });

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional failures for demonstration
      if (Math.random() < 0.1) {
        reject(new Error('Bulk agent assignment failed due to server error'));
        return;
      }

      // Simulate dialer integration
      const dialerIntegration = {
        success: true,
        queuedCases: caseIds.length,
        dialerSystemId: `DIALER_QUEUE_${Date.now()}`,
        estimatedCallTime: caseIds.length * 5 // 5 minutes per case
      };

      resolve({
        success: true,
        assignedCount: caseIds.length,
        agentId,
        dialerIntegration,
        message: `Successfully assigned ${caseIds.length} case(s) to ${agentId} and queued in dialer system`
      });
    }, 1000);
  });
};

// Password Management
export const changePassword = async (currentPassword, _newPassword) => {
  // In a real app, this would call the API
  // return apiRequest('/user/change-password', {
  //   method: 'PUT',
  //   body: JSON.stringify({ currentPassword, newPassword })
  // });

  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate password validation
      if (currentPassword === 'password123') {
        resolve({
          success: true,
          message: 'Password changed successfully'
        });
      } else {
        reject(new Error('Current password is incorrect'));
      }
    }, 800);
  });
};

// Export functionality
export const exportCases = async (format, _filters) => {
  // In a real app, this would call the API to generate and download a file
  // return apiRequest('/export/cases', {
  //   method: 'POST',
  //   body: JSON.stringify({ format, filters })
  // });

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        downloadUrl: `https://api.example.com/v1/download/cases-export-${Date.now()}.${format}`,
        message: `Cases exported to ${format.toUpperCase()} successfully`
      });
    }, 1500);
  });
};

// User Settings
export const saveUserSettings = async (settings) => {
  // In a real app, this would call the API
  // return apiRequest('/user/settings', {
  //   method: 'PUT',
  //   body: JSON.stringify(settings)
  // });

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        settings,
        message: 'Settings saved successfully'
      });
    }, 600);
  });
};

// Fetch batch upload status data
export const fetchBatchStatus = async () => {
  // In a real app, this would call the API
  // return apiRequest('/batches/status');

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBatchData = [
        {
          id: 'BATCH-001',
          uploadDate: '2025-04-01',
          fileName: 'April_Auto_Renewals.xlsx',
          totalCases: 125,
          status: {
            renewed: 85,
            inProgress: 25,
            failed: 10,
            pending: 5
          },
          payment: {
            received: 75,
            pending: 50
          }
        },
        {
          id: 'BATCH-002',
          uploadDate: '2025-04-05',
          fileName: 'April_Home_Renewals.xlsx',
          totalCases: 78,
          status: {
            renewed: 45,
            inProgress: 20,
            failed: 8,
            pending: 5
          },
          payment: {
            received: 40,
            pending: 38
          }
        },
        {
          id: 'BATCH-003',
          uploadDate: '2025-04-10',
          fileName: 'April_Life_Renewals.xlsx',
          totalCases: 92,
          status: {
            renewed: 30,
            inProgress: 42,
            failed: 5,
            pending: 15
          },
          payment: {
            received: 28,
            pending: 64
          }
        },
        {
          id: 'BATCH-004',
          uploadDate: '2025-04-15',
          fileName: 'April_Health_Renewals.xlsx',
          totalCases: 110,
          status: {
            renewed: 20,
            inProgress: 65,
            failed: 5,
            pending: 20
          },
          payment: {
            received: 15,
            pending: 95
          }
        },
        {
          id: 'BATCH-005',
          uploadDate: '2025-04-20',
          fileName: 'April_Commercial_Renewals.xlsx',
          totalCases: 45,
          status: {
            renewed: 5,
            inProgress: 25,
            failed: 0,
            pending: 15
          },
          payment: {
            received: 5,
            pending: 40
          }
        }
      ];

      resolve(mockBatchData);
    }, 500);
  });
};

// Team and Team Member API calls
export const fetchTeams = async () => {
  // In a real app, this would call the API
  // return apiRequest('/teams');

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'team-1',
          name: 'Sales Team',
          description: 'Responsible for policy sales and renewals',
          memberCount: 8
        },
        {
          id: 'team-2',
          name: 'Customer Service',
          description: 'Handles customer inquiries and support',
          memberCount: 12
        },
        {
          id: 'team-3',
          name: 'Claims Processing',
          description: 'Processes insurance claims',
          memberCount: 6
        },
        {
          id: 'team-4',
          name: 'Underwriting',
          description: 'Risk assessment and policy underwriting',
          memberCount: 5
        },
        {
          id: 'team-5',
          name: 'Regional North',
          description: 'Northern region operations',
          memberCount: 15
        },
        {
          id: 'team-6',
          name: 'Regional South',
          description: 'Southern region operations',
          memberCount: 18
        }
      ]);
    }, 500);
  });
};

export const fetchTeamMembers = async (teamId) => {
  // In a real app, this would call the API
  // return apiRequest(`/teams/${teamId}/members`);

  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const teamMembers = {
        'team-1': [
          { id: 'member-1', name: 'Priya Patel', role: 'Senior Sales Executive', email: 'priya.patel@company.com' },
          { id: 'member-2', name: 'Ravi Gupta', role: 'Sales Manager', email: 'ravi.gupta@company.com' },
          { id: 'member-3', name: 'Neha Sharma', role: 'Sales Executive', email: 'neha.sharma@company.com' },
          { id: 'member-4', name: 'Amit Kumar', role: 'Sales Representative', email: 'amit.kumar@company.com' },
          { id: 'member-5', name: 'Sanya Singh', role: 'Sales Executive', email: 'sanya.singh@company.com' },
          { id: 'member-6', name: 'Rohit Agarwal', role: 'Sales Representative', email: 'rohit.agarwal@company.com' },
          { id: 'member-7', name: 'Kavya Malhotra', role: 'Senior Sales Executive', email: 'kavya.malhotra@company.com' },
          { id: 'member-8', name: 'Deepak Verma', role: 'Sales Manager', email: 'deepak.verma@company.com' }
        ],
        'team-2': [
          { id: 'member-9', name: 'Ivy Martinez', role: 'Customer Service Manager', email: 'ivy.martinez@company.com' },
          { id: 'member-10', name: 'Jack Thompson', role: 'Senior Customer Service Rep', email: 'jack.thompson@company.com' },
          { id: 'member-11', name: 'Karen White', role: 'Customer Service Representative', email: 'karen.white@company.com' },
          { id: 'member-12', name: 'Leo Garcia', role: 'Customer Service Representative', email: 'leo.garcia@company.com' },
          { id: 'member-13', name: 'Mia Rodriguez', role: 'Senior Customer Service Rep', email: 'mia.rodriguez@company.com' },
          { id: 'member-14', name: 'Nathan Lee', role: 'Customer Service Representative', email: 'nathan.lee@company.com' },
          { id: 'member-15', name: 'Olivia Clark', role: 'Customer Service Representative', email: 'olivia.clark@company.com' },
          { id: 'member-16', name: 'Paul Lewis', role: 'Customer Service Representative', email: 'paul.lewis@company.com' },
          { id: 'member-17', name: 'Quinn Walker', role: 'Customer Service Representative', email: 'quinn.walker@company.com' },
          { id: 'member-18', name: 'Rachel Hall', role: 'Customer Service Representative', email: 'rachel.hall@company.com' },
          { id: 'member-19', name: 'Sam Allen', role: 'Customer Service Representative', email: 'sam.allen@company.com' },
          { id: 'member-20', name: 'Tina Young', role: 'Customer Service Representative', email: 'tina.young@company.com' }
        ],
        'team-3': [
          { id: 'member-21', name: 'Uma Patel', role: 'Claims Manager', email: 'uma.patel@company.com' },
          { id: 'member-22', name: 'Victor Kumar', role: 'Senior Claims Adjuster', email: 'victor.kumar@company.com' },
          { id: 'member-23', name: 'Wendy Chen', role: 'Claims Adjuster', email: 'wendy.chen@company.com' },
          { id: 'member-24', name: 'Xavier Singh', role: 'Claims Processor', email: 'xavier.singh@company.com' },
          { id: 'member-25', name: 'Yara Sharma', role: 'Claims Specialist', email: 'yara.sharma@company.com' },
          { id: 'member-26', name: 'Zoe Johnson', role: 'Claims Adjuster', email: 'zoe.johnson@company.com' }
        ],
        'team-4': [
          { id: 'member-27', name: 'Adam Wilson', role: 'Underwriting Manager', email: 'adam.wilson@company.com' },
          { id: 'member-28', name: 'Beth Cooper', role: 'Senior Underwriter', email: 'beth.cooper@company.com' },
          { id: 'member-29', name: 'Chris Evans', role: 'Underwriter', email: 'chris.evans@company.com' },
          { id: 'member-30', name: 'Diana Prince', role: 'Underwriter', email: 'diana.prince@company.com' },
          { id: 'member-31', name: 'Ethan Hunt', role: 'Junior Underwriter', email: 'ethan.hunt@company.com' }
        ],
        'team-5': [
          { id: 'member-32', name: 'Fiona Green', role: 'Regional Manager', email: 'fiona.green@company.com' },
          { id: 'member-33', name: 'George Hill', role: 'Area Manager', email: 'george.hill@company.com' },
          { id: 'member-34', name: 'Helen Stone', role: 'Branch Manager', email: 'helen.stone@company.com' },
          { id: 'member-35', name: 'Ian Reed', role: 'Sales Representative', email: 'ian.reed@company.com' },
          { id: 'member-36', name: 'Julia Fox', role: 'Sales Representative', email: 'julia.fox@company.com' },
          { id: 'member-37', name: 'Kevin Moon', role: 'Sales Representative', email: 'kevin.moon@company.com' },
          { id: 'member-38', name: 'Lisa Star', role: 'Sales Representative', email: 'lisa.star@company.com' },
          { id: 'member-39', name: 'Mike Sun', role: 'Sales Representative', email: 'mike.sun@company.com' },
          { id: 'member-40', name: 'Nina Sky', role: 'Sales Representative', email: 'nina.sky@company.com' },
          { id: 'member-41', name: 'Oscar Rain', role: 'Sales Representative', email: 'oscar.rain@company.com' },
          { id: 'member-42', name: 'Penny Cloud', role: 'Sales Representative', email: 'penny.cloud@company.com' },
          { id: 'member-43', name: 'Quinn Storm', role: 'Sales Representative', email: 'quinn.storm@company.com' },
          { id: 'member-44', name: 'Ruby Wind', role: 'Sales Representative', email: 'ruby.wind@company.com' },
          { id: 'member-45', name: 'Steve Fire', role: 'Sales Representative', email: 'steve.fire@company.com' },
          { id: 'member-46', name: 'Tara Ice', role: 'Sales Representative', email: 'tara.ice@company.com' }
        ],
        'team-6': [
          { id: 'member-47', name: 'Uma Ocean', role: 'Regional Manager', email: 'uma.ocean@company.com' },
          { id: 'member-48', name: 'Victor River', role: 'Area Manager', email: 'victor.river@company.com' },
          { id: 'member-49', name: 'Wendy Lake', role: 'Branch Manager', email: 'wendy.lake@company.com' },
          { id: 'member-50', name: 'Xavier Bay', role: 'Sales Representative', email: 'xavier.bay@company.com' },
          { id: 'member-51', name: 'Yara Coast', role: 'Sales Representative', email: 'yara.coast@company.com' },
          { id: 'member-52', name: 'Zoe Shore', role: 'Sales Representative', email: 'zoe.shore@company.com' },
          { id: 'member-53', name: 'Alex Beach', role: 'Sales Representative', email: 'alex.beach@company.com' },
          { id: 'member-54', name: 'Bella Wave', role: 'Sales Representative', email: 'bella.wave@company.com' },
          { id: 'member-55', name: 'Carlos Tide', role: 'Sales Representative', email: 'carlos.tide@company.com' },
          { id: 'member-56', name: 'Dora Surf', role: 'Sales Representative', email: 'dora.surf@company.com' },
          { id: 'member-57', name: 'Eli Coral', role: 'Sales Representative', email: 'eli.coral@company.com' },
          { id: 'member-58', name: 'Fay Pearl', role: 'Sales Representative', email: 'fay.pearl@company.com' },
          { id: 'member-59', name: 'Gus Shell', role: 'Sales Representative', email: 'gus.shell@company.com' },
          { id: 'member-60', name: 'Hana Reef', role: 'Sales Representative', email: 'hana.reef@company.com' },
          { id: 'member-61', name: 'Ivan Deep', role: 'Sales Representative', email: 'ivan.deep@company.com' },
          { id: 'member-62', name: 'Jade Blue', role: 'Sales Representative', email: 'jade.blue@company.com' },
          { id: 'member-63', name: 'Kyle Azure', role: 'Sales Representative', email: 'kyle.azure@company.com' },
          { id: 'member-64', name: 'Lara Aqua', role: 'Sales Representative', email: 'lara.aqua@company.com' }
        ]
      };

      resolve(teamMembers[teamId] || []);
    }, 300);
  });
};

// =====================================================================================
// PROVIDER MANAGEMENT API FUNCTIONS
// =====================================================================================

// Test provider connection
export const testProviderConnection = async (_channel, _providerId, _config) => {
  try {
    // In a real app, this would make actual API calls to test the provider
    // return apiRequest(`/providers/test`, {
    //   method: 'POST',
    //   body: JSON.stringify({ channel, providerId, config })
    // });

    // Mock implementation with simulated delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random success/failure for testing
    const success = Math.random() > 0.3;
    return { success, message: success ? 'Connection successful' : 'Connection failed' };
  } catch (error) {
    console.error('Provider test error:', error);
    return { success: false, message: 'Test failed' };
  }
};

// DNC Management Functions
export const checkDNCStatus = async (contact, clientId, channel) => {
  try {
    // Mock DNC check - in real app, this would query the DNC registry
    const mockDNCRegistry = [
      {
        customerPhone: '9876543210',
        customerEmail: 'arjun.sharma@gmail.com',
        clientId: 'CLIENT-001',
        dncType: 'phone',
        dncSource: 'customer',
        reason: 'Customer requested to be removed from marketing calls',
        isActive: true,
        overrideAllowed: false
      },
      {
        customerPhone: '9876543211',
        customerEmail: 'meera.kapoor@gmail.com',
        clientId: 'CLIENT-002',
        dncType: 'both',
        dncSource: 'government',
        reason: 'Registered in TRAI DNC Registry',
        isActive: true,
        overrideAllowed: true
      }
    ];

    const dncEntry = mockDNCRegistry.find(entry =>
      entry.clientId === clientId &&
      entry.isActive &&
      (
        ((channel === 'whatsapp' || channel === 'sms' || channel === 'call') &&
          (entry.dncType === 'phone' || entry.dncType === 'both') &&
          entry.customerPhone === contact.phone)
        ||
        (channel === 'email' &&
          (entry.dncType === 'email' || entry.dncType === 'both') &&
          entry.customerEmail === contact.email)
      )
    );

    if (dncEntry) {
      return {
        isBlocked: true,
        reason: dncEntry.reason,
        source: dncEntry.dncSource,
        overrideAllowed: dncEntry.overrideAllowed,
        dncType: dncEntry.dncType
      };
    }

    return {
      isBlocked: false,
      reason: null,
      source: null,
      overrideAllowed: false,
      dncType: null
    };
  } catch (error) {
    console.error('DNC check error:', error);
    return {
      isBlocked: false,
      reason: 'DNC check failed',
      source: 'system',
      overrideAllowed: false,
      dncType: null
    };
  }
};

export const deduplicateContacts = async (contacts, clientId) => {
  try {
    // Remove duplicates within the dataset
    const uniqueContacts = contacts.filter((contact, index, self) =>
      index === self.findIndex(c =>
        c.phone === contact.phone || c.email === contact.email
      )
    );

    // Check against DNC registry
    const dncFilteredContacts = [];
    const blockedContacts = [];

    for (const contact of uniqueContacts) {
      const phoneCheck = await checkDNCStatus(contact, clientId, 'sms');
      const emailCheck = await checkDNCStatus(contact, clientId, 'email');

      if (phoneCheck.isBlocked || emailCheck.isBlocked) {
        blockedContacts.push({
          ...contact,
          dncReason: phoneCheck.reason || emailCheck.reason,
          dncSource: phoneCheck.source || emailCheck.source
        });
      } else {
        dncFilteredContacts.push(contact);
      }
    }

    return {
      allowed: dncFilteredContacts,
      blocked: blockedContacts,
      duplicatesRemoved: contacts.length - uniqueContacts.length,
      dncBlocked: blockedContacts.length
    };
  } catch (error) {
    console.error('Deduplication error:', error);
    return {
      allowed: contacts,
      blocked: [],
      duplicatesRemoved: 0,
      dncBlocked: 0
    };
  }
};

export const requestDNCOverride = async (_dncId, _overrideData) => {
  try {
    // Mock API call for DNC override request
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      overrideId: `OVERRIDE-${Date.now()}`,
      status: 'pending',
      message: 'Override request submitted for approval'
    };
  } catch (error) {
    throw new Error('Failed to request DNC override');
  }
};

export const addToDNCRegistry = async (_dncData) => {
  try {
    // Mock API call to add DNC entry
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      dncId: `DNC-${Date.now()}`,
      message: 'DNC entry added successfully'
    };
  } catch (error) {
    throw new Error('Failed to add DNC entry');
  }
};

export const getDNCRegistry = async (clientId, _filters = {}) => {
  try {
    // Mock API call to get DNC registry
    await new Promise(resolve => setTimeout(resolve, 500));

    // This would return filtered DNC entries from the database
    return {
      success: true,
      data: [], // DNC entries would be returned here
      pagination: {
        page: 1,
        limit: 10,
        total: 0
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch DNC registry');
  }
};

// Enhanced campaign sending with DNC checking
export const sendCampaignViaProvider = async (campaignData, _providerConfig) => {
  try {
    const { channel, provider, recipients, content, clientId } = campaignData;

    // Pre-send DNC check and deduplication
    const filteredData = await deduplicateContacts(recipients, clientId);

    if (filteredData.blocked.length > 0) {
      // In production, this would be logged to a proper logging service
      // console.log(`Blocked ${filteredData.blocked.length} contacts due to DNC restrictions`);
    }

    if (filteredData.duplicatesRemoved > 0) {
      // In production, this would be logged to a proper logging service
      // console.log(`Removed ${filteredData.duplicatesRemoved} duplicate contacts`);
    }

    // Send to allowed contacts only
    const allowedRecipients = filteredData.allowed;

    if (allowedRecipients.length === 0) {
      return {
        success: false,
        message: 'No valid recipients after DNC filtering and deduplication',
        blocked: filteredData.blocked,
        duplicatesRemoved: filteredData.duplicatesRemoved
      };
    }

    // Route to appropriate provider
    let result;
    switch (channel) {
      case 'email':
        result = await sendEmailViaProvider(provider, allowedRecipients, content);
        break;
      case 'sms':
        result = await sendSMSViaProvider(provider, allowedRecipients, content);
        break;
      case 'whatsapp':
        result = await sendWhatsAppViaProvider(provider, allowedRecipients, content);
        break;
      case 'call':
        result = await makeCallViaProvider(provider, allowedRecipients, content);
        break;
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }

    return {
      ...result,
      sentTo: allowedRecipients.length,
      blocked: filteredData.blocked,
      duplicatesRemoved: filteredData.duplicatesRemoved
    };
  } catch (error) {
    console.error('Campaign send error:', error);
    throw error;
  }
};

// Email provider implementations
const sendEmailViaProvider = async (provider, _recipients, _content) => {
  // const endpoint = PROVIDER_ENDPOINTS.email[provider.type];

  switch (provider.type) {
    case 'sendgrid':
      // return apiRequest(`${endpoint}/mail/send`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${provider.config.apiKey}` },
      //   body: JSON.stringify({
      //     personalizations: recipients.map(r => ({ to: [{ email: r.email }] })),
      //     from: { email: provider.config.fromEmail, name: provider.config.fromName },
      //     subject: content.subject,
      //     content: [{ type: 'text/html', value: content.body }]
      //   })
      // });

      // Mock implementation
      return { success: true, messageId: `sg-${Date.now()}` };

    case 'aws-ses':
      // AWS SES implementation would go here
      return { success: true, messageId: `ses-${Date.now()}` };

    case 'mailgun':
      // Mailgun implementation would go here
      return { success: true, messageId: `mg-${Date.now()}` };

    case 'smtp':
      // Custom SMTP implementation would go here
      return { success: true, messageId: `smtp-${Date.now()}` };

    default:
      throw new Error(`Unsupported email provider: ${provider.type}`);
  }
};

// SMS provider implementations
const sendSMSViaProvider = async (provider, _recipients, _content) => {
  // const endpoint = PROVIDER_ENDPOINTS.sms[provider.type];

  switch (provider.type) {
    case 'twilio':
      // return apiRequest(`${endpoint}/Accounts/${provider.config.accountSid}/Messages.json`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Basic ${btoa(`${provider.config.accountSid}:${provider.config.authToken}`)}` },
      //   body: JSON.stringify({
      //     From: provider.config.fromNumber,
      //     To: recipients[0].phone,
      //     Body: content.message
      //   })
      // });

      // Mock implementation
      return { success: true, messageId: `tw-${Date.now()}` };

    case 'msg91':
      // MSG91 implementation would go here
      return { success: true, messageId: `msg91-${Date.now()}` };

    case 'aws-sns':
      // AWS SNS implementation would go here
      return { success: true, messageId: `sns-${Date.now()}` };

    case 'textlocal':
      // TextLocal implementation would go here
      return { success: true, messageId: `tl-${Date.now()}` };

    default:
      throw new Error(`Unsupported SMS provider: ${provider.type}`);
  }
};

// WhatsApp provider implementations
const sendWhatsAppViaProvider = async (provider, _recipients, _content) => {
  // const endpoint = PROVIDER_ENDPOINTS.whatsapp[provider.type];

  switch (provider.type) {
    case 'meta':
      // return apiRequest(`${endpoint}/${provider.config.phoneNumberId}/messages`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${provider.config.accessToken}` },
      //   body: JSON.stringify({
      //     messaging_product: 'whatsapp',
      //     to: recipients[0].phone,
      //     type: 'text',
      //     text: { body: content.message }
      //   })
      // });

      // Mock implementation
      return { success: true, messageId: `wa-${Date.now()}` };

    case 'gupshup':
      // Gupshup implementation would go here
      return { success: true, messageId: `gs-${Date.now()}` };

    case '360dialog':
      // 360Dialog implementation would go here
      return { success: true, messageId: `360-${Date.now()}` };

    default:
      throw new Error(`Unsupported WhatsApp provider: ${provider.type}`);
  }
};

// Call provider implementations
const makeCallViaProvider = async (provider, _recipients, _content) => {
  // const endpoint = PROVIDER_ENDPOINTS.call[provider.type];

  switch (provider.type) {
    case 'twilio-voice':
      // return apiRequest(`${endpoint}/Accounts/${provider.config.accountSid}/Calls.json`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Basic ${btoa(`${provider.config.accountSid}:${provider.config.authToken}`)}` },
      //   body: JSON.stringify({
      //     From: provider.config.fromNumber,
      //     To: recipients[0].phone,
      //     Url: provider.config.voiceUrl,
      //     Method: 'POST'
      //   })
      // });

      // Mock implementation
      return { success: true, callId: `call-${Date.now()}` };

    case 'exotel':
      // Exotel implementation would go here
      return { success: true, callId: `exo-${Date.now()}` };

    case 'ubona':
      // Ubona implementation would go here
      return { success: true, callId: `ubona-${Date.now()}` };

    default:
      throw new Error(`Unsupported call provider: ${provider.type}`);
  }
};

// Get provider statistics
export const getProviderStats = async (_channel, _providerId) => {
  try {
    // In a real app, this would fetch actual stats from the provider
    // return apiRequest(`/providers/${channel}/${providerId}/stats`);

    // Mock implementation
    return {
      sent: Math.floor(Math.random() * 10000),
      delivered: Math.floor(Math.random() * 9500),
      failed: Math.floor(Math.random() * 500),
      pending: Math.floor(Math.random() * 100),
      lastActivity: new Date(Date.now() - Math.random() * 86400000).toISOString()
    };
  } catch (error) {
    console.error('Provider stats error:', error);
    throw error;
  }
};

// Validate provider configuration
export const validateProviderConfig = (channel, providerType, config) => {
  const errors = [];

  // Basic validation based on provider type
  switch (channel) {
    case 'email':
      if (providerType === 'sendgrid' && !config.apiKey) {
        errors.push('SendGrid API key is required');
      }
      if (!config.fromEmail) {
        errors.push('From email is required');
      }
      break;

    case 'sms':
      if (providerType === 'twilio' && (!config.accountSid || !config.authToken)) {
        errors.push('Twilio Account SID and Auth Token are required');
      }
      if (!config.fromNumber) {
        errors.push('From number is required');
      }
      break;

    case 'whatsapp':
      if (providerType === 'meta' && (!config.accessToken || !config.phoneNumberId)) {
        errors.push('Meta WhatsApp Access Token and Phone Number ID are required');
      }
      break;

    case 'call':
      if (providerType === 'twilio-voice' && (!config.accountSid || !config.authToken)) {
        errors.push('Twilio Account SID and Auth Token are required');
      }
      if (!config.fromNumber) {
        errors.push('From number is required');
      }
      break;

    default:
      errors.push(`Unsupported channel: ${channel}`);
      break;
  }

  return { isValid: errors.length === 0, errors };
};

// =====================================================================================
// USER REGISTRATION API FUNCTIONS
// =====================================================================================

/**
 * Register a new user with company and industry information
 * @param {Object} registrationData - User registration data
 * @returns {Promise<Object>} Registration result
 */
export const registerUser = async (registrationData) => {
  try {
    // In a real app, this would call the API endpoint
    // return apiRequest('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify(registrationData)
    // });

    // Mock implementation with validation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate email already exists error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('An account with this email already exists');
    }

    // Simulate successful registration
    return {
      success: true,
      userId: `USER-${Date.now()}`,
      companyId: `COMPANY-${Date.now()}`,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        company: {
          name: registrationData.companyName,
          industry: registrationData.industry,
          numberOfUsers: registrationData.numberOfUsers,
          additionalFields: registrationData.additionalFields
        }
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise<Object>} Check result
 */
export const checkEmailAvailability = async (email) => {
  try {
    // In a real app, this would call the API endpoint
    // return apiRequest('/auth/check-email', {
    //   method: 'POST',
    //   body: JSON.stringify({ email })
    // });

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate some emails being taken
    const takenEmails = ['admin@example.com', 'test@test.com'];
    const isAvailable = !takenEmails.includes(email.toLowerCase());

    return {
      available: isAvailable,
      message: isAvailable ? 'Email is available' : 'Email is already registered'
    };
  } catch (error) {
    console.error('Email check error:', error);
    throw error;
  }
};

/**
 * Verify email with verification token
 * @param {string} token - Email verification token
 * @returns {Promise<Object>} Verification result
 */
export const verifyEmail = async (token) => {
  try {
    // In a real app, this would call the API endpoint
    // return apiRequest('/auth/verify-email', {
    //   method: 'POST',
    //   body: JSON.stringify({ token })
    // });

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Email verified successfully! You can now login.'
    };
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise<Object>} Resend result
 */
export const resendVerificationEmail = async (email) => {
  try {
    // In a real app, this would call the API endpoint
    // return apiRequest('/auth/resend-verification', {
    //   method: 'POST',
    //   body: JSON.stringify({ email })
    // });

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.'
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
};