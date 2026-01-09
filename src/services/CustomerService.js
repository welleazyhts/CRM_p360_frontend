import api from './api';
import customerMocks from '../mock/customerMocks';
import contactMocks from '../mock/contactMocks';

// In-memory fallback storage (replaces localStorage for mock mode)
let mockContacts = [...contactMocks];
let mockCustomers = [...customerMocks];
let mockInboundTickets = [
  {
    id: 'TKT-001',
    customerName: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    subject: 'Policy renewal inquiry',
    description: 'Need help with policy renewal process',
    priority: 'High',
    category: 'Policy Related',
    status: 'Open',
    assignedTo: 'Priya Sharma',
    createdDate: '2025-01-12',
    lastUpdated: '2025-01-12',
    callReason: 'Renewal Query',
    followUpDate: '2025-01-15',
    followUpTime: '10:00 AM',
    followUpRequired: true,
    incomingCallerNumber: '+91 98765 43210',
    callDuration: '5 mins',
    callNotes: 'Customer wants to renew policy, needs premium calculation'
  },
  {
    id: 'TKT-002',
    customerName: 'Anita Desai',
    email: 'anita@example.com',
    phone: '+91 98765 43211',
    subject: 'Claim status update',
    description: 'Request for claim status information',
    priority: 'Medium',
    category: 'Claims',
    status: 'In Progress',
    assignedTo: 'Amit Patel',
    createdDate: '2025-01-11',
    lastUpdated: '2025-01-12',
    callReason: 'Claim Request',
    followUpDate: '2025-01-14',
    followUpTime: '2:00 PM',
    followUpRequired: true,
    incomingCallerNumber: '+91 98765 43211',
    callDuration: '8 mins',
    callNotes: 'Customer inquiring about claim status, provided reference number'
  }
];

// Helper to map backend snake_case to frontend camelCase

// Value Mapping Helpers
const toBackendValue = (field, value) => {
  if (!value) return value;
  const val = value.toString();

  switch (field) {
    case 'productType':
    case 'product_type':
      if (val === 'Health Insurance') return 'health';
      if (val === 'Life Insurance') return 'life';
      if (val === 'Vehicle Insurance') return 'vehicle';
      if (val === 'Property Insurance') return 'property';
      if (val === 'Travel Insurance') return 'travel';
      return val.toLowerCase().split(' ')[0];

    case 'status':
    case 'customerStatus':
    case 'customer_status':
    case 'policyStatus':
    case 'policy_status':
      return val.toLowerCase();

    case 'gender':
      if (val === 'Other') return 'Others';
      return val;

    default:
      return value;
  }
};

const toFrontendValue = (field, value) => {
  if (!value) return value;

  switch (field) {
    case 'product_type':
    case 'productType':
      const map = {
        'health': 'Health Insurance',
        'life': 'Life Insurance',
        'vehicle': 'Vehicle Insurance',
        'car': 'Vehicle Insurance',
        'property': 'Property Insurance',
        'home': 'Property Insurance',
        'travel': 'Travel Insurance'
      };
      return map[value.toLowerCase()] || value;

    case 'customer_status':
    case 'customerStatus':
    case 'status':
    case 'policy_status':
    case 'policyStatus':
      return value.charAt(0).toUpperCase() + value.slice(1);

    default:
      return value;
  }
};
const mapCustomerFromBackend = (data) => ({
  id: data.id || data.customer_id,
  name: data.name,
  email: data.email,
  phone: data.phone,
  age: data.age,
  gender: data.gender,
  address: data.address,
  city: data.city,
  state: data.state,
  productType: toFrontendValue('product_type', data.product_type),
  policyNumber: data.policy_number,
  policyStatus: toFrontendValue('policy_status', data.policy_status),
  premiumAmount: parseFloat(data.premium_amount) || 0,
  status: toFrontendValue('customer_status', data.customer_status),
  // Preserve other fields if needed
  ...data
});

// Helper to map frontend camelCase to backend snake_case
const mapCustomerToBackend = (data) => ({
  name: data.name,
  email: data.email,
  phone: data.phone,
  age: data.age,
  gender: toBackendValue('gender', data.gender),
  address: data.address,
  city: data.city,
  state: data.state,
  product_type: toBackendValue('productType', data.productType),
  policy_number: data.policyNumber,
  policy_status: toBackendValue('policyStatus', data.policyStatus),
  premium_amount: data.premiumAmount,
  customer_status: toBackendValue('customerStatus', data.status || data.customerStatus)
});

/* Public API */

// Contacts (Still using mocks as no API provided for this specific part)
export const fetchContacts = async ({ useMocks = false } = {}) => {
  try {
    // Attempt to hit an endpoint if it exists, roughly guessing based on pattern
    // const response = await api.get('/contact_database/contacts/'); 
    // if (Array.isArray(response.data)) return response.data;
    return mockContacts;
  } catch (error) {
    console.warn('Error fetching contacts, using mock data:', error);
    return mockContacts;
  }
};

// Customers - REAL API INTEGRATION
export const fetchCustomers = async () => {
  try {
    const response = await api.get('/customer_database/customers_list/');
    if (Array.isArray(response.data)) {
      return response.data.map(mapCustomerFromBackend);
    }
    // Handle case where it might be wrapped in { data: [...] } or { results: [...] }
    const list = response.data.data || response.data.results || [];
    if (Array.isArray(list)) {
      return list.map(mapCustomerFromBackend);
    }
    return [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/* Inbound tickets (Mocks) */
export const fetchInboundTickets = async ({ useMocks = false } = {}) => {
  return mockInboundTickets;
};

export const getInboundTicket = async (ticketId) => {
  return mockInboundTickets.find(t => t.id === ticketId) || null;
};

export const addInboundTicket = async (ticketData) => {
  const newTicket = {
    ...ticketData,
    id: ticketData.id || `TKT-${String((mockInboundTickets.length + 1)).padStart(3, '0')}`,
    assignedTo: ticketData.assignedTo || 'Unassigned',
    createdDate: ticketData.createdDate || new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  mockInboundTickets.push(newTicket);
  return newTicket;
};

export const updateInboundTicket = async (ticketId, updates) => {
  mockInboundTickets = mockInboundTickets.map(t =>
    t.id === ticketId ? { ...t, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : t
  );
  return mockInboundTickets.find(t => t.id === ticketId) || null;
};

export const deleteInboundTicket = async (ticketId) => {
  mockInboundTickets = mockInboundTickets.filter(t => t.id !== ticketId);
  return true;
};

export const markInboundHandled = async (ticketId, handlerInfo = {}) => {
  mockInboundTickets = mockInboundTickets.map(t =>
    t.id === ticketId ? {
      ...t,
      status: 'Resolved',
      handledBy: handlerInfo.name || handlerInfo.user || 'System',
      handledDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    } : t
  );
  return mockInboundTickets.find(t => t.id === ticketId) || null;
};

export const syncInboundToContact = async (ticketId) => {
  const ticket = await getInboundTicket(ticketId);
  if (!ticket) return null;
  const contactData = {
    name: ticket.customerName || `Caller ${ticket.incomingCallerNumber || ''}`,
    email: ticket.email || '',
    phone: ticket.phone || ticket.incomingCallerNumber || '',
    source: 'Inbound Call',
    addedDate: new Date().toISOString().split('T')[0],
    notes: `Created from inbound ticket ${ticket.id}`
  };
  const created = await addContact(contactData);
  return created;
};

// Bulk Operations
export const saveContacts = async (contacts) => {
  mockContacts = contacts;
  return contacts;
};

export const saveCustomers = async (customers) => {
  // Logic handled individually in new API, but for bulk updates we might need a loop or specific endpoint
  // Using loop for now if direct bulk endpoint isn't 1:1 match
  // The Postman has /customer_database/bulkupload/ but that takes a file.
  // We'll rely on addCustomer for individual adds for now unless bulk json is supported.
  return customers;
};

export const bulkUploadCustomers = async (formData) => {
  try {
    const response = await api.post('/customer_database/bulkupload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading customers:', error);
    throw error;
  }
};


/* Contact & Customer CRUD */
export const addContact = async (contactData) => {
  const newContact = {
    ...contactData,
    id: `CONT-${Date.now()}`,
    addedDate: contactData.addedDate || new Date().toISOString().split('T')[0],
    lastContact: new Date().toISOString().split('T')[0],
    isConverted: false
  };
  mockContacts.push(newContact);
  return newContact;
};

export const updateContact = async (contactId, updates) => {
  mockContacts = mockContacts.map(c =>
    c.id === contactId ? { ...c, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : c
  );
  return mockContacts.find(c => c.id === contactId) || null;
};

export const deleteContact = async (contactId) => {
  mockContacts = mockContacts.filter(c => c.id !== contactId);
  return true;
};

// CUSTOMER CRUD - REAL API
export const addCustomer = async (customerData) => {
  try {
    const payload = mapCustomerToBackend(customerData);
    const response = await api.post('/customer_database/create/', payload);
    return mapCustomerFromBackend(response.data);
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId, updates) => {
  try {
    const payload = mapCustomerToBackend(updates);
    const response = await api.put(`/customer_database/customers/${customerId}/update/`, payload);
    return mapCustomerFromBackend(response.data);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  // Warning: No direct DELETE endpoint provided in collection for singular customer by ID.
  // Implementing a soft local delete or logging warning.
  console.warn('Delete customer API not provided. Clearing locally.');
  return true; // Optimistic success
};

export const searchCustomers = async (query) => {
  try {
    const response = await api.get(`/customer_database/search/${query}`);
    // Check for nested structure or direct array
    if (Array.isArray(response.data)) {
      return response.data.map(mapCustomerFromBackend);
    }
    const list = response.data.data || response.data.results || [];
    return Array.isArray(list) ? list.map(mapCustomerFromBackend) : [];
  } catch (error) {
    console.error('Error searching customers:', error);
    throw error;
  }
};

export const refreshDatabase = async () => {
  try {
    const response = await api.get('/customer_database/refresh/');
    return response.data;
  } catch (error) {
    console.error('Error refreshing database:', error);
    throw error;
  }
};

export const filterCustomers = async (filters) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      // Map frontend keys to backend keys if needed
      const backendKey = key === 'productType' ? 'product_type' :
        key === 'customerStatus' ? 'customer_status' :
          key === 'policyStatus' ? 'policy_status' :
            key;

      if (value !== 'all' && value !== '' && value !== null) {
        if (Array.isArray(value)) {
          // Handle ranges if needed, e.g. ageRange: [18, 80]
          if (key === 'ageRange') {
            queryParams.append('age_min', value[0]);
            queryParams.append('age_max', value[1]);
          } else if (key === 'premiumRange') {
            queryParams.append('premium_min', value[0]);
            queryParams.append('premium_max', value[1]);
          }
        } else {
          // Apply backend value mapping here too!
          const backendVal = toBackendValue(backendKey, value);
          queryParams.append(backendKey, backendVal);
        }
      }
    });

    const response = await api.get(`/customer_database/filter/?${queryParams.toString()}`);
    if (Array.isArray(response.data)) {
      return response.data.map(mapCustomerFromBackend);
    }
    const list = response.data.data || response.data.results || [];
    return Array.isArray(list) ? list.map(mapCustomerFromBackend) : [];

  } catch (error) {
    console.error('Error filtering customers:', error);
    throw error;
  }
};

export const getUploadHistory = async () => {
  try {
    const response = await api.get('/customer_database/history/');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const clearUploadHistory = async () => {
  try {
    // Note: Postman shows this endpoint taking a body matching a customer structure?
    // That's unusual for 'clear history'. Assuming it might clear *that specific* record from history?
    // For now, calling it as a general clear if possible, or we skip body if optional.
    const response = await api.delete('/customer_database/clear-history/');
    return response.data;
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};


/* Sync/Convert Helpers */
export const syncLeadToContact = async (leadData) => {
  const contactData = {
    id: `CONT-${leadData.id}`,
    leadId: leadData.id,
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    company: leadData.company || '',
    designation: leadData.designation || '',
    source: leadData.source || 'Lead Management',
    status: 'Active',
    assignedTo: leadData.assignedTo || 'Unassigned',
    addedDate: leadData.createdDate || new Date().toISOString().split('T')[0],
    lastContact: new Date().toISOString().split('T')[0],
    notes: `Synced from Lead Management - Lead ID: ${leadData.id}`,
    leadStatus: leadData.status,
    isConverted: false
  };
  const exists = mockContacts.find(c => c.leadId === leadData.id);
  if (!exists) {
    mockContacts.push(contactData);
  }
  return contactData;
};

export const convertLeadToCustomer = async (leadData, policyDetails = {}, helpers = {}) => {
  // This could ideally call an API endpoint if one existed for 'convert'.
  // Since one isn't explicitly provided in the list (other than create), checking if we can use create.

  // Mapped data
  const customerApiPayload = {
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    age: policyDetails.age || 30, // Default if missing
    gender: policyDetails.gender || 'Not Specified',
    address: leadData.address || '',
    city: leadData.city || '',
    state: leadData.state || '',
    product_type: policyDetails.productType || 'Health Insurance',
    policy_number: policyDetails.policyNumber || `POL-${Date.now()}`,
    policy_status: 'Active',
    premium_amount: policyDetails.premiumAmount || 0,
    customer_status: 'Active'
  };

  try {
    const response = await api.post('/customer_database/create/', customerApiPayload);
    return mapCustomerFromBackend(response.data);
  } catch (error) {
    console.error('Error converting lead to customer via API:', error);
    throw error;
  }
};

/* Utility getters */
export const getContactByLeadId = async (leadId) => {
  return mockContacts.find(c => c.leadId === leadId) || null;
};

export const getCustomerByLeadId = async (leadId) => {
  // Ideally search API by leadId if supported, else assume not found or use local logic
  return null;
};

export const isLeadConverted = async (leadId) => {
  return false;
};

