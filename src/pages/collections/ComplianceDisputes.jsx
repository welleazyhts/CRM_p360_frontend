import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Tabs, Tab, Alert, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemIcon, Badge,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  LinearProgress, alpha, useTheme, Stack, Tooltip
} from '@mui/material';
import {
  Security as SecurityIcon,
  Report as ReportIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Gavel as GavelIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Block as BlockIcon,
  Info as InfoIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';

const ComplianceDisputes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addLog } = useActivityLog();
  const currentUser = 'Current User'; // In production, get from auth context
  const [tabValue, setTabValue] = useState(0);
  const [disputeDialog, setDisputeDialog] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [newDisputeDialog, setNewDisputeDialog] = useState(false);
  const [uploadDocDialog, setUploadDocDialog] = useState(false);
  const [resolutionAction, setResolutionAction] = useState('');
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [newComplianceDialog, setNewComplianceDialog] = useState(false);
  const [newComplianceForm, setNewComplianceForm] = useState({
    type: '',
    severity: '',
    account: '',
    debtorName: '',
    agent: '',
    violation: '',
    status: '',
    action: ''
  });

  // Compliance violations tracking
  const [complianceAlerts, setComplianceAlerts] = useState([
    {
      id: 1,
      type: 'Call Time Violation',
      severity: 'High',
      account: 'ACC-2024-001',
      debtorName: 'Rajesh Kumar',
      agent: 'Priya Sharma',
      violation: 'Call attempted at 9:45 PM (after 9 PM restriction)',
      timestamp: '2025-01-18 21:45',
      status: 'Reviewed',
      action: 'Agent warned, call blocked'
    },
    {
      id: 2,
      type: 'Frequency Limit',
      severity: 'Medium',
      account: 'ACC-2024-003',
      debtorName: 'Amit Singh',
      agent: 'System',
      violation: '8 call attempts in 7 days (max 7 allowed per Reg F)',
      timestamp: '2025-01-17 14:30',
      status: 'Auto-Blocked',
      action: 'Account cooling period enforced'
    },
    {
      id: 3,
      type: 'Cease & Desist',
      severity: 'Critical',
      account: 'ACC-2024-005',
      debtorName: 'Neha Gupta',
      agent: 'All Agents',
      violation: 'Written cease & desist received',
      timestamp: '2025-01-15 10:20',
      status: 'Active',
      action: 'All communications stopped'
    }
  ]);

  // Dispute cases
  const [disputes, setDisputes] = useState([
    {
      id: 1,
      disputeNumber: 'DISP-2025-001',
      account: 'ACC-2024-002',
      debtorName: 'Priya Mehta',
      debtAmount: 82000,
      disputeReason: 'Debt Not Recognized',
      filedDate: '2025-01-15',
      dueDate: '2025-02-14',
      daysRemaining: 30,
      status: 'Under Investigation',
      assignedTo: 'Legal Team',
      documents: 3,
      accountFrozen: true,
      creditReportingHold: true
    },
    {
      id: 2,
      disputeNumber: 'DISP-2025-002',
      account: 'ACC-2024-008',
      debtorName: 'Rahul Verma',
      debtAmount: 45000,
      disputeReason: 'Amount Incorrect',
      filedDate: '2025-01-12',
      dueDate: '2025-02-11',
      daysRemaining: 27,
      status: 'Awaiting Documents',
      assignedTo: 'Compliance Team',
      documents: 1,
      accountFrozen: true,
      creditReportingHold: true
    },
    {
      id: 3,
      disputeNumber: 'DISP-2025-003',
      account: 'ACC-2024-012',
      debtorName: 'Sneha Patel',
      debtAmount: 125000,
      disputeReason: 'Identity Theft',
      filedDate: '2025-01-10',
      dueDate: '2025-02-09',
      daysRemaining: 25,
      status: 'Resolved - Validated',
      assignedTo: 'Fraud Prevention',
      documents: 8,
      accountFrozen: false,
      creditReportingHold: false
    }
  ]);

  // Compliance rules
  const complianceRules = [
    {
      category: 'Call Timing',
      rule: 'No calls before 8 AM or after 9 PM (local time)',
      regulation: 'FDCPA § 805(a)(1)',
      status: 'Active',
      violations: 2
    },
    {
      category: 'Contact Frequency',
      rule: 'Maximum 7 call attempts in 7 days',
      regulation: 'Reg F § 1006.14(b)',
      status: 'Active',
      violations: 1
    },
    {
      category: 'Communication Methods',
      rule: 'Limit contact to phone, mail, or in-person',
      regulation: 'FDCPA § 805(a)',
      status: 'Active',
      violations: 0
    },
    {
      category: 'Third Party Disclosure',
      rule: 'No disclosure of debt to third parties',
      regulation: 'FDCPA § 805(b)',
      status: 'Active',
      violations: 0
    },
    {
      category: 'Cease & Desist',
      rule: 'Stop all communication upon written request',
      regulation: 'FDCPA § 805(c)',
      status: 'Active',
      violations: 0
    },
    {
      category: 'Attorney Representation',
      rule: 'Contact attorney only if debtor is represented',
      regulation: 'FDCPA § 805(a)(2)',
      status: 'Active',
      violations: 0
    },
    {
      category: 'Validation Notice',
      rule: 'Send validation notice within 5 days of first contact',
      regulation: 'FDCPA § 809(a)',
      status: 'Active',
      violations: 0
    },
    {
      category: 'Mini-Miranda',
      rule: 'Required disclosure on all communications',
      regulation: 'FDCPA § 807(11)',
      status: 'Active',
      violations: 0
    }
  ];

  const handleViewDispute = (dispute) => {
    setSelectedDispute(dispute);
    setDisputeDialog(true);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getDisputeStatusColor = (status) => {
    if (status.includes('Resolved')) return 'success';
    if (status.includes('Under Investigation')) return 'warning';
    if (status.includes('Awaiting')) return 'info';
    return 'default';
  };

  // Handler functions
  const handleNewDispute = () => {
    setNewDisputeDialog(true);
  };

  const handleNewCompliance = () => {
    setNewComplianceDialog(true);
  };

  const handleComplianceFormChange = (field, value) => {
    setNewComplianceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCompliance = () => {
    // Validate required fields
    if (!newComplianceForm.type || !newComplianceForm.severity || !newComplianceForm.violation) {
      alert('Please fill in all required fields (Type, Severity, and Violation Details).');
      return;
    }

    // Create new compliance alert
    const newAlert = {
      id: complianceAlerts.length + 1,
      type: newComplianceForm.type,
      severity: newComplianceForm.severity,
      account: newComplianceForm.account || 'N/A',
      debtorName: newComplianceForm.debtorName || 'N/A',
      agent: newComplianceForm.agent || currentUser,
      violation: newComplianceForm.violation,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: newComplianceForm.status || 'Pending',
      action: newComplianceForm.action || 'Under review'
    };

    // Add to compliance alerts
    setComplianceAlerts(prev => [newAlert, ...prev]);

    // Log activity
    addLog({
      user: currentUser,
      action: 'Compliance Alert Created',
      entity: 'Compliance',
      entityId: `COMP-${newAlert.id}`,
      entityName: newComplianceForm.type,
      details: `Created new ${newComplianceForm.severity} severity compliance alert: ${newComplianceForm.type} - ${newComplianceForm.violation}`,
      category: 'compliance',
      status: 'success'
    });

    // Reset form and close dialog
    setNewComplianceForm({
      type: '',
      severity: '',
      account: '',
      debtorName: '',
      agent: '',
      violation: '',
      status: '',
      action: ''
    });
    setNewComplianceDialog(false);

    alert('Compliance alert created successfully!\n\nThis will be connected to backend API.');
  };

  const handleViewDocument = (docName) => {
    addLog({
      user: currentUser,
      action: 'Document Viewed',
      entity: 'Dispute',
      entityId: selectedDispute?.disputeNumber || 'N/A',
      entityName: docName,
      details: `Viewed document: ${docName}`,
      category: 'compliance',
      status: 'success'
    });
    alert(`Opening document: ${docName}\n\nThis will be connected to document viewer system.`);
  };

  const handleUploadDocument = () => {
    setUploadDocDialog(true);
  };

  const handleUploadConfirm = () => {
    addLog({
      user: currentUser,
      action: 'Document Uploaded',
      entity: 'Dispute',
      entityId: selectedDispute?.disputeNumber || 'N/A',
      entityName: 'Additional Document',
      details: `Uploaded additional document for dispute ${selectedDispute?.disputeNumber}`,
      category: 'compliance',
      status: 'success'
    });
    alert('Document uploaded successfully!\n\nThis will be connected to backend document storage API.');
    setUploadDocDialog(false);
  };

  const handleSendValidationLetter = () => {
    addLog({
      user: currentUser,
      action: 'Validation Letter Sent',
      entity: 'Dispute',
      entityId: selectedDispute?.disputeNumber || 'N/A',
      entityName: selectedDispute?.debtorName || 'N/A',
      details: `Sent validation letter for dispute ${selectedDispute?.disputeNumber} to ${selectedDispute?.debtorName}`,
      category: 'compliance',
      status: 'success'
    });
    alert(`Validation letter sent to ${selectedDispute?.debtorName}!\n\nLetter sent via:\n- Certified Mail\n- Email\n- Debtor Portal\n\nThis will be connected to backend communication API.`);
  };

  const handleUpdateResolve = () => {
    if (!resolutionAction) {
      alert('Please select a resolution action first.');
      return;
    }

    addLog({
      user: currentUser,
      action: 'Dispute Resolved',
      entity: 'Dispute',
      entityId: selectedDispute?.disputeNumber || 'N/A',
      entityName: selectedDispute?.debtorName || 'N/A',
      details: `Resolved dispute ${selectedDispute?.disputeNumber}: ${resolutionAction}. Notes: ${investigationNotes}`,
      category: 'compliance',
      status: 'success'
    });

    // Update dispute status
    setDisputes(prevDisputes =>
      prevDisputes.map(d =>
        d.id === selectedDispute.id
          ? { ...d, status: 'Resolved', accountFrozen: false, creditReportingHold: false }
          : d
      )
    );

    alert(`Dispute ${selectedDispute?.disputeNumber} resolved successfully!\n\nResolution: ${resolutionAction}\n\nThis will be connected to backend API.`);
    setDisputeDialog(false);
    setResolutionAction('');
    setInvestigationNotes('');
  };

  const renderComplianceOverview = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), borderLeft: `4px solid ${theme.palette.success.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Compliance Score
            </Typography>
            <Typography variant="h4" fontWeight={600} color="success.main">
              98.5%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 30 days
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), borderLeft: `4px solid ${theme.palette.warning.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Active Violations
            </Typography>
            <Typography variant="h4" fontWeight={600} color="warning.main">
              3
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Requires attention
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), borderLeft: `4px solid ${theme.palette.error.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Cease & Desist
            </Typography>
            <Typography variant="h4" fontWeight={600} color="error.main">
              12
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Accounts blocked
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.05), borderLeft: `4px solid ${theme.palette.info.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Active Disputes
            </Typography>
            <Typography variant="h4" fontWeight={600} color="info.main">
              15
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Under investigation
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderComplianceTab = () => (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <SecurityIcon color="primary" />
          Real-Time Compliance Monitor
        </Typography>

        {/* Compliance Rules */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Active Compliance Rules
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rule</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Regulation</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Violations (30d)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complianceRules.map((rule, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {rule.category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {rule.rule}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={rule.regulation} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={rule.status}
                      color="success"
                      size="small"
                      icon={<CheckCircleIcon fontSize="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    {rule.violations > 0 ? (
                      <Chip
                        label={rule.violations}
                        color="error"
                        size="small"
                      />
                    ) : (
                      <Chip label="0" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Recent Violations */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Recent Compliance Alerts
          </Typography>
          <Button variant="contained" startIcon={<SecurityIcon />} onClick={handleNewCompliance} size="small">
            Add Compliance Item
          </Button>
        </Box>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Violation Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Agent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action Taken</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complianceAlerts.map((alert) => (
                <TableRow key={alert.id} hover>
                  <TableCell>
                    <Chip
                      label={alert.severity}
                      color={getSeverityColor(alert.severity)}
                      size="small"
                      icon={
                        alert.severity === 'Critical' ? <ErrorIcon fontSize="small" /> :
                        alert.severity === 'High' ? <WarningIcon fontSize="small" /> :
                        <InfoIcon fontSize="small" />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {alert.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {alert.debtorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.account}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {alert.violation}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {alert.agent}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {alert.timestamp}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary.main">
                      {alert.action}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={alert.status}
                      color={alert.status === 'Active' ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderDisputesTab = () => (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportIcon color="primary" />
            Dispute Management ({disputes.length})
          </Typography>
          <Button variant="contained" startIcon={<AssignmentIcon />} onClick={handleNewDispute}>
            New Dispute
          </Button>
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }} icon={<TimerIcon />}>
          <Typography variant="body2">
            <strong>Legal Requirement:</strong> All disputes must be investigated and resolved within 30 days of receipt.
            Accounts are automatically frozen during investigation period.
          </Typography>
        </Alert>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Dispute #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Debtor / Account</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Filed Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Days Remaining</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Flags</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {dispute.disputeNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        {dispute.debtorName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {dispute.debtorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dispute.account}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{dispute.debtAmount.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={dispute.disputeReason} size="small" color="warning" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {dispute.filedDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={((30 - dispute.daysRemaining) / 30) * 100}
                        sx={{
                          width: 60,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: dispute.daysRemaining <= 7 ? theme.palette.error.main :
                                     dispute.daysRemaining <= 14 ? theme.palette.warning.main :
                                     theme.palette.success.main
                          }
                        }}
                      />
                      <Typography variant="caption" fontWeight={600}>
                        {dispute.daysRemaining}d
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={dispute.status}
                      color={getDisputeStatusColor(dispute.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {dispute.assignedTo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      {dispute.accountFrozen && (
                        <Tooltip title="Account Frozen">
                          <BlockIcon fontSize="small" color="error" />
                        </Tooltip>
                      )}
                      {dispute.creditReportingHold && (
                        <Tooltip title="Credit Reporting on Hold">
                          <WarningIcon fontSize="small" color="warning" />
                        </Tooltip>
                      )}
                      {dispute.documents > 0 && (
                        <Tooltip title={`${dispute.documents} Documents`}>
                          <Badge badgeContent={dispute.documents} color="primary">
                            <AttachFileIcon fontSize="small" color="action" />
                          </Badge>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDispute(dispute)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderDisputeDialog = () => (
    <Dialog
      open={disputeDialog}
      onClose={() => setDisputeDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Dispute Details: {selectedDispute?.disputeNumber}
          </Typography>
          <Chip
            label={`${selectedDispute?.daysRemaining} days remaining`}
            sx={{ bgcolor: 'white', color: theme.palette.primary.main, fontWeight: 600 }}
          />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedDispute && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning">
                <Typography variant="body2">
                  <strong>Account Status:</strong> {selectedDispute.accountFrozen ? 'Frozen - ' : ''}
                  All collection activities suspended during investigation.
                  {selectedDispute.creditReportingHold && ' Credit bureau reporting on hold.'}
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Debtor Information
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedDispute.debtorName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Account: {selectedDispute.account}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Disputed Amount:</strong> ₹{selectedDispute.debtAmount.toLocaleString('en-IN')}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonIcon />}
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                    onClick={() => {
                      // Navigate to debtor details page
                      // The state will contain the referrer info so back button works correctly
                      navigate(`/collections/debtor-management/${selectedDispute.account}`, {
                        state: { from: '/collections/compliance-disputes', disputeId: selectedDispute.disputeNumber }
                      });
                    }}
                    sx={{ mt: 1 }}
                  >
                    View Debtor Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Dispute Status
                  </Typography>
                  <Chip
                    label={selectedDispute.status}
                    color={getDisputeStatusColor(selectedDispute.status)}
                    sx={{ mb: 1 }}
                  />
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2">
                    <strong>Filed:</strong> {selectedDispute.filedDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Due:</strong> {selectedDispute.dueDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Assigned:</strong> {selectedDispute.assignedTo}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Dispute Reason
                  </Typography>
                  <Chip label={selectedDispute.disputeReason} color="warning" sx={{ mb: 2 }} />
                  <Typography variant="body2" paragraph>
                    The debtor has submitted a formal dispute claiming that the debt is not recognized or the amount is incorrect.
                    All collection activities have been suspended pending investigation and validation of the debt.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Submitted Documents ({selectedDispute.documents})
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <AttachFileIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Dispute Letter"
                        secondary="dispute_letter.pdf • 245 KB • Uploaded Jan 15, 2025"
                      />
                      <IconButton size="small" onClick={() => handleViewDocument('dispute_letter.pdf')}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                    {selectedDispute.documents > 1 && (
                      <>
                        <ListItem>
                          <ListItemIcon>
                            <AttachFileIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="ID Proof"
                            secondary="identity_proof.pdf • 1.2 MB • Uploaded Jan 15, 2025"
                          />
                          <IconButton size="small" onClick={() => handleViewDocument('identity_proof.pdf')}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <AttachFileIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Supporting Evidence"
                            secondary="evidence.pdf • 856 KB • Uploaded Jan 16, 2025"
                          />
                          <IconButton size="small" onClick={() => handleViewDocument('evidence.pdf')}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </ListItem>
                      </>
                    )}
                  </List>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={handleUploadDocument}
                  >
                    Upload Additional Documents
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Investigation Notes"
                multiline
                rows={4}
                placeholder="Add investigation findings and actions taken..."
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Resolution Action</InputLabel>
                <Select value={resolutionAction} onChange={(e) => setResolutionAction(e.target.value)} label="Resolution Action">
                  <MenuItem value="">Select action...</MenuItem>
                  <MenuItem value="validated">Debt Validated - Resume Collection</MenuItem>
                  <MenuItem value="modified">Debt Amount Modified</MenuItem>
                  <MenuItem value="invalid">Debt Invalid - Close Account</MenuItem>
                  <MenuItem value="pending">Request More Information</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setDisputeDialog(false)}>Close</Button>
        <Button variant="outlined" startIcon={<SendIcon />} onClick={handleSendValidationLetter}>
          Send Validation Letter
        </Button>
        <Button variant="contained" onClick={handleUpdateResolve}>
          Update & Resolve
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Upload Document Dialog
  const renderUploadDialog = () => (
    <Dialog open={uploadDocDialog} onClose={() => setUploadDocDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Additional Documents</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload supporting documents for dispute {selectedDispute?.disputeNumber}
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Choose File
            <input type="file" hidden />
          </Button>
          <Alert severity="info" sx={{ mt: 2 }}>
            Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10 MB)
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setUploadDocDialog(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleUploadConfirm}>Upload</Button>
      </DialogActions>
    </Dialog>
  );

  //New Dispute Dialog
  const renderNewDisputeDialog = () => (
    <Dialog open={newDisputeDialog} onClose={() => setNewDisputeDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Dispute</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Account Number" placeholder="Enter account number" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Debtor Name" placeholder="Enter debtor name" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Dispute Reason</InputLabel>
                <Select defaultValue="" label="Dispute Reason">
                  <MenuItem value="not_recognized">Debt Not Recognized</MenuItem>
                  <MenuItem value="amount_incorrect">Amount Incorrect</MenuItem>
                  <MenuItem value="already_paid">Already Paid</MenuItem>
                  <MenuItem value="identity_theft">Identity Theft</MenuItem>
                  <MenuItem value="statute_limitations">Statute of Limitations</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Dispute Details"
                placeholder="Enter dispute details and debtor's claims..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setNewDisputeDialog(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => {
          alert('New dispute created successfully!\n\nThis will be connected to backend API.');
          setNewDisputeDialog(false);
        }}>
          Create Dispute
        </Button>
      </DialogActions>
    </Dialog>
  );

  // New Compliance Dialog
  const renderNewComplianceDialog = () => (
    <Dialog open={newComplianceDialog} onClose={() => setNewComplianceDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon />
          <Typography variant="h6">Add New Compliance Alert</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Compliance Type</InputLabel>
                <Select
                  value={newComplianceForm.type}
                  onChange={(e) => handleComplianceFormChange('type', e.target.value)}
                  label="Compliance Type"
                >
                  <MenuItem value="Call Time Violation">Call Time Violation</MenuItem>
                  <MenuItem value="Frequency Limit">Frequency Limit</MenuItem>
                  <MenuItem value="Cease & Desist">Cease & Desist</MenuItem>
                  <MenuItem value="Third Party Disclosure">Third Party Disclosure</MenuItem>
                  <MenuItem value="Mini-Miranda">Mini-Miranda Violation</MenuItem>
                  <MenuItem value="Validation Notice">Validation Notice Issue</MenuItem>
                  <MenuItem value="Attorney Representation">Attorney Representation Violation</MenuItem>
                  <MenuItem value="Harassment">Harassment / Abusive Conduct</MenuItem>
                  <MenuItem value="False Statement">False or Misleading Statement</MenuItem>
                  <MenuItem value="Other">Other Violation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={newComplianceForm.severity}
                  onChange={(e) => handleComplianceFormChange('severity', e.target.value)}
                  label="Severity"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                placeholder="e.g., ACC-2024-001"
                value={newComplianceForm.account}
                onChange={(e) => handleComplianceFormChange('account', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Debtor Name"
                placeholder="Enter debtor name"
                value={newComplianceForm.debtorName}
                onChange={(e) => handleComplianceFormChange('debtorName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Agent Name"
                placeholder="Enter agent name"
                value={newComplianceForm.agent}
                onChange={(e) => handleComplianceFormChange('agent', e.target.value)}
                helperText="Leave blank to use current user"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newComplianceForm.status}
                  onChange={(e) => handleComplianceFormChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Reviewed">Reviewed</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Auto-Blocked">Auto-Blocked</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Violation Details"
                placeholder="Describe the compliance violation in detail..."
                value={newComplianceForm.violation}
                onChange={(e) => handleComplianceFormChange('violation', e.target.value)}
                required
                helperText="Required: Provide detailed description of the violation"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Action Taken"
                placeholder="Describe the action taken or to be taken..."
                value={newComplianceForm.action}
                onChange={(e) => handleComplianceFormChange('action', e.target.value)}
                helperText="Leave blank to default to 'Under review'"
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Note:</strong> Creating a compliance alert will be logged in the activity history
                  and may trigger automatic workflow actions based on the violation type and severity.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => {
          setNewComplianceDialog(false);
          setNewComplianceForm({
            type: '',
            severity: '',
            account: '',
            debtorName: '',
            agent: '',
            violation: '',
            status: '',
            action: ''
          });
        }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAddCompliance} startIcon={<SecurityIcon />}>
          Create Compliance Alert
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Compliance & Dispute Management
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          <strong>Regulatory Compliance:</strong> Real-time monitoring of FDCPA, TCPA, and Reg F compliance.
          Automatic enforcement of call time restrictions, frequency limits, cease & desist orders, and dispute handling workflows.
        </Typography>
      </Alert>

      {renderComplianceOverview()}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Compliance Monitor" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Dispute Management" icon={<ReportIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {tabValue === 0 && renderComplianceTab()}
      {tabValue === 1 && renderDisputesTab()}
      {renderDisputeDialog()}
      {renderUploadDialog()}
      {renderNewDisputeDialog()}
      {renderNewComplianceDialog()}
    </Box>
  );
};

export default ComplianceDisputes;
