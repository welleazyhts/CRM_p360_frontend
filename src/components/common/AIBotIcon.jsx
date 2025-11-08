import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
  Avatar,
  Alert,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import {
  SmartToy as AskAIIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  FileDownload as FileDownloadIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { initializeRenewalAgent, sendMessage } from '../../services/iRenewalAI';
import { useAuth } from '../../context/AuthContext';

const AIBotIcon = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentInitialized, setAgentInitialized] = useState(false);
  const [agentError, setAgentError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const location = useLocation();
  const theme = useTheme();
  const { currentUser } = useAuth();

  // Initialize AI agent on component mount
  useEffect(() => {
    const initializeAgent = async () => {
      try {
        await initializeRenewalAgent();
        setAgentInitialized(true);
        setAgentError('');
      } catch (error) {
        console.error('Failed to initialize AI agent:', error);
        setAgentError(`Failed to initialize AI: ${error.message}`);
        setAgentInitialized(false);
      }
    };

    initializeAgent();
  }, []);

  // Get page context information based on current location
  const getPageContext = (pathname) => {
    const pageContexts = {
      '/dashboard': { name: 'Dashboard', context: 'renewal performance overview and metrics' },
      '/upload': { name: 'Upload', context: 'file uploads and data processing' },
      '/cases': { name: 'Case Tracking', context: 'case management and workflow' },
      '/closed-cases': { name: 'Closed Cases', context: 'archived cases and performance analysis' },
      '/policy-timeline': { name: 'Policy Timeline', context: 'policy lifecycle and renewal timing' },
      '/logs': { name: 'Case Logs', context: 'activity logs and system events' },
      '/renewals/email-manager': { name: 'Email Manager', context: 'email campaigns and communication' },
      '/renewals/whatsapp-manager': { name: 'WhatsApp Manager', context: 'WhatsApp messaging and automation' },
      '/emails': { name: 'Email Dashboard', context: 'email performance and inbox management' },
      '/whatsapp-flow': { name: 'WhatsApp Flow', context: 'WhatsApp automation and flow building' },
      '/campaigns': { name: 'Campaign Management', context: 'marketing campaigns and performance' },
      '/billing': { name: 'Billing', context: 'payment processing and collection' },
      '/lead-management': { name: 'Lead Management', context: 'lead tracking and conversion' },
      '/customer-management/customer-database': { name: 'Customer Database', context: 'customer information and management' },
      '/customer-management/contact-database': { name: 'Contact Database', context: 'contact management and communication' },
      '/feedback': { name: 'Feedback & Surveys', context: 'customer feedback and survey management' },
      '/claims': { name: 'Claims', context: 'claims processing and management' },
      '/settings': { name: 'Settings', context: 'system configuration and preferences' },
      '/profile': { name: 'Profile', context: 'user profile and account settings' },
      '/users': { name: 'Users', context: 'user management and permissions' }
    };

    // Extract page name from pathname
    const getPageNameFromPath = (pathname) => {
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length === 0) return 'Dashboard';
      
      const lastSegment = segments[segments.length - 1];
      return lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return pageContexts[pathname] || {
      name: getPageNameFromPath(pathname),
      context: 'general system operations and management'
    };
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setIsLoading(false);
    setIsStreaming(false);
  };

  const handleSendQuery = async () => {
    if (!query.trim() || !agentInitialized) return;
    
    setIsLoading(true);
    setIsStreaming(true);
    
    // Add user message to chat history
    const userMessage = { type: 'user', content: query, timestamp: new Date() };
    const aiMessage = { type: 'ai', content: '', timestamp: new Date(), streaming: true };
    
    setChatHistory(prev => [...prev, userMessage, aiMessage]);
    
    // Clear the input
    const currentQuery = query;
    setQuery('');
    
    try {
      // Get current page context
      const pageContext = getPageContext(location.pathname);
      
      // Enhanced query with page-specific context
      const queryToSend = `
CURRENT PAGE CONTEXT:
Page: ${pageContext.name}
Context: ${pageContext.context}

USER QUERY: ${currentQuery}

Please provide a response specifically relevant to the ${pageContext.name} page context.`;
      
      const response = await sendMessage(queryToSend, chatHistory, (chunk, fullContent) => {
        // Update the last AI message with streaming content
        setChatHistory(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex] && updated[lastIndex].type === 'ai') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: fullContent,
              streaming: true
            };
          }
          return updated;
        });
      });
      
      // Mark streaming as complete
      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].type === 'ai') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: response.message.content,
            streaming: false
          };
        }
        return updated;
      });
      
    } catch (error) {
      console.error('AI query failed:', error);
      const errorMessage = `Error: ${error.message}`;
      
      // Update the last AI message with error
      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].type === 'ai') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: errorMessage,
            streaming: false
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleExportChat = () => {
    if (chatHistory.length === 0) return;
    
    const chatContent = chatHistory.map((message) => {
      const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : '';
      const sender = message.type === 'user' ? 'User' : 'AI Assistant';
      return `[${timestamp}] ${sender}: ${message.content}`;
    }).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleEmailChat = () => {
    if (chatHistory.length === 0) return;
    
    const chatContent = chatHistory.map((message) => {
      const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : '';
      const sender = message.type === 'user' ? 'User' : 'AI Assistant';
      return `[${timestamp}] ${sender}: ${message.content}`;
    }).join('\n\n');
    
    const subject = `AI Chat Export - ${new Date().toLocaleDateString()}`;
    const body = `AI Chat Session Export\n\nDate: ${new Date().toLocaleString()}\nUser: ${currentUser?.name || 'Unknown'}\n\n--- Chat History ---\n\n${chatContent}`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  // Function to render text with inline formatting
  const renderTextWithFormatting = (text) => {
    if (!text) return '';
    
    const parts = text.split(/(\\*\\*[^*]+\\*\\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        const boldText = part.replace(/^\\*\\*|\\*\\*$/g, '');
        if (boldText.trim()) {
          return (
            <Box
              key={index}
              component="span"
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              {boldText}
            </Box>
          );
        }
      }
      return part || null;
    }).filter(Boolean);
  };

  const pageContext = getPageContext(location.pathname);

  const aiSuggestions = [
    `How can I optimize ${pageContext.name.toLowerCase()} performance?`,
    `What are the best practices for ${pageContext.name.toLowerCase()}?`,
    `Show me insights about ${pageContext.name.toLowerCase()}`,
    `What improvements can I make to ${pageContext.name.toLowerCase()}?`,
    `Help me understand ${pageContext.name.toLowerCase()} metrics`
  ];

  return (
    <>
      {/* Floating AI Bot Icon */}
      <Fab
        color="primary"
        aria-label="ask ai"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            transform: 'scale(1.1)',
            boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <AskAIIcon sx={{ fontSize: '1.5rem' }} />
      </Fab>

      {/* AI Chat Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 1,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
        }}>
          <AskAIIcon color="primary" sx={{ fontSize: '2rem' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="600">
              AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pageContext.name} • {agentInitialized ? 'Ready to help' : 'Initializing...'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Agent Status */}
          {agentError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {agentError}
            </Alert>
          )}
          
          {!agentInitialized && !agentError && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Initializing AI Assistant...
            </Alert>
          )}

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <Box sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Chat History:
              </Typography>
              {chatHistory.map((message, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: message.type === 'user' 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.secondary.main, 0.05),
                    border: `1px solid ${message.type === 'user' 
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.secondary.main, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {message.type === 'user' ? (
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
                        <AskAIIcon fontSize="small" />
                      </Avatar>
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        {message.type === 'user' ? 'You' : 'AI Assistant'}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word',
                        lineHeight: 1.6
                      }}>
                        {message.content.split('\n').map((line, lineIndex) => {
                          if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                            return (
                              <Typography
                                key={lineIndex}
                                variant="subtitle2"
                                component="div"
                                sx={{ 
                                  fontWeight: 700,
                                  color: theme.palette.primary.main,
                                  mt: lineIndex > 0 ? 2 : 0,
                                  mb: 1,
                                  fontSize: '0.95rem'
                                }}
                              >
                                {line.replace(/^\\*\\*|\\*\\*$/g, '')}
                              </Typography>
                            );
                          }
                          
                          if (line.startsWith('•') || line.startsWith('  •')) {
                            const isSubBullet = line.startsWith('  •');
                            const bulletText = line.replace(/^\\s*•\\s*/, '');
                            
                            return (
                              <Typography
                                key={lineIndex}
                                variant="body2"
                                component="div"
                                sx={{ 
                                  ml: isSubBullet ? 3 : 1,
                                  mb: 0.5,
                                  display: 'flex',
                                  alignItems: 'flex-start'
                                }}
                              >
                                <Box component="span" sx={{ mr: 1, color: theme.palette.primary.main }}>
                                  {isSubBullet ? '◦' : '•'}
                                </Box>
                                <Box component="span" sx={{ flex: 1 }}>
                                  {renderTextWithFormatting(bulletText)}
                                </Box>
                              </Typography>
                            );
                          }
                          
                          if (line.trim() === '') {
                            return <Box key={lineIndex} sx={{ height: 8 }} />;
                          }
                          
                          return (
                            <Typography
                              key={lineIndex}
                              variant="body2"
                              component="div"
                              sx={{ mb: 0.5 }}
                            >
                              {renderTextWithFormatting(line)}
                            </Typography>
                          );
                        })}
                        {message.streaming && (
                          <Box component="span" sx={{ ml: 1 }}>
                            <CircularProgress size={12} />
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Suggestions */}
          {chatHistory.length === 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Quick Suggestions for {pageContext.name}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {aiSuggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    variant="outlined"
                    clickable
                    onClick={() => setQuery(suggestion)}
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Query Input */}
          <TextField
            fullWidth
            multiline
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendQuery();
              }
            }}
            placeholder={`Ask me anything about ${pageContext.name.toLowerCase()}... (Press Enter to send, Shift+Enter for new line)`}
            variant="outlined"
            disabled={!agentInitialized}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendQuery}
                    disabled={!query.trim() || isLoading || !agentInitialized}
                    color="primary"
                  >
                    {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {chatHistory.length > 0 && (
              <>
                <Button
                  onClick={handleExportChat}
                  color="primary"
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                >
                  Export Chat
                </Button>
                <Button
                  onClick={handleEmailChat}
                  color="primary"
                  variant="outlined"
                  startIcon={<EmailIcon />}
                >
                  Email
                </Button>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {chatHistory.length > 0 && (
              <Button
                onClick={() => setChatHistory([])}
                color="inherit"
                variant="outlined"
              >
                Clear Chat
              </Button>
            )}
            <Button onClick={handleClose} color="inherit">
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AIBotIcon;