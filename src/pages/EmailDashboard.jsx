import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  useTheme,
  alpha,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Feedback as FeedbackIcon,
  MonetizationOn as RefundIcon,
  Event as AppointmentIcon,
  Help as UnknownIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EmailDashboard = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    category: 'all',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic dashboard data that responds to filters
  const [dashboardData, setDashboardData] = useState({
    todayStats: {
      totalEmails: 156,
      newEmails: 23,
      inProgress: 45,
      resolved: 88,
      slaBreaches: 12
    },
    categoryBreakdown: {
      complaint: 42,
      feedback: 28,
      refund: 31,
      appointment: 18,
      uncategorized: 37
    },
    weeklyTrend: [
      { day: 'Mon', complaint: 8, feedback: 5, refund: 6, appointment: 3, uncategorized: 4, total: 26 },
      { day: 'Tue', complaint: 12, feedback: 7, refund: 4, appointment: 5, uncategorized: 6, total: 34 },
      { day: 'Wed', complaint: 15, feedback: 9, refund: 8, appointment: 4, uncategorized: 7, total: 43 },
      { day: 'Thu', complaint: 10, feedback: 6, refund: 5, appointment: 6, uncategorized: 5, total: 32 },
      { day: 'Fri', complaint: 18, feedback: 11, refund: 9, appointment: 7, uncategorized: 8, total: 53 },
      { day: 'Sat', complaint: 6, feedback: 4, refund: 3, appointment: 2, uncategorized: 3, total: 18 },
      { day: 'Sun', complaint: 4, feedback: 2, refund: 2, appointment: 1, uncategorized: 2, total: 11 }
    ],
    slaCompliance: [
      { category: 'Within SLA', value: 85, percentage: 85, color: theme.palette.success.main },
      { category: 'Breached SLA', value: 15, percentage: 15, color: theme.palette.error.main }
    ],
    agentCaseLoad: [
      { agent: 'S. Johnson', name: 'Sarah Johnson', assigned: 24, completed: 18, pending: 6, efficiency: 75 },
      { agent: 'M. Chen', name: 'Mike Chen', assigned: 19, completed: 16, pending: 3, efficiency: 84 },
      { agent: 'E. Davis', name: 'Emma Davis', assigned: 22, completed: 15, pending: 7, efficiency: 68 },
      { agent: 'A. Rodriguez', name: 'Alex Rodriguez', assigned: 18, completed: 14, pending: 4, efficiency: 78 },
      { agent: 'L. Wang', name: 'Lisa Wang', assigned: 21, completed: 17, pending: 4, efficiency: 81 }
    ]
  });

  // Generate realistic data based on filters
  const generateFilteredData = useCallback(() => {
    const baseData = {
      todayStats: {
        totalEmails: Math.floor(Math.random() * 50) + 120,
        newEmails: Math.floor(Math.random() * 15) + 15,
        inProgress: Math.floor(Math.random() * 20) + 35,
        resolved: Math.floor(Math.random() * 30) + 70,
        slaBreaches: Math.floor(Math.random() * 8) + 8
      },
      categoryBreakdown: {
        complaint: Math.floor(Math.random() * 20) + 30,
        feedback: Math.floor(Math.random() * 15) + 20,
        refund: Math.floor(Math.random() * 18) + 25,
        appointment: Math.floor(Math.random() * 12) + 15,
        uncategorized: Math.floor(Math.random() * 15) + 25
      }
    };

    // Apply category filter
    if (filters.category !== 'all') {
      const categoryMultiplier = filters.category === 'complaint' ? 1.5 : 
                                 filters.category === 'feedback' ? 1.2 : 
                                 filters.category === 'refund' ? 1.3 : 1.1;
      
      Object.keys(baseData.categoryBreakdown).forEach(key => {
        if (key === filters.category) {
          baseData.categoryBreakdown[key] = Math.floor(baseData.categoryBreakdown[key] * categoryMultiplier);
        } else {
          baseData.categoryBreakdown[key] = Math.floor(baseData.categoryBreakdown[key] * 0.7);
        }
      });
    }

    // Apply status filter
    if (filters.status !== 'all') {
      const statusMultiplier = filters.status === 'resolved' ? 1.4 : 
                              filters.status === 'inProgress' ? 1.3 : 1.2;
      
      if (filters.status === 'resolved') {
        baseData.todayStats.resolved = Math.floor(baseData.todayStats.resolved * statusMultiplier);
        baseData.todayStats.inProgress = Math.floor(baseData.todayStats.inProgress * 0.6);
      } else if (filters.status === 'inProgress') {
        baseData.todayStats.inProgress = Math.floor(baseData.todayStats.inProgress * statusMultiplier);
        baseData.todayStats.resolved = Math.floor(baseData.todayStats.resolved * 0.7);
      }
    }

    // Apply date range filter
    if (filters.dateFrom || filters.dateTo) {
      const dateMultiplier = 0.8; // Simulate filtered data being less
      Object.keys(baseData.todayStats).forEach(key => {
        baseData.todayStats[key] = Math.floor(baseData.todayStats[key] * dateMultiplier);
      });
      Object.keys(baseData.categoryBreakdown).forEach(key => {
        baseData.categoryBreakdown[key] = Math.floor(baseData.categoryBreakdown[key] * dateMultiplier);
      });
    }

    // Generate weekly trend based on current data
    const weeklyTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
      const dayMultiplier = ['Sat', 'Sun'].includes(day) ? 0.4 : 1;
      const complaint = Math.floor((baseData.categoryBreakdown.complaint / 7) * dayMultiplier * (Math.random() * 0.5 + 0.75));
      const feedback = Math.floor((baseData.categoryBreakdown.feedback / 7) * dayMultiplier * (Math.random() * 0.5 + 0.75));
      const refund = Math.floor((baseData.categoryBreakdown.refund / 7) * dayMultiplier * (Math.random() * 0.5 + 0.75));
      const appointment = Math.floor((baseData.categoryBreakdown.appointment / 7) * dayMultiplier * (Math.random() * 0.5 + 0.75));
      const uncategorized = Math.floor((baseData.categoryBreakdown.uncategorized / 7) * dayMultiplier * (Math.random() * 0.5 + 0.75));
      
      return {
        day,
        complaint,
        feedback,
        refund,
        appointment,
        uncategorized,
        total: complaint + feedback + refund + appointment + uncategorized
      };
    });

    // Generate SLA compliance based on current performance
    const slaCompliance = [
      { 
        category: 'Within SLA', 
        value: Math.floor(85 + Math.random() * 10), 
        percentage: Math.floor(85 + Math.random() * 10), 
        color: theme.palette.success.main 
      },
      { 
        category: 'Breached SLA', 
        value: Math.floor(10 + Math.random() * 10), 
        percentage: Math.floor(10 + Math.random() * 10), 
        color: theme.palette.error.main 
      }
    ];

    // Generate agent caseload with some variation
    const agentCaseLoad = [
      { agent: 'S. Johnson', name: 'Sarah Johnson' },
      { agent: 'M. Chen', name: 'Mike Chen' },
      { agent: 'E. Davis', name: 'Emma Davis' },
      { agent: 'A. Rodriguez', name: 'Alex Rodriguez' },
      { agent: 'L. Wang', name: 'Lisa Wang' }
    ].map(agent => {
      const assigned = Math.floor(Math.random() * 10) + 15;
      const completed = Math.floor(assigned * (0.6 + Math.random() * 0.3));
      const pending = assigned - completed;
      const efficiency = Math.floor((completed / assigned) * 100);
      
      return { ...agent, assigned, completed, pending, efficiency };
    });

    return {
      todayStats: baseData.todayStats,
      categoryBreakdown: baseData.categoryBreakdown,
      weeklyTrend,
      slaCompliance,
      agentCaseLoad
    };
  }, [filters, theme.palette.success.main, theme.palette.error.main]);

  // Update data when filters change
  useEffect(() => {
    const newData = generateFilteredData();
    setDashboardData(newData);
  }, [generateFilteredData]);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Auto-refresh data every 30 seconds
    const interval = setInterval(() => {
      if (!isRefreshing) {
        const newData = generateFilteredData();
        setDashboardData(newData);
        setLastUpdated(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [generateFilteredData, isRefreshing]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newData = generateFilteredData();
    setDashboardData(newData);
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      category: 'all',
      status: 'all'
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'complaint': return <WarningIcon />;
      case 'feedback': return <FeedbackIcon />;
      case 'refund': return <RefundIcon />;
      case 'appointment': return <AppointmentIcon />;
      default: return <UnknownIcon />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'complaint': return theme.palette.error.main;
      case 'feedback': return theme.palette.info.main;
      case 'refund': return theme.palette.warning.main;
      case 'appointment': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const pieChartData = Object.entries(dashboardData.categoryBreakdown).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: getCategoryColor(key)
  }));

  const COLORS = pieChartData.map(item => item.color);

  const StatCard = ({ title, value, color, icon, index, description }) => {
    // Create a gradient background similar to renewal dashboard
    const gradientFrom = alpha(color, theme.palette.mode === 'dark' ? 0.7 : 0.9);
    const gradientTo = alpha(color, theme.palette.mode === 'dark' ? 0.4 : 0.6);
    
    return (
      <Grow in={loaded} timeout={(index + 1) * 200}>
        <Card 
          sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            borderRadius: 4,
            boxShadow: `0 10px 20px ${alpha(color, 0.2)}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 15px 30px ${alpha(color, 0.3)}`
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              opacity: 0.15,
              transform: 'rotate(25deg)',
              fontSize: '8rem',
              color: 'white'
            }}
          >
            {icon}
          </Box>
          <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h6" component="div" color="white" fontWeight="500" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color="white" fontWeight="bold">
              {value}
            </Typography>
            {description && (
              <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mt: 1 }}>
                {description}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grow>
    );
  };

  const CategoryCard = ({ category, count, index }) => {
    const color = getCategoryColor(category);
    const icon = getCategoryIcon(category);
    const gradientFrom = alpha(color, theme.palette.mode === 'dark' ? 0.7 : 0.9);
    const gradientTo = alpha(color, theme.palette.mode === 'dark' ? 0.4 : 0.6);
    
    return (
      <Grow in={loaded} timeout={1200 + index * 200}>
        <Card 
          sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            borderRadius: 4,
            boxShadow: `0 10px 20px ${alpha(color, 0.2)}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 15px 30px ${alpha(color, 0.3)}`
            }
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              opacity: 0.15,
              transform: 'rotate(25deg)',
              fontSize: '6rem',
              color: 'white'
            }}
          >
            {React.cloneElement(icon, { fontSize: 'inherit' })}
          </Box>
          <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h4" component="div" color="white" fontWeight="bold">
              {count}
            </Typography>
            <Typography variant="h6" color="white" fontWeight="500" sx={{ mt: 1 }}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
          </CardContent>
        </Card>
      </Grow>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Fade in={true} timeout={800}>
        <Box sx={{ px: 1 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4
          }}>
            <Box>
              <Typography variant="h4" fontWeight="600">
                Email Management Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Last updated: {lastUpdated.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Toggle Filters">
                <IconButton 
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ 
                    bgcolor: showFilters ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  <FilterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={handleRefresh}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Filters Section */}
          {showFilters && (
            <Grow in={showFilters} timeout={400}>
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  bgcolor: alpha(theme.palette.primary.main, 0.02)
                }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <FilterIcon sx={{ mr: 1 }} />
                  Filters & Drill-down Options
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={6} md={2.5}>
                    <DatePicker
                      label="From Date"
                      value={filters.dateFrom}
                      onChange={(newValue) => handleFilterChange('dateFrom', newValue)}
                      slots={{ textField: TextField }}
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <DatePicker
                      label="To Date"
                      value={filters.dateTo}
                      onChange={(newValue) => handleFilterChange('dateTo', newValue)}
                      slots={{ textField: TextField }}
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={filters.category}
                        label="Category"
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <MenuItem value="all">All Categories</MenuItem>
                        <MenuItem value="complaint">Complaint</MenuItem>
                        <MenuItem value="feedback">Feedback</MenuItem>
                        <MenuItem value="refund">Refund</MenuItem>
                        <MenuItem value="appointment">Appointment</MenuItem>
                        <MenuItem value="uncategorized">Uncategorized</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.status}
                        label="Status"
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Button
                      variant="outlined"
                      onClick={clearFilters}
                      fullWidth
                      size="small"
                      sx={{ height: 40 }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grow>
          )}

          {/* SLA Breach Alert */}
          {dashboardData.todayStats.slaBreaches > 0 && (
            <Grow in={loaded} timeout={400}>
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                icon={<WarningIcon />}
              >
                <Typography fontWeight="600">
                  {dashboardData.todayStats.slaBreaches} emails have breached SLA requirements
                </Typography>
                <Typography variant="body2">
                  Please review and prioritize these emails immediately
                </Typography>
              </Alert>
            </Grow>
          )}

          {/* Summary Cards Row 1 - Overall Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Emails Today"
                value={dashboardData.todayStats.totalEmails}
                color={theme.palette.primary.main}
                icon={<EmailIcon fontSize="inherit" />}
                index={0}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="New Emails"
                value={dashboardData.todayStats.newEmails}
                color={theme.palette.info.main}
                icon={<TrendingUpIcon fontSize="inherit" />}
                index={1}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="In Progress"
                value={dashboardData.todayStats.inProgress}
                color={theme.palette.warning.main}
                icon={<ScheduleIcon fontSize="inherit" />}
                index={2}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="SLA Breaches"
                value={dashboardData.todayStats.slaBreaches}
                color={theme.palette.error.main}
                icon={<WarningIcon fontSize="inherit" />}
                index={3}
                description="Needs Attention"
              />
            </Grid>
          </Grid>

          {/* Category Breakdown Cards */}
          <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
            Categorized Emails by Type
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(dashboardData.categoryBreakdown).map(([category, count], index) => (
              <Grid item xs={12} sm={6} md={2.4} key={category}>
                <CategoryCard
                  category={category}
                  count={count}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
            Email Trends & Analytics
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Category Distribution - Bar Chart */}
            <Grid item xs={12} lg={6}>
              <Grow in={loaded} timeout={1800}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  height: 400
                }}>
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Daily Email Distribution by Category
                    </Typography>
                    <Box sx={{ height: 320, width: '100%' }}>
                      <ResponsiveContainer>
                        <BarChart data={dashboardData.weeklyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                          <XAxis 
                            dataKey="day" 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <YAxis 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Bar dataKey="complaint" stackId="a" fill={theme.palette.error.main} name="Complaint" />
                          <Bar dataKey="feedback" stackId="a" fill={theme.palette.info.main} name="Feedback" />
                          <Bar dataKey="refund" stackId="a" fill={theme.palette.warning.main} name="Refund" />
                          <Bar dataKey="appointment" stackId="a" fill={theme.palette.success.main} name="Appointment" />
                          <Bar dataKey="uncategorized" stackId="a" fill={theme.palette.grey[500]} name="Uncategorized" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* Total Emails Trend - Line Chart */}
            <Grid item xs={12} lg={6}>
              <Grow in={loaded} timeout={2000}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  height: 400
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Total Daily Emails Trend
                    </Typography>
                    <Box sx={{ height: 250, width: '100%' }}>
                      <ResponsiveContainer>
                        <LineChart data={dashboardData.weeklyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                          <XAxis 
                            dataKey="day" 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <YAxis 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="total" 
                            stroke={theme.palette.primary.main}
                            strokeWidth={3}
                            dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: theme.palette.primary.main, strokeWidth: 2, fill: theme.palette.background.paper }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                    
                    {/* Summary Stats */}
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Week Total:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {dashboardData.weeklyTrend.reduce((sum, day) => sum + day.total, 0)} emails
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Daily Average:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {Math.round(dashboardData.weeklyTrend.reduce((sum, day) => sum + day.total, 0) / 7)} emails
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* SLA Compliance Pie Chart */}
            <Grid item xs={12} lg={6}>
              <Grow in={loaded} timeout={2200}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  height: 400
                }}>
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssessmentIcon sx={{ mr: 1 }} />
                      SLA Compliance Overview
                    </Typography>
                    <Box sx={{ height: 280, width: '100%' }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={dashboardData.slaCompliance}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ category, percentage }) => `${category}: ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {dashboardData.slaCompliance.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value, name) => [`${value} emails`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      {dashboardData.slaCompliance.map((item, index) => (
                        <Chip 
                          key={index}
                          label={`${item.category}: ${item.percentage}%`}
                          sx={{ 
                            bgcolor: alpha(item.color, 0.1),
                            color: item.color,
                            fontWeight: 600
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* Agent-wise Case Load */}
            <Grid item xs={12} lg={6}>
              <Grow in={loaded} timeout={2400}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  height: 400
                }}>
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      Agent-wise Case Load Distribution
                    </Typography>
                    <Box sx={{ height: 280, width: '100%' }}>
                      <ResponsiveContainer>
                        <BarChart 
                          data={dashboardData.agentCaseLoad}
                          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                          <XAxis 
                            dataKey="agent" 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                            height={60}
                            interval={0}
                          />
                          <YAxis 
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                            label={{ value: 'Cases', angle: -90, position: 'insideLeft' }}
                          />
                          <RechartsTooltip 
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value, name, props) => [
                              `${value} cases`,
                              name,
                              `Agent: ${props.payload.name}`
                            ]}
                          />
                          <Bar 
                            dataKey="completed" 
                            stackId="a" 
                            fill={theme.palette.success.main} 
                            name="Completed"
                            radius={[0, 0, 0, 0]}
                          />
                          <Bar 
                            dataKey="pending" 
                            stackId="a" 
                            fill={theme.palette.warning.main} 
                            name="Pending"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <Chip 
                          label="Completed"
                          sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: theme.palette.success.main,
                            fontWeight: 600
                          }}
                        />
                        <Chip 
                          label="Pending"
                          sx={{ 
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.75rem' }}>
                        Hover over bars to see full agent names and details
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </LocalizationProvider>
  );
};

export default EmailDashboard; 
