import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

const LeadMIS = () => {
  const theme = useTheme();
  const { t } = useTranslation();
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

  const [conversionByPolicyType, setConversionByPolicyType] = useState([]);

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
  const [cscProductivityData, setCscProductivityData] = useState([]);

  // CSC Productivity Filters
  const [cscFilter, setCscFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  const regions = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

  // Lost Reasons Analysis data
  const [lostReasonsData, setLostReasonsData] = useState([]);
  const [monthlyLostReasons, setMonthlyLostReasons] = useState([]);
  const [lostLeadsDetails, setLostLeadsDetails] = useState([]);

  const [lostReasonFilter, setLostReasonFilter] = useState('all');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');

  const productTypes = ['Health', 'Motor', 'Life', 'Travel', 'Home'];

  // Conversion % Reports data
  const [conversionReportsData, setConversionReportsData] = useState([]);
  const [monthlyConversionTrend, setMonthlyConversionTrend] = useState([]);
  const [productWiseConversion, setProductWiseConversion] = useState([]);

  const [conversionDateFilter, setConversionDateFilter] = useState('thisMonth');
  const [conversionAgentFilter, setConversionAgentFilter] = useState('all');
  const [conversionProductFilter, setConversionProductFilter] = useState('all');

  // Pivot Reports data
  /* Pivot data replaced with state */
  const [pivotData, setPivotData] = useState([]);

  const [pivotGroupBy, setPivotGroupBy] = useState('insurer');
  const [pivotDateFilter, setPivotDateFilter] = useState('thisMonth');
  const [pivotProductFilter, setPivotProductFilter] = useState('all');

  // Premium Registers Data
  const [premiumRegistersData, setPremiumRegistersData] = useState([]);

  // Daily Insurer MIS Data
  const [dailyInsurerMisData, setDailyInsurerMisData] = useState([]);

  // CSC Load Tracking Data
  const [cscLoadTrackingData, setCscLoadTrackingData] = useState([]);

  // Workload Distribution Data
  const [workloadDistributionData, setWorkloadDistributionData] = useState([]);

  // Capacity Planning Data
  const [capacityPlanningData, setCapacityPlanningData] = useState([]);

  const getPivotData = () => {
    // If we have API data, we might just return it, possibly filtered by date
    // This assumes the API returns the correct data based on the pivotGroupBy param

    // Apply client-side date range filtering if the API returns more data than needed
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const getStartDate = () => {
      switch (pivotDateFilter) {
        case 'today':
          return today;
        case 'thisWeek':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return weekStart;
        case 'thisMonth':
          return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'lastMonth':
          return new Date(now.getFullYear(), now.getMonth() - 1, 1);
        case 'thisQuarter':
          const quarter = Math.floor(now.getMonth() / 3);
          return new Date(now.getFullYear(), quarter * 3, 1);
        case 'thisYear':
          return new Date(now.getFullYear(), 0, 1);
        default:
          return new Date(now.getFullYear(), now.getMonth(), 1);
      }
    };

    const getEndDate = () => {
      switch (pivotDateFilter) {
        case 'today':
          const endOfToday = new Date(today);
          endOfToday.setHours(23, 59, 59, 999);
          return endOfToday;
        case 'thisWeek':
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + (6 - today.getDay()));
          weekEnd.setHours(23, 59, 59, 999);
          return weekEnd;
        case 'thisMonth':
          return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        case 'lastMonth':
          return new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        case 'thisQuarter':
          const quarter = Math.floor(now.getMonth() / 3);
          return new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999);
        case 'thisYear':
          return new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        default:
          return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
    };

    const startDate = getStartDate();
    const endDate = getEndDate();

    // Filter by date range if 'date' property exists
    let filteredData = (Array.isArray(pivotData) ? pivotData : []).filter(item => {
      if (!item.date) return true;
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Apply product filtering
    if (pivotProductFilter !== 'all') {
      filteredData = filteredData.filter(item => item.product === pivotProductFilter);
    }

    return filteredData;
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
        statuses: selectedStatuses.join(','),
        pivotGroupBy // Pass this for pivot reports
      };

      // Fetch data from all new endpoints in parallel
      const [
        dashboardStats,
        performanceAnalysis,
        conversionByPolicy,
        duplicateAnalysis,
        preExpiry,
        cscProd,
        lostReason,
        conversionReport,
        pivotReport,
        premiumReg,
        dailyMis,
        cscLoad,
        workloadDist,
        capacityPlan
      ] = await Promise.all([
        misServices.fetchDashboardStats(params),
        misServices.fetchAgentPerformance(params),
        misServices.fetchConversionByPolicyType(params),
        misServices.fetchDuplicateAnalysis(params),
        misServices.fetchPreExpiryRenewals(params),
        misServices.fetchCscProductivity(params),
        misServices.fetchLostReasonAnalysis(params),
        misServices.fetchConversionPercentage(params),
        misServices.fetchPivotData(params),
        misServices.fetchPremiumRegisters(params),
        misServices.fetchDailyInsurerMis(params),
        misServices.fetchCscLoadTracking(params),
        misServices.fetchWorkloadDistribution(params),
        misServices.fetchCapacityPlanning(params)
      ]);

      console.log('MIS Data Raw Responses:', {
        dashboardStats,
        performanceAnalysis,
        conversionByPolicy,
        duplicateAnalysis,
        preExpiry,
        cscProd,
        lostReason,
        conversionReport,
        pivotReport,
        premiumReg,
        dailyMis,
        cscLoad,
        workloadDist,
        capacityPlan
      });

      // Helper to extract array from response
      const getArrayData = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.results)) return data.results;
        if (Array.isArray(data.data)) return data.data;
        if (Array.isArray(data.groups)) return data.groups; // Specific for duplicateAnalysis
        return [];
      };

      // Extract and set state for dashboard stats
      if (dashboardStats) {
        // Assuming dashboardStats contains status and source distributions
        // Adjust these keys based on actual API response
        if (dashboardStats.status_distribution) {
          const coloredStatusData = getArrayData(dashboardStats.status_distribution).map((item, index) => {
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
          setLeadsByStatusData(coloredStatusData);
        } else {
          setLeadsByStatusData([]); // or handle if not present
        }

        if (dashboardStats.source_distribution) setLeadsBySourceData(getArrayData(dashboardStats.source_distribution));
        if (dashboardStats.trends) setLeadsTrendData(getArrayData(dashboardStats.trends));
      }

      setAgentPerformanceData(getArrayData(performanceAnalysis));
      setConversionByPolicyType(getArrayData(conversionByPolicy));
      setDuplicateLeads(getArrayData(duplicateAnalysis));
      setPreExpiryRenewals(getArrayData(preExpiry));
      setCscProductivityData(getArrayData(cscProd));

      // Lost Reason
      if (lostReason) {
        setLostReasonsData(getArrayData(lostReason.reasons || lostReason));
        setMonthlyLostReasons(getArrayData(lostReason.monthly_trends));
        setLostLeadsDetails(getArrayData(lostReason.details));
      }

      // Conversion Report
      if (conversionReport) {
        setConversionReportsData(getArrayData(conversionReport.agent_reports || conversionReport));
        setMonthlyConversionTrend(getArrayData(conversionReport.monthly_trends));
        setProductWiseConversion(getArrayData(conversionReport.product_analysis));
      }

      setPivotData(getArrayData(pivotReport));
      setPremiumRegistersData(getArrayData(premiumReg));
      setDailyInsurerMisData(getArrayData(dailyMis));
      setCscLoadTrackingData(getArrayData(cscLoad));
      setWorkloadDistributionData(getArrayData(workloadDist));
      setCapacityPlanningData(getArrayData(capacityPlan));

    } catch (err) {
      console.error('Error fetching MIS data:', err);
      // Don't set error immediately if some endpoints fail, or do?
      // For now, keep generic error
      setError('Failed to load MIS data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchMISData();
  }, [dateRange, selectedAgents, selectedSources, selectedStatuses, pivotGroupBy]);

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
    const workbook = XLSX.utils.book_new();

    // Tab names for reference
    const tabNames = [
      'Status Distribution', 'Performance Analysis', 'Trends & Patterns',
      'Duplicate Analysis', 'Pre-Expiry Renewals', 'CSC Productivity',
      'Lost Reasons Analysis', 'Conversion Reports', 'Pivot Reports'
    ];

    // 1. Leads by Status
    if (leadsByStatusData.length > 0) {
      const statusSheet = XLSX.utils.json_to_sheet(leadsByStatusData.map(item => ({
        'Status': item.name,
        'Count': item.value
      })));
      XLSX.utils.book_append_sheet(workbook, statusSheet, 'Leads by Status');
    }

    // 2. Leads by Source
    if (leadsBySourceData.length > 0) {
      const sourceSheet = XLSX.utils.json_to_sheet(leadsBySourceData.map(item => ({
        'Source': item.name,
        'Count': item.value
      })));
      XLSX.utils.book_append_sheet(workbook, sourceSheet, 'Leads by Source');
    }

    // 3. Leads Trend
    if (leadsTrendData.length > 0) {
      const trendSheet = XLSX.utils.json_to_sheet(leadsTrendData.map(item => ({
        'Month': item.month,
        'New Leads': item.newLeads,
        'Converted': item.converted,
        'Lost': item.lost
      })));
      XLSX.utils.book_append_sheet(workbook, trendSheet, 'Leads Trend');
    }

    // 4. Agent Performance
    if (agentPerformanceData.length > 0) {
      const performanceSheet = XLSX.utils.json_to_sheet(agentPerformanceData.map(item => ({
        'Agent Name': item.name,
        'Total Leads': item.totalLeads,
        'Converted': item.converted,
        'Conversion Rate': `${item.conversionRate}%`,
        'Revenue': `₹${item.revenue?.toLocaleString() || 0}`
      })));
      XLSX.utils.book_append_sheet(workbook, performanceSheet, 'Agent Performance');
    }

    // 5. Duplicate Leads
    if (duplicateLeads.length > 0) {
      const duplicateData = [];
      duplicateLeads.forEach(group => {
        group.leads.forEach(lead => {
          duplicateData.push({
            'Group ID': group.groupId,
            'Confidence': `${group.confidence}%`,
            'Match Type': group.matchType,
            'Lead Name': lead.name,
            'Phone': lead.phone,
            'Email': lead.email,
            'Source': lead.source,
            'Status': lead.status,
            'Created Date': lead.createdAt
          });
        });
      });
      const duplicateSheet = XLSX.utils.json_to_sheet(duplicateData);
      XLSX.utils.book_append_sheet(workbook, duplicateSheet, 'Duplicate Leads');
    }

    // 6. Pre-Expiry Renewals
    if (preExpiryRenewals.length > 0) {
      const renewalSheet = XLSX.utils.json_to_sheet(preExpiryRenewals.map(item => ({
        'Policy Number': item.policyNumber,
        'Customer Name': item.customerName,
        'Policy Type': item.policyType,
        'Expiry Date': item.expiryDate,
        'Days to Expiry': item.daysToExpiry,
        'Premium': `₹${item.premium?.toLocaleString() || 0}`,
        'Agent': item.agent,
        'Status': item.status
      })));
      XLSX.utils.book_append_sheet(workbook, renewalSheet, 'Pre-Expiry Renewals');
    }

    // 7. CSC Productivity
    const cscData = getFilteredCSCProductivityData();
    if (cscData.length > 0) {
      const cscSheet = XLSX.utils.json_to_sheet(cscData.map(item => ({
        'CSC Name': item.cscName,
        'Region': item.region,
        'Total Calls': item.calls,
        'Policies Issued': item.policies,
        'Conversion Rate': `${item.conversionRate}%`,
        'Performance Score': item.score,
        'Performance': item.performance
      })));
      XLSX.utils.book_append_sheet(workbook, cscSheet, 'CSC Productivity');
    }

    // 8. Lost Reasons
    const lostData = getFilteredLostLeadsDetails();
    if (lostData.length > 0) {
      const lostSheet = XLSX.utils.json_to_sheet(lostData.map(item => ({
        'Lead ID': item.id,
        'Customer Name': item.customerName,
        'Policy Type': item.policyType,
        'Agent': item.agent,
        'Lost Date': item.lostDate,
        'Reason': item.reason,
        'Premium': `₹${item.premium?.toLocaleString() || 0}`,
        'Notes': item.notes
      })));
      XLSX.utils.book_append_sheet(workbook, lostSheet, 'Lost Leads');
    }

    // 9. Conversion Reports
    const conversionData = getFilteredConversionReportsData();
    if (conversionData.length > 0) {
      const conversionSheet = XLSX.utils.json_to_sheet(conversionData.map(item => ({
        'Agent': item.agent,
        'Product Type': item.productType,
        'Total Leads': item.totalLeads,
        'Converted Leads': item.convertedLeads,
        'Conversion Rate': `${item.conversionRate}%`,
        'Revenue': `₹${item.revenue?.toLocaleString() || 0}`
      })));
      XLSX.utils.book_append_sheet(workbook, conversionSheet, 'Conversion Reports');
    }

    // 10. Pivot Reports
    const pivotData = getPivotData();
    if (pivotData.length > 0) {
      const pivotSheet = XLSX.utils.json_to_sheet(pivotData.map(item => {
        if (pivotGroupBy === 'insurer') {
          return {
            'Insurer': item.insurer,
            'Product': item.product,
            'Date': item.date,
            'Policies': item.policies,
            'Premium': `₹${item.premium?.toLocaleString() || 0}`,
            'Claims': item.claims,
            'Claim Ratio': `${item.claimRatio}%`,
            'Market Share': `${item.marketShare}%`
          };
        } else if (pivotGroupBy === 'csc') {
          return {
            'CSC': item.csc,
            'Product': item.product,
            'Date': item.date,
            'Policies': item.policies,
            'Premium': `₹${item.premium?.toLocaleString() || 0}`,
            'Agents': item.agents,
            'Avg Per Agent': item.avgPerAgent,
            'Efficiency': `${item.efficiency}%`
          };
        } else {
          return {
            'Tenure': item.tenure,
            'Product': item.product,
            'Date': item.date,
            'Policies': item.policies,
            'Premium': `₹${item.premium?.toLocaleString() || 0}`,
            'Renewal Rate': `${item.renewalRate}%`,
            'Avg Premium': `₹${item.avgPremium?.toLocaleString() || 0}`,
            'Satisfaction': item.satisfaction
          };
        }
      }));
      XLSX.utils.book_append_sheet(workbook, pivotSheet, 'Pivot Reports');
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Lead_MIS_Report_${timestamp}.xlsx`;

    // Write and download file
    XLSX.writeFile(workbook, filename);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;
    const lineHeight = 7;
    const marginLeft = 14;
    const marginRight = pageWidth - 14;

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredSpace = 30) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Helper function to draw a table
    const drawTable = (headers, data, columnWidths) => {
      const startX = marginLeft;
      let startY = yPosition;
      const cellPadding = 2;
      const rowHeight = 8;

      // Draw header row
      doc.setFillColor(41, 128, 185);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');

      let xPos = startX;
      headers.forEach((header, i) => {
        doc.rect(xPos, startY, columnWidths[i], rowHeight, 'F');
        doc.text(header, xPos + cellPadding, startY + rowHeight - 2);
        xPos += columnWidths[i];
      });

      startY += rowHeight;
      yPosition = startY;

      // Draw data rows
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      data.forEach((row, rowIndex) => {
        checkPageBreak(rowHeight + 10);
        startY = yPosition;
        xPos = startX;

        // Alternate row background
        if (rowIndex % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        }

        row.forEach((cell, i) => {
          const cellText = String(cell || '').substring(0, 20); // Truncate long text
          doc.text(cellText, xPos + cellPadding, startY + rowHeight - 2);
          xPos += columnWidths[i];
        });

        yPosition += rowHeight;
      });

      yPosition += 10;
    };

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('Lead MIS Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Generated date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const generatedDate = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generated: ${generatedDate}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Summary Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Executive Summary', marginLeft, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const summaryItems = [
      ['Total Leads:', '180', 'Conversion Rate:', '34.2%'],
      ['Total Revenue:', '₹3.9 Cr', 'Lost Leads:', '18']
    ];

    summaryItems.forEach(row => {
      doc.setFont('helvetica', 'bold');
      doc.text(row[0], marginLeft, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(row[1], marginLeft + 35, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(row[2], marginLeft + 70, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(row[3], marginLeft + 110, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 10;

    // Leads by Status
    if (leadsByStatusData.length > 0) {
      checkPageBreak(50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text('Leads by Status', marginLeft, yPosition);
      yPosition += 8;

      const statusHeaders = ['Status', 'Count'];
      const statusData = leadsByStatusData.map(item => [item.name, String(item.value)]);
      drawTable(statusHeaders, statusData, [90, 40]);
    }

    // Agent Performance
    if (agentPerformanceData.length > 0) {
      checkPageBreak(50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text('Agent Performance', marginLeft, yPosition);
      yPosition += 8;

      const perfHeaders = ['Agent', 'Leads', 'Converted', 'Rate'];
      const perfData = agentPerformanceData.slice(0, 8).map(item => [
        item.name,
        String(item.totalLeads || 0),
        String(item.converted || 0),
        `${item.conversionRate || 0}%`
      ]);
      drawTable(perfHeaders, perfData, [50, 30, 35, 30]);
    }

    // CSC Productivity
    const cscData = getFilteredCSCProductivityData();
    if (cscData.length > 0) {
      checkPageBreak(50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text('CSC Productivity', marginLeft, yPosition);
      yPosition += 8;

      const cscHeaders = ['CSC Name', 'Calls', 'Policies', 'Conv %', 'Score'];
      const cscTableData = cscData.slice(0, 8).map(item => [
        item.cscName,
        String(item.calls),
        String(item.policies),
        `${item.conversionRate}%`,
        String(item.score)
      ]);
      drawTable(cscHeaders, cscTableData, [45, 25, 28, 28, 25]);
    }

    // Pivot Reports
    const pivotData = getPivotData();
    if (pivotData.length > 0) {
      checkPageBreak(50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      const pivotTitle = pivotGroupBy === 'insurer' ? 'Pivot by Insurer' :
        pivotGroupBy === 'csc' ? 'Pivot by CSC' : 'Pivot by Tenure';
      doc.text(pivotTitle, marginLeft, yPosition);
      yPosition += 8;

      let pivotHeaders, pivotTableData;
      if (pivotGroupBy === 'insurer') {
        pivotHeaders = ['Insurer', 'Policies', 'Premium', 'Claims'];
        pivotTableData = pivotData.slice(0, 8).map(item => [
          item.insurer,
          String(item.policies),
          `₹${(item.premium / 100000).toFixed(1)}L`,
          String(item.claims)
        ]);
      } else if (pivotGroupBy === 'csc') {
        pivotHeaders = ['CSC', 'Policies', 'Premium', 'Efficiency'];
        pivotTableData = pivotData.slice(0, 8).map(item => [
          item.csc,
          String(item.policies),
          `₹${(item.premium / 100000).toFixed(1)}L`,
          `${item.efficiency}%`
        ]);
      } else {
        pivotHeaders = ['Tenure', 'Policies', 'Premium', 'Renewal %'];
        pivotTableData = pivotData.slice(0, 8).map(item => [
          item.tenure,
          String(item.policies),
          `₹${(item.premium / 100000).toFixed(1)}L`,
          `${item.renewalRate}%`
        ]);
      }
      drawTable(pivotHeaders, pivotTableData, [50, 30, 40, 35]);
    }

    // Conversion Reports
    const conversionData = getFilteredConversionReportsData();
    if (conversionData.length > 0) {
      checkPageBreak(50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text('Conversion Reports', marginLeft, yPosition);
      yPosition += 8;

      const convHeaders = ['Agent', 'Leads', 'Converted', 'Rate', 'Revenue'];
      const convTableData = conversionData.slice(0, 8).map(item => [
        item.agent,
        String(item.totalLeads),
        String(item.convertedLeads),
        `${item.conversionRate}%`,
        `₹${(item.revenue / 100000).toFixed(1)}L`
      ]);
      drawTable(convHeaders, convTableData, [40, 25, 30, 25, 35]);
    }

    // Footer on last page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`Lead_MIS_Report_${timestamp}.pdf`);
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

  const filteredDuplicates = Array.isArray(duplicateLeads) ? duplicateLeads.filter(group => {
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
  }) : [];

  // Helper functions to filter static data based on global filters
  const getFilteredCSCProductivityData = () => {
    let filtered = Array.isArray(cscProductivityData) ? cscProductivityData : [];

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
    let filtered = Array.isArray(lostLeadsDetails) ? lostLeadsDetails : [];

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
    let filtered = Array.isArray(conversionReportsData) ? conversionReportsData : [];

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
            {t('leadMIS.title', 'Lead MIS Reports')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('leadMIS.description', 'Management Information System for Lead Analytics and Reporting')}
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
            {t('leadMIS.filters.refresh', 'Refresh')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportExcel}
            sx={{ mr: 1 }}
          >
            {t('leadMIS.filters.exportExcel', 'Export Excel')}
          </Button>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleExportPDF}
          >
            {t('leadMIS.filters.exportPDF', 'Generate PDF')}
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.table.totalLeads', 'Total Leads')}</Typography>
                  <Typography variant="h3" fontWeight="700">180</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">+12% {t('leadMIS.filters.lastMonth', 'from last month')}</Typography>
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.table.conversionRate', 'Conversion Rate')}</Typography>
                  <Typography variant="h3" fontWeight="700">34.2%</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">+5.3% {t('leadMIS.filters.lastMonth', 'from last month')}</Typography>
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.table.revenue', 'Total Revenue')}</Typography>
                  <Typography variant="h3" fontWeight="700">₹3.9Cr</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    <Typography variant="caption">+18% {t('leadMIS.filters.lastMonth', 'from last month')}</Typography>
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
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leads.lost.title', 'Lost Leads')}</Typography>
                  <Typography variant="h3" fontWeight="700">18</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                    <TrendingDownIcon fontSize="small" />
                    <Typography variant="caption">-8% {t('leadMIS.filters.lastMonth', 'from last month')}</Typography>
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
          <Tab icon={<PieChartIcon />} label={t('leadMIS.tabs.statusDistribution', 'Status Distribution')} iconPosition="start" />
          <Tab icon={<BarChartIcon />} label={t('leadMIS.tabs.performanceAnalysis', 'Performance Analysis')} iconPosition="start" />
          <Tab icon={<ShowChartIcon />} label={t('leadMIS.tabs.trends', 'Trends & Patterns')} iconPosition="start" />
          <Tab icon={<DuplicateIcon />} label={t('leadMIS.tabs.duplicates', 'Duplicate Analysis')} iconPosition="start" />
          <Tab icon={<DateRangeIcon />} label={t('leadMIS.tabs.renewals', 'Pre-Expiry Renewals')} iconPosition="start" />
          <Tab icon={<StarIcon />} label={t('leadMIS.tabs.cscProductivity', 'CSC Productivity')} iconPosition="start" />
          <Tab icon={<CancelIcon />} label={t('leadMIS.tabs.lostReasons', 'Lost Reasons Analysis')} iconPosition="start" />
          <Tab icon={<AnalyticsIcon />} label={t('leadMIS.tabs.conversion', 'Conversion % Reports')} iconPosition="start" />
          <Tab icon={<TableViewIcon />} label={t('leadMIS.tabs.pivot', 'Pivot Reports')} iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label={t('leadMIS.tabs.premiumRegisters', 'Premium Registers')} iconPosition="start" />
          <Tab icon={<BarChartIcon />} label={t('leadMIS.tabs.dailyInsurerMIS', 'Daily Insurer MIS')} iconPosition="start" />
          <Tab icon={<PhoneIcon />} label={t('leadMIS.tabs.cscLoadTracking', 'CSC Load Tracking')} iconPosition="start" />
          <Tab icon={<AnalyticsIcon />} label={t('leadMIS.tabs.capacityPlanning', 'Capacity Planning')} iconPosition="start" />
          <Tab icon={<PeopleIcon />} label={t('leadMIS.tabs.workloadDistribution', 'Workload Distribution')} iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label={t('leadMIS.tabs.detailedReports', 'Detailed Reports')} iconPosition="start" />
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
                    {t('leadMIS.charts.leadsByStatus', 'Leads by Status')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Array.isArray(leadsByStatusData) ? leadsByStatusData : []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {(Array.isArray(leadsByStatusData) ? leadsByStatusData : []).map((entry, index) => (
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
                    {t('leadMIS.charts.leadsBySource', 'Leads by Source')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Array.isArray(leadsBySourceData) ? leadsBySourceData : []}>
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
                        label={t('leadMIS.filters.agents', 'Filter by Agent')}
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
                        label={t('leadMIS.filters.performance', 'Filter by Conversion Rate')}
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
                        label={t('leadMIS.filters.policyType', 'Filter by Policy Type')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {t('leadMIS.charts.agentPerformance', 'Agent Performance Summary')}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.agent', 'Agent Name')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.totalLeads', 'Total Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.converted', 'Converted')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.conversionRate', 'Conversion Rate')}</TableCell>
                          <TableCell align="right">{t('leadMIS.table.revenue', 'Revenue Generated')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.performance', 'Performance')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(agentPerformanceData) ? agentPerformanceData : [])
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
                    {t('leadMIS.charts.conversionByProduct', 'Conversion by Policy Type')}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.filters.policyType', 'Policy Type')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.totalLeads', 'Total Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.converted', 'Converted')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.conversionRate', 'Conversion Rate')}</TableCell>
                          <TableCell>{t('leadMIS.table.progress', 'Progress')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(conversionByPolicyType) ? conversionByPolicyType : [])
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
                    {t('leadMIS.charts.leadsTrend', 'Lead Generation & Conversion Trends')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={Array.isArray(leadsTrendData) ? leadsTrendData : []}>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.duplicateAnalysis.totalGroups', 'Total Duplicate Groups')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(duplicateLeads) ? duplicateLeads : []).length}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.duplicateAnalysis.affectedLeads', 'Affected Leads')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(duplicateLeads) ? duplicateLeads : []).reduce((sum, group) => sum + (Array.isArray(group.leads) ? group.leads.length : 0), 0)}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.duplicateAnalysis.highConfidence', 'High Confidence')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(duplicateLeads) ? duplicateLeads : []).filter(g => g.confidence >= 95).length}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.duplicateAnalysis.potentialSavings', 'Potential Savings')}</Typography>
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
                        label={t('leadMIS.filters.confidence', 'Filter by Confidence')}
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
                        label={t('leadMIS.filters.sources', 'Filter by Source')}
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
                        label={t('leadMIS.filters.status', 'Filter by Status')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {t('leadMIS.duplicateAnalysis.title', 'Duplicate Lead Analysis')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('leadMIS.duplicateAnalysis.description', 'Leads are grouped by matching criteria. Use actions to merge, mark as valid, or delete duplicates.')}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.leadId', 'Lead ID')}</TableCell>
                          <TableCell>{t('leadMIS.table.name', 'Name')}</TableCell>
                          <TableCell>{t('leadMIS.table.email', 'Email')}</TableCell>
                          <TableCell>{t('leadMIS.table.phone', 'Phone')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.source', 'Source')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.status', 'Status')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.group', 'Group ID')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.confidence', 'Confidence')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.actions', 'Actions')}</TableCell>
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
                                        {t('leadMIS.duplicateAnalysis.merge', 'Merge')}
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                        startIcon={<ValidIcon />}
                                        onClick={() => handleMarkAsValid(group.groupId)}
                                        sx={{ fontSize: '0.7rem' }}
                                      >
                                        {t('leadMIS.duplicateAnalysis.valid', 'Valid')}
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
                                    {t('leadMIS.duplicateAnalysis.delete', 'Delete')}
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
                        {t('leadMIS.duplicateAnalysis.noDuplicates', 'No duplicate leads found')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('leadMIS.duplicateAnalysis.allUnique', 'All leads appear to be unique based on current criteria')}
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.renewals.expiringSoon', 'Expiring Soon')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(preExpiryRenewals) ? preExpiryRenewals : []).filter(p => p.daysToExpiry <= 30).length}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.renewals.renewed', 'Renewed')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(preExpiryRenewals) ? preExpiryRenewals : []).filter(p => p.status === 'Renewed').length}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.renewals.totalPremium', 'Total Premium')}</Typography>
                          <Typography variant="h3" fontWeight="700">₹{((Array.isArray(preExpiryRenewals) ? preExpiryRenewals : []).reduce((sum, p) => sum + p.premium, 0) / 100000).toFixed(1)}L</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.renewals.pending', 'Pending')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(preExpiryRenewals) ? preExpiryRenewals : []).filter(p => p.status === 'Pending').length}</Typography>
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
                        label={t('leadMIS.filters.status', 'Filter by Status')}
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
                        label={t('leadMIS.filters.agents', 'Filter by Agent')}
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
                        label={t('leadMIS.filters.policyType', 'Filter by Policy Type')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {t('leadMIS.renewals.title', 'Pre-Expiry Renewal Report')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('leadMIS.renewals.description', 'Policies expiring within the next 60 days requiring renewal action.')}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.policyId', 'Policy ID')}</TableCell>
                          <TableCell>{t('leadMIS.table.customerName', 'Customer Name')}</TableCell>
                          <TableCell>{t('leadMIS.table.policyType', 'Policy Type')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.expiryDate', 'Expiry Date')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.daysToExpiry', 'Days to Expiry')}</TableCell>
                          <TableCell align="right">{t('leadMIS.table.premium', 'Premium')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.status', 'Status')}</TableCell>
                          <TableCell>{t('leadMIS.table.assignedAgent', 'Assigned Agent')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.lastContact', 'Last Contact')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(preExpiryRenewals) ? preExpiryRenewals : [])
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscProductivity.totalCSCs', 'Total CSCs')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscProductivity.totalCalls', 'Total Calls')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(cscProductivityData) ? cscProductivityData : []).reduce((sum, csc) => sum + csc.calls, 0)}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscProductivity.totalPolicies', 'Total Policies')}</Typography>
                          <Typography variant="h3" fontWeight="700">{(Array.isArray(cscProductivityData) ? cscProductivityData : []).reduce((sum, csc) => sum + csc.policies, 0)}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscProductivity.avgConversion', 'Avg Conversion')}</Typography>
                          <Typography variant="h3" fontWeight="700">{((Array.isArray(cscProductivityData) && cscProductivityData.length > 0 ? cscProductivityData.reduce((sum, csc) => sum + csc.conversionRate, 0) : 0) / (cscProductivityData?.length || 1)).toFixed(1)}%</Typography>
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
                        label={t('leadMIS.filters.performance', 'Filter by Performance')}
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
                        label={t('leadMIS.filters.region', 'Filter by Region')}
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
                        label={t('leadMIS.table.score', 'Filter by Score')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {t('leadMIS.cscProductivity.performanceDist', 'CSC Performance Distribution')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Excellent', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Excellent').length, color: theme.palette.success.main },
                          { name: 'Good', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Good').length, color: theme.palette.primary.main },
                          { name: 'Average', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Average').length, color: theme.palette.warning.main },
                          { name: 'Needs Improvement', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Needs Improvement').length, color: theme.palette.error.main }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {[
                          { name: 'Excellent', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Excellent').length, color: theme.palette.success.main },
                          { name: 'Good', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Good').length, color: theme.palette.primary.main },
                          { name: 'Average', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Average').length, color: theme.palette.warning.main },
                          { name: 'Needs Improvement', value: (Array.isArray(cscProductivityData) ? cscProductivityData : []).filter(c => c.performance === 'Needs Improvement').length, color: theme.palette.error.main }
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
                    {t('leadMIS.cscProductivity.conversionRates', 'CSC Conversion Rates')}
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
                    {t('leadMIS.cscProductivity.title', 'CSC Productivity Report')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('leadMIS.cscProductivity.description', 'Comprehensive performance analysis of Customer Service Center representatives.')}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.cscName', 'CSC Name')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.region', 'Region')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.calls', 'Calls')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.policies', 'Policies')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.conversionRate', 'Conversion %')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.score', 'Score')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.performance', 'Performance')}</TableCell>
                          <TableCell>{t('leadMIS.table.progress', 'Progress')}</TableCell>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.lostReasons.totalLost', 'Total Lost Leads')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.lostReasons.topReason', 'Top Reason')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.lostReasons.lostRevenue', 'Lost Revenue')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.lostReasons.recoveryRate', 'Recovery Rate')}</Typography>
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
                        {(Array.isArray(lostReasonsData) ? lostReasonsData : []).map((entry, index) => (
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
                    <BarChart data={Array.isArray(monthlyLostReasons) ? monthlyLostReasons : []}>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.conversionReports.overall', 'Overall Conversion')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.conversionReports.bestPerformer', 'Best Performer')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.conversionReports.totalConverted', 'Total Converted')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.conversionReports.revenue', 'Conversion Revenue')}</Typography>
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
                        label={t('leadMIS.pivotReports.dateRange', 'Date Range')}
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
                        label={t('leadMIS.filters.agents', 'Filter by Agent')}
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
                        label={t('leadMIS.filters.productType', 'Filter by Product Type')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {t('leadMIS.conversionReports.agentVsRate', 'Agent vs Conversion Rate')}
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
                    {t('leadMIS.conversionReports.monthlyTrend', 'Monthly Conversion Trend')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={Array.isArray(monthlyConversionTrend) ? monthlyConversionTrend : []}>
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
                    {t('leadMIS.conversionReports.agentTableTitle', 'Agent-wise Conversion Details')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('leadMIS.conversionReports.agentTableDesc', 'Comprehensive conversion tracking with agent performance metrics.')}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.agent', 'Agent Name')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.totalLeads', 'Total Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.conversionReports.totalConverted', 'Converted Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.conversionRate', 'Conversion Rate')}</TableCell>
                          <TableCell align="right">{t('leadMIS.table.revenue', 'Revenue Generated')}</TableCell>
                          <TableCell align="center">{t('leadMIS.conversionReports.primaryProduct', 'Primary Product')}</TableCell>
                          <TableCell>{t('leadMIS.table.performance', 'Performance')}</TableCell>
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
                    {t('leadMIS.conversionReports.productTableTitle', 'Product-wise Conversion Analysis')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('leadMIS.conversionReports.productTableDesc', 'Conversion performance breakdown by insurance product categories.')}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.filters.productType', 'Product Type')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.totalLeads', 'Total Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.conversionReports.totalConverted', 'Converted Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.conversionRate', 'Conversion Rate')}</TableCell>
                          <TableCell align="right">{t('leadMIS.conversionReports.avgDealValue', 'Avg Deal Value')}</TableCell>
                          <TableCell>{t('leadMIS.table.performance', 'Performance Indicator')}</TableCell>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.pivotReports.totalRecords', 'Total Records')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.pivotReports.topPerformer', 'Top Performer')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.renewals.totalPremium', 'Total Premium')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.pivotReports.avgPerformance', 'Avg Performance')}</Typography>
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
                        label={t('leadMIS.pivotReports.groupBy', 'Group By')}
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
                        label={t('leadMIS.pivotReports.dateRange', 'Date Range')}
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
                        label={t('leadMIS.pivotReports.productFilter', 'Product Filter')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {pivotGroupBy === 'insurer' ? t('leadMIS.pivotReports.insurerName', 'Insurer') : pivotGroupBy === 'csc' ? t('leadMIS.pivotReports.cscLocation', 'CSC') : t('leadMIS.pivotReports.policyTenure', 'Tenure')} {t('leadMIS.pivotReports.distribution', 'Distribution')}
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
                    {t('leadMIS.pivotReports.policyCount', 'Policy Count Comparison')}
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
                    {pivotGroupBy === 'insurer' ? t('leadMIS.pivotReports.insurerName', 'Insurer') : pivotGroupBy === 'csc' ? t('leadMIS.pivotReports.cscLocation', 'CSC') : t('leadMIS.pivotReports.policyTenure', 'Tenure')} {t('leadMIS.pivotReports.analysisTitle', 'Pivot Analysis')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('leadMIS.pivotReports.analysisDesc', { group: pivotGroupBy, defaultValue: 'Dynamic pivot report...' })}
                  </Typography>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{pivotGroupBy === 'insurer' ? t('leadMIS.pivotReports.insurerName', 'Insurer Name') : pivotGroupBy === 'csc' ? t('leadMIS.pivotReports.cscLocation', 'CSC Location') : t('leadMIS.pivotReports.policyTenure', 'Policy Tenure')}</TableCell>
                          <TableCell>{t('leadMIS.filters.productType', 'Product')}</TableCell>
                          <TableCell>{t('leadMIS.table.date', 'Date')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.policies', 'Policies')}</TableCell>
                          <TableCell align="right">{t('leadMIS.premiumRegisters.table.totalPremium', 'Premium Amount')}</TableCell>
                          <TableCell align="center">
                            {pivotGroupBy === 'insurer' ? t('leadMIS.table.claims', 'Claims') : pivotGroupBy === 'csc' ? t('leadMIS.pivotReports.agents', 'Agents') : t('leadMIS.table.renewalRate', 'Renewal Rate')}
                          </TableCell>
                          <TableCell align="center">
                            {pivotGroupBy === 'insurer' ? t('leadMIS.table.claimRatio', 'Claim Ratio') : pivotGroupBy === 'csc' ? t('leadMIS.pivotReports.avgPerAgent', 'Avg Per Agent') : t('leadMIS.pivotReports.avgPremium', 'Avg Premium')}
                          </TableCell>
                          <TableCell align="center">
                            {pivotGroupBy === 'insurer' ? t('leadMIS.table.marketShare', 'Market Share') : pivotGroupBy === 'csc' ? t('leadMIS.pivotReports.efficiency', 'Efficiency') : t('leadMIS.table.satisfaction', 'Satisfaction')}
                          </TableCell>
                          <TableCell>{t('leadMIS.table.performance', 'Performance')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getPivotData().map((item, index) => (
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
                        label={t('leadMIS.premiumRegisters.filters.insurer', 'Insurer')}
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
                        label={t('leadMIS.premiumRegisters.filters.policyType', 'Policy Type')}
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
                        label={t('leadMIS.premiumRegisters.filters.tenure', 'Tenure')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {t('leadMIS.premiumRegisters.title', 'Premium Registers - Tenure Breakdown')}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.premiumRegisters.table.insurer', 'Insurer')}</TableCell>
                          <TableCell>{t('leadMIS.premiumRegisters.table.policyType', 'Policy Type')}</TableCell>
                          <TableCell>{t('leadMIS.premiumRegisters.table.tenure', 'Tenure')}</TableCell>
                          <TableCell align="center">{t('leadMIS.premiumRegisters.table.totalPolicies', 'Total Policies')}</TableCell>
                          <TableCell align="right">{t('leadMIS.premiumRegisters.table.totalPremium', 'Total Premium')}</TableCell>
                          <TableCell align="right">{t('leadMIS.premiumRegisters.table.avgPremium', 'Average Premium')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(premiumRegistersData) ? premiumRegistersData : [])
                          .filter(row => {
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
                        {(Array.isArray(premiumRegistersData) ? premiumRegistersData : [])
                          .filter(row => {
                            const matchesInsurer = premiumSelectedInsurer === 'all' || row.insurer === premiumSelectedInsurer;
                            const matchesType = premiumSelectedPolicyType === 'all' || row.type === premiumSelectedPolicyType;
                            const matchesTenure = premiumSelectedTenure === 'all' || row.tenure === premiumSelectedTenure;
                            return matchesInsurer && matchesType && matchesTenure;
                          }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                  {t('leadMIS.messages.noRecordsFound', 'No records found for the selected filters.')}
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
                    {t('leadMIS.premiumRegisters.chart', 'Premium Distribution by Tenure')}
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
                        label={t('leadMIS.dailyMIS.filters.insurer', 'Select Insurer')}
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
                        label={t('leadMIS.dailyMIS.filters.date', 'Select Date')}
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
                        label={t('leadMIS.dailyMIS.filters.conversion', 'Filter by Conversion')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.renewals.totalPremium', 'Total Premium')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.dailyMIS.cards.policiesSold', 'Policies Sold')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.dailyMIS.cards.leadsGenerated', 'Leads Generated')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.table.conversionRate', 'Conversion Rate')}</Typography>
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
                    {t('leadMIS.dailyMIS.title', 'Daily Insurer MIS Data')}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.date', 'Date')}</TableCell>
                          <TableCell>{t('leadMIS.table.insurer', 'Insurer')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.leadsCount', 'Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.policies', 'Policies')}</TableCell>
                          <TableCell align="right">{t('leadMIS.table.premium', 'Premium')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.conversionRate', 'Conversion %')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(dailyInsurerMisData) ? dailyInsurerMisData : [])
                          .filter(row => {
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
                                <Chip label={`${row.conversion}%`} size="small" color={row.conversion >= 30 ? 'success' : row.conversion >= 20 ? 'warning' : 'error'} />
                              </TableCell>
                            </TableRow>
                          ))}
                        {(Array.isArray(dailyInsurerMisData) ? dailyInsurerMisData : [])
                          .filter(row => {
                            const matchesInsurer = dailyMISSelectedInsurer === 'all' || row.insurer === dailyMISSelectedInsurer;
                            const matchesDate = dailyMISSelectedDate === 'all' || row.date === dailyMISSelectedDate;
                            return matchesInsurer && matchesDate;
                          }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                <Typography variant="body1" color="text.secondary">
                                  {t('leadMIS.messages.noRecordsFound', 'No records found for the selected filters.')}
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
                    {t('leadMIS.dailyMIS.chart', 'Daily Premium Trend')}
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
                        label={t('leadMIS.filters.month', 'Select Month')}
                        value={capacitySelectedMonth}
                        onChange={(e) => setCapacitySelectedMonth(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        select
                        label={t('leadMIS.filters.region', 'Region/Team Filter')}
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
                        label={t('leadMIS.filters.status', 'Filter by Status')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                      {t('leadMIS.capacityPlanning.warning', { count: 2, defaultValue: 'Staffing Shortfall: Add 2 CSCs to meet capacity requirements' })}
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.table.totalLeads', 'Total Leads')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.capacityPlanning.cards.requiredCSCs', 'Required CSCs')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.capacityPlanning.cards.shortfall', 'Shortfall')}</Typography>
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
                    {t('leadMIS.capacityPlanning.charts.availableVsRequired', 'Available vs Required CSCs')}
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
                      <Bar dataKey="available" fill={theme.palette.success.main} name={t('leadMIS.capacityPlanning.status.available', 'Available CSCs')} />
                      <Bar dataKey="required" fill={theme.palette.error.main} name={t('leadMIS.capacityPlanning.cards.requiredCSCs', 'Required CSCs')} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {t('leadMIS.capacityPlanning.charts.workloadDistribution', 'Workload Distribution by Region')}
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
                    {t('leadMIS.capacityPlanning.tableTitle', 'CSC Capacity Analysis')}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.cscName', 'CSC')}</TableCell>
                          <TableCell>{t('leadMIS.filters.month', 'Month')}</TableCell>
                          <TableCell>{t('leadMIS.filters.region', 'Region')}</TableCell>
                          <TableCell align="center">{t('leadMIS.capacityPlanning.table.assignedLeads', 'Assigned Leads')}</TableCell>
                          <TableCell align="center">{t('leadMIS.capacityPlanning.table.capacity', 'Capacity')}</TableCell>
                          <TableCell align="center">{t('leadMIS.capacityPlanning.table.utilization', 'Utilization %')}</TableCell>
                          <TableCell align="center">{t('leadMIS.filters.status', 'Status')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(capacityPlanningData) ? capacityPlanningData : [])
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
                                    team.status === 'overloaded' ? t('leadMIS.capacityPlanning.status.overloaded') :
                                      team.status === 'optimal' ? t('leadMIS.capacityPlanning.status.optimal') : t('leadMIS.capacityPlanning.status.underutilized')
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
                        {(Array.isArray(capacityPlanningData) ? capacityPlanningData : [])
                          .filter(team => {
                            const matchesMonth = team.month === capacitySelectedMonth;
                            const matchesRegion = capacitySelectedRegion === 'all' || team.region === capacitySelectedRegion;
                            return matchesMonth && matchesRegion;
                          }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                  {t('leadMIS.messages.noCSCRecords', 'No CSC capacity records found for the selected filters.')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {t('leadMIS.messages.trySelecting', 'Try selecting a different month or region.')}
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscProductivity.totalCSCs', 'Total CSCs')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.workload.avgUtilization', 'Average Utilization')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.table.totalLeads', 'Total Leads Assigned')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.workload.overloadedCSCs', 'Overloaded CSCs')}</Typography>
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
                        label={t('leadMIS.pivotReports.dateRange', 'Date Range')}
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
                        label={t('leadMIS.filters.region', 'Region')}
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
                        label={t('leadMIS.filters.team', 'Team Filter')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                    {t('leadMIS.workload.chart', 'CSC Workload Distribution')}
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
                      <Bar dataKey="assigned" fill={theme.palette.primary.main} name={t('leadMIS.workload.assigned', 'Assigned Leads')} />
                      <Bar dataKey="completed" fill={theme.palette.success.main} name={t('leadMIS.workload.completed', 'Completed')} />
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
                    {t('leadMIS.workload.share', 'Workload Share')}
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
                    {t('leadMIS.workload.tableTitle', 'Detailed CSC Performance')}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.cscName', 'CSC')}</TableCell>
                          <TableCell>{t('leadMIS.filters.month', 'Month')}</TableCell>
                          <TableCell>{t('leadMIS.filters.region', 'Region')}</TableCell>
                          <TableCell>{t('leadMIS.workload.team', 'Team')}</TableCell>
                          <TableCell align="right">{t('leadMIS.workload.assigned', 'Assigned')}</TableCell>
                          <TableCell align="right">{t('leadMIS.workload.completed', 'Completed')}</TableCell>
                          <TableCell align="right">{t('leadMIS.capacityPlanning.table.utilization', 'Utilization %')}</TableCell>
                          <TableCell align="center">{t('leadMIS.filters.status', 'Status')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(workloadDistributionData) ? workloadDistributionData : [])
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
                                  {row.month === 'thisMonth' ? t('leadMIS.detailedReport.thisMonth', 'This Month') : row.month === 'lastMonth' ? 'Last Month' : 'Last 3 Months'}
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
                                  label={`${row.status === 'overloaded' ? '🔴' : row.status === 'balanced' ? '🟢' : '🟡'} ${row.status === 'overloaded' ? t('leadMIS.capacityPlanning.status.overloaded') :
                                    row.status === 'balanced' ? t('leadMIS.capacityPlanning.status.balanced') :
                                      t('leadMIS.capacityPlanning.status.underutilized')
                                    }`}
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
                        {(Array.isArray(workloadDistributionData) ? workloadDistributionData : [])
                          .filter(row => {
                            const matchesDateRange = workloadSelectedDateRange === 'last3Months' || row.month === workloadSelectedDateRange;
                            const matchesRegion = workloadSelectedRegion === 'all' || row.region === workloadSelectedRegion;
                            const matchesTeam = workloadSelectedTeam === 'all' || row.team === workloadSelectedTeam;
                            return matchesDateRange && matchesRegion && matchesTeam;
                          }).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                  {t('leadMIS.messages.noCSCPerformance', 'No CSC performance records found for the selected filters.')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {t('leadMIS.messages.trySelecting', 'Try selecting different date range, region, or team filters.')}
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
                    {t('leadMIS.detailedReport.title', 'Detailed MIS Report')}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">{t('leadMIS.detailedReport.generatedOn', 'Report Generated On')}:</Typography>
                      <Typography variant="body1" fontWeight="600">{new Date().toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">{t('leadMIS.detailedReport.period', 'Period')}:</Typography>
                      <Typography variant="body1" fontWeight="600">{t('leadMIS.detailedReport.thisMonth', 'This Month')}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportExcel}>
                          {t('leadMIS.detailedReport.downloadExcel', 'Download Excel')}
                        </Button>
                        <Button variant="outlined" startIcon={<PdfIcon />} onClick={handleExportPDF}>
                          {t('leadMIS.detailedReport.downloadPDF', 'Download PDF')}
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
                        label={t('leadMIS.filters.region', 'Select Region')}
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
                        label={t('leadMIS.filters.performance', 'Filter by Performance')}
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
                        {t('leadMIS.filters.reset', 'Reset Filters')}
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscProductivity.totalCSCs', 'Total CSCs')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscLoad.avgCalls', 'Average Calls per CSC')}</Typography>
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
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>{t('leadMIS.cscLoad.meetingTarget', '% Meeting Target')}</Typography>
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
                    {t('leadMIS.cscLoad.tableTitle', 'CSC Load Tracking Data')}
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leadMIS.table.cscName', 'CSC Name')}</TableCell>
                          <TableCell>{t('leadMIS.filters.month', 'Month')}</TableCell>
                          <TableCell>{t('leadMIS.filters.region', 'Region')}</TableCell>
                          <TableCell align="center">{t('leadMIS.cscProductivity.totalCalls', 'Total Calls')}</TableCell>
                          <TableCell align="center">{t('leadMIS.dailyMIS.cards.policiesSold', 'Policies Sold')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.conversionRate', 'Conversion %')}</TableCell>
                          <TableCell align="center">{t('leadMIS.table.performance', 'Performance')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(Array.isArray(cscLoadTrackingData) ? cscLoadTrackingData : [])
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
                                  label={t(`leadMIS.performance.${record.performance.replace(/\s+/g, '').toLowerCase().replace('excellent', 'excellent').replace('good', 'good').replace('average', 'average').replace('needsimprovement', 'needsImprovement')}`, record.performance)}
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
                                  {t('leadMIS.messages.noCSCRecords', 'No CSC records found for the selected filters.')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {t('leadMIS.messages.trySelecting', 'Try selecting a different month or region.')}
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
