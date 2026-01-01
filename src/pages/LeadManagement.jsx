import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BulkUpload from '../components/common/BulkUpload';
import FailedRecordsViewer from '../components/common/FailedRecordsViewer';
import { useDedupe } from '../context/DedupeContext';
import { useVahan } from '../context/VahanContext';
import { History as HistoryIcon } from '@mui/icons-material';
import LeadScoringIndicator from '../components/leads/LeadScoringIndicator';
import PriorityIndicator from '../components/leads/PriorityIndicator';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  Pagination,
  useTheme,
  alpha,
  Checkbox,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Note as NoteIcon,
  ChangeCircle as ChangeCircleIcon,
  Group as GroupIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Call as CallIcon,
  Description as DocumentIcon,
  DirectionsCar as VehicleIcon,
  FileCopy as FileIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  InsertDriveFile as InsuranceDocIcon,
  CloudUpload as CloudUploadIcon,
  Phone as PhoneForwardedIcon,
  CloudDownload as CloudDownloadIcon,
  VerifiedUser as VerifiedUserIcon,
  Error as ErrorIcon,
  PushPin as PushPinIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { analyzeEmail } from '../services/emailAI';

// Mock data for leads with Premium/Regular types
const mockLeads = [
  {
    id: 1,
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@infosys.com',
    phone: '+91-9876543210',
    company: 'Infosys Technologies',
    position: 'Senior Manager',
    source: 'Website',
    status: 'New',
    priority: 'Hot',
    leadType: 'Premium',
    assignedTo: 'Priya Patel',
    assignedToId: 'priya.patel',
    value: 500000,
    expectedCloseDate: '2024-02-15',
    lastContactDate: '2024-01-15',
    notes: 'Interested in comprehensive vehicle insurance for company fleet.',
    tags: ['Corporate', 'Fleet'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    preferredLanguage: 'Hindi',
    totalCalls: 3,
    score: 85
  },
  {
    id: 2,
    firstName: 'Priya',
    lastName: 'Verma',
    email: 'priya.verma@tcs.com',
    phone: '+91-9876543211',
    company: 'Tata Consultancy Services',
    position: 'HR Director',
    source: 'Referral',
    status: 'Qualified',
    priority: 'Warm',
    leadType: 'Premium',
    assignedTo: 'Amit Kumar',
    assignedToId: 'amit.kumar',
    value: 750000,
    score: 72,
    expectedCloseDate: '2024-02-28',
    lastContactDate: '2024-01-12',
    notes: 'Looking for group health insurance for 1000+ employees.',
    tags: ['Group', 'Health'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    preferredLanguage: 'Bengali',
    totalCalls: 5
  },
  {
    id: 3,
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram@startupindia.co.in',
    phone: '+91-9876543212',
    company: 'StartupIndia Tech',
    position: 'Founder',
    source: 'Cold Call',
    status: 'Contacted',
    priority: 'High',
    leadType: 'Regular',
    assignedTo: 'Priya Patel',
    assignedToId: 'priya.patel',
    value: 250000,
    expectedCloseDate: '2024-03-10',
    lastContactDate: '2024-01-14',
    notes: 'Startup looking for comprehensive business insurance.',
    tags: ['Startup', 'Business'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14',
    preferredLanguage: 'English',
    totalCalls: 2
  },
  {
    id: 4,
    firstName: 'Anjali',
    lastName: 'Desai',
    email: 'anjali.desai@wipro.com',
    phone: '+91-9876543213',
    company: 'Wipro Limited',
    position: 'Operations Head',
    source: 'Email Campaign',
    status: 'Proposal',
    priority: 'High',
    leadType: 'Premium',
    assignedTo: '',
    assignedToId: '',
    value: 1200000,
    expectedCloseDate: '2024-02-20',
    lastContactDate: '2024-01-16',
    notes: 'Interested in comprehensive employee benefits package.',
    tags: ['Corporate', 'Employee Benefits'],
    createdAt: '2024-01-07',
    updatedAt: '2024-01-16',
    preferredLanguage: 'Gujarati'
  },
  {
    id: 5,
    firstName: 'Arjun',
    lastName: 'Reddy',
    email: 'arjun.reddy@techm.com',
    phone: '+91-9876543214',
    company: 'Tech Mahindra',
    position: 'Project Manager',
    source: 'LinkedIn',
    status: 'Negotiation',
    priority: 'Medium',
    leadType: 'Regular',
    assignedTo: '',
    assignedToId: '',
    value: 450000,
    expectedCloseDate: '2024-03-05',
    lastContactDate: '2024-01-18',
    notes: 'Discussing terms for team health insurance.',
    tags: ['Corporate', 'Health'],
    createdAt: '2024-01-09',
    updatedAt: '2024-01-18',
    preferredLanguage: 'Telugu'
  },
  {
    id: 6,
    firstName: 'Neha',
    lastName: 'Kapoor',
    email: 'neha@startupgrow.in',
    phone: '+91-9876543215',
    company: 'StartupGrow Solutions',
    position: 'CEO',
    source: 'Website',
    status: 'New',
    priority: 'High',
    leadType: 'Premium',
    assignedTo: '',
    assignedToId: '',
    value: 300000,
    expectedCloseDate: '2024-03-15',
    lastContactDate: '2024-01-19',
    notes: 'New startup seeking comprehensive insurance coverage.',
    tags: ['Startup', 'Comprehensive'],
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19',
    preferredLanguage: 'Punjabi'
  },
  {
    id: 7,
    firstName: 'Rajesh',
    lastName: 'Malhotra',
    email: 'rajesh.malhotra@hcl.com',
    phone: '+91-9876543216',
    company: 'HCL Technologies',
    position: 'Finance Director',
    source: 'Trade Show',
    status: 'Qualified',
    priority: 'High',
    leadType: 'Premium',
    assignedTo: 'Priya Patel',
    assignedToId: 'priya.patel',
    value: 900000,
    expectedCloseDate: '2024-02-25',
    lastContactDate: '2024-01-17',
    notes: 'Interested in group insurance and employee benefits.',
    tags: ['Corporate', 'Group'],
    createdAt: '2024-01-11',
    updatedAt: '2024-01-17'
  },
  {
    id: 8,
    firstName: 'Sanjay',
    lastName: 'Gupta',
    email: 'sanjay@microtech.in',
    phone: '+91-9876543217',
    company: 'Microtech Solutions',
    position: 'Managing Director',
    source: 'Referral',
    status: 'Proposal',
    priority: 'Medium',
    leadType: 'Regular',
    assignedTo: '',
    assignedToId: '',
    value: 600000,
    expectedCloseDate: '2024-03-20',
    lastContactDate: '2024-01-20',
    notes: 'Looking for vehicle and property insurance.',
    tags: ['SME', 'Property'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    preferredLanguage: 'Marathi'
  },
  {
    id: 9,
    firstName: 'Meera',
    lastName: 'Iyer',
    email: 'meera.iyer@cognizant.com',
    phone: '+91-9876543218',
    company: 'Cognizant Technology',
    position: 'HR Manager',
    source: 'Email',
    status: 'Contacted',
    priority: 'Low',
    leadType: 'Regular',
    assignedTo: '',
    assignedToId: '',
    value: 400000,
    expectedCloseDate: '2024-03-25',
    lastContactDate: '2024-01-21',
    notes: 'Evaluating health insurance options for employees.',
    tags: ['Corporate', 'Health'],
    createdAt: '2024-01-16',
    updatedAt: '2024-01-21',
    preferredLanguage: 'Tamil'
  },
  {
    id: 10,
    firstName: 'Arun',
    lastName: 'Patel',
    email: 'arun.patel@zoho.com',
    phone: '+91-9876543219',
    company: 'Zoho Corporation',
    position: 'Technical Director',
    source: 'Website',
    status: 'New',
    priority: 'Medium',
    leadType: 'Premium',
    assignedTo: 'Amit Kumar',
    assignedToId: 'amit.kumar',
    value: 550000,
    expectedCloseDate: '2024-03-30',
    lastContactDate: '2024-01-22',
    notes: 'Interested in cyber insurance and liability coverage.',
    tags: ['Corporate', 'Cyber'],
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  },
  // Fleet examples for duplicate detection
  {
    id: 12,
    firstName: 'Fleet',
    lastName: 'Manager1',
    email: 'fleet1@abclogistics.com',
    phone: '+91-9876543221',
    company: 'ABC Logistics',
    position: 'Fleet Manager',
    source: 'Website',
    status: 'New',
    priority: 'High',
    leadType: 'Regular',
    assignedTo: 'Priya Patel',
    assignedToId: 'priya.patel',
    value: 200000,
    expectedCloseDate: '2024-04-10',
    lastContactDate: '2024-01-24',
    notes: 'Fleet insurance for 10 trucks.',
    tags: ['Fleet', 'Commercial'],
    createdAt: '2024-01-24',
    updatedAt: '2024-01-24',
    product: 'Insurance',
    subProduct: 'Vehicle Insurance',
    vehicleRegistrationNumber: 'MH14AB1001',
    vehicleType: 'Commercial Vehicle'
  },
  {
    id: 13,
    firstName: 'Fleet',
    lastName: 'Manager2',
    email: 'fleet2@abclogistics.com',
    phone: '+91-9876543222',
    company: 'ABC Logistics',
    position: 'Operations Head',
    source: 'Referral',
    status: 'Contacted',
    priority: 'High',
    leadType: 'Regular',
    assignedTo: 'Amit Kumar',
    assignedToId: 'amit.kumar',
    value: 180000,
    expectedCloseDate: '2024-04-15',
    lastContactDate: '2024-01-25',
    notes: 'Additional fleet vehicles for ABC Logistics.',
    tags: ['Fleet', 'Commercial'],
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
    product: 'Insurance',
    subProduct: 'Vehicle Insurance',
    vehicleRegistrationNumber: 'MH14AB1002',
    vehicleType: 'Commercial Vehicle'
  },
  {
    id: 11,
    firstName: 'Kavita',
    lastName: 'Mehta',
    email: 'kavita@edutech.co.in',
    phone: '+91-9876543220',
    company: 'EduTech Solutions',
    position: 'CEO',
    source: 'LinkedIn',
    status: 'Qualified',
    priority: 'High',
    leadType: 'Premium',
    assignedTo: 'Priya Patel',
    assignedToId: 'priya.patel',
    value: 800000,
    expectedCloseDate: '2024-04-05',
    lastContactDate: '2024-01-23',
    notes: 'EdTech company looking for comprehensive coverage.',
    tags: ['EdTech', 'Comprehensive'],
    createdAt: '2024-01-17',
    updatedAt: '2024-01-23'
  }
];

// Helper function to normalize priority values from High/Medium/Low to Hot/Warm/Cold
const normalizePriority = (priority) => {
  if (!priority) return 'Cold';
  const lowerPriority = priority.toLowerCase();
  if (lowerPriority === 'high' || lowerPriority === 'hot') return 'Hot';
  if (lowerPriority === 'medium' || lowerPriority === 'warm') return 'Warm';
  return 'Cold';
};

// Helper function to calculate lead score based on FRD scoring model
// Engagement: 30%, Budget: 25%, Timeline: 20%, Authority: 15%, Need: 10%
const calculateLeadScore = (lead) => {
  // 1. ENGAGEMENT SCORE (30%) - Based on interactions, responses, and status
  const calculateEngagementScore = () => {
    let engagementScore = 0;

    // Status progression indicates engagement level
    const statusScores = {
      'New': 30,
      'Contacted': 45,
      'Qualified': 70,
      'Proposal': 85,
      'Negotiation': 95,
      'Won': 100,
      'Lost': 10,
      'Archived': 5
    };
    engagementScore += (statusScores[lead.status] || 30) * 0.5; // 50% weight on status

    // Call/interaction frequency (0-10+ calls mapped to 0-100)
    const callScore = Math.min((lead.totalCalls || 0) * 10, 100);
    engagementScore += callScore * 0.3; // 30% weight on calls

    // Lead type indicates engagement potential
    const typeScore = lead.leadType === 'Premium' ? 100 : 70;
    engagementScore += typeScore * 0.2; // 20% weight on lead type

    return Math.min(engagementScore, 100);
  };

  // 2. BUDGET FIT SCORE (25%) - Based on deal value and lead capacity
  const calculateBudgetScore = () => {
    let budgetScore = 0;

    // Deal value scoring (normalized)
    if (!lead.value || lead.value === 0) {
      budgetScore = 30; // Unknown budget
    } else if (lead.value >= 1500000) {
      budgetScore = 100; // High value
    } else if (lead.value >= 1000000) {
      budgetScore = 90;
    } else if (lead.value >= 750000) {
      budgetScore = 80;
    } else if (lead.value >= 500000) {
      budgetScore = 70;
    } else if (lead.value >= 250000) {
      budgetScore = 60;
    } else {
      budgetScore = 40; // Lower value deals
    }

    // Premium leads typically have better budget alignment
    if (lead.leadType === 'Premium') {
      budgetScore = Math.min(budgetScore + 10, 100);
    }

    return budgetScore;
  };

  // 3. TIMELINE SCORE (20%) - Based on expected close date and urgency
  const calculateTimelineScore = () => {
    let timelineScore = 50; // Default/unknown timeline

    if (lead.expectedCloseDate) {
      const today = new Date();
      const closeDate = new Date(lead.expectedCloseDate);
      const daysUntilClose = Math.ceil((closeDate - today) / (1000 * 60 * 60 * 24));

      // Ideal timeline: 15-60 days (higher score)
      if (daysUntilClose < 0) {
        timelineScore = 20; // Overdue
      } else if (daysUntilClose <= 7) {
        timelineScore = 100; // Closing within a week - very hot
      } else if (daysUntilClose <= 15) {
        timelineScore = 95; // Closing within 2 weeks
      } else if (daysUntilClose <= 30) {
        timelineScore = 85; // Closing within a month
      } else if (daysUntilClose <= 60) {
        timelineScore = 70; // Closing within 2 months
      } else if (daysUntilClose <= 90) {
        timelineScore = 55; // Closing within 3 months
      } else {
        timelineScore = 35; // Long timeline
      }
    }

    // Priority affects timeline urgency
    const priority = normalizePriority(lead.priority);
    if (priority === 'Hot') timelineScore = Math.min(timelineScore + 10, 100);
    else if (priority === 'Warm') timelineScore = Math.min(timelineScore + 5, 100);

    // Status affects timeline confidence
    if (lead.status === 'Negotiation') timelineScore = Math.min(timelineScore + 15, 100);
    else if (lead.status === 'Proposal') timelineScore = Math.min(timelineScore + 10, 100);

    return timelineScore;
  };

  // 4. AUTHORITY SCORE (15%) - Based on contact position and decision-making power
  const calculateAuthorityScore = () => {
    let authorityScore = 50; // Default

    // Position-based authority
    const position = (lead.position || '').toLowerCase();

    // C-Level / Top Management
    if (position.includes('ceo') || position.includes('cto') || position.includes('cfo') ||
      position.includes('coo') || position.includes('founder') || position.includes('owner') ||
      position.includes('president') || position.includes('chairman')) {
      authorityScore = 100;
    }
    // VP / Director Level
    else if (position.includes('vp') || position.includes('vice president') ||
      position.includes('director') || position.includes('head')) {
      authorityScore = 90;
    }
    // Manager Level
    else if (position.includes('manager') || position.includes('lead')) {
      authorityScore = 75;
    }
    // Senior Level
    else if (position.includes('senior') || position.includes('sr')) {
      authorityScore = 65;
    }
    // Individual Contributor
    else if (position.includes('executive') || position.includes('specialist') ||
      position.includes('officer')) {
      authorityScore = 50;
    }
    // Unknown or junior
    else {
      authorityScore = 40;
    }

    // Premium leads often have better authority access
    if (lead.leadType === 'Premium') {
      authorityScore = Math.min(authorityScore + 5, 100);
    }

    return authorityScore;
  };

  // 5. NEED SCORE (10%) - Based on source and lead context
  const calculateNeedScore = () => {
    let needScore = 50; // Default

    // Source indicates need/intent level
    const source = (lead.source || '').toLowerCase();

    if (source.includes('referral')) {
      needScore = 95; // High intent - someone referred them
    } else if (source.includes('website') || source.includes('demo request')) {
      needScore = 85; // Self-service inquiry - active intent
    } else if (source.includes('linkedin') || source.includes('social')) {
      needScore = 75; // Social engagement
    } else if (source.includes('email campaign')) {
      needScore = 65; // Marketing qualified
    } else if (source.includes('cold call') || source.includes('outbound')) {
      needScore = 45; // Outbound - lower initial intent
    } else {
      needScore = 60; // Other sources
    }

    // Status progression indicates validated need
    if (lead.status === 'Qualified') needScore = Math.min(needScore + 10, 100);
    else if (lead.status === 'Proposal' || lead.status === 'Negotiation') needScore = 100;

    // Tags can indicate specific needs
    if (lead.tags && Array.isArray(lead.tags)) {
      if (lead.tags.some(tag => tag.toLowerCase().includes('urgent'))) {
        needScore = Math.min(needScore + 15, 100);
      }
    }

    return needScore;
  };

  // Calculate all factor scores
  const engagementScore = calculateEngagementScore();
  const budgetScore = calculateBudgetScore();
  const timelineScore = calculateTimelineScore();
  const authorityScore = calculateAuthorityScore();
  const needScore = calculateNeedScore();

  // Apply weights and calculate final score
  // Engagement: 30%, Budget: 25%, Timeline: 20%, Authority: 15%, Need: 10%
  const finalScore = (
    (engagementScore * 0.30) +
    (budgetScore * 0.25) +
    (timelineScore * 0.20) +
    (authorityScore * 0.15) +
    (needScore * 0.10)
  );

  // Store factor breakdown for detailed view (optional)
  if (lead.scoreBreakdown === undefined) {
    lead.scoreBreakdown = {
      engagement: Math.round(engagementScore),
      budget: Math.round(budgetScore),
      timeline: Math.round(timelineScore),
      authority: Math.round(authorityScore),
      need: Math.round(needScore)
    };
  }

  return Math.round(finalScore);
};

const LeadManagement = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { checkDuplicate } = useDedupe();
  const { verifyVehicle, bulkVerifyVehicles, getVerificationByLeadId, isVehicleVerified, loading: vahanLoading } = useVahan();
  const [leads, setLeads] = useState(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState(mockLeads);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [showUploadHistory, setShowUploadHistory] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCallLead, setSelectedCallLead] = useState(null);

  // Bulk operations state
  const [selectedLeads, setSelectedLeads] = useState([]);

  // Pin to top states
  const [pinnedLeads, setPinnedLeads] = useState(() => {
    const saved = localStorage.getItem('pinnedLeads');
    return saved ? JSON.parse(saved) : [];
  });

  // Starred leads states
  const [starredLeads, setStarredLeads] = useState(() => {
    const saved = localStorage.getItem('starredLeads');
    return saved ? JSON.parse(saved) : [];
  });

  const handleToggleStar = (e, leadId) => {
    e.stopPropagation();
    const isStarred = starredLeads.includes(leadId);
    let newStarred;
    if (isStarred) {
      newStarred = starredLeads.filter(id => id !== leadId);
    } else {
      newStarred = [...starredLeads, leadId];
    }
    setStarredLeads(newStarred);
    localStorage.setItem('starredLeads', JSON.stringify(newStarred));
  };
  const [bulkAssignmentDialog, setBulkAssignmentDialog] = useState(false);
  const [bulkAssignmentAgent, setBulkAssignmentAgent] = useState('');
  const [agentTableOpen, setAgentTableOpen] = useState(false);
  const [autoAssignDialog, setAutoAssignDialog] = useState(false);
  const [leadTypeFilter, setLeadTypeFilter] = useState('All');
  const [languageAssignDialog, setLanguageAssignDialog] = useState(false);
  const [assignmentPreview, setAssignmentPreview] = useState([]);

  // Quick update state
  const [quickUpdateDialog, setQuickUpdateDialog] = useState(false);
  const [quickUpdateData, setQuickUpdateData] = useState({
    notes: '',
    status: '',
    followUpDate: ''
  });

  // Upload data dialog state
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('excel');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // New UI features state
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [leadTag, setLeadTag] = useState('New Business');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [stateLeads, setStateLeads] = useState([]);
  const [expiryCheckDialog, setExpiryCheckDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [navCheckLoading, setNavCheckLoading] = useState(false);

  // Vahan verification state
  const [vahanDialog, setVahanDialog] = useState(false);
  const [vahanVerificationLead, setVahanVerificationLead] = useState(null);
  const [vahanVehicleNumber, setVahanVehicleNumber] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: '',
    status: 'New',
    priority: 'Medium',
    leadType: 'Regular',
    assignedTo: '',
    assignedToId: '',
    value: '',
    expectedCloseDate: '',
    notes: '',
    tags: [],
    product: 'Insurance',
    subProduct: '',
    vehicleRegistrationNumber: '',
    vehicleType: ''
  });

  // Mock agents with ratings and language capabilities for assignment
  const agents = [
    { id: 'priya.patel', name: 'Priya Patel', rating: 4.8, totalLeads: 45, closedDeals: 32, specialization: 'Corporate Insurance', languages: ['English', 'Hindi', 'Gujarati'] },
    { id: 'amit.kumar', name: 'Amit Kumar', rating: 4.6, totalLeads: 38, closedDeals: 28, specialization: 'Health Insurance', languages: ['English', 'Hindi', 'Bengali'] },
    { id: 'sneha.gupta', name: 'Sneha Gupta', rating: 4.9, totalLeads: 52, closedDeals: 41, specialization: 'Vehicle Insurance', languages: ['English', 'Tamil', 'Telugu'] },
    { id: 'rajesh.kumar', name: 'Rajesh Kumar', rating: 4.7, totalLeads: 41, closedDeals: 30, specialization: 'Life Insurance', languages: ['English', 'Marathi', 'Kannada'] },
    { id: 'deepak.sharma', name: 'Deepak Sharma', rating: 4.5, totalLeads: 35, closedDeals: 24, specialization: 'Property Insurance', languages: ['English', 'Punjabi', 'Urdu'] }
  ];

  // Keep users for backward compatibility
  const users = agents.map(agent => ({ id: agent.id, name: agent.name }));

  const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
  const sourceOptions = ['Website', 'Referral', 'Cold Call', 'Email Campaign', 'Social Media', 'Trade Show', 'Other'];
  const productOptions = ['Insurance'];
  const subProductOptions = ['Life Insurance', 'Vehicle Insurance', 'Health Insurance'];
  const vehicleTypeOptions = ['Private Car', 'Two Wheeler', 'Three Wheeler', 'Taxi', 'Commercial Vehicle', 'Truck', 'Bus'];
  const leadTagOptions = ['New Business', 'Renewal'];
  const leadTypeOptions = ['Premium', 'Regular'];
  const stateOptions = ['Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'];

  // Mock vehicle verification data
  const mockVehicleData = {
    'KA01AB1234': { make: 'Honda', model: 'City', year: '2020', owner: 'Rajesh Kumar', fuel: 'Petrol' },
    'AP09CD5678': { make: 'Maruti', model: 'Swift', year: '2019', owner: 'Priya Sharma', fuel: 'Petrol' },
    'TN12EF9012': { make: 'Hyundai', model: 'Creta', year: '2021', owner: 'Vikram Singh', fuel: 'Diesel' }
  };

  // Mock state-wise leads
  const stateWiseLeads = {
    'Karnataka': mockLeads.slice(0, 3),
    'Andhra Pradesh': mockLeads.slice(3, 6),
    'Tamil Nadu': mockLeads.slice(6, 9),
    'Maharashtra': mockLeads.slice(9, 11)
  };

  // Mock policy expiry data
  const mockPolicies = [
    {
      id: 1,
      policyNumber: 'POL-2024-001',
      crmExpiryDate: '2024-12-31',
      navExpiryDate: '2024-12-31',
      status: 'Active',
      customerName: 'Rahul Sharma',
      vehicleNumber: 'MH12AB1234'
    },
    {
      id: 2,
      policyNumber: 'POL-2024-002',
      crmExpiryDate: '2024-02-15',
      navExpiryDate: '2024-02-10',
      status: 'Due Soon',
      customerName: 'Priya Verma',
      vehicleNumber: 'KA01CD5678'
    },
    {
      id: 3,
      policyNumber: 'POL-2023-089',
      crmExpiryDate: '2024-01-10',
      navExpiryDate: '2024-01-05',
      status: 'Expired',
      customerName: 'Vikram Singh',
      vehicleNumber: 'TN09EF9012'
    }
  ];

  // Filter and search functionality
  useEffect(() => {
    let filtered = leads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(lead => lead.priority === priorityFilter);
    }

    // Assigned filter
    if (assignedFilter !== 'All') {
      filtered = filtered.filter(lead => lead.assignedTo === assignedFilter);
    }

    // Lead type filter
    if (leadTypeFilter !== 'All') {
      filtered = filtered.filter(lead => lead.leadType === leadTypeFilter);
    }

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [leads, searchTerm, statusFilter, priorityFilter, assignedFilter, leadTypeFilter]);

  const handleOpenDialog = (lead = null) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        position: lead.position,
        source: lead.source,
        status: lead.status,
        priority: lead.priority,
        leadType: lead.leadType || 'Regular',
        assignedTo: lead.assignedTo,
        assignedToId: lead.assignedToId,
        value: lead.value,
        expectedCloseDate: lead.expectedCloseDate,
        notes: lead.notes,
        tags: lead.tags,
        product: lead.product || 'Insurance',
        subProduct: lead.subProduct || '',
        vehicleRegistrationNumber: lead.vehicleRegistrationNumber || '',
        vehicleType: lead.vehicleType || ''
      });
    } else {
      setEditingLead(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        source: '',
        status: 'New',
        priority: 'Medium',
        leadType: 'Regular',
        assignedTo: '',
        assignedToId: '',
        value: '',
        expectedCloseDate: '',
        notes: '',
        tags: [],
        product: 'Insurance',
        subProduct: '',
        vehicleRegistrationNumber: '',
        vehicleType: '',
        preferredLanguage: 'English'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLead(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveLead = () => {
    // Real-time duplicate check for new leads
    if (!editingLead) {
      const dedupeCheck = checkDuplicate(formData, leads, 'leads');
      if (dedupeCheck.isDuplicate) {
        let duplicateInfo = dedupeCheck.duplicates.map(d => {
          if (d.type === 'fleet') {
            return `• FLEET DUPLICATE: Company "${d.company}" with Vehicle "${d.vehicleNumber}" already exists\n  Found in ${d.matches.length} record(s):\n${d.matches.map(m => `    - ${m.name} (ID: ${m.id}, Added: ${m.createdAt}, Agent: ${m.assignedTo})`).join('\n')}`;
          } else {
            return `• ${d.field.toUpperCase()}: "${d.value}" (Found in ${d.matches.length} existing record${d.matches.length > 1 ? 's' : ''})`;
          }
        }).join('\n\n');

        const hasFleetDuplicate = dedupeCheck.duplicates.some(d => d.type === 'fleet');
        const title = hasFleetDuplicate ? '🚛 FLEET DUPLICATE DETECTED' : '⚠️ DUPLICATE DETECTED';
        const confirmMessage = `${title}\n\n${duplicateInfo}\n\n${hasFleetDuplicate ? 'This appears to be a duplicate fleet entry. The same company and vehicle combination already exists in the system.' : ''}\n\nDo you want to add this lead anyway?`;

        if (!window.confirm(confirmMessage)) {
          return;
        }
      }
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingLead) {
        // Update existing lead
        const updatedLeads = leads.map(lead =>
          lead.id === editingLead.id
            ? {
              ...lead,
              ...formData,
              updatedAt: new Date().toISOString().split('T')[0]
            }
            : lead
        );
        setLeads(updatedLeads);
        setSnackbar({ open: true, message: 'Lead updated successfully!', severity: 'success' });
      } else {
        // Add new lead
        const newLead = {
          id: Math.max(...leads.map(l => l.id)) + 1,
          ...formData,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          lastContactDate: null
        };
        setLeads([...leads, newLead]);
        setSnackbar({ open: true, message: 'Lead added successfully!', severity: 'success' });
      }

      setLoading(false);
      handleCloseDialog();
    }, 1000);
  };

  const handleArchiveLead = (leadId) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
    setSnackbar({ open: true, message: 'Lead archived successfully!', severity: 'success' });
  };

  const handleSendEmail = (lead) => {
    (async () => {
      try {
        // Best-effort email analysis before send (non-blocking)
        const sample = { from: 'agent@company.com', subject: `Regarding your interest`, body: `Hi ${lead.firstName},\n\nI wanted to follow up regarding your interest in our services.` };
        const analysis = await analyzeEmail(sample).catch(() => null);
        if (analysis) console.debug('Email AI analysis:', analysis);
      } catch (e) {
        console.error('Email analysis failed:', e);
      } finally {
        // This would integrate with your email system
        setSnackbar({ open: true, message: `Email sent to ${lead.email}`, severity: 'success' });
      }
    })();
  };

  // Auto-assign agent based on language matching with enhanced logic
  const autoAssignByLanguage = (leadIds) => {
    console.log('🔍 Starting language assignment for leads:', leadIds);

    const leadsToAssign = leads.filter(lead => leadIds.includes(lead.id));
    console.log('📋 Leads to process:', leadsToAssign.map(l => ({ id: l.id, name: `${l.firstName} ${l.lastName}`, language: l.preferredLanguage, assigned: l.assignedTo })));

    let assignmentResults = {
      assigned: 0,
      languageMatched: 0,
      fallbackAssigned: 0,
      unassigned: 0
    };

    const updatedLeads = leads.map(lead => {
      // Check if lead is in selection and not already assigned (empty string or null/undefined)
      if (leadIds.includes(lead.id) && (!lead.assignedTo || lead.assignedTo.trim() === '')) {
        const leadLanguage = lead.preferredLanguage || 'English';
        console.log(`🌐 Processing ${lead.firstName} ${lead.lastName} - Language: ${leadLanguage}`);

        // Find agents who can communicate in the lead's preferred language
        const compatibleAgents = agents.filter(agent =>
          agent.languages && agent.languages.includes(leadLanguage)
        );
        console.log(`👥 Compatible agents for ${leadLanguage}:`, compatibleAgents.map(a => a.name));

        if (compatibleAgents.length > 0) {
          // Sort by rating and current workload for language-compatible agents
          const bestAgent = compatibleAgents.reduce((best, current) => {
            const bestWorkload = leads.filter(l => l.assignedToId === best.id).length;
            const currentWorkload = leads.filter(l => l.assignedToId === current.id).length;

            // Prefer higher rating, then lower workload
            if (current.rating > best.rating) return current;
            if (current.rating === best.rating && currentWorkload < bestWorkload) return current;
            return best;
          });

          console.log(`✅ Perfect match: ${lead.firstName} → ${bestAgent.name} (${leadLanguage})`);
          assignmentResults.assigned++;
          assignmentResults.languageMatched++;

          return {
            ...lead,
            assignedTo: bestAgent.name,
            assignedToId: bestAgent.id,
            assignmentReason: t('leads.assignmentReasons.languageMatch'),
            updatedAt: new Date().toISOString().split('T')[0]
          };
        } else {
          // Fallback: Assign to English-speaking agent if no language match
          const englishAgents = agents.filter(agent =>
            agent.languages && agent.languages.includes('English')
          );

          if (englishAgents.length > 0) {
            const bestEnglishAgent = englishAgents.reduce((best, current) => {
              const bestWorkload = leads.filter(l => l.assignedToId === best.id).length;
              const currentWorkload = leads.filter(l => l.assignedToId === current.id).length;

              if (current.rating > best.rating) return current;
              if (current.rating === best.rating && currentWorkload < bestWorkload) return current;
              return best;
            });

            console.log(`⚠️ Fallback assignment: ${lead.firstName} → ${bestEnglishAgent.name} (English fallback)`);
            assignmentResults.assigned++;
            assignmentResults.fallbackAssigned++;

            return {
              ...lead,
              assignedTo: bestEnglishAgent.name,
              assignedToId: bestEnglishAgent.id,
              assignmentReason: t('leads.assignmentReasons.fallback', { language: t(`common.languages.${leadLanguage}`) || leadLanguage }),
              updatedAt: new Date().toISOString().split('T')[0]
            };
          } else {
            console.log(`❌ No assignment possible for ${lead.firstName}`);
            assignmentResults.unassigned++;
          }
        }
      } else if (leadIds.includes(lead.id)) {
        console.log(`⏭️ Skipping ${lead.firstName} - already assigned to ${lead.assignedTo}`);
      }
      return lead;
    });

    console.log('📊 Assignment Results:', assignmentResults);
    setLeads(updatedLeads);

    // Show detailed assignment results
    if (assignmentResults.assigned > 0) {
      let message = `${assignmentResults.assigned} leads assigned: `;
      if (assignmentResults.languageMatched > 0) {
        message += `${assignmentResults.languageMatched} with language match`;
      }
      if (assignmentResults.fallbackAssigned > 0) {
        message += `${assignmentResults.languageMatched > 0 ? ', ' : ''}${assignmentResults.fallbackAssigned} as fallback`;
      }
      if (assignmentResults.unassigned > 0) {
        message += `. ${assignmentResults.unassigned} could not be assigned.`;
      }

      setSnackbar({
        open: true,
        message: message,
        severity: assignmentResults.unassigned > 0 ? 'warning' : 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'No unassigned leads found in selection or all leads already have agents.',
        severity: 'info'
      });
    }
  };

  // Enhanced bulk operations handlers with language-based assignment
  const handleSelectLead = (leadId) => {
    const newSelectedLeads = selectedLeads.includes(leadId)
      ? selectedLeads.filter(id => id !== leadId)
      : [...selectedLeads, leadId];

    setSelectedLeads(newSelectedLeads);
  };

  // Manual language-based assignment trigger with preview
  const handleLanguageBasedAssignment = () => {
    if (selectedLeads.length === 0) {
      setSnackbar({ open: true, message: 'Please select leads to assign', severity: 'warning' });
      return;
    }

    // Generate assignment preview
    const preview = selectedLeads.map(leadId => {
      const lead = leads.find(l => l.id === leadId);
      // Check if lead exists and is not already assigned (empty string or null/undefined)
      if (!lead || (lead.assignedTo && lead.assignedTo.trim() !== '')) return null;

      const leadLanguage = lead.preferredLanguage || 'English';
      const compatibleAgents = agents.filter(agent =>
        agent.languages && agent.languages.includes(leadLanguage)
      );

      let recommendedAgent = null;
      let matchType = 'no-match';

      if (compatibleAgents.length > 0) {
        recommendedAgent = compatibleAgents.reduce((best, current) => {
          const bestWorkload = leads.filter(l => l.assignedToId === best.id).length;
          const currentWorkload = leads.filter(l => l.assignedToId === current.id).length;

          if (current.rating > best.rating) return current;
          if (current.rating === best.rating && currentWorkload < bestWorkload) return current;
          return best;
        });
        matchType = 'language-match';
      } else {
        const englishAgents = agents.filter(agent =>
          agent.languages && agent.languages.includes('English')
        );
        if (englishAgents.length > 0) {
          recommendedAgent = englishAgents.reduce((best, current) => {
            const bestWorkload = leads.filter(l => l.assignedToId === best.id).length;
            const currentWorkload = leads.filter(l => l.assignedToId === current.id).length;

            if (current.rating > best.rating) return current;
            if (current.rating === best.rating && currentWorkload < bestWorkload) return current;
            return best;
          });
          matchType = 'fallback';
        }
      }

      return {
        lead,
        leadLanguage,
        recommendedAgent,
        matchType
      };
    }).filter(Boolean);

    if (preview.length === 0) {
      setSnackbar({
        open: true,
        message: 'No unassigned leads found in selection. All selected leads may already have agents assigned.',
        severity: 'info'
      });
      return;
    }

    setAssignmentPreview(preview);
    setLanguageAssignDialog(true);
  };

  const confirmLanguageAssignment = () => {
    autoAssignByLanguage(selectedLeads);
    setSelectedLeads([]);
    setLanguageAssignDialog(false);
    setAssignmentPreview([]);
  };

  const handleSelectAllLeads = () => {
    if (selectedLeads.length === currentLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(currentLeads.map(lead => lead.id));
    }
  };

  // Pin to top handlers
  const handlePinToTop = () => {
    const newPinnedLeads = [...new Set([...pinnedLeads, ...selectedLeads])];
    if (newPinnedLeads.length > 5) {
      setSnackbar({ open: true, message: 'Maximum 5 leads can be pinned to top', severity: 'error' });
      return;
    }
    setPinnedLeads(newPinnedLeads);
    localStorage.setItem('pinnedLeads', JSON.stringify(newPinnedLeads));
    setSnackbar({ open: true, message: `${selectedLeads.length} lead(s) pinned to top`, severity: 'success' });
    setSelectedLeads([]);
  };

  const handleBulkUnpin = () => {
    const newPinnedLeads = pinnedLeads.filter(id => !selectedLeads.includes(id));
    setPinnedLeads(newPinnedLeads);
    localStorage.setItem('pinnedLeads', JSON.stringify(newPinnedLeads));
    setSnackbar({ open: true, message: `${selectedLeads.length} lead(s) unpinned`, severity: 'success' });
    setSelectedLeads([]);
  };

  const handleBulkAssignment = () => {
    if (selectedLeads.length === 0) {
      setSnackbar({ open: true, message: 'Please select leads to assign', severity: 'warning' });
      return;
    }
    setBulkAssignmentDialog(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadFile) {
      setSnackbar({ open: true, message: 'Please select a file to upload', severity: 'warning' });
      return;
    }

    // Simulate upload progress
    setLoading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        setLoading(false);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadDialog(false);
          setUploadFile(null);
          setUploadProgress(0);
          setUploadSuccess(false);
        }, 2000);
        setSnackbar({
          open: true,
          message: 'Data uploaded successfully',
          severity: 'success'
        });
      }
    }, 500);
  };

  // New feature handlers
  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const handleRemovePhone = (index) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    }
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...phoneNumbers];
    newPhones[index] = value;
    setPhoneNumbers(newPhones);
  };

  const handleVehicleVerify = () => {
    if (!vehicleNumber) {
      setSnackbar({ open: true, message: 'Please enter vehicle number', severity: 'warning' });
      return;
    }

    const vehicleData = mockVehicleData[vehicleNumber.toUpperCase()];
    if (vehicleData) {
      setVehicleDetails(vehicleData);
      setSnackbar({ open: true, message: 'Vehicle verified successfully', severity: 'success' });
    } else {
      setVehicleDetails(null);
      setSnackbar({ open: true, message: 'Vehicle not found', severity: 'error' });
    }
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setStateLeads(stateWiseLeads[state] || []);
  };

  const handleCheckExpiry = (policy) => {
    setSelectedPolicy(policy);
    setExpiryCheckDialog(true);
  };

  const handleNavVerification = () => {
    setNavCheckLoading(true);
    // Simulate NAV API call
    setTimeout(() => {
      setNavCheckLoading(false);
      setSnackbar({
        open: true,
        message: 'NAV verification completed successfully',
        severity: 'success'
      });
    }, 2000);
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 30) return 'Due Soon';
    return 'Active';
  };

  const getExpiryStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4caf50'; // Green
      case 'Due Soon': return '#ff9800'; // Orange
      case 'Expired': return '#f44336'; // Red
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return '🟢';
      case 'Due Soon': return '🟡';
      case 'Expired': return '🔴';
      default: return '⚪';
    }
  };

  const handlePushToDialer = () => {
    if (selectedLeads.length === 0) {
      setSnackbar({ open: true, message: 'Please select leads to push to dialer', severity: 'warning' });
      return;
    }
    // Here you would integrate with your dialer system
    setSnackbar({
      open: true,
      message: `${selectedLeads.length} leads pushed to dialer successfully`,
      severity: 'success'
    });
  };

  const handleConfirmBulkAssignment = () => {
    if (!bulkAssignmentAgent) {
      setSnackbar({ open: true, message: 'Please select an agent', severity: 'warning' });
      return;
    }

    const agent = agents.find(u => u.id === bulkAssignmentAgent);
    const updatedLeads = leads.map(lead =>
      selectedLeads.includes(lead.id)
        ? { ...lead, assignedTo: agent.name, assignedToId: agent.id, updatedAt: new Date().toISOString().split('T')[0] }
        : lead
    );

    setLeads(updatedLeads);
    setSelectedLeads([]);
    setBulkAssignmentDialog(false);
    setBulkAssignmentAgent('');
    setSnackbar({ open: true, message: `${selectedLeads.length} leads assigned to ${agent.name}`, severity: 'success' });
  };

  // Auto-assign Premium leads to top-rated agents
  const handleAutoAssign = () => {
    const premiumLeads = leads.filter(lead => lead.leadType === 'Premium' && !lead.assignedTo);
    if (premiumLeads.length === 0) {
      setSnackbar({ open: true, message: 'No unassigned Premium leads found', severity: 'info' });
      return;
    }

    // Sort agents by rating (highest first)
    const topAgents = [...agents].sort((a, b) => b.rating - a.rating);

    const updatedLeads = leads.map(lead => {
      if (lead.leadType === 'Premium' && !lead.assignedTo) {
        // Assign to top-rated agent with least current workload
        const bestAgent = topAgents.reduce((best, current) => {
          const bestWorkload = leads.filter(l => l.assignedToId === best.id).length;
          const currentWorkload = leads.filter(l => l.assignedToId === current.id).length;
          return currentWorkload < bestWorkload ? current : best;
        });

        return {
          ...lead,
          assignedTo: bestAgent.name,
          assignedToId: bestAgent.id,
          assignmentReason: t('leads.assignmentReasons.autoRating'),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
    setAutoAssignDialog(false);
    setSnackbar({
      open: true,
      message: `${premiumLeads.length} Premium leads auto-assigned to top-rated agents`,
      severity: 'success'
    });
  };

  // ============ VAHAN VERIFICATION HANDLERS ============

  const handlePushToVahan = (lead) => {
    if (!lead.vehicleRegistrationNumber) {
      setSnackbar({ open: true, message: 'No vehicle registration number found for this lead', severity: 'warning' });
      return;
    }
    setVahanVerificationLead(lead);
    setVahanVehicleNumber(lead.vehicleRegistrationNumber);
    setVahanDialog(true);
  };

  const handleConfirmVahanVerification = async () => {
    if (!vahanVehicleNumber) {
      setSnackbar({ open: true, message: 'Please enter vehicle registration number', severity: 'warning' });
      return;
    }

    const result = await verifyVehicle(vahanVehicleNumber, vahanVerificationLead.id.toString(), 'System');

    if (result.success) {
      setSnackbar({ open: true, message: 'Vehicle verified successfully with Vahan', severity: 'success' });
      setVahanDialog(false);
      setVahanVerificationLead(null);
      setVahanVehicleNumber('');
    } else {
      setSnackbar({ open: true, message: `Verification failed: ${result.error}`, severity: 'error' });
    }
  };

  const handleBulkPushToVahan = async () => {
    if (selectedLeads.length === 0) {
      setSnackbar({ open: true, message: 'Please select leads to push to Vahan', severity: 'warning' });
      return;
    }

    const leadsWithVehicles = selectedLeads
      .map(leadId => leads.find(l => l.id === leadId))
      .filter(lead => lead && lead.vehicleRegistrationNumber);

    if (leadsWithVehicles.length === 0) {
      setSnackbar({ open: true, message: 'No selected leads have vehicle registration numbers', severity: 'warning' });
      return;
    }

    const vehicleList = leadsWithVehicles.map(lead => ({
      vehicleNumber: lead.vehicleRegistrationNumber,
      leadId: lead.id.toString()
    }));

    const result = await bulkVerifyVehicles(vehicleList, 'System');

    if (result.success) {
      setSnackbar({
        open: true,
        message: `Bulk verification complete: ${result.summary.successful} successful, ${result.summary.failed} failed`,
        severity: 'success'
      });
      setSelectedLeads([]);
    } else {
      setSnackbar({ open: true, message: 'Bulk verification failed', severity: 'error' });
    }
  };

  const getVahanStatus = (leadId) => {
    const verification = getVerificationByLeadId(leadId.toString());
    if (!verification) return null;
    return {
      status: verification.status,
      verifiedAt: verification.verifiedAt,
      vehicleDetails: verification.vehicleDetails
    };
  };

  // Get lead type badge color
  const getLeadTypeBadgeColor = (leadType) => {
    return leadType === 'Premium' ? '#FFD700' : '#90CAF9';
  };

  // Get lead type icon
  const getLeadTypeIcon = (leadType) => {
    return leadType === 'Premium' ? '👑' : '👤';
  };

  // Quick actions handlers
  const handleQuickNotes = (lead) => {
    setSelectedLead(lead);
    setQuickUpdateData({
      notes: lead.notes || '',
      status: lead.status || '',
      followUpDate: lead.followUpDate || ''
    });
    setQuickUpdateDialog(true);
  };

  const handleQuickUpdate = (lead) => {
    setSelectedLead(lead);
    setQuickUpdateData({
      notes: lead.notes || '',
      status: lead.status || '',
      followUpDate: lead.followUpDate || ''
    });
    setQuickUpdateDialog(true);
  };

  const handleSaveQuickUpdate = () => {
    if (!selectedLead) return;

    const updatedLeads = leads.map(lead =>
      lead.id === selectedLead.id
        ? {
          ...lead,
          status: quickUpdateData.status,
          notes: quickUpdateData.notes,
          followUpDate: quickUpdateData.followUpDate,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        : lead
    );

    setLeads(updatedLeads);
    setQuickUpdateDialog(false);
    setQuickUpdateData({ notes: '', status: '', followUpDate: '' });
    setSelectedLead(null);
    setSnackbar({ open: true, message: 'Lead updated successfully!', severity: 'success' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': theme.palette.info.main,
      'Contacted': theme.palette.warning.main,
      'Qualified': theme.palette.primary.main,
      'Proposal': theme.palette.secondary.main,
      'Negotiation': theme.palette.warning.dark,
      'Closed Won': theme.palette.success.main,
      'Closed Lost': theme.palette.error.main
    };
    return colors[status] || theme.palette.grey[500];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': theme.palette.success.main,
      'Medium': theme.palette.warning.main,
      'High': theme.palette.error.main,
      'Urgent': theme.palette.error.dark
    };
    return colors[priority] || theme.palette.grey[500];
  };

  const handleMenuOpen = (event, lead) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLead(null);
  };

  const handleViewDetails = (lead) => {
    navigate(`/lead-management/${lead.id}`);
  };

  // Pagination with pinned leads sorting
  const sortedFilteredLeads = [...filteredLeads].sort((a, b) => {
    const aIsPinned = pinnedLeads.includes(a.id);
    const bIsPinned = pinnedLeads.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });
  const totalPages = Math.ceil(sortedFilteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = sortedFilteredLeads.slice(startIndex, endIndex);

  // Statistics
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    closedWon: leads.filter(l => l.status === 'Closed Won').length,
    totalValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0)
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              {t('leads.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('leads.subtitle')}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => setUploadDialog(true)}
              >
                {t('leads.dataProviderUpload')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => setBulkUploadOpen(true)}
              >
                {t('leads.bulkUpload')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setShowUploadHistory(!showUploadHistory)}
              >
                {t('leads.uploadHistory')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<GroupIcon />}
                onClick={() => setAgentTableOpen(true)}
              >
                {t('leads.viewAgents')}
              </Button>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: '0 4px 15px rgba(164, 215, 225, 0.3)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(164, 215, 225, 0.4)',
                }
              }}
            >
              {t('leads.addLead')}
            </Button>
          </Stack>
        </Box>

        {/* Upload History Section */}
        {showUploadHistory && (
          <Card className="healthcare-card" sx={{ mb: 3 }}>
            <CardContent>
              <FailedRecordsViewer source="leads" limit={10} />
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card className="healthcare-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="600" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('leads.totalLeads', 'Total Leads')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card className="healthcare-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="600" color="info.main">
                  {stats.new}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('leads.newLeads', 'New Leads')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card className="healthcare-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="600" color="secondary.main">
                  {stats.qualified}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('leads.qualified', 'Qualified')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card className="healthcare-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="600" color="success.main">
                  {stats.closedWon}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('leads.closedWon', 'Closed Won')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card className="healthcare-card">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="600" color="warning.main">
                  ₹{stats.totalValue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('leads.totalValue', 'Total Value')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>





        {/* Filters and Search */}
        <Card className="healthcare-card" sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder={t('leads.searchPlaceholder', 'Search leads...')}
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
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.status', 'Status')}</InputLabel>
                  <Select
                    value={statusFilter}
                    label={t('leads.status', 'Status')}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="All">{t('leads.allStatus', 'All Status')}</MenuItem>
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{t(`leads.statuses.${status}`, status)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.priority', 'Priority')}</InputLabel>
                  <Select
                    value={priorityFilter}
                    label={t('leads.priority', 'Priority')}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <MenuItem value="All">{t('leads.allPriority', 'All Priority')}</MenuItem>
                    {priorityOptions.map(priority => (
                      <MenuItem key={priority} value={priority}>{t(`leads.priorities.${priority}`, priority)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.assignedTo', 'Assigned To')}</InputLabel>
                  <Select
                    value={assignedFilter}
                    label={t('leads.assignedTo', 'Assigned To')}
                    onChange={(e) => setAssignedFilter(e.target.value)}
                  >
                    <MenuItem value="All">{t('leads.allAgents', 'All Agents')}</MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.leadType', 'Lead Type')}</InputLabel>
                  <Select
                    value={leadTypeFilter}
                    label={t('leads.leadType', 'Lead Type')}
                    onChange={(e) => setLeadTypeFilter(e.target.value)}
                  >
                    <MenuItem value="All">{t('leads.allTypes', 'All Types')}</MenuItem>
                    {leadTypeOptions.map(type => (
                      <MenuItem key={type} value={type}>{t(`leads.types.${type}`, type)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setPriorityFilter('All');
                    setAssignedFilter('All');
                    setLeadTypeFilter('All');
                  }}
                >
                  {t('common.reset') || 'Reset'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Bulk Actions Toolbar */}
        {selectedLeads.length > 0 && (
          <Card className="healthcare-card" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" color="primary">
                  {selectedLeads.length} {t('leads.bulk.selected') || 'lead(s) selected'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip
                    title={
                      selectedLeads.some(id => pinnedLeads.includes(id))
                        ? "Unpin selected leads"
                        : pinnedLeads.length + selectedLeads.length > 5
                          ? "Maximum 5 leads can be pinned"
                          : "Pin selected leads to top"
                    }
                    arrow
                  >
                    <span>
                      <Button
                        variant="outlined"
                        startIcon={<PushPinIcon />}
                        onClick={selectedLeads.some(id => pinnedLeads.includes(id)) ? handleBulkUnpin : handlePinToTop}
                        disabled={!selectedLeads.some(id => pinnedLeads.includes(id)) && pinnedLeads.length + selectedLeads.length > 5}
                        size="small"
                        sx={{
                          borderColor: selectedLeads.some(id => pinnedLeads.includes(id)) ? 'warning.main' : 'secondary.main',
                          color: selectedLeads.some(id => pinnedLeads.includes(id)) ? 'warning.main' : 'secondary.main',
                          '&:hover': {
                            borderColor: selectedLeads.some(id => pinnedLeads.includes(id)) ? 'warning.dark' : 'secondary.dark',
                            bgcolor: selectedLeads.some(id => pinnedLeads.includes(id))
                              ? alpha(theme.palette.warning.main, 0.1)
                              : alpha(theme.palette.secondary.main, 0.1)
                          },
                          '&:disabled': {
                            opacity: 0.5
                          }
                        }}
                      >
                        {selectedLeads.some(id => pinnedLeads.includes(id)) ? t('leads.bulk.unpin') : t('leads.bulk.pinToTop')}
                      </Button>
                    </span>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    startIcon={<GroupIcon />}
                    onClick={handleBulkAssignment}
                    size="small"
                  >
                    {t('leads.bulk.manualAssign')}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<span style={{ fontSize: '1rem' }}>🌐</span>}
                    onClick={() => {
                      console.log('🚀 Language Match button clicked');
                      console.log('Selected leads:', selectedLeads);
                      handleLanguageBasedAssignment();
                    }}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      }
                    }}
                  >
                    {t('leads.bulk.languageMatch')}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PersonIcon />}
                    onClick={() => setAutoAssignDialog(true)}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                      color: '#000',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFA000 0%, #FFD700 100%)',
                      }
                    }}
                  >
                    {t('leads.bulk.autoAssignPremium')}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PhoneForwardedIcon />}
                    onClick={handlePushToDialer}
                    size="small"
                    color="primary"
                  >
                    {t('leads.bulk.pushToDialer')}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VehicleIcon />}
                    onClick={handleBulkPushToVahan}
                    size="small"
                    color="secondary"
                    disabled={vahanLoading}
                  >
                    {vahanLoading ? t('leads.bulk.verifying') : t('leads.bulk.pushToVahan')}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArchiveIcon />}
                    onClick={() => {
                      const updatedLeads = leads.filter(lead => !selectedLeads.includes(lead.id));
                      setLeads(updatedLeads);
                      setSelectedLeads([]);
                      setSnackbar({ open: true, message: `${selectedLeads.length} leads archived`, severity: 'success' });
                    }}
                    size="small"
                    color="warning"
                  >
                    {t('leads.bulk.archiveSelected')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Leads Table */}
        <Card className="healthcare-card">
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedLeads.length === currentLeads.length && currentLeads.length > 0}
                        indeterminate={selectedLeads.length > 0 && selectedLeads.length < currentLeads.length}
                        onChange={handleSelectAllLeads}
                      />
                    </TableCell>
                    <TableCell>{t('leads.table.name', 'Lead')}</TableCell>
                    <TableCell>{t('leads.table.company', 'Company')}</TableCell>
                    <TableCell>{t('leads.leadType', 'Type')}</TableCell>
                    <TableCell>{t('leads.status', 'Status')}</TableCell>
                    <TableCell>{t('leads.table.score', 'Score')}</TableCell>
                    <TableCell>{t('leads.priority', 'Priority')}</TableCell>
                    <TableCell>{t('leads.assignedTo', 'Assigned To')}</TableCell>
                    <TableCell>{t('leads.language', 'Language')}</TableCell>
                    <TableCell>{t('leads.totalCalls', 'Total Calls')}</TableCell>
                    <TableCell>{t('leads.table.value', 'Value')}</TableCell>
                    <TableCell>{t('leads.table.lastContact', 'Last Contact')}</TableCell>
                    <TableCell align="center">{t('leads.table.vahan', 'Vahan')}</TableCell>
                    <TableCell align="center">{t('leads.table.actions.title', 'Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      hover
                      sx={{
                        bgcolor: pinnedLeads.includes(lead.id)
                          ? alpha(theme.palette.secondary.main, 0.08)
                          : 'transparent',
                        borderLeft: pinnedLeads.includes(lead.id)
                          ? `4px solid ${theme.palette.secondary.main}`
                          : 'none',
                        '&:hover': {
                          bgcolor: pinnedLeads.includes(lead.id)
                            ? alpha(theme.palette.secondary.main, 0.15)
                            : alpha(theme.palette.action.hover, 1)
                        }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Tooltip title={starredLeads.includes(lead.id) ? "Mark as Unimportant" : "Mark as Important"}>
                            <IconButton
                              size="small"
                              onClick={(e) => handleToggleStar(e, lead.id)}
                              sx={{ mr: 1, color: starredLeads.includes(lead.id) ? 'warning.main' : 'action.disabled' }}
                            >
                              {starredLeads.includes(lead.id) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Avatar sx={{
                            mr: 2,
                            bgcolor: lead.leadType === 'Premium' ? '#FFD700' : theme.palette.primary.main,
                            color: lead.leadType === 'Premium' ? '#000' : '#fff',
                            border: lead.leadType === 'Premium' ? '2px solid #FFA000' : 'none'
                          }}>
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <span style={{ fontSize: '0.9rem' }}>{getLeadTypeIcon(lead.leadType)}</span>
                                {lead.firstName} {lead.lastName}
                              </Typography>
                              {pinnedLeads.includes(lead.id) && (
                                <Tooltip title="Pinned to top" arrow>
                                  <PushPinIcon
                                    fontSize="small"
                                    sx={{
                                      color: theme.palette.secondary.main,
                                      transform: 'rotate(45deg)',
                                      fontSize: '1rem'
                                    }}
                                  />
                                </Tooltip>
                              )}
                              {lead.leadType === 'Premium' && (
                                <Chip
                                  label="PREMIUM"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#FFD700',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    height: '18px'
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {lead.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {lead.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {lead.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lead.position}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`leads.types.${lead.leadType}`, lead.leadType)}
                          size="small"
                          icon={<span style={{ fontSize: '0.8rem' }}>{getLeadTypeIcon(lead.leadType)}</span>}
                          sx={{
                            backgroundColor: alpha(getLeadTypeBadgeColor(lead.leadType), 0.2),
                            color: lead.leadType === 'Premium' ? '#B8860B' : theme.palette.primary.main,
                            border: `1px solid ${getLeadTypeBadgeColor(lead.leadType)}`,
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`leads.statuses.${lead.status}`, lead.status)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                            color: getStatusColor(lead.status),
                            border: `1px solid ${alpha(getStatusColor(lead.status), 0.3)}`
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <LeadScoringIndicator
                          score={lead.score || calculateLeadScore(lead)}
                          stage={lead.status}
                          showDetails={false}
                          scoreBreakdown={lead.scoreBreakdown}
                        />
                      </TableCell>
                      <TableCell>
                        <PriorityIndicator
                          priority={normalizePriority(lead.priority)}
                          compact={true}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={lead.assignedTo ? 600 : 400}>
                            {lead.assignedTo || t('common.unassigned', 'Unassigned')}
                          </Typography>
                          {lead.assignmentReason && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                              {lead.assignmentReason}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`common.languages.${lead.preferredLanguage || 'English'}`, lead.preferredLanguage || 'English')}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {lead.totalCalls || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          ₹{lead.value?.toLocaleString() || '0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {lead.lastContactDate || t('leads.table.never', 'Never')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {lead.vehicleRegistrationNumber ? (
                          (() => {
                            const vahanStatus = getVahanStatus(lead.id);
                            if (vahanStatus) {
                              if (vahanStatus.status === 'verified') {
                                return (
                                  <Tooltip title={t('leads.table.vahanStatus.verifiedOn', 'Verified on {{date}}', { date: new Date(vahanStatus.verifiedAt).toLocaleDateString() })}>
                                    <Chip
                                      icon={<VerifiedUserIcon />}
                                      label={t('leads.table.vahanStatus.verified', 'Verified')}
                                      color="success"
                                      size="small"
                                    />
                                  </Tooltip>
                                );
                              } else if (vahanStatus.status === 'failed') {
                                return (
                                  <Tooltip title={t('leads.table.vahanStatus.verificationFailed', 'Verification Failed')}>
                                    <Chip
                                      icon={<ErrorIcon />}
                                      label={t('leads.table.vahanStatus.failed', 'Failed')}
                                      color="error"
                                      size="small"
                                    />
                                  </Tooltip>
                                );
                              }
                            }
                            return (
                              <Tooltip title={t('leads.table.vahanStatus.clickToVerify', 'Click to Verify')}>
                                <IconButton
                                  size="small"
                                  onClick={() => handlePushToVahan(lead)}
                                  color="primary"
                                >
                                  <VehicleIcon />
                                </IconButton>
                              </Tooltip>
                            );
                          })()
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            {t('leads.table.vahanStatus.notAvailable', 'N/A')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title={t('leads.table.actions.callLead', 'Call Lead')}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedCallLead(lead);
                                setCallDialogOpen(true);
                              }}
                              sx={{
                                color: theme.palette.success.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.success.main, 0.1)
                                }
                              }}
                            >
                              <CallIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('leads.table.actions.viewDetails', 'View Details')}>
                            <IconButton size="small" onClick={() => handleViewDetails(lead)}>
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('leads.table.actions.quickUpdate', 'Quick Update')}>
                            <IconButton size="small" onClick={() => handleQuickUpdate(lead)}>
                              <NoteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('leads.table.actions.moreActions', 'More Actions')}>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, lead)}>
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Lead Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingLead ? t('leads.editLead', 'Edit Lead') : t('leads.addNewLead', 'Add New Lead')}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  {t('leads.personalInfo', 'Personal Information')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.firstName', 'First Name')}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.lastName', 'Last Name')}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.email', 'Email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.phone', 'Phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {/* Company Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ mt: 2 }}>
                  {t('leads.companyInfo', 'Company Information')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.company', 'Company')}
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.position', 'Position')}
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Lead Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom sx={{ mt: 2 }}>
                  {t('leads.leadDetails', 'Lead Details')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.source', 'Source')}</InputLabel>
                  <Select
                    name="source"
                    value={formData.source}
                    label={t('leads.source', 'Source')}
                    onChange={handleInputChange}
                  >
                    {sourceOptions.map(option => (
                      <MenuItem key={option} value={option}>{t(`leads.sources.${option}`, option)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.status', 'Status')}</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label={t('leads.status', 'Status')}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option} value={option}>{t(`leads.statuses.${option}`, option)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.priority', 'Priority')}</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    label={t('leads.priority', 'Priority')}
                    onChange={handleInputChange}
                  >
                    {priorityOptions.map(option => (
                      <MenuItem key={option} value={option}>{t(`leads.priorities.${option}`, option)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.leadType', 'Lead Type')}</InputLabel>
                  <Select
                    name="leadType"
                    value={formData.leadType}
                    label={t('leads.leadType', 'Lead Type')}
                    onChange={handleInputChange}
                  >
                    {leadTypeOptions.map(option => (
                      <MenuItem key={option} value={option}>{t(`leads.types.${option}`, option)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.value', 'Deal Value')}
                  name="value"
                  type="number"
                  value={formData.value}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('leads.expectedCloseDate', 'Expected Close Date')}
                  name="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Product and Insurance Fields */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.form.product', 'Product')}</InputLabel>
                  <Select
                    value={formData.product}
                    label={t('leads.form.product', 'Product')}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  >
                    {productOptions.map(product => (
                      <MenuItem key={product} value={product}>{t(`leads.products.${product}`, product)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.form.subProduct', 'Sub Product')}</InputLabel>
                  <Select
                    value={formData.subProduct}
                    label={t('leads.form.subProduct', 'Sub Product')}
                    onChange={(e) => {
                      const newSubProduct = e.target.value;
                      setFormData({
                        ...formData,
                        subProduct: newSubProduct,
                        // Clear vehicle fields if not Vehicle Insurance
                        vehicleRegistrationNumber: newSubProduct === 'Vehicle Insurance' ? formData.vehicleRegistrationNumber : '',
                        vehicleType: newSubProduct === 'Vehicle Insurance' ? formData.vehicleType : ''
                      });
                    }}
                  >
                    {subProductOptions.map(subProduct => (
                      <MenuItem key={subProduct} value={subProduct}>{t(`leads.subProducts.${subProduct}`, subProduct)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Vehicle Insurance Fields - Only show when Vehicle Insurance is selected */}
              {formData.subProduct === 'Vehicle Insurance' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('leads.form.vehicleNumber', 'Vehicle Number')}
                      value={formData.vehicleRegistrationNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleRegistrationNumber: e.target.value })}
                      placeholder="e.g., MH12AB1234"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('leads.form.vehicleType', 'Vehicle Type')}</InputLabel>
                      <Select
                        value={formData.vehicleType}
                        label={t('leads.form.vehicleType', 'Vehicle Type')}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      >
                        {vehicleTypeOptions.map(type => (
                          <MenuItem key={type} value={type}>{t(`leads.vehicleTypes.${type}`, type)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.form.preferredLanguage', 'Preferred Language')}</InputLabel>
                  <Select
                    value={formData.preferredLanguage || 'English'}
                    label={t('leads.form.preferredLanguage', 'Preferred Language')}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  >
                    <MenuItem value="English">{t('common.languages.English', 'English')}</MenuItem>
                    <MenuItem value="Hindi">{t('common.languages.Hindi', 'Hindi')}</MenuItem>
                    <MenuItem value="Bengali">{t('common.languages.Bengali', 'Bengali')}</MenuItem>
                    <MenuItem value="Tamil">{t('common.languages.Tamil', 'Tamil')}</MenuItem>
                    <MenuItem value="Telugu">{t('common.languages.Telugu', 'Telugu')}</MenuItem>
                    <MenuItem value="Marathi">{t('common.languages.Marathi', 'Marathi')}</MenuItem>
                    <MenuItem value="Gujarati">{t('common.languages.Gujarati', 'Gujarati')}</MenuItem>
                    <MenuItem value="Kannada">{t('common.languages.Kannada', 'Kannada')}</MenuItem>
                    <MenuItem value="Punjabi">{t('common.languages.Punjabi', 'Punjabi')}</MenuItem>
                    <MenuItem value="Urdu">{t('common.languages.Urdu', 'Urdu')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('leads.form.notes', 'Notes')}
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
            <Button
              onClick={handleSaveLead}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? t('leads.form.saving', 'Saving...') : (editingLead ? t('common.update', 'Update') : t('common.save', 'Save'))}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Assignment Dialog */}
        <Dialog open={bulkAssignmentDialog} onClose={() => setBulkAssignmentDialog(false)}>
          <DialogTitle>{t('leads.bulk.assignTitle')}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('leads.bulk.assignContent', { count: selectedLeads.length })}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>{t('leads.bulk.selectAgent')}</InputLabel>
              <Select
                value={bulkAssignmentAgent}
                label={t('leads.bulk.selectAgent')}
                onChange={(e) => setBulkAssignmentAgent(e.target.value)}
              >
                {agents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span>{t(`mockData.agents.${agent.id}.name`) || agent.name}</span>
                      <Chip
                        label={`⭐ ${agent.rating}`}
                        size="small"
                        sx={{ ml: 1, fontSize: '0.7rem', height: '20px' }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBulkAssignmentDialog(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleConfirmBulkAssignment} variant="contained">
              {t('leads.bulk.assignButton')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Quick Update Dialog */}
        <Dialog open={quickUpdateDialog} onClose={() => setQuickUpdateDialog(false)}>
          <DialogTitle>{t('leads.quickUpdate', 'Quick Update')}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('leads.status', 'Status')}</InputLabel>
                  <Select
                    value={quickUpdateData.status}
                    label={t('leads.status', 'Status')}
                    onChange={(e) => setQuickUpdateData({ ...quickUpdateData, status: e.target.value })}
                  >
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{t(`leads.statuses.${status}`, status)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('leads.notes', 'Notes')}
                  multiline
                  rows={4}
                  value={quickUpdateData.notes}
                  onChange={(e) => setQuickUpdateData({ ...quickUpdateData, notes: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('leads.followUpDate', 'Follow Up Date')}
                  type="date"
                  value={quickUpdateData.followUpDate}
                  onChange={(e) => setQuickUpdateData({ ...quickUpdateData, followUpDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQuickUpdateDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
            <Button onClick={handleSaveQuickUpdate} variant="contained" color="primary">
              {t('common.save', 'Save')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            handleSendEmail(selectedLead);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('leads.table.actions.sendEmail')}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {
            handleArchiveLead(selectedLead?.id);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('leads.table.actions.archive')}</ListItemText>
          </MenuItem>
        </Menu>

        {/* Data Provider Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('leads.dataProvider.title', 'Data Provider Upload')}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('leads.dataProvider.content', 'Please select a file to upload data from your provider. Supported formats: Check with admin.')}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 2, mb: 2 }}
              >
                {t('leads.dataProvider.chooseFile', 'Choose File')}
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
              </Button>
              {uploadFile && (
                <Typography variant="body2" color="primary" gutterBottom>
                  {t('leads.dataProvider.selectedFile', { name: uploadFile.name }) || `Selected File: ${uploadFile.name}`}
                </Typography>
              )}
              {loading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {t('leads.dataProvider.uploading', { progress: uploadProgress }) || `Uploading... ${uploadProgress}%`}
                  </Typography>
                </Box>
              )}
              {uploadSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  ✅ {t('leads.dataProvider.success', 'File uploaded successfully!')}
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialog(false)}>{t('common.cancel')}</Button>
            <Button
              onClick={handleUploadSubmit}
              variant="contained"
              disabled={!uploadFile || loading}
            >
              {t('leads.dataProvider.uploadButton', 'Upload')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Expiry Check Dialog */}
        <Dialog open={expiryCheckDialog} onClose={() => setExpiryCheckDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            📅 {t('leads.policyExpiry.title')}
          </DialogTitle>
          <DialogContent>
            {selectedPolicy && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedPolicy.policyNumber}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      <Typography variant="caption">{t('leads.policyExpiry.crmSystem')}</Typography>
                      <Typography variant="h6">{selectedPolicy.crmExpiryDate}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                      <Typography variant="caption">{t('leads.policyExpiry.navSystem')}</Typography>
                      <Typography variant="h6">{selectedPolicy.navExpiryDate}</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>{t('leads.policyExpiry.status')}:</Typography>
                  <Typography variant="h6">
                    {getStatusIcon(getExpiryStatus(selectedPolicy.crmExpiryDate))}
                  </Typography>
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                    {getExpiryStatus(selectedPolicy.crmExpiryDate)}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('leads.policyExpiry.customer')}: {selectedPolicy.customerName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {t('leads.form.vehicleNumber')}: {selectedPolicy.vehicleNumber}
                </Typography>

                {navCheckLoading && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">{t('leads.navVerify.loading')}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExpiryCheckDialog(false)}>{t('common.close')}</Button>
            <Button
              onClick={handleNavVerification}
              variant="contained"
              disabled={navCheckLoading}
              startIcon={navCheckLoading ? <CircularProgress size={16} /> : null}
            >
              {navCheckLoading ? t('leads.bulk.verifying') : t('leads.navVerify.verifyButton')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Bulk Upload Component */}
        <BulkUpload
          open={bulkUploadOpen}
          onClose={() => setBulkUploadOpen(false)}
          title="Bulk Upload Leads"
          source="leads"
          existingData={leads}
          requiredFields={['firstName', 'lastName', 'email', 'phone']}
          fieldMapping={{
            'First Name': 'firstName',
            'Last Name': 'lastName',
            'Email': 'email',
            'Phone': 'phone',
            'Company': 'company',
            'Position': 'position',
            'Source': 'source',
            'Status': 'status',
            'Priority': 'priority',
            'Value': 'value',
            'Expected Close Date': 'expectedCloseDate',
            'Notes': 'notes',
            'Product': 'product',
            'Sub Product': 'subProduct',
            'Vehicle Registration Number': 'vehicleRegistrationNumber',
            'Vehicle Type': 'vehicleType'
          }}
          onUploadComplete={(validRecords, failedRecords) => {
            // Add uploaded leads to the list
            const newLeads = validRecords.map((record, index) => ({
              id: Math.max(...leads.map(l => l.id)) + index + 1,
              ...record.record,
              createdAt: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0],
              lastContactDate: null,
              tags: []
            }));

            setLeads([...leads, ...newLeads]);
            setBulkUploadOpen(false);
            setSnackbar({
              open: true,
              message: `${validRecords.length} leads uploaded successfully! ${failedRecords.length > 0 ? `${failedRecords.length} records failed.` : ''}`,
              severity: 'success'
            });

            // Show upload history if there were failures
            if (failedRecords.length > 0) {
              setShowUploadHistory(true);
            }
          }}
          allowOverride={true}
        />

        {/* Agent Table Dialog */}
        <Dialog open={agentTableOpen} onClose={() => setAgentTableOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GroupIcon color="primary" />
              <Typography variant="h6" fontWeight="600">{t('leads.agentTable.title', 'Agent Performance')}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('leads.agentTable.agent', 'Agent')}</TableCell>
                    <TableCell>{t('leads.agentTable.rating', 'Rating')}</TableCell>
                    <TableCell>{t('leads.agentTable.totalLeads', 'Total Leads')}</TableCell>
                    <TableCell>{t('leads.agentTable.closedDeals', 'Closed Deals')}</TableCell>
                    <TableCell>{t('leads.agentTable.successRate', 'Success Rate')}</TableCell>
                    <TableCell>{t('leads.agentTable.languages', 'Languages')}</TableCell>
                    <TableCell>{t('leads.agentTable.specialization', 'Specialization')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents.map((agent) => {
                    const successRate = ((agent.closedDeals / agent.totalLeads) * 100).toFixed(1);
                    const currentWorkload = leads.filter(l => l.assignedToId === agent.id).length;
                    return (
                      <TableRow key={agent.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                              {agent.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600">
                                {t(`mockData.agents.${agent.id}.name`, agent.name)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {t('leads.agentTable.currentWorkload', 'Current Workload: {{count}}', { count: currentWorkload })}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" fontWeight="600" color="warning.main">
                              ⭐ {agent.rating}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(agent.rating / 5) * 100}
                              sx={{ width: 60, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600">
                            {agent.totalLeads}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" color="success.main">
                            {agent.closedDeals}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${successRate}%`}
                            size="small"
                            sx={{
                              backgroundColor: successRate >= 70 ? alpha(theme.palette.success.main, 0.1) :
                                successRate >= 50 ? alpha(theme.palette.warning.main, 0.1) :
                                  alpha(theme.palette.error.main, 0.1),
                              color: successRate >= 70 ? theme.palette.success.main :
                                successRate >= 50 ? theme.palette.warning.main :
                                  theme.palette.error.main,
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                            {agent.languages.map(language => (
                              <Chip
                                key={language}
                                label={t(`common.languages.${language}`, language)}
                                size="small"
                                variant={language === 'English' ? 'filled' : 'outlined'}
                                color={language === 'English' ? 'primary' : 'default'}
                                sx={{
                                  fontSize: '0.65rem',
                                  height: '20px',
                                  fontWeight: language === 'English' ? 600 : 400
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {t(`mockData.agents.${agent.id}.specialization`, agent.specialization)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAgentTableOpen(false)}>{t('common.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* Auto Assignment Dialog */}
        <Dialog open={autoAssignDialog} onClose={() => setAutoAssignDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.5rem' }}>👑</span>
              <Typography variant="h6" fontWeight="600">{t('leads.autoAssign.premiumTitle')}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                {t('leads.autoAssign.content')}
              </Typography>
              <Box sx={{ ml: 2, mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>• {t('leads.autoAssign.criteria.rating')}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>• {t('leads.autoAssign.criteria.workload')}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>• {t('leads.autoAssign.criteria.specialization')}</Typography>
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  {t('leads.autoAssign.summary.leadsToAssign')}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="600">
                  {leads.filter(lead => lead.leadType === 'Premium' && !lead.assignedTo).length}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  {t('leads.autoAssign.summary.topAgents')}
                </Typography>
                {[...agents].sort((a, b) => b.rating - a.rating).slice(0, 3).map((agent, index) => (
                  <Box key={agent.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{index + 1}. {t(`mockData.agents.${agent.id}.name`) || agent.name}</Typography>
                    <Typography variant="body2" fontWeight="600">⭐ {agent.rating}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAutoAssignDialog(false)}>{t('common.cancel')}</Button>
            <Button
              onClick={handleAutoAssign}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                color: '#000',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFA000 0%, #FFD700 100%)',
                }
              }}
            >
              {t('leads.autoAssign.button')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Language Assignment Preview Dialog */}
        <Dialog open={languageAssignDialog} onClose={() => setLanguageAssignDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.5rem' }}>🌐</span>
              <Typography variant="h6" fontWeight="600">{t('leads.languageAssign.title')}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('leads.languageAssign.content')}
            </Typography>

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('leads.languageAssign.table.lead')}</TableCell>
                    <TableCell>{t('leads.languageAssign.table.language')}</TableCell>
                    <TableCell>{t('leads.languageAssign.table.recommendedAgent')}</TableCell>
                    <TableCell>{t('leads.languageAssign.table.agentLanguages')}</TableCell>
                    <TableCell>{t('leads.languageAssign.table.matchType')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignmentPreview.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {t(`mockData.leads.${item.lead.id}.firstName`) || item.lead.firstName} {t(`mockData.leads.${item.lead.id}.lastName`) || item.lead.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t(`mockData.leads.${item.lead.id}.company`) || item.lead.company}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.leadLanguage}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {item.recommendedAgent ? (
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {t(`mockData.agents.${item.recommendedAgent.id}.name`) || item.recommendedAgent.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ⭐ {item.recommendedAgent.rating} | {t(`mockData.agents.${item.recommendedAgent.id}.specialization`) || item.recommendedAgent.specialization}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="error">
                            {t('leads.languageAssign.noAgent')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.recommendedAgent && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {item.recommendedAgent.languages.map(lang => (
                              <Chip
                                key={lang}
                                label={lang}
                                size="small"
                                variant={lang === item.leadLanguage ? 'filled' : 'outlined'}
                                color={lang === item.leadLanguage ? 'primary' : 'default'}
                                sx={{ fontSize: '0.65rem', height: '20px' }}
                              />
                            ))}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            item.matchType === 'language-match' ? t('leads.languageAssign.matchTypes.perfect') :
                              item.matchType === 'fallback' ? t('leads.languageAssign.matchTypes.fallback') :
                                t('leads.languageAssign.matchTypes.noMatch')
                          }
                          size="small"
                          color={
                            item.matchType === 'language-match' ? 'success' :
                              item.matchType === 'fallback' ? 'warning' :
                                'error'
                          }
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                {t('leads.languageAssign.summary.title')}
              </Typography>
              <Typography variant="body2">
                • {t('leads.languageAssign.summary.perfect', { count: assignmentPreview.filter(item => item.matchType === 'language-match').length })}
              </Typography>
              <Typography variant="body2">
                • {t('leads.languageAssign.summary.fallback', { count: assignmentPreview.filter(item => item.matchType === 'fallback').length })}
              </Typography>
              <Typography variant="body2">
                • {t('leads.languageAssign.summary.unassignable', { count: assignmentPreview.filter(item => item.matchType === 'no-match').length })}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLanguageAssignDialog(false)}>{t('common.cancel')}</Button>
            <Button
              onClick={confirmLanguageAssignment}
              variant="contained"
              disabled={assignmentPreview.filter(item => item.recommendedAgent).length === 0}
              sx={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                }
              }}
            >
              {t('leads.languageAssign.confirmButton')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Call Dialog */}
        <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CallIcon color="success" />
              <Typography variant="h6" fontWeight="600">{t('leads.contactLead.title')}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Lead ID */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.contactLead.labels.leadId')}</Typography>
                <Typography variant="body1" fontWeight="600" color="primary">
                  LD{new Date().getFullYear()}{String(selectedCallLead?.id || 0).padStart(6, '0')}
                </Typography>
              </Box>

              {/* Lead Name */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.contactLead.labels.leadName')}</Typography>
                <Typography variant="body1" fontWeight="600">
                  {selectedCallLead ? (
                    `${t(`mockData.leads.${selectedCallLead.id}.firstName`) || selectedCallLead.firstName} ${t(`mockData.leads.${selectedCallLead.id}.lastName`) || selectedCallLead.lastName}`
                  ) : ''}
                </Typography>
              </Box>

              {/* Company & Position */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.contactLead.labels.company')}</Typography>
                <Typography variant="body1">
                  {selectedCallLead ? (t(`mockData.leads.${selectedCallLead.id}.company`) || selectedCallLead.company) : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCallLead ? (t(`mockData.leads.${selectedCallLead.id}.position`) || selectedCallLead.position) : ''}
                </Typography>
              </Box>

              {/* Status & Priority */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.contactLead.labels.status')}</Typography>
                  <Chip
                    label={selectedCallLead ? t(`leads.statuses.${selectedCallLead.status}`) : ''}
                    size="small"
                    sx={{
                      mt: 0.5,
                      backgroundColor: alpha(getStatusColor(selectedCallLead?.status), 0.1),
                      color: getStatusColor(selectedCallLead?.status)
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.contactLead.labels.priority')}</Typography>
                  <Chip
                    label={selectedCallLead ? t(`leads.priorities.${selectedCallLead.priority}`) : ''}
                    size="small"
                    sx={{
                      mt: 0.5,
                      backgroundColor: alpha(getPriorityColor(selectedCallLead?.priority), 0.1),
                      color: getPriorityColor(selectedCallLead?.priority)
                    }}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Phone Number */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                  {t('leads.contactLead.labels.phoneNumber')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="h6" fontWeight="600">
                    {selectedCallLead?.phone}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    component="a"
                    href={`tel:${selectedCallLead?.phone}`}
                    startIcon={<CallIcon />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    }}
                  >
                    {t('leads.contactLead.labels.dial')}
                  </Button>
                </Box>
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600">Email</Typography>
                <Typography variant="body1">
                  {selectedCallLead?.email}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCallDialogOpen(false)}>{t('common.close')}</Button>
          </DialogActions>
        </Dialog>

        {/* Vahan Verification Dialog */}
        <Dialog
          open={vahanDialog}
          onClose={() => {
            setVahanDialog(false);
            setVahanVerificationLead(null);
            setVahanVehicleNumber('');
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VehicleIcon color="primary" />
              <Typography variant="h6">{t('leads.vahanVerify.title')}</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {vahanVerificationLead && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {t('leads.vahanVerify.verifyingFor', { name: `${t(`mockData.leads.${vahanVerificationLead.id}.firstName`) || vahanVerificationLead.firstName} ${t(`mockData.leads.${vahanVerificationLead.id}.lastName`) || vahanVerificationLead.lastName}` })}
                </Alert>
              )}

              <TextField
                fullWidth
                label={t('leads.vahanVerify.title')}
                value={vahanVehicleNumber}
                onChange={(e) => setVahanVehicleNumber(e.target.value.toUpperCase())}
                placeholder={t('leads.vahanVerify.placeholder')}
                helperText={t('leads.vahanVerify.helper')}
                disabled={vahanLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VehicleIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {vahanLoading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                    {t('leads.vahanVerify.loading')}
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setVahanDialog(false);
                setVahanVerificationLead(null);
                setVahanVehicleNumber('');
              }}
              disabled={vahanLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleConfirmVahanVerification}
              variant="contained"
              disabled={!vahanVehicleNumber || vahanLoading}
              startIcon={vahanLoading ? <CircularProgress size={16} /> : <VerifiedUserIcon />}
            >
              {vahanLoading ? t('leads.bulk.verifying') : t('leads.vahanVerify.verifyButton')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default LeadManagement;
