import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import logger from '../utils/logger';
import { authService } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Function to apply user language preference
  const applyUserLanguage = useCallback((user) => {
    if (user && user.portalLanguage) {
      i18n.changeLanguage(user.portalLanguage);
      localStorage.setItem('userLanguagePreference', user.portalLanguage);
    }
  }, [i18n]);

  // Function to check if user account is expired
  const isAccountExpired = useCallback((user) => {
    if (!user || !user.expiryDate) return false;
    const today = new Date();
    const expiryDate = new Date(user.expiryDate);
    return today > expiryDate;
  }, []);

  // Function to get days until expiry
  const getDaysUntilExpiry = useCallback((user) => {
    if (!user || !user.expiryDate) return null;
    const today = new Date();
    const expiryDate = new Date(user.expiryDate);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, []);

  // Mock function to get user data from backend (including language preference)
  const getUserData = (email) => {
    // In a real app, this would fetch user data from your backend
    // For demo purposes, we'll simulate different users with different language preferences
    const mockUsers = {
      'rajesh@client.com': {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@client.com',
        role: 'renewals_specialist',
        portalLanguage: 'en', // English preference
        expiryDate: '2025-12-31', // Account expires on Dec 31, 2025
        status: 'active',
        permissions: [
          // Renewals Module Only
          'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs',
          // Personal Pages
          'profile'
        ]
      },
      'priya@client.com': {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@client.com',
        role: 'all_modules_manager',
        portalLanguage: 'en', // English preference
        expiryDate: '2025-06-30', // Account expires on June 30, 2025
        status: 'active',
        permissions: [
          // Core Pages (excluding Renewals module - no cases, closed-cases, policy-timeline, logs)
          'dashboard', 'upload', 'claims',
          'policy-servicing', 'new-business', 'medical-management',
          // Lead Management
          'leads', 'lead-management', 'lead-analytics', 'pipeline',
          // HR Management & Leave
          'attendance', 'kpi', 'leave-management',
          // Email Pages
          'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
          // Marketing Pages
          'campaigns', 'templates',
          // Survey Pages
          'feedback', 'survey-designer',
          // WhatsApp Pages
          'whatsapp-flow',
          // Automation & Tools
          'sla_monitoring', 'auto_assignment', 'tasks', 'commissions', 'workflows', 'call_scheduling', 'call_recording', 'call_quality_monitoring',
          // Training & Analysis
          'training',
          // Admin Pages
          'settings', 'billing', 'users',
          // Personal Pages
          'profile'
        ]
      },
      'admin@client.com': {
        id: '3',
        name: 'Admin User',
        email: 'admin@client.com',
        role: 'admin',
        portalLanguage: 'en', // English preference
        expiryDate: null, // Admin accounts don't expire
        status: 'active',
        permissions: [
          // Full access to all modules
          'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
          'policy-servicing', 'new-business', 'medical-management',
          // Lead Management
          'leads', 'lead-management', 'lead-analytics', 'pipeline', 'payments',
          // HR Management & Leave
          'attendance', 'kpi', 'leave-management',
          // Customer Management
          'contact-database', 'customer-database', 'inbound-service', 'service-email',
          'complaints', 'feedback', 'training-analysis',
          // Email & Marketing
          'emails', 'email-dashboard', 'email-analytics', 'bulk-email',
          'campaigns', 'templates', 'survey-designer', 'whatsapp-flow',
          'renewal-email-manager', 'renewal-whatsapp-manager',
          // Automation & Tools
          'sla_monitoring', 'auto_assignment', 'tasks', 'commissions', 'workflows', 'call_scheduling', 'call_recording', 'call_quality_monitoring',
          // Training & Analysis
          'training',
          // Admin
          'settings', 'billing', 'users', 'profile'
        ]
      }
    };

    return mockUsers[email] || {
      id: '1',
      name: 'Demo User',
      email: email,
      role: 'renewals_specialist', // Changed from 'user' to give proper access
      portalLanguage: 'en', // Default to English
      // Explicitly add permissions to ensure immediate access without refresh
      permissions: [
        'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs',
        'renewal-email-manager', 'renewal-whatsapp-manager', 'profile'
      ]
    };
  };

  useEffect(() => {
    // Check for existing session
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const token = localStorage.getItem('authToken');

        if (token) {
          // In a real app, you would decode the token to get user email/id
          // For demo, we'll use a stored email or default
          const storedEmail = localStorage.getItem('userEmail') || 'admin@client.com';
          const userData = getUserData(storedEmail);

          // Check if account is expired
          if (isAccountExpired(userData)) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            return;
          }

          setCurrentUser(userData);
          applyUserLanguage(userData);
        }
      } catch (error) {
        logger.error('Auth check failed:', error);
        // Clear any invalid tokens
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [applyUserLanguage]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      // Logic to handle different response structures
      console.log('Login API Response:', response); // Debugging log

      // Use logical OR to handle direct access (if response is just data) or nested in data property
      const responseData = response.data || response;

      const token = responseData.access || responseData.token || responseData.accessToken;
      const refreshToken = responseData.refresh || responseData.refreshToken;
      const user = responseData.user || { email };

      if (token) {
        localStorage.setItem('authToken', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('userEmail', email);

        // Use real user data from API but merge with mock permissions for now
        // This ensures permissions are available immediately after login
        const mockUserData = getUserData(email);

        // Prioritize mock permissions for demo accounts to ensure full access
        const finalPermissions = mockUserData.permissions && mockUserData.permissions.length > 0
          ? mockUserData.permissions
          : (user.permissions || []);

        const mappedUser = {
          ...user,
          ...mockUserData,
          // Ensure we keep the ID/Email from the real backend if needed, but allow mock data to augment it
          id: user.id || mockUserData.id,
          email: user.email || mockUserData.email,
          role: mockUserData.role || user.role || 'user', // Prioritize mock role for demo users
          permissions: finalPermissions
        };

        setCurrentUser(mappedUser);
        applyUserLanguage(mappedUser);

        return { success: true, user: mappedUser };
      } else {
        return { success: false, message: 'Invalid response from server' };
      }
    } catch (error) {
      logger.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';

      if (error.detail) {
        errorMessage = error.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, message: errorMessage };
    }
  };

  // Function to verify MFA OTP
  const verifyMfaOtp = async (otp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would validate the OTP with your backend
        // Here we just accept any 6-digit code as valid
        if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
          // OTP is valid, log the user in now
          const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
          localStorage.setItem('authToken', mockToken);

          // Note: userData would come from your backend in a real app
          // Here we'll get it from the stored email
          const storedEmail = localStorage.getItem('userEmail') || 'admin@client.com';
          const userData = getUserData(storedEmail);

          setCurrentUser(userData);
          applyUserLanguage(userData);
          resolve({ success: true, user: userData });
        } else {
          resolve({ success: false, message: 'Invalid OTP code. Please try again.' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLanguagePreference');
    setCurrentUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      logger.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';

      if (error.detail) {
        errorMessage = error.detail;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'object') {
        // Handle field-specific errors if returned as object (e.g. { email: ['invalid'] })
        const fieldErrors = Object.values(error).flat().join(', ');
        if (fieldErrors) errorMessage = fieldErrors;
      }

      return { success: false, message: errorMessage };
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    isAuthenticated: !!currentUser,
    verifyMfaOtp,
    isAccountExpired,
    verifyMfaOtp,
    isAccountExpired,
    getDaysUntilExpiry,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};