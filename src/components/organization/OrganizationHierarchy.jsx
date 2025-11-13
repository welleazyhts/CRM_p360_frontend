import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Collapse,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  SupervisorAccount as ManagerIcon,
  Groups as TeamIcon,
  Support as SupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  TrendingUp as PerformanceIcon,
  CheckCircle as ActiveIcon,
  Circle as DotIcon,
} from '@mui/icons-material';

const OrganizationHierarchy = ({ data = null }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});

  // Mock organization data
  const mockData = {
    id: 'MGR-001',
    name: 'Rajesh Kumar',
    role: 'Manager',
    email: 'rajesh.kumar@company.com',
    phone: '+91 98765 43210',
    avatar: 'RK',
    status: 'Active',
    teamSize: 24,
    performance: 92,
    children: [
      {
        id: 'TL-001',
        name: 'Priya Sharma',
        role: 'Team Leader',
        email: 'priya.sharma@company.com',
        phone: '+91 98765 43211',
        avatar: 'PS',
        status: 'Active',
        teamSize: 8,
        performance: 88,
        children: [
          {
            id: 'CSC-001',
            name: 'Amit Patel',
            role: 'CSC',
            email: 'amit.patel@company.com',
            phone: '+91 98765 43212',
            avatar: 'AP',
            status: 'Active',
            leadsAssigned: 45,
            leadsConverted: 28,
            performance: 85,
          },
          {
            id: 'CSC-002',
            name: 'Sneha Reddy',
            role: 'CSC',
            email: 'sneha.reddy@company.com',
            phone: '+91 98765 43213',
            avatar: 'SR',
            status: 'Active',
            leadsAssigned: 42,
            leadsConverted: 30,
            performance: 90,
          },
          {
            id: 'CSC-003',
            name: 'Vikram Singh',
            role: 'CSC',
            email: 'vikram.singh@company.com',
            phone: '+91 98765 43214',
            avatar: 'VS',
            status: 'On Leave',
            leadsAssigned: 38,
            leadsConverted: 22,
            performance: 78,
          },
        ],
      },
      {
        id: 'TL-002',
        name: 'Arjun Verma',
        role: 'Team Leader',
        email: 'arjun.verma@company.com',
        phone: '+91 98765 43215',
        avatar: 'AV',
        status: 'Active',
        teamSize: 6,
        performance: 85,
        children: [
          {
            id: 'CSC-004',
            name: 'Kavya Nair',
            role: 'CSC',
            email: 'kavya.nair@company.com',
            phone: '+91 98765 43216',
            avatar: 'KN',
            status: 'Active',
            leadsAssigned: 50,
            leadsConverted: 35,
            performance: 92,
          },
          {
            id: 'CSC-005',
            name: 'Rahul Gupta',
            role: 'CSC',
            email: 'rahul.gupta@company.com',
            phone: '+91 98765 43217',
            avatar: 'RG',
            status: 'Active',
            leadsAssigned: 40,
            leadsConverted: 25,
            performance: 82,
          },
        ],
      },
      {
        id: 'TL-003',
        name: 'Meera Iyer',
        role: 'Team Leader',
        email: 'meera.iyer@company.com',
        phone: '+91 98765 43218',
        avatar: 'MI',
        status: 'Active',
        teamSize: 10,
        performance: 90,
        children: [
          {
            id: 'CSC-006',
            name: 'Sanjay Kumar',
            role: 'CSC',
            email: 'sanjay.kumar@company.com',
            phone: '+91 98765 43219',
            avatar: 'SK',
            status: 'Active',
            leadsAssigned: 48,
            leadsConverted: 32,
            performance: 88,
          },
          {
            id: 'CSC-007',
            name: 'Lakshmi Menon',
            role: 'CSC',
            email: 'lakshmi.menon@company.com',
            phone: '+91 98765 43220',
            avatar: 'LM',
            status: 'Active',
            leadsAssigned: 44,
            leadsConverted: 29,
            performance: 86,
          },
        ],
      },
    ],
  };

  const organizationData = data || mockData;

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Manager':
        return <ManagerIcon />;
      case 'Team Leader':
        return <TeamIcon />;
      case 'CSC':
        return <SupportIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Manager':
        return theme.palette.error.main;
      case 'Team Leader':
        return theme.palette.warning.main;
      case 'CSC':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 85) return 'success';
    if (performance >= 70) return 'info';
    if (performance >= 60) return 'warning';
    return 'error';
  };

  const EmployeeCard = ({ employee, level = 0 }) => {
    const hasChildren = employee.children && employee.children.length > 0;
    const isExpanded = expanded[employee.id];
    const roleColor = getRoleColor(employee.role);

    return (
      <Box sx={{ ml: level * 4 }}>
        <Card
          sx={{
            mb: 2,
            borderRadius: 3,
            border: `2px solid ${alpha(roleColor, 0.3)}`,
            boxShadow: `0 4px 12px ${alpha(roleColor, 0.1)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 8px 24px ${alpha(roleColor, 0.2)}`,
              transform: 'translateX(4px)',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Avatar */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  employee.status === 'Active' ? (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'success.main',
                        border: '2px solid white',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: 'warning.main',
                        border: '2px solid white',
                      }}
                    />
                  )
                }
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: alpha(roleColor, 0.15),
                    color: roleColor,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    border: `3px solid ${roleColor}`,
                  }}
                >
                  {employee.avatar}
                </Avatar>
              </Badge>

              {/* Info */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h6" fontWeight="700">
                    {employee.name}
                  </Typography>
                  <Chip
                    icon={getRoleIcon(employee.role)}
                    label={employee.role}
                    size="small"
                    sx={{
                      bgcolor: alpha(roleColor, 0.1),
                      color: roleColor,
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: roleColor,
                      },
                    }}
                  />
                  <Chip
                    label={employee.status}
                    size="small"
                    color={employee.status === 'Active' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Box>

                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {employee.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {employee.phone}
                    </Typography>
                  </Box>
                </Stack>

                {/* Metrics */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {employee.teamSize !== undefined && (
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" fontWeight="700" color="primary">
                        {employee.teamSize}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Team Members
                      </Typography>
                    </Box>
                  )}
                  {employee.leadsAssigned !== undefined && (
                    <>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight="700" color="info.main">
                          {employee.leadsAssigned}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Leads Assigned
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          bgcolor: alpha(theme.palette.success.main, 0.05),
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight="700" color="success.main">
                          {employee.leadsConverted}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Converted
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: alpha(theme.palette[getPerformanceColor(employee.performance)].main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      color={`${getPerformanceColor(employee.performance)}.main`}
                    >
                      {employee.performance}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Performance
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Expand Button */}
              {hasChildren && (
                <IconButton
                  onClick={() => toggleExpand(employee.id)}
                  sx={{
                    bgcolor: alpha(roleColor, 0.1),
                    '&:hover': {
                      bgcolor: alpha(roleColor, 0.2),
                    },
                  }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Children */}
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ position: 'relative', pl: 2 }}>
              {/* Connecting Line */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  bgcolor: alpha(roleColor, 0.3),
                }}
              />
              {employee.children.map((child) => (
                <EmployeeCard key={child.id} employee={child} level={level + 1} />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" fontWeight="700" gutterBottom>
                Organization Hierarchy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manager → Team Leaders → Customer Service Consultants (CSC)
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<ExpandMoreIcon />}>
              Expand All
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Summary Stats */}
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight="700" color="error.main">
                1
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manager
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="700" color="warning.main">
                {organizationData.children?.length || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Team Leaders
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="700" color="info.main">
                {organizationData.children?.reduce((acc, tl) => acc + (tl.children?.length || 0), 0) || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CSCs
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Hierarchy Tree */}
      <EmployeeCard employee={organizationData} level={0} />
    </Box>
  );
};

export default OrganizationHierarchy;
