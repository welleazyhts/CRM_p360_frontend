import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, useTheme, alpha, IconButton, Switch, FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, Checkbox, CircularProgress,
  Tabs, Tab, List, ListItem, ListItemText, Divider, AppBar,
  Badge, Tooltip, SpeedDial, SpeedDialAction, SpeedDialIcon,
  Alert, Snackbar
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Send as SendIcon, Inbox as InboxIcon, Outbox as OutboxIcon,
  Reply as ReplyIcon, Delete as DeleteIcon, Archive as ArchiveIcon, Star as StarIcon,
  StarBorder as StarBorderIcon, Attachment as AttachmentIcon, Search as SearchIcon,
  MoreVert as MoreVertIcon, Flag as PriorityIcon, Close as CloseIcon, Add as AddIcon,
  Edit as EditIcon, Visibility as ViewIcon, Clear as ClearIcon,
  Schedule as ScheduleIcon, AutoMode as AutoModeIcon, Analytics as AnalyticsIcon,
  Settings as SettingsIcon, Label as LabelIcon,
  Forward as ForwardIcon, Print as PrintIcon,
  SmartToy as SmartToyIcon, Psychology as PsychologyIcon,
  Assignment as AssignmentIcon,
  Snooze as SnoozeIcon,
  Drafts as DraftsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { analyzeEmail, enhanceEmailContent, initializeEmailAgent, generateSmartReplies as generateEmailAIReplies } from '../services/emailAI';

// Component to format AI analysis text properly
const FormattedAIAnalysis = ({ text }) => {
  const theme = useTheme();
  const [debouncedText, setDebouncedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Debounce the text to avoid parsing incomplete streaming content
  useEffect(() => {
    setIsStreaming(true);
    const timer = setTimeout(() => {
      setDebouncedText(text);
      setIsStreaming(false);
    }, 300); // Wait 300ms after last update

    return () => clearTimeout(timer);
  }, [text]);

  if (!text) return null;

  // Parse the AI analysis text and format it properly
  const parseAnalysisText = (analysisText) => {
    const sections = {};

    // Handle incomplete streaming text
    if (!analysisText || analysisText.length < 20) {
      return sections;
    }

    // Try to extract sections using a more robust approach
    const sectionPatterns = [
      /(?:^|\n)\s*\*\*Sentiment\*\*:\s*([^\n]*(?:\n(?!\s*\*\*\w+\*\*:)[^\n]*)*)/gi,
      /(?:^|\n)\s*\*\*Intent\*\*:\s*([^\n]*(?:\n(?!\s*\*\*\w+\*\*:)[^\n]*)*)/gi,
      /(?:^|\n)\s*\*\*Urgency\*\*:\s*([^\n]*(?:\n(?!\s*\*\*\w+\*\*:)[^\n]*)*)/gi,
      /(?:^|\n)\s*\*\*Key Points?\*\*:\s*([^\n]*(?:\n(?!\s*\*\*\w+\*\*:)[^\n]*)*)/gi,
      /(?:^|\n)\s*\*\*Tone\*\*:\s*([^\n]*(?:\n(?!\s*\*\*\w+\*\*:)[^\n]*)*)/gi,
      /(?:^|\n)\s*\*\*Suggested Tone\*\*:\s*([^\n]*(?:\n(?!\s*\*\*\w+\*\*:)[^\n]*)*)/gi
    ];

    const sectionNames = ['Sentiment', 'Intent', 'Urgency', 'Key Points', 'Tone', 'Suggested Tone'];

    sectionPatterns.forEach((pattern, index) => {
      const matches = [...analysisText.matchAll(pattern)];
      if (matches.length > 0) {
        const sectionName = sectionNames[index];
        let content = matches[0][1].trim();

        // Clean up the content
        content = content
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
          .replace(/\(confidence[:\s]*\d+%?\)/gi, '') // Remove confidence indicators
          .replace(/confidence[:\s]*\d+%?/gi, '') // Remove confidence labels
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();

        if (content) {
          sections[sectionName] = content;
        }
      }
    });

    // Fallback to line-by-line parsing if regex approach didn't work well
    if (Object.keys(sections).length === 0) {
      const lines = analysisText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      let currentSection = null;

      for (const line of lines) {
        // Check for section headers
        const sectionMatch = line.match(/^\*?\*?(Sentiment|Intent|Urgency|Key Points?|Tone|Emotional State|Suggested Tone)\*?\*?:\s*(.*)/i);

        if (sectionMatch) {
          const sectionName = sectionMatch[1];
          let sectionValue = sectionMatch[2].trim();

          // Clean up the value
          sectionValue = sectionValue
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\(confidence[:\s]*\d+%?\)/gi, '')
            .replace(/confidence[:\s]*\d+%?/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

          sections[sectionName] = sectionValue;
          currentSection = sectionName;
        }
        // Check for continuation lines
        else if (currentSection && !line.includes(':')) {
          const content = line.replace(/\*\*(.*?)\*\*/g, '$1').trim();
          if (content) {
            sections[currentSection] = (sections[currentSection] + ' ' + content).trim();
          }
        }
      }
    }

    return sections;
  };

  // Use debounced text for parsing to avoid parsing incomplete content
  const textToParse = debouncedText || text;
  const sections = parseAnalysisText(textToParse);
  const hasValidSections = Object.keys(sections).length > 0;

  const getSentimentColor = (sentiment) => {
    const sentimentLower = sentiment.toLowerCase();
    if (sentimentLower.includes('positive')) return theme.palette.success.main;
    if (sentimentLower.includes('negative')) return theme.palette.error.main;
    return theme.palette.info.main;
  };

  const getUrgencyColor = (urgency) => {
    const urgencyLower = urgency.toLowerCase();
    if (urgencyLower.includes('high') || urgencyLower.includes('urgent')) return theme.palette.error.main;
    if (urgencyLower.includes('medium')) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  // Show streaming indicator or fallback display
  if (!hasValidSections) {
    if (isStreaming || (text && text.length < 50)) {
      return (
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
          <Typography variant="body2" color="info.main" sx={{ fontWeight: 600, mb: 1 }}>
            🤖 AI Analysis in Progress...
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', opacity: 0.7 }}>
            {text || 'Analyzing email content...'}
          </Typography>
          <LinearProgress sx={{ mt: 1 }} />
        </Box>
      );
    }

    // If we have substantial text but no parsed sections, show formatted fallback
    if (text && text.length > 50) {
      // Split text into lines and format them properly
      const lines = text.split('\n').filter(line => line.trim());

      return (
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
            📧 AI Analysis:
          </Typography>
          <Box>
            {lines.map((line, i) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;

              // Check if this is a section header
              const isSectionHeader = trimmedLine.match(/^\*\*(Sentiment|Intent|Urgency|Key Points?|Tone)\*\*:/i) ||
                trimmedLine.match(/^(Sentiment|Intent|Urgency|Key Points?|Tone):/i);

              // Check if this is a bullet point
              const isBullet = trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*');

              // Clean the text
              const cleanText = trimmedLine
                .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
                .replace(/\(confidence[:\s]*\d+%?\)/gi, '') // Remove confidence indicators
                .replace(/confidence[:\s]*\d+%?/gi, '') // Remove confidence labels
                .trim();

              return (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{
                    mb: isSectionHeader ? 1 : 0.5,
                    mt: isSectionHeader ? (i > 0 ? 1.5 : 0) : 0,
                    fontWeight: isSectionHeader ? 600 : 400,
                    color: isSectionHeader ? 'primary.main' : 'text.primary',
                    ml: isBullet ? 2 : 0,
                    lineHeight: 1.5
                  }}
                >
                  {cleanText}
                </Typography>
              );
            })}
          </Box>
        </Box>
      );
    }

    return null;
  }

  return (
    <Box>
      {Object.entries(sections).map(([sectionName, value], index) => {
        if (!value) return null;

        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{
              fontWeight: 600,
              color: sectionName.toLowerCase().includes('sentiment') ? getSentimentColor(value) :
                sectionName.toLowerCase().includes('urgency') ? getUrgencyColor(value) :
                  'primary.main',
              mb: 0.5
            }}>
              {sectionName}:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: 'text.primary',
                whiteSpace: 'pre-line'
              }}
            >
              {value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const RenewalEmailManager = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();

  // Enhanced State Management
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Advanced Search & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters] = useState({
    dateRange: { start: null, end: null },
    senderDomain: '',
    hasAttachments: 'all',
    priority: 'all',
    status: 'all',
    tags: [],
    assignee: 'all',
    readStatus: 'all',
    starred: 'all',
    size: 'all'
  });
  // Due Date Filtering
  const [dueDateFilter, setDueDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [sortConfig] = useState({ field: 'date', direction: 'desc' });

  // Dialog States
  const [composeDialog, setComposeDialog] = useState(false);
  const [viewEmailDialog, setViewEmailDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  const [, setAutomationDialog] = useState(false);
  const [, setSettingsDialog] = useState(false);
  const [aiAssistantDialog, setAiAssistantDialog] = useState(false);

  // Advanced Features State
  const [emailAnalytics, setEmailAnalytics] = useState({
    totalEmails: 0,
    unreadCount: 0,
    responseRate: 0,
    avgResponseTime: 0,
    topSenders: [],
    dailyVolume: [],
    sentimentDistribution: {}
  });
  const [templates, setTemplates] = useState([]);
  const [scheduledEmails] = useState([]);
  const [snoozedEmails] = useState([]);

  // AI Assistant State
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedAiSuggestion, setSelectedAiSuggestion] = useState('');
  const [currentAnalyzedEmail, setCurrentAnalyzedEmail] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // AI Connection Status State
  const [emailBotConnected, setEmailBotConnected] = useState(false);
  const [renewiqConnected, setRenewiqConnected] = useState(false);
  const [connectionTesting, setConnectionTesting] = useState(false);

  // Streaming State
  const [streamingAnalysis, setStreamingAnalysis] = useState('');
  const [streamingSuggestions, setStreamingSuggestions] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    tone: 'professional',
    style: 'formal',
    length: 'medium',
    includePersonalization: true,
    includeContext: true,
    language: 'english'
  });

  // UI State
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });


  // Compose Email Enhanced State
  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    template: '',
    priority: 'normal',
    scheduledSend: false,
    scheduleDate: null,
    attachments: [],
    signature: '',
    trackOpens: true,
    trackClicks: true,
    requestReadReceipt: false,
    renewalContext: {
      policyNumber: '',
      customerName: '',
      renewalDate: '',
      premiumAmount: '',
      agentName: '',
      branch: '',
      customerEmail: '',
      customerPhone: ''
    },
    aiAssistance: {
      tone: 'professional',
      language: 'english',
      includePersonalization: true,
      suggestSubject: true
    }
  });

  // Mock Enhanced Data
  const mockEmails = useMemo(() => [
    {
      id: 1,
      type: 'inbox',
      from: 'john.doe@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Urgent: Policy Renewal Required - POL123456',
      body: 'Dear Team,\n\nI need immediate assistance with my policy renewal. The deadline is approaching and I haven\'t received the renewal documents.\n\nPlease expedite this process.\n\nBest regards,\nJohn Doe',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      starred: false,
      priority: 'high',
      status: 'pending',
      attachments: ['policy_documents.pdf', 'id_proof.jpg'],
      size: '2.5MB',
      sentiment: 'negative',
      confidence: 0.85,
      aiIntent: 'renewal_request',
      assignedTo: 'Priya Patel',
      tags: ['renewal', 'urgent', 'documents'],
      threadId: 'thread_001',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL123456',
        customerName: 'Arjun Sharma',
        renewalDate: '2024-02-15',
        premiumAmount: '$1,200',
        agentName: 'Priya Patel',
        branch: 'Downtown Branch',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+1-555-0123',
        policyType: 'Auto Insurance',
        currentStage: 'documentation_pending'
      },
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Due tomorrow
      policyExpiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      aiSuggestions: [
        { type: 'quick_reply', text: 'We\'ll expedite your renewal process immediately.' },
        { type: 'template', name: 'Urgent Renewal Response' },
        { type: 'escalation', reason: 'High priority customer request' }
      ]
    },
    {
      id: 2,
      type: 'outbox',
      from: 'renewals@company.com',
      to: 'jane.smith@email.com',
      cc: ['manager@company.com'],
      bcc: [],
      subject: 'Your Renewal Quote is Ready - POL234567',
      body: 'Dear Jane,\n\nWe\'re pleased to provide your renewal quote for policy POL234567.\n\nYour new premium: $850\nRenewal date: March 1, 2024\n\nTo accept, simply reply to this email or call us at 1-800-RENEWAL.\n\nThank you for your continued trust.',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      starred: true,
      priority: 'medium',
      status: 'sent',
      attachments: ['renewal_quote.pdf'],
      size: '1.2MB',
      sentiment: 'positive',
      confidence: 0.92,
      aiIntent: 'quote_delivery',
      assignedTo: 'Ravi Gupta',
      tags: ['renewal', 'quote', 'sent'],
      threadId: 'thread_002',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 3, lastOpened: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      clickTracking: { clicked: true, clickCount: 1, lastClicked: new Date(Date.now() - 1 * 60 * 60 * 1000) },
      renewalContext: {
        policyNumber: 'POL234567',
        customerName: 'Meera Kapoor',
        renewalDate: '2024-03-01',
        premiumAmount: '$850',
        agentName: 'Ravi Gupta',
        branch: 'Westside Branch',
        customerEmail: 'jane.smith@email.com',
        customerPhone: '+1-555-0456',
        policyType: 'Home Insurance',
        currentStage: 'quote_sent'
      },
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Due in 5 days
      policyExpiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      scheduledFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      type: 'inbox',
      from: 'mike.johnson@email.com',
      to: 'renewals@company.com',
      subject: 'Thank You - Renewal Completed Successfully',
      body: 'Thank you for the excellent service. My renewal process was smooth and efficient. Payment has been processed successfully.',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      starred: true,
      priority: 'normal',
      status: 'completed',
      attachments: [],
      size: '0.5MB',
      sentiment: 'positive',
      confidence: 0.95,
      aiIntent: 'satisfaction_feedback',
      assignedTo: 'Neha Sharma',
      tags: ['renewal', 'completed', 'positive_feedback'],
      threadId: 'thread_003',
      renewalContext: {
        policyNumber: 'POL345678',
        customerName: 'Vikram Singh',
        renewalDate: '2024-01-30',
        premiumAmount: '$1,100',
        agentName: 'Neha Sharma',
        branch: 'Central Branch',
        customerEmail: 'mike.johnson@email.com',
        customerPhone: '+1-555-0789',
        policyType: 'Life Insurance',
        currentStage: 'completed'
      },
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Overdue by 3 days
      policyExpiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      type: 'inbox',
      from: 'sarah.wilson@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Policy Renewal Question - Coverage Options',
      body: 'Hello,\n\nI\'m interested in renewing my policy but would like to explore additional coverage options. Could someone please call me to discuss the available upgrades?\n\nI\'m particularly interested in comprehensive coverage and roadside assistance.\n\nBest regards,\nSarah Wilson',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      starred: false,
      priority: 'medium',
      status: 'pending',
      attachments: [],
      size: '0.8MB',
      sentiment: 'neutral',
      confidence: 0.78,
      aiIntent: 'coverage_inquiry',
      assignedTo: 'Amit Kumar',
      tags: ['renewal', 'coverage', 'inquiry'],
      threadId: 'thread_004',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL456789',
        customerName: 'Kavya Malhotra',
        renewalDate: '2024-03-15',
        premiumAmount: '$950',
        agentName: 'Amit Kumar',
        branch: 'North Branch',
        customerEmail: 'sarah.wilson@email.com',
        customerPhone: '+1-555-0321',
        policyType: 'Auto Insurance',
        currentStage: 'coverage_review'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'I\'ll have an agent call you today to discuss coverage options.' },
        { type: 'template', name: 'Coverage Options Response' },
        { type: 'callback_schedule', reason: 'Customer requested phone consultation' }
      ]
    },
    {
      id: 5,
      type: 'outbox',
      from: 'renewals@company.com',
      to: 'robert.brown@email.com',
      cc: [],
      bcc: ['audit@company.com'],
      subject: 'Payment Reminder - Policy POL567890',
      body: 'Dear Robert,\n\nThis is a friendly reminder that your renewal payment for policy POL567890 is due in 5 days.\n\nAmount Due: $1,350\nDue Date: February 20, 2024\n\nYou can make your payment online, by phone, or visit any of our branch locations.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nRenewal Team',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      starred: false,
      priority: 'medium',
      status: 'sent',
      attachments: ['payment_options.pdf'],
      size: '1.1MB',
      sentiment: 'neutral',
      confidence: 0.88,
      aiIntent: 'payment_reminder',
      assignedTo: 'Sanya Singh',
      tags: ['renewal', 'payment', 'reminder'],
      threadId: 'thread_005',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 2, lastOpened: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL567890',
        customerName: 'Rohit Agarwal',
        renewalDate: '2024-02-20',
        premiumAmount: '$1,350',
        agentName: 'Sanya Singh',
        branch: 'South Branch',
        customerEmail: 'robert.brown@email.com',
        customerPhone: '+1-555-0654',
        policyType: 'Commercial Insurance',
        currentStage: 'payment_pending'
      },
      scheduledFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 6,
      type: 'inbox',
      from: 'maria.garcia@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Renewal Documents Received - Ready to Proceed',
      body: 'Dear Renewal Team,\n\nI have received and reviewed all the renewal documents for my home insurance policy. Everything looks good and I\'m ready to proceed with the renewal.\n\nPlease process my renewal at your earliest convenience. I\'ve attached the signed documents.\n\nThank you for your excellent service.\n\nBest regards,\nMaria Garcia',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: true,
      starred: true,
      priority: 'normal',
      status: 'in_progress',
      attachments: ['signed_renewal_docs.pdf', 'updated_property_photos.zip'],
      size: '4.2MB',
      sentiment: 'positive',
      confidence: 0.91,
      aiIntent: 'renewal_approval',
      assignedTo: 'Rohit Agarwal',
      tags: ['renewal', 'documents', 'ready'],
      threadId: 'thread_006',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL678901',
        customerName: 'Sanya Singh',
        renewalDate: '2024-04-01',
        premiumAmount: '$1,150',
        agentName: 'Rohit Agarwal',
        branch: 'East Branch',
        customerEmail: 'maria.garcia@email.com',
        customerPhone: '+1-555-0987',
        policyType: 'Home Insurance',
        currentStage: 'documents_received'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'Thank you! We\'ll process your renewal immediately.' },
        { type: 'template', name: 'Processing Confirmation' },
        { type: 'priority_processing', reason: 'Customer ready to proceed' }
      ]
    },
    {
      id: 7,
      type: 'inbox',
      from: 'alex.martinez@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Claim Impact on Renewal Premium',
      body: 'Hello,\n\nI recently filed a claim on my auto policy and I\'m concerned about how this might affect my renewal premium. Can someone please explain the impact and provide me with the updated quote?\n\nClaim Number: CLM789012\nPolicy Number: POL789012\n\nI would appreciate a detailed explanation of the premium calculation.\n\nThank you,\nAlex Martinez',
      date: new Date(Date.now() - 18 * 60 * 60 * 1000),
      read: false,
      starred: false,
      priority: 'high',
      status: 'pending',
      attachments: ['claim_details.pdf'],
      size: '1.8MB',
      sentiment: 'concerned',
      confidence: 0.82,
      aiIntent: 'claim_impact_inquiry',
      assignedTo: 'Kavya Malhotra',
      tags: ['renewal', 'claim', 'premium_inquiry'],
      threadId: 'thread_007',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL789012',
        customerName: 'Aditya Malhotra',
        renewalDate: '2024-03-10',
        premiumAmount: '$1,450',
        agentName: 'Kavya Malhotra',
        branch: 'Metro Branch',
        customerEmail: 'alex.martinez@email.com',
        customerPhone: '+1-555-0147',
        policyType: 'Auto Insurance',
        currentStage: 'claim_review'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'I\'ll review your claim impact and provide a detailed explanation.' },
        { type: 'template', name: 'Claim Impact Explanation' },
        { type: 'specialist_referral', reason: 'Complex claim impact calculation required' }
      ]
    },
    {
      id: 8,
      type: 'outbox',
      from: 'renewals@company.com',
      to: 'jennifer.lee@email.com',
      cc: ['supervisor@company.com'],
      bcc: [],
      subject: 'Welcome Back - Renewal Completed Successfully',
      body: 'Dear Jennifer,\n\nWelcome back! We\'re delighted to confirm that your policy renewal has been completed successfully.\n\nPolicy Details:\n- Policy Number: POL890123\n- Renewal Date: February 1, 2024\n- New Premium: $875\n- Coverage Period: February 1, 2024 - February 1, 2025\n\nYour new policy documents are attached. Please keep them in a safe place.\n\nThank you for choosing us for another year of protection.\n\nBest regards,\nCustomer Success Team',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      starred: true,
      priority: 'normal',
      status: 'sent',
      attachments: ['new_policy_documents.pdf', 'payment_confirmation.pdf'],
      size: '2.1MB',
      sentiment: 'positive',
      confidence: 0.94,
      aiIntent: 'renewal_confirmation',
      assignedTo: 'Deepak Verma',
      tags: ['renewal', 'completed', 'welcome'],
      threadId: 'thread_008',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 5, lastOpened: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      clickTracking: { clicked: true, clickCount: 2, lastClicked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      renewalContext: {
        policyNumber: 'POL890123',
        customerName: 'Deepika Reddy',
        renewalDate: '2024-02-01',
        premiumAmount: '$875',
        agentName: 'Deepak Verma',
        branch: 'Central Branch',
        customerEmail: 'jennifer.lee@email.com',
        customerPhone: '+1-555-0258',
        policyType: 'Life Insurance',
        currentStage: 'completed'
      }
    },
    {
      id: 9,
      type: 'inbox',
      from: 'thomas.anderson@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Policy Cancellation Request - POL901234',
      body: 'Dear Sir/Madam,\n\nI am writing to request the cancellation of my policy POL901234. Due to recent changes in my circumstances, I will not be renewing this policy.\n\nPlease process the cancellation and provide me with a confirmation letter. I would also like to know about any refund that may be due.\n\nPlease contact me if you need any additional information.\n\nSincerely,\nThomas Anderson',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      starred: false,
      priority: 'high',
      status: 'pending',
      attachments: [],
      size: '0.6MB',
      sentiment: 'neutral',
      confidence: 0.76,
      aiIntent: 'cancellation_request',
      assignedTo: 'Sunita Patel',
      tags: ['cancellation', 'non_renewal', 'refund'],
      threadId: 'thread_009',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL901234',
        customerName: 'Manoj Gupta',
        renewalDate: '2024-02-25',
        premiumAmount: '$1,100',
        agentName: 'Sunita Patel',
        branch: 'West Branch',
        customerEmail: 'thomas.anderson@email.com',
        customerPhone: '+1-555-0369',
        policyType: 'Home Insurance',
        currentStage: 'cancellation_requested'
      },
      aiSuggestions: [
        { type: 'retention_offer', text: 'Let me see if we can offer you a better rate to retain your business.' },
        { type: 'template', name: 'Cancellation Processing' },
        { type: 'supervisor_escalation', reason: 'Customer retention opportunity' }
      ]
    },
    {
      id: 10,
      type: 'inbox',
      from: 'patricia.white@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Multiple Policy Renewal - Family Package',
      body: 'Hello,\n\nI have multiple policies with your company that are all due for renewal around the same time:\n\n1. Auto Insurance - POL012345\n2. Home Insurance - POL012346\n3. Life Insurance - POL012347\n\nCould you please prepare a combined renewal package with any available multi-policy discounts? I would appreciate a comprehensive quote.\n\nI\'m also interested in adding my teenage daughter to the auto policy.\n\nThank you for your assistance.\n\nBest regards,\nPatricia White',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      starred: true,
      priority: 'medium',
      status: 'pending',
      attachments: [],
      size: '0.9MB',
      sentiment: 'positive',
      confidence: 0.87,
      aiIntent: 'multi_policy_renewal',
      assignedTo: 'Manoj Gupta',
      tags: ['renewal', 'multi_policy', 'discount', 'family'],
      threadId: 'thread_010',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL012345',
        customerName: 'Sunita Patel',
        renewalDate: '2024-03-20',
        premiumAmount: '$2,250',
        agentName: 'Manoj Gupta',
        branch: 'Family Services Branch',
        customerEmail: 'patricia.white@email.com',
        customerPhone: '+1-555-0741',
        policyType: 'Multi-Policy Package',
        currentStage: 'quote_preparation'
      },
      aiSuggestions: [
        { type: 'quick_reply', text: 'I\'ll prepare a comprehensive multi-policy renewal package with available discounts.' },
        { type: 'template', name: 'Multi-Policy Renewal Response' },
        { type: 'discount_calculation', reason: 'Multiple policies eligible for bundle discount' }
      ]
    },
    {
      id: 11,
      type: 'outbox',
      from: 'renewals@company.com',
      to: 'daniel.garcia@email.com',
      cc: [],
      bcc: [],
      subject: 'Renewal Processing Delay - Apology and Update',
      body: 'Dear Daniel,\n\nWe sincerely apologize for the delay in processing your renewal for policy POL123450. Due to an unexpected system maintenance, we experienced some delays in our processing.\n\nYour renewal is now being expedited and will be completed by end of business today. We\'ve also applied a 5% courtesy discount to your premium as an apology for the inconvenience.\n\nUpdated Premium: $1,140 (Originally $1,200)\n\nThank you for your patience and understanding.\n\nBest regards,\nCustomer Care Team',
      date: new Date(Date.now() - 10 * 60 * 60 * 1000),
      read: true,
      starred: false,
      priority: 'high',
      status: 'sent',
      attachments: ['apology_discount_details.pdf'],
      size: '0.7MB',
      sentiment: 'apologetic',
      confidence: 0.89,
      aiIntent: 'apology_update',
      assignedTo: 'Pooja Sharma',
      tags: ['renewal', 'apology', 'delay', 'discount'],
      threadId: 'thread_011',
      deliveryStatus: 'delivered',
      openTracking: { opened: true, openCount: 1, lastOpened: new Date(Date.now() - 8 * 60 * 60 * 1000) },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL123450',
        customerName: 'Rahul Verma',
        renewalDate: '2024-02-10',
        premiumAmount: '$1,140',
        agentName: 'Pooja Sharma',
        branch: 'Customer Care Center',
        customerEmail: 'daniel.garcia@email.com',
        customerPhone: '+1-555-0852',
        policyType: 'Auto Insurance',
        currentStage: 'expedited_processing'
      }
    },
    {
      id: 12,
      type: 'inbox',
      from: 'linda.johnson@email.com',
      to: 'renewals@company.com',
      cc: [],
      bcc: [],
      subject: 'Renewal Quote Too High - Need Better Options',
      body: 'Hello,\n\nI received my renewal quote and I\'m shocked by the premium increase. It\'s gone up by almost 30% from last year!\n\nCurrent Quote: $1,690\nLast Year: $1,300\n\nI\'ve been a loyal customer for 8 years with no claims. Can you please review this and provide me with alternative options or explanations for this increase?\n\nI\'m considering switching providers if we can\'t find a better solution.\n\nRegards,\nLinda Johnson',
      date: new Date(Date.now() - 14 * 60 * 60 * 1000),
      read: false,
      starred: true,
      priority: 'high',
      status: 'urgent',
      attachments: ['current_quote.pdf', 'last_year_policy.pdf'],
      size: '1.5MB',
      sentiment: 'frustrated',
      confidence: 0.91,
      aiIntent: 'price_objection',
      assignedTo: 'Rahul Verma',
      tags: ['renewal', 'price_increase', 'retention', 'urgent'],
      threadId: 'thread_012',
      deliveryStatus: 'delivered',
      openTracking: { opened: false, openCount: 0, lastOpened: null },
      clickTracking: { clicked: false, clickCount: 0, lastClicked: null },
      renewalContext: {
        policyNumber: 'POL234561',
        customerName: 'Pooja Sharma',
        renewalDate: '2024-02-28',
        premiumAmount: '$1,690',
        agentName: 'Rahul Verma',
        branch: 'Retention Specialist Team',
        customerEmail: 'linda.johnson@email.com',
        customerPhone: '+1-555-0963',
        policyType: 'Home Insurance',
        currentStage: 'retention_required'
      },
      aiSuggestions: [
        { type: 'retention_offer', text: 'Let me review your account and find ways to reduce your premium.' },
        { type: 'template', name: 'Price Increase Explanation' },
        { type: 'manager_escalation', reason: 'High-value customer retention case' }
      ]
    }
  ], []);

  // Enhanced Templates
  const mockTemplates = useMemo(() => [
    {
      id: 'renewal_reminder',
      name: 'Renewal Reminder',
      category: 'reminders',
      subject: 'Policy Renewal Reminder - {{policyNumber}}',
      body: `Dear {{customerName}},

This is a friendly reminder that your {{policyType}} policy {{policyNumber}} is due for renewal on {{renewalDate}}.

Current Premium: {{premiumAmount}}
Agent: {{agentName}}
Branch: {{branch}}

To ensure continuous coverage, please contact us at your earliest convenience.

You can:
• Reply to this email
• Call us at {{phone}}
• Visit our {{branch}}

Thank you for your continued trust in our services.

Best regards,
{{agentName}}
{{branch}}`,
      variables: ['customerName', 'policyNumber', 'policyType', 'renewalDate', 'premiumAmount', 'agentName', 'branch', 'phone'],
      tags: ['renewal', 'reminder'],
      isActive: true,
      createdBy: 'System',
      lastModified: new Date(),
      usage: 156
    },
    {
      id: 'quote_delivery',
      name: 'Renewal Quote',
      category: 'quotes',
      subject: 'Your Renewal Quote is Ready - {{policyNumber}}',
      body: `Dear {{customerName}},

We're pleased to provide your renewal quote for policy {{policyNumber}}.

Policy Details:
• Policy Type: {{policyType}}
• Current Premium: {{currentPremium}}
• New Premium: {{newPremium}}
• Renewal Date: {{renewalDate}}
• Coverage Period: 12 months

To accept this quote:
1. Reply to this email with "ACCEPT"
2. Call us at {{phone}}
3. Visit our online portal

This quote is valid until {{quoteExpiry}}.

Thank you for choosing us for your insurance needs.

Best regards,
{{agentName}}`,
      variables: ['customerName', 'policyNumber', 'policyType', 'currentPremium', 'newPremium', 'renewalDate', 'phone', 'agentName', 'quoteExpiry'],
      tags: ['renewal', 'quote'],
      isActive: true,
      createdBy: 'Sarah Johnson',
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      usage: 89
    }
  ], []);

  // Load emails with enhanced data
  const loadEmails = useCallback(() => {
    setLoading(true);

    // Initialize Email AI Agent
    const initializeAI = async () => {
      try {
        await initializeEmailAgent();
        // Email AI Agent initialized successfully
      } catch (error) {
        console.error('Failed to initialize Email AI Agent:', error);
      }
    };

    initializeAI();

    setTimeout(() => {
      setEmails(mockEmails);
      setFilteredEmails(mockEmails);
      setTemplates(mockTemplates);

      // Generate analytics
      const analytics = {
        totalEmails: mockEmails.length,
        unreadCount: mockEmails.filter(e => !e.read && e.type === 'inbox').length,
        responseRate: 85,
        avgResponseTime: 2.5,
        topSenders: [
          { email: 'john.doe@email.com', count: 5 },
          { email: 'jane.smith@email.com', count: 3 },
          { email: 'mike.johnson@email.com', count: 2 }
        ],
        dailyVolume: [
          { date: 'Mon', received: 12, sent: 8 },
          { date: 'Tue', received: 15, sent: 11 },
          { date: 'Wed', received: 18, sent: 14 },
          { date: 'Thu', received: 14, sent: 9 },
          { date: 'Fri', received: 16, sent: 12 },
          { date: 'Sat', received: 8, sent: 5 },
          { date: 'Sun', received: 6, sent: 3 }
        ],
        sentimentDistribution: {
          positive: 45,
          neutral: 35,
          negative: 20
        }
      };

      setEmailAnalytics(analytics);
      setLoading(false);
    }, 1000);
  }, [mockEmails, mockTemplates]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  // Check AI connection status on component mount
  useEffect(() => {
    checkAIConnectionStatus();
  }, []);

  // Advanced filtering logic
  const applyFilters = useCallback(() => {
    let filtered = emails;

    // Tab filter
    if (currentTab === 0) filtered = filtered.filter(email => email.type === 'inbox');
    else if (currentTab === 1) filtered = filtered.filter(email => email.type === 'outbox');
    else if (currentTab === 2) filtered = filtered.filter(email => email.starred);
    else if (currentTab === 3) filtered = snoozedEmails;
    else if (currentTab === 4) filtered = scheduledEmails;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchLower) ||
        email.from.toLowerCase().includes(searchLower) ||
        email.to.toLowerCase().includes(searchLower) ||
        email.body.toLowerCase().includes(searchLower) ||
        email.renewalContext.policyNumber.toLowerCase().includes(searchLower) ||
        email.renewalContext.customerName.toLowerCase().includes(searchLower) ||
        email.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Advanced filters
    if (advancedFilters.dateRange.start && advancedFilters.dateRange.end) {
      filtered = filtered.filter(email =>
        email.date >= advancedFilters.dateRange.start &&
        email.date <= advancedFilters.dateRange.end
      );
    }

    if (advancedFilters.senderDomain) {
      filtered = filtered.filter(email =>
        email.from.includes(advancedFilters.senderDomain)
      );
    }

    if (advancedFilters.hasAttachments !== 'all') {
      const hasAttachments = advancedFilters.hasAttachments === 'yes';
      filtered = filtered.filter(email =>
        (email.attachments.length > 0) === hasAttachments
      );
    }

    if (advancedFilters.priority !== 'all') {
      filtered = filtered.filter(email => email.priority === advancedFilters.priority);
    }

    if (advancedFilters.status !== 'all') {
      filtered = filtered.filter(email => email.status === advancedFilters.status);
    }

    if (advancedFilters.readStatus !== 'all') {
      const isRead = advancedFilters.readStatus === 'read';
      filtered = filtered.filter(email => email.read === isRead);
    }

    if (advancedFilters.starred !== 'all') {
      const isStarred = advancedFilters.starred === 'starred';
      filtered = filtered.filter(email => email.starred === isStarred);
    }

    if (advancedFilters.assignee !== 'all') {
      filtered = filtered.filter(email => email.assignedTo === advancedFilters.assignee);
    }

    if (advancedFilters.tags.length > 0) {
      filtered = filtered.filter(email =>
        advancedFilters.tags.some(tag => email.tags.includes(tag))
      );
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

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      if (sortConfig.field === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEmails(filtered);
  }, [emails, currentTab, searchTerm, advancedFilters, sortConfig, snoozedEmails, scheduledEmails, dueDateFilter, customDateRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Email Actions
  const handleEmailSelect = (emailId) => {
    setSelectedEmails(prev =>
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleEmailView = (email) => {
    setSelectedEmail(email);
    setViewEmailDialog(true);

    // Mark as read if it's an inbox email
    if (email.type === 'inbox' && !email.read) {
      setEmails(prev => prev.map(e =>
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
  };

  const handleStarEmail = (emailId) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleDeleteEmails = () => {
    setEmails(prev => prev.filter(email => !selectedEmails.includes(email.id)));
    setSelectedEmails([]);
    showNotification('Emails deleted successfully', 'success');
  };

  const handleArchiveEmails = () => {
    setEmails(prev => prev.map(email =>
      selectedEmails.includes(email.id) ? { ...email, status: 'archived' } : email
    ));
    setSelectedEmails([]);
    showNotification('Emails archived successfully', 'success');
  };

  const handleCompose = (template = null) => {
    if (template) {
      setComposeData(prev => ({
        ...prev,
        subject: template.subject,
        body: template.body,
        template: template.name
      }));
    }
    setComposeDialog(true);
  };

  const handleReply = (email) => {
    setComposeData({
      ...composeData,
      to: email.from,
      subject: `Re: ${email.subject}`,
      renewalContext: email.renewalContext
    });
    setSelectedEmail(email);
    // Automatically analyze the email for AI assistance
    analyzeEmailWithAI(email);
    setComposeDialog(true);
  };

  const handleSendEmail = () => {
    // Mock send email
    const newEmail = {
      id: Date.now(),
      type: 'outbox',
      from: currentUser.email,
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      date: new Date(),
      read: true,
      starred: false,
      priority: composeData.priority,
      status: 'sent',
      attachments: composeData.attachments,
      renewalContext: composeData.renewalContext,
      tags: ['renewal', 'manual'],
      deliveryStatus: 'sent'
    };

    setEmails(prev => [newEmail, ...prev]);
    setComposeDialog(false);
    setComposeData({
      to: '', cc: '', bcc: '', subject: '', body: '', template: '',
      priority: 'normal', scheduledSend: false, scheduleDate: null,
      attachments: [], signature: '', trackOpens: true, trackClicks: true,
      requestReadReceipt: false,
      renewalContext: {
        policyNumber: '', customerName: '', renewalDate: '', premiumAmount: '',
        agentName: '', branch: '', customerEmail: '', customerPhone: ''
      },
      aiAssistance: {
        tone: 'professional', language: 'english',
        includePersonalization: true, suggestSubject: true
      }
    });
    showNotification('Email sent successfully', 'success');
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      case 'neutral': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  // Helper functions for AI processing
  const generateFallbackSuggestions = useCallback((analysis, email) => {
    const { contextualInfo } = analysis;

    return [{
      id: 'fallback_response',
      type: 'Professional Response',
      subject: `Re: ${email.subject}`,
      body: `Dear ${contextualInfo.customerName},

Thank you for contacting us regarding your policy ${contextualInfo.policyNumber}.

I have reviewed your inquiry and will ensure your request receives proper attention. I will get back to you shortly with the information you need.

If you have any urgent concerns, please don't hesitate to call our customer service line.

Best regards,
${contextualInfo.agentName}
Customer Service Team`,
      tone: 'professional',
      urgency: 'normal'
    }];
  }, []);

  const parseAIResponseForSuggestions = useCallback((aiResponse, analysis, email) => {
    try {
      const suggestions = [];

      // Split response into sections based on REPLY markers
      const replySections = aiResponse.split(/REPLY\s*\d+:/i).filter(section => section.trim());

      for (let i = 0; i < replySections.length && suggestions.length < 3; i++) {
        const replyContent = replySections[i].trim();

        // Skip empty sections or meta-commentary
        if (!replyContent || replyContent.length < 20) continue;

        // Clean the content - remove meta-commentary and formatting artifacts
        let cleanContent = replyContent
          .replace(/\*\*.*?Response.*?\*\*/gi, '') // Remove response type labels
          .replace(/\*\*Complete Response Summary.*$/s, '') // Remove summary sections
          .replace(/Do you want me to.*$/s, '') // Remove questions to user
          .replace(/^\s*[*\-•]\s*/gm, '') // Remove bullet points
          .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up multiple line breaks
          .trim();

        // Extract subject if present, otherwise use default
        let subject = `Re: ${email.subject}`;
        const subjectMatch = cleanContent.match(/Subject:\s*(.+?)(?:\n|$)/i);
        if (subjectMatch) {
          subject = subjectMatch[1].trim();
          cleanContent = cleanContent.replace(/Subject:\s*(.+?)(?:\n|$)/i, '').trim();
        }

        // Ensure proper email structure if missing greeting
        if (!cleanContent.toLowerCase().includes('dear ') && !cleanContent.toLowerCase().includes('hello ')) {
          const customerName = analysis.contextualInfo?.customerName || 'Customer';
          cleanContent = `Dear ${customerName},\n\n${cleanContent}`;
        }

        // Ensure proper closing if missing
        if (!cleanContent.toLowerCase().includes('regards') && !cleanContent.toLowerCase().includes('sincerely')) {
          const agentName = analysis.contextualInfo?.agentName || 'Customer Service Team';
          cleanContent += `\n\nBest regards,\n${agentName}`;
        }

        // Determine suggestion type
        let suggestionType = 'Professional Response';
        if (i === 1) suggestionType = 'Detailed Response';
        if (i === 2) suggestionType = 'Empathetic Response';

        suggestions.push({
          id: `ai_reply_${i + 1}`,
          type: suggestionType,
          subject: subject,
          body: cleanContent,
          tone: i === 2 ? 'empathetic' : 'professional',
          urgency: analysis.urgency || 'normal',
          aiEnhanced: true
        });
      }

      // If no valid replies found, create a single clean response
      if (suggestions.length === 0) {
        const cleanResponse = aiResponse
          .replace(/\*\*.*?\*\*/g, '') // Remove all bold formatting
          .replace(/Complete Response Summary.*$/s, '') // Remove summary
          .replace(/Do you want me to.*$/s, '') // Remove questions
          .trim();

        if (cleanResponse.length > 20) {
          suggestions.push({
            id: 'ai_clean_response',
            type: 'AI Response',
            subject: `Re: ${email.subject}`,
            body: cleanResponse,
            tone: 'professional',
            urgency: analysis.urgency || 'normal',
            aiEnhanced: true
          });
        }
      }

      return suggestions.length > 0 ? suggestions : generateFallbackSuggestions(analysis, email);
    } catch (error) {
      console.error('Error parsing AI suggestions:', error);
      return generateFallbackSuggestions(analysis, email);
    }
  }, [generateFallbackSuggestions]);

  // AI Assistant Functions - Fixed Implementation
  // Generate smart replies using Email AI service with streaming support
  const generateEmailSmartReplies = useCallback(async (analysis, email, onChunk = null) => {
    try {
      setAiLoading(true);
      let aiResponse = '';

      // Call the actual AI service for smart replies with streaming
      await generateEmailAIReplies(email, analysis, (chunk, fullContent) => {
        aiResponse = fullContent;
        // Pass streaming data to external callback if provided
        if (onChunk && typeof onChunk === 'function') {
          onChunk(chunk, fullContent);
        }
      });

      // Parse AI response to extract suggestions
      const suggestions = parseAIResponseForSuggestions(aiResponse, analysis, email);

      setAiSuggestions(suggestions);
      showNotification('AI-powered smart replies generated successfully', 'success');
      return aiResponse; // Return the response for further processing
    } catch (error) {
      console.error('Email AI smart replies failed:', error);
      // Fallback to basic smart replies generation
      const fallbackSuggestions = generateFallbackSuggestions(analysis, email);
      setAiSuggestions(fallbackSuggestions);
      showNotification('Using fallback AI suggestions due to service error', 'warning');
      return ''; // Return empty response on error
    } finally {
      setAiLoading(false);
    }
  }, [parseAIResponseForSuggestions, generateFallbackSuggestions]);

  const generateQuickSmartReplies = useCallback((analysis, email) => {
    // Generate immediate, template-based smart replies for instant response
    const suggestions = [];
    const { contextualInfo, sentiment, urgency } = analysis;
    const emailSubject = email?.subject || 'Your Policy Matter';

    // Quick professional response (always available)
    suggestions.push({
      id: 'quick_professional',
      type: 'Professional Response',
      subject: `Re: ${emailSubject}`,
      body: `Dear ${contextualInfo.customerName},

Thank you for contacting us regarding your policy ${contextualInfo.policyNumber}.

I have received your message and will review your request promptly. I will get back to you shortly with the information you need.

If you have any urgent concerns, please don't hesitate to call our customer service line.

Best regards,
${contextualInfo.agentName}
Customer Service Team`,
      tone: 'professional',
      urgency: 'normal',
      isQuick: true
    });

    // Sentiment-based quick responses
    if (sentiment === 'negative' || urgency === 'urgent') {
      suggestions.push({
        id: 'quick_urgent',
        type: 'Urgent Response',
        subject: `Re: ${emailSubject} - Immediate Attention`,
        body: `Dear ${contextualInfo.customerName},

Thank you for contacting us regarding your policy ${contextualInfo.policyNumber}. I understand this matter requires immediate attention.

I have prioritized your request and am personally reviewing your case. I will contact you within the next 2 hours with a detailed response.

In the meantime, if you need immediate assistance, please call our priority line.

Best regards,
${contextualInfo.agentName}
Priority Support Team`,
        tone: 'empathetic',
        urgency: 'high',
        isQuick: true
      });
    }

    if (sentiment === 'positive') {
      suggestions.push({
        id: 'quick_appreciation',
        type: 'Appreciation Response',
        subject: `Re: ${emailSubject} - Thank You`,
        body: `Dear ${contextualInfo.customerName},

Thank you for your message regarding policy ${contextualInfo.policyNumber}. We appreciate your continued trust in our services.

I will review your request and provide you with the information you need shortly.

Thank you for choosing us for your insurance needs.

Best regards,
${contextualInfo.agentName}
Customer Relations Team`,
        tone: 'appreciative',
        urgency: 'normal',
        isQuick: true
      });
    }

    // Quick acknowledgment for document/payment related emails
    if (email.body.toLowerCase().includes('document') || email.body.toLowerCase().includes('payment')) {
      suggestions.push({
        id: 'quick_document',
        type: 'Document/Payment Response',
        subject: `Re: ${emailSubject} - Processing Your Request`,
        body: `Dear ${contextualInfo.customerName},

Thank you for your message regarding policy ${contextualInfo.policyNumber}.

I have received your request and am processing the necessary documentation/payment information. I will update you on the status within 24 hours.

If you have any questions, please feel free to contact me directly.

Best regards,
${contextualInfo.agentName}
Processing Team`,
        tone: 'professional',
        urgency: 'normal',
        isQuick: true
      });
    }

    return suggestions.slice(0, 3); // Limit to 3 quick suggestions
  }, []);

  const generateFallbackAnalysis = useCallback((email) => {
    // Helper function defined inside to avoid "used before defined" issues
    const extractKeyPoints = (emailBody) => {
      const points = [];
      const lowerBody = emailBody.toLowerCase();

      if (lowerBody.includes('urgent') || lowerBody.includes('asap') || lowerBody.includes('immediately')) {
        points.push('Customer indicates urgency');
      }
      if (lowerBody.includes('renewal') || lowerBody.includes('renew')) {
        points.push('Related to policy renewal');
      }
      if (lowerBody.includes('premium') || lowerBody.includes('payment') || lowerBody.includes('cost')) {
        points.push('Premium or payment inquiry');
      }
      if (lowerBody.includes('document') || lowerBody.includes('paperwork') || lowerBody.includes('form')) {
        points.push('Documentation required');
      }
      if (lowerBody.includes('deadline') || lowerBody.includes('due date') || lowerBody.includes('expires')) {
        points.push('Time-sensitive matter');
      }
      if (lowerBody.includes('thank') || lowerBody.includes('appreciate') || lowerBody.includes('grateful')) {
        points.push('Customer expressing gratitude');
      }
      if (lowerBody.includes('problem') || lowerBody.includes('issue') || lowerBody.includes('trouble') || lowerBody.includes('error')) {
        points.push('Customer reporting an issue');
      }
      if (lowerBody.includes('cancel') || lowerBody.includes('discontinue')) {
        points.push('Cancellation request');
      }
      if (lowerBody.includes('claim') || lowerBody.includes('accident') || lowerBody.includes('damage')) {
        points.push('Claim-related inquiry');
      }

      return points.length > 0 ? points : ['General inquiry'];
    };

    return {
      sentiment: email.sentiment || 'neutral',
      confidence: 0.6,
      intent: email.aiIntent || 'general_inquiry',
      urgency: email.priority === 'high' ? 'urgent' : 'normal',
      keyPoints: extractKeyPoints(email.body),
      suggestedTone: 'professional',
      contextualInfo: {
        customerName: email.renewalContext?.customerName || 'Customer',
        policyNumber: email.renewalContext?.policyNumber || 'N/A',
        renewalDate: email.renewalContext?.renewalDate || 'N/A',
        agentName: email.renewalContext?.agentName || currentUser.name
      }
    };
  }, [currentUser.name]);

  const parseAIAnalysisResponse = useCallback((aiResponse, email) => {
    // Helper functions defined inside to avoid "used before defined" issues
    const extractFromAIResponse = (response, keywords, defaultValue) => {
      try {
        const lowerResponse = response.toLowerCase();
        for (const keyword of keywords) {
          const pattern = new RegExp(`${keyword}[:\\s]*([^\\n•-]+)`, 'i');
          const match = lowerResponse.match(pattern);
          if (match) {
            return match[1].trim().replace(/[()]/g, '');
          }
        }
        return defaultValue;
      } catch {
        return defaultValue;
      }
    };

    const extractConfidenceFromAIResponse = (response) => {
      try {
        const confidenceMatch = response.match(/(\d+)%/);
        return confidenceMatch ? parseInt(confidenceMatch[1]) / 100 : 0.8;
      } catch {
        return 0.8;
      }
    };

    const extractKeyPointsFromAIResponse = (response, originalBody) => {
      try {
        const points = [];
        const lines = response.split('\n');

        for (const line of lines) {
          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            const point = line.replace(/^[•-]\s*/, '').trim();
            if (point.length > 5) {
              points.push(point);
            }
          }
        }

        // If no bullet points found, use basic extraction
        if (points.length === 0) {
          return extractBasicKeyPoints(originalBody);
        }

        return points.slice(0, 5); // Limit to 5 key points
      } catch {
        return extractBasicKeyPoints(originalBody);
      }
    };

    const extractBasicKeyPoints = (emailBody) => {
      const points = [];
      const lowerBody = emailBody.toLowerCase();

      if (lowerBody.includes('urgent') || lowerBody.includes('asap') || lowerBody.includes('immediately')) {
        points.push('Customer indicates urgency');
      }
      if (lowerBody.includes('renewal') || lowerBody.includes('renew')) {
        points.push('Related to policy renewal');
      }
      if (lowerBody.includes('premium') || lowerBody.includes('payment') || lowerBody.includes('cost')) {
        points.push('Premium or payment inquiry');
      }
      if (lowerBody.includes('document') || lowerBody.includes('paperwork') || lowerBody.includes('form')) {
        points.push('Documentation required');
      }
      if (lowerBody.includes('deadline') || lowerBody.includes('due date') || lowerBody.includes('expires')) {
        points.push('Time-sensitive matter');
      }
      if (lowerBody.includes('thank') || lowerBody.includes('appreciate') || lowerBody.includes('grateful')) {
        points.push('Customer expressing gratitude');
      }
      if (lowerBody.includes('problem') || lowerBody.includes('issue') || lowerBody.includes('trouble') || lowerBody.includes('error')) {
        points.push('Customer reporting an issue');
      }
      if (lowerBody.includes('cancel') || lowerBody.includes('discontinue')) {
        points.push('Cancellation request');
      }
      if (lowerBody.includes('claim') || lowerBody.includes('accident') || lowerBody.includes('damage')) {
        points.push('Claim-related inquiry');
      }

      return points.length > 0 ? points : ['General inquiry'];
    };

    try {
      // Extract key information from AI response
      const sentiment = extractFromAIResponse(aiResponse, ['sentiment', 'emotion'], 'neutral');
      const confidence = extractConfidenceFromAIResponse(aiResponse);
      const intent = extractFromAIResponse(aiResponse, ['intent', 'purpose', 'goal'], 'general_inquiry');
      const urgency = extractFromAIResponse(aiResponse, ['urgency', 'priority'], 'normal');
      const keyPoints = extractKeyPointsFromAIResponse(aiResponse, email.body);
      const suggestedTone = extractFromAIResponse(aiResponse, ['tone', 'recommended tone'], 'professional');

      return {
        sentiment,
        confidence,
        intent,
        urgency,
        keyPoints,
        suggestedTone,
        contextualInfo: {
          customerName: email.renewalContext?.customerName || 'Customer',
          policyNumber: email.renewalContext?.policyNumber || 'N/A',
          renewalDate: email.renewalContext?.renewalDate || 'N/A',
          agentName: email.renewalContext?.agentName || currentUser.name
        },
        aiResponse: aiResponse.substring(0, 200) + '...' // Store excerpt of AI response
      };
    } catch (error) {
      console.error('Error parsing AI analysis response:', error);
      return generateFallbackAnalysis(email);
    }
  }, [generateFallbackAnalysis, currentUser.name]);

  const analyzeEmailWithAI = useCallback(async (email) => {
    if (!email) return;

    setCurrentAnalyzedEmail(email);
    setAiLoading(true);

    // Provide immediate fallback analysis for instant response
    const quickAnalysis = generateFallbackAnalysis(email);
    setAiAnalysis(quickAnalysis);

    // Generate quick smart replies immediately
    const quickSuggestions = generateQuickSmartReplies(quickAnalysis, email);
    setAiSuggestions(quickSuggestions);

    // Show immediate response
    showNotification('Quick analysis ready! AI enhancement in progress...', 'info');
    setAiLoading(false);

    // Run AI analysis and smart replies generation in parallel (background)
    setIsStreaming(true);
    setStreamingAnalysis('');
    setStreamingSuggestions([]);

    Promise.all([
      // Parallel task 1: Enhanced analysis with streaming
      analyzeEmail(email, (chunk, fullContent) => {
        // Real-time updates as analysis streams in
        setStreamingAnalysis(fullContent);
      }).then(aiAnalysisResponse => {
        const enhancedAnalysis = parseAIAnalysisResponse(aiAnalysisResponse, email);
        setAiAnalysis(enhancedAnalysis);
        setStreamingAnalysis(''); // Clear streaming content once complete
        return enhancedAnalysis;
      }),

      // Parallel task 2: Enhanced smart replies with streaming
      generateEmailSmartReplies(quickAnalysis, email, (chunk, fullContent) => {
        // Real-time streaming of suggestions
        if (fullContent && fullContent.length > 50) {
          // Parse partial content for progressive suggestions
          const partialSuggestions = parseAIResponseForSuggestions(fullContent, quickAnalysis, email);
          setStreamingSuggestions(partialSuggestions);
        }
      }).then(aiSuggestionsResponse => {
        const enhancedSuggestions = parseAIResponseForSuggestions(aiSuggestionsResponse, quickAnalysis, email);
        setAiSuggestions(enhancedSuggestions);
        setStreamingSuggestions([]); // Clear streaming content once complete
        return enhancedSuggestions;
      })
    ]).then(([_enhancedAnalysis, _enhancedSuggestions]) => {
      // Both tasks completed
      setIsStreaming(false);
      showNotification('🚀 AI analysis and suggestions enhanced!', 'success');
    }).catch(_error => {
      // If AI enhancement fails, keep the quick analysis
      setIsStreaming(false);
      setStreamingAnalysis('');
      setStreamingSuggestions([]);
      showNotification('Using quick analysis (AI enhancement unavailable)', 'info');
    });

    return quickAnalysis;
  }, [generateEmailSmartReplies, parseAIAnalysisResponse, generateFallbackAnalysis, generateQuickSmartReplies, parseAIResponseForSuggestions]);

  // Auto-analyze email when AI Assistant dialog opens
  useEffect(() => {
    if (aiAssistantDialog && selectedEmail && !aiAnalysis) {
      // Automatically analyze the selected email if no analysis exists
      setCurrentAnalyzedEmail(selectedEmail);
      analyzeEmailWithAI(selectedEmail);
    }
  }, [aiAssistantDialog, selectedEmail, aiAnalysis, analyzeEmailWithAI]);

  const enhanceEmailWithAI = async () => {
    // AI enhancement of current email content
    const hasMinimalContent = !composeData.body.trim() ||
      composeData.body.trim().length < 50 ||
      isOnlyGreetingAndSignature(composeData.body);

    if (hasMinimalContent) {
      // For minimal content, generate a complete professional email
      const enhancedEmail = generateProfessionalEmailContent(composeData);
      setComposeData(prev => ({
        ...prev,
        subject: enhancedEmail.subject || prev.subject,
        body: enhancedEmail.body
      }));

      showNotification('Professional email template generated! AI optimization in progress...', 'success');
    } else {
      setAiLoading(true);

      // Provide immediate basic enhancement for existing content
      const quickEnhancement = performQuickEnhancement(composeData);
      setComposeData(prev => ({
        ...prev,
        subject: quickEnhancement.subject || prev.subject,
        body: quickEnhancement.body || prev.body
      }));

      showNotification('Quick enhancement applied! AI optimization in progress...', 'info');
      setAiLoading(false);
    }

    // Continue with AI enhancement in background (for both cases)
    setTimeout(async () => {
      try {
        let enhancedContent = '';

        // Use current compose data (either enhanced or generated)
        const currentData = { ...composeData };
        if (hasMinimalContent) {
          // For minimal content, use the generated template as base
          const template = generateProfessionalEmailContent(composeData);
          currentData.body = template.body;
        }

        // Call the actual AI service for enhancement with streaming
        setIsStreaming(true);
        setStreamingAnalysis('Enhancing email content...');

        await enhanceEmailContent(currentData, (chunk, fullContent) => {
          enhancedContent = fullContent;
          // Show streaming progress for email enhancement
          setStreamingAnalysis(`Enhancing: ${fullContent.substring(0, 100)}...`);
        });

        setIsStreaming(false);
        setStreamingAnalysis('');

        // Parse the AI response to extract enhanced content
        const parsedEnhancement = parseAIEnhancementResponse(enhancedContent, currentData);

        setComposeData(prev => ({
          ...prev,
          subject: parsedEnhancement.subject || prev.subject,
          body: parsedEnhancement.body || prev.body
        }));

        showNotification('Email optimized with AI intelligence', 'success');
      } catch (error) {
        console.error('AI enhancement failed:', error);
        if (hasMinimalContent) {
          showNotification('Professional template applied (AI optimization unavailable)', 'info');
        } else {
          showNotification('Using quick enhancement (AI optimization unavailable)', 'info');
        }
      }
    }, 100);
  };

  // Helper function to check if content is only greeting and signature
  const isOnlyGreetingAndSignature = (content) => {
    const cleanContent = content.toLowerCase().trim();
    const hasGreeting = cleanContent.includes('dear') || cleanContent.includes('hello');
    const hasSignature = cleanContent.includes('regards') || cleanContent.includes('sincerely');

    // Remove common greeting and signature patterns
    const contentWithoutGreetingSignature = cleanContent
      .replace(/dear\s+[^,\n]+,?/gi, '')
      .replace(/hello\s*[^,\n]*,?/gi, '')
      .replace(/best\s+regards,?\s*[^\n]*/gi, '')
      .replace(/sincerely,?\s*[^\n]*/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // If after removing greeting/signature, very little content remains
    return hasGreeting && hasSignature && contentWithoutGreetingSignature.length < 20;
  };

  // Generate professional email content for minimal input
  const generateProfessionalEmailContent = (emailData) => {
    const customerName = emailData.renewalContext?.customerName || 'Customer';
    const policyNumber = emailData.renewalContext?.policyNumber || '';
    const agentName = emailData.renewalContext?.agentName || currentUser.name;
    const premiumAmount = emailData.renewalContext?.premiumAmount || '';
    const renewalDate = emailData.renewalContext?.renewalDate || '';

    // Generate contextual content based on available information
    let professionalContent = '';

    if (policyNumber && renewalDate) {
      professionalContent = `Thank you for contacting us regarding your policy ${policyNumber}.

I have reviewed your account and am pleased to assist you with your renewal process. Your policy is scheduled for renewal on ${renewalDate}${premiumAmount ? ` with a premium of ${premiumAmount}` : ''}.

I will ensure that your renewal is processed smoothly and efficiently. If you have any specific questions or requirements, please don't hesitate to let me know.

I will follow up with you shortly with any additional information you may need.`;
    } else if (policyNumber) {
      professionalContent = `Thank you for contacting us regarding your policy ${policyNumber}.

I have received your inquiry and am reviewing your account details. I will provide you with the information you need and ensure that any requests are handled promptly.

Please feel free to reach out if you have any additional questions or concerns.`;
    } else {
      professionalContent = `Thank you for contacting our renewal department.

I have received your message and am pleased to assist you with your insurance needs. I will review your inquiry and provide you with the appropriate information and support.

If you have any urgent concerns or specific questions, please don't hesitate to contact me directly.

I look forward to helping you with your renewal process.`;
    }

    const fullBody = `Dear ${customerName},

${professionalContent}

Best regards,
${agentName}
Customer Service Team`;

    let enhancedSubject = emailData.subject || '';
    if (!enhancedSubject && policyNumber) {
      enhancedSubject = `Re: Policy ${policyNumber} - Your Renewal Inquiry`;
    } else if (!enhancedSubject) {
      enhancedSubject = 'Re: Your Insurance Inquiry';
    }

    return {
      subject: enhancedSubject,
      body: fullBody
    };
  };

  const performQuickEnhancement = (emailData) => {
    // Quick, rule-based enhancement for immediate feedback
    let enhancedBody = emailData.body;
    let enhancedSubject = emailData.subject;

    // Basic enhancements
    if (enhancedBody) {
      // Ensure proper greeting
      if (!enhancedBody.toLowerCase().includes('dear') && !enhancedBody.toLowerCase().includes('hello')) {
        const customerName = emailData.renewalContext?.customerName || 'Customer';
        enhancedBody = `Dear ${customerName},\n\n${enhancedBody}`;
      }

      // Ensure proper closing
      if (!enhancedBody.toLowerCase().includes('regards') && !enhancedBody.toLowerCase().includes('sincerely')) {
        const agentName = emailData.renewalContext?.agentName || currentUser.name;
        enhancedBody += `\n\nBest regards,\n${agentName}`;
      }

      // Add professional touches
      enhancedBody = enhancedBody
        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
        .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Ensure proper spacing after punctuation
        .trim();
    }

    // Enhance subject line
    if (enhancedSubject && !enhancedSubject.toLowerCase().startsWith('re:')) {
      if (emailData.renewalContext?.policyNumber) {
        enhancedSubject = `${enhancedSubject} - Policy ${emailData.renewalContext.policyNumber}`;
      }
    }

    return {
      subject: enhancedSubject,
      body: enhancedBody
    };
  };

  // Helper function to parse AI enhancement response
  const parseAIEnhancementResponse = (aiResponse, originalData) => {
    try {
      if (!aiResponse || aiResponse.trim().length < 20) {
        return {
          subject: originalData.subject,
          body: originalData.body
        };
      }

      const lines = aiResponse.split('\n').filter(line => line.trim());
      let enhancedSubject = originalData.subject;
      let enhancedBody = '';
      let inBodySection = false;
      const bodyLines = [];

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Extract subject line
        if (trimmedLine.toLowerCase().includes('subject:') || trimmedLine.toLowerCase().includes('subject line:')) {
          const subjectMatch = trimmedLine.match(/subject.*?:\s*(.+)/i);
          if (subjectMatch) {
            enhancedSubject = subjectMatch[1].trim().replace(/["']/g, '');
          }
        }
        // Look for email content markers
        else if (trimmedLine.toLowerCase().includes('enhanced') &&
          (trimmedLine.toLowerCase().includes('content') || trimmedLine.toLowerCase().includes('email'))) {
          inBodySection = true;
        }
        // Look for email greeting patterns
        else if (trimmedLine.toLowerCase().startsWith('dear ') ||
          trimmedLine.toLowerCase().startsWith('hello ')) {
          inBodySection = true;
          bodyLines.push(trimmedLine);
        }
        // Collect body content
        else if (inBodySection && trimmedLine.length > 5 &&
          !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') &&
          !trimmedLine.toLowerCase().includes('analysis') &&
          !trimmedLine.toLowerCase().includes('suggestion')) {
          bodyLines.push(trimmedLine);
        }
        // Stop at analysis sections
        else if (trimmedLine.toLowerCase().includes('analysis') ||
          trimmedLine.toLowerCase().includes('key points') ||
          trimmedLine.toLowerCase().includes('suggestions')) {
          if (bodyLines.length > 0) break;
        }
      }

      // Reconstruct enhanced body
      if (bodyLines.length > 0) {
        enhancedBody = bodyLines.join('\n\n').trim();
      }

      // If no enhanced body found, try to extract the main email content
      if (!enhancedBody) {
        enhancedBody = extractEmailContentFromAIResponse(aiResponse, originalData.renewalContext);
      }

      // If enhanced body is still too short or empty, improve the original
      if (!enhancedBody || enhancedBody.length < Math.max(originalData.body.length * 0.5, 100)) {
        enhancedBody = improveOriginalContent(originalData.body, aiResponse) || originalData.body;
      }

      // Ensure the enhanced body has proper structure
      enhancedBody = ensureProperEmailStructure(enhancedBody, originalData.renewalContext);

      return {
        subject: enhancedSubject,
        body: enhancedBody
      };
    } catch (error) {
      console.error('Error parsing AI enhancement response:', error);
      return {
        subject: originalData.subject,
        body: improveOriginalContent(originalData.body, aiResponse) || originalData.body
      };
    }
  };

  // Extract email content from AI response more intelligently
  const extractEmailContentFromAIResponse = (response, contextInfo) => {
    try {
      let cleaned = response;

      // Remove AI formatting markers and metadata
      cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
      cleaned = cleaned.replace(/📧|💭|✍️|📝|🎯|🔍|💡/g, '');
      cleaned = cleaned.replace(/EMAIL ANALYSIS|CUSTOMER INSIGHTS|RESPONSE STRATEGY|ENHANCED EMAIL|AI OPTIMIZATION/gi, '');
      cleaned = cleaned.replace(/---+/g, '');

      // Look for complete email patterns first
      const emailPatterns = [
        /(Dear\s+[^,\n]+,[\s\S]*?Best regards,[\s\S]*?)/i,
        /(Hello\s+[^,\n]*,[\s\S]*?Sincerely,[\s\S]*?)/i,
        /(Dear\s+[^,\n]+,[\s\S]*?Regards,[\s\S]*?)/i
      ];

      for (const pattern of emailPatterns) {
        const emailMatch = cleaned.match(pattern);
        if (emailMatch && emailMatch[1].length > 100) {
          return emailMatch[1].trim();
        }
      }

      // If no complete email found, extract meaningful paragraphs
      const lines = cleaned.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 20 &&
          !line.toLowerCase().includes('analysis') &&
          !line.toLowerCase().includes('suggestion') &&
          !line.startsWith('•') && !line.startsWith('-'));

      if (lines.length > 2) {
        let extractedContent = lines.slice(0, 6).join('\n\n');

        // Ensure proper email structure
        if (!extractedContent.toLowerCase().includes('dear')) {
          const customerName = contextInfo?.customerName || 'Customer';
          extractedContent = `Dear ${customerName},\n\n${extractedContent}`;
        }

        if (!extractedContent.toLowerCase().includes('regards') &&
          !extractedContent.toLowerCase().includes('sincerely')) {
          const agentName = contextInfo?.agentName || 'Customer Service Team';
          extractedContent += `\n\nBest regards,\n${agentName}`;
        }

        return extractedContent;
      }

      return '';
    } catch (error) {
      console.error('Error extracting email content from AI response:', error);
      return '';
    }
  };

  // Ensure proper email structure
  const ensureProperEmailStructure = (content, contextInfo) => {
    if (!content) return content;

    let structuredContent = content.trim();

    // Ensure proper greeting
    if (!structuredContent.toLowerCase().includes('dear') &&
      !structuredContent.toLowerCase().includes('hello')) {
      const customerName = contextInfo?.customerName || 'Customer';
      structuredContent = `Dear ${customerName},\n\n${structuredContent}`;
    }

    // Ensure proper closing
    if (!structuredContent.toLowerCase().includes('regards') &&
      !structuredContent.toLowerCase().includes('sincerely')) {
      const agentName = contextInfo?.agentName || 'Customer Service Team';
      structuredContent += `\n\nBest regards,\n${agentName}`;
    }

    // Clean up excessive whitespace
    structuredContent = structuredContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .trim();

    return structuredContent;
  };



  const improveOriginalContent = (originalBody, aiResponse) => {
    try {
      // Look for improvement suggestions in AI response
      const improvements = [];
      const lines = aiResponse.split('\n');

      for (const line of lines) {
        if (line.includes('improve') || line.includes('enhance') || line.includes('better')) {
          improvements.push(line.trim());
        }
      }

      if (improvements.length > 0) {
        return originalBody + '\n\n---\nAI Enhancement Notes:\n' + improvements.slice(0, 3).join('\n');
      }

      return originalBody;
    } catch {
      return originalBody;
    }
  };

  const handleAiSuggestionSelect = (suggestion) => {
    setSelectedAiSuggestion(suggestion.id);
    setComposeData(prev => ({
      ...prev,
      subject: suggestion.subject,
      body: suggestion.body
    }));
    showNotification('AI suggestion applied to your email', 'success');
  };

  const regenerateAISuggestions = async () => {
    // Use currentAnalyzedEmail or fall back to selectedEmail
    const emailToAnalyze = currentAnalyzedEmail || selectedEmail;

    if (!emailToAnalyze) {
      showNotification('No email available for analysis. Please select an email first.', 'warning');
      return;
    }

    // Set loading state
    setAiLoading(true);

    // Clear previous suggestions but keep analysis
    setAiSuggestions([]);
    setSelectedAiSuggestion('');

    // Show loading notification
    showNotification('Generating fresh AI suggestions...', 'info');

    try {
      // Start streaming
      setIsStreaming(true);
      setStreamingAnalysis('');
      setStreamingSuggestions([]);

      // Run analysis and suggestions in parallel for maximum speed with streaming
      const [aiAnalysisResponse, aiSuggestionsResponse] = await Promise.all([
        // Fast analysis with streaming
        analyzeEmail(emailToAnalyze, (chunk, fullContent) => {
          // Real-time analysis updates
          setStreamingAnalysis(fullContent);
        }),

        // Fast suggestions with streaming
        generateEmailSmartReplies(emailToAnalyze, aiAnalysis || generateFallbackAnalysis(emailToAnalyze), (chunk, fullContent) => {
          // Real-time suggestions updates
          if (fullContent && fullContent.length > 50) {
            const partialSuggestions = parseAIResponseForSuggestions(fullContent, aiAnalysis || generateFallbackAnalysis(emailToAnalyze), emailToAnalyze);
            setStreamingSuggestions(partialSuggestions);
          }
        })
      ]);

      // Parse results in parallel
      const [enhancedAnalysis, enhancedSuggestions] = await Promise.all([
        Promise.resolve(parseAIAnalysisResponse(aiAnalysisResponse, emailToAnalyze)),
        Promise.resolve(parseAIResponseForSuggestions(aiSuggestionsResponse, aiAnalysis || generateFallbackAnalysis(emailToAnalyze), emailToAnalyze))
      ]);

      // Update UI and clear streaming
      setAiAnalysis(enhancedAnalysis);
      setAiSuggestions(enhancedSuggestions);
      setIsStreaming(false);
      setStreamingAnalysis('');
      setStreamingSuggestions([]);

      showNotification('🚀 Fresh AI suggestions generated!', 'success');
    } catch (error) {
      // Fast fallback
      showNotification(`⚠️ AI service error: ${error.message}. Using intelligent fallback.`, 'warning');

      const fallbackAnalysis = generateFallbackAnalysis(emailToAnalyze);
      setAiAnalysis(fallbackAnalysis);

      const fallbackSuggestions = generateQuickSmartReplies(fallbackAnalysis, emailToAnalyze);
      setAiSuggestions(fallbackSuggestions);
    } finally {
      setAiLoading(false);
    }
  };

  // Check AI connection status
  const checkAIConnectionStatus = async () => {
    try {
      // Test EmailBot (Email AI)
      const { testOllamaConnection: testEmailAI } = await import('../services/emailAI');
      const emailBotTest = await testEmailAI();
      setEmailBotConnected(emailBotTest.connected && emailBotTest.modelAvailable);

      // Test Renew-iQ (General AI) - Use the same robust testing approach
      const renewiqTest = await testEmailAI(); // Use the same test function
      setRenewiqConnected(renewiqTest.connected && renewiqTest.modelAvailable);


    } catch (error) {
      console.error('Connection status check failed:', error);
      setEmailBotConnected(false);
      setRenewiqConnected(false);
    }
  };

  // Test AI service connection
  const testAIConnection = async () => {
    setConnectionTesting(true);
    setAiLoading(true);
    showNotification('Testing AI service connection...', 'info');

    try {
      // Import the test function
      const { testOllamaConnection } = await import('../services/emailAI');

      // Test Ollama connection first
      const connectionTest = await testOllamaConnection();


      if (!connectionTest.connected) {
        setEmailBotConnected(false);
        setRenewiqConnected(false);
        throw new Error(`Ollama server not accessible: ${connectionTest.error}`);
      }

      if (!connectionTest.modelAvailable) {
        const availableModels = connectionTest.models?.map(m => m.name).join(', ') || 'none';
        setEmailBotConnected(false);
        setRenewiqConnected(false);
        throw new Error(`Model llama3.2:1b not available. Available models: ${availableModels}. Please run: ollama pull llama3.2:1b`);
      }

      // Test actual AI functionality
      const testEmail = {
        from: 'test@example.com',
        subject: 'Test Email',
        body: 'This is a test email to check AI service connectivity.',
        renewalContext: {
          customerName: 'Test Customer',
          policyNumber: 'TEST123',
          agentName: currentUser.name
        }
      };

      let testResponse = '';


      await analyzeEmail(testEmail, (_chunk, _fullContent) => {

        testResponse = _fullContent;
      });



      if (testResponse && testResponse.trim().length > 10) {
        // Update connection status for both agents
        setEmailBotConnected(true);
        setRenewiqConnected(true);
        showNotification('✅ AI service is working correctly!', 'success');
        return true;
      } else {
        setEmailBotConnected(false);
        setRenewiqConnected(false);
        throw new Error('AI service returned empty response - check console for details');
      }
    } catch (error) {
      console.error('🔧 AI Connection test error:', error);
      setEmailBotConnected(false);
      setRenewiqConnected(false);
      showNotification(`❌ AI service test failed: ${error.message}`, 'error');
      return false;
    } finally {
      setConnectionTesting(false);
      setAiLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Enhanced Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                Email Manager
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Advanced email management with AI-powered insights and automation
              </Typography>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Card sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="primary" fontWeight="600">
                  {emailAnalytics.totalEmails}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Emails
                </Typography>
              </Card>
              <Card sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="error" fontWeight="600">
                  {emailAnalytics.unreadCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Unread
                </Typography>
              </Card>
              <Card sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="success" fontWeight="600">
                  {emailAnalytics.responseRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Response Rate
                </Typography>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Action Bar */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search emails, policies, customers, content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: searchTerm && (
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <ClearIcon />
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Due Status</InputLabel>
                  <Select
                    value={dueDateFilter}
                    label="Due Status"
                    onChange={(e) => setDueDateFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Emails</MenuItem>
                    <MenuItem value="current">Current (30 days)</MenuItem>
                    <MenuItem value="due">Due Soon (7 days)</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Spacer to push buttons to the right */}
              <Grid item xs={0} md={3} />

              <Grid item xs={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AnalyticsIcon />}
                  onClick={() => setAnalyticsDialog(true)}
                >
                  Analytics
                </Button>
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleCompose()}
                >
                  Compose
                </Button>
              </Grid>
            </Grid>
            {dueDateFilter === 'custom' && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Start Date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="End Date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedEmails.length > 0 && (
          <Card sx={{ mb: 2, borderRadius: 3, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {selectedEmails.length} email(s) selected
                </Typography>
                <Button size="small" startIcon={<DeleteIcon />} onClick={handleDeleteEmails}>
                  Delete
                </Button>
                <Button size="small" startIcon={<ArchiveIcon />} onClick={handleArchiveEmails}>
                  Archive
                </Button>
                <Button size="small" startIcon={<AssignmentIcon />}>
                  Assign
                </Button>
                <Button size="small" startIcon={<LabelIcon />}>
                  Tag
                </Button>
                <Button size="small" onClick={() => setSelectedEmails([])}>
                  Clear Selection
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Main Content */}
        <Card sx={{ borderRadius: 3 }}>
          <AppBar position="static" color="transparent" elevation={0} sx={{ borderRadius: '12px 12px 0 0' }}>
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab
                icon={<InboxIcon />}
                label={
                  <Badge badgeContent={emailAnalytics.unreadCount} color="error">
                    Inbox
                  </Badge>
                }
                iconPosition="start"
              />
              <Tab
                icon={<OutboxIcon />}
                label={`Sent (${emails.filter(e => e.type === 'outbox').length})`}
                iconPosition="start"
              />
              <Tab
                icon={<StarIcon />}
                label={`Starred (${emails.filter(e => e.starred).length})`}
                iconPosition="start"
              />
              <Tab
                icon={<SnoozeIcon />}
                label={`Snoozed (${snoozedEmails.length})`}
                iconPosition="start"
              />
              <Tab
                icon={<ScheduleIcon />}
                label={`Scheduled (${scheduledEmails.length})`}
                iconPosition="start"
              />
            </Tabs>
          </AppBar>

          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography>Loading emails...</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedEmails.length > 0 && selectedEmails.length < filteredEmails.length}
                          checked={filteredEmails.length > 0 && selectedEmails.length === filteredEmails.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmails(filteredEmails.map(email => email.id));
                            } else {
                              setSelectedEmails([]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {currentTab === 0 ? 'From' : 'To'}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Policy</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Sentiment</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmails.map((email) => (
                      <TableRow
                        key={email.id}
                        hover
                        sx={{
                          backgroundColor: !email.read && email.type === 'inbox'
                            ? alpha(theme.palette.primary.main, 0.05)
                            : 'transparent'
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedEmails.includes(email.id)}
                            onChange={() => handleEmailSelect(email.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleStarEmail(email.id)}>
                              {email.starred ? <StarIcon color="warning" /> : <StarBorderIcon />}
                            </IconButton>
                            {email.attachments.length > 0 && (
                              <Tooltip title={`${email.attachments.length} attachments`}>
                                <AttachmentIcon fontSize="small" />
                              </Tooltip>
                            )}
                            {email.aiSuggestions && email.aiSuggestions.length > 0 && (
                              <Tooltip title="AI suggestions available">
                                <SmartToyIcon fontSize="small" color="primary" />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: !email.read && email.type === 'inbox' ? 600 : 400,
                                cursor: 'pointer'
                              }}
                              onClick={() => handleEmailView(email)}
                            >
                              {currentTab === 0 ? email.from : email.to}
                            </Typography>
                            {email.type === 'outbox' && email.deliveryStatus && (
                              <Chip
                                size="small"
                                label={email.deliveryStatus}
                                color={email.deliveryStatus === 'delivered' ? 'success' : 'default'}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: !email.read && email.type === 'inbox' ? 600 : 400,
                              cursor: 'pointer'
                            }}
                            onClick={() => handleEmailView(email)}
                          >
                            {email.subject}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            {email.tags.map(tag => (
                              <Chip key={tag} size="small" label={tag} variant="outlined" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {email.renewalContext.policyNumber}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {email.renewalContext.customerName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={<PriorityIcon />}
                            label={email.priority}
                            sx={{
                              color: getPriorityColor(email.priority),
                              borderColor: getPriorityColor(email.priority)
                            }}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {email.sentiment && (
                            <Chip
                              size="small"
                              icon={<PsychologyIcon />}
                              label={`${email.sentiment} (${Math.round(email.confidence * 100)}%)`}
                              sx={{
                                color: getSentimentColor(email.sentiment),
                                borderColor: getSentimentColor(email.sentiment)
                              }}
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {email.date.toLocaleString()}
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
                                {new Date(email.dueDate).toLocaleDateString()}
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
                            <Tooltip title="View Email">
                              <IconButton size="small" onClick={() => handleEmailView(email)}>
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {email.type === 'inbox' && (
                              <Tooltip title="Reply">
                                <IconButton size="small" onClick={() => handleReply(email)}>
                                  <ReplyIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="More Actions">
                              <IconButton size="small">
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
            )}
          </CardContent>
        </Card>

        {/* Speed Dial for Quick Actions */}
        <SpeedDial
          ariaLabel="Email Actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
        >
          <SpeedDialAction
            icon={<AddIcon />}
            tooltipTitle="Compose Email"
            onClick={() => {
              setSpeedDialOpen(false);
              handleCompose();
            }}
          />
          <SpeedDialAction
            icon={<AnalyticsIcon />}
            tooltipTitle="View Analytics"
            onClick={() => {
              setSpeedDialOpen(false);
              setAnalyticsDialog(true);
            }}
          />
          <SpeedDialAction
            icon={<AutoModeIcon />}
            tooltipTitle="Automation Rules"
            onClick={() => {
              setSpeedDialOpen(false);
              setAutomationDialog(true);
            }}
          />
          <SpeedDialAction
            icon={<SettingsIcon />}
            tooltipTitle="Settings"
            onClick={() => {
              setSpeedDialOpen(false);
              setSettingsDialog(true);
            }}
          />
        </SpeedDial>

        {/* Enhanced Compose Dialog */}
        <Dialog
          open={composeDialog}
          onClose={() => setComposeDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Compose Renewal Email</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => setTemplateDialog(true)}
                  startIcon={<EditIcon />}
                >
                  Templates
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    // Ensure we have an email context for AI assistant
                    if (selectedEmail) {
                      setCurrentAnalyzedEmail(selectedEmail);
                    }
                    setAiAssistantDialog(true);
                  }}
                  startIcon={<SmartToyIcon />}
                >
                  AI Assistant
                </Button>
                <IconButton onClick={() => setComposeDialog(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {/* Email Recipients */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="To"
                  value={composeData.to}
                  onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CC"
                  value={composeData.cc}
                  onChange={(e) => setComposeData(prev => ({ ...prev, cc: e.target.value }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="BCC"
                  value={composeData.bcc}
                  onChange={(e) => setComposeData(prev => ({ ...prev, bcc: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </Grid>

              {/* Renewal Context */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Renewal Context
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Policy Number"
                  value={composeData.renewalContext.policyNumber}
                  onChange={(e) => setComposeData(prev => ({
                    ...prev,
                    renewalContext: { ...prev.renewalContext, policyNumber: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={composeData.renewalContext.customerName}
                  onChange={(e) => setComposeData(prev => ({
                    ...prev,
                    renewalContext: { ...prev.renewalContext, customerName: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Renewal Date"
                  type="date"
                  value={composeData.renewalContext.renewalDate}
                  onChange={(e) => setComposeData(prev => ({
                    ...prev,
                    renewalContext: { ...prev.renewalContext, renewalDate: e.target.value }
                  }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Premium Amount"
                  value={composeData.renewalContext.premiumAmount}
                  onChange={(e) => setComposeData(prev => ({
                    ...prev,
                    renewalContext: { ...prev.renewalContext, premiumAmount: e.target.value }
                  }))}
                />
              </Grid>

              {/* Message Body */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Message"
                  value={composeData.body}
                  onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                />
              </Grid>

              {/* Email Options */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Email Options
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={composeData.priority}
                    onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={composeData.scheduledSend}
                      onChange={(e) => setComposeData(prev => ({ ...prev, scheduledSend: e.target.checked }))}
                    />
                  }
                  label="Schedule Send"
                />
              </Grid>

              {/* Tracking Options */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={composeData.trackOpens}
                        onChange={(e) => setComposeData(prev => ({ ...prev, trackOpens: e.target.checked }))}
                      />
                    }
                    label="Track Opens"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={composeData.trackClicks}
                        onChange={(e) => setComposeData(prev => ({ ...prev, trackClicks: e.target.checked }))}
                      />
                    }
                    label="Track Clicks"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={composeData.requestReadReceipt}
                        onChange={(e) => setComposeData(prev => ({ ...prev, requestReadReceipt: e.target.checked }))}
                      />
                    }
                    label="Read Receipt"
                  />
                </Box>
              </Grid>

              {/* Schedule Date */}
              {composeData.scheduledSend && (
                <Grid item xs={12}>
                  <DateTimePicker
                    label="Schedule Date & Time"
                    value={composeData.scheduleDate}
                    onChange={(newValue) => setComposeData(prev => ({ ...prev, scheduleDate: newValue }))}
                    slots={{ textField: TextField }}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComposeDialog(false)}>Cancel</Button>
            <Button variant="outlined" startIcon={<DraftsIcon />}>
              Save Draft
            </Button>
            <Button variant="contained" onClick={handleSendEmail} startIcon={<SendIcon />}>
              {composeData.scheduledSend ? 'Schedule Email' : 'Send Email'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced View Email Dialog */}
        <Dialog
          open={viewEmailDialog}
          onClose={() => setViewEmailDialog(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedEmail && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{selectedEmail.subject}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedEmail.aiSuggestions && selectedEmail.aiSuggestions.length > 0 && (
                      <Button
                        size="small"
                        startIcon={<SmartToyIcon />}
                        onClick={() => {
                          analyzeEmailWithAI(selectedEmail);
                          setAiAssistantDialog(true);
                        }}
                      >
                        AI Suggestions
                      </Button>
                    )}
                    <IconButton onClick={() => setViewEmailDialog(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">From:</Typography>
                      <Typography variant="body2">{selectedEmail.from}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">To:</Typography>
                      <Typography variant="body2">{selectedEmail.to}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Date:</Typography>
                      <Typography variant="body2">{selectedEmail.date.toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Priority:</Typography>
                      <Chip
                        size="small"
                        label={selectedEmail.priority}
                        sx={{ color: getPriorityColor(selectedEmail.priority) }}
                      />
                    </Grid>
                    {selectedEmail.sentiment && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">Sentiment:</Typography>
                          <Chip
                            size="small"
                            label={`${selectedEmail.sentiment} (${Math.round(selectedEmail.confidence * 100)}%)`}
                            sx={{ color: getSentimentColor(selectedEmail.sentiment) }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">AI Intent:</Typography>
                          <Typography variant="body2">{selectedEmail.aiIntent}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>

                {/* Renewal Context */}
                <Card sx={{ mb: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Renewal Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Policy Number:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedEmail.renewalContext.policyNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Customer:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedEmail.renewalContext.customerName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Renewal Date:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedEmail.renewalContext.renewalDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Premium:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedEmail.renewalContext.premiumAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Email Tracking */}
                {selectedEmail.type === 'outbox' && (
                  <Card sx={{ mb: 3, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Email Tracking
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Opens:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {selectedEmail.openTracking?.openCount || 0} times
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">Clicks:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {selectedEmail.clickTracking?.clickCount || 0} times
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedEmail.body}
                </Typography>

                {selectedEmail.attachments.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments:</Typography>
                    {selectedEmail.attachments.map((attachment, index) => (
                      <Chip
                        key={index}
                        icon={<AttachmentIcon />}
                        label={attachment}
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    ))}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewEmailDialog(false)}>Close</Button>
                <Button startIcon={<PrintIcon />}>Print</Button>
                <Button startIcon={<ForwardIcon />}>Forward</Button>
                {selectedEmail.type === 'inbox' && (
                  <Button
                    variant="contained"
                    startIcon={<ReplyIcon />}
                    onClick={() => {
                      setViewEmailDialog(false);
                      handleReply(selectedEmail);
                    }}
                  >
                    Reply
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Template Selection Dialog */}
        <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Email Templates</Typography>
              <IconButton onClick={() => setTemplateDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {templates.map((template) => (
                <Grid item xs={12} md={6} key={template.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                    onClick={() => {
                      handleCompose(template);
                      setTemplateDialog(false);
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {template.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={template.category}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {template.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Used {template.usage} times • Created by {template.createdBy}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        {template.tags.map(tag => (
                          <Chip key={tag} size="small" label={tag} variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>

        {/* Analytics Dialog */}
        <Dialog open={analyticsDialog} onClose={() => setAnalyticsDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Email Analytics Dashboard</Typography>
              <IconButton onClick={() => setAnalyticsDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Key Metrics */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Key Performance Metrics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" fontWeight="600">
                        {emailAnalytics.totalEmails}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Emails
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="error" fontWeight="600">
                        {emailAnalytics.unreadCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unread Emails
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="success" fontWeight="600">
                        {emailAnalytics.responseRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Response Rate
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="info" fontWeight="600">
                        {emailAnalytics.avgResponseTime}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Response Time
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Top Senders */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Top Senders</Typography>
                  <List>
                    {emailAnalytics.topSenders.map((sender, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={sender.email}
                          secondary={`${sender.count} emails`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>

              {/* Sentiment Distribution */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Sentiment Analysis</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success" fontWeight="600">
                          {emailAnalytics.sentimentDistribution.positive}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Positive
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info" fontWeight="600">
                          {emailAnalytics.sentimentDistribution.neutral}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Neutral
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error" fontWeight="600">
                          {emailAnalytics.sentimentDistribution.negative}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Negative
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        {/* AI Assistant Dialog */}
        <Dialog
          open={aiAssistantDialog}
          onClose={() => setAiAssistantDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SmartToyIcon color="primary" />
                <Typography variant="h6">AI Email Assistant</Typography>

                {/* AI Connection Status Indicators */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                  <Tooltip title={`EmailBot: ${emailBotConnected ? 'Connected' : 'Disconnected'}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SmartToyIcon
                        sx={{
                          fontSize: 16,
                          color: emailBotConnected ? theme.palette.info.main : theme.palette.error.main,
                          transition: 'color 0.3s ease'
                        }}
                      />
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                        EmailBot
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title={`Renew-iQ: ${renewiqConnected ? 'Connected' : 'Disconnected'}`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PsychologyIcon
                        sx={{
                          fontSize: 16,
                          color: renewiqConnected ? theme.palette.info.main : theme.palette.error.main,
                          transition: 'color 0.3s ease'
                        }}
                      />
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                        Renew-iQ
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Box>

              <IconButton onClick={() => setAiAssistantDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedEmail && (
              <Grid container spacing={3}>
                {/* Email Analysis Section */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 2, mb: 2, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PsychologyIcon color="info" />
                      Email Analysis
                    </Typography>

                    {aiAnalysis && (
                      <Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Sentiment:</Typography>
                          <Chip
                            label={`${aiAnalysis.sentiment} (${Math.round(aiAnalysis.confidence * 100)}%)`}
                            color={aiAnalysis.sentiment === 'positive' ? 'success' : aiAnalysis.sentiment === 'negative' ? 'error' : 'info'}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Intent:</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {aiAnalysis.intent.replace('_', ' ').toUpperCase()}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Urgency:</Typography>
                          <Chip
                            label={aiAnalysis.urgency}
                            color={aiAnalysis.urgency === 'urgent' ? 'error' : 'default'}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Key Points:</Typography>
                          <List dense sx={{ mt: 0.5 }}>
                            {aiAnalysis.keyPoints.map((point, index) => (
                              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                                <ListItemText
                                  primary={point}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Suggested Tone:</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                            {aiAnalysis.suggestedTone}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Card>

                  {/* AI Settings */}
                  <Card sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>AI Settings</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Response Tone</InputLabel>
                      <Select
                        value={aiSettings.tone}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, tone: e.target.value }))}
                      >
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="empathetic">Empathetic</MenuItem>
                        <MenuItem value="friendly">Friendly</MenuItem>
                        <MenuItem value="formal">Formal</MenuItem>
                        <MenuItem value="casual">Casual</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Response Style</InputLabel>
                      <Select
                        value={aiSettings.style}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, style: e.target.value }))}
                      >
                        <MenuItem value="concise">Concise</MenuItem>
                        <MenuItem value="detailed">Detailed</MenuItem>
                        <MenuItem value="formal">Formal</MenuItem>
                        <MenuItem value="conversational">Conversational</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Response Length</InputLabel>
                      <Select
                        value={aiSettings.length}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, length: e.target.value }))}
                      >
                        <MenuItem value="short">Short</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="long">Long</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiSettings.includePersonalization}
                          onChange={(e) => setAiSettings(prev => ({ ...prev, includePersonalization: e.target.checked }))}
                        />
                      }
                      label="Include Personalization"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiSettings.includeContext}
                          onChange={(e) => setAiSettings(prev => ({ ...prev, includeContext: e.target.checked }))}
                        />
                      }
                      label="Include Policy Context"
                    />
                  </Card>
                </Grid>

                {/* AI Suggestions Section */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SmartToyIcon color="primary" />
                    Smart Reply Suggestions
                  </Typography>

                  {aiSuggestions.length === 0 && !aiLoading && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          const emailToAnalyze = currentAnalyzedEmail || selectedEmail;
                          if (emailToAnalyze) {
                            setAiLoading(true);
                            setTimeout(() => {
                              analyzeEmailWithAI(emailToAnalyze);
                              setAiLoading(false);
                            }, 1000);
                          } else {
                            showNotification('Please select an email to analyze first', 'warning');
                          }
                        }}
                        startIcon={<SmartToyIcon />}
                      >
                        Generate AI Suggestions
                      </Button>
                    </Box>
                  )}

                  {aiLoading && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <LinearProgress sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        AI is analyzing the email and generating smart suggestions...
                      </Typography>
                    </Box>
                  )}

                  {/* Streaming Content Display */}
                  {isStreaming && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToyIcon />
                        AI is generating content...
                      </Typography>

                      {streamingAnalysis && (
                        <Card sx={{ mb: 2, p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                            📊 Analysis Stream:
                          </Typography>
                          <FormattedAIAnalysis text={streamingAnalysis} />
                        </Card>
                      )}

                      {streamingSuggestions.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                            💡 Suggestions Stream:
                          </Typography>
                          {streamingSuggestions.map((suggestion, index) => (
                            <Card key={`stream-${index}`} sx={{ mb: 1, p: 2, backgroundColor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.2)}` }}>
                              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'start', mb: 1 }}>
                                <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                                  {suggestion.type}
                                </Typography>
                                <Chip label="Streaming..." size="small" color="success" variant="outlined" />
                              </Box>
                              <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: 'italic' }}>
                                {suggestion.body?.substring(0, 200)}...
                              </Typography>
                            </Card>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {aiSuggestions.map((suggestion) => (
                    <Card
                      key={suggestion.id}
                      sx={{
                        mb: 2,
                        cursor: 'pointer',
                        border: selectedAiSuggestion === suggestion.id ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                        transition: 'all 0.2s',
                        backgroundColor: suggestion.isQuick ? alpha(theme.palette.info.main, 0.05) : 'background.paper',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                      onClick={() => handleAiSuggestionSelect(suggestion)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                            {suggestion.type}
                            {suggestion.isQuick && (
                              <Chip
                                label="Quick Response"
                                size="small"
                                color="info"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={suggestion.tone}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={suggestion.urgency}
                              size="small"
                              color={suggestion.urgency === 'high' ? 'error' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Subject: {suggestion.subject}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            maxHeight: '150px',
                            overflow: 'auto',
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                            p: 2,
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`
                          }}
                        >
                          {suggestion.body}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAiSuggestionSelect(suggestion)}
                            startIcon={<EditIcon />}
                          >
                            Use This Reply
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}


                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAiAssistantDialog(false)}>
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={testAIConnection}
              startIcon={connectionTesting ? <CircularProgress size={16} /> : <SettingsIcon />}
              disabled={aiLoading || connectionTesting}
              sx={{ mr: 'auto' }}
            >
              {connectionTesting ? 'Testing Connection...' : 'Test AI Connection'}
            </Button>
            <Button
              variant="outlined"
              onClick={enhanceEmailWithAI}
              startIcon={<SmartToyIcon />}
            >
              Enhance Current Email
            </Button>
            <Button
              variant="contained"
              onClick={regenerateAISuggestions}
              startIcon={<PsychologyIcon />}
              disabled={aiLoading}
            >
              {aiLoading ? 'Generating...' : 'Regenerate Suggestions'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
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
    </LocalizationProvider>
  );
};

export default RenewalEmailManager;