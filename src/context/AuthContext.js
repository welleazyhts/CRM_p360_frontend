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
      },
      'nichitham@gmail.com': {
        id: '4',
        name: 'Nichitha M',
        email: 'nichitham@gmail.com',
        role: 'admin',
        portalLanguage: 'en',
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
  }, []);

  /* ---------- Login / Register / Logout ---------- */

  const login = async (email, password) => {
    try {
      logger.info('Attempting login for:', email);

      // Call the real backend API to get a valid token
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://3.109.128.6:8000/api';

      const response = await fetch(`${apiBaseUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error('Login failed with status:', response.status, errorData);
        throw new Error(errorData.detail || errorData.message || errorData.error || 'Login failed');
      }

      const responseData = await response.json();
      logger.info('Login response received:', {
        success: responseData.success,
        message: responseData.message,
        hasData: !!responseData.data
      });

      // Handle nested response structure: { success, message, data: { access, refresh } }
      const data = responseData.data || responseData;

      // Store the real tokens from backend - handle multiple possible field names
      const accessToken = data.access || data.token || data.access_token;
      const refreshToken = data.refresh || data.refresh_token;

      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('access_token', accessToken); // Store both for compatibility
        logger.info('Access token stored successfully');
      } else {
        logger.error('No access token found in response data:', Object.keys(data));
        logger.error('Full response structure:', Object.keys(responseData));
        throw new Error('No authentication token received from server');
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('userEmail', email);

      // Get mock user data with permissions (for frontend UI)
      const mockUserData = getUserData(email);

      const mappedUser = {
        ...mockUserData,
        id: mockUserData.id || 'demo-' + Date.now(),
        email: email,
        role: mockUserData.role || 'admin',
        permissions: mockUserData.permissions || []
      };

      setCurrentUser(mappedUser);
      applyUserLanguage(mappedUser);

      logger.info('Login successful with real backend token');
      return { success: true, user: mappedUser };
    } catch (error) {
      logger.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed. Please try again.' };
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
          // NOTE: We do NOT overwrite the real authToken here
          // The real token was already set during the login() function

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
      // API integration removed as requested. Using mock registration logic.
      logger.info('Simulating registration for:', userData.email);

      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true, data: { message: 'Registration successful (mocked)' } };
    } catch (error) {
      logger.error('Registration simulation error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
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
    getDaysUntilExpiry,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};