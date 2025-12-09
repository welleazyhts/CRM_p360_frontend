import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, useTheme, alpha, IconButton, Avatar,
  Paper, List, ListItem, ListItemText, ListItemIcon,
  Badge, LinearProgress, Fab
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon, Send as SendIcon,
  AttachFile as AttachFileIcon, Image as ImageIcon, Description as DescriptionIcon,
  Search as SearchIcon, MoreVert as MoreVertIcon, Close as CloseIcon, Add as AddIcon,
  Info as InfoIcon, Star as StarIcon, StarBorder as StarBorderIcon, Edit as EditIcon,
  DoneAll as DoneAllIcon, Done as DoneIcon, Schedule as ClockIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.js';

const RenewalWhatsAppManager = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  // State Management
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  // Chat States
  const [newMessage, setNewMessage] = useState('');

  // Dialog States
  const [newChatDialog, setNewChatDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [chatInfoDialog, setChatInfoDialog] = useState(false);
  const [editDetailsDialog, setEditDetailsDialog] = useState(false);
  const [attachmentDialog, setAttachmentDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);

  // Edit Details Data
  const [editData, setEditData] = useState({
    customerName: '',
    phoneNumber: '',
    policyNumber: '',
    renewalDate: '',
    premiumAmount: '',
    stage: '',
    priority: '',
    agentAssigned: ''
  });

  // Attachment Data
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachmentCaption, setAttachmentCaption] = useState('');

  // Image Data  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // New Chat Data
  const [newChatData, setNewChatData] = useState({
    phoneNumber: '',
    customerName: '',
    policyNumber: '',
    renewalDate: '',
    premiumAmount: '',
    initialMessage: ''
  });



  // Mock chat data with renewal context
  const loadChats = useCallback(() => {
    setLoading(true);
    const mockChats = [
      {
        id: 1,
        phoneNumber: '+91-9876543210',
        customerName: 'Rajesh Kumar',
        lastMessage: 'Thank you for the renewal reminder. I need to update my address first.',
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 2,
        status: 'active',
        priority: 'high',
        starred: false,
        renewalContext: {
          policyNumber: 'POL123456',
          renewalDate: '2024-02-15',
          premiumAmount: '₹12,500',
          stage: 'documentation',
          lastPayment: '2023-02-15',
          daysToRenewal: 15
        },
        tags: ['renewal', 'documentation', 'address-update'],
        agentAssigned: 'agent@company.com',
        messages: [
          {
            id: 1,
            sender: 'agent',
            message: 'Hello Rajesh! Your policy POL123456 is due for renewal on Feb 15. Premium: ₹12,500. Would you like to proceed?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            sender: 'customer',
            message: 'Hi, yes I want to renew. But I need to update my address.',
            timestamp: new Date(Date.now() - 90 * 60 * 1000),
            type: 'text',
            status: 'delivered'
          },
          {
            id: 3,
            sender: 'agent',
            message: 'Sure! Please share your new address details. I can help you update it.',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            type: 'text',
            status: 'read'
          },
          {
            id: 4,
            sender: 'customer',
            message: 'Thank you for the renewal reminder. I need to update my address first.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            type: 'text',
            status: 'delivered'
          }
        ]
      },
      {
        id: 2,
        phoneNumber: '+91-9876543211',
        customerName: 'Priya Sharma',
        lastMessage: 'Payment completed! When will I receive the renewed policy?',
        lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
        unreadCount: 1,
        status: 'completed',
        priority: 'normal',
        starred: true,
        renewalContext: {
          policyNumber: 'POL789012',
          renewalDate: '2024-02-10',
          premiumAmount: '₹8,900',
          stage: 'payment-completed',
          lastPayment: '2024-01-30',
          daysToRenewal: 10
        },
        tags: ['renewal', 'payment-completed'],
        agentAssigned: 'agent2@company.com',
        messages: [
          {
            id: 1,
            sender: 'agent',
            message: 'Hello Priya! Your policy renewal is due. Premium: ₹8,900. Click here to pay: [Payment Link]',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            sender: 'customer',
            message: 'Payment completed! When will I receive the renewed policy?',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            type: 'text',
            status: 'delivered'
          }
        ]
      },
      {
        id: 3,
        phoneNumber: '+91-9876543212',
        customerName: 'Amit Patel',
        lastMessage: 'I\'m not interested in renewing this year.',
        lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        unreadCount: 0,
        status: 'declined',
        priority: 'low',
        starred: false,
        renewalContext: {
          policyNumber: 'POL345678',
          renewalDate: '2024-02-20',
          premiumAmount: '₹15,600',
          stage: 'declined',
          lastPayment: '2023-02-20',
          daysToRenewal: 20
        },
        tags: ['renewal', 'declined', 'follow-up'],
        agentAssigned: 'agent@company.com',
        messages: [
          {
            id: 1,
            sender: 'agent',
            message: 'Hi Amit! Time to renew your policy POL345678. Special discount available!',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            sender: 'customer',
            message: 'I\'m not interested in renewing this year.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            type: 'text',
            status: 'delivered'
          }
        ]
      }
    ];

    setTimeout(() => {
      setChats(mockChats);
      setFilteredChats(mockChats);
      setActiveChat(mockChats[0]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Filter chats
  const filterChats = useCallback(() => {
    let filtered = chats;

    if (searchTerm) {
      filtered = filtered.filter(chat =>
        chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.phoneNumber.includes(searchTerm) ||
        chat.renewalContext.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(chat => chat.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(chat => chat.priority === priorityFilter);
    }

    setFilteredChats(filtered);
  }, [chats, searchTerm, statusFilter, priorityFilter]);

  useEffect(() => {
    filterChats();
  }, [filterChats]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages]);

  // Chat Actions
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      sender: 'agent',
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setChats(prev => prev.map(chat =>
      chat.id === activeChat.id
        ? {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date()
        }
        : chat
    ));

    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date()
    }));

    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);

    // Mark as read
    if (chat.unreadCount > 0) {
      setChats(prev => prev.map(c =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      ));
    }
  };

  const handleStarChat = (chatId) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
    ));
    // Update activeChat if it's the current one
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(prev => ({ ...prev, starred: !prev.starred }));
    }
  };

  // Handle Edit Details Dialog Open
  const handleOpenEditDetails = () => {
    if (activeChat) {
      setEditData({
        customerName: activeChat.customerName,
        phoneNumber: activeChat.phoneNumber,
        policyNumber: activeChat.renewalContext.policyNumber,
        renewalDate: activeChat.renewalContext.renewalDate,
        premiumAmount: activeChat.renewalContext.premiumAmount,
        stage: activeChat.renewalContext.stage,
        priority: activeChat.priority,
        agentAssigned: activeChat.agentAssigned
      });
      setEditDetailsDialog(true);
      setChatInfoDialog(false);
    }
  };

  // Handle Save Edit Details
  const handleSaveEditDetails = () => {
    if (activeChat) {
      const updatedChat = {
        ...activeChat,
        customerName: editData.customerName,
        phoneNumber: editData.phoneNumber,
        priority: editData.priority,
        agentAssigned: editData.agentAssigned,
        renewalContext: {
          ...activeChat.renewalContext,
          policyNumber: editData.policyNumber,
          renewalDate: editData.renewalDate,
          premiumAmount: editData.premiumAmount,
          stage: editData.stage,
          daysToRenewal: Math.ceil((new Date(editData.renewalDate) - new Date()) / (1000 * 60 * 60 * 24))
        }
      };

      setChats(prev => prev.map(chat =>
        chat.id === activeChat.id ? updatedChat : chat
      ));
      setActiveChat(updatedChat);
      setEditDetailsDialog(false);
    }
  };

  // Handle Attachment Selection
  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedAttachment(file);
    }
  };

  // Handle Send Attachment
  const handleSendAttachment = () => {
    if (!selectedAttachment || !activeChat) return;

    const message = {
      id: Date.now(),
      sender: 'agent',
      message: attachmentCaption || `📎 ${selectedAttachment.name}`,
      timestamp: new Date(),
      type: 'attachment',
      status: 'sent',
      attachment: {
        name: selectedAttachment.name,
        size: selectedAttachment.size,
        type: selectedAttachment.type
      }
    };

    setChats(prev => prev.map(chat =>
      chat.id === activeChat.id
        ? {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: `📎 ${selectedAttachment.name}`,
          lastMessageTime: new Date()
        }
        : chat
    ));

    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: `📎 ${selectedAttachment.name}`,
      lastMessageTime: new Date()
    }));

    setAttachmentDialog(false);
    setSelectedAttachment(null);
    setAttachmentCaption('');
  };

  // Handle Image Selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Send Image
  const handleSendImage = () => {
    if (!selectedImage || !activeChat) return;

    const message = {
      id: Date.now(),
      sender: 'agent',
      message: imageCaption || `📷 Image`,
      timestamp: new Date(),
      type: 'image',
      status: 'sent',
      image: {
        name: selectedImage.name,
        size: selectedImage.size,
        preview: imagePreview
      }
    };

    setChats(prev => prev.map(chat =>
      chat.id === activeChat.id
        ? {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: `📷 Image`,
          lastMessageTime: new Date()
        }
        : chat
    ));

    setActiveChat(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: `📷 Image`,
      lastMessageTime: new Date()
    }));

    setImageDialog(false);
    setSelectedImage(null);
    setImageCaption('');
    setImagePreview(null);
  };



  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      phoneNumber: newChatData.phoneNumber,
      customerName: newChatData.customerName,
      lastMessage: newChatData.initialMessage,
      lastMessageTime: new Date(),
      unreadCount: 0,
      status: 'active',
      priority: 'normal',
      starred: false,
      renewalContext: {
        policyNumber: newChatData.policyNumber,
        renewalDate: newChatData.renewalDate,
        premiumAmount: newChatData.premiumAmount,
        stage: 'initiated',
        daysToRenewal: Math.ceil((new Date(newChatData.renewalDate) - new Date()) / (1000 * 60 * 60 * 24))
      },
      tags: ['renewal', 'new'],
      agentAssigned: currentUser.email,
      messages: [
        {
          id: 1,
          sender: 'agent',
          message: newChatData.initialMessage,
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setNewChatDialog(false);
    setNewChatData({
      phoneNumber: '', customerName: '', policyNumber: '',
      renewalDate: '', premiumAmount: '', initialMessage: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'completed': return theme.palette.primary.main;
      case 'declined': return theme.palette.error.main;
      case 'pending': return theme.palette.warning.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sent': return <DoneIcon fontSize="small" />;
      case 'delivered': return <DoneAllIcon fontSize="small" />;
      case 'read': return <DoneAllIcon fontSize="small" color="primary" />;
      default: return <ClockIcon fontSize="small" />;
    }
  };

  const mockTemplates = [
    {
      name: 'Renewal Reminder',
      message: 'Hi [Customer Name]! Your policy [Policy Number] is due for renewal on [Renewal Date]. Premium: [Premium Amount]. Would you like to proceed with the renewal?'
    },
    {
      name: 'Payment Link',
      message: 'Thank you for choosing to renew! Here\'s your payment link: [Payment Link]. Amount: [Premium Amount]. Complete payment to activate your renewed policy.'
    },
    {
      name: 'Documentation Request',
      message: 'To complete your renewal, we need the following documents:\n1. Updated vehicle registration\n2. Current driving license\n3. No-claims certificate\n\nPlease share these at your earliest convenience.'
    },
    {
      name: 'Renewal Completed',
      message: 'Congratulations! Your policy [Policy Number] has been successfully renewed. Your new policy period is from [Start Date] to [End Date]. Thank you for your continued trust!'
    }
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          WhatsApp Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all renewal conversations and automated messaging
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Chat List Sidebar */}
        <Card sx={{ width: 400, mr: 2, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
          {/* Chat List Header */}
          <CardContent sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <IconButton size="small" onClick={() => setNewChatDialog(true)}>
                <AddIcon />
              </IconButton>
            </Box>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={statusFilter}
                    label="Status"            
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="declined">Declined</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel id="priority-filter-label">Priority</InputLabel>
                  <Select
                    labelId="priority-filter-label"
                    id="priority-filter"
                    value={priorityFilter}
                    label="Priority"     // 👈 Required for proper label notch
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
          </CardContent>

          {/* Chat List */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <LinearProgress sx={{ mb: 2 }} />
                <Typography>Loading chats...</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredChats.map((chat) => (
                  <ListItem
                    key={chat.id}
                    button
                    selected={activeChat?.id === chat.id}
                    onClick={() => handleChatSelect(chat)}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <WhatsAppIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {chat.customerName}
                            </Typography>
                            <Chip
                              size="small"
                              label={chat.priority}
                              sx={{
                                height: 16,
                                fontSize: '0.7rem',
                                color: getPriorityColor(chat.priority),
                                borderColor: getPriorityColor(chat.priority)
                              }}
                              variant="outlined"
                            />
                            {chat.starred && <StarIcon fontSize="small" color="warning" />}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {chat.phoneNumber} • {chat.renewalContext.policyNumber}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            {chat.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                          {chat.unreadCount > 0 && (
                            <Badge
                              badgeContent={chat.unreadCount}
                              color="primary"
                              sx={{ display: 'block', mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 1
                      }}>
                        {chat.lastMessage}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          size="small"
                          label={chat.status}
                          sx={{
                            height: 18,
                            fontSize: '0.7rem',
                            color: getStatusColor(chat.status),
                            borderColor: getStatusColor(chat.status)
                          }}
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Renewal in {chat.renewalContext.daysToRenewal} days
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Card>

        {/* Chat Area */}
        <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <CardContent sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <WhatsAppIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {activeChat.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activeChat.phoneNumber} • Policy: {activeChat.renewalContext.policyNumber}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleStarChat(activeChat.id)}>
                      {activeChat.starred ? <StarIcon color="warning" /> : <StarBorderIcon />}
                    </IconButton>
                    <IconButton onClick={() => setChatInfoDialog(true)}>
                      <InfoIcon />
                    </IconButton>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Renewal Info Bar */}
                <Paper
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderLeft: 4,
                    borderLeftColor: 'primary.main'
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Renewal Date</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activeChat.renewalContext.renewalDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Premium</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activeChat.renewalContext.premiumAmount}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Days Left</Typography>
                      <Typography variant="body2" sx={{
                        fontWeight: 500, color:
                          activeChat.renewalContext.daysToRenewal <= 7 ? 'error.main' : 'text.primary'
                      }}>
                        {activeChat.renewalContext.daysToRenewal} days
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Stage</Typography>
                      <Chip
                        size="small"
                        label={activeChat.renewalContext.stage}
                        color={activeChat.renewalContext.stage === 'completed' ? 'success' : 'default'}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </CardContent>

              {/* Messages Area */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {activeChat.messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'agent' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        backgroundColor: message.sender === 'agent'
                          ? 'primary.main'
                          : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                        color: message.sender === 'agent' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.message}
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1,
                        justifyContent: message.sender === 'agent' ? 'flex-end' : 'flex-start'
                      }}>
                        <Typography variant="caption" sx={{
                          color: message.sender === 'agent' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                        }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {message.sender === 'agent' && (
                          <Box sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {getMessageStatus(message.status)}
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <CardContent sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small" onClick={() => setAttachmentDialog(true)}>
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setImageDialog(true)}>
                    <ImageIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{ mx: 1 }}
                  />
                  <IconButton size="small" onClick={() => setTemplateDialog(true)}>
                    <DescriptionIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    sx={{ color: 'primary.main' }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </>
          ) : (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}>
              <WhatsAppIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Card>
      </Box>

      {/* New Chat Dialog */}
      <Dialog open={newChatDialog} onClose={() => setNewChatDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Start New Renewal Chat</Typography>
            <IconButton onClick={() => setNewChatDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newChatData.phoneNumber}
                onChange={(e) => setNewChatData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+91-9876543210"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newChatData.customerName}
                onChange={(e) => setNewChatData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Policy Number"
                value={newChatData.policyNumber}
                onChange={(e) => setNewChatData(prev => ({ ...prev, policyNumber: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Premium Amount"
                value={newChatData.premiumAmount}
                onChange={(e) => setNewChatData(prev => ({ ...prev, premiumAmount: e.target.value }))}
                placeholder="₹12,500"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Renewal Date"
                type="date"
                value={newChatData.renewalDate}
                onChange={(e) => setNewChatData(prev => ({ ...prev, renewalDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Initial Message"
                value={newChatData.initialMessage}
                onChange={(e) => setNewChatData(prev => ({ ...prev, initialMessage: e.target.value }))}
                placeholder="Hi! Your policy renewal is due soon..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewChatDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleNewChat} startIcon={<SendIcon />}>
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">WhatsApp Templates</Typography>
            <IconButton onClick={() => setTemplateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {mockTemplates.map((template, index) => (
              <ListItem
                key={index}
                button
                onClick={() => {
                  setNewMessage(template.message);
                  setTemplateDialog(false);
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary={template.name}
                  secondary={template.message.substring(0, 100) + '...'}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Chat Info Dialog */}
      <Dialog open={chatInfoDialog} onClose={() => setChatInfoDialog(false)} maxWidth="sm" fullWidth>
        {activeChat && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Chat Information</Typography>
                <IconButton onClick={() => setChatInfoDialog(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Customer Name</Typography>
                  <Typography variant="body2">{activeChat.customerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                  <Typography variant="body2">{activeChat.phoneNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Policy Number</Typography>
                  <Typography variant="body2">{activeChat.renewalContext.policyNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Premium Amount</Typography>
                  <Typography variant="body2">{activeChat.renewalContext.premiumAmount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Renewal Date</Typography>
                  <Typography variant="body2">{activeChat.renewalContext.renewalDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Days to Renewal</Typography>
                  <Typography variant="body2">{activeChat.renewalContext.daysToRenewal} days</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Current Stage</Typography>
                  <Chip size="small" label={activeChat.renewalContext.stage} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Assigned Agent</Typography>
                  <Typography variant="body2">{activeChat.agentAssigned}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    {activeChat.tags.map(tag => (
                      <Chip key={tag} size="small" label={tag} variant="outlined" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setChatInfoDialog(false)}>Close</Button>
              <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpenEditDetails}>
                Edit Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Details Dialog */}
      <Dialog open={editDetailsDialog} onClose={() => setEditDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Edit Chat Details</Typography>
            <IconButton onClick={() => setEditDetailsDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={editData.customerName}
                onChange={(e) => setEditData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editData.phoneNumber}
                onChange={(e) => setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Policy Number"
                value={editData.policyNumber}
                onChange={(e) => setEditData(prev => ({ ...prev, policyNumber: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Premium Amount"
                value={editData.premiumAmount}
                onChange={(e) => setEditData(prev => ({ ...prev, premiumAmount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Renewal Date"
                type="date"
                value={editData.renewalDate}
                onChange={(e) => setEditData(prev => ({ ...prev, renewalDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Stage</InputLabel>
                <Select
                  value={editData.stage}
                  label="Stage"
                  onChange={(e) => setEditData(prev => ({ ...prev, stage: e.target.value }))}
                >
                  <MenuItem value="initiated">Initiated</MenuItem>
                  <MenuItem value="documentation">Documentation</MenuItem>
                  <MenuItem value="payment-pending">Payment Pending</MenuItem>
                  <MenuItem value="payment-completed">Payment Completed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editData.priority}
                  label="Priority"
                  onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Assigned Agent"
                value={editData.agentAssigned}
                onChange={(e) => setEditData(prev => ({ ...prev, agentAssigned: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDetailsDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditDetails}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attachment Dialog */}
      <Dialog open={attachmentDialog} onClose={() => setAttachmentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Send Attachment</Typography>
            <IconButton onClick={() => setAttachmentDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{ py: 2 }}
            >
              {selectedAttachment ? selectedAttachment.name : 'Choose File'}
              <input
                type="file"
                hidden
                onChange={handleAttachmentChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
              />
            </Button>
            {selectedAttachment && (
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="500">{selectedAttachment.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedAttachment.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="Caption (Optional)"
              value={attachmentCaption}
              onChange={(e) => setAttachmentCaption(e.target.value)}
              placeholder="Add a caption for this attachment..."
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAttachmentDialog(false);
            setSelectedAttachment(null);
            setAttachmentCaption('');
          }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendAttachment}
            disabled={!selectedAttachment}
            startIcon={<SendIcon />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialog} onClose={() => setImageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Send Image</Typography>
            <IconButton onClick={() => setImageDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ py: 2 }}
            >
              {selectedImage ? selectedImage.name : 'Choose Image'}
              <input
                type="file"
                hidden
                onChange={handleImageChange}
                accept="image/*"
              />
            </Button>
            {imagePreview && (
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {selectedImage?.name} - {(selectedImage?.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="Caption (Optional)"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Add a caption for this image..."
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setImageDialog(false);
            setSelectedImage(null);
            setImageCaption('');
            setImagePreview(null);
          }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendImage}
            disabled={!selectedImage}
            startIcon={<SendIcon />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RenewalWhatsAppManager; 