import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  useTheme,
  alpha,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Divider,
  Stack,
  Paper,
  IconButton,
  Tooltip as MuiTooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  InsertChart as InsertChartIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useTranslation } from 'react-i18next';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalLeads: 1250,
    newLeads: 180,
    qualifiedLeads: 320,
    closedWon: 95,
    closedLost: 45,
    conversionRate: 67.9,
    averageDealValue: 28500,
    totalPipelineValue: 1250000,
    responseTime: 2.3, // hours
    followUpRate: 89.5
  },
  trends: [
    { month: 'Jan', leads: 120, closed: 85, value: 240000, qualified: 75 },
    { month: 'Feb', leads: 135, closed: 92, value: 275000, qualified: 88 },
    { month: 'Mar', leads: 150, closed: 98, value: 290000, qualified: 95 },
    { month: 'Apr', leads: 165, closed: 105, value: 315000, qualified: 110 },
    { month: 'May', leads: 180, closed: 112, value: 340000, qualified: 125 },
    { month: 'Jun', leads: 195, closed: 118, value: 365000, qualified: 138 }
  ],
  sources: [
    { name: 'Website', value: 35, count: 437, color: '#2196F3' },
    { name: 'Referral', value: 25, count: 312, color: '#4CAF50' },
    { name: 'Cold Call', value: 20, count: 250, color: '#FF9800' },
    { name: 'Email Campaign', value: 12, count: 150, color: '#9C27B0' },
    { name: 'Social Media', value: 8, count: 100, color: '#00BCD4' }
  ],
  statusDistribution: [
    { name: 'New', value: 180, color: '#2196F3' },
    { name: 'Contacted', value: 150, color: '#FF9800' },
    { name: 'Qualified', value: 320, color: '#4CAF50' },
    { name: 'Proposal', value: 95, color: '#9C27B0' },
    { name: 'Negotiation', value: 60, color: '#FF5722' },
    { name: 'Closed Won', value: 95, color: '#4CAF50' },
    { name: 'Closed Lost', value: 45, color: '#F44336' }
  ],
  teamPerformance: [
    { name: 'Sarah Johnson', leads: 45, closed: 32, value: 125000, conversion: 71.1, avatar: 'SJ' },
    { name: 'Mike Wilson', leads: 38, closed: 25, value: 95000, conversion: 65.8, avatar: 'MW' },
    { name: 'Lisa Chen', leads: 52, closed: 38, value: 145000, conversion: 73.1, avatar: 'LC' },
    { name: 'David Kumar', leads: 28, closed: 18, value: 68000, conversion: 64.3, avatar: 'DK' }
  ],
  channelPerformance: [
    { channel: 'Phone', success: 85, efficiency: 72 },
    { channel: 'Email', success: 65, efficiency: 58 },
    { channel: 'WhatsApp', success: 78, efficiency: 82 },
    { channel: 'Meeting', success: 92, efficiency: 68 }
  ],
  recentActivities: [
    { type: 'lead', message: 'New lead from Website: John Doe', time: '5 min ago', icon: 'person' },
    { type: 'deal', message: 'Deal closed: $45,000 - Acme Corp', time: '1 hour ago', icon: 'money' },
    { type: 'follow', message: 'Follow-up scheduled with 12 leads', time: '2 hours ago', icon: 'schedule' },
    { type: 'milestone', message: 'Team hit $1M pipeline value!', time: '3 hours ago', icon: 'star' }
  ],
  topLeads: [
    { name: 'Acme Corporation', value: 85000, probability: 85, owner: 'Sarah Johnson' },
    { name: 'TechStart Inc', value: 62000, probability: 70, owner: 'Mike Wilson' },
    { name: 'Global Solutions', value: 45000, probability: 90, owner: 'Lisa Chen' }
  ]
};

const LeadAnalytics = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('leads');
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [customDateDialog, setCustomDateDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [displayDateRange, setDisplayDateRange] = useState(t('leads.analytics.timeRangeOptions.last6Months'));

  const timeRangeOptions = [
    { value: '1month', label: t('leads.analytics.timeRangeOptions.lastMonth') },
    { value: '3months', label: t('leads.analytics.timeRangeOptions.last3Months') },
    { value: '6months', label: t('leads.analytics.timeRangeOptions.last6Months') },
    { value: '1year', label: t('leads.analytics.timeRangeOptions.lastYear') },
    { value: 'custom', label: t('leads.analytics.timeRangeOptions.customDateRange') }
  ];

  const metricOptions = [
    { value: 'leads', label: t('leads.analytics.metricOptions.leadCount') },
    { value: 'closed', label: t('leads.analytics.metricOptions.closedDeals') },
    { value: 'value', label: t('leads.analytics.metricOptions.dealValue') }
  ];

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In real app, fetch new data
  };

  const handleTimeRangeChange = (value) => {
    if (value === 'custom') {
      setCustomDateDialog(true);
    } else {
      setTimeRange(value);
      const option = timeRangeOptions.find(opt => opt.value === value);
      setDisplayDateRange(option?.label || value);
    }
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setTimeRange('custom');
      const start = new Date(customStartDate).toLocaleDateString();
      const end = new Date(customEndDate).toLocaleDateString();
      setDisplayDateRange(`${start} - ${end}`);
      setCustomDateDialog(false);
      // In real app, fetch data for custom date range
    }
  };

  const handleCustomDateCancel = () => {
    setCustomDateDialog(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const EnhancedStatCard = ({ title, value, change, icon, color, format = 'number', subtitle, sparklineData }) => {
    const formatValue = (val) => {
      if (format === 'currency') {
        return `₹${val.toLocaleString()}`;
      } else if (format === 'percentage') {
        return `${val}%`;
      } else if (format === 'time') {
        return `${val}h`;
      }
      return val.toLocaleString();
    };

    return (
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 24px ${alpha(color, 0.15)}`
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, transparent 100%)`,
            borderRadius: '0 0 0 100%'
          }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="700" color={color}>
                {formatValue(value)}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(color, 0.1),
                color: color
              }}
            >
              {icon}
            </Box>
          </Box>

          {change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${Math.abs(change)}%`}
                size="small"
                sx={{
                  backgroundColor: alpha(change > 0 ? theme.palette.success.main : theme.palette.error.main, 0.1),
                  color: change > 0 ? theme.palette.success.main : theme.palette.error.main,
                  fontWeight: 600
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {t('leads.analytics.vsLastPeriod')}
              </Typography>
            </Box>
          )}

          {sparklineData && (
            <Box sx={{ mt: 2, height: 40 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="subtitle2" gutterBottom fontWeight="600">
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: entry.color }} />
              <Typography variant="body2">
                {entry.name}: <strong>{entry.value.toLocaleString()}</strong>
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.icon) {
        case 'person': return <PersonAddIcon sx={{ color: theme.palette.primary.main }} />;
        case 'money': return <AttachMoneyIcon sx={{ color: theme.palette.success.main }} />;
        case 'schedule': return <ScheduleIcon sx={{ color: theme.palette.warning.main }} />;
        case 'star': return <StarIcon sx={{ color: theme.palette.secondary.main }} />;
        default: return <NotificationsIcon />;
      }
    };

    return (
      <Box sx={{ display: 'flex', gap: 2, p: 2, '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
        <Avatar sx={{ width: 40, height: 40, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
          {getIcon()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2">{activity.message}</Typography>
          <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
        </Box>
      </Box>
    );
  };

  const sparklineData = analyticsData.trends.map(t => ({ value: t.leads }));

  const handleExportReport = () => {
    // Helper to escape CSV fields
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '';
      const stringValue = String(str);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // 1. Prepare Data
    const rows = [];

    // --- Overview Section ---
    rows.push(['LEAD ANALYTICS REPORT']);
    rows.push([`Generated on: ${new Date().toLocaleString()}`]);
    rows.push([`Time Range: ${displayDateRange}`]);
    rows.push([]); // Empty line

    rows.push(['OVERVIEW METRICS']);
    rows.push(['Metric', 'Value', 'Change vs Last Period']);
    rows.push(['Total Leads', analyticsData.overview.totalLeads, '12.5%']);
    rows.push(['New Leads', analyticsData.overview.newLeads, '-']);
    rows.push(['Qualified Leads', analyticsData.overview.qualifiedLeads, '-']);
    rows.push(['Closed Won', analyticsData.overview.closedWon, '-']);
    rows.push(['Closed Lost', analyticsData.overview.closedLost, '-']);
    rows.push(['Conversion Rate', `${analyticsData.overview.conversionRate}%`, '5.2%']);
    rows.push(['Avg Deal Value', `₹${analyticsData.overview.averageDealValue}`, '-2.1%']);
    rows.push(['Total Pipeline Value', `₹${analyticsData.overview.totalPipelineValue}`, '8.7%']);
    rows.push(['Avg Response Time', `${analyticsData.overview.responseTime} hours`, '-']);
    rows.push(['Follow-up Rate', `${analyticsData.overview.followUpRate}%`, '-']);
    rows.push([]);

    // --- Monthly Trends ---
    rows.push(['MONTHLY TRENDS']);
    rows.push(['Month', 'New Leads', 'Qualified Leads', 'Closed Deals', 'Deal Value']);
    analyticsData.trends.forEach(item => {
      rows.push([
        item.month,
        item.leads,
        item.qualified,
        item.closed,
        item.value
      ]);
    });
    rows.push([]);

    // --- Sources ---
    rows.push(['LEAD SOURCES']);
    rows.push(['Source', 'Count', 'Percentage']);
    analyticsData.sources.forEach(item => {
      rows.push([
        item.name,
        item.count,
        `${item.value}%`
      ]);
    });
    rows.push([]);

    // --- Team Performance ---
    rows.push(['TEAM PERFORMANCE']);
    rows.push(['Name', 'Leads Assigned', 'Closed Deals', 'Conversion Rate', 'Revenue Generated']);
    analyticsData.teamPerformance.forEach(item => {
      rows.push([
        item.name,
        item.leads,
        item.closed,
        `${item.conversion}%`,
        item.value
      ]);
    });

    // 2. Convert to CSV String
    const csvContent = rows
      .map(e => e.map(escapeCsv).join(','))
      .join('\n');

    // 3. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Lead_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.02), minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              {t('leads.analytics.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('leads.analytics.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiTooltip title={t('leads.analytics.refreshData')}>
              <IconButton onClick={handleRefresh} sx={{ backgroundColor: 'background.paper' }}>
                <RefreshIcon />
              </IconButton>
            </MuiTooltip>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              sx={{ borderRadius: 2 }}
              onClick={handleExportReport}
            >
              {t('leads.analytics.exportReport')}
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>{t('leads.analytics.timeRange')}</InputLabel>
            <Select
              value={timeRange}
              label={t('leads.analytics.timeRange')}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
            >
              {timeRangeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {timeRange === 'custom' && (
            <Chip
              label={displayDateRange}
              onClick={() => {
                setTimeRange('6months');
                setDisplayDateRange(t('leads.analytics.timeRangeOptions.last6Months'));
              }}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600
              }}
            />
          )}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>{t('leads.analytics.metric')}</InputLabel>
            <Select
              value={selectedMetric}
              label={t('leads.analytics.metric')}
              onChange={(e) => setSelectedMetric(e.target.value)}
              sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
            >
              {metricOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Custom Date Range Dialog */}
      <Dialog
        open={customDateDialog}
        onClose={handleCustomDateCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            {t('leads.analytics.customDateDialog.title')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: customStartDate
              }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCustomDateCancel}>
            {t('leads.analytics.customDateDialog.cancel')}
          </Button>
          <Button
            onClick={handleCustomDateApply}
            variant="contained"
            disabled={!customStartDate || !customEndDate}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
            }}
          >
            {t('leads.analytics.customDateDialog.apply')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title={t('leads.analytics.kpis.totalLeads')}
            value={analyticsData.overview.totalLeads}
            change={12.5}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
            subtitle={`${analyticsData.overview.newLeads} ${t('leads.analytics.kpis.newThisMonth')}`}
            sparklineData={sparklineData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title={t('leads.analytics.kpis.conversionRate')}
            value={analyticsData.overview.conversionRate}
            change={5.2}
            icon={<CheckCircleIcon />}
            color={theme.palette.success.main}
            format="percentage"
            subtitle={t('leads.analytics.kpis.qualifiedToClosed')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title={t('leads.analytics.kpis.avgDealValue')}
            value={analyticsData.overview.averageDealValue}
            change={-2.1}
            icon={<AttachMoneyIcon />}
            color={theme.palette.warning.main}
            format="currency"
            subtitle={t('leads.analytics.kpis.perClosedDeal')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <EnhancedStatCard
            title={t('leads.analytics.kpis.pipelineValue')}
            value={analyticsData.overview.totalPipelineValue}
            change={8.7}
            icon={<TrendingUpIcon />}
            color={theme.palette.secondary.main}
            format="currency"
            subtitle={t('leads.analytics.kpis.totalActivePipeline')}
          />
        </Grid>
      </Grid>

      {/* Secondary KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.analytics.kpis.avgResponseTime')}</Typography>
              <Typography variant="h5" fontWeight="600">{analyticsData.overview.responseTime}h</Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.analytics.kpis.followUpRate')}</Typography>
              <Typography variant="h5" fontWeight="600">{analyticsData.overview.followUpRate}%</Typography>
              <LinearProgress
                variant="determinate"
                value={analyticsData.overview.followUpRate}
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.analytics.kpis.closedWon')}</Typography>
              <Typography variant="h5" fontWeight="600" color="success.main">{analyticsData.overview.closedWon}</Typography>
              <Typography variant="caption" color="text.secondary">{t('leads.analytics.kpis.thisPeriod')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">{t('leads.analytics.kpis.qualifiedLeads')}</Typography>
              <Typography variant="h5" fontWeight="600" color="primary.main">{analyticsData.overview.qualifiedLeads}</Typography>
              <Typography variant="caption" color="text.secondary">{t('leads.analytics.kpis.readyToConvert')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Lead Trends - Enhanced */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">
                  {t('leads.analytics.charts.leadPerformanceTrends')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={t('leads.analytics.charts.leads')} size="small" sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }} />
                  <Chip label={t('leads.analytics.charts.closed')} size="small" sx={{ backgroundColor: alpha(theme.palette.success.main, 0.1) }} />
                  <Chip label={t('leads.analytics.charts.qualified')} size="small" sx={{ backgroundColor: alpha(theme.palette.warning.main, 0.1) }} />
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analyticsData.trends}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.warning.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                    name="New Leads"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="qualified"
                    stroke={theme.palette.warning.main}
                    fillOpacity={1}
                    fill="url(#colorQualified)"
                    name="Qualified"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="closed"
                    stroke={theme.palette.success.main}
                    fillOpacity={1}
                    fill="url(#colorClosed)"
                    name="Closed Deals"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Sources - Enhanced */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('leads.analytics.charts.leadSourcesDistribution')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.sources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {analyticsData.sources.map((source, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: source.color }} />
                      <Typography variant="body2">{source.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="600">{source.count}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Second Row Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Status Distribution */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('leads.analytics.charts.leadStatusPipeline')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.statusDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {analyticsData.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Channel Performance */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('leads.analytics.charts.channelPerformance')}
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={analyticsData.channelPerformance}>
                  <PolarGrid stroke={alpha(theme.palette.divider, 0.3)} />
                  <PolarAngleAxis dataKey="channel" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name={t('leads.analytics.charts.successRate')} dataKey="success" stroke={theme.palette.primary.main} fill={theme.palette.primary.main} fillOpacity={0.3} />
                  <Radar name={t('leads.analytics.charts.efficiency')} dataKey="efficiency" stroke={theme.palette.success.main} fill={theme.palette.success.main} fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Team Performance */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('leads.analytics.charts.topPerformers')}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {analyticsData.teamPerformance.map((member, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          color: theme.palette.primary.main,
                          fontWeight: 600
                        }}>
                          {member.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">{member.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.leads} {t('leads.analytics.charts.leadsLowercase')} • {member.closed} {t('leads.analytics.charts.closedLowercase')}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={`${member.conversion}%`}
                        size="small"
                        sx={{
                          backgroundColor: alpha(
                            member.conversion > 70 ? theme.palette.success.main :
                              member.conversion > 60 ? theme.palette.warning.main :
                                theme.palette.error.main, 0.1
                          ),
                          color: member.conversion > 70 ? theme.palette.success.main :
                            member.conversion > 60 ? theme.palette.warning.main :
                              theme.palette.error.main,
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={member.conversion}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                          }}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight="600">
                        ₹{member.value.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities & Hot Leads */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={3}>
            {/* Recent Activities */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      {t('leads.analytics.charts.recentActivities')}
                    </Typography>
                    <Badge badgeContent={4} color="primary">
                      <NotificationsIcon />
                    </Badge>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box>
                    {analyticsData.recentActivities.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Hot Leads */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {t('leads.analytics.charts.hotLeads')} 🔥
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {analyticsData.topLeads.map((lead, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.warning.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">{lead.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{lead.owner}</Typography>
                          </Box>
                          <Chip
                            label={`${lead.probability}%`}
                            size="small"
                            color="warning"
                          />
                        </Box>
                        <Typography variant="h6" color="success.main" fontWeight="600">
                          ₹{lead.value.toLocaleString()}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={lead.probability}
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                          color="warning"
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadAnalytics;
