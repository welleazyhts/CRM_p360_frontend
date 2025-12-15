import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Avatar, IconButton, Tabs, Tab, Alert, Divider,
  List, ListItem, ListItemText, ListItemIcon, Badge, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment,
  LinearProgress, alpha, useTheme, Stack, Link
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  DirectionsCar as VehicleIcon,
  AccountBalance as BankIcon,
  Gavel as LegalIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CheckCircle as VerifiedIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  Map as MapIcon,
  Check as CheckIcon,
  VerifiedUser as VerifiedUserIcon,
  DirectionsWalk as VisitIcon,
  Image as ImageIcon,
  Person as VendorIcon,
  Upload as UploadIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const SkipTracing = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [searching, setSearching] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [activityLogsDialog, setActivityLogsDialog] = useState(false);
  const [selectedDebtorForLogs, setSelectedDebtorForLogs] = useState(null);
  const [editType, setEditType] = useState(''); // 'phone', 'email', 'address', 'employment', 'asset', 'social'
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validatingPhone, setValidatingPhone] = useState(null);
  const [phoneValidationResults, setPhoneValidationResults] = useState({});
  const [physicalVisitDialog, setPhysicalVisitDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [scheduleVisitDialog, setScheduleVisitDialog] = useState(false);
  const [visitFormData, setVisitFormData] = useState({
    vendor: '',
    visitDate: '',
    notes: ''
  });

  // Logging function for skip trace activities
  const logSkipTraceActivity = (action, details, skipTraceId, accountNumber, debtorName) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      module: 'Skip Tracing',
      action: action,
      details: details,
      skipTraceId: skipTraceId,
      accountNumber: accountNumber,
      debtorName: debtorName,
      user: 'Current User' // In production, get from auth context
    };

    // In production, this would call an API endpoint to log the activity
    // Example: await fetch('/api/activity-log', { method: 'POST', body: JSON.stringify(logEntry) });
    console.log('Skip Trace Activity Logged:', logEntry);

    // This log will appear in the Consolidated Activity Timeline on the DebtorDetails page
    return logEntry;
  };

  // Phone Validation Function (OTP/API)
  const handleValidatePhone = (phoneNumber, index) => {
    setValidatingPhone(index);

    // Simulate OTP/API validation
    setTimeout(() => {
      const validationResult = {
        isValid: true,
        carrier: 'Vodafone India',
        lineType: 'Mobile',
        location: 'Karnataka, India',
        validatedAt: new Date().toLocaleString(),
        status: 'Active',
        riskScore: 'Low'
      };

      setPhoneValidationResults(prev => ({
        ...prev,
        [phoneNumber]: validationResult
      }));

      setValidatingPhone(null);

      // Log validation activity
      logSkipTraceActivity(
        'Phone Number Validated',
        `Validated ${phoneNumber} - Carrier: ${validationResult.carrier}, Type: ${validationResult.lineType}, Status: ${validationResult.status}`,
        selectedDebtor.skipTraceId,
        selectedDebtor.accountNumber,
        selectedDebtor.debtorName
      );
    }, 2000);
  };

  // Available vendors for physical visit assignment
  const availableVendors = [
    'Field Verification Services Pvt Ltd',
    'Mumbai Field Agents Ltd',
    'Bangalore Skip Trace Associates',
    'Delhi Verification Partners',
    'Chennai Field Investigation Services'
  ];

  // Handle opening schedule visit dialog
  const handleOpenScheduleVisit = () => {
    setVisitFormData({
      vendor: '',
      visitDate: '',
      notes: ''
    });
    setScheduleVisitDialog(true);
  };

  // Handle scheduling physical visit
  const handleScheduleVisit = () => {
    if (!visitFormData.vendor || !visitFormData.visitDate) {
      alert('Please select a vendor and visit date');
      return;
    }

    const newVisit = {
      status: 'Scheduled',
      vendor: visitFormData.vendor,
      assignedDate: new Date().toISOString().split('T')[0],
      visitDate: visitFormData.visitDate,
      completedDate: null,
      assignedBy: 'Current User',
      notes: visitFormData.notes || 'Physical visit scheduled for address verification.',
      images: [],
      lastUpdated: new Date().toLocaleString()
    };

    // Update the selected debtor with the new visit
    setSkipTraceResults(prevResults =>
      prevResults.map(result => {
        if (result.id === selectedDebtor.id) {
          return { ...result, physicalVisit: newVisit };
        }
        return result;
      })
    );

    setSelectedDebtor(prev => ({
      ...prev,
      physicalVisit: newVisit
    }));

    setSelectedVisit(newVisit);

    // Log the scheduling activity
    logSkipTraceActivity(
      'Physical Visit Scheduled',
      `Scheduled visit with ${visitFormData.vendor} for ${visitFormData.visitDate}`,
      selectedDebtor.skipTraceId,
      selectedDebtor.accountNumber,
      selectedDebtor.debtorName
    );

    setScheduleVisitDialog(false);
    alert('Physical visit scheduled successfully!');
  };

  // Mock data for skip trace results
  const [skipTraceResults, setSkipTraceResults] = useState([
    {
      id: 1,
      skipTraceId: 'SKP-2025-001',
      debtorName: 'Rajesh Kumar',
      accountNumber: 'ACC-2024-001',
      debtAmount: 45000,
      status: 'Located',
      confidence: 92,
      phones: [
        { number: '+91 98765 43210', type: 'Mobile', verified: true, lastUpdated: '2025-01-15' },
        { number: '+91 11 2345 6789', type: 'Home', verified: false, lastUpdated: '2024-12-20' }
      ],
      emails: [
        {
          address: 'rajesh.kumar@email.com',
          type: 'Personal',
          verified: true,
          lastUpdated: '2025-01-10',
          deliverability: 'Valid',
          domainVerified: true,
          smtpCheck: 'Passed',
          syntaxValid: true
        },
        {
          address: 'rkumar@company.com',
          type: 'Work',
          verified: false,
          lastUpdated: '2024-11-15',
          deliverability: 'Unknown',
          domainVerified: true,
          smtpCheck: 'Not Checked',
          syntaxValid: true
        }
      ],
      addresses: [
        {
          address: '123, MG Road, Bangalore, Karnataka - 560001',
          type: 'Current',
          verified: true,
          lastUpdated: '2025-01-18',
          moveInDate: '2023-06-01'
        },
        {
          address: '456, Nehru Nagar, Delhi - 110065',
          type: 'Previous',
          verified: true,
          lastUpdated: '2023-05-15',
          moveInDate: '2020-03-01'
        }
      ],
      employment: {
        employer: 'Tech Solutions Pvt Ltd',
        position: 'Software Engineer',
        verified: true,
        lastUpdated: '2025-01-05',
        phone: '+91 80 4567 8900'
      },
      assets: [
        { type: 'Vehicle', description: 'Honda City 2020', value: 800000, verified: true },
        { type: 'Property', description: 'Apartment in Bangalore', value: 6500000, verified: false },
        { type: 'Bank Account', description: 'HDFC Bank - ****4567', verified: false }
      ],
      socialMedia: [
        { platform: 'LinkedIn', url: 'linkedin.com/in/rajeshkumar', verified: true },
        { platform: 'Facebook', url: 'facebook.com/rajeshk', verified: false }
      ],
      legalStatus: {
        bankruptcy: false,
        liens: false,
        judgments: false,
        deceased: false
      },
      lastContact: '2024-12-15',
      dpd: 145,
      physicalVisit: {
        status: 'Completed',
        vendor: 'Field Verification Services Pvt Ltd',
        assignedDate: '2025-01-12',
        visitDate: '2025-01-14',
        completedDate: '2025-01-14',
        assignedBy: 'Skip Trace Manager',
        notes: 'Debtor confirmed at current address. Employed and cooperative. Willing to settle.',
        images: [
          { name: 'residence_front.jpg', url: '/uploads/visit1.jpg', uploadedAt: '2025-01-14 15:30' },
          { name: 'verification_document.jpg', url: '/uploads/visit2.jpg', uploadedAt: '2025-01-14 15:32' }
        ],
        lastUpdated: '2025-01-14 16:00'
      },
      activityLog: [
        { date: '2025-01-09', time: '15:45', action: 'Skip Trace Social Media Located', user: 'Skip Trace Team', details: 'Added social media: LinkedIn - linkedin.com/in/rajeshkumar' },
        { date: '2025-01-09', time: '14:20', action: 'Skip Trace Asset Added', user: 'Skip Trace Team', details: 'Added asset: Honda City 2020 (Vehicle) - Estimated value: ₹8,00,000' },
        { date: '2025-01-09', time: '11:30', action: 'Skip Trace Employment Updated', user: 'Skip Trace Team', details: 'Updated employment: Tech Solutions Pvt Ltd - Software Engineer' },
        { date: '2025-01-08', time: '16:10', action: 'Skip Trace Address Added', user: 'Skip Trace Team', details: 'Added address: 123, MG Road, Bangalore, Karnataka - 560001 (Current) - Verified: Yes' },
        { date: '2025-01-08', time: '14:50', action: 'Skip Trace Email Added', user: 'Skip Trace Team', details: 'Added email: rajesh.kumar@email.com (Personal) - Verified: Yes' },
        { date: '2025-01-08', time: '11:15', action: 'Skip Trace Phone Added', user: 'Skip Trace Team', details: 'Added phone: +91 98765 43210 (Mobile) - Verified: Yes' },
        { date: '2025-01-08', time: '09:00', action: 'Skip Trace Search Completed', user: 'Skip Trace Team', details: 'Skip trace search completed successfully. Found 2 phone numbers, 2 email addresses, 2 addresses, employment info, and 2 assets. Confidence: 92%' },
        { date: '2025-01-07', time: '16:30', action: 'Skip Trace Search Initiated', user: 'Skip Trace Team', details: 'Skip trace search initiated for debtor: Rajesh Kumar (ACC-2024-001). Previous contact attempts failed.' }
      ]
    },
    {
      id: 2,
      skipTraceId: 'SKP-2025-002',
      debtorName: 'Priya Sharma',
      accountNumber: 'ACC-2024-002',
      debtAmount: 82000,
      status: 'Partial',
      confidence: 65,
      phones: [
        { number: '+91 98123 45678', type: 'Mobile', verified: false, lastUpdated: '2024-10-20' }
      ],
      emails: [],
      addresses: [
        {
          address: '789, Park Street, Mumbai, Maharashtra - 400001',
          type: 'Last Known',
          verified: false,
          lastUpdated: '2024-08-10',
          moveInDate: '2022-01-15'
        }
      ],
      employment: null,
      assets: [],
      socialMedia: [
        { platform: 'Facebook', url: 'facebook.com/priyasharma', verified: false }
      ],
      legalStatus: {
        bankruptcy: false,
        liens: true,
        judgments: false,
        deceased: false
      },
      lastContact: '2024-10-01',
      dpd: 212,
      physicalVisit: {
        status: 'In Progress',
        vendor: 'Mumbai Field Agents Ltd',
        assignedDate: '2025-01-20',
        visitDate: '2025-01-22',
        completedDate: null,
        assignedBy: 'Skip Trace Manager',
        notes: 'Vendor assigned for address verification at last known location.',
        images: [],
        lastUpdated: '2025-01-20 10:00'
      },
      activityLog: [
        { date: '2024-10-25', time: '14:30', action: 'Skip Trace Social Media Located', user: 'Skip Trace Team', details: 'Added social media: Facebook - facebook.com/priyasharma' },
        { date: '2024-10-22', time: '11:15', action: 'Skip Trace Address Added', user: 'Skip Trace Team', details: 'Added address: 789, Park Street, Mumbai, Maharashtra - 400001 (Last Known) - Verified: No' },
        { date: '2024-10-20', time: '16:45', action: 'Skip Trace Phone Added', user: 'Skip Trace Team', details: 'Added phone: +91 98123 45678 (Mobile) - Verified: No' },
        { date: '2024-10-20', time: '10:00', action: 'Skip Trace Search Completed', user: 'Skip Trace Team', details: 'Skip trace search completed with partial results. Found 1 phone number, 1 address, and 1 social media profile. Confidence: 65%' },
        { date: '2024-10-18', time: '09:30', action: 'Skip Trace Search Initiated', user: 'Skip Trace Team', details: 'Skip trace search initiated for debtor: Priya Sharma (ACC-2024-002). Debtor has moved from last known address.' }
      ]
    },
    {
      id: 3,
      skipTraceId: 'SKP-2025-003',
      debtorName: 'Amit Patel',
      accountNumber: 'ACC-2024-003',
      debtAmount: 125000,
      status: 'Not Found',
      confidence: 25,
      phones: [],
      emails: [],
      addresses: [
        {
          address: '321, Gandhi Road, Ahmedabad, Gujarat - 380001',
          type: 'Last Known',
          verified: false,
          lastUpdated: '2023-12-05',
          moveInDate: '2019-09-01'
        }
      ],
      employment: null,
      assets: [],
      socialMedia: [],
      legalStatus: {
        bankruptcy: true,
        liens: false,
        judgments: false,
        deceased: false
      },
      lastContact: '2024-06-20',
      dpd: 289,
      activityLog: [
        { date: '2024-07-15', time: '15:00', action: 'Skip Trace Search Completed', user: 'Skip Trace Team', details: 'Skip trace search completed with minimal results. Only found 1 old address. Confidence: 25%. Debtor appears to have filed bankruptcy.' },
        { date: '2024-07-10', time: '10:30', action: 'Skip Trace Address Added', user: 'Skip Trace Team', details: 'Added address: 321, Gandhi Road, Ahmedabad, Gujarat - 380001 (Last Known) - Verified: No. Address is from 2019.' },
        { date: '2024-07-08', time: '14:00', action: 'Skip Trace Search Initiated', user: 'Skip Trace Team', details: 'Skip trace search initiated for debtor: Amit Patel (ACC-2024-003). No contact for over 6 months. Bankruptcy filing detected.' }
      ]
    }
  ]);

  const handleSearch = () => {
    setSearching(true);

    // Log skip trace search initiation
    logSkipTraceActivity(
      'Skip Trace Search Initiated',
      `Search by ${searchType}: "${searchQuery}"`,
      'N/A',
      'N/A',
      searchQuery
    );

    // Simulate API call
    setTimeout(() => {
      setSearching(false);

      // Log skip trace search completion
      logSkipTraceActivity(
        'Skip Trace Search Completed',
        `Found ${skipTraceResults.length} results for ${searchType}: "${searchQuery}"`,
        'N/A',
        'N/A',
        searchQuery
      );
    }, 2000);
  };

  const handleViewDetails = (debtor) => {
    setSelectedDebtor(debtor);
    setDetailsDialog(true);
  };

  const handleViewActivityLogs = (debtor) => {
    setSelectedDebtorForLogs(debtor);
    setActivityLogsDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Located':
        return 'success';
      case 'Partial':
        return 'warning';
      case 'Not Found':
        return 'error';
      default:
        return 'default';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return theme.palette.success.main;
    if (confidence >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Edit/Add/Delete Functions
  const handleEdit = (type, data, index) => {
    setEditType(type);
    setEditData(data);
    setEditIndex(index);
    setAddMode(false);
    setEditDialog(true);
  };

  const handleAdd = (type) => {
    setEditType(type);
    setAddMode(true);
    // Set default empty data based on type
    switch(type) {
      case 'phone':
        setEditData({ number: '', type: 'Mobile', verified: false, lastUpdated: new Date().toISOString().split('T')[0] });
        break;
      case 'email':
        setEditData({ address: '', type: 'Personal', verified: false, lastUpdated: new Date().toISOString().split('T')[0] });
        break;
      case 'address':
        setEditData({ address: '', type: 'Current', verified: false, lastUpdated: new Date().toISOString().split('T')[0], moveInDate: '' });
        break;
      case 'employment':
        setEditData({ employer: '', position: '', verified: false, lastUpdated: new Date().toISOString().split('T')[0], phone: '' });
        break;
      case 'asset':
        setEditData({ type: 'Vehicle', description: '', value: 0, verified: false });
        break;
      case 'social':
        setEditData({ platform: 'LinkedIn', url: '', verified: false });
        break;
      default:
        setEditData({});
    }
    setEditDialog(true);
  };

  const handleDelete = (type, index) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    // Get the item being deleted for logging
    let deletedItem = '';
    switch(type) {
      case 'phone':
        deletedItem = selectedDebtor.phones[index]?.number || '';
        break;
      case 'email':
        deletedItem = selectedDebtor.emails[index]?.address || '';
        break;
      case 'address':
        deletedItem = selectedDebtor.addresses[index]?.address || '';
        break;
      case 'asset':
        deletedItem = selectedDebtor.assets[index]?.description || '';
        break;
      case 'social':
        deletedItem = selectedDebtor.socialMedia[index]?.platform || '';
        break;
    }

    // Log the deletion
    logSkipTraceActivity(
      `Skip Trace ${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`,
      `Deleted ${type}: ${deletedItem}`,
      selectedDebtor.skipTraceId,
      selectedDebtor.accountNumber,
      selectedDebtor.debtorName
    );

    setSkipTraceResults(prevResults =>
      prevResults.map(result => {
        if (result.id === selectedDebtor.id) {
          const updated = { ...result };
          switch(type) {
            case 'phone':
              updated.phones = updated.phones.filter((_, i) => i !== index);
              break;
            case 'email':
              updated.emails = updated.emails.filter((_, i) => i !== index);
              break;
            case 'address':
              updated.addresses = updated.addresses.filter((_, i) => i !== index);
              break;
            case 'asset':
              updated.assets = updated.assets.filter((_, i) => i !== index);
              break;
            case 'social':
              updated.socialMedia = updated.socialMedia.filter((_, i) => i !== index);
              break;
          }
          return updated;
        }
        return result;
      })
    );

    // Update selected debtor
    setSelectedDebtor(prev => {
      const updated = { ...prev };
      switch(type) {
        case 'phone':
          updated.phones = updated.phones.filter((_, i) => i !== index);
          break;
        case 'email':
          updated.emails = updated.emails.filter((_, i) => i !== index);
          break;
        case 'address':
          updated.addresses = updated.addresses.filter((_, i) => i !== index);
          break;
        case 'asset':
          updated.assets = updated.assets.filter((_, i) => i !== index);
          break;
        case 'social':
          updated.socialMedia = updated.socialMedia.filter((_, i) => i !== index);
          break;
      }
      return updated;
    });
  };

  const handleSaveEdit = () => {
    setSkipTraceResults(prevResults =>
      prevResults.map(result => {
        if (result.id === selectedDebtor.id) {
          const updated = { ...result };
          switch(editType) {
            case 'phone':
              if (addMode) {
                updated.phones = [...updated.phones, editData];
              } else {
                updated.phones = updated.phones.map((item, i) => i === editIndex ? editData : item);
              }
              break;
            case 'email':
              if (addMode) {
                updated.emails = [...updated.emails, editData];
              } else {
                updated.emails = updated.emails.map((item, i) => i === editIndex ? editData : item);
              }
              break;
            case 'address':
              if (addMode) {
                updated.addresses = [...updated.addresses, editData];
              } else {
                updated.addresses = updated.addresses.map((item, i) => i === editIndex ? editData : item);
              }
              break;
            case 'employment':
              updated.employment = editData;
              break;
            case 'asset':
              if (addMode) {
                updated.assets = [...updated.assets, editData];
              } else {
                updated.assets = updated.assets.map((item, i) => i === editIndex ? editData : item);
              }
              break;
            case 'social':
              if (addMode) {
                updated.socialMedia = [...updated.socialMedia, editData];
              } else {
                updated.socialMedia = updated.socialMedia.map((item, i) => i === editIndex ? editData : item);
              }
              break;
          }
          return updated;
        }
        return result;
      })
    );

    // Update selected debtor
    setSelectedDebtor(prev => {
      const updated = { ...prev };
      switch(editType) {
        case 'phone':
          if (addMode) {
            updated.phones = [...updated.phones, editData];
          } else {
            updated.phones = updated.phones.map((item, i) => i === editIndex ? editData : item);
          }
          break;
        case 'email':
          if (addMode) {
            updated.emails = [...updated.emails, editData];
          } else {
            updated.emails = updated.emails.map((item, i) => i === editIndex ? editData : item);
          }
          break;
        case 'address':
          if (addMode) {
            updated.addresses = [...updated.addresses, editData];
          } else {
            updated.addresses = updated.addresses.map((item, i) => i === editIndex ? editData : item);
          }
          break;
        case 'employment':
          updated.employment = editData;
          break;
        case 'asset':
          if (addMode) {
            updated.assets = [...updated.assets, editData];
          } else {
            updated.assets = updated.assets.map((item, i) => i === editIndex ? editData : item);
          }
          break;
        case 'social':
          if (addMode) {
            updated.socialMedia = [...updated.socialMedia, editData];
          } else {
            updated.socialMedia = updated.socialMedia.map((item, i) => i === editIndex ? editData : item);
          }
          break;
      }
      return updated;
    });

    // Log the add or edit operation
    let logDetails = '';
    let actionType = addMode ? 'Added' : 'Updated';

    switch(editType) {
      case 'phone':
        logDetails = `${actionType} phone: ${editData.number} (${editData.type})`;
        break;
      case 'email':
        logDetails = `${actionType} email: ${editData.address} (${editData.type})`;
        break;
      case 'address':
        logDetails = `${actionType} address: ${editData.address} (${editData.type})`;
        break;
      case 'employment':
        logDetails = `${actionType} employment: ${editData.employer} - ${editData.position}`;
        break;
      case 'asset':
        logDetails = `${actionType} asset: ${editData.description} (${editData.type})`;
        break;
      case 'social':
        logDetails = `${actionType} social media: ${editData.platform} - ${editData.url}`;
        break;
    }

    logSkipTraceActivity(
      `Skip Trace ${editType.charAt(0).toUpperCase() + editType.slice(1)} ${actionType}`,
      logDetails,
      selectedDebtor.skipTraceId,
      selectedDebtor.accountNumber,
      selectedDebtor.debtorName
    );

    setEditDialog(false);
    setEditData(null);
    setEditIndex(null);
  };

  const renderSearchPanel = () => (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon color="primary" />
          Skip Trace Search
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Debtor"
              placeholder="Enter name, account, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Search Type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="name">Name</option>
              <option value="account">Account Number</option>
              <option value="phone">Phone Number</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={searching || !searchQuery}
              sx={{ height: 56 }}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<DownloadIcon />}
              sx={{ height: 56 }}
            >
              Export
            </Button>
          </Grid>
        </Grid>
        {searching && <LinearProgress sx={{ mt: 2 }} />}
      </CardContent>
    </Card>
  );

  const renderResultsTable = () => (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Skip Trace Results ({skipTraceResults.length})
          </Typography>
          <Button startIcon={<RefreshIcon />} size="small">
            Refresh All
          </Button>
        </Box>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Skip Trace ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Debtor Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Debt Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>DPD</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Skip Tracing Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Physical Visit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Updated</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skipTraceResults.map((result) => (
                <TableRow key={result.id} hover>
                  <TableCell>
                    <Chip
                      label={result.skipTraceId || `SKP-${result.id}`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {result.debtorName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {result.debtorName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {result.accountNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{result.debtAmount.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${result.dpd} days`}
                      size="small"
                      color={result.dpd > 180 ? 'error' : result.dpd > 90 ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={result.status}
                      color={getStatusColor(result.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={result.confidence}
                        sx={{
                          width: 60,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(getConfidenceColor(result.confidence), 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getConfidenceColor(result.confidence)
                          }
                        }}
                      />
                      <Typography variant="caption" fontWeight={600}>
                        {result.confidence}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {result.physicalVisit ? (
                      <Tooltip title={`Vendor: ${result.physicalVisit.vendor}`}>
                        <Chip
                          icon={<VisitIcon />}
                          label={result.physicalVisit.status}
                          size="small"
                          color={
                            result.physicalVisit.status === 'Completed' ? 'success' :
                            result.physicalVisit.status === 'In Progress' ? 'primary' :
                            'default'
                          }
                          onClick={() => {
                            setSelectedVisit(result.physicalVisit);
                            setSelectedDebtor(result);
                            setPhysicalVisitDialog(true);
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Click to schedule visit">
                        <Chip
                          label="Not Scheduled"
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedDebtor(result);
                            handleOpenScheduleVisit();
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {result.phones[0]?.lastUpdated || result.addresses[0]?.lastUpdated || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Activity Logs">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleViewActivityLogs(result)}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Full Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetails(result)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderDetailsDialog = () => (
    <Dialog
      open={detailsDialog}
      onClose={() => setDetailsDialog(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Skip Trace Details: {selectedDebtor?.debtorName}
          </Typography>
          <Chip
            label={`${selectedDebtor?.confidence}% Confidence`}
            sx={{ bgcolor: 'white', color: theme.palette.primary.main, fontWeight: 600 }}
          />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedDebtor && (
          <Grid container spacing={3}>
            {/* Phone Numbers */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon color="primary" />
                      Phone Numbers ({selectedDebtor.phones.length})
                    </Typography>
                    <IconButton size="small" color="primary" onClick={() => handleAdd('phone')}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {selectedDebtor.phones.length > 0 ? (
                    <List dense>
                      {selectedDebtor.phones.map((phone, index) => (
                        <Box key={index}>
                          <ListItem
                            sx={{ pl: 0 }}
                            secondaryAction={
                              <Box>
                                <Tooltip title="Validate Phone">
                                  <IconButton
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleValidatePhone(phone.number, index)}
                                    disabled={validatingPhone === index}
                                  >
                                    {validatingPhone === index ? (
                                      <RefreshIcon fontSize="small" sx={{ animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                                    ) : phoneValidationResults[phone.number] ? (
                                      <VerifiedUserIcon fontSize="small" />
                                    ) : (
                                      <CheckIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                <IconButton size="small" onClick={() => handleEdit('phone', phone, index)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete('phone', index)} color="error">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {phone.verified ? (
                                <VerifiedIcon color="success" fontSize="small" />
                              ) : (
                                <WarningIcon color="warning" fontSize="small" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight={500}>
                                  {phone.number}
                                </Typography>
                              }
                              secondary={`${phone.type} • Updated: ${phone.lastUpdated}`}
                            />
                          </ListItem>
                          {phoneValidationResults[phone.number] && (
                            <Box sx={{ ml: 5, mb: 1.5, p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 1, border: '1px solid', borderColor: alpha(theme.palette.success.main, 0.2) }}>
                              <Typography variant="caption" fontWeight={600} color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <VerifiedUserIcon fontSize="small" />
                                Validation Results
                              </Typography>
                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <Typography variant="caption" color="text.secondary">Carrier:</Typography>
                                  <Typography variant="caption" fontWeight={500} display="block">{phoneValidationResults[phone.number].carrier}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="caption" color="text.secondary">Line Type:</Typography>
                                  <Typography variant="caption" fontWeight={500} display="block">{phoneValidationResults[phone.number].lineType}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="caption" color="text.secondary">Location:</Typography>
                                  <Typography variant="caption" fontWeight={500} display="block">{phoneValidationResults[phone.number].location}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="caption" color="text.secondary">Status:</Typography>
                                  <Chip label={phoneValidationResults[phone.number].status} size="small" color="success" sx={{ height: 16, fontSize: '0.65rem' }} />
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="caption" color="text.secondary">Validated: {phoneValidationResults[phone.number].validatedAt}</Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="warning">No phone numbers found</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Email Addresses */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="primary" />
                      Email Addresses ({selectedDebtor.emails.length})
                    </Typography>
                    <IconButton size="small" color="primary" onClick={() => handleAdd('email')}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {selectedDebtor.emails.length > 0 ? (
                    <List dense>
                      {selectedDebtor.emails.map((email, index) => (
                        <Box key={index}>
                          <ListItem
                            sx={{ pl: 0 }}
                            secondaryAction={
                              <Box>
                                <IconButton size="small" onClick={() => handleEdit('email', email, index)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete('email', index)} color="error">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {email.verified ? (
                                <VerifiedIcon color="success" fontSize="small" />
                              ) : (
                                <WarningIcon color="warning" fontSize="small" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight={500}>
                                  {email.address}
                                </Typography>
                              }
                              secondary={`${email.type} • Updated: ${email.lastUpdated}`}
                            />
                          </ListItem>
                          {email.deliverability && (
                            <Box sx={{ ml: 5, mb: 1.5, p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1, border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.2) }}>
                              <Typography variant="caption" fontWeight={600} color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <EmailIcon fontSize="small" />
                                Email Validation Attributes
                              </Typography>
                              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                                <Chip
                                  label={`Deliverability: ${email.deliverability}`}
                                  size="small"
                                  color={email.deliverability === 'Valid' ? 'success' : 'default'}
                                  sx={{ height: 18, fontSize: '0.65rem' }}
                                />
                                <Chip
                                  label={`Domain: ${email.domainVerified ? 'Verified' : 'Unverified'}`}
                                  size="small"
                                  color={email.domainVerified ? 'success' : 'warning'}
                                  sx={{ height: 18, fontSize: '0.65rem' }}
                                />
                                <Chip
                                  label={`SMTP: ${email.smtpCheck}`}
                                  size="small"
                                  color={email.smtpCheck === 'Passed' ? 'success' : 'default'}
                                  sx={{ height: 18, fontSize: '0.65rem' }}
                                />
                                <Chip
                                  label={`Syntax: ${email.syntaxValid ? 'Valid' : 'Invalid'}`}
                                  size="small"
                                  color={email.syntaxValid ? 'success' : 'error'}
                                  sx={{ height: 18, fontSize: '0.65rem' }}
                                />
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="warning">No email addresses found</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Addresses */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="primary" />
                      Addresses ({selectedDebtor.addresses.length})
                    </Typography>
                    <IconButton size="small" color="primary" onClick={() => handleAdd('address')}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {selectedDebtor.addresses.length > 0 ? (
                    <List dense>
                      {selectedDebtor.addresses.map((address, index) => (
                        <Box key={index}>
                          <ListItem
                            sx={{ pl: 0, alignItems: 'flex-start' }}
                            secondaryAction={
                              <Box sx={{ mt: 0.5 }}>
                                <Tooltip title="View on Google Maps">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.address)}`, '_blank')}
                                  >
                                    <MapIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <IconButton size="small" onClick={() => handleEdit('address', address, index)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete('address', index)} color="error">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                          >
                            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                              {address.verified ? (
                                <VerifiedIcon color="success" fontSize="small" />
                              ) : (
                                <WarningIcon color="warning" fontSize="small" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight={500}>
                                  {address.address}
                                </Typography>
                              }
                              secondary={
                                <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                                  <Chip label={address.type} size="small" sx={{ mr: 1 }} />
                                  <Typography variant="caption" color="text.secondary">
                                    Move-in: {address.moveInDate} • Updated: {address.lastUpdated}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        </Box>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="warning">No addresses found</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Employment */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="primary" />
                      Employment Information
                    </Typography>
                    <IconButton size="small" color="primary" onClick={() => selectedDebtor.employment ? handleEdit('employment', selectedDebtor.employment, 0) : handleAdd('employment')}>
                      {selectedDebtor.employment ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {selectedDebtor.employment ? (
                    <List dense>
                      <ListItem sx={{ pl: 0 }}>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={500}>Employer</Typography>}
                          secondary={selectedDebtor.employment.employer}
                        />
                      </ListItem>
                      <ListItem sx={{ pl: 0 }}>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={500}>Position</Typography>}
                          secondary={selectedDebtor.employment.position}
                        />
                      </ListItem>
                      <ListItem sx={{ pl: 0 }}>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={500}>Phone</Typography>}
                          secondary={selectedDebtor.employment.phone}
                        />
                      </ListItem>
                      <ListItem sx={{ pl: 0 }}>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={500}>Verified</Typography>}
                          secondary={
                            <Chip
                              label={selectedDebtor.employment.verified ? 'Yes' : 'No'}
                              color={selectedDebtor.employment.verified ? 'success' : 'warning'}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  ) : (
                    <Alert severity="warning">No employment information found</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Assets */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BankIcon color="primary" />
                      Asset Discovery ({selectedDebtor.assets.length})
                    </Typography>
                    <IconButton size="small" color="primary" onClick={() => handleAdd('asset')}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {selectedDebtor.assets.length > 0 ? (
                    <List dense>
                      {selectedDebtor.assets.map((asset, index) => (
                        <ListItem
                          key={index}
                          sx={{ pl: 0 }}
                          secondaryAction={
                            <Box>
                              <IconButton size="small" onClick={() => handleEdit('asset', asset, index)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete('asset', index)} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {asset.type === 'Vehicle' && <VehicleIcon color="action" />}
                            {asset.type === 'Property' && <LocationIcon color="action" />}
                            {asset.type === 'Bank Account' && <BankIcon color="action" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight={500}>
                                {asset.description}
                              </Typography>
                            }
                            secondary={
                              <Box component="span">
                                <Typography variant="caption" color="text.secondary">
                                  Est. Value: ₹{asset.value?.toLocaleString('en-IN') || 'N/A'} •{' '}
                                  {asset.verified ? 'Verified' : 'Unverified'}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="warning">No assets discovered</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Social Media */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FacebookIcon color="primary" />
                      Social Media ({selectedDebtor.socialMedia.length})
                    </Typography>
                    <IconButton size="small" color="primary" onClick={() => handleAdd('social')}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {selectedDebtor.socialMedia.length > 0 ? (
                    <List dense>
                      {selectedDebtor.socialMedia.map((social, index) => (
                        <ListItem
                          key={index}
                          sx={{ pl: 0 }}
                          secondaryAction={
                            <Box>
                              <IconButton size="small" onClick={() => handleEdit('social', social, index)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete('social', index)} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          }
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {social.platform === 'LinkedIn' && <LinkedInIcon color="primary" />}
                            {social.platform === 'Facebook' && <FacebookIcon color="primary" />}
                            {social.platform === 'Twitter' && <TwitterIcon color="primary" />}
                            {social.platform === 'Instagram' && <InstagramIcon color="primary" />}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Link href={`https://${social.url}`} target="_blank" rel="noopener">
                                {social.platform}
                              </Link>
                            }
                            secondary={social.verified ? 'Verified' : 'Unverified'}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="warning">No social media profiles found</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Legal Status */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LegalIcon color="primary" />
                    Legal Status
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Alert severity={selectedDebtor.legalStatus.bankruptcy ? 'error' : 'success'} icon={false}>
                        <Typography variant="body2" fontWeight={600}>
                          Bankruptcy: {selectedDebtor.legalStatus.bankruptcy ? 'Yes' : 'No'}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <Alert severity={selectedDebtor.legalStatus.liens ? 'warning' : 'success'} icon={false}>
                        <Typography variant="body2" fontWeight={600}>
                          Liens: {selectedDebtor.legalStatus.liens ? 'Yes' : 'No'}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <Alert severity={selectedDebtor.legalStatus.judgments ? 'warning' : 'success'} icon={false}>
                        <Typography variant="body2" fontWeight={600}>
                          Judgments: {selectedDebtor.legalStatus.judgments ? 'Yes' : 'No'}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <Alert severity={selectedDebtor.legalStatus.deceased ? 'error' : 'success'} icon={false}>
                        <Typography variant="body2" fontWeight={600}>
                          Deceased: {selectedDebtor.legalStatus.deceased ? 'Yes' : 'No'}
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity History */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HistoryIcon color="primary" />
                    Activity History ({selectedDebtor.activityLog?.length || 0} activities)
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {selectedDebtor.activityLog && selectedDebtor.activityLog.length > 0 ? (
                    <List dense>
                      {selectedDebtor.activityLog.map((activity, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            pl: 0,
                            borderLeft: '3px solid',
                            borderColor: 'primary.main',
                            ml: 2,
                            mb: 1.5,
                            bgcolor: alpha(theme.palette.primary.main, 0.02)
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                            <HistoryIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box>
                                <Typography variant="body2" fontWeight={600} color="primary">
                                  {activity.action}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.date} at {activity.time} • By {activity.user}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {activity.details}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info">No activity history available</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        {!selectedDebtor?.physicalVisit && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<VisitIcon />}
            onClick={handleOpenScheduleVisit}
          >
            Schedule Visit
          </Button>
        )}
        <Button variant="contained" startIcon={<DownloadIcon />}>
          Export Report
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditDialog = () => {
    if (!editData) return null;

    const getFieldLabel = () => {
      switch(editType) {
        case 'phone': return addMode ? 'Add Phone Number' : 'Edit Phone Number';
        case 'email': return addMode ? 'Add Email Address' : 'Edit Email Address';
        case 'address': return addMode ? 'Add Address' : 'Edit Address';
        case 'employment': return addMode ? 'Add Employment' : 'Edit Employment';
        case 'asset': return addMode ? 'Add Asset' : 'Edit Asset';
        case 'social': return addMode ? 'Add Social Media' : 'Edit Social Media';
        default: return 'Edit Data';
      }
    };

    return (
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{getFieldLabel()}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {editType === 'phone' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={editData.number || ''}
                    onChange={(e) => setEditData({...editData, number: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Type"
                    value={editData.type || 'Mobile'}
                    onChange={(e) => setEditData({...editData, type: e.target.value})}
                    SelectProps={{ native: true }}
                  >
                    <option value="Mobile">Mobile</option>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Verified"
                    value={editData.verified ? 'true' : 'false'}
                    onChange={(e) => setEditData({...editData, verified: e.target.value === 'true'})}
                    SelectProps={{ native: true }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Last Updated"
                    value={editData.lastUpdated || ''}
                    onChange={(e) => setEditData({...editData, lastUpdated: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            {editType === 'email' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={editData.address || ''}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    placeholder="example@email.com"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Type"
                    value={editData.type || 'Personal'}
                    onChange={(e) => setEditData({...editData, type: e.target.value})}
                    SelectProps={{ native: true }}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Verified"
                    value={editData.verified ? 'true' : 'false'}
                    onChange={(e) => setEditData({...editData, verified: e.target.value === 'true'})}
                    SelectProps={{ native: true }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Last Updated"
                    value={editData.lastUpdated || ''}
                    onChange={(e) => setEditData({...editData, lastUpdated: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            {editType === 'address' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={editData.address || ''}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    placeholder="123, Street Name, City, State - Pincode"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Type"
                    value={editData.type || 'Current'}
                    onChange={(e) => setEditData({...editData, type: e.target.value})}
                    SelectProps={{ native: true }}
                  >
                    <option value="Current">Current</option>
                    <option value="Previous">Previous</option>
                    <option value="Last Known">Last Known</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Verified"
                    value={editData.verified ? 'true' : 'false'}
                    onChange={(e) => setEditData({...editData, verified: e.target.value === 'true'})}
                    SelectProps={{ native: true }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Move-in Date"
                    value={editData.moveInDate || ''}
                    onChange={(e) => setEditData({...editData, moveInDate: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Last Updated"
                    value={editData.lastUpdated || ''}
                    onChange={(e) => setEditData({...editData, lastUpdated: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            {editType === 'employment' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Employer Name"
                    value={editData.employer || ''}
                    onChange={(e) => setEditData({...editData, employer: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={editData.position || ''}
                    onChange={(e) => setEditData({...editData, position: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Verified"
                    value={editData.verified ? 'true' : 'false'}
                    onChange={(e) => setEditData({...editData, verified: e.target.value === 'true'})}
                    SelectProps={{ native: true }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Last Updated"
                    value={editData.lastUpdated || ''}
                    onChange={(e) => setEditData({...editData, lastUpdated: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}

            {editType === 'asset' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Asset Type"
                    value={editData.type || 'Vehicle'}
                    onChange={(e) => setEditData({...editData, type: e.target.value})}
                    SelectProps={{ native: true }}
                  >
                    <option value="Vehicle">Vehicle</option>
                    <option value="Property">Property</option>
                    <option value="Bank Account">Bank Account</option>
                    <option value="Investment">Investment</option>
                    <option value="Other">Other</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Verified"
                    value={editData.verified ? 'true' : 'false'}
                    onChange={(e) => setEditData({...editData, verified: e.target.value === 'true'})}
                    SelectProps={{ native: true }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={editData.description || ''}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    placeholder="Honda City 2020"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Estimated Value (₹)"
                    type="number"
                    value={editData.value || 0}
                    onChange={(e) => setEditData({...editData, value: Number(e.target.value)})}
                  />
                </Grid>
              </Grid>
            )}

            {editType === 'social' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Platform"
                    value={editData.platform || 'LinkedIn'}
                    onChange={(e) => setEditData({...editData, platform: e.target.value})}
                    SelectProps={{ native: true }}
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Other">Other</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Profile URL"
                    value={editData.url || ''}
                    onChange={(e) => setEditData({...editData, url: e.target.value})}
                    placeholder="linkedin.com/in/username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Verified"
                    value={editData.verified ? 'true' : 'false'}
                    onChange={(e) => setEditData({...editData, verified: e.target.value === 'true'})}
                    SelectProps={{ native: true }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </TextField>
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} startIcon={<CloseIcon />}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" startIcon={<SaveIcon />}>
            {addMode ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderActivityLogsDialog = () => (
    <Dialog
      open={activityLogsDialog}
      onClose={() => setActivityLogsDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.secondary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon />
            Activity Logs: {selectedDebtorForLogs?.debtorName}
          </Typography>
          <Chip
            label={`${selectedDebtorForLogs?.activityLog?.length || 0} Activities`}
            sx={{ bgcolor: 'white', color: theme.palette.secondary.main, fontWeight: 600 }}
          />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedDebtorForLogs && selectedDebtorForLogs.activityLog && selectedDebtorForLogs.activityLog.length > 0 ? (
          <List dense>
            {selectedDebtorForLogs.activityLog.map((activity, index) => (
              <ListItem
                key={index}
                sx={{
                  pl: 0,
                  borderLeft: '3px solid',
                  borderColor: 'secondary.main',
                  ml: 2,
                  mb: 1.5,
                  bgcolor: alpha(theme.palette.secondary.main, 0.02),
                  borderRadius: 1
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, ml: 1 }}>
                  <HistoryIcon color="secondary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="secondary">
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.date} at {activity.time} • By {activity.user}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {activity.details}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">No activity history available for this skip trace record</Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setActivityLogsDialog(false)}>Close</Button>
        <Button variant="contained" color="secondary" startIcon={<DownloadIcon />}>
          Export Logs
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPhysicalVisitDialog = () => (
    <Dialog
      open={physicalVisitDialog}
      onClose={() => setPhysicalVisitDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisitIcon />
            Physical Visit Details: {selectedDebtor?.debtorName}
          </Typography>
          {selectedVisit && (
            <Chip
              label={selectedVisit.status}
              color={
                selectedVisit.status === 'Completed' ? 'success' :
                selectedVisit.status === 'In Progress' ? 'primary' :
                'default'
              }
              sx={{ bgcolor: 'white', color: theme.palette.primary.main, fontWeight: 600 }}
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedVisit ? (
          <Grid container spacing={3}>
            {/* Vendor Information */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <VendorIcon color="primary" />
                    Vendor Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Vendor Name</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedVisit.vendor}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">Assigned By</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedVisit.assignedBy}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">Assigned Date</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedVisit.assignedDate}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">Visit Date</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedVisit.visitDate}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">Completed Date</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedVisit.completedDate || 'Pending'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Visit Notes */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Visit Notes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedVisit.notes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Uploaded Images */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ImageIcon color="primary" />
                      Visit Images ({selectedVisit.images?.length || 0})
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<UploadIcon />}
                      component="label"
                    >
                      Upload Image
                      <input type="file" hidden accept="image/*" multiple />
                    </Button>
                  </Box>
                  {selectedVisit.images && selectedVisit.images.length > 0 ? (
                    <Grid container spacing={2}>
                      {selectedVisit.images.map((image, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <ImageIcon color="primary" fontSize="small" />
                                <Typography variant="body2" fontWeight={500}>{image.name}</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Uploaded: {image.uploadedAt}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Button size="small" variant="text" startIcon={<ViewIcon />}>
                                  View
                                </Button>
                                <Button size="small" variant="text" startIcon={<DownloadIcon />}>
                                  Download
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Alert severity="info">No images uploaded yet</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Last Updated */}
            <Grid item xs={12}>
              <Alert severity="info" icon={<CalendarIcon />}>
                <Typography variant="caption">
                  Last Updated: {selectedVisit.lastUpdated}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <VisitIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Physical Visit Scheduled
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Schedule a physical visit to verify the debtor's location
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenScheduleVisit}>
              Schedule Physical Visit
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setPhysicalVisitDialog(false)}>Close</Button>
        {selectedVisit && (
          <Button variant="contained" startIcon={<EditIcon />}>
            Update Visit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const renderScheduleVisitDialog = () => (
    <Dialog
      open={scheduleVisitDialog}
      onClose={() => setScheduleVisitDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon />
          Schedule Physical Visit
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Debtor: <strong>{selectedDebtor?.debtorName}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Account: <strong>{selectedDebtor?.accountNumber}</strong>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              required
              label="Select Vendor"
              value={visitFormData.vendor}
              onChange={(e) => setVisitFormData({ ...visitFormData, vendor: e.target.value })}
              SelectProps={{ native: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VendorIcon />
                  </InputAdornment>
                ),
              }}
            >
              <option value="">-- Select Vendor --</option>
              {availableVendors.map((vendor, index) => (
                <option key={index} value={vendor}>{vendor}</option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              type="date"
              label="Visit Date"
              value={visitFormData.visitDate}
              onChange={(e) => setVisitFormData({ ...visitFormData, visitDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Visit Notes / Instructions"
              value={visitFormData.notes}
              onChange={(e) => setVisitFormData({ ...visitFormData, notes: e.target.value })}
              placeholder="Enter any special instructions or notes for the vendor..."
            />
          </Grid>

          <Grid item xs={12}>
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="caption">
                The vendor will be notified via email and SMS about the scheduled visit. They will receive the debtor's address details and visit instructions.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setScheduleVisitDialog(false)} startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleScheduleVisit}
          startIcon={<SaveIcon />}
          disabled={!visitFormData.vendor || !visitFormData.visitDate}
        >
          Schedule Visit
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Skip Tracing & Debtor Locator
      </Typography>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          <strong>Skip Tracing:</strong> Locate debtors with updated contact information, employment verification, asset discovery, and legal status checks.
          All searches comply with data privacy regulations and Fair Debt Collection Practices.
        </Typography>
      </Alert>

      {renderSearchPanel()}
      {renderResultsTable()}
      {renderDetailsDialog()}
      {renderEditDialog()}
      {renderActivityLogsDialog()}
      {renderPhysicalVisitDialog()}
      {renderScheduleVisitDialog()}
    </Box>
  );
};

export default SkipTracing;
