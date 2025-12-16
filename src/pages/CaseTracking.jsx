import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Chip, IconButton,
  Menu, MenuItem, Tooltip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Divider, Alert,
  ListItemIcon, ListItemText, Card, CardContent, Grow, Zoom, Fade, alpha,
  FormControlLabel, Checkbox, Toolbar, Snackbar, Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  FileDownload as FileDownloadIcon,
  TableView as TableViewIcon,
  InsertDriveFile as InsertDriveFileIcon,
  History as HistoryIcon,
  PriorityHigh as PriorityHighIcon,
  Refresh as RefreshIcon,
  AssignmentInd as AssignmentIndIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Call as CallIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Comment as CommentIcon,
  EditNote as EditNoteIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CloudUpload as CloudUploadIcon,
  PushPin as PushPinIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { bulkUpdateCaseStatus, bulkAssignCases, checkDNCStatus, requestDNCOverride } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import BulkUpload from '../components/common/BulkUpload';
import FailedRecordsViewer from '../components/common/FailedRecordsViewer';
import { useDedupe } from '../context/DedupeContext';

const CaseTracking = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [loaded, setLoaded] = useState(false);

  // Function to handle customer name click
  const handleCustomerNameClick = (e, customerName, customerId) => {
    e.stopPropagation(); // Prevent row click event
    navigate(`/policy-timeline?customerName=${encodeURIComponent(customerName)}&customerId=${encodeURIComponent(customerId || 'CUST-' + Math.floor(Math.random() * 10000))}`);
  };

  const mockCases = useMemo(() => [
    {
      id: 'CASE-001',
      customerName: 'Arjun Sharma',
      policyNumber: 'POL-12345',
      status: 'Assigned',
      subStatus: 'Document Pending',
      policyStatus: 'Pre Due Stage',
      agent: 'Priya Patel',
      uploadDate: '2025-04-08',
      isPriority: false,
      batchId: 'BATCH-2025-04-08-A',
      nextFollowUpDate: '2025-04-12',
      nextActionPlan: 'Contact customer for missing documents',
      currentWorkStep: 'Document Collection',
      // New fields
      customerProfile: 'Normal',
      customerMobile: '9876543210',
      preferredLanguage: 'Hindi',
      assignedAgent: 'Priya Patel',
      productName: 'Vehicle Insurance',
      productCategory: 'Motor',
      channel: 'Online',
      subChannel: 'Website',
      currentCommunicationChannel: 'email',
      lastActionDate: '2025-04-08',
      totalCalls: 3,
      comments: [
        {
          id: 'comment-1',
          text: 'Customer contacted, waiting for documents',
          user: 'Priya Patel',
          timestamp: '2025-04-08T10:30:00Z',
          status: 'Assigned',
          subStatus: 'Document Pending'
        }
      ],
      contactInfo: {
        email: 'arjun.sharma@gmail.com',
        phone: '9876543210'
      },
      policyDetails: {
        type: 'Vehicle',
        expiryDate: '2025-05-15',
        premium: 1250.00,
        renewalDate: '2025-05-15'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
    },
    {
      id: 'CASE-002',
      customerName: 'Meera Kapoor',
      policyNumber: 'POL-23456',
      status: 'Renewed',
      subStatus: 'Ready for Renewal',
      policyStatus: 'Policy Due',
      agent: 'Rajesh Kumar',
      uploadDate: '2025-04-07',
      isPriority: true,
      batchId: 'BATCH-2025-04-07-B',
      nextFollowUpDate: '2025-05-07',
      nextActionPlan: 'Send renewal confirmation',
      currentWorkStep: 'Final Review',
      // New fields
      customerProfile: 'HNI',
      customerMobile: '9876543211',
      preferredLanguage: 'English',
      assignedAgent: 'Rajesh Kumar',
      productName: 'Home Insurance Premium',
      productCategory: 'Property',
      channel: 'Branch',
      subChannel: 'Relationship Manager',
      currentCommunicationChannel: 'whatsapp',
      lastActionDate: '2025-04-07',
      totalCalls: 5,
      comments: [
        {
          id: 'comment-2',
          text: 'Policy successfully renewed',
          user: 'Rajesh Kumar',
          timestamp: '2025-04-07T14:20:00Z',
          status: 'Renewed',
          subStatus: 'Ready for Renewal'
        }
      ],
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
      id: 'CASE-003',
      customerName: 'Vikram Singh',
      policyNumber: 'POL-34567',
      status: 'Failed',
      subStatus: 'Customer Contact Required',
      policyStatus: 'Reinstatement',
      agent: 'Ananya Reddy',
      uploadDate: '2025-04-06',
      isPriority: false,
      batchId: 'BATCH-2025-04-06-A',
      nextFollowUpDate: '2025-04-10',
      nextActionPlan: 'Attempt reinstatement process',
      currentWorkStep: 'Initial Contact',
      // New fields
      customerProfile: 'Normal',
      customerMobile: '9876543212',
      preferredLanguage: 'Punjabi',
      assignedAgent: 'Ananya Reddy',
      productName: 'Term Life Insurance',
      productCategory: 'Life',
      channel: 'Telecalling',
      subChannel: 'Outbound',
      currentCommunicationChannel: 'call',
      lastActionDate: '2025-04-06',
      totalCalls: 8,
      comments: [
        {
          id: 'comment-3',
          text: 'Customer unreachable, need to try alternative contact',
          user: 'Ananya Reddy',
          timestamp: '2025-04-06T16:45:00Z',
          status: 'Failed',
          subStatus: 'Customer Contact Required'
        }
      ],
      contactInfo: {
        email: 'vikram.singh@gmail.com',
        phone: '9876543212'
      },
      policyDetails: {
        type: 'Life',
        expiryDate: '2025-05-05',
        premium: 2100.00,
        renewalDate: '2025-05-05'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress', 'Failed']
    },
    {
      id: 'CASE-004',
      customerName: 'Priyanka Gupta',
      policyNumber: 'POL-45678',
      status: 'In Progress',
      subStatus: 'Payment Processing',
      policyStatus: 'Policy Due',
      agent: 'Amit Shah',
      uploadDate: '2025-04-05',
      isPriority: false,
      batchId: 'BATCH-2025-04-05-C',
      nextFollowUpDate: '2025-04-09',
      nextActionPlan: 'Verify payment status and proceed',
      currentWorkStep: 'Payment Processing',
      // New fields
      customerProfile: 'HNI',
      customerMobile: '9876543213',
      preferredLanguage: 'English',
      assignedAgent: 'Amit Shah',
      productName: 'Comprehensive Auto Insurance',
      productCategory: 'Motor',
      channel: 'Online',
      subChannel: 'Mobile App',
      currentCommunicationChannel: 'sms',
      lastActionDate: '2025-04-05',
      totalCalls: 2,
      comments: [
        {
          id: 'comment-4',
          text: 'Payment initiated by customer, waiting for confirmation',
          user: 'Amit Shah',
          timestamp: '2025-04-05T11:15:00Z',
          status: 'In Progress',
          subStatus: 'Payment Processing'
        }
      ],
      contactInfo: {
        email: 'priyanka.gupta@gmail.com',
        phone: '9876543213'
      },
      policyDetails: {
        type: 'Auto',
        expiryDate: '2025-05-20',
        premium: 1450.00,
        renewalDate: '2025-05-20'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
    },
    {
      id: 'CASE-005',
      customerName: 'Rahul Verma',
      policyNumber: 'POL-56789',
      status: 'Uploaded',
      subStatus: 'Under Review',
      policyStatus: 'Pre Due Stage',
      agent: 'Unassigned',
      uploadDate: '2025-04-10',
      isPriority: false,
      batchId: 'BATCH-2025-04-10-A',
      nextFollowUpDate: '2025-04-11',
      nextActionPlan: 'Assign to agent and begin processing',
      currentWorkStep: 'Initial Contact',
      // New fields
      customerProfile: 'Normal',
      customerMobile: '9876543214',
      preferredLanguage: 'Hindi',
      assignedAgent: 'Unassigned',
      productName: 'Home Shield Insurance',
      productCategory: 'Property',
      channel: 'Partner',
      subChannel: 'Bank Channel',
      lastActionDate: '2025-04-10',
      totalCalls: 0,
      comments: [],
      contactInfo: {
        email: 'rahul.verma@gmail.com',
        phone: '9876543214'
      },
      policyDetails: {
        type: 'Home',
        expiryDate: '2025-06-01',
        premium: 1050.00,
        renewalDate: '2025-06-01'
      },
      flowSteps: ['Uploaded']
    },
    {
      id: 'CASE-006',
      customerName: 'Sanjay Gupta',
      policyNumber: 'POL-67890',
      status: 'In Progress',
      subStatus: 'Payment Processing',
      policyStatus: 'Policy Due',
      agent: 'Ananya Reddy',
      uploadDate: '2025-04-09',
      isPriority: true,
      batchId: 'BATCH-2025-04-09-C',
      nextFollowUpDate: '2025-04-13',
      nextActionPlan: 'Confirm payment and process renewal',
      currentWorkStep: 'Payment Processing',
      customerProfile: 'Normal',
      customerMobile: '9876543215',
      preferredLanguage: 'English',
      assignedAgent: 'Ananya Reddy',
      productName: 'Life Insurance Plus',
      productCategory: 'Life',
      channel: 'Call Center',
      subChannel: 'Inbound',
      lastActionDate: '2025-04-09',
      totalCalls: 2,
      comments: [
        {
          id: 'comment-6',
          text: 'Customer confirmed payment details, processing renewal',
          user: 'Ananya Reddy',
          timestamp: '2025-04-09T11:15:00Z',
          status: 'In Progress',
          subStatus: 'Payment Processing'
        }
      ],
      contactInfo: {
        email: 'sanjay.gupta@yahoo.com',
        phone: '9876543215'
      },
      policyDetails: {
        type: 'Life',
        expiryDate: '2025-05-20',
        premium: 2500.00,
        renewalDate: '2025-05-20'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
    },
    {
      id: 'CASE-007',
      customerName: 'Kavitha Nair',
      policyNumber: 'POL-78901',
      status: 'Pending',
      subStatus: 'Customer Contact Required',
      policyStatus: 'Pre Due Stage',
      agent: 'Amit Shah',
      uploadDate: '2025-04-11',
      isPriority: false,
      batchId: 'BATCH-2025-04-11-A',
      nextFollowUpDate: '2025-04-14',
      nextActionPlan: 'Attempt customer contact via phone and email',
      currentWorkStep: 'Initial Contact',
      customerProfile: 'HNI',
      customerMobile: '9876543216',
      preferredLanguage: 'Malayalam',
      assignedAgent: 'Amit Shah',
      productName: 'Health Insurance Family',
      productCategory: 'Health',
      channel: 'Online',
      subChannel: 'Mobile App',
      lastActionDate: '2025-04-11',
      totalCalls: 1,
      comments: [
        {
          id: 'comment-7',
          text: 'Unable to reach customer, will try again tomorrow',
          user: 'Amit Shah',
          timestamp: '2025-04-11T16:45:00Z',
          status: 'Pending',
          subStatus: 'Customer Contact Required'
        }
      ],
      contactInfo: {
        email: 'kavitha.nair@gmail.com',
        phone: '9876543216'
      },
      policyDetails: {
        type: 'Health',
        expiryDate: '2025-06-15',
        premium: 1800.00,
        renewalDate: '2025-06-15'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned']
    },
    {
      id: 'CASE-008',
      customerName: 'Vikram Singh',
      policyNumber: 'POL-89012',
      status: 'Failed',
      subStatus: 'Verification in Progress',
      policyStatus: 'Reinstatement',
      agent: 'Sarah Johnson',
      uploadDate: '2025-04-06',
      isPriority: true,
      batchId: 'BATCH-2025-04-06-B',
      nextFollowUpDate: '2025-04-15',
      nextActionPlan: 'Review failed verification and contact customer',
      currentWorkStep: 'Verification',
      customerProfile: 'Normal',
      customerMobile: '9876543217',
      preferredLanguage: 'Punjabi',
      assignedAgent: 'Sarah Johnson',
      productName: 'Travel Insurance Pro',
      productCategory: 'Travel',
      channel: 'Partner',
      subChannel: 'Travel Agent',
      lastActionDate: '2025-04-06',
      totalCalls: 4,
      comments: [
        {
          id: 'comment-8',
          text: 'Document verification failed, need additional documents',
          user: 'Sarah Johnson',
          timestamp: '2025-04-06T13:30:00Z',
          status: 'Failed',
          subStatus: 'Verification in Progress'
        }
      ],
      contactInfo: {
        email: 'vikram.singh@outlook.com',
        phone: '9876543217'
      },
      policyDetails: {
        type: 'Travel',
        expiryDate: '2025-04-30',
        premium: 750.00,
        renewalDate: '2025-04-30'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'Failed']
    },
    {
      id: 'CASE-009',
      customerName: 'Deepika Reddy',
      policyNumber: 'POL-90123',
      status: 'Assigned',
      subStatus: 'Follow-up Required',
      policyStatus: 'Policy Due',
      agent: 'Mike Chen',
      uploadDate: '2025-04-12',
      isPriority: false,
      batchId: 'BATCH-2025-04-12-A',
      nextFollowUpDate: '2025-04-16',
      nextActionPlan: 'Follow up on premium payment status',
      currentWorkStep: 'Premium Calculation',
      customerProfile: 'Normal',
      customerMobile: '9876543218',
      preferredLanguage: 'Telugu',
      assignedAgent: 'Mike Chen',
      productName: 'Motor Insurance Comprehensive',
      productCategory: 'Motor',
      channel: 'Branch',
      subChannel: 'Walk-in',
      lastActionDate: '2025-04-12',
      totalCalls: 1,
      comments: [
        {
          id: 'comment-9',
          text: 'Customer inquired about premium calculation',
          user: 'Mike Chen',
          timestamp: '2025-04-12T09:20:00Z',
          status: 'Assigned',
          subStatus: 'Follow-up Required'
        }
      ],
      contactInfo: {
        email: 'deepika.reddy@gmail.com',
        phone: '9876543218'
      },
      policyDetails: {
        type: 'Motor',
        expiryDate: '2025-05-25',
        premium: 1650.00,
        renewalDate: '2025-05-25'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned']
    },
    {
      id: 'CASE-010',
      customerName: 'Ravi Krishnan',
      policyNumber: 'POL-01234',
      status: 'Uploaded',
      subStatus: 'Under Review',
      policyStatus: 'Pre Due Stage',
      agent: 'Emma Davis',
      uploadDate: '2025-04-13',
      isPriority: false,
      batchId: 'BATCH-2025-04-13-B',
      nextFollowUpDate: '2025-04-17',
      nextActionPlan: 'Complete initial review and assign agent',
      currentWorkStep: 'Initial Contact',
      customerProfile: 'HNI',
      customerMobile: '9876543219',
      preferredLanguage: 'Tamil',
      assignedAgent: 'Emma Davis',
      productName: 'Property Insurance Elite',
      productCategory: 'Property',
      channel: 'Online',
      subChannel: 'Website',
      lastActionDate: '2025-04-13',
      totalCalls: 0,
      comments: [],
      contactInfo: {
        email: 'ravi.krishnan@hotmail.com',
        phone: '9876543219'
      },
      policyDetails: {
        type: 'Property',
        expiryDate: '2025-07-10',
        premium: 3200.00,
        renewalDate: '2025-07-10'
      },
      flowSteps: ['Uploaded']
    },
    {
      id: 'CASE-011',
      customerName: 'Pooja Sharma',
      policyNumber: 'POL-11223',
      status: 'In Progress',
      subStatus: 'Approval Required',
      policyStatus: 'Policy Due',
      agent: 'Alex Rodriguez',
      uploadDate: '2025-04-05',
      isPriority: true,
      batchId: 'BATCH-2025-04-05-C',
      nextFollowUpDate: '2025-04-18',
      nextActionPlan: 'Get management approval for special terms',
      currentWorkStep: 'Final Review',
      customerProfile: 'HNI',
      customerMobile: '9876543220',
      preferredLanguage: 'Hindi',
      assignedAgent: 'Alex Rodriguez',
      productName: 'Business Insurance Premium',
      productCategory: 'Commercial',
      channel: 'Partner',
      subChannel: 'Corporate Broker',
      currentCommunicationChannel: 'bot-calling',
      lastActionDate: '2025-04-05',
      totalCalls: 6,
      comments: [
        {
          id: 'comment-11',
          text: 'Special terms negotiated, awaiting management approval',
          user: 'Alex Rodriguez',
          timestamp: '2025-04-05T15:10:00Z',
          status: 'In Progress',
          subStatus: 'Approval Required'
        }
      ],
      contactInfo: {
        email: 'pooja.sharma@businessmail.com',
        phone: '9876543220'
      },
      policyDetails: {
        type: 'Commercial',
        expiryDate: '2025-05-05',
        premium: 5500.00,
        renewalDate: '2025-05-05'
      },
      flowSteps: ['Uploaded', 'Validated', 'Assigned', 'In Progress']
    },
  ], []);

  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [policyStatusFilter, setPolicyStatusFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentFormData, setCommentFormData] = useState({
    status: '',
    subStatus: '',
    nextFollowUpDate: '',
    updateStatus: false,
    updateFollowUp: false
  });
  const [quickEditDialogOpen, setQuickEditDialogOpen] = useState(false);
  const [quickEditData, setQuickEditData] = useState({
    status: '',
    subStatus: '',
    nextFollowUpDate: '',
    nextActionPlan: '',
    currentWorkStep: '',
    commentText: ''
  });
  const [quickMessageDialog, setQuickMessageDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [messageType, setMessageType] = useState('whatsapp');
  const [quickMessage, setQuickMessage] = useState('');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallCase, setSelectedCallCase] = useState(null);

  // Bulk upload and dedupe states
  const { checkDuplicate } = useDedupe();
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [showUploadHistory, setShowUploadHistory] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // DNC states
  const [dncOverrideDialog, setDNCOverrideDialog] = useState(false);
  const [dncCheckResult, setDNCCheckResult] = useState(null);
  const [overrideReason, setOverrideReason] = useState('');

  // Bulk operations states
  const [selectedCases, setSelectedCases] = useState([]);
  const [bulkActionsVisible, setBulkActionsVisible] = useState(false);
  const [bulkStatusDialog, setBulkStatusDialog] = useState(false);
  const [bulkAssignDialog, setBulkAssignDialog] = useState(false);
  const [bulkPolicyStatusDialog, setBulkPolicyStatusDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkAgent, setBulkAgent] = useState('');
  const [bulkPolicyStatus, setBulkPolicyStatus] = useState('');

  // Pin to top states
  const [pinnedCases, setPinnedCases] = useState(() => {
    const saved = localStorage.getItem('pinnedCases');
    return saved ? JSON.parse(saved) : [];
  });

  // Available agents for assignment
  const availableAgents = [
    'Priya Patel',
    'Rajesh Kumar',
    'Ananya Reddy',
    'Amit Shah',
    'Sarah Johnson',
    'Mike Chen',
    'Emma Davis',
    'Alex Rodriguez',
    'Lisa Wang'
  ];

  // Available statuses for bulk change
  const availableStatuses = [
    'Uploaded',
    'Assigned',
    'In Progress',
    'Pending',
    'Failed',
    'Renewal Failed',
    'Renewed',
    'Not Interested',
    'DNC Email',
    'DNC WhatsApp',
    'DNC SMS',
    'DNC Call',
    'DNC Bot Calling',
    'Payment Failed',
    'Customer Postponed'
  ];

  // Available policy statuses
  const availablePolicyStatuses = [
    'Pre Due Stage',
    'Policy Due',
    'Reinstatement'
  ];

  // Available sub-statuses
  const availableSubStatuses = [
    'Document Pending',
    'Customer Contact Required',
    'Payment Processing',
    'Verification in Progress',
    'Approval Required',
    'Ready for Renewal',
    'Follow-up Required',
    'Under Review'
  ];

  // Available work steps
  const availableWorkSteps = [
    'Initial Contact',
    'Document Collection',
    'Verification',
    'Premium Calculation',
    'Payment Processing',
    'Policy Generation',
    'Final Review',
    'Delivery'
  ];

  // Mock data for demonstration
  useEffect(() => {
    // Initialize cases excluding: Renewed, Not Interested, and Renewal Failed cases
    const initialCases = mockCases.filter(caseItem =>
      caseItem.status !== 'Renewed' &&
      caseItem.status !== 'Not Interested' &&
      caseItem.status !== 'Renewal Failed'
    );
    setCases(initialCases);
  }, [mockCases]);

  // Add loaded state for animations similar to Settings page
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  // Update bulk actions visibility when selection changes
  useEffect(() => {
    setBulkActionsVisible(selectedCases.length > 0);
  }, [selectedCases]);

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
    applyAllFilters(searchValue, statusFilter, dateFilter, agentFilter, policyStatusFilter);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);

    // Apply all filters when the filter menu is closed
    applyAllFilters(searchTerm, statusFilter, dateFilter, agentFilter, policyStatusFilter);
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const exportData = (format) => {
    // Convert cases data to the selected format
    const data = cases.map(caseItem => ({
      'Case ID': caseItem.id,
      'Customer Name': caseItem.customerName,
      'Customer Profile': caseItem.customerProfile,
      'Customer Mobile': caseItem.customerMobile,
      'Preferred Language': caseItem.preferredLanguage,
      'Policy Number': caseItem.policyNumber,
      'Product Name': caseItem.productName,
      'Product Category': caseItem.productCategory,
      'Channel': caseItem.channel,
      'Sub Channel': caseItem.subChannel,
      'Batch ID': caseItem.batchId,
      'Status': caseItem.status,
      'Sub-Status': caseItem.subStatus,
      'Policy Status': caseItem.policyStatus,
      'Assigned Agent': caseItem.assignedAgent,
      'Priority': caseItem.isPriority ? 'Priority' : 'Normal',
      'Last Action Date': new Date(caseItem.lastActionDate).toLocaleDateString(),
      'Total Calls': caseItem.totalCalls,
      'Current Work Step': caseItem.currentWorkStep,
      'Renewal Date': new Date(caseItem.policyDetails.renewalDate).toLocaleDateString(),
      'Next Follow-up Date': new Date(caseItem.nextFollowUpDate).toLocaleDateString(),
      'Next Action Plan': caseItem.nextActionPlan,
      'Comments Count': caseItem.comments?.length || 0,
      'Upload Date': new Date(caseItem.uploadDate).toLocaleDateString()
    }));

    let content = '';
    if (format === 'csv') {
      // Create CSV content
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(','));
      content = `${headers}\n${rows.join('\n')}`;
    } else {
      // Create XLS (tab-separated) content
      const headers = Object.keys(data[0]).join('\t');
      const rows = data.map(row => Object.values(row).join('\t'));
      content = `${headers}\n${rows.join('\n')}`;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case_tracking.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    setSuccessMessage(`Successfully exported data in ${format.toUpperCase()} format`);
    setTimeout(() => setSuccessMessage(''), 3000);
    handleExportClose();
  };

  const handleStatusFilterChange = (event) => {
    const newStatusFilter = event.target.value;
    setStatusFilter(newStatusFilter);

    // Apply all filters
    applyAllFilters(searchTerm, newStatusFilter, dateFilter, agentFilter, policyStatusFilter);
  };

  const handleDateFilterChange = (event) => {
    const newDateFilter = event.target.value;
    setDateFilter(newDateFilter);

    // Apply all filters
    applyAllFilters(searchTerm, statusFilter, newDateFilter, agentFilter, policyStatusFilter);
  };

  const handleAgentFilterChange = (event) => {
    const newAgentFilter = event.target.value;
    setAgentFilter(newAgentFilter);

    // Apply all filters
    applyAllFilters(searchTerm, statusFilter, dateFilter, newAgentFilter, policyStatusFilter);
  };

  const handlePolicyStatusFilterChange = (event) => {
    const newPolicyStatusFilter = event.target.value;
    setPolicyStatusFilter(newPolicyStatusFilter);

    // Apply all filters
    applyAllFilters(searchTerm, statusFilter, dateFilter, agentFilter, newPolicyStatusFilter);
  };

  // Helper function to apply all filters
  const applyAllFilters = (search, status, date, agent, policyStatus) => {
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

      // Filter by status
      const matchesStatus = status === 'all' ||
        caseItem.status.toLowerCase() === status.toLowerCase() ||
        // Handle specific status mappings
        (status === 'inProgress' && caseItem.status.toLowerCase() === 'in progress') ||
        (status === 'processed' && caseItem.status.toLowerCase() === 'payment processed') ||
        (status === 'renewalFailed' && caseItem.status.toLowerCase() === 'renewal failed') ||
        (status === 'notInterested' && caseItem.status.toLowerCase() === 'not interested') ||
        (status === 'dncEmail' && caseItem.status.toLowerCase() === 'dnc email') ||
        (status === 'dncWhatsApp' && caseItem.status.toLowerCase() === 'dnc whatsapp') ||
        (status === 'dncSms' && caseItem.status.toLowerCase() === 'dnc sms') ||
        (status === 'dncCall' && caseItem.status.toLowerCase() === 'dnc call') ||
        (status === 'dncBotCalling' && caseItem.status.toLowerCase() === 'dnc bot calling') ||
        (status === 'paymentFailed' && caseItem.status.toLowerCase() === 'payment failed') ||
        (status === 'customerPostponed' && caseItem.status.toLowerCase() === 'customer postponed');

      // Filter by agent
      const matchesAgent = agent === 'all' ||
        caseItem.agent.toLowerCase() === agent.toLowerCase();

      // Filter by policy status
      const matchesPolicyStatus = policyStatus === 'all' ||
        caseItem.policyStatus.toLowerCase() === policyStatus.toLowerCase();

      // Filter by date if needed (example implementation)
      let matchesDate = true;
      if (date !== 'all') {
        const today = new Date();
        const caseDate = new Date(caseItem.uploadDate);

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

      // Exclude cases with status "Renewed"
      return matchesSearch && matchesStatus && matchesAgent && matchesPolicyStatus && matchesDate && caseItem.status !== 'Renewed';
    });

    setCases(filteredCases);
    setPage(0); // Reset to first page when filtering
  };



  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      // In a real app, this would call your API
      // await updateCase(currentCase.id, currentCase);

      // Update local state
      setCases(cases.map(c => c.id === currentCase.id ? currentCase : c));
      setEditDialogOpen(false);
    } catch (error) {
      setError("Failed to update case. Please try again.");
    }
  };

  const handleViewFlow = (caseData) => {
    setCurrentCase(caseData);
    navigate(`/logs?caseId=${caseData.id}`);
  };

  const handleCommentDialogOpen = (caseData) => {
    setCurrentCase(caseData);
    setCommentFormData({
      status: caseData.status,
      subStatus: caseData.subStatus,
      nextFollowUpDate: caseData.nextFollowUpDate,
      updateStatus: false,
      updateFollowUp: false
    });
    setCommentDialogOpen(true);
  };

  const handleCommentDialogClose = () => {
    setCommentDialogOpen(false);
    setCommentText('');
    setCommentFormData({
      status: '',
      subStatus: '',
      nextFollowUpDate: '',
      updateStatus: false,
      updateFollowUp: false
    });
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    // Use the new status/substatus if being updated, otherwise use current case values
    const finalStatus = commentFormData.updateStatus ? commentFormData.status : currentCase.status;
    const finalSubStatus = commentFormData.updateStatus ? commentFormData.subStatus : currentCase.subStatus;
    const finalFollowUpDate = commentFormData.updateFollowUp ? commentFormData.nextFollowUpDate : currentCase.nextFollowUpDate;

    // In a real app, this would call your API to save the comment
    const newComment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      user: 'Current User',
      timestamp: new Date().toISOString(),
      status: finalStatus,
      subStatus: finalSubStatus,
      statusChanged: commentFormData.updateStatus,
      followUpChanged: commentFormData.updateFollowUp
    };

    // Update the case with the new comment and any status/follow-up changes
    const updatedCase = {
      ...currentCase,
      status: finalStatus,
      subStatus: finalSubStatus,
      nextFollowUpDate: finalFollowUpDate,
      comments: [...(currentCase.comments || []), newComment]
    };

    // Update cases array with the updated case
    setCases(cases.map(c => c.id === currentCase.id ? updatedCase : c));

    // Show success message with details of what was updated
    let successMsg = `Comment added to case ${currentCase.id}`;
    if (commentFormData.updateStatus) {
      successMsg += ` (Status updated to ${finalStatus})`;
    }
    if (commentFormData.updateFollowUp) {
      successMsg += ` (Follow-up date updated to ${new Date(finalFollowUpDate).toLocaleDateString()})`;
    }
    setSuccessMessage(successMsg);
    setTimeout(() => setSuccessMessage(''), 4000);

    // Close dialog and reset form
    handleCommentDialogClose();
  };

  // Quick Edit handlers
  const handleQuickEditOpen = (caseData) => {
    setCurrentCase(caseData);
    setQuickEditData({
      status: caseData.status,
      subStatus: caseData.subStatus,
      nextFollowUpDate: caseData.nextFollowUpDate,
      nextActionPlan: caseData.nextActionPlan,
      currentWorkStep: caseData.currentWorkStep,
      commentText: ''
    });
    setQuickEditDialogOpen(true);
  };

  const handleQuickEditClose = () => {
    setQuickEditDialogOpen(false);
    setCurrentCase(null);
    setQuickEditData({
      status: '',
      subStatus: '',
      nextFollowUpDate: '',
      nextActionPlan: '',
      currentWorkStep: '',
      commentText: ''
    });
  };

  const handleQuickEditSave = () => {
    if (!currentCase) return;

    // Create new comment if text provided
    const newComment = quickEditData.commentText.trim() ? {
      id: `comment-${Date.now()}`,
      text: quickEditData.commentText,
      user: 'Current User',
      timestamp: new Date().toISOString(),
      status: quickEditData.status,
      subStatus: quickEditData.subStatus
    } : null;

    // Update the case with new data
    const updatedCase = {
      ...currentCase,
      status: quickEditData.status,
      subStatus: quickEditData.subStatus,
      nextFollowUpDate: quickEditData.nextFollowUpDate,
      nextActionPlan: quickEditData.nextActionPlan,
      currentWorkStep: quickEditData.currentWorkStep,
      comments: newComment ? [...(currentCase.comments || []), newComment] : currentCase.comments
    };

    // Update cases array
    setCases(cases.map(c => c.id === currentCase.id ? updatedCase : c));

    setSuccessMessage(`Case ${currentCase.id} updated successfully`);
    setTimeout(() => setSuccessMessage(''), 3000);

    // Close dialog
    handleQuickEditClose();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'renewed': return 'success';
      case 'in progress': return 'info';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      case 'not interested': return 'error';
      case 'dnc email': return 'error';
      case 'dnc whatsapp': return 'error';
      case 'dnc sms': return 'error';
      case 'dnc call': return 'error';
      case 'dnc bot calling': return 'error';
      case 'payment failed': return 'error';
      case 'customer postponed': return 'warning';
      default: return 'default';
    }
  };

  const getPolicyStatusColor = (policyStatus) => {
    switch (policyStatus.toLowerCase()) {
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

  const [moreActionsMenu, setMoreActionsMenu] = useState({});

  // More actions menu handlers
  const handleMoreActionsClick = (event, caseItem) => {
    event.stopPropagation();
    setMoreActionsMenu({ ...moreActionsMenu, [caseItem.id]: event.currentTarget });
  };

  const handleMoreActionsClose = (caseId) => {
    setMoreActionsMenu({ ...moreActionsMenu, [caseId]: null });
  };

  // Quick message handlers
  const handleQuickMessageOpen = (caseData) => {
    setSelectedCase(caseData);
    setQuickMessage(getDefaultQuickMessage(caseData));
    setQuickMessageDialog(true);
  };

  const handleQuickMessageClose = () => {
    setQuickMessageDialog(false);
    setSelectedCase(null);
    setQuickMessage('');
  };

  const getDefaultQuickMessage = (caseData) => {
    return `Hi ${caseData.customerName}, this is regarding your ${caseData.policyDetails.type} insurance policy ${caseData.policyNumber}. Please let us know if you need any assistance with your renewal process.`;
  };

  const handleSendQuickMessage = async () => {
    if (!selectedCase) return;

    try {
      // Check DNC status before sending
      const dncStatus = await checkDNCStatus(
        selectedCase.contactInfo,
        currentUser.clientId || 'CLIENT-001',
        messageType
      );

      if (dncStatus.isBlocked && !dncStatus.overrideAllowed) {
        setError(`Message blocked: ${dncStatus.reason} (${dncStatus.source})`);
        setTimeout(() => setError(''), 5000);
        return;
      }

      if (dncStatus.isBlocked && dncStatus.overrideAllowed) {
        // Show override dialog
        setDNCCheckResult(dncStatus);
        setDNCOverrideDialog(true);
        return;
      }

      // Proceed with sending if not blocked
      await sendMessageAfterDNCCheck();

    } catch (error) {
      setError('Failed to send message. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const sendMessageAfterDNCCheck = async () => {
    // Here you would integrate with your messaging API
    // In a real app, this would call the actual messaging service
    // await sendMessage(selectedCase, messageType, quickMessage);

    setSuccessMessage(`Quick message sent to ${selectedCase.customerName} via ${messageType.toUpperCase()}`);
    handleQuickMessageClose();

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleDNCOverride = async () => {
    if (!overrideReason.trim()) {
      setError('Please provide a reason for the override');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const overrideResult = await requestDNCOverride(dncCheckResult.dncId, {
        reason: overrideReason,
        overrideType: 'temporary',
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });

      if (overrideResult.success) {
        // Override approved, send message
        await sendMessageAfterDNCCheck();
        setDNCOverrideDialog(false);
        setOverrideReason('');
        setDNCCheckResult(null);
      }
    } catch (error) {
      setError('Failed to request override. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Bulk operations handlers
  const handleSelectAllCases = (checked) => {
    if (checked) {
      const currentPageCases = cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setSelectedCases(currentPageCases.map(c => c.id));
    } else {
      setSelectedCases([]);
    }
  };

  const handleSelectCase = (caseId, checked) => {
    if (checked) {
      setSelectedCases(prev => [...prev, caseId]);
    } else {
      setSelectedCases(prev => prev.filter(id => id !== caseId));
    }
  };

  const handleBulkStatusChange = () => {
    setBulkStatusDialog(true);
  };

  const handleBulkAgentAssignment = () => {
    setBulkAssignDialog(true);
  };

  const handleBulkPolicyStatusChange = () => {
    setBulkPolicyStatusDialog(true);
  };

  const handleConfirmBulkStatusChange = async () => {
    try {
      // Call API to update case statuses
      const response = await bulkUpdateCaseStatus(selectedCases, bulkStatus);

      if (response.success) {
        // Update local state
        const updatedCases = cases.map(caseItem =>
          selectedCases.includes(caseItem.id)
            ? { ...caseItem, status: bulkStatus }
            : caseItem
        );

        setCases(updatedCases);
        setSuccessMessage(response.message || `Successfully updated status to "${bulkStatus}" for ${selectedCases.length} case(s)`);

        // Reset states
        setSelectedCases([]);
        setBulkStatusDialog(false);
        setBulkStatus('');

        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setError(error.message || 'Failed to update case statuses. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleConfirmBulkAgentAssignment = async () => {
    try {
      // Call API to assign cases to agent
      const response = await bulkAssignCases(selectedCases, bulkAgent);

      if (response.success) {
        // Update local state
        const updatedCases = cases.map(caseItem =>
          selectedCases.includes(caseItem.id)
            ? { ...caseItem, agent: bulkAgent, status: caseItem.status === 'Uploaded' ? 'Assigned' : caseItem.status }
            : caseItem
        );

        setCases(updatedCases);

        // Enhanced success message with dialer integration info
        let successMsg = response.message || `Successfully assigned ${selectedCases.length} case(s) to ${bulkAgent}`;
        if (response.dialerIntegration?.success) {
          successMsg += ` (Dialer Queue ID: ${response.dialerIntegration.dialerSystemId})`;
        }
        setSuccessMessage(successMsg);

        // Reset states
        setSelectedCases([]);
        setBulkAssignDialog(false);
        setBulkAgent('');

        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (error) {
      setError(error.message || 'Failed to assign cases to agent. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleConfirmBulkPolicyStatusChange = async () => {
    try {
      // Update selected cases with new policy status
      const updatedCases = cases.map(caseItem =>
        selectedCases.includes(caseItem.id)
          ? { ...caseItem, policyStatus: bulkPolicyStatus }
          : caseItem
      );

      setCases(updatedCases);
      setSuccessMessage(`Successfully updated policy status to "${bulkPolicyStatus}" for ${selectedCases.length} case(s)`);

      // Reset states
      setSelectedCases([]);
      setBulkPolicyStatusDialog(false);
      setBulkPolicyStatus('');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update policy statuses. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleClearSelection = () => {
    setSelectedCases([]);
  };

  // Pin to top handlers
  const handlePinToTop = () => {
    const newPinnedCases = [...new Set([...pinnedCases, ...selectedCases])];
    if (newPinnedCases.length > 5) {
      setError('Maximum 5 cases can be pinned to top');
      setTimeout(() => setError(null), 3000);
      return;
    }
    setPinnedCases(newPinnedCases);
    localStorage.setItem('pinnedCases', JSON.stringify(newPinnedCases));
    setSuccessMessage(`${selectedCases.length} case(s) pinned to top`);
    setSelectedCases([]);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUnpinCase = (caseId) => {
    const newPinnedCases = pinnedCases.filter(id => id !== caseId);
    setPinnedCases(newPinnedCases);
    localStorage.setItem('pinnedCases', JSON.stringify(newPinnedCases));
    setSuccessMessage('Case unpinned');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleBulkUnpin = () => {
    const newPinnedCases = pinnedCases.filter(id => !selectedCases.includes(id));
    setPinnedCases(newPinnedCases);
    localStorage.setItem('pinnedCases', JSON.stringify(newPinnedCases));
    setSuccessMessage(`${selectedCases.length} case(s) unpinned`);
    setSelectedCases([]);
    setTimeout(() => setSuccessMessage(''), 3000);
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
            Case Tracking
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

            <Zoom in={loaded} style={{ transitionDelay: '250ms' }}>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => setBulkUploadOpen(true)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Bulk Upload
              </Button>
            </Zoom>

            <Zoom in={loaded} style={{ transitionDelay: '275ms' }}>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setShowUploadHistory(!showUploadHistory)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                History
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

        {/* Upload History Section */}
        {showUploadHistory && (
          <Grow in={showUploadHistory} timeout={400}>
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <FailedRecordsViewer source="cases" limit={10} />
              </CardContent>
            </Card>
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
                <AssignmentIndIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="600">
                  Search Cases
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

        {/* Bulk Actions Toolbar */}
        {bulkActionsVisible && (
          <Grow in={bulkActionsVisible} timeout={300}>
            <Paper sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Toolbar sx={{ px: '0 !important', minHeight: 'auto !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedCases.length} case(s) selected
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip
                    title={
                      selectedCases.some(id => pinnedCases.includes(id))
                        ? "Unpin selected cases"
                        : pinnedCases.length + selectedCases.length > 5
                          ? "Maximum 5 cases can be pinned"
                          : "Pin selected cases to top"
                    }
                    arrow
                  >
                    <span>
                      <Button
                        startIcon={<PushPinIcon />}
                        variant="contained"
                        color={selectedCases.some(id => pinnedCases.includes(id)) ? "warning" : "secondary"}
                        size="small"
                        onClick={selectedCases.some(id => pinnedCases.includes(id)) ? handleBulkUnpin : handlePinToTop}
                        disabled={!selectedCases.some(id => pinnedCases.includes(id)) && pinnedCases.length + selectedCases.length > 5}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: selectedCases.some(id => pinnedCases.includes(id))
                            ? '0 4px 14px rgba(255,152,0,0.25)'
                            : '0 4px 14px rgba(156,39,176,0.25)',
                          '&:hover': {
                            boxShadow: selectedCases.some(id => pinnedCases.includes(id))
                              ? '0 6px 20px rgba(255,152,0,0.35)'
                              : '0 6px 20px rgba(156,39,176,0.35)',
                          },
                          '&:disabled': {
                            opacity: 0.5
                          }
                        }}
                      >
                        {selectedCases.some(id => pinnedCases.includes(id)) ? 'Unpin' : 'Pin to Top'}
                      </Button>
                    </span>
                  </Tooltip>
                  <Button
                    startIcon={<CheckCircleIcon />}
                    variant="contained"
                    size="small"
                    onClick={handleBulkStatusChange}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                      }
                    }}
                  >
                    Change Status
                  </Button>
                  <Button
                    startIcon={<PersonIcon />}
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleBulkAgentAssignment}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(76,175,80,0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(76,175,80,0.35)',
                      }
                    }}
                  >
                    Assign to Agent
                  </Button>
                  <Button
                    startIcon={<CheckCircleIcon />}
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={handleBulkPolicyStatusChange}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(255,152,0,0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(255,152,0,0.35)',
                      }
                    }}
                  >
                    Change Policy Status
                  </Button>
                  <Button
                    startIcon={<CloseIcon />}
                    variant="outlined"
                    size="small"
                    onClick={handleClearSelection}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      borderColor: alpha(theme.palette.error.main, 0.3),
                      color: theme.palette.error.main,
                      '&:hover': {
                        borderColor: theme.palette.error.main,
                        backgroundColor: alpha(theme.palette.error.main, 0.05),
                      }
                    }}
                  >
                    Clear Selection
                  </Button>
                </Box>
              </Toolbar>
            </Paper>
          </Grow>
        )}



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
                  background: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: '4px',
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.5),
                  }
                }
              }}
            >
              <Table
                sx={{
                  minWidth: 2560,
                  tableLayout: 'fixed'
                }}
                aria-label="case tracking table"
              >
                <TableHead sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  bgcolor: 'background.paper'
                }}>
                  <TableRow sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '& .MuiTableCell-head': {
                      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                      position: 'sticky',
                      top: 0,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      zIndex: 10,
                      fontSize: '0.875rem',
                      letterSpacing: '0.02em'
                    }
                  }}>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 80, textAlign: 'center' }}>
                      <Checkbox
                        indeterminate={selectedCases.length > 0 && selectedCases.length < cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                        checked={cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0 && selectedCases.length === cases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                        onChange={(e) => handleSelectAllCases(e.target.checked)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                    </TableCell>
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
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 160 }}>CCC(cur.comm.ch.)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Batch ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 130 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Policy Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 160 }}>Agent</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 120, textAlign: 'center' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Last Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 120, textAlign: 'center' }}>Calls</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 150 }}>Renewal Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', py: 3, width: 140 }}>Upload Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    // Sort cases: pinned first, then others
                    const sortedCases = [...cases].sort((a, b) => {
                      const aIsPinned = pinnedCases.includes(a.id);
                      const bIsPinned = pinnedCases.includes(b.id);
                      if (aIsPinned && !bIsPinned) return -1;
                      if (!aIsPinned && bIsPinned) return 1;
                      return 0;
                    });
                    return sortedCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
                  })().map((caseItem, index) => {
                    return (
                      <TableRow
                        key={caseItem.id}
                        hover
                        onClick={() => navigate(`/cases/${caseItem.id}`)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'background-color 0.2s, transform 0.1s',
                          bgcolor: pinnedCases.includes(caseItem.id)
                            ? alpha(theme.palette.secondary.main, 0.08)
                            : index % 2 === 0 ? 'transparent' : alpha(theme.palette.primary.main, 0.02),
                          borderLeft: pinnedCases.includes(caseItem.id)
                            ? `4px solid ${theme.palette.secondary.main}`
                            : 'none',
                          '&:hover': {
                            backgroundColor: pinnedCases.includes(caseItem.id)
                              ? alpha(theme.palette.secondary.main, 0.15)
                              : alpha(theme.palette.primary.main, 0.08),
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
                        <TableCell
                          sx={{ textAlign: 'center', width: 80 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedCases.includes(caseItem.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectCase(caseItem.id, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: theme.palette.primary.main,
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', width: 200 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            {/* Primary Actions - Always Visible */}
                            <Tooltip title={caseItem.isStarred ? "Unmark as Important" : "Mark as Important"} arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedCases = cases.map(c =>
                                    c.id === caseItem.id ? { ...c, isStarred: !c.isStarred } : c
                                  );
                                  setCases(updatedCases);
                                  setSuccessMessage(caseItem.isStarred ? 'Removed from important' : 'Marked as important');
                                  setTimeout(() => setSuccessMessage(''), 2000);
                                }}
                                sx={{
                                  color: caseItem.isStarred ? 'warning.main' : 'action.disabled',
                                  transition: 'transform 0.2s, color 0.2s',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                    transform: 'scale(1.15)',
                                    color: 'warning.main'
                                  }
                                }}
                              >
                                {caseItem.isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Call Lead" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCallCase(caseItem);
                                  setCallDialogOpen(true);
                                }}
                                sx={{
                                  color: theme.palette.success.main,
                                  transition: 'transform 0.2s',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    transform: 'scale(1.15)'
                                  }
                                }}
                              >
                                <CallIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

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

                            <Tooltip title="Quick Edit" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickEditOpen(caseItem);
                                }}
                                sx={{
                                  color: 'info.main',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.15)' }
                                }}
                              >
                                <EditNoteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Add Comment" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentDialogOpen(caseItem);
                                }}
                                sx={{
                                  color: 'secondary.main',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'scale(1.15)' }
                                }}
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {/* More Actions Menu */}
                            <Tooltip title="More Actions" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMoreActionsClick(e, caseItem)}
                                sx={{
                                  color: 'text.secondary',
                                  transition: 'transform 0.2s, color 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.15)',
                                    color: 'primary.main'
                                  }
                                }}
                              >
                                <MoreIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ width: 140 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            {pinnedCases.includes(caseItem.id) && (
                              <Tooltip title="Pinned to top" arrow>
                                <PushPinIcon
                                  fontSize="small"
                                  sx={{
                                    color: theme.palette.secondary.main,
                                    transform: 'rotate(45deg)'
                                  }}
                                />
                              </Tooltip>
                            )}
                            <Typography variant="body2" fontWeight="500" color="primary">
                              {caseItem.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ width: 180 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: 'primary.main',
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                            onClick={(e) => handleCustomerNameClick(e, caseItem.customerName, caseItem.customerId)}
                          >
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
                        <TableCell sx={{ width: 160 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {caseItem.currentCommunicationChannel === 'email' && <EmailIcon fontSize="small" color="primary" />}
                            {caseItem.currentCommunicationChannel === 'whatsapp' && <WhatsAppIcon fontSize="small" sx={{ color: '#25d366' }} />}
                            {caseItem.currentCommunicationChannel === 'sms' && <SmsIcon fontSize="small" color="warning" />}
                            {caseItem.currentCommunicationChannel === 'call' && <PhoneIcon fontSize="small" color="secondary" />}
                            {caseItem.currentCommunicationChannel === 'bot-calling' && <PhoneIcon fontSize="small" sx={{ color: '#673ab7' }} />}
                            <Typography variant="body2" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                              {caseItem.currentCommunicationChannel === 'bot-calling' ? 'Bot Calling' : caseItem.currentCommunicationChannel || 'N/A'}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              try {
                                // Toggle priority status
                                const updatedCase = { ...caseItem, isPriority: !caseItem.isPriority };
                                // await updateCase(caseItem.id, { isPriority: !caseItem.isPriority });

                                // Update the cases array with the updated case
                                setCases(cases.map(c => c.id === caseItem.id ? updatedCase : c));
                                setSuccessMessage(`Priority status ${!caseItem.isPriority ? 'enabled' : 'disabled'} for case ${caseItem.id}`);

                                setTimeout(() => {
                                  setSuccessMessage('');
                                }, 3000);
                              } catch (err) {
                                setError('Failed to update priority status');
                                // Auto-dismiss error message after 3 seconds
                                setTimeout(() => {
                                  setError(null);
                                }, 3000);
                              }
                            }}
                            sx={{
                              cursor: 'pointer',
                              minWidth: '100px',
                              fontWeight: 500,
                              borderRadius: 5,
                              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                              '&:hover': {
                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                transform: 'translateY(-1px)'
                              },
                              transition: 'transform 0.2s, box-shadow 0.2s',
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
                                  return 'error.main'; // Overdue - red
                                } else if (daysUntilRenewal <= 7) {
                                  return 'error.main'; // Due soon - red
                                } else if (daysUntilRenewal <= 30) {
                                  return 'warning.main'; // Due within month - orange
                                }
                                return 'text.primary'; // Normal - default color
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
                            {new Date(caseItem.uploadDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

        {/* More Actions Menu for each case */}
        {Object.entries(moreActionsMenu).map(([caseId, anchorEl]) => (
          <Menu
            key={caseId}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleMoreActionsClose(caseId)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                minWidth: '180px',
                mt: 1,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  }
                }
              }
            }}
          >
            <MenuItem
              onClick={() => {
                handleMoreActionsClose(caseId);
                const caseItem = cases.find(c => c.id === caseId);
                if (caseItem) handleQuickMessageOpen(caseItem);
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <MessageIcon fontSize="small" sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText primary="Quick Message" />
            </MenuItem>

            {settings?.showEditCaseButton !== false && (
              <MenuItem
                onClick={() => {
                  handleMoreActionsClose(caseId);
                  const caseItem = cases.find(c => c.id === caseId);
                  if (caseItem) {
                    setCurrentCase(caseItem);
                    setEditDialogOpen(true);
                  }
                }}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                </ListItemIcon>
                <ListItemText primary="Edit Case" />
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                handleMoreActionsClose(caseId);
                const caseItem = cases.find(c => c.id === caseId);
                if (caseItem) handleViewFlow(caseItem);
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <HistoryIcon fontSize="small" sx={{ color: 'info.main' }} />
              </ListItemIcon>
              <ListItemText primary="View History" />
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleMoreActionsClose(caseId);
                if (pinnedCases.includes(caseId)) {
                  handleUnpinCase(caseId);
                } else {
                  if (pinnedCases.length >= 5) {
                    setError('Maximum 5 cases can be pinned to top');
                    setTimeout(() => setError(null), 3000);
                  } else {
                    const newPinnedCases = [...pinnedCases, caseId];
                    setPinnedCases(newPinnedCases);
                    localStorage.setItem('pinnedCases', JSON.stringify(newPinnedCases));
                    setSuccessMessage('Case pinned to top');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  }
                }
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <PushPinIcon
                  fontSize="small"
                  sx={{
                    color: pinnedCases.includes(caseId) ? 'warning.main' : 'secondary.main',
                    transform: pinnedCases.includes(caseId) ? 'none' : 'rotate(45deg)'
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={pinnedCases.includes(caseId) ? "Unpin from Top" : "Pin to Top"} />
            </MenuItem>
          </Menu>
        ))}

        {/* Filters Menu */}
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
            Filter Cases
          </Typography>
          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
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
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="uploaded">Uploaded</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="inProgress">In Progress</MenuItem>
                <MenuItem value="processed">Payment Processed</MenuItem>
                <MenuItem value="renewed">Renewed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="renewalFailed">Renewal Failed</MenuItem>
                <MenuItem value="notInterested">Not Interested</MenuItem>
                <MenuItem value="dncEmail">DNC Email</MenuItem>
                <MenuItem value="dncWhatsApp">DNC WhatsApp</MenuItem>
                <MenuItem value="dncSms">DNC SMS</MenuItem>
                <MenuItem value="dncCall">DNC Call</MenuItem>
                <MenuItem value="dncBotCalling">DNC Bot Calling</MenuItem>
                <MenuItem value="paymentFailed">Payment Failed</MenuItem>
                <MenuItem value="customerPostponed">Customer Postponed</MenuItem>
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
                <MenuItem value="Unassigned">Unassigned</MenuItem>
              </Select>
            </FormControl>
          </MenuItem>

          <MenuItem sx={{ py: 1.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Policy Status</InputLabel>
              <Select
                value={policyStatusFilter}
                label="Policy Status"
                onChange={handlePolicyStatusFilterChange}
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
                <MenuItem value="all">All Policy Statuses</MenuItem>
                <MenuItem value="Pre Due Stage">Pre Due Stage</MenuItem>
                <MenuItem value="Policy Due">Policy Due</MenuItem>
                <MenuItem value="Reinstatement">Reinstatement</MenuItem>
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
            onClick={() => {
              exportData('csv');
              handleExportClose();
            }}
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
              <InsertDriveFileIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Export as CSV" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportData('xls');
              handleExportClose();
            }}
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
              <TableViewIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Export as Excel" />
          </MenuItem>
        </Menu>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Edit Case Details
          </DialogTitle>
          <DialogContent dividers>
            {currentCase && (
              <Box sx={{ pt: 2, display: 'grid', gap: 2.5, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  value={currentCase.customerName}
                  onChange={(e) => setCurrentCase({ ...currentCase, customerName: e.target.value })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <TextField
                  label="Policy Number"
                  fullWidth
                  value={currentCase.policyNumber}
                  disabled // Policy number shouldn't be editable
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <TextField
                  label="Email"
                  fullWidth
                  value={currentCase.contactInfo.email}
                  onChange={(e) => setCurrentCase({
                    ...currentCase,
                    contactInfo: { ...currentCase.contactInfo, email: e.target.value }
                  })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <TextField
                  label="Phone"
                  fullWidth
                  value={currentCase.contactInfo.phone}
                  onChange={(e) => setCurrentCase({
                    ...currentCase,
                    contactInfo: { ...currentCase.contactInfo, phone: e.target.value }
                  })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <FormControl fullWidth>
                  <InputLabel>Policy Type</InputLabel>
                  <Select
                    value={currentCase.policyDetails.type}
                    label="Policy Type"
                    onChange={(e) => setCurrentCase({
                      ...currentCase,
                      policyDetails: { ...currentCase.policyDetails, type: e.target.value }
                    })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Auto">Auto</MenuItem>
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Life">Life</MenuItem>
                    <MenuItem value="Vehicle">Vehicle</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Premium"
                  type="number"
                  fullWidth
                  value={currentCase.policyDetails.premium}
                  onChange={(e) => setCurrentCase({
                    ...currentCase,
                    policyDetails: { ...currentCase.policyDetails, premium: parseFloat(e.target.value) }
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                />

                <TextField
                  label="Expiry Date"
                  type="date"
                  fullWidth
                  value={currentCase.policyDetails.expiryDate}
                  onChange={(e) => setCurrentCase({
                    ...currentCase,
                    policyDetails: { ...currentCase.policyDetails, expiryDate: e.target.value }
                  })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <FormControl fullWidth>
                  <InputLabel>Assigned Agent</InputLabel>
                  <Select
                    value={currentCase.agent === 'Unassigned' ? '' : currentCase.agent}
                    label="Assigned Agent"
                    onChange={(e) => setCurrentCase({
                      ...currentCase,
                      agent: e.target.value || 'Unassigned'
                    })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    <MenuItem value="Priya Patel">Priya Patel</MenuItem>
                    <MenuItem value="Rajesh Kumar">Rajesh Kumar</MenuItem>
                    <MenuItem value="Ananya Reddy">Ananya Reddy</MenuItem>
                    <MenuItem value="Amit Shah">Amit Shah</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={handleEditDialogClose}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Comment Dialog */}
        <Dialog open={commentDialogOpen} onClose={handleCommentDialogClose} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommentIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Add Comment & Update Case
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {currentCase && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 3 }}>
                  Case: {currentCase.id} - {currentCase.customerName}
                </Typography>

                {/* Current Case Status */}
                <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                    Current Status
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Typography variant="body2" fontWeight="500">{currentCase.status}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Sub-Status</Typography>
                      <Typography variant="body2" fontWeight="500">{currentCase.subStatus}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Work Step</Typography>
                      <Typography variant="body2" fontWeight="500">{currentCase.currentWorkStep}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Next Follow-up</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(currentCase.nextFollowUpDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">Next Action Plan</Typography>
                    <Typography variant="body2" fontWeight="500">{currentCase.nextActionPlan}</Typography>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Add Comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter your comment here..."
                  sx={{ mb: 3 }}
                />

                {/* Optional Status Update Section */}
                <Box sx={{ mb: 3, p: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={commentFormData.updateStatus}
                          onChange={(e) => setCommentFormData({
                            ...commentFormData,
                            updateStatus: e.target.checked
                          })}
                          sx={{ color: theme.palette.primary.main }}
                        />
                      }
                      label={
                        <Typography variant="subtitle2" fontWeight="600">
                          Update Case Status
                        </Typography>
                      }
                    />
                  </Box>

                  {commentFormData.updateStatus && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, ml: 4 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={commentFormData.status}
                          label="Status"
                          onChange={(e) => setCommentFormData({
                            ...commentFormData,
                            status: e.target.value
                          })}
                          sx={{ borderRadius: 2 }}
                        >
                          {availableStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={status} size="small" color={getStatusColor(status)} />
                                <Typography>{status}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel>Sub-Status</InputLabel>
                        <Select
                          value={commentFormData.subStatus}
                          label="Sub-Status"
                          onChange={(e) => setCommentFormData({
                            ...commentFormData,
                            subStatus: e.target.value
                          })}
                          sx={{ borderRadius: 2 }}
                        >
                          {availableSubStatuses.map((subStatus) => (
                            <MenuItem key={subStatus} value={subStatus}>
                              {subStatus}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </Box>

                {/* Optional Follow-up Date Update Section */}
                <Box sx={{ mb: 3, p: 2, border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={commentFormData.updateFollowUp}
                          onChange={(e) => setCommentFormData({
                            ...commentFormData,
                            updateFollowUp: e.target.checked
                          })}
                          sx={{ color: theme.palette.warning.main }}
                        />
                      }
                      label={
                        <Typography variant="subtitle2" fontWeight="600">
                          Update Next Follow-up Date
                        </Typography>
                      }
                    />
                  </Box>

                  {commentFormData.updateFollowUp && (
                    <Box sx={{ ml: 4 }}>
                      <TextField
                        label="Next Follow-up Date"
                        type="date"
                        size="small"
                        value={commentFormData.nextFollowUpDate}
                        onChange={(e) => setCommentFormData({
                          ...commentFormData,
                          nextFollowUpDate: e.target.value
                        })}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          sx: { borderRadius: 2 },
                          startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ minWidth: 200 }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Summary of Changes */}
                {(commentFormData.updateStatus || commentFormData.updateFollowUp) && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                      Summary of Changes
                    </Typography>
                    {commentFormData.updateStatus && (
                      <Typography variant="body2" color="text.secondary">
                        • Status: {currentCase.status} → {commentFormData.status}
                      </Typography>
                    )}
                    {commentFormData.updateStatus && (
                      <Typography variant="body2" color="text.secondary">
                        • Sub-Status: {currentCase.subStatus} → {commentFormData.subStatus}
                      </Typography>
                    )}
                    {commentFormData.updateFollowUp && (
                      <Typography variant="body2" color="text.secondary">
                        • Follow-up Date: {new Date(currentCase.nextFollowUpDate).toLocaleDateString()} → {new Date(commentFormData.nextFollowUpDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Comment History */}
                {currentCase.comments && currentCase.comments.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                      Comment History ({currentCase.comments.length})
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {currentCase.comments.map((comment) => (
                        <Card key={comment.id} sx={{ mb: 2, borderRadius: 2 }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="body2" fontWeight="500" color="primary">
                                {comment.user}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {comment.text}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip label={comment.status} size="small" color={getStatusColor(comment.status)} />
                              <Chip label={comment.subStatus} size="small" variant="outlined" />
                              {comment.statusChanged && (
                                <Chip
                                  label="Status Updated"
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  icon={<CheckCircleIcon />}
                                />
                              )}
                              {comment.followUpChanged && (
                                <Chip
                                  label="Follow-up Updated"
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  icon={<ScheduleIcon />}
                                />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCommentDialogClose} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleCommentSubmit}
              variant="contained"
              disabled={!commentText.trim()}
              sx={{ borderRadius: 2, fontWeight: 600 }}
              startIcon={<CommentIcon />}
            >
              {(commentFormData.updateStatus || commentFormData.updateFollowUp)
                ? 'Add Comment & Update Case'
                : 'Add Comment'
              }
            </Button>
          </DialogActions>
        </Dialog>

        {/* Quick Edit Dialog */}
        <Dialog open={quickEditDialogOpen} onClose={handleQuickEditClose} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditNoteIcon sx={{ color: theme.palette.info.main }} />
              <Typography variant="h6" fontWeight="600">
                Quick Edit Case
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {currentCase && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 3 }}>
                  Case: {currentCase.id} - {currentCase.customerName}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={quickEditData.status}
                      label="Status"
                      onChange={(e) => setQuickEditData({ ...quickEditData, status: e.target.value })}
                      sx={{ borderRadius: 2 }}
                    >
                      {availableStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={status} size="small" color={getStatusColor(status)} />
                            <Typography>{status}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Sub-Status</InputLabel>
                    <Select
                      value={quickEditData.subStatus}
                      label="Sub-Status"
                      onChange={(e) => setQuickEditData({ ...quickEditData, subStatus: e.target.value })}
                      sx={{ borderRadius: 2 }}
                    >
                      {availableSubStatuses.map((subStatus) => (
                        <MenuItem key={subStatus} value={subStatus}>
                          {subStatus}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Next Follow-up Date"
                    type="date"
                    fullWidth
                    value={quickEditData.nextFollowUpDate}
                    onChange={(e) => setQuickEditData({ ...quickEditData, nextFollowUpDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Current Work Step</InputLabel>
                    <Select
                      value={quickEditData.currentWorkStep}
                      label="Current Work Step"
                      onChange={(e) => setQuickEditData({ ...quickEditData, currentWorkStep: e.target.value })}
                      sx={{ borderRadius: 2 }}
                    >
                      {availableWorkSteps.map((step) => (
                        <MenuItem key={step} value={step}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimelineIcon fontSize="small" />
                            <Typography>{step}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Next Action Plan"
                  value={quickEditData.nextActionPlan}
                  onChange={(e) => setQuickEditData({ ...quickEditData, nextActionPlan: e.target.value })}
                  placeholder="Describe the next action plan..."
                  sx={{ mb: 3, borderRadius: 2 }}
                  InputProps={{
                    startAdornment: <AssignmentIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Add Comment (Optional)"
                  value={quickEditData.commentText}
                  onChange={(e) => setQuickEditData({ ...quickEditData, commentText: e.target.value })}
                  placeholder="Add a comment about this update..."
                  sx={{ mb: 2, borderRadius: 2 }}
                  InputProps={{
                    startAdornment: <CommentIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                  }}
                />

                {/* Summary of Changes */}
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                    Summary of Changes
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status: {currentCase.status} → {quickEditData.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sub-Status: {currentCase.subStatus} → {quickEditData.subStatus}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Work Step: {currentCase.currentWorkStep} → {quickEditData.currentWorkStep}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Follow-up: {new Date(quickEditData.nextFollowUpDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleQuickEditClose} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleQuickEditSave}
              variant="contained"
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Quick Message Dialog */}
        <Dialog open={quickMessageDialog} onClose={handleQuickMessageClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MessageIcon color="primary" />
              <Typography variant="h6" component="span">
                Quick Message
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pb: 0 }}>
            {selectedCase && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                  Sending message to: <strong>{selectedCase.customerName}</strong> ({selectedCase.id})
                </Typography>

                {/* Message Type Selection */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                    Message Channel
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Channel</InputLabel>
                    <Select
                      value={messageType}
                      label="Channel"
                      onChange={(e) => setMessageType(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="whatsapp">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WhatsAppIcon fontSize="small" color="success" />
                          WhatsApp - {selectedCase.contactInfo.phone}
                        </Box>
                      </MenuItem>
                      <MenuItem value="sms">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SmsIcon fontSize="small" color="info" />
                          SMS - {selectedCase.contactInfo.phone}
                        </Box>
                      </MenuItem>
                      <MenuItem value="email">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" color="primary" />
                          Email - {selectedCase.contactInfo.email}
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Message Content */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                    Message Content
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={messageType === 'email' ? 8 : 6}
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    placeholder={`Enter your ${messageType} message...`}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                  <Box sx={{
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      {messageType === 'sms' && `${quickMessage.length}/160 characters`}
                      {messageType === 'whatsapp' && `${quickMessage.length} characters`}
                      {messageType === 'email' && `${quickMessage.split('\n').length} lines`}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => setQuickMessage(getDefaultQuickMessage(selectedCase))}
                      sx={{ textTransform: 'none' }}
                    >
                      Reset to Default
                    </Button>
                  </Box>
                </Box>

                {/* Policy Information Preview */}
                <Box sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                }}>
                  <Typography variant="subtitle2" fontWeight="600" color="info.main" sx={{ mb: 1 }}>
                    Policy Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Policy: {selectedCase.policyNumber} | Type: {selectedCase.policyDetails.type} |
                    Premium: ${selectedCase.policyDetails.premium} |
                    Expiry: {new Date(selectedCase.policyDetails.expiryDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleQuickMessageClose}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendQuickMessage}
              disabled={!quickMessage.trim()}
              startIcon={<MessageIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 140,
                background: 'linear-gradient(45deg, #25D366 30%, #128C7E 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #20BA5A 30%, #0F7A6B 90%)',
                },
                '&:disabled': {
                  background: 'rgba(0,0,0,0.12)'
                }
              }}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* Auto-refresh button at the bottom right */}
        <Box sx={{ position: 'fixed', right: 30, bottom: 30 }}>
          <Zoom in={loaded} style={{ transitionDelay: '800ms' }}>
            <Tooltip title={settings?.autoRefresh ? "Auto-refresh enabled" : "Refresh cases"} arrow>
              <IconButton
                color="primary"
                onClick={() => {
                  // Refresh data
                  setSuccessMessage('Cases refreshed successfully');
                  setTimeout(() => setSuccessMessage(''), 3000);
                }}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                  width: 56,
                  height: 56,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) rotate(30deg)',
                    boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Zoom>
        </Box>

        {/* Bulk Status Change Dialog */}
        <Dialog
          open={bulkStatusDialog}
          onClose={() => setBulkStatusDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Change Status for {selectedCases.length} Case(s)
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This action will update the status for all selected cases. Please select the new status below.
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={bulkStatus}
                label="New Status"
                onChange={(e) => setBulkStatus(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {availableStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={status}
                        color={getStatusColor(status)}
                        size="small"
                        sx={{ minWidth: '80px' }}
                      />
                      <Typography>{status}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setBulkStatusDialog(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmBulkStatusChange}
              disabled={!bulkStatus}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                }
              }}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Agent Assignment Dialog */}
        <Dialog
          open={bulkAssignDialog}
          onClose={() => setBulkAssignDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: theme.palette.success.main }} />
              <Typography variant="h6" fontWeight="600">
                Assign {selectedCases.length} Case(s) to Agent
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This action will assign all selected cases to the chosen agent. Cases with "Uploaded" status will be automatically changed to "Assigned".
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Agent</InputLabel>
              <Select
                value={bulkAgent}
                label="Select Agent"
                onChange={(e) => setBulkAgent(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {availableAgents.map((agent) => (
                  <MenuItem key={agent} value={agent}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography>{agent}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> This action will also integrate with the dialer system to automatically queue these cases for the assigned agent.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setBulkAssignDialog(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmBulkAgentAssignment}
              disabled={!bulkAgent}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(76,175,80,0.25)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(76,175,80,0.35)',
                }
              }}
            >
              Assign to Agent
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Policy Status Change Dialog */}
        <Dialog
          open={bulkPolicyStatusDialog}
          onClose={() => setBulkPolicyStatusDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: theme.palette.warning.main }} />
              <Typography variant="h6" fontWeight="600">
                Change Policy Status for {selectedCases.length} Case(s)
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This action will update the policy status for all selected cases. Please select the new policy status below.
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Policy Status</InputLabel>
              <Select
                value={bulkPolicyStatus}
                label="New Policy Status"
                onChange={(e) => setBulkPolicyStatus(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {availablePolicyStatuses.map((policyStatus) => (
                  <MenuItem key={policyStatus} value={policyStatus}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={policyStatus}
                        color={getPolicyStatusColor(policyStatus)}
                        size="small"
                        sx={{ minWidth: '120px' }}
                      />
                      <Typography>{policyStatus}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setBulkPolicyStatusDialog(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleConfirmBulkPolicyStatusChange}
              disabled={!bulkPolicyStatus}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(255,152,0,0.25)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(255,152,0,0.35)',
                }
              }}
            >
              Update Policy Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* DNC Override Dialog */}
        <Dialog open={dncOverrideDialog} onClose={() => setDNCOverrideDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon sx={{ color: theme.palette.warning.main }} />
              <Typography variant="h6" fontWeight="600">
                DNC Override Required
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedCase && dncCheckResult && (
              <Box sx={{ pt: 2 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Contact is in DNC Registry
                  </Typography>
                  <Typography variant="body2">
                    <strong>Customer:</strong> {selectedCase.customerName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Contact:</strong> {messageType === 'email' ? selectedCase.contactInfo.email : selectedCase.contactInfo.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Reason:</strong> {dncCheckResult.reason}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Source:</strong> {dncCheckResult.source}
                  </Typography>
                </Alert>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This contact is registered in the DNC (Do Not Call) registry. To proceed with sending the message,
                  please provide a valid business reason for the override.
                </Typography>

                <TextField
                  label="Reason for Override"
                  fullWidth
                  multiline
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Please provide a detailed business reason for this override (e.g., urgent policy renewal, customer consent obtained, etc.)"
                />

                <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Note:</strong> This override will be temporary (24 hours) and will be logged for compliance purposes.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDNCOverrideDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleDNCOverride}
              variant="contained"
              color="warning"
              disabled={!overrideReason.trim()}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Request Override & Send
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Upload Component */}
        <BulkUpload
          open={bulkUploadOpen}
          onClose={() => setBulkUploadOpen(false)}
          title="Bulk Upload Cases"
          source="cases"
          existingData={cases}
          requiredFields={['customerName', 'policyNumber', 'customerMobile']}
          fieldMapping={{
            'Customer Name': 'customerName',
            'Policy Number': 'policyNumber',
            'Mobile': 'customerMobile',
            'Email': 'email',
            'Status': 'status',
            'Sub Status': 'subStatus',
            'Policy Status': 'policyStatus',
            'Agent': 'agent',
            'Customer Profile': 'customerProfile',
            'Preferred Language': 'preferredLanguage',
            'Product Name': 'productName',
            'Product Category': 'productCategory',
            'Channel': 'channel',
            'Sub Channel': 'subChannel',
            'Communication Channel': 'currentCommunicationChannel',
            'Policy Type': 'policyType',
            'Expiry Date': 'expiryDate',
            'Premium': 'premium',
            'Renewal Date': 'renewalDate',
            'Address': 'address',
            'PAN': 'pan',
            'Vehicle Number': 'vehicleNumber'
          }}
          onUploadComplete={(validRecords, failedRecords) => {
            const uploadedBy = 'Current User'; // Replace with actual user from auth context

            const newCases = validRecords.map((record, index) => ({
              id: `CASE-${Math.floor(Math.random() * 100000)}`,
              ...record.record,
              contactInfo: {
                email: record.record.email || '',
                phone: record.record.customerMobile || ''
              },
              policyDetails: {
                type: record.record.policyType || '',
                expiryDate: record.record.expiryDate || '',
                premium: parseFloat(record.record.premium) || 0,
                renewalDate: record.record.renewalDate || ''
              },
              status: record.record.status || 'Uploaded',
              subStatus: record.record.subStatus || 'Pending Validation',
              uploadDate: new Date().toISOString().split('T')[0],
              batchId: `BATCH-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
              isPriority: false,
              totalCalls: 0,
              comments: [],
              flowSteps: ['Uploaded']
            }));

            setCases([...cases, ...newCases]);
            setSnackbar({
              open: true,
              message: `Successfully uploaded ${validRecords.length} case${validRecords.length !== 1 ? 's' : ''}!`,
              severity: 'success'
            });

            if (failedRecords.length > 0) {
              setShowUploadHistory(true);
              setTimeout(() => {
                setSnackbar({
                  open: true,
                  message: `${failedRecords.length} record${failedRecords.length !== 1 ? 's' : ''} failed. Check Upload History for details.`,
                  severity: 'warning'
                });
              }, 2000);
            }
          }}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Call Dialog */}
        <Dialog
          open={callDialogOpen}
          onClose={() => setCallDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CallIcon color="success" />
              <Typography variant="h6" fontWeight="600">
                Contact Customer
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Case ID */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Case ID
                </Typography>
                <Typography variant="body1" fontWeight="600" color="primary">
                  {selectedCallCase?.id}
                </Typography>
              </Box>

              {/* Customer Name */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Customer Name
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedCallCase?.customerName}
                </Typography>
                {selectedCallCase?.customerProfile && (
                  <Chip
                    label={selectedCallCase?.customerProfile}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>

              {/* Policy Information */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Policy Details
                </Typography>
                <Typography variant="body1">{selectedCallCase?.productName || selectedCallCase?.policyDetails?.type}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Policy #: {selectedCallCase?.policyNumber}
                </Typography>
                {selectedCallCase?.policyDetails?.premium && (
                  <Typography variant="body2" color="primary" fontWeight="600">
                    Premium: ₹{selectedCallCase?.policyDetails?.premium.toLocaleString()}
                  </Typography>
                )}
              </Box>

              {/* Status Information */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCallCase?.status}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Sub Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedCallCase?.subStatus}
                      size="small"
                      color="default"
                    />
                  </Box>
                </Box>
              </Box>

              {/* Agent and Work Step */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Case Details
                </Typography>
                <Typography variant="body2">
                  Assigned to: {selectedCallCase?.assignedAgent || selectedCallCase?.agent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Step: {selectedCallCase?.currentWorkStep}
                </Typography>
                {selectedCallCase?.nextFollowUpDate && (
                  <Typography variant="body2" color="text.secondary">
                    Next Follow-up: {selectedCallCase?.nextFollowUpDate}
                  </Typography>
                )}
              </Box>

              {selectedCallCase?.nextActionPlan && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Next Action Plan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{selectedCallCase?.nextActionPlan}"
                  </Typography>
                </Box>
              )}

              <Divider />

              {/* Phone Number */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                  Phone Number
                </Typography>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 1
                }}>
                  <Typography variant="h6" fontWeight="600">
                    {selectedCallCase?.contactInfo?.phone || selectedCallCase?.customerMobile}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    component="a"
                    href={`tel:${selectedCallCase?.contactInfo?.phone || selectedCallCase?.customerMobile}`}
                    startIcon={<CallIcon />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`
                      }
                    }}
                  >
                    Dial
                  </Button>
                </Box>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  Email
                </Typography>
                <Typography variant="body1">{selectedCallCase?.contactInfo?.email}</Typography>
              </Box>

              {selectedCallCase?.preferredLanguage && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Preferred Language
                  </Typography>
                  <Typography variant="body2">{selectedCallCase?.preferredLanguage}</Typography>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCallDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CaseTracking;