import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import leadService from '../services/leadService';
import { useCustomerManagement } from './CustomerManagementContext';

// Lead Context for state management
const LeadContext = createContext();

// Action types
const LEAD_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_LEADS: 'SET_LEADS',
  ADD_LEAD: 'ADD_LEAD',
  UPDATE_LEAD: 'UPDATE_LEAD',
  DELETE_LEAD: 'DELETE_LEAD',
  SET_SELECTED_LEAD: 'SET_SELECTED_LEAD',
  SET_LEAD_ACTIVITIES: 'SET_LEAD_ACTIVITIES',
  ADD_LEAD_ACTIVITY: 'ADD_LEAD_ACTIVITY',
  SET_LEAD_ANALYTICS: 'SET_LEAD_ANALYTICS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  BULK_UPDATE_LEADS: 'BULK_UPDATE_LEADS',
  BULK_DELETE_LEADS: 'BULK_DELETE_LEADS'
};

// Initial state
const initialState = {
  leads: [],
  selectedLead: null,
  leadActivities: [],
  leadAnalytics: null,
  loading: false,
  error: null,
  filters: {
    status: 'All',
    priority: 'All',
    assignedTo: 'All',
    source: 'All',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
  availableUsers: [],
  leadSources: [],
  leadStatuses: [],
  leadPriorities: []
};

// Reducer function
const leadReducer = (state, action) => {
  switch (action.type) {
    case LEAD_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case LEAD_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case LEAD_ACTIONS.SET_LEADS:
      return {
        ...state,
        leads: action.payload.leads,
        pagination: {
          ...state.pagination,
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.totalItems || 0
        },
        loading: false,
        error: null
      };
    
    case LEAD_ACTIONS.ADD_LEAD:
      return {
        ...state,
        leads: [action.payload, ...state.leads],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1
        }
      };
    
    case LEAD_ACTIONS.UPDATE_LEAD:
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload : lead
        ),
        selectedLead: state.selectedLead?.id === action.payload.id 
          ? action.payload 
          : state.selectedLead
      };
    
    case LEAD_ACTIONS.DELETE_LEAD:
      return {
        ...state,
        leads: state.leads.filter(lead => lead.id !== action.payload),
        selectedLead: state.selectedLead?.id === action.payload 
          ? null 
          : state.selectedLead,
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1
        }
      };
    
    case LEAD_ACTIONS.SET_SELECTED_LEAD:
      return { ...state, selectedLead: action.payload };
    
    case LEAD_ACTIONS.SET_LEAD_ACTIVITIES:
      return { ...state, leadActivities: action.payload };
    
    case LEAD_ACTIONS.ADD_LEAD_ACTIVITY:
      return {
        ...state,
        leadActivities: [action.payload, ...state.leadActivities]
      };
    
    case LEAD_ACTIONS.SET_LEAD_ANALYTICS:
      return { ...state, leadAnalytics: action.payload };
    
    case LEAD_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case LEAD_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case LEAD_ACTIONS.BULK_UPDATE_LEADS:
      return {
        ...state,
        leads: state.leads.map(lead =>
          action.payload.leadIds.includes(lead.id)
            ? { ...lead, ...action.payload.updateData }
            : lead
        )
      };
    
    case LEAD_ACTIONS.BULK_DELETE_LEADS:
      return {
        ...state,
        leads: state.leads.filter(lead => !action.payload.includes(lead.id)),
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - action.payload.length
        }
      };
    
    default:
      return state;
  }
};

// Lead Provider component
export const LeadProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leadReducer, initialState);

  // Get customer management functions
  const { syncLeadToContact, convertLeadToCustomer, isLeadConverted } = useCustomerManagement();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: true });
      
      const [users, sources, statuses, priorities] = await Promise.all([
        leadService.getAvailableUsers(),
        leadService.getLeadSources(),
        leadService.getLeadStatuses(),
        leadService.getLeadPriorities()
      ]);

      // Update state with initial data
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Lead CRUD operations
  const fetchLeads = async (filters = {}) => {
    try {
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: true });
      
      const response = await leadService.getLeads({
        ...state.filters,
        ...filters,
        page: state.pagination.currentPage,
        limit: state.pagination.itemsPerPage
      });
      
      dispatch({
        type: LEAD_ACTIONS.SET_LEADS,
        payload: response
      });
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const fetchLead = async (leadId) => {
    try {
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: true });
      
      const lead = await leadService.getLead(leadId);
      
      dispatch({ type: LEAD_ACTIONS.SET_SELECTED_LEAD, payload: lead });
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: false });
      
      return lead;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const createLead = async (leadData) => {
    try {
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: true });

      const newLead = await leadService.createLead(leadData);

      dispatch({ type: LEAD_ACTIONS.ADD_LEAD, payload: newLead });

      // Automatically sync new lead to Contact Database
      syncLeadToContact(newLead);

      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: false });

      return newLead;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateLead = async (leadId, leadData) => {
    try {
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: true });

      const updatedLead = await leadService.updateLead(leadId, leadData);

      dispatch({ type: LEAD_ACTIONS.UPDATE_LEAD, payload: updatedLead });

      // Sync updated lead to Contact Database
      syncLeadToContact(updatedLead);

      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: false });

      return updatedLead;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteLead = async (leadId) => {
    try {
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: true });
      
      await leadService.deleteLead(leadId);
      
      dispatch({ type: LEAD_ACTIONS.DELETE_LEAD, payload: leadId });
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Lead assignment operations
  const assignLead = async (leadId, userId) => {
    try {
      const updatedLead = await leadService.assignLead(leadId, userId);
      dispatch({ type: LEAD_ACTIONS.UPDATE_LEAD, payload: updatedLead });
      return updatedLead;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const unassignLead = async (leadId) => {
    try {
      const updatedLead = await leadService.unassignLead(leadId);
      dispatch({ type: LEAD_ACTIONS.UPDATE_LEAD, payload: updatedLead });
      return updatedLead;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Lead status operations
  const updateLeadStatus = async (leadId, status, notes = '') => {
    try {
      const updatedLead = await leadService.updateLeadStatus(leadId, status, notes);
      dispatch({ type: LEAD_ACTIONS.UPDATE_LEAD, payload: updatedLead });
      return updatedLead;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Lead activities
  const fetchLeadActivities = async (leadId) => {
    try {
      const activities = await leadService.getLeadActivities(leadId);
      dispatch({ type: LEAD_ACTIONS.SET_LEAD_ACTIVITIES, payload: activities });
      return activities;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const addLeadActivity = async (leadId, activityData) => {
    try {
      const activity = await leadService.addLeadActivity(leadId, activityData);
      dispatch({ type: LEAD_ACTIONS.ADD_LEAD_ACTIVITY, payload: activity });
      return activity;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Email operations
  const sendEmailToLead = async (leadId, emailData) => {
    try {
      const result = await leadService.sendEmailToLead(leadId, emailData);
      // Add email activity to lead activities
      await addLeadActivity(leadId, {
        type: 'email',
        title: 'Email sent',
        description: emailData.subject,
        date: new Date().toISOString()
      });
      return result;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Analytics
  const fetchLeadAnalytics = async (filters = {}) => {
    try {
      const analytics = await leadService.getLeadAnalytics(filters);
      dispatch({ type: LEAD_ACTIONS.SET_LEAD_ANALYTICS, payload: analytics });
      return analytics;
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Bulk operations
  const bulkUpdateLeads = async (leadIds, updateData) => {
    try {
      await leadService.bulkUpdateLeads(leadIds, updateData);
      dispatch({ type: LEAD_ACTIONS.BULK_UPDATE_LEADS, payload: { leadIds, updateData } });
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const bulkDeleteLeads = async (leadIds) => {
    try {
      await leadService.bulkDeleteLeads(leadIds);
      dispatch({ type: LEAD_ACTIONS.BULK_DELETE_LEADS, payload: leadIds });
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Filter and pagination
  const setFilters = (filters) => {
    dispatch({ type: LEAD_ACTIONS.SET_FILTERS, payload: filters });
  };

  const setPagination = (pagination) => {
    dispatch({ type: LEAD_ACTIONS.SET_PAGINATION, payload: pagination });
  };

  const clearError = () => {
    dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: null });
  };

  const clearSelectedLead = () => {
    dispatch({ type: LEAD_ACTIONS.SET_SELECTED_LEAD, payload: null });
  };

  // Convert lead to customer (when status = "Closed Won")
  const convertLead = async (leadId, policyDetails = {}) => {
    try {
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: true });

      // First, update the lead status to "Closed Won" if not already
      const lead = state.leads.find(l => l.id === leadId) || state.selectedLead;
      if (!lead) {
        throw new Error('Lead not found');
      }

      // Check if already converted
      if (isLeadConverted(leadId)) {
        throw new Error('This lead has already been converted to a customer');
      }

      // Update lead status to Closed Won
      const updatedLead = await leadService.updateLeadStatus(leadId, 'Closed Won', 'Lead converted to customer');
      dispatch({ type: LEAD_ACTIONS.UPDATE_LEAD, payload: updatedLead });

      // Convert to customer in Customer Database
      const customer = convertLeadToCustomer(updatedLead, policyDetails);

      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: false });

      return { lead: updatedLead, customer };
    } catch (error) {
      dispatch({ type: LEAD_ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: LEAD_ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  const value = {
    // State
    ...state,

    // Actions
    fetchLeads,
    fetchLead,
    createLead,
    updateLead,
    deleteLead,
    assignLead,
    unassignLead,
    updateLeadStatus,
    fetchLeadActivities,
    addLeadActivity,
    sendEmailToLead,
    fetchLeadAnalytics,
    bulkUpdateLeads,
    bulkDeleteLeads,
    setFilters,
    setPagination,
    clearError,
    clearSelectedLead,
    // Customer integration
    convertLead,
    isLeadConverted
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
};

// Custom hook to use lead context
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};

export default LeadContext;
