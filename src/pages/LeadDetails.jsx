import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
  const [addNoteDialog, setAddNoteDialog] = useState(false);
  const [viewNoteDialog, setViewNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [noteForm, setNoteForm] = useState({
    date: new Date().toISOString().split('T')[0],
    user: '', // Will default to current user if empty logic is applied, or user can input
    content: '',
    createdAt: new Date().toLocaleString() // Can be auto-set or manual, user asked for input field
  });

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

  // Call Log Filter States
  const [callLogSearchTerm, setCallLogSearchTerm] = useState('');
  const [callLogTypeFilter, setCallLogTypeFilter] = useState('All');
  const [callLogStatusFilter, setCallLogStatusFilter] = useState('All');
  const [callLogAgentFilter, setCallLogAgentFilter] = useState('All');
  const [callLogDateFilter, setCallLogDateFilter] = useState('');

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

  // Handle Note Operations
  const handleViewNote = (note) => {
    setSelectedNote(note);
    setViewNoteDialog(true);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm(t('common.confirmDelete', 'Are you sure you want to delete this note?'))) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const handleAddNote = () => {
    if (!noteForm.content.trim() || !noteForm.user.trim()) {
      alert("Please enter required fields (Content and User)");
      return;
    }
    const newNote = {
      id: notes.length + 1,
      date: noteForm.date,
      user: noteForm.user,
      content: noteForm.content,
      createdAt: noteForm.createdAt || new Date().toLocaleString()
    };
    setNotes([newNote, ...notes]);
    setAddNoteDialog(false);
    setNoteForm({
      date: new Date().toISOString().split('T')[0],
      user: '',
      content: '',
      createdAt: new Date().toLocaleString()
    });
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

  const handleVehicleDocStatusUpdate = (id, newStatus) => {
    setVehicleDocuments(vehicleDocuments.map(doc =>
      doc.id === id ? { ...doc, status: newStatus } : doc
    ));
  };

  const handleInsuranceDocStatusUpdate = (id, newStatus) => {
    setInsuranceDocuments(insuranceDocuments.map(doc =>
      doc.id === id ? { ...doc, status: newStatus } : doc
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

  // Filter call logs
  const filteredCallLogs = callLogs.filter(log => {
    const matchesSearch = (log.notes && log.notes.toLowerCase().includes(callLogSearchTerm.toLowerCase())) ||
      (log.callSummary && log.callSummary.toLowerCase().includes(callLogSearchTerm.toLowerCase())) ||
      (log.agentName && log.agentName.toLowerCase().includes(callLogSearchTerm.toLowerCase()));

    const matchesType = callLogTypeFilter === 'All' || log.type === callLogTypeFilter;
    const matchesStatus = callLogStatusFilter === 'All' || log.status === callLogStatusFilter;
    const matchesAgent = callLogAgentFilter === 'All' || log.agentName === callLogAgentFilter;
    const matchesDate = !callLogDateFilter || log.date === callLogDateFilter;

    return matchesSearch && matchesType && matchesStatus && matchesAgent && matchesDate;
  });

  // Reset Call Log Filters
  const handleResetCallLogFilters = () => {
    setCallLogSearchTerm('');
    setCallLogTypeFilter('All');
    setCallLogStatusFilter('All');
    setCallLogAgentFilter('All');
    setCallLogDateFilter('');
  };

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
          {t('leads.details.backToManagement', 'Back to Leads')}
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
                  {t('leads.details.leadId', 'Lead ID')}: {generateLeadId(lead.id)}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={t(`leads.details.values.leadStatuses.${lead.status?.replace(/ /g, '') || 'New'}`, lead.status)}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(lead.status), 0.1),
                      color: getStatusColor(lead.status),
                      border: `1px solid ${alpha(getStatusColor(lead.status), 0.3)}`,
                      fontWeight: 600
                    }}
                  />
                  <Chip
                    label={t(`leads.details.values.priorities.${lead.priority?.toLowerCase()}`, lead.priority)}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getPriorityColor(lead.priority), 0.1),
                      color: getPriorityColor(lead.priority),
                      border: `1px solid ${alpha(getPriorityColor(lead.priority), 0.3)}`,
                      fontWeight: 600
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {t('leads.details.created', 'Created On')}: {lead.createdAt}
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
                    {t('leads.details.callCustomer', 'Call Customer')}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    onClick={() => setPaymentLinkDialog(true)}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    }}
                  >
                    {t('leads.details.sendPaymentLink', 'Send Payment Link')}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<MoneyIcon />}
                    onClick={handleOpenShareQuote}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    }}
                  >
                    {t('leads.details.shareQuote', 'Share Quote')}
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
                      {t('leads.details.convertToCustomer', 'Convert to Customer')}
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/lead-management?editLead=${leadId}`)}
                  >
                    {t('leads.details.editLead', 'Edit Lead')}
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
            <Tab label={t('leads.details.tabs.overview', 'Overview')} />
            <Tab label={t('leads.details.tabs.policyNominee', 'Policy & Nominee')} />
            <Tab label={t('leads.details.tabs.policyHistory', 'Policy History')} />
            <Tab label={t('leads.details.tabs.activities', 'Activities')} />
            <Tab label={t('leads.details.tabs.contactNumbers', 'Contact Numbers')} />
            <Tab label={t('leads.details.tabs.documents', 'Documents')} />
            <Tab label={t('leads.details.tabs.vehicleDocuments', 'Vehicle Documents')} />
            <Tab label={t('leads.details.tabs.insuranceDocuments', 'Insurance Documents')} />
            <Tab label={t('leads.details.tabs.kycDocuments', 'KYC Documents')} />
            <Tab label={t('leads.details.tabs.customerFeedback', 'Customer Feedback')} />
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
                      {t('leads.details.sections.contactInfo', 'Contact Information')}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.email', 'Email')}</Typography>
                        <Typography variant="body1">{lead.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.phone', 'Phone')}</Typography>
                        <Typography variant="body1">{lead.phone}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.alternatePhone', 'Alternate Phone')}</Typography>
                        <Typography variant="body1">{lead.alternatePhone || t('leads.details.values.notProvided', 'Not Provided')}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.company', 'Company')}</Typography>
                        <Typography variant="body1">{lead.company}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.position', 'Position')}</Typography>
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
                      {t('leads.details.sections.leadDetails', 'Lead Details')}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.source', 'Source')}</Typography>
                        <Typography variant="body1">{t(`leads.details.values.sources.${lead.source}`, lead.source)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.assignedTo', 'Assigned To')}</Typography>
                        <Typography variant="body1">{lead.assignedTo || t('leads.details.values.unassigned', 'Unassigned')}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.value', 'Value')}</Typography>
                        <Typography variant="body1" fontWeight="600" color="primary">
                          ${lead.value?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.expectedCloseDate', 'Expected Close Date')}</Typography>
                        <Typography variant="body1">{lead.expectedCloseDate || t('leads.details.values.notSet', 'Not Set')}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.lastContact', 'Last Contact')}</Typography>
                        <Typography variant="body1">{lead.lastContactDate || t('leads.details.values.never', 'Never')}</Typography>
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
                      {t('leads.details.sections.insuranceDetails', 'Insurance Details')}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.product', 'Product')}</Typography>
                          <Typography variant="body1">{lead.product || t('leads.details.values.notAssigned', 'Not Assigned')}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.subProduct', 'Sub Product')}</Typography>
                          <Typography variant="body1">{t(`leads.subProducts.${lead.subProduct}`, lead.subProduct) || t('leads.details.values.notAssigned', 'Not Assigned')}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.policyExpiryDate', 'Policy Expiry Date')}</Typography>
                          <Typography variant="body1" fontWeight="600" color="error.main">
                            {policyDetails?.policyExpiryDate || t('leads.details.values.notSet', 'Not Set')}
                          </Typography>
                        </Box>
                      </Grid>
                      {lead.subProduct === 'Vehicle Insurance' && (
                        <>
                          <Grid item xs={12} sm={4}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">{t('leads.details.fields.vehicleRegNumber', 'Vehicle Reg. Number')}</Typography>
                              <Typography variant="body1">{lead.vehicleRegistrationNumber || t('leads.details.values.na', 'N/A')}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">{t('leads.details.fields.vehicleType', 'Vehicle Type')}</Typography>
                              <Typography variant="body1">{t(`leads.details.values.vehicleTypes.${lead.vehicleType}`, lead.vehicleType) || t('leads.details.values.na', 'N/A')}</Typography>
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
                      {t('leads.details.sections.leadNotes', 'Notes')}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {lead.notes || t('leads.details.values.noNotes', 'No notes added.')}
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
                      {t('leads.details.sections.policyDetails', 'Policy Details')}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {/* Header Information */}
                      <Grid item xs={12}>
                        <Box mb={2}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">{t('leads.details.fields.policyNumber', 'Policy Number')}</Typography>
                            <Typography variant="body1" fontWeight="600">{policyDetails?.policyNumber}</Typography>
                          </Box>
                        </Box>
                        <Box mb={2} display="flex" gap={2} alignItems="center">
                          <Box>
                            <Typography variant="caption" color="text.secondary">{t('leads.details.fields.policyType', 'Policy Type')}</Typography>
                            <Typography variant="body1">{t(`leads.details.values.policyTypes.${policyDetails?.policyType}`, policyDetails?.policyType)}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">{t('leads.details.fields.policyStatus', 'Policy Status')}</Typography>
                            <Box>
                              <Chip
                                label={t(`leads.details.values.policyStatuses.${policyDetails?.policyStatus}`, policyDetails?.policyStatus)}
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
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.idv', 'IDV')}</Typography>
                          <Typography variant="body1" fontWeight="600" color="primary">
                            ₹{policyDetails?.idv?.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: alpha(theme.palette.success.main, 0.03), borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.finalPremium', 'Final Premium')}</Typography>
                          <Typography variant="body1" color="success.main" fontWeight="600">
                            ₹{policyDetails?.finalPremium?.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.odPremium', 'OD Premium')}</Typography>
                          <Typography variant="body1">₹{policyDetails?.odPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.liabilityPremium', 'Liability Premium')}</Typography>
                          <Typography variant="body1">₹{policyDetails?.liabilityPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.addOnPremium', 'Add-on Premium')}</Typography>
                          <Typography variant="body1">₹{policyDetails?.addOnPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.netPremium', 'Net Premium')}</Typography>
                          <Typography variant="body1">₹{policyDetails?.netPremium?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.gst', 'GST')}</Typography>
                          <Typography variant="body1">₹{policyDetails?.gst?.toLocaleString()}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.referenceId', 'Reference ID')}</Typography>
                          <Typography variant="body1">{policyDetails?.referenceId || t('leads.details.values.na', 'N/A')}</Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      {/* Policy Period Details */}
                      <Grid item xs={12}>
                        <Box mb={1}>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.fields.paymentFrequency', 'Payment Frequency')}</Typography>
                          <Typography variant="body1">{t(`leads.details.values.paymentFrequencies.${policyDetails?.paymentFrequency}`, policyDetails?.paymentFrequency)}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.policyPeriod', 'Policy Period')}</Typography>
                        <Typography variant="body1">
                          {policyDetails?.policyStartDate} {t('leads.details.values.to', 'to')} {policyDetails?.policyEndDate}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.nextPaymentDue', 'Next Payment Due')}</Typography>
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
                      {t('leads.details.sections.nomineeDetails', 'Nominee Details')}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.nomineeName', 'Name')}</Typography>
                        <Typography variant="body1" fontWeight="600">{nomineeDetails?.nomineeName}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.relationship', 'Relationship')}</Typography>
                        <Typography variant="body1">{t(`leads.details.values.relationships.${nomineeDetails?.relationship}`, nomineeDetails?.relationship)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.dob', 'Date of Birth')}</Typography>
                        <Typography variant="body1">{nomineeDetails?.dateOfBirth}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.contactNumber', 'Contact Number')}</Typography>
                        <Typography variant="body1">{nomineeDetails?.contactNumber}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.email', 'Email')}</Typography>
                        <Typography variant="body1">{nomineeDetails?.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.address', 'Address')}</Typography>
                        <Typography variant="body2">{nomineeDetails?.address}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.fields.nomineePercentage', 'Percentage')}</Typography>
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
                <Typography variant="h6">{t('leads.details.sections.policyHistory', 'Policy History')}</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    {t('common.export', 'Export')}
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('leads.details.table.policyNumber', 'Policy Number')}</TableCell>
                      <TableCell>{t('leads.details.table.policyType', 'Type')}</TableCell>
                      <TableCell>{t('leads.details.table.period', 'Period')}</TableCell>
                      <TableCell>{t('leads.details.table.vehicleDetails', 'Vehicle')}</TableCell>
                      <TableCell align="right">{t('leads.details.table.premium', 'Premium')}</TableCell>
                      <TableCell>{t('leads.details.table.ncb', 'NCB')}</TableCell>
                      <TableCell>{t('leads.details.table.claims', 'Claims')}</TableCell>
                      <TableCell>{t('leads.details.table.status', 'Status')}</TableCell>
                      <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
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
                        <TableCell>{t(`leads.details.values.policyTypes.${policy.type}`, policy.type)}</TableCell>
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
                            label={t(`leads.details.values.policyStatuses.${policy.status}`, policy.status)}
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
                          <Tooltip title={t('common.view', 'View')}>
                            <IconButton size="small" onClick={() => handleViewPolicyDetails(policy)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.download', 'Download')}>
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
              <Typography variant="h6" fontWeight="600" gutterBottom>{t('leads.details.sections.activities', 'Activities')}</Typography>

              {/* Activities Sub-tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activitiesSubTab} onChange={(e, newValue) => setActivitiesSubTab(newValue)}>
                  <Tab label={t('leads.details.tabs.overview', 'Overview')} />
                  <Tab label={t('leads.details.tabs.tasks', 'Tasks')} />
                  <Tab label={t('leads.details.tabs.callLog', 'Call Log')} />
                  <Tab label={t('leads.details.tabs.claims', 'Claims')} />
                  <Tab label={t('leads.details.tabs.timeline', 'Timeline')} />
                </Tabs>
              </Box>

              {/* Notes Sub-tab */}
              {activitiesSubTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddNoteDialog(true)}
                    >
                      {t('leads.details.notes.add', 'Create Note')}
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leads.details.table.date', 'Date')}</TableCell>
                          <TableCell>{t('leads.details.table.user', 'User')}</TableCell>
                          <TableCell>{t('leads.details.table.content', 'Content')}</TableCell>
                          <TableCell>{t('leads.details.table.createdAt', 'Created At')}</TableCell>
                          <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {notes.map((note) => (
                          <TableRow key={note.id} hover>
                            <TableCell>{note.date}</TableCell>
                            <TableCell>{note.user}</TableCell>
                            <TableCell>{note.content}</TableCell>
                            <TableCell>{note.createdAt}</TableCell>
                            <TableCell align="center">
                              <Tooltip title={t('common.view', 'View')}>
                                <IconButton size="small" onClick={() => handleViewNote(note)}>
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.delete', 'Delete')}>
                                <IconButton size="small" onClick={() => handleDeleteNote(note.id)}>
                                  <DeleteIcon fontSize="small" />
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

              {/* Tasks Sub-tab */}
              {activitiesSubTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddTaskDialog(true)}
                    >
                      {t('leads.details.tasks.add', 'Add Task')}
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leads.details.table.task', 'Task')}</TableCell>
                          <TableCell>{t('leads.details.table.dueDate', 'Due Date')}</TableCell>
                          <TableCell>{t('leads.details.table.priority', 'Priority')}</TableCell>
                          <TableCell>{t('leads.details.table.assignedTo', 'Assigned To')}</TableCell>
                          <TableCell>{t('leads.details.table.status', 'Status')}</TableCell>
                          <TableCell>{t('leads.details.table.createdAt', 'Created At')}</TableCell>
                          <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tasks.map((task) => (
                          <TableRow key={task.id} hover>
                            <TableCell>{task.task}</TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell>
                              <Chip
                                label={t(`leads.details.values.priorities.${task.priority.toLowerCase()}`, task.priority)}
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
                                label={t(`leads.details.values.callStatuses.${task.status.toLowerCase()}`, task.status)}
                                size="small"
                                color={task.status === 'Completed' ? 'success' : 'warning'}
                              />
                            </TableCell>
                            <TableCell>{task.createdAt}</TableCell>
                            <TableCell align="center">
                              <Tooltip title={t('common.delete', 'Delete')}>
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
                    <Typography variant="h6" fontWeight="600">📞 {t('leads.details.callLog.title', 'Call Log')}</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setAddCallLogDialog(true)}
                    >
                      {t('leads.details.callLog.addLog', 'Add Log')}
                    </Button>
                  </Box>

                  {/* Filters */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            placeholder={t('leads.details.callLog.searchPlaceholder', 'Search call logs...')}
                            value={callLogSearchTerm}
                            onChange={(e) => setCallLogSearchTerm(e.target.value)}
                            InputProps={{
                              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>{t('leads.details.callLog.type', 'Type')}</InputLabel>
                            <Select
                              value={callLogTypeFilter}
                              onChange={(e) => setCallLogTypeFilter(e.target.value)}
                              label={t('leads.details.callLog.type', 'Type')}
                            >
                              <MenuItem value="All">{t('leads.details.callLog.allTypes', 'All Types')}</MenuItem>
                              <MenuItem value="Inbound">{t('leads.details.callLog.inbound', 'Inbound')}</MenuItem>
                              <MenuItem value="Outbound">{t('leads.details.callLog.outbound', 'Outbound')}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>{t('leads.details.callLog.status', 'Status')}</InputLabel>
                            <Select
                              value={callLogStatusFilter}
                              onChange={(e) => setCallLogStatusFilter(e.target.value)}
                              label={t('leads.details.callLog.status', 'Status')}
                            >
                              <MenuItem value="All">{t('leads.details.callLog.allStatus', 'All Status')}</MenuItem>
                              <MenuItem value="Completed">{t('leads.details.callLog.completed', 'Completed')}</MenuItem>
                              <MenuItem value="Missed">{t('leads.details.callLog.missed', 'Missed')}</MenuItem>
                              <MenuItem value="No Answer">{t('leads.details.callLog.noAnswer', 'No Answer')}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <FormControl fullWidth>
                            <InputLabel>{t('leads.details.callLog.agent', 'Agent')}</InputLabel>
                            <Select
                              value={callLogAgentFilter}
                              onChange={(e) => setCallLogAgentFilter(e.target.value)}
                              label={t('leads.details.callLog.agent', 'Agent')}
                            >
                              <MenuItem value="All">{t('leads.details.callLog.allAgents', 'All Agents')}</MenuItem>
                              <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                              <MenuItem value="Mike Wilson">Mike Wilson</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            label={t('leads.details.callLog.date', 'Date')}
                            type="date"
                            value={callLogDateFilter}
                            onChange={(e) => setCallLogDateFilter(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<FilterIcon />}
                            onClick={handleResetCallLogFilters}
                          >
                            {t('leads.details.callLog.reset', 'Reset')}
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leads.details.table.callId', 'Call ID')}</TableCell>
                          <TableCell>{t('leads.details.table.customerName', 'Customer')}</TableCell>
                          <TableCell>{t('leads.details.table.agentName', 'Agent')}</TableCell>
                          <TableCell>{t('leads.details.table.callType', 'Type')}</TableCell>
                          <TableCell>{t('leads.details.table.duration', 'Duration')}</TableCell>
                          <TableCell>{t('leads.details.table.disposition', 'Disposition')}</TableCell>
                          <TableCell>{t('leads.details.table.dateTime', 'Date & Time')}</TableCell>
                          <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredCallLogs.map((log) => (
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
                                label={t(`leads.details.values.callTypes.${log.type.toLowerCase()}`, log.type)}
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
                                  label={t(`leads.details.values.dispositions.${log.disposition.replace(/ /g, '').charAt(0).toLowerCase() + log.disposition.replace(/ /g, '').slice(1)}`, log.disposition)}
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
                                    {t(`leads.details.values.subDispositions.${log.subDisposition.replace(/ /g, '').charAt(0).toLowerCase() + log.subDisposition.replace(/ /g, '').slice(1)}`, log.subDisposition)}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{log.date}</Typography>
                              <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title={t('common.view', 'View')}>
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
                      {t('leads.details.feedback.add', 'Add Claim')}
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('leads.details.table.claimNumber', 'Claim Number')}</TableCell>
                          <TableCell>{t('leads.details.table.date', 'Date')}</TableCell>
                          <TableCell>{t('leads.details.table.amount', 'Amount')}</TableCell>
                          <TableCell>{t('leads.details.table.description', 'Description')}</TableCell>
                          <TableCell>{t('leads.details.table.status', 'Status')}</TableCell>
                          <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
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
                                label={t(`leads.details.values.claimStatuses.${claim.status.replace(/ /g, '').charAt(0).toLowerCase() + claim.status.replace(/ /g, '').slice(1)}`, claim.status)}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(getStatusColor(claim.status), 0.1),
                                  color: getStatusColor(claim.status)
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title={t('common.delete', 'Delete')}>
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
                    <Typography variant="h6" fontWeight="600">{t('leads.details.sections.activities', 'Activities')} {t('leads.details.activities.timeline', 'Timeline')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('leads.details.activities.showingAll', 'Showing all activities')}
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
                initialNumbers={lead?.contacts || []}
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
                  {t('leads.details.documents.upload', 'Upload Document')}
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('leads.details.table.docType', 'Document Type')}</TableCell>
                      <TableCell>{t('leads.details.table.uploadDate', 'Upload Date')}</TableCell>
                      <TableCell>{t('leads.details.table.size', 'Size')}</TableCell>
                      <TableCell>{t('leads.details.table.status', 'Status')}</TableCell>
                      <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicleDocuments.map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VehicleIcon color="primary" />
                            {t(`leads.details.values.documentTypes.${doc.documentName}`, doc.documentName)}
                          </Box>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={doc.status}
                              onChange={(e) => handleVehicleDocStatusUpdate(doc.id, e.target.value)}
                              sx={{
                                backgroundColor: alpha(getStatusColor(doc.status), 0.1),
                                color: getStatusColor(doc.status)
                              }}
                            >
                              <MenuItem value="Pending">{t('leads.details.values.fileStatuses.pending', 'Pending')}</MenuItem>
                              <MenuItem value="Verified">{t('leads.details.values.fileStatuses.verified', 'Verified')}</MenuItem>
                              <MenuItem value="Rejected">{t('leads.details.values.fileStatuses.rejected', 'Rejected')}</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={t('common.view', 'View')}>
                            <IconButton size="small" onClick={() => handleViewDocument(doc, 'Vehicle Document')}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.download', 'Download')}>
                            <IconButton size="small" onClick={() => handleDownloadDocument(doc, 'Vehicle Document')}>
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete', 'Delete')}>
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
                  {t('leads.details.documents.upload', 'Upload Document')}
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('leads.details.table.fileName', 'File Name')}</TableCell>
                      <TableCell>{t('leads.details.table.uploadDate', 'Upload Date')}</TableCell>
                      <TableCell>{t('leads.details.table.size', 'Size')}</TableCell>
                      <TableCell>{t('leads.details.table.status', 'Status')}</TableCell>
                      <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insuranceDocuments.map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsuranceDocIcon color="primary" />
                            {t(`leads.details.values.documentTypes.${doc.documentName}`, doc.documentName)}
                          </Box>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={doc.status}
                              onChange={(e) => handleInsuranceDocStatusUpdate(doc.id, e.target.value)}
                              sx={{
                                backgroundColor: alpha(getStatusColor(doc.status), 0.1),
                                color: getStatusColor(doc.status)
                              }}
                            >
                              <MenuItem value="Pending">{t('leads.details.values.fileStatuses.pending', 'Pending')}</MenuItem>
                              <MenuItem value="Verified">{t('leads.details.values.fileStatuses.verified', 'Verified')}</MenuItem>
                              <MenuItem value="Rejected">{t('leads.details.values.fileStatuses.rejected', 'Rejected')}</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={t('common.view', 'View')}>
                            <IconButton size="small" onClick={() => handleViewDocument(doc, 'Insurance Document')}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.download', 'Download')}>
                            <IconButton size="small" onClick={() => handleDownloadDocument(doc, 'Insurance Document')}>
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete', 'Delete')}>
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
                <Typography variant="h6" fontWeight="600">{t('leads.details.documents.kycTitle', 'KYC Documents')}</Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setFileUploadDialog(true)}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  }}
                >
                  {t('leads.details.documents.uploadFiles', 'Upload Files')}
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
                        <InputLabel>{t('leads.details.documents.status', 'Status')}</InputLabel>
                        <Select
                          value={fileStatusFilter}
                          label={t('leads.details.documents.status', 'Status')}
                          onChange={(e) => setFileStatusFilter(e.target.value)}
                        >
                          <MenuItem value="All">{t('leads.details.callLog.allStatus', 'All Status')}</MenuItem>
                          <MenuItem value="Pending">{t('leads.details.values.fileStatuses.pending', 'Pending')}</MenuItem>
                          <MenuItem value="Verified">{t('leads.details.values.fileStatuses.verified', 'Verified')}</MenuItem>
                          <MenuItem value="Rejected">{t('leads.details.values.fileStatuses.rejected', 'Rejected')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>{t('leads.details.documents.type', 'Type')}</InputLabel>
                        <Select
                          value={fileTypeFilter}
                          label={t('leads.details.documents.type', 'Type')}
                          onChange={(e) => setFileTypeFilter(e.target.value)}
                        >
                          <MenuItem value="All">{t('leads.details.callLog.allTypes', 'All Types')}</MenuItem>
                          {fileDocumentTypes.map(type => (
                            <MenuItem key={type} value={type}>{t(`leads.details.values.documentTypes.${type}`, type)}</MenuItem>
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
                        {t('leads.details.callLog.reset', 'Reset')}
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
                      <TableCell>{t('leads.details.table.docType', 'Document Type')}</TableCell>
                      <TableCell>{t('leads.details.table.fileName', 'File Name')}</TableCell>
                      <TableCell>{t('leads.details.table.uploadedOn', 'Uploaded On')}</TableCell>
                      <TableCell>{t('leads.details.table.size', 'Size')}</TableCell>
                      <TableCell>{t('leads.details.table.status', 'Status')}</TableCell>
                      <TableCell align="center">{t('leads.details.table.actions', 'Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getFileIcon(file.fileType)}
                            <Typography variant="body2">{t(`leads.details.values.documentTypes.${file.documentType}`, file.documentType)}</Typography>
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
                              <MenuItem value="Pending">{t('leads.details.values.fileStatuses.pending', 'Pending')}</MenuItem>
                              <MenuItem value="Verified">{t('leads.details.values.fileStatuses.verified', 'Verified')}</MenuItem>
                              <MenuItem value="Rejected">{t('leads.details.values.fileStatuses.rejected', 'Rejected')}</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={t('common.view', 'View')}>
                            <IconButton size="small" onClick={() => handleViewDocument(file, 'KYC Document')}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.download', 'Download')}>
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
                    {t('leads.details.documents.noFiles', 'No files found')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {uploadedFiles.length === 0
                      ? t('leads.details.documents.noFilesDesc', 'No files uploaded yet')
                      : t('leads.details.documents.noMatchDesc', 'No files match your filters')}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Customer Feedback Tab Content */}
          {currentTab === 9 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">{t('leads.details.feedback.title', 'Customer Feedback')}</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setFeedbackDialog(true)}
                >
                  {t('leads.details.feedback.add', 'Add Feedback')}
                </Button>
              </Box>

              {customerFeedback.rating ? (
                <Card>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {t('leads.details.feedback.rating', 'Rating')}
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
                            {t('leads.details.feedback.nps', 'NPS (0-10)')}
                          </Typography>
                          <Typography variant="h6">
                            {customerFeedback.recommendationScore}/10
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {t('leads.details.feedback.date', 'Feedback Date')}
                          </Typography>
                          <Typography variant="body1">
                            {customerFeedback.feedbackDate}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {t('leads.details.feedback.general', 'General Feedback')}
                          </Typography>
                          <Typography variant="body1">
                            {customerFeedback.feedback}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {t('leads.details.feedback.satisfaction', 'Satisfaction Areas')}
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
                            {t('leads.details.feedback.improvement', 'Improvement Areas')}
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
                              {t('leads.details.feedback.additionalComments', 'Additional Comments')}
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
                    {t('leads.details.feedback.noFeedback', 'No feedback yet')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('leads.details.feedback.noFeedbackDesc', 'Customer has not provided any feedback yet.')}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={addTaskDialog} onClose={() => setAddTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('leads.details.dialogs.addTask.title', 'Add Task')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addTask.taskDescription', 'Task Description')}
                value={taskForm.task}
                onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addTask.dueDate', 'Due Date')}
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addTask.priority', 'Priority')}</InputLabel>
                <Select
                  value={taskForm.priority}
                  label={t('leads.details.dialogs.addTask.priority', 'Priority')}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <MenuItem value="Low">{t('leads.details.values.priorities.low', 'Low')}</MenuItem>
                  <MenuItem value="Medium">{t('leads.details.values.priorities.medium', 'Medium')}</MenuItem>
                  <MenuItem value="High">{t('leads.details.values.priorities.high', 'High')}</MenuItem>
                  <MenuItem value="Urgent">{t('leads.details.values.priorities.urgent', 'Urgent')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addTask.assignTo', 'Assign To')}</InputLabel>
                <Select
                  value={taskForm.assignedTo}
                  label={t('leads.details.dialogs.addTask.assignTo', 'Assign To')}
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
          <Button onClick={() => setAddTaskDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={handleAddTask} variant="contained">{t('leads.details.dialogs.addTask.addTask', 'Add Task')}</Button>
        </DialogActions>
      </Dialog>

      {/* Add Call Log Dialog */}
      <Dialog open={addCallLogDialog} onClose={() => setAddCallLogDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="primary" />
            <Typography variant="h6" fontWeight="600">{t('leads.details.dialogs.addCallLog.title', 'Add Call Log')}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addCallLog.type', 'Call Type')}</InputLabel>
                <Select
                  value={callLogForm.type}
                  label={t('leads.details.dialogs.addCallLog.type', 'Call Type')}
                  onChange={(e) => setCallLogForm({ ...callLogForm, type: e.target.value })}
                >
                  <MenuItem value="Inbound">📞 {t('leads.details.values.callTypes.inbound', 'Inbound')}</MenuItem>
                  <MenuItem value="Outbound">📱 {t('leads.details.values.callTypes.outbound', 'Outbound')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addCallLog.duration', 'Duration')}
                placeholder={t('leads.details.dialogs.addCallLog.durationPlaceholder', 'e.g. 5 mins')}
                value={callLogForm.duration}
                onChange={(e) => setCallLogForm({ ...callLogForm, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addCallLog.status', 'Status')}</InputLabel>
                <Select
                  value={callLogForm.status}
                  label={t('leads.details.dialogs.addCallLog.status', 'Status')}
                  onChange={(e) => setCallLogForm({ ...callLogForm, status: e.target.value })}
                >
                  <MenuItem value="Completed">✅ {t('leads.details.values.callStatuses.completed', 'Completed')}</MenuItem>
                  <MenuItem value="Missed">❌ {t('leads.details.values.callStatuses.missed', 'Missed')}</MenuItem>
                  <MenuItem value="No Answer">⏰ {t('leads.details.values.callStatuses.noAnswer', 'No Answer')}</MenuItem>
                  <MenuItem value="Busy">📵 {t('leads.details.values.callStatuses.busy', 'Busy')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addCallLog.disposition', 'Disposition')}</InputLabel>
                <Select
                  value={callLogForm.disposition || ''}
                  label={t('leads.details.dialogs.addCallLog.disposition', 'Disposition')}
                  onChange={(e) => setCallLogForm({ ...callLogForm, disposition: e.target.value })}
                >
                  <MenuItem value="Interested">✅ {t('leads.details.values.dispositions.interested', 'Interested')}</MenuItem>
                  <MenuItem value="Not Interested">❌ {t('leads.details.values.dispositions.notInterested', 'Not Interested')}</MenuItem>
                  <MenuItem value="Call Back">📞 {t('leads.details.values.dispositions.callBack', 'Call Back')}</MenuItem>
                  <MenuItem value="Not Reachable">📵 {t('leads.details.values.dispositions.notReachable', 'Not Reachable')}</MenuItem>
                  <MenuItem value="Converted">🎉 {t('leads.details.values.dispositions.converted', 'Converted')}</MenuItem>
                  <MenuItem value="DNC">🚫 {t('leads.details.values.dispositions.dnc', 'Do Not Call')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addCallLog.subDisposition', 'Sub Disposition')}
                placeholder={t('leads.details.dialogs.addCallLog.subDispositionPlaceholder', 'e.g. Call back later')}
                value={callLogForm.subDisposition || ''}
                onChange={(e) => setCallLogForm({ ...callLogForm, subDisposition: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addCallLog.notes', 'Notes')}
                multiline
                rows={4}
                value={callLogForm.notes}
                onChange={(e) => setCallLogForm({ ...callLogForm, notes: e.target.value })}
                placeholder={t('leads.details.dialogs.addCallLog.placeholderNotes', 'Add any relevant notes...')}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCallLogDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={handleAddCallLog} variant="contained">{t('leads.details.dialogs.addCallLog.addLog', 'Add Log')}</Button>
        </DialogActions>
      </Dialog>

      {/* Call Details Modal */}
      <Dialog open={callDetailsDialog} onClose={() => setCallDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="primary" />
            <Typography variant="h6" fontWeight="600">{t('leads.details.dialogs.callDetails.title', 'Call Details')}</Typography>
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
                      📋 {t('leads.details.dialogs.callDetails.callInfo', 'Call Info')}
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.table.callId', 'Call ID')}</Typography>
                        <Typography variant="body1" fontWeight="600">
                          CALL-{new Date().getFullYear()}-{String(selectedCallLog.id).padStart(4, '0')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.table.dateTime', 'Date & Time')}</Typography>
                        <Typography variant="body1">{selectedCallLog.date} at {selectedCallLog.time}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.table.duration', 'Duration')}</Typography>
                        <Typography variant="body1" fontWeight="600">{selectedCallLog.duration}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.table.callType', 'Call Type')}</Typography>
                        <Chip
                          label={selectedCallLog.type}
                          size="small"
                          color={selectedCallLog.type === 'Inbound' ? 'success' : 'primary'}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.table.status', 'Status')}</Typography>
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
                      👥 {t('leads.details.dialogs.callDetails.participants', 'Participants')}
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.table.customerName', 'Customer Name')}</Typography>
                        <Typography variant="body1" fontWeight="600">
                          {lead.firstName} {lead.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{lead.phone}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('leads.details.table.agentName', 'Agent Name')}</Typography>
                        <Typography variant="body1" fontWeight="600">{selectedCallLog.agentName}</Typography>
                      </Box>
                      {selectedCallLog.callRating && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">{t('leads.details.feedback.rating', 'Rating')}</Typography>
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
                      📝 {t('leads.details.dialogs.callDetails.summary', 'Summary')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCallLog.callSummary}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      {t('leads.details.dialogs.addCallLog.notes', 'Notes')}:
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
          <Button onClick={() => setCallDetailsDialog(false)}>{t('common.close', 'Close')}</Button>
          {selectedCallLog?.followUpRequired && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFollowUpDialog(true)}
            >
              {t('leads.details.dialogs.callDetails.scheduleFollowUp', 'Schedule Follow-up')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add Claim Dialog */}
      <Dialog open={addClaimDialog} onClose={() => setAddClaimDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('leads.details.dialogs.addClaim.title', 'Add New Claim')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Auto-populated Customer Information */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addClaim.customerName', 'Customer Name')}
                value={lead?.firstName + ' ' + lead?.lastName}
                InputProps={{ readOnly: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addClaim.mobile', 'Mobile')}
                value={lead?.phone}
                InputProps={{ readOnly: true }}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addClaim.email', 'Email')}
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
                label={t('leads.details.dialogs.addClaim.insuranceCompany', 'Insurance Company')}
                value={claimForm.insuranceCompany}
                onChange={(e) => setClaimForm({ ...claimForm, insuranceCompany: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={t('leads.details.dialogs.addClaim.policyNumber', 'Policy Number')}
                value={claimForm.policyNumber}
                onChange={(e) => setClaimForm({ ...claimForm, policyNumber: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label={t('leads.details.dialogs.addClaim.expiryDate', 'Policy Expiry Date')}
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
                label={t('leads.details.dialogs.addClaim.claimNumber', 'Claim Number')}
                value={claimForm.claimNumber}
                onChange={(e) => setClaimForm({ ...claimForm, claimNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>{t('leads.details.dialogs.addClaim.status', 'Claim Status')}</InputLabel>
                <Select
                  value={claimForm.claimStatus}
                  label={t('leads.details.dialogs.addClaim.status', 'Claim Status')}
                  onChange={(e) => setClaimForm({ ...claimForm, claimStatus: e.target.value })}
                >
                  <MenuItem value="Pending">{t('leads.details.values.claimStatuses.pending', 'Pending')}</MenuItem>
                  <MenuItem value="In Progress">{t('leads.details.values.claimStatuses.inProgress', 'In Progress')}</MenuItem>
                  <MenuItem value="Document Pending">{t('leads.details.values.claimStatuses.docPending', 'Document Pending')}</MenuItem>
                  <MenuItem value="Approved">{t('leads.details.values.claimStatuses.approved', 'Approved')}</MenuItem>
                  <MenuItem value="Settled">{t('leads.details.values.claimStatuses.settled', 'Settled')}</MenuItem>
                  <MenuItem value="Rejected">{t('leads.details.values.claimStatuses.rejected', 'Rejected')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.addClaim.remarks', 'Remarks')}
                multiline
                rows={3}
                value={claimForm.remarks}
                onChange={(e) => setClaimForm({ ...claimForm, remarks: e.target.value })}
                placeholder={t('leads.details.dialogs.addClaim.remarksPlaceholder', 'Enter any remarks...')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddClaimDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={handleAddClaim} variant="contained">{t('leads.details.dialogs.addClaim.addClaim', 'Submit Claim')}</Button>
        </DialogActions>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={fileUploadDialog} onClose={() => setFileUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UploadIcon color="primary" />
            <Typography variant="h6" fontWeight="600">{t('leads.details.dialogs.uploadDocs.title', 'Upload Documents')}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.uploadDocs.docType', 'Document Type')}</InputLabel>
                <Select
                  value={fileUploadForm.documentType}
                  label={t('leads.details.dialogs.uploadDocs.docType', 'Document Type')}
                  onChange={(e) => setFileUploadForm({ ...fileUploadForm, documentType: e.target.value })}
                >
                  {fileDocumentTypes.map((type) => (
                    <MenuItem key={type} value={type}>{t(`leads.details.values.documentTypes.${type}`, type)}</MenuItem>
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
                {t('leads.details.dialogs.uploadDocs.chooseFiles', 'Choose Files')}
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
                    {t('leads.details.dialogs.uploadDocs.selectedFiles', { count: fileUploadForm.files.length }) || `Selected ${fileUploadForm.files.length} files`}
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
                <InputLabel>{t('leads.details.dialogs.uploadDocs.initialStatus', 'Initial Status')}</InputLabel>
                <Select
                  value={fileUploadForm.status}
                  label={t('leads.details.dialogs.uploadDocs.initialStatus', 'Initial Status')}
                  onChange={(e) => setFileUploadForm({ ...fileUploadForm, status: e.target.value })}
                >
                  <MenuItem value="Pending">{t('leads.details.values.fileStatuses.pending', 'Pending')}</MenuItem>
                  <MenuItem value="Verified">{t('leads.details.values.fileStatuses.verified', 'Verified')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileUploadDialog(false)}>{t('common.cancel')}</Button>
          <Button
            onClick={handleFileUpload}
            variant="contained"
            disabled={fileUploadForm.files.length === 0}
          >
            {t('leads.details.dialogs.uploadDocs.uploadFiles', 'Upload Files')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDocumentDialog} onClose={() => setUploadDocumentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('leads.details.dialogs.uploadDocs.title', 'Upload Document')} - {documentType === 'vehicle' ? t('leads.details.documents.vehicleTitle', 'Vehicle Documents') : t('leads.details.documents.insuranceTitle', 'Insurance Documents')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              {documentType === 'vehicle' ? (
                <FormControl fullWidth>
                  <InputLabel>{t('leads.details.dialogs.uploadDocs.docType', 'Document Type')}</InputLabel>
                  <Select
                    value={documentForm.documentName}
                    label={t('leads.details.dialogs.uploadDocs.docType', 'Document Type')}
                    onChange={(e) => setDocumentForm({ ...documentForm, documentName: e.target.value })}
                  >
                    {vehicleDocumentTypes.map((type) => (
                      <MenuItem key={type} value={type}>{t(`leads.details.values.documentTypes.${type}`, type)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={t('leads.details.documents.name', 'Document Name')}
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
                {t('leads.details.dialogs.uploadDocs.chooseFiles', 'Choose Files')}
                <input
                  type="file"
                  hidden
                  onChange={(e) => setDocumentForm({ ...documentForm, file: e.target.files[0] })}
                />
              </Button>
              {documentForm.file && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {t('leads.details.dialogs.uploadDocs.selectedFiles', { count: 1 }) || 'Selected 1 file'}: {documentForm.file.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDocumentDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={handleUploadDocument} variant="contained">{t('leads.details.dialogs.uploadDocs.uploadFiles', 'Upload')}</Button>
        </DialogActions>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={callDialog} onClose={() => setCallDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon color="success" />
            <Typography variant="h6" fontWeight="600">{t('leads.details.dialogs.contactCustomer.title', 'Contact Customer')}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Lead ID */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.details.contactLead.labels.leadId', 'Lead ID')}</Typography>
              <Typography variant="body1" fontWeight="600" color="primary">
                {generateLeadId(lead.id)}
              </Typography>
            </Box>

            {/* Customer Name */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.details.table.customerName', 'Customer Name')}</Typography>
              <Typography variant="body1" fontWeight="600">
                {lead.firstName} {lead.lastName}
              </Typography>
            </Box>

            {/* Policy Type */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600">{t('leads.details.fields.policyType', 'Policy Type')}</Typography>
              <Typography variant="body1">
                {policyDetails?.policyType || t('leads.details.values.notAssigned', 'Not Assigned')}
              </Typography>
            </Box>

            <Divider />

            {/* Main Phone Number */}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                {t('leads.details.dialogs.contactCustomer.mainPhone', 'Main Phone')}
              </Typography>
              Point is, I should also translate these.
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
                  {t('leads.details.dialogs.contactCustomer.dial', 'Dial')}
                </Button>
              </Box>
            </Box>

            {/* Alternate Phone Number */}
            {lead.alternatePhone && (
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="600" gutterBottom>
                  {t('leads.details.dialogs.contactCustomer.alternatePhone', 'Alternate Phone')}
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
                    {t('leads.details.dialogs.contactCustomer.dial', 'Dial')}
                  </Button>
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialog(false)}>{t('common.close', 'Close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Customer Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('leads.details.dialogs.addFeedback.title', 'Add Feedback')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('leads.details.feedback.rating', 'Rating (1-5)')}
                type="number"
                InputProps={{ inputProps: { min: 1, max: 5 } }}
                value={customerFeedback.rating}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, rating: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('leads.details.feedback.nps', 'NPS Score (0-10)')}
                type="number"
                InputProps={{ inputProps: { min: 0, max: 10 } }}
                value={customerFeedback.recommendationScore}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, recommendationScore: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.feedback.general', 'General Feedback')}
                multiline
                rows={4}
                value={customerFeedback.feedback}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, feedback: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('leads.details.feedback.satisfaction', 'Satisfaction Areas')}
                multiline
                rows={3}
                value={customerFeedback.satisfactionAreas.join('\n')}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, satisfactionAreas: e.target.value.split('\n').filter(x => x) })}
                placeholder={t('leads.details.feedback.placeholderNewLines', 'Enter areas separated by new lines')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('leads.details.feedback.improvement', 'Improvement Areas')}
                multiline
                rows={3}
                value={customerFeedback.improvementAreas.join('\n')}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, improvementAreas: e.target.value.split('\n').filter(x => x) })}
                placeholder={t('leads.details.feedback.placeholderNewLines')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.feedback.additionalComments')}
                multiline
                rows={2}
                value={customerFeedback.additionalComments}
                onChange={(e) => setCustomerFeedback({ ...customerFeedback, additionalComments: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleAddFeedback} variant="contained">{t('leads.details.dialogs.addFeedback.saveFeedback')}</Button>
        </DialogActions>
      </Dialog>

      {/* Convert to Customer Dialog */}
      <Dialog open={convertDialog} onClose={() => setConvertDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="warning" />
            <Typography variant="h6" fontWeight="600">{t('leads.details.dialogs.convertLead.title', 'Convert to Customer')}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('leads.details.dialogs.convertLead.instruction', 'Please verify insurance details before converting.')}
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.convertLead.productType', 'Product Type')}
                value={convertForm.productType}
                onChange={(e) => setConvertForm({ ...convertForm, productType: e.target.value })}
                placeholder={lead?.subProduct || t('leads.details.dialogs.convertLead.productTypePlaceholder', 'e.g. Motor Insurance')}
                helperText={t('leads.details.dialogs.convertLead.productTypeHelper', 'Specify the type of insurance product')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.convertLead.policyNumber', 'Policy Number')}
                value={convertForm.policyNumber}
                onChange={(e) => setConvertForm({ ...convertForm, policyNumber: e.target.value })}
                placeholder={t('leads.details.dialogs.convertLead.policyNumberPlaceholder', 'Enter Policy Number')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.convertLead.premiumAmount', 'Premium Amount')}
                type="number"
                value={convertForm.premiumAmount}
                onChange={(e) => setConvertForm({ ...convertForm, premiumAmount: e.target.value })}
                placeholder={t('leads.details.dialogs.convertLead.premiumAmountPlaceholder', 'Enter Premium Amount')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.convertLead.age', 'Age')}
                type="number"
                value={convertForm.age}
                onChange={(e) => setConvertForm({ ...convertForm, age: e.target.value })}
                placeholder={t('leads.details.dialogs.convertLead.agePlaceholder', 'e.g. 35')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.convertLead.gender', 'Gender')}</InputLabel>
                <Select
                  value={convertForm.gender}
                  label={t('leads.details.dialogs.convertLead.gender', 'Gender')}
                  onChange={(e) => setConvertForm({ ...convertForm, gender: e.target.value })}
                >
                  <MenuItem value="">{t('leads.details.values.gender.notSpecified', 'Not Specified')}</MenuItem>
                  <MenuItem value="Male">{t('leads.details.values.gender.male', 'Male')}</MenuItem>
                  <MenuItem value="Female">{t('leads.details.values.gender.female', 'Female')}</MenuItem>
                  <MenuItem value="Other">{t('leads.details.values.gender.other', 'Other')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.convertLead.policyStartDate', 'Policy Start Date')}
                type="date"
                value={convertForm.policyStartDate}
                onChange={(e) => setConvertForm({ ...convertForm, policyStartDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                helperText={t('leads.details.dialogs.convertLead.policyStartDateHelper', 'Start date of the policy')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.convertLead.policyEndDate', 'Policy End Date')}
                type="date"
                value={convertForm.policyEndDate}
                onChange={(e) => setConvertForm({ ...convertForm, policyEndDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertDialog(false)}>{t('common.cancel')}</Button>
          <Button
            onClick={handleConvertLead}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            }}
          >
            {t('leads.details.dialogs.convertLead.convert', 'Convert')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={followUpDialog} onClose={() => setFollowUpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="h6" fontWeight="600">{t('leads.details.dialogs.scheduleFollowup.title', 'Schedule Follow-up')}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.scheduleFollowup.date', 'Formatted Date')}
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
                label={t('leads.details.dialogs.scheduleFollowup.time', 'Time')}
                type="time"
                value={followUpForm.time}
                onChange={(e) => setFollowUpForm({ ...followUpForm, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.scheduleFollowup.type', 'Follow-up Type')}</InputLabel>
                <Select
                  value={followUpForm.type}
                  label={t('leads.details.dialogs.scheduleFollowup.type', 'Follow-up Type')}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, type: e.target.value })}
                >
                  <MenuItem value="Call">📞 {t('leads.details.values.followupTypes.call', 'Call')}</MenuItem>
                  <MenuItem value="Email">📧 {t('leads.details.values.followupTypes.email', 'Email')}</MenuItem>
                  <MenuItem value="Meeting">🤝 {t('leads.details.values.followupTypes.meeting', 'Meeting')}</MenuItem>
                  <MenuItem value="WhatsApp">💬 {t('leads.details.values.followupTypes.whatsapp', 'WhatsApp')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addTask.priority')}</InputLabel>
                <Select
                  value={followUpForm.priority}
                  label={t('leads.details.dialogs.addTask.priority')}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, priority: e.target.value })}
                >
                  <MenuItem value="Low">{t('leads.details.values.priorities.low')}</MenuItem>
                  <MenuItem value="Medium">{t('leads.details.values.priorities.medium')}</MenuItem>
                  <MenuItem value="High">{t('leads.details.values.priorities.high')}</MenuItem>
                  <MenuItem value="Urgent">{t('leads.details.values.priorities.urgent')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addTask.assignTo')}</InputLabel>
                <Select
                  value={followUpForm.assignedTo}
                  label={t('leads.details.dialogs.addTask.assignTo')}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, assignedTo: e.target.value })}
                >
                  <MenuItem value="">{lead?.assignedTo || t('common.currentUser', 'Current User')}</MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.scheduleFollowup.notes', 'Notes')}
                multiline
                rows={3}
                value={followUpForm.notes}
                onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                placeholder={t('leads.details.dialogs.scheduleFollowup.notesPlaceholder', 'Enter notes for follow-up...')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFollowUpDialog(false)}>{t('common.cancel')}</Button>
          <Button
            onClick={handleScheduleFollowUp}
            variant="contained"
            disabled={!followUpForm.date}
            startIcon={<AccessTimeIcon />}
          >
            {t('leads.details.dialogs.scheduleFollowup.schedule', 'Schedule')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Link Dialog */}
      <Dialog open={paymentLinkDialog} onClose={() => setPaymentLinkDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('leads.details.dialogs.paymentLink.title', 'Generate Payment Link')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.paymentLink.amount', 'Amount')}
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
                label={t('leads.details.dialogs.paymentLink.purpose', 'Purpose')}
                value={paymentLinkData.purpose}
                onChange={(e) => setPaymentLinkData({ ...paymentLinkData, purpose: e.target.value })}
                placeholder={t('leads.details.dialogs.paymentLink.purposePlaceholder', 'e.g. Renewal Premium')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.paymentLink.expiresIn', 'Expires In')}</InputLabel>
                <Select
                  value={paymentLinkData.expiryDays}
                  label={t('leads.details.dialogs.paymentLink.expiresIn', 'Expires In')}
                  onChange={(e) => setPaymentLinkData({ ...paymentLinkData, expiryDays: e.target.value })}
                >
                  <MenuItem value={1}>{t('leads.details.dialogs.paymentLink.days', { count: 1 }) || '1 Day'}</MenuItem>
                  <MenuItem value={3}>{t('leads.details.dialogs.paymentLink.days', { count: 3 }) || '3 Days'}</MenuItem>
                  <MenuItem value={7}>{t('leads.details.dialogs.paymentLink.days', { count: 7 }) || '7 Days'}</MenuItem>
                  <MenuItem value={15}>{t('leads.details.dialogs.paymentLink.days', { count: 15 }) || '15 Days'}</MenuItem>
                  <MenuItem value={30}>{t('leads.details.dialogs.paymentLink.days', { count: 30 }) || '30 Days'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>{t('leads.details.dialogs.paymentLink.sendVia', 'Send via')}</Typography>
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
                  label={t('leads.details.dialogs.paymentLink.emailChannel', { email: lead?.email || 'N/A' }) || `Email (${lead?.email || 'N/A'})`}
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
                  label={t('leads.details.dialogs.paymentLink.smsChannel', { phone: lead?.phone || 'N/A' }) || `SMS (${lead?.phone || 'N/A'})`}
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
                  label={t('leads.details.dialogs.paymentLink.whatsappChannel', { phone: lead?.phone || 'N/A' }) || `WhatsApp (${lead?.phone || 'N/A'})`}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                {t('leads.details.dialogs.paymentLink.sentToInstruction', {
                  channels: [
                    paymentLinkData.sendVia.email && t('leads.details.fields.email', 'Email'),
                    paymentLinkData.sendVia.sms && t('leads.details.dialogs.addCallLog.placeholderPhone', 'Phone'),
                    paymentLinkData.sendVia.whatsapp && 'WhatsApp'
                  ].filter(Boolean).join(', ') || t('leads.details.dialogs.paymentLink.channelsPlaceholder', 'selected channels')
                }) || `Payment link will be sent to: ${[
                  paymentLinkData.sendVia.email && 'Email',
                  paymentLinkData.sendVia.sms && 'Phone',
                  paymentLinkData.sendVia.whatsapp && 'WhatsApp'
                ].filter(Boolean).join(', ') || 'selected channels'}`}
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentLinkDialog(false)}>{t('common.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Implement payment link generation
              alert(t('leads.details.dialogs.paymentLink.alertSuccess', {
                amount: paymentLinkData.amount,
                purpose: paymentLinkData.purpose,
                name: `${lead?.firstName} ${lead?.lastName}`
              }));
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
            {t('leads.details.dialogs.paymentLink.generate', 'Generate Link')}
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
          {t('leads.details.dialogs.policyView.title', 'Policy Details')}
        </DialogTitle>
        <DialogContent dividers>
          {selectedPolicy && (
            <Grid container spacing={3}>
              {/* Policy Information */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="primary">
                    {t('leads.details.dialogs.policyView.policyInfo', 'Policy Information')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.fields.policyNumber', 'Policy Number')}</Typography>
                      <Typography variant="body1" fontWeight="500">{selectedPolicy.policyNumber}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.fields.policyType', 'Policy Type')}</Typography>
                      <Typography variant="body1">{t(`leads.details.values.policyTypes.${selectedPolicy.type}`, selectedPolicy.type)}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.table.status', 'Status')}</Typography>
                      <Chip
                        label={t(`leads.details.values.policyStatuses.${selectedPolicy.status}`, selectedPolicy.status)}
                        size="small"
                        color={selectedPolicy.status === 'Active' ? 'success' : 'default'}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.contactLead.labels.leadId', 'Lead ID')}</Typography>
                      <Typography variant="body1">{selectedPolicy.id}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Policy Period */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    📅 {t('leads.details.dialogs.policyView.policyPeriod', 'Policy Period')}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.sections.policyPeriod.labels.startDate', 'Start Date')}:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(selectedPolicy.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.sections.policyPeriod.labels.expiryDate', 'Expiry Date')}:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {new Date(selectedPolicy.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.dialogs.policyView.duration', 'Duration')}:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {Math.ceil((new Date(selectedPolicy.endDate) - new Date(selectedPolicy.startDate)) / (1000 * 60 * 60 * 24))} {t('leads.details.dialogs.paymentLink.days_plural', { count: Math.ceil((new Date(selectedPolicy.endDate) - new Date(selectedPolicy.startDate)) / (1000 * 60 * 60 * 24)) }) || 'Days'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Vehicle Details */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    🚗 {t('leads.details.dialogs.policyView.vehicleDetails', 'Vehicle Details')}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.dialogs.policyView.vehicle', 'Vehicle')}:</Typography>
                      <Typography variant="body2" fontWeight="500">{selectedPolicy.vehicleDetails}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.dialogs.policyView.registration', 'Registration')}:</Typography>
                      <Typography variant="body2" fontWeight="500">{lead?.vehicleRegistrationNumber || 'N/A'}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Premium Details */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="success.main">
                    💰 {t('leads.details.dialogs.policyView.premiumDetails', 'Premium Details')}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.dialogs.policyView.premiumAmount', 'Premium Amount')}:</Typography>
                      <Typography variant="body1" fontWeight="600" color="success.main">
                        ₹{selectedPolicy.premium?.toLocaleString() || '0'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.dialogs.policyView.ncb', 'NCB')}:</Typography>
                      <Typography variant="body2" fontWeight="500">{selectedPolicy.ncb}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Claims History */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="warning.main">
                    📋 {t('leads.details.dialogs.policyView.claimsHistory', 'Claims History')}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.dialogs.policyView.totalClaims', 'Total Claims')}:</Typography>
                      <Typography variant="body1" fontWeight="600">
                        {selectedPolicy.claims}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.dialogs.policyView.claimsStatus', 'Claims Status')}:</Typography>
                      <Chip
                        label={selectedPolicy.claims === 0 ? t('leads.details.dialogs.policyView.noClaims', 'No Claims') : t('leads.details.dialogs.policyView.claimsCount', { count: selectedPolicy.claims }) || `${selectedPolicy.claims} Claims`}
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
                    👤 {t('leads.details.dialogs.policyView.insuredDetails', 'Insured Details')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.table.customerName', 'Customer Name')}</Typography>
                      <Typography variant="body2" fontWeight="500">{lead?.firstName} {lead?.lastName}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.fields.email', 'Email')}</Typography>
                      <Typography variant="body2">{lead?.email}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.dialogs.addCallLog.placeholderPhone', 'Phone')}</Typography>
                      <Typography variant="body2">{lead?.phone}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.fields.company', 'Company')}</Typography>
                      <Typography variant="body2">{lead?.company || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPolicyViewDialog(false)}>{t('common.close', 'Close')}</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => {
              if (selectedPolicy) {
                handleDownloadPolicy(selectedPolicy);
              }
            }}
          >
            {t('leads.details.dialogs.policyView.download', 'Download Policy')}

          </Button>
        </DialogActions>
      </Dialog>


      {/* Call Number Selection Dialog */}
      <Dialog open={callNumberDialog} onClose={() => setCallNumberDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('leads.details.dialogs.callNumber.title', 'Select Number to Call')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('leads.details.dialogs.callNumber.instruction', 'Choose which number you want to dial:')}
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
                <Typography variant="body2" fontWeight={600}>{t('leads.details.dialogs.callNumber.mainNumber', 'Main Number')}</Typography>
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
                  <Typography variant="body2" fontWeight={600}>{t('leads.details.dialogs.callNumber.alternateNumber', 'Alternate Number')}</Typography>
                  <Typography variant="body2" color="text.secondary">{lead.alternatePhone}</Typography>
                </Box>
              </Button>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallNumberDialog(false)}>{t('common.cancel')}</Button>
        </DialogActions>
      </Dialog>

      {/* Post-Call Dialog */}
      <Dialog open={postCallDialog} onClose={() => setPostCallDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('leads.details.dialogs.postCall.title', 'Post-Call Action')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('leads.details.dialogs.postCall.called', { number: selectedNumber }) || `You called ${selectedNumber}`}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.table.status', 'Status')}</InputLabel>
                <Select
                  value={callLogData.status}
                  label={t('leads.details.table.status', 'Status')}
                  onChange={(e) => setCallLogData({ ...callLogData, status: e.target.value })}
                >
                  <MenuItem value="New">{t('leads.details.values.leadStatuses.new', 'New')}</MenuItem>
                  <MenuItem value="Contacted">{t('leads.details.values.leadStatuses.contacted', 'Contacted')}</MenuItem>
                  <MenuItem value="Qualified">{t('leads.details.values.leadStatuses.qualified', 'Qualified')}</MenuItem>
                  <MenuItem value="Proposal">{t('leads.details.values.leadStatuses.proposal', 'Proposal')}</MenuItem>
                  <MenuItem value="Negotiation">{t('leads.details.values.leadStatuses.negotiation', 'Negotiation')}</MenuItem>
                  <MenuItem value="Closed Won">{t('leads.details.values.leadStatuses.closedWon', 'Closed Won')}</MenuItem>
                  <MenuItem value="Closed Lost">{t('leads.details.values.leadStatuses.closedLost', 'Closed Lost')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('leads.details.dialogs.addCallLog.subDisposition', 'Sub Disposition')}</InputLabel>
                <Select
                  value={callLogData.subStatus}
                  label={t('leads.details.dialogs.addCallLog.subDisposition', 'Sub Disposition')}
                  onChange={(e) => setCallLogData({ ...callLogData, subStatus: e.target.value })}
                >
                  <MenuItem value="Attempting Contact">{t('leads.details.values.dispositions.attemptingContact', 'Attempting Contact')}</MenuItem>
                  <MenuItem value="Contact Made">{t('leads.details.values.dispositions.contactMade', 'Contact Made')}</MenuItem>
                  <MenuItem value="Needs Analysis">{t('leads.details.values.dispositions.needsAnalysis', 'Needs Analysis')}</MenuItem>
                  <MenuItem value="Quote Sent">{t('leads.details.values.dispositions.quoteSent', 'Quote Sent')}</MenuItem>
                  <MenuItem value="Follow-up Required">{t('leads.details.values.dispositions.followupRequired', 'Follow-up Required')}</MenuItem>
                  <MenuItem value="Decision Pending">{t('leads.details.values.dispositions.decisionPending', 'Decision Pending')}</MenuItem>
                  <MenuItem value="Not Interested">{t('leads.details.values.dispositions.notInterested', 'Not Interested')}</MenuItem>
                  <MenuItem value="No Response">{t('leads.details.values.dispositions.noResponse', 'No Response')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.scheduleFollowup.date', 'Follow-up Date')}
                type="date"
                value={callLogData.followUpDate}
                onChange={(e) => setCallLogData({ ...callLogData, followUpDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.scheduleFollowup.time', 'Follow-up Time')}
                type="time"
                value={callLogData.followUpTime}
                onChange={(e) => setCallLogData({ ...callLogData, followUpTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('leads.details.dialogs.postCall.notes', 'Call Notes')}
                multiline
                rows={3}
                value={callLogData.notes}
                onChange={(e) => setCallLogData({ ...callLogData, notes: e.target.value })}
                placeholder={t('leads.details.dialogs.postCall.notesPlaceholder', 'Enter notes about the call...')}
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
          }}>{t('common.cancel', 'Cancel')}</Button>
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
              alert(`${t('leads.details.dialogs.postCall.alertSuccess', 'Call logged successfully.')}${callLogData.followUpDate ? t('leads.details.dialogs.postCall.alertFollowup', { date: callLogData.followUpDate, time: callLogData.followUpTime }) || ` Follow-up scheduled for ${callLogData.followUpDate} at ${callLogData.followUpTime}` : ''}`);

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
            {t('leads.details.dialogs.postCall.save', 'Save Log')}
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
          {t('leads.details.dialogs.uploadDocs.title', 'Document Details')}
        </DialogTitle>
        <DialogContent dividers>
          {selectedDocument && (
            <Grid container spacing={2}>
              {/* Document Information */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom color="primary">
                    {t('leads.details.dialogs.policyView.policyInfo', 'Document Info')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.documents.fileName', 'File Name')}</Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedDocument.documentName || selectedDocument.fileName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.documents.type', 'Document Type')}</Typography>
                      <Typography variant="body1">
                        {t(`leads.details.values.documentTypes.${selectedDocument.documentType || selectedDocument.docType}`, selectedDocument.documentType || selectedDocument.docType)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* File Details */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    📁 {t('leads.details.dialogs.documentView.fileDetails', 'File Details')}
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.documents.uploadedOn', 'Uploaded On')}:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {selectedDocument.uploadDate || selectedDocument.uploadedOn || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('leads.details.documents.size', 'Size')}:</Typography>
                      <Typography variant="body2" fontWeight="500">
                        {selectedDocument.size || 'N/A'}
                      </Typography>
                    </Box>
                    {selectedDocument.fileType && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">{t('leads.details.documents.fileFormat', 'File Format')}:</Typography>
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
                    ✓ {t('leads.details.dialogs.documentView.verificationStatus', 'Verification Status')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Chip
                      label={t(`leads.details.values.fileStatuses.${selectedDocument.status.toLowerCase()}`, selectedDocument.status)}
                      size="medium"
                      color={
                        selectedDocument.status === 'Verified' ? 'success' :
                          selectedDocument.status === 'Rejected' ? 'error' : 'warning'
                      }
                    />
                    <Typography variant="body2">
                      {selectedDocument.status === 'Verified' && t('leads.details.values.documentMessages.verified', 'Document verified successfully')}
                      {selectedDocument.status === 'Pending' && t('leads.details.values.documentMessages.pending', 'Document pending verification')}
                      {selectedDocument.status === 'Rejected' && t('leads.details.values.documentMessages.rejected', 'Document rejected')}
                      {selectedDocument.status === 'Active' && t('leads.details.values.documentMessages.active', 'Document is active')}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Associated Lead */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    👤 {t('leads.details.dialogs.documentView.associatedLead', 'Associated Lead')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.table.customerName', 'Customer Name')}</Typography>
                      <Typography variant="body2" fontWeight="500">{lead?.firstName} {lead?.lastName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">{t('leads.details.dialogs.addCallLog.placeholderPhone', 'Phone')}</Typography>
                      <Typography variant="body2">{lead?.phone}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDocumentViewDialog(false)}>{t('common.close', 'Close')}</Button>
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
            {t('leads.details.dialogs.policyView.download', 'Download')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Quote Dialog */}
      <Dialog open={shareQuoteDialogOpen} onClose={() => setShareQuoteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon color="warning" />
              <Typography variant="h6">{t('leads.details.dialogs.shareQuote.title', 'Share Quote')}</Typography>
            </Box>
            <IconButton onClick={() => setShareQuoteDialogOpen(false)}>
              <CancelIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('leads.details.dialogs.shareQuote.instruction', { name: `${lead?.firstName} ${lead?.lastName}` }) || `Share a quote with ${lead?.firstName} ${lead?.lastName}`}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>{t('leads.details.dialogs.shareQuote.type', 'Quote Type')}</InputLabel>
              <Select
                value={quoteForm.quoteType}
                label={t('leads.details.dialogs.shareQuote.type', 'Quote Type')}
                onChange={(e) => setQuoteForm({ ...quoteForm, quoteType: e.target.value })}
              >
                <MenuItem value="standard">{t('leads.details.values.quoteTypes.standard', 'Standard')}</MenuItem>
                <MenuItem value="premium">{t('leads.details.values.quoteTypes.premium', 'Premium')}</MenuItem>
                <MenuItem value="custom">{t('leads.details.values.quoteTypes.custom', 'Custom')}</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('leads.details.dialogs.shareQuote.premium', 'Premium')}
                  type="number"
                  value={quoteForm.premium}
                  onChange={(e) => setQuoteForm({ ...quoteForm, premium: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('leads.details.dialogs.shareQuote.coverage', 'Coverage')}
                  type="number"
                  value={quoteForm.coverage}
                  onChange={(e) => setQuoteForm({ ...quoteForm, coverage: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label={t('leads.details.dialogs.shareQuote.validTill', 'Valid Till')}
              type="date"
              value={quoteForm.validTill}
              onChange={(e) => setQuoteForm({ ...quoteForm, validTill: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('leads.details.dialogs.shareQuote.additionalNotes', 'Additional Notes')}
              value={quoteForm.notes}
              onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
              placeholder={t('leads.details.dialogs.shareQuote.notesPlaceholder', 'Enter any additional notes...')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareQuoteDialogOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<MoneyIcon />}
            onClick={handleShareQuote}
            disabled={!quoteForm.premium || !quoteForm.coverage}
          >
            {t('leads.details.dialogs.shareQuote.share', 'Share Quote')}

          </Button>
        </DialogActions>
      </Dialog>
      {/* Add Note Dialog */}
      <Dialog open={addNoteDialog} onClose={() => setAddNoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('leads.details.notes.add', 'Create Note')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('leads.details.table.date', 'Date')}
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={noteForm.date}
              onChange={(e) => setNoteForm({ ...noteForm, date: e.target.value })}
            />
            <TextField
              label={t('leads.details.table.user', 'User')}
              type="text"
              fullWidth
              value={noteForm.user}
              onChange={(e) => setNoteForm({ ...noteForm, user: e.target.value })}
            />
            <TextField
              label={t('leads.details.table.createdAt', 'Created At')}
              type="text"
              fullWidth
              helperText="Format: MM/DD/YYYY, HH:MM:SS AM/PM"
              value={noteForm.createdAt}
              onChange={(e) => setNoteForm({ ...noteForm, createdAt: e.target.value })}
            />
            <TextField
              label={t('leads.details.notes.content', 'Note Content')}
              type="text"
              fullWidth
              multiline
              rows={4}
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddNoteDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={handleAddNote} variant="contained">{t('common.save', 'Save')}</Button>
        </DialogActions>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog open={viewNoteDialog} onClose={() => setViewNoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('leads.details.notes.view', 'View Note')}</DialogTitle>
        <DialogContent dividers>
          {selectedNote && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">{t('leads.details.table.date', 'Date')}</Typography>
                <Typography variant="body1">{selectedNote.date}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{t('leads.details.table.user', 'User')}</Typography>
                <Typography variant="body1">{selectedNote.user}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{t('leads.details.table.createdAt', 'Created At')}</Typography>
                <Typography variant="body1">{selectedNote.createdAt}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{t('leads.details.table.content', 'Content')}</Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2">{selectedNote.content}</Typography>
                </Paper>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewNoteDialog(false)}>{t('common.close', 'Close')}</Button>
        </DialogActions>
      </Dialog>

    </Box >
  );
}

export default LeadDetails;