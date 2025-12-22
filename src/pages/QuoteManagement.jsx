import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent,
  useTheme, alpha, Stack, Divider, Avatar, IconButton, Badge,
  Tooltip, LinearProgress, CardHeader, CardActions, Alert,
  List, ListItem, ListItemText, ListItemAvatar, ListItemIcon, InputAdornment,
  Menu, Collapse, Stepper, Step, StepLabel, Snackbar
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Visibility as ViewIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  ContentCopy,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  AttachMoney as MoneyIcon,
  Description as QuoteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  DoneAll as ConvertedIcon,
  ThumbDown as LostIcon,
  AttachFile as AttachIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon
} from '@mui/icons-material';

// Quote Management Component - Updated with action handlers

import QuoteService from '../services/qouteservice';

const QuoteManagement = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [emailPreviewDialog, setEmailPreviewDialog] = useState(false);
  const [emailPreviewData, setEmailPreviewData] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    leadId: '',
    productType: '',
    productPlan: '',
    coverageAmount: '',
    premium: '',
    sumInsured: '',
    tenure: '1',
    quoteAmount: '',
    validityPeriod: '30',
    remarks: '',
    // Insurance specific
    ageOfInsured: '',
    medicalHistory: '',
    vehicleDetails: '',
    previousInsurance: ''
  });

  // --- state now backed by QuoteService (instead of hard-coded list) ---
  const [quotes, setQuotes] = useState([]);
  const [mockHistory, setMockHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch quotes + history on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await QuoteService.listQuotes();
        // service may return { items, total } or an array
        const items = Array.isArray(res) ? res : (res.items || []);
        if (!mounted) return;
        setQuotes(items);

        try {
          const h = await QuoteService.listHistory();
          if (!mounted) return;
          setMockHistory(Array.isArray(h) ? h : (h.items || []));
        } catch (histErr) {
          // ignore history error but log
          console.warn('Failed to load history', histErr);
        }
      } catch (err) {
        console.error('Failed to load quotes', err);
        if (mounted) setError(err.message || 'Failed to load quotes');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const totalQuotes = quotes.length;
    const draftQuotes = quotes.filter(q => q.status === 'Draft').length;
    const pendingQuotes = quotes.filter(q => q.status === 'Pending').length;
    const approvedQuotes = quotes.filter(q => q.status === 'Approved').length;
    const convertedQuotes = quotes.filter(q => q.status === 'Converted').length;
    const rejectedQuotes = quotes.filter(q => q.status === 'Rejected').length;
    const lostQuotes = quotes.filter(q => q.status === 'Lost').length;

    const totalValue = quotes.reduce((acc, q) => {
      // defensive parsing
      const amt = (q.quoteAmount || '').toString().replace(/[₹,]/g, '');
      const amount = parseInt(amt || '0', 10);
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    const conversionRate = totalQuotes > 0
      ? ((convertedQuotes / Math.max(1, (totalQuotes - draftQuotes))) * 100).toFixed(1)
      : 0;

    const avgQuoteValue = totalQuotes > 0 ? Math.round(totalValue / totalQuotes) : 0;

    return {
      totalQuotes,
      draftQuotes,
      pendingQuotes,
      approvedQuotes,
      convertedQuotes,
      rejectedQuotes,
      lostQuotes,
      totalValue,
      conversionRate,
      avgQuoteValue
    };
  }, [quotes]);

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      const matchesSearch = searchTerm === '' ||
        (quote.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.productPlan || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Activity logging helper function
  const addActivityHistory = (quoteId, action, details = '') => {
    const activityEntry = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quoteId: quoteId,
      action: action,
      user: 'Current User',
      timestamp: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      details: details
    };

    setMockHistory(prev => [activityEntry, ...prev]);
  };

  // submit with QuoteService.createQuote
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone ||
      !formData.productType || !formData.productPlan || !formData.quoteAmount) {
      setError('Please fill in all required fields');
      return;
    }

    const payload = {
      leadId: formData.leadId || `L${Date.now()}`,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      productType: formData.productType,
      productPlan: formData.productPlan,
      coverageAmount: formData.coverageAmount || '₹0',
      premium: formData.premium || '₹0',
      sumInsured: formData.sumInsured || '₹0',
      tenure: formData.tenure || '1 Year',
      quoteAmount: formData.quoteAmount && formData.quoteAmount.toString().startsWith('₹') ? formData.quoteAmount : `₹${formData.quoteAmount}`,
      status: 'Draft',
      validUntil: '',
      raisedBy: 'Current User',
      raisedDate: new Date().toLocaleDateString('en-GB'), // Add raised date
      conversionProbability: 50, // Default conversion probability for new quotes
      attachments: [],
      timeline: [
        {
          action: 'Quote Created',
          user: 'Current User',
          timestamp: new Date().toLocaleString(),
          details: 'Initial quote raised'
        }
      ]
    };

    setLoading(true);
    setError(null);
    try {
      // Check if we're editing an existing quote
      if (selectedQuote && selectedQuote.id) {
        // UPDATE existing quote
        const updatePayload = {
          ...selectedQuote,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          productType: formData.productType,
          productPlan: formData.productPlan,
          coverageAmount: formData.coverageAmount || '₹0',
          premium: formData.premium || '₹0',
          sumInsured: formData.sumInsured || '₹0',
          tenure: formData.tenure || '1 Year',
          quoteAmount: formData.quoteAmount && formData.quoteAmount.toString().startsWith('₹') ? formData.quoteAmount : `₹${formData.quoteAmount}`,
          remarks: formData.remarks,
          ageOfInsured: formData.ageOfInsured,
          medicalHistory: formData.medicalHistory,
          vehicleDetails: formData.vehicleDetails,
          previousInsurance: formData.previousInsurance,
          timeline: [
            ...(selectedQuote.timeline || []),
            {
              action: 'Quote Updated',
              user: 'Current User',
              timestamp: new Date().toLocaleString(),
              details: 'Quote details modified'
            }
          ]
        };

        // Update the quote in the list
        setQuotes(prev => prev.map(q => q.id === selectedQuote.id ? updatePayload : q));

        // Log activity
        addActivityHistory(
          selectedQuote.id,
          'Quote Updated',
          `Quote details modified for ${formData.customerName}`
        );

        // Clear selected quote
        setSelectedQuote(null);
      } else {
        // CREATE new quote
        const created = await QuoteService.createQuote(payload);
        // QuoteService mock returns created item; prepend to local list
        setQuotes(prev => [created, ...prev]);

        // Log activity
        addActivityHistory(
          created.id,
          'Quote Created',
          `New quote created for ${formData.customerName} - ${formData.productType} (${formData.productPlan})`
        );
      }

      // reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        leadId: '',
        productType: '',
        productPlan: '',
        coverageAmount: '',
        premium: '',
        sumInsured: '',
        tenure: '1',
        quoteAmount: '',
        validityPeriod: '30',
        remarks: '',
        ageOfInsured: '',
        medicalHistory: '',
        vehicleDetails: '',
        previousInsurance: ''
      });
      setCurrentTab(0);
    } catch (err) {
      console.error('Quote operation error', err);
      setError(err.message || 'Failed to process quote');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setOpenDetailsDialog(true);
  };

  const handleMenuOpen = (event, quote) => {
    setMenuAnchor(event.currentTarget);
    setSelectedQuote(quote);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // change status via QuoteService.changeStatus
  const handleStatusChange = async (newStatus) => {
    if (!selectedQuote) {
      handleMenuClose();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updated = await QuoteService.changeStatus(selectedQuote.id, newStatus, `Changed via UI to ${newStatus}`);
      // update local list and selectedQuote
      setQuotes(prev => prev.map(q => (q.id === updated.id ? updated : q)));
      setSelectedQuote(updated);

      // Log activity
      addActivityHistory(
        selectedQuote.id,
        'Status Changed',
        `Status changed from ${selectedQuote.status} to ${newStatus}`
      );
    } catch (err) {
      console.error('changeStatus error', err);
      setError(err.message || 'Failed to change status');
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const toggleExpandCard = (quoteId) => {
    setExpandedCards(prev => ({
      ...prev,
      [quoteId]: !prev[quoteId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Converted': return 'info';
      case 'Lost': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft': return <EditIcon />;
      case 'Pending': return <PendingIcon />;
      case 'Approved': return <ApprovedIcon />;
      case 'Rejected': return <RejectedIcon />;
      case 'Converted': return <ConvertedIcon />;
      case 'Lost': return <LostIcon />;
      default: return <QuoteIcon />;
    }
  };

  // helper: send quote (not wired in UI automatically)
  const handleSendQuote = async (quoteId, opts = { channel: 'email' }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await QuoteService.sendQuote(quoteId, opts);
      // optionally reload quote
      try {
        const updated = await QuoteService.getQuote(quoteId);
        setQuotes(prev => prev.map(q => (q.id === updated.id ? updated : q)));
        setSelectedQuote(updated);
      } catch (e) {
        // ignore
      }
      return res;
    } catch (err) {
      console.error('sendQuote error', err);
      setError(err.message || 'Failed to send quote');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // helper: download PDF (generates HTML for now since we don't have a real PDF service)
  const handleDownloadPDF = async (quoteId) => {
    setError(null);
    try {
      // Since we don't have a real PDF service, generate an HTML document
      // that can be opened in browser and printed as PDF
      const quote = quotes.find(q => q.id === quoteId) || selectedQuote;

      if (!quote) {
        setError('Quote not found');
        return;
      }

      // Generate HTML content for the quote
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote ${quote.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #1976d2;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1976d2;
      margin: 0;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      background: #f5f5f5;
      padding: 10px;
      font-weight: bold;
      border-left: 4px solid #1976d2;
      margin-bottom: 15px;
    }
    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .info-label {
      font-weight: bold;
      width: 200px;
      color: #555;
    }
    .info-value {
      flex: 1;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #1976d2;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body {
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Insurance Quote</h1>
    <p>Quote ID: ${quote.id}</p>
    <p>Generated on: ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="section">
    <div class="section-title">Customer Information</div>
    <div class="info-row">
      <div class="info-label">Customer Name:</div>
      <div class="info-value">${quote.customerName || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Email:</div>
      <div class="info-value">${quote.customerEmail || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Phone:</div>
      <div class="info-value">${quote.customerPhone || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Lead ID:</div>
      <div class="info-value">${quote.leadId || 'N/A'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Product Details</div>
    <div class="info-row">
      <div class="info-label">Product Type:</div>
      <div class="info-value">${quote.productType || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Plan:</div>
      <div class="info-value">${quote.productPlan || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Tenure:</div>
      <div class="info-value">${quote.tenure || 'N/A'}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Financial Details</div>
    <div class="info-row">
      <div class="info-label">Coverage Amount:</div>
      <div class="info-value">${quote.coverageAmount || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Sum Insured:</div>
      <div class="info-value">${quote.sumInsured || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Premium (Annual):</div>
      <div class="info-value">${quote.premium || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Total Quote Amount:</div>
      <div class="info-value"><strong>${quote.quoteAmount || 'N/A'}</strong></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Quote Status</div>
    <div class="info-row">
      <div class="info-label">Status:</div>
      <div class="info-value">${quote.status || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Raised Date:</div>
      <div class="info-value">${quote.raisedDate || 'N/A'}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Raised By:</div>
      <div class="info-value">${quote.raisedBy || 'N/A'}</div>
    </div>
  </div>

  ${quote.remarks ? `
  <div class="section">
    <div class="section-title">Remarks</div>
    <p>${quote.remarks}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>This is a system-generated quote document.</p>
    <p>For any queries, please contact our support team.</p>
  </div>
</body>
</html>
      `;

      // Create blob with HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quote_${quoteId}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('downloadPDF error', err);
      setError(err.message || 'Failed to download quote');
    }
  };

  // helper: upload attachment (not wired in UI automatically)
  const handleUploadAttachment = async (quoteId, file) => {
    setLoading(true);
    setError(null);
    try {
      const res = await QuoteService.uploadAttachment(quoteId, file);
      // refresh quote
      const updated = await QuoteService.getQuote(quoteId);
      setQuotes(prev => prev.map(q => (q.id === updated.id ? updated : q)));
      setSelectedQuote(updated);
      return res;
    } catch (err) {
      console.error('uploadAttachment error', err);
      setError(err.message || 'Failed to upload attachment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Edit Quote - populate form and switch to create tab
  const handleEditQuote = (quote) => {
    if (!quote) return;

    // Populate form with quote data
    setFormData({
      customerName: quote.customerName || '',
      customerEmail: quote.customerEmail || '',
      customerPhone: quote.customerPhone || '',
      leadId: quote.leadId || '',
      productType: quote.productType || '',
      productPlan: quote.productPlan || '',
      coverageAmount: quote.coverageAmount?.replace('₹', '') || '',
      premium: quote.premium?.replace('₹', '') || '',
      sumInsured: quote.sumInsured?.replace('₹', '') || '',
      tenure: quote.tenure || '1',
      quoteAmount: quote.quoteAmount?.replace('₹', '') || '',
      validityPeriod: '30',
      remarks: quote.remarks || '',
      ageOfInsured: quote.ageOfInsured || '',
      medicalHistory: quote.medicalHistory || '',
      vehicleDetails: quote.vehicleDetails || '',
      previousInsurance: quote.previousInsurance || ''
    });

    // Store the quote ID for updating instead of creating new
    setSelectedQuote(quote);

    // Switch to raise quote tab
    setCurrentTab(1);
    handleMenuClose();
  };

  // Duplicate Quote - create a copy with new ID
  const handleDuplicateQuote = async (quote) => {
    if (!quote) return;

    // Calculate valid until date (30 days from now)
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 30);

    const duplicatedQuote = {
      ...quote,
      id: `${quote.id}-duplicated`, // Use original ID with -duplicated suffix
      status: 'Draft',
      raisedDate: new Date().toLocaleDateString('en-GB'),
      validUntil: validUntilDate.toLocaleDateString('en-GB'),
      policyNumber: undefined,
      timeline: [
        {
          action: 'Quote Duplicated',
          user: 'Current User',
          timestamp: new Date().toLocaleString(),
          details: `Duplicated from ${quote.id}`
        }
      ]
    };

    setLoading(true);
    try {
      const created = await QuoteService.createQuote(duplicatedQuote);
      setQuotes(prev => [created, ...prev]);

      // Log activity
      addActivityHistory(
        created.id,
        'Quote Duplicated',
        `Duplicated from quote ${quote.id} for ${quote.customerName}`
      );

      handleMenuClose();
    } catch (err) {
      console.error('Duplicate quote error', err);
      setError(err.message || 'Failed to duplicate quote');
    } finally {
      setLoading(false);
    }
  };

  // Print Quote - open print dialog
  const handlePrintQuote = (quote) => {
    if (!quote) return;

    // Store selected quote and open details dialog for printing
    setSelectedQuote(quote);
    setOpenDetailsDialog(true);
    handleMenuClose();

    // Trigger print after a short delay to ensure dialog is rendered
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Delete Quote - show confirmation dialog
  const handleDeleteQuote = (quote) => {
    if (!quote) return;
    setSelectedQuote(quote);
    setDeleteConfirmDialog(true);
  };

  // Confirm Delete Quote
  const handleConfirmDelete = () => {
    if (!selectedQuote) return;

    // Log activity before deleting
    addActivityHistory(
      selectedQuote.id,
      'Quote Deleted',
      `Quote deleted for ${selectedQuote.customerName} - ${selectedQuote.productType}`
    );

    setQuotes(prev => prev.filter(q => q.id !== selectedQuote.id));
    setDeleteConfirmDialog(false);
    handleMenuClose();
    setSelectedQuote(null);
  };

  // Send Quote via Menu - Show preview first
  const handleSendQuoteFromMenu = async () => {
    if (!selectedQuote) return;

    // Validate customer email
    if (!selectedQuote.customerEmail) {
      setSnackbar({
        open: true,
        message: 'Customer email is missing. Please update the quote with a valid email address.',
        severity: 'error'
      });
      handleMenuClose();
      return;
    }

    try {
      setLoading(true);
      // Get email preview from service
      const result = await handleSendQuote(selectedQuote.id, {
        channel: 'email',
        to: selectedQuote.customerEmail
      });

      if (result && result.emailPreview) {
        // Show email preview dialog
        setEmailPreviewData({
          quote: selectedQuote,
          preview: result.emailPreview,
          result: result
        });
        setEmailPreviewDialog(true);

        // Log activity
        addActivityHistory(
          selectedQuote.id,
          'Quote Sent',
          `Quote sent via email to ${selectedQuote.customerEmail}`
        );
      }

      handleMenuClose();
    } catch (err) {
      console.error('Error preparing email:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to prepare email. Please try again.',
        severity: 'error'
      });
      handleMenuClose();
    } finally {
      setLoading(false);
    }
  };

  // Download PDF via Menu
  const handleDownloadPDFFromMenu = async () => {
    if (!selectedQuote) return;

    try {
      await handleDownloadPDF(selectedQuote.id);
      handleMenuClose();
    } catch (err) {
      // Error already handled in handleDownloadPDF
    }
  };

  const renderQuoteCards = () => (
    <Box>
      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by customer name, quote ID, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Quotes</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Converted">Converted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Quote Cards */}
      {filteredQuotes.length > 0 ? (
        <Grid container spacing={3}>
          {filteredQuotes.map((quote) => (
            <Grid item xs={12} md={6} lg={4} key={quote.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: `2px solid ${alpha(
                    quote.status === 'Converted'
                      ? theme.palette.info.main
                      : quote.status === 'Approved'
                        ? theme.palette.success.main
                        : quote.status === 'Rejected' || quote.status === 'Lost'
                          ? theme.palette.error.main
                          : theme.palette.grey[300],
                    0.3
                  )}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: alpha(
                          quote.status === 'Converted'
                            ? theme.palette.info.main
                            : quote.status === 'Approved'
                              ? theme.palette.success.main
                              : theme.palette.primary.main,
                          0.1
                        ),
                        color:
                          quote.status === 'Converted'
                            ? 'info.main'
                            : quote.status === 'Approved'
                              ? 'success.main'
                              : 'primary.main',
                      }}
                    >
                      {getStatusIcon(quote.status)}
                    </Avatar>
                  }
                  action={
                    <IconButton onClick={(e) => handleMenuOpen(e, quote)}>
                      <MoreIcon />
                    </IconButton>
                  }
                  title={
                    <Typography variant="h6" fontWeight="700">
                      {quote.id}
                    </Typography>
                  }
                  subheader={
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip
                        label={quote.status}
                        color={getStatusColor(quote.status)}
                        size="small"
                      />
                      {quote.status === 'Converted' && quote.policyNumber && (
                        <Chip
                          label={`Policy: ${quote.policyNumber}`}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      )}
                    </Stack>
                  }
                />

                <CardContent>
                  <Stack spacing={2}>
                    {/* Customer Info */}
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight="600">
                          {quote.customerName}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                        Lead: {quote.leadId}
                      </Typography>
                    </Box>

                    <Divider />

                    {/* Product Info */}
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {quote.productType}
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {quote.productPlan}
                      </Typography>
                    </Box>

                    {/* Financial Info */}
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Coverage
                        </Typography>
                        <Typography variant="body2" fontWeight="700" color="primary.main">
                          {quote.coverageAmount}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Premium
                        </Typography>
                        <Typography variant="body2" fontWeight="700" color="success.main">
                          {quote.premium}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Conversion Probability */}
                    {quote.status !== 'Converted' && quote.status !== 'Lost' && (
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Conversion Probability
                          </Typography>
                          <Typography variant="caption" fontWeight="600">
                            {quote.conversionProbability || 0}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={quote.conversionProbability || 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          }}
                        />
                      </Box>
                    )}

                    {/* Dates */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        <CalendarIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                        Raised: {quote.raisedDate}
                      </Typography>
                      {quote.validUntil && (
                        <Typography variant="caption" color="error.main" fontWeight="600">
                          Valid till: {quote.validUntil}
                        </Typography>
                      )}
                    </Stack>

                    {/* Attachments */}
                    {quote.attachments && quote.attachments.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          <AttachIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                          {quote.attachments.length} attachment(s)
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewQuote(quote)}
                  >
                    View Details
                  </Button>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Send Email">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(quote);
                          handleSendQuoteFromMenu();
                        }}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(quote);
                          handleDownloadPDFFromMenu();
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <QuoteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No quotes found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first quote to get started'}
          </Typography>
          {!searchTerm && statusFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCurrentTab(1)}
            >
              Create Quote
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );

  const renderRaiseQuoteForm = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
          {selectedQuote ? 'Edit Quote' : 'Create New Quote'}
        </Typography>

        <Stepper activeStep={0} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Customer Info</StepLabel>
          </Step>
          <Step>
            <StepLabel>Product Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Pricing</StepLabel>
          </Step>
        </Stepper>

        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Customer Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Name"
              required
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Lead ID"
              value={formData.leadId}
              onChange={(e) => handleInputChange('leadId', e.target.value)}
              placeholder="Auto-generated if left empty"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Email"
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Phone"
              required
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Product Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Product Type</InputLabel>
              <Select
                value={formData.productType}
                label="Product Type"
                onChange={(e) => handleInputChange('productType', e.target.value)}
              >
                <MenuItem value="Health Insurance">Health Insurance</MenuItem>
                <MenuItem value="Life Insurance">Life Insurance</MenuItem>
                <MenuItem value="Motor Insurance">Motor Insurance</MenuItem>
                <MenuItem value="Travel Insurance">Travel Insurance</MenuItem>
                <MenuItem value="Home Insurance">Home Insurance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Product / Plan</InputLabel>
              <Select
                value={formData.productPlan}
                label="Product / Plan"
                onChange={(e) => handleInputChange('productPlan', e.target.value)}
              >
                <MenuItem value="Health Insurance Premium">Health Insurance Premium</MenuItem>
                <MenuItem value="Health Insurance Premium Plus">Health Insurance Premium Plus</MenuItem>
                <MenuItem value="Family Floater Plan">Family Floater Plan</MenuItem>
                <MenuItem value="Life Insurance Gold">Life Insurance Gold</MenuItem>
                <MenuItem value="Term Insurance Basic">Term Insurance Basic</MenuItem>
                <MenuItem value="Comprehensive Car Insurance">Comprehensive Car Insurance</MenuItem>
                <MenuItem value="Third Party Motor Insurance">Third Party Motor Insurance</MenuItem>
                <MenuItem value="International Travel Insurance">International Travel Insurance</MenuItem>
                <MenuItem value="Domestic Travel Insurance">Domestic Travel Insurance</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Coverage and Pricing */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              Coverage & Pricing
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Coverage Amount"
              required
              value={formData.coverageAmount}
              onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              placeholder="10,00,000"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Sum Insured"
              required
              value={formData.sumInsured}
              onChange={(e) => handleInputChange('sumInsured', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              placeholder="10,00,000"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Premium (Annual)"
              required
              value={formData.premium}
              onChange={(e) => handleInputChange('premium', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              placeholder="12,000"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Total Quote Amount"
              required
              value={formData.quoteAmount}
              onChange={(e) => handleInputChange('quoteAmount', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="12,000"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Policy Tenure</InputLabel>
              <Select
                value={formData.tenure}
                label="Policy Tenure"
                onChange={(e) => handleInputChange('tenure', e.target.value)}
              >
                <MenuItem value="1">1 Year</MenuItem>
                <MenuItem value="2">2 Years</MenuItem>
                <MenuItem value="3">3 Years</MenuItem>
                <MenuItem value="5">5 Years</MenuItem>
                <MenuItem value="10">10 Years</MenuItem>
                <MenuItem value="20">20 Years</MenuItem>
                <MenuItem value="30">30 Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Quote Validity Period</InputLabel>
              <Select
                value={formData.validityPeriod}
                label="Quote Validity Period"
                onChange={(e) => handleInputChange('validityPeriod', e.target.value)}
              >
                <MenuItem value="15">15 days</MenuItem>
                <MenuItem value="30">30 days</MenuItem>
                <MenuItem value="45">45 days</MenuItem>
                <MenuItem value="60">60 days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age of Insured"
              type="number"
              value={formData.ageOfInsured}
              onChange={(e) => handleInputChange('ageOfInsured', e.target.value)}
              placeholder="35"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Remarks / Notes"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              placeholder="Add any additional information or special conditions..."
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                After creating the quote, you can send it to the customer via email and track its status through the quote management dashboard.
              </Typography>
            </Alert>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setFormData({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    leadId: '',
                    productType: '',
                    productPlan: '',
                    coverageAmount: '',
                    premium: '',
                    sumInsured: '',
                    tenure: '1',
                    quoteAmount: '',
                    validityPeriod: '30',
                    remarks: '',
                    ageOfInsured: '',
                    medicalHistory: '',
                    vehicleDetails: '',
                    previousInsurance: ''
                  });
                }}
              >
                Reset Form
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={selectedQuote ? <EditIcon /> : <AddIcon />}
                onClick={handleSubmit}
              >
                {selectedQuote ? 'Update Quote' : 'Submit Quote'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderQuoteHistory = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
        Quote Activity Timeline
      </Typography>

      {mockHistory.length > 0 ? (
        <Timeline>
          {mockHistory.map((entry, index) => (
            <TimelineItem key={entry.id}>
              <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2 }}>
                <Typography variant="caption" fontWeight="600">
                  {entry.quoteId}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {entry.timestamp}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    entry.action.includes('Created') || entry.action.includes('Issued')
                      ? 'success'
                      : entry.action.includes('Rejected')
                        ? 'error'
                        : 'primary'
                  }
                >
                  {entry.action.includes('Created') ? <AddIcon fontSize="small" /> :
                    entry.action.includes('Changed') ? <EditIcon fontSize="small" /> :
                      entry.action.includes('Rejected') ? <RejectedIcon fontSize="small" /> :
                        entry.action.includes('Issued') ? <ConvertedIcon fontSize="small" /> :
                          <QuoteIcon fontSize="small" />}
                </TimelineDot>
                {index < mockHistory.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight="600">
                    {entry.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    By: {entry.user}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {entry.details}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No activity history yet
          </Typography>
        </Box>
      )}
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Quote Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, manage, and track insurance quotes
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedQuote(null);
            setFormData({
              customerName: '',
              customerEmail: '',
              customerPhone: '',
              leadId: '',
              productType: '',
              productPlan: '',
              coverageAmount: '',
              premium: '',
              sumInsured: '',
              tenure: '1',
              quoteAmount: '',
              validityPeriod: '30',
              remarks: '',
              ageOfInsured: '',
              medicalHistory: '',
              vehicleDetails: '',
              previousInsurance: ''
            });
            setCurrentTab(1);
          }}
        >
          New Quote
        </Button>
      </Box>

      {/* show loading / error as logic-only — UI left untouched otherwise */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Enhanced Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Total Quotes
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="primary.main">
                    {stats.totalQuotes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {stats.draftQuotes} drafts
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    color: 'primary.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <QuoteIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Pending Approval
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="warning.main">
                    {stats.pendingQuotes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {stats.approvedQuotes} approved
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    color: 'warning.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <PendingIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Converted
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="info.main">
                    {stats.convertedQuotes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {stats.conversionRate}% rate
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    color: 'info.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <ConvertedIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.2)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="600">
                    Total Value
                  </Typography>
                  <Typography variant="h3" fontWeight="700" color="success.main">
                    ₹{(stats.totalValue / 100000).toFixed(1)}L
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Avg: ₹{(stats.avgQuoteValue / 1000).toFixed(0)}K
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    color: 'success.main',
                    width: 56,
                    height: 56,
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              py: 2,
            },
          }}
        >
          <Tab
            icon={<Badge badgeContent={filteredQuotes.length} color="primary" max={999}><QuoteIcon /></Badge>}
            iconPosition="start"
            label="All Quotes"
          />
          <Tab icon={<AddIcon />} iconPosition="start" label="Create Quote" />
          <Tab
            icon={<Badge badgeContent={mockHistory.length} color="primary" max={999}><AssessmentIcon /></Badge>}
            iconPosition="start"
            label="Activity History"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {currentTab === 0 && renderQuoteCards()}
        {currentTab === 1 && renderRaiseQuoteForm()}
        {currentTab === 2 && renderQuoteHistory()}
      </Box>


      {/* Quote Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                {selectedQuote && getStatusIcon(selectedQuote.status)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700">
                  {selectedQuote?.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Quote Details
                </Typography>
              </Box>
            </Box>
            {selectedQuote && (
              <Chip
                label={selectedQuote.status}
                color={getStatusColor(selectedQuote.status)}
                icon={getStatusIcon(selectedQuote.status)}
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {selectedQuote && (
            <Box>
              {/* Customer Section */}
              <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                Customer Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Customer Name</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedQuote.customerName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Lead ID</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedQuote.leadId}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2">{selectedQuote.customerEmail}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2">{selectedQuote.customerPhone}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Product Section */}
              <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                Product Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Product Type</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedQuote.productType}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Plan Name</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedQuote.productPlan}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Policy Tenure</Typography>
                  <Typography variant="body2">{selectedQuote.tenure}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Version</Typography>
                  <Typography variant="body2">v{selectedQuote.version}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Financial Section */}
              <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                Financial Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Coverage Amount</Typography>
                  <Typography variant="h6" fontWeight="700" color="primary.main">
                    {selectedQuote.coverageAmount}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Premium (Annual)</Typography>
                  <Typography variant="h6" fontWeight="700" color="success.main">
                    {selectedQuote.premium}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Total Quote</Typography>
                  <Typography variant="h6" fontWeight="700" color="info.main">
                    {selectedQuote.quoteAmount}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Timeline Section */}
              <Typography variant="subtitle1" fontWeight="700" gutterBottom sx={{ mb: 2 }}>
                Quote Timeline
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Raised Date</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedQuote.raisedDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Raised By</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedQuote.raisedBy}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body2">{selectedQuote.lastUpdated}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Valid Until</Typography>
                  <Typography variant="body2" color={selectedQuote.validUntil ? 'text.primary' : 'text.secondary'}>
                    {selectedQuote.validUntil || 'Not set'}
                  </Typography>
                </Grid>
              </Grid>

              {selectedQuote.policyNumber && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="600">
                    Policy Number: {selectedQuote.policyNumber}
                  </Typography>
                </Alert>
              )}

              {/* Attachments */}
              {selectedQuote.attachments && selectedQuote.attachments.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                    Attachments ({selectedQuote.attachments.length})
                  </Typography>
                  <List>
                    {selectedQuote.attachments.map((file, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end">
                            <DownloadIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <AttachIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={file} secondary="PDF Document" />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {/* Activity Timeline */}
              {selectedQuote.timeline && selectedQuote.timeline.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                    Activity Log
                  </Typography>
                  <Timeline sx={{ mt: 2 }}>
                    {selectedQuote.timeline.map((activity, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2 }}>
                          <Typography variant="caption">
                            {activity.timestamp}
                          </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color="primary" variant="outlined" />
                          {index < selectedQuote.timeline.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body2" fontWeight="600">
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            By: {activity.user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.details}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => handlePrintQuote(selectedQuote)}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDFFromMenu}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendQuoteFromMenu}
          >
            Send to Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quote Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        {/* Status Change Options */}
        {selectedQuote && selectedQuote.status === 'Draft' && (
          <>
            <MenuItem onClick={() => handleStatusChange('Pending')}>
              <ListItemIcon>
                <PendingIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Submit for Approval</ListItemText>
            </MenuItem>
            <Divider />
          </>
        )}
        {selectedQuote && selectedQuote.status === 'Pending' && (
          <>
            <MenuItem onClick={() => handleStatusChange('Approved')}>
              <ListItemIcon>
                <ApprovedIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Approve Quote</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange('Rejected')}>
              <ListItemIcon>
                <RejectedIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Reject Quote</ListItemText>
            </MenuItem>
            <Divider />
          </>
        )}
        {selectedQuote && selectedQuote.status === 'Approved' && (
          <>
            <MenuItem onClick={() => handleStatusChange('Converted')}>
              <ListItemIcon>
                <ConvertedIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText>Convert to Policy</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange('Lost')}>
              <ListItemIcon>
                <LostIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Mark as Lost</ListItemText>
            </MenuItem>
            <Divider />
          </>
        )}

        {/* Quote Actions */}
        <MenuItem onClick={() => handleEditQuote(selectedQuote)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Quote</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDuplicateQuote(selectedQuote)}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate Quote</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSendQuoteFromMenu}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send to Customer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadPDFFromMenu}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handlePrintQuote(selectedQuote)}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Quote</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleDeleteQuote(selectedQuote)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Quote</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog}
        onClose={() => setDeleteConfirmDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon color="error" />
            <Typography variant="h6">Delete Quote</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this quote?
          </Typography>
          {selectedQuote && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Quote ID:</strong> {selectedQuote.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Customer:</strong> {selectedQuote.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Amount:</strong> {selectedQuote.quoteAmount}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Preview Dialog */}
      <Dialog
        open={emailPreviewDialog}
        onClose={() => setEmailPreviewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              <Typography variant="h6">Email Preview</Typography>
            </Box>
            <IconButton onClick={() => setEmailPreviewDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {emailPreviewData && (
            <Box>
              {/* Email Metadata */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">From</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {emailPreviewData.preview.from}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">To</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {emailPreviewData.preview.to}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Subject</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {emailPreviewData.preview.subject}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Email Content Preview */}
              <Box sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#f5f5f5'
              }}>
                <Box sx={{
                  p: 1.5,
                  bgcolor: 'background.paper',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography variant="caption" fontWeight="600" color="text.secondary">
                    EMAIL PREVIEW
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    maxHeight: '400px',
                    overflow: 'auto',
                    bgcolor: 'white'
                  }}
                  dangerouslySetInnerHTML={{ __html: emailPreviewData.preview.html }}
                />
              </Box>

              {/* Success Info */}
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Email is ready to be sent to <strong>{emailPreviewData.preview.to}</strong>
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setEmailPreviewDialog(false)}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              // Show success notification
              setSnackbar({
                open: true,
                message: `Quote email sent successfully to ${emailPreviewData?.preview?.to}`,
                severity: 'success'
              });
              setEmailPreviewDialog(false);
              setEmailPreviewData(null);
            }}
            variant="contained"
            startIcon={<SendIcon />}
            color="primary"
          >
            Confirm & Send Email
          </Button>
        </DialogActions>
      </Dialog>


      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuoteManagement;
