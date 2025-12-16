import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Chip, IconButton,
  Menu, MenuItem, Tooltip, Button, FormControl,
  InputLabel, Select, ListItemText, Divider, Alert,
  ListItemIcon, Card, CardContent, Grow, Fade, Zoom, alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  FileDownload as FileDownloadIcon,
  TableView as TableViewIcon,
  InsertDriveFile as InsertDriveFileIcon,
  History as HistoryIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Refresh as RefreshIcon,
  FactCheck as FactCheckIcon,
  PriorityHigh as PriorityHighIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { useSettings } from '../context/SettingsContext';
import { useTheme } from '@mui/material/styles';
import * as XLSX from 'xlsx';

const ClosedCases = () => {
  const navigate = useNavigate();
  // const { settings } = useSettings();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  const mockCases = useMemo(() => [
    {
      id: 'CASE-002',
      customerName: 'Meera Kapoor',
      policyNumber: 'POL-23456',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Rajesh Kumar',
      uploadDate: '2025-04-07',
      closedDate: '2025-04-15',
      isPriority: false,
      batchId: 'BATCH-2025-04-07-B',
      nextFollowUpDate: '2025-05-07',
      nextActionPlan: 'Policy successfully renewed',
      currentWorkStep: 'Completed',
      // New fields
      customerProfile: 'HNI',
      customerMobile: '9876543211',
      preferredLanguage: 'English',
      assignedAgent: 'Rajesh Kumar',
      productName: 'Home Insurance Premium',
      productCategory: 'Property',
      channel: 'Branch',
      subChannel: 'Relationship Manager',
      lastActionDate: '2025-04-15',
      totalCalls: 5,
      comments: [],
      contactInfo: {
        email: 'meera.kapoor@gmail.com',
        phone: '9876543211'
      },
      policyDetails: {
        type: 'Home',
        expiryDate: '2025-05-10',
        premium: 950.00,
        renewalDate: '2025-05-10'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-006',
      customerName: 'Aditya Malhotra',
      policyNumber: 'POL-67890',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Ananya Reddy',
      uploadDate: '2025-04-02',
      closedDate: '2025-04-10',
      isPriority: true,
      batchId: 'BATCH-2025-04-02-A',
      nextFollowUpDate: '2025-05-25',
      nextActionPlan: 'Policy renewal completed successfully',
      currentWorkStep: 'Completed',
      // New fields
      customerProfile: 'Normal',
      customerMobile: '9876543215',
      preferredLanguage: 'Hindi',
      assignedAgent: 'Ananya Reddy',
      productName: 'Comprehensive Auto Insurance',
      productCategory: 'Motor',
      channel: 'Online',
      subChannel: 'Website',
      lastActionDate: '2025-04-10',
      totalCalls: 3,
      comments: [],
      contactInfo: {
        email: 'aditya.malhotra@gmail.com',
        phone: '9876543215'
      },
      policyDetails: {
        type: 'Auto',
        expiryDate: '2025-05-25',
        premium: 1550.00,
        renewalDate: '2025-05-25'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-008',
      customerName: 'Neha Sharma',
      policyNumber: 'POL-89012',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Priya Patel',
      uploadDate: '2025-03-25',
      closedDate: '2025-04-05',
      isPriority: false,
      batchId: 'BATCH-2025-03-25-D',
      nextFollowUpDate: '2025-06-15',
      nextActionPlan: 'Life insurance policy renewed',
      currentWorkStep: 'Completed',
      // New fields
      customerProfile: 'HNI',
      customerMobile: '9876543216',
      preferredLanguage: 'English',
      assignedAgent: 'Priya Patel',
      productName: 'Term Life Insurance Plus',
      productCategory: 'Life',
      channel: 'Telecalling',
      subChannel: 'Outbound',
      lastActionDate: '2025-04-05',
      totalCalls: 7,
      comments: [],
      contactInfo: {
        email: 'neha.sharma@gmail.com',
        phone: '9876543216'
      },
      policyDetails: {
        type: 'Life',
        expiryDate: '2025-06-15',
        premium: 2250.00,
        renewalDate: '2025-06-15'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-012',
      customerName: 'Arun Kumar',
      policyNumber: 'POL-12223',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Emma Davis',
      uploadDate: '2025-03-20',
      closedDate: '2025-03-28',
      isPriority: true,
      batchId: 'BATCH-2025-03-20-A',
      nextFollowUpDate: '2025-06-28',
      nextActionPlan: 'Motor insurance renewed successfully',
      currentWorkStep: 'Completed',
      customerProfile: 'Normal',
      customerMobile: '9876543221',
      preferredLanguage: 'Tamil',
      assignedAgent: 'Emma Davis',
      productName: 'Comprehensive Motor Insurance',
      productCategory: 'Motor',
      channel: 'Online',
      subChannel: 'Mobile App',
      lastActionDate: '2025-03-28',
      totalCalls: 3,
      comments: [],
      contactInfo: {
        email: 'arun.kumar@gmail.com',
        phone: '9876543221'
      },
      policyDetails: {
        type: 'Motor',
        expiryDate: '2025-06-28',
        premium: 1450.00,
        renewalDate: '2025-06-28'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-013',
      customerName: 'Sunita Patel',
      policyNumber: 'POL-13334',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Alex Rodriguez',
      uploadDate: '2025-03-18',
      closedDate: '2025-03-26',
      isPriority: false,
      batchId: 'BATCH-2025-03-18-B',
      nextFollowUpDate: '2025-07-26',
      nextActionPlan: 'Health insurance policy renewed',
      currentWorkStep: 'Completed',
      customerProfile: 'HNI',
      customerMobile: '9876543222',
      preferredLanguage: 'Gujarati',
      assignedAgent: 'Alex Rodriguez',
      productName: 'Family Health Shield',
      productCategory: 'Health',
      channel: 'Branch',
      subChannel: 'Walk-in',
      lastActionDate: '2025-03-26',
      totalCalls: 2,
      comments: [],
      contactInfo: {
        email: 'sunita.patel@yahoo.com',
        phone: '9876543222'
      },
      policyDetails: {
        type: 'Health',
        expiryDate: '2025-07-26',
        premium: 2100.00,
        renewalDate: '2025-07-26'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-014',
      customerName: 'Manoj Singh',
      policyNumber: 'POL-14445',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Lisa Wang',
      uploadDate: '2025-03-15',
      closedDate: '2025-03-24',
      isPriority: true,
      batchId: 'BATCH-2025-03-15-C',
      nextFollowUpDate: '2025-08-24',
      nextActionPlan: 'Travel insurance renewed',
      currentWorkStep: 'Completed',
      customerProfile: 'Normal',
      customerMobile: '9876543223',
      preferredLanguage: 'Hindi',
      assignedAgent: 'Lisa Wang',
      productName: 'International Travel Insurance',
      productCategory: 'Travel',
      channel: 'Partner',
      subChannel: 'Travel Agent',
      lastActionDate: '2025-03-24',
      totalCalls: 4,
      comments: [],
      contactInfo: {
        email: 'manoj.singh@hotmail.com',
        phone: '9876543223'
      },
      policyDetails: {
        type: 'Travel',
        expiryDate: '2025-08-24',
        premium: 850.00,
        renewalDate: '2025-08-24'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-015',
      customerName: 'Priya Nair',
      policyNumber: 'POL-15556',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Mike Chen',
      uploadDate: '2025-03-12',
      closedDate: '2025-03-22',
      isPriority: false,
      batchId: 'BATCH-2025-03-12-A',
      nextFollowUpDate: '2025-09-22',
      nextActionPlan: 'Property insurance renewed',
      currentWorkStep: 'Completed',
      customerProfile: 'HNI',
      customerMobile: '9876543224',
      preferredLanguage: 'Malayalam',
      assignedAgent: 'Mike Chen',
      productName: 'Home Protection Plus',
      productCategory: 'Property',
      channel: 'Call Center',
      subChannel: 'Inbound',
      lastActionDate: '2025-03-22',
      totalCalls: 1,
      comments: [],
      contactInfo: {
        email: 'priya.nair@outlook.com',
        phone: '9876543224'
      },
      policyDetails: {
        type: 'Property',
        expiryDate: '2025-09-22',
        premium: 3750.00,
        renewalDate: '2025-09-22'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    },
    {
      id: 'CASE-016',
      customerName: 'Ravi Gupta',
      policyNumber: 'POL-16667',
      status: 'Renewed',
      subStatus: 'Completed',
      policyStatus: 'Active',
      agent: 'Sarah Johnson',
      uploadDate: '2025-03-10',
      closedDate: '2025-03-20',
      isPriority: true,
      batchId: 'BATCH-2025-03-10-D',
      nextFollowUpDate: '2025-10-20',
      nextActionPlan: 'Life insurance policy renewed with increased coverage',
      currentWorkStep: 'Completed',
      customerProfile: 'Normal',
      customerMobile: '9876543225',
      preferredLanguage: 'English',
      assignedAgent: 'Sarah Johnson',
      productName: 'Whole Life Insurance Premium',
      productCategory: 'Life',
      channel: 'Online',
      subChannel: 'Website',
      lastActionDate: '2025-03-20',
      totalCalls: 6,
      comments: [],
      contactInfo: {
        email: 'ravi.gupta@gmail.com',
        phone: '9876543225'
      },
      policyDetails: {
        type: 'Life',
        expiryDate: '2025-10-20',
        premium: 4200.00,
        renewalDate: '2025-10-20'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Payment Processed', 'Renewed']
    }
  ], []);

  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [agentFilter, setAgentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [error] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [, setCurrentCase] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    // In a real application, you would fetch data from an API
    // Initialize with only Renewed status cases
    const initialCases = mockCases.filter(caseItem => caseItem.status === 'Renewed');
    setCases(initialCases);
  }, [mockCases]);

  // Add loaded state for animations similar to Settings page
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    // Apply all filters
    applyAllFilters(searchValue, agentFilter, dateFilter);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);

    // Apply all filters when the filter menu is closed
    applyAllFilters(searchTerm, agentFilter, dateFilter);
  };

  const handleAgentFilterChange = (event) => {
    const newAgentFilter = event.target.value;
    setAgentFilter(newAgentFilter);

    // Apply all filters
    applyAllFilters(searchTerm, newAgentFilter, dateFilter);
  };

  const handleDateFilterChange = (event) => {
    const newDateFilter = event.target.value;
    setDateFilter(newDateFilter);

    // Apply all filters
    applyAllFilters(searchTerm, agentFilter, newDateFilter);
  };

  // Helper function to apply all filters
  const applyAllFilters = (search, agent, date) => {
    // Process comma-separated search terms
    const searchTerms = search
      .split(',')
      .map(term => term.trim().toLowerCase())
      .filter(term => term !== '');

    // Filter cases based on all criteria
    const filteredCases = mockCases.filter(caseItem => {
      // Filter by search terms
      const matchesSearch = searchTerms.length === 0 || searchTerms.some(term =>
        caseItem.id.toLowerCase().includes(term) ||
        caseItem.customerName.toLowerCase().includes(term) ||
        caseItem.policyNumber.toLowerCase().includes(term)
      );

      // Filter by agent
      const matchesAgent = agent === 'all' ||
        caseItem.agent.toLowerCase() === agent.toLowerCase();

      // Filter by date if needed (example implementation)
      let matchesDate = true;
      if (date !== 'all') {
        const today = new Date();
        const caseDate = new Date(caseItem.closedDate); // Use closedDate for closed cases

        if (date === 'today') {
          matchesDate = caseDate.toDateString() === today.toDateString();
        } else if (date === 'yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          matchesDate = caseDate.toDateString() === yesterday.toDateString();
        } else if (date === 'lastWeek') {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          matchesDate = caseDate >= lastWeek;
        } else if (date === 'lastMonth') {
          const lastMonth = new Date(today);
          lastMonth.setDate(today.getDate() - 30);
          matchesDate = caseDate >= lastMonth;
        }
      }

      // Only show cases with Renewed status
      return matchesSearch && matchesAgent && matchesDate && caseItem.status === 'Renewed';
    });

    setCases(filteredCases);
    setPage(0); // Reset to first page when filtering
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  // Export to XLS functionality
  const exportToXLS = () => {
    try {
      const exportData = cases.map(caseItem => ({
        'Case ID': caseItem.id,
        'Customer Name': caseItem.customerName,
        'Customer Profile': caseItem.customerProfile,
        'Mobile': caseItem.customerMobile,
        'Email': caseItem.contactInfo?.email || '',
        'Language': caseItem.preferredLanguage,
        'Policy Number': caseItem.policyNumber,
        'Product Name': caseItem.productName,
        'Product Category': caseItem.productCategory,
        'Channel': caseItem.channel,
        'Sub Channel': caseItem.subChannel,
        'Batch ID': caseItem.batchId,
        'Status': caseItem.status,
        'Policy Status': caseItem.policyStatus,
        'Agent': caseItem.agent,
        'Priority': caseItem.isPriority ? 'Yes' : 'No',
        'Total Calls': caseItem.totalCalls,
        'Premium': caseItem.policyDetails?.premium || '',
        'Renewal Date': caseItem.policyDetails?.renewalDate || '',
        'Closed Date': caseItem.closedDate,
        'Upload Date': caseItem.uploadDate
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Closed Cases');
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `closed_cases_export_${date}.xlsx`);

      handleExportClose();
      setSuccessMessage(`Successfully exported ${cases.length} cases to Excel`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error exporting to XLS:', error);
      handleExportClose();
    }
  };

  // Export to CSV functionality
  const exportToCSV = () => {
    try {
      const headers = ['Case ID', 'Customer Name', 'Profile', 'Mobile', 'Email', 'Language', 'Policy Number', 'Product Name', 'Category', 'Channel', 'Sub Channel', 'Batch ID', 'Status', 'Policy Status', 'Agent', 'Priority', 'Total Calls', 'Premium', 'Renewal Date', 'Closed Date', 'Upload Date'];

      const rows = cases.map(caseItem => [
        caseItem.id, caseItem.customerName, caseItem.customerProfile, caseItem.customerMobile,
        caseItem.contactInfo?.email || '', caseItem.preferredLanguage, caseItem.policyNumber,
        caseItem.productName, caseItem.productCategory, caseItem.channel, caseItem.subChannel,
        caseItem.batchId, caseItem.status, caseItem.policyStatus, caseItem.agent,
        caseItem.isPriority ? 'Yes' : 'No', caseItem.totalCalls, caseItem.policyDetails?.premium || '',
        caseItem.policyDetails?.renewalDate || '', caseItem.closedDate, caseItem.uploadDate
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `closed_cases_export_${date}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      handleExportClose();
      setSuccessMessage(`Successfully exported ${cases.length} cases to CSV`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      handleExportClose();
    }
  };

  const handleViewFlow = (caseData) => {
    setCurrentCase(caseData);
    navigate(`/logs?caseId=${caseData.id}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'renewed': return 'success';
      case 'in progress': return 'info';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getPolicyStatusColor = (policyStatus) => {
    switch (policyStatus.toLowerCase()) {
      case 'active': return 'success';
      case 'pre due stage': return 'info';
      case 'policy due': return 'warning';
      case 'reinstatement': return 'error';
      default: return 'default';
    }
  };

  const getCustomerProfileColor = (profile) => {
    switch (profile.toLowerCase()) {
      case 'hni': return 'success';
      case 'normal': return 'default';
      default: return 'default';
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600">
            Closed Cases
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Zoom in={loaded} style={{ transitionDelay: '200ms' }}>
              <Button
                variant="contained"
                startIcon={<FilterIcon />}
                onClick={handleFilterClick}
                color="primary"
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                  }
                }}
              >
                Filters
              </Button>
            </Zoom>

            <Zoom in={loaded} style={{ transitionDelay: '300ms' }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportClick}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Export
              </Button>
            </Zoom>
          </Box>
        </Box>

        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              {successMessage}
            </Alert>
          </Grow>
        )}

        {error && (
          <Grow in={!!error}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              {error}
            </Alert>
          </Grow>
        )}

        <Grow in={loaded} timeout={400}>
          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'visible',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6" fontWeight="600">
                  Search Closed Cases
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TextField
                placeholder="Search by Case ID, Customer Name or Policy Number (comma-separated for multiple values)"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grow>



        {/* Scrollable Table Section */}
        <Grow in={loaded} timeout={600}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              mb: 4,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
              }
            }}
          >
            <TableContainer
              sx={{
                maxHeight: '70vh',
                overflowX: 'auto',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: alpha(theme.palette.success.main, 0.1),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: alpha(theme.palette.success.main, 0.3),
                  borderRadius: '4px',
                  '&:hover': {
                    background: alpha(theme.palette.success.main, 0.5),
                  }
                }
              }}
            >
              <Table
                sx={{
                  minWidth: 2400,
                  tableLayout: 'fixed'
                }}
                aria-label="closed cases table"
              >
                <TableHead sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  bgcolor: 'background.paper'
                }}>
                  <TableRow sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    '& .MuiTableCell-head': {
                      borderBottom: `2px solid ${alpha(theme.palette.success.main, 0.15)}`,
                      position: 'sticky',
                      top: 0,
                      bgcolor: alpha(theme.palette.success.main, 0.08),
                      zIndex: 10,
                      fontSize: '0.875rem',
                      letterSpacing: '0.02em'
                    }
                  }}>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 180, textAlign: 'center' }}>Actions</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Case ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 180 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Profile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Mobile</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 130 }}>Language</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 160 }}>Policy Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 200 }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 170 }}>Channel</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 130 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Policy Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 160 }}>Agent</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 120, textAlign: 'center' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Last Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 120, textAlign: 'center' }}>Calls</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Renewal Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Closed Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Upload Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((caseItem, index) => (
                      <TableRow
                        key={caseItem.id}
                        hover
                        onClick={() => navigate(`/cases/${caseItem.id}`)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'background-color 0.2s, transform 0.1s',
                          bgcolor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.success.main, 0.02),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.success.main, 0.08),
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            zIndex: 1,
                          },
                          '& .MuiTableCell-root': {
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                            py: 2,
                            px: 2,
                            fontSize: '0.875rem',
                            verticalAlign: 'middle'
                          }
                        }}
                      >
                        <TableCell sx={{ textAlign: 'center', width: 180 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Tooltip title="View Details" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/cases/${caseItem.id}`);
                                }}
                                sx={{
                                  color: 'primary.main',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.15)' }
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View History" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewFlow(caseItem);
                                }}
                                sx={{
                                  color: 'info.main',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.15)' }
                                }}
                              >
                                <HistoryIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Typography variant="body2" fontWeight="500" color="primary">
                            {caseItem.id}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 180 }}>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.customerName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <Chip
                            label={caseItem.customerProfile}
                            color={getCustomerProfileColor(caseItem.customerProfile)}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              minWidth: '100px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.customerMobile}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 130 }}>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.preferredLanguage}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 160 }}>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.policyNumber}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 200 }}>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.productName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Chip
                            label={caseItem.productCategory}
                            color="info"
                            variant="outlined"
                            size="small"
                            sx={{
                              fontWeight: 500,
                              minWidth: '110px',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 170 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" fontWeight="500">
                              {caseItem.channel}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {caseItem.subChannel}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.batchId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 130 }}>
                          <Chip
                            label={caseItem.status}
                            color={getStatusColor(caseItem.status)}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              minWidth: '110px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <Chip
                            label={caseItem.policyStatus}
                            color={getPolicyStatusColor(caseItem.policyStatus)}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              minWidth: '130px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              borderRadius: 5
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 160 }}>
                          <Typography variant="body2" fontWeight="500">
                            {caseItem.assignedAgent}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 120, textAlign: 'center' }}>
                          <Chip
                            icon={<PriorityHighIcon />}
                            label={caseItem.isPriority ? "Priority" : "Normal"}
                            color={caseItem.isPriority ? "error" : "primary"}
                            variant={caseItem.isPriority ? "filled" : "outlined"}
                            size="small"
                            sx={{
                              cursor: 'pointer',
                              minWidth: '100px',
                              fontWeight: 500,
                              borderRadius: 5,
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              ...(caseItem.isPriority ? {} : {
                                borderWidth: '1px',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '& .MuiChip-icon': {
                                  color: 'primary.main'
                                },
                              })
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <Typography variant="body2" fontWeight="500">
                            {new Date(caseItem.lastActionDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 120, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                            <Typography variant="body2" fontWeight="600" color="primary">
                              {caseItem.totalCalls}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              calls
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ width: 150 }}>
                          <Typography
                            variant="body2"
                            fontWeight="500"
                            sx={{
                              color: (() => {
                                const renewalDate = new Date(caseItem.policyDetails.renewalDate);
                                const today = new Date();
                                const daysUntilRenewal = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));

                                if (daysUntilRenewal <= 0) {
                                  return 'error.main';
                                } else if (daysUntilRenewal <= 7) {
                                  return 'error.main';
                                } else if (daysUntilRenewal <= 30) {
                                  return 'warning.main';
                                }
                                return 'text.primary';
                              })()
                            }}
                          >
                            {new Date(caseItem.policyDetails.renewalDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Typography variant="body2" fontWeight="500">
                            {new Date(caseItem.closedDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Typography variant="body2" fontWeight="500">
                            {new Date(caseItem.uploadDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grow>

        {/* Fixed Pagination Outside Scrollable Area */}
        <Grow in={loaded} timeout={800}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              mt: 2
            }}
          >
            <Box sx={{ p: 2 }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={cases.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                    fontWeight: 500,
                  },
                  '.MuiTablePagination-actions': {
                    '& .MuiIconButton-root': {
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.15)',
                        backgroundColor: 'transparent'
                      }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Grow>

        {/* Export Menu */}
        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleExportClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              mt: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }
          }}
        >
          <MenuItem
            onClick={exportToXLS}
            sx={{
              borderRadius: 1,
              py: 1.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon>
              <TableViewIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Export as XLS" />
          </MenuItem>
          <MenuItem
            onClick={exportToCSV}
            sx={{
              borderRadius: 1,
              py: 1.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Export as CSV" />
          </MenuItem>
        </Menu>

        {/* Advanced Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: '220px',
              mt: 1,
              p: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 1, pb: 2, fontWeight: 600 }}>
            Filter Closed Cases
          </Typography>
          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Agent</InputLabel>
              <Select
                value={agentFilter}
                label="Agent"
                onChange={handleAgentFilterChange}
                sx={{
                  borderRadius: 2,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="all">All Agents</MenuItem>
                <MenuItem value="Priya Patel">Priya Patel</MenuItem>
                <MenuItem value="Rajesh Kumar">Rajesh Kumar</MenuItem>
                <MenuItem value="Ananya Reddy">Ananya Reddy</MenuItem>
                <MenuItem value="Amit Shah">Amit Shah</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>

          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                label="Date"
                onChange={handleDateFilterChange}
                sx={{
                  borderRadius: 2,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="lastWeek">Last 7 Days</MenuItem>
                <MenuItem value="lastMonth">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, px: 1 }}>
            <Button
              variant="contained"
              onClick={handleFilterClose}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 2,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                }
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Menu>

        {/* Auto-refresh button at the bottom right */}
        <Box sx={{ position: 'fixed', right: 30, bottom: 30 }}>
          <Zoom in={loaded} style={{ transitionDelay: '800ms' }}>
            <Tooltip title="Refresh closed cases" arrow>
              <IconButton
                color="success"
                onClick={() => {
                  // Refresh data
                  setSuccessMessage('Cases refreshed successfully');
                  setTimeout(() => setSuccessMessage(''), 3000);
                }}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 14px rgba(76,175,80,0.25)',
                  width: 56,
                  height: 56,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) rotate(30deg)',
                    boxShadow: '0 6px 20px rgba(76,175,80,0.35)',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Zoom>
        </Box>
      </Box>
    </Fade>
  );
};

export default ClosedCases; 