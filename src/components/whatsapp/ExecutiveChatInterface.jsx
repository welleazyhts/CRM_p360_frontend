import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Paper, Typography, TextField, IconButton, Avatar,
  List, ListItem, ListItemText, ListItemAvatar, Chip,
  Badge, Button, Menu, MenuItem, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, ListItemButton, Snackbar,
  useTheme, alpha
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CheckCircle as DeliveredIcon,
  Schedule as PendingIcon,
  SmartToy as BotIcon,
  PersonOutline as ManualIcon
} from '@mui/icons-material';
import whatsappBotService, { sendTemplate, testSendTemplate, getTemplates } from '../../services/whatsappBotService';

const ExecutiveChatInterface = ({ executiveId }) => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [botEnabled, setBotEnabled] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', severity: 'info' });

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    try {
      const botId = `BOT-${executiveId}`;
      const res = await getTemplates(botId);
      if (res && res.success) {
        setTemplates(res.templates || []);
      } else if (res && res.templates) {
        setTemplates(res.templates || []);
      } else {
        setTemplates([]);
      }
    } catch (err) {
      console.error('Error loading templates:', err);
      setTemplates([]);
    } finally {
      setTemplatesLoading(false);
    }
  }, [executiveId]);

  const loadActiveChats = useCallback(() => {
    // Mock active chats for the executive
    const mockChats = [
      {
        id: 1,
        customerName: 'Rajesh Kumar',
        customerNumber: '+91 98765 43210',
        lastMessage: 'I need help with my policy renewal',
        timestamp: '2025-01-12T10:30:00Z',
        unreadCount: 2,
        status: 'active'
      },
      {
        id: 2,
        customerName: 'Priya Sharma',
        customerNumber: '+91 98765 43211',
        lastMessage: 'Thank you for the quick response!',
        timestamp: '2025-01-12T09:15:00Z',
        unreadCount: 0,
        status: 'resolved'
      },
      {
        id: 3,
        customerName: 'Amit Patel',
        customerNumber: '+91 98765 43212',
        lastMessage: 'When will my claim be processed?',
        timestamp: '2025-01-12T08:45:00Z',
        unreadCount: 1,
        status: 'pending'
      }
    ];
    setActiveChats(mockChats);
    if (mockChats.length > 0) {
      setSelectedChat(mockChats[0]);
    }
  }, []);

  const loadMessages = useCallback(() => {
    if (!selectedChat) return;

    // Mock conversation messages
    const mockMessages = [
      {
        id: 1,
        text: 'Hello! I need help with my policy renewal.',
        sender: 'customer',
        timestamp: '2025-01-12T10:25:00Z',
        status: 'delivered'
      },
      {
        id: 2,
        text: 'Hello! I\'m here to help you with your policy renewal. Could you please provide your policy number?',
        sender: 'bot',
        timestamp: '2025-01-12T10:25:30Z',
        status: 'delivered',
        isAutoReply: true
      },
      {
        id: 3,
        text: 'My policy number is POL-2024-001',
        sender: 'customer',
        timestamp: '2025-01-12T10:26:00Z',
        status: 'delivered'
      },
      {
        id: 4,
        text: 'Thank you! I can see your policy details. Your renewal is due on January 20th. Would you like me to process the renewal for you?',
        sender: 'executive',
        timestamp: '2025-01-12T10:27:00Z',
        status: 'delivered'
      },
      {
        id: 5,
        text: 'Yes, please proceed with the renewal.',
        sender: 'customer',
        timestamp: '2025-01-12T10:28:00Z',
        status: 'delivered'
      }
    ];
    setMessages(mockMessages);
  }, [selectedChat]);

  useEffect(() => {
    loadActiveChats();
    loadMessages();
  }, [executiveId, loadActiveChats, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'executive',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages([...messages, message]);
    setNewMessage('');

    try {
      // Send message via WhatsApp Bot Service
      const result = await whatsappBotService.sendMessage(
        selectedChat.customerNumber,
        newMessage,
        { id: `BOT-${executiveId}`, executiveId }
      );

      if (result.success) {
        // Update message status
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        ));
      } else {
        // Handle error
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'failed' } : msg
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleBot = () => {
    setBotEnabled(!botEnabled);
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <DeliveredIcon fontSize="small" color="success" />;
      case 'pending': return <PendingIcon fontSize="small" color="warning" />;
      case 'failed': return <PendingIcon fontSize="small" color="error" />;
      default: return null;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ display: 'flex', height: '600px', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      {/* Chat List Sidebar */}
      <Box sx={{ width: 300, borderRight: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="600">
            Active Chats
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip
              icon={botEnabled ? <BotIcon /> : <ManualIcon />}
              label={botEnabled ? 'Bot Active' : 'Manual Mode'}
              color={botEnabled ? 'success' : 'warning'}
              size="small"
              onClick={toggleBot}
            />
          </Box>
        </Box>
        
        <List sx={{ p: 0, maxHeight: 500, overflow: 'auto' }}>
          {activeChats.map((chat) => (
            <ListItem
              key={chat.id}
              button
              selected={selectedChat?.id === chat.id}
              onClick={() => setSelectedChat(chat)}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <ListItemAvatar>
                <Badge badgeContent={chat.unreadCount} color="error">
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={chat.customerName}
                secondary={
                  <Box>
                    <Typography variant="body2" noWrap>
                      {chat.lastMessage}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(chat.timestamp)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Interface */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid', 
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {selectedChat.customerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedChat.customerNumber}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton>
                  <PhoneIcon />
                </IconButton>
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                  <MoreIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Bot Status Alert */}
            {botEnabled && (
              <Alert severity="info" sx={{ m: 1 }}>
                Auto-reply bot is active. Manual responses will override bot replies.
              </Alert>
            )}

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'customer' ? 'flex-start' : 'flex-end',
                    mb: 1
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      backgroundColor: message.sender === 'customer' 
                        ? theme.palette.grey[100]
                        : message.sender === 'bot'
                        ? alpha(theme.palette.info.main, 0.1)
                        : theme.palette.primary.main,
                      color: message.sender === 'executive' ? 'white' : 'inherit'
                    }}
                  >
                    <Typography variant="body2">
                      {message.text}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatTime(message.timestamp)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {message.isAutoReply && (
                          <Chip label="Bot" size="small" color="info" sx={{ height: 16, fontSize: '0.6rem' }} />
                        )}
                        {message.sender !== 'customer' && getMessageStatusIcon(message.status)}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                />
                <IconButton>
                  <AttachIcon />
                </IconButton>
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'grey.300' }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => setMenuAnchor(null)}>
            View Customer Profile
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            Transfer Chat
          </MenuItem>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            End Conversation
          </MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); setTemplatesDialogOpen(true); loadTemplates(); }}>
            Templates
          </MenuItem>
        </Menu>

        {/* Templates Picker Dialog */}
        <Dialog open={templatesDialogOpen} onClose={() => setTemplatesDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Templates</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Select a template and send to the selected chat.</Typography>
            </Box>
            <List>
              {templatesLoading && (
                <ListItem>
                  <ListItemText primary="Loading templates..." />
                </ListItem>
              )}
              {!templatesLoading && templates.length === 0 && (
                <ListItem>
                  <ListItemText primary="No templates available" />
                </ListItem>
              )}
              {templates.map((tpl) => (
                <ListItemButton key={tpl.name} selected={selectedTemplate?.name === tpl.name} onClick={() => setSelectedTemplate(tpl)}>
                  <ListItemText primary={tpl.name} secondary={tpl.description || tpl.language} />
                </ListItemButton>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTemplatesDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              disabled={!selectedTemplate || !selectedChat}
              onClick={async () => {
                if (!selectedTemplate || !selectedChat) return;
                setTemplatesLoading(true);
                try {
                  const payload = {
                    templateName: selectedTemplate.name,
                    to: selectedChat.customerNumber,
                    language: selectedTemplate.language || 'en',
                    components: selectedTemplate.components || [{ type: 'body', text: `Hello ${selectedChat.customerName}` }]
                  };
                  const testRes = await testSendTemplate(`BOT-${executiveId}`, payload);
                  if (!testRes.success) {
                    setSnackbarState({ open: true, message: `Template validation failed: ${testRes.error}`, severity: 'error' });
                    setTemplatesLoading(false);
                    return;
                  }
                  const sendRes = await sendTemplate(`BOT-${executiveId}`, payload);
                  if (sendRes.success) {
                    setSnackbarState({ open: true, message: 'Template sent', severity: 'success' });
                  } else {
                    setSnackbarState({ open: true, message: `Send failed: ${sendRes.error || sendRes.details}`, severity: 'error' });
                  }
                  setTemplatesDialogOpen(false);
                } catch (err) {
                  console.error('Template send error:', err);
                  setSnackbarState({ open: true, message: 'Template send error', severity: 'error' });
                } finally {
                  setTemplatesLoading(false);
                }
              }}
            >
              Send Template
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for template/send feedback */}
        <Snackbar open={snackbarState.open} autoHideDuration={6000} onClose={() => setSnackbarState({ ...snackbarState, open: false })}>
          <Alert onClose={() => setSnackbarState({ ...snackbarState, open: false })} severity={snackbarState.severity} sx={{ width: '100%' }}>
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ExecutiveChatInterface;