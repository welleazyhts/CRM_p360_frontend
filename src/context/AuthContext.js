import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import logger from '../utils/logger';
import { loginUser, registerUser } from '../services/api';

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

  /* ---------- Login / Register / Logout ---------- */

  const login = async (email, password) => {
    try {
      logger.info('Attempting login for:', email);
      setLoading(true);

      // Call API to login
      const response = await loginUser({ email, password });
      const data = response.data;

      // Handle Django SimpleJWT response structure (access, refresh)
      // or generic token response
      const accessToken = data.access || data.token || data.access_token || data.accessToken || data.key || (data.data && (data.data.access || data.data.token || data.data.access_token || data.data.accessToken || data.data.key));
      const refreshToken = data.refresh || data.refresh_token || data.refreshToken || (data.data && (data.data.refresh || data.data.refresh_token || data.data.refreshToken));

      if (!accessToken) {
        logger.error('Login response payload:', data);
        throw new Error(`Login succeeded but no access token received. Response keys: ${Object.keys(data).join(', ')}`);
      }

      localStorage.setItem('authToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', email);

      // Decode token to get user details if possible (payload usually has user_id)
      let tokenPayload = {};
      try {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        tokenPayload = JSON.parse(jsonPayload);
      } catch (e) {
        // Token might not be a JWT or decode failed
      }

      // Construct user object
      // Use data.user if backend returns it, otherwise construct from token/email
      // Fallback permissions logic:
      // If valid login, grant access. Ideally backend should send roles/permissions.
      // We will merge with existing mock permissions structure if email matches, 
      // primarily to preserve the demo experience where specific emails had specific views.
      // But authentication is now REAL.

      const mockPerms = getUserData(email); // We still use this ONLY for mapping permissions to emails for the demo UI

      const mappedUser = {
        id: data.user?.id || tokenPayload.user_id || 'user-' + Date.now(),
        email: email,
        name: data.user?.first_name ? `${data.user.first_name} ${data.user.last_name || ''}` : (mockPerms?.name || email.split('@')[0]),
        role: data.user?.role || mockPerms?.role || 'user',
        portalLanguage: data.user?.portalLanguage || mockPerms?.portalLanguage || 'en',
        permissions: data.user?.permissions || mockPerms?.permissions || ['dashboard', 'profile'] // Default fallback
      };

      setCurrentUser(mappedUser);
      applyUserLanguage(mappedUser);

      logger.info('Login successful');
      return { success: true, user: mappedUser };
    } catch (error) {
      logger.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed. Please check your credentials.' };
    } finally {
      setLoading(false);
    }
  };


  // Function to verify MFA OTP
  const verifyMfaOtp = async (otp) => {
    // Current backend does not appear to have MFA endpoint. Keeping mock implementation for UI flow.
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
          const storedEmail = localStorage.getItem('userEmail');
          // Re-affirm current user state
          if (!currentUser && storedEmail) {
            // If page refreshed during MFA, try to restore
            const userData = getUserData(storedEmail);
            setCurrentUser(userData);
            applyUserLanguage(userData);
            resolve({ success: true, user: userData });
          } else {
            resolve({ success: true, user: currentUser });
          }
        } else {
          resolve({ success: false, message: 'Invalid OTP code. Please try again.' });
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLanguagePreference');
    setCurrentUser(null);
  };

  const register = async (userData) => {
    try {
      logger.info('Attempting registration for:', userData.email);
      setLoading(true);

      await registerUser(userData);

      return { success: true, data: { message: 'Registration successful. Please login.' } };
    } catch (error) {
      logger.error('Registration error:', error);
      // Format error message from backend
      let msg = 'Registration failed.';
      if (error.response?.data) {
        const errors = error.response.data;
        // transform object errors to string
        msg = Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join(', ');
      }
      return { success: false, message: msg || error.message };
    } finally {
      setLoading(false);
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