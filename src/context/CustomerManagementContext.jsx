/* eslint-disable no-console */
import React, { createContext, useState, useContext, useEffect } from 'react';
import customerMocks from '../mock/customerMocks';
import contactMocks from '../mock/contactMocks';

const CustomerManagementContext = createContext();

export const useCustomerManagement = () => {
  const context = useContext(CustomerManagementContext);
  if (!context) {
    throw new Error('useCustomerManagement must be used within CustomerManagementProvider');
  }
  return context;
};

export const CustomerManagementProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Load initial data from localStorage or use mocks
  useEffect(() => {
    console.log('CustomerManagementContext initializing');
    // Read env flag robustly (allow boolean or string values)
    const useMocks = String(process.env.REACT_APP_USE_MOCKS).toLowerCase() === 'true';
    console.log('REACT_APP_USE_MOCKS:', process.env.REACT_APP_USE_MOCKS, '=> useMocks:', useMocks);
    console.log('Mock data available - Customers:', Array.isArray(customerMocks) ? customerMocks.length : typeof customerMocks);
    console.log('Mock data available - Contacts:', Array.isArray(contactMocks) ? contactMocks.length : typeof contactMocks);

    if (useMocks) {
      console.log('Loading mock data (env override)');
      // Seed both contacts and customers for dev
      setContacts(contactMocks);
      setCustomers(customerMocks);
      try {
        localStorage.setItem('contactDatabase', JSON.stringify(contactMocks));
        localStorage.setItem('customerDatabase', JSON.stringify(customerMocks));
      } catch (e) { /* ignore */ }
      return;
    }

    const savedContacts = localStorage.getItem('contactDatabase');
    const savedCustomers = localStorage.getItem('customerDatabase');

    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (error) {
        console.error('Failed to parse contacts:', error);
      }
    }

    if (savedCustomers) {
      try {
        const parsed = JSON.parse(savedCustomers);
        setCustomers(parsed);
      } catch (error) {
        console.error('Failed to parse customers:', error);
      }
    }

    // If nothing was found in storage and mocks exist, seed with mocks as a safe fallback.
    // This ensures the UI shows sample data during local development even if env isn't set.
    const noSavedContacts = !savedContacts || savedContacts === '[]';
    const noSavedCustomers = !savedCustomers || savedCustomers === '[]';

    if (noSavedContacts && Array.isArray(contactMocks) && contactMocks.length > 0) {
      console.log('No saved contacts found — seeding mock contact data as fallback');
      setContacts(contactMocks);
      try { localStorage.setItem('contactDatabase', JSON.stringify(contactMocks)); } catch (e) { /* ignore */ }
    }

    if (noSavedCustomers && Array.isArray(customerMocks) && customerMocks.length > 0) {
      console.log('No saved customers found — seeding mock customer data as fallback');
      setCustomers(customerMocks);
      try { localStorage.setItem('customerDatabase', JSON.stringify(customerMocks)); } catch (e) { /* ignore */ }
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('contactDatabase', JSON.stringify(contacts));
    }
  }, [contacts]);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('customerDatabase', JSON.stringify(customers));
    }
  }, [customers]);

  /**
   * Sync lead data to Contact Database
   * Called when a lead is created or updated in Lead Management
   */
  const syncLeadToContact = (leadData) => {
    const contactData = {
      id: `CONT-${leadData.id}`,
      leadId: leadData.id,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company || '',
      designation: leadData.designation || '',
      source: leadData.source || 'Lead Management',
      status: 'Active', // Active prospect
      assignedTo: leadData.assignedTo || 'Unassigned',
      addedDate: leadData.createdDate || new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      notes: `Synced from Lead Management - Lead ID: ${leadData.id}`,
      leadStatus: leadData.status,
      isConverted: false
    };

    setContacts(prevContacts => {
      // Check if contact already exists (by leadId)
      const existingIndex = prevContacts.findIndex(c => c.leadId === leadData.id);

      if (existingIndex >= 0) {
        // Update existing contact
        const updated = [...prevContacts];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...contactData,
          id: updated[existingIndex].id // Keep original contact ID
        };
        return updated;
      } else {
        // Add new contact
        return [...prevContacts, contactData];
      }
    });

    return contactData;
  };

  /**
   * Convert lead/contact to Customer Database
   * Called when a lead is successfully converted (status = 'Closed Won')
   */
  const convertLeadToCustomer = (leadData, policyDetails = {}) => {
    // Map lead data to customer format
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

      // Demographics
      age: policyDetails.age || calculateAge(leadData.dateOfBirth) || 30,
      gender: policyDetails.gender || 'Not Specified',
      dateOfBirth: leadData.dateOfBirth || '',

      // Policy Information
      productType: policyDetails.productType || determineProductType(leadData.productInterest),
      policyNumber: policyDetails.policyNumber || generatePolicyNumber(),
      policyStatus: 'Active',
      premiumAmount: policyDetails.premiumAmount || leadData.estimatedValue || 0,
      policyStartDate: policyDetails.policyStartDate || new Date().toISOString().split('T')[0],
      policyEndDate: policyDetails.policyEndDate || calculateEndDate(),

      // Customer status
      customerStatus: 'Active',
      conversionDate: new Date().toISOString().split('T')[0],
      assignedTo: leadData.assignedTo || 'Unassigned',

      // Metadata
      addedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: `Converted from Lead ID: ${leadData.id} on ${new Date().toLocaleDateString()}`,
      source: 'Lead Conversion'
    };

    // Add to customers
    setCustomers(prevCustomers => [...prevCustomers, customerData]);

    // Mark contact as converted
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.leadId === leadData.id
          ? { ...contact, isConverted: true, status: 'Converted', convertedDate: new Date().toISOString().split('T')[0] }
          : contact
      )
    );

    return customerData;
  };

  /**
   * Get contact by lead ID
   */
  const getContactByLeadId = (leadId) => {
    return contacts.find(c => c.leadId === leadId);
  };

  /**
   * Get customer by lead ID
   */
  const getCustomerByLeadId = (leadId) => {
    return customers.find(c => c.leadId === leadId);
  };

  /**
   * Check if lead has been converted to customer
   */
  const isLeadConverted = (leadId) => {
    return customers.some(c => c.leadId === leadId);
  };

  /**
   * Add contact manually (from Contact Database page)
   */
  const addContact = (contactData) => {
    const newContact = {
      ...contactData,
      id: `CONT-${Date.now()}`,
      addedDate: contactData.addedDate || new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      isConverted: false
    };
    setContacts(prevContacts => [...prevContacts, newContact]);
    return newContact;
  };

  /**
   * Update contact
   */
  const updateContact = (contactId, updates) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId
          ? { ...contact, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : contact
      )
    );
  };

  /**
   * Delete contact
   */
  const deleteContact = (contactId) => {
    setContacts(prevContacts => prevContacts.filter(c => c.id !== contactId));
  };

  /**
   * Add customer manually (from Customer Database page)
   */
  const addCustomer = (customerData) => {
    const newCustomer = {
      ...customerData,
      id: `CUST-${Date.now()}`,
      addedDate: customerData.addedDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    return newCustomer;
  };

  /**
   * Update customer
   */
  const updateCustomer = (customerId, updates) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(customer =>
        customer.id === customerId
          ? { ...customer, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : customer
      )
    );
  };

  /**
   * Delete customer
   */
  const deleteCustomer = (customerId) => {
    setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== customerId));
  };

  // Helper functions
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const determineProductType = (productInterest) => {
    if (!productInterest) return 'Health Insurance';

    const productMap = {
      'health': 'Health Insurance',
      'life': 'Life Insurance',
      'vehicle': 'Vehicle Insurance',
      'auto': 'Vehicle Insurance',
      'car': 'Vehicle Insurance',
      'bike': 'Vehicle Insurance',
      'property': 'Property Insurance',
      'home': 'Property Insurance',
      'travel': 'Travel Insurance'
    };

    const lowerInterest = productInterest.toLowerCase();
    for (const [key, value] of Object.entries(productMap)) {
      if (lowerInterest.includes(key)) {
        return value;
      }
    }

    return 'Health Insurance'; // Default
  };

  const generatePolicyNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `POL-${timestamp}-${random}`;
  };

  const calculateEndDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1); // 1 year from now
    return date.toISOString().split('T')[0];
  };

  const value = {
    // Data
    contacts,
    customers,

    // Lead Integration
    syncLeadToContact,
    convertLeadToCustomer,
    getContactByLeadId,
    getCustomerByLeadId,
    isLeadConverted,

    // Contact Management
    addContact,
    updateContact,
    deleteContact,
    setContacts,

    // Customer Management
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setCustomers
  };

  return (
    <CustomerManagementContext.Provider value={value}>
      {children}
    </CustomerManagementContext.Provider>
  );
};
