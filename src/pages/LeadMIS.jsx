import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
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
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Policy as PolicyIcon,
  Cancel as CancelIcon,
  Analytics as AnalyticsIcon,
  TableView as TableViewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import * as misServices from '../services/misServices';

const LeadMIS = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // CSC Load Tracking Filters
  const [cscSelectedMonth, setCscSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [cscSelectedRegion, setCscSelectedRegion] = useState('all');
  const [cscPerformanceFilter, setCscPerformanceFilter] = useState('all');

  // Daily Insurer MIS Filters
  const [dailyMISSelectedInsurer, setDailyMISSelectedInsurer] = useState('all');
  const [dailyMISSelectedDate, setDailyMISSelectedDate] = useState('all');
  const [dailyMISConversionFilter, setDailyMISConversionFilter] = useState('all');

  // Premium Registers Filters
  const [premiumSelectedInsurer, setPremiumSelectedInsurer] = useState('all');
  const [premiumSelectedPolicyType, setPremiumSelectedPolicyType] = useState('all');
  const [premiumSelectedTenure, setPremiumSelectedTenure] = useState('all');

  // Capacity Planning CSC Filters
  const [capacitySelectedMonth, setCapacitySelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [capacitySelectedRegion, setCapacitySelectedRegion] = useState('all');
  const [capacityStatusFilter, setCapacityStatusFilter] = useState('all');

  // Workload Distribution Filters
  const [workloadSelectedDateRange, setWorkloadSelectedDateRange] = useState('thisMonth');
  const [workloadSelectedRegion, setWorkloadSelectedRegion] = useState('all');
  const [workloadSelectedTeam, setWorkloadSelectedTeam] = useState('all');

  // Performance Analysis Filters
  const [performanceAgentFilter, setPerformanceAgentFilter] = useState('all');
  const [performanceConversionFilter, setPerformanceConversionFilter] = useState('all');
  const [performancePolicyTypeFilter, setPerformancePolicyTypeFilter] = useState('all');

  // API Data States
  const [leadsByStatusData, setLeadsByStatusData] = useState([]);
  const [leadsBySourceData, setLeadsBySourceData] = useState([]);
  const [leadsTrendData, setLeadsTrendData] = useState([]);
  const [agentPerformanceData, setAgentPerformanceData] = useState([]);
  const [duplicateLeads, setDuplicateLeads] = useState([]);
  const [preExpiryRenewals, setPreExpiryRenewals] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample data for charts
  // leadsByStatusData replaced by state

  // leadsBySourceData replaced by state

  // leadsTrendData replaced by state

  const conversionByPolicyType = [
    { type: 'Health', total: 85, converted: 28, rate: 32.9 },
    { type: 'Motor', total: 72, converted: 24, rate: 33.3 },
    { type: 'Life', total: 48, converted: 18, rate: 37.5 },
    { type: 'Travel', total: 35, converted: 10, rate: 28.6 },
    { type: 'Home', total: 20, converted: 6, rate: 30.0 }
  ];

  // agentPerformanceData replaced by state

  const agents = ['Priya Patel', 'Rahul Kumar', 'Sarah Johnson', 'Amit Sharma', 'Kavita Reddy'];
  const sources = ['Website', 'Referral', 'Direct', 'Social Media', 'Phone', 'Email'];
  const statuses = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];

  // duplicateLeads replaced by state

  const [selectedDuplicates, setSelectedDuplicates] = useState([]);
  const [duplicateFilter, setDuplicateFilter] = useState('all');
  const [duplicateSourceFilter, setDuplicateSourceFilter] = useState('all');
  const [duplicateStatusFilter, setDuplicateStatusFilter] = useState('all');

  // preExpiryRenewals replaced by state

  const [renewalFilter, setRenewalFilter] = useState('all');
  const [renewalAgentFilter, setRenewalAgentFilter] = useState('all');
  const [renewalPolicyTypeFilter, setRenewalPolicyTypeFilter] = useState('all');

  // CSC Productivity data
  const cscProductivityData = [
    { cscName: 'Priya Patel', calls: 145, policies: 28, conversionRate: 19.3, score: 92, performance: 'Excellent', region: 'Mumbai', source: 'Website', status: 'Closed Won' },
    { cscName: 'Rahul Kumar', calls: 132, policies: 24, conversionRate: 18.2, score: 88, performance: 'Good', region: 'Delhi', source: 'Referral', status: 'Closed Won' },
    { cscName: 'Sarah Johnson', calls: 158, policies: 35, conversionRate: 22.2, score: 96, performance: 'Excellent', region: 'Bangalore', source: 'Direct', status: 'Closed Won' },
    { cscName: 'Amit Sharma', calls: 118, policies: 18, conversionRate: 15.3, score: 78, performance: 'Average', region: 'Chennai', source: 'Phone', status: 'Qualified' },
    { cscName: 'Kavita Reddy', calls: 125, policies: 22, conversionRate: 17.6, score: 85, performance: 'Good', region: 'Hyderabad', source: 'Social Media', status: 'Closed Won' },
    { cscName: 'Deepak Singh', calls: 98, policies: 12, conversionRate: 12.2, score: 65, performance: 'Needs Improvement', region: 'Pune', source: 'Email', status: 'Contacted' },
    { cscName: 'Meera Gupta', calls: 142, policies: 31, conversionRate: 21.8, score: 94, performance: 'Excellent', region: 'Kolkata', source: 'Website', status: 'Closed Won' },
    { cscName: 'Vikram Joshi', calls: 108, policies: 15, conversionRate: 13.9, score: 72, performance: 'Average', region: 'Ahmedabad', source: 'Referral', status: 'Proposal Sent' }
  ];

  // CSC Productivity Filters
  const [cscFilter, setCscFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  const regions = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

  // Lost Reasons Analysis data
  const lostReasonsData = [
    { reason: 'High Premium', count: 25, percentage: 35.7 },
    { reason: 'Better Competitor Offer', count: 18, percentage: 25.7 },
    { reason: 'Poor Service Experience', count: 12, percentage: 17.1 },
    { reason: 'Coverage Issues', count: 8, percentage: 11.4 },
    { reason: 'Financial Constraints', count: 7, percentage: 10.0 }
  ];

  const monthlyLostReasons = [
    { month: 'Jan', highPremium: 8, competitor: 5, service: 3, coverage: 2, financial: 2 },
    { month: 'Feb', highPremium: 6, competitor: 4, service: 2, coverage: 1, financial: 1 },
    { month: 'Mar', highPremium: 5, competitor: 3, service: 2, coverage: 2, financial: 1 },
    { month: 'Apr', highPremium: 4, competitor: 3, service: 2, coverage: 1, financial: 2 },
    { month: 'May', highPremium: 2, competitor: 2, service: 2, coverage: 1, financial: 1 },
    { month: 'Jun', highPremium: 0, competitor: 1, service: 1, coverage: 1, financial: 0 }
  ];

  const lostLeadsDetails = [
    { id: 'L001', customerName: 'Rajesh Kumar', policyType: 'Health', agent: 'Priya Patel', lostDate: '2024-01-15', reason: 'High Premium', premium: 25000, notes: 'Customer found 20% cheaper option', source: 'Website', status: 'Closed Lost' },
    { id: 'L002', customerName: 'Sunita Sharma', policyType: 'Motor', agent: 'Rahul Kumar', lostDate: '2024-01-18', reason: 'Better Competitor Offer', premium: 18000, notes: 'Competitor offered additional benefits', source: 'Referral', status: 'Closed Lost' },
    { id: 'L003', customerName: 'Amit Patel', policyType: 'Life', agent: 'Sarah Johnson', lostDate: '2024-01-20', reason: 'Poor Service Experience', premium: 45000, notes: 'Unhappy with claim settlement process', source: 'Direct', status: 'Closed Lost' },
    { id: 'L004', customerName: 'Kavita Reddy', policyType: 'Health', agent: 'Amit Sharma', lostDate: '2024-01-22', reason: 'Coverage Issues', premium: 32000, notes: 'Required specific coverage not available', source: 'Phone', status: 'Closed Lost' },
    { id: 'L005', customerName: 'Deepak Singh', policyType: 'Motor', agent: 'Kavita Reddy', lostDate: '2024-01-25', reason: 'Financial Constraints', premium: 22000, notes: 'Customer postponed purchase due to budget', source: 'Social Media', status: 'Closed Lost' },
    { id: 'L006', customerName: 'Meera Gupta', policyType: 'Travel', agent: 'Priya Patel', lostDate: '2024-01-28', reason: 'High Premium', premium: 8500, notes: 'Found 30% cheaper alternative', source: 'Email', status: 'Closed Lost' },
    { id: 'L007', customerName: 'Vikram Joshi', policyType: 'Home', agent: 'Rahul Kumar', lostDate: '2024-02-01', reason: 'Better Competitor Offer', premium: 35000, notes: 'Competitor offered better terms', source: 'Website', status: 'Closed Lost' },
    { id: 'L008', customerName: 'Anita Desai', policyType: 'Health', agent: 'Sarah Johnson', lostDate: '2024-02-03', reason: 'Poor Service Experience', premium: 28000, notes: 'Dissatisfied with response time', source: 'Referral', status: 'Closed Lost' }
  ];

  const [lostReasonFilter, setLostReasonFilter] = useState('all');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');

  const productTypes = ['Health', 'Motor', 'Life', 'Travel', 'Home'];

  // Conversion % Reports data
  const conversionReportsData = [
    { agent: 'Priya Patel', totalLeads: 145, convertedLeads: 48, conversionRate: 33.1, revenue: 2400000, productType: 'Health', source: 'Website', status: 'Closed Won' },
    { agent: 'Rahul Kumar', totalLeads: 132, convertedLeads: 42, conversionRate: 31.8, revenue: 2100000, productType: 'Motor', source: 'Referral', status: 'Closed Won' },
    { agent: 'Sarah Johnson', totalLeads: 158, convertedLeads: 56, conversionRate: 35.4, revenue: 2800000, productType: 'Life', source: 'Direct', status: 'Closed Won' },
    { agent: 'Amit Sharma', totalLeads: 118, convertedLeads: 32, conversionRate: 27.1, revenue: 1600000, productType: 'Health', source: 'Phone', status: 'Qualified' },
    { agent: 'Kavita Reddy', totalLeads: 125, convertedLeads: 38, conversionRate: 30.4, revenue: 1900000, productType: 'Motor', source: 'Social Media', status: 'Closed Won' },
    { agent: 'Deepak Singh', totalLeads: 98, convertedLeads: 22, conversionRate: 22.4, revenue: 1100000, productType: 'Travel', source: 'Email', status: 'Proposal Sent' },
    { agent: 'Meera Gupta', totalLeads: 142, convertedLeads: 51, conversionRate: 35.9, revenue: 2550000, productType: 'Life', source: 'Website', status: 'Closed Won' },
    { agent: 'Vikram Joshi', totalLeads: 108, convertedLeads: 28, conversionRate: 25.9, revenue: 1400000, productType: 'Home', source: 'Referral', status: 'Negotiation' }
  ];

  const monthlyConversionTrend = [
    { month: 'Jan', totalLeads: 180, convertedLeads: 54, conversionRate: 30.0 },
    { month: 'Feb', totalLeads: 165, convertedLeads: 52, conversionRate: 31.5 },
    { month: 'Mar', totalLeads: 195, convertedLeads: 63, conversionRate: 32.3 },
    { month: 'Apr', totalLeads: 210, convertedLeads: 71, conversionRate: 33.8 },
    { month: 'May', totalLeads: 188, convertedLeads: 65, conversionRate: 34.6 },
    { month: 'Jun', totalLeads: 172, convertedLeads: 62, conversionRate: 36.0 }
  ];

  const productWiseConversion = [
    { product: 'Health', totalLeads: 285, convertedLeads: 92, conversionRate: 32.3, avgDealValue: 45000 },
    { product: 'Motor', totalLeads: 267, convertedLeads: 85, conversionRate: 31.8, avgDealValue: 28000 },
    { product: 'Life', totalLeads: 198, convertedLeads: 72, conversionRate: 36.4, avgDealValue: 65000 },
    { product: 'Travel', totalLeads: 145, convertedLeads: 38, conversionRate: 26.2, avgDealValue: 12000 },
    { product: 'Home', totalLeads: 125, convertedLeads: 35, conversionRate: 28.0, avgDealValue: 38000 }
  ];

  const [conversionDateFilter, setConversionDateFilter] = useState('thisMonth');
  const [conversionAgentFilter, setConversionAgentFilter] = useState('all');
  const [conversionProductFilter, setConversionProductFilter] = useState('all');

  // Pivot Reports data
  const pivotByInsurer = [
    { insurer: 'HDFC ERGO', policies: 145, premium: 6500000, claims: 12, claimRatio: 8.3, marketShare: 28.5, product: 'Health', date: '2025-01-15' },
    { insurer: 'ICICI Lombard', policies: 132, premium: 5800000, claims: 8, claimRatio: 6.1, marketShare: 25.9, product: 'Motor', date: '2025-01-20' },
    { insurer: 'Bajaj Allianz', policies: 98, premium: 4200000, claims: 15, claimRatio: 15.3, marketShare: 19.2, product: 'Life', date: '2025-01-18' },
    { insurer: 'Star Health', policies: 87, premium: 3900000, claims: 6, claimRatio: 6.9, marketShare: 17.1, product: 'Health', date: '2025-01-22' },
    { insurer: 'Max Bupa', policies: 48, premium: 2100000, claims: 4, claimRatio: 8.3, marketShare: 9.4, product: 'Travel', date: '2025-01-25' }
  ];

  const pivotByCSC = [
    { csc: 'Mumbai Central', policies: 185, premium: 8200000, agents: 12, avgPerAgent: 15.4, efficiency: 92.3, product: 'Health', date: '2025-01-15' },
    { csc: 'Delhi North', policies: 165, premium: 7400000, agents: 10, avgPerAgent: 16.5, efficiency: 88.7, product: 'Motor', date: '2025-01-20' },
    { csc: 'Bangalore Tech', policies: 142, premium: 6800000, agents: 9, avgPerAgent: 15.8, efficiency: 94.1, product: 'Life', date: '2025-01-18' },
    { csc: 'Chennai Express', policies: 128, premium: 5900000, agents: 8, avgPerAgent: 16.0, efficiency: 85.2, product: 'Health', date: '2025-01-22' },
    { csc: 'Hyderabad Hub', policies: 95, premium: 4300000, agents: 6, avgPerAgent: 15.8, efficiency: 89.6, product: 'Motor', date: '2025-01-25' }
  ];

  const pivotByTenure = [
    { tenure: '1 Year', policies: 285, premium: 8500000, renewalRate: 78.2, avgPremium: 29825, satisfaction: 4.2, product: 'Health', date: '2025-01-15' },
    { tenure: '2 Years', policies: 198, premium: 7200000, renewalRate: 85.4, avgPremium: 36364, satisfaction: 4.5, product: 'Motor', date: '2025-01-20' },
    { tenure: '3 Years', policies: 142, premium: 6800000, renewalRate: 91.5, avgPremium: 47887, satisfaction: 4.7, product: 'Life', date: '2025-01-18' },
    { tenure: '5 Years', policies: 85, premium: 5100000, renewalRate: 94.1, avgPremium: 60000, satisfaction: 4.8, product: 'Health', date: '2025-01-22' }
  ];

  const [pivotGroupBy, setPivotGroupBy] = useState('insurer');
  const [pivotDateFilter, setPivotDateFilter] = useState('thisMonth');
  const [pivotProductFilter, setPivotProductFilter] = useState('all');

  const getPivotData = () => {
    switch (pivotGroupBy) {
      case 'insurer': return pivotByInsurer;
      case 'csc': return pivotByCSC;
      case 'tenure': return pivotByTenure;
      default: return pivotByInsurer;
    }
  };

  // Fetch all MIS data
  const fetchMISData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build filter parameters
      const params = {
        dateRange,
        agents: selectedAgents.join(','),
        sources: selectedSources.join(','),
        statuses: selectedStatuses.join(',')
      };

      // Fetch data from all endpoints in parallel
      const [
        statusData,
        sourceData,
        trendData,
        performanceData,
        duplicatesData,
        renewalsData
      ] = await Promise.all([
        misServices.fetchLeadsByStatus(params),
        misServices.fetchLeadsBySource(params),
        misServices.fetchLeadsTrend(params),
        misServices.fetchAgentPerformance(params),
        misServices.fetchDuplicateGroups(params),
        misServices.fetchPreExpiryRenewals(params)
      ]);

      // Add colors to status data for charts
      const coloredStatusData = statusData.map((item, index) => {
        const colors = [
          theme.palette.info.main,
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.success.dark,
          theme.palette.error.main
        ];
        return { ...item, color: colors[index] || theme.palette.grey[500] };
      });

      // Update state with fetched data
      setLeadsByStatusData(coloredStatusData);
      setLeadsBySourceData(sourceData);
      setLeadsTrendData(trendData);
      setAgentPerformanceData(performanceData);
      setDuplicateLeads(duplicatesData);
      setPreExpiryRenewals(renewalsData);

    } catch (err) {
      console.error('Error fetching MIS data:', err);
      setError('Failed to load MIS data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchMISData();
  }, [dateRange, selectedAgents, selectedSources, selectedStatuses]);

  const handleRefresh = () => {
    fetchMISData();
  };

  const handleResetFilters = () => {
    setDateRange('thisMonth');
    setSelectedAgents([]);
    setSelectedSources([]);
    setSelectedStatuses([]);
  };

  const handleResetPerformanceFilters = () => {
    setPerformanceAgentFilter('all');
    setPerformanceConversionFilter('all');
    setPerformancePolicyTypeFilter('all');
  };

  const handleResetDuplicateFilters = () => {
    setDuplicateFilter('all');
    setDuplicateSourceFilter('all');
    setDuplicateStatusFilter('all');
  };

  const handleResetRenewalFilters = () => {
    setRenewalFilter('all');
    setRenewalAgentFilter('all');
    setRenewalPolicyTypeFilter('all');
  };

  const handleResetCSCFilters = () => {
    setCscFilter('all');
    setRegionFilter('all');
    setScoreFilter('all');
  };

  const handleResetLostReasonFilters = () => {
    setLostReasonFilter('all');
    setProductTypeFilter('all');
    setAgentFilter('all');
  };

  const handleResetConversionFilters = () => {
    setConversionDateFilter('thisMonth');
    setConversionAgentFilter('all');
    setConversionProductFilter('all');
  };

  const handleResetPivotFilters = () => {
    setPivotGroupBy('insurer');
    setPivotDateFilter('thisMonth');
    setPivotProductFilter('all');
  };

  const getPivotChartData = () => {
    const data = getPivotData();
    return data.map(item => ({
      name: item.insurer || item.csc || item.tenure,
      value: item.policies,
      premium: item.premium
    }));
  };

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
    // Filter by confidence
    if (duplicateFilter === 'all') return true;
    if (duplicateFilter === 'high') return group.confidence >= 95;
    if (duplicateFilter === 'medium') return group.confidence >= 90 && group.confidence < 95;
    if (duplicateFilter === 'low') return group.confidence < 90;
    return true;
  }).filter(group => {
    // Filter by source - check if any lead in the group matches the selected source
    if (duplicateSourceFilter === 'all') return true;
    return group.leads.some(lead => lead.source === duplicateSourceFilter);
  }).filter(group => {
    // Filter by status - check if any lead in the group matches the selected status
    if (duplicateStatusFilter === 'all') return true;
    return group.leads.some(lead => lead.status === duplicateStatusFilter);
  });

  // Helper functions to filter static data based on global filters
  const getFilteredCSCProductivityData = () => {
    let filtered = cscProductivityData;

    // Filter by selected agents
    if (selectedAgents.length > 0) {
      filtered = filtered.filter(csc => selectedAgents.includes(csc.cscName));
    }

    // Filter by selected sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter(csc => selectedSources.includes(csc.source));
    }

    // Filter by selected statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(csc => selectedStatuses.includes(csc.status));
    }

    return filtered;
  };

  const getFilteredLostLeadsDetails = () => {
    let filtered = lostLeadsDetails;

    // Filter by selected agents
    if (selectedAgents.length > 0) {
      filtered = filtered.filter(lead => selectedAgents.includes(lead.agent));
    }

    // Filter by selected sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter(lead => selectedSources.includes(lead.source));
    }

    // Filter by selected statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(lead => selectedStatuses.includes(lead.status));
    }

    return filtered;
  };

  const getFilteredConversionReportsData = () => {
    let filtered = conversionReportsData;

    // Filter by selected agents
    if (selectedAgents.length > 0) {
      filtered = filtered.filter(report => selectedAgents.includes(report.agent));
    }

    // Filter by selected sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter(report => selectedSources.includes(report.source));
    }

    // Filter by selected statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(report => selectedStatuses.includes(report.status));
    }

    return filtered;
  };

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
      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
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
          </Button >
        </Grid >
      </Grid >



      {/* Key Metrics */}
      < Grid container spacing={2} sx={{ mb: 3 }}>
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
      </Grid >

      {/* Tabs */}
      < Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 120,
              mx: 0.5
            }
          }}
        >
          <Tab icon={<PieChartIcon />} label="Status Distribution" iconPosition="start" />
          <Tab icon={<BarChartIcon />} label="Performance Analysis" iconPosition="start" />
          <Tab icon={<ShowChartIcon />} label="Trends & Patterns" iconPosition="start" />
          <Tab icon={<DuplicateIcon />} label="Duplicate Analysis" iconPosition="start" />
          <Tab icon={<DateRangeIcon />} label="Pre-Expiry Renewals" iconPosition="start" />
          <Tab icon={<StarIcon />} label="CSC Productivity" iconPosition="start" />
          <Tab icon={<CancelIcon />} label="Lost Reasons Analysis" iconPosition="start" />
          <Tab icon={<AnalyticsIcon />} label="Conversion % Reports" iconPosition="start" />
          <Tab icon={<TableViewIcon />} label="Pivot Reports" iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label="Premium Registers" iconPosition="start" />
          <Tab icon={<BarChartIcon />} label="Daily Insurer MIS" iconPosition="start" />
          <Tab icon={<PhoneIcon />} label="CSC Load Tracking" iconPosition="start" />
          <Tab icon={<AnalyticsIcon />} label="Capacity Planning" iconPosition="start" />
          <Tab icon={<PeopleIcon />} label="Workload Distribution" iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label="Detailed Reports" iconPosition="start" />
        </Tabs>
      </Paper >

      {/* Tab Content */}
      {
        currentTab === 0 && (
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
        )
      }

      {
        currentTab === 1 && (
          <Grid container spacing={3}>
            {/* Filter Section */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Agent"
                        value={performanceAgentFilter}
                        onChange={(e) => setPerformanceAgentFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Agents</MenuItem>
                        {agents.map((agent) => (
                          <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Conversion Rate"
                        value={performanceConversionFilter}
                        onChange={(e) => setPerformanceConversionFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Conversion Rates</MenuItem>
                        <MenuItem value="excellent">Excellent (≥35%)</MenuItem>
                        <MenuItem value="good">Good (30-34%)</MenuItem>
                        <MenuItem value="needsImprovement">Needs Improvement (&lt;30%)</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Policy Type"
                        value={performancePolicyTypeFilter}
                        onChange={(e) => setPerformancePolicyTypeFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Policy Types</MenuItem>
                        <MenuItem value="Health">Health</MenuItem>
                        <MenuItem value="Motor">Motor</MenuItem>
                        <MenuItem value="Life">Life</MenuItem>
                        <MenuItem value="Travel">Travel</MenuItem>
                        <MenuItem value="Home">Home</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleResetPerformanceFilters}
                        sx={{ height: '56px' }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

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
                        {agentPerformanceData
                          .filter((agent) => {
                            // Filter by agent
                            if (performanceAgentFilter !== 'all' && agent.name !== performanceAgentFilter) {
                              return false;
                            }
                            // Filter by conversion rate
                            if (performanceConversionFilter === 'excellent' && agent.conversionRate < 35) {
                              return false;
                            }
                            if (performanceConversionFilter === 'good' && (agent.conversionRate < 30 || agent.conversionRate >= 35)) {
                              return false;
                            }
                            if (performanceConversionFilter === 'needsImprovement' && agent.conversionRate >= 30) {
                              return false;
                            }
                            return true;
                          })
                          .map((agent) => (
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
                        {conversionByPolicyType
                          .filter((policy) => {
                            // Filter by policy type
                            if (performancePolicyTypeFilter !== 'all' && policy.type !== performancePolicyTypeFilter) {
                              return false;
                            }
                            return true;
                          })
                          .map((policy) => (
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
        )
      }

      {
        currentTab === 2 && (
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
        )
      }

      {
        currentTab === 3 && (
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
              <Card>
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
                        <MenuItem value="all">All Confidence Levels</MenuItem>
                        <MenuItem value="high">High (≥95%)</MenuItem>
                        <MenuItem value="medium">Medium (90-94%)</MenuItem>
                        <MenuItem value="low">Low (&lt;90%)</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Source"
                        value={duplicateSourceFilter}
                        onChange={(e) => setDuplicateSourceFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Sources</MenuItem>
                        {sources.map((source) => (
                          <MenuItem key={source} value={source}>{source}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Status"
                        value={duplicateStatusFilter}
                        onChange={(e) => setDuplicateStatusFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        {statuses.map((status) => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleResetDuplicateFilters}
                        sx={{ height: '56px' }}
                      >
                        Reset Filters
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
        )
      }

      {
        currentTab === 4 && (
          <Grid container spacing={3}>
            {/* Pre-Expiry Renewal Summary */}
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
                      <TextField
                        fullWidth
                        select
                        label="Filter by Agent"
                        value={renewalAgentFilter}
                        onChange={(e) => setRenewalAgentFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Agents</MenuItem>
                        {agents.map((agent) => (
                          <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Policy Type"
                        value={renewalPolicyTypeFilter}
                        onChange={(e) => setRenewalPolicyTypeFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Policy Types</MenuItem>
                        <MenuItem value="Health">Health</MenuItem>
                        <MenuItem value="Motor">Motor</MenuItem>
                        <MenuItem value="Life">Life</MenuItem>
                        <MenuItem value="Travel">Travel</MenuItem>
                        <MenuItem value="Home">Home</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleResetRenewalFilters}
                        sx={{ height: '56px' }}
                      >
                        Reset Filters
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
                            // Filter by status
                            if (renewalFilter !== 'all') {
                              const statusMap = {
                                'pending': 'Pending',
                                'contacted': 'Contacted',
                                'proposal': 'Proposal Sent',
                                'renewed': 'Renewed',
                                'negotiation': 'Negotiation'
                              };
                              if (policy.status !== statusMap[renewalFilter]) {
                                return false;
                              }
                            }
                            // Filter by agent
                            if (renewalAgentFilter !== 'all' && policy.agent !== renewalAgentFilter) {
                              return false;
                            }
                            // Filter by policy type
                            if (renewalPolicyTypeFilter !== 'all' && policy.policyType !== renewalPolicyTypeFilter) {
                              return false;
                            }
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
            </Grid >
          </Grid >
        )
      }

      {
        currentTab === 5 && (
          <Grid container spacing={3}>
            {/* CSC Productivity Summary */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total CSCs</Typography>
                          <Typography variant="h3" fontWeight="700">{cscProductivityData.length}</Typography>
                        </Box>
                        <PeopleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Calls</Typography>
                          <Typography variant="h3" fontWeight="700">{cscProductivityData.reduce((sum, csc) => sum + csc.calls, 0)}</Typography>
                        </Box>
                        <PhoneIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Policies</Typography>
                          <Typography variant="h3" fontWeight="700">{cscProductivityData.reduce((sum, csc) => sum + csc.policies, 0)}</Typography>
                        </Box>
                        <PolicyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Avg Conversion</Typography>
                          <Typography variant="h3" fontWeight="700">{(cscProductivityData.reduce((sum, csc) => sum + csc.conversionRate, 0) / cscProductivityData.length).toFixed(1)}%</Typography>
                        </Box>
                        <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* CSC Filters */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Performance"
                        value={cscFilter}
                        onChange={(e) => setCscFilter(e.target.value)}
                      >
                        <MenuItem value="all">All CSCs</MenuItem>
                        <MenuItem value="excellent">Excellent</MenuItem>
                        <MenuItem value="good">Good</MenuItem>
                        <MenuItem value="average">Average</MenuItem>
                        <MenuItem value="needs-improvement">Needs Improvement</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Region"
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Regions</MenuItem>
                        {regions.map((region) => (
                          <MenuItem key={region} value={region}>{region}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Score"
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Scores</MenuItem>
                        <MenuItem value="excellent">Excellent (≥90)</MenuItem>
                        <MenuItem value="good">Good (80-89)</MenuItem>
                        <MenuItem value="average">Average (70-79)</MenuItem>
                        <MenuItem value="poor">Poor (&lt;70)</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleResetCSCFilters}
                        sx={{ height: '56px' }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
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

            {/* CSC Performance Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    CSC Performance Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Excellent', value: cscProductivityData.filter(c => c.performance === 'Excellent').length, color: theme.palette.success.main },
                          { name: 'Good', value: cscProductivityData.filter(c => c.performance === 'Good').length, color: theme.palette.primary.main },
                          { name: 'Average', value: cscProductivityData.filter(c => c.performance === 'Average').length, color: theme.palette.warning.main },
                          { name: 'Needs Improvement', value: cscProductivityData.filter(c => c.performance === 'Needs Improvement').length, color: theme.palette.error.main }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {[
                          { name: 'Excellent', value: cscProductivityData.filter(c => c.performance === 'Excellent').length, color: theme.palette.success.main },
                          { name: 'Good', value: cscProductivityData.filter(c => c.performance === 'Good').length, color: theme.palette.primary.main },
                          { name: 'Average', value: cscProductivityData.filter(c => c.performance === 'Average').length, color: theme.palette.warning.main },
                          { name: 'Needs Improvement', value: cscProductivityData.filter(c => c.performance === 'Needs Improvement').length, color: theme.palette.error.main }
                        ].map((entry, index) => (
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

            {/* Conversion Rate Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    CSC Conversion Rates
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getFilteredCSCProductivityData().slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cscName" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="conversionRate" fill={theme.palette.primary.main} name="Conversion Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* CSC Productivity Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    CSC Productivity Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Comprehensive performance analysis of Customer Service Center representatives.
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>CSC Name</TableCell>
                          <TableCell align="center">Region</TableCell>
                          <TableCell align="center">Calls</TableCell>
                          <TableCell align="center">Policies</TableCell>
                          <TableCell align="center">Conversion %</TableCell>
                          <TableCell align="center">Score</TableCell>
                          <TableCell align="center">Performance</TableCell>
                          <TableCell>Progress</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getFilteredCSCProductivityData()
                          .filter(csc => {
                            if (cscFilter === 'all') return true;
                            if (cscFilter === 'excellent') return csc.performance === 'Excellent';
                            if (cscFilter === 'good') return csc.performance === 'Good';
                            if (cscFilter === 'average') return csc.performance === 'Average';
                            if (cscFilter === 'needs-improvement') return csc.performance === 'Needs Improvement';
                            return true;
                          })
                          .filter(csc => regionFilter === 'all' || csc.region === regionFilter)
                          .filter(csc => {
                            if (scoreFilter === 'all') return true;
                            if (scoreFilter === 'excellent') return csc.score >= 90;
                            if (scoreFilter === 'good') return csc.score >= 80 && csc.score < 90;
                            if (scoreFilter === 'average') return csc.score >= 70 && csc.score < 80;
                            if (scoreFilter === 'poor') return csc.score < 70;
                            return true;
                          })
                          .map((csc) => (
                            <TableRow key={csc.cscName} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {csc.cscName}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip label={csc.region} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600">
                                  {csc.calls}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600" color="primary.main">
                                  {csc.policies}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${csc.conversionRate}%`}
                                  size="small"
                                  color={csc.conversionRate >= 20 ? 'success' : csc.conversionRate >= 15 ? 'warning' : 'error'}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                  <Typography variant="body2" fontWeight="600">
                                    {csc.score}
                                  </Typography>
                                  <StarIcon
                                    fontSize="small"
                                    sx={{
                                      color: csc.score >= 90 ? theme.palette.success.main :
                                        csc.score >= 80 ? theme.palette.warning.main :
                                          theme.palette.error.main
                                    }}
                                  />
                                </Stack>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={csc.performance}
                                  size="small"
                                  color={
                                    csc.performance === 'Excellent' ? 'success' :
                                      csc.performance === 'Good' ? 'primary' :
                                        csc.performance === 'Average' ? 'warning' : 'error'
                                  }
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
                                        width: `${csc.score}%`,
                                        height: '100%',
                                        bgcolor: csc.score >= 90 ? theme.palette.success.main :
                                          csc.score >= 80 ? theme.palette.warning.main :
                                            theme.palette.error.main,
                                        borderRadius: 1
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="caption" fontWeight="600">
                                    {csc.score}%
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
          </Grid >
        )
      }

      {
        currentTab === 6 && (
          <Grid container spacing={3}>
            {/* Lost Reasons Summary */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Lost Leads</Typography>
                          <Typography variant="h3" fontWeight="700">{lostLeadsDetails.length}</Typography>
                        </Box>
                        <CancelIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Top Reason</Typography>
                          <Typography variant="h6" fontWeight="700">High Premium</Typography>
                          <Typography variant="caption">35.7% of losses</Typography>
                        </Box>
                        <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Lost Revenue</Typography>
                          <Typography variant="h3" fontWeight="700">₹2.1Cr</Typography>
                        </Box>
                        <TrendingDownIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Recovery Rate</Typography>
                          <Typography variant="h3" fontWeight="700">12%</Typography>
                        </Box>
                        <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
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
                        label="Filter by Reason"
                        value={lostReasonFilter}
                        onChange={(e) => setLostReasonFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Reasons</MenuItem>
                        <MenuItem value="High Premium">High Premium</MenuItem>
                        <MenuItem value="Better Competitor Offer">Better Competitor Offer</MenuItem>
                        <MenuItem value="Poor Service Experience">Poor Service Experience</MenuItem>
                        <MenuItem value="Coverage Issues">Coverage Issues</MenuItem>
                        <MenuItem value="Financial Constraints">Financial Constraints</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Product Type"
                        value={productTypeFilter}
                        onChange={(e) => setProductTypeFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Products</MenuItem>
                        {productTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type} Insurance</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Agent"
                        value={agentFilter}
                        onChange={(e) => setAgentFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Agents</MenuItem>
                        {agents.map((agent) => (
                          <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleResetLostReasonFilters}
                        sx={{ height: '56px' }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Lost Reasons Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={lostReasonsData}
                        dataKey="count"
                        nameKey="reason"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                      >
                        {lostReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                    Monthly Lost Reasons Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyLostReasons}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="highPremium" stackId="a" fill={theme.palette.error.main} name="High Premium" />
                      <Bar dataKey="competitor" stackId="a" fill={theme.palette.warning.main} name="Competitor" />
                      <Bar dataKey="service" stackId="a" fill={theme.palette.info.main} name="Service" />
                      <Bar dataKey="coverage" stackId="a" fill={theme.palette.primary.main} name="Coverage" />
                      <Bar dataKey="financial" stackId="a" fill={theme.palette.success.main} name="Financial" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Lost Leads Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Lost Leads Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Detailed analysis of lost leads with reasons and competitor information.
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Lead ID</TableCell>
                          <TableCell>Customer Name</TableCell>
                          <TableCell>Policy Type</TableCell>
                          <TableCell>Agent</TableCell>
                          <TableCell align="center">Lost Date</TableCell>
                          <TableCell>Lost Reason</TableCell>
                          <TableCell align="right">Premium</TableCell>

                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getFilteredLostLeadsDetails()
                          .filter(lead => {
                            if (lostReasonFilter !== 'all' && lead.reason !== lostReasonFilter) return false;
                            if (productTypeFilter !== 'all' && lead.policyType !== productTypeFilter) return false;
                            if (agentFilter !== 'all' && lead.agent !== agentFilter) return false;
                            return true;
                          })
                          .map((lead) => (
                            <TableRow key={lead.id} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600" color="primary.main">
                                  {lead.id}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="500">
                                  {lead.customerName}
                                </Typography>
                              </TableCell>
                              <TableCell>{lead.policyType} Insurance</TableCell>
                              <TableCell>{lead.agent}</TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {new Date(lead.lostDate).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={lead.reason}
                                  size="small"
                                  color={
                                    lead.reason === 'High Premium' ? 'error' :
                                      lead.reason === 'Better Competitor Offer' ? 'warning' :
                                        lead.reason === 'Poor Service Experience' ? 'info' :
                                          lead.reason === 'Coverage Issues' ? 'primary' : 'success'
                                  }
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="600">
                                  ₹{lead.premium.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="text.secondary">
                                  {lead.notes}
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
        )
      }

      {
        currentTab === 7 && (
          <Grid container spacing={3}>
            {/* Conversion Summary */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Overall Conversion</Typography>
                          <Typography variant="h3" fontWeight="700">32.1%</Typography>
                        </Box>
                        <AnalyticsIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Best Performer</Typography>
                          <Typography variant="h6" fontWeight="700">Sarah Johnson</Typography>
                          <Typography variant="caption">35.4% conversion</Typography>
                        </Box>
                        <StarIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Converted</Typography>
                          <Typography variant="h3" fontWeight="700">367</Typography>
                        </Box>
                        <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Conversion Revenue</Typography>
                          <Typography variant="h3" fontWeight="700">₹15.8Cr</Typography>
                        </Box>
                        <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
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
                        label="Date Range"
                        value={conversionDateFilter}
                        onChange={(e) => setConversionDateFilter(e.target.value)}
                      >
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="thisWeek">This Week</MenuItem>
                        <MenuItem value="thisMonth">This Month</MenuItem>
                        <MenuItem value="lastMonth">Last Month</MenuItem>
                        <MenuItem value="thisQuarter">This Quarter</MenuItem>
                        <MenuItem value="thisYear">This Year</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Agent"
                        value={conversionAgentFilter}
                        onChange={(e) => setConversionAgentFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Agents</MenuItem>
                        {agents.map((agent) => (
                          <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Product Type"
                        value={conversionProductFilter}
                        onChange={(e) => setConversionProductFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Products</MenuItem>
                        {productTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type} Insurance</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleResetConversionFilters}
                        sx={{ height: '56px' }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Agent vs Conversion Rate
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getFilteredConversionReportsData().slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="agent" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="conversionRate" fill={theme.palette.primary.main} name="Conversion Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Monthly Conversion Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyConversionTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="conversionRate" stroke={theme.palette.success.main} strokeWidth={3} name="Conversion Rate (%)" />
                      <Line type="monotone" dataKey="totalLeads" stroke={theme.palette.primary.main} strokeWidth={2} name="Total Leads" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Detailed Conversion Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Agent-wise Conversion Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Comprehensive conversion tracking with agent performance metrics.
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Agent Name</TableCell>
                          <TableCell align="center">Total Leads</TableCell>
                          <TableCell align="center">Converted Leads</TableCell>
                          <TableCell align="center">Conversion Rate</TableCell>
                          <TableCell align="right">Revenue Generated</TableCell>
                          <TableCell align="center">Primary Product</TableCell>
                          <TableCell>Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getFilteredConversionReportsData()
                          .filter(agent => {
                            if (conversionAgentFilter !== 'all' && agent.agent !== conversionAgentFilter) return false;
                            if (conversionProductFilter !== 'all' && agent.productType !== conversionProductFilter) return false;
                            return true;
                          })
                          .map((agent) => (
                            <TableRow key={agent.agent} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {agent.agent}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600">
                                  {agent.totalLeads}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600" color="primary.main">
                                  {agent.convertedLeads}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${agent.conversionRate}%`}
                                  size="small"
                                  color={agent.conversionRate >= 35 ? 'success' : agent.conversionRate >= 30 ? 'primary' : agent.conversionRate >= 25 ? 'warning' : 'error'}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="600" color="success.main">
                                  ₹{(agent.revenue / 100000).toFixed(1)}L
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip label={agent.productType} size="small" variant="outlined" />
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
                                        width: `${agent.conversionRate}%`,
                                        height: '100%',
                                        bgcolor: agent.conversionRate >= 35 ? theme.palette.success.main :
                                          agent.conversionRate >= 30 ? theme.palette.primary.main :
                                            agent.conversionRate >= 25 ? theme.palette.warning.main :
                                              theme.palette.error.main,
                                        borderRadius: 1
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="caption" fontWeight="600">
                                    {agent.conversionRate}%
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

            {/* Product-wise Conversion Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Product-wise Conversion Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Conversion performance breakdown by insurance product categories.
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product Type</TableCell>
                          <TableCell align="center">Total Leads</TableCell>
                          <TableCell align="center">Converted Leads</TableCell>
                          <TableCell align="center">Conversion Rate</TableCell>
                          <TableCell align="right">Avg Deal Value</TableCell>
                          <TableCell>Performance Indicator</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productWiseConversion
                          .filter(product => conversionProductFilter === 'all' || product.product === conversionProductFilter)
                          .map((product) => (
                            <TableRow key={product.product} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {product.product} Insurance
                                </Typography>
                              </TableCell>
                              <TableCell align="center">{product.totalLeads}</TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600" color="primary.main">
                                  {product.convertedLeads}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${product.conversionRate}%`}
                                  size="small"
                                  color={product.conversionRate >= 35 ? 'success' : product.conversionRate >= 30 ? 'primary' : 'warning'}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="600">
                                  ₹{product.avgDealValue.toLocaleString()}
                                </Typography>
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
                                        width: `${product.conversionRate}%`,
                                        height: '100%',
                                        bgcolor: product.conversionRate >= 35 ? theme.palette.success.main :
                                          product.conversionRate >= 30 ? theme.palette.primary.main :
                                            theme.palette.warning.main,
                                        borderRadius: 1
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="caption" fontWeight="600">
                                    {product.conversionRate}%
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
        )
      }

      {
        currentTab === 8 && (
          <Grid container spacing={3}>
            {/* Pivot Summary */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Records</Typography>
                          <Typography variant="h3" fontWeight="700">{getPivotData().reduce((sum, item) => sum + item.policies, 0)}</Typography>
                        </Box>
                        <TableViewIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Top Performer</Typography>
                          <Typography variant="h6" fontWeight="700">{getPivotData()[0]?.insurer || getPivotData()[0]?.csc || getPivotData()[0]?.tenure}</Typography>
                          <Typography variant="caption">{getPivotData()[0]?.policies} policies</Typography>
                        </Box>
                        <StarIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Premium</Typography>
                          <Typography variant="h3" fontWeight="700">₹{(getPivotData().reduce((sum, item) => sum + item.premium, 0) / 10000000).toFixed(1)}Cr</Typography>
                        </Box>
                        <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Avg Performance</Typography>
                          <Typography variant="h3" fontWeight="700">{pivotGroupBy === 'insurer' ? '11.4%' : pivotGroupBy === 'csc' ? '89.9%' : '87.3%'}</Typography>
                        </Box>
                        <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Pivot Filters */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Group By"
                        value={pivotGroupBy}
                        onChange={(e) => setPivotGroupBy(e.target.value)}
                      >
                        <MenuItem value="insurer">Insurer</MenuItem>
                        <MenuItem value="csc">CSC</MenuItem>
                        <MenuItem value="tenure">Tenure</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Date Range"
                        value={pivotDateFilter}
                        onChange={(e) => setPivotDateFilter(e.target.value)}
                      >
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="thisWeek">This Week</MenuItem>
                        <MenuItem value="thisMonth">This Month</MenuItem>
                        <MenuItem value="lastMonth">Last Month</MenuItem>
                        <MenuItem value="thisQuarter">This Quarter</MenuItem>
                        <MenuItem value="thisYear">This Year</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Product Filter"
                        value={pivotProductFilter}
                        onChange={(e) => setPivotProductFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Products</MenuItem>
                        {productTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type} Insurance</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleResetPivotFilters}
                        sx={{ height: '56px' }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Pivot Charts */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {pivotGroupBy === 'insurer' ? 'Insurer-wise' : pivotGroupBy === 'csc' ? 'CSC-wise' : 'Tenure-wise'} Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPivotChartData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {getPivotChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                    Policy Count Comparison
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPivotChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill={theme.palette.primary.main} name="Policies" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Dynamic Pivot Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {pivotGroupBy === 'insurer' ? 'Insurer-wise' : pivotGroupBy === 'csc' ? 'CSC-wise' : 'Tenure-wise'} Pivot Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Dynamic pivot report grouped by {pivotGroupBy} with comprehensive metrics and performance indicators.
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{pivotGroupBy === 'insurer' ? 'Insurer Name' : pivotGroupBy === 'csc' ? 'CSC Location' : 'Policy Tenure'}</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="center">Policies</TableCell>
                          <TableCell align="right">Premium Amount</TableCell>
                          <TableCell align="center">
                            {pivotGroupBy === 'insurer' ? 'Claims' : pivotGroupBy === 'csc' ? 'Agents' : 'Renewal Rate'}
                          </TableCell>
                          <TableCell align="center">
                            {pivotGroupBy === 'insurer' ? 'Claim Ratio' : pivotGroupBy === 'csc' ? 'Avg Per Agent' : 'Avg Premium'}
                          </TableCell>
                          <TableCell align="center">
                            {pivotGroupBy === 'insurer' ? 'Market Share' : pivotGroupBy === 'csc' ? 'Efficiency' : 'Satisfaction'}
                          </TableCell>
                          <TableCell>Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getPivotData()
                          .filter(item => {
                            const matchesProduct = pivotProductFilter === 'all' || item.product === pivotProductFilter;
                            return matchesProduct;
                          })
                          .map((item, index) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {item.insurer || item.csc || item.tenure}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={item.product} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600" color="primary.main">
                                  {item.policies}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="600" color="success.main">
                                  ₹{(item.premium / 100000).toFixed(1)}L
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                {pivotGroupBy === 'insurer' && (
                                  <Typography variant="body2">{item.claims}</Typography>
                                )}
                                {pivotGroupBy === 'csc' && (
                                  <Typography variant="body2">{item.agents}</Typography>
                                )}
                                {pivotGroupBy === 'tenure' && (
                                  <Chip label={`${item.renewalRate}%`} size="small" color="success" />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {pivotGroupBy === 'insurer' && (
                                  <Chip
                                    label={`${item.claimRatio}%`}
                                    size="small"
                                    color={item.claimRatio <= 8 ? 'success' : item.claimRatio <= 12 ? 'warning' : 'error'}
                                  />
                                )}
                                {pivotGroupBy === 'csc' && (
                                  <Typography variant="body2" fontWeight="600">{item.avgPerAgent}</Typography>
                                )}
                                {pivotGroupBy === 'tenure' && (
                                  <Typography variant="body2" fontWeight="600">₹{item.avgPremium.toLocaleString()}</Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {pivotGroupBy === 'insurer' && (
                                  <Chip
                                    label={`${item.marketShare}%`}
                                    size="small"
                                    color={item.marketShare >= 25 ? 'success' : item.marketShare >= 15 ? 'primary' : 'warning'}
                                  />
                                )}
                                {pivotGroupBy === 'csc' && (
                                  <Chip
                                    label={`${item.efficiency}%`}
                                    size="small"
                                    color={item.efficiency >= 90 ? 'success' : item.efficiency >= 85 ? 'primary' : 'warning'}
                                  />
                                )}
                                {pivotGroupBy === 'tenure' && (
                                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                    <Typography variant="body2" fontWeight="600">{item.satisfaction}</Typography>
                                    <StarIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                                  </Stack>
                                )}
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
                                        width: `${pivotGroupBy === 'insurer' ? item.marketShare * 2 : pivotGroupBy === 'csc' ? item.efficiency : item.renewalRate}%`,
                                        height: '100%',
                                        bgcolor: theme.palette.primary.main,
                                        borderRadius: 1
                                      }}
                                    />
                                  </Box>
                                  <Typography variant="caption" fontWeight="600">
                                    {pivotGroupBy === 'insurer' ? `${item.marketShare}%` : pivotGroupBy === 'csc' ? `${item.efficiency}%` : `${item.renewalRate}%`}
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
        )
      }

      {
        currentTab === 9 && (
          <Grid container spacing={3}>
            {/* Premium Registers Filters */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={2.5}>
                      <TextField
                        fullWidth
                        select
                        label="Insurer"
                        value={premiumSelectedInsurer}
                        onChange={(e) => setPremiumSelectedInsurer(e.target.value)}
                      >
                        <MenuItem value="all">All Insurers</MenuItem>
                        <MenuItem value="HDFC ERGO">HDFC ERGO</MenuItem>
                        <MenuItem value="ICICI Lombard">ICICI Lombard</MenuItem>
                        <MenuItem value="Bajaj Allianz">Bajaj Allianz</MenuItem>
                        <MenuItem value="TATA AIG">TATA AIG</MenuItem>
                        <MenuItem value="Reliance General">Reliance General</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.5}>
                      <TextField
                        fullWidth
                        select
                        label="Policy Type"
                        value={premiumSelectedPolicyType}
                        onChange={(e) => setPremiumSelectedPolicyType(e.target.value)}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="Health">Health</MenuItem>
                        <MenuItem value="Motor">Motor</MenuItem>
                        <MenuItem value="Life">Life</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.5}>
                      <TextField
                        fullWidth
                        select
                        label="Tenure"
                        value={premiumSelectedTenure}
                        onChange={(e) => setPremiumSelectedTenure(e.target.value)}
                      >
                        <MenuItem value="all">All Tenures</MenuItem>
                        <MenuItem value="3 Months">3 Months</MenuItem>
                        <MenuItem value="6 Months">6 Months</MenuItem>
                        <MenuItem value="12 Months">12 Months</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.5}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ height: '56px' }}
                        onClick={() => {
                          setPremiumSelectedInsurer('all');
                          setPremiumSelectedPolicyType('all');
                          setPremiumSelectedTenure('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Premium Summary Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Premium Registers - Tenure Breakdown
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Insurer</TableCell>
                          <TableCell>Policy Type</TableCell>
                          <TableCell>Tenure</TableCell>
                          <TableCell align="center">Total Policies</TableCell>
                          <TableCell align="right">Total Premium</TableCell>
                          <TableCell align="right">Average Premium</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { insurer: 'HDFC ERGO', type: 'Health', tenure: '3 Months', policies: 45, premium: '₹4,50,000', avg: '₹10,000' },
                          { insurer: 'ICICI Lombard', type: 'Motor', tenure: '6 Months', policies: 120, premium: '₹14,40,000', avg: '₹12,000' },
                          { insurer: 'Bajaj Allianz', type: 'Life', tenure: '12 Months', policies: 200, premium: '₹30,000,000', avg: '₹150,000' },
                          { insurer: 'TATA AIG', type: 'Health', tenure: '12 Months', policies: 150, premium: '₹22,50,000', avg: '₹15,000' },
                          { insurer: 'Reliance General', type: 'Motor', tenure: '3 Months', policies: 80, premium: '₹6,40,000', avg: '₹8,000' },
                          { insurer: 'HDFC ERGO', type: 'Life', tenure: '6 Months', policies: 50, premium: '₹5,000,000', avg: '₹100,000' },
                          { insurer: 'ICICI Lombard', type: 'Health', tenure: '12 Months', policies: 180, premium: '₹27,00,000', avg: '₹15,000' },
                          { insurer: 'Bajaj Allianz', type: 'Motor', tenure: '3 Months', policies: 60, premium: '₹4,80,000', avg: '₹8,000' }
                        ].filter(row => {
                          const matchesInsurer = premiumSelectedInsurer === 'all' || row.insurer === premiumSelectedInsurer;
                          const matchesType = premiumSelectedPolicyType === 'all' || row.type === premiumSelectedPolicyType;
                          const matchesTenure = premiumSelectedTenure === 'all' || row.tenure === premiumSelectedTenure;
                          return matchesInsurer && matchesType && matchesTenure;
                        }).map((row, index) => (
                          <TableRow key={index} hover>
                            <TableCell><Typography fontWeight="600">{row.insurer}</Typography></TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.tenure}</TableCell>
                            <TableCell align="center">{row.policies}</TableCell>
                            <TableCell align="right">{row.premium}</TableCell>
                            <TableCell align="right">{row.avg}</TableCell>
                          </TableRow>
                        ))}
                        {[
                          { insurer: 'HDFC ERGO', type: 'Health', tenure: '3 Months', policies: 45, premium: '₹4,50,000', avg: '₹10,000' },
                          { insurer: 'ICICI Lombard', type: 'Motor', tenure: '6 Months', policies: 120, premium: '₹14,40,000', avg: '₹12,000' },
                          { insurer: 'Bajaj Allianz', type: 'Life', tenure: '12 Months', policies: 200, premium: '₹30,000,000', avg: '₹150,000' },
                          { insurer: 'TATA AIG', type: 'Health', tenure: '12 Months', policies: 150, premium: '₹22,50,000', avg: '₹15,000' },
                          { insurer: 'Reliance General', type: 'Motor', tenure: '3 Months', policies: 80, premium: '₹6,40,000', avg: '₹8,000' },
                          { insurer: 'HDFC ERGO', type: 'Life', tenure: '6 Months', policies: 50, premium: '₹5,000,000', avg: '₹100,000' },
                          { insurer: 'ICICI Lombard', type: 'Health', tenure: '12 Months', policies: 180, premium: '₹27,00,000', avg: '₹15,000' },
                          { insurer: 'Bajaj Allianz', type: 'Motor', tenure: '3 Months', policies: 60, premium: '₹4,80,000', avg: '₹8,000' }
                        ].filter(row => {
                          const matchesInsurer = premiumSelectedInsurer === 'all' || row.insurer === premiumSelectedInsurer;
                          const matchesType = premiumSelectedPolicyType === 'all' || row.type === premiumSelectedPolicyType;
                          const matchesTenure = premiumSelectedTenure === 'all' || row.tenure === premiumSelectedTenure;
                          return matchesInsurer && matchesType && matchesTenure;
                        }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                  No records found for the selected filters.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Premium Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Premium Distribution by Tenure
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: '3M', value: 12.5, color: theme.palette.primary.main },
                          { name: '6M', value: 35.8, color: theme.palette.success.main },
                          { name: '12M', value: 89.4, color: theme.palette.warning.main }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ₹${value}L`}
                      >
                        {[
                          { name: '3M', value: 12.5, color: theme.palette.primary.main },
                          { name: '6M', value: 35.8, color: theme.palette.success.main },
                          { name: '12M', value: 89.4, color: theme.palette.warning.main }
                        ].map((entry, index) => (
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

            {/* Export Options */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Export Options
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                    >
                      Export as Excel (.xlsx)
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      fullWidth
                    >
                      Export as PDF
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
      }

      {
        currentTab === 10 && (
          <Grid container spacing={3}>
            {/* Daily Insurer MIS Filters */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Select Insurer"
                        value={dailyMISSelectedInsurer}
                        onChange={(e) => setDailyMISSelectedInsurer(e.target.value)}
                      >
                        <MenuItem value="all">All Insurers</MenuItem>
                        <MenuItem value="TATA AIG">TATA AIG</MenuItem>
                        <MenuItem value="Reliance General">Reliance General</MenuItem>
                        <MenuItem value="HDFC ERGO">HDFC ERGO</MenuItem>
                        <MenuItem value="ICICI Lombard">ICICI Lombard</MenuItem>
                        <MenuItem value="Bajaj Allianz">Bajaj Allianz</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Select Date"
                        value={dailyMISSelectedDate}
                        onChange={(e) => setDailyMISSelectedDate(e.target.value)}
                      >
                        <MenuItem value="all">All Dates</MenuItem>
                        <MenuItem value="Jan 31, 2025">Jan 31, 2025</MenuItem>
                        <MenuItem value="Jan 30, 2025">Jan 30, 2025</MenuItem>
                        <MenuItem value="Jan 29, 2025">Jan 29, 2025</MenuItem>
                        <MenuItem value="Jan 28, 2025">Jan 28, 2025</MenuItem>
                        <MenuItem value="Jan 27, 2025">Jan 27, 2025</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Conversion"
                        value={dailyMISConversionFilter}
                        onChange={(e) => setDailyMISConversionFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Conversions</MenuItem>
                        <MenuItem value="high">High (≥30%)</MenuItem>
                        <MenuItem value="medium">Medium (20-29%)</MenuItem>
                        <MenuItem value="low">Low (&lt;20%)</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ height: '56px' }}
                        onClick={() => {
                          setDailyMISSelectedInsurer('all');
                          setDailyMISSelectedDate('all');
                          setDailyMISConversionFilter('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Daily MIS Summary Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Premium</Typography>
                          <Typography variant="h3" fontWeight="700">₹8.5L</Typography>
                        </Box>
                        <AttachMoneyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Policies Sold</Typography>
                          <Typography variant="h3" fontWeight="700">42</Typography>
                        </Box>
                        <PolicyIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Leads Generated</Typography>
                          <Typography variant="h3" fontWeight="700">128</Typography>
                        </Box>
                        <PeopleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Conversion Rate</Typography>
                          <Typography variant="h3" fontWeight="700">32.8%</Typography>
                        </Box>
                        <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Daily MIS Table */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Daily Insurer MIS Data
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Insurer</TableCell>
                          <TableCell align="center">Leads</TableCell>
                          <TableCell align="center">Policies</TableCell>
                          <TableCell align="right">Premium</TableCell>
                          <TableCell align="center">Conversion %</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { date: 'Jan 31, 2025', insurer: 'TATA AIG', leads: 128, policies: 42, premium: '₹8,50,000', conversion: 32.8, color: 'success' },
                          { date: 'Jan 30, 2025', insurer: 'Reliance General', leads: 115, policies: 38, premium: '₹7,20,000', conversion: 33.0, color: 'success' },
                          { date: 'Jan 29, 2025', insurer: 'HDFC ERGO', leads: 142, policies: 45, premium: '₹9,80,000', conversion: 31.7, color: 'success' },
                          { date: 'Jan 28, 2025', insurer: 'ICICI Lombard', leads: 98, policies: 28, premium: '₹6,40,000', conversion: 28.6, color: 'warning' },
                          { date: 'Jan 27, 2025', insurer: 'Bajaj Allianz', leads: 156, policies: 52, premium: '₹11,20,000', conversion: 33.3, color: 'success' },
                          { date: 'Jan 31, 2025', insurer: 'Reliance General', leads: 95, policies: 30, premium: '₹5,50,000', conversion: 31.5, color: 'success' },
                          { date: 'Jan 30, 2025', insurer: 'TATA AIG', leads: 110, policies: 35, premium: '₹6,80,000', conversion: 31.8, color: 'success' }
                        ].filter(row => {
                          const matchesInsurer = dailyMISSelectedInsurer === 'all' || row.insurer === dailyMISSelectedInsurer;
                          const matchesDate = dailyMISSelectedDate === 'all' || row.date === dailyMISSelectedDate;
                          let matchesConversion = true;
                          if (dailyMISConversionFilter === 'high') matchesConversion = row.conversion >= 30;
                          if (dailyMISConversionFilter === 'medium') matchesConversion = row.conversion >= 20 && row.conversion < 30;
                          if (dailyMISConversionFilter === 'low') matchesConversion = row.conversion < 20;
                          return matchesInsurer && matchesDate && matchesConversion;
                        }).map((row, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.insurer}</TableCell>
                            <TableCell align="center">{row.leads}</TableCell>
                            <TableCell align="center">{row.policies}</TableCell>
                            <TableCell align="right">{row.premium}</TableCell>
                            <TableCell align="center">
                              <Chip label={`${row.conversion}%`} size="small" color={row.color} />
                            </TableCell>
                          </TableRow>
                        ))}
                        {[
                          { date: 'Jan 31, 2025', insurer: 'TATA AIG', leads: 128, policies: 42, premium: '₹8,50,000', conversion: 32.8, color: 'success' },
                          { date: 'Jan 30, 2025', insurer: 'Reliance General', leads: 115, policies: 38, premium: '₹7,20,000', conversion: 33.0, color: 'success' },
                          { date: 'Jan 29, 2025', insurer: 'HDFC ERGO', leads: 142, policies: 45, premium: '₹9,80,000', conversion: 31.7, color: 'success' },
                          { date: 'Jan 28, 2025', insurer: 'ICICI Lombard', leads: 98, policies: 28, premium: '₹6,40,000', conversion: 28.6, color: 'warning' },
                          { date: 'Jan 27, 2025', insurer: 'Bajaj Allianz', leads: 156, policies: 52, premium: '₹11,20,000', conversion: 33.3, color: 'success' },
                          { date: 'Jan 31, 2025', insurer: 'Reliance General', leads: 95, policies: 30, premium: '₹5,50,000', conversion: 31.5, color: 'success' },
                          { date: 'Jan 30, 2025', insurer: 'TATA AIG', leads: 110, policies: 35, premium: '₹6,80,000', conversion: 31.8, color: 'success' }
                        ].filter(row => {
                          const matchesInsurer = dailyMISSelectedInsurer === 'all' || row.insurer === dailyMISSelectedInsurer;
                          const matchesDate = dailyMISSelectedDate === 'all' || row.date === dailyMISSelectedDate;
                          return matchesInsurer && matchesDate;
                        }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                  No records found for the selected filters.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Daily Trend Chart */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Daily Premium Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { date: 'Jan 27', premium: 11.2 },
                      { date: 'Jan 28', premium: 6.4 },
                      { date: 'Jan 29', premium: 9.8 },
                      { date: 'Jan 30', premium: 7.2 },
                      { date: 'Jan 31', premium: 8.5 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`₹${value}L`, 'Premium']} />
                      <Bar dataKey="premium" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Download Options */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Download Options
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                    >
                      Export as Excel
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      onClick={handleExportPDF}
                    >
                      Export as PDF
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
      }



      {
        currentTab === 12 && (
          <Grid container spacing={3}>
            {/* Capacity Planning Filters */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        type="month"
                        label="Select Month"
                        value={capacitySelectedMonth}
                        onChange={(e) => setCapacitySelectedMonth(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Region/Team Filter"
                        value={capacitySelectedRegion}
                        onChange={(e) => setCapacitySelectedRegion(e.target.value)}
                      >
                        <MenuItem value="all">All Regions</MenuItem>
                        <MenuItem value="North">North Region</MenuItem>
                        <MenuItem value="South">South Region</MenuItem>
                        <MenuItem value="East">East Region</MenuItem>
                        <MenuItem value="West">West Region</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Status"
                        value={capacityStatusFilter}
                        onChange={(e) => setCapacityStatusFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="at-capacity">At Capacity</MenuItem>
                        <MenuItem value="overloaded">Overloaded</MenuItem>
                        <MenuItem value="underutilized">Underutilized</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ height: '56px' }}
                        onClick={() => {
                          setCapacitySelectedMonth(new Date().toISOString().slice(0, 7));
                          setCapacitySelectedRegion('all');
                          setCapacityStatusFilter('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Alert Warning */}
            <Grid item xs={12}>
              <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), border: `1px solid ${theme.palette.warning.main}` }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <WarningIcon sx={{ color: theme.palette.warning.main }} />
                    <Typography variant="h6" color="warning.main" fontWeight="600">
                      ⚠️ Staffing Shortfall: Add 2 CSCs to meet capacity requirements
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Dashboard Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Leads</Typography>
                          <Typography variant="h3" fontWeight="700">1,250</Typography>
                        </Box>
                        <PeopleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Required CSCs</Typography>
                          <Typography variant="h3" fontWeight="700">10</Typography>
                        </Box>
                        <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Shortfall</Typography>
                          <Typography variant="h3" fontWeight="700">2</Typography>
                        </Box>
                        <WarningIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Available vs Required CSCs
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { region: 'North', available: 3, required: 4 },
                      { region: 'South', available: 2, required: 3 },
                      { region: 'East', available: 2, required: 2 },
                      { region: 'West', available: 1, required: 1 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="available" fill={theme.palette.success.main} name="Available CSCs" />
                      <Bar dataKey="required" fill={theme.palette.error.main} name="Required CSCs" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Workload Distribution by Region
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'North', value: 450, color: theme.palette.primary.main },
                          { name: 'South', value: 380, color: theme.palette.success.main },
                          { name: 'East', value: 250, color: theme.palette.warning.main },
                          { name: 'West', value: 170, color: theme.palette.info.main }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { name: 'North', value: 450, color: theme.palette.primary.main },
                          { name: 'South', value: 380, color: theme.palette.success.main },
                          { name: 'East', value: 250, color: theme.palette.warning.main },
                          { name: 'West', value: 170, color: theme.palette.info.main }
                        ].map((entry, index) => (
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



            {/* Table View */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    CSC Capacity Analysis
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>CSC</TableCell>
                          <TableCell>Month</TableCell>
                          <TableCell>Region</TableCell>
                          <TableCell align="center">Assigned Leads</TableCell>
                          <TableCell align="center">Capacity</TableCell>
                          <TableCell align="center">Utilization %</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { csc: 'North Team A', month: '2025-12', region: 'North', leads: 180, capacity: 150, utilization: 120.0, status: 'overloaded' },
                          { csc: 'North Team B', month: '2025-12', region: 'North', leads: 145, capacity: 150, utilization: 96.7, status: 'optimal' },
                          { csc: 'South Team A', month: '2025-12', region: 'South', leads: 165, capacity: 150, utilization: 110.0, status: 'overloaded' },
                          { csc: 'South Team B', month: '2025-12', region: 'South', leads: 125, capacity: 150, utilization: 83.3, status: 'underutilized' },
                          { csc: 'East Team A', month: '2025-12', region: 'East', leads: 130, capacity: 150, utilization: 86.7, status: 'optimal' },
                          { csc: 'West Team A', month: '2025-12', region: 'West', leads: 95, capacity: 150, utilization: 63.3, status: 'underutilized' },
                          { csc: 'North Team A', month: '2025-11', region: 'North', leads: 175, capacity: 150, utilization: 116.7, status: 'overloaded' },
                          { csc: 'South Team A', month: '2025-11', region: 'South', leads: 160, capacity: 150, utilization: 106.7, status: 'overloaded' }
                        ]
                          .filter(team => {
                            const matchesMonth = team.month === capacitySelectedMonth;
                            const matchesRegion = capacitySelectedRegion === 'all' || team.region === capacitySelectedRegion;
                            const matchesStatus = capacityStatusFilter === 'all' || team.status === (
                              capacityStatusFilter === 'available' ? 'available' :
                              capacityStatusFilter === 'at-capacity' ? 'optimal' :
                              capacityStatusFilter === 'overloaded' ? 'overloaded' :
                              capacityStatusFilter === 'underutilized' ? 'underutilized' : team.status
                            );
                            return matchesMonth && matchesRegion && matchesStatus;
                          })
                          .map((team, index) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {team.csc}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {new Date(team.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={team.region}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="600">
                                  {team.leads}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">{team.capacity}</TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${team.utilization}%`}
                                  size="small"
                                  color={
                                    team.status === 'overloaded' ? 'error' :
                                      team.status === 'optimal' ? 'success' : 'warning'
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={
                                    team.status === 'overloaded' ? 'Overloaded' :
                                      team.status === 'optimal' ? 'Optimal' : 'Under-utilized'
                                  }
                                  size="small"
                                  color={
                                    team.status === 'overloaded' ? 'error' :
                                      team.status === 'optimal' ? 'success' : 'warning'
                                  }
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {[
                          { csc: 'North Team A', month: '2025-12', region: 'North', leads: 180, capacity: 150, utilization: 120.0, status: 'overloaded' },
                          { csc: 'North Team B', month: '2025-12', region: 'North', leads: 145, capacity: 150, utilization: 96.7, status: 'optimal' },
                          { csc: 'South Team A', month: '2025-12', region: 'South', leads: 165, capacity: 150, utilization: 110.0, status: 'overloaded' },
                          { csc: 'South Team B', month: '2025-12', region: 'South', leads: 125, capacity: 150, utilization: 83.3, status: 'underutilized' },
                          { csc: 'East Team A', month: '2025-12', region: 'East', leads: 130, capacity: 150, utilization: 86.7, status: 'optimal' },
                          { csc: 'West Team A', month: '2025-12', region: 'West', leads: 95, capacity: 150, utilization: 63.3, status: 'underutilized' },
                          { csc: 'North Team A', month: '2025-11', region: 'North', leads: 175, capacity: 150, utilization: 116.7, status: 'overloaded' },
                          { csc: 'South Team A', month: '2025-11', region: 'South', leads: 160, capacity: 150, utilization: 106.7, status: 'overloaded' }
                        ].filter(team => {
                          const matchesMonth = team.month === capacitySelectedMonth;
                          const matchesRegion = capacitySelectedRegion === 'all' || team.region === capacitySelectedRegion;
                          return matchesMonth && matchesRegion;
                        }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                  No CSC capacity records found for the selected filters.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Try selecting a different month or region.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Export Options */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Export Options
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                    >
                      Export as Excel
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      onClick={handleExportPDF}
                    >
                      Export as PDF
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
      }

      {
        currentTab === 13 && (
          <Grid container spacing={3}>
            {/* Workload Distribution Summary */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total CSCs</Typography>
                          <Typography variant="h3" fontWeight="700">25</Typography>
                        </Box>
                        <PeopleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Average Utilization</Typography>
                          <Typography variant="h3" fontWeight="700">87.5%</Typography>
                        </Box>
                        <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Leads Assigned</Typography>
                          <Typography variant="h3" fontWeight="700">1,250</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Overloaded CSCs</Typography>
                          <Typography variant="h3" fontWeight="700">3</Typography>
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
                        label="Date Range"
                        value={workloadSelectedDateRange}
                        onChange={(e) => setWorkloadSelectedDateRange(e.target.value)}
                      >
                        <MenuItem value="thisMonth">This Month</MenuItem>
                        <MenuItem value="lastMonth">Last Month</MenuItem>
                        <MenuItem value="last3Months">Last 3 Months</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Region"
                        value={workloadSelectedRegion}
                        onChange={(e) => setWorkloadSelectedRegion(e.target.value)}
                      >
                        <MenuItem value="all">All Regions</MenuItem>
                        <MenuItem value="North">North</MenuItem>
                        <MenuItem value="South">South</MenuItem>
                        <MenuItem value="East">East</MenuItem>
                        <MenuItem value="West">West</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Team Filter"
                        value={workloadSelectedTeam}
                        onChange={(e) => setWorkloadSelectedTeam(e.target.value)}
                      >
                        <MenuItem value="all">All Teams</MenuItem>
                        <MenuItem value="North Team A">North Team A</MenuItem>
                        <MenuItem value="North Team B">North Team B</MenuItem>
                        <MenuItem value="South Team A">South Team A</MenuItem>
                        <MenuItem value="South Team B">South Team B</MenuItem>
                        <MenuItem value="East Team A">East Team A</MenuItem>
                        <MenuItem value="East Team B">East Team B</MenuItem>
                        <MenuItem value="West Team A">West Team A</MenuItem>
                        <MenuItem value="West Team B">West Team B</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ height: '56px' }}
                        onClick={() => {
                          setWorkloadSelectedDateRange('thisMonth');
                          setWorkloadSelectedRegion('all');
                          setWorkloadSelectedTeam('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    CSC Workload Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Rajesh Kumar', assigned: 65, completed: 58 },
                      { name: 'Priya Sharma', assigned: 72, completed: 75 },
                      { name: 'Amit Singh', assigned: 45, completed: 38 },
                      { name: 'Sneha Patel', assigned: 58, completed: 52 },
                      { name: 'Vikram Reddy', assigned: 68, completed: 71 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="assigned" fill={theme.palette.primary.main} name="Assigned Leads" />
                      <Bar dataKey="completed" fill={theme.palette.success.main} name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Workload Share
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Rajesh', value: 65, color: theme.palette.primary.main },
                          { name: 'Priya', value: 72, color: theme.palette.success.main },
                          { name: 'Amit', value: 45, color: theme.palette.warning.main },
                          { name: 'Sneha', value: 58, color: theme.palette.info.main },
                          { name: 'Vikram', value: 68, color: theme.palette.error.main }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: 'Rajesh', value: 65, color: theme.palette.primary.main },
                          { name: 'Priya', value: 72, color: theme.palette.success.main },
                          { name: 'Amit', value: 45, color: theme.palette.warning.main },
                          { name: 'Sneha', value: 58, color: theme.palette.info.main },
                          { name: 'Vikram', value: 68, color: theme.palette.error.main }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Detailed Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Detailed CSC Performance
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>CSC</TableCell>
                          <TableCell>Month</TableCell>
                          <TableCell>Region</TableCell>
                          <TableCell>Team</TableCell>
                          <TableCell align="right">Assigned</TableCell>
                          <TableCell align="right">Completed</TableCell>
                          <TableCell align="right">Utilization %</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { name: 'Rajesh Kumar', month: 'thisMonth', region: 'North', team: 'North Team A', assigned: 65, completed: 58, utilization: 89.2, status: 'balanced' },
                          { name: 'Priya Sharma', month: 'thisMonth', region: 'South', team: 'South Team A', assigned: 72, completed: 75, utilization: 104.2, status: 'overloaded' },
                          { name: 'Amit Singh', month: 'thisMonth', region: 'East', team: 'East Team A', assigned: 45, completed: 38, utilization: 84.4, status: 'underutilized' },
                          { name: 'Sneha Patel', month: 'thisMonth', region: 'West', team: 'West Team A', assigned: 58, completed: 52, utilization: 89.7, status: 'balanced' },
                          { name: 'Vikram Reddy', month: 'thisMonth', region: 'North', team: 'North Team B', assigned: 68, completed: 71, utilization: 104.4, status: 'overloaded' },
                          { name: 'Anita Desai', month: 'lastMonth', region: 'South', team: 'South Team B', assigned: 52, completed: 48, utilization: 92.3, status: 'balanced' },
                          { name: 'Ravi Nair', month: 'lastMonth', region: 'East', team: 'East Team B', assigned: 38, completed: 32, utilization: 84.2, status: 'underutilized' },
                          { name: 'Pooja Agarwal', month: 'lastMonth', region: 'West', team: 'West Team B', assigned: 61, completed: 65, utilization: 106.6, status: 'overloaded' }
                        ]
                          .filter(row => {
                            const matchesDateRange = workloadSelectedDateRange === 'last3Months' || row.month === workloadSelectedDateRange;
                            const matchesRegion = workloadSelectedRegion === 'all' || row.region === workloadSelectedRegion;
                            const matchesTeam = workloadSelectedTeam === 'all' || row.team === workloadSelectedTeam;
                            return matchesDateRange && matchesRegion && matchesTeam;
                          })
                          .map((row, index) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="600">
                                  {row.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {row.month === 'thisMonth' ? 'This Month' : row.month === 'lastMonth' ? 'Last Month' : 'Last 3 Months'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.region}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.team}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="right">{row.assigned}</TableCell>
                              <TableCell align="right">{row.completed}</TableCell>
                              <TableCell align="right">{row.utilization}%</TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${row.status === 'overloaded' ? '🔴' : row.status === 'balanced' ? '🟢' : '🟡'} ${row.status}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(
                                      row.status === 'overloaded' ? theme.palette.error.main :
                                        row.status === 'balanced' ? theme.palette.success.main :
                                          theme.palette.warning.main, 0.1
                                    ),
                                    color: row.status === 'overloaded' ? theme.palette.error.main :
                                      row.status === 'balanced' ? theme.palette.success.main :
                                        theme.palette.warning.main
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {[
                          { name: 'Rajesh Kumar', month: 'thisMonth', region: 'North', team: 'Team Alpha', assigned: 65, completed: 58, utilization: 89.2, status: 'balanced' },
                          { name: 'Priya Sharma', month: 'thisMonth', region: 'South', team: 'Team Beta', assigned: 72, completed: 75, utilization: 104.2, status: 'overloaded' },
                          { name: 'Amit Singh', month: 'thisMonth', region: 'East', team: 'Team Gamma', assigned: 45, completed: 38, utilization: 84.4, status: 'underutilized' },
                          { name: 'Sneha Patel', month: 'thisMonth', region: 'West', team: 'Team Alpha', assigned: 58, completed: 52, utilization: 89.7, status: 'balanced' },
                          { name: 'Vikram Reddy', month: 'thisMonth', region: 'North', team: 'Team Beta', assigned: 68, completed: 71, utilization: 104.4, status: 'overloaded' },
                          { name: 'Anita Desai', month: 'lastMonth', region: 'South', team: 'Team Gamma', assigned: 52, completed: 48, utilization: 92.3, status: 'balanced' },
                          { name: 'Ravi Nair', month: 'lastMonth', region: 'East', team: 'Team Alpha', assigned: 38, completed: 32, utilization: 84.2, status: 'underutilized' },
                          { name: 'Pooja Agarwal', month: 'lastMonth', region: 'West', team: 'Team Beta', assigned: 61, completed: 65, utilization: 106.6, status: 'overloaded' }
                        ].filter(row => {
                          const matchesDateRange = workloadSelectedDateRange === 'last3Months' || row.month === workloadSelectedDateRange;
                          const matchesRegion = workloadSelectedRegion === 'all' || row.region === workloadSelectedRegion;
                          const matchesTeam = workloadSelectedTeam === 'all' || row.team === workloadSelectedTeam;
                          return matchesDateRange && matchesRegion && matchesTeam;
                        }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                  No CSC performance records found for the selected filters.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Try selecting different date range, region, or team filters.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
      }

      {
        currentTab === 14 && (
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
        )
      }

      {
        currentTab === 11 && (
          <Grid container spacing={3}>
            {/* CSC Load Tracking Filters */}
            <Grid item xs={12}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        type="month"
                        label="Select Month"
                        value={cscSelectedMonth}
                        onChange={(e) => setCscSelectedMonth(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Select Region"
                        value={cscSelectedRegion}
                        onChange={(e) => setCscSelectedRegion(e.target.value)}
                      >
                        <MenuItem value="all">All Regions</MenuItem>
                        <MenuItem value="Mumbai">Mumbai</MenuItem>
                        <MenuItem value="Delhi">Delhi</MenuItem>
                        <MenuItem value="Bangalore">Bangalore</MenuItem>
                        <MenuItem value="Chennai">Chennai</MenuItem>
                        <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                        <MenuItem value="Pune">Pune</MenuItem>
                        <MenuItem value="Kolkata">Kolkata</MenuItem>
                        <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Performance"
                        value={cscPerformanceFilter}
                        onChange={(e) => setCscPerformanceFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Performance</MenuItem>
                        <MenuItem value="excellent">Excellent</MenuItem>
                        <MenuItem value="good">Good</MenuItem>
                        <MenuItem value="average">Average</MenuItem>
                        <MenuItem value="needs-improvement">Needs Improvement</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ height: '56px' }}
                        onClick={() => {
                          setCscSelectedMonth(new Date().toISOString().slice(0, 7));
                          setCscSelectedRegion('all');
                          setCscPerformanceFilter('all');
                        }}
                      >
                        Reset Filters
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Summary Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total CSCs</Typography>
                          <Typography variant="h3" fontWeight="700">8</Typography>
                        </Box>
                        <PeopleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>Average Calls per CSC</Typography>
                          <Typography variant="h3" fontWeight="700">578</Typography>
                        </Box>
                        <PhoneIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>% Meeting Target</Typography>
                          <Typography variant="h3" fontWeight="700">62.5%</Typography>
                        </Box>
                        <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* CSC Load Tracking Table */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    CSC Load Tracking Data
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>CSC Name</TableCell>
                          <TableCell>Month</TableCell>
                          <TableCell>Region</TableCell>
                          <TableCell align="center">Total Calls</TableCell>
                          <TableCell align="center">Policies Sold</TableCell>
                          <TableCell align="center">Conversion %</TableCell>
                          <TableCell align="center">Performance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { cscName: 'Priya Patel', month: '2025-12', region: 'Mumbai', calls: 145, policies: 28, conversion: 19.3, performance: 'Excellent' },
                          { cscName: 'Rahul Kumar', month: '2025-12', region: 'Delhi', calls: 132, policies: 24, conversion: 18.2, performance: 'Good' },
                          { cscName: 'Sarah Johnson', month: '2025-12', region: 'Bangalore', calls: 158, policies: 35, conversion: 22.2, performance: 'Excellent' },
                          { cscName: 'Amit Sharma', month: '2025-12', region: 'Chennai', calls: 118, policies: 18, conversion: 15.3, performance: 'Average' },
                          { cscName: 'Kavita Reddy', month: '2025-12', region: 'Hyderabad', calls: 125, policies: 22, conversion: 17.6, performance: 'Good' },
                          { cscName: 'Deepak Singh', month: '2025-12', region: 'Pune', calls: 98, policies: 12, conversion: 12.2, performance: 'Needs Improvement' },
                          { cscName: 'Meera Gupta', month: '2025-12', region: 'Kolkata', calls: 142, policies: 31, conversion: 21.8, performance: 'Excellent' },
                          { cscName: 'Vikram Joshi', month: '2025-12', region: 'Ahmedabad', calls: 108, policies: 15, conversion: 13.9, performance: 'Average' },
                          { cscName: 'Priya Patel', month: '2025-11', region: 'Mumbai', calls: 138, policies: 26, conversion: 18.8, performance: 'Good' },
                          { cscName: 'Rahul Kumar', month: '2025-11', region: 'Delhi', calls: 125, policies: 22, conversion: 17.6, performance: 'Good' }
                        ]
                          .filter((record) => {
                            const matchesMonth = record.month === cscSelectedMonth;
                            const matchesRegion = cscSelectedRegion === 'all' || record.region === cscSelectedRegion;
                            const matchesPerformance = cscPerformanceFilter === 'all' || record.performance === (
                              cscPerformanceFilter === 'excellent' ? 'Excellent' :
                                cscPerformanceFilter === 'good' ? 'Good' :
                                  cscPerformanceFilter === 'average' ? 'Average' :
                                    cscPerformanceFilter === 'needs-improvement' ? 'Needs Improvement' : record.performance
                            );
                            return matchesMonth && matchesRegion && matchesPerformance;
                          })
                          .map((record, index) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography fontWeight="600">{record.cscName}</Typography>
                              </TableCell>
                              <TableCell>
                                {new Date(record.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={record.region}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="center">{record.calls}</TableCell>
                              <TableCell align="center">{record.policies}</TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={`${record.conversion}%`}
                                  size="small"
                                  color={record.conversion >= 18 ? 'success' : 'warning'}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={record.performance}
                                  size="small"
                                  color={
                                    record.performance === 'Excellent' ? 'success' :
                                      record.performance === 'Good' ? 'info' :
                                        record.performance === 'Average' ? 'warning' : 'error'
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        {[
                          { cscName: 'Priya Patel', month: '2025-12', region: 'Mumbai', calls: 145, policies: 28, conversion: 19.3, performance: 'Excellent' },
                          { cscName: 'Rahul Kumar', month: '2025-12', region: 'Delhi', calls: 132, policies: 24, conversion: 18.2, performance: 'Good' },
                          { cscName: 'Sarah Johnson', month: '2025-12', region: 'Bangalore', calls: 158, policies: 35, conversion: 22.2, performance: 'Excellent' },
                          { cscName: 'Amit Sharma', month: '2025-12', region: 'Chennai', calls: 118, policies: 18, conversion: 15.3, performance: 'Average' },
                          { cscName: 'Kavita Reddy', month: '2025-12', region: 'Hyderabad', calls: 125, policies: 22, conversion: 17.6, performance: 'Good' },
                          { cscName: 'Deepak Singh', month: '2025-12', region: 'Pune', calls: 98, policies: 12, conversion: 12.2, performance: 'Needs Improvement' },
                          { cscName: 'Meera Gupta', month: '2025-12', region: 'Kolkata', calls: 142, policies: 31, conversion: 21.8, performance: 'Excellent' },
                          { cscName: 'Vikram Joshi', month: '2025-12', region: 'Ahmedabad', calls: 108, policies: 15, conversion: 13.9, performance: 'Average' },
                          { cscName: 'Priya Patel', month: '2025-11', region: 'Mumbai', calls: 138, policies: 26, conversion: 18.8, performance: 'Good' },
                          { cscName: 'Rahul Kumar', month: '2025-11', region: 'Delhi', calls: 125, policies: 22, conversion: 17.6, performance: 'Good' }
                        ].filter((record) => {
                          const matchesMonth = record.month === cscSelectedMonth;
                          const matchesRegion = cscSelectedRegion === 'all' || record.region === cscSelectedRegion;
                          return matchesMonth && matchesRegion;
                        }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                  No CSC records found for the selected filters.
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Try selecting a different month or region.
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
      }
    </Box >
  );
};
export default LeadMIS;
