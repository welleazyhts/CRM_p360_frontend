import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Tooltip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Phone as CallIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  PhoneCallback as CallbackIcon,
  PhoneMissed as MissedCallIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Visibility as ViewIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  AttachFile as AttachmentIcon
} from '@mui/icons-material';

// Communication Types
export const COMM_TYPES = {
  CALL: 'call',
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  NOTE: 'note',
  MEETING: 'meeting'
};

// Communication Status
export const COMM_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
  DELIVERED: 'delivered',
  READ: 'read',
  BOUNCED: 'bounced',
  NO_ANSWER: 'no_answer',
  CONNECTED: 'connected'
};

const UnifiedCommunicationHistory = ({ leadId, onUpdate }) => {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    agent: 'all'
  });

  useEffect(() => {
    loadCommunications();
  }, [leadId]);

  const loadCommunications = async () => {
    setLoading(true);

    // Mock data - consolidating all communication channels
    const mockData = [
      {
        id: 'COMM-001',
        type: COMM_TYPES.CALL,
        direction: 'outbound',
        status: COMM_STATUS.CONNECTED,
        timestamp: '2025-01-17T10:30:00',
        duration: 180,
        subject: 'Follow-up call for quote',
        content: 'Customer interested, requested quote via WhatsApp',
        agent: 'Agent A',
        phoneNumber: '+91-98765-43210',
        attachments: [],
        metadata: {
          callOutcome: 'connected',
          recording: 'REC-001.mp3'
        }
      },
      {
        id: 'COMM-002',
        type: COMM_TYPES.EMAIL,
        direction: 'outbound',
        status: COMM_STATUS.READ,
        timestamp: '2025-01-17T11:00:00',
        subject: 'Insurance Quote - Policy #12345',
        content: 'Dear Customer, Please find attached your insurance quote. Premium: ₹12,500. Validity: 7 days.',
        agent: 'System',
        to: 'customer@example.com',
        attachments: ['quote_12345.pdf'],
        metadata: {
          openedAt: '2025-01-17T11:15:00',
          clicks: 2
        }
      },
      {
        id: 'COMM-003',
        type: COMM_TYPES.WHATSAPP,
        direction: 'outbound',
        status: COMM_STATUS.DELIVERED,
        timestamp: '2025-01-17T11:05:00',
        subject: 'Quote Shared',
        content: 'Hi! Your insurance quote is ready. Premium: ₹12,500 for comprehensive coverage. Reply YES to proceed.',
        agent: 'Agent A',
        phoneNumber: '+91-98765-43210',
        attachments: ['quote_12345.pdf'],
        metadata: {
          deliveredAt: '2025-01-17T11:05:30',
          readAt: '2025-01-17T11:20:00'
        }
      },
      {
        id: 'COMM-004',
        type: COMM_TYPES.SMS,
        direction: 'outbound',
        status: COMM_STATUS.DELIVERED,
        timestamp: '2025-01-16T14:30:00',
        subject: 'Reminder',
        content: 'Reminder: Your vehicle insurance expires on 25-Jan-2025. Get instant quote at veriright.com/quote',
        agent: 'System',
        phoneNumber: '+91-98765-43210',
        attachments: [],
        metadata: {
          deliveredAt: '2025-01-16T14:30:15'
        }
      },
      {
        id: 'COMM-005',
        type: COMM_TYPES.CALL,
        direction: 'outbound',
        status: COMM_STATUS.NO_ANSWER,
        timestamp: '2025-01-15T16:20:00',
        duration: 0,
        subject: 'Follow-up call',
        content: 'No answer - left voicemail',
        agent: 'Agent B',
        phoneNumber: '+91-98765-43210',
        attachments: [],
        metadata: {
          callOutcome: 'no_answer'
        }
      },
      {
        id: 'COMM-006',
        type: COMM_TYPES.WHATSAPP,
        direction: 'inbound',
        status: COMM_STATUS.SUCCESS,
        timestamp: '2025-01-17T12:30:00',
        subject: 'Customer Reply',
        content: 'YES, interested. Please send payment link.',
        agent: 'Customer',
        phoneNumber: '+91-98765-43210',
        attachments: [],
        metadata: {}
      },
      {
        id: 'COMM-007',
        type: COMM_TYPES.NOTE,
        direction: 'internal',
        status: COMM_STATUS.SUCCESS,
        timestamp: '2025-01-17T12:35:00',
        subject: 'Internal Note',
        content: 'Customer confirmed interest. Sending payment link. Need to follow up on RC document.',
        agent: 'Agent A',
        attachments: [],
        metadata: {}
      },
      {
        id: 'COMM-008',
        type: COMM_TYPES.EMAIL,
        direction: 'outbound',
        status: COMM_STATUS.PENDING,
        timestamp: '2025-01-17T12:40:00',
        subject: 'Payment Link - Policy #12345',
        content: 'Dear Customer, Please use this link to complete payment: https://pay.veriright.com/abc123',
        agent: 'Agent A',
        to: 'customer@example.com',
        attachments: [],
        metadata: {}
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setCommunications(mockData);
    setLoading(false);
  };

  const getCommIcon = (type) => {
    const icons = {
      [COMM_TYPES.CALL]: <CallIcon />,
      [COMM_TYPES.EMAIL]: <EmailIcon />,
      [COMM_TYPES.SMS]: <SmsIcon />,
      [COMM_TYPES.WHATSAPP]: <WhatsAppIcon />,
      [COMM_TYPES.NOTE]: <PersonIcon />,
      [COMM_TYPES.MEETING]: <PersonIcon />
    };
    return icons[type] || <PersonIcon />;
  };

  const getCommColor = (type) => {
    const colors = {
      [COMM_TYPES.CALL]: 'primary',
      [COMM_TYPES.EMAIL]: 'secondary',
      [COMM_TYPES.SMS]: 'warning',
      [COMM_TYPES.WHATSAPP]: 'success',
      [COMM_TYPES.NOTE]: 'default',
      [COMM_TYPES.MEETING]: 'info'
    };
    return colors[type] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      [COMM_STATUS.SUCCESS]: 'success',
      [COMM_STATUS.CONNECTED]: 'success',
      [COMM_STATUS.READ]: 'success',
      [COMM_STATUS.DELIVERED]: 'info',
      [COMM_STATUS.PENDING]: 'warning',
      [COMM_STATUS.FAILED]: 'error',
      [COMM_STATUS.BOUNCED]: 'error',
      [COMM_STATUS.NO_ANSWER]: 'warning'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      [COMM_STATUS.SUCCESS]: <SuccessIcon fontSize="small" />,
      [COMM_STATUS.CONNECTED]: <SuccessIcon fontSize="small" />,
      [COMM_STATUS.READ]: <SuccessIcon fontSize="small" />,
      [COMM_STATUS.DELIVERED]: <SuccessIcon fontSize="small" />,
      [COMM_STATUS.PENDING]: <PendingIcon fontSize="small" />,
      [COMM_STATUS.FAILED]: <ErrorIcon fontSize="small" />,
      [COMM_STATUS.BOUNCED]: <ErrorIcon fontSize="small" />,
      [COMM_STATUS.NO_ANSWER]: <MissedCallIcon fontSize="small" />
    };
    return icons[status] || <PendingIcon fontSize="small" />;
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleViewDetails = (comm) => {
    setSelectedComm(comm);
    setViewDialog(true);
  };

  // Filter communications
  const filteredComms = communications.filter(comm => {
    if (activeTab !== 'all' && comm.type !== activeTab) return false;
    if (filters.type !== 'all' && comm.type !== filters.type) return false;
    if (filters.status !== 'all' && comm.status !== filters.status) return false;
    if (filters.agent !== 'all' && comm.agent !== filters.agent) return false;
    if (filters.dateFrom && new Date(comm.timestamp) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(comm.timestamp) > new Date(filters.dateTo)) return false;
    return true;
  });

  // Calculate statistics
  const stats = {
    total: communications.length,
    calls: communications.filter(c => c.type === COMM_TYPES.CALL).length,
    emails: communications.filter(c => c.type === COMM_TYPES.EMAIL).length,
    sms: communications.filter(c => c.type === COMM_TYPES.SMS).length,
    whatsapp: communications.filter(c => c.type === COMM_TYPES.WHATSAPP).length,
    successful: communications.filter(c =>
      [COMM_STATUS.SUCCESS, COMM_STATUS.CONNECTED, COMM_STATUS.READ, COMM_STATUS.DELIVERED].includes(c.status)
    ).length
  };

  const successRate = stats.total > 0 ? ((stats.successful / stats.total) * 100).toFixed(1) : 0;

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Communication History
            </Typography>
            <Box>
              <Tooltip title="Filter">
                <IconButton onClick={() => setFilterDialog(true)}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Statistics */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} md={2}>
              <Box textAlign="center" p={1} bgcolor="background.default" borderRadius={1}>
                <Typography variant="h6">{stats.total}</Typography>
                <Typography variant="caption" color="text.secondary">Total</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box textAlign="center" p={1} bgcolor="primary.main" color="#fff" borderRadius={1}>
                <Typography variant="h6">{stats.calls}</Typography>
                <Typography variant="caption">Calls</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box textAlign="center" p={1} bgcolor="secondary.main" color="#fff" borderRadius={1}>
                <Typography variant="h6">{stats.emails}</Typography>
                <Typography variant="caption">Emails</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box textAlign="center" p={1} bgcolor="success.main" color="#fff" borderRadius={1}>
                <Typography variant="h6">{stats.whatsapp}</Typography>
                <Typography variant="caption">WhatsApp</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box textAlign="center" p={1} bgcolor="warning.main" color="#fff" borderRadius={1}>
                <Typography variant="h6">{stats.sms}</Typography>
                <Typography variant="caption">SMS</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box textAlign="center" p={1} bgcolor="success.dark" color="#fff" borderRadius={1}>
                <Typography variant="h6">{successRate}%</Typography>
                <Typography variant="caption">Success Rate</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Tabs for filtering by type */}
          <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ mb: 2 }}>
            <Tab label="All" value="all" />
            <Tab
              label={
                <Badge badgeContent={stats.calls} color="primary">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CallIcon fontSize="small" /> Calls
                  </Box>
                </Badge>
              }
              value={COMM_TYPES.CALL}
            />
            <Tab
              label={
                <Badge badgeContent={stats.emails} color="secondary">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <EmailIcon fontSize="small" /> Email
                  </Box>
                </Badge>
              }
              value={COMM_TYPES.EMAIL}
            />
            <Tab
              label={
                <Badge badgeContent={stats.whatsapp} color="success">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <WhatsAppIcon fontSize="small" /> WhatsApp
                  </Box>
                </Badge>
              }
              value={COMM_TYPES.WHATSAPP}
            />
            <Tab
              label={
                <Badge badgeContent={stats.sms} color="warning">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <SmsIcon fontSize="small" /> SMS
                  </Box>
                </Badge>
              }
              value={COMM_TYPES.SMS}
            />
          </Tabs>

          {/* Timeline */}
          {filteredComms.length === 0 ? (
            <Alert severity="info">No communication history found.</Alert>
          ) : (
            <Timeline position="right">
              {filteredComms.map((comm, index) => (
                <TimelineItem key={comm.id}>
                  <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                    <Typography variant="caption" display="block">
                      {new Date(comm.timestamp).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" display="block" fontWeight="bold">
                      {new Date(comm.timestamp).toLocaleTimeString()}
                    </Typography>
                    {comm.duration > 0 && (
                      <Chip
                        label={formatDuration(comm.duration)}
                        size="small"
                        icon={<TimeIcon />}
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getCommColor(comm.type)}>
                      {getCommIcon(comm.type)}
                    </TimelineDot>
                    {index < filteredComms.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {comm.subject}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(comm.status)}
                              label={comm.status}
                              size="small"
                              color={getStatusColor(comm.status)}
                            />
                            {comm.direction === 'inbound' && (
                              <Chip label="Inbound" size="small" variant="outlined" color="info" />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {comm.type.toUpperCase()} • {comm.agent}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => handleViewDetails(comm)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {comm.content.length > 150
                          ? `${comm.content.substring(0, 150)}...`
                          : comm.content
                        }
                      </Typography>

                      {comm.attachments && comm.attachments.length > 0 && (
                        <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                          <AttachmentIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {comm.attachments.length} attachment(s)
                          </Typography>
                        </Box>
                      )}

                      {comm.phoneNumber && (
                        <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                          Phone: {comm.phoneNumber}
                        </Typography>
                      )}

                      {comm.to && (
                        <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                          To: {comm.to}
                        </Typography>
                      )}

                      {/* Metadata */}
                      {comm.metadata && Object.keys(comm.metadata).length > 0 && (
                        <Box mt={1}>
                          {comm.metadata.openedAt && (
                            <Chip
                              label={`Opened: ${new Date(comm.metadata.openedAt).toLocaleString()}`}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mt: 0.5 }}
                            />
                          )}
                          {comm.metadata.readAt && (
                            <Chip
                              label={`Read: ${new Date(comm.metadata.readAt).toLocaleString()}`}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mt: 0.5 }}
                            />
                          )}
                          {comm.metadata.clicks > 0 && (
                            <Chip
                              label={`${comm.metadata.clicks} clicks`}
                              size="small"
                              variant="outlined"
                              icon={<TrendingUpIcon />}
                              sx={{ mr: 0.5, mt: 0.5 }}
                            />
                          )}
                        </Box>
                      )}
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={filterDialog} onClose={() => setFilterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Communications</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value={COMM_TYPES.CALL}>Calls</MenuItem>
                  <MenuItem value={COMM_TYPES.EMAIL}>Email</MenuItem>
                  <MenuItem value={COMM_TYPES.SMS}>SMS</MenuItem>
                  <MenuItem value={COMM_TYPES.WHATSAPP}>WhatsApp</MenuItem>
                  <MenuItem value={COMM_TYPES.NOTE}>Notes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value={COMM_STATUS.SUCCESS}>Success</MenuItem>
                  <MenuItem value={COMM_STATUS.PENDING}>Pending</MenuItem>
                  <MenuItem value={COMM_STATUS.FAILED}>Failed</MenuItem>
                  <MenuItem value={COMM_STATUS.DELIVERED}>Delivered</MenuItem>
                  <MenuItem value={COMM_STATUS.READ}>Read</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFilters({
              type: 'all',
              status: 'all',
              dateFrom: '',
              dateTo: '',
              agent: 'all'
            });
          }}>
            Clear Filters
          </Button>
          <Button onClick={() => setFilterDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        {selectedComm && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                {getCommIcon(selectedComm.type)}
                {selectedComm.subject}
                <Chip
                  label={selectedComm.status}
                  size="small"
                  color={getStatusColor(selectedComm.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body2" fontWeight="bold">{selectedComm.type.toUpperCase()}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Agent</Typography>
                  <Typography variant="body2" fontWeight="bold">{selectedComm.agent}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Date(selectedComm.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
                {selectedComm.duration > 0 && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Duration</Typography>
                    <Typography variant="body2" fontWeight="bold">{formatDuration(selectedComm.duration)}</Typography>
                  </Grid>
                )}
                {selectedComm.phoneNumber && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedComm.phoneNumber}</Typography>
                  </Grid>
                )}
                {selectedComm.to && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Recipient</Typography>
                    <Typography variant="body2" fontWeight="bold">{selectedComm.to}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Content</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                    <Typography variant="body2">{selectedComm.content}</Typography>
                  </Paper>
                </Grid>
                {selectedComm.attachments && selectedComm.attachments.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Attachments</Typography>
                    <Box mt={1}>
                      {selectedComm.attachments.map((file, idx) => (
                        <Chip
                          key={idx}
                          icon={<AttachmentIcon />}
                          label={file}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                {selectedComm.metadata && Object.keys(selectedComm.metadata).length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Additional Information</Typography>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                      {Object.entries(selectedComm.metadata).map(([key, value]) => (
                        <Typography key={key} variant="caption" display="block">
                          <strong>{key}:</strong> {typeof value === 'string' && value.includes('T')
                            ? new Date(value).toLocaleString()
                            : value.toString()}
                        </Typography>
                      ))}
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UnifiedCommunicationHistory;
