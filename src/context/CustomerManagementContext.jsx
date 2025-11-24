/* eslint-disable no-console */
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  fetchContacts,
  fetchCustomers,
  addContact as serviceAddContact,
  updateContact as serviceUpdateContact,
  deleteContact as serviceDeleteContact,
  addCustomer as serviceAddCustomer,
  updateCustomer as serviceUpdateCustomer,
  deleteCustomer as serviceDeleteCustomer,
  syncLeadToContact as serviceSyncLeadToContact,
  convertLeadToCustomer as serviceConvertLeadToCustomer
} from '../services/CustomerService';

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

  // Load initial data from service
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedContacts, loadedCustomers] = await Promise.all([
          fetchContacts(),
          fetchCustomers()
        ]);
        setContacts(loadedContacts || []);
        setCustomers(loadedCustomers || []);
      } catch (error) {
        console.error('Failed to load customer data:', error);
      }
    };
    loadData();
  }, []);



  /**
   * Sync lead data to Contact Database
   * Called when a lead is created or updated in Lead Management
   */
  const syncLeadToContact = async (leadData) => {
    try {
      const newContact = await serviceSyncLeadToContact(leadData);
      setContacts(prev => {
        const idx = prev.findIndex(c => c.leadId === leadData.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = newContact;
          return updated;
        }
        return [...prev, newContact];
      });
      return newContact;
    } catch (error) {
      console.error('Error syncing lead to contact:', error);
      throw error;
    }
  };

  /**
   * Convert lead/contact to Customer Database
   * Called when a lead is successfully converted (status = 'Closed Won')
   */
  const convertLeadToCustomer = async (leadData, policyDetails = {}) => {
    try {
      const newCustomer = await serviceConvertLeadToCustomer(leadData, policyDetails);
      setCustomers(prev => [...prev, newCustomer]);

      // Update contact status locally as well since service handles the backend update
      setContacts(prev => prev.map(c =>
        c.leadId === leadData.id
          ? { ...c, isConverted: true, status: 'Converted', convertedDate: new Date().toISOString().split('T')[0] }
          : c
      ));

      return newCustomer;
    } catch (error) {
      console.error('Error converting lead to customer:', error);
      throw error;
    }
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
  const addContact = async (contactData) => {
    try {
      const newContact = await serviceAddContact(contactData);
      setContacts(prev => [...prev, newContact]);
      return newContact;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  /**
   * Update contact
   */
  const updateContact = async (contactId, updates) => {
    try {
      const updated = await serviceUpdateContact(contactId, updates);
      if (updated) {
        setContacts(prev => prev.map(c => c.id === contactId ? updated : c));
      }
      return updated;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  };

  /**
   * Delete contact
   */
  const deleteContact = async (contactId) => {
    try {
      await serviceDeleteContact(contactId);
      setContacts(prev => prev.filter(c => c.id !== contactId));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  };

  /**
   * Add customer manually (from Customer Database page)
   */
  const addCustomer = async (customerData) => {
    try {
      const newCustomer = await serviceAddCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  /**
   * Update customer
   */
  const updateCustomer = async (customerId, updates) => {
    try {
      const updated = await serviceUpdateCustomer(customerId, updates);
      if (updated) {
        setCustomers(prev => prev.map(c => c.id === customerId ? updated : c));
      }
      return updated;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  /**
   * Delete customer
   */
  const deleteCustomer = async (customerId) => {
    try {
      await serviceDeleteCustomer(customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
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
