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
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
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
  ResponsiveContainer
} from 'recharts';

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
    totalPipelineValue: 1250000
  },
  trends: [
    { month: 'Jan', leads: 120, closed: 85, value: 240000 },
    { month: 'Feb', leads: 135, closed: 92, value: 275000 },
    { month: 'Mar', leads: 150, closed: 98, value: 290000 },
    { month: 'Apr', leads: 165, closed: 105, value: 315000 },
    { month: 'May', leads: 180, closed: 112, value: 340000 },
    { month: 'Jun', leads: 195, closed: 118, value: 365000 }
  ],
  sources: [
    { name: 'Website', value: 35, count: 437, color: '#A4D7E1' },
    { name: 'Referral', value: 25, count: 312, color: '#B3EBD5' },
    { name: 'Cold Call', value: 20, count: 250, color: '#F2C94C' },
    { name: 'Email Campaign', value: 12, count: 150, color: '#6B8E23' },
    { name: 'Social Media', value: 8, count: 100, color: '#E0F7FA' }
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
    { name: 'Sarah Johnson', leads: 45, closed: 32, value: 125000, conversion: 71.1 },
    { name: 'Mike Wilson', leads: 38, closed: 25, value: 95000, conversion: 65.8 },
    { name: 'Lisa Chen', leads: 52, closed: 38, value: 145000, conversion: 73.1 },
    { name: 'David Kumar', leads: 28, closed: 18, value: 68000, conversion: 64.3 }
  ]
};

const LeadAnalytics = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('leads');
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);

  const timeRangeOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const metricOptions = [
    { value: 'leads', label: 'Lead Count' },
    { value: 'closed', label: 'Closed Deals' },
    { value: 'value', label: 'Deal Value' }
  ];

  const StatCard = ({ title, value, change, icon, color, format = 'number' }) => {
    const formatValue = (val) => {
      if (format === 'currency') {
        return `$${val.toLocaleString()}`;
      } else if (format === 'percentage') {
        return `${val}%`;
      }
      return val.toLocaleString();
    };

    return (
      <Card className="healthcare-card">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="600" color={color}>
                {formatValue(value)}
              </Typography>
              {change && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {change > 0 ? (
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                  )}
                  <Typography
                    variant="caption"
                    color={change > 0 ? 'success.main' : 'error.main'}
                  >
                    {Math.abs(change)}% vs last period
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                backgroundColor: alpha(color, 0.1),
                color: color
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[3]
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toLocaleString()}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600">
          Lead Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRangeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Metric</InputLabel>
            <Select
              value={selectedMetric}
              label="Metric"
              onChange={(e) => setSelectedMetric(e.target.value)}
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

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Leads"
            value={analyticsData.overview.totalLeads}
            change={12.5}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversion Rate"
            value={analyticsData.overview.conversionRate}
            change={5.2}
            icon={<CheckCircleIcon />}
            color={theme.palette.success.main}
            format="percentage"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Deal Value"
            value={analyticsData.overview.averageDealValue}
            change={-2.1}
            icon={<AttachMoneyIcon />}
            color={theme.palette.warning.main}
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pipeline Value"
            value={analyticsData.overview.totalPipelineValue}
            change={8.7}
            icon={<TrendingUpIcon />}
            color={theme.palette.secondary.main}
            format="currency"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Lead Trends */}
        <Grid item xs={12} lg={8}>
          <Card className="healthcare-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stackId="1"
                    stroke={theme.palette.primary.main}
                    fill={alpha(theme.palette.primary.main, 0.3)}
                    name="New Leads"
                  />
                  <Area
                    type="monotone"
                    dataKey="closed"
                    stackId="2"
                    stroke={theme.palette.success.main}
                    fill={alpha(theme.palette.success.main, 0.3)}
                    name="Closed Deals"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Sources */}
        <Grid item xs={12} lg={4}>
          <Card className="healthcare-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Sources
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.sources}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
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
            </CardContent>
          </Card>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} lg={6}>
          <Card className="healthcare-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.statusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12} lg={6}>
          <Card className="healthcare-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Team Performance
              </Typography>
              <Box sx={{ mt: 2 }}>
                {analyticsData.teamPerformance.map((member, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">{member.name}</Typography>
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
                                 theme.palette.error.main
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                      <span>{member.leads} leads</span>
                      <span>{member.closed} closed</span>
                      <span>${member.value.toLocaleString()}</span>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadAnalytics;
