import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BulkUpload from '../components/common/BulkUpload';
import FailedRecordsViewer from '../components/common/FailedRecordsViewer';
import { useDedupe } from '../context/DedupeContext';
import { History as HistoryIcon } from '@mui/icons-material';
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
  CloudDownload as CloudDownloadIcon
} from '@mui/icons-material';

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
    priority: 'High',
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
    totalCalls: 3
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
    priority: 'Medium',
    leadType: 'Premium',
    assignedTo: 'Amit Kumar',
    assignedToId: 'amit.kumar',
    value: 750000,
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

const LeadManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { checkDuplicate } = useDedupe();
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
    // This would integrate with your email system
    setSnackbar({ open: true, message: `Email sent to ${lead.email}`, severity: 'success' });
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
            assignmentReason: `Language Match: ${leadLanguage}`,
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
              assignmentReason: `Fallback: No ${leadLanguage} agent available`,
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

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

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
            All Leads
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all sales leads
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setUploadDialog(true)}
            >
              Data Provider Upload
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => setBulkUploadOpen(true)}
            >
              Bulk Upload
            </Button>
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => setShowUploadHistory(!showUploadHistory)}
            >
              Upload History
            </Button>
            <Button
              variant="outlined"
              startIcon={<GroupIcon />}
              onClick={() => setAgentTableOpen(true)}
            >
              View Agents
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                console.log('🔍 Debug Info:');
                console.log('Total leads:', leads.length);
                console.log('Unassigned leads:', leads.filter(l => !l.assignedTo || l.assignedTo.trim() === '').map(l => ({ id: l.id, name: `${l.firstName} ${l.lastName}`, language: l.preferredLanguage })));
                console.log('Agents:', agents.map(a => ({ name: a.name, languages: a.languages })));
                console.log('Selected leads:', selectedLeads);
              }}
            >
              Debug Info
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
            Add Lead
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
                Total Leads
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
                New Leads
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
                Qualified
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
                Closed Won
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
                Total Value
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
                placeholder="Search leads..."
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="All">All Priority</MenuItem>
                  {priorityOptions.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={assignedFilter}
                  label="Assigned To"
                  onChange={(e) => setAssignedFilter(e.target.value)}
                >
                  <MenuItem value="All">All Users</MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <FormControl fullWidth>
                <InputLabel>Lead Type</InputLabel>
                <Select
                  value={leadTypeFilter}
                  label="Lead Type"
                  onChange={(e) => setLeadTypeFilter(e.target.value)}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  {leadTypeOptions.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
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
                Reset
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
                {selectedLeads.length} lead(s) selected
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  onClick={handleBulkAssignment}
                  size="small"
                >
                  Manual Assign
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
                  Language Match
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
                  Auto Assign Premium
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PhoneForwardedIcon />}
                  onClick={handlePushToDialer}
                  size="small"
                  color="primary"
                >
                  Push to Dialer
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
                  Archive Selected
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
                  <TableCell>Lead</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Total Calls</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Last Contact</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLeads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        label={lead.leadType}
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
                        label={lead.status}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                          color: getStatusColor(lead.status),
                          border: `1px solid ${alpha(getStatusColor(lead.status), 0.3)}`
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.priority}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getPriorityColor(lead.priority), 0.1),
                          color: getPriorityColor(lead.priority),
                          border: `1px solid ${alpha(getPriorityColor(lead.priority), 0.3)}`
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={lead.assignedTo ? 600 : 400}>
                          {lead.assignedTo || 'Unassigned'}
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
                        label={lead.preferredLanguage || 'English'}
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
                        {lead.lastContactDate || 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Call Lead">
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
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(lead)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Quick Update">
                          <IconButton size="small" onClick={() => handleQuickUpdate(lead)}>
                            <NoteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Actions">
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
          {editingLead ? 'Edit Lead' : 'Add New Lead'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            {/* Multi-Phone Mapping */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                📞 Phone Numbers
              </Typography>
              {phoneNumbers.map((phone, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Phone ${index + 1}`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                  />
                  {phoneNumbers.length > 1 && (
                    <IconButton onClick={() => handleRemovePhone(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddPhone}
                size="small"
                variant="outlined"
              >
                Add Phone
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={formData.source}
                  label="Source"
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  {sourceOptions.map(source => (
                    <MenuItem key={source} value={source}>{source}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {priorityOptions.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Lead Type</InputLabel>
                <Select
                  value={formData.leadType}
                  label="Lead Type"
                  onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
                >
                  {leadTypeOptions.map(type => (
                    <MenuItem key={type} value={type}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{getLeadTypeIcon(type)}</span>
                        {type}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Lead Tagging */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>🏷 Lead Tag</InputLabel>
                <Select
                  value={leadTag}
                  label="🏷 Lead Tag"
                  onChange={(e) => setLeadTag(e.target.value)}
                >
                  {leadTagOptions.map(tag => (
                    <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={formData.assignedToId}
                  label="Assigned To"
                  onChange={(e) => {
                    const agent = agents.find(u => u.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      assignedToId: e.target.value,
                      assignedTo: agent?.name || ''
                    });
                  }}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Value (₹)"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expected Close Date"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Product and Insurance Fields */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  value={formData.product}
                  label="Product"
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                >
                  {productOptions.map(product => (
                    <MenuItem key={product} value={product}>{product}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sub Product</InputLabel>
                <Select
                  value={formData.subProduct}
                  label="Sub Product"
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
                    <MenuItem key={subProduct} value={subProduct}>{subProduct}</MenuItem>
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
                    label="Vehicle Registration Number"
                    value={formData.vehicleRegistrationNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleRegistrationNumber: e.target.value })}
                    placeholder="e.g., MH12AB1234"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                      value={formData.vehicleType}
                      label="Vehicle Type"
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    >
                      {vehicleTypeOptions.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Preferred Language</InputLabel>
                <Select
                  value={formData.preferredLanguage || 'English'}
                  label="Preferred Language"
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <MenuItem value="Bengali">Bengali</MenuItem>
                  <MenuItem value="Tamil">Tamil</MenuItem>
                  <MenuItem value="Telugu">Telugu</MenuItem>
                  <MenuItem value="Marathi">Marathi</MenuItem>
                  <MenuItem value="Gujarati">Gujarati</MenuItem>
                  <MenuItem value="Kannada">Kannada</MenuItem>
                  <MenuItem value="Punjabi">Punjabi</MenuItem>
                  <MenuItem value="Urdu">Urdu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveLead}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (editingLead ? 'Update' : 'Save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Assignment Dialog */}
      <Dialog open={bulkAssignmentDialog} onClose={() => setBulkAssignmentDialog(false)}>
        <DialogTitle>Bulk Assign Leads</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Assign {selectedLeads.length} selected lead(s) to an agent:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Agent</InputLabel>
            <Select
              value={bulkAssignmentAgent}
              label="Select Agent"
              onChange={(e) => setBulkAssignmentAgent(e.target.value)}
            >
              {agents.map(agent => (
                <MenuItem key={agent.id} value={agent.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{agent.name}</span>
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
          <Button onClick={() => setBulkAssignmentDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmBulkAssignment} variant="contained">
            Assign Leads
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Update Dialog */}
      <Dialog open={quickUpdateDialog} onClose={() => setQuickUpdateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Quick Update - {selectedLead?.firstName} {selectedLead?.lastName}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={quickUpdateData.status}
                  label="Status"
                  onChange={(e) => setQuickUpdateData({ ...quickUpdateData, status: e.target.value })}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Follow-up Date"
                type="date"
                value={quickUpdateData.followUpDate}
                onChange={(e) => setQuickUpdateData({ ...quickUpdateData, followUpDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={quickUpdateData.notes}
                onChange={(e) => setQuickUpdateData({ ...quickUpdateData, notes: e.target.value })}
                placeholder="Add notes about this lead..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveQuickUpdate} variant="contained">
            Save Updates
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
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleArchiveLead(selectedLead?.id);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
      </Menu>

      {/* Data Provider Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Data Provider Upload</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload Excel/CSV file from data provider
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2, mb: 2 }}
            >
              Choose File (Excel/CSV)
              <input
                type="file"
                hidden
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />
            </Button>
            {uploadFile && (
              <Typography variant="body2" color="primary" gutterBottom>
                Selected: {uploadFile.name}
              </Typography>
            )}
            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
            {uploadSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ Upload Success! File processed successfully.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={!uploadFile || loading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expiry Check Dialog */}
      <Dialog open={expiryCheckDialog} onClose={() => setExpiryCheckDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          📅 Policy Expiry Verification
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
                    <Typography variant="caption">CRM System</Typography>
                    <Typography variant="h6">{selectedPolicy.crmExpiryDate}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                    <Typography variant="caption">NAV System</Typography>
                    <Typography variant="h6">{selectedPolicy.navExpiryDate}</Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>Status:</Typography>
                <Typography variant="h6">
                  {getStatusIcon(getExpiryStatus(selectedPolicy.crmExpiryDate))}
                </Typography>
                <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                  {getExpiryStatus(selectedPolicy.crmExpiryDate)}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Customer: {selectedPolicy.customerName}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Vehicle: {selectedPolicy.vehicleNumber}
              </Typography>
              
              {navCheckLoading && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2">Verifying with NAV system...</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpiryCheckDialog(false)}>Close</Button>
          <Button 
            onClick={handleNavVerification} 
            variant="contained"
            disabled={navCheckLoading}
            startIcon={navCheckLoading ? <CircularProgress size={16} /> : null}
          >
            {navCheckLoading ? 'Verifying...' : 'Verify with NAV'}
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
            <Typography variant="h6" fontWeight="600">Agent Performance Dashboard</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agent</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Total Leads</TableCell>
                  <TableCell>Closed Deals</TableCell>
                  <TableCell>Success Rate</TableCell>
                  <TableCell>Languages</TableCell>
                  <TableCell>Specialization</TableCell>
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
                              {agent.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Current: {currentWorkload} leads
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
                              label={language}
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
                          {agent.specialization}
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
          <Button onClick={() => setAgentTableOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Auto Assignment Dialog */}
      <Dialog open={autoAssignDialog} onClose={() => setAutoAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.5rem' }}>👑</span>
            <Typography variant="h6" fontWeight="600">Auto-Assign Premium Leads</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              This will automatically assign all unassigned Premium leads to the top-rated agents based on:
            </Typography>
            <Box sx={{ ml: 2, mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>• Agent rating (highest first)</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>• Current workload (balanced distribution)</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>• Agent specialization</Typography>
            </Box>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Premium Leads to Assign:
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="600">
                {leads.filter(lead => lead.leadType === 'Premium' && !lead.assignedTo).length}
              </Typography>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Top Agents by Rating:
              </Typography>
              {[...agents].sort((a, b) => b.rating - a.rating).slice(0, 3).map((agent, index) => (
                <Box key={agent.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{index + 1}. {agent.name}</Typography>
                  <Typography variant="body2" fontWeight="600">⭐ {agent.rating}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAutoAssignDialog(false)}>Cancel</Button>
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
            Auto-Assign Premium Leads
          </Button>
        </DialogActions>
      </Dialog>

      {/* Language Assignment Preview Dialog */}
      <Dialog open={languageAssignDialog} onClose={() => setLanguageAssignDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.5rem' }}>🌐</span>
            <Typography variant="h6" fontWeight="600">Language-Based Assignment Preview</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Review the proposed assignments based on language preferences:
          </Typography>
          
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Lead</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Recommended Agent</TableCell>
                  <TableCell>Agent Languages</TableCell>
                  <TableCell>Match Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignmentPreview.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {item.lead.firstName} {item.lead.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.lead.company}
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
                            {item.recommendedAgent.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ⭐ {item.recommendedAgent.rating} | {item.recommendedAgent.specialization}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="error">
                          No agent available
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
                          item.matchType === 'language-match' ? 'Perfect Match' :
                          item.matchType === 'fallback' ? 'Fallback (English)' :
                          'No Match'
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
              Assignment Summary:
            </Typography>
            <Typography variant="body2">
              • Perfect Matches: {assignmentPreview.filter(item => item.matchType === 'language-match').length}
            </Typography>
            <Typography variant="body2">
              • Fallback Assignments: {assignmentPreview.filter(item => item.matchType === 'fallback').length}
            </Typography>
            <Typography variant="body2">
              • Unassignable: {assignmentPreview.filter(item => item.matchType === 'no-match').length}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLanguageAssignDialog(false)}>Cancel</Button>
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
            Confirm Assignments
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="success" />
            <Typography variant="h6" fontWeight="600">Contact Lead</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Lead ID */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">Lead ID</Typography>
              <Typography variant="body1" fontWeight="600" color="primary">
                LD{new Date().getFullYear()}{String(selectedCallLead?.id || 0).padStart(6, '0')}
              </Typography>
            </Box>

            {/* Lead Name */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">Lead Name</Typography>
              <Typography variant="body1" fontWeight="600">
                {selectedCallLead?.firstName} {selectedCallLead?.lastName}
              </Typography>
            </Box>

            {/* Company & Position */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">Company</Typography>
              <Typography variant="body1">
                {selectedCallLead?.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCallLead?.position}
              </Typography>
            </Box>

            {/* Status & Priority */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">Status</Typography>
                <Chip
                  label={selectedCallLead?.status}
                  size="small"
                  sx={{
                    mt: 0.5,
                    backgroundColor: alpha(getStatusColor(selectedCallLead?.status), 0.1),
                    color: getStatusColor(selectedCallLead?.status)
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">Priority</Typography>
                <Chip
                  label={selectedCallLead?.priority}
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
                Phone Number
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
                  Dial
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
          <Button onClick={() => setCallDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </LocalizationProvider>
  );
};

export default LeadManagement;
