import React, { useState, useEffect } from 'react';
import './EmailAnalytics.css';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
  Fade,
  Grow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as ResolvedIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,

  Download as DownloadIcon,
  Refresh as RefreshIcon,

  Star as StarIcon,

  Campaign as CampaignIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,

  Group as GroupIcon
} from '@mui/icons-material';

const EmailAnalytics = () => {
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [dateRange, setDateRange] = useState('7days');

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalEmails: 2847,
      totalEmailsChange: 12.5,
      resolvedEmails: 2156,
      resolvedEmailsChange: 8.3,
      avgResponseTime: '2.4 hours',
      avgResponseTimeChange: -15.2,
      customerSatisfaction: 4.6,
      customerSatisfactionChange: 3.1
    },
    volumeMetrics: {
      daily: [
        { date: '2024-07-08', received: 145, resolved: 132, pending: 13 },
        { date: '2024-07-09', received: 167, resolved: 149, pending: 18 },
        { date: '2024-07-10', received: 189, resolved: 171, pending: 18 },
        { date: '2024-07-11', received: 203, resolved: 185, pending: 18 },
        { date: '2024-07-12', received: 178, resolved: 164, pending: 14 },
        { date: '2024-07-13', received: 156, resolved: 142, pending: 14 },
        { date: '2024-07-14', received: 134, resolved: 123, pending: 11 }
      ]
    },
    categoryBreakdown: [
      { category: 'Complaint', count: 847, percentage: 29.8, avgResolutionTime: '3.2 hours', trend: 'up' },
      { category: 'Feedback', count: 623, percentage: 21.9, avgResolutionTime: '1.8 hours', trend: 'down' },
      { category: 'Refund', count: 512, percentage: 18.0, avgResolutionTime: '4.1 hours', trend: 'up' },
      { category: 'Appointment', count: 456, percentage: 16.0, avgResolutionTime: '0.9 hours', trend: 'stable' },
      { category: 'Uncategorized', count: 409, percentage: 14.4, avgResolutionTime: '2.7 hours', trend: 'down' }
    ],
    agentPerformance: [
      { 
        name: 'Priya Patel', 
        avatar: 'AJ',
        emailsHandled: 342, 
        avgResponseTime: '1.8 hours', 
        resolutionRate: 94.2,
        customerRating: 4.8,
        efficiency: 'excellent'
      },
      { 
        name: 'Bob Smith', 
        avatar: 'BS',
        emailsHandled: 298, 
        avgResponseTime: '2.1 hours', 
        resolutionRate: 91.7,
        customerRating: 4.6,
        efficiency: 'excellent'
      },
      { 
        name: 'Charlie Brown', 
        avatar: 'CB',
        emailsHandled: 276, 
        avgResponseTime: '2.4 hours', 
        resolutionRate: 89.3,
        customerRating: 4.5,
        efficiency: 'good'
      },
      { 
        name: 'Diana Wilson', 
        avatar: 'DW',
        emailsHandled: 254, 
        avgResponseTime: '2.7 hours', 
        resolutionRate: 87.1,
        customerRating: 4.3,
        efficiency: 'good'
      },
      { 
        name: 'Eric Thompson', 
        avatar: 'ET',
        emailsHandled: 231, 
        avgResponseTime: '3.1 hours', 
        resolutionRate: 84.6,
        customerRating: 4.1,
        efficiency: 'average'
      }
    ],
    slaMetrics: {
      withinSLA: 78.3,
      nearingSLA: 15.2,
      breachedSLA: 6.5,
      avgSLACompliance: 91.8
    },
    automationMetrics: {
      autoResponses: 1247,
      autoResolutionRate: 23.4,
      templatesUsed: 892,
      avgTemplateEffectiveness: 87.6
    },
    sentimentAnalysis: {
      positive: 42.3,
      neutral: 38.7,
      negative: 19.0
    },
    bulkEmailMetrics: {
      totalCampaigns: 47,
      totalCampaignsChange: 18.2,
      totalRecipients: 12847,
      totalRecipientsChange: 24.7,
      avgDeliveryRate: 96.8,
      avgDeliveryRateChange: 2.1,
      avgOpenRate: 34.2,
      avgOpenRateChange: 5.8,
      avgClickRate: 8.7,
      avgClickRateChange: 12.3,
      recentCampaigns: [
        {
          id: 1,
          name: 'Policy Renewal Reminders - Q3',
          date: '2024-07-12',
          recipients: 2847,
          delivered: 2756,
          opened: 1023,
          clicked: 287,
          deliveryRate: 96.8,
          openRate: 37.1,
          clickRate: 10.4,
          status: 'completed'
        },
        {
          id: 2,
          name: 'Welcome New Customers',
          date: '2024-07-10',
          recipients: 1456,
          delivered: 1398,
          opened: 467,
          clicked: 89,
          deliveryRate: 96.0,
          openRate: 33.4,
          clickRate: 6.4,
          status: 'completed'
        },
        {
          id: 3,
          name: 'Payment Reminder Campaign',
          date: '2024-07-08',
          recipients: 3241,
          delivered: 3127,
          opened: 978,
          clicked: 234,
          deliveryRate: 96.5,
          openRate: 31.3,
          clickRate: 7.5,
          status: 'completed'
        },
        {
          id: 4,
          name: 'Document Delivery Notifications',
          date: '2024-07-05',
          recipients: 1876,
          delivered: 1823,
          opened: 634,
          clicked: 156,
          deliveryRate: 97.2,
          openRate: 34.8,
          clickRate: 8.6,
          status: 'completed'
        },
        {
          id: 5,
          name: 'Claim Status Updates',
          date: '2024-07-03',
          recipients: 987,
          delivered: 954,
          opened: 412,
          clicked: 98,
          deliveryRate: 96.7,
          openRate: 43.2,
          clickRate: 10.3,
          status: 'completed'
        }
      ],
      templatePerformance: [
        { template: 'Policy Renewal Reminder', usage: 18, avgOpenRate: 38.4, avgClickRate: 11.2 },
        { template: 'Welcome Customer', usage: 12, avgOpenRate: 42.1, avgClickRate: 9.8 },
        { template: 'Payment Reminder', usage: 8, avgOpenRate: 29.7, avgClickRate: 6.4 },
        { template: 'Document Delivery', usage: 6, avgOpenRate: 35.9, avgClickRate: 8.7 },
        { template: 'Claim Update', usage: 3, avgOpenRate: 45.3, avgClickRate: 12.8 }
      ]
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getEfficiencyColor = (efficiency) => {
    switch (efficiency) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'average': return 'warning';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon fontSize="small" color="error" />;
      case 'down': return <TrendingDownIcon fontSize="small" color="success" />;
      default: return null;
    }
  };

  const formatChange = (change) => {
    const isPositive = change > 0;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isPositive ? (
          <TrendingUpIcon fontSize="small" color="success" />
        ) : (
          <TrendingDownIcon fontSize="small" color="error" />
        )}
        <Typography 
          variant="body2" 
          color={isPositive ? 'success.main' : 'error.main'}
          fontWeight={600}
        >
          {Math.abs(change)}%
        </Typography>
      </Box>
    );
  };

  return (
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
              Email Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Advanced insights and performance metrics for email management
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
                <MenuItem value="90days">Last 90 Days</MenuItem>
                <MenuItem value="1year">Last Year</MenuItem>
              </Select>
            </FormControl>
            <Button
              startIcon={refreshing ? <RefreshIcon className="spin" /> : <RefreshIcon />}
              variant="outlined"
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Export Report
            </Button>
          </Box>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={400}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Total Emails
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight={700} color="primary.main">
                    {analyticsData.overview.totalEmails.toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {formatChange(analyticsData.overview.totalEmailsChange)}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={600}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ResolvedIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Resolved
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight={700} color="success.main">
                    {analyticsData.overview.resolvedEmails.toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {formatChange(analyticsData.overview.resolvedEmailsChange)}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={800}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Avg Response Time
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    {analyticsData.overview.avgResponseTime}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {formatChange(analyticsData.overview.avgResponseTimeChange)}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Grow in={loaded} timeout={1000}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StarIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Satisfaction
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight={700} color="warning.main">
                    {analyticsData.overview.customerSatisfaction}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {formatChange(analyticsData.overview.customerSatisfactionChange)}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Category Breakdown */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Grow in={loaded} timeout={600}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CategoryIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Category Breakdown
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                        <TableCell align="right">Avg Resolution</TableCell>
                        <TableCell align="right">Trend</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyticsData.categoryBreakdown.map((category) => (
                        <TableRow key={category.category}>
                          <TableCell>
                            <Chip 
                              label={category.category} 
                              color="primary" 
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600}>
                              {category.count.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <LinearProgress
                                variant="determinate"
                                value={category.percentage}
                                sx={{ width: 60, mr: 1 }}
                              />
                              <Typography variant="body2">
                                {category.percentage}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {category.avgResolutionTime}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {getTrendIcon(category.trend)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grow>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grow in={loaded} timeout={800}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SpeedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    SLA Compliance
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Within SLA</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {analyticsData.slaMetrics.withinSLA}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analyticsData.slaMetrics.withinSLA} 
                    color="success"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Nearing SLA</Typography>
                    <Typography variant="body2" fontWeight={600} color="warning.main">
                      {analyticsData.slaMetrics.nearingSLA}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analyticsData.slaMetrics.nearingSLA} 
                    color="warning"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Breached SLA</Typography>
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      {analyticsData.slaMetrics.breachedSLA}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analyticsData.slaMetrics.breachedSLA} 
                    color="error"
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {analyticsData.slaMetrics.avgSLACompliance}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall SLA Compliance
                  </Typography>
                </Box>
              </Paper>
            </Grow>

            <Grow in={loaded} timeout={1000}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Automation Impact
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Auto Responses Sent
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="primary.main">
                    {analyticsData.automationMetrics.autoResponses.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Auto Resolution Rate
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="success.main">
                    {analyticsData.automationMetrics.autoResolutionRate}%
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Templates Used
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="info.main">
                    {analyticsData.automationMetrics.templatesUsed.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Template Effectiveness
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="warning.main">
                    {analyticsData.automationMetrics.avgTemplateEffectiveness}%
                  </Typography>
                </Box>
              </Paper>
            </Grow>
          </Grid>
        </Grid>

        {/* Agent Performance */}
        <Grow in={loaded} timeout={800}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Agent Performance
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Agent</TableCell>
                    <TableCell align="right">Emails Handled</TableCell>
                    <TableCell align="right">Avg Response Time</TableCell>
                    <TableCell align="right">Resolution Rate</TableCell>
                    <TableCell align="right">Customer Rating</TableCell>
                    <TableCell align="right">Efficiency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.agentPerformance.map((agent) => (
                    <TableRow key={agent.name}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                            {agent.avatar}
                          </Avatar>
                          <Typography fontWeight={600}>
                            {agent.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>
                          {agent.emailsHandled.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {agent.avgResponseTime}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <LinearProgress
                            variant="determinate"
                            value={agent.resolutionRate}
                            sx={{ width: 60, mr: 1 }}
                          />
                          <Typography variant="body2">
                            {agent.resolutionRate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <StarIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                          <Typography variant="body2" fontWeight={600}>
                            {agent.customerRating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={agent.efficiency} 
                          color={getEfficiencyColor(agent.efficiency)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grow>

        {/* Bulk Email Campaign Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Grow in={loaded} timeout={900}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CampaignIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Bulk Email Campaign Performance
                  </Typography>
                </Box>
                
                {/* Campaign Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          <CampaignIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Total Campaigns
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                          {analyticsData.bulkEmailMetrics.totalCampaigns}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {formatChange(analyticsData.bulkEmailMetrics.totalCampaignsChange)}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          <GroupIcon color="info" sx={{ mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Total Recipients
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="info.main">
                          {analyticsData.bulkEmailMetrics.totalRecipients.toLocaleString()}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {formatChange(analyticsData.bulkEmailMetrics.totalRecipientsChange)}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          <SendIcon color="success" sx={{ mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Avg Delivery Rate
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          {analyticsData.bulkEmailMetrics.avgDeliveryRate}%
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {formatChange(analyticsData.bulkEmailMetrics.avgDeliveryRateChange)}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          <VisibilityIcon color="warning" sx={{ mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Avg Open Rate
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                          {analyticsData.bulkEmailMetrics.avgOpenRate}%
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {formatChange(analyticsData.bulkEmailMetrics.avgOpenRateChange)}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Recent Campaigns Table */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Recent Campaigns
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Campaign Name</TableCell>
                          <TableCell align="right">Date</TableCell>
                          <TableCell align="right">Recipients</TableCell>
                          <TableCell align="right">Delivered</TableCell>
                          <TableCell align="right">Opened</TableCell>
                          <TableCell align="right">Clicked</TableCell>
                          <TableCell align="right">Open Rate</TableCell>
                          <TableCell align="right">Click Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {analyticsData.bulkEmailMetrics.recentCampaigns.map((campaign) => (
                          <TableRow key={campaign.id}>
                            <TableCell>
                              <Typography fontWeight={600}>
                                {campaign.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {new Date(campaign.date).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600}>
                                {campaign.recipients.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="success.main">
                                {campaign.delivered.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="info.main">
                                {campaign.opened.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="warning.main">
                                {campaign.clicked.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={campaign.openRate}
                                  sx={{ width: 60, mr: 1 }}
                                  color="info"
                                />
                                <Typography variant="body2">
                                  {campaign.openRate}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={campaign.clickRate}
                                  sx={{ width: 60, mr: 1 }}
                                  color="warning"
                                />
                                <Typography variant="body2">
                                  {campaign.clickRate}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Template Performance */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Template Performance
                  </Typography>
                  <Grid container spacing={2}>
                    {analyticsData.bulkEmailMetrics.templatePerformance.map((template, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ 
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          height: '100%'
                        }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                              {template.template}
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Usage: {template.usage} campaigns
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Avg Open Rate
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={template.avgOpenRate}
                                  sx={{ flexGrow: 1, mr: 1 }}
                                  color="info"
                                />
                                <Typography variant="body2" fontWeight={600}>
                                  {template.avgOpenRate}%
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Avg Click Rate
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={template.avgClickRate}
                                  sx={{ flexGrow: 1, mr: 1 }}
                                  color="warning"
                                />
                                <Typography variant="body2" fontWeight={600}>
                                  {template.avgClickRate}%
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Grow>
          </Grid>
        </Grid>

        {/* Sentiment Analysis */}
        <Grow in={loaded} timeout={1000}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TimelineIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Customer Sentiment Analysis
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" fontWeight={700} color="success.main">
                    {analyticsData.sentimentAnalysis.positive}%
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Positive
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={analyticsData.sentimentAnalysis.positive} 
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    {analyticsData.sentimentAnalysis.neutral}%
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Neutral
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={analyticsData.sentimentAnalysis.neutral} 
                    color="info"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h3" fontWeight={700} color="error.main">
                    {analyticsData.sentimentAnalysis.negative}%
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Negative
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={analyticsData.sentimentAnalysis.negative} 
                    color="error"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grow>
      </Box>
    </Fade>
  );
};

export default EmailAnalytics; 