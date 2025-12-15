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
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Avatar,
  Paper
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
  Gavel as GavelIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  AttachFile as AttachIcon,
  Send as SendIcon,
  Person as PersonIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';

const LegalEscalation = () => {
  const { addLog } = useActivityLog();
  const currentUser = 'Current User';
  const [tabValue, setTabValue] = useState(0);
  const [escalateDialog, setEscalateDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [escalationStep, setEscalationStep] = useState(0);
  const [uploadDocDialog, setUploadDocDialog] = useState(false);
  const [scheduleHearingDialog, setScheduleHearingDialog] = useState(false);
  const [hearingDate, setHearingDate] = useState('');
  const [hearingType, setHearingType] = useState('');
  const [hearingNotes, setHearingNotes] = useState('');
  const [legalCases, setLegalCases] = useState([]);
  const [escalationForm, setEscalationForm] = useState({
    accountId: '',
    reason: '',
    legalAction: '',
    attorney: '',
    documents: [],
    notes: ''
  });

  // Mock legal case data
  const mockLegalCases = [
    {
      id: 'LGL-001',
      accountId: 'ACC-10003',
      debtorName: 'Robert Brown',
      outstandingBalance: 15600.00,
      originalBalance: 18000.00,
      dpd: 540,
      escalationDate: '2025-01-10',
      status: 'Pre-Legal Review',
      legalAction: 'Demand Letter',
      attorney: 'Smith & Associates',
      nextHearing: null,
      documents: ['Account Statement', 'Collection History', 'Original Agreement'],
      stage: 'Demand Letter Sent',
      estimatedCost: 500.00,
      timeline: [
        { date: '2025-01-10', event: 'Case Escalated to Legal', status: 'completed' },
        { date: '2025-01-12', event: 'Pre-Legal Review Completed', status: 'completed' },
        { date: '2025-01-15', event: 'Demand Letter Prepared', status: 'completed' },
        { date: '2025-01-17', event: 'Demand Letter Sent', status: 'completed' },
        { date: '2025-02-01', event: 'Response Deadline', status: 'pending' }
      ]
    },
    {
      id: 'LGL-002',
      accountId: 'ACC-10025',
      debtorName: 'Patricia Miller',
      outstandingBalance: 22000.00,
      originalBalance: 25000.00,
      dpd: 620,
      escalationDate: '2024-12-20',
      status: 'Lawsuit Filed',
      legalAction: 'Civil Lawsuit',
      attorney: 'Johnson Legal Group',
      nextHearing: '2025-02-10',
      documents: ['Complaint', 'Summons', 'Proof of Service', 'Evidence Package'],
      stage: 'Awaiting Court Date',
      estimatedCost: 2500.00,
      timeline: [
        { date: '2024-12-20', event: 'Case Escalated to Legal', status: 'completed' },
        { date: '2024-12-28', event: 'Lawsuit Prepared', status: 'completed' },
        { date: '2025-01-05', event: 'Lawsuit Filed', status: 'completed' },
        { date: '2025-01-10', event: 'Summons Served', status: 'completed' },
        { date: '2025-02-10', event: 'Court Hearing', status: 'pending' }
      ]
    },
    {
      id: 'LGL-003',
      accountId: 'ACC-10042',
      debtorName: 'Michael Johnson',
      outstandingBalance: 9800.00,
      originalBalance: 12000.00,
      dpd: 480,
      escalationDate: '2025-01-05',
      status: 'Pre-Legal Review',
      legalAction: 'Skip Trace & Demand',
      attorney: 'Martinez Law Firm',
      nextHearing: null,
      documents: ['Account Statement', 'Collection History'],
      stage: 'Skip Trace in Progress',
      estimatedCost: 350.00,
      timeline: [
        { date: '2025-01-05', event: 'Case Escalated to Legal', status: 'completed' },
        { date: '2025-01-08', event: 'Skip Trace Initiated', status: 'completed' },
        { date: '2025-01-20', event: 'Skip Trace Results Due', status: 'pending' }
      ]
    },
    {
      id: 'LGL-004',
      accountId: 'ACC-10018',
      debtorName: 'Jennifer Davis',
      outstandingBalance: 18500.00,
      originalBalance: 20000.00,
      dpd: 720,
      escalationDate: '2024-11-15',
      status: 'Judgment Obtained',
      legalAction: 'Default Judgment',
      attorney: 'Smith & Associates',
      nextHearing: null,
      documents: ['Judgment Order', 'Writ of Execution', 'Asset Search Report'],
      stage: 'Asset Recovery in Progress',
      estimatedCost: 3200.00,
      judgmentAmount: 19800.00,
      judgmentDate: '2025-01-12',
      timeline: [
        { date: '2024-11-15', event: 'Case Escalated to Legal', status: 'completed' },
        { date: '2024-12-01', event: 'Lawsuit Filed', status: 'completed' },
        { date: '2024-12-20', event: 'Default Judgment Requested', status: 'completed' },
        { date: '2025-01-12', event: 'Judgment Obtained', status: 'completed' },
        { date: '2025-01-15', event: 'Asset Search Initiated', status: 'completed' }
      ]
    }
  ];

  // Initialize legal cases on mount
  React.useEffect(() => {
    setLegalCases(mockLegalCases);
  }, []);

  // Legal action stats - use legalCases state
  const legalStats = {
    totalCases: legalCases.length,
    preLegalReview: legalCases.filter(c => c.status === 'Pre-Legal Review').length,
    lawsuitFiled: legalCases.filter(c => c.status === 'Lawsuit Filed').length,
    judgmentObtained: legalCases.filter(c => c.status === 'Judgment Obtained').length,
    totalValue: legalCases.reduce((sum, c) => sum + c.outstandingBalance, 0),
    estimatedCosts: legalCases.reduce((sum, c) => sum + c.estimatedCost, 0)
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pre-Legal Review': 'warning',
      'Demand Letter Sent': 'info',
      'Lawsuit Filed': 'primary',
      'Judgment Obtained': 'success',
      'Case Closed': 'default',
      'Settlement Reached': 'success'
    };
    return colors[status] || 'default';
  };

  const handleEscalateCase = () => {
    if (escalationStep < 2) {
      setEscalationStep(escalationStep + 1);
    } else {
      console.log('Escalating case to legal:', escalationForm);
      setEscalateDialog(false);
      setEscalationStep(0);
      setEscalationForm({
        accountId: '',
        reason: '',
        legalAction: '',
        attorney: '',
        documents: [],
        notes: ''
      });
    }
  };

  const handleViewDetails = (legalCase) => {
    setSelectedCase(legalCase);
    setDetailsDialog(true);
  };

  const handleUploadDocuments = () => {
    setUploadDocDialog(true);
  };

  const handleUploadConfirm = () => {
    addLog({
      user: currentUser,
      action: 'Documents Uploaded',
      entity: 'Legal Case',
      entityId: selectedCase?.caseNumber || 'N/A',
      entityName: 'Legal Documents',
      details: `Uploaded additional documents for case ${selectedCase?.caseNumber}`,
      category: 'legal',
      status: 'success'
    });
    alert('Documents uploaded successfully!\n\nThis will be connected to backend document storage API.');
    setUploadDocDialog(false);
  };

  const handleViewDocument = (docName) => {
    addLog({
      user: currentUser,
      action: 'Document Viewed',
      entity: 'Legal Case',
      entityId: selectedCase?.caseNumber || 'N/A',
      entityName: docName,
      details: `Viewed document: ${docName}`,
      category: 'legal',
      status: 'success'
    });
    alert(`Opening document: ${docName}\n\nThis will be connected to document viewer system.`);
  };

  const handleDownloadDocument = (docName) => {
    addLog({
      user: currentUser,
      action: 'Document Downloaded',
      entity: 'Legal Case',
      entityId: selectedCase?.caseNumber || 'N/A',
      entityName: docName,
      details: `Downloaded document: ${docName}`,
      category: 'legal',
      status: 'success'
    });
    alert(`Downloading document: ${docName}\n\nThis will be connected to document download system.`);
  };

  const handleSendToAttorney = () => {
    addLog({
      user: currentUser,
      action: 'Case Sent to Attorney',
      entity: 'Legal Case',
      entityId: selectedCase?.caseNumber || 'N/A',
      entityName: selectedCase?.debtorName || 'N/A',
      details: `Sent case ${selectedCase?.caseNumber} to attorney ${selectedCase?.attorney}`,
      category: 'legal',
      status: 'success'
    });
    alert(`Case ${selectedCase?.caseNumber} sent to ${selectedCase?.attorney}!\n\nSent via:\n- Email with case documents\n- Legal Portal\n- SMS notification\n\nThis will be connected to backend communication API.`);
    setDetailsDialog(false);
  };

  const handleScheduleHearing = () => {
    setScheduleHearingDialog(true);
  };

  const handleScheduleHearingConfirm = () => {
    // Update the case with new hearing date
    setLegalCases(prevCases =>
      prevCases.map(c =>
        c.id === selectedCase.id
          ? { ...c, nextHearing: hearingDate }
          : c
      )
    );

    // Update the selected case
    setSelectedCase(prev => ({ ...prev, nextHearing: hearingDate }));

    // Log the activity
    addLog({
      user: currentUser,
      action: 'Hearing Scheduled',
      entity: 'Legal Case',
      entityId: selectedCase?.id || 'N/A',
      entityName: selectedCase?.debtorName || 'N/A',
      details: `Scheduled ${hearingType} for ${hearingDate}. Notes: ${hearingNotes}`,
      category: 'legal',
      status: 'success'
    });

    alert(`Hearing scheduled successfully!\n\nCase: ${selectedCase?.id}\nType: ${hearingType}\nDate: ${hearingDate}\n\nNotifications sent to:\n- Attorney: ${selectedCase?.attorney}\n- Court System\n- Internal Team`);

    // Reset form
    setHearingDate('');
    setHearingType('');
    setHearingNotes('');
    setScheduleHearingDialog(false);
  };

  const filterCases = (status) => {
    if (status === 'all') return legalCases;
    return legalCases.filter(c => c.status === status);
  };

  const getCurrentTabCases = () => {
    const statusMap = ['all', 'Pre-Legal Review', 'Lawsuit Filed', 'Judgment Obtained'];
    return filterCases(statusMap[tabValue]);
  };

  const renderEscalationStep = () => {
    switch (escalationStep) {
      case 0:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Select the account to escalate to legal action
            </Alert>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Account</InputLabel>
              <Select
                value={escalationForm.accountId}
                label="Select Account"
                onChange={(e) => setEscalationForm({ ...escalationForm, accountId: e.target.value })}
              >
                <MenuItem value="">-- Select Account --</MenuItem>
                <MenuItem value="ACC-10001">ACC-10001 - John Smith ($12,500)</MenuItem>
                <MenuItem value="ACC-10005">ACC-10005 - David Wilson ($22,000)</MenuItem>
                <MenuItem value="ACC-10008">ACC-10008 - Lisa Anderson ($9,500)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason for Escalation</InputLabel>
              <Select
                value={escalationForm.reason}
                label="Reason for Escalation"
                onChange={(e) => setEscalationForm({ ...escalationForm, reason: e.target.value })}
              >
                <MenuItem value="">-- Select Reason --</MenuItem>
                <MenuItem value="no_contact">Unable to Contact Debtor</MenuItem>
                <MenuItem value="broken_ptp">Repeated Broken PTPs</MenuItem>
                <MenuItem value="dispute">Debtor Disputes Debt</MenuItem>
                <MenuItem value="refusal">Debtor Refuses to Pay</MenuItem>
                <MenuItem value="skip_trace">Skip Trace Required</MenuItem>
                <MenuItem value="high_balance">High Balance Account</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              value={escalationForm.notes}
              onChange={(e) => setEscalationForm({ ...escalationForm, notes: e.target.value })}
              placeholder="Provide any additional context..."
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Select the legal action type and assign attorney
            </Alert>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Legal Action Type</InputLabel>
              <Select
                value={escalationForm.legalAction}
                label="Legal Action Type"
                onChange={(e) => setEscalationForm({ ...escalationForm, legalAction: e.target.value })}
              >
                <MenuItem value="">-- Select Action --</MenuItem>
                <MenuItem value="demand_letter">Demand Letter</MenuItem>
                <MenuItem value="skip_trace">Skip Trace</MenuItem>
                <MenuItem value="civil_lawsuit">Civil Lawsuit</MenuItem>
                <MenuItem value="small_claims">Small Claims Court</MenuItem>
                <MenuItem value="judgment_enforcement">Judgment Enforcement</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assign Attorney/Law Firm</InputLabel>
              <Select
                value={escalationForm.attorney}
                label="Assign Attorney/Law Firm"
                onChange={(e) => setEscalationForm({ ...escalationForm, attorney: e.target.value })}
              >
                <MenuItem value="">-- Select Attorney --</MenuItem>
                <MenuItem value="smith_associates">Smith & Associates</MenuItem>
                <MenuItem value="johnson_legal">Johnson Legal Group</MenuItem>
                <MenuItem value="martinez_law">Martinez Law Firm</MenuItem>
                <MenuItem value="brown_partners">Brown & Partners</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Estimated Legal Costs
              </Typography>
              <Typography variant="h6" color="warning.main">
                $500 - $2,500
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Varies based on action type and complexity
              </Typography>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Review and attach required documents before escalation
            </Alert>
            <Typography variant="subtitle2" gutterBottom>
              Required Documents
            </Typography>
            <List>
              <ListItem>
                <Checkbox />
                <ListItemText primary="Account Statement" secondary="Current balance and transaction history" />
              </ListItem>
              <ListItem>
                <Checkbox />
                <ListItemText primary="Collection History" secondary="Contact attempts and communication logs" />
              </ListItem>
              <ListItem>
                <Checkbox />
                <ListItemText primary="Original Agreement" secondary="Signed credit agreement or loan documents" />
              </ListItem>
              <ListItem>
                <Checkbox />
                <ListItemText primary="Proof of Debt" secondary="Chain of title documentation" />
              </ListItem>
              <ListItem>
                <Checkbox />
                <ListItemText primary="FDCPA Compliance" secondary="Validation notice and compliance records" />
              </ListItem>
            </List>
            <Button variant="outlined" startIcon={<AttachIcon />} sx={{ mb: 2 }} onClick={handleUploadDocuments}>
              Upload Additional Documents
            </Button>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Escalation Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Account</Typography>
                <Typography variant="body1" fontWeight="bold">{escalationForm.accountId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Legal Action</Typography>
                <Typography variant="body1">{escalationForm.legalAction}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Attorney</Typography>
                <Typography variant="body1">{escalationForm.attorney}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Reason</Typography>
                <Typography variant="body1">{escalationForm.reason}</Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Legal Escalation & Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage legal actions and litigation for collection accounts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setEscalateDialog(true)}
        >
          Escalate to Legal
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Legal Cases
                  </Typography>
                  <Typography variant="h4">
                    {legalStats.totalCases}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Value: ${(legalStats.totalValue / 1000).toFixed(0)}K
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <GavelIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pre-Legal Review
              </Typography>
              <Typography variant="h4" color="warning.main">
                {legalStats.preLegalReview}
              </Typography>
              <Chip label="Pending Review" size="small" color="warning" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Lawsuit Filed
              </Typography>
              <Typography variant="h4" color="primary.main">
                {legalStats.lawsuitFiled}
              </Typography>
              <Chip label="Active Litigation" size="small" color="primary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Judgments Obtained
              </Typography>
              <Typography variant="h4" color="success.main">
                {legalStats.judgmentObtained}
              </Typography>
              <Chip label="Enforcement Phase" size="small" color="success" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Legal Cases Table */}
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="All Cases" />
            <Tab label="Pre-Legal Review" />
            <Tab label="Lawsuit Filed" />
            <Tab label="Judgment Obtained" />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Legal Case ID</TableCell>
                  <TableCell>Debtor Account</TableCell>
                  <TableCell>Outstanding Balance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Legal Action</TableCell>
                  <TableCell>Attorney</TableCell>
                  <TableCell>Next Hearing</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentTabCases().map((legalCase) => (
                  <TableRow key={legalCase.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {legalCase.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Escalated: {legalCase.escalationDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                          {legalCase.debtorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {legalCase.debtorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {legalCase.accountId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="error.main">
                        ${legalCase.outstandingBalance.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {legalCase.dpd} DPD
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={legalCase.status}
                        size="small"
                        color={getStatusColor(legalCase.status)}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {legalCase.stage}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {legalCase.legalAction}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {legalCase.attorney}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cost: ${legalCase.estimatedCost.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {legalCase.nextHearing ? (
                        <Chip
                          label={legalCase.nextHearing}
                          size="small"
                          icon={<ScheduleIcon />}
                          color="warning"
                        />
                      ) : (
                        <Chip label="No Hearing" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleViewDetails(legalCase)}>
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => {
                        setSelectedCase(legalCase);
                        handleUploadDocuments();
                      }}>
                        <DocumentIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {getCurrentTabCases().length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No legal cases found in this category
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Escalate to Legal Dialog */}
      <Dialog open={escalateDialog} onClose={() => setEscalateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Escalate Account to Legal Action</DialogTitle>
        <DialogContent>
          <Stepper activeStep={escalationStep} sx={{ mb: 4, mt: 2 }}>
            <Step>
              <StepLabel>Select Account</StepLabel>
            </Step>
            <Step>
              <StepLabel>Legal Action</StepLabel>
            </Step>
            <Step>
              <StepLabel>Documents & Review</StepLabel>
            </Step>
          </Stepper>

          {renderEscalationStep()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEscalateDialog(false)}>Cancel</Button>
          {escalationStep > 0 && (
            <Button onClick={() => setEscalationStep(escalationStep - 1)}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleEscalateCase}
            disabled={
              (escalationStep === 0 && (!escalationForm.accountId || !escalationForm.reason)) ||
              (escalationStep === 1 && (!escalationForm.legalAction || !escalationForm.attorney))
            }
          >
            {escalationStep === 2 ? 'Escalate to Legal' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Case Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Legal Case Details</DialogTitle>
        <DialogContent>
          {selectedCase && (
            <Box>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Case Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Legal Case ID</Typography>
                        <Typography variant="body1" fontWeight="bold">{selectedCase.id}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Account ID</Typography>
                        <Typography variant="body1">{selectedCase.accountId}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Debtor Name</Typography>
                        <Typography variant="body1">{selectedCase.debtorName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Outstanding Balance</Typography>
                        <Typography variant="h6" color="error.main">
                          ${selectedCase.outstandingBalance.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Days Past Due</Typography>
                        <Typography variant="body1">{selectedCase.dpd} days</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Legal Action Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip
                          label={selectedCase.status}
                          color={getStatusColor(selectedCase.status)}
                          sx={{ mt: 0.5 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Legal Action Type</Typography>
                        <Typography variant="body1">{selectedCase.legalAction}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Attorney/Law Firm</Typography>
                        <Typography variant="body1">{selectedCase.attorney}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Escalation Date</Typography>
                        <Typography variant="body1">{selectedCase.escalationDate}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Estimated Cost</Typography>
                        <Typography variant="body1">${selectedCase.estimatedCost.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Next Hearing</Typography>
                        {selectedCase.nextHearing ? (
                          <Chip
                            label={selectedCase.nextHearing}
                            size="small"
                            icon={<ScheduleIcon />}
                            color="warning"
                            sx={{ mt: 0.5 }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            No hearing scheduled
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Case Timeline
              </Typography>
              <Timeline position="alternate">
                {selectedCase.timeline.map((event, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                      {event.date}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={event.status === 'completed' ? 'success' : 'grey'}>
                        {event.status === 'completed' ? <CheckIcon /> : <ScheduleIcon />}
                      </TimelineDot>
                      {index < selectedCase.timeline.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" fontWeight="bold">
                        {event.event}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <List>
                {selectedCase.documents.map((doc, index) => (
                  <ListItem
                    key={index}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDownloadDocument(doc)}>
                        <DownloadIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <DocumentIcon />
                          <Typography variant="body1">{doc}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          <Button variant="outlined" startIcon={<ScheduleIcon />} onClick={handleScheduleHearing}>
            Schedule Hearing
          </Button>
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendToAttorney}>
            Send to Attorney
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Hearing Dialog */}
      <Dialog open={scheduleHearingDialog} onClose={() => setScheduleHearingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Court Hearing</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Schedule a court hearing for case {selectedCase?.id} - {selectedCase?.debtorName}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Hearing Type</InputLabel>
              <Select
                value={hearingType}
                label="Hearing Type"
                onChange={(e) => setHearingType(e.target.value)}
              >
                <MenuItem value="">-- Select Type --</MenuItem>
                <MenuItem value="Initial Hearing">Initial Hearing</MenuItem>
                <MenuItem value="Pre-Trial Conference">Pre-Trial Conference</MenuItem>
                <MenuItem value="Motion Hearing">Motion Hearing</MenuItem>
                <MenuItem value="Trial">Trial</MenuItem>
                <MenuItem value="Judgment Hearing">Judgment Hearing</MenuItem>
                <MenuItem value="Status Conference">Status Conference</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Hearing Date"
              type="date"
              value={hearingDate}
              onChange={(e) => setHearingDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={hearingNotes}
              onChange={(e) => setHearingNotes(e.target.value)}
              placeholder="Add any additional notes about the hearing..."
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              Notifications will be sent to the assigned attorney and relevant parties.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleHearingDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleScheduleHearingConfirm}
            disabled={!hearingDate || !hearingType}
          >
            Schedule Hearing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDocDialog} onClose={() => setUploadDocDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Additional Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload supporting documents for case {selectedCase?.caseNumber}
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<AttachIcon />}
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
    </Box>
  );
};

export default LegalEscalation;
