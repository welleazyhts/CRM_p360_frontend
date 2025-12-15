import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  LinearProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const CollectionAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock analytics data
  const kpiData = {
    totalPortfolioValue: 5250000.00,
    totalAccounts: 1250,
    monthlyRecovery: 425000.00,
    recoveryRate: 35.5,
    avgDaysToCollect: 42,
    activePTPs: 156,
    ptpHonorRate: 68.5,
    legalCases: 45,
    settlementRate: 22.3,
    avgSettlementDiscount: 35
  };

  const trends = {
    recoveryTrend: 12.5, // percentage increase
    accountsTrend: -3.2,
    ptpTrend: 8.7,
    settlementTrend: 5.4
  };

  // Monthly recovery data
  const monthlyRecoveryData = [
    { month: 'Jul', recovered: 380000, target: 400000 },
    { month: 'Aug', recovered: 395000, target: 400000 },
    { month: 'Sep', recovered: 410000, target: 420000 },
    { month: 'Oct', recovered: 425000, target: 420000 },
    { month: 'Nov', recovered: 450000, target: 440000 },
    { month: 'Dec', recovered: 465000, target: 450000 },
    { month: 'Jan', recovered: 425000, target: 460000 }
  ];

  // Aging analysis data
  const agingData = [
    { bucket: '0-30 Days', accounts: 150, amount: 450000, percentage: 8.6 },
    { bucket: '31-60 Days', accounts: 180, amount: 620000, percentage: 11.8 },
    { bucket: '61-90 Days', accounts: 220, amount: 820000, percentage: 15.6 },
    { bucket: '91-180 Days', accounts: 280, amount: 1150000, percentage: 21.9 },
    { bucket: '181-360 Days', accounts: 250, amount: 1280000, percentage: 24.4 },
    { bucket: '360+ Days', accounts: 170, amount: 930000, percentage: 17.7 }
  ];

  // Portfolio distribution
  const portfolioData = [
    { name: 'Credit Cards', value: 42, amount: 2205000 },
    { name: 'Personal Loans', value: 28, amount: 1470000 },
    { name: 'Auto Loans', value: 18, amount: 945000 },
    { name: 'Medical', value: 12, amount: 630000 }
  ];

  const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336'];

  // Agent performance data
  const agentPerformance = [
    {
      name: 'Sarah Johnson',
      accountsAssigned: 180,
      recovered: 125000,
      recoveryRate: 42.5,
      ptpHonorRate: 75.2,
      contactRate: 88.5
    },
    {
      name: 'Mike Wilson',
      accountsAssigned: 165,
      recovered: 98000,
      recoveryRate: 38.2,
      ptpHonorRate: 68.5,
      contactRate: 82.0
    },
    {
      name: 'John Adams',
      accountsAssigned: 145,
      recovered: 89000,
      recoveryRate: 35.8,
      ptpHonorRate: 72.0,
      contactRate: 85.5
    },
    {
      name: 'Emily Chen',
      accountsAssigned: 160,
      recovered: 113000,
      recoveryRate: 40.5,
      ptpHonorRate: 70.5,
      contactRate: 86.0
    }
  ];

  // Settlement analysis
  const settlementData = [
    { range: '0-20%', count: 45, amount: 180000 },
    { range: '21-40%', count: 89, amount: 425000 },
    { range: '41-60%', count: 52, amount: 280000 },
    { range: '61-80%', count: 18, amount: 95000 },
    { range: '81-100%', count: 5, amount: 22000 }
  ];

  // PTP conversion funnel
  const ptpFunnelData = [
    { stage: 'Total PTPs', count: 250, percentage: 100 },
    { stage: 'Due This Month', count: 156, percentage: 62.4 },
    { stage: 'Honored', count: 107, percentage: 68.6 },
    { stage: 'Partially Paid', count: 28, percentage: 17.9 },
    { stage: 'Broken', count: 21, percentage: 13.5 }
  ];

  const getTrendIcon = (trend) => {
    return trend >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  const getTrendColor = (trend) => {
    return trend >= 0 ? 'success.main' : 'error.main';
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Collection Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights into collection performance and recovery metrics
          </Typography>
        </Box>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>

          {/* Custom Date Range Pickers */}
          {timeRange === 'custom' && (
            <>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
                size="small"
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
                size="small"
                inputProps={{ min: startDate }}
              />
            </>
          )}

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Portfolio</InputLabel>
            <Select
              value={portfolioFilter}
              label="Portfolio"
              onChange={(e) => setPortfolioFilter(e.target.value)}
            >
              <MenuItem value="all">All Portfolios</MenuItem>
              <MenuItem value="credit_card">Credit Cards</MenuItem>
              <MenuItem value="personal_loan">Personal Loans</MenuItem>
              <MenuItem value="auto_loan">Auto Loans</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<ExportIcon />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Portfolio Value
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${(kpiData.totalPortfolioValue / 1000000).toFixed(2)}M
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {kpiData.totalAccounts.toLocaleString()} active accounts
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
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
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Monthly Recovery
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="success.main">
                    ${(kpiData.monthlyRecovery / 1000).toFixed(0)}K
                  </Typography>
                  <Box display="flex" alignItems="center" mt={0.5}>
                    {getTrendIcon(trends.recoveryTrend)}
                    <Typography variant="caption" color={getTrendColor(trends.recoveryTrend)} ml={0.5}>
                      {Math.abs(trends.recoveryTrend)}% vs last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
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
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Recovery Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {kpiData.recoveryRate}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg. {kpiData.avgDaysToCollect} days to collect
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <AssessmentIcon />
                </Avatar>
              </Box>
              <LinearProgress
                variant="determinate"
                value={kpiData.recoveryRate}
                sx={{ mt: 2 }}
                color="info"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    PTP Honor Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {kpiData.ptpHonorRate}%
                  </Typography>
                  <Box display="flex" alignItems="center" mt={0.5}>
                    {getTrendIcon(trends.ptpTrend)}
                    <Typography variant="caption" color={getTrendColor(trends.ptpTrend)} ml={0.5}>
                      {Math.abs(trends.ptpTrend)}% vs last month
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
              <LinearProgress
                variant="determinate"
                value={kpiData.ptpHonorRate}
                sx={{ mt: 2 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Recovery Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Actual vs Target Recovery
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRecoveryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="recovered"
                    stackId="1"
                    stroke="#4CAF50"
                    fill="#4CAF50"
                    name="Recovered"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stackId="2"
                    stroke="#2196F3"
                    fill="#2196F3"
                    fillOpacity={0.3}
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                By Debt Type
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`$${(props.payload.amount / 1000).toFixed(0)}K`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Aging Analysis */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Aging Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Distribution of outstanding debt by age
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Age Bucket</TableCell>
                      <TableCell>Number of Accounts</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>% of Portfolio</TableCell>
                      <TableCell>Distribution</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agingData.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {row.bucket}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.accounts.toLocaleString()}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            ${row.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${row.percentage}%`}
                            size="small"
                            color={
                              row.percentage > 20 ? 'error' :
                              row.percentage > 15 ? 'warning' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ width: '30%' }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LinearProgress
                              variant="determinate"
                              value={row.percentage * 4}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                              color={
                                row.percentage > 20 ? 'error' :
                                row.percentage > 15 ? 'warning' : 'primary'
                              }
                            />
                          </Box>
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

      {/* Agent Performance & Settlement Analysis */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agent Performance
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Top performing collection agents
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Agent</TableCell>
                      <TableCell>Accounts</TableCell>
                      <TableCell>Recovered</TableCell>
                      <TableCell>Recovery Rate</TableCell>
                      <TableCell>PTP Honor</TableCell>
                      <TableCell>Contact Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agentPerformance.map((agent, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                              {agent.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{agent.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{agent.accountsAssigned}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            ${(agent.recovered / 1000).toFixed(0)}K
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${agent.recoveryRate}%`}
                            size="small"
                            color={agent.recoveryRate > 40 ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{agent.ptpHonorRate}%</TableCell>
                        <TableCell>{agent.contactRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Settlement Discount Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Settlements by discount range
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={settlementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Legend />
                  <Bar dataKey="count" fill="#2196F3" name="Count" />
                  <Bar dataKey="amount" fill="#4CAF50" name="Amount" />
                </BarChart>
              </ResponsiveContainer>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Average Settlement Discount: <strong>{kpiData.avgSettlementDiscount}%</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Settlement Rate: <strong>{kpiData.settlementRate}%</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PTP Conversion Funnel */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                PTP Conversion Funnel
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Track promise-to-pay conversion rates
              </Typography>
              <Grid container spacing={2}>
                {ptpFunnelData.map((stage, index) => (
                  <Grid item xs={12} md={2.4} key={index}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        border: '2px solid',
                        borderColor: index < 3 ? 'success.main' : index === 3 ? 'warning.main' : 'error.main',
                        bgcolor: 'background.paper'
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        {stage.count}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {stage.stage}
                      </Typography>
                      {index > 0 && (
                        <Chip
                          label={`${stage.percentage}%`}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollectionAnalytics;
