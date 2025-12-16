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
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Star as StarIcon,
    Phone as PhoneIcon,
    Policy as PolicyIcon,
    Cancel as CancelIcon,
    TableView as TableViewIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line } from 'recharts';
import misServices from '../services/misServices';

const LeadMIS = () => {
    const theme = useTheme();
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState(true);

    // State for MIS Data
    const [misOverview, setMisOverview] = useState(null);
    const [leadsByStatusData, setLeadsByStatusData] = useState([]);
    const [leadsBySourceData, setLeadsBySourceData] = useState([]);
    const [leadsTrendData, setLeadsTrendData] = useState([]);
    const [agentPerformanceData, setAgentPerformanceData] = useState([]);
    const [duplicateLeads, setDuplicateLeads] = useState([]);
    const [preExpiryRenewals, setPreExpiryRenewals] = useState([]);
    const [pivotData, setPivotData] = useState([]);
    const [conversionByPolicyType, setConversionByPolicyType] = useState([]);

    // Fetch data on mount
    React.useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [
                    overview,
                    statusData,
                    sourceData,
                    trendData,
                    agentData,
                    duplicateData,
                    renewalData,
                    pivot
                ] = await Promise.all([
                    misServices.fetchMISOverview(),
                    misServices.fetchLeadsByStatus(),
                    misServices.fetchLeadsBySource(),
                    misServices.fetchLeadsTrend(),
                    misServices.fetchAgentPerformance(),
                    misServices.fetchDuplicateGroups(),
                    misServices.fetchPreExpiryRenewals(),
                    misServices.fetchPivotData()
                ]);

                setMisOverview(overview);
                setLeadsByStatusData(statusData);
                setLeadsBySourceData(sourceData);
                setLeadsTrendData(trendData);
                setAgentPerformanceData(agentData);
                setDuplicateLeads(duplicateData);
                setPreExpiryRenewals(renewalData);
                setPivotData(pivot);
                // Mock conversion data
                setConversionByPolicyType([
                    { type: 'Motor', total: 150, converted: 45, rate: 30 },
                    { type: 'Health', total: 120, converted: 40, rate: 33.3 },
                    { type: 'Life', total: 80, converted: 20, rate: 25 }
                ]);
            } catch (error) {
                console.error('Error fetching MIS data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleExportExcel = () => {
        console.log('Exporting to Excel...');
    };

    const handleExportPDF = () => {
        console.log('Exporting to PDF...');
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h4" fontWeight="600">
                        Lead MIS Reports
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportExcel}
                        sx={{ mr: 1 }}
                    >
                        Export Report
                    </Button>
                </Grid>
            </Grid>

            {/* Overview Cards */}
            {misOverview && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">Total Leads</Typography>
                                <Typography variant="h4" fontWeight="600" color="primary.main">
                                    {misOverview.totalLeads}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">Conversion Rate</Typography>
                                <Typography variant="h4" fontWeight="600" color="success.main">
                                    {misOverview.conversionRate}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">Open Leads</Typography>
                                <Typography variant="h4" fontWeight="600" color="warning.main">
                                    {misOverview.newLeads + misOverview.contacted}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">Lost Leads</Typography>
                                <Typography variant="h4" fontWeight="600" color="error.main">
                                    {misOverview.closedLost}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
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
            </Paper>

            {/* Tab Content */}
            {currentTab === 0 && (
                <Grid container spacing={3}>
