import React from 'react';
import { usePermissions } from '../../context/PermissionsContext';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const PermissionGuard = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  children, 
  fallback = null,
  showFallback = false 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return null; // or a loading spinner
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
  } else {
    // If no permissions specified, allow access
    hasAccess = true;
  }

  if (!hasAccess) {
    if (showFallback) {
      return fallback || (
        <Paper 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <LockIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Access Restricted
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have permission to view this content.
          </Typography>
        </Paper>
      );
    }
    return null;
  }

  return children;
};

// Higher-order component for route protection
export const withPermission = (Component, permission, permissions, requireAll = false) => {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard 
        permission={permission} 
        permissions={permissions} 
        requireAll={requireAll}
        showFallback={true}
      >
        <Component {...props} />
      </PermissionGuard>
    );
  };
};

// Hook for checking permissions in components
export const usePermissionCheck = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkPermission: (permission) => hasPermission(permission),
    checkAnyPermission: (permissions) => hasAnyPermission(permissions),
    checkAllPermissions: (permissions) => hasAllPermissions(permissions)
  };
};

export default PermissionGuard; 