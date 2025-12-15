import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  FormControlLabel,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
  Divider,
  useTheme,
  alpha,
  Stack,
  Tooltip,
  Badge,
  Checkbox,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Assignment as AssignIcon,
  Visibility as ViewIcon,
  GetApp as ExportIcon,
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  Psychology as AIIcon,
  TrendingUp as PredictionIcon,
  Schedule as TimeIcon,
  ContactPhone as ContactMethodIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  AccountBalance as BankIcon,
  Assessment as MetricsIcon,
  Timeline as TimelineIcon,
  Description as DocumentIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  PhoneForwarded as PhoneForwardedIcon,
  Archive as ArchiveIcon,
  Group as GroupIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Chat as ChatIcon,
  Telegram as TelegramIcon,
  Send as SendIcon,
  Link as LinkIcon,
  Payment as PaymentIcon,
  CallReceived as CallReceivedIcon
} from '@mui/icons-material';
import DebtorQRCDialog from '../../components/collections/DebtorQRCDialog';

const DebtorManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filters, setFilters] = useState({
    status: 'all',
    segment: 'all',
    dpdMin: '',
    dpdMax: '',
    balanceMin: '',
    balanceMax: '',
    agent: 'all',
    aiScoreMin: '',
    aiScoreMax: ''
  });
  const [tabValue, setTabValue] = useState(0);
  const [selectedDebtor, setSelectedDebtor] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [addDebtorDialog, setAddDebtorDialog] = useState(false);
  const [viewProfileDialog, setViewProfileDialog] = useState(false);
  const [profileTabValue, setProfileTabValue] = useState(0);
  const [recordPaymentDialog, setRecordPaymentDialog] = useState(false);

  // Bulk Selection
  const [selectedDebtors, setSelectedDebtors] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Assign Agent Dialog
  const [assignDialog, setAssignDialog] = useState(false);
  const [assignDebtor, setAssignDebtor] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [debtors, setDebtors] = useState([]);

  // Call and Message Dialogs
  const [callDialog, setCallDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [callDebtor, setCallDebtor] = useState(null);
  const [messageDebtor, setMessageDebtor] = useState(null);
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('');
  const [followupDate, setFollowupDate] = useState('');
  const [followupTime, setFollowupTime] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('sms'); // 'sms', 'email', 'whatsapp', 'line', 'telegram'
  const [attachments, setAttachments] = useState([]);
  const [postCommStatus, setPostCommStatus] = useState('');
  const [postCommFollowupDate, setPostCommFollowupDate] = useState('');
  const [postCommFollowupTime, setPostCommFollowupTime] = useState('');

  // Payment Link Dialog
  const [paymentLinkDialog, setPaymentLinkDialog] = useState(false);
  const [paymentLinkDebtor, setPaymentLinkDebtor] = useState(null);
  const [paymentLinkData, setPaymentLinkData] = useState({
    amount: '',
    description: '',
    expiryDays: 7,
    sendSMS: true,
    sendEmail: true,
    sendWhatsApp: false
  });

  // QRC Dialog
  const [qrcDialogOpen, setQrcDialogOpen] = useState(false);

  // Mock data
  const mockDebtors = [
    {
      id: 'ACC-2024-001',
      workflowId: 'WF-2025-001',
      name: 'Rajesh Kumar',
      phone: '+91-98765-43210',
      email: 'rajesh.kumar@email.com',
      outstandingBalance: 12500.00,
      originalBalance: 15000.00,
      dpd: 365,
      status: 'Active',
      segment: 'Ready-to-Pay',
      lastContact: '2025-01-15',
      ptp: true,
      ptpAmount: 5000,
      ptpDate: '2025-01-20',
      assignedAgent: 'Sarah Johnson',
      debtType: 'Credit Card',
      chargeOffDate: '2024-01-15',
      propensityScore: 78,
      propensityLevel: 'High',
      bestContactTime: 'Weekday 6-8 PM',
      preferredContactMethod: 'Phone',
      paymentProbability: 72,
      settlementProbability: 85,
      // Additional fields from customer1.json
      address: '123 Main Street',
      district: 'Downtown',
      zipCode: '10001',
      annualIncome: 45000,
      dti: 0.28,
      debtPayment: 1250,
      empTitle: 'Sales Manager',
      empLength: 5,
      jobCategory: 'Sales',
      homeOwnership: 'Own',
      dependents: 2,
      bankName: 'Chase Bank',
      bankAccount: '****1234',
      loanAmount: 15000,
      loanLimit: 25000,
      loanLength: 36,
      interestRate: 18.5,
      creditGrade: 'B',
      creditScore: 680,
      lastPaymentDate: '2024-12-15',
      lastPaymentAmount: 500,
      nextPaymentDate: '2025-01-15',
      totalPaid: 2500,
      applicationDate: '2023-01-15',
      approvalDate: '2023-01-20',
      riskEconomic: 0.35,
      riskMobile: 0.28,
      riskSocial: 0.32,
      socialContacts: 450,
      socialFriendsDelinquent: 3,
      documents: [
        { name: 'ID Proof', uri: 'https://example.com/doc1.pdf', date: '2023-01-15' },
        { name: 'Income Certificate', uri: 'https://example.com/doc2.pdf', date: '2023-01-15' },
        { name: 'Bank Statement', uri: 'https://example.com/doc3.pdf', date: '2023-01-16' }
      ],
      paymentHistory: [
        { date: '2024-12-15', amount: 500, type: 'Regular Payment', status: 'Completed' },
        { date: '2024-11-15', amount: 500, type: 'Regular Payment', status: 'Completed' },
        { date: '2024-10-15', amount: 500, type: 'Regular Payment', status: 'Completed' },
        { date: '2024-09-15', amount: 500, type: 'Regular Payment', status: 'Completed' },
        { date: '2024-08-15', amount: 500, type: 'Regular Payment', status: 'Completed' }
      ]
    },
    {
      id: 'ACC-2024-003',
      workflowId: 'WF-2025-001',
      name: 'Amit Singh',
      phone: '+91-98765-43211',
      email: 'amit.singh@email.com',
      outstandingBalance: 8900.00,
      originalBalance: 10000.00,
      dpd: 420,
      status: 'Active',
      segment: 'Contactable but Not Paying',
      lastContact: '2025-01-10',
      ptp: false,
      assignedAgent: 'Mike Wilson',
      debtType: 'Personal Loan',
      chargeOffDate: '2023-12-01',
      propensityScore: 52,
      propensityLevel: 'Medium',
      isInvalid: true,
      validationIssues: ['Missing documents', 'Incomplete address verification'],
      bestContactTime: 'Weekend 10 AM-2 PM',
      preferredContactMethod: 'Email',
      paymentProbability: 48,
      settlementProbability: 62,
      address: '456 Oak Avenue',
      district: 'Westside',
      zipCode: '10002',
      annualIncome: 38000,
      dti: 0.35,
      debtPayment: 890,
      empTitle: 'Administrative Assistant',
      empLength: 3,
      jobCategory: 'Administration',
      homeOwnership: 'Rent',
      dependents: 1,
      bankName: 'Bank of America',
      bankAccount: '****5678',
      loanAmount: 10000,
      loanLimit: 15000,
      loanLength: 24,
      interestRate: 22.0,
      creditGrade: 'C',
      creditScore: 620,
      lastPaymentDate: '2024-09-10',
      lastPaymentAmount: 350,
      nextPaymentDate: '2025-02-10',
      totalPaid: 1100,
      applicationDate: '2022-12-01',
      approvalDate: '2022-12-05',
      riskEconomic: 0.48,
      riskMobile: 0.42,
      riskSocial: 0.45,
      socialContacts: 320,
      socialFriendsDelinquent: 5,
      documents: [
        { name: 'ID Proof', uri: 'https://example.com/doc4.pdf', date: '2022-12-01' },
        { name: 'Income Certificate', uri: 'https://example.com/doc5.pdf', date: '2022-12-01' }
      ],
      paymentHistory: [
        { date: '2024-09-10', amount: 350, type: 'Regular Payment', status: 'Completed' },
        { date: '2024-08-10', amount: 350, type: 'Regular Payment', status: 'Completed' },
        { date: '2024-07-10', amount: 400, type: 'Partial Payment', status: 'Completed' }
      ]
    },
    {
      id: 'ACC-2024-005',
      workflowId: 'WF-2025-002',
      skipTraceId: 'SKP-2025-003',
      name: 'Neha Gupta',
      phone: '+91-98765-43212',
      email: null,
      outstandingBalance: 15600.00,
      originalBalance: 18000.00,
      isInvalid: true,
      validationIssues: ['Missing email address', 'Phone number disconnected'],
      dpd: 540,
      status: 'Legal',
      segment: 'Hard-to-Contact',
      lastContact: '2024-12-20',
      ptp: false,
      assignedAgent: 'Sarah Johnson',
      debtType: 'Auto Loan',
      chargeOffDate: '2023-08-15',
      propensityScore: 28,
      propensityLevel: 'Low',
      bestContactTime: 'Weekday 9-11 AM',
      preferredContactMethod: 'Phone',
      paymentProbability: 22,
      settlementProbability: 35,
      address: null,
      district: 'Unknown',
      zipCode: null,
      annualIncome: 32000,
      dti: 0.49,
      debtPayment: 1560,
      empTitle: 'Warehouse Worker',
      empLength: 8,
      jobCategory: 'Manufacturing',
      homeOwnership: 'Rent',
      dependents: 3,
      bankName: 'Wells Fargo',
      bankAccount: '****9012',
      loanAmount: 18000,
      loanLimit: 20000,
      loanLength: 60,
      interestRate: 15.5,
      creditGrade: 'D',
      creditScore: 580,
      lastPaymentDate: '2024-03-15',
      lastPaymentAmount: 200,
      nextPaymentDate: null,
      totalPaid: 2400,
      applicationDate: '2022-08-15',
      approvalDate: '2022-08-20',
      riskEconomic: 0.62,
      riskMobile: 0.58,
      riskSocial: 0.65,
      socialContacts: 180,
      socialFriendsDelinquent: 12,
      documents: [
        { name: 'ID Proof', uri: 'https://example.com/doc6.pdf', date: '2022-08-15' }
      ],
      paymentHistory: [
        { date: '2024-03-15', amount: 200, type: 'Partial Payment', status: 'Completed' },
        { date: '2024-02-10', amount: 150, type: 'Partial Payment', status: 'Completed' }
      ]
    },
    {
      id: 'ACC-2024-002',
      workflowId: 'WF-2025-001',
      name: 'Priya Mehta',
      phone: '+91-98765-43213',
      email: 'priya.mehta@email.com',
      outstandingBalance: 3200.00,
      originalBalance: 4000.00,
      dpd: 180,
      status: 'Payment Plan',
      segment: 'Ready-to-Pay',
      lastContact: '2025-01-16',
      ptp: true,
      ptpAmount: 1200,
      ptpDate: '2025-01-25',
      assignedAgent: 'John Adams',
      debtType: 'Medical',
      chargeOffDate: '2024-07-15',
      propensityScore: 85,
      propensityLevel: 'High',
      bestContactTime: 'Weekday 5-7 PM',
      preferredContactMethod: 'SMS',
      paymentProbability: 82,
      settlementProbability: 88,
      address: '789 Elm Street',
      district: 'East End',
      zipCode: '10003',
      annualIncome: 52000,
      dti: 0.15,
      debtPayment: 320,
      empTitle: 'Nurse',
      empLength: 7,
      jobCategory: 'Healthcare',
      homeOwnership: 'Own',
      dependents: 2,
      bankName: 'Citibank',
      bankAccount: '****3456',
      loanAmount: 4000,
      loanLimit: 8000,
      loanLength: 12,
      interestRate: 12.0,
      creditGrade: 'A',
      creditScore: 720,
      lastPaymentDate: '2025-01-05',
      lastPaymentAmount: 400,
      nextPaymentDate: '2025-02-05',
      totalPaid: 800,
      applicationDate: '2024-01-15',
      approvalDate: '2024-01-18',
      riskEconomic: 0.22,
      riskMobile: 0.18,
      riskSocial: 0.20,
      socialContacts: 580,
      socialFriendsDelinquent: 1,
      documents: [
        { name: 'ID Proof', uri: 'https://example.com/doc7.pdf', date: '2024-01-15' },
        { name: 'Income Certificate', uri: 'https://example.com/doc8.pdf', date: '2024-01-15' },
        { name: 'Medical Bill', uri: 'https://example.com/doc9.pdf', date: '2024-01-15' }
      ],
      paymentHistory: [
        { date: '2025-01-05', amount: 400, type: 'Payment Plan', status: 'Completed' },
        { date: '2024-12-05', amount: 400, type: 'Payment Plan', status: 'Completed' }
      ]
    },
    {
      id: 'ACC-2024-008',
      workflowId: 'WF-2025-002',
      skipTraceId: 'SKP-2025-002',
      name: 'Rahul Verma',
      phone: null,
      email: null,
      outstandingBalance: 22000.00,
      originalBalance: 25000.00,
      dpd: 720,
      status: 'Skip Trace',
      segment: 'Skip-trace Required',
      lastContact: '2024-10-05',
      ptp: false,
      assignedAgent: 'Mike Wilson',
      debtType: 'Personal Loan',
      chargeOffDate: '2023-01-20',
      propensityScore: 15,
      propensityLevel: 'Very Low',
      bestContactTime: 'Any Time',
      preferredContactMethod: 'Mail',
      paymentProbability: 12,
      settlementProbability: 18,
      address: null,
      district: 'Unknown',
      zipCode: null,
      annualIncome: null,
      dti: null,
      debtPayment: 0,
      empTitle: 'Unknown',
      empLength: null,
      jobCategory: 'Unknown',
      homeOwnership: 'Unknown',
      dependents: null,
      bankName: null,
      bankAccount: null,
      loanAmount: 25000,
      loanLimit: 25000,
      loanLength: 48,
      interestRate: 28.0,
      creditGrade: 'F',
      creditScore: 520,
      lastPaymentDate: null,
      lastPaymentAmount: null,
      nextPaymentDate: null,
      totalPaid: 0,
      applicationDate: '2022-01-20',
      approvalDate: '2022-01-25',
      riskEconomic: 0.78,
      riskMobile: 0.82,
      riskSocial: 0.85,
      socialContacts: 85,
      socialFriendsDelinquent: 18,
      documents: [],
      paymentHistory: []
    },
    {
      id: 'ACC-2024-012',
      workflowId: 'WF-2025-001',
      name: 'Sneha Patel',
      phone: '+91-98765-43214',
      email: 'sneha.patel@email.com',
      outstandingBalance: 5400.00,
      originalBalance: 6000.00,
      dpd: 290,
      status: 'Active',
      segment: 'Ready-to-Pay',
      lastContact: '2025-01-14',
      ptp: false,
      assignedAgent: null,
      debtType: 'Credit Card',
      chargeOffDate: '2024-04-10',
      propensityScore: 71,
      propensityLevel: 'High',
      isInvalid: true,
      validationIssues: ['Invalid bank account number format', 'Credit score mismatch with bureau'],
      bestContactTime: 'Weekday 12-2 PM',
      preferredContactMethod: 'Phone',
      paymentProbability: 68,
      settlementProbability: 75,
      address: '321 Pine Avenue',
      district: 'Midtown',
      zipCode: '10004',
      annualIncome: 48000,
      dti: 0.22,
      debtPayment: 540,
      empTitle: 'Customer Service Rep',
      empLength: 4,
      jobCategory: 'Service',
      homeOwnership: 'Rent',
      dependents: 0,
      bankName: 'TD Bank',
      bankAccount: '****7890',
      loanAmount: 6000,
      loanLimit: 10000,
      loanLength: 18,
      interestRate: 19.5,
      creditGrade: 'B',
      creditScore: 670,
      lastPaymentDate: '2024-11-10',
      lastPaymentAmount: 300,
      nextPaymentDate: '2025-02-10',
      totalPaid: 600,
      applicationDate: '2023-04-10',
      approvalDate: '2023-04-12',
      riskEconomic: 0.32,
      riskMobile: 0.29,
      riskSocial: 0.35,
      socialContacts: 410,
      socialFriendsDelinquent: 2,
      documents: [
        { name: 'ID Proof', uri: 'https://example.com/doc10.pdf', date: '2023-04-10' },
        { name: 'Income Certificate', uri: 'https://example.com/doc11.pdf', date: '2023-04-10' }
      ],
      paymentHistory: [
        { date: '2024-11-10', amount: 300, type: 'Regular Payment', status: 'Completed' },
        { date: '2024-10-10', amount: 300, type: 'Regular Payment', status: 'Completed' }
      ]
    },
    {
      id: 'ACC-10007',
      workflowId: 'WF-2025-002',
      name: 'Thomas Anderson',
      phone: '+1-555-0134',
      email: null,
      outstandingBalance: 9200.00,
      originalBalance: 11000.00,
      dpd: 450,
      status: 'Active',
      segment: 'Hard-to-Contact',
      lastContact: '2025-01-05',
      ptp: false,
      assignedAgent: null,
      debtType: 'Auto Loan',
      chargeOffDate: '2023-11-20',
      propensityScore: 42,
      propensityLevel: 'Medium',
      bestContactTime: 'Weekend 2-5 PM',
      preferredContactMethod: 'SMS',
      paymentProbability: 38,
      settlementProbability: 50,
      address: '654 Cedar Lane',
      district: 'North Side',
      zipCode: '10005',
      annualIncome: 35000,
      dti: 0.42,
      debtPayment: 920,
      empTitle: 'Delivery Driver',
      empLength: 2,
      jobCategory: 'Transportation',
      homeOwnership: 'Rent',
      dependents: 1,
      bankName: 'Capital One',
      bankAccount: '****2345',
      loanAmount: 11000,
      loanLimit: 12000,
      loanLength: 48,
      interestRate: 20.5,
      creditGrade: 'C',
      creditScore: 610,
      lastPaymentDate: '2024-08-05',
      lastPaymentAmount: 250,
      nextPaymentDate: null,
      totalPaid: 1800,
      applicationDate: '2022-11-20',
      approvalDate: '2022-11-22',
      riskEconomic: 0.52,
      riskMobile: 0.48,
      riskSocial: 0.55,
      socialContacts: 220,
      socialFriendsDelinquent: 8,
      documents: [
        { name: 'ID Proof', uri: 'https://example.com/doc12.pdf', date: '2022-11-20' }
      ],
      paymentHistory: [
        { date: '2024-08-05', amount: 250, type: 'Partial Payment', status: 'Completed' },
        { date: '2024-06-15', amount: 300, type: 'Partial Payment', status: 'Completed' }
      ]
    },
    {
      id: 'ACC-10008',
      workflowId: 'WF-2025-001',
      name: 'Susan Clark',
      phone: '+1-555-0135',
      email: 'susan.c@email.com',
      outstandingBalance: 3100.00,
      originalBalance: 4500.00,
      dpd: 195,
      status: 'Payment Plan',
      segment: 'Ready-to-Pay',
      lastContact: '2025-01-16',
      ptp: true,
      ptpAmount: 1000,
      ptpDate: '2025-01-22',
      assignedAgent: 'Sarah Johnson',
      debtType: 'Medical',
      chargeOffDate: '2024-07-05',
      propensityScore: 79,
      propensityLevel: 'High',
      bestContactTime: 'Weekday 3-5 PM',
      preferredContactMethod: 'Email',
      paymentProbability: 76,
      settlementProbability: 82,
      address: '987 Maple Drive',
      district: 'South End',
      zipCode: '10006',
      annualIncome: 58000,
      dti: 0.13,
      debtPayment: 310,
      empTitle: 'Teacher',
      empLength: 10,
      jobCategory: 'Education',
      homeOwnership: 'Own',
      dependents: 3,
      bankName: 'PNC Bank',
      bankAccount: '****6789',
      loanAmount: 4500,
      loanLimit: 9000,
      loanLength: 15,
      interestRate: 10.5,
      creditGrade: 'A',
      creditScore: 740,
      lastPaymentDate: '2025-01-08',
      lastPaymentAmount: 350,
      nextPaymentDate: '2025-02-08',
      totalPaid: 1400,
      applicationDate: '2024-02-05',
      approvalDate: '2024-02-06',
      riskEconomic: 0.18,
      riskMobile: 0.15,
      riskSocial: 0.17,
      socialContacts: 625,
      socialFriendsDelinquent: 0,
      documents: [
        { name: 'ID Proof', uri: 'https://example.com/doc13.pdf', date: '2024-02-05' },
        { name: 'Income Certificate', uri: 'https://example.com/doc14.pdf', date: '2024-02-05' },
        { name: 'Medical Bill', uri: 'https://example.com/doc15.pdf', date: '2024-02-05' },
        { name: 'Payment Plan Agreement', uri: 'https://example.com/doc16.pdf', date: '2024-07-15' }
      ],
      paymentHistory: [
        { date: '2025-01-08', amount: 350, type: 'Payment Plan', status: 'Completed' },
        { date: '2024-12-08', amount: 350, type: 'Payment Plan', status: 'Completed' },
        { date: '2024-11-08', amount: 350, type: 'Payment Plan', status: 'Completed' },
        { date: '2024-10-08', amount: 350, type: 'Payment Plan', status: 'Completed' }
      ]
    }
  ];

  // Initialize debtors with mock data
  useEffect(() => {
    setDebtors(mockDebtors);
  }, []);

  // Get current user (mock - in real app, get from auth context)
  const currentUser = 'Sarah Johnson';

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'primary',
      'Payment Plan': 'success',
      'Legal': 'error',
      'Settled': 'success',
      'Skip Trace': 'warning',
      'Closed': 'default'
    };
    return colors[status] || 'default';
  };

  const getSegmentColor = (segment) => {
    const colors = {
      'Ready-to-Pay': 'success',
      'Contactable but Not Paying': 'warning',
      'Hard-to-Contact': 'error',
      'Skip-trace Required': 'info',
      'Legal Cases': 'secondary'
    };
    return colors[segment] || 'default';
  };

  const getPropensityColor = (score) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    if (score >= 30) return 'error';
    return 'default';
  };

  const getPropensityLevelColor = (level) => {
    const colors = {
      'High': 'success',
      'Medium': 'warning',
      'Low': 'error',
      'Very Low': 'default'
    };
    return colors[level] || 'default';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (debtor) => {
    navigate(`/collections/debtor-management/${debtor.id}`);
  };

  const filteredDebtors = debtors.filter(debtor => {
    const matchesSearch = debtor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debtor.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filters.status === 'all' || debtor.status === filters.status;

    // Segment filter
    const matchesSegment = filters.segment === 'all' || debtor.segment === filters.segment;

    // DPD range filter
    const matchesDPD = (
      (filters.dpdMin === '' || debtor.dpd >= parseInt(filters.dpdMin)) &&
      (filters.dpdMax === '' || debtor.dpd <= parseInt(filters.dpdMax))
    );

    // Balance range filter
    const matchesBalance = (
      (filters.balanceMin === '' || debtor.outstandingBalance >= parseFloat(filters.balanceMin)) &&
      (filters.balanceMax === '' || debtor.outstandingBalance <= parseFloat(filters.balanceMax))
    );

    // Agent filter
    const matchesAgent = filters.agent === 'all' ||
      (filters.agent === 'unassigned' ? !debtor.assignedAgent : debtor.assignedAgent === filters.agent);

    // AI Score range filter
    const matchesAIScore = (
      (filters.aiScoreMin === '' || debtor.aiPropensity >= parseInt(filters.aiScoreMin)) &&
      (filters.aiScoreMax === '' || debtor.aiPropensity <= parseInt(filters.aiScoreMax))
    );

    // Tab-based filtering
    let matchesTab = true;
    if (tabValue === 0) {
      // Unassigned - show only accounts with no assigned agent
      matchesTab = debtor.assignedAgent === null;
    } else if (tabValue === 2) {
      // My Accounts - show only accounts assigned to current user
      matchesTab = debtor.assignedAgent === currentUser;
    } else if (tabValue === 3) {
      // Duplicates - show only debtors with duplicate name or phone
      const hasDuplicateName = debtors.some(d =>
        d.id !== debtor.id && d.name.toLowerCase() === debtor.name.toLowerCase()
      );
      const hasDuplicatePhone = debtors.some(d =>
        d.id !== debtor.id && d.phone === debtor.phone
      );
      matchesTab = hasDuplicateName || hasDuplicatePhone;
    } else if (tabValue === 4) {
      // Invalid Records - show only debtors with validation issues
      matchesTab = debtor.isInvalid === true;
    }
    // tabValue === 1 (All Accounts) - show everything

    return matchesSearch && matchesStatus && matchesSegment && matchesDPD &&
           matchesBalance && matchesAgent && matchesAIScore && matchesTab;
  });

  // Available agents list
  const availableAgents = [
    'Sarah Johnson',
    'Mike Wilson',
    'John Adams',
    'Emily Carter',
    'Robert Lee'
  ];

  // Handler for assigning debtor to agent
  const handleAssignAgent = () => {
    if (!selectedAgent || !assignDebtor) return;

    setDebtors(prevDebtors =>
      prevDebtors.map(d =>
        d.id === assignDebtor.id
          ? { ...d, assignedAgent: selectedAgent }
          : d
      )
    );

    alert(`Successfully assigned ${assignDebtor.name} to ${selectedAgent}`);
    setAssignDialog(false);
    setSelectedAgent('');
    setAssignDebtor(null);
  };

  // Bulk Selection Handlers
  const handleSelectDebtor = (debtorId) => {
    const newSelected = selectedDebtors.includes(debtorId)
      ? selectedDebtors.filter(id => id !== debtorId)
      : [...selectedDebtors, debtorId];
    setSelectedDebtors(newSelected);
  };

  const handleSelectAllDebtors = (event) => {
    if (event.target.checked) {
      const allDebtorIds = filteredDebtors.map(d => d.id);
      setSelectedDebtors(allDebtorIds);
    } else {
      setSelectedDebtors([]);
    }
  };

  const handlePushToDialer = () => {
    if (selectedDebtors.length === 0) {
      setSnackbar({ open: true, message: 'Please select debtors to push to dialer', severity: 'warning' });
      return;
    }

    // Log the action
    selectedDebtors.forEach(debtorId => {
      const debtor = debtors.find(d => d.id === debtorId);
    });

    setSnackbar({
      open: true,
      message: `${selectedDebtors.length} debtor(s) pushed to dialer successfully`,
      severity: 'success'
    });
    setSelectedDebtors([]);
  };

  const handleBulkAssign = () => {
    if (selectedDebtors.length === 0) {
      setSnackbar({ open: true, message: 'Please select debtors to assign', severity: 'warning' });
      return;
    }
    // Open assign dialog with bulk mode
    setAssignDialog(true);
  };

  const handleBulkArchive = () => {
    if (selectedDebtors.length === 0) {
      setSnackbar({ open: true, message: 'Please select debtors to archive', severity: 'warning' });
      return;
    }

    if (window.confirm(`Are you sure you want to archive ${selectedDebtors.length} debtor(s)?`)) {
      const updatedDebtors = debtors.map(debtor =>
        selectedDebtors.includes(debtor.id)
          ? { ...debtor, status: 'Archived' }
          : debtor
      );

      setDebtors(updatedDebtors);

      // Log the action
      selectedDebtors.forEach(debtorId => {
        const debtor = debtors.find(d => d.id === debtorId);
      });

      setSnackbar({
        open: true,
        message: `${selectedDebtors.length} debtor(s) archived successfully`,
        severity: 'success'
      });
      setSelectedDebtors([]);
    }
  };

  const stats = {
    totalAccounts: mockDebtors.length,
    totalOutstanding: mockDebtors.reduce((sum, d) => sum + d.outstandingBalance, 0),
    activePTPs: mockDebtors.filter(d => d.ptp).length,
    legalCases: mockDebtors.filter(d => d.status === 'Legal').length
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Debtor Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all debtor accounts
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CallReceivedIcon />}
            sx={{ mr: 1 }}
            onClick={() => setQrcDialogOpen(true)}
          >
            Call Tagging
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDebtorDialog(true)}
          >
            Add Debtor
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Accounts
              </Typography>
              <Typography variant="h4">
                {stats.totalAccounts.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Outstanding
              </Typography>
              <Typography variant="h4" color="error.main">
                ${stats.totalOutstanding.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active PTPs
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.activePTPs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Legal Cases
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.legalCases}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name, account number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Payment Plan">Payment Plan</MenuItem>
                  <MenuItem value="Legal">Legal</MenuItem>
                  <MenuItem value="Skip Trace">Skip Trace</MenuItem>
                  <MenuItem value="Settled">Settled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Segment Filter */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Segment</InputLabel>
                <Select
                  value={filters.segment}
                  label="Segment"
                  onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                >
                  <MenuItem value="all">All Segments</MenuItem>
                  <MenuItem value="Ready-to-Pay">Ready-to-Pay</MenuItem>
                  <MenuItem value="Contactable">Contactable but Not Paying</MenuItem>
                  <MenuItem value="Hard-to-Contact">Hard-to-Contact</MenuItem>
                  <MenuItem value="Skip-trace">Skip-trace Required</MenuItem>
                  <MenuItem value="Legal">Legal Cases</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* DPD Range */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="DPD Min"
                type="number"
                value={filters.dpdMin}
                onChange={(e) => setFilters({ ...filters, dpdMin: e.target.value })}
                placeholder="Min days"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="DPD Max"
                type="number"
                value={filters.dpdMax}
                onChange={(e) => setFilters({ ...filters, dpdMax: e.target.value })}
                placeholder="Max days"
              />
            </Grid>

            {/* Balance Range */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Balance Min ($)"
                type="number"
                value={filters.balanceMin}
                onChange={(e) => setFilters({ ...filters, balanceMin: e.target.value })}
                placeholder="Min amount"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Balance Max ($)"
                type="number"
                value={filters.balanceMax}
                onChange={(e) => setFilters({ ...filters, balanceMax: e.target.value })}
                placeholder="Max amount"
              />
            </Grid>

            {/* Agent Filter */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Assigned Agent</InputLabel>
                <Select
                  value={filters.agent}
                  label="Assigned Agent"
                  onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
                >
                  <MenuItem value="all">All Agents</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {availableAgents.map(agent => (
                    <MenuItem key={agent} value={agent}>{agent}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* AI Score Range */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="AI Score Min"
                type="number"
                value={filters.aiScoreMin}
                onChange={(e) => setFilters({ ...filters, aiScoreMin: e.target.value })}
                placeholder="Min score (0-100)"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="AI Score Max"
                type="number"
                value={filters.aiScoreMax}
                onChange={(e) => setFilters({ ...filters, aiScoreMax: e.target.value })}
                placeholder="Max score (0-100)"
              />
            </Grid>

            {/* Clear Filters Button */}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => setFilters({
                  status: 'all',
                  segment: 'all',
                  dpdMin: '',
                  dpdMax: '',
                  balanceMin: '',
                  balanceMax: '',
                  agent: 'all',
                  aiScoreMin: '',
                  aiScoreMax: ''
                })}
                sx={{ mt: 1 }}
              >
                Clear All Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Debtor Table */}
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Unassigned" />
            <Tab label="All Accounts" />
            <Tab label="My Accounts" />
            <Tab label="Duplicates" />
            <Tab label="Invalid Records" />
          </Tabs>

          {/* Bulk Action Bar */}
          {selectedDebtors.length > 0 && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body1" fontWeight="600">
                {selectedDebtors.length} debtor(s) selected
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PhoneForwardedIcon />}
                  onClick={handlePushToDialer}
                  color="primary"
                >
                  Push to Dialer
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GroupIcon />}
                  onClick={handleBulkAssign}
                >
                  Assign Agent
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ArchiveIcon />}
                  onClick={handleBulkArchive}
                  color="warning"
                >
                  Archive
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setSelectedDebtors([])}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedDebtors.length === filteredDebtors.length && filteredDebtors.length > 0}
                      indeterminate={selectedDebtors.length > 0 && selectedDebtors.length < filteredDebtors.length}
                      onChange={handleSelectAllDebtors}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>Account #</TableCell>
                  <TableCell>Workflow ID</TableCell>
                  <TableCell>Skip Trace ID</TableCell>
                  <TableCell>Debtor Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Outstanding</TableCell>
                  <TableCell>DPD</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Segment</TableCell>
                  <TableCell>AI Score</TableCell>
                  <TableCell>PTP</TableCell>
                  <TableCell>Agent</TableCell>
                  {tabValue === 4 && <TableCell>Validation Issues</TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDebtors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((debtor) => (
                    <TableRow key={debtor.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedDebtors.includes(debtor.id)}
                          onChange={() => handleSelectDebtor(debtor.id)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {debtor.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {debtor.debtType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debtor.workflowId || 'Not Assigned'}
                          size="small"
                          variant="outlined"
                          color={debtor.workflowId ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {debtor.skipTraceId ? (
                          <Chip
                            label={debtor.skipTraceId}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                            {debtor.name.charAt(0)}
                          </Avatar>
                          {debtor.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          {debtor.phone && (
                            <Typography variant="body2">
                              <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {debtor.phone}
                            </Typography>
                          )}
                          {debtor.email && (
                            <Typography variant="body2">
                              <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {debtor.email}
                            </Typography>
                          )}
                          {!debtor.phone && !debtor.email && (
                            <Chip label="No Contact" size="small" color="error" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="error.main">
                          ${debtor.outstandingBalance.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Original: ${debtor.originalBalance.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${debtor.dpd} days`}
                          size="small"
                          color={debtor.dpd > 360 ? 'error' : debtor.dpd > 180 ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debtor.status}
                          size="small"
                          color={getStatusColor(debtor.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debtor.segment}
                          size="small"
                          variant="outlined"
                          color={getSegmentColor(debtor.segment)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <AIIcon fontSize="small" color="primary" />
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={getPropensityColor(debtor.propensityScore) === 'default' ? 'text.secondary' : `${getPropensityColor(debtor.propensityScore)}.main`}
                            >
                              {debtor.propensityScore}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={debtor.propensityScore}
                              color={getPropensityColor(debtor.propensityScore) === 'default' ? 'inherit' : getPropensityColor(debtor.propensityScore)}
                              sx={{ width: 50, height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {debtor.ptp ? (
                          <Box>
                            <Chip label="Active PTP" size="small" color="success" />
                            <Typography variant="caption" display="block">
                              ${debtor.ptpAmount?.toLocaleString()} on {debtor.ptpDate}
                            </Typography>
                          </Box>
                        ) : (
                          <Chip label="No PTP" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {debtor.assignedAgent}
                        </Typography>
                      </TableCell>
                      {tabValue === 4 && (
                        <TableCell>
                          {debtor.validationIssues && debtor.validationIssues.length > 0 ? (
                            <Box>
                              {debtor.validationIssues.map((issue, index) => (
                                <Chip
                                  key={index}
                                  label={issue}
                                  size="small"
                                  color="error"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No issues
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(debtor)}
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          title="Call Debtor"
                          onClick={() => {
                            setCallDebtor(debtor);
                            setCallDialog(true);
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          title="Send Message"
                          onClick={() => {
                            setMessageDebtor(debtor);
                            setMessageText(`Hello ${debtor.name}, this is regarding your account ${debtor.id}...`);
                            setMessageDialog(true);
                          }}
                        >
                          <MessageIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          title="Assign Agent"
                          onClick={() => {
                            setAssignDebtor(debtor);
                            setSelectedAgent(debtor.assignedAgent || '');
                            setAssignDialog(true);
                          }}
                        >
                          <AssignIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="success"
                          title="Send Payment Link"
                          onClick={() => {
                            setPaymentLinkDebtor(debtor);
                            setPaymentLinkData({
                              amount: debtor.outstandingBalance.toString(),
                              description: `Payment for Account ${debtor.id}`,
                              expiryDays: 7,
                              sendSMS: true,
                              sendEmail: true,
                              sendWhatsApp: false
                            });
                            setPaymentLinkDialog(true);
                          }}
                        >
                          <PaymentIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredDebtors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Debtor Account Details</DialogTitle>
        <DialogContent>
          {selectedDebtor && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Account Number</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedDebtor.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Debtor Name</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedDebtor.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Outstanding Balance</Typography>
                <Typography variant="h6" color="error.main">
                  ${selectedDebtor.outstandingBalance.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Days Past Due</Typography>
                <Typography variant="h6">{selectedDebtor.dpd} days</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Debt Type</Typography>
                <Typography variant="body1">{selectedDebtor.debtType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">Charge-off Date</Typography>
                <Typography variant="body1">{selectedDebtor.chargeOffDate}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Segment</Typography>
                <Chip
                  label={selectedDebtor.segment}
                  color={getSegmentColor(selectedDebtor.segment)}
                  sx={{ mt: 1 }}
                />
              </Grid>

              {/* AI Propensity Score Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" alignItems="center" mb={2}>
                  <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" color="primary">
                    AI Payment Propensity Score
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Propensity Score
                    </Typography>
                    <Chip
                      label={selectedDebtor.propensityLevel}
                      size="small"
                      color={getPropensityLevelColor(selectedDebtor.propensityLevel)}
                    />
                  </Box>
                  <Box display="flex" alignItems="baseline">
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color={getPropensityColor(selectedDebtor.propensityScore) === 'default' ? 'text.secondary' : `${getPropensityColor(selectedDebtor.propensityScore)}.main`}
                    >
                      {selectedDebtor.propensityScore}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" ml={0.5}>
                      /100
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={selectedDebtor.propensityScore}
                    color={getPropensityColor(selectedDebtor.propensityScore) === 'default' ? 'inherit' : getPropensityColor(selectedDebtor.propensityScore)}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2, height: '100%' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Payment Likelihood
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PredictionIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {selectedDebtor.paymentProbability}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Settlement Likelihood
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <PredictionIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {selectedDebtor.settlementProbability}%
                    </Typography>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, border: '2px solid', borderColor: 'info.main' }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TimeIcon sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Best Contact Time
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {selectedDebtor.bestContactTime}
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, border: '2px solid', borderColor: 'success.main' }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ContactMethodIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Preferred Contact Method
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {selectedDebtor.preferredContactMethod}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setDetailsDialog(false);
              setViewProfileDialog(true);
            }}
          >
            View Full Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Debtor Dialog */}
      <Dialog open={addDebtorDialog} onClose={() => setAddDebtorDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Debtor Account</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                placeholder="ACC-10009"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Debtor Name"
                placeholder="John Doe"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                placeholder="+1-555-0123"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="john.doe@email.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Outstanding Balance"
                type="number"
                placeholder="10000.00"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Original Balance"
                type="number"
                placeholder="12000.00"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Debt Type</InputLabel>
                <Select label="Debt Type">
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Personal Loan">Personal Loan</MenuItem>
                  <MenuItem value="Auto Loan">Auto Loan</MenuItem>
                  <MenuItem value="Medical">Medical</MenuItem>
                  <MenuItem value="Student Loan">Student Loan</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Charge-off Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Segment</InputLabel>
                <Select label="Segment">
                  <MenuItem value="Ready-to-Pay">Ready-to-Pay</MenuItem>
                  <MenuItem value="Contactable but Not Paying">Contactable but Not Paying</MenuItem>
                  <MenuItem value="Hard-to-Contact">Hard-to-Contact</MenuItem>
                  <MenuItem value="Skip-trace Required">Skip-trace Required</MenuItem>
                  <MenuItem value="Legal Cases">Legal Cases</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned Agent</InputLabel>
                <Select label="Assigned Agent">
                  <MenuItem value="">Unassigned</MenuItem>
                  <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                  <MenuItem value="Mike Wilson">Mike Wilson</MenuItem>
                  <MenuItem value="John Adams">John Adams</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDebtorDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // In real app, submit form data to backend
              alert('Add debtor functionality will be connected to backend API');
              setAddDebtorDialog(false);
            }}
          >
            Add Debtor
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Full Profile Dialog */}
      <Dialog
        open={viewProfileDialog}
        onClose={() => {
          setViewProfileDialog(false);
          setProfileTabValue(0);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        {selectedDebtor && (
          <>
            {/* Beautiful Header with Gradient */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: 3,
                position: 'relative'
              }}
            >
              <IconButton
                sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
                onClick={() => {
                  setViewProfileDialog(false);
                  setProfileTabValue(0);
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    bgcolor: alpha('#fff', 0.2),
                    border: '3px solid white',
                    boxShadow: 3
                  }}
                >
                  {selectedDebtor.name?.charAt(0)}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {selectedDebtor.name}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                      label={selectedDebtor.id}
                      size="small"
                      sx={{ bgcolor: alpha('#fff', 0.2), color: 'white', fontWeight: 600 }}
                    />
                    <Chip
                      label={selectedDebtor.status}
                      size="small"
                      sx={{
                        bgcolor: selectedDebtor.status === 'Active' ? 'success.main' : 'warning.main',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={selectedDebtor.segment}
                      size="small"
                      sx={{ bgcolor: alpha('#fff', 0.2), color: 'white' }}
                    />
                  </Stack>
                </Box>
              </Box>

              {/* Key Metrics Cards */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                        Outstanding Balance
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="white">
                        ${selectedDebtor.outstandingBalance?.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                        Days Past Due
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="white">
                        {selectedDebtor.dpd} days
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                        Recovery Rate
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="white">
                        {((selectedDebtor.originalBalance - selectedDebtor.outstandingBalance) / selectedDebtor.originalBalance * 100).toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: alpha('#fff', 0.15), backdropFilter: 'blur(10px)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                        Credit Score
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="white">
                        {selectedDebtor.creditScore || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Tabs */}
              <Tabs
                value={profileTabValue}
                onChange={(e, v) => setProfileTabValue(v)}
                sx={{
                  mt: 2,
                  '& .MuiTab-root': {
                    color: alpha('#fff', 0.7),
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: 'white'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'white',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab label="Overview" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Financial" icon={<MoneyIcon />} iconPosition="start" />
                <Tab label="Employment & Address" icon={<WorkIcon />} iconPosition="start" />
                <Tab label="Risk & Scores" icon={<SecurityIcon />} iconPosition="start" />
                <Tab label="Documents & Timeline" icon={<DocumentIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            <DialogContent sx={{ p: 3, bgcolor: 'grey.50' }}>
              {/* Tab 0: Overview */}
              {profileTabValue === 0 && (
                <Grid container spacing={3}>
                  {/* Personal Information */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <PersonIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Personal Information</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Account Number</Typography>
                            <Typography variant="body1" fontWeight="bold">{selectedDebtor.id}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Debtor Name</Typography>
                            <Typography variant="body1" fontWeight="bold">{selectedDebtor.name}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Assigned Agent</Typography>
                            <Typography variant="body1">{selectedDebtor.assignedAgent || 'Unassigned'}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                            <Typography variant="body1">
                              {selectedDebtor.phone || 'Not available'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Email Address</Typography>
                            <Typography variant="body1">
                              {selectedDebtor.email || 'Not available'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Last Contact</Typography>
                            <Typography variant="body1">{selectedDebtor.lastContact}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Account Status */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <MetricsIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Account Status</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Status</Typography>
                            <Chip
                              label={selectedDebtor.status}
                              color={getStatusColor(selectedDebtor.status)}
                              sx={{ mt: 1 }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Segment</Typography>
                            <Chip
                              label={selectedDebtor.segment}
                              color={getSegmentColor(selectedDebtor.segment)}
                              sx={{ mt: 1 }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Charge-off Date</Typography>
                            <Typography variant="body1">{selectedDebtor.chargeOffDate}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* PTP Information */}
                  {selectedDebtor.ptp && (
                    <Grid item xs={12}>
                      <Card sx={{ boxShadow: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <MoneyIcon color="success" />
                            <Typography variant="h6" fontWeight={600}>Promise to Pay (PTP)</Typography>
                          </Box>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Typography variant="body2" color="text.secondary">PTP Status</Typography>
                              <Chip label="Active PTP" color="success" sx={{ mt: 1 }} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="body2" color="text.secondary">PTP Amount</Typography>
                              <Typography variant="h6" color="success.main">
                                ${selectedDebtor.ptpAmount?.toLocaleString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="body2" color="text.secondary">PTP Date</Typography>
                              <Typography variant="body1">{selectedDebtor.ptpDate}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Tab 1: Financial */}
              {/* Tab 1: Financial Information */}
              {profileTabValue === 1 && (
                <Grid container spacing={3}>
                  {/* Financial Overview Card */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <MoneyIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Financial Overview</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Outstanding Balance</Typography>
                            <Typography variant="h6" color="error.main">
                              ${selectedDebtor.outstandingBalance.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Original Balance</Typography>
                            <Typography variant="h6">
                              ${selectedDebtor.originalBalance.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Debt Type</Typography>
                            <Typography variant="body1">{selectedDebtor.debtType}</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Days Past Due</Typography>
                            <Chip
                              label={`${selectedDebtor.dpd} days`}
                              color={selectedDebtor.dpd > 360 ? 'error' : selectedDebtor.dpd > 180 ? 'warning' : 'default'}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Annual Income</Typography>
                            <Typography variant="h6" color="success.main">
                              ${selectedDebtor.annualIncome?.toLocaleString() || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Debt-to-Income Ratio</Typography>
                            <Typography variant="h6">
                              {selectedDebtor.dti ? `${(selectedDebtor.dti * 100).toFixed(1)}%` : 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Monthly Debt Payment</Typography>
                            <Typography variant="body1">
                              ${selectedDebtor.debtPayment?.toLocaleString() || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Credit Score</Typography>
                            <Chip
                              label={selectedDebtor.creditScore || 'N/A'}
                              color={selectedDebtor.creditScore >= 700 ? 'success' : selectedDebtor.creditScore >= 600 ? 'warning' : 'error'}
                              sx={{ mt: 1 }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Loan Details Card */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <CreditCardIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Loan Details</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Interest Rate</Typography>
                            <Typography variant="h6" color="error.main">
                              {selectedDebtor.interestRate}%
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Credit Grade</Typography>
                            <Chip label={selectedDebtor.creditGrade} size="large" />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Loan Term</Typography>
                            <Typography variant="body1">
                              {selectedDebtor.loanLength} months
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">Credit Limit</Typography>
                            <Typography variant="body1">
                              ${selectedDebtor.loanLimit?.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Collection Progress Card */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <TimelineIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Collection Progress</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              Amount Recovered
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {((selectedDebtor.originalBalance - selectedDebtor.outstandingBalance) / selectedDebtor.originalBalance * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(selectedDebtor.originalBalance - selectedDebtor.outstandingBalance) / selectedDebtor.originalBalance * 100}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              Recovered: ${(selectedDebtor.originalBalance - selectedDebtor.outstandingBalance).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Remaining: ${selectedDebtor.outstandingBalance.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Tab 2: Employment & Address */}
              {profileTabValue === 2 && (
                <Grid container spacing={3}>
                  {/* Address & Household Card */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <HomeIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Address & Household</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">Address</Typography>
                            <Typography variant="body1">
                              {selectedDebtor.address || 'Not available'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">District</Typography>
                            <Typography variant="body1">{selectedDebtor.district}</Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">ZIP Code</Typography>
                            <Typography variant="body1">{selectedDebtor.zipCode || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">Home Ownership</Typography>
                            <Typography variant="body1">{selectedDebtor.homeOwnership}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">Dependents</Typography>
                            <Typography variant="body1">{selectedDebtor.dependents ?? 'N/A'}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Employment Information Card */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <WorkIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Employment Information</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Job Title</Typography>
                            <Typography variant="body1">{selectedDebtor.empTitle}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Years Employed</Typography>
                            <Typography variant="body1">{selectedDebtor.empLength ? `${selectedDebtor.empLength} years` : 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Job Category</Typography>
                            <Typography variant="body1">{selectedDebtor.jobCategory}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Bank Account Details Card */}
                  {selectedDebtor.bankName && (
                    <Grid item xs={12}>
                      <Card sx={{ boxShadow: 2 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <BankIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>Bank Account Details</Typography>
                          </Box>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary">Bank Name</Typography>
                              <Typography variant="body1">{selectedDebtor.bankName}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary">Account Number</Typography>
                              <Typography variant="body1">{selectedDebtor.bankAccount}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Tab 3: Payment History & Risk */}
              {profileTabValue === 3 && (
                <Grid container spacing={3}>
                  {/* Payment History Card */}
                  {selectedDebtor.paymentHistory && selectedDebtor.paymentHistory.length > 0 && (
                    <>
                      <Grid item xs={12}>
                        <Card sx={{ boxShadow: 2 }}>
                          <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                              <CreditCardIcon color="primary" />
                              <Typography variant="h6" fontWeight={600}>Payment History</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2} mb={2}>
                              <Grid item xs={12} md={3}>
                                <Typography variant="body2" color="text.secondary">Last Payment Date</Typography>
                                <Typography variant="body1">{selectedDebtor.lastPaymentDate || 'No payments'}</Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="body2" color="text.secondary">Last Payment Amount</Typography>
                                <Typography variant="body1">
                                  ${selectedDebtor.lastPaymentAmount?.toLocaleString() || '0'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="body2" color="text.secondary">Next Payment Due</Typography>
                                <Typography variant="body1">{selectedDebtor.nextPaymentDate || 'Not scheduled'}</Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                                <Typography variant="h6" color="success.main">
                                  ${selectedDebtor.totalPaid?.toLocaleString()}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Typography variant="subtitle2" gutterBottom>Recent Transactions</Typography>
                            {selectedDebtor.paymentHistory.slice(0, 5).map((payment, index) => (
                              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Box>
                                  <Typography variant="body2">{payment.date}</Typography>
                                  <Typography variant="caption" color="text.secondary">{payment.type}</Typography>
                                </Box>
                                <Chip
                                  label={`$${payment.amount.toLocaleString()}`}
                                  size="small"
                                  color="success"
                                />
                              </Box>
                            ))}
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  )}

                  {/* Risk Scores Card */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <SecurityIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Alternative Data & Risk Scores</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>Economic Risk</Typography>
                              <Typography variant="h5" fontWeight="bold" color={selectedDebtor.riskEconomic < 0.4 ? 'success.main' : selectedDebtor.riskEconomic < 0.6 ? 'warning.main' : 'error.main'}>
                                {(selectedDebtor.riskEconomic * 100).toFixed(1)}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={selectedDebtor.riskEconomic * 100}
                                color={selectedDebtor.riskEconomic < 0.4 ? 'success' : selectedDebtor.riskEconomic < 0.6 ? 'warning' : 'error'}
                                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                              />
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>Mobile Behavior Risk</Typography>
                              <Typography variant="h5" fontWeight="bold" color={selectedDebtor.riskMobile < 0.4 ? 'success.main' : selectedDebtor.riskMobile < 0.6 ? 'warning.main' : 'error.main'}>
                                {(selectedDebtor.riskMobile * 100).toFixed(1)}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={selectedDebtor.riskMobile * 100}
                                color={selectedDebtor.riskMobile < 0.4 ? 'success' : selectedDebtor.riskMobile < 0.6 ? 'warning' : 'error'}
                                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                              />
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>Social Risk</Typography>
                              <Typography variant="h5" fontWeight="bold" color={selectedDebtor.riskSocial < 0.4 ? 'success.main' : selectedDebtor.riskSocial < 0.6 ? 'warning.main' : 'error.main'}>
                                {(selectedDebtor.riskSocial * 100).toFixed(1)}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={selectedDebtor.riskSocial * 100}
                                color={selectedDebtor.riskSocial < 0.4 ? 'success' : selectedDebtor.riskSocial < 0.6 ? 'warning' : 'error'}
                                sx={{ mt: 1, height: 6, borderRadius: 3 }}
                              />
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">Total Social Contacts</Typography>
                            <Typography variant="h6">{selectedDebtor.socialContacts?.toLocaleString()}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">Delinquent Contacts</Typography>
                            <Chip
                              label={selectedDebtor.socialFriendsDelinquent}
                              color={selectedDebtor.socialFriendsDelinquent > 5 ? 'error' : 'warning'}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Tab 4: Documents & Timeline */}
              {profileTabValue === 4 && (
                <Grid container spacing={3}>
                  {/* Timeline Card */}
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <TimelineIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Account Timeline</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Application Date</Typography>
                            <Typography variant="body1">{selectedDebtor.applicationDate}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Approval Date</Typography>
                            <Typography variant="body1">{selectedDebtor.approvalDate}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">Account Age</Typography>
                            <Typography variant="body1">
                              {Math.floor((new Date() - new Date(selectedDebtor.applicationDate)) / (1000 * 60 * 60 * 24 * 30))} months
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Documents Card */}
                  {selectedDebtor.documents && selectedDebtor.documents.length > 0 && (
                    <Grid item xs={12}>
                      <Card sx={{ boxShadow: 2 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <DocumentIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>Documents ({selectedDebtor.documents.length})</Typography>
                          </Box>
                          <Divider sx={{ mb: 2 }} />
                          {selectedDebtor.documents.map((doc, index) => (
                            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">{doc.name}</Typography>
                                <Typography variant="caption" color="text.secondary">Uploaded: {doc.date}</Typography>
                              </Box>
                              <Button variant="outlined" size="small" href={doc.uri} target="_blank">
                                View
                              </Button>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
          </DialogContent>
          <DialogActions>
          <Button onClick={() => setViewProfileDialog(false)}>Close</Button>
          <Button variant="outlined" startIcon={<AssignIcon />}>
            Reassign
          </Button>
          <Button variant="outlined" startIcon={<PhoneIcon />} color="primary">
            Call Debtor
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MoneyIcon />}
            onClick={() => {
              setViewProfileDialog(false);
              setRecordPaymentDialog(true);
            }}
          >
            Record Payment
          </Button>
        </DialogActions>
        </>
        )}
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={recordPaymentDialog} onClose={() => setRecordPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          {selectedDebtor && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Account Number</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedDebtor.id}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Debtor Name</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedDebtor.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Outstanding Balance</Typography>
                  <Typography variant="h6" color="error.main">
                    ${selectedDebtor.outstandingBalance.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Payment Amount"
                  type="number"
                  required
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText={`Maximum: $${selectedDebtor.outstandingBalance.toLocaleString()}`}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Payment Method</InputLabel>
                  <Select label="Payment Method">
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="debit_card">Debit Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="ach">ACH</MenuItem>
                    <MenuItem value="check">Check</MenuItem>
                    <MenuItem value="money_order">Money Order</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Transaction Reference / Check Number"
                  placeholder="Enter reference number"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Type</InputLabel>
                  <Select label="Payment Type" defaultValue="regular">
                    <MenuItem value="regular">Regular Payment</MenuItem>
                    <MenuItem value="ptp">Promise to Pay (PTP)</MenuItem>
                    <MenuItem value="settlement">Settlement Payment</MenuItem>
                    <MenuItem value="partial">Partial Payment</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  placeholder="Add any additional notes about this payment..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecordPaymentDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // In real app, submit payment data to backend
              alert('Payment recorded successfully! This will be connected to backend API.');
              setRecordPaymentDialog(false);
            }}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={callDialog} onClose={() => setCallDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Call Debtor - {callDebtor?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Debtor Info */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Account Number</Typography>
                  <Typography variant="body2" fontWeight={600}>{callDebtor?.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{callDebtor?.balance?.toLocaleString('en-IN')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" fontWeight={600}>{callDebtor?.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Days Past Due</Typography>
                  <Typography variant="body2" fontWeight={600} color="error">{callDebtor?.dpd} days</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Call Action */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: isCallActive ? 'success.50' : 'grey.50', border: '2px solid', borderColor: isCallActive ? 'success.main' : 'grey.300' }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {isCallActive ? 'Call in Progress' : 'Ready to Call'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isCallActive ? `Connected to ${callDebtor?.phone}` : `Click the button to initiate call to ${callDebtor?.phone}`}
                  </Typography>
                </Box>
                <Button
                  variant={isCallActive ? "outlined" : "contained"}
                  color={isCallActive ? "error" : "success"}
                  size="large"
                  startIcon={isCallActive ? <CloseIcon /> : <PhoneIcon />}
                  onClick={() => {
                    if (!isCallActive) {
                      setIsCallActive(true);
                      // Simulate call connection
                      setTimeout(() => {
                        alert(`Call connected to ${callDebtor?.name} at ${callDebtor?.phone}\n\nThis will be integrated with your telephony system.`);
                      }, 500);
                    } else {
                      setIsCallActive(false);
                      alert('Call ended. Please fill in the call outcome and notes below.');
                    }
                  }}
                  sx={{ minWidth: 140 }}
                >
                  {isCallActive ? 'End Call' : 'Start Call'}
                </Button>
              </Stack>
            </Paper>

            {/* Call Outcome */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1 }}>Call Outcome *</FormLabel>
              <Select
                value={callOutcome}
                onChange={(e) => setCallOutcome(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Select outcome...</MenuItem>
                <MenuItem value="connected">Connected - Successful Conversation</MenuItem>
                <MenuItem value="promise_to_pay">Promise to Pay</MenuItem>
                <MenuItem value="partial_payment">Partial Payment Committed</MenuItem>
                <MenuItem value="no_answer">No Answer</MenuItem>
                <MenuItem value="voicemail">Left Voicemail</MenuItem>
                <MenuItem value="busy">Line Busy</MenuItem>
                <MenuItem value="wrong_number">Wrong Number</MenuItem>
                <MenuItem value="refused">Debtor Refused to Talk</MenuItem>
                <MenuItem value="disconnected">Number Disconnected</MenuItem>
                <MenuItem value="callback_requested">Callback Requested</MenuItem>
              </Select>
            </FormControl>

            {/* Promise to Pay Fields */}
            {(callOutcome === 'promise_to_pay' || callOutcome === 'partial_payment') && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Promised Amount"
                      type="number"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Promised Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Call Notes */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Call Notes"
              placeholder="Enter detailed notes about the conversation..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Followup Date & Time */}
            <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon fontSize="small" />
                Schedule Followup
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Followup Date"
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Followup Time"
                    type="time"
                    value={followupTime}
                    onChange={(e) => setFollowupTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Schedule a followup call or action if needed
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCallDialog(false);
            setCallNotes('');
            setCallOutcome('');
            setFollowupDate('');
            setFollowupTime('');
            setIsCallActive(false);
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!callOutcome}
            onClick={() => {
              // Log the call activity
              const followupInfo = followupDate ? `\nFollowup scheduled: ${followupDate} ${followupTime || ''}` : '';
              alert(`Call logged successfully!\n\nDebtor: ${callDebtor.name}\nOutcome: ${callOutcome}${followupInfo}\n\nThis will be connected to backend API and telephony system.`);
              setCallDialog(false);
              setCallNotes('');
              setCallOutcome('');
              setFollowupDate('');
              setFollowupTime('');
              setIsCallActive(false);
            }}
          >
            Save Call Log
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message/SMS Dialog */}
      <Dialog open={messageDialog} onClose={() => setMessageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Message - {messageDebtor?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Debtor Info */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Account Number</Typography>
                  <Typography variant="body2" fontWeight={600}>{messageDebtor?.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{messageDebtor?.balance?.toLocaleString('en-IN')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" fontWeight={600}>{messageDebtor?.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight={600}>{messageDebtor?.email}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Message Type Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel sx={{ mb: 1 }}>Message Channel *</FormLabel>
              <RadioGroup
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      value="sms"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MessageIcon fontSize="small" />
                          <Typography variant="body2">SMS</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      value="email"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" />
                          <Typography variant="body2">Email</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      value="whatsapp"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" />
                          <Typography variant="body2">WhatsApp</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      value="line"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ChatIcon fontSize="small" />
                          <Typography variant="body2">Line</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControlLabel
                      value="telegram"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TelegramIcon fontSize="small" />
                          <Typography variant="body2">Telegram</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>

            {/* Template Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1 }}>Message Template (Optional)</FormLabel>
              <Select
                displayEmpty
                onChange={(e) => {
                  if (e.target.value) {
                    setMessageText(e.target.value);
                  }
                }}
              >
                <MenuItem value="">Select a template...</MenuItem>
                <MenuItem value={`Hello ${messageDebtor?.name},\n\nThis is a friendly reminder about your account ${messageDebtor?.id}. Your current outstanding balance is ₹${messageDebtor?.balance?.toLocaleString('en-IN')}.\n\nPlease contact us to discuss payment options.\n\nThank you.`}>
                  Payment Reminder
                </MenuItem>
                <MenuItem value={`Dear ${messageDebtor?.name},\n\nWe noticed your account ${messageDebtor?.id} is ${messageDebtor?.dpd} days overdue. We're here to help you resolve this.\n\nPlease call us at your earliest convenience to discuss a payment plan.\n\nBest regards.`}>
                  Overdue Notice
                </MenuItem>
                <MenuItem value={`Hi ${messageDebtor?.name},\n\nThank you for your recent payment! We appreciate your commitment to resolving your account.\n\nIf you have any questions, please don't hesitate to reach out.\n\nThank you.`}>
                  Payment Acknowledgment
                </MenuItem>
                <MenuItem value={`Dear ${messageDebtor?.name},\n\nWe have flexible payment plans available that can help you manage your account ${messageDebtor?.id}.\n\nReply to this message or call us to learn more about options that work for you.\n\nWe're here to help.`}>
                  Payment Plan Offer
                </MenuItem>
              </Select>
            </FormControl>

            {/* Message Text */}
            <TextField
              fullWidth
              multiline
              rows={messageType === 'sms' || messageType === 'whatsapp' ? 6 : 8}
              label={messageType === 'email' ? 'Email Body' : 'Message Text'}
              placeholder={messageType === 'sms' ? 'Enter SMS message (160 characters recommended)...' : 'Enter your message...'}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              helperText={messageType === 'sms' ? `${messageText.length} characters` : ''}
            />

            {/* Email Subject (only for email) */}
            {messageType === 'email' && (
              <TextField
                fullWidth
                label="Email Subject"
                placeholder="Enter email subject..."
                sx={{ mt: 2 }}
              />
            )}

            {/* File Attachments (for channels that support it) */}
            {(messageType === 'email' || messageType === 'whatsapp' || messageType === 'line' || messageType === 'telegram') && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachFileIcon fontSize="small" />
                  Attachments {messageType === 'email' ? '(Documents, Images, PDFs)' : '(Images, Documents, Videos)'}
                </Typography>

                <input
                  accept={messageType === 'email' ? '*/*' : 'image/*,video/*,.pdf,.doc,.docx'}
                  style={{ display: 'none' }}
                  id="attachment-upload"
                  multiple
                  type="file"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setAttachments(prev => [...prev, ...files.map(file => ({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      file: file
                    }))]);
                  }}
                />
                <label htmlFor="attachment-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    size="small"
                    startIcon={<AttachFileIcon />}
                    sx={{ mt: 1 }}
                  >
                    Choose Files
                  </Button>
                </label>

                {attachments.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Selected Files ({attachments.length}):
                    </Typography>
                    <Stack spacing={1}>
                      {attachments.map((file, index) => (
                        <Paper key={index} sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                            <AttachFileIcon fontSize="small" color="action" />
                            <Box>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {(file.size / 1024).toFixed(1)} KB
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setAttachments(prev => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {messageType === 'email' ? 'Max file size: 25MB per file' : 'Max file size: 16MB per file'}
                </Typography>
              </Paper>
            )}

            {/* Post Communication Actions */}
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon fontSize="small" />
                Post-Communication Actions (Optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Update status and schedule followup after sending this message
              </Typography>

              <Grid container spacing={2}>
                {/* Status Update */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Update Debtor Status</InputLabel>
                    <Select
                      value={postCommStatus}
                      onChange={(e) => setPostCommStatus(e.target.value)}
                      label="Update Debtor Status"
                    >
                      <MenuItem value="">-- No Change --</MenuItem>
                      <MenuItem value="contacted">Contacted</MenuItem>
                      <MenuItem value="responded">Responded</MenuItem>
                      <MenuItem value="promise_to_pay">Promise to Pay</MenuItem>
                      <MenuItem value="negotiating">Negotiating</MenuItem>
                      <MenuItem value="payment_plan">Payment Plan Agreed</MenuItem>
                      <MenuItem value="dispute">Dispute Raised</MenuItem>
                      <MenuItem value="unresponsive">Unresponsive</MenuItem>
                      <MenuItem value="wrong_contact">Wrong Contact Info</MenuItem>
                      <MenuItem value="callback_requested">Callback Requested</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Followup Date and Time */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Followup Date"
                    type="date"
                    value={postCommFollowupDate}
                    onChange={(e) => setPostCommFollowupDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Followup Time"
                    type="time"
                    value={postCommFollowupTime}
                    onChange={(e) => setPostCommFollowupTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setMessageDialog(false);
            setMessageText('');
            setMessageType('sms');
            setAttachments([]);
            setPostCommStatus('');
            setPostCommFollowupDate('');
            setPostCommFollowupTime('');
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!messageText.trim()}
            startIcon={<SendIcon />}
            onClick={() => {
              // Log the message activity
              const channelName = messageType === 'sms' ? 'SMS' :
                                 messageType === 'email' ? 'Email' :
                                 messageType === 'whatsapp' ? 'WhatsApp' :
                                 messageType === 'line' ? 'Line' :
                                 messageType === 'telegram' ? 'Telegram' : messageType;
              const attachmentInfo = attachments.length > 0 ? `\nAttachments: ${attachments.length} file(s)` : '';

              // Post-communication actions info
              let postCommInfo = '';
              if (postCommStatus) {
                const statusLabel = postCommStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                postCommInfo += `\nStatus Updated: ${statusLabel}`;
              }
              if (postCommFollowupDate) {
                postCommInfo += `\nFollowup Scheduled: ${postCommFollowupDate}${postCommFollowupTime ? ' at ' + postCommFollowupTime : ''}`;
              }

              alert(`${channelName} sent successfully!\n\nTo: ${messageDebtor.name}\nChannel: ${messageType}${attachmentInfo}${postCommInfo}\n\nThis will be connected to backend messaging API.`);
              setMessageDialog(false);
              setMessageText('');
              setMessageType('sms');
              setAttachments([]);
              setPostCommStatus('');
              setPostCommFollowupDate('');
              setPostCommFollowupTime('');
            }}
          >
            Send {messageType === 'sms' ? 'SMS' :
                  messageType === 'email' ? 'Email' :
                  messageType === 'whatsapp' ? 'WhatsApp' :
                  messageType === 'line' ? 'Line' :
                  messageType === 'telegram' ? 'Telegram' : 'Message'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Agent</DialogTitle>
        <DialogContent>
          {assignDebtor && (
            <Box sx={{ pt: 2 }}>
              {/* Debtor Info */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Account Number</Typography>
                    <Typography variant="body2" fontWeight={600}>{assignDebtor.id}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Debtor Name</Typography>
                    <Typography variant="body2" fontWeight={600}>{assignDebtor.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                    <Typography variant="body2" fontWeight={600} color="error">
                      ${assignDebtor.outstandingBalance?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Current Agent</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {assignDebtor.assignedAgent || 'Unassigned'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Agent Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Agent *</InputLabel>
                <Select
                  value={selectedAgent}
                  label="Select Agent *"
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Unassign</em>
                  </MenuItem>
                  {availableAgents.map((agent) => (
                    <MenuItem key={agent} value={agent}>
                      {agent}
                      {agent === currentUser && ' (You)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Quick Assign Button */}
              {assignDebtor.assignedAgent !== currentUser && (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AssignIcon />}
                  onClick={() => setSelectedAgent(currentUser)}
                  sx={{ mb: 2 }}
                >
                  Assign to Me
                </Button>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAssignDialog(false);
            setSelectedAgent('');
            setAssignDebtor(null);
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignAgent}
            disabled={!selectedAgent && assignDebtor?.assignedAgent === null}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Link Dialog */}
      <Dialog open={paymentLinkDialog} onClose={() => setPaymentLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Send Payment Link - {paymentLinkDebtor?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Debtor Info */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'success.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Account Number</Typography>
                  <Typography variant="body2" fontWeight={600}>{paymentLinkDebtor?.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Debtor Name</Typography>
                  <Typography variant="body2" fontWeight={600}>{paymentLinkDebtor?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                  <Typography variant="body2" fontWeight={600} color="error">
                    ${paymentLinkDebtor?.outstandingBalance?.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Contact</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {paymentLinkDebtor?.phone}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Amount */}
            <TextField
              fullWidth
              label="Payment Amount"
              type="number"
              value={paymentLinkData.amount}
              onChange={(e) => setPaymentLinkData({ ...paymentLinkData, amount: e.target.value })}
              sx={{ mb: 2 }}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={paymentLinkData.description}
              onChange={(e) => setPaymentLinkData({ ...paymentLinkData, description: e.target.value })}
              sx={{ mb: 2 }}
              placeholder="Enter payment description..."
            />

            {/* Expiry Days */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Link Expiry</InputLabel>
              <Select
                value={paymentLinkData.expiryDays}
                label="Link Expiry"
                onChange={(e) => setPaymentLinkData({ ...paymentLinkData, expiryDays: e.target.value })}
              >
                <MenuItem value={1}>1 Day</MenuItem>
                <MenuItem value={3}>3 Days</MenuItem>
                <MenuItem value={7}>7 Days</MenuItem>
                <MenuItem value={15}>15 Days</MenuItem>
                <MenuItem value={30}>30 Days</MenuItem>
              </Select>
            </FormControl>

            {/* Send Options */}
            <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color="info.main">
                Send Payment Link Via
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentLinkData.sendSMS}
                    onChange={(e) => setPaymentLinkData({ ...paymentLinkData, sendSMS: e.target.checked })}
                    disabled={!paymentLinkDebtor?.phone}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MessageIcon fontSize="small" />
                    <Typography variant="body2">SMS {!paymentLinkDebtor?.phone && '(No phone number)'}</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentLinkData.sendEmail}
                    onChange={(e) => setPaymentLinkData({ ...paymentLinkData, sendEmail: e.target.checked })}
                    disabled={!paymentLinkDebtor?.email}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">Email {!paymentLinkDebtor?.email && '(No email)'}</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentLinkData.sendWhatsApp}
                    onChange={(e) => setPaymentLinkData({ ...paymentLinkData, sendWhatsApp: e.target.checked })}
                    disabled={!paymentLinkDebtor?.phone}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChatIcon fontSize="small" />
                    <Typography variant="body2">WhatsApp {!paymentLinkDebtor?.phone && '(No phone number)'}</Typography>
                  </Box>
                }
              />
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setPaymentLinkDialog(false);
            setPaymentLinkDebtor(null);
            setPaymentLinkData({
              amount: '',
              description: '',
              expiryDays: 7,
              sendSMS: true,
              sendEmail: true,
              sendWhatsApp: false
            });
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={!paymentLinkData.amount || (!paymentLinkData.sendSMS && !paymentLinkData.sendEmail && !paymentLinkData.sendWhatsApp)}
            startIcon={<SendIcon />}
            onClick={() => {
              const channels = [];
              if (paymentLinkData.sendSMS) channels.push('SMS');
              if (paymentLinkData.sendEmail) channels.push('Email');
              if (paymentLinkData.sendWhatsApp) channels.push('WhatsApp');

              alert(`Payment link created and sent successfully!\n\nTo: ${paymentLinkDebtor.name}\nAmount: $${paymentLinkData.amount}\nChannels: ${channels.join(', ')}\nExpiry: ${paymentLinkData.expiryDays} days\n\nThis will be connected to payment gateway API.`);

              setSnackbar({
                open: true,
                message: `Payment link sent to ${paymentLinkDebtor.name} via ${channels.join(', ')}`,
                severity: 'success'
              });

              setPaymentLinkDialog(false);
              setPaymentLinkDebtor(null);
              setPaymentLinkData({
                amount: '',
                description: '',
                expiryDays: 7,
                sendSMS: true,
                sendEmail: true,
                sendWhatsApp: false
              });
            }}
          >
            Create & Send Link
          </Button>
        </DialogActions>
      </Dialog>

      {/* QRC Dialog */}
      <DebtorQRCDialog
        open={qrcDialogOpen}
        onClose={() => setQrcDialogOpen(false)}
        onSubmit={(callData) => {
          console.log('Call Tagged:', callData);
          setSnackbar({
            open: true,
            message: `Call tagged successfully for ${callData.debtorName || 'debtor'}`,
            severity: 'success'
          });
        }}
      />

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

export default DebtorManagement;
