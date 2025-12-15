import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
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
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';
import ActivityLogViewer from '../../components/collections/ActivityLogViewer';

const PTPTracking = () => {
  const { addLog } = useActivityLog();
  const [tabValue, setTabValue] = useState(0);
  const [addPTPDialog, setAddPTPDialog] = useState(false);
  const [activityLogDialog, setActivityLogDialog] = useState(false);
  const [logEntityId, setLogEntityId] = useState(null);
  const [logEntityName, setLogEntityName] = useState(null);
  const [newPTP, setNewPTP] = useState({
    debtorId: '',
    amount: '',
    date: '',
    notes: ''
  });

  // Mock PTP data
  const [ptpData, setPtpData] = useState([
    {
      id: 'PTP-001',
      debtorId: 'ACC-10001',
      debtorName: 'John Smith',
      debtorEmail: 'john.smith@example.com',
      phone: '+1-555-0123',
      amount: 5000,
      ptpDate: '2025-01-20',
      createdDate: '2025-01-15',
      status: 'Pending',
      daysUntilDue: 3,
      outstandingBalance: 12500,
      agent: 'Sarah Johnson',
      notes: 'Promised to pay after salary deposit',
      emailSent: true,
      emailSentDate: '2025-01-15 10:30',
      emailContent: null,
      customerResponse: null
    },
    {
      id: 'PTP-002',
      debtorId: 'ACC-10004',
      debtorName: 'Maria Garcia',
      debtorEmail: 'maria.garcia@example.com',
      phone: '+1-555-0126',
      amount: 1200,
      ptpDate: '2025-01-25',
      createdDate: '2025-01-16',
      status: 'Pending',
      daysUntilDue: 8,
      outstandingBalance: 3200,
      agent: 'John Adams',
      notes: 'Payment plan - First installment',
      emailSent: true,
      emailSentDate: '2025-01-16 14:20',
      emailContent: null,
      customerResponse: null
    },
    {
      id: 'PTP-003',
      debtorId: 'ACC-10012',
      debtorName: 'James Wilson',
      debtorEmail: 'james.wilson@example.com',
      phone: '+1-555-0130',
      amount: 3500,
      ptpDate: '2025-01-18',
      createdDate: '2025-01-10',
      status: 'Honored',
      daysUntilDue: 0,
      outstandingBalance: 7800,
      agent: 'Sarah Johnson',
      paidAmount: 3500,
      paidDate: '2025-01-18',
      notes: 'Full payment received on time',
      emailSent: true,
      emailSentDate: '2025-01-10 09:15',
      emailContent: null,
      customerResponse: 'Payment Received'
    },
    {
      id: 'PTP-004',
      debtorId: 'ACC-10008',
      debtorName: 'Lisa Anderson',
      debtorEmail: 'lisa.anderson@example.com',
      phone: '+1-555-0128',
      amount: 2000,
      ptpDate: '2025-01-10',
      createdDate: '2025-01-05',
      status: 'Broken',
      daysUntilDue: -7,
      outstandingBalance: 9500,
      agent: 'Mike Wilson',
      notes: 'No payment received, no contact',
      emailSent: true,
      emailSentDate: '2025-01-05 11:00',
      emailContent: null,
      customerResponse: 'No Response'
    },
    {
      id: 'PTP-005',
      debtorId: 'ACC-10015',
      debtorName: 'Robert Taylor',
      debtorEmail: 'robert.taylor@example.com',
      phone: '+1-555-0132',
      amount: 4200,
      ptpDate: '2025-01-19',
      createdDate: '2025-01-14',
      status: 'Partial',
      daysUntilDue: 2,
      outstandingBalance: 11000,
      agent: 'Sarah Johnson',
      paidAmount: 2100,
      paidDate: '2025-01-19',
      notes: 'Paid 50% - promised rest next week',
      emailSent: true,
      emailSentDate: '2025-01-14 16:45',
      emailContent: null,
      customerResponse: 'Partial Payment Received'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Honored': 'success',
      'Broken': 'error',
      'Partial': 'info'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': <ScheduleIcon />,
      'Honored': <CheckIcon />,
      'Broken': <CancelIcon />,
      'Partial': <WarningIcon />
    };
    return icons[status] || null;
  };

  const filterPTPs = (status) => {
    if (status === 'all') return ptpData;
    return ptpData.filter(ptp => ptp.status === status);
  };

  const getCurrentTabPTPs = () => {
    const statusMap = ['all', 'Pending', 'Honored', 'Broken'];
    return filterPTPs(statusMap[tabValue]);
  };

  const stats = {
    total: ptpData.length,
    pending: ptpData.filter(p => p.status === 'Pending').length,
    honored: ptpData.filter(p => p.status === 'Honored').length,
    broken: ptpData.filter(p => p.status === 'Broken').length,
    honoreRate: ((ptpData.filter(p => p.status === 'Honored').length / ptpData.length) * 100).toFixed(1),
    totalPTPAmount: ptpData.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0),
    recoveredAmount: ptpData.filter(p => p.status === 'Honored').reduce((sum, p) => sum + (p.paidAmount || p.amount), 0)
  };

  // Handler for PTP status updates (Honored/Broken)
  const handlePTPStatusUpdate = (ptpId, status) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    setPtpData(prevData =>
      prevData.map(ptp =>
        ptp.id === ptpId
          ? {
              ...ptp,
              status: status === 'honored' ? 'Honored' : 'Broken',
              customerResponse: status === 'honored' ? 'Payment Received' : 'No Response',
              paidDate: status === 'honored' ? currentDate : null,
              paidAmount: status === 'honored' ? ptp.amount : null
            }
          : ptp
      )
    );

    // Log the activity
    addLog({
      user: 'Current User',
      action: status === 'honored' ? 'PTP Honored' : 'PTP Broken',
      entity: 'Debtor Account',
      entityId: ptpId,
      entityName: `PTP ${ptpId}`,
      details: status === 'honored'
        ? `Promise to Pay honored - Payment received on ${currentDate}`
        : `Promise to Pay broken - No payment received by due date`,
      category: 'ptp',
      status: status === 'honored' ? 'success' : 'error'
    });
  };

  const handleAddPTP = () => {
    if (!newPTP.amount || !newPTP.date || !newPTP.debtorId) {
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Create email reminder content for PTP
    const emailContent = `
Dear Customer,

This is a confirmation of your Promise to Pay agreement.

PAYMENT PROMISE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Promise Amount: $${newPTP.amount}
Payment Due Date: ${newPTP.date}
Account ID: ${newPTP.debtorId}

${newPTP.notes ? `\nAdditional Notes:\n${newPTP.notes}` : ''}

IMPORTANT REMINDERS:
- Please ensure payment is made by the promised date
- Contact us immediately if you anticipate any issues
- Payment confirmation will be sent once received

TO MAKE YOUR PAYMENT:
Please use one of our available payment methods and reference your Account ID.

QUESTIONS OR CONCERNS:
Contact us at [phone number] or reply to this email.

Thank you for your commitment to resolving your account.

Best regards,
Collections Team
    `.trim();

    // Create new PTP entry
    const ptpId = `PTP-${String(Date.now()).slice(-3)}`;
    const newPTPEntry = {
      id: ptpId,
      debtorId: newPTP.debtorId,
      debtorName: `Debtor ${newPTP.debtorId}`, // In real app, fetch from debtor data
      debtorEmail: 'customer@example.com', // In real app, fetch from debtor data
      phone: '+1-555-0000',
      amount: parseInt(newPTP.amount),
      ptpDate: newPTP.date,
      createdDate: currentDate,
      status: 'Pending',
      daysUntilDue: Math.ceil((new Date(newPTP.date) - new Date()) / (1000 * 60 * 60 * 24)),
      outstandingBalance: 0, // In real app, fetch from debtor data
      agent: 'Current User',
      notes: newPTP.notes || '',
      emailSent: true,
      emailSentDate: `${currentDate} ${currentTime}`,
      emailContent: emailContent,
      customerResponse: null
    };

    setPtpData(prevData => [newPTPEntry, ...prevData]);

    // Log the activity
    addLog({
      user: 'Current User',
      action: 'PTP Created',
      entity: 'Debtor Account',
      entityId: newPTP.debtorId,
      entityName: `Debtor ${newPTP.debtorId}`,
      details: `Promise to Pay created for $${newPTP.amount} due on ${newPTP.date}. Reminder email sent to customer.`,
      category: 'ptp',
      status: 'success'
    });

    setAddPTPDialog(false);
    setNewPTP({ debtorId: '', amount: '', date: '', notes: '' });
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            PTP (Promise to Pay) Tracking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage payment promises
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            sx={{ mr: 1 }}
            onClick={() => {
              setLogEntityId(null);
              setLogEntityName(null);
              setActivityLogDialog(true);
            }}
          >
            View Activity Logs
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddPTPDialog(true)}
          >
            Add PTP
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total PTPs
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100}
                color="primary"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending PTPs
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Total Amount: ${stats.totalPTPAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Honored PTPs
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.honored}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Recovered: ${stats.recoveredAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Honor Rate
              </Typography>
              <Typography variant="h4" color="primary.main">
                {stats.honoreRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={parseFloat(stats.honoreRate)}
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PTP Table */}
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="All PTPs" />
            <Tab label="Pending" />
            <Tab label="Honored" />
            <Tab label="Broken" />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PTP ID</TableCell>
                  <TableCell>Debtor</TableCell>
                  <TableCell>PTP Amount</TableCell>
                  <TableCell>PTP Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Email Sent</TableCell>
                  <TableCell>Customer Response</TableCell>
                  <TableCell>Days Until Due</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentTabPTPs().map((ptp) => (
                  <TableRow key={ptp.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {ptp.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {ptp.createdDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                          {ptp.debtorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {ptp.debtorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ptp.debtorId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        ${ptp.amount.toLocaleString()}
                      </Typography>
                      {ptp.paidAmount && (
                        <Typography variant="caption" color="success.main">
                          Paid: ${ptp.paidAmount.toLocaleString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {ptp.ptpDate}
                      </Typography>
                      {ptp.paidDate && (
                        <Typography variant="caption" color="text.secondary">
                          Paid: {ptp.paidDate}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ptp.status}
                        size="small"
                        color={getStatusColor(ptp.status)}
                        icon={getStatusIcon(ptp.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {ptp.emailSent ? (
                        <Tooltip title={`Sent on ${ptp.emailSentDate || ptp.createdDate}`}>
                          <Chip
                            icon={<EmailIcon />}
                            label="Sent"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        </Tooltip>
                      ) : (
                        <Chip label="Not Sent" color="default" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      {ptp.customerResponse ? (
                        <Chip
                          label={ptp.customerResponse}
                          color={ptp.customerResponse === 'Payment Received' ? 'success' : ptp.customerResponse === 'Partial Payment Received' ? 'info' : 'default'}
                          size="small"
                        />
                      ) : ptp.status === 'Pending' ? (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Mark as Honored">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handlePTPStatusUpdate(ptp.id, 'honored')}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Mark as Broken">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handlePTPStatusUpdate(ptp.id, 'broken')}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {ptp.status === 'Pending' && (
                        <Chip
                          label={
                            ptp.daysUntilDue > 0
                              ? `${ptp.daysUntilDue} days`
                              : ptp.daysUntilDue === 0
                              ? 'Today'
                              : `${Math.abs(ptp.daysUntilDue)} days overdue`
                          }
                          size="small"
                          color={
                            ptp.daysUntilDue > 3 ? 'success' :
                            ptp.daysUntilDue > 0 ? 'warning' : 'error'
                          }
                        />
                      )}
                      {ptp.status === 'Broken' && (
                        <Chip
                          label={`${Math.abs(ptp.daysUntilDue)} days overdue`}
                          size="small"
                          color="error"
                        />
                      )}
                      {ptp.status === 'Honored' && (
                        <Chip label="On Time" size="small" color="success" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {ptp.agent}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <PhoneIcon />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <EmailIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {getCurrentTabPTPs().length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No PTPs found in this category
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Add PTP Dialog */}
      <Dialog open={addPTPDialog} onClose={() => setAddPTPDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New PTP</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Debtor Account ID"
                value={newPTP.debtorId}
                onChange={(e) => setNewPTP({ ...newPTP, debtorId: e.target.value })}
                placeholder="ACC-10001"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PTP Amount"
                type="number"
                value={newPTP.amount}
                onChange={(e) => setNewPTP({ ...newPTP, amount: e.target.value })}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PTP Date"
                type="date"
                value={newPTP.date}
                onChange={(e) => setNewPTP({ ...newPTP, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newPTP.notes}
                onChange={(e) => setNewPTP({ ...newPTP, notes: e.target.value })}
                placeholder="Add any relevant notes..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPTPDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPTP}>
            Add PTP
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activity Log Viewer */}
      <ActivityLogViewer
        open={activityLogDialog}
        onClose={() => setActivityLogDialog(false)}
        entityId={logEntityId}
        entityName={logEntityName}
      />
    </Box>
  );
};

export default PTPTracking;
