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

/* Public API */
export const fetchContacts = async ({ useMocks = false } = {}) => {
  try {
    const response = await api.get('/contact_database/contacts/');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching contacts, using mock data:', error);
    return useMocks ? contactMocks : mockContacts;
  }
};

export const fetchCustomers = async ({ useMocks = false } = {}) => {
  try {
    const response = await api.get('/customers');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching customers, using mock data:', error);
    return useMocks ? customerMocks : mockCustomers;
  }
};

/* Inbound tickets */
export const fetchInboundTickets = async ({ useMocks = false } = {}) => {
  try {
    const response = await api.get('/customers/inbound-tickets');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching inbound tickets, using mock data:', error);
    return mockInboundTickets;
  }
};

export const getInboundTicket = async (ticketId) => {
  try {
    const response = await api.get(`/customers/inbound-tickets/${ticketId}`);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching inbound ticket, using mock:', error);
    return mockInboundTickets.find(t => t.id === ticketId) || null;
  }
};

export const addInboundTicket = async (ticketData) => {
  try {
    const response = await api.post('/customers/inbound-tickets', ticketData);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding inbound ticket, using mock:', error);
    const newTicket = {
      ...ticketData,
      id: ticketData.id || `TKT-${String((mockInboundTickets.length + 1)).padStart(3, '0')}`,
      assignedTo: ticketData.assignedTo || 'Unassigned',
      createdDate: ticketData.createdDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    mockInboundTickets.push(newTicket);
    return newTicket;
  }
};

export const updateInboundTicket = async (ticketId, updates) => {
  try {
    const response = await api.put(`/customers/inbound-tickets/${ticketId}`, updates);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating inbound ticket, using mock:', error);
    mockInboundTickets = mockInboundTickets.map(t =>
      t.id === ticketId ? { ...t, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : t
    );
    return mockInboundTickets.find(t => t.id === ticketId) || null;
  }
};

export const deleteInboundTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/customers/inbound-tickets/${ticketId}`);
    return response.data?.success || true;
  } catch (error) {
    console.error('Error deleting inbound ticket, using mock:', error);
    mockInboundTickets = mockInboundTickets.filter(t => t.id !== ticketId);
    return true;
  }
};

export const markInboundHandled = async (ticketId, handlerInfo = {}) => {
  try {
    const response = await api.put(`/customers/inbound-tickets/${ticketId}/handle`, handlerInfo);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error marking inbound handled, using mock:', error);
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
  }
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

export const saveContacts = async (contacts) => {
  try {
    const response = await api.put('/contact_database/contacts/bulk/', contacts);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving contacts, using mock:', error);
    mockContacts = contacts;
    return contacts;
  }
};

export const saveCustomers = async (customers) => {
  try {
    const response = await api.put('/customers/bulk', customers);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving customers, using mock:', error);
    mockCustomers = customers;
    return customers;
  }
};

/* Contact & Customer CRUD */
export const addContact = async (contactData) => {
  try {
    const response = await api.post('/contact_database/contacts/', contactData);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding contact, using mock:', error);
    const newContact = {
      ...contactData,
      id: `CONT-${Date.now()}`,
      addedDate: contactData.addedDate || new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      isConverted: false
    };
    mockContacts.push(newContact);
    return newContact;
  }
};

export const updateContact = async (contactId, updates) => {
  try {
    const response = await api.put(`/contact_database/contacts/${contactId}/`, updates);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating contact, using mock:', error);
    mockContacts = mockContacts.map(c =>
      c.id === contactId ? { ...c, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : c
    );
    return mockContacts.find(c => c.id === contactId) || null;
  }
};

export const deleteContact = async (contactId) => {
  try {
    const response = await api.delete(`/contact_database/contacts/${contactId}/`);
    return response.data?.success || true;
  } catch (error) {
    console.error('Error deleting contact, using mock:', error);
    mockContacts = mockContacts.filter(c => c.id !== contactId);
    return true;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await api.post('/customers', customerData);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding customer, using mock:', error);
    const newCustomer = {
      ...customerData,
      id: `CUST-${Date.now()}`,
      addedDate: customerData.addedDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  }
};

export const updateCustomer = async (customerId, updates) => {
  try {
    const response = await api.put(`/customers/${customerId}`, updates);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating customer, using mock:', error);
    mockCustomers = mockCustomers.map(c =>
      c.id === customerId ? { ...c, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : c
    );
    return mockCustomers.find(c => c.id === customerId) || null;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await api.delete(`/customers/${customerId}`);
    return response.data?.success || true;
  } catch (error) {
    console.error('Error deleting customer, using mock:', error);
    mockCustomers = mockCustomers.filter(c => c.id !== customerId);
    return true;
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

  try {
    const response = await api.post('/contact_database/contacts/sync-lead/', contactData);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error syncing lead to contact, using mock:', error);
    const idx = mockContacts.findIndex(c => c.leadId === leadData.id);
    if (idx >= 0) {
      mockContacts[idx] = { ...mockContacts[idx], ...contactData, id: mockContacts[idx].id };
    } else {
      mockContacts.push(contactData);
    }
    return contactData;
  }
};

const defaultGeneratePolicyNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `POL-${timestamp}-${random}`;
};

export const convertLeadToCustomer = async (leadData, policyDetails = {}, helpers = {}) => {
  const generatePolicyNumber = helpers.generatePolicyNumber || defaultGeneratePolicyNumber;
  const calculateAge = helpers.calculateAge || ((dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  });
  const determineProductType = helpers.determineProductType || ((interest) => {
    if (!interest) return 'Health Insurance';
    const map = { health: 'Health Insurance', life: 'Life Insurance', vehicle: 'Vehicle Insurance', car: 'Vehicle Insurance', bike: 'Vehicle Insurance', travel: 'Travel Insurance', home: 'Property Insurance' };
    const lower = (interest || '').toLowerCase();
    for (const k of Object.keys(map)) if (lower.includes(k)) return map[k];
    return 'Health Insurance';
  });
  const calculateEndDate = helpers.calculateEndDate || (() => {
    const date = new Date(); date.setFullYear(date.getFullYear() + 1); return date.toISOString().split('T')[0];
  });

  const customerData = {
    id: `CUST-${Date.now()}`,
    leadId: leadData.id,
    contactId: `CONT-${leadData.id}`,
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    address: leadData.address || '',
    city: leadData.city || '',
    state: leadData.state || '',
    pincode: leadData.pincode || '',
    age: policyDetails.age || calculateAge(leadData.dateOfBirth) || 30,
    gender: policyDetails.gender || 'Not Specified',
    dateOfBirth: leadData.dateOfBirth || '',
    productType: policyDetails.productType || determineProductType(leadData.productInterest),
    policyNumber: policyDetails.policyNumber || generatePolicyNumber(),
    policyStatus: 'Active',
    premiumAmount: policyDetails.premiumAmount || leadData.estimatedValue || 0,
    policyStartDate: policyDetails.policyStartDate || new Date().toISOString().split('T')[0],
    policyEndDate: policyDetails.policyEndDate || calculateEndDate(),
    customerStatus: 'Active',
    conversionDate: new Date().toISOString().split('T')[0],
    assignedTo: leadData.assignedTo || 'Unassigned',
    addedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    notes: `Converted from Lead ID: ${leadData.id} on ${new Date().toLocaleDateString()}`,
    source: 'Lead Conversion'
  };

  try {
    const response = await api.post('/customers/convert-lead', { leadData, customerData, policyDetails });
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error converting lead to customer, using mock:', error);
    mockCustomers.push(customerData);
    mockContacts = mockContacts.map(c =>
      c.leadId === leadData.id ? { ...c, isConverted: true, status: 'Converted', convertedDate: new Date().toISOString().split('T')[0] } : c
    );
    return customerData;
  }
};

/* Utility getters */
export const getContactByLeadId = async (leadId) => {
  try {
    const response = await api.get(`/contact_database/contacts/by-lead/${leadId}/`);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching contact by lead ID, using mock:', error);
    return mockContacts.find(c => c.leadId === leadId) || null;
  }
};

export const getCustomerByLeadId = async (leadId) => {
  try {
    const response = await api.get(`/customers/by-lead/${leadId}`);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching customer by lead ID, using mock:', error);
    return mockCustomers.find(c => c.leadId === leadId) || null;
  }
};

export const isLeadConverted = async (leadId) => {
  const found = await getCustomerByLeadId(leadId);
  return !!found;
};
