import React, { useState, useEffect } from 'react';
import { enhanceEmailContent } from '../services/emailAI';
import {
  Box, Typography, Card, CardContent, Button, TextField, Grid,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, Divider,
  Fade, alpha, useTheme, Avatar, Badge
} from '@mui/material';
import {
  Email as EmailIcon, Send as SendIcon, Reply as ReplyIcon,
  Inbox as InboxIcon, Drafts as DraftsIcon, Delete as DeleteIcon,
  Star as StarIcon, StarBorder as StarBorderIcon, Refresh as RefreshIcon,
  Search as SearchIcon, AttachFile as AttachIcon
} from '@mui/icons-material';

const CustomerServiceEmail = () => {
  const theme = useTheme();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = () => {
    const mockEmails = [
      {
        id: 1,
        from: 'rajesh.kumar@example.com',
        fromName: 'Rajesh Kumar',
        subject: 'Query about policy renewal',
        body: 'Hello, I would like to know more about the policy renewal process. My policy is expiring next month.',
        date: '2025-01-12 10:30 AM',
        read: false,
        starred: false,
        category: 'Policy Inquiry'
      },
      {
        id: 2,
        from: 'anita.desai@example.com',
        fromName: 'Anita Desai',
        subject: 'Claim status update needed',
        body: 'Can you please provide an update on my claim submitted last week? Claim ID: CLM-2024-456',
        date: '2025-01-11 03:45 PM',
        read: true,
        starred: true,
        category: 'Claims'
      },
      {
        id: 3,
        from: 'vikram.singh@example.com',
        fromName: 'Vikram Singh',
        subject: 'Change of address request',
        body: 'I have recently moved to a new location. Please update my address in your records.',
        date: '2025-01-11 11:20 AM',
        read: true,
        starred: false,
        category: 'Account Update'
      },
      {
        id: 4,
        from: 'priya.sharma@example.com',
        fromName: 'Priya Sharma',
        subject: 'Premium payment confirmation',
        body: 'I made a premium payment yesterday. Can you confirm if it has been received?',
        date: '2025-01-10 02:15 PM',
        read: false,
        starred: false,
        category: 'Payment'
      }
    ];
    setEmails(mockEmails);
  };

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    // Mark as read
    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
  };

  const handleStarToggle = (emailId) => {
    setEmails(emails.map(e =>
      e.id === emailId ? { ...e, starred: !e.starred } : e
    ));
  };

  const handleCompose = () => {
    setComposeData({ to: '', subject: '', body: '' });
    setComposeOpen(true);
  };

  const handleReply = () => {
    if (selectedEmail) {
      setComposeData({
        to: selectedEmail.from,
        subject: `Re: ${selectedEmail.subject}`,
        body: ''
      });
      setComposeOpen(true);
    }
  };

  const handleSendEmail = () => {
    (async () => {
      try {
        // Try to enhance email content before sending (best-effort)
        const enhanced = await enhanceEmailContent(composeData).catch(() => null);
        if (enhanced && typeof enhanced === 'string') {
          // If service returned a formatted response, replace body (best-effort)
          setComposeData(prev => ({ ...prev, body: enhanced }));
        }
      } catch (e) {
        console.error('Email enhancement failed:', e);
      } finally {
        // In real app, send email via API
        setComposeOpen(false);
        setComposeData({ to: '', subject: '', body: '' });
      }
    })();
  };

  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Customer Service Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage customer service emails and responses
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadEmails}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<SendIcon />} onClick={handleCompose}>
              Compose
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {emails.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Total Emails
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.9)}, ${alpha(theme.palette.error.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {unreadCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Unread
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {emails.filter(e => e.starred).length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Starred
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.dark, 0.7)})` }}>
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {emails.filter(e => e.read).length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  Read
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Email List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '600px', overflow: 'auto' }}>
              <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Box>
              <List>
                {emails
                  .filter(email =>
                    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    email.fromName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((email) => (
                    <React.Fragment key={email.id}>
                      <ListItem
                        button
                        selected={selectedEmail?.id === email.id}
                        onClick={() => handleEmailClick(email)}
                        sx={{
                          backgroundColor: !email.read ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(email.id);
                          }}
                        >
                          {email.starred ? (
                            <StarIcon sx={{ color: theme.palette.warning.main }} />
                          ) : (
                            <StarBorderIcon />
                          )}
                        </IconButton>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight={!email.read ? 600 : 400}>
                                {email.fromName}
                              </Typography>
                              {!email.read && (
                                <Badge color="primary" variant="dot" />
                              )}
                            </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" fontWeight={!email.read ? 600 : 400} noWrap>
                                {email.subject}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {email.date}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
              </List>
            </Paper>
          </Grid>

          {/* Email Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
              {selectedEmail ? (
                <>
                  <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          {selectedEmail.subject}
                        </Typography>
                        <Chip label={selectedEmail.category} size="small" color="primary" />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary" onClick={handleReply}>
                          <ReplyIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {selectedEmail.fromName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600">
                          {selectedEmail.fromName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedEmail.from}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                        {selectedEmail.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedEmail.body}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<ReplyIcon />} onClick={handleReply}>
                      Reply
                    </Button>
                    <Button variant="outlined" startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <InboxIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Select an email to view
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Compose Dialog */}
        <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="To"
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={10}
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
            <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendEmail}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default CustomerServiceEmail;
