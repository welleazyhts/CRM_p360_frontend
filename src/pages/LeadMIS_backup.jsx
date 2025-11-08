import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha,
  Tab,
  Tabs,
  Stack,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  ContentCopy as DuplicateIcon,
  Merge as MergeIcon,
  Delete as DeleteIcon,
  CheckCircle as ValidIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const LeadMIS = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Sample data for charts
  const leadsByStatusData = [
    { name: 'New Leads', value: 45, color: theme.palette.info.main },
    { name: 'Contacted', value: 32, color: theme.palette.primary.main },
    { name: 'Qualified', value: 28, color: theme.palette.success.main },
    { name: 'Proposal Sent', value: 15, color: theme.palette.warning.main },
    { name: 'Closed Won', value: 12, color: theme.palette.success.dark },
    { name: 'Closed Lost', value: 18, color: theme.palette.error.main }
  ];

  const leadsBySourceData = [
    { name: 'Website', value: 65 },
    { name: 'Referral', value: 45 },
    { name: 'Direct', value: 30 },
    { name: 'Social Media', value: 25 },
    { name: 'Others', value: 15 }
  ];

  const leadsTrendData = [
    { month: 'Jan', leads: 45, converted: 12 },
    { month: 'Feb', leads: 52, converted: 15 },
    { month: 'Mar', leads: 48, converted: 14 },
    { month: 'Apr', leads: 61, converted: 18 },
    { month: 'May', leads: 55, converted: 16 },
    { month: 'Jun', leads: 67, converted: 22 }
  ];

  const conversionByPolicyType = [
    { type: 'Health', total: 85, converted: 28, rate: 32.9 },
    { type: 'Motor', total: 72, converted: 24, rate: 33.3 },
    { type: 'Life', total: 48, converted: 18, rate: 37.5 },
    { type: 'Travel', total: 35, converted: 10, rate: 28.6 },
    { type: 'Home', total: 20, converted: 6, rate: 30.0 }
  ];

  const agentPerformanceData = [
    { name: 'Priya Patel', leads: 45, converted: 15, revenue: 850000, conversionRate: 33.3 },
    { name: 'Rahul Kumar', leads: 38, converted: 12, revenue: 720000, conversionRate: 31.6 },
    { name: 'Sarah Johnson', leads: 42, converted: 18, revenue: 980000, conversionRate: 42.9 },
    { name: 'Amit Sharma', leads: 35, converted: 10, revenue: 650000, conversionRate: 28.6 },
    { name: 'Kavita Reddy', leads: 30, converted: 11, revenue: 720000, conversionRate: 36.7 }
  ];

  const agents = ['Priya Patel', 'Rahul Kumar', 'Sarah Johnson', 'Amit Sharma', 'Kavita Reddy'];
  const sources = ['Website', 'Referral', 'Direct', 'Social Media', 'Phone', 'Email'];
  const statuses = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

  // Duplicate leads data
  const duplicateLeads = [
    {
      groupId: 'DUP001',
      leads: [
        { id: 'L001', name: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', phone: '+91-9876543210', source: 'Website', status: 'New Lead', createdDate: '2024-01-15' },
        { id: 'L045', name: 'Rajesh Kumar', email: 'rajesh.k@gmail.com', phone: '+91-9876543210', source: 'Referral', status: 'Contacted', createdDate: '2024-01-18' }
      ],
      duplicateType: 'Phone',
      confidence: 95
    },
    {
      groupId: 'DUP002',
      leads: [
        { id: 'L023', name: 'Priya Sharma', email: 'priya.sharma@company.com', phone: '+91-9123456789', source: 'Direct', status: 'Qualified', createdDate: '2024-01-10' },
        { id: 'L067', name: 'Priya S', email: 'priya.sharma@company.com', phone: '+91-9123456780', source: 'Email', status: 'New Lead', createdDate: '2024-01-20' }
      ],
      duplicateType: 'Email',
      confidence: 98
    },
    {
      groupId: 'DUP003',
      leads: [
        { id: 'L089', name: 'Amit Patel', email: 'amit.patel@email.com', phone: '+91-9988776655', source: 'Social Media', status: 'Proposal Sent', createdDate: '2024-01-12' },
        { id: 'L134', name: 'Amit K Patel', email: 'amit.k.patel@email.com', phone: '+91-9988776655', source: 'Website', status: 'New Lead', createdDate: '2024-01-22' },
        { id: 'L156', name: 'A Patel', email: 'a.patel@gmail.com', phone: '+91-9988776655', source: 'Phone', status: 'Contacted', createdDate: '2024-01-25' }
      ],
      duplicateType: 'Phone + Name',
      confidence: 92
    },
    {
      groupId: 'DUP004',
      leads: [
        { id: 'L078', name: 'Sunita Reddy', email: 'sunita.reddy@gmail.com', phone: '+91-8765432109', source: 'Referral', status: 'Negotiation', createdDate: '2024-01-08' },
        { id: 'L145', name: 'Sunita R', email: 'sunita.reddy@gmail.com', phone: '+91-8765432100', source: 'Website', status: 'New Lead', createdDate: '2024-01-28' }
      ],
      duplicateType: 'Email',
      confidence: 96
    }
  ];

  const [selectedDuplicates, setSelectedDuplicates] = useState([]);
  const [duplicateFilter, setDuplicateFilter] = useState('all');

  // Pre-expiry renewal data
  const preExpiryRenewals = [
    { id: 'POL001', customerName: 'Rajesh Kumar', policyType: 'Health', expiryDate: '2024-02-15', premium: 25000, status: 'Pending', daysToExpiry: 15, agent: 'Priya Patel', phone: '+91-9876543210', lastContact: '2024-01-28' },
    { id: 'POL002', customerName: 'Sunita Sharma', policyType: 'Motor', expiryDate: '2024-02-20', premium: 18000, status: 'Contacted', daysToExpiry: 20, agent: 'Rahul Kumar', phone: '+91-9123456789', lastContact: '2024-01-30' },
    { id: 'POL003', customerName: 'Amit Patel', policyType: 'Life', expiryDate: '2024-02-25', premium: 45000, status: 'Proposal Sent', daysToExpiry: 25, agent: 'Sarah Johnson', phone: '+91-9988776655', lastContact: '2024-02-01' },
    { id: 'POL004', customerName: 'Kavita Reddy', policyType: 'Health', expiryDate: '2024-03-01', premium: 32000, status: 'Pending', daysToExpiry: 30, agent: 'Amit Sharma', phone: '+91-8765432109', lastContact: '2024-01-25' },
    { id: 'POL005', customerName: 'Deepak Singh', policyType: 'Motor', expiryDate: '2024-03-05', premium: 22000, status: 'Renewed', daysToExpiry: 34, agent: 'Kavita Reddy', phone: '+91-7654321098', lastContact: '2024-02-02' },
    { id: 'POL006', customerName: 'Meera Gupta', policyType: 'Travel', expiryDate: '2024-02-12', premium: 8500, status: 'Pending', daysToExpiry: 12, agent: 'Priya Patel', phone: '+91-9876501234', lastContact: '2024-01-20' },
    { id: 'POL007', customerName: 'Vikram Joshi', policyType: 'Home', expiryDate: '2024-02-18', premium: 35000, status: 'Contacted', daysToExpiry: 18, agent: 'Rahul Kumar', phone: '+91-9123450987', lastContact: '2024-01-31' },
    { id: 'POL008', customerName: 'Anita Desai', policyType: 'Health', expiryDate: '2024-02-28', premium: 28000, status: 'Negotiation', daysToExpiry: 28, agent: 'Sarah Johnson', phone: '+91-9988770123', lastContact: '2024-02-03' },
    { id: 'POL009', customerName: 'Ravi Nair', policyType: 'Motor', expiryDate: '2024-03-08', premium: 19500, status: 'Proposal Sent', daysToExpiry: 37, agent: 'Amit Sharma', phone: '+91-8765430987', lastContact: '2024-02-04' },
    { id: 'POL010', customerName: 'Pooja Agarwal', policyType: 'Life', expiryDate: '2024-03-12', premium: 52000, status: 'Renewed', daysToExpiry: 41, agent: 'Kavita Reddy', phone: '+91-7654320123', lastContact: '2024-02-05' },
    { id: 'POL011', customerName: 'Suresh Yadav', policyType: 'Health', expiryDate: '2024-02-10', premium: 31000, status: 'Pending', daysToExpiry: 10, agent: 'Priya Patel', phone: '+91-9876540987', lastContact: '2024-01-15' },
    { id: 'POL012', customerName: 'Lakshmi Iyer', policyType: 'Motor', expiryDate: '2024-02-22', premium: 21000, status: 'Contacted', daysToExpiry: 22, agent: 'Rahul Kumar', phone: '+91-9123457890', lastContact: '2024-02-01' },
    { id: 'POL013', customerName: 'Arjun Malhotra', policyType: 'Travel', expiryDate: '2024-03-15', premium: 12000, status: 'Proposal Sent', daysToExpiry: 44, agent: 'Sarah Johnson', phone: '+91-9988771234', lastContact: '2024-02-06' },
    { id: 'POL014', customerName: 'Divya Kapoor', policyType: 'Home', expiryDate: '2024-02-14', premium: 42000, status: 'Pending', daysToExpiry: 14, agent: 'Amit Sharma', phone: '+91-8765431098', lastContact: '2024-01-22' },
    { id: 'POL015', customerName: 'Manoj Tiwari', policyType: 'Life', expiryDate: '2024-03-20', premium: 38000, status: 'Negotiation', daysToExpiry: 49, agent: 'Kavita Reddy', phone: '+91-7654321234', lastContact: '2024-02-07' }
  ];

  const [renewalFilter, setRenewalFilter] = useState('all');

  const handleExportExcel = () => {
    alert('Exporting MIS report to Excel...');
  };

  const handleExportPDF = () => {
    alert('Generating PDF report...');
  };

  const handleMergeDuplicates = (groupId) => {
    alert(`Merging duplicates in group ${groupId}`);
  };

  const handleMarkAsValid = (groupId) => {
    alert(`Marking group ${groupId} as valid (not duplicates)`);
  };

  const handleDeleteDuplicate = (leadId) => {
    alert(`Deleting duplicate lead ${leadId}`);
  };

  const handleExportDuplicates = () => {
    alert('Exporting duplicate leads report to Excel...');
  };

  const getGroupColor = (groupId) => {
    const colors = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main, theme.palette.info.main];
    return colors[parseInt(groupId.slice(-1)) % colors.length];
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'error';
    if (confidence >= 90) return 'warning';
    return 'info';
  };

  const filteredDuplicates = duplicateLeads.filter(group => {
    if (duplicateFilter === 'all') return true;
    if (duplicateFilter === 'high') return group.confidence >= 95;
    if (duplicateFilter === 'medium') return group.confidence >= 90 && group.confidence < 95;
    if (duplicateFilter === 'low') return group.confidence < 90;
    return true;
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" fontWeight="600">
            Lead MIS Reports
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Management Information System for Lead Analytics and Reporting
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportExcel}
            sx={{ mr: 1 }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleExportPDF}
          >
            Generate PDF
          </Button>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                InputProps={{
                  startAdornment: <DateRangeIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="lastWeek">Last Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="thisQuarter">This Quarter</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Agent</InputLabel>
                <Select
                  multiple
                  value={selectedAgents}
                  onChange={(e) => setSelectedAgents(e.target.value)}
                  input={<OutlinedInput label="Filter by Agent" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {agents.map((agent) => (
                    <MenuItem key={agent} value={agent}>
                      <Checkbox checked={selectedAgents.indexOf(agent) > -1} />
                      <ListItemText primary={agent} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Source</InputLabel>
                <Select
                  multiple
                  value={selectedSources}
                  onChange={(e) => setSelectedSources(e.target.value)}
                  input={<OutlinedInput label="Filter by Source" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {sources.map((source) => (
                    <MenuItem key={source} value={source}>
                      <Checkbox checked={selectedSources.indexOf(source) > -1} />
                      <ListItemText primary={source} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  multiple
                  value={selectedStatuses}
                  onChange={(e) => setSelectedStatuses(e.target.value)}
                  input={<OutlinedInput label="Filter by Status" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={selectedStatuses.indexOf(status) > -1} />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Leads</Typography>
                  <Typography variant="h3" fontWeight="700">180</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">+12% from last month</Typography>
                  </Stack>
                </Box>
                <PeopleIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Conversion Rate</Typography>
                  <Typography variant="h3" fontWeight="700">34.2%</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">+5.3% from last month</Typography>
                  </Stack>
                </Box>
                <AssessmentIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Revenue</Typography>
                  <Typography variant="h3" fontWeight="700">₹3.9Cr</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">+18% from last month</Typography>
                  </Stack>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`, color: 'white' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Lost Leads</Typography>
                  <Typography variant="h3" fontWeight="700">18</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingDownIcon fontSize="small" />
                    <Typography variant="caption">-8% from last month</Typography>
                  </Stack>
                </Box>
                <TrendingDownIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<PieChartIcon />} label="Status Distribution" iconPosition="start" />
          <Tab icon={<BarChartIcon />} label="Performance Analysis" iconPosition="start" />
          <Tab icon={<ShowChartIcon />} label="Trends & Patterns" iconPosition="start" />
          <Tab icon={<DuplicateIcon />} label="Duplicate Analysis" iconPosition="start" />
          <Tab icon={<DateRangeIcon />} label="Pre-Expiry Renewals" iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label="Detailed Reports" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Leads by Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadsByStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {leadsByStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Leads by Source
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leadsBySourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="value" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Agent Performance Summary
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Agent Name</TableCell>
                        <TableCell align="center">Total Leads</TableCell>
                        <TableCell align="center">Converted</TableCell>
                        <TableCell align="center">Conversion Rate</TableCell>
                        <TableCell align="right">Revenue Generated</TableCell>
                        <TableCell align="center">Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {agentPerformanceData.map((agent) => (
                        <TableRow key={agent.name} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="600">
                              {agent.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{agent.leads}</TableCell>
                          <TableCell align="center">{agent.converted}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${agent.conversionRate}%`}
                              size="small"
                              color={agent.conversionRate >= 35 ? 'success' : agent.conversionRate >= 30 ? 'warning' : 'error'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600" color="success.main">
                              ₹{(agent.revenue / 100000).toFixed(1)}L
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={agent.conversionRate >= 35 ? 'Excellent' : agent.conversionRate >= 30 ? 'Good' : 'Needs Improvement'}
                              size="small"
                              color={agent.conversionRate >= 35 ? 'success' : agent.conversionRate >= 30 ? 'primary' : 'warning'}
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

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Conversion by Policy Type
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Policy Type</TableCell>
                        <TableCell align="center">Total Leads</TableCell>
                        <TableCell align="center">Converted</TableCell>
                        <TableCell align="center">Conversion Rate</TableCell>
                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {conversionByPolicyType.map((policy) => (
                        <TableRow key={policy.type} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="600">
                              {policy.type} Insurance
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{policy.total}</TableCell>
                          <TableCell align="center">{policy.converted}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={`${policy.rate}%`}
                              size="small"
                              color={policy.rate >= 35 ? 'success' : policy.rate >= 30 ? 'warning' : 'error'}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  flex: 1,
                                  height: 8,
                                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                                  borderRadius: 1,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${policy.rate}%`,
                                    height: '100%',
                                    bgcolor: policy.rate >= 35 ? theme.palette.success.main : policy.rate >= 30 ? theme.palette.warning.main : theme.palette.error.main,
                                    borderRadius: 1
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" fontWeight="600">
                                {policy.rate}%
                              </Typography>
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
      )}

      {currentTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Lead Generation & Conversion Trends
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={leadsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke={theme.palette.primary.main} strokeWidth={2} name="Total Leads" />
                    <Line type="monotone" dataKey="converted" stroke={theme.palette.success.main} strokeWidth={2} name="Converted" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 3 && (
        <Grid container spacing={3}>
          {/* Duplicate Analysis Summary */}
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Duplicate Groups</Typography>
                        <Typography variant="h3" fontWeight="700">{duplicateLeads.length}</Typography>
                      </Box>
                      <DuplicateIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Affected Leads</Typography>
                        <Typography variant="h3" fontWeight="700">{duplicateLeads.reduce((sum, group) => sum + group.leads.length, 0)}</Typography>
                      </Box>
                      <WarningIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>High Confidence</Typography>
                        <Typography variant="h3" fontWeight="700">{duplicateLeads.filter(g => g.confidence >= 95).length}</Typography>
                      </Box>
                      <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Potential Savings</Typography>
                        <Typography variant="h3" fontWeight="700">Rs 2.4L</Typography>
                      </Box>
                      <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Duplicate Analysis Filters */}
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      select
                      label="Filter by Confidence"
                      value={duplicateFilter}
                      onChange={(e) => setDuplicateFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Duplicates</MenuItem>
                      <MenuItem value="high">High Confidence (95%+)</MenuItem>
                      <MenuItem value="medium">Medium Confidence (90-94%)</MenuItem>
                      <MenuItem value="low">Low Confidence (&lt;90%)</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportDuplicates}
                      fullWidth
                    >
                      Export Report
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Duplicate Leads Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Duplicate Lead Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Leads are grouped by matching criteria. Use actions to merge, mark as valid, or delete duplicates.
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Lead ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell align="center">Source</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Group ID</TableCell>
                        <TableCell align="center">Confidence</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredDuplicates.map((group) => (
                        group.leads.map((lead, index) => (
                          <TableRow 
                            key={lead.id} 
                            hover
                            sx={{
                              borderLeft: `4px solid ${alpha(getGroupColor(group.groupId), 0.8)}`,
                              backgroundColor: index === 0 ? alpha(getGroupColor(group.groupId), 0.05) : 'transparent'
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="600" color="primary.main">
                                {lead.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {lead.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Created: {new Date(lead.createdDate).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.phone}</TableCell>
                            <TableCell align="center">
                              <Chip label={lead.source} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={lead.status} 
                                size="small" 
                                color={lead.status === 'New Lead' ? 'info' : lead.status === 'Contacted' ? 'primary' : 'success'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {index === 0 && (
                                <Chip 
                                  label={group.groupId}
                                  size="small"
                                  sx={{ 
                                    bgcolor: alpha(getGroupColor(group.groupId), 0.2),
                                    color: getGroupColor(group.groupId),
                                    fontWeight: 600
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {index === 0 && (
                                <Chip 
                                  label={`${group.confidence}%`}
                                  size="small"
                                  color={getConfidenceColor(group.confidence)}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={0.5} justifyContent="center">
                                {index === 0 && (
                                  <>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                      startIcon={<MergeIcon />}
                                      onClick={() => handleMergeDuplicates(group.groupId)}
                                      sx={{ fontSize: '0.7rem' }}
                                    >
                                      Merge
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="success"
                                      startIcon={<ValidIcon />}
                                      onClick={() => handleMarkAsValid(group.groupId)}
                                      sx={{ fontSize: '0.7rem' }}
                                    >
                                      Valid
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleDeleteDuplicate(lead.id)}
                                  sx={{ fontSize: '0.7rem' }}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {filteredDuplicates.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No duplicate leads found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All leads appear to be unique based on current criteria
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 4 && (
        <Grid container spacing={3}>
          {/* Pre-Expiry Renewal Summary */>
          <Grid item xs={12}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Expiring Soon</Typography>
                        <Typography variant="h3" fontWeight="700">{preExpiryRenewals.filter(p => p.daysToExpiry <= 30).length}</Typography>
                      </Box>
                      <DateRangeIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Renewed</Typography>
                        <Typography variant="h3" fontWeight="700">{preExpiryRenewals.filter(p => p.status === 'Renewed').length}</Typography>
                      </Box>
                      <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Premium</Typography>
                        <Typography variant="h3" fontWeight="700">₹{(preExpiryRenewals.reduce((sum, p) => sum + p.premium, 0) / 100000).toFixed(1)}L</Typography>
                      </Box>
                      <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`, color: 'white' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Pending</Typography>
                        <Typography variant="h3" fontWeight="700">{preExpiryRenewals.filter(p => p.status === 'Pending').length}</Typography>
                      </Box>
                      <WarningIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Filters */}
          <Grid item xs={12}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      select
                      label="Filter by Status"
                      value={renewalFilter}
                      onChange={(e) => setRenewalFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Policies</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="contacted">Contacted</MenuItem>
                      <MenuItem value="proposal">Proposal Sent</MenuItem>
                      <MenuItem value="renewed">Renewed</MenuItem>
                      <MenuItem value="negotiation">Negotiation</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                      fullWidth
                    >
                      Export Report
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Pre-Expiry Renewals Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Pre-Expiry Renewal Report
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Policies expiring within the next 60 days requiring renewal action.
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Policy ID</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Policy Type</TableCell>
                        <TableCell align="center">Expiry Date</TableCell>
                        <TableCell align="center">Days to Expiry</TableCell>
                        <TableCell align="right">Premium</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell>Assigned Agent</TableCell>
                        <TableCell align="center">Last Contact</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {preExpiryRenewals
                        .filter(policy => {
                          if (renewalFilter === 'all') return true;
                          if (renewalFilter === 'pending') return policy.status === 'Pending';
                          if (renewalFilter === 'contacted') return policy.status === 'Contacted';
                          if (renewalFilter === 'proposal') return policy.status === 'Proposal Sent';
                          if (renewalFilter === 'renewed') return policy.status === 'Renewed';
                          if (renewalFilter === 'negotiation') return policy.status === 'Negotiation';
                          return true;
                        })
                        .map((policy) => (
                        <TableRow key={policy.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              {policy.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {policy.customerName}
                            </Typography>
                          </TableCell>
                          <TableCell>{policy.policyType} Insurance</TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {new Date(policy.expiryDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${policy.daysToExpiry} days`}
                              size="small"
                              color={policy.daysToExpiry <= 15 ? 'error' : policy.daysToExpiry <= 30 ? 'warning' : 'info'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600">
                              ₹{policy.premium.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={policy.status}
                              size="small"
                              color={
                                policy.status === 'Renewed' ? 'success' :
                                policy.status === 'Proposal Sent' ? 'info' :
                                policy.status === 'Contacted' ? 'primary' : 'warning'
                              }
                            />
                          </TableCell>
                          <TableCell>{policy.agent}</TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" color="text.secondary">
                              {new Date(policy.lastContact).toLocaleDateString()}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {policy.phone}
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
      )}

      {currentTab === 5 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Detailed MIS Report
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Report Generated On:</Typography>
                    <Typography variant="body1" fontWeight="600">{new Date().toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Period:</Typography>
                    <Typography variant="body1" fontWeight="600">This Month</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportExcel}>
                        Download Excel
                      </Button>
                      <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleExportPDF}>
                        Download PDF
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default LeadMIS;
