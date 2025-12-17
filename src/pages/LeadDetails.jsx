import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import MultiContactNumberManager from '../components/leads/MultiContactNumberManager';
import DocumentCollectionTracker from '../components/leads/DocumentCollectionTracker';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Stack,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Paper,
  Tooltip,
  useTheme,
  alpha,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Description as DocumentIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Note as NoteIcon,
  Assignment as TaskIcon,
  Call as CallIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  Visibility as VisibilityIcon,
  InsertDriveFile as InsuranceDocIcon,
  DirectionsCar as VehicleIcon,
  History as HistoryIcon,
  Create as CreateIcon,
  AccessTime as AccessTimeIcon,
  Person as UserIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as ThumbUpIcon,
  Feedback as FeedbackIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  AttachFile as FileIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Payment as PaymentIcon,
  Send as SendIcon
} from '@mui/icons-material';

const LeadDetails = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { convertLead, isLeadConverted } = useLeads();
  const [currentTab, setCurrentTab] = useState(0);
  const [activitiesSubTab, setActivitiesSubTab] = useState(0);
  const [lead, setLead] = useState(null);

  // Dialog states
  const [addTaskDialog, setAddTaskDialog] = useState(false);
  const [addCallLogDialog, setAddCallLogDialog] = useState(false);
  const [callDialog, setCallDialog] = useState(false);
  const [addClaimDialog, setAddClaimDialog] = useState(false);
  const [uploadDocumentDialog, setUploadDocumentDialog] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [convertDialog, setConvertDialog] = useState(false);
  const [documentType, setDocumentType] = useState('vehicle'); // 'vehicle' or 'insurance'
  const [fileUploadDialog, setFileUploadDialog] = useState(false);
  const [followUpDialog, setFollowUpDialog] = useState(false);
  const [paymentLinkDialog, setPaymentLinkDialog] = useState(false);
  const [callNumberDialog, setCallNumberDialog] = useState(false);
  const [postCallDialog, setPostCallDialog] = useState(false);

  // Payment link form state
  const [paymentLinkData, setPaymentLinkData] = useState({
    amount: '',
    purpose: '',
    expiryDays: 7,
    sendVia: {
      email: true,
      sms: false,
      whatsapp: false
    }
  });

  // Call log form state
  const [selectedNumber, setSelectedNumber] = useState('');
  const [callLogData, setCallLogData] = useState({
    status: '',
    subStatus: '',
    followUpDate: '',
    followUpTime: '',
  });

  const [policyViewDialog, setPolicyViewDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [documentViewDialog, setDocumentViewDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Quote form state
  const [shareQuoteDialogOpen, setShareQuoteDialogOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    quoteType: 'standard',
    premium: '',
    coverage: '',
    validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

  // Mock policy history data
  const policyHistoryData = [
    {
      id: 'POL001',
      policyNumber: 'INS-2024-001',
      type: 'Motor Insurance',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premium: 45000,
      status: 'Active',
      vehicleDetails: 'Honda City - MH01AB1234',
      ncb: '50%',
      claims: 0
    },
    {
      id: 'POL002',
      policyNumber: 'INS-2023-045',
      type: 'Motor Insurance',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      premium: 42000,
      status: 'Expired',
      vehicleDetails: 'Honda City - MH01AB1234',
      ncb: '45%',
      claims: 0
    },
    {
      id: 'POL003',
      policyNumber: 'INS-2022-089',
      type: 'Motor Insurance',
      startDate: '2022-01-01',
      endDate: '2022-12-31',
      premium: 48000,
      status: 'Expired',
      vehicleDetails: 'Honda City - MH01AB1234',
      ncb: '35%',
      claims: 1
    }
  ];

  // Document type options
  const vehicleDocumentTypes = [
    'Registration Certificate',
    'Previous Policy Copy',
    'Inspection Report',
    'CKYC Document',
    'Customer Declaration',
    'Others'
  ];

  // File upload document types
  const fileDocumentTypes = [
    'Aadhaar Card',
    'PAN Card',
    'Driving License',
    'Passport',
    'Voter ID',
    'Bank Statement',
    'Salary Certificate',
    'Income Tax Return',
    'Address Proof',
    'Other Identity Proof'
  ];

  // Form states
  const [taskForm, setTaskForm] = useState({ task: '', dueDate: '', assignedTo: '', priority: 'Medium' });
  const [callLogForm, setCallLogForm] = useState({ type: 'Outbound', duration: '', notes: '', status: 'Completed' });
  const [callDetailsDialog, setCallDetailsDialog] = useState(false);
  const [selectedCallLog, setSelectedCallLog] = useState(null);
  const [claimForm, setClaimForm] = useState({
    customerName: '',
    mobileNumber: '',
    emailId: '',
    insuranceCompany: '',
    policyNumber: '',
    expiryDate: '',
    claimNumber: '',
    claimStatus: 'Pending',
    remarks: ''
  });
  const [documentForm, setDocumentForm] = useState({ documentName: 'Registration Certificate', file: null });
  const [fileUploadForm, setFileUploadForm] = useState({
    documentType: 'Aadhaar Card',
    files: [],
    status: 'Pending'
  });
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [fileStatusFilter, setFileStatusFilter] = useState('All');
  const [fileTypeFilter, setFileTypeFilter] = useState('All');
  const [convertForm, setConvertForm] = useState({
    productType: '',
    policyNumber: '',
    premiumAmount: '',
    age: '',
    gender: '',
    policyStartDate: '',
    policyEndDate: ''
  });
  const [followUpForm, setFollowUpForm] = useState({
    date: '',
    time: '',
    type: 'Call',
    priority: 'Medium',
    notes: '',
    assignedTo: ''
  });

  // Mock data states
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [claims, setClaims] = useState([]);
  const [vehicleDocuments, setVehicleDocuments] = useState([]);
  const [insuranceDocuments, setInsuranceDocuments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [policyDetails, setPolicyDetails] = useState(null);
  const [nomineeDetails, setNomineeDetails] = useState(null);
  const [customerFeedback, setCustomerFeedback] = useState({
    rating: '',
    feedback: '',
    feedbackDate: '',
    feedbackBy: '',
    recommendationScore: '',
    satisfactionAreas: [],
    improvementAreas: [],
    additionalComments: ''
  });

  // Activity timeline state
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'status_change',
      description: 'Status changed from New to Qualified',
      timestamp: '2024-01-15 10:30 AM',
      user: 'Priya Patel'
    },
    {
      id: 2,
      type: 'note_added',
      description: 'Added new notes about premium requirements',
      timestamp: '2024-01-15 11:45 AM',
      user: 'Amit Kumar'
    },
    {
      id: 3,
      type: 'call_made',
      description: 'Outbound call completed (Duration: 15 mins)',
      timestamp: '2024-01-16 02:15 PM',
      user: 'Sneha Gupta'
    },
    {
      id: 4,
      type: 'task_created',
      description: 'New task created: Follow up on policy documents',
      timestamp: '2024-01-16 03:30 PM',
      user: 'Vikram Singh'
    },
    {
      id: 5,
      type: 'document_uploaded',
      description: 'Vehicle registration document uploaded',
      timestamp: '2024-01-17 09:20 AM',
      user: 'Priya Patel'
    }
  ]);

  // Mock users for assignment
  const users = [
    { id: 'priya.patel', name: 'Priya Patel' },
    { id: 'amit.kumar', name: 'Amit Kumar' },
    { id: 'sneha.reddy', name: 'Sneha Reddy' },
    { id: 'vikram.singh', name: 'Vikram Singh' }
  ];

  // Generate Lead ID
  const generateLeadId = (id) => {
    return `LD${new Date().getFullYear()}${String(id).padStart(6, '0')}`;
  };

  // Load lead data (mock)
  useEffect(() => {
    // In a real app, this would fetch from API
    const mockLead = {
      id: parseInt(leadId),
      firstName: 'Rajesh',
      lastName: 'Sharma',
      email: 'rajesh.sharma@gmail.com',
      phone: '+91-98765-43210',
      alternatePhone: '+91-87654-32109',
      company: 'TechVision Solutions Pvt Ltd',
      position: 'Managing Director',
      source: 'Website',
      status: 'Qualified',
      priority: 'High',
      assignedTo: 'Priya Patel',
      value: 250000,
      expectedCloseDate: '2025-02-15',
      lastContactDate: '2025-01-15',
      notes: 'Interested in comprehensive vehicle insurance package. Follow up scheduled for next week.',
      createdAt: '2025-01-10',
      product: 'Insurance',
      subProduct: 'Vehicle Insurance',
      vehicleRegistrationNumber: 'MH12AB1234',
      vehicleType: 'Private Car'
    };

    setLead(mockLead);

    // Mock policy details
    const mockPolicyValue = mockLead.value || 500000;
    const mockODPremium = Math.floor(mockPolicyValue * 0.02);
    const mockLiabilityPremium = 2500;
    const mockAddOnPremium = 1500;
    const mockNetPremium = mockODPremium + mockLiabilityPremium + mockAddOnPremium;
    const mockGST = Math.floor(mockNetPremium * 0.18);

    setPolicyDetails({
      policyNumber: `POL${Math.floor(Math.random() * 1000000)}`,
      policyType: mockLead.subProduct || 'Not Assigned',
      policyStatus: mockLead.status === 'Closed Won' ? 'Active' : 'Pending',
      idv: mockPolicyValue,
      odPremium: mockODPremium,
      liabilityPremium: mockLiabilityPremium,
      addOnPremium: mockAddOnPremium,
      netPremium: mockNetPremium,
      gst: mockGST,
      finalPremium: mockNetPremium + mockGST,
      referenceId: `REF-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`,
      policyStartDate: '2024-01-15',
      policyEndDate: '2025-01-15',
      policyExpiryDate: '2025-01-15',
      paymentFrequency: 'Annual',
      nextPaymentDue: '2024-07-15'
    });

    // Mock nominee details
    setNomineeDetails({
      nomineeName: 'Priya Sharma',
      relationship: 'Spouse',
      dateOfBirth: '1992-05-20',
      contactNumber: '+91-98765-11111',
      email: 'priya.sharma@gmail.com',
      address: 'Flat 302, Sai Paradise, Bandra West, Mumbai, Maharashtra 400050',
      nomineePercentage: 100
    });

    // Mock notes
    setNotes([
      { id: 1, date: '2025-01-15', user: 'Priya Patel', content: 'Initial contact made. Customer is very interested in comprehensive insurance coverage.', createdAt: '2025-01-15 10:30 AM' },
      { id: 2, date: '2025-01-12', user: 'Amit Kumar', content: 'Follow up scheduled for next week. Discussed premium options.', createdAt: '2025-01-12 02:45 PM' }
    ]);

    // Mock tasks
    setTasks([
      { id: 1, task: 'Follow up call', dueDate: '2024-02-01', status: 'Pending', assignedTo: 'Sarah Johnson', priority: 'High', createdAt: '2024-01-15' },
      { id: 2, task: 'Send policy documents', dueDate: '2024-01-20', status: 'Completed', assignedTo: 'Sarah Johnson', priority: 'Medium', createdAt: '2024-01-14' }
    ]);

    // Mock call logs with enhanced data
    setCallLogs([
      {
        id: 1,
        date: '2024-01-15',
        time: '10:30 AM',
        duration: '15 min',
        type: 'Outbound',
        status: 'Completed',
        disposition: 'Call Back',
        subDisposition: 'Specific Time',
        notes: 'Discussed policy options and premium calculations. Customer interested in comprehensive coverage.',
        agentName: 'Sarah Johnson',
        callSummary: 'Customer inquiry about vehicle insurance premium. Provided quote for comprehensive coverage.',
        followUpRequired: true,
        callRating: 4
      },
      {
        id: 2,
        date: '2024-01-12',
        time: '02:45 PM',
        duration: '8 min',
        type: 'Inbound',
        status: 'Completed',
        disposition: 'Interested',
        subDisposition: 'Needs Quote',
        notes: 'Customer inquiry about premium payment options and policy renewal process.',
        agentName: 'Mike Wilson',
        callSummary: 'Customer called to inquire about premium payment methods.',
        followUpRequired: false,
        callRating: 5
      },
      {
        id: 3,
        date: '2024-01-10',
        time: '11:15 AM',
        duration: '0 min',
        type: 'Outbound',
        status: 'Missed',
        disposition: 'Not Reachable',
        subDisposition: 'Not Responding',
        notes: 'Customer did not answer. Left voicemail.',
        agentName: 'Sarah Johnson',
        callSummary: 'Attempted to contact customer for policy follow-up.',
        followUpRequired: true,
        callRating: null
      }
    ]);

    // Mock claims
    setClaims([
      { id: 1, claimNumber: 'CLM12345', date: '2024-01-10', amount: 5000, status: 'Approved', description: 'Vehicle accident claim' },
      { id: 2, claimNumber: 'CLM12340', date: '2023-12-15', amount: 3000, status: 'Settled', description: 'Minor damage claim' }
    ]);

    // Mock vehicle documents
    setVehicleDocuments([
      { id: 1, documentName: 'Registration Certificate', uploadDate: '2024-01-10', status: 'Verified', size: '2.5 MB' },
      { id: 2, documentName: 'Pollution Certificate', uploadDate: '2024-01-08', status: 'Pending', size: '1.8 MB' }
    ]);

    // Mock insurance documents
    setInsuranceDocuments([
      { id: 1, documentName: 'Policy Document', uploadDate: '2024-01-15', status: 'Active', size: '3.2 MB' },
      { id: 2, documentName: 'Premium Receipt', uploadDate: '2024-01-15', status: 'Active', size: '1.1 MB' }
    ]);

    // Mock uploaded files
    setUploadedFiles([
      {
        id: 1,
        documentType: 'Aadhaar Card',
        fileName: 'aadhaar_rajesh_sharma.pdf',
        uploadedOn: '2024-01-15',
        status: 'Verified',
        fileType: 'pdf',
        size: '2.1 MB'
      },
      {
        id: 2,
        documentType: 'PAN Card',
        fileName: 'pan_card_image.jpg',
        uploadedOn: '2024-01-14',
        status: 'Pending',
        fileType: 'image',
        size: '1.8 MB'
      },
      {
        id: 3,
        documentType: 'Driving License',
        fileName: 'driving_license.pdf',
        uploadedOn: '2024-01-12',
        status: 'Rejected',
        fileType: 'pdf',
        size: '3.5 MB'
      }
    ]);
  }, [leadId]);

  const getStatusColor = (status) => {
    const colors = {
      'New': theme.palette.info.main,
      'Contacted': theme.palette.warning.main,
      'Qualified': theme.palette.primary.main,
      'Proposal': theme.palette.secondary.main,
      'Negotiation': theme.palette.warning.dark,
      'Closed Won': theme.palette.success.main,
      'Closed Lost': theme.palette.error.main,
      'Active': theme.palette.success.main,
      'Pending': theme.palette.warning.main,
      'Approved': theme.palette.success.main,
      'Settled': theme.palette.success.main,
      'Completed': theme.palette.success.main,
      'Verified': theme.palette.success.main
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

  // Handle customer feedback
  const handleAddFeedback = () => {
    const newFeedback = {
      ...customerFeedback,
      feedbackDate: new Date().toISOString().split('T')[0],
      feedbackBy: lead?.assignedTo || 'System User'
    };
    setCustomerFeedback(newFeedback);
    setFeedbackDialog(false);
    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: 'feedback_added',
      description: `Customer feedback added with rating ${newFeedback.rating}/5`,
      timestamp: new Date().toLocaleString(),
      user: newFeedback.feedbackBy
    };
    setActivities([newActivity, ...activities]);
  };

  // Handle convert lead to customer
  const handleConvertLead = async () => {
    try {
      const policyDetails = {
        productType: convertForm.productType || lead.subProduct || 'Insurance',
        policyNumber: convertForm.policyNumber || `POL-${Date.now()}`,
        premiumAmount: parseFloat(convertForm.premiumAmount) || 0,
        age: parseInt(convertForm.age) || 0,
        gender: convertForm.gender || '',
        policyStartDate: convertForm.policyStartDate || new Date().toISOString().split('T')[0],
        policyEndDate: convertForm.policyEndDate || ''
      };

      await convertLead(parseInt(leadId), policyDetails);

      // Update local lead state
      setLead({ ...lead, status: 'Closed Won' });

      // Add to activities
      const newActivity = {
        id: activities.length + 1,
        type: 'lead_converted',
        description: 'Lead successfully converted to customer',
        timestamp: new Date().toLocaleString(),
        user: lead?.assignedTo || 'System User'
      };
      setActivities([newActivity, ...activities]);

      setConvertDialog(false);
      alert('Lead successfully converted to customer!');

      // Optionally navigate to customer database
      // navigate('/customer-database');
    } catch (error) {
      alert(error.message || 'Failed to convert lead');
    }
  };

  // Handle add task
  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      ...taskForm,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, newTask]);
    setAddTaskDialog(false);
    setTaskForm({ task: '', dueDate: '', assignedTo: '', priority: 'Medium' });
  };

  // Handle add call log
  const handleAddCallLog = () => {
    const newCallLog = {
      id: callLogs.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      ...callLogForm,
      agentName: lead?.assignedTo || 'Unknown',
      callSummary: callLogForm.notes.substring(0, 100) + (callLogForm.notes.length > 100 ? '...' : ''),
      followUpRequired: callLogForm.status !== 'Completed',
      callRating: callLogForm.status === 'Completed' ? 4 : null
    };
    setCallLogs([...callLogs, newCallLog]);
    setAddCallLogDialog(false);
    setCallLogForm({ type: 'Outbound', duration: '', notes: '', status: 'Completed' });
  };

  // Handle view call details
  const handleViewCallDetails = (callLog) => {
    setSelectedCallLog(callLog);
    setCallDetailsDialog(true);
  };

  // Handle add claim
  const handleAddClaim = () => {
    const newClaim = {
      id: claims.length + 1,
      date: new Date().toISOString().split('T')[0],
      customerName: lead.firstName + ' ' + lead.lastName,
      mobileNumber: lead.phone,
      emailId: lead.email,
      ...claimForm
    };
    setClaims([...claims, newClaim]);
    setAddClaimDialog(false);
    setClaimForm({
      customerName: '',
      mobileNumber: '',
      emailId: '',
      insuranceCompany: '',
      policyNumber: '',
      expiryDate: '',
      claimNumber: '',
      claimStatus: 'Pending',
      remarks: ''
    });
  };

  // Handle upload document
  const handleUploadDocument = () => {
    const newDocument = {
      id: documentType === 'vehicle' ? vehicleDocuments.length + 1 : insuranceDocuments.length + 1,
      documentName: documentForm.documentName,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      size: '1.5 MB'
    };

    if (documentType === 'vehicle') {
      setVehicleDocuments([...vehicleDocuments, newDocument]);
    } else {
      setInsuranceDocuments([...insuranceDocuments, newDocument]);
    }

    setUploadDocumentDialog(false);
    setDocumentForm({ documentName: '', file: null });
  };

  // Handle delete
  const handleDeleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const handleDeleteCallLog = (id) => setCallLogs(callLogs.filter(c => c.id !== id));
  const handleDeleteClaim = (id) => setClaims(claims.filter(c => c.id !== id));
  const handleDeleteVehicleDoc = (id) => setVehicleDocuments(vehicleDocuments.filter(d => d.id !== id));
  const handleDeleteInsuranceDoc = (id) => setInsuranceDocuments(insuranceDocuments.filter(d => d.id !== id));
  const handleDeleteUploadedFile = (id) => setUploadedFiles(uploadedFiles.filter(f => f.id !== id));

  // Handle file upload
  const handleFileUpload = () => {
    if (fileUploadForm.files.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }

    const newFiles = fileUploadForm.files.map((file, index) => ({
      id: uploadedFiles.length + index + 1,
      documentType: fileUploadForm.documentType,
      fileName: file.name,
      uploadedOn: new Date().toISOString().split('T')[0],
      status: fileUploadForm.status,
      fileType: file.type.includes('pdf') ? 'pdf' : 'image',
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setFileUploadDialog(false);
    setFileUploadForm({ documentType: 'Aadhaar Card', files: [], status: 'Pending' });
  };

  // Handle status update
  const handleStatusUpdate = (id, newStatus) => {
    setUploadedFiles(uploadedFiles.map(file =>
      file.id === id ? { ...file, status: newStatus } : file
    ));
  };

  // Handle schedule follow-up
  const handleScheduleFollowUp = () => {
    const newTask = {
      id: tasks.length + 1,
      task: `${followUpForm.type} follow-up: ${followUpForm.notes || 'Follow up with customer'}`,
      dueDate: followUpForm.date,
      assignedTo: followUpForm.assignedTo || lead?.assignedTo || 'Unassigned',
      priority: followUpForm.priority,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks([...tasks, newTask]);

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: 'task_created',
      description: `Follow-up ${followUpForm.type.toLowerCase()} scheduled for ${followUpForm.date}`,
      timestamp: new Date().toLocaleString(),
      user: lead?.assignedTo || 'System User'
    };
    setActivities([newActivity, ...activities]);

    setFollowUpDialog(false);
    setCallDetailsDialog(false);
    setFollowUpForm({
      date: '',
      time: '',
      type: 'Call',
      priority: 'Medium',
      notes: '',
      assignedTo: ''
    });
  };

  // Get file icon
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <PdfIcon sx={{ color: '#d32f2f' }} />;
      case 'image': return <ImageIcon sx={{ color: '#1976d2' }} />;
      default: return <FileIcon sx={{ color: '#757575' }} />;
    }
  };

  // Filter uploaded files
  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(fileSearchTerm.toLowerCase()) ||
      file.documentType.toLowerCase().includes(fileSearchTerm.toLowerCase());
    const matchesStatus = fileStatusFilter === 'All' || file.status === fileStatusFilter;
    const matchesType = fileTypeFilter === 'All' || file.documentType === fileTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle view policy details
  const handleViewPolicyDetails = (policy) => {
    setSelectedPolicy(policy);
    setPolicyViewDialog(true);
  };

  // Handle download policy
  const handleDownloadPolicy = (policy) => {
    // Create policy document content
    const policyContent = `
================================================================================
                           INSURANCE POLICY DOCUMENT
================================================================================

Policy Number: ${policy.policyNumber}
Policy Type: ${policy.type}
Status: ${policy.status}

--------------------------------------------------------------------------------
                              POLICY PERIOD
--------------------------------------------------------------------------------
Start Date: ${new Date(policy.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
End Date: ${new Date(policy.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

--------------------------------------------------------------------------------
                            VEHICLE DETAILS
--------------------------------------------------------------------------------
Vehicle: ${policy.vehicleDetails}

--------------------------------------------------------------------------------
                            PREMIUM DETAILS
--------------------------------------------------------------------------------
Premium Amount: ₹${policy.premium?.toLocaleString() || '0'}
No Claim Bonus (NCB): ${policy.ncb}
Claims History: ${policy.claims} claim(s)

--------------------------------------------------------------------------------
                           INSURED DETAILS
--------------------------------------------------------------------------------
Name: ${lead?.firstName} ${lead?.lastName}
Email: ${lead?.email}
Phone: ${lead?.phone}
Company: ${lead?.company || 'N/A'}

================================================================================
                              TERMS & CONDITIONS
================================================================================
1. This policy is subject to all terms and conditions as per the policy document.
2. Premium is payable as per the agreed schedule.
3. Claims should be intimated within 24 hours of the incident.
4. All renewals must be done before the expiry date to maintain continuity.
5. NCB benefit is applicable only if no claims are made during the policy period.

================================================================================
Generated on: ${new Date().toLocaleString('en-IN')}
Document Reference: ${policy.id}
================================================================================
`;

    // Create and download the file
    const blob = new Blob([policyContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Policy_${policy.policyNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: 'document_downloaded',
      description: `Policy document downloaded for ${policy.policyNumber}`,
      timestamp: new Date().toLocaleString(),
      user: lead?.assignedTo || 'System User'
    };
    setActivities([newActivity, ...activities]);
  };

  // Handle view document details
  const handleViewDocument = (doc, docType) => {
    setSelectedDocument({ ...doc, docType });
    setDocumentViewDialog(true);
  };

  // Handle Share Quote
  const handleOpenShareQuote = () => {
    setQuoteForm({
      quoteType: 'standard',
      premium: '',
      coverage: '',
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
    setShareQuoteDialogOpen(true);
  };

  const handleShareQuote = () => {
    // In production, this would generate and share the quote
    setShareQuoteDialogOpen(false);

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: 'quote_shared',
      description: `Quote shared with ${lead.firstName} ${lead.lastName} (Amount: ₹${quoteForm.premium})`,
      timestamp: new Date().toLocaleString(),
      user: lead?.assignedTo || 'System User'
    };
    setActivities([newActivity, ...activities]);

    // Show alert or snackbar
    alert(`Quote shared successfully with ${lead.firstName} ${lead.lastName}`);
  };

  // Handle download document
  const handleDownloadDocument = (doc, docType) => {
    // Create document content
    const documentContent = `
================================================================================
                           DOCUMENT DETAILS
================================================================================

Document Name: ${doc.documentName || doc.fileName || 'Unknown'}
Document Type: ${doc.documentType || docType}
Status: ${doc.status}

--------------------------------------------------------------------------------
                              FILE INFORMATION
--------------------------------------------------------------------------------
Upload Date: ${doc.uploadDate || doc.uploadedOn || 'N/A'}
File Size: ${doc.size || 'N/A'}
${doc.fileType ? `File Format: ${doc.fileType.toUpperCase()}` : ''}

--------------------------------------------------------------------------------
                           ASSOCIATED LEAD/CUSTOMER
--------------------------------------------------------------------------------
Name: ${lead?.firstName} ${lead?.lastName}
Email: ${lead?.email}
Phone: ${lead?.phone}
Company: ${lead?.company || 'N/A'}

--------------------------------------------------------------------------------
                              VERIFICATION STATUS
--------------------------------------------------------------------------------
Current Status: ${doc.status}
${doc.status === 'Verified' ? '✓ Document has been verified and approved.' : ''}
${doc.status === 'Pending' ? '⏳ Document is pending verification.' : ''}
${doc.status === 'Rejected' ? '✗ Document has been rejected. Please upload a valid document.' : ''}

================================================================================
Generated on: ${new Date().toLocaleString('en-IN')}
Document Reference: ${doc.id}
================================================================================
`;

    // Create and download the file
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = doc.documentName || doc.fileName || 'document';
    a.download = `${fileName.replace(/[^a-zA-Z0-9]/g, '_')}_details.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: 'document_downloaded',
      description: `Document downloaded: ${doc.documentName || doc.fileName}`,
      timestamp: new Date().toLocaleString(),
      user: lead?.assignedTo || 'System User'
    };
    setActivities([newActivity, ...activities]);
  };

  if (!lead) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/lead-management')}
          sx={{ mb: 2 }}
        >
          Back to Lead Management
        </Button>

        <Card className="healthcare-card">
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '2rem',
                    fontWeight: 600
                  }}
                >
                  {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight="600" gutterBottom>
                  {lead.firstName} {lead.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Lead ID: {generateLeadId(lead.id)}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={lead.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                      color: getStatusColor(lead.status),
                      border: `1px solid ${alpha(getStatusColor(lead.status), 0.3)}`,
                      fontWeight: 600
                    }}
                  />
                  <Chip
                    label={lead.priority}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getPriorityColor(lead.priority), 0.1),
                      color: getPriorityColor(lead.priority),
                      border: `1px solid ${alpha(getPriorityColor(lead.priority), 0.3)}`,
                      fontWeight: 600
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Created: {lead.createdAt}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<CallIcon />}
                    onClick={() => setCallNumberDialog(true)}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                    }}
                  >
                    Call Customer
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    onClick={() => setPaymentLinkDialog(true)}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    }}
                  >
                    Send Payment Link
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<MoneyIcon />}
                    onClick={handleOpenShareQuote}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    }}
                  >
                    Share Quote
                  </Button>
                  {lead.status !== 'Closed Won' && !isLeadConverted(parseInt(leadId)) && (
                    <Button
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => setConvertDialog(true)}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                      }}
                    >
                      Convert to Customer
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/lead-management?editLead=${leadId}`)}
                  >
                    Edit Lead
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Card className="healthcare-card">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Policy & Nominee" />
            <Tab label="Policy History" />
            <Tab label="Activities" />
            <Tab label="Contact Numbers" />
            <Tab label="Documents" />
            <Tab label="Vehicle Documents" />
            <Tab label="Insurance Documents" />
            <Tab label="KYC Documents" />
            <Tab label="Customer Feedback" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Overview Tab */}
          {currentTab === 0 && (
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Card className="healthcare-card" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      Contact Information
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{lead.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{lead.phone}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Alternate Phone</Typography>
                        <Typography variant="body1">{lead.alternatePhone || 'Not Provided'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Company</Typography>
                        <Typography variant="body1">{lead.company}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Position</Typography>
                        <Typography variant="body1">{lead.position}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Lead Details */}
              <Grid item xs={12} md={6}>
                <Card className="healthcare-card" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="primary" />
                      Lead Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Source</Typography>
                        <Typography variant="body1">{lead.source}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                        <Typography variant="body1">{lead.assignedTo || 'Unassigned'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Value</Typography>
                        <Typography variant="body1" fontWeight="600" color="primary">
                          ${lead.value?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Expected Close Date</Typography>
                        <Typography variant="body1">{lead.expectedCloseDate || 'Not set'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Last Contact</Typography>
                        <Typography variant="body1">{lead.lastContactDate || 'Never'}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Insurance Details */}
              <Grid item xs={12}>
                <Card className="healthcare-card">
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InsuranceDocIcon color="primary" />
                      Insurance Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Product</Typography>
                          <Typography variant="body1">{lead.product || 'Not Assigned'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Sub Product</Typography>
                          <Typography variant="body1">{lead.subProduct || 'Not Assigned'}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Policy Expiry Date</Typography>
                          <Typography variant="body1" fontWeight="600" color="error.main">
                            {policyDetails?.policyExpiryDate || 'Not Set'}
                          </Typography>
                        </Box>
                      </Grid>
                      {lead.subProduct === 'Vehicle Insurance' && (
                        <>
                          <Grid item xs={12} sm={4}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Vehicle Reg. Number</Typography>
                              <Typography variant="body1">{lead.vehicleRegistrationNumber || 'N/A'}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Vehicle Type</Typography>
                              <Typography variant="body1">{lead.vehicleType || 'N/A'}</Typography>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <Card className="healthcare-card">
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NoteIcon color="primary" />
                      Lead Notes
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {lead.notes || 'No notes available'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Policy & Nominee Tab */}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              {/* Policy Details */}
              <Grid item xs={12} md={6}>
                <Card className="healthcare-card">
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DocumentIcon color="primary" />
                      Policy Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {/* Header Information */}
                      <Grid item xs={12}>
                        <Box mb={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Policy Number</Typography>
                            <Typography variant="body1" fontWeight="600">{policyDetails?.policyNumber}</Typography>
                          </Box>
                        </Box>
                        <Box mb={2} display="flex" gap={2} alignItems="center">
                          <Box>
                            <Typography variant="caption" color="text.secondary">Policy Type</Typography>
                            <Typography variant="body1">{policyDetails?.policyType}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Policy Status</Typography>
                            <Box>
                              <Chip
                                label={policyDetails?.policyStatus}
                                size="small"
                                color={policyDetails?.policyStatus === 'Active' ? 'success' : 'warning'}
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      {/* Premium Details */}
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">IDV</Typography>
                          <Typography variant="body1" fontWeight="600" color="primary">
                            ₹{policyDetails?.idv?.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.success.main, 0.03), borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">Final Premium</Typography>
                          <Typography variant="body1" color="success.main" fontWeight="600">
                            ₹{policyDetails?.finalPremium?.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">OD Premium</Typography>
                          <Typography variant="body1">₹{policyDetails?.odPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">Liability Premium</Typography>
                          <Typography variant="body1">₹{policyDetails?.liabilityPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">Total Add-on Premium</Typography>
                          <Typography variant="body1">₹{policyDetails?.addOnPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">Net Premium</Typography>
                          <Typography variant="body1">₹{policyDetails?.netPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">GST</Typography>
                          <Typography variant="body1">₹{policyDetails?.gst?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">Reference ID</Typography>
                          <Typography variant="body1">{policyDetails?.referenceId || 'N/A'}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      {/* Policy Period Details */}
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="caption" color="text.secondary">Payment Frequency</Typography>
                          <Typography variant="body1">{policyDetails?.paymentFrequency}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Policy Period</Typography>
                        <Typography variant="body1">
                          {policyDetails?.policyStartDate} to {policyDetails?.policyEndDate}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Next Payment Due</Typography>
                        <Typography variant="body1" color="warning.main" fontWeight="600">
                          {policyDetails?.nextPaymentDue}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Nominee Details */}
              <Grid item xs={12} md={6}>
                <Card className="healthcare-card">
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      Nominee Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Nominee Name</Typography>
                        <Typography variant="body1" fontWeight="600">{nomineeDetails?.nomineeName}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Relationship</Typography>
                        <Typography variant="body1">{nomineeDetails?.relationship}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                        <Typography variant="body1">{nomineeDetails?.dateOfBirth}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Contact Number</Typography>
                        <Typography variant="body1">{nomineeDetails?.contactNumber}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{nomineeDetails?.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Address</Typography>
                        <Typography variant="body2">{nomineeDetails?.address}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Nominee Percentage</Typography>
                        <Typography variant="body1" fontWeight="600" color="primary">
                          {nomineeDetails?.nomineePercentage}%
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Policy History Tab */}
          {currentTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Policy History</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Export
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Policy Number</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Period</TableCell>
                      <TableCell>Vehicle Details</TableCell>
                      <TableCell align="right">Premium</TableCell>
                      <TableCell>NCB</TableCell>
                      <TableCell>Claims</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {policyHistoryData.map((policy) => (
                      <TableRow key={policy.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {policy.policyNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{policy.type}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(policy.startDate).toLocaleDateString()} -
                          </Typography>
                          <Typography variant="body2">
                            {new Date(policy.endDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{policy.vehicleDetails}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="600">
                            ₹{policy.premium?.toLocaleString() || '0'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{policy.ncb}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{policy.claims}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={policy.status}
                            size="small"
                            color={policy.status === 'Active' ? 'success' : 'default'}
                            sx={{
                              borderRadius: 1,
                              backgroundColor: policy.status === 'Active'
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.grey[500], 0.1),
                              color: policy.status === 'Active'
                                ? theme.palette.success.main
                                : theme.palette.grey[600]
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewPolicyDetails(policy)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Policy">
                            <IconButton size="small" onClick={() => handleDownloadPolicy(policy)}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Activities Tab */}
          {currentTab === 3 && (
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>Activities</Typography>

              {/* Activities Sub-tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activitiesSubTab} onChange={(e, newValue) => setActivitiesSubTab(newValue)}>
                  <Tab label="Notes" />
                  <Tab label="Tasks" />
                  <Tab label="Call Logs" />
                  <Tab label="Claims" />
                  <Tab label="Timeline" />
                </Tabs>
              </Box>

              {/* Notes Sub-tab */}
              {activitiesSubTab === 0 && (
                <Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Content</TableCell>
                          <TableCell>Created At</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {notes.map((note) => (
                          <TableRow key={note.id} hover>
                            <TableCell>{note.date}</TableCell>
                            <TableCell>{note.user}</TableCell>
                            <TableCell>{note.content}</TableCell>
                            <TableCell>{note.createdAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Tasks Sub-tab */}
              {activitiesSubTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddTaskDialog(true)}
                    >
                      Add Task
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Task</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Priority</TableCell>
                          <TableCell>Assigned To</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((task) => (
                          <TableRow key={task.id} hover>
                            <TableCell>{task.task}</TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell>
                              <Chip
                                label={task.priority}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                  color: getPriorityColor(task.priority)
                                }}
                              />
                            </TableCell>
                            <TableCell>{task.assignedTo}</TableCell>
                            <TableCell>
                              <Chip
                                label={task.status}
                                size="small"
                                color={task.status === 'Completed' ? 'success' : 'warning'}
                              />
                            </TableCell>
                            <TableCell>{task.createdAt}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Call Logs Sub-tab */}
              {activitiesSubTab === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="600">📞 Call Log Management</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddCallLogDialog(true)}
                    >
                      Add Call Log
                    </Button>
                  </Box>

                  {/* Filters */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            placeholder="Search calls..."
                            InputProps={{
                              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>Call Type</InputLabel>
                            <Select defaultValue="All" label="Call Type">
                              <MenuItem value="All">All Types</MenuItem>
                              <MenuItem value="Inbound">Inbound</MenuItem>
                              <MenuItem value="Outbound">Outbound</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select defaultValue="All" label="Status">
                              <MenuItem value="All">All Status</MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                              <MenuItem value="Missed">Missed</MenuItem>
                              <MenuItem value="No Answer">No Answer</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>Agent</InputLabel>
                            <Select defaultValue="All" label="Agent">
                              <MenuItem value="All">All Agents</MenuItem>
                              <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                              <MenuItem value="Mike Wilson">Mike Wilson</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Date Range"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <Button variant="outlined" fullWidth startIcon={<FilterIcon />}>
                            Reset
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Call ID</TableCell>
                          <TableCell>Customer Name</TableCell>
                          <TableCell>Agent Name</TableCell>
                          <TableCell>Call Type</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>Disposition</TableCell>
                          <TableCell>Date & Time</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {callLogs.map((log) => (
                          <TableRow key={log.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="600" color="primary">
                                CALL-{new Date().getFullYear()}-{String(log.id).padStart(4, '0')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="600">
                                {lead.firstName} {lead.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {lead.phone}
                              </Typography>
                            </TableCell>
                            <TableCell>{log.agentName}</TableCell>
                            <TableCell>
                              <Chip
                                label={log.type}
                                size="small"
                                variant="outlined"
                                color={log.type === 'Inbound' ? 'success' : 'primary'}
                                icon={log.type === 'Inbound' ? <CallIcon /> : <CallIcon />}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="600">
                                {log.duration}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Chip
                                  label={log.disposition}
                                  size="small"
                                  color={
                                    log.disposition === 'Interested' ? 'success' :
                                      log.disposition === 'Not Interested' ? 'error' :
                                        log.disposition === 'Call Back' ? 'warning' :
                                          log.disposition === 'Not Reachable' ? 'default' :
                                            log.disposition === 'Converted' ? 'primary' :
                                              'default'
                                  }
                                  sx={{ mb: 0.5 }}
                                />
                                {log.subDisposition && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    {log.subDisposition}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{log.date}</Typography>
                              <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Details">
                                <IconButton size="small" onClick={() => handleViewCallDetails(log)}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Claims Sub-tab */}
              {activitiesSubTab === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddClaimDialog(true)}
                    >
                      Add Claim
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Claim Number</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {claims.map((claim) => (
                          <TableRow key={claim.id} hover>
                            <TableCell>{claim.claimNumber}</TableCell>
                            <TableCell>{claim.date}</TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="600" color="primary">
                                ${claim.amount?.toLocaleString() || '0'}
                              </Typography>
                            </TableCell>
                            <TableCell>{claim.description}</TableCell>
                            <TableCell>
                              <Chip
                                label={claim.status}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(getStatusColor(claim.status), 0.1),
                                  color: getStatusColor(claim.status)
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDeleteClaim(claim.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Timeline Sub-tab */}
              {activitiesSubTab === 4 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">Activity Timeline</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Showing all activities
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    {activities.map((activity) => (
                      <Paper key={activity.id} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar sx={{
                            bgcolor: (() => {
                              switch (activity.type) {
                                case 'status_change': return alpha(theme.palette.info.main, 0.1);
                                case 'note_added': return alpha(theme.palette.warning.main, 0.1);
                                case 'call_made': return alpha(theme.palette.success.main, 0.1);
                                case 'task_created': return alpha(theme.palette.primary.main, 0.1);
                                case 'document_uploaded': return alpha(theme.palette.secondary.main, 0.1);
                                default: return alpha(theme.palette.grey[500], 0.1);
                              }
                            })(),
                            color: (() => {
                              switch (activity.type) {
                                case 'status_change': return theme.palette.info.main;
                                case 'note_added': return theme.palette.warning.main;
                                case 'call_made': return theme.palette.success.main;
                                case 'task_created': return theme.palette.primary.main;
                                case 'document_uploaded': return theme.palette.secondary.main;
                                default: return theme.palette.grey[500];
                              }
                            })()
                          }}>
                            {(() => {
                              switch (activity.type) {
                                case 'status_change': return <HistoryIcon />;
                                case 'note_added': return <CreateIcon />;
                                case 'call_made': return <CallIcon />;
                                case 'task_created': return <TaskIcon />;
                                case 'document_uploaded': return <UploadIcon />;
                                default: return <HistoryIcon />;
                              }
                            })()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="600">
                              {activity.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {activity.timestamp}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <UserIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {activity.user}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          )}

          {/* Contact Numbers Tab - NEW */}
          {currentTab === 4 && (
            <Box>
              <MultiContactNumberManager
                leadId={leadId}
                initialContacts={lead?.contacts || []}
                onUpdate={(contacts) => {
                  console.log('Contacts updated:', contacts);
                  setLead({ ...lead, contacts });
                }}
              />
            </Box>
          )}

          {/* Documents Tab - NEW */}
          {currentTab === 5 && (
            <Box>
              <DocumentCollectionTracker
                leadId={leadId}
                initialDocuments={lead?.documents || []}
                onUpdate={(documents) => {
                  console.log('Documents updated:', documents);
                  setLead({ ...lead, documents });
                }}
              />
            </Box>
          )}

          {/* Vehicle Documents Tab */}
          {currentTab === 6 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => {
                    setDocumentType('vehicle');
                    setUploadDocumentDialog(true);
                  }}
                >
                  Upload Document
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Type</TableCell>
                      <TableCell>Upload Date</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicleDocuments.map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VehicleIcon color="primary" />
                            {doc.documentName}
                          </Box>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <Chip
                            label={doc.status}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getStatusColor(doc.status), 0.1),
                              color: getStatusColor(doc.status)
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => handleViewDocument(doc, 'Vehicle Document')}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small" onClick={() => handleDownloadDocument(doc, 'Vehicle Document')}>
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDeleteVehicleDoc(doc.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Insurance Documents Tab */}
          {currentTab === 7 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => {
                    setDocumentType('insurance');
                    setUploadDocumentDialog(true);
                  }}
                >
                  Upload Document
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Name</TableCell>
                      <TableCell>Upload Date</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insuranceDocuments.map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsuranceDocIcon color="primary" />
                            {doc.documentName}
                          </Box>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <Chip
                            label={doc.status}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getStatusColor(doc.status), 0.1),
                              color: getStatusColor(doc.status)
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => handleViewDocument(doc, 'Insurance Document')}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small" onClick={() => handleDownloadDocument(doc, 'Insurance Document')}>
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDeleteInsuranceDoc(doc.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          {/* KYC Documents Tab */}
          {currentTab === 8 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">KYC Documents Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setFileUploadDialog(true)}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  }}
                >
                  Upload Files
                </Button>
              </Box>

              {/* Search & Filter Section */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        placeholder="Search files..."
                        value={fileSearchTerm}
                        onChange={(e) => setFileSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={fileStatusFilter}
                          label="Status"
                          onChange={(e) => setFileStatusFilter(e.target.value)}
                        >
                          <MenuItem value="All">All Status</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Verified">Verified</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Document Type</InputLabel>
                        <Select
                          value={fileTypeFilter}
                          label="Document Type"
                          onChange={(e) => setFileTypeFilter(e.target.value)}
                        >
                          <MenuItem value="All">All Types</MenuItem>
                          {fileDocumentTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => {
                          setFileSearchTerm('');
                          setFileStatusFilter('All');
                          setFileTypeFilter('All');
                        }}
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Uploaded Files Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Type</TableCell>
                      <TableCell>File Name</TableCell>
                      <TableCell>Uploaded On</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getFileIcon(file.fileType)}
                            <Typography variant="body2">{file.documentType}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {file.fileName}
                          </Typography>
                        </TableCell>
                        <TableCell>{file.uploadedOn}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={file.status}
                              onChange={(e) => handleStatusUpdate(file.id, e.target.value)}
                              sx={{
                                backgroundColor: (() => {
                                  switch (file.status) {
                                    case 'Verified': return alpha(theme.palette.success.main, 0.1);
                                    case 'Rejected': return alpha(theme.palette.error.main, 0.1);
                                    case 'Pending': return alpha(theme.palette.warning.main, 0.1);
                                    default: return 'transparent';
                                  }
                                })(),
                                color: (() => {
                                  switch (file.status) {
                                    case 'Verified': return theme.palette.success.main;
                                    case 'Rejected': return theme.palette.error.main;
                                    case 'Pending': return theme.palette.warning.main;
                                    default: return 'inherit';
                                  }
                                })()
                              }}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Verified">Verified</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => handleViewDocument(file, 'KYC Document')}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small" onClick={() => handleDownloadDocument(file, 'KYC Document')}>
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredFiles.length === 0 && (
                <Paper sx={{ p: 3, textAlign: 'center', mt: 2 }}>
                  <FileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Files Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {uploadedFiles.length === 0
                      ? 'No files have been uploaded yet. Click "Upload Files" to get started.'
                      : 'No files match your current search criteria.'}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Customer Feedback Tab Content */}
          {currentTab === 9 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">Customer Feedback</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setFeedbackDialog(true)}
                >
                  Add Feedback
                </Button>
              </Box>

              {customerFeedback.rating ? (
                <Card>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Overall Rating
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                sx={{
                                  color: star <= customerFeedback.rating ? 'warning.main' : 'grey.300'
                                }}
                              />
                            ))}
                            <Typography variant="h6" sx={{ ml: 1 }}>
                              {customerFeedback.rating}/5
                            </Typography>
                          </Stack>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Recommendation Score (NPS)
                          </Typography>
                          <Typography variant="h6">
                            {customerFeedback.recommendationScore}/10
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Feedback Date
                          </Typography>
                          <Typography variant="body1">
                            {customerFeedback.feedbackDate}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            General Feedback
                          </Typography>
                          <Typography variant="body1">
                            {customerFeedback.feedback}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Areas of Satisfaction
                          </Typography>
                          <Stack spacing={1}>
                            {customerFeedback.satisfactionAreas.map((area, index) => (
                              <Chip
                                key={index}
                                label={area}
                                icon={<ThumbUpIcon />}
                                color="success"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Areas for Improvement
                          </Typography>
                          <Stack spacing={1}>
                            {customerFeedback.improvementAreas.map((area, index) => (
                              <Chip
                                key={index}
                                label={area}
                                color="warning"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>
                      </Grid>

                      {customerFeedback.additionalComments && (
                        <Grid item xs={12}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Additional Comments
                            </Typography>
                            <Typography variant="body1">
                              {customerFeedback.additionalComments}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <FeedbackIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Feedback Recorded
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Click the button above to add customer feedback
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={addTaskDialog} onClose={() => setAddTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Description"
                value={taskForm.task}
                onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={taskForm.priority}
                  label="Priority"
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={taskForm.assignedTo}
                  label="Assign To"
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained">Add Task</Button>
        </DialogActions>
      </Dialog>

      {/* Add Call Log Dialog */}
      <Dialog open={addCallLogDialog} onClose={() => setAddCallLogDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="primary" />
            <Typography variant="h6" fontWeight="600">Add Call Log</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Call Type</InputLabel>
                <Select
                  value={callLogForm.type}
                  label="Call Type"
                  onChange={(e) => setCallLogForm({ ...callLogForm, type: e.target.value })}
                >
                  <MenuItem value="Inbound">📞 Inbound</MenuItem>
                  <MenuItem value="Outbound">📱 Outbound</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                placeholder="e.g., 15 min"
                value={callLogForm.duration}
                onChange={(e) => setCallLogForm({ ...callLogForm, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Call Status</InputLabel>
                <Select
                  value={callLogForm.status}
                  label="Call Status"
                  onChange={(e) => setCallLogForm({ ...callLogForm, status: e.target.value })}
                >
                  <MenuItem value="Completed">✅ Completed</MenuItem>
                  <MenuItem value="Missed">❌ Missed</MenuItem>
                  <MenuItem value="No Answer">⏰ No Answer</MenuItem>
                  <MenuItem value="Busy">📵 Busy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Disposition</InputLabel>
                <Select
                  value={callLogForm.disposition || ''}
                  label="Disposition"
                  onChange={(e) => setCallLogForm({ ...callLogForm, disposition: e.target.value })}
                >
                  <MenuItem value="Interested">✅ Interested</MenuItem>
                  <MenuItem value="Not Interested">❌ Not Interested</MenuItem>
                  <MenuItem value="Call Back">📞 Call Back</MenuItem>
                  <MenuItem value="Not Reachable">📵 Not Reachable</MenuItem>
                  <MenuItem value="Converted">🎉 Converted</MenuItem>
                  <MenuItem value="DNC">🚫 DNC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sub-Disposition"
                placeholder="e.g., Needs Quote, Specific Time"
                value={callLogForm.subDisposition || ''}
                onChange={(e) => setCallLogForm({ ...callLogForm, subDisposition: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Call Notes & Summary"
                multiline
                rows={4}
                value={callLogForm.notes}
                onChange={(e) => setCallLogForm({ ...callLogForm, notes: e.target.value })}
                placeholder="Enter detailed notes about the call conversation, customer queries, and outcomes..."
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCallLogDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCallLog} variant="contained">Add Call Log</Button>
        </DialogActions>
      </Dialog>

      {/* Call Details Modal */}
      <Dialog open={callDetailsDialog} onClose={() => setCallDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="primary" />
            <Typography variant="h6" fontWeight="600">Call Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCallLog && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Call Information */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      📋 Call Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Call ID</Typography>
                        <Typography variant="body1" fontWeight="600">
                          CALL-{new Date().getFullYear()}-{String(selectedCallLog.id).padStart(4, '0')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                        <Typography variant="body1">{selectedCallLog.date} at {selectedCallLog.time}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Duration</Typography>
                        <Typography variant="body1" fontWeight="600">{selectedCallLog.duration}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Call Type</Typography>
                        <Chip
                          label={selectedCallLog.type}
                          size="small"
                          color={selectedCallLog.type === 'Inbound' ? 'success' : 'primary'}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Status</Typography>
                        <Chip
                          label={selectedCallLog.status}
                          size="small"
                          color={selectedCallLog.status === 'Completed' ? 'success' : 'error'}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Participants */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      👥 Participants
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Customer</Typography>
                        <Typography variant="body1" fontWeight="600">
                          {lead.firstName} {lead.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{lead.phone}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Agent</Typography>
                        <Typography variant="body1" fontWeight="600">{selectedCallLog.agentName}</Typography>
                      </Box>
                      {selectedCallLog.callRating && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Call Rating</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                sx={{
                                  color: star <= selectedCallLog.callRating ? 'warning.main' : 'grey.300',
                                  fontSize: 20
                                }}
                              />
                            ))}
                            <Typography variant="body2">({selectedCallLog.callRating}/5)</Typography>
                          </Box>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Call Summary */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      📝 Call Summary
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCallLog.callSummary}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      Detailed Notes:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCallLog.notes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>


            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDetailsDialog(false)}>Close</Button>
          {selectedCallLog?.followUpRequired && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFollowUpDialog(true)}
            >
              Schedule Follow-up
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add Claim Dialog */}
      <Dialog open={addClaimDialog} onClose={() => setAddClaimDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Claim</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Auto-populated Customer Information */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer Name"
                value={lead?.firstName + ' ' + lead?.lastName}
                InputProps={{ readOnly: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={lead?.phone}
                InputProps={{ readOnly: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email ID"
                value={lead?.email}
                InputProps={{ readOnly: true }}
                disabled
              />
            </Grid>

            {/* Insurance Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Insurance Company Name"
                value={claimForm.insuranceCompany}
                onChange={(e) => setClaimForm({ ...claimForm, insuranceCompany: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Policy Number"
                value={claimForm.policyNumber}
                onChange={(e) => setClaimForm({ ...claimForm, policyNumber: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Expiry Date"
                type="date"
                value={claimForm.expiryDate}
                onChange={(e) => setClaimForm({ ...claimForm, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Claim Number"
                value={claimForm.claimNumber}
                onChange={(e) => setClaimForm({ ...claimForm, claimNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Claim Status</InputLabel>
                <Select
                  value={claimForm.claimStatus}
                  label="Claim Status"
                  onChange={(e) => setClaimForm({ ...claimForm, claimStatus: e.target.value })}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Document Pending">Document Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Settled">Settled</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                value={claimForm.remarks}
                onChange={(e) => setClaimForm({ ...claimForm, remarks: e.target.value })}
                placeholder="Enter any additional notes or remarks about the claim"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddClaimDialog(false)}>Cancel</Button>
          <Button onClick={handleAddClaim} variant="contained">Add Claim</Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={fileUploadDialog} onClose={() => setFileUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UploadIcon color="primary" />
            <Typography variant="h6" fontWeight="600">Upload Documents</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={fileUploadForm.documentType}
                  label="Document Type"
                  onChange={(e) => setFileUploadForm({ ...fileUploadForm, documentType: e.target.value })}
                >
                  {fileDocumentTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
                sx={{
                  height: 60,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  '&:hover': {
                    borderStyle: 'dashed',
                    borderWidth: 2
                  }
                }}
              >
                Choose Files (Multiple Selection Allowed)
                <input
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => setFileUploadForm({ ...fileUploadForm, files: Array.from(e.target.files) })}
                />
              </Button>
              {fileUploadForm.files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Files ({fileUploadForm.files.length}):
                  </Typography>
                  {fileUploadForm.files.map((file, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getFileIcon(file.type.includes('pdf') ? 'pdf' : 'image')}
                      <Typography variant="body2">
                        {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Initial Status</InputLabel>
                <Select
                  value={fileUploadForm.status}
                  label="Initial Status"
                  onChange={(e) => setFileUploadForm({ ...fileUploadForm, status: e.target.value })}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Verified">Verified</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleFileUpload}
            variant="contained"
            disabled={fileUploadForm.files.length === 0}
          >
            Upload Files
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDocumentDialog} onClose={() => setUploadDocumentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload {documentType === 'vehicle' ? 'Vehicle' : 'Insurance'} Document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              {documentType === 'vehicle' ? (
                <FormControl fullWidth>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={documentForm.documentName}
                    label="Document Type"
                    onChange={(e) => setDocumentForm({ ...documentForm, documentName: e.target.value })}
                  >
                    {vehicleDocumentTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Document Name"
                  value={documentForm.documentName}
                  onChange={(e) => setDocumentForm({ ...documentForm, documentName: e.target.value })}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={(e) => setDocumentForm({ ...documentForm, file: e.target.files[0] })}
                />
              </Button>
              {documentForm.file && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Selected: {documentForm.file.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDocumentDialog(false)}>Cancel</Button>
          <Button onClick={handleUploadDocument} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={callDialog} onClose={() => setCallDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="success" />
            <Typography variant="h6" fontWeight="600">Contact Customer</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Lead ID */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">Lead ID</Typography>
              <Typography variant="body1" fontWeight="600" color="primary">
                {generateLeadId(lead.id)}
              </Typography>
            </Box>

            {/* Customer Name */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">Customer Name</Typography>
              <Typography variant="body1" fontWeight="600">
                {lead.firstName} {lead.lastName}
              </Typography>
            </Box>

            {/* Policy Type */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">Policy Type</Typography>
              <Typography variant="body1">
                {policyDetails?.policyType || 'Not Assigned'}
              </Typography>
            </Box>

            <Divider />

            {/* Main Phone Number */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                Main Phone Number
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="h6" fontWeight="600">
                  {lead.phone}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  component="a"
                  href={`tel:${lead.phone}`}
                  startIcon={<CallIcon />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  }}
                >
                  Dial
                </Button>
              </Box>
            </Box>

            {/* Alternate Phone Number */}
            {lead.alternatePhone && (
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                  Alternate Phone Number
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="h6" fontWeight="600">
                    {lead.alternatePhone}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    component="a"
                    href={`tel:${lead.alternatePhone}`}
                    startIcon={<CallIcon />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    }}
                  >
                    Dial
                  </Button>
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Customer Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Customer Feedback</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rating (1-5)"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 5 } }}
                value={customerFeedback.rating}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, rating: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recommendation Score (0-10)"
                type="number"
                InputProps={{ inputProps: { min: 0, max: 10 } }}
                value={customerFeedback.recommendationScore}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, recommendationScore: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="General Feedback"
                multiline
                rows={4}
                value={customerFeedback.feedback}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, feedback: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Areas of Satisfaction"
                multiline
                rows={3}
                value={customerFeedback.satisfactionAreas.join('\n')}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, satisfactionAreas: e.target.value.split('\n').filter(x => x) })}
                placeholder="Enter each area on a new line"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Areas for Improvement"
                multiline
                rows={3}
                value={customerFeedback.improvementAreas.join('\n')}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, improvementAreas: e.target.value.split('\n').filter(x => x) })}
                placeholder="Enter each area on a new line"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Comments"
                multiline
                rows={2}
                value={customerFeedback.additionalComments}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, additionalComments: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFeedback} variant="contained">Save Feedback</Button>
        </DialogActions>
      </Dialog>

      {/* Convert to Customer Dialog */}
      <Dialog open={convertDialog} onClose={() => setConvertDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="warning" />
            <Typography variant="h6" fontWeight="600">Convert Lead to Customer</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              This will convert the lead to a customer and add an entry to the Customer Database. Please provide policy details below.
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Type"
                value={convertForm.productType}
                onChange={(e) => setConvertForm({ ...convertForm, productType: e.target.value })}
                placeholder={lead?.subProduct || 'e.g., Vehicle Insurance'}
                helperText="Leave blank to use lead's product type"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Number"
                value={convertForm.policyNumber}
                onChange={(e) => setConvertForm({ ...convertForm, policyNumber: e.target.value })}
                placeholder="Auto-generated if left blank"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Premium Amount (₹)"
                type="number"
                value={convertForm.premiumAmount}
                onChange={(e) => setConvertForm({ ...convertForm, premiumAmount: e.target.value })}
                placeholder="e.g., 45000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Age"
                type="number"
                value={convertForm.age}
                onChange={(e) => setConvertForm({ ...convertForm, age: e.target.value })}
                placeholder="e.g., 35"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={convertForm.gender}
                  label="Gender"
                  onChange={(e) => setConvertForm({ ...convertForm, gender: e.target.value })}
                >
                  <MenuItem value="">Not Specified</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Start Date"
                type="date"
                value={convertForm.policyStartDate}
                onChange={(e) => setConvertForm({ ...convertForm, policyStartDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText="Defaults to today if left blank"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy End Date"
                type="date"
                value={convertForm.policyEndDate}
                onChange={(e) => setConvertForm({ ...convertForm, policyEndDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConvertLead}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            }}
          >
            Convert to Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={followUpDialog} onClose={() => setFollowUpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="h6" fontWeight="600">Schedule Follow-up</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Follow-up Date"
                type="date"
                value={followUpForm.date}
                onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Follow-up Time"
                type="time"
                value={followUpForm.time}
                onChange={(e) => setFollowUpForm({ ...followUpForm, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Follow-up Type</InputLabel>
                <Select
                  value={followUpForm.type}
                  label="Follow-up Type"
                  onChange={(e) => setFollowUpForm({ ...followUpForm, type: e.target.value })}
                >
                  <MenuItem value="Call">📞 Call</MenuItem>
                  <MenuItem value="Email">📧 Email</MenuItem>
                  <MenuItem value="Meeting">🤝 Meeting</MenuItem>
                  <MenuItem value="WhatsApp">💬 WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={followUpForm.priority}
                  label="Priority"
                  onChange={(e) => setFollowUpForm({ ...followUpForm, priority: e.target.value })}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={followUpForm.assignedTo}
                  label="Assign To"
                  onChange={(e) => setFollowUpForm({ ...followUpForm, assignedTo: e.target.value })}
                >
                  <MenuItem value="">{lead?.assignedTo || 'Current Agent'}</MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Follow-up Notes"
                multiline
                rows={3}
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                placeholder="Enter specific notes for the follow-up task..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFollowUpDialog(false)}>Cancel</Button>
          <Button
            onClick={handleScheduleFollowUp}
            variant="contained"
            disabled={!followUpForm.date}
            startIcon={<AccessTimeIcon />}
          >
            Schedule Follow-up
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Link Dialog */}
      <Dialog open={paymentLinkDialog} onClose={() => setPaymentLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Payment Link</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={paymentLinkData.amount}
                onChange={(e) => setPaymentLinkData({ ...paymentLinkData, amount: e.target.value })}
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose"
                value={paymentLinkData.purpose}
                onChange={(e) => setPaymentLinkData({ ...paymentLinkData, purpose: e.target.value })}
                placeholder="e.g., Policy Premium, Down Payment"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Link Expires In</InputLabel>
                <Select
                  value={paymentLinkData.expiryDays}
                  label="Link Expires In"
                  onChange={(e) => setPaymentLinkData({ ...paymentLinkData, expiryDays: e.target.value })}
                >
                  <MenuItem value={1}>1 Day</MenuItem>
                  <MenuItem value={3}>3 Days</MenuItem>
                  <MenuItem value={7}>7 Days</MenuItem>
                  <MenuItem value={15}>15 Days</MenuItem>
                  <MenuItem value={30}>30 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Send Via:</Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={paymentLinkData.sendVia.email}
                      onChange={(e) => setPaymentLinkData({
                        ...paymentLinkData,
                        sendVia: { ...paymentLinkData.sendVia, email: e.target.checked }
                      })}
                    />
                  }
                  label={`Email (${lead?.email || 'N/A'})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={paymentLinkData.sendVia.sms}
                      onChange={(e) => setPaymentLinkData({
                        ...paymentLinkData,
                        sendVia: { ...paymentLinkData.sendVia, sms: e.target.checked }
                      })}
                    />
                  }
                  label={`SMS (${lead?.phone || 'N/A'})`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={paymentLinkData.sendVia.whatsapp}
                      onChange={(e) => setPaymentLinkData({
                        ...paymentLinkData,
                        sendVia: { ...paymentLinkData.sendVia, whatsapp: e.target.checked }
                      })}
                    />
                  }
                  label={`WhatsApp (${lead?.phone || 'N/A'})`}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                The payment link will be sent to the customer's {
                  [
                    paymentLinkData.sendVia.email && 'email',
                    paymentLinkData.sendVia.sms && 'phone (SMS)',
                    paymentLinkData.sendVia.whatsapp && 'WhatsApp'
                  ].filter(Boolean).join(', ') || 'selected channels'
                }.
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentLinkDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Implement payment link generation
              alert(`Payment link of ₹${paymentLinkData.amount} for "${paymentLinkData.purpose}" will be sent to ${lead?.firstName} ${lead?.lastName}`);
              setPaymentLinkDialog(false);
              // Reset form
              setPaymentLinkData({
                amount: '',
                purpose: '',
                expiryDays: 7,
                sendVia: { email: true, sms: false, whatsapp: false }
              });
            }}
            disabled={!paymentLinkData.amount || !paymentLinkData.purpose}
            startIcon={<SendIcon />}
          >
            Generate & Send Link
          </Button>
        </DialogActions>
      </Dialog>
      {/* Policy View Details Dialog */}
      <Dialog
        open={policyViewDialog}
        onClose={() => setPolicyViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <InsuranceDocIcon color="primary" />
          Policy Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedPolicy && (
            <Grid container spacing={3}>
              {/* Policy Information */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="primary">
                    Policy Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Policy Number</Typography>
                      <Typography variant="body1" fontWeight="500">{selectedPolicy.policyNumber}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Policy Type</Typography>
                      <Typography variant="body1">{selectedPolicy.type}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Chip
                        label={selectedPolicy.status}
                        size="small"
                        color={selectedPolicy.status === 'Active' ? 'success' : 'default'}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Policy ID</Typography>
                      <Typography variant="body1">{selectedPolicy.id}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Policy Period */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    📅 Policy Period
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Start Date:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(selectedPolicy.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">End Date:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(selectedPolicy.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Duration:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {Math.ceil((new Date(selectedPolicy.endDate) - new Date(selectedPolicy.startDate)) / (1000 * 60 * 60 * 24))} days
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Vehicle Details */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    🚗 Vehicle Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Vehicle:</Typography>
                      <Typography variant="body2" fontWeight="500">{selectedPolicy.vehicleDetails}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Registration:</Typography>
                      <Typography variant="body2" fontWeight="500">{lead?.vehicleRegistrationNumber || 'N/A'}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Premium Details */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="success.main">
                    💰 Premium Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Premium Amount:</Typography>
                      <Typography variant="body1" fontWeight="600" color="success.main">
                        ₹{selectedPolicy.premium?.toLocaleString() || '0'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">No Claim Bonus (NCB):</Typography>
                      <Typography variant="body2" fontWeight="500">{selectedPolicy.ncb}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Claims History */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="warning.main">
                    📋 Claims History
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Total Claims:</Typography>
                      <Typography variant="body1" fontWeight="600">
                        {selectedPolicy.claims}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Claims Status:</Typography>
                      <Chip
                        label={selectedPolicy.claims === 0 ? 'No Claims' : `${selectedPolicy.claims} Claim(s)`}
                        size="small"
                        color={selectedPolicy.claims === 0 ? 'success' : 'warning'}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Insured Details */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    👤 Insured Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Name</Typography>
                      <Typography variant="body2" fontWeight="500">{lead?.firstName} {lead?.lastName}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body2">{lead?.email}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography variant="body2">{lead?.phone}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Company</Typography>
                      <Typography variant="body2">{lead?.company || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPolicyViewDialog(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (selectedPolicy) {
                handleDownloadPolicy(selectedPolicy);
              }
            }}
          >
            Download Policy

          </Button>
        </DialogActions>
      </Dialog>


      {/* Call Number Selection Dialog */}
      <Dialog open={callNumberDialog} onClose={() => setCallNumberDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Select Number to Call</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose which number you would like to dial:
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CallIcon />}
              onClick={() => {
                setSelectedNumber(lead.phone);
                window.open(`tel:${lead.phone}`, '_self');
                setCallNumberDialog(false);
                setPostCallDialog(true);
              }}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ml: 1 }}>
                <Typography variant="body2" fontWeight={600}>Main Number</Typography>
                <Typography variant="body2" color="text.secondary">{lead.phone}</Typography>
              </Box>
            </Button>
            {lead.alternatePhone && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CallIcon />}
                onClick={() => {
                  setSelectedNumber(lead.alternatePhone);
                  window.open(`tel:${lead.alternatePhone}`, '_self');
                  setCallNumberDialog(false);
                  setPostCallDialog(true);
                }}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderColor: theme.palette.info.main,
                  '&:hover': {
                    borderColor: theme.palette.info.dark,
                    backgroundColor: alpha(theme.palette.info.main, 0.05)
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ml: 1 }}>
                  <Typography variant="body2" fontWeight={600}>Alternate Number</Typography>
                  <Typography variant="body2" color="text.secondary">{lead.alternatePhone}</Typography>
                </Box>
              </Button>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallNumberDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Post-Call Dialog */}
      <Dialog open={postCallDialog} onClose={() => setPostCallDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Call Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Called: {selectedNumber}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={callLogData.status}
                  label="Status"
                  onChange={(e) => setCallLogData({ ...callLogData, status: e.target.value })}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Contacted">Contacted</MenuItem>
                  <MenuItem value="Qualified">Qualified</MenuItem>
                  <MenuItem value="Proposal">Proposal</MenuItem>
                  <MenuItem value="Negotiation">Negotiation</MenuItem>
                  <MenuItem value="Closed Won">Closed Won</MenuItem>
                  <MenuItem value="Closed Lost">Closed Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sub-Status</InputLabel>
                <Select
                  value={callLogData.subStatus}
                  label="Sub-Status"
                  onChange={(e) => setCallLogData({ ...callLogData, subStatus: e.target.value })}
                >
                  <MenuItem value="Attempting Contact">Attempting Contact</MenuItem>
                  <MenuItem value="Contact Made">Contact Made</MenuItem>
                  <MenuItem value="Needs Analysis">Needs Analysis</MenuItem>
                  <MenuItem value="Quote Sent">Quote Sent</MenuItem>
                  <MenuItem value="Follow-up Required">Follow-up Required</MenuItem>
                  <MenuItem value="Decision Pending">Decision Pending</MenuItem>
                  <MenuItem value="Not Interested">Not Interested</MenuItem>
                  <MenuItem value="No Response">No Response</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Follow-up Date"
                type="date"
                value={callLogData.followUpDate}
                onChange={(e) => setCallLogData({ ...callLogData, followUpDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Follow-up Time"
                type="time"
                value={callLogData.followUpTime}
                onChange={(e) => setCallLogData({ ...callLogData, followUpTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Call Notes"
                multiline
                rows={3}
                value={callLogData.notes}
                onChange={(e) => setCallLogData({ ...callLogData, notes: e.target.value })}
                placeholder="Add any notes from the call..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setPostCallDialog(false);
            setCallLogData({
              status: '',
              subStatus: '',
              followUpDate: '',
              followUpTime: '',
              notes: ''
            });
          }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Save call log and update lead status
              const callLog = {
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                number: selectedNumber,
                status: callLogData.status,
                subStatus: callLogData.subStatus,
                followUpDate: callLogData.followUpDate,
                followUpTime: callLogData.followUpTime,
                notes: callLogData.notes
              };
              console.log('Call log saved:', callLog);
              alert(`Call details saved successfully!${callLogData.followUpDate ? `\nFollow-up scheduled for ${callLogData.followUpDate} at ${callLogData.followUpTime}` : ''}`);

              // Update lead status if changed
              if (callLogData.status && callLogData.status !== lead.status) {
                setLead({ ...lead, status: callLogData.status });
              }

              setPostCallDialog(false);
              setCallLogData({
                status: '',
                subStatus: '',
                followUpDate: '',
                followUpTime: '',
                notes: ''
              });
            }}
          >
            Save Call Details
          </Button>
        </DialogActions>
      </Dialog>
      {/* Document View Details Dialog */}
      <Dialog
        open={documentViewDialog}
        onClose={() => setDocumentViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <DocumentIcon color="primary" />
          Document Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedDocument && (
            <Grid container spacing={2}>
              {/* Document Information */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="primary">
                    Document Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Document Name</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedDocument.documentName || selectedDocument.fileName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Document Type</Typography>
                      <Typography variant="body1">
                        {selectedDocument.documentType || selectedDocument.docType}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* File Details */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    📁 File Details
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Upload Date:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {selectedDocument.uploadDate || selectedDocument.uploadedOn || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">File Size:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {selectedDocument.size || 'N/A'}
                      </Typography>
                    </Box>
                    {selectedDocument.fileType && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">File Format:</Typography>
                        <Typography variant="body2" fontWeight="500">
                          {selectedDocument.fileType.toUpperCase()}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              {/* Verification Status */}
              <Grid item xs={12}>
                <Paper sx={{
                  p: 2,
                  bgcolor: selectedDocument.status === 'Verified'
                    ? alpha(theme.palette.success.main, 0.05)
                    : selectedDocument.status === 'Rejected'
                      ? alpha(theme.palette.error.main, 0.05)
                      : alpha(theme.palette.warning.main, 0.05)
                }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    ✓ Verification Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Chip
                      label={selectedDocument.status}
                      size="medium"
                      color={
                        selectedDocument.status === 'Verified' ? 'success' :
                          selectedDocument.status === 'Rejected' ? 'error' : 'warning'
                      }
                    />
                    <Typography variant="body2">
                      {selectedDocument.status === 'Verified' && 'Document has been verified and approved.'}
                      {selectedDocument.status === 'Pending' && 'Document is pending verification.'}
                      {selectedDocument.status === 'Rejected' && 'Document has been rejected.'}
                      {selectedDocument.status === 'Active' && 'Document is currently active.'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Associated Lead */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    👤 Associated Lead
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Name</Typography>
                      <Typography variant="body2" fontWeight="500">{lead?.firstName} {lead?.lastName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography variant="body2">{lead?.phone}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDocumentViewDialog(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (selectedDocument) {
                handleDownloadDocument(selectedDocument, selectedDocument.docType);
                setDocumentViewDialog(false);
              }
            }}
          >
            Download Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Quote Dialog */}
      <Dialog open={shareQuoteDialogOpen} onClose={() => setShareQuoteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon color="warning" />
              <Typography variant="h6">Share Quote</Typography>
            </Box>
            <IconButton onClick={() => setShareQuoteDialogOpen(false)}>
              <CancelIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Create and share a quote for <strong>{lead?.firstName} {lead?.lastName}</strong>.
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Quote Type</InputLabel>
              <Select
                value={quoteForm.quoteType}
                label="Quote Type"
                onChange={(e) => setQuoteForm({ ...quoteForm, quoteType: e.target.value })}
              >
                <MenuItem value="standard">Standard Quote</MenuItem>
                <MenuItem value="premium">Premium Quote</MenuItem>
                <MenuItem value="custom">Custom Quote</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Premium Amount (₹)"
                  type="number"
                  value={quoteForm.premium}
                  onChange={(e) => setQuoteForm({ ...quoteForm, premium: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coverage Amount (₹)"
                  type="number"
                  value={quoteForm.coverage}
                  onChange={(e) => setQuoteForm({ ...quoteForm, coverage: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Valid Till"
              type="date"
              value={quoteForm.validTill}
              onChange={(e) => setQuoteForm({ ...quoteForm, validTill: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Notes"
              value={quoteForm.notes}
              onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
              placeholder="Any special terms or conditions..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareQuoteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<MoneyIcon />}
            onClick={handleShareQuote}
            disabled={!quoteForm.premium || !quoteForm.coverage}
          >
            Share Quote

          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default LeadDetails;