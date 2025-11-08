import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Tabs, Tab, List, ListItem, ListItemText, ListItemIcon, Divider,
  useTheme, Fade, Grow, IconButton, Tooltip, Avatar, Badge,
  Paper, Switch, FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Toolbar,
  Checkbox
} from '@mui/material';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';
import { alpha } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon, Inbox as InboxIcon, Campaign as CampaignIcon,
  TableChart as ResponsesIcon, Analytics as AnalyticsIcon,
  People as PeopleIcon, Send as SendIcon, AutoMode as AutomationIcon,
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Visibility as ViewIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  Star as StarIcon, ThumbDown as ThumbDownIcon,
  Flag as FlagIcon, CheckCircle as CheckCircleIcon,
  Email as EmailIcon, Sms as SmsIcon, WhatsApp as WhatsAppIcon,
  Refresh as RefreshIcon,
  GetApp as GetAppIcon, Close as CloseIcon,
  SentimentSatisfied as SentimentSatisfiedIcon, SentimentDissatisfied as SentimentDissatisfiedIcon,
  SentimentNeutral as SentimentNeutralIcon, Assignment as SurveyIcon,
  Category as CategoryIcon, SentimentSatisfied as SentimentIcon,
  AttachFile as AttachFileIcon, Phone as PhoneIcon, Web as WebIcon,
  Person as PersonIcon, CalendarToday as CalendarIcon, MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Comment as CommentIcon, History as HistoryIcon,
  Archive as ArchiveIcon, Reply as ReplyIcon, PersonAdd as AssignIcon
} from '@mui/icons-material';

const Feedback = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [createSurveyDialog, setCreateSurveyDialog] = useState(false);
  const [surveyTabIndex, setSurveyTabIndex] = useState(0);
  const [feedbackDetailDialog, setFeedbackDetailDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyDialog, setReplyDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);

  const [dateRangeDialog, setDateRangeDialog] = useState(false);

  
  // Form states
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [statusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState([]);
  const [bulkActionsVisible, setBulkActionsVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');
  const [feedbackDetailOpen, setFeedbackDetailOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);
  
  // Publish form state removed (unused)
  
  // Survey form states
  const [surveyForm, setSurveyForm] = useState({
    name: '',
    type: 'CSAT',
    description: '',
    targetResponses: 100,
    channels: [],
    questions: [],
    campaignMode: 'one-time',
    audience: '',
    triggerEvent: '',
    schedule: {
      startDate: '',
      endDate: '',
      frequency: 'once',
      reminderDays: 3
    },
    branding: {
      logo: true,
      colors: 'default',
      customTheme: false
    }
  });

  // Mock data
  const [dashboardStats] = useState({
    overallSatisfaction: 4.2,
    npsScore: 42,
    totalFeedback: 1247,
    unaddressed: 23,
    negativeFeedback: 45,
    flaggedFeedback: 12,
    surveyCompletionRate: 78.5,
    sentimentScore: 82,
    recentTrends: {
      satisfaction: 2.3,
      feedback: 15.2,
      completion: -3.1
    }
  });

  // Additional feedback dashboard data
  const [feedbackTrends] = useState([
    { name: 'Mon', satisfaction: 4.1, nps: 65, responses: 45 },
    { name: 'Tue', satisfaction: 4.3, nps: 68, responses: 52 },
    { name: 'Wed', satisfaction: 4.2, nps: 67, responses: 38 },
    { name: 'Thu', satisfaction: 4.4, nps: 71, responses: 61 },
    { name: 'Fri', satisfaction: 4.1, nps: 64, responses: 43 },
    { name: 'Sat', satisfaction: 4.5, nps: 73, responses: 29 },
    { name: 'Sun', satisfaction: 4.3, nps: 69, responses: 31 },
  ]);

  const [feedbackCategories] = useState([
    { name: 'Service Quality', value: 45, color: theme.palette.primary.main },
    { name: 'Response Time', value: 28, color: theme.palette.warning.main },
    { name: 'Policy Information', value: 18, color: theme.palette.info.main },
    { name: 'Pricing', value: 9, color: theme.palette.success.main }
  ]);

  const [sentimentData] = useState([
    { name: 'Positive', value: 68, color: '#4caf50' },
    { name: 'Neutral', value: 22, color: '#ff9800' },
    { name: 'Negative', value: 10, color: '#f44336' }
  ]);

  const [recentFeedback] = useState([
    {
      id: 1,
              customer: 'Arjun Sharma',
      customerEmail: 'john.smith@email.com',
      customerPhone: '+1234567890',
      rating: 5,
      category: 'Service Quality',
      message: 'Excellent service! Very satisfied with the claim process. The agent was professional and resolved my issue quickly.',
      fullMessage: 'Excellent service! Very satisfied with the claim process. The agent was professional and resolved my issue quickly. I would definitely recommend this service to others.',
      date: '2024-12-28T10:30:00Z',
      status: 'resolved',
      sentiment: 'positive',
      channel: 'email',
      flagged: false,
      hasAttachments: false,
      assignedTo: 'Alice Cooper',
      tags: ['Appreciation', 'Claims'],
      priority: 'low',
      responseTime: '2 hours',
      location: 'New York, USA'
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+1234567891',
      rating: 2,
      category: 'Response Time',
      message: 'Took too long to get a response. Very disappointed with the delay.',
      fullMessage: 'Took too long to get a response. Very disappointed with the delay. I waited over 48 hours for a simple inquiry response which is unacceptable.',
      date: '2024-12-28T14:15:00Z',
      status: 'unaddressed',
      sentiment: 'negative',
      channel: 'survey',
      flagged: true,
      hasAttachments: false,
      assignedTo: null,
      tags: ['Complaint', 'Response Time'],
      priority: 'high',
      responseTime: null,
      location: 'California, USA'
    },
    {
      id: 3,
      customer: 'Mike Davis',
      customerEmail: 'mike.davis@email.com',
      customerPhone: '+1234567892',
      rating: 4,
      category: 'Policy Information',
      message: 'Good information provided, but could be clearer in some areas.',
      fullMessage: 'Good information provided, but could be clearer in some areas. The policy documents are comprehensive but sometimes hard to understand for average customers.',
      date: '2024-12-27T16:45:00Z',
      status: 'in_progress',
      sentiment: 'positive',
      channel: 'whatsapp',
      flagged: false,
      hasAttachments: false,
      assignedTo: 'Bob Wilson',
      tags: ['Suggestion', 'Policy'],
      priority: 'medium',
      responseTime: '1 day',
      location: 'Texas, USA'
    },
    {
      id: 4,
      customer: 'Emma Wilson',
      customerEmail: 'emma.wilson@email.com',
      customerPhone: '+1234567893',
      rating: 1,
      category: 'Claims Process',
      message: 'Terrible experience. My claim was denied without proper explanation.',
      fullMessage: 'Terrible experience. My claim was denied without proper explanation. I have been a loyal customer for 10 years and this treatment is unacceptable. I am attaching all relevant documents for review.',
      date: '2024-12-27T11:30:00Z',
      status: 'unaddressed',
      sentiment: 'negative',
      channel: 'email',
      flagged: true,
      hasAttachments: true,
      attachments: [
        { name: 'claim_documents.pdf', size: '2.3MB', type: 'pdf' },
        { name: 'correspondence.pdf', size: '1.1MB', type: 'pdf' }
      ],
      assignedTo: null,
      tags: ['Complaint', 'Claims', 'Urgent'],
      priority: 'urgent',
      responseTime: null,
      location: 'Florida, USA'
    },
    {
      id: 5,
      customer: 'Robert Chen',
      customerEmail: 'robert.chen@email.com',
      customerPhone: '+1234567894',
      rating: 3,
      category: 'Service Quality',
      message: 'Average service. Could be better. Uploading screenshots of issues.',
      fullMessage: 'Average service. Could be better. Uploading screenshots of the issues I encountered with the mobile app. The interface is confusing and some features don\'t work properly.',
      date: '2024-12-26T09:20:00Z',
      status: 'in_progress',
      sentiment: 'neutral',
      channel: 'web',
      flagged: true,
      hasAttachments: true,
      attachments: [
        { name: 'screenshot1.png', size: '0.8MB', type: 'image' },
        { name: 'screenshot2.png', size: '1.2MB', type: 'image' }
      ],
      assignedTo: 'Carol Brown',
      tags: ['Bug Report', 'Mobile App'],
      priority: 'medium',
      responseTime: '6 hours',
      location: 'Washington, USA'
    },
    {
      id: 6,
      customer: 'Lisa Anderson',
      customerEmail: 'lisa.anderson@email.com',
      customerPhone: '+1234567895',
      rating: 2,
      category: 'Policy Information',
      message: 'Confusing policy terms. Need clarification urgently.',
      fullMessage: 'Confusing policy terms. Need clarification urgently. The renewal notice has terms that are different from my original policy and I need to understand what changed.',
      date: '2024-12-26T13:45:00Z',
      status: 'unaddressed',
      sentiment: 'negative',
      channel: 'phone',
      flagged: false,
      hasAttachments: false,
      assignedTo: null,
      tags: ['Policy', 'Clarification'],
      priority: 'high',
      responseTime: null,
      location: 'Illinois, USA'
    },
    {
      id: 7,
      customer: 'David Brown',
      customerEmail: 'david.brown@email.com',
      customerPhone: '+1234567896',
      rating: 5,
      category: 'Customer Support',
      message: 'Outstanding support from your team. Thank you!',
      fullMessage: 'Outstanding support from your team. Thank you! The representative was knowledgeable, patient, and went above and beyond to help me resolve my billing issue.',
      date: '2024-12-25T15:20:00Z',
      status: 'resolved',
      sentiment: 'positive',
      channel: 'email',
      flagged: false,
      hasAttachments: false,
      assignedTo: 'Alice Cooper',
      tags: ['Appreciation', 'Support'],
      priority: 'low',
      responseTime: '30 minutes',
      location: 'Georgia, USA'
    },
    {
      id: 8,
      customer: 'Maria Garcia',
      customerEmail: 'maria.garcia@email.com',
      customerPhone: '+1234567897',
      rating: 1,
      category: 'Billing',
      message: 'Billing error on my account. This needs immediate attention.',
      fullMessage: 'Billing error on my account. This needs immediate attention. I was charged twice for the same premium payment and need this resolved immediately.',
      date: '2024-12-25T08:10:00Z',
      status: 'unaddressed',
      sentiment: 'negative',
      channel: 'sms',
      flagged: true,
      hasAttachments: false,
      assignedTo: null,
      tags: ['Billing', 'Error', 'Urgent'],
      priority: 'urgent',
      responseTime: null,
      location: 'Arizona, USA'
    }
  ]);

  const [surveys, setSurveys] = useState([
    {
      id: 1,
      name: 'Customer Satisfaction Survey Q4',
      type: 'CSAT',
      status: 'active',
      responses: 342,
      targetResponses: 500,
      completionRate: 68.4,
      createdDate: '2024-12-15',
      endDate: '2024-12-31',
      channels: ['email', 'sms'],
      questions: [
        { id: 1, text: 'How satisfied are you with our service?', type: 'rating', required: true },
        { id: 2, text: 'What can we improve?', type: 'text', required: false }
      ]
    },
    {
      id: 2,
      name: 'NPS Survey - Policy Holders',
      type: 'NPS',
      status: 'draft',
      responses: 0,
      targetResponses: 1000,
      completionRate: 0,
      createdDate: '2024-12-20',
      endDate: '2025-01-15',
      channels: ['email'],
      questions: [
        { id: 1, text: 'How likely are you to recommend us?', type: 'nps', required: true }
      ]
    },
    {
      id: 3,
      name: 'Claims Experience Survey',
      type: 'CES',
      status: 'completed',
      responses: 156,
      targetResponses: 200,
      completionRate: 78.0,
      createdDate: '2024-11-01',
      endDate: '2024-11-30',
      channels: ['email', 'sms', 'whatsapp'],
      questions: [
        { id: 1, text: 'How easy was it to file your claim?', type: 'rating', required: true },
        { id: 2, text: 'How satisfied are you with the claim process?', type: 'rating', required: true }
      ]
    }
  ]);

  // Additional mock data

  const [agents] = useState([
    { id: 1, name: 'Alice Cooper', email: 'alice@company.com', department: 'Customer Service' },
    { id: 2, name: 'Bob Wilson', email: 'bob@company.com', department: 'Technical Support' },
    { id: 3, name: 'Carol Brown', email: 'carol@company.com', department: 'Sales' }
  ]);

  const [surveyResponses] = useState([
          { id: 1, surveyId: 1, respondent: 'Arjun Sharma', responses: { 1: 5, 2: 'Great service!' }, submittedAt: '2024-12-28' },
          { id: 2, surveyId: 1, respondent: 'Meera Kapoor', responses: { 1: 4, 2: 'Good overall' }, submittedAt: '2024-12-27' },
          { id: 3, surveyId: 3, respondent: 'Vikram Singh', responses: { 1: 5, 2: 5 }, submittedAt: '2024-11-25' }
  ]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);
  


  // Handler functions
  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackDetailDialog(true);
  };

  const handleReplyFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyDialog(true);
  };

  const handleAssignFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setAssignDialog(true);
  };

  const handleResolveFeedback = (_feedbackId) => {
    // Update feedback status to resolved
    // Resolving feedback
    // In real app, this would call an API
  };



  const handleSaveSurvey = () => {
    const newSurvey = {
      id: surveys.length + 1,
      ...surveyForm,
      status: 'draft',
      responses: 0,
      completionRate: 0,
      createdDate: new Date().toISOString().split('T')[0],
      endDate: surveyForm.schedule.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setSurveys([...surveys, newSurvey]);
    setCreateSurveyDialog(false);
    setSurveyTabIndex(0);
    setSurveyForm({
      name: '',
      type: 'CSAT',
      description: '',
      targetResponses: 100,
      channels: [],
      questions: [],
      campaignMode: 'one-time',
      audience: '',
      triggerEvent: '',
      anonymous: false,
      schedule: {
        startDate: '',
        endDate: '',
        frequency: 'once',
        reminderDays: 3
      },
      branding: {
        logo: true,
        colors: 'default',
        customTheme: false
      }
    });
  };

  const handleSendReply = () => {
    // Sending reply to customer
    setReplyDialog(false);
    setReplyText('');
    setSelectedFeedback(null);
  };

  const handleAssignAgent = () => {
    // Assigning agent to feedback
    setAssignDialog(false);
    setAssignedAgent('');
    setSelectedFeedback(null);
  };

  const handleExportData = (_format) => {

    // In real app, this would generate and download the file
  };

  const handleLaunchSurvey = (surveyId) => {
    setSurveys(surveys.map(survey => 
      survey.id === surveyId ? { ...survey, status: 'active' } : survey
    ));
  };

  const handlePauseSurvey = (surveyId) => {
    setSurveys(surveys.map(survey => 
      survey.id === surveyId ? { ...survey, status: 'paused' } : survey
    ));
  };

  const filteredFeedback = recentFeedback.filter(feedback => {
    const matchesSearch = feedback.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Main feedback filter
    let matchesFeedbackFilter = true;
    switch (feedbackFilter) {
      case 'all':
        matchesFeedbackFilter = true;
        break;
      case 'unaddressed':
        matchesFeedbackFilter = feedback.status === 'unaddressed';
        break;
      case 'negative':
        matchesFeedbackFilter = feedback.rating <= 2;
        break;
      case 'flagged':
        matchesFeedbackFilter = feedback.flagged === true;
        break;
      case 'attachments':
        matchesFeedbackFilter = feedback.hasAttachments === true;
        break;
      case 'resolved':
        matchesFeedbackFilter = feedback.status === 'resolved';
        break;
      default:
        matchesFeedbackFilter = true;
    }
    
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'negative' && feedback.rating <= 2) ||
                         (ratingFilter === 'neutral' && feedback.rating === 3) ||
                         (ratingFilter === 'positive' && feedback.rating >= 4);
    const matchesChannel = channelFilter === 'all' || feedback.channel === channelFilter;
    const matchesAssigned = assignedFilter === 'all' || 
                           (assignedFilter === 'unassigned' && !feedback.assignedTo) ||
                           feedback.assignedTo === assignedFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const feedbackDate = new Date(feedback.date);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include the entire end date
      matchesDateRange = feedbackDate >= fromDate && feedbackDate <= toDate;
    }
    
    return matchesSearch && matchesFeedbackFilter && matchesStatus && matchesRating && matchesChannel && matchesAssigned && matchesDateRange;
  });

  // StatCard component similar to Dashboard
  const StatCard = ({ title, value, color, icon, index, subtitle, trend, isCurrency }) => {
    const gradientFrom = alpha(color, theme.palette.mode === 'dark' ? 0.7 : 0.9);
    const gradientTo = alpha(color, theme.palette.mode === 'dark' ? 0.4 : 0.6);
    
    // Safe number conversion and formatting
    let displayValue = value;
    if (isCurrency) {
      // Ensure we have a valid number before formatting
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        displayValue = new Intl.NumberFormat('en-IN', { 
          style: 'currency', 
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numericValue);
      } else {
        displayValue = '₹0'; // Default fallback for NaN values
      }
    }
    
    return (
      <Grow in={loaded} timeout={(index + 1) * 200}>
        <Card 
          sx={{ 
            height: '100%', 
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
            borderRadius: 4,
            boxShadow: `0 10px 20px ${alpha(color, 0.2)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              opacity: 0.15,
              transform: 'rotate(25deg)',
              fontSize: '8rem'
            }}
          >
            {icon}
          </Box>
          <CardContent sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="h6" component="div" color="white" fontWeight="500" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" color="white" fontWeight="bold">
              {displayValue}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.9, color: 'white', mt: 1 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                {trend > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                <Typography variant="caption" sx={{ ml: 0.5, color: 'white' }}>
                  {trend > 0 ? '+' : ''}{trend}% from last month
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grow>
    );
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <SentimentSatisfiedIcon color="success" />;
      case 'negative': return <SentimentDissatisfiedIcon color="error" />;
      default: return <SentimentNeutralIcon color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'in_progress': return 'warning';
      case 'unaddressed': return 'error';
      default: return 'default';
    }
  };

  const getSurveyStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'completed': return 'info';
      case 'paused': return 'error';
      default: return 'default';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      case 'survey': return <SurveyIcon />;
      case 'phone': return <PhoneIcon />;
      case 'web': return <WebIcon />;
      default: return <InboxIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const handleSelectFeedback = (feedbackId) => {
    setSelectedFeedbackIds(prev => {
      const newSelection = prev.includes(feedbackId) 
        ? prev.filter(id => id !== feedbackId)
        : [...prev, feedbackId];
      setBulkActionsVisible(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAllFeedback = (checked) => {
    const newSelection = checked ? filteredFeedback.map(f => f.id) : [];
    setSelectedFeedbackIds(newSelection);
    setBulkActionsVisible(newSelection.length > 0);
  };

  const handleBulkAction = (_action) => {

    // In real app, this would call an API
    setSelectedFeedbackIds([]);
    setBulkActionsVisible(false);
  };

  const handleFlagFeedback = (_feedbackId) => {
    // Update feedback to flagged status

    // In real app, this would call an API to update the feedback flag status
    // You could update the local state here for immediate UI feedback
  };

  const handleActionMenuClick = useCallback((event, feedback) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Get the button's position
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Set position relative to the viewport
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.right - 200, // Align right edge of menu with right edge of button
    });
    
    setActiveMenu(feedback);
  }, []);

  const handleActionMenuClose = useCallback(() => {
    setActiveMenu(null);
    setMenuPosition(null);
  }, []);
  
  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleActionMenuClose();
      }
    };
    
    if (menuPosition) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuPosition, handleActionMenuClose]);

  const handleArchiveFeedback = (feedbackId) => {

    // In real app, this would call an API to archive the feedback
    handleActionMenuClose(feedbackId);
  };

  const handleDeleteFeedback = (feedbackId) => {

    // In real app, this would call an API to delete the feedback
    handleActionMenuClose(feedbackId);
  };

  const [editFeedbackDialog, setEditFeedbackDialog] = useState({ open: false, feedback: null });
  const [editedFeedback, setEditedFeedback] = useState({});
  
  // Update recentFeedback state when editedFeedback changes
  useEffect(() => {
    if (editedFeedback.id) {

      // In a real app, this would update the state or call an API
    }
  }, [editedFeedback]);

  const handleEditFeedback = (feedbackId) => {
    const feedbackToEdit = recentFeedback.find(f => f.id === feedbackId);
    if (feedbackToEdit) {
      setEditFeedbackDialog({ open: true, feedback: feedbackToEdit });
      setEditedFeedback({ ...feedbackToEdit });
    }
    handleActionMenuClose();
  };
  
  const handleEditChange = (field, value) => {
    setEditedFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveFeedback = () => {
    // In a real app, this would save the feedback changes to the backend

    
    // Update the feedback in the local state
    // In a real app, this would update the state:
    // const updatedFeedback = recentFeedback.map(f => 
    //   f.id === editedFeedback.id ? editedFeedback : f
    // );
    // setRecentFeedback(updatedFeedback);

    
    // Close the dialog
    setEditFeedbackDialog({ open: false, feedback: null });
    
    // Show success message (would use a proper notification in a real app)
    alert('Feedback updated successfully');
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feedback-tabpanel-${index}`}
      aria-labelledby={`feedback-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const DashboardTab = () => (
    <Box>
      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Overall Satisfaction"
            value={`${dashboardStats.overallSatisfaction}/5.0`}
            color="#ff6b35"
            icon={<StarIcon />}
            index={0}
            subtitle="CSAT Score"
            trend={dashboardStats.recentTrends.satisfaction}
            isCurrency={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="NPS Score"
            value={dashboardStats.npsScore}
            color="#4caf50"
            icon={<TrendingUpIcon />}
            index={1}
            subtitle="Net Promoter Score"
            isCurrency={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Survey Completion Rate"
            value={`${dashboardStats.surveyCompletionRate}%`}
            color="#2196f3"
            icon={<SurveyIcon />}
            index={2}
            subtitle="Completion Rate"
            trend={dashboardStats.recentTrends.completion}
            isCurrency={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Total Feedback"
            value={dashboardStats.totalFeedback}
            color="#9c27b0"
            icon={<CategoryIcon />}
            index={3}
            subtitle="This Month"
            trend={dashboardStats.recentTrends.feedback}
            isCurrency={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Sentiment Score"
            value={`${dashboardStats.sentimentScore}%`}
            color="#00bcd4"
            icon={<SentimentIcon />}
            index={4}
            subtitle="AI Analysis"
            isCurrency={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Flagged Feedback"
            value={dashboardStats.flaggedFeedback}
            color="#ff5722"
            icon={<FlagIcon />}
            index={5}
            subtitle="Needs Attention"
            isCurrency={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            title="Negative Feedback"
            value={dashboardStats.negativeFeedback}
            color="#f44336"
            icon={<ThumbDownIcon />}
            index={6}
            subtitle="Requires Action"
            isCurrency={false}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Feedback Trends Chart */}
        <Grid item xs={12} md={6}>
          <Grow in={loaded} timeout={1000}>
            <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Recent Feedback Trends
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Satisfaction scores and NPS trends over time
              </Typography>
              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={feedbackTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      domain={[0, 5]} 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: theme.palette.divider }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        border: 'none'
                      }} 
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="satisfaction" 
                      stroke="#ff6b35" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Satisfaction Score"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="nps" 
                      stroke="#4caf50" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      name="NPS Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grow>
        </Grid>

        {/* Top Feedback Categories */}
        <Grid item xs={12} md={6}>
          <Grow in={loaded} timeout={1100}>
            <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Top Feedback Categories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Distribution of feedback by category
              </Typography>
              <Box sx={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Pie
                      data={feedbackCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      fontSize={12}
                    >
                      {feedbackCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        border: 'none'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grow>
        </Grid>

        {/* Sentiment Analysis Overview */}
        <Grid item xs={12} md={6}>
          <Grow in={loaded} timeout={1200}>
            <Paper sx={{ p: 3, height: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Sentiment Analysis Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                AI-powered sentiment breakdown of customer feedback
              </Typography>
              <Box sx={{ display: 'flex', height: 280, alignItems: 'center' }}>
                {/* Pie Chart */}
                <Box sx={{ width: '50%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ 
                          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff',
                          borderRadius: 8,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          border: 'none'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                {/* Legend and Stats */}
                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: 2 }}>
                  {sentimentData.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: item.color, 
                          borderRadius: '50%', 
                          mr: 1.5 
                        }} 
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="600" fontSize="0.875rem">
                          {item.name}
                        </Typography>
                        <Typography variant="h5" color={item.color} fontWeight="bold">
                          {item.value}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  
                  <Box sx={{ mt: 2, p: 1.5, backgroundColor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontSize="0.75rem">
                      Overall Sentiment Score
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {dashboardStats.sentimentScore}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      Based on AI analysis of {dashboardStats.totalFeedback} entries
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grow>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: 400 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Grid container spacing={2} sx={{ flex: 1 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setActiveTab(3)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    Create Survey
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<InboxIcon />}
                    onClick={() => setActiveTab(1)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    View Feedback
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    onClick={() => setActiveTab(5)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    Analytics
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SendIcon />}
                    onClick={() => setActiveTab(7)}
                    sx={{ borderRadius: 2, py: 1.5, height: '100%' }}
                  >
                    Distribution
                  </Button>
                </Grid>
              </Grid>
              
              {/* Attention Required Section */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Attention Required</Typography>
                  <Badge badgeContent={dashboardStats.unaddressed + dashboardStats.flaggedFeedback} color="error">
                    <FlagIcon />
                  </Badge>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <ThumbDownIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Negative Feedback"
                      secondary={`${dashboardStats.negativeFeedback} items need attention`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FlagIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Flagged Items"
                      secondary={`${dashboardStats.flaggedFeedback} items flagged for follow-up`}
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Feedback */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Recent Feedback</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setActiveTab(1)}
            >
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentFeedback.slice(0, 5).map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSentimentIcon(feedback.sentiment)}
                        {feedback.customer}
                        {feedback.flagged && <FlagIcon color="error" fontSize="small" />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            fontSize="small"
                            sx={{ 
                              color: i < feedback.rating ? '#ffc107' : '#e0e0e0' 
                            }}
                          />
                        ))}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {feedback.rating}/5
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={feedback.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {feedback.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={feedback.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(feedback.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewFeedback(feedback)}>
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const FeedbackInboxTab = () => {
    // Get counts for each filter
    const getFilterCounts = () => {
      return {
        all: recentFeedback.length,
        unaddressed: recentFeedback.filter(f => f.status === 'unaddressed').length,
        negative: recentFeedback.filter(f => f.rating <= 2).length,
        flagged: recentFeedback.filter(f => f.flagged === true).length,
        attachments: recentFeedback.filter(f => f.hasAttachments === true).length,
        resolved: recentFeedback.filter(f => f.status === 'resolved').length
      };
    };

    const filterCounts = getFilterCounts();

    return (
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Box>
      <Typography variant="h5" gutterBottom>Feedback Inbox</Typography>
            <Typography variant="body2" color="text.secondary">
        Real-time view of all incoming feedback and customer responses
      </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {selectedFeedbackIds.length > 0 && (
              <Chip 
                label={`${selectedFeedbackIds.length} selected`} 
                color="primary" 
                variant="outlined"
              />
            )}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* 1. Navigation & Sub-Folder Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Filter Categories</Typography>
            <Grid container spacing={2}>
              {[
                { 
                  key: 'all', 
                  label: 'All Feedback', 
                  icon: '🔁', 
                  color: 'primary',
                  count: filterCounts.all
                },
                { 
                  key: 'unaddressed', 
                  label: 'Unaddressed', 
                  icon: '🚩', 
                  color: 'error',
                  count: filterCounts.unaddressed
                },
                { 
                  key: 'negative', 
                  label: 'Negative / Low Rating', 
                  icon: '❗', 
                  color: 'error',
                  count: filterCounts.negative
                },
                { 
                  key: 'flagged', 
                  label: 'Flagged for Follow-Up', 
                  icon: '🔍', 
                  color: 'warning',
                  count: filterCounts.flagged
                },
                { 
                  key: 'attachments', 
                  label: 'With Attachments', 
                  icon: '📎', 
                  color: 'info',
                  count: filterCounts.attachments
                },
                { 
                  key: 'resolved', 
                  label: 'Resolved Feedback', 
                  icon: '✅', 
                  color: 'success',
                  count: filterCounts.resolved
                }
              ].map((filter) => (
                <Grid item xs={6} sm={4} md={2} key={filter.key}>
                  <Button
                    fullWidth
                    variant={feedbackFilter === filter.key ? "contained" : "outlined"}
                    color={filter.color}
                    onClick={() => setFeedbackFilter(filter.key)}
                    sx={{ 
                      borderRadius: 2, 
                      py: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                      height: '80px'
                    }}
                  >
                    <Typography variant="h6">{filter.icon}</Typography>
                    <Typography variant="body2" fontWeight="600" fontSize="0.75rem" textAlign="center">
                      {filter.label}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color={feedbackFilter === filter.key ? "inherit" : filter.color}
                    >
                      {filter.count}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        {/* 3. Filter & Search Panel */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
            <TextField
              fullWidth
                placeholder="Search customers, feedback, email..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  sx: { borderRadius: 2 }
                }}
            />
          </Grid>
            <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
                <InputLabel>Channel</InputLabel>
                <Select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
                  <MenuItem value="all">All Channels</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="web">Web</MenuItem>
                  <MenuItem value="survey">Survey</MenuItem>
              </Select>
            </FormControl>
          </Grid>
            <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select value={assignedFilter} onChange={(e) => setAssignedFilter(e.target.value)}>
                  <MenuItem value="all">All Agents</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  <MenuItem value="Alice Cooper">Alice Cooper</MenuItem>
                  <MenuItem value="Bob Wilson">Bob Wilson</MenuItem>
                  <MenuItem value="Carol Brown">Carol Brown</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
              <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
            <Grid item xs={6} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  startIcon={<CalendarIcon />} 
                  variant="outlined" 
                  size="small"
                  onClick={() => setDateRangeDialog(true)}
                  sx={{ borderRadius: 2 }}
                  color={dateRange.from && dateRange.to ? "primary" : "inherit"}
                >
                  {dateRange.from && dateRange.to ? "Date Filtered" : "Date Range"}
              </Button>
                <Button 
                  startIcon={<GetAppIcon />} 
                  variant="outlined" 
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

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
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {selectedFeedbackIds.length} feedback item(s) selected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<PersonIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => handleBulkAction('assign')}
                    sx={{ borderRadius: 2 }}
                  >
                    Bulk Assign
                  </Button>
                  <Button
                    startIcon={<CheckCircleIcon />}
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleBulkAction('resolve')}
                    sx={{ borderRadius: 2 }}
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    startIcon={<FlagIcon />}
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleBulkAction('flag')}
                    sx={{ borderRadius: 2 }}
                  >
                    Flag for Follow-Up
                  </Button>
                  <Button
                    startIcon={<GetAppIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => handleBulkAction('export')}
                    sx={{ borderRadius: 2 }}
                  >
                    Export Selected
                  </Button>
                  <Button
                    startIcon={<CloseIcon />}
                    variant="text"
                    size="small"
                    onClick={() => {
                      setSelectedFeedbackIds([]);
                      setBulkActionsVisible(false);
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear Selection
                  </Button>
                </Box>
              </Toolbar>
            </Paper>
          </Grow>
        )}

        {/* 2. Feedback Listing Table */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
            overflow: 'visible'
          }}
        >
          <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    padding="checkbox"
                    sx={{ 
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    <Checkbox
                      indeterminate={selectedFeedbackIds.length > 0 && selectedFeedbackIds.length < filteredFeedback.length}
                      checked={filteredFeedback.length > 0 && selectedFeedbackIds.length === filteredFeedback.length}
                      onChange={(e) => handleSelectAllFeedback(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Date & Time
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Customer
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Rating
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Feedback Snippet
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Channel
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Category/Tag
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Assigned To
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600,
                      bgcolor: theme.palette.background.paper,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      position: 'sticky',
                      top: 0,
                      zIndex: 100
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
        {filteredFeedback.map((feedback) => (
                  <TableRow 
                    key={feedback.id}
                    hover
                    selected={selectedFeedbackIds.includes(feedback.id)}
                    sx={{ 
                      '&:hover': { cursor: 'pointer' },
                      borderLeft: feedback.priority === 'urgent' ? `4px solid ${getPriorityColor(feedback.priority)}` : 'none'
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFeedbackIds.includes(feedback.id)}
                        onChange={() => handleSelectFeedback(feedback.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {new Date(feedback.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(feedback.date).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                      {feedback.customer.charAt(0)}
                    </Avatar>
                    <Box>
                          <Typography variant="body2" fontWeight="600">
                        {feedback.customer}
                      </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {feedback.customerEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              fontSize="small"
                              sx={{ 
                                color: i < feedback.rating ? '#ffc107' : '#e0e0e0' 
                              }}
                            />
                          ))}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {feedback.rating}/5
                        </Typography>
                        </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {feedback.message}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          {feedback.hasAttachments && (
                            <Chip 
                              icon={<AttachFileIcon />} 
                              label={`${feedback.attachments?.length || 0} files`} 
                              size="small" 
                              color="info" 
                              variant="outlined" 
                            />
                          )}
                          {feedback.flagged && (
                            <Chip 
                              icon={<FlagIcon />} 
                              label="Flagged" 
                              size="small" 
                              color="error" 
                              variant="outlined" 
                            />
                          )}
                      </Box>
                    </Box>
                    </TableCell>
                    <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getChannelIcon(feedback.channel)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {feedback.channel}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip 
                          label={feedback.category} 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                        />
                        {feedback.tags?.slice(0, 2).map((tag, idx) => (
                          <Chip 
                            key={idx}
                            label={tag} 
                            size="small" 
                            variant="filled"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                    <Chip 
                      label={feedback.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(feedback.status)}
                      size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={feedback.assignedTo ? "text.primary" : "text.secondary"}>
                        {feedback.assignedTo || 'Unassigned'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setFeedbackDetailOpen(true);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as Resolved">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleResolveFeedback(feedback.id)}
                            disabled={feedback.status === 'resolved'}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Flag for Follow-up">
                          <IconButton 
                            size="small" 
                            color="warning"
                            onClick={() => handleFlagFeedback(feedback.id)}
                            disabled={feedback.flagged}
                          >
                            <FlagIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Actions">
                          <IconButton 
                            size="small"
                            onClick={(e) => handleActionMenuClick(e, feedback)}
                          >
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
        </Paper>

        {/* Custom Action Menu using React Portal for guaranteed positioning */}
        {menuPosition && activeMenu && ReactDOM.createPortal(
          <div 
            ref={menuRef}
            style={{
              position: 'absolute',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 9999,
            }}
          >
            <Paper
              elevation={8}
              sx={{
                minWidth: 200,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: -5,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'rotate(45deg)',
                  zIndex: 0,
                },
              }}
            >
              <List dense>
                <MenuItem onClick={() => {
                  handleReplyFeedback(activeMenu);
                  handleActionMenuClose();
                }}>
                  <ListItemIcon>
                    <ReplyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Reply</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleAssignFeedback(activeMenu);
                  handleActionMenuClose();
                }}>
                  <ListItemIcon>
                    <AssignIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Assign Agent</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleEditFeedback(activeMenu.id);
                  handleActionMenuClose();
                }}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                  handleArchiveFeedback(activeMenu.id);
                  handleActionMenuClose();
                }}>
                  <ListItemIcon>
                    <ArchiveIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleDeleteFeedback(activeMenu.id);
                    handleActionMenuClose();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </List>
            </Paper>
          </div>,
          document.body
        )}


        {/* 6. Feedback Detail View - Right Drawer */}
        <Dialog 
          open={feedbackDetailOpen} 
          onClose={() => setFeedbackDetailOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Feedback Details</Typography>
            <IconButton onClick={() => setFeedbackDetailOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Grid container spacing={3}>
                {/* Customer Profile */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Customer Profile</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: theme.palette.primary.main }}>
                        {selectedFeedback.customer.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600">
                          {selectedFeedback.customer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedFeedback.customerEmail}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedFeedback.customerPhone}
                        </Typography>
                </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="body1">{selectedFeedback.location}</Typography>
                    </Box>
                  </Paper>
                </Grid>

                {/* Feedback Content */}
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>Full Feedback Content</Typography>
                    <Typography variant="body1" paragraph>
                      {selectedFeedback.fullMessage}
                </Typography>
                
                    {/* Rating Breakdown */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="subtitle2">Rating:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            fontSize="small"
                            sx={{ 
                              color: i < selectedFeedback.rating ? '#ffc107' : '#e0e0e0' 
                            }}
                          />
                        ))}
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {selectedFeedback.rating}/5
                        </Typography>
                      </Box>
                    </Box>

                    {/* Tags & Category */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Tags & Category</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label={selectedFeedback.category} 
                          color="primary" 
                          variant="filled"
                        />
                        {selectedFeedback.tags?.map((tag, idx) => (
                          <Chip 
                            key={idx}
                            label={tag} 
                      size="small" 
                      variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Attachments */}
                    {selectedFeedback.hasAttachments && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Attachment Preview</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedFeedback.attachments?.map((attachment, idx) => (
                            <Chip
                              key={idx}
                              icon={<AttachFileIcon />}
                              label={`${attachment.name} (${attachment.size})`}
                              variant="outlined"
                              color="info"
                              clickable
                              onClick={() => {}}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Paper>

                  {/* Action Logs */}
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Action Logs</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <HistoryIcon color="primary" />
                      <Box>
                        <Typography variant="body2">
                          Received → {selectedFeedback.flagged ? 'Flagged → ' : ''}{selectedFeedback.status === 'resolved' ? 'Resolved' : 'In Progress'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {new Date(selectedFeedback.date).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setFeedbackDetailOpen(false)}>Close</Button>
                    <Button 
                      variant="outlined"
              startIcon={<CommentIcon />}
              onClick={() => {
                setFeedbackDetailOpen(false);
                handleReplyFeedback(selectedFeedback);
              }}
                    >
                      Reply
                    </Button>
                    <Button 
                      variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => {
                setFeedbackDetailDialog(false);
                handleAssignFeedback(selectedFeedback);
              }}
                    >
                      Assign
                    </Button>
                    <Button 
                      variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                handleResolveFeedback(selectedFeedback.id);
                setFeedbackDetailOpen(false);
              }}
              disabled={selectedFeedback?.status === 'resolved'}
            >
              Mark Resolved
                    </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Feedback Dialog */}
        <Dialog 
          open={editFeedbackDialog.open} 
          onClose={() => setEditFeedbackDialog({ open: false, feedback: null })}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Edit Feedback</Typography>
            <IconButton onClick={() => setEditFeedbackDialog({ open: false, feedback: null })}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {editFeedbackDialog.feedback && (
              <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    defaultValue={editFeedbackDialog.feedback.customer}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Customer Email"
                    defaultValue={editFeedbackDialog.feedback.customerEmail}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                                         <Select
                      value={editedFeedback.category || ''}
                      label="Category"
                      onChange={(e) => handleEditChange('category', e.target.value)}
                    >
                      <MenuItem value="Service Quality">Service Quality</MenuItem>
                      <MenuItem value="Response Time">Response Time</MenuItem>
                      <MenuItem value="Policy Information">Policy Information</MenuItem>
                      <MenuItem value="Claims Process">Claims Process</MenuItem>
                      <MenuItem value="Customer Support">Customer Support</MenuItem>
                      <MenuItem value="Billing">Billing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                                         <Select
                      value={editedFeedback.status || ''}
                      label="Status"
                      onChange={(e) => handleEditChange('status', e.target.value)}
                    >
                      <MenuItem value="unaddressed">Unaddressed</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Priority</InputLabel>
                                         <Select
                      value={editedFeedback.priority || 'medium'}
                      label="Priority"
                      onChange={(e) => handleEditChange('priority', e.target.value)}
                    >
                      <MenuItem value="urgent">Urgent</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={editedFeedback.flagged || false}
                        onChange={(e) => handleEditChange('flagged', e.target.checked)}
                        color="warning"
                      />
                    }
                    label="Flag for Follow-Up"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Feedback Message"
                    value={editedFeedback.message || ''}
                    onChange={(e) => handleEditChange('message', e.target.value)}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                      value={editedFeedback.assignedTo || ''}
                      label="Assigned To"
                      onChange={(e) => handleEditChange('assignedTo', e.target.value)}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      <MenuItem value="Alice Cooper">Alice Cooper</MenuItem>
                      <MenuItem value="Bob Wilson">Bob Wilson</MenuItem>
                      <MenuItem value="Carol Brown">Carol Brown</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {editedFeedback.tags?.map((tag, index) => (
                      <Chip 
                        key={index}
                        label={tag}
                        onDelete={() => {
                          const newTags = [...(editedFeedback.tags || [])];
                          newTags.splice(index, 1);
                          handleEditChange('tags', newTags);
                        }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    <Chip
                      icon={<AddIcon />}
                      label="Add Tag"
                      onClick={() => {
                        const newTag = prompt('Enter new tag:');
                        if (newTag && newTag.trim()) {
                          const newTags = [...(editedFeedback.tags || []), newTag.trim()];
                          handleEditChange('tags', newTags);
                        }
                      }}
                      variant="outlined"
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditFeedbackDialog({ open: false, feedback: null })}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              onClick={handleSaveFeedback}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Date Range Filter Dialog */}
        <Dialog open={dateRangeDialog} onClose={() => setDateRangeDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Select Date Range</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="From Date"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="To Date"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label="Today" 
                    clickable 
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setDateRange({ from: today, to: today });
                    }}
                  />
                  <Chip 
                    label="Last 7 days" 
                    clickable 
                    onClick={() => {
                      const today = new Date();
                      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                      setDateRange({ 
                        from: lastWeek.toISOString().split('T')[0], 
                        to: today.toISOString().split('T')[0] 
                      });
                    }}
                  />
                  <Chip 
                    label="Last 30 days" 
                    clickable 
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                      setDateRange({ 
                        from: lastMonth.toISOString().split('T')[0], 
                        to: today.toISOString().split('T')[0] 
                      });
                    }}
                  />
                  <Chip 
                    label="This Month" 
                    clickable 
                    onClick={() => {
                      const today = new Date();
                      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                      setDateRange({ 
                        from: firstDayOfMonth.toISOString().split('T')[0], 
                        to: today.toISOString().split('T')[0] 
                      });
                    }}
                  />
                </Box>
          </Grid>
      </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setDateRange({ from: '', to: '' });
                setDateRangeDialog(false);
              }}
            >
              Clear
            </Button>
            <Button onClick={() => setDateRangeDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => setDateRangeDialog(false)} 
              variant="contained"
              disabled={!dateRange.from || !dateRange.to}
            >
              Apply Filter
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
  };

  const SurveyCampaignsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Survey Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor survey creation, deployment, and results
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/survey-designer')}
          sx={{ borderRadius: 2 }}
        >
          Create Survey
        </Button>
      </Box>

      <Grid container spacing={3}>
        {surveys.map((survey) => (
          <Grid item xs={12} md={6} lg={4} key={survey.id}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">
                    {survey.name}
                  </Typography>
                  <Chip 
                    label={survey.status.toUpperCase()}
                    color={getSurveyStatusColor(survey.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Type: {survey.type} • Created: {new Date(survey.createdDate).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">
                      {survey.responses}/{survey.targetResponses}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(survey.responses / survey.targetResponses) * 100}
                    sx={{ borderRadius: 1, height: 8 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {survey.completionRate}% completion rate
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {survey.channels.map((channel) => (
                    <Tooltip key={channel} title={channel.toUpperCase()}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {getChannelIcon(channel)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {survey.status === 'draft' && (
                    <Button 
                      size="small" 
                      variant="contained" 
                      startIcon={<SendIcon />}
                      onClick={() => handleLaunchSurvey(survey.id)}
                    >
                      Launch
                    </Button>
                  )}
                  {survey.status === 'active' && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="warning"
                      onClick={() => handlePauseSurvey(survey.id)}
                    >
                      Pause
                    </Button>
                  )}
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<ViewIcon />}
                    onClick={() => setActiveTab(4)}
                  >
                    View
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => setActiveTab(3)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<AnalyticsIcon />}
                    onClick={() => setActiveTab(5)}
                  >
                    Results
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );




    const SurveyResponsesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Survey Responses</Typography>
          <Typography variant="body2" color="text.secondary">
            View and analyze collected survey data
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={() => handleExportData('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={() => handleExportData('pdf')}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {surveyResponses.map((response) => {
          const survey = surveys.find(s => s.id === response.surveyId);
          return (
            <Grid item xs={12} key={response.id}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{survey?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Response from {response.respondent} • {new Date(response.submittedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip label={survey?.type} size="small" />
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    {survey?.questions.map((question) => (
                      <Box key={question.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {question.text}
                        </Typography>
                        <Typography variant="body1" sx={{ pl: 2 }}>
                          {question.type === 'rating' || question.type === 'nps' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6" color="primary">
                                {response.responses[question.id]}
                              </Typography>
                              {question.type === 'rating' && (
                                <Box sx={{ display: 'flex' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      fontSize="small"
                                      sx={{ 
                                        color: i < response.responses[question.id] ? '#ffc107' : '#e0e0e0' 
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          ) : (
                            response.responses[question.id]
                          )}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const InsightsAnalyticsTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Insights & Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Deep dive into aggregated metrics and sentiment analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Avg. CSAT Score"
            value="4.2"
            color={theme.palette.primary.main}
            icon={<StarIcon />}
            index={0}
            subtitle="Out of 5.0"
            trend="+0.3 from last month"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="NPS Score"
            value="67"
            color={theme.palette.success.main}
            icon={<TrendingUpIcon />}
            index={1}
            subtitle="Promoters - Detractors"
            trend="+12 from last month"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Response Rate"
            value="73%"
            color={theme.palette.info.main}
            icon={<ResponsesIcon />}
            index={2}
            subtitle="Survey completion"
            trend="+5% from last month"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Sentiment Score"
            value="82%"
            color={theme.palette.warning.main}
            icon={<SentimentSatisfiedIcon />}
            index={3}
            subtitle="Positive sentiment"
            trend="+7% from last month"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Feedback Categories</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Service Quality" 
                  secondary="45% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={45} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Product Features" 
                  secondary="28% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={28} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Support Experience" 
                  secondary="18% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={18} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Pricing" 
                  secondary="9% of feedback"
                />
                <LinearProgress 
                  variant="determinate" 
                  value={9} 
                  sx={{ width: 100, ml: 2 }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Sentiment Trends</Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                Positive Trend
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer sentiment has improved by 15% this quarter
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const AudienceManagementTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Audience Management</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage customer segments and target audiences for surveys
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Customers</Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                12,450
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customers who have interacted in the last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Survey Participants</Typography>
              <Typography variant="h4" color="success.main" gutterBottom>
                8,920
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customers who have completed surveys
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const DistributionChannelsTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Distribution Channels</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure how surveys are distributed to customers
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, textAlign: 'center', p: 2 }}>
            <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Email</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send surveys via email campaigns
            </Typography>
            <Button variant="outlined" fullWidth>Configure</Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, textAlign: 'center', p: 2 }}>
            <SmsIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>SMS</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send survey links via SMS
            </Typography>
            <Button variant="outlined" fullWidth>Configure</Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, textAlign: 'center', p: 2 }}>
            <WhatsAppIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>WhatsApp</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share surveys on WhatsApp
            </Typography>
            <Button variant="outlined" fullWidth>Configure</Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const AutomationTriggersTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Automation & Triggers</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set up automated survey triggers based on customer actions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Available Triggers</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Policy Purchase" 
                    secondary="Send CSAT survey 24 hours after policy purchase"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Claim Settlement" 
                    secondary="Send feedback survey after claim is settled"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Support Interaction" 
                    secondary="Send support experience survey after ticket closure"
                  />
                  <Switch />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Fade in timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 4
        }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Feedback & Surveys
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive feedback management and survey platform
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => navigate('/survey-designer')}
              sx={{ borderRadius: 2 }}
            >
              Create Survey
            </Button>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<InboxIcon />} label="Feedback Inbox" />
            <Tab icon={<CampaignIcon />} label="Survey Campaigns" />
            <Tab icon={<ResponsesIcon />} label="Survey Responses" />
            <Tab icon={<AnalyticsIcon />} label="Insights & Analytics" />
            <Tab icon={<PeopleIcon />} label="Audience Management" />
            <Tab icon={<SendIcon />} label="Distribution Channels" />
            <Tab icon={<AutomationIcon />} label="Automation & Triggers" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <DashboardTab />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <FeedbackInboxTab />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <SurveyCampaignsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <SurveyResponsesTab />
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <InsightsAnalyticsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={5}>
          <AudienceManagementTab />
        </TabPanel>
        <TabPanel value={activeTab} index={6}>
          <DistributionChannelsTab />
        </TabPanel>
        <TabPanel value={activeTab} index={7}>
          <AutomationTriggersTab />
        </TabPanel>

        {/* Dialogs */}
        {/* Create Survey Dialog */}
        <Dialog open={createSurveyDialog} onClose={() => setCreateSurveyDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <Tabs 
                value={surveyTabIndex} 
                onChange={(e, newValue) => setSurveyTabIndex(newValue)}
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Basic Info" />
                <Tab label="Audience" />
                <Tab label="Schedule" />
                <Tab label="Branding" />
              </Tabs>
              
              {surveyTabIndex === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Survey Name"
                      value={surveyForm.name}
                      onChange={(e) => setSurveyForm({...surveyForm, name: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Survey Type</InputLabel>
                      <Select
                        value={surveyForm.type}
                        onChange={(e) => setSurveyForm({...surveyForm, type: e.target.value})}
                      >
                        <MenuItem value="CSAT">Customer Satisfaction (CSAT)</MenuItem>
                        <MenuItem value="NPS">Net Promoter Score (NPS)</MenuItem>
                        <MenuItem value="CES">Customer Effort Score (CES)</MenuItem>
                        <MenuItem value="Custom">Custom Survey</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Target Responses"
                      type="number"
                      value={surveyForm.targetResponses}
                      onChange={(e) => setSurveyForm({...surveyForm, targetResponses: parseInt(e.target.value)})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      value={surveyForm.description}
                      onChange={(e) => setSurveyForm({...surveyForm, description: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}
              
              {surveyTabIndex === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Target Audience</InputLabel>
                      <Select
                        value={surveyForm.audience}
                        onChange={(e) => setSurveyForm({...surveyForm, audience: e.target.value})}
                      >
                        <MenuItem value="">Select an audience</MenuItem>
                        <MenuItem value="all-customers">All Customers</MenuItem>
                        <MenuItem value="new-customers">New Customers</MenuItem>
                        <MenuItem value="premium-tier">Premium Tier</MenuItem>
                        <MenuItem value="lapsed-customers">Lapsed Customers</MenuItem>
                        <MenuItem value="recent-service">Recent Service Users</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Distribution Channels</InputLabel>
                      <Select
                        multiple
                        value={surveyForm.channels}
                        onChange={(e) => setSurveyForm({...surveyForm, channels: e.target.value})}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value.toUpperCase()} 
                                size="small" 
                                icon={getChannelIcon(value)} 
                              />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="sms">SMS</MenuItem>
                        <MenuItem value="whatsapp">WhatsApp</MenuItem>
                        <MenuItem value="web">Website</MenuItem>
                        <MenuItem value="app">Mobile App</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={surveyForm.anonymous || false}
                          onChange={(e) => setSurveyForm({...surveyForm, anonymous: e.target.checked})}
                        />
                      }
                      label="Anonymous Responses"
                    />
                  </Grid>
                </Grid>
              )}
              
              {surveyTabIndex === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Campaign Mode</InputLabel>
                      <Select
                        value={surveyForm.campaignMode}
                        onChange={(e) => setSurveyForm({...surveyForm, campaignMode: e.target.value})}
                      >
                        <MenuItem value="one-time">One-time</MenuItem>
                        <MenuItem value="recurring">Recurring</MenuItem>
                        <MenuItem value="event-triggered">Event Triggered</MenuItem>
                        <MenuItem value="continuous">Continuous Feedback</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {surveyForm.campaignMode === 'event-triggered' && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Trigger Event</InputLabel>
                        <Select
                          value={surveyForm.triggerEvent}
                          onChange={(e) => setSurveyForm({...surveyForm, triggerEvent: e.target.value})}
                        >
                          <MenuItem value="purchase">Purchase Completion</MenuItem>
                          <MenuItem value="support">Support Interaction</MenuItem>
                          <MenuItem value="account-creation">Account Creation</MenuItem>
                          <MenuItem value="service-usage">Service Usage</MenuItem>
                          <MenuItem value="policy-renewal">Policy Renewal</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  
                  {(surveyForm.campaignMode === 'one-time' || surveyForm.campaignMode === 'recurring') && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Start Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={surveyForm.schedule.startDate}
                          onChange={(e) => setSurveyForm({
                            ...surveyForm, 
                            schedule: {...surveyForm.schedule, startDate: e.target.value}
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="End Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={surveyForm.schedule.endDate}
                          onChange={(e) => setSurveyForm({
                            ...surveyForm, 
                            schedule: {...surveyForm.schedule, endDate: e.target.value}
                          })}
                        />
                      </Grid>
                    </>
                  )}
                  
                  {surveyForm.campaignMode === 'recurring' && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Frequency</InputLabel>
                          <Select
                            value={surveyForm.schedule.frequency}
                            onChange={(e) => setSurveyForm({
                              ...surveyForm, 
                              schedule: {...surveyForm.schedule, frequency: e.target.value}
                            })}
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="quarterly">Quarterly</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Reminder Days"
                          type="number"
                          value={surveyForm.schedule.reminderDays}
                          onChange={(e) => setSurveyForm({
                            ...surveyForm, 
                            schedule: {...surveyForm.schedule, reminderDays: parseInt(e.target.value)}
                          })}
                          helperText="Days to wait before sending a reminder"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              )}
              
              {surveyTabIndex === 3 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={surveyForm.branding.logo}
                          onChange={(e) => setSurveyForm({
                            ...surveyForm, 
                            branding: {...surveyForm.branding, logo: e.target.checked}
                          })}
                        />
                      }
                      label="Include Company Logo"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Color Theme</InputLabel>
                      <Select
                        value={surveyForm.branding.colors}
                        onChange={(e) => setSurveyForm({
                          ...surveyForm, 
                          branding: {...surveyForm.branding, colors: e.target.value}
                        })}
                      >
                        <MenuItem value="default">Default</MenuItem>
                        <MenuItem value="corporate">Corporate</MenuItem>
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="friendly">Friendly</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {surveyForm.branding.colors === 'custom' && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={surveyForm.branding.customTheme}
                            onChange={(e) => setSurveyForm({
                              ...surveyForm, 
                              branding: {...surveyForm.branding, customTheme: e.target.checked}
                            })}
                          />
                        }
                        label="Use Custom Theme"
                      />
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
            <Box>
              <Button onClick={() => setCreateSurveyDialog(false)}>Cancel</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {surveyTabIndex > 0 && (
                <Button 
                  onClick={() => setSurveyTabIndex(surveyTabIndex - 1)}
                >
                  Back
                </Button>
              )}
              {surveyTabIndex < 3 ? (
                <Button 
                  variant="contained"
                  onClick={() => setSurveyTabIndex(surveyTabIndex + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  variant="contained"
                  onClick={handleSaveSurvey}
                  disabled={!surveyForm.name}
                >
                  Create Survey
                </Button>
              )}
            </Box>
          </DialogActions>
        </Dialog>

        {/* Feedback Detail Dialog */}
        <Dialog open={feedbackDetailDialog} onClose={() => setFeedbackDetailDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Customer</Typography>
                    <Typography variant="body1">{selectedFeedback.customer}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Rating</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          fontSize="small"
                          sx={{ color: i < selectedFeedback.rating ? '#ffc107' : '#e0e0e0' }}
                        />
                      ))}
                      <Typography variant="body2">({selectedFeedback.rating}/5)</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Category</Typography>
                    <Chip label={selectedFeedback.category} size="small" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Status</Typography>
                    <Chip 
                      label={selectedFeedback.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(selectedFeedback.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Message</Typography>
                    <Typography variant="body1">{selectedFeedback.message}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Date</Typography>
                    <Typography variant="body1">{new Date(selectedFeedback.date).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom>Channel</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getChannelIcon(selectedFeedback.channel)}
                      <Typography variant="body1">{selectedFeedback.channel.toUpperCase()}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackDetailDialog(false)}>Close</Button>
            <Button onClick={() => {
              setFeedbackDetailDialog(false);
              handleReplyFeedback(selectedFeedback);
            }} variant="outlined">Reply</Button>
            <Button onClick={() => {
              setFeedbackDetailDialog(false);
              handleAssignFeedback(selectedFeedback);
            }} variant="outlined">Assign</Button>
          </DialogActions>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Reply to Feedback</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Replying to: {selectedFeedback.customer}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  "{selectedFeedback.message}"
                </Typography>
                <TextField
                  fullWidth
                  label="Your Reply"
                  multiline
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
            <Button onClick={handleSendReply} variant="contained" disabled={!replyText.trim()}>
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Dialog */}
        <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assign Feedback</DialogTitle>
          <DialogContent>
            {selectedFeedback && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Assigning feedback from: {selectedFeedback.customer}
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Assign to Agent</InputLabel>
                  <Select
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                  >
                    {agents.map((agent) => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name} - {agent.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignAgent} variant="contained" disabled={!assignedAgent}>
              Assign
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Feedback;
