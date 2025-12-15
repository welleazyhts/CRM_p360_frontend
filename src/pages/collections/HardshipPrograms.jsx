import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Alert, Divider,
  List, ListItem, ListItemText, ListItemIcon, Stepper, Step, StepLabel,
  LinearProgress, alpha, useTheme, Stack, Tooltip, Autocomplete, Checkbox, FormControlLabel
} from '@mui/material';
import {
  FavoriteBorder as HardshipIcon,
  Assignment as ApplicationIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  TrendingDown as ReductionIcon,
  Pause as PauseIcon,
  TrendingUp as GraduatedIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  Description as DocumentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';

const HardshipPrograms = () => {
  const theme = useTheme();
  const { addLog } = useActivityLog();
  const currentUser = 'Current User'; // In production, get from auth context
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [newApplicationDialog, setNewApplicationDialog] = useState(false);

  // New application form state
  const [newAppForm, setNewAppForm] = useState({
    accountNumber: '',
    debtorName: '',
    phone: '',
    email: '',
    currentDebt: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    hardshipReason: '',
    hardshipDetails: '',
    govtSupported: false,
    govtProgramName: '',
    insuranceAvailable: false,
    insuranceCompanyName: '',
    insuranceDetails: ''
  });

  // Mock debtor accounts for dropdown
  const debtorAccounts = [
    {
      accountNumber: 'ACC-2024-015',
      debtorName: 'Vikram Sharma',
      phone: '+91-98765-43210',
      email: 'vikram.sharma@email.com',
      currentDebt: 95000,
    },
    {
      accountNumber: 'ACC-2024-016',
      debtorName: 'Anita Desai',
      phone: '+91-98765-43211',
      email: 'anita.desai@email.com',
      currentDebt: 67000,
    },
    {
      accountNumber: 'ACC-2024-017',
      debtorName: 'Suresh Reddy',
      phone: '+91-98765-43212',
      email: 'suresh.reddy@email.com',
      currentDebt: 125000,
    },
    {
      accountNumber: 'ACC-2024-018',
      debtorName: 'Kavita Nair',
      phone: '+91-98765-43213',
      email: 'kavita.nair@email.com',
      currentDebt: 54000,
    },
    {
      accountNumber: 'ACC-2024-019',
      debtorName: 'Ramesh Gupta',
      phone: '+91-98765-43214',
      email: 'ramesh.gupta@email.com',
      currentDebt: 88000,
    }
  ];

  // Hardship applications
  const [applications, setApplications] = useState([
    {
      id: 1,
      applicationNumber: 'HP-2025-001',
      debtorName: 'Rajesh Kumar',
      accountNumber: 'ACC-2024-001',
      currentDebt: 45000,
      monthlyIncome: 35000,
      monthlyExpenses: 28000,
      disposableIncome: 7000,
      hardshipReason: 'Medical Emergency',
      status: 'Approved',
      programType: 'Payment Reduction',
      originalPayment: 5000,
      reducedPayment: 2500,
      duration: 6,
      startDate: '2025-02-01',
      endDate: '2025-07-31',
      documentsSubmitted: 4,
      approvedBy: 'Compliance Manager',
      approvalDate: '2025-01-15'
    },
    {
      id: 2,
      applicationNumber: 'HP-2025-002',
      debtorName: 'Priya Mehta',
      accountNumber: 'ACC-2024-002',
      currentDebt: 82000,
      monthlyIncome: 25000,
      monthlyExpenses: 23000,
      disposableIncome: 2000,
      hardshipReason: 'Job Loss',
      status: 'Under Review',
      programType: 'Payment Pause',
      originalPayment: 7000,
      reducedPayment: 0,
      duration: 3,
      startDate: '2025-02-01',
      documentsSubmitted: 3,
      submittedDate: '2025-01-17'
    },
    {
      id: 3,
      applicationNumber: 'HP-2025-003',
      debtorName: 'Amit Singh',
      accountNumber: 'ACC-2024-003',
      currentDebt: 125000,
      monthlyIncome: 55000,
      monthlyExpenses: 35000,
      disposableIncome: 20000,
      hardshipReason: 'Divorce Settlement',
      status: 'Rejected',
      programType: 'Payment Reduction',
      originalPayment: 10000,
      documentsSubmitted: 2,
      rejectedReason: 'Insufficient hardship documentation',
      rejectedDate: '2025-01-14'
    },
    {
      id: 4,
      applicationNumber: 'HP-2025-004',
      debtorName: 'Sneha Patel',
      accountNumber: 'ACC-2024-012',
      currentDebt: 67000,
      monthlyIncome: 42000,
      monthlyExpenses: 38000,
      disposableIncome: 4000,
      hardshipReason: 'Medical Emergency',
      status: 'Active',
      programType: 'Graduated Payment',
      originalPayment: 6000,
      currentPayment: 3000,
      monthsCompleted: 2,
      monthsRemaining: 4,
      startDate: '2024-12-01',
      endDate: '2025-05-31',
      paymentSchedule: [
        { month: 1, payment: 2000 },
        { month: 2, payment: 2500 },
        { month: 3, payment: 3000 },
        { month: 4, payment: 4000 },
        { month: 5, payment: 5000 },
        { month: 6, payment: 6000 }
      ]
    }
  ]);

  // Hardship reasons
  const hardshipReasons = [
    'Medical Emergency',
    'Job Loss',
    'Reduced Income',
    'Divorce Settlement',
    'Natural Disaster',
    'Family Emergency',
    'Business Closure',
    'Other'
  ];

  // Program types
  const programTypes = [
    { value: 'reduction', label: 'Payment Reduction', description: 'Reduce monthly payment amount' },
    { value: 'pause', label: 'Payment Pause', description: 'Temporary suspension of payments' },
    { value: 'graduated', label: 'Graduated Payment', description: 'Start low, increase over time' },
    { value: 'extended', label: 'Extended Term', description: 'Extend payment duration' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return 'success';
      case 'Under Review':
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setApplicationDialog(true);
  };

  const handleNewApplication = () => {
    setNewApplicationDialog(true);
    // Reset form when opening dialog
    setNewAppForm({
      accountNumber: '',
      debtorName: '',
      phone: '',
      email: '',
      currentDebt: '',
      monthlyIncome: '',
      monthlyExpenses: '',
      hardshipReason: '',
      hardshipDetails: ''
    });
    setActiveStep(0);
  };

  const handleAccountSelect = (accountNumber) => {
    const selectedAccount = debtorAccounts.find(acc => acc.accountNumber === accountNumber);
    if (selectedAccount) {
      setNewAppForm(prev => ({
        ...prev,
        accountNumber: selectedAccount.accountNumber,
        debtorName: selectedAccount.debtorName,
        phone: selectedAccount.phone,
        email: selectedAccount.email,
        currentDebt: selectedAccount.currentDebt.toString()
      }));
    }
  };

  const handleViewDocument = (docName) => {
    addLog({
      user: currentUser,
      action: 'Document Viewed',
      entity: 'Hardship Application',
      entityId: selectedApplication?.applicationNumber || 'N/A',
      entityName: docName,
      details: `Viewed document: ${docName}`,
      category: 'hardship',
      status: 'success'
    });
    alert(`Opening document: ${docName}\n\nThis will be connected to document viewer system.`);
  };

  const handleApprove = () => {
    addLog({
      user: currentUser,
      action: 'Application Approved',
      entity: 'Hardship Application',
      entityId: selectedApplication?.applicationNumber || 'N/A',
      entityName: selectedApplication?.debtorName || 'N/A',
      details: `Approved hardship application ${selectedApplication?.applicationNumber} for ${selectedApplication?.debtorName}`,
      category: 'hardship',
      status: 'success'
    });

    setApplications(prevApps =>
      prevApps.map(app =>
        app.id === selectedApplication.id
          ? { ...app, status: 'Approved' }
          : app
      )
    );

    alert(`Application ${selectedApplication?.applicationNumber} approved!\n\nDebtor: ${selectedApplication?.debtorName}\nProgram: Payment Reduction\n\nThis will be connected to backend API.`);
    setApplicationDialog(false);
  };

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    addLog({
      user: currentUser,
      action: 'Application Rejected',
      entity: 'Hardship Application',
      entityId: selectedApplication?.applicationNumber || 'N/A',
      entityName: selectedApplication?.debtorName || 'N/A',
      details: `Rejected hardship application ${selectedApplication?.applicationNumber}: ${reason}`,
      category: 'hardship',
      status: 'success'
    });

    setApplications(prevApps =>
      prevApps.map(app =>
        app.id === selectedApplication.id
          ? { ...app, status: 'Rejected' }
          : app
      )
    );

    alert(`Application ${selectedApplication?.applicationNumber} rejected.\n\nReason: ${reason}\n\nThis will be connected to backend API.`);
    setApplicationDialog(false);
  };

  const handleSendConfirmation = () => {
    addLog({
      user: currentUser,
      action: 'Confirmation Sent',
      entity: 'Hardship Application',
      entityId: selectedApplication?.applicationNumber || 'N/A',
      entityName: selectedApplication?.debtorName || 'N/A',
      details: `Sent approval confirmation for ${selectedApplication?.applicationNumber} to ${selectedApplication?.debtorName}`,
      category: 'hardship',
      status: 'success'
    });

    alert(`Approval confirmation sent to ${selectedApplication?.debtorName}!\n\nSent via:\n- Email\n- SMS\n- Debtor Portal\n\nThis will be connected to backend communication API.`);
  };

  const renderOverviewCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.05), borderLeft: `4px solid ${theme.palette.info.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Applications
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              247
            </Typography>
            <Typography variant="caption" color="text.secondary">
              All time
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), borderLeft: `4px solid ${theme.palette.success.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Active Programs
            </Typography>
            <Typography variant="h4" fontWeight={600} color="success.main">
              42
            </Typography>
            <Typography variant="caption" color="success.main">
              Currently enrolled
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), borderLeft: `4px solid ${theme.palette.warning.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Under Review
            </Typography>
            <Typography variant="h4" fontWeight={600} color="warning.main">
              18
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pending decision
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), borderLeft: `4px solid ${theme.palette.primary.main}` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Approval Rate
            </Typography>
            <Typography variant="h4" fontWeight={600} color="primary.main">
              76%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 30 days
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderApplicationsTable = () => (
    <Card sx={{ boxShadow: 3, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HardshipIcon color="primary" />
            Hardship Program Applications
          </Typography>
          <Button variant="contained" startIcon={<ApplicationIcon />} onClick={handleNewApplication}>
            New Application
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Application #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Debtor / Account</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Debt Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hardship Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Financial Profile</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Program Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {app.applicationNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        {app.debtorName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {app.debtorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {app.accountNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{app.currentDebt.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={app.hardshipReason} size="small" color="warning" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Income: ₹{app.monthlyIncome.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Expenses: ₹{app.monthlyExpenses.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" fontWeight={600} color="success.main" display="block">
                        Disposable: ₹{app.disposableIncome.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.programType}
                      size="small"
                      icon={
                        app.programType === 'Payment Reduction' ? <ReductionIcon fontSize="small" /> :
                        app.programType === 'Payment Pause' ? <PauseIcon fontSize="small" /> :
                        <GraduatedIcon fontSize="small" />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {app.status === 'Approved' || app.status === 'Active' ? (
                      <Box>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                          ₹{app.originalPayment?.toLocaleString('en-IN')}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          ₹{(app.reducedPayment || app.currentPayment)?.toLocaleString('en-IN')}/mo
                        </Typography>
                        {app.duration && (
                          <Typography variant="caption" color="text.secondary">
                            {app.duration} months
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2">
                        ₹{app.originalPayment?.toLocaleString('en-IN')}/mo
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={app.status}
                      color={getStatusColor(app.status)}
                      size="small"
                      icon={
                        app.status === 'Approved' || app.status === 'Active' ? <ApprovedIcon fontSize="small" /> :
                        app.status === 'Under Review' ? <PendingIcon fontSize="small" /> :
                        <RejectedIcon fontSize="small" />
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewApplication(app)}
                      >
                        <ViewIcon fontSize="small" />
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

  const renderApplicationDialog = () => (
    <Dialog
      open={applicationDialog}
      onClose={() => setApplicationDialog(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Hardship Application: {selectedApplication?.applicationNumber}
          </Typography>
          <Chip
            label={selectedApplication?.status}
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              fontWeight: 600
            }}
          />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {selectedApplication && (
          <Grid container spacing={3}>
            {/* Status Alert */}
            <Grid item xs={12}>
              {selectedApplication.status === 'Approved' && (
                <Alert severity="success" icon={<ApprovedIcon />}>
                  Application approved on {selectedApplication.approvalDate} by {selectedApplication.approvedBy}.
                  Program active from {selectedApplication.startDate} to {selectedApplication.endDate}.
                </Alert>
              )}
              {selectedApplication.status === 'Under Review' && (
                <Alert severity="warning" icon={<PendingIcon />}>
                  Application submitted on {selectedApplication.submittedDate}. Under review by compliance team.
                </Alert>
              )}
              {selectedApplication.status === 'Rejected' && (
                <Alert severity="error" icon={<RejectedIcon />}>
                  Application rejected on {selectedApplication.rejectedDate}. Reason: {selectedApplication.rejectedReason}
                </Alert>
              )}
            </Grid>

            {/* Debtor Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Debtor Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Name</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedApplication.debtorName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Account</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedApplication.accountNumber}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Current Debt</Typography>
                      <Typography variant="h6" fontWeight={600}>
                        ₹{selectedApplication.currentDebt?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Hardship Reason</Typography>
                      <Chip label={selectedApplication.hardshipReason} size="small" color="warning" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Financial Profile */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Financial Profile
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Monthly Income</Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        ₹{selectedApplication.monthlyIncome?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Monthly Expenses</Typography>
                      <Typography variant="body2" fontWeight={600} color="error.main">
                        ₹{selectedApplication.monthlyExpenses?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Disposable Income</Typography>
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        ₹{selectedApplication.disposableIncome?.toLocaleString('en-IN') || 0}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={selectedApplication.monthlyIncome ? ((selectedApplication.disposableIncome || 0) / selectedApplication.monthlyIncome) * 100 : 0}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Program Details */}
            {(selectedApplication.status === 'Approved' || selectedApplication.status === 'Active') && (
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Program Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">Program Type</Typography>
                        <Typography variant="body2" fontWeight={600}>{selectedApplication.programType}</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">Original Payment</Typography>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                          ₹{selectedApplication.originalPayment?.toLocaleString('en-IN') || 0}/mo
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">New Payment</Typography>
                        <Typography variant="h6" fontWeight={600} color="success.main">
                          ₹{((selectedApplication.reducedPayment || selectedApplication.currentPayment || 0)).toLocaleString('en-IN')}/mo
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="caption" color="text.secondary">Duration</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedApplication.duration || 0} months
                        </Typography>
                      </Grid>
                      {selectedApplication.status === 'Active' && selectedApplication.paymentSchedule && (
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Graduated Payment Schedule
                          </Typography>
                          <List dense>
                            {selectedApplication.paymentSchedule.map((schedule, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2">
                                        Month {schedule.month}
                                        {index < (selectedApplication.monthsCompleted || 0) && (
                                          <Chip label="Paid" size="small" color="success" sx={{ ml: 1, height: 20 }} />
                                        )}
                                      </Typography>
                                      <Typography variant="body2" fontWeight={600}>
                                        ₹{schedule.payment?.toLocaleString('en-IN') || 0}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Submitted Documents */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Submitted Documents ({selectedApplication.documentsSubmitted})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Income Proof"
                        secondary="salary_slips.pdf • 1.2 MB"
                      />
                      <IconButton size="small" onClick={() => handleViewDocument('salary_slips.pdf')}><ViewIcon fontSize="small" /></IconButton>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                      <ListItemText
                        primary="Expense Documentation"
                        secondary="bills_expenses.pdf • 856 KB"
                      />
                      <IconButton size="small" onClick={() => handleViewDocument('bills_expenses.pdf')}><ViewIcon fontSize="small" /></IconButton>
                    </ListItem>
                    {selectedApplication.documentsSubmitted > 2 && (
                      <>
                        <ListItem>
                          <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                          <ListItemText
                            primary="Medical Bills"
                            secondary="medical_bills.pdf • 2.1 MB"
                          />
                          <IconButton size="small" onClick={() => handleViewDocument('medical_bills.pdf')}><ViewIcon fontSize="small" /></IconButton>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><DocumentIcon color="primary" /></ListItemIcon>
                          <ListItemText
                            primary="Hardship Letter"
                            secondary="hardship_letter.pdf • 245 KB"
                          />
                          <IconButton size="small" onClick={() => handleViewDocument('hardship_letter.pdf')}><ViewIcon fontSize="small" /></IconButton>
                        </ListItem>
                      </>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setApplicationDialog(false)}>Close</Button>
        {selectedApplication?.status === 'Under Review' && (
          <>
            <Button variant="outlined" color="error" startIcon={<RejectedIcon />} onClick={handleReject}>
              Reject
            </Button>
            <Button variant="contained" color="success" startIcon={<ApprovedIcon />} onClick={handleApprove}>
              Approve
            </Button>
          </>
        )}
        {selectedApplication?.status === 'Approved' && (
          <Button variant="outlined" startIcon={<SendIcon />} onClick={handleSendConfirmation}>
            Send Confirmation
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  // New Application Dialog
  const renderNewApplicationDialog = () => (
    <Dialog open={newApplicationDialog} onClose={() => setNewApplicationDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>New Hardship Program Application</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            <Step><StepLabel>Debtor Information</StepLabel></Step>
            <Step><StepLabel>Financial Details</StepLabel></Step>
            <Step><StepLabel>Hardship Reason</StepLabel></Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={debtorAccounts}
                  getOptionLabel={(option) => `${option.accountNumber} - ${option.debtorName} (₹${option.currentDebt.toLocaleString()})`}
                  value={debtorAccounts.find(acc => acc.accountNumber === newAppForm.accountNumber) || null}
                  onChange={(event, newValue) => {
                    handleAccountSelect(newValue?.accountNumber || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Account"
                      placeholder="Type to search accounts..."
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.accountNumber === value.accountNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={newAppForm.accountNumber}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Debtor Name"
                  value={newAppForm.debtorName}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={newAppForm.phone}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={newAppForm.email}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Debt Amount"
                  value={newAppForm.currentDebt}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                  }}
                  disabled
                />
              </Grid>
              {newAppForm.accountNumber && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Account details loaded successfully! Proceed to next step.
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Provide accurate financial information for {newAppForm.debtorName}
                </Alert>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Income"
                  type="number"
                  value={newAppForm.monthlyIncome}
                  onChange={(e) => setNewAppForm(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                  placeholder="Enter monthly income"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monthly Expenses"
                  type="number"
                  value={newAppForm.monthlyExpenses}
                  onChange={(e) => setNewAppForm(prev => ({ ...prev, monthlyExpenses: e.target.value }))}
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                  placeholder="Enter monthly expenses"
                />
              </Grid>
              {newAppForm.monthlyIncome && newAppForm.monthlyExpenses && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Financial Analysis
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Monthly Income</Typography>
                        <Typography variant="h6" color="success.main">₹{Number(newAppForm.monthlyIncome).toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Monthly Expenses</Typography>
                        <Typography variant="h6" color="error.main">₹{Number(newAppForm.monthlyExpenses).toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">Disposable Income</Typography>
                        <Typography variant="h6" color={Number(newAppForm.monthlyIncome) - Number(newAppForm.monthlyExpenses) > 0 ? "primary.main" : "error.main"}>
                          ₹{(Number(newAppForm.monthlyIncome) - Number(newAppForm.monthlyExpenses)).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  Upload supporting documents: Income proof, expense bills, bank statements
                </Alert>
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert severity="warning">
                  Provide detailed hardship reason for {newAppForm.debtorName} - {newAppForm.accountNumber}
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Hardship Reason</InputLabel>
                  <Select
                    value={newAppForm.hardshipReason}
                    onChange={(e) => setNewAppForm(prev => ({ ...prev, hardshipReason: e.target.value }))}
                    label="Hardship Reason"
                  >
                    <MenuItem value="">-- Select Reason --</MenuItem>
                    {hardshipReasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Detailed Explanation"
                  placeholder="Provide detailed explanation of the hardship situation..."
                  value={newAppForm.hardshipDetails}
                  onChange={(e) => setNewAppForm(prev => ({ ...prev, hardshipDetails: e.target.value }))}
                />
              </Grid>

              {/* Government Support and Insurance */}
              <Grid item xs={12}>
                <Alert severity="info">
                  Check if there's any government support or insurance coverage available
                </Alert>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAppForm.govtSupported}
                      onChange={(e) => setNewAppForm(prev => ({
                        ...prev,
                        govtSupported: e.target.checked,
                        govtProgramName: e.target.checked ? prev.govtProgramName : ''
                      }))}
                    />
                  }
                  label="Government Supported Program Available"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newAppForm.insuranceAvailable}
                      onChange={(e) => setNewAppForm(prev => ({
                        ...prev,
                        insuranceAvailable: e.target.checked,
                        insuranceCompanyName: e.target.checked ? prev.insuranceCompanyName : '',
                        insuranceDetails: e.target.checked ? prev.insuranceDetails : ''
                      }))}
                    />
                  }
                  label="Insurance Coverage Available"
                />
              </Grid>

              {/* Conditional Government Program Field */}
              {newAppForm.govtSupported && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Government Program Name"
                    placeholder="Enter the name of the government support program..."
                    value={newAppForm.govtProgramName}
                    onChange={(e) => setNewAppForm(prev => ({ ...prev, govtProgramName: e.target.value }))}
                    required
                  />
                </Grid>
              )}

              {/* Conditional Insurance Fields */}
              {newAppForm.insuranceAvailable && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Insurance Company Name"
                      placeholder="Enter insurance company name..."
                      value={newAppForm.insuranceCompanyName}
                      onChange={(e) => setNewAppForm(prev => ({ ...prev, insuranceCompanyName: e.target.value }))}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Insurance Details"
                      placeholder="Policy number, coverage details..."
                      value={newAppForm.insuranceDetails}
                      onChange={(e) => setNewAppForm(prev => ({ ...prev, insuranceDetails: e.target.value }))}
                      required
                    />
                  </Grid>
                </>
              )}

              {newAppForm.hardshipReason && newAppForm.hardshipDetails && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Application Summary
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Debtor</Typography>
                        <Typography variant="body1" fontWeight="bold">{newAppForm.debtorName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Account</Typography>
                        <Typography variant="body1" fontWeight="bold">{newAppForm.accountNumber}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Current Debt</Typography>
                        <Typography variant="body1" fontWeight="bold">₹{Number(newAppForm.currentDebt).toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Disposable Income</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          ₹{(Number(newAppForm.monthlyIncome || 0) - Number(newAppForm.monthlyExpenses || 0)).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Hardship Reason</Typography>
                        <Typography variant="body1" fontWeight="bold">{newAppForm.hardshipReason}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setNewApplicationDialog(false);
          setActiveStep(0);
        }}>
          Cancel
        </Button>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
        {activeStep === 2 ? (
          <Button
            variant="contained"
            disabled={!newAppForm.hardshipReason || !newAppForm.hardshipDetails}
            onClick={() => {
              addLog({
                user: currentUser,
                action: 'Application Submitted',
                entity: 'Hardship Application',
                entityId: newAppForm.accountNumber,
                entityName: newAppForm.debtorName,
                details: `Submitted hardship application for ${newAppForm.debtorName} (${newAppForm.accountNumber}). Reason: ${newAppForm.hardshipReason}`,
                category: 'hardship',
                status: 'success'
              });
              alert(`Hardship application submitted successfully!\n\nDebtor: ${newAppForm.debtorName}\nAccount: ${newAppForm.accountNumber}\nReason: ${newAppForm.hardshipReason}\n\nApplication will be reviewed by compliance team.\n\nThis will be connected to backend API.`);
              setNewApplicationDialog(false);
              setActiveStep(0);
            }}
          >
            Submit Application
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={
              (activeStep === 0 && !newAppForm.accountNumber) ||
              (activeStep === 1 && (!newAppForm.monthlyIncome || !newAppForm.monthlyExpenses))
            }
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Hardship Programs
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          <strong>Compassionate Collections:</strong> Hardship programs provide temporary relief for debtors facing genuine financial difficulties.
          Options include payment reduction, payment pause, graduated payment plans, and extended terms.
        </Typography>
      </Alert>

      {renderOverviewCards()}
      {renderApplicationsTable()}
      {renderApplicationDialog()}
      {renderNewApplicationDialog()}
    </Box>
  );
};

export default HardshipPrograms;
