import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Tabs, Tab, Alert, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Slider,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  List, ListItem, ListItemText, ListItemIcon, LinearProgress,
  alpha, useTheme, Stack, Tooltip, Stepper, Step, StepLabel,
  Checkbox, Radio, RadioGroup, FormLabel, TablePagination, Collapse,
  Snackbar, InputAdornment
} from '@mui/material';
import {
  Handshake as HandshakeIcon,
  Calculate as CalculateIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  ThumbUp as ApprovedIcon,
  ThumbDown as RejectedIcon,
  AutoMode as AutoIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  VerifiedUser as VerifiedUserIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const SettlementAutomation = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [calculatorDialog, setCalculatorDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [settlementPercentage, setSettlementPercentage] = useState(60);
  const [paymentPlanMonths, setPaymentPlanMonths] = useState(12);

  // New Offer Creation States
  const [createOfferDialog, setCreateOfferDialog] = useState(false);
  const [offerStep, setOfferStep] = useState(0); // 0: Selection, 1: Eligibility, 2: Customize, 3: Review
  const [offerMode, setOfferMode] = useState(''); // 'individual', 'bulk', 'common'
  const [selectedDebtors, setSelectedDebtors] = useState([]);
  const [offerType, setOfferType] = useState('settlement'); // 'settlement' or 'payment_plan'
  const [sendToPortal, setSendToPortal] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [eligibilityResults, setEligibilityResults] = useState([]);

  // Edit Offer States
  const [editOfferDialog, setEditOfferDialog] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Send Reminder States
  const [reminderDialog, setReminderDialog] = useState(false);
  const [reminderOffer, setReminderOffer] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');

  // Debtor Search State
  const [debtorSearchTerm, setDebtorSearchTerm] = useState('');

  // Mock settlement plans data (Plan-centric view)
  const [settlementPlans, setSettlementPlans] = useState([
    {
      id: 1,
      planName: '60% Settlement Offer - High DPD Accounts',
      planType: 'Settlement',
      settlementPercentage: 60,
      validityDays: 15,
      status: 'Active',
      createdDate: '2025-01-10',
      eligibleDebtors: 12,
      assignedDebtors: 8,
      acceptedDebtors: 5,
      pendingDebtors: 3,
      rejectedDebtors: 0,
      totalPotentialRecovery: 450000,
      description: 'Standard settlement offer for accounts with DPD > 180 days',
      eligibilityCriteria: {
        minDPD: 180,
        minBalance: 10000,
        maxBalance: 150000,
        creditScoreRange: [500, 700]
      }
    },
    {
      id: 2,
      planName: '12-Month Payment Plan - Medium DPD',
      planType: 'Payment Plan',
      months: 12,
      downPaymentPercent: 10,
      paymentFrequency: 'Monthly',
      status: 'Active',
      createdDate: '2025-01-12',
      eligibleDebtors: 18,
      assignedDebtors: 15,
      acceptedDebtors: 12,
      pendingDebtors: 3,
      rejectedDebtors: 0,
      totalPotentialRecovery: 920000,
      description: '12-month installment plan for moderately delinquent accounts',
      eligibilityCriteria: {
        minDPD: 90,
        maxDPD: 180,
        minBalance: 20000,
        maxBalance: 200000,
        creditScoreRange: [550, 750]
      }
    },
    {
      id: 3,
      planName: '70% Settlement - Premium Accounts',
      planType: 'Settlement',
      settlementPercentage: 70,
      validityDays: 30,
      status: 'Active',
      createdDate: '2025-01-05',
      eligibleDebtors: 6,
      assignedDebtors: 6,
      acceptedDebtors: 4,
      pendingDebtors: 1,
      rejectedDebtors: 1,
      totalPotentialRecovery: 680000,
      description: 'Higher settlement percentage for accounts with better credit scores',
      eligibilityCriteria: {
        minDPD: 90,
        minBalance: 50000,
        creditScoreRange: [650, 850]
      }
    },
    {
      id: 4,
      planName: '6-Month Aggressive Payment Plan',
      planType: 'Payment Plan',
      months: 6,
      downPaymentPercent: 20,
      paymentFrequency: 'Monthly',
      status: 'Draft',
      createdDate: '2025-01-18',
      eligibleDebtors: 10,
      assignedDebtors: 0,
      acceptedDebtors: 0,
      pendingDebtors: 0,
      rejectedDebtors: 0,
      totalPotentialRecovery: 0,
      description: 'Short-term aggressive payment plan for ready-to-pay segment',
      eligibilityCriteria: {
        minDPD: 60,
        maxDPD: 120,
        minBalance: 15000,
        maxBalance: 100000,
        creditScoreRange: [600, 800]
      }
    },
    {
      id: 5,
      planName: '50% Settlement - Hardship Cases',
      planType: 'Settlement',
      settlementPercentage: 50,
      validityDays: 20,
      status: 'Expired',
      createdDate: '2024-12-15',
      expiryDate: '2025-01-15',
      eligibleDebtors: 8,
      assignedDebtors: 8,
      acceptedDebtors: 3,
      pendingDebtors: 0,
      rejectedDebtors: 5,
      totalPotentialRecovery: 180000,
      description: 'Discounted settlement for financial hardship cases',
      eligibilityCriteria: {
        minDPD: 240,
        minBalance: 5000,
        maxBalance: 80000,
        creditScoreRange: [450, 600]
      }
    }
  ]);

  // View Plan Debtors Dialog States
  const [viewPlanDialog, setViewPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [debtorTabValue, setDebtorTabValue] = useState(0);
  const [selectedEligibleDebtors, setSelectedEligibleDebtors] = useState([]);

  // Snackbar notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Payment plan templates
  const paymentPlanTemplates = [
    { id: 1, name: '3 Months Aggressive', months: 3, description: 'For high-priority accounts' },
    { id: 2, name: '6 Months Standard', months: 6, description: 'Balanced approach' },
    { id: 3, name: '12 Months Extended', months: 12, description: 'For hardship cases' },
    { id: 4, name: '18 Months Long-term', months: 18, description: 'Maximum flexibility' }
  ];

  // Settlement waterfall strategies
  const waterfallStrategies = [
    { stage: 1, percentage: 80, timing: 'Initial Offer', description: 'Start high' },
    { stage: 2, percentage: 70, timing: 'After 7 days', description: 'First reduction' },
    { stage: 3, percentage: 60, timing: 'After 14 days', description: 'Second reduction' },
    { stage: 4, percentage: 50, timing: 'After 21 days', description: 'Final offer' }
  ];

  // Mock debtors for selection
  const [availableDebtors] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      accountNumber: 'ACC-2024-001',
      balance: 45000,
      dpd: 145,
      creditScore: 650,
      paymentHistory: 'Poor',
      eligible: true,
      eligibilityScore: 85,
      eligibilityReasons: ['DPD > 90 days', 'Credit score acceptable', 'No active disputes']
    },
    {
      id: 2,
      name: 'Priya Mehta',
      accountNumber: 'ACC-2024-002',
      balance: 82000,
      dpd: 212,
      creditScore: 580,
      paymentHistory: 'Very Poor',
      eligible: true,
      eligibilityScore: 92,
      eligibilityReasons: ['DPD > 180 days', 'High recovery potential', 'Previous engagement']
    },
    {
      id: 3,
      name: 'Amit Singh',
      accountNumber: 'ACC-2024-003',
      balance: 125000,
      dpd: 89,
      creditScore: 720,
      paymentHistory: 'Fair',
      eligible: false,
      eligibilityScore: 45,
      eligibilityReasons: ['DPD < 90 days', 'Good credit score', 'Recent payment made']
    },
    {
      id: 4,
      name: 'Sunita Patel',
      accountNumber: 'ACC-2024-004',
      balance: 67000,
      dpd: 156,
      creditScore: 610,
      paymentHistory: 'Poor',
      eligible: true,
      eligibilityScore: 78,
      eligibilityReasons: ['DPD > 90 days', 'Multiple failed payments']
    },
    {
      id: 5,
      name: 'Vikram Reddy',
      accountNumber: 'ACC-2024-005',
      balance: 98000,
      dpd: 201,
      creditScore: 590,
      paymentHistory: 'Very Poor',
      eligible: true,
      eligibilityScore: 88,
      eligibilityReasons: ['DPD > 180 days', 'High balance', 'No recent contact']
    }
  ]);

  const handleOpenCalculator = (account) => {
    setSelectedAccount(account || {
      debtorName: 'Sample Debtor',
      accountNumber: 'NEW',
      currentBalance: 100000,
      dpd: 120
    });
    setCalculatorDialog(true);
  };

  const calculateSettlement = () => {
    const settlementAmount = (selectedAccount.currentBalance * settlementPercentage) / 100;
    return settlementAmount;
  };

  const calculateMonthlyPayment = () => {
    return Math.ceil(selectedAccount.currentBalance / paymentPlanMonths);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // Handle Edit Offer
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setSettlementPercentage(offer.offerPercentage || 60);
    setPaymentPlanMonths(offer.months || 12);
    setEditOfferDialog(true);
  };

  const handleSaveEditOffer = () => {
    // TODO: Update plan details in the plan-centric model
    showNotification('Plan editing functionality will be implemented in the plan-centric model', 'info');
    setEditOfferDialog(false);
    setEditingOffer(null);
  };

  // Handle Send Reminder
  const handleSendReminder = (offer) => {
    setReminderOffer(offer);
    setReminderMessage(
      `Dear ${offer.debtorName},\n\nThis is a friendly reminder about your pending ${offer.offerType.toLowerCase()} offer for account ${offer.accountNumber}.\n\n` +
      (offer.offerType === 'Settlement'
        ? `Settlement Amount: ₹${offer.offerAmount.toLocaleString('en-IN')} (${offer.offerPercentage}% of debt)\n`
        : `Monthly Payment: ₹${offer.monthlyPayment.toLocaleString('en-IN')} for ${offer.months} months\n`) +
      `\nOffer expires on: ${offer.expiryDate}\n\nPlease log in to your portal to review and respond to this offer.\n\nThank you.`
    );
    setReminderDialog(true);
  };

  const handleSendReminderConfirm = () => {
    // In production, this would call an API to send email/SMS
    showNotification(`Reminder sent to ${reminderOffer.debtorName} via Email, SMS, and Portal`, 'success');
    setReminderDialog(false);
    setReminderOffer(null);
    setReminderMessage('');
  };

  const renderOverviewCards = () => {
    const activePlans = settlementPlans.filter(p => p.status === 'Active').length;
    const totalEligible = settlementPlans.reduce((sum, p) => sum + p.eligibleDebtors, 0);
    const totalAccepted = settlementPlans.reduce((sum, p) => sum + p.acceptedDebtors, 0);
    const totalAssigned = settlementPlans.reduce((sum, p) => sum + p.assignedDebtors, 0);
    const acceptanceRate = totalAssigned > 0 ? Math.round((totalAccepted / totalAssigned) * 100) : 0;
    const totalPotentialRecovery = settlementPlans.reduce((sum, p) => sum + p.totalPotentialRecovery, 0);

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active Plans
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {activePlans}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of {settlementPlans.length} total plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.05), borderLeft: `4px solid ${theme.palette.success.main}` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Acceptance Rate
              </Typography>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {acceptanceRate}%
              </Typography>
              <Typography variant="caption" color="success.main">
                {totalAccepted} of {totalAssigned} assigned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.05), borderLeft: `4px solid ${theme.palette.info.main}` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Eligible Debtors
              </Typography>
              <Typography variant="h4" fontWeight={600} color="info.main">
                {totalEligible}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Across all active plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05), borderLeft: `4px solid ${theme.palette.warning.main}` }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Potential Recovery
              </Typography>
              <Typography variant="h4" fontWeight={600} color="warning.main">
                ₹{(totalPotentialRecovery / 100000).toFixed(1)}L
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total across all plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const getPlanStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Draft':
        return 'default';
      case 'Expired':
        return 'error';
      case 'Paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleViewPlanDebtors = (plan) => {
    setSelectedPlan(plan);
    setDebtorTabValue(0);
    setSelectedEligibleDebtors([]);
    setViewPlanDialog(true);
  };

  const handleToggleEligibleDebtor = (debtorId) => {
    setSelectedEligibleDebtors(prev =>
      prev.includes(debtorId)
        ? prev.filter(id => id !== debtorId)
        : [...prev, debtorId]
    );
  };

  const handleSelectAllEligibleDebtors = (debtors) => {
    if (selectedEligibleDebtors.length === debtors.length) {
      setSelectedEligibleDebtors([]);
    } else {
      setSelectedEligibleDebtors(debtors.map(d => d.id));
    }
  };

  const handleAssignSelectedToFlan = () => {
    if (selectedEligibleDebtors.length === 0) {
      showNotification('Please select at least one debtor to assign', 'warning');
      return;
    }
    showNotification(`Successfully assigned ${selectedEligibleDebtors.length} debtor(s) to ${selectedPlan.planName}`, 'success');
    setSelectedEligibleDebtors([]);
  };

  const handleSendReminderToPlan = (debtor) => {
    showNotification(`Reminder sent to ${debtor.name} via Email, SMS, and Portal`, 'success');
  };

  const handleViewDebtorDetails = (debtor) => {
    showNotification(`Opening details for ${debtor.name} - ${debtor.accountNumber}`, 'info');
  };

  const renderSettlementPlans = () => (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HandshakeIcon color="primary" />
            Settlement & Payment Plans
          </Typography>
          <Button
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={() => {
              setCreateOfferDialog(true);
              setOfferStep(0);
              setOfferMode('');
              setSelectedDebtors([]);
            }}
          >
            Create New Plan
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ fontWeight: 600 }}>Plan Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Plan Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Eligible</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Assigned</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Accepted</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settlementPlans.map((plan) => (
                <TableRow key={plan.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {plan.planName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {plan.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.planType}
                      color={plan.planType === 'Settlement' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {plan.planType === 'Settlement' ? (
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          {plan.settlementPercentage}% Settlement
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {plan.validityDays} days validity
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {plan.months} Months
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {plan.downPaymentPercent}% down, {plan.paymentFrequency}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.eligibleDebtors}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {plan.assignedDebtors}
                      </Typography>
                      {plan.pendingDebtors > 0 && (
                        <Chip
                          label={`${plan.pendingDebtors} pending`}
                          size="small"
                          color="warning"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {plan.acceptedDebtors}
                      </Typography>
                      {plan.assignedDebtors > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          ({Math.round((plan.acceptedDebtors / plan.assignedDebtors) * 100)}%)
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={plan.status}
                      color={getPlanStatusColor(plan.status)}
                      size="small"
                      icon={
                        plan.status === 'Active' ? <CheckCircleIcon fontSize="small" /> :
                        plan.status === 'Draft' ? <PendingIcon fontSize="small" /> :
                        plan.status === 'Expired' ? <ErrorIcon fontSize="small" /> :
                        <WarningIcon fontSize="small" />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {plan.createdDate}
                    </Typography>
                    {plan.status === 'Expired' && plan.expiryDate && (
                      <Typography variant="caption" color="error.main" display="block">
                        Expired: {plan.expiryDate}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Debtors">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewPlanDebtors(plan)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Plan">
                      <IconButton
                        size="small"
                        color="info"
                        disabled={plan.status === 'Expired'}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {settlementPlans.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <HandshakeIcon sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Settlement or Payment Plans Created Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first plan to start automating settlement and payment plan offers
            </Typography>
            <Button
              variant="contained"
              startIcon={<CalculateIcon />}
              onClick={() => {
                setCreateOfferDialog(true);
                setOfferStep(0);
                setOfferMode('');
                setSelectedDebtors([]);
              }}
            >
              Create New Plan
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderCalculatorDialog = () => (
    <Dialog
      open={calculatorDialog}
      onClose={() => setCalculatorDialog(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateIcon />
          Settlement & Payment Plan Calculator
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        {selectedAccount && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" icon={<InfoIcon />}>
                Debtor: <strong>{selectedAccount.debtorName}</strong> • Account: <strong>{selectedAccount.accountNumber}</strong> •
                Balance: <strong>₹{selectedAccount.currentBalance?.toLocaleString('en-IN')}</strong>
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab label="Settlement Offer" />
                <Tab label="Payment Plan" />
                <Tab label="Waterfall Strategy" />
              </Tabs>
            </Grid>

            {/* Settlement Tab */}
            {tabValue === 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Settlement Percentage: {settlementPercentage}%
                  </Typography>
                  <Slider
                    value={settlementPercentage}
                    onChange={(e, v) => setSettlementPercentage(v)}
                    min={30}
                    max={100}
                    marks={[
                      { value: 30, label: '30%' },
                      { value: 50, label: '50%' },
                      { value: 70, label: '70%' },
                      { value: 100, label: '100%' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Original Debt
                          </Typography>
                          <Typography variant="h5" fontWeight={600}>
                            ₹{selectedAccount.currentBalance?.toLocaleString('en-IN')}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Settlement Amount
                          </Typography>
                          <Typography variant="h5" fontWeight={600} color="success.main">
                            ₹{calculateSettlement().toLocaleString('en-IN')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Savings for Debtor
                          </Typography>
                          <Typography variant="h6" fontWeight={600} color="error.main">
                            ₹{(selectedAccount.currentBalance - calculateSettlement()).toLocaleString('en-IN')}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Recovery for Business
                          </Typography>
                          <Typography variant="h6" fontWeight={600} color="primary.main">
                            {settlementPercentage}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Offer Validity (Days)"
                    type="number"
                    defaultValue={15}
                  />
                </Grid>
              </>
            )}

            {/* Payment Plan Tab */}
            {tabValue === 1 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Template or Customize
                  </Typography>
                  <Grid container spacing={2}>
                    {paymentPlanTemplates.map((template) => (
                      <Grid item xs={6} key={template.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { borderColor: theme.palette.primary.main },
                            ...(paymentPlanMonths === template.months && {
                              borderColor: theme.palette.primary.main,
                              bgcolor: alpha(theme.palette.primary.main, 0.05)
                            })
                          }}
                          onClick={() => setPaymentPlanMonths(template.months)}
                        >
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {template.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {template.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Duration: {paymentPlanMonths} months
                  </Typography>
                  <Slider
                    value={paymentPlanMonths}
                    onChange={(e, v) => setPaymentPlanMonths(v)}
                    min={3}
                    max={24}
                    marks={[
                      { value: 3, label: '3m' },
                      { value: 6, label: '6m' },
                      { value: 12, label: '12m' },
                      { value: 18, label: '18m' },
                      { value: 24, label: '24m' }
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total Amount
                          </Typography>
                          <Typography variant="h5" fontWeight={600}>
                            ₹{selectedAccount.currentBalance?.toLocaleString('en-IN')}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Monthly Payment
                          </Typography>
                          <Typography variant="h5" fontWeight={600} color="primary.main">
                            ₹{calculateMonthlyPayment().toLocaleString('en-IN')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Payment Frequency
                          </Typography>
                          <Chip label="Monthly" size="small" />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            First Payment Date
                          </Typography>
                          <Typography variant="body2">
                            1st of next month
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {/* Waterfall Strategy Tab */}
            {tabValue === 2 && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }} icon={<TrendingDownIcon />}>
                  Automated waterfall strategy: Start with a higher settlement percentage and gradually reduce over time to maximize recovery
                </Alert>
                <List>
                  {waterfallStrategies.map((stage) => (
                    <ListItem key={stage.stage}>
                      <ListItemIcon>
                        <Chip label={`Stage ${stage.stage}`} color="primary" size="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" fontWeight={600}>
                              {stage.percentage}% Settlement (₹{(selectedAccount.currentBalance * stage.percentage / 100).toLocaleString('en-IN')})
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {stage.timing}
                            </Typography>
                          </Box>
                        }
                        secondary={stage.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={() => setCalculatorDialog(false)}>Cancel</Button>
        <Button variant="outlined" startIcon={<DownloadIcon />}>
          Save as Draft
        </Button>
        <Button variant="contained" startIcon={<SendIcon />}>
          Send Offer
        </Button>
      </DialogActions>
    </Dialog>
  );

  // New Comprehensive Create Offer Dialog
  const renderCreateOfferDialog = () => {
    const steps = ['Select Mode', 'Choose Debtors & Check Eligibility', 'Customize Offer', 'Review & Send'];

    const handleNext = () => {
      if (offerStep === 1) {
        // Run eligibility check
        const eligibleDebts = selectedDebtors.map(id => {
          const debtor = availableDebtors.find(d => d.id === id);
          return {
            ...debtor,
            eligible: debtor.eligible,
            eligibilityScore: debtor.eligibilityScore,
            eligibilityReasons: debtor.eligibilityReasons
          };
        });
        setEligibilityResults(eligibleDebts);
      }
      setOfferStep(offerStep + 1);
    };

    const handleBack = () => setOfferStep(offerStep - 1);

    const handleDebtorToggle = (id) => {
      setSelectedDebtors(prev =>
        prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
      );
    };

    return (
      <Dialog
        open={createOfferDialog}
        onClose={() => setCreateOfferDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, minHeight: '600px' } }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HandshakeIcon />
              <Typography variant="h6">Create Settlement / Payment Plan Offer</Typography>
            </Box>
            <IconButton onClick={() => setCreateOfferDialog(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Box sx={{ px: 3, pt: 3 }}>
          <Stepper activeStep={offerStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ mt: 2 }}>
          {/* Step 0: Select Mode */}
          {offerStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  How would you like to create the offer?
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Choose whether to create individualized offers or a common plan for multiple debtors
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': { borderColor: theme.palette.primary.main, boxShadow: 2 },
                    ...(offerMode === 'individual' && {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    })
                  }}
                  onClick={() => setOfferMode('individual')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Individual Offers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create customized offers for each selected debtor based on their profile, payment history, and eligibility
                    </Typography>
                    <Chip
                      label="Recommended"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': { borderColor: theme.palette.primary.main, boxShadow: 2 },
                    ...(offerMode === 'bulk' && {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    })
                  }}
                  onClick={() => setOfferMode('bulk')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PeopleIcon sx={{ fontSize: 64, color: theme.palette.info.main, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Bulk Customized
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select multiple debtors and customize offers for each while reviewing them together in bulk
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': { borderColor: theme.palette.primary.main, boxShadow: 2 },
                    ...(offerMode === 'common' && {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    })
                  }}
                  onClick={() => setOfferMode('common')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PublicIcon sx={{ fontSize: 64, color: theme.palette.success.main, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Common Plan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Apply the same settlement terms or payment plan to multiple debtors at once (e.g., 60% settlement for all)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Step 1: Select Debtors & Eligibility (or skip for Common Plan) */}
          {offerStep === 1 && offerMode === 'common' && (
            <Box>
              <Alert severity="info" icon={<PublicIcon />} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Creating a Common Plan Template
                </Typography>
                <Typography variant="body2">
                  You are creating a <strong>template offer</strong> that can be applied to any eligible debtor.
                  No specific debtor selection is required - this plan will be available for use across your portfolio.
                </Typography>
              </Alert>

              <Card variant="outlined" sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Template Benefits
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Reusable:</strong> Apply to multiple debtors without recreating
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Consistent:</strong> Maintain uniform settlement terms
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Efficient:</strong> Quick offer generation for eligible accounts
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Flexible:</strong> Can be used in automated or manual workflows
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Common plans will still respect eligibility criteria when applied to individual debtors
                  (DPD ≥ 90 days, no active disputes, credit score thresholds, etc.)
                </Typography>
              </Alert>
            </Box>
          )}

          {offerStep === 1 && offerMode !== 'common' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Debtors and Check Eligibility
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                {offerMode === 'individual' && 'Select debtors to create individual customized offers'}
                {offerMode === 'bulk' && 'Select multiple debtors for bulk offer creation'}
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Eligibility Criteria:</strong> DPD ≥ 90 days, No active disputes, Credit score evaluation, Payment history analysis
                </Typography>
              </Alert>

              {/* Search Field */}
              <TextField
                fullWidth
                placeholder="Search debtors by name, account number..."
                value={debtorSearchTerm}
                onChange={(e) => setDebtorSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedDebtors.length === availableDebtors.filter(d => d.eligible).length}
                          indeterminate={selectedDebtors.length > 0 && selectedDebtors.length < availableDebtors.filter(d => d.eligible).length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDebtors(availableDebtors.filter(d => d.eligible).map(d => d.id));
                            } else {
                              setSelectedDebtors([]);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Debtor Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>DPD</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Credit Score</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Eligibility</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableDebtors
                      .filter(debtor =>
                        debtor.name.toLowerCase().includes(debtorSearchTerm.toLowerCase()) ||
                        debtor.accountNumber.toLowerCase().includes(debtorSearchTerm.toLowerCase())
                      )
                      .map((debtor) => (
                      <TableRow key={debtor.id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedDebtors.includes(debtor.id)}
                            onChange={() => handleDebtorToggle(debtor.id)}
                            disabled={!debtor.eligible}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{debtor.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{debtor.accountNumber}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            ₹{debtor.balance.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${debtor.dpd} days`}
                            size="small"
                            color={debtor.dpd >= 180 ? 'error' : debtor.dpd >= 90 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{debtor.creditScore}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {debtor.eligible ? (
                              <>
                                <CheckCircleIcon color="success" fontSize="small" />
                                <Typography variant="body2" color="success.main">Eligible</Typography>
                                <Chip label={`${debtor.eligibilityScore}%`} size="small" color="success" />
                              </>
                            ) : (
                              <>
                                <ErrorIcon color="error" fontSize="small" />
                                <Typography variant="body2" color="error.main">Not Eligible</Typography>
                              </>
                            )}
                            <Tooltip title={debtor.eligibilityReasons.join(', ')}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedDebtors.length} debtor(s) selected
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Total Balance: ₹{selectedDebtors.reduce((sum, id) => {
                    const debtor = availableDebtors.find(d => d.id === id);
                    return sum + (debtor?.balance || 0);
                  }, 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Step 2: Customize Offer */}
          {offerStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {offerMode === 'common' ? 'Define Template Offer Terms' : 'Customize Settlement/Payment Plan Offer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {offerMode === 'common'
                    ? 'Set up standard terms that can be applied to any eligible debtor'
                    : `${selectedDebtors.length} debtor(s) selected • Total: ₹${selectedDebtors.reduce((sum, id) => {
                        const debtor = availableDebtors.find(d => d.id === id);
                        return sum + (debtor?.balance || 0);
                      }, 0).toLocaleString('en-IN')}`
                  }
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <FormLabel>Offer Type</FormLabel>
                  <RadioGroup value={offerType} onChange={(e) => setOfferType(e.target.value)}>
                    <FormControlLabel value="settlement" control={<Radio />} label="Lump Sum Settlement" />
                    <FormControlLabel value="payment_plan" control={<Radio />} label="Payment Plan" />
                    <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid (Partial Settlement + Plan)" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {offerType === 'settlement' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Settlement Percentage: {settlementPercentage}%
                    </Typography>
                    <Slider
                      value={settlementPercentage}
                      onChange={(e, v) => setSettlementPercentage(v)}
                      min={30}
                      max={100}
                      marks={[
                        { value: 30, label: '30%' },
                        { value: 50, label: '50%' },
                        { value: 70, label: '70%' },
                        { value: 100, label: '100%' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Offer Validity (Days)"
                      type="number"
                      defaultValue={15}
                    />
                  </Grid>
                </>
              )}

              {offerType === 'payment_plan' && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payment Duration: {paymentPlanMonths} months
                    </Typography>
                    <Slider
                      value={paymentPlanMonths}
                      onChange={(e, v) => setPaymentPlanMonths(v)}
                      min={3}
                      max={24}
                      marks={[
                        { value: 3, label: '3m' },
                        { value: 6, label: '6m' },
                        { value: 12, label: '12m' },
                        { value: 18, label: '18m' },
                        { value: 24, label: '24m' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Payment Frequency"
                      defaultValue="monthly"
                      SelectProps={{ native: true }}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Down Payment %"
                      type="number"
                      defaultValue={10}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Additional Options
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Switch checked={sendToPortal} onChange={(e) => setSendToPortal(e.target.checked)} />}
                  label="Send to Debtor Portal"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Debtors will be able to view and accept the offer in their self-service portal
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Switch checked={requireApproval} onChange={(e) => setRequireApproval(e.target.checked)} />}
                  label="Require Manager Approval"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Offer will be sent for manager review before being sent to debtors
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Internal Notes (Optional)"
                  multiline
                  rows={3}
                  placeholder="Add notes for internal team reference..."
                />
              </Grid>
            </Grid>
          )}

          {/* Step 3: Review & Send */}
          {offerStep === 3 && (() => {
            // For Common Plan, use all eligible debtors; otherwise use selected debtors
            const reviewDebtors = offerMode === 'common'
              ? availableDebtors.filter(d => d.eligible).map(d => d.id)
              : selectedDebtors;

            const totalBalance = reviewDebtors.reduce((sum, id) => {
              const debtor = availableDebtors.find(d => d.id === id);
              return sum + (debtor?.balance || 0);
            }, 0);

            return (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {offerMode === 'common' ? 'Review Template Offer' : 'Review & Send Offer'}
                </Typography>
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    {offerMode === 'common'
                      ? `You're creating a template offer that can be applied to ${reviewDebtors.length} eligible debtor(s). This template will be available for future use.`
                      : `You're about to create ${reviewDebtors.length} offer(s). Please review the details below.`
                    }
                  </Typography>
                </Alert>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Offer Summary
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary={offerMode === 'common' ? 'Eligible Debtors' : 'Number of Debtors'}
                              secondary={reviewDebtors.length}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Total Outstanding Balance"
                              secondary={`₹${totalBalance.toLocaleString('en-IN')}`}
                            />
                          </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Offer Type"
                            secondary={offerType === 'settlement' ? 'Lump Sum Settlement' : 'Payment Plan'}
                          />
                        </ListItem>
                        {offerType === 'settlement' && (
                          <ListItem>
                            <ListItemText
                              primary="Settlement Percentage"
                              secondary={`${settlementPercentage}%`}
                            />
                          </ListItem>
                        )}
                        {offerType === 'payment_plan' && (
                          <ListItem>
                            <ListItemText
                              primary="Payment Duration"
                              secondary={`${paymentPlanMonths} months`}
                            />
                          </ListItem>
                        )}
                        <ListItem>
                          <ListItemText
                            primary="Debtor Portal"
                            secondary={sendToPortal ? 'Enabled - Debtors can view and accept' : 'Disabled'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Approval Required"
                            secondary={requireApproval ? 'Yes - Pending manager approval' : 'No - Will be sent immediately'}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {offerMode === 'common' ? 'Eligible Debtors (Template Applicable To)' : 'Selected Debtors'}
                      </Typography>
                      {offerMode === 'common' && (
                        <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
                          <Typography variant="caption">
                            This template can be applied to all eligible debtors below
                          </Typography>
                        </Alert>
                      )}
                      <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {reviewDebtors.map(id => {
                          const debtor = availableDebtors.find(d => d.id === id);
                          return debtor ? (
                            <ListItem key={id}>
                              <ListItemIcon>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                                  {debtor.name.charAt(0)}
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={debtor.name}
                                secondary={`${debtor.accountNumber} • ₹${debtor.balance.toLocaleString('en-IN')}`}
                              />
                            </ListItem>
                          ) : null;
                        })}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            );
          })()}
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setCreateOfferDialog(false)}>Cancel</Button>
          {offerStep > 0 && (
            <Button onClick={handleBack} startIcon={<NavigateBeforeIcon />}>
              Back
            </Button>
          )}
          {offerStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNextIcon />}
              disabled={
                (offerStep === 0 && !offerMode) ||
                (offerStep === 1 && offerMode !== 'common' && selectedDebtors.length === 0)
              }
            >
              Next
            </Button>
          )}
          {offerStep === steps.length - 1 && (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (offerMode === 'common') {
                  const eligibleCount = availableDebtors.filter(d => d.eligible).length;
                  const templateName = offerType === 'settlement' ? `${settlementPercentage}% Settlement` : `${paymentPlanMonths}-Month Payment Plan`;
                  showNotification(`Template "${templateName}" created successfully! Can be applied to ${eligibleCount} eligible debtor(s).`, 'success');
                } else {
                  const status = requireApproval ? 'submitted for approval' : 'sent immediately';
                  showNotification(`${selectedDebtors.length} offer(s) ${status}${sendToPortal ? ' and visible in Debtor Portal' : ''}`, 'success');
                }
                setCreateOfferDialog(false);
              }}
              startIcon={<SendIcon />}
            >
              {offerMode === 'common' ? 'Create Template' : (requireApproval ? 'Submit for Approval' : 'Send Offers')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  // Edit Offer Dialog
  const renderEditOfferDialog = () => {
    if (!editingOffer) return null;

    return (
      <Dialog
        open={editOfferDialog}
        onClose={() => setEditOfferDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Offer - {editingOffer.debtorName}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Account: {editingOffer.accountNumber} • Balance: ₹{editingOffer.currentBalance?.toLocaleString('en-IN')}
              </Typography>
            </Alert>

            {editingOffer.offerType === 'Settlement' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Settlement Percentage: {settlementPercentage}%
                </Typography>
                <Slider
                  value={settlementPercentage}
                  onChange={(e, v) => setSettlementPercentage(v)}
                  min={30}
                  max={100}
                  marks={[
                    { value: 30, label: '30%' },
                    { value: 50, label: '50%' },
                    { value: 70, label: '70%' },
                    { value: 100, label: '100%' }
                  ]}
                  valueLabelDisplay="auto"
                />
                <Card variant="outlined" sx={{ mt: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      New Settlement Amount
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="success.main">
                      ₹{((editingOffer.currentBalance * settlementPercentage) / 100).toLocaleString('en-IN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Savings: ₹{(editingOffer.currentBalance - (editingOffer.currentBalance * settlementPercentage) / 100).toLocaleString('en-IN')}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}

            {editingOffer.offerType === 'Payment Plan' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Duration: {paymentPlanMonths} months
                </Typography>
                <Slider
                  value={paymentPlanMonths}
                  onChange={(e, v) => setPaymentPlanMonths(v)}
                  min={3}
                  max={24}
                  marks={[
                    { value: 3, label: '3m' },
                    { value: 6, label: '6m' },
                    { value: 12, label: '12m' },
                    { value: 18, label: '18m' },
                    { value: 24, label: '24m' }
                  ]}
                  valueLabelDisplay="auto"
                />
                <Card variant="outlined" sx={{ mt: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      New Monthly Payment
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                      ₹{Math.ceil(editingOffer.currentBalance / paymentPlanMonths).toLocaleString('en-IN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total: ₹{editingOffer.currentBalance.toLocaleString('en-IN')} over {paymentPlanMonths} months
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOfferDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEditOffer} startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Send Reminder Dialog
  const renderReminderDialog = () => {
    if (!reminderOffer) return null;

    return (
      <Dialog
        open={reminderDialog}
        onClose={() => setReminderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Reminder - {reminderOffer.debtorName}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Account: {reminderOffer.accountNumber} • Status: {reminderOffer.status}
              </Typography>
            </Alert>

            <Typography variant="subtitle2" gutterBottom>
              Reminder will be sent via:
            </Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Chip icon={<EmailIcon />} label="Email" color="primary" variant="outlined" />
              <Chip icon={<SendIcon />} label="SMS" color="primary" variant="outlined" />
              <Chip icon={<InfoIcon />} label="Portal Notification" color="primary" variant="outlined" />
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={8}
              label="Message"
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              helperText="Customize the reminder message before sending"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReminderDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSendReminderConfirm}
            startIcon={<SendIcon />}
          >
            Send Reminder
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // View Plan Debtors Dialog
  const renderViewPlanDialog = () => {
    if (!selectedPlan) return null;

    // Mock debtor data for the selected plan
    const planDebtors = {
      eligible: availableDebtors.filter(d => d.eligible),
      assigned: [
        { ...availableDebtors[0], assignedDate: '2025-01-15', status: 'Pending' },
        { ...availableDebtors[1], assignedDate: '2025-01-14', status: 'Accepted' },
        { ...availableDebtors[3], assignedDate: '2025-01-16', status: 'Accepted' }
      ],
      accepted: [
        { ...availableDebtors[1], acceptedDate: '2025-01-17', offerAmount: 49200 },
        { ...availableDebtors[3], acceptedDate: '2025-01-18', offerAmount: 40200 }
      ]
    };

    return (
      <Dialog
        open={viewPlanDialog}
        onClose={() => setViewPlanDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{selectedPlan.planName}</Typography>
              <Typography variant="caption">
                {selectedPlan.planType} • {selectedPlan.status}
              </Typography>
            </Box>
            <IconButton onClick={() => setViewPlanDialog(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {/* Plan Summary Card */}
          <Card variant="outlined" sx={{ mb: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Plan Details
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedPlan.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${selectedPlan.eligibleDebtors} Eligible`}
                      color="info"
                      size="small"
                    />
                    <Chip
                      label={`${selectedPlan.assignedDebtors} Assigned`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={`${selectedPlan.acceptedDebtors} Accepted`}
                      color="success"
                      size="small"
                    />
                    {selectedPlan.pendingDebtors > 0 && (
                      <Chip
                        label={`${selectedPlan.pendingDebtors} Pending`}
                        color="warning"
                        size="small"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Eligibility Criteria
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="DPD Range"
                        secondary={`${selectedPlan.eligibilityCriteria.minDPD || 0}+ days`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Balance Range"
                        secondary={`₹${selectedPlan.eligibilityCriteria.minBalance?.toLocaleString('en-IN')} - ₹${selectedPlan.eligibilityCriteria.maxBalance?.toLocaleString('en-IN') || 'No limit'}`}
                      />
                    </ListItem>
                    {selectedPlan.eligibilityCriteria.creditScoreRange && (
                      <ListItem>
                        <ListItemText
                          primary="Credit Score"
                          secondary={`${selectedPlan.eligibilityCriteria.creditScoreRange[0]} - ${selectedPlan.eligibilityCriteria.creditScoreRange[1]}`}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabs for Eligible / Assigned / Accepted */}
          <Tabs value={debtorTabValue} onChange={(e, v) => setDebtorTabValue(v)} sx={{ mb: 2 }}>
            <Tab label={`Eligible Debtors (${planDebtors.eligible.length})`} />
            <Tab label={`Assigned Debtors (${planDebtors.assigned.length})`} />
            <Tab label={`Accepted Debtors (${planDebtors.accepted.length})`} />
          </Tabs>

          {/* Eligible Debtors Tab */}
          {debtorTabValue === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  These debtors meet the eligibility criteria for this plan. You can assign them to this plan.
                </Typography>
              </Alert>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEligibleDebtors.length === planDebtors.eligible.length && planDebtors.eligible.length > 0}
                          indeterminate={selectedEligibleDebtors.length > 0 && selectedEligibleDebtors.length < planDebtors.eligible.length}
                          onChange={() => handleSelectAllEligibleDebtors(planDebtors.eligible)}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Debtor Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>DPD</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Credit Score</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Eligibility Score</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planDebtors.eligible.map((debtor) => (
                      <TableRow key={debtor.id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedEligibleDebtors.includes(debtor.id)}
                            onChange={() => handleToggleEligibleDebtor(debtor.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{debtor.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{debtor.accountNumber}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            ₹{debtor.balance.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${debtor.dpd} days`}
                            size="small"
                            color={debtor.dpd >= 180 ? 'error' : debtor.dpd >= 90 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{debtor.creditScore}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${debtor.eligibilityScore}%`}
                            size="small"
                            color="success"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              showNotification(`${debtor.name} assigned to ${selectedPlan.planName}`, 'success');
                            }}
                          >
                            Assign to Plan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedEligibleDebtors.length} debtor(s) selected
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={handleAssignSelectedToFlan}
                  disabled={selectedEligibleDebtors.length === 0}
                >
                  Assign Selected to Plan
                </Button>
              </Box>
            </Box>
          )}

          {/* Assigned Debtors Tab */}
          {debtorTabValue === 1 && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  These debtors have been assigned this plan and the offer has been sent to them.
                </Typography>
              </Alert>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Debtor Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>DPD</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Assigned Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planDebtors.assigned.map((debtor) => (
                      <TableRow key={debtor.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{debtor.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{debtor.accountNumber}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            ₹{debtor.balance.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${debtor.dpd} days`}
                            size="small"
                            color={debtor.dpd >= 180 ? 'error' : debtor.dpd >= 90 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{debtor.assignedDate}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={debtor.status}
                            size="small"
                            color={debtor.status === 'Accepted' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Send Reminder">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleSendReminderToPlan(debtor)}
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Accepted Debtors Tab */}
          {debtorTabValue === 2 && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  These debtors have accepted the plan offer.
                </Typography>
              </Alert>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                      <TableCell sx={{ fontWeight: 600 }}>Debtor Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Original Balance</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Offer Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Accepted Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planDebtors.accepted.map((debtor) => (
                      <TableRow key={debtor.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Typography variant="body2" fontWeight={500}>{debtor.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{debtor.accountNumber}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            ₹{debtor.balance.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            ₹{debtor.offerAmount?.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{debtor.acceptedDate}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewDebtorDetails(debtor)}
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
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setViewPlanDialog(false)}>Close</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export List
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Settlement & Payment Plan Automation
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          <strong>AI-Powered Settlements:</strong> Create and manage settlement & payment plan templates.
          View eligible debtors, assign plans, and track acceptance rates for optimized recovery.
        </Typography>
      </Alert>

      {renderOverviewCards()}
      {renderSettlementPlans()}
      {renderCalculatorDialog()}
      {renderCreateOfferDialog()}
      {renderEditOfferDialog()}
      {renderReminderDialog()}
      {renderViewPlanDialog()}

      {/* In-app Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettlementAutomation;
