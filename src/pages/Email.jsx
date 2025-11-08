import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Grow,
  Badge,
  Checkbox,
  Snackbar,
  Alert,
  Toolbar,
  Divider,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Archive as ArchiveIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Attachment as AttachmentIcon,
  Schedule as ScheduleIcon,

  Edit as EditIcon,
  Reply as ReplyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Folder as FolderIcon,
  Block as BlockIcon,
  Warning as SpamIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Stars as VipIcon,
  Diamond as DiamondIcon,
  FindInPage as FindRelatedIcon,
  FilterList as FilterListIcon,
  Rule as RuleIcon,
  Forward as ForwardIcon,
  Create as CreateIcon,
  ExpandMore as ExpandMoreIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon,
  GetApp as GetAppIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmailInbox = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false); // Loading state
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('all'); // New due date filter
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Removed unused dialog states
  const [actionMenus, setActionMenus] = useState({});
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // New state for sorting
  const [sortConfig] = useState({ key: 'dateReceived', direction: 'desc' });

  // New responsive states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newEmailsCount, setNewEmailsCount] = useState(0);
  
  // Email Templates and Automation states (removed unused dialogs)

  // New Outlook-style features state
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [sidebarOpen] = useState(true);
  const [starredEmails, setStarredEmails] = useState(new Set());
  const [customerCategories, setCustomerCategories] = useState({});
  const [emailFolders] = useState([
    { id: 'inbox', name: 'Inbox', icon: 'inbox', count: 0 },
    { id: 'starred', name: 'Starred', icon: 'star', count: 0 },
    { id: 'sent', name: 'Sent', icon: 'send', count: 0 },
    { id: 'drafts', name: 'Drafts', icon: 'drafts', count: 0 },
    { id: 'junk', name: 'Junk Email', icon: 'block', count: 0 },
    { id: 'spam', name: 'Spam', icon: 'warning', count: 0 },
    { id: 'archive', name: 'Archive', icon: 'archive', count: 0 },
    { id: 'trash', name: 'Deleted Items', icon: 'delete', count: 0 }
  ]);
  const [customFolders, setCustomFolders] = useState([
    { id: 'urgent', name: 'Urgent', icon: 'priority_high', count: 0 },
    { id: 'follow_up', name: 'Follow Up', icon: 'schedule', count: 0 },
    { id: 'vip_customers', name: 'VIP Customers', icon: 'star', count: 0 }
  ]);
  const [emailRules, setEmailRules] = useState([
    {
      id: 1,
      name: 'VIP Customer Auto-Star',
      enabled: true,
      conditions: [{ field: 'from', operator: 'contains', value: '@vip' }],
      actions: [{ type: 'star' }, { type: 'move_to_folder', folder: 'vip_customers' }]
    },
    {
      id: 2,
      name: 'Spam Detection',
      enabled: true,
      conditions: [{ field: 'subject', operator: 'contains', value: 'lottery' }],
      actions: [{ type: 'move_to_folder', folder: 'spam' }]
    }
  ]);
  const [relatedEmailsDialog, setRelatedEmailsDialog] = useState({ open: false, email: null, relatedEmails: [] });
  const [, setSenderFilterDialog] = useState({ open: false, sender: '' });
  const [newFolderDialog, setNewFolderDialog] = useState({ open: false });
  const [rulesDialog, setRulesDialog] = useState({ open: false });
  const [composeDialog, setComposeDialog] = useState({ open: false, mode: 'new', replyTo: null, forwardFrom: null });
  const [auditTrailDialog, setAuditTrailDialog] = useState({ open: false, emailId: null });

  // Automation and template management states (restored for compatibility)
    // Removed unused template management states

  // Customer categorization options
  const customerCategoryOptions = [
    { value: 'normal', label: 'Normal', color: 'default', icon: PersonIcon },
    { value: 'hni', label: 'HNI (High Net Worth)', color: 'primary', icon: GroupIcon },
    { value: 'super_hni', label: 'Super HNI', color: 'secondary', icon: DiamondIcon },
    { value: 'vip', label: 'VIP', color: 'warning', icon: VipIcon }
  ];

  const agentsList = useMemo(() => [
    'Priya Patel',
    'Bob Smith', 
    'Charlie Brown',
    'Diana Wilson',
    'Eric Thompson'
  ], []);

  // Removed unused categoryOptions

  // Email Templates
  // Removed unused emailTemplates array

  // Generate dynamic email data based on current filters and time
  const generateDynamicEmails = useCallback(() => {
    const baseEmails = [
      {
        id: 'EMAIL-001',
        from: 'rajesh.kumar@gmail.com',
        subject: 'Urgent: Policy Renewal Documents Missing - POL789456',
        category: 'complaint',
        status: 'new',
        dateReceived: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        hasAttachments: true,
        priority: 'high',
        assignedTo: null,
        slaStatus: 'warning',
        content: 'Dear Team, I submitted my policy renewal documents last week but haven\'t received any confirmation. My policy expires tomorrow and I\'m worried about coverage gap. Please expedite this urgent matter.',
        isRead: false,
        slaTimeRemaining: Math.floor(2 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Due tomorrow
        policyExpiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'EMAIL-002',
        from: 'priya.sharma@techcorp.in',
        subject: 'Thank you for excellent claim service - Claim #CLM456789',
        category: 'feedback',
        status: 'resolved',
        dateReceived: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        hasAttachments: false,
        priority: 'medium',
        assignedTo: 'Sarah Johnson',
        slaStatus: 'ok',
        content: 'I wanted to express my gratitude for the exceptional service during my recent claim process. The adjuster was professional and the settlement was fair and quick. Thank you for your excellent customer service.',
        isRead: true,
        slaTimeRemaining: Math.floor(19 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in a week
        policyExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'EMAIL-003',
        from: 'amit.patel@startupventure.com',
        subject: 'Refund Request - Cancelled Policy POL123987',
        category: 'refund',
        status: 'in_progress',
        dateReceived: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        hasAttachments: true,
        priority: 'medium',
        assignedTo: 'Mike Chen',
        slaStatus: 'ok',
        content: 'I need to cancel my business insurance policy due to company closure. Please process the refund for the unused premium. I have attached the necessary documents including the business closure certificate.',
        isRead: true,
        slaTimeRemaining: Math.floor(16 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue by 2 days
        policyExpiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'EMAIL-004',
        from: 'neha.gupta@mediclinic.org',
        subject: 'Appointment Request - Policy Review and Premium Discussion',
        category: 'appointment',
        status: 'new',
        dateReceived: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        hasAttachments: false,
        priority: 'low',
        assignedTo: null,
        slaStatus: 'ok',
        content: 'Hello, I would like to schedule an appointment to review my current health insurance policy and discuss options for reducing my premium while maintaining adequate coverage. Please let me know your availability.',
        isRead: false,
        slaTimeRemaining: Math.floor(20 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Due in 3 days
        policyExpiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'EMAIL-005',
        from: 'vikram.singh@luxuryautos.in',
        subject: 'Premium Increase Concerns - Super Car Insurance Policy',
        category: 'complaint',
        status: 'in_progress',
        dateReceived: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        hasAttachments: false,
        priority: 'high',
        assignedTo: 'Emma Davis',
        slaStatus: 'warning',
        content: 'I received my renewal notice with a 40% premium increase for my Lamborghini insurance. This seems excessive without any claims history. I need an explanation and possible alternatives.',
        isRead: true,
        slaTimeRemaining: Math.floor(6 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Due in 15 days
        policyExpiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'EMAIL-006',
        from: 'ananya.reddy@globaltech.com',
        subject: 'Group Insurance Enrollment - 150 Employees',
        category: 'appointment',
        status: 'new',
        dateReceived: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        hasAttachments: true,
        priority: 'high',
        assignedTo: null,
        slaStatus: 'ok',
        content: 'We are looking to enroll 150 employees in our group health insurance plan. Please schedule a meeting to discuss coverage options, premium structures, and implementation timeline. Employee list attached.',
        isRead: false,
        slaTimeRemaining: Math.floor(24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Generate additional realistic emails
    const additionalEmails = [];
    const emailCount = Math.floor(Math.random() * 8) + 12; // 12-20 additional emails

    const realisticEmails = [
      {
        from: 'suresh.menon@techstart.co.in',
        subject: 'Claim Settlement Delay - Motor Insurance Claim #CLM789123',
        category: 'complaint',
        content: 'It has been 3 weeks since I submitted my motor insurance claim documents, but I haven\'t received any update on the settlement. My car is still at the garage and I need urgent resolution.'
      },
      {
        from: 'kavitha.nair@homedesigns.com',
        subject: 'Excellent Customer Service Experience',
        category: 'feedback',
        content: 'I wanted to commend your customer service team for their prompt and helpful response during my policy modification process. The entire experience was seamless and professional.'
      },
      {
        from: 'deepak.agarwal@manufacturing.in',
        subject: 'Premium Payment Confirmation Required',
        category: 'appointment',
        content: 'I made my annual premium payment last week through online banking. Please confirm receipt and send me the updated policy documents.'
      },
      {
        from: 'meera.krishnan@consulting.org',
        subject: 'Policy Cancellation and Refund Process',
        category: 'refund',
        content: 'Due to relocation abroad, I need to cancel my health insurance policy. Please guide me through the cancellation process and let me know about the refund eligibility.'
      },
      {
        from: 'ravi.kumar@logistics.co.in',
        subject: 'Add Spouse to Existing Health Policy',
        category: 'appointment',
        content: 'I recently got married and would like to add my spouse to my existing health insurance policy. Please let me know the required documents and premium adjustment.'
      },
      {
        from: 'sunita.sharma@education.gov.in',
        subject: 'Group Insurance Premium Increase Justification',
        category: 'complaint',
        content: 'Our school\'s group insurance premium has increased by 25% this year. We need detailed justification for this increase and explore alternatives to manage costs.'
      },
      {
        from: 'arjun.reddy@realestate.com',
        subject: 'Property Insurance Coverage Extension',
        category: 'appointment',
        content: 'I am expanding my property portfolio and need to extend my property insurance coverage. Can we schedule a meeting to discuss the additional coverage options?'
      },
      {
        from: 'pooja.jain@startup.tech',
        subject: 'Quick Claim Settlement - Thank You',
        category: 'feedback',
        content: 'Thank you for the quick settlement of my laptop theft claim. The entire process was handled efficiently and I received the settlement within 5 days of filing.'
      },
      {
        from: 'vinod.singh@transport.co.in',
        subject: 'Commercial Vehicle Insurance Renewal Urgent',
        category: 'complaint',
        content: 'My commercial vehicle insurance expires in 2 days and I still haven\'t received the renewal quote despite multiple follow-ups. This is causing operational issues.'
      },
      {
        from: 'nisha.patel@healthcare.org',
        subject: 'Medical Insurance Pre-approval Request',
        category: 'appointment',
        content: 'I need pre-approval for a planned surgery next month. Please let me know the required documents and approval timeline for the medical procedure.'
      }
    ];

    for (let i = 0; i < emailCount; i++) {
      const categories = ['complaint', 'feedback', 'refund', 'appointment', 'uncategorized'];
      const statuses = ['new', 'in_progress', 'resolved'];
      const priorities = ['low', 'medium', 'high'];
      const slaStatuses = ['ok', 'warning', 'breach'];
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Apply filter bias
      const categoryBias = categoryFilter !== 'all' ? categoryFilter : category;
      const statusBias = statusFilter !== 'all' ? statusFilter : status;
      
      // Use realistic email data if available, otherwise generate
      const emailTemplate = realisticEmails[i % realisticEmails.length];
      const customEmail = i < realisticEmails.length ? emailTemplate : {
        from: `customer${i}@company${Math.floor(Math.random() * 50) + 1}.com`,
        subject: `${categoryBias.charAt(0).toUpperCase() + categoryBias.slice(1)} Request - Policy #POL${Math.floor(Math.random() * 900000) + 100000}`,
        category: categoryBias,
        content: `This is regarding my ${categoryBias} request. Please provide assistance with my policy matter.`
      };
      
      additionalEmails.push({
        id: `EMAIL-${String(i + 100).padStart(3, '0')}`,
        from: customEmail.from,
        subject: customEmail.subject,
        category: Math.random() > 0.3 ? categoryBias : category,
        status: Math.random() > 0.3 ? statusBias : status,
        dateReceived: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        hasAttachments: Math.random() > 0.6,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignedTo: Math.random() > 0.5 ? agentsList[Math.floor(Math.random() * agentsList.length)] : null,
        slaStatus: slaStatuses[Math.floor(Math.random() * slaStatuses.length)],
        content: customEmail.content,
        isRead: Math.random() > 0.4,
        slaTimeRemaining: Math.floor(Math.random() * 24 * 60 * 60 * 1000),
        slaDeadline: new Date(Date.now() + Math.random() * 48 * 60 * 60 * 1000).toISOString()
      });
    }

    return [...baseEmails, ...additionalEmails];
  }, [categoryFilter, statusFilter, agentsList]);

  // Auto-refresh functionality
  const refreshEmails = useCallback(async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEmails = generateDynamicEmails();
    const previousCount = emails.length;
    const newCount = newEmails.length;
    
    setEmails(newEmails);
    setLastUpdated(new Date());
    
    if (newCount > previousCount) {
      setNewEmailsCount(newCount - previousCount);
      showNotification(`${newCount - previousCount} new emails received`, 'info');
    }
    
    setIsRefreshing(false);
  }, [generateDynamicEmails, emails.length]);

  // Initialize emails and set up auto-refresh
  useEffect(() => {
    const initialEmails = generateDynamicEmails();
    setEmails(initialEmails);
    setFilteredEmails(initialEmails);
    setTimeout(() => setLoaded(true), 100);

    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshEmails();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generateDynamicEmails, autoRefresh, refreshEmails]);

  // Enhanced filtering with real-time updates
  useEffect(() => {
    let filtered = emails;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(email => 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(email => email.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    // Apply date filter with enhanced options
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          filterDate.setDate(now.getDate() - 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'unread':
          filtered = filtered.filter(email => !email.isRead);
          break;
        case 'sla_breach':
          filtered = filtered.filter(email => email.slaStatus === 'breach');
          break;
        default:
          break;
      }
      
      if (dateFilter !== 'all' && dateFilter !== 'unread' && dateFilter !== 'sla_breach') {
        filtered = filtered.filter(email => 
          new Date(email.dateReceived) >= filterDate
        );
      }
    }

    // Apply due date filter
    if (dueDateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dueDateFilter) {
        case 'current':
          // Due within next 30 days
          const next30Days = new Date(today);
          next30Days.setDate(today.getDate() + 30);
          filtered = filtered.filter(email => {
            if (!email.dueDate) return false;
            const dueDate = new Date(email.dueDate);
            return dueDate >= today && dueDate <= next30Days;
          });
          break;
        case 'due':
          // Due today or within next 7 days
          const next7Days = new Date(today);
          next7Days.setDate(today.getDate() + 7);
          filtered = filtered.filter(email => {
            if (!email.dueDate) return false;
            const dueDate = new Date(email.dueDate);
            return dueDate >= today && dueDate <= next7Days;
          });
          break;
        case 'overdue':
          // Past due date
          filtered = filtered.filter(email => {
            if (!email.dueDate) return false;
            const dueDate = new Date(email.dueDate);
            return dueDate < today;
          });
          break;
        case 'custom':
          // Custom date range
          if (customDateRange.start && customDateRange.end) {
            const startDate = new Date(customDateRange.start);
            const endDate = new Date(customDateRange.end);
            filtered = filtered.filter(email => {
              if (!email.dueDate) return false;
              const dueDate = new Date(email.dueDate);
              return dueDate >= startDate && dueDate <= endDate;
            });
          }
          break;
        default:
          break;
      }
    }

    setFilteredEmails(filtered);
    setPage(1); // Reset to first page when filters change
  }, [emails, searchTerm, categoryFilter, statusFilter, dateFilter, dueDateFilter, customDateRange]);

  // Update bulk actions visibility when selection changes
  useEffect(() => {
    // Bulk actions logic can be added here if needed
  }, [selectedEmails]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    refreshEmails();
  };

  // Toggle auto-refresh
  const handleToggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
    showNotification(`Auto-refresh ${!autoRefresh ? 'enabled' : 'disabled'}`, 'info');
  };

  // Enhanced mark as read with real-time update
  const markAsRead = (emailId) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
    showNotification('Email marked as read', 'success');
  };



  // Removed unused handleSort function

  // Apply sorting to filtered emails
  const sortedEmails = React.useMemo(() => {
    const sortableEmails = [...filteredEmails];
    if (sortConfig.key) {
      sortableEmails.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (sortConfig.key === 'dateReceived') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmails;
  }, [filteredEmails, sortConfig]);

  // Removed unused SLATimeRemaining component

  // Removed unused getCategoryColor and getStatusColor functions


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedEmails.length === paginatedEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(paginatedEmails.map(email => email.id));
    }
  };

  const handleSelectEmail = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  // Action handlers
  const handleViewEmail = (emailId) => {
    markAsRead(emailId);
    navigate(`/emails/detail/${emailId}`);
  };

  // Removed unused legacy functions:
  // - handleReplyEmail, handleConfirmReply
  // - handleAssignEmail, handleConfirmAssign  
  // - handleMarkAsResolved, handleConfirmReclassify
  // - handleArchiveEmail, handleExportEmails
  // - handleUseTemplate, handleAddTemplate
  // - handleEditTemplate, handleSaveTemplate
  // - handleDeleteTemplate, getAllTemplates



  const paginatedEmails = sortedEmails.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Removed unused processTemplate function

  // Template management states
  const [templateManagementDialog, setTemplateManagementDialog] = useState(false);
  const [createTemplateDialog, setCreateTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateForEmail, setTemplateForEmail] = useState(null); // Track which email to apply template to
  const [templateStep, setTemplateStep] = useState(0);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email',
    category: 'general',
    subject: '',
    content: '',
    variables: [],
    tags: [],
    status: 'draft'
  });
  const [templates, setTemplates] = useState([
    {
      id: 'acknowledgment',
      name: 'Acknowledgment',
      category: 'general',
      subject: 'Re: {{subject}}',
      content: `Dear {{customerName}},

Thank you for contacting us. We have received your email regarding {{subject}} and want to assure you that we are reviewing your request.

Our team will respond to your inquiry within 24 hours during business hours. If this is an urgent matter, please call our customer service line at (555) 123-4567.

We appreciate your patience and look forward to assisting you.

Best regards,
Customer Support Team
Renew-iQ Insurance`,
      variables: ['customerName', 'subject'],
      tags: ['general', 'acknowledgment'],
      status: 'active',
      usage: 45
    },
    {
      id: 'complaint_response',
      name: 'Complaint Response',
      category: 'complaint',
      subject: 'Re: {{subject}} - We\'re Here to Help',
      content: `Dear {{customerName}},

Thank you for bringing this matter to our attention. We sincerely apologize for any inconvenience you have experienced.

Your concern is important to us, and we are committed to resolving this issue promptly. A senior customer service representative will review your case and contact you within 4 hours.

In the meantime, if you have any additional information that might help us resolve this matter, please don't hesitate to share it with us.

We value your business and appreciate your patience as we work to make this right.

Sincerely,
Customer Care Team
Renew-iQ Insurance`,
      variables: ['customerName', 'subject'],
      tags: ['complaint', 'response'],
      status: 'active',
      usage: 32
    }
  ]);

  // Template management functions
  const handleOpenTemplateManagement = () => {
    setTemplateManagementDialog(true);
  };

  const handleCreateTemplate = () => {
    setNewTemplate({
      name: '',
      type: 'email',
      category: 'general',
      subject: '',
      content: '',
      variables: [],
      tags: [],
      status: 'draft'
    });
    setTemplateStep(0);
    setCreateTemplateDialog(true);
  };

  const extractVariables = (content) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const handleSaveTemplate = () => {
    const variables = extractVariables(newTemplate.content);
    const template = {
      ...newTemplate,
      variables,
      id: selectedTemplate ? selectedTemplate.id : `template_${Date.now()}`,
      usage: selectedTemplate ? selectedTemplate.usage : 0,
      createdBy: 'Current User',
      lastModified: new Date().toISOString().split('T')[0]
    };

    if (selectedTemplate) {
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? template : t));
    } else {
      setTemplates(prev => [...prev, template]);
    }

    setCreateTemplateDialog(false);
    setSelectedTemplate(null);
    showNotification('Template saved successfully', 'success');
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setNewTemplate({ ...template });
    setTemplateStep(0);
    setCreateTemplateDialog(true);
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    showNotification('Template deleted successfully', 'success');
  };

  const handleUseTemplate = (template, emailId) => {
    const email = emails.find(e => e.id === emailId);
    if (email && template) {
      const processedTemplate = processTemplate(template, email);
      // Open compose dialog with template content
      setComposeDialog({
        open: true,
        emailId: emailId,
        subject: processedTemplate.subject,
        body: processedTemplate.content,
        templateUsed: template.name
      });
      markAsRead(emailId);
      showNotification(`Template "${template.name}" applied`, 'success');
    }
  };

  const processTemplate = (template, email, additionalVars = {}) => {
    let processedSubject = template.subject || '';
    let processedContent = template.content || '';
    
    const variables = {
      customerName: email.from.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      subject: email.subject,
      date: new Date().toLocaleDateString(),
      agentName: 'Customer Support',
      companyName: 'Renew-iQ Insurance',
      ...additionalVars
    };
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedSubject = processedSubject.replace(regex, value);
      processedContent = processedContent.replace(regex, value);
    });
    
    return { subject: processedSubject, content: processedContent };
  };

  // Bulk action handlers
  const handleBulkAssign = () => {
    // Implementation for bulk assign functionality
    showNotification(`Bulk assign functionality for ${selectedEmails.length} emails - to be implemented`, 'info');
  };

  const handleBulkMarkResolved = () => {
    // Mark selected emails as resolved
    setEmails(prev => prev.map(email => 
      selectedEmails.includes(email.id) 
        ? { ...email, status: 'resolved' }
        : email
    ));
    showNotification(`${selectedEmails.length} email(s) marked as resolved`);
    setSelectedEmails([]);
  };

  const handleBulkFlag = () => {
    // Flag selected emails for follow-up
    setEmails(prev => prev.map(email => 
      selectedEmails.includes(email.id) 
        ? { ...email, flagged: true, priority: 'high' }
        : email
    ));
    showNotification(`${selectedEmails.length} email(s) flagged for follow-up`);
    setSelectedEmails([]);
  };

  const handleBulkExport = () => {
    // Export selected emails
    const selectedEmailsData = emails.filter(email => selectedEmails.includes(email.id));
    const exportData = selectedEmailsData.map(email => ({
      'Email ID': email.id,
      'From': email.from,
      'Subject': email.subject,
      'Category': email.category,
      'Status': email.status,
      'Priority': email.priority,
      'Date Received': formatDate(email.dateReceived),
      'Has Attachments': email.hasAttachments ? 'Yes' : 'No'
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `selected_emails_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showNotification(`Successfully exported ${selectedEmails.length} emails`);
    setSelectedEmails([]);
  };

  // New Outlook-style feature handlers
  const handleStarEmail = (emailId) => {
    setStarredEmails(prev => {
      const newStarred = new Set(prev);
      if (newStarred.has(emailId)) {
        newStarred.delete(emailId);
      } else {
        newStarred.add(emailId);
      }
      return newStarred;
    });
    showNotification(`Email ${starredEmails.has(emailId) ? 'unstarred' : 'starred'}`, 'success');
  };

  const handleFindRelatedEmails = (email) => {
    // Find emails from same sender or with similar subject
    const related = emails.filter(e => 
      e.id !== email.id && (
        e.from === email.from || 
        e.subject.toLowerCase().includes(email.subject.toLowerCase().split(' ')[0]) ||
        e.content.toLowerCase().includes(email.from.split('@')[0].toLowerCase())
      )
    );
    setRelatedEmailsDialog({ open: true, email, relatedEmails: related });
  };

  const handleSenderFilter = (sender) => {
    setSenderFilterDialog({ open: true, sender });
    // Apply sender filter
    setSearchTerm(`from:${sender}`);
  };

  const handleMoveToFolder = (emailIds, folderId) => {
    setEmails(prev => prev.map(email => 
      emailIds.includes(email.id) 
        ? { ...email, folder: folderId, isJunk: folderId === 'junk', isSpam: folderId === 'spam' }
        : email
    ));
    
    const folderName = [...emailFolders, ...customFolders].find(f => f.id === folderId)?.name || folderId;
    showNotification(`Moved ${emailIds.length} email(s) to ${folderName}`, 'success');
    setSelectedEmails([]);
  };

  const handleMarkAsJunk = (emailIds) => {
    handleMoveToFolder(emailIds, 'junk');
    // Auto-create rule to move future emails from same sender to junk
    const email = emails.find(e => emailIds.includes(e.id));
    if (email) {
      const newRule = {
        id: Date.now(),
        name: `Auto-Junk: ${email.from}`,
        enabled: true,
        conditions: [{ field: 'from', operator: 'equals', value: email.from }],
        actions: [{ type: 'move_to_folder', folder: 'junk' }]
      };
      setEmailRules(prev => [...prev, newRule]);
    }
  };

  const handleMarkAsSpam = (emailIds) => {
    handleMoveToFolder(emailIds, 'spam');
    // Report to spam detection system
    showNotification('Emails marked as spam and reported', 'success');
  };

  const handleSetCustomerCategory = (emailId, category) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      setCustomerCategories(prev => ({
        ...prev,
        [email.from]: category
      }));
      showNotification(`Customer categorized as ${category.toUpperCase()}`, 'success');
    }
  };

  const handleCreateFolder = (folderName) => {
    const newFolder = {
      id: folderName.toLowerCase().replace(/\s+/g, '_'),
      name: folderName,
      icon: 'folder',
      count: 0
    };
    setCustomFolders(prev => [...prev, newFolder]);
    setNewFolderDialog({ open: false });
    showNotification(`Folder "${folderName}" created successfully`, 'success');
  };

  const handleComposeNew = () => {
    setComposeDialog({ open: true, mode: 'new', replyTo: null, forwardFrom: null });
  };

  const handleReplyWithThread = (email) => {
    setComposeDialog({ 
      open: true, 
      mode: 'reply', 
      replyTo: email, 
      forwardFrom: null 
    });
  };

  const handleForwardWithThread = (email) => {
    setComposeDialog({ 
      open: true, 
      mode: 'forward', 
      replyTo: null, 
      forwardFrom: email 
    });
  };

  const handleViewAuditTrail = (emailId) => {
    setAuditTrailDialog({ open: true, emailId });
  };

  const getCustomerCategoryColor = (email) => {
    const category = customerCategories[email.from] || 'normal';
    const categoryOption = customerCategoryOptions.find(c => c.value === category);
    return categoryOption ? categoryOption.color : 'default';
  };

  const getCustomerCategoryIcon = (email) => {
    const category = customerCategories[email.from] || 'normal';
    const categoryOption = customerCategoryOptions.find(c => c.value === category);
    return categoryOption ? categoryOption.icon : PersonIcon;
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
        {/* Sidebar */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100%',
              borderRadius: 3,
              mr: 2,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* New Email Button */}
            <Button
              fullWidth
              variant="contained"
              startIcon={<CreateIcon />}
              onClick={handleComposeNew}
              sx={{
                mb: 3,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}
            >
              New Email
            </Button>

            {/* System Folders */}
            <Typography variant="overline" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
              Folders
            </Typography>
            <List dense>
              {emailFolders.map((folder) => (
                <ListItemButton
                  key={folder.id}
                  selected={currentFolder === folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {folder.icon === 'inbox' && <EmailIcon />}
                    {folder.icon === 'star' && <StarIcon />}
                    {folder.icon === 'send' && <ReplyIcon />}
                    {folder.icon === 'drafts' && <EditIcon />}
                    {folder.icon === 'block' && <BlockIcon />}
                    {folder.icon === 'warning' && <SpamIcon />}
                    {folder.icon === 'archive' && <ArchiveIcon />}
                    {folder.icon === 'delete' && <DeleteIcon />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={folder.name}
                    secondary={folder.count > 0 ? folder.count : null}
                  />
                  {folder.count > 0 && (
                    <Badge badgeContent={folder.count} color="primary" />
                  )}
                </ListItemButton>
              ))}
            </List>

            {/* Custom Folders */}
            <Accordion sx={{ mt: 2, boxShadow: 'none', bgcolor: 'transparent' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Custom Folders
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <List dense>
                  {customFolders.map((folder) => (
                    <ListItemButton
                      key={folder.id}
                      selected={currentFolder === folder.id}
                      onClick={() => setCurrentFolder(folder.id)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&.Mui-selected': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={folder.name}
                        secondary={folder.count > 0 ? folder.count : null}
                      />
                    </ListItemButton>
                  ))}
                  <ListItemButton
                    onClick={() => setNewFolderDialog({ open: true })}
                    sx={{ borderRadius: 2, color: theme.palette.primary.main }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="New Folder" />
                  </ListItemButton>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Quick Actions */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="overline" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <List dense>
                <ListItemButton onClick={() => setRulesDialog({ open: true })} sx={{ borderRadius: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <RuleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Rules" />
                </ListItemButton>
              </List>
            </Box>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, px: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
            mb: 3
        }}>
          <Box>
            <Typography variant="h4" fontWeight="600">
                {emailFolders.find(f => f.id === currentFolder)?.name || 'Email Inbox'}
              {newEmailsCount > 0 && (
                <Badge 
                  badgeContent={newEmailsCount} 
                  color="primary" 
                  sx={{ ml: 2 }}
                  onClick={() => setNewEmailsCount(0)}
                />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {filteredEmails.length} emails found
              {selectedEmails.length > 0 && ` • ${selectedEmails.length} selected`}
              {isRefreshing && (
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                  <CircularProgress size={12} sx={{ mr: 0.5 }} />
                  Refreshing...
                </Box>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString()} 
              {autoRefresh && ' • Auto-refresh enabled'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}>
              <IconButton
                onClick={handleToggleAutoRefresh}
                color={autoRefresh ? 'primary' : 'default'}
                sx={{ 
                  bgcolor: autoRefresh ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': { 
                    bgcolor: autoRefresh ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.hover, 0.1)
                  }
                }}
              >
                <ScheduleIcon />
              </IconButton>
            </Tooltip>

            {/* Automation button removed - functionality not implemented */}
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={handleOpenTemplateManagement}
              sx={{ 
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              Templates
            </Button>
            <Button
              startIcon={isRefreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
              variant="outlined"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              sx={{ borderRadius: 2 }}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Box>

          {/* Enhanced Email Content Area */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Search and Filters */}
        <Grow in={loaded} timeout={400}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                    placeholder="Search emails or use 'from:sender@domain.com' for specific senders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                    sx={{ minWidth: 350, flex: 1 }}
              />
              
              <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Customer Type</InputLabel>
                <Select
                  value={categoryFilter}
                      label="Customer Type"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                      <MenuItem value="all">All Customers</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="hni">HNI</MenuItem>
                      <MenuItem value="super_hni">Super HNI</MenuItem>
                      <MenuItem value="vip">VIP</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>

                  <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={dateFilter}
                  label="Filter"
                  onChange={(e) => setDateFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                      <MenuItem value="all">All Emails</MenuItem>
                      <MenuItem value="unread">Unread</MenuItem>
                      <MenuItem value="starred">Starred</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Due Status</InputLabel>
                <Select
                  value={dueDateFilter}
                  label="Due Status"
                  onChange={(e) => setDueDateFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Emails</MenuItem>
                  <MenuItem value="current">Current (30 days)</MenuItem>
                  <MenuItem value="due">Due Soon (7 days)</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>

              {dueDateFilter === 'custom' && (
                <>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 150 }}
                  />
                  <TextField
                    type="date"
                    label="End Date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 150 }}
                  />
                </>
              )}
            </Box>
          </Paper>
        </Grow>

        {/* Bulk Actions Toolbar */}
        {selectedEmails.length > 0 && (
          <Grow in={selectedEmails.length > 0} timeout={300}>
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
                    {selectedEmails.length} email(s) selected
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<PersonIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => handleBulkAssign()}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,118,255,0.35)',
                      }
                    }}
                  >
                    Bulk Assign
                  </Button>
                  <Button
                    startIcon={<CheckCircleIcon />}
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleBulkMarkResolved()}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(76,175,80,0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(76,175,80,0.35)',
                      }
                    }}
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    startIcon={<FlagIcon />}
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleBulkFlag()}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(255,152,0,0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(255,152,0,0.35)',
                      }
                    }}
                  >
                    Flag for Follow-Up
                  </Button>
                  <Button
                    startIcon={<GetAppIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => handleBulkExport()}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600
                    }}
                  >
                    Export Selected
                  </Button>
                  <Button
                    startIcon={<CloseIcon />}
                    variant="text"
                    size="small"
                    onClick={() => setSelectedEmails([])}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600,
                      color: theme.palette.error.main,
                      '&:hover': {
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

            {/* Enhanced Email Table with new features */}
        <Grow in={loaded} timeout={600}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
          >
                <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                        <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedEmails.length > 0 && selectedEmails.length < paginatedEmails.length}
                        checked={paginatedEmails.length > 0 && selectedEmails.length === paginatedEmails.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                        <TableCell sx={{ width: 50 }}>Star</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Customer Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                      {paginatedEmails.map((email) => {
                        const CustomerIcon = getCustomerCategoryIcon(email);
                        return (
                    <TableRow 
                      key={email.id}
                      selected={selectedEmails.includes(email.id)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.primary.main, 0.04) 
                        },
                        ...(email.isRead ? {} : {
                          bgcolor: alpha(theme.palette.info.main, 0.02),
                          borderLeft: `4px solid ${theme.palette.info.main}`,
                        }),
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEmails.includes(email.id)}
                          onChange={() => handleSelectEmail(email.id)}
                        />
                      </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleStarEmail(email.id)}
                                color={starredEmails.has(email.id) ? 'warning' : 'default'}
                              >
                                {starredEmails.has(email.id) ? <StarIcon /> : <StarBorderIcon />}
                              </IconButton>
                            </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CustomerIcon 
                              sx={{ 
                                    fontSize: 16, 
                                    color: getCustomerCategoryColor(email) === 'default' 
                                      ? theme.palette.text.secondary 
                                      : theme.palette[getCustomerCategoryColor(email)].main 
                                  }} 
                                />
                          <Typography 
                            variant="body2" 
                            fontWeight={email.isRead ? 400 : 600}
                            sx={{ 
                              color: email.isRead ? 'text.primary' : theme.palette.info.main 
                            }}
                          >
                            {email.from}
                          </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleSenderFilter(email.from)}
                                  sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                                >
                                  <FilterListIcon fontSize="small" />
                                </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={email.isRead ? 400 : 600}
                            sx={{ 
                              maxWidth: 300,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {email.subject}
                          </Typography>
                          {email.hasAttachments && (
                            <AttachmentIcon fontSize="small" color="action" />
                          )}
                                <IconButton
                                  size="small"
                                  onClick={() => handleFindRelatedEmails(email)}
                                  sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                                >
                                  <FindRelatedIcon fontSize="small" />
                                </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                                label={customerCategories[email.from] || 'Normal'} 
                                color={getCustomerCategoryColor(email)}
                          size="small"
                                sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(email.dateReceived)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {email.dueDate ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="body2" 
                              color={
                                new Date(email.dueDate) < new Date() ? 'error.main' :
                                new Date(email.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'warning.main' :
                                'text.secondary'
                              }
                              sx={{ fontWeight: new Date(email.dueDate) < new Date() ? 600 : 400 }}
                            >
                              {formatDate(email.dueDate)}
                            </Typography>
                            {new Date(email.dueDate) < new Date() && (
                              <Chip 
                                label="OVERDUE" 
                                size="small" 
                                color="error" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            )}
                            {new Date(email.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
                             new Date(email.dueDate) >= new Date() && (
                              <Chip 
                                label="DUE SOON" 
                                size="small" 
                                color="warning" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            No due date
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewEmail(email.id)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reply">
                            <IconButton 
                              size="small"
                                    onClick={() => handleReplyWithThread(email)}
                            >
                              <ReplyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                                <Tooltip title="Forward">
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleForwardWithThread(email)}
                                  >
                                    <ForwardIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                          <Tooltip title="More Actions">
                            <IconButton 
                              size="small"
                              onClick={(e) => setActionMenus({ ...actionMenus, [email.id]: e.currentTarget })}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                                
                                {/* Enhanced Action Menu */}
                          <Menu
                            anchorEl={actionMenus[email.id]}
                            open={Boolean(actionMenus[email.id])}
                            onClose={() => setActionMenus({ ...actionMenus, [email.id]: null })}
                          >
                            <MenuItem onClick={() => {
                                    handleFindRelatedEmails(email);
                              setActionMenus({ ...actionMenus, [email.id]: null });
                            }}>
                                    <ListItemIcon><FindRelatedIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Find Related Emails</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => {
                              setActionMenus({ ...actionMenus, [email.id]: null });
                              setTemplateForEmail(email);
                              setTemplateManagementDialog(true);
                            }}>
                              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                              <ListItemText>Use Template</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                    handleMarkAsJunk([email.id]);
                              setActionMenus({ ...actionMenus, [email.id]: null });
                            }}>
                                    <ListItemIcon><BlockIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Mark as Junk</ListItemText>
                            </MenuItem>
                                  <MenuItem onClick={() => {
                                    handleMarkAsSpam([email.id]);
                                setActionMenus({ ...actionMenus, [email.id]: null });
                                  }}>
                                    <ListItemIcon><SpamIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Mark as Spam</ListItemText>
                            </MenuItem>
                                  <MenuItem onClick={() => {
                                    handleViewAuditTrail(email.id);
                                setActionMenus({ ...actionMenus, [email.id]: null });
                                  }}>
                                    <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>View Audit Trail</ListItemText>
                            </MenuItem>
                                  <Divider />
                                  <MenuItem>
                                    <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
                                    <ListItemText>Set Customer Category</ListItemText>
                                  </MenuItem>
                                  {customerCategoryOptions.map((category) => (
                            <MenuItem 
                                      key={category.value}
                                      sx={{ pl: 4 }}
                              onClick={() => {
                                        handleSetCustomerCategory(email.id, category.value);
                                setActionMenus({ ...actionMenus, [email.id]: null });
                              }}
                            >
                              <ListItemIcon>
                                        <category.icon fontSize="small" />
                              </ListItemIcon>
                                      <ListItemText>{category.label}</ListItemText>
                            </MenuItem>
                                  ))}
                          </Menu>
                        </Box>
                      </TableCell>
                    </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={Math.ceil(filteredEmails.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Paper>
        </Grow>

            {/* Floating Action Button for New Email */}
            <SpeedDial
              ariaLabel="Email Actions"
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
            >
              <SpeedDialAction
                icon={<CreateIcon />}
                tooltipTitle="New Email"
                onClick={handleComposeNew}
              />
              <SpeedDialAction
                icon={<RuleIcon />}
                tooltipTitle="Manage Rules"
                onClick={() => setRulesDialog({ open: true })}
              />
              <SpeedDialAction
                icon={<FolderIcon />}
                tooltipTitle="New Folder"
                onClick={() => setNewFolderDialog({ open: true })}
              />
            </SpeedDial>
                    </Box>
                </Box>

        {/* New Outlook-style Dialogs */}
        
        {/* Related Emails Dialog */}
        <Dialog 
          open={relatedEmailsDialog.open}
          onClose={() => setRelatedEmailsDialog({ open: false, email: null, relatedEmails: [] })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Related Emails
            {relatedEmailsDialog.email && (
            <Typography variant="body2" color="text.secondary">
                Emails related to: {relatedEmailsDialog.email.from}
            </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <List>
              {relatedEmailsDialog.relatedEmails.map((email) => (
                <ListItem key={email.id} divider>
                  <ListItemText
                    primary={email.subject}
                    secondary={`From: ${email.from} • ${formatDate(email.dateReceived)}`}
                  />
                  <Button
                          size="small"
                    onClick={() => {
                      handleViewEmail(email.id);
                      setRelatedEmailsDialog({ open: false, email: null, relatedEmails: [] });
                    }}
                  >
                    View
                  </Button>
                </ListItem>
              ))}
              {relatedEmailsDialog.relatedEmails.length === 0 && (
                <ListItem>
                  <ListItemText primary="No related emails found" />
                </ListItem>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRelatedEmailsDialog({ open: false, email: null, relatedEmails: [] })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* New Folder Dialog */}
        <Dialog 
          open={newFolderDialog.open}
          onClose={() => setNewFolderDialog({ open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Folder Name"
              fullWidth
              variant="outlined"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleCreateFolder(e.target.value.trim());
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewFolderDialog({ open: false })}>Cancel</Button>
            <Button 
              onClick={(e) => {
                const input = e.target.closest('.MuiDialog-root').querySelector('input');
                if (input?.value.trim()) {
                  handleCreateFolder(input.value.trim());
                }
              }}
              variant="contained"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rules Management Dialog */}
        <Dialog 
          open={rulesDialog.open}
          onClose={() => setRulesDialog({ open: false })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Email Rules Management</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Manage automatic email processing rules similar to Outlook
                </Typography>
            <List>
              {emailRules.map((rule) => (
                <ListItem key={rule.id} divider>
                  <ListItemText
                    primary={rule.name}
                    secondary={`${rule.conditions.length} condition(s) • ${rule.actions.length} action(s)`}
                  />
                        <Switch 
                    checked={rule.enabled}
                              onChange={(e) => {
                      setEmailRules(prev => prev.map(r => 
                        r.id === rule.id ? { ...r, enabled: e.target.checked } : r
                      ));
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRulesDialog({ open: false })}>Close</Button>
            <Button variant="contained">Add New Rule</Button>
          </DialogActions>
        </Dialog>

        {/* Audit Trail Dialog */}
        <Dialog 
          open={auditTrailDialog.open}
          onClose={() => setAuditTrailDialog({ open: false, emailId: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Email Audit Trail</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Complete history of actions performed on this email thread
                </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email Received"
                  secondary="System • 2 hours ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Viewed by John Doe"
                  secondary="User Action • 1 hour ago"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Starred by John Doe"
                  secondary="User Action • 45 minutes ago"
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAuditTrailDialog({ open: false, emailId: null })}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Compose Dialog */}
        <Dialog 
          open={composeDialog.open}
          onClose={() => setComposeDialog({ open: false, mode: 'new', replyTo: null, forwardFrom: null })}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            {composeDialog.mode === 'new' && 'New Email'}
            {composeDialog.mode === 'reply' && `Reply to: ${composeDialog.replyTo?.subject}`}
            {composeDialog.mode === 'forward' && `Forward: ${composeDialog.forwardFrom?.subject}`}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="To" fullWidth />
              <TextField label="Subject" fullWidth />
              <TextField
                label="Message"
                fullWidth
                multiline
                rows={10}
                placeholder="Type your message here..."
              />
              {(composeDialog.mode === 'reply' || composeDialog.mode === 'forward') && (
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Include email thread"
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComposeDialog({ open: false, mode: 'new', replyTo: null, forwardFrom: null })}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<CreateIcon />}>
              Send
            </Button>
          </DialogActions>
        </Dialog>

        {/* Template Management Dialog */}
        <Dialog 
          open={templateManagementDialog}
          onClose={() => setTemplateManagementDialog(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, minHeight: '80vh' } }}
        >
          <DialogTitle sx={{ 
            fontWeight: 600, 
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Template Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create and manage email templates for quick responses
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={handleCreateTemplate}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                Create Template
              </Button>
              <IconButton onClick={() => setTemplateManagementDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ minHeight: '400px' }}>
            <Grid container spacing={2}>
              {templates.map((template) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            {template.name}
                          </Typography>
                          <Chip 
                            label={template.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                                                 <Box sx={{ display: 'flex', gap: 0.5 }}>
                           <Tooltip title="Use Template">
                             <IconButton 
                               size="small"
                               color="primary"
                               onClick={() => {
                                 if (templateForEmail) {
                                   handleUseTemplate(template, templateForEmail.id);
                                   setTemplateManagementDialog(false);
                                   setTemplateForEmail(null);
                                 } else {
                                   showNotification(`Template "${template.name}" ready to use - select an email from the action menu first`, 'info');
                                 }
                               }}
                             >
                               <CheckCircleIcon fontSize="small" />
                             </IconButton>
                           </Tooltip>
                           <Tooltip title="Edit Template">
                             <IconButton 
                               size="small"
                               onClick={() => handleEditTemplate(template)}
                             >
                               <EditIcon fontSize="small" />
                             </IconButton>
                           </Tooltip>
                           <Tooltip title="Delete Template">
                             <IconButton 
                               size="small"
                               color="error"
                               onClick={() => handleDeleteTemplate(template.id)}
                             >
                               <DeleteIcon fontSize="small" />
                             </IconButton>
                           </Tooltip>
                         </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Subject:</strong> {template.subject}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2
                        }}
                      >
                        {template.content}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Used {template.usage} times
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {template.variables.slice(0, 3).map((variable, index) => (
                            <Chip 
                              key={index}
                              label={variable}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {template.variables.length > 3 && (
                            <Chip 
                              label={`+${template.variables.length - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Template Dialog */}
        <Dialog 
          open={createTemplateDialog}
          onClose={() => setCreateTemplateDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, minHeight: '70vh' } }}
        >
          <DialogTitle sx={{ 
            fontWeight: 600, 
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {selectedTemplate ? 'Edit Template' : 'Create New Template'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {templateStep === 0 ? 'Template Information' : 'Template Content'}
              </Typography>
            </Box>
            <IconButton onClick={() => setCreateTemplateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ minHeight: '400px' }}>
            {templateStep === 0 ? (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Template Name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <MenuItem value="general">General</MenuItem>
                      <MenuItem value="complaint">Complaint</MenuItem>
                      <MenuItem value="inquiry">Inquiry</MenuItem>
                      <MenuItem value="renewal">Renewal</MenuItem>
                      <MenuItem value="welcome">Welcome</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject Line"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject (use {{variable}} for dynamic content)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Use double curly braces for variables: {`{{customerName}}, {{subject}}, {{date}}`}
                  </Alert>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    label="Template Content"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your email template content..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Detected Variables:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {extractVariables(newTemplate.content).map((variable, index) => (
                      <Chip 
                        key={index}
                        label={variable}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCreateTemplateDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveTemplate}
              disabled={!newTemplate.name || !newTemplate.content}
              startIcon={<SaveIcon />}
            >
              Save Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default EmailInbox; 