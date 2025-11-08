import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, Divider,
  useTheme, alpha, Fade, Grow,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, TextField, Button,
  IconButton, Tooltip, Chip, Tabs, Tab, Dialog, DialogTitle,
  DialogContent, DialogActions, Badge,
  Avatar, InputAdornment, Alert, LinearProgress, CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Receipt as ReceiptIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon,
  Message as MessageIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Phone as PhoneIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useSettings } from '../context/SettingsContext';

const Billing = () => {
  const theme = useTheme();
  const { settings } = useSettings();
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState({
    utilization: [],
    platform: [],
    totalMonthly: 0
  });

  // New state for Quick Edit functionality
  const [quickEditDialog, setQuickEditDialog] = useState({
    open: false,
    invoiceId: null,
    receivableInfo: {
      dueDate: null,
      paymentTerms: '',
      creditLimit: '',
      accountingCode: '',
      taxId: '',
      billingAddress: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountNumber: '',
        routingNumber: '',
        bankName: '',
        swiftCode: ''
      },
      notes: ''
    }
  });

  // Vendor communication data
  const [vendorCommunications] = useState([
    {
      vendorId: 'VEN001',
      vendorName: 'SMS Gateway Pro',
      vendorType: 'SMS Provider',
      totalCommunications: 1247,
      deliveryStats: {
        delivered: 1198,
        failed: 35,
        pending: 14
      },
      costPerMessage: 0.05,
      totalCost: 62.35,
      lastActivity: '2024-01-15T10:30:00Z',
      contactPerson: 'John Smith',
      supportEmail: 'support@smsgateway.com'
    },
    {
      vendorId: 'VEN002',
      vendorName: 'Email Service Plus',
      vendorType: 'Email Provider',
      totalCommunications: 892,
      deliveryStats: {
        delivered: 856,
        failed: 23,
        pending: 13
      },
      costPerMessage: 0.02,
      totalCost: 17.84,
      lastActivity: '2024-01-15T09:45:00Z',
      contactPerson: 'Sarah Johnson',
      supportEmail: 'support@emailplus.com'
    },
    {
      vendorId: 'VEN003',
      vendorName: 'WhatsApp Business API',
      vendorType: 'WhatsApp Provider',
      totalCommunications: 634,
      deliveryStats: {
        delivered: 612,
        failed: 18,
        pending: 4
      },
      costPerMessage: 0.08,
      totalCost: 50.72,
      lastActivity: '2024-01-15T11:20:00Z',
      contactPerson: 'Mike Chen',
      supportEmail: 'api-support@whatsapp.com'
    }
  ]);

  // Communication delivery status tracking
  const [deliveryStatusView, setDeliveryStatusView] = useState('individual'); // 'individual' or 'bulk'
  const [individualCases] = useState([
    {
      caseId: 'CASE001',
      customerName: 'Arjun Sharma',
      policyNumber: 'POL123456',
      communicationType: 'SMS',
      message: 'Policy renewal reminder - Due in 7 days',
      sentAt: '2024-01-15T08:30:00Z',
      deliveryStatus: 'delivered',
      deliveredAt: '2024-01-15T08:30:15Z',
      vendor: 'SMS Gateway Pro',
      cost: 0.05,
      attempts: 1,
      errorMessage: null
    },
    {
      caseId: 'CASE002',
      customerName: 'Priya Patel',
      policyNumber: 'POL789012',
      communicationType: 'Email',
      message: 'Welcome to your new policy',
      sentAt: '2024-01-15T09:15:00Z',
      deliveryStatus: 'failed',
      deliveredAt: null,
      vendor: 'Email Service Plus',
      cost: 0.02,
      attempts: 3,
      errorMessage: 'Invalid email address'
    },
    {
      caseId: 'CASE003',
      customerName: 'Rajesh Kumar',
      policyNumber: 'POL345678',
      communicationType: 'WhatsApp',
      message: 'Claim status update - Approved',
      sentAt: '2024-01-15T10:00:00Z',
      deliveryStatus: 'pending',
      deliveredAt: null,
      vendor: 'WhatsApp Business API',
      cost: 0.08,
      attempts: 1,
      errorMessage: null
    }
  ]);

  const [bulkCampaigns] = useState([
    {
      campaignId: 'BULK001',
      campaignName: 'Monthly Policy Renewal Reminders',
      type: 'SMS',
      totalRecipients: 1500,
      sentCount: 1500,
      deliveredCount: 1435,
      failedCount: 45,
      pendingCount: 20,
      startedAt: '2024-01-15T06:00:00Z',
      completedAt: '2024-01-15T06:45:00Z',
      vendor: 'SMS Gateway Pro',
      totalCost: 75.00,
      deliveryRate: 95.67
    },
    {
      campaignId: 'BULK002',
      campaignName: 'New Product Launch Announcement',
      type: 'Email',
      totalRecipients: 2500,
      sentCount: 2500,
      deliveredCount: 2387,
      failedCount: 89,
      pendingCount: 24,
      startedAt: '2024-01-14T14:00:00Z',
      completedAt: '2024-01-14T15:30:00Z',
      vendor: 'Email Service Plus',
      totalCost: 50.00,
      deliveryRate: 95.48
    }
  ]);
  
  // Sample communication statistics data
  const [communicationStats] = useState({
    sms: [
      { date: '2024-01-01', count: 150, status: 'Delivered' },
      { date: '2024-01-02', count: 200, status: 'Delivered' },
      { date: '2024-01-03', count: 180, status: 'Delivered' }
    ],
    email: [
      { date: '2024-01-01', count: 75, status: 'Sent' },
      { date: '2024-01-02', count: 90, status: 'Sent' },
      { date: '2024-01-03', count: 85, status: 'Sent' }
    ],
    whatsapp: [
      { date: '2024-01-01', count: 120, status: 'Delivered' },
      { date: '2024-01-02', count: 150, status: 'Delivered' },
      { date: '2024-01-03', count: 130, status: 'Delivered' }
    ]
  });

  // Sample invoice data with enhanced receivable information
  const [invoices, setInvoices] = useState([
    { 
      id: 'INV-2023-IN001', 
      date: '2023-10-01', 
      amount: 95000.00, 
      status: 'Paid', 
      pdfUrl: '#',
      receivableInfo: {
        dueDate: '2023-10-31',
        paymentTerms: 'Net 30',
        creditLimit: '500000',
        accountingCode: 'ACC-001',
        taxId: 'TAX123456',
        billingAddress: '123 Business St, Mumbai, MH 400001',
        contactPerson: 'Finance Manager',
        contactEmail: 'finance@company.com',
        contactPhone: '+91-9876543210',
        paymentMethod: 'bank_transfer',
        bankDetails: {
          accountNumber: '1234567890',
          routingNumber: 'HDFC0001234',
          bankName: 'HDFC Bank',
          swiftCode: 'HDFCINBB'
        },
        notes: 'Payment received on time'
      }
    },
    { 
      id: 'INV-2023-IN002', 
      date: '2023-11-01', 
      amount: 102500.50, 
      status: 'Paid', 
      pdfUrl: '#',
      receivableInfo: {
        dueDate: '2023-11-30',
        paymentTerms: 'Net 30',
        creditLimit: '500000',
        accountingCode: 'ACC-002',
        taxId: 'TAX789012',
        billingAddress: '456 Corporate Ave, Delhi, DL 110001',
        contactPerson: 'Accounts Payable',
        contactEmail: 'ap@company.com',
        contactPhone: '+91-9876543211',
        paymentMethod: 'cheque',
        bankDetails: {
          accountNumber: '',
          routingNumber: '',
          bankName: '',
          swiftCode: ''
        },
        notes: 'Paid via cheque'
      }
    },
    { 
      id: 'INV-2023-IN003', 
      date: '2023-12-01', 
      amount: 108750.75, 
      status: 'Pending', 
      pdfUrl: '#',
      receivableInfo: {
        dueDate: '2023-12-31',
        paymentTerms: 'Net 30',
        creditLimit: '500000',
        accountingCode: 'ACC-003',
        taxId: 'TAX345678',
        billingAddress: '789 Enterprise Blvd, Bangalore, KA 560001',
        contactPerson: 'CFO',
        contactEmail: 'cfo@company.com',
        contactPhone: '+91-9876543212',
        paymentMethod: 'bank_transfer',
        bankDetails: {
          accountNumber: '9876543210',
          routingNumber: 'ICIC0001234',
          bankName: 'ICICI Bank',
          swiftCode: 'ICICINBB'
        },
        notes: 'Follow up required'
      }
    },
    { 
      id: 'INV-2024-IN001', 
      date: '2024-01-01', 
      amount: 105000.25, 
      status: 'Pending', 
      pdfUrl: '#',
      receivableInfo: {
        dueDate: '2024-01-31',
        paymentTerms: 'Net 30',
        creditLimit: '500000',
        accountingCode: 'ACC-004',
        taxId: 'TAX901234',
        billingAddress: '321 Business Park, Pune, MH 411001',
        contactPerson: 'Finance Director',
        contactEmail: 'finance.director@company.com',
        contactPhone: '+91-9876543213',
        paymentMethod: 'bank_transfer',
        bankDetails: {
          accountNumber: '5432109876',
          routingNumber: 'SBIN0001234',
          bankName: 'State Bank of India',
          swiftCode: 'SBININBB'
        },
        notes: 'New client - monitor closely'
      }
    }
  ]);

  // Months array for dropdown
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Years array for dropdown (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  // Load animation effect
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Apply filters and update data
  useEffect(() => {
    // In a real app, this would fetch filtered data from an API
    // For this demo, we'll just use the sample data from settings
    
    // Simulate filtered data based on selected filters
    // In a real app, you would fetch this data from your backend
    setFilteredData({
      utilization: settings.billing.utilization,
      platform: settings.billing.platform,
      totalMonthly: settings.billing.totalMonthly
    });
    
    // Just for demonstration, we'll log the filter criteria
    if (filterType === 'month') {
              // Filtering for specific month and year
      } else {
        // Filtering by date range
      }
  }, [filterType, selectedMonth, selectedYear, startDate, endDate, settings.billing]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF or CSV
    alert('Download functionality would be implemented here');
  };

  // Handle view invoice
  const handleViewInvoice = (invoiceId) => {
    // In a real app, this would open a modal or navigate to an invoice detail page
    alert(`Viewing invoice ${invoiceId}`);
  };

  // Handle download invoice
  const handleDownloadInvoice = (invoiceId) => {
    // In a real app, this would download the invoice PDF
    alert(`Downloading invoice ${invoiceId}`);
  };

  // Payment gateway state
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    invoiceId: null,
    amount: 0,
    processing: false,
    method: 'card',
    cardDetails: {
      number: '',
      expiry: '',
      cvv: '',
      name: ''
    },
    upiId: '',
    netBankingBank: ''
  });

  const [paymentStatus, setPaymentStatus] = useState({
    show: false,
    success: false,
    transactionId: '',
    message: ''
  });

  // Handle pay invoice
  const handlePayInvoice = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setPaymentDialog({
        open: true,
        invoiceId: invoiceId,
        amount: invoice.amount,
        processing: false,
        method: 'card',
        cardDetails: { number: '', expiry: '', cvv: '', name: '' },
        upiId: '',
        netBankingBank: ''
      });
    }
  };

  // Quick Edit handlers
  const handleQuickEdit = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setQuickEditDialog({
        open: true,
        invoiceId: invoiceId,
        receivableInfo: { ...invoice.receivableInfo }
      });
    }
  };

  const handleQuickEditSave = () => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === quickEditDialog.invoiceId 
        ? { ...invoice, receivableInfo: { ...quickEditDialog.receivableInfo } }
        : invoice
    ));
    setQuickEditDialog({ open: false, invoiceId: null, receivableInfo: {} });
    alert('Receivable information updated successfully!');
  };

  const handleQuickEditCancel = () => {
    setQuickEditDialog({ open: false, invoiceId: null, receivableInfo: {} });
  };

  const handleReceivableInfoChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setQuickEditDialog(prev => ({
        ...prev,
        receivableInfo: {
          ...prev.receivableInfo,
          [parent]: {
            ...prev.receivableInfo[parent],
            [child]: value
          }
        }
      }));
    } else {
      setQuickEditDialog(prev => ({
        ...prev,
        receivableInfo: {
          ...prev.receivableInfo,
          [field]: value
        }
      }));
    }
  };

  // Payment gateway handlers
  const handlePaymentMethodChange = (method) => {
    setPaymentDialog(prev => ({ ...prev, method }));
  };

  const handleCardDetailsChange = (field, value) => {
    setPaymentDialog(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        [field]: value
      }
    }));
  };

  const handleProcessPayment = async () => {
    setPaymentDialog(prev => ({ ...prev, processing: true }));
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      const transactionId = `TXN${Date.now()}`;
      
      if (success) {
        // Update invoice status to paid
        setInvoices(prev => prev.map(invoice => 
          invoice.id === paymentDialog.invoiceId 
            ? { ...invoice, status: 'Paid' }
            : invoice
        ));
        
        setPaymentStatus({
          show: true,
          success: true,
          transactionId,
          message: 'Payment processed successfully!'
        });
      } else {
        setPaymentStatus({
          show: true,
          success: false,
          transactionId: '',
          message: 'Payment failed. Please try again.'
        });
      }
      
      setPaymentDialog(prev => ({ ...prev, processing: false, open: false }));
    }, 3000);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialog({
      open: false,
      invoiceId: null,
      amount: 0,
      processing: false,
      method: 'card',
      cardDetails: { number: '', expiry: '', cvv: '', name: '' },
      upiId: '',
      netBankingBank: ''
    });
  };

  const handleClosePaymentStatus = () => {
    setPaymentStatus({ show: false, success: false, transactionId: '', message: '' });
  };

  // Delivery status helpers
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getDeliveryStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon fontSize="small" />;
      case 'failed': return <ErrorIcon fontSize="small" />;
      case 'pending': return <ScheduleIcon fontSize="small" />;
      default: return <NotificationsIcon fontSize="small" />;
    }
  };

  // Filter communication statistics based on date range
  const getFilteredCommunicationStats = () => {
    let filtered = {
      sms: [...communicationStats.sms],
      email: [...communicationStats.email],
      whatsapp: [...communicationStats.whatsapp]
    };

    if (filterType === 'month') {
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
      
      filtered = {
        sms: filtered.sms.filter(item => {
          const date = new Date(item.date);
          return date >= startOfMonth && date <= endOfMonth;
        }),
        email: filtered.email.filter(item => {
          const date = new Date(item.date);
          return date >= startOfMonth && date <= endOfMonth;
        }),
        whatsapp: filtered.whatsapp.filter(item => {
          const date = new Date(item.date);
          return date >= startOfMonth && date <= endOfMonth;
        })
      };
    } else if (startDate && endDate) {
      filtered = {
        sms: filtered.sms.filter(item => {
          const date = new Date(item.date);
          return date >= startDate && date <= endDate;
        }),
        email: filtered.email.filter(item => {
          const date = new Date(item.date);
          return date >= startDate && date <= endDate;
        }),
        whatsapp: filtered.whatsapp.filter(item => {
          const date = new Date(item.date);
          return date >= startDate && date <= endDate;
        })
      };
    }

    return filtered;
  };

  // Calculate totals for communication statistics
  const calculateCommunicationTotals = (stats) => {
    return {
      sms: stats.sms.reduce((sum, item) => sum + item.count, 0),
      email: stats.email.reduce((sum, item) => sum + item.count, 0),
      whatsapp: stats.whatsapp.reduce((sum, item) => sum + item.count, 0)
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Fade in={loaded} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Billing Information
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your billing information and usage charges
          </Typography>
        </Box>
      </Fade>

      <Grow in={loaded} timeout={1000}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            mb: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                aria-label="billing tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 160
                  }
                }}
              >
                <Tab icon={<ReceiptIcon />} label="Billing Details" />
                <Tab icon={<MessageIcon />} label="Communication Statistics" />
                <Tab icon={<BusinessIcon />} label="Vendor Communications" />
                <Tab icon={<AssessmentIcon />} label="Delivery Status" />
              </Tabs>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Filter Options
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Print information">
                  <IconButton onClick={handlePrint} sx={{ mr: 1 }}>
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download as PDF">
                  <IconButton onClick={handleDownload}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="filter-type-label">Filter Type</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    id="filter-type"
                    value={filterType}
                    onChange={handleFilterTypeChange}
                    label="Filter Type"
                  >
                    <MenuItem value="month">By Month</MenuItem>
                    <MenuItem value="custom">Custom Date Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {filterType === 'month' ? (
                <>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="month-label">Month</InputLabel>
                      <Select
                        labelId="month-label"
                        id="month-select"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Month"
                      >
                        {months.map((month, index) => (
                          <MenuItem key={index} value={index}>{month}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="year-label">Year</InputLabel>
                      <Select
                        labelId="year-label"
                        id="year-select"
                        value={selectedYear}
                        onChange={handleYearChange}
                        label="Year"
                      >
                        {years.map((year) => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDate={startDate}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={3}>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  sx={{ 
                    py: 1.7,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(0,118,255,0.25)'
                  }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grow>

      {activeTab === 0 ? (
        <>
          <Grow in={loaded} timeout={1200}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                overflow: 'visible',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                },
                mb: 4
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReceiptIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="600">
                    Billing Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
                  Portal Usage - Utilization Charges
                </Typography>
                
                <TableContainer component={Paper} elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Service</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Count</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">Cost</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.utilization.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.service}</TableCell>
                          <TableCell align="center">{item.count.toLocaleString()}</TableCell>
                          <TableCell align="right">₹{item.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
                  Platform Charges
                </Typography>
                
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Service</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Period</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">Cost</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.platform.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.service}</TableCell>
                          <TableCell align="center">{item.period}</TableCell>
                          <TableCell align="right">₹{item.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                        <TableCell><Typography fontWeight="600">Total Monthly Charges</Typography></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">₹{filteredData.totalMonthly.toFixed(2)}</Typography></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grow>

          <Grow in={loaded} timeout={1400}>
            <Card 
              elevation={0}
              sx={{ 
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
                  <PdfIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="600">
                    Invoices
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  View, download, and pay your invoices directly from the portal
                </Typography>
                
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Invoice #</Typography></TableCell>
                        <TableCell><Typography fontWeight="600">Date</Typography></TableCell>
                        <TableCell align="right"><Typography fontWeight="600">Amount</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Status</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Actions</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ReceiptIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                              {invoice.id}
                            </Box>
                          </TableCell>
                          <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                          <TableCell align="right">₹{invoice.amount.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={invoice.status} 
                              size="small"
                              color={invoice.status === 'Paid' ? 'success' : 'warning'}
                              sx={{ 
                                fontWeight: 500,
                                minWidth: 80
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Quick Edit Receivables">
                                <IconButton 
                                  size="small" 
                                  color="info"
                                  onClick={() => handleQuickEdit(invoice.id)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="View Invoice">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewInvoice(invoice.id)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Download Invoice">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDownloadInvoice(invoice.id)}
                                >
                                  <FileDownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              {invoice.status === 'Pending' && (
                                <Tooltip title="Pay Now">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handlePayInvoice(invoice.id)}
                                  >
                                    <PaymentIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grow>
        </>
      ) : activeTab === 1 ? (
        // Communication Statistics Tab
        <Grow in={loaded} timeout={1200}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MessageIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Communication Statistics
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* SMS Statistics */}
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SmsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        SMS Messages
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                      {calculateCommunicationTotals(getFilteredCommunicationStats()).sms.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total SMS sent
                    </Typography>
                  </Card>
                </Grid>

                {/* Email Statistics */}
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.05)
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        Email Messages
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                      {calculateCommunicationTotals(getFilteredCommunicationStats()).email.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total emails sent
                    </Typography>
                  </Card>
                </Grid>

                {/* WhatsApp Statistics */}
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05)
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WhatsAppIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                      <Typography variant="subtitle1" fontWeight="600">
                        WhatsApp Messages
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                      {calculateCommunicationTotals(getFilteredCommunicationStats()).whatsapp.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total WhatsApp messages sent
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Detailed Statistics Table */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Detailed Communication Statistics
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Date</Typography></TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <SmsIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography fontWeight="600">SMS</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                            <Typography fontWeight="600">Email</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <WhatsAppIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                            <Typography fontWeight="600">WhatsApp</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Total</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFilteredCommunicationStats().sms.map((item, index) => (
                        <TableRow key={item.date}>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell align="center">{item.count.toLocaleString()}</TableCell>
                          <TableCell align="center">
                            {getFilteredCommunicationStats().email[index]?.count.toLocaleString() || 0}
                          </TableCell>
                          <TableCell align="center">
                            {getFilteredCommunicationStats().whatsapp[index]?.count.toLocaleString() || 0}
                          </TableCell>
                          <TableCell align="center">
                            {(
                              item.count +
                              (getFilteredCommunicationStats().email[index]?.count || 0) +
                              (getFilteredCommunicationStats().whatsapp[index]?.count || 0)
                            ).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grow>
      ) : activeTab === 2 ? (
        // Vendor Communications Tab
        <Grow in={loaded} timeout={1200}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Vendor-wise Communication Count
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Monitor communication volume and costs across different service providers
              </Typography>

              <Grid container spacing={3}>
                {vendorCommunications.map((vendor) => (
                  <Grid item xs={12} md={4} key={vendor.vendorId}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: theme.palette.primary.main,
                            width: 40,
                            height: 40,
                            mr: 2
                          }}
                        >
                          <BusinessIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="600" noWrap>
                            {vendor.vendorName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vendor.vendorType}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" fontWeight="700" color="primary.main">
                          {vendor.totalCommunications.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Communications
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Delivery Rate</Typography>
                          <Typography variant="body2" fontWeight="600">
                            {((vendor.deliveryStats.delivered / vendor.totalCommunications) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(vendor.deliveryStats.delivered / vendor.totalCommunications) * 100}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="600" color="success.main">
                              {vendor.deliveryStats.delivered}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Delivered
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="600" color="error.main">
                              {vendor.deliveryStats.failed}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Failed
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="600" color="warning.main">
                              {vendor.deliveryStats.pending}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pending
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Divider sx={{ mb: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Cost per message
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          ₹{vendor.costPerMessage.toFixed(3)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total cost
                        </Typography>
                        <Typography variant="body2" fontWeight="600" color="primary.main">
                          ₹{vendor.totalCost.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          Last activity: {new Date(vendor.lastActivity).toLocaleDateString()}
                        </Typography>
                        <Chip 
                          label="Active" 
                          size="small" 
                          color="success" 
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Vendor Summary Table */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                  Vendor Summary & Contact Information
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography fontWeight="600">Vendor</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Type</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Total Communications</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Success Rate</Typography></TableCell>
                        <TableCell align="center"><Typography fontWeight="600">Total Cost</Typography></TableCell>
                        <TableCell><Typography fontWeight="600">Contact</Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vendorCommunications.map((vendor) => (
                        <TableRow key={vendor.vendorId}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32, mr: 2 }}>
                                <BusinessIcon fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="600">
                                  {vendor.vendorName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {vendor.vendorId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={vendor.vendorType} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="600">
                              {vendor.totalCommunications.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" fontWeight="600" sx={{ mr: 1 }}>
                                {((vendor.deliveryStats.delivered / vendor.totalCommunications) * 100).toFixed(1)}%
                              </Typography>
                              <Chip 
                                label={vendor.deliveryStats.delivered > vendor.totalCommunications * 0.95 ? 'Excellent' : 
                                       vendor.deliveryStats.delivered > vendor.totalCommunications * 0.90 ? 'Good' : 'Needs Attention'}
                                size="small"
                                color={vendor.deliveryStats.delivered > vendor.totalCommunications * 0.95 ? 'success' : 
                                       vendor.deliveryStats.delivered > vendor.totalCommunications * 0.90 ? 'info' : 'warning'}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              ₹{vendor.totalCost.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="500">
                                {vendor.contactPerson}
                              </Typography>
                              <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer' }}>
                                {vendor.supportEmail}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grow>
      ) : activeTab === 3 ? (
        // Delivery Status Tab
        <Grow in={loaded} timeout={1200}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssessmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="600">
                    Communication Delivery Status
                  </Typography>
                </Box>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>View Type</InputLabel>
                  <Select
                    value={deliveryStatusView}
                    onChange={(e) => setDeliveryStatusView(e.target.value)}
                    label="View Type"
                  >
                    <MenuItem value="individual">Individual Cases</MenuItem>
                    <MenuItem value="bulk">Bulk Campaigns</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {deliveryStatusView === 'individual' ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Track delivery status of individual customer communications
                  </Typography>

                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><Typography fontWeight="600">Case ID</Typography></TableCell>
                          <TableCell><Typography fontWeight="600">Customer</Typography></TableCell>
                          <TableCell align="center"><Typography fontWeight="600">Type</Typography></TableCell>
                          <TableCell><Typography fontWeight="600">Message</Typography></TableCell>
                          <TableCell align="center"><Typography fontWeight="600">Status</Typography></TableCell>
                          <TableCell align="center"><Typography fontWeight="600">Attempts</Typography></TableCell>
                          <TableCell><Typography fontWeight="600">Vendor</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="600">Cost</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {individualCases.map((case_) => (
                          <TableRow key={case_.caseId}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="600" color="primary.main">
                                {case_.caseId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="500">
                                  {case_.customerName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {case_.policyNumber}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={case_.communicationType}
                                size="small"
                                color={case_.communicationType === 'SMS' ? 'primary' : 
                                       case_.communicationType === 'Email' ? 'info' : 'success'}
                                icon={case_.communicationType === 'SMS' ? <SmsIcon /> : 
                                      case_.communicationType === 'Email' ? <EmailIcon /> : <WhatsAppIcon />}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                title={case_.message}
                              >
                                {case_.message}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Chip
                                  label={case_.deliveryStatus}
                                  size="small"
                                  color={getDeliveryStatusColor(case_.deliveryStatus)}
                                  icon={getDeliveryStatusIcon(case_.deliveryStatus)}
                                  sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                                />
                              </Box>
                              {case_.deliveryStatus === 'delivered' && case_.deliveredAt && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                  {new Date(case_.deliveredAt).toLocaleString()}
                                </Typography>
                              )}
                              {case_.deliveryStatus === 'failed' && case_.errorMessage && (
                                <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
                                  {case_.errorMessage}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Badge badgeContent={case_.attempts} color="primary">
                                <NotificationsIcon fontSize="small" />
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {case_.vendor}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="600">
                                ₹{case_.cost.toFixed(3)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Monitor delivery status of bulk communication campaigns
                  </Typography>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {bulkCampaigns.map((campaign) => (
                      <Grid item xs={12} md={6} key={campaign.campaignId}>
                        <Card 
                          elevation={0}
                          sx={{ 
                            p: 3,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            height: '100%'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="600">
                              {campaign.campaignName}
                            </Typography>
                            <Chip 
                              label={campaign.type}
                              size="small"
                              color={campaign.type === 'SMS' ? 'primary' : 
                                     campaign.type === 'Email' ? 'info' : 'success'}
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Campaign ID: {campaign.campaignId}
                          </Typography>

                          <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                <Typography variant="h4" fontWeight="700" color="primary.main">
                                  {campaign.totalRecipients.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Total Recipients
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                <Typography variant="h4" fontWeight="700" color="success.main">
                                  {campaign.deliveryRate.toFixed(1)}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Delivery Rate
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Delivery Progress</Typography>
                              <Typography variant="body2" fontWeight="600">
                                {campaign.deliveredCount} / {campaign.totalRecipients}
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={(campaign.deliveredCount / campaign.totalRecipients) * 100}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>

                          <Grid container spacing={1} sx={{ mb: 3 }}>
                            <Grid item xs={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight="600" color="success.main">
                                  {campaign.deliveredCount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Delivered
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight="600" color="error.main">
                                  {campaign.failedCount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Failed
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight="600" color="warning.main">
                                  {campaign.pendingCount}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Pending
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Divider sx={{ mb: 2 }} />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Vendor
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {campaign.vendor}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Total Cost
                            </Typography>
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              ₹{campaign.totalCost.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Duration
                            </Typography>
                            <Typography variant="body2" fontWeight="600">
                              {Math.ceil((new Date(campaign.completedAt) - new Date(campaign.startedAt)) / (1000 * 60))} min
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                    Campaign Performance Summary
                  </Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><Typography fontWeight="600">Campaign</Typography></TableCell>
                          <TableCell align="center"><Typography fontWeight="600">Type</Typography></TableCell>
                          <TableCell align="center"><Typography fontWeight="600">Recipients</Typography></TableCell>
                          <TableCell align="center"><Typography fontWeight="600">Delivery Rate</Typography></TableCell>
                          <TableCell align="center"><Typography fontWeight="600">Status</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="600">Cost</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bulkCampaigns.map((campaign) => (
                          <TableRow key={campaign.campaignId}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="600">
                                  {campaign.campaignName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {campaign.campaignId}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={campaign.type}
                                size="small"
                                color={campaign.type === 'SMS' ? 'primary' : 
                                       campaign.type === 'Email' ? 'info' : 'success'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="600">
                                {campaign.totalRecipients.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body2" fontWeight="600" sx={{ mr: 1 }}>
                                  {campaign.deliveryRate.toFixed(1)}%
                                </Typography>
                                <Chip 
                                  label={campaign.deliveryRate > 95 ? 'Excellent' : 
                                         campaign.deliveryRate > 90 ? 'Good' : 'Needs Attention'}
                                  size="small"
                                  color={campaign.deliveryRate > 95 ? 'success' : 
                                         campaign.deliveryRate > 90 ? 'info' : 'warning'}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label="Completed"
                                size="small"
                                color="success"
                                icon={<CheckCircleIcon />}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="600" color="primary.main">
                                ₹{campaign.totalCost.toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </CardContent>
          </Card>
        </Grow>
      ) : null}

      {/* Quick Edit Dialog */}
      <Dialog
        open={quickEditDialog.open}
        onClose={handleQuickEditCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <EditIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Quick Edit Receivable Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Invoice: {quickEditDialog.invoiceId}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={quickEditDialog.receivableInfo.dueDate ? new Date(quickEditDialog.receivableInfo.dueDate) : null}
                  onChange={(newValue) => handleReceivableInfoChange('dueDate', newValue?.toISOString().split('T')[0])}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Terms"
                value={quickEditDialog.receivableInfo.paymentTerms}
                onChange={(e) => handleReceivableInfoChange('paymentTerms', e.target.value)}
                placeholder="e.g., Net 30, Net 60"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit Limit"
                value={quickEditDialog.receivableInfo.creditLimit}
                onChange={(e) => handleReceivableInfoChange('creditLimit', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Accounting Code"
                value={quickEditDialog.receivableInfo.accountingCode}
                onChange={(e) => handleReceivableInfoChange('accountingCode', e.target.value)}
                placeholder="e.g., ACC-001"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tax ID"
                value={quickEditDialog.receivableInfo.taxId}
                onChange={(e) => handleReceivableInfoChange('taxId', e.target.value)}
                placeholder="e.g., TAX123456"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={quickEditDialog.receivableInfo.paymentMethod}
                  onChange={(e) => handleReceivableInfoChange('paymentMethod', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="online">Online Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Contact Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Billing Address"
                value={quickEditDialog.receivableInfo.billingAddress}
                onChange={(e) => handleReceivableInfoChange('billingAddress', e.target.value)}
                multiline
                rows={2}
                placeholder="Complete billing address"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact Person"
                value={quickEditDialog.receivableInfo.contactPerson}
                onChange={(e) => handleReceivableInfoChange('contactPerson', e.target.value)}
                placeholder="e.g., Finance Manager"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={quickEditDialog.receivableInfo.contactEmail}
                onChange={(e) => handleReceivableInfoChange('contactEmail', e.target.value)}
                placeholder="contact@company.com"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={quickEditDialog.receivableInfo.contactPhone}
                onChange={(e) => handleReceivableInfoChange('contactPhone', e.target.value)}
                placeholder="+91-9876543210"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment>,
                }}
              />
            </Grid>

            {/* Bank Details */}
            {quickEditDialog.receivableInfo.paymentMethod === 'bank_transfer' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    Bank Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={quickEditDialog.receivableInfo.bankDetails?.accountNumber || ''}
                    onChange={(e) => handleReceivableInfoChange('bankDetails.accountNumber', e.target.value)}
                    placeholder="1234567890"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Routing Number / IFSC"
                    value={quickEditDialog.receivableInfo.bankDetails?.routingNumber || ''}
                    onChange={(e) => handleReceivableInfoChange('bankDetails.routingNumber', e.target.value)}
                    placeholder="HDFC0001234"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={quickEditDialog.receivableInfo.bankDetails?.bankName || ''}
                    onChange={(e) => handleReceivableInfoChange('bankDetails.bankName', e.target.value)}
                    placeholder="HDFC Bank"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SWIFT Code"
                    value={quickEditDialog.receivableInfo.bankDetails?.swiftCode || ''}
                    onChange={(e) => handleReceivableInfoChange('bankDetails.swiftCode', e.target.value)}
                    placeholder="HDFCINBB"
                  />
                </Grid>
              </>
            )}

            {/* Notes */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                label="Notes"
                value={quickEditDialog.receivableInfo.notes}
                onChange={(e) => handleReceivableInfoChange('notes', e.target.value)}
                multiline
                rows={3}
                placeholder="Additional notes or comments"
              />
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Changes will be saved to the receivable information for this invoice.
              This information is used for accounting and payment processing purposes.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleQuickEditCancel}
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleQuickEditSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Gateway Dialog */}
      <Dialog
        open={paymentDialog.open}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <PaymentIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Payment Gateway
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Invoice: {paymentDialog.invoiceId} • Amount: ₹{paymentDialog.amount?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Payment Method Selection */}
          <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
            Select Payment Method
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Card 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  border: paymentDialog.method === 'card' ? 2 : 1,
                  borderColor: paymentDialog.method === 'card' ? 'primary.main' : 'divider',
                  bgcolor: paymentDialog.method === 'card' ? 'primary.50' : 'background.paper'
                }}
                onClick={() => handlePaymentMethodChange('card')}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <PaymentIcon color={paymentDialog.method === 'card' ? 'primary' : 'action'} />
                  <Typography variant="body2" fontWeight="600" sx={{ mt: 1 }}>
                    Card
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  border: paymentDialog.method === 'upi' ? 2 : 1,
                  borderColor: paymentDialog.method === 'upi' ? 'primary.main' : 'divider',
                  bgcolor: paymentDialog.method === 'upi' ? 'primary.50' : 'background.paper'
                }}
                onClick={() => handlePaymentMethodChange('upi')}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <PhoneIcon color={paymentDialog.method === 'upi' ? 'primary' : 'action'} />
                  <Typography variant="body2" fontWeight="600" sx={{ mt: 1 }}>
                    UPI
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  border: paymentDialog.method === 'netbanking' ? 2 : 1,
                  borderColor: paymentDialog.method === 'netbanking' ? 'primary.main' : 'divider',
                  bgcolor: paymentDialog.method === 'netbanking' ? 'primary.50' : 'background.paper'
                }}
                onClick={() => handlePaymentMethodChange('netbanking')}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <BusinessIcon color={paymentDialog.method === 'netbanking' ? 'primary' : 'action'} />
                  <Typography variant="body2" fontWeight="600" sx={{ mt: 1 }}>
                    Net Banking
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Payment Details Forms */}
          {paymentDialog.method === 'card' && (
            <Box>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                Card Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={paymentDialog.cardDetails.name}
                    onChange={(e) => handleCardDetailsChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={paymentDialog.cardDetails.number}
                    onChange={(e) => handleCardDetailsChange('number', e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    inputProps={{ maxLength: 19 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={paymentDialog.cardDetails.expiry}
                    onChange={(e) => handleCardDetailsChange('expiry', e.target.value)}
                    placeholder="MM/YY"
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    type="password"
                    value={paymentDialog.cardDetails.cvv}
                    onChange={(e) => handleCardDetailsChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    inputProps={{ maxLength: 3 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {paymentDialog.method === 'upi' && (
            <Box>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                UPI Details
              </Typography>
              <TextField
                fullWidth
                label="UPI ID"
                value={paymentDialog.upiId}
                onChange={(e) => setPaymentDialog(prev => ({ ...prev, upiId: e.target.value }))}
                placeholder="yourname@paytm"
                helperText="Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)"
              />
            </Box>
          )}

          {paymentDialog.method === 'netbanking' && (
            <Box>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                Net Banking Details
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Select Bank</InputLabel>
                <Select
                  value={paymentDialog.netBankingBank}
                  onChange={(e) => setPaymentDialog(prev => ({ ...prev, netBankingBank: e.target.value }))}
                  label="Select Bank"
                >
                  <MenuItem value="hdfc">HDFC Bank</MenuItem>
                  <MenuItem value="icici">ICICI Bank</MenuItem>
                  <MenuItem value="sbi">State Bank of India</MenuItem>
                  <MenuItem value="axis">Axis Bank</MenuItem>
                  <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
                  <MenuItem value="pnb">Punjab National Bank</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Payment Summary */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
              Payment Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Invoice Amount:</Typography>
              <Typography variant="body2" fontWeight="600">₹{paymentDialog.amount?.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Processing Fee:</Typography>
              <Typography variant="body2" fontWeight="600">₹{(paymentDialog.amount * 0.02)?.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" fontWeight="600">Total Amount:</Typography>
              <Typography variant="body1" fontWeight="600" color="primary.main">
                ₹{(paymentDialog.amount * 1.02)?.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
              Processing fee of 2% applies to all transactions.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClosePaymentDialog}
            variant="outlined"
            disabled={paymentDialog.processing}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleProcessPayment}
            variant="contained"
            disabled={paymentDialog.processing || 
              (paymentDialog.method === 'card' && (!paymentDialog.cardDetails.name || !paymentDialog.cardDetails.number || !paymentDialog.cardDetails.expiry || !paymentDialog.cardDetails.cvv)) ||
              (paymentDialog.method === 'upi' && !paymentDialog.upiId) ||
              (paymentDialog.method === 'netbanking' && !paymentDialog.netBankingBank)
            }
            startIcon={paymentDialog.processing ? <CircularProgress size={20} /> : <PaymentIcon />}
            sx={{ borderRadius: 2, minWidth: 140 }}
          >
            {paymentDialog.processing ? 'Processing...' : `Pay ₹${(paymentDialog.amount * 1.02)?.toFixed(2)}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Status Dialog */}
      <Dialog
        open={paymentStatus.show}
        onClose={handleClosePaymentStatus}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Avatar 
            sx={{ 
              bgcolor: paymentStatus.success ? 'success.main' : 'error.main',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2
            }}
          >
            {paymentStatus.success ? <CheckCircleIcon sx={{ fontSize: 40 }} /> : <ErrorIcon sx={{ fontSize: 40 }} />}
          </Avatar>
          
          <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
            {paymentStatus.success ? 'Payment Successful!' : 'Payment Failed'}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {paymentStatus.message}
          </Typography>
          
          {paymentStatus.success && paymentStatus.transactionId && (
            <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2, mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Transaction ID
              </Typography>
              <Typography variant="h6" fontWeight="600" color="success.main">
                {paymentStatus.transactionId}
              </Typography>
            </Box>
          )}
          
          <Button
            onClick={handleClosePaymentStatus}
            variant="contained"
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Billing;