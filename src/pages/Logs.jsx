import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, TextField, Button,
  List, ListItem, ListItemText, Divider,
  Chip, CircularProgress, Alert,
  FormControl, InputLabel, Select, MenuItem,
  Card, CardContent,
  Fade, Grow, InputAdornment,
  Tabs, Tab, Paper, Avatar, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  MailOutline as MailOutlineIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';


const Logs = () => {
  const location = useLocation();
  const theme = useTheme();

  const queryParams = new URLSearchParams(location.search);
  const caseIdParam = queryParams.get('caseId');

  const [searchQuery, setSearchQuery] = useState(caseIdParam || '');
  const [searchType, setSearchType] = useState('caseId');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Communication Logs states
  const [communicationTab, setCommunicationTab] = useState(0);
  const [viewMessageDialog, setViewMessageDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      // In a real app, this would call your API
      // const logsData = await fetchLogs(searchType, searchQuery);
      // setLogs(logsData);
      
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (searchType === 'caseId' && searchQuery === 'CASE-001') {
        setLogs([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Priya Patel',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-004',
            timestamp: '2025-04-09T11:45:22',
            action: 'Contact Update',
            details: 'Customer phone number updated from 555-123-4567 to 555-123-9876',
            user: 'Priya Patel',
            level: 'warning'
          },
          {
            id: 'log-005',
            timestamp: '2025-04-09T14:20:05',
            action: 'Processing',
            details: 'Agent has begun renewal processing',
            user: 'Priya Patel',
            level: 'info'
          },
          {
            id: 'log-006',
            timestamp: '2025-04-10T09:05:18',
            action: 'Comment Added',
            details: 'Customer requested additional coverage options. Will follow up tomorrow.',
            user: 'Priya Patel',
            level: 'info'
          }
        ]);
      } else if (searchType === 'policyNumber' && searchQuery === 'POL-12345') {
        setLogs([
          {
            id: 'log-001',
            timestamp: '2025-04-08T09:15:30',
            action: 'Case Created',
            details: 'Case uploaded via bulk upload',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-002',
            timestamp: '2025-04-08T09:15:35',
            action: 'Validation',
            details: 'All required fields present and valid',
            user: 'System',
            level: 'info'
          },
          {
            id: 'log-003',
            timestamp: '2025-04-08T10:30:12',
            action: 'Assignment',
            details: 'Case assigned to agent Priya Patel',
            user: 'System',
            level: 'info'
          }
        ]);
      } else {
        setLogs([]);
      }
    } catch (err) {
      setError('Failed to fetch logs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchType, searchQuery]);

  useEffect(() => {
    // Set loaded state for animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Auto-search if caseId is provided in URL
    if (caseIdParam) {
      handleSearch();
    }
  }, [caseIdParam, handleSearch]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'default';
    }
  };

  const getLogLevelIcon = (level) => {
    switch (level) {
      case 'error': return <ErrorIcon fontSize="small" />;
      case 'warning': return <WarningIcon fontSize="small" />;
      case 'info': return <InfoIcon fontSize="small" />;
      case 'success': return <CheckCircleIcon fontSize="small" />;
      default: return <InfoIcon fontSize="small" />;
    }
  };

  // Communication Logs handlers
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setViewMessageDialog(true);
  };

  const handleCloseViewMessage = () => {
    setViewMessageDialog(false);
    setSelectedMessage(null);
  };

  const handleResendMessage = (message) => {
    // In real app, call API to resend message
    alert(`${message.type || 'Message'} resent successfully!`);
  };

  const handleEditAndResend = (message) => {
    // In real app, open edit dialog
    alert(`Edit and resend functionality for ${message.type}`);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600">
            Case Logs
          </Typography>
        </Box>
        
        <Grow in={loaded} timeout={400}>
          <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Search Logs
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Search for detailed logs by Case ID or Policy Number to view the complete activity history.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ width: 150 }}>
                  <InputLabel>Search By</InputLabel>
                  <Select
                    value={searchType}
                    label="Search By"
                    onChange={(e) => setSearchType(e.target.value)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="caseId">Case ID</MenuItem>
                    <MenuItem value="policyNumber">Policy Number</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  placeholder={searchType === 'caseId' ? "Enter Case ID (e.g., CASE-001)" : "Enter Policy Number (e.g., POL-12345)"}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      '&:hover': {
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                      },
                      transition: 'background-color 0.3s'
                    }
                  }}
                />
                
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 2,
                    minWidth: 100
                  }}
                >
                  Search
                </Button>
              </Box>
              
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {error && (
                <Grow in={!!error}>
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                </Grow>
              )}
              
              {!loading && searched && logs.length === 0 && (
                <Grow in={true}>
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    No logs found for the specified {searchType === 'caseId' ? 'Case ID' : 'Policy Number'}. Please check your input and try again.
                  </Alert>
                </Grow>
              )}
            </CardContent>
          </Card>
        </Grow>
        
        {logs.length > 0 && (
          <Grow in={!loading} timeout={600}>
            <Card sx={{ boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="600">
                    Activity Log
                  </Typography>
                  
                  <Chip
                    label={searchType === 'caseId' ? `Case ID: ${searchQuery}` : `Policy: ${searchQuery}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                
                <List sx={{ 
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  {logs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      {index > 0 && <Divider sx={{ opacity: 0.5 }} />}
                      <ListItem 
                        alignItems="flex-start" 
                        sx={{ 
                          py: 2,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.03)',
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="600">
                                  {log.action}
                                </Typography>
                                <Chip 
                                  label={log.level} 
                                  color={getLogLevelColor(log.level)}
                                  size="small"
                                  icon={getLogLevelIcon(log.level)}
                                  sx={{ 
                                    fontWeight: 500,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(log.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography 
                                variant="body2" 
                                component="span"
                                sx={{ 
                                  display: 'block',
                                  mb: 0.5
                                }}
                              >
                                {log.details}
                              </Typography>
                              <Typography 
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-end'
                                }}
                              >
                                User: {log.user}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grow>
        )}

        {/* Communication Logs */}
        {logs.length > 0 && (
          <Grow in={!loading} timeout={800}>
            <Card sx={{ boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3, mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="600">Communication Logs</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Communication Type Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs
                    value={communicationTab}
                    onChange={(e, newValue) => setCommunicationTab(newValue)}
                    variant="fullWidth"
                    sx={{
                      '& .MuiTab-root': { fontWeight: 600 }
                    }}
                  >
                    <Tab icon={<PhoneIcon />} label="Calls" iconPosition="start" />
                    <Tab icon={<MailOutlineIcon />} label="Emails" iconPosition="start" />
                    <Tab icon={<SmsIcon />} label="SMS" iconPosition="start" />
                    <Tab icon={<WhatsAppIcon />} label="WhatsApp" iconPosition="start" />
                  </Tabs>
                </Box>

                {/* Call Logs Tab */}
                {communicationTab === 0 && (
                  <Box
                    sx={{
                      maxHeight: '500px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: '8px' },
                      '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                      '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                    }}
                  >
                    <List>
                      {[
                        {
                          id: 1,
                          caller: 'Priya Patel',
                          callerRole: 'Agent',
                          number: '+91-98765-43210',
                          customerNumber: '+91-98765-12345',
                          status: 'Connected',
                          duration: '5 mins 32 secs',
                          date: '2024-01-15 14:30',
                          notes: 'Discussed policy renewal, customer interested in upgrading coverage.'
                        },
                        {
                          id: 2,
                          caller: 'Amit Kumar',
                          callerRole: 'Agent',
                          number: '+91-98765-43211',
                          customerNumber: '+91-98765-12345',
                          status: 'Not Connected',
                          duration: null,
                          date: '2024-01-14 10:15',
                          notes: 'No answer after 3 rings.'
                        }
                      ].map((call) => (
                        <ListItem
                          key={call.id}
                          sx={{
                            px: 0,
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: call.status === 'Connected' ? 'success.main' : 'error.main',
                                    width: 32,
                                    height: 32
                                  }}
                                >
                                  <PhoneIcon fontSize="small" />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    {call.caller} ({call.callerRole})
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {call.date}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={call.status}
                                  size="small"
                                  color={call.status === 'Connected' ? 'success' : 'error'}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Grid container spacing={1} sx={{ mb: 1 }}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>Agent Number:</strong> {call.number}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>Customer Number:</strong> {call.customerNumber}
                                    </Typography>
                                  </Grid>
                                  {call.duration && (
                                    <Grid item xs={12}>
                                      <Typography variant="body2" color="text.secondary">
                                        <strong>Duration:</strong> {call.duration}
                                      </Typography>
                                    </Grid>
                                  )}
                                </Grid>
                                {call.notes && (
                                  <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1, mb: 1 }}>
                                    <Typography variant="body2">
                                      <strong>Notes:</strong> {call.notes}
                                    </Typography>
                                  </Box>
                                )}
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<PhoneIcon />}
                                    onClick={() => handleViewMessage({ type: 'call', ...call })}
                                  >
                                    View Details
                                  </Button>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Email Logs Tab */}
                {communicationTab === 1 && (
                  <Box
                    sx={{
                      maxHeight: '500px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: '8px' },
                      '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                      '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                    }}
                  >
                    <List>
                      {[
                        {
                          id: 1,
                          subject: 'Policy Renewal Confirmation',
                          from: 'noreply@insurance.com',
                          to: 'customer@example.com',
                          status: 'Delivered',
                          date: '2024-01-15 12:30',
                          preview: 'Your policy has been successfully renewed. Thank you for your continued trust...',
                          body: 'Dear Customer,\n\nYour policy has been successfully renewed. Thank you for your continued trust in our services.\n\nPolicy Details:\n- Policy Number: POL-12345\n- Renewal Date: 01/02/2024\n- Premium: ₹15,000\n\nBest regards,\nInsurance Team'
                        }
                      ].map((email) => (
                        <ListItem
                          key={email.id}
                          sx={{
                            px: 0,
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: email.status === 'Delivered' ? 'success.main' : 'info.main',
                                    width: 32,
                                    height: 32
                                  }}
                                >
                                  <MailOutlineIcon fontSize="small" />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    {email.subject}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {email.date}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={email.status}
                                  size="small"
                                  color={email.status === 'Delivered' ? 'success' : 'info'}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  <strong>From:</strong> {email.from} <br />
                                  <strong>To:</strong> {email.to}
                                </Typography>
                                <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1, mb: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {email.preview}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<MailOutlineIcon />}
                                    onClick={() => handleViewMessage({ type: 'email', ...email })}
                                  >
                                    View Full Email
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SendIcon />}
                                    onClick={() => handleResendMessage({ type: 'email', ...email })}
                                  >
                                    Resend
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEditAndResend({ type: 'email', ...email })}
                                  >
                                    Edit & Resend
                                  </Button>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* SMS Logs Tab */}
                {communicationTab === 2 && (
                  <Box
                    sx={{
                      maxHeight: '500px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: '8px' },
                      '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                      '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                    }}
                  >
                    <List>
                      {[
                        {
                          id: 1,
                          to: '+91-98765-12345',
                          status: 'Delivered',
                          date: '2024-01-15 10:00',
                          message: 'Your policy renewal payment of ₹15,000 has been received. Policy renewed successfully till 01/02/2025. Thank you!'
                        }
                      ].map((sms) => (
                        <ListItem
                          key={sms.id}
                          sx={{
                            px: 0,
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: sms.status === 'Delivered' ? 'success.main' : sms.status === 'Failed' ? 'error.main' : 'info.main',
                                    width: 32,
                                    height: 32
                                  }}
                                >
                                  <SmsIcon fontSize="small" />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    SMS to {sms.to}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {sms.date}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={sms.status}
                                  size="small"
                                  color={sms.status === 'Delivered' ? 'success' : sms.status === 'Failed' ? 'error' : 'info'}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1, mb: 1 }}>
                                  <Typography variant="body2">
                                    {sms.message}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<MailOutlineIcon />}
                                    onClick={() => handleViewMessage({ type: 'sms', ...sms })}
                                  >
                                    View Message
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SendIcon />}
                                    onClick={() => handleResendMessage({ type: 'sms', ...sms })}
                                  >
                                    Resend
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEditAndResend({ type: 'sms', ...sms })}
                                  >
                                    Edit & Resend
                                  </Button>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* WhatsApp Logs Tab */}
                {communicationTab === 3 && (
                  <Box
                    sx={{
                      maxHeight: '500px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': { width: '8px' },
                      '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                      '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                    }}
                  >
                    <List>
                      {[
                        {
                          id: 1,
                          to: '+91-98765-12345',
                          status: 'Read',
                          date: '2024-01-15 11:45',
                          message: 'Hi! Your policy renewal is confirmed. Download your updated policy document here: [Link]\n\nThank you for choosing us! 😊'
                        }
                      ].map((whatsapp) => (
                        <ListItem
                          key={whatsapp.id}
                          sx={{
                            px: 0,
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: whatsapp.status === 'Read' ? 'success.main' : 'info.main',
                                    width: 32,
                                    height: 32
                                  }}
                                >
                                  <WhatsAppIcon fontSize="small" />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    WhatsApp to {whatsapp.to}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {whatsapp.date}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={whatsapp.status}
                                  size="small"
                                  color={whatsapp.status === 'Read' ? 'success' : 'info'}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 1, mb: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {whatsapp.message}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<MailOutlineIcon />}
                                    onClick={() => handleViewMessage({ type: 'whatsapp', ...whatsapp })}
                                  >
                                    View Message
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SendIcon />}
                                    onClick={() => handleResendMessage({ type: 'whatsapp', ...whatsapp })}
                                  >
                                    Resend
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEditAndResend({ type: 'whatsapp', ...whatsapp })}
                                  >
                                    Edit & Resend
                                  </Button>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>
        )}

        {/* View Message Dialog */}
        <Dialog
          open={viewMessageDialog}
          onClose={handleCloseViewMessage}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {selectedMessage?.type === 'email' && <MailOutlineIcon color="primary" />}
                {selectedMessage?.type === 'sms' && <SmsIcon color="primary" />}
                {selectedMessage?.type === 'whatsapp' && <WhatsAppIcon color="primary" />}
                {selectedMessage?.type === 'call' && <PhoneIcon color="primary" />}
                <Typography variant="h6" fontWeight="600">
                  {selectedMessage?.type === 'email' && 'Email Details'}
                  {selectedMessage?.type === 'sms' && 'SMS Details'}
                  {selectedMessage?.type === 'whatsapp' && 'WhatsApp Message Details'}
                  {selectedMessage?.type === 'call' && 'Call Details'}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseViewMessage} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>
            {selectedMessage && (
              <Box>
                {/* Email Content */}
                {selectedMessage.type === 'email' && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Subject
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {selectedMessage.subject}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        From
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.from}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        To
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.to}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.date}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={selectedMessage.status}
                        size="small"
                        color={selectedMessage.status === 'Delivered' ? 'success' : selectedMessage.status === 'Sent' ? 'primary' : 'error'}
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Message Body
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mt: 1,
                          bgcolor: 'background.default',
                          maxHeight: 400,
                          overflow: 'auto'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
                        >
                          {selectedMessage.body}
                        </Typography>
                      </Paper>
                    </Box>
                  </>
                )}

                {/* SMS/WhatsApp Content */}
                {(selectedMessage.type === 'sms' || selectedMessage.type === 'whatsapp') && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        To
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.to}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.date}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={selectedMessage.status}
                        size="small"
                        color={
                          selectedMessage.status === 'Delivered' || selectedMessage.status === 'Read' ? 'success' :
                          selectedMessage.status === 'Sent' ? 'primary' :
                          'error'
                        }
                      />
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Message
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          mt: 1,
                          bgcolor: 'background.default'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: 'pre-wrap' }}
                        >
                          {selectedMessage.message}
                        </Typography>
                      </Paper>
                    </Box>
                  </>
                )}

                {/* Call Content */}
                {selectedMessage.type === 'call' && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Caller
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {selectedMessage.caller} ({selectedMessage.callerRole})
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Called Number
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.number}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Customer Number
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.customerNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date & Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedMessage.date}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={selectedMessage.status}
                        size="small"
                        color={selectedMessage.status === 'Connected' ? 'success' : 'error'}
                      />
                    </Box>

                    {selectedMessage.duration && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Duration
                        </Typography>
                        <Typography variant="body2">
                          {selectedMessage.duration}
                        </Typography>
                      </Box>
                    )}

                    {selectedMessage.notes && (
                      <>
                        <Divider sx={{ my: 3 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Call Notes
                          </Typography>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              mt: 1,
                              bgcolor: 'background.default'
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: 'pre-wrap' }}
                            >
                              {selectedMessage.notes}
                            </Typography>
                          </Paper>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleCloseViewMessage}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleCloseViewMessage();
                handleResendMessage(selectedMessage);
              }}
              startIcon={<SendIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Resend
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleCloseViewMessage();
                handleEditAndResend(selectedMessage);
              }}
              startIcon={<EditIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Edit & Resend
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Logs;