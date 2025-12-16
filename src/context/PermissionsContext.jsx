<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
=======
import React, { createContext, useContext, useMemo } from 'react';
>>>>>>> 0f0db02199acd11bdcb8309679f62aa88a7a39ee
import { useAuth } from './AuthContext';

const PermissionsContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

// Mock user permissions - in a real app, this would come from your backend
const mockUserPermissions = {
  'admin': [
    // Core Pages
    'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
    'policy-servicing', 'new-business', 'medical-management',
    // Lead Management
    'leads', 'lead-management', 'lead-analytics', 'pipeline', 'payments',
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
    // Renewal Communication Pages
    'renewal-email-manager', 'renewal-whatsapp-manager',
    // Automation & Tools
    'sla_monitoring', 'auto_assignment', 'tasks', 'commissions', 'workflows', 'call_scheduling', 'call_recording', 'call_quality_monitoring',
    // Training & Analysis
    'training',
    // Admin Pages
    'settings', 'billing', 'users',
    // Personal Pages
    'profile'
  ],
  'client_admin': [
    // Core Pages
    'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
    'policy-servicing', 'new-business', 'medical-management',
    // Lead Management
    'leads', 'lead-management', 'lead-analytics', 'pipeline', 'payments',
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
    // Renewal Communication Pages
    'renewal-email-manager', 'renewal-whatsapp-manager',
    // Automation & Tools
    'sla_monitoring', 'auto_assignment', 'tasks', 'commissions', 'workflows', 'call_scheduling', 'call_recording', 'call_quality_monitoring',
    // Training & Analysis
    'training',
    // Admin Pages
    'settings', 'billing', 'users',
    // Personal Pages
    'profile'
  ],
  'renewals_specialist': [
    // Renewals Module Only
    'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs',
    // Renewal Communication Pages
    'renewal-email-manager', 'renewal-whatsapp-manager',
    // Personal Pages
    'profile'
  ],
  'all_modules_manager': [
    // Core Pages (excluding Renewals module - no cases, closed-cases, policy-timeline, logs)
    'dashboard', 'upload', 'claims',
    'policy-servicing', 'new-business', 'medical-management',
    // Lead Management
    'leads', 'lead-management', 'lead-analytics', 'pipeline', 'payments',
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
  ],
  'manager': [
    // Core Pages
    'dashboard', 'upload', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'claims',
    // Lead Management
    'leads', 'lead-management', 'lead-analytics', 'pipeline', 'payments',
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
    // Renewal Communication Pages
    'renewal-email-manager', 'renewal-whatsapp-manager',
    // Automation & Tools
    'sla_monitoring', 'auto_assignment', 'tasks', 'commissions', 'workflows', 'call_scheduling', 'call_recording', 'call_quality_monitoring',
    // Training & Analysis
    'training',
    // Personal Pages
    'profile'
  ],
  'agent': [
    // Core Pages
    'dashboard', 'cases', 'closed-cases', 'policy-timeline', 'logs',
    // Email Pages
    'emails', 'email-dashboard',
    // WhatsApp Pages
    'whatsapp-flow',
    // Renewal Communication Pages
    'renewal-email-manager', 'renewal-whatsapp-manager',
    // Personal Pages
    'profile'
  ],
  'viewer': [
    // Core Pages (read-only)
    'dashboard', 'cases', 'closed-cases', 'policy-timeline',
    // Personal Pages
    'profile'
  ],
  'user': [
    // Default permissions for new signups
    'dashboard', 'profile' 
  ]
};

export const PermissionsProvider = ({ children }) => {
<<<<<<< HEAD
  const { currentUser, loading: authLoading } = useAuth();

  // Derive permissions directly from currentUser to avoid synchronization issues
  // This ensures permissions are available in the same render cycle as the user login
=======
  const { currentUser } = useAuth();

>>>>>>> 0f0db02199acd11bdcb8309679f62aa88a7a39ee
  const userPermissions = useMemo(() => {
    if (currentUser) {
      // Check if user has explicit permissions in their profile (from AuthContext)
      // Otherwise fall back to role-based permissions
      return currentUser.permissions || mockUserPermissions[currentUser.role] || [];
    }
    return [];
  }, [currentUser]);

<<<<<<< HEAD
  // Use auth loading state directly as permissions are now derived synchronously
  const loading = authLoading;
=======
  // Since permissions are derived synchronously from currentUser, 
  // we don't need a separate loading state.
  const loading = false;
>>>>>>> 0f0db02199acd11bdcb8309679f62aa88a7a39ee

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    if (!currentUser) return false;
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const hasAllPermissions = (permissions) => {
    if (!currentUser) return false;
    return permissions.every(permission => userPermissions.includes(permission));
  };

  const canAccessRoute = (routePath) => {
    // Map routes to required permissions
    const routePermissions = {
      '/': 'dashboard', // This will be handled by DashboardRedirect
      '/dashboard/renewals': 'dashboard',
      '/upload': 'upload',
      '/cases': 'cases',
      '/closed-cases': 'closed-cases',
      '/policy-timeline': 'policy-timeline',
      '/logs': 'logs',
      '/profile': 'profile',
      '/settings': 'settings',
      '/billing': 'billing',
      '/users': 'users',
      '/attendance': 'attendance',
      '/leave-management': 'attendance',
      '/kpi': 'kpi',
      '/emails': 'emails',
      '/emails/dashboard': 'email-dashboard',
      '/emails/analytics': 'email-analytics',
      '/emails/bulk': 'bulk-email',
      '/campaigns': 'campaigns',
      '/templates': 'templates',
      '/feedback': 'feedback',
      '/survey-designer': 'survey-designer',
      '/claims': 'claims',
      '/policy-servicing': 'policy-servicing',
      '/new-business': 'new-business',
      '/medical-management': 'medical-management',
      '/whatsapp-flow': 'whatsapp-flow',
      '/renewals/email-manager': 'renewal-email-manager',
      '/renewals/whatsapp-manager': 'renewal-whatsapp-manager',
      '/training-management': 'training'
    };

    const requiredPermission = routePermissions[routePath];
    if (!requiredPermission) return true; // Allow access to routes without specific permissions

    return hasPermission(requiredPermission);
  };

  const getAccessibleRoutes = () => {
    const allRoutes = [
      // Core Pages
      { path: '/', permission: 'dashboard', name: 'Dashboard' },
      { path: '/upload', permission: 'upload', name: 'Upload Data' },
      { path: '/cases', permission: 'cases', name: 'Case Tracking' },
      { path: '/closed-cases', permission: 'closed-cases', name: 'Closed Cases' },
      { path: '/policy-timeline', permission: 'policy-timeline', name: 'Policy Timeline' },
      { path: '/logs', permission: 'logs', name: 'Case Logs' },
      { path: '/claims', permission: 'claims', name: 'Claims Management' },
      { path: '/policy-servicing', permission: 'policy-servicing', name: 'Policy Servicing' },
      { path: '/new-business', permission: 'new-business', name: 'New Business' },
      { path: '/medical-management', permission: 'medical-management', name: 'Medical Management' },

      // Email Pages
      { path: '/emails', permission: 'emails', name: 'Email Inbox' },
      { path: '/emails/dashboard', permission: 'email-dashboard', name: 'Email Dashboard' },
      { path: '/emails/analytics', permission: 'email-analytics', name: 'Email Analytics' },
      { path: '/emails/bulk', permission: 'bulk-email', name: 'Bulk Email' },

      // Renewal Communication Pages
      { path: '/renewals/email-manager', permission: 'renewal-email-manager', name: 'Email Manager' },
      { path: '/renewals/whatsapp-manager', permission: 'renewal-whatsapp-manager', name: 'WhatsApp Manager' },

      // Marketing Pages
      { path: '/campaigns', permission: 'campaigns', name: 'Campaigns' },
      { path: '/templates', permission: 'templates', name: 'Template Manager' },

      // Survey Pages
      { path: '/feedback', permission: 'feedback', name: 'Feedback & Surveys' },
      { path: '/survey-designer', permission: 'survey-designer', name: 'Survey Designer' },

      // WhatsApp Pages
      { path: '/whatsapp-flow', permission: 'whatsapp-flow', name: 'WhatsApp Flow' },

      // Admin Pages
      { path: '/settings', permission: 'settings', name: 'Settings' },
      { path: '/billing', permission: 'billing', name: 'Billing' },
      { path: '/users', permission: 'users', name: 'User Management' },

      // Personal Pages
      { path: '/profile', permission: 'profile', name: 'Profile' }
    ];

    return allRoutes.filter(route => hasPermission(route.permission));
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin' || currentUser?.role === 'client_admin';
  };

  const isManager = () => {
    return currentUser?.role === 'manager' || currentUser?.role === 'all_modules_manager' || isAdmin();
  };

  const isRenewalsSpecialist = () => {
    return currentUser?.role === 'renewals_specialist';
  };

  const isAllModulesManager = () => {
    return currentUser?.role === 'all_modules_manager';
  };

  // Permission grouping for module-based access control
  const permissionGroups = {
    renewals: ['dashboard', 'cases', 'closed-cases', 'policy-timeline', 'logs', 'renewal-email-manager', 'renewal-whatsapp-manager'],
    email: ['emails', 'email-dashboard', 'email-analytics', 'bulk-email'],
    business: ['claims', 'policy-servicing', 'new-business', 'medical-management', 'leads', 'lead-management', 'lead-analytics', 'pipeline', 'attendance', 'kpi'],
    marketing: ['campaigns', 'templates'],
    survey: ['feedback', 'survey-designer'],
    whatsapp: ['whatsapp-flow'],
    admin: ['settings', 'billing', 'users'],
    core: ['dashboard', 'upload', 'profile']
  };

  const hasModuleAccess = (moduleName) => {
    const modulePermissions = permissionGroups[moduleName] || [];
    return hasAnyPermission(modulePermissions);
  };

  const getAccessibleModules = () => {
    return Object.keys(permissionGroups).filter(module => hasModuleAccess(module));
  };

  const value = {
    userPermissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    getAccessibleRoutes,
    isAdmin,
    isManager,
    isRenewalsSpecialist,
    isAllModulesManager,
    hasModuleAccess,
    getAccessibleModules,
    permissionGroups
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsProvider;