import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Gavel as LegalIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const CollectionsDashboard = () => {
  // Mock dashboard data
  const dashboardStats = {
    totalAccounts: 1247,
    totalOutstanding: 28450000,
    monthlyCollection: 3200000,
    collectionRate: 68.5,
    activePTPs: 156,
    ptpAmount: 4500000,
    legalCases: 43,
    settlementsThisMonth: 27,
    avgDPD: 285,
    portfolioValue: 45000000
  };

  const recentActivity = [
    {
      id: 1,
      type: 'payment',
      debtor: 'John Smith',
      amount: 5000,
      time: '10 minutes ago',
      icon: <MoneyIcon />,
      color: 'success'
    },
    {
      id: 2,
      type: 'ptp',
      debtor: 'Emily Davis',
      amount: 3000,
      time: '25 minutes ago',
      icon: <ScheduleIcon />,
      color: 'info'
    },
    {
      id: 3,
      type: 'legal',
      debtor: 'Robert Brown',
      amount: 15600,
      time: '1 hour ago',
      icon: <LegalIcon />,
      color: 'error'
    },
    {
      id: 4,
      type: 'contact',
      debtor: 'Maria Garcia',
      amount: null,
      time: '2 hours ago',
      icon: <PhoneIcon />,
      color: 'primary'
    },
    {
      id: 5,
      type: 'settlement',
      debtor: 'David Wilson',
      amount: 12000,
      time: '3 hours ago',
      icon: <CheckCircleIcon />,
      color: 'warning'
    }
  ];

  const portfolioBreakdown = [
    { name: 'Credit Card', value: 12500000, accounts: 456, color: '#8884d8' },
    { name: 'Personal Loan', value: 8900000, accounts: 342, color: '#82ca9d' },
    { name: 'Auto Loan', value: 4200000, accounts: 189, color: '#ffc658' },
    { name: 'Medical', value: 2100000, accounts: 198, color: '#ff8042' },
    { name: 'Other', value: 750000, accounts: 62, color: '#a4de6c' }
  ];

  const collectionTrend = [
    { month: 'Jul', collected: 2800000, target: 3000000 },
    { month: 'Aug', collected: 2950000, target: 3000000 },
    { month: 'Sep', collected: 3100000, target: 3200000 },
    { month: 'Oct', collected: 3050000, target: 3200000 },
    { month: 'Nov', collected: 3200000, target: 3300000 },
    { month: 'Dec', collected: 3350000, target: 3400000 },
    { month: 'Jan', collected: 3200000, target: 3500000 }
  ];

  const agentPerformance = [
    { name: 'Sarah Johnson', collected: 850000, accounts: 145, rate: 72.3 },
    { name: 'Mike Wilson', collected: 720000, accounts: 132, rate: 68.1 },
    { name: 'John Adams', collected: 680000, accounts: 118, rate: 65.4 },
    { name: 'Lisa Martinez', collected: 590000, accounts: 98, rate: 61.2 },
    { name: 'Tom Anderson', collected: 360000, accounts: 87, rate: 58.9 }
  ];

  const upcomingPTPs = [
    { debtor: 'John Smith', account: 'ACC-10001', amount: 5000, date: '2025-01-20', dpd: 365 },
    { debtor: 'Maria Garcia', account: 'ACC-10004', amount: 1200, date: '2025-01-25', dpd: 180 },
    { debtor: 'Susan Clark', account: 'ACC-10008', amount: 1000, date: '2025-01-22', dpd: 195 }
  ];

  // Compliance and Alerts Data
  const complianceAlerts = {
    criticalAlerts: 8,
    warningAlerts: 15,
    infoAlerts: 23,
    openDisputes: 12,
    fdcpaViolations: 2,
    tcpaViolations: 1,
    ceasAndDesist: 5,
    complaintsThisMonth: 7,
    complianceScore: 87.5
  };

  const recentAlerts = [
    {
      id: 1,
      type: 'critical',
      category: 'FDCPA',
      message: 'Contact attempt after cease & desist received',
      account: 'ACC-10023',
      time: '15 mins ago',
      severity: 'critical'
    },
    {
      id: 2,
      type: 'warning',
      category: 'TCPA',
      message: 'Multiple calls to cell phone without consent',
      account: 'ACC-10045',
      time: '1 hour ago',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'critical',
      category: 'Dispute',
      message: 'New dispute filed - requires immediate review',
      account: 'ACC-10067',
      time: '2 hours ago',
      severity: 'critical'
    },
    {
      id: 4,
      type: 'warning',
      category: 'Communication',
      message: 'Contact frequency exceeds policy limits',
      account: 'ACC-10089',
      time: '3 hours ago',
      severity: 'warning'
    },
    {
      id: 5,
      type: 'info',
      category: 'Validation',
      message: 'Debt validation request received',
      account: 'ACC-10012',
      time: '4 hours ago',
      severity: 'info'
    }
  ];

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'payment':
        return `Payment of $${activity.amount.toLocaleString()} received`;
      case 'ptp':
        return `PTP created for $${activity.amount.toLocaleString()}`;
      case 'legal':
        return `Legal case filed`;
      case 'contact':
        return `Contact attempted`;
      case 'settlement':
        return `Settlement of $${activity.amount.toLocaleString()} agreed`;
      default:
        return 'Activity recorded';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Collections Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of debt collection operations and performance
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Outstanding
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    ${(dashboardStats.totalOutstanding / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dashboardStats.totalAccounts} accounts
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'background.paper', border: '2px solid', borderColor: 'error.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Monthly Collections
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    ${(dashboardStats.monthlyCollection / 1000000).toFixed(1)}M
                  </Typography>
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <TrendingUpIcon fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main" ml={0.5}>
                      +12.5% vs last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'background.paper', border: '2px solid', borderColor: 'success.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Collection Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {dashboardStats.collectionRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={dashboardStats.collectionRate}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    color="primary"
                  />
                </Box>
                <Avatar sx={{ bgcolor: 'background.paper', border: '2px solid', borderColor: 'primary.main' }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Active PTPs
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="info.main">
                    {dashboardStats.activePTPs}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ${(dashboardStats.ptpAmount / 1000000).toFixed(1)}M value
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'background.paper', border: '2px solid', borderColor: 'info.main' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} mb={4}>
        {/* Portfolio Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Breakdown by Debt Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Collection Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collection Trend (Last 7 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={collectionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                  <Legend />
                  <Line type="monotone" dataKey="collected" stroke="#82ca9d" strokeWidth={2} name="Collected" />
                  <Line type="monotone" dataKey="target" stroke="#8884d8" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Agent Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Agents (This Month)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Agent</TableCell>
                      <TableCell align="right">Collected</TableCell>
                      <TableCell align="right">Accounts</TableCell>
                      <TableCell align="right">Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agentPerformance.map((agent, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.875rem' }}>
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            {agent.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          ${(agent.collected / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell align="right">{agent.accounts}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${agent.rate}%`}
                            size="small"
                            color={agent.rate > 70 ? 'success' : agent.rate > 60 ? 'warning' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity & Upcoming PTPs */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {/* Recent Activity */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <List dense>
                    {recentActivity.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: `${activity.color}.light` }}>
                              {activity.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.debtor}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  {getActivityText(activity)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {activity.time}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Upcoming PTPs */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming PTPs (Next 7 Days)
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Debtor</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Due Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {upcomingPTPs.map((ptp, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {ptp.debtor}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {ptp.account}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              ${ptp.amount.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {ptp.date}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Compliance and Alerts Snapshot */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <SecurityIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Compliance & Alerts Snapshot
                  </Typography>
                </Box>
                <Chip
                  label={`Compliance Score: ${complianceAlerts.complianceScore}%`}
                  color={complianceAlerts.complianceScore >= 90 ? 'success' : complianceAlerts.complianceScore >= 75 ? 'warning' : 'error'}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              <Grid container spacing={3}>
                {/* Alert Metrics */}
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Alert Summary
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={4}>
                        <Box textAlign="center" p={2} sx={{ bgcolor: 'error.light', borderRadius: 2 }}>
                          <ErrorIcon sx={{ color: 'error.dark', fontSize: 32, mb: 1 }} />
                          <Typography variant="h6" fontWeight="bold" color="error.dark">
                            {complianceAlerts.criticalAlerts}
                          </Typography>
                          <Typography variant="caption" color="error.dark">
                            Critical
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center" p={2} sx={{ bgcolor: 'warning.light', borderRadius: 2 }}>
                          <WarningIcon sx={{ color: 'warning.dark', fontSize: 32, mb: 1 }} />
                          <Typography variant="h6" fontWeight="bold" color="warning.dark">
                            {complianceAlerts.warningAlerts}
                          </Typography>
                          <Typography variant="caption" color="warning.dark">
                            Warning
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center" p={2} sx={{ bgcolor: 'info.light', borderRadius: 2 }}>
                          <InfoIcon sx={{ color: 'info.dark', fontSize: 32, mb: 1 }} />
                          <Typography variant="h6" fontWeight="bold" color="info.dark">
                            {complianceAlerts.infoAlerts}
                          </Typography>
                          <Typography variant="caption" color="info.dark">
                            Info
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Compliance Metrics */}
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Compliance Issues
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={6}>
                        <Box p={2} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Open Disputes
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="error.main">
                            {complianceAlerts.openDisputes}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box p={2} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            FDCPA Issues
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="error.main">
                            {complianceAlerts.fdcpaViolations}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box p={2} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            TCPA Issues
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="warning.main">
                            {complianceAlerts.tcpaViolations}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box p={2} sx={{ bgcolor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Cease & Desist
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="error.main">
                            {complianceAlerts.ceasAndDesist}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Recent Alerts */}
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Recent Alerts
                    </Typography>
                    <List dense sx={{ mt: 1, maxHeight: 280, overflow: 'auto' }}>
                      {recentAlerts.map((alert, index) => (
                        <React.Fragment key={alert.id}>
                          <ListItem
                            sx={{
                              bgcolor: 'background.default',
                              borderRadius: 1,
                              mb: 1,
                              border: 1,
                              borderColor:
                                alert.severity === 'critical' ? 'error.main' :
                                alert.severity === 'warning' ? 'warning.main' : 'info.main'
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  bgcolor:
                                    alert.severity === 'critical' ? 'error.main' :
                                    alert.severity === 'warning' ? 'warning.main' : 'info.main',
                                  width: 32,
                                  height: 32
                                }}
                              >
                                {alert.severity === 'critical' ? <ErrorIcon fontSize="small" /> :
                                 alert.severity === 'warning' ? <WarningIcon fontSize="small" /> :
                                 <InfoIcon fontSize="small" />}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Chip
                                    label={alert.category}
                                    size="small"
                                    color={
                                      alert.severity === 'critical' ? 'error' :
                                      alert.severity === 'warning' ? 'warning' : 'info'
                                    }
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {alert.time}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Box mt={0.5}>
                                  <Typography variant="body2">
                                    {alert.message}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Account: {alert.account}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Last updated: Just now
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SecurityIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  View All Compliance Issues
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollectionsDashboard;
