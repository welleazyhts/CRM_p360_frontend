import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../context/PermissionsContext';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography } from '@mui/material';

const DashboardRedirect = () => {
  const { hasModuleAccess, loading: permissionsLoading } = usePermissions();
  const { loading: authLoading } = useAuth();

  // Show loading while auth or permissions are being loaded
  if (authLoading || permissionsLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  // Define priority order for dashboard redirection
  // Users will be redirected to the first module they have access to
  const dashboardPriority = [
    { module: 'renewals', path: '/dashboard/renewals' },
    { module: 'email', path: '/emails/dashboard' },
    { module: 'business', path: '/claims' },
    { module: 'marketing', path: '/campaigns' },
    { module: 'survey', path: '/feedback' },
    { module: 'whatsapp', path: '/whatsapp-flow' },
    { module: 'admin', path: '/settings' },
    { module: 'core', path: '/profile' }
  ];

  // Find the first module the user has access to
  for (const { module, path } of dashboardPriority) {
    if (hasModuleAccess(module)) {
      return <Navigate to={path} replace />;
    }
  }

  // Fallback to profile if no modules are accessible
  return <Navigate to="/profile" replace />;
};

export default DashboardRedirect; 