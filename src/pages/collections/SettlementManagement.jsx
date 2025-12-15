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
  Stepper,
  Step,
  StepLabel,
  Alert,
  Slider,
  Divider,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Snackbar,
  InputAdornment,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Send as SendIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Archive as ArchiveIcon,
  Group as GroupIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import { useActivityLog } from '../../context/ActivityLogContext';

const SettlementManagement = () => {
  const { addLog } = useActivityLog();
  const theme = useTheme();
  const [activeDialog, setActiveDialog] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [settlement, setSettlement] = useState({
    debtorId: '',
    outstandingBalance: 0,
    settlementAmount: 0,
    discountPercent: 0,
    paymentTerms: 'lump_sum',
    installments: 1,
    reason: ''
  });

  // Bulk Selection & Filters
  const [selectedSettlements, setSelectedSettlements] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    discountMin: '',
    discountMax: '',
    amountMin: '',
    amountMax: '',
    approvalLevel: 'all',
    paymentTerms: 'all'
  });

  const steps = ['Debtor Selection', 'Settlement Terms', 'Approval', 'Generate Agreement'];

  // Mock settlement data
  const mockSettlements = [
    {
      id: 'SET-001',
      debtorId: 'ACC-10001',
      debtorName: 'John Smith',
      outstandingBalance: 12500,
      settlementAmount: 6250,
      discountPercent: 50,
      status: 'Pending Approval',
      requestedBy: 'Sarah Johnson',
      requestDate: '2025-01-16',
      paymentTerms: 'Lump Sum',
      approvalLevel: 'Supervisor'
    },
    {
      id: 'SET-002',
      debtorId: 'ACC-10004',
      debtorName: 'Maria Garcia',
      outstandingBalance: 3200,
      settlementAmount: 2400,
      discountPercent: 25,
      status: 'Approved',
      requestedBy: 'John Adams',
      requestDate: '2025-01-15',
      approvedBy: 'Michael Davis',
      approvalDate: '2025-01-15',
      paymentTerms: '3 Installments',
      approvalLevel: 'Manager'
    },
    {
      id: 'SET-003',
      debtorId: 'ACC-10012',
      debtorName: 'James Wilson',
      outstandingBalance: 7800,
      settlementAmount: 2340,
      discountPercent: 70,
      status: 'Pending Approval',
      requestedBy: 'Sarah Johnson',
      requestDate: '2025-01-17',
      paymentTerms: 'Lump Sum',
      approvalLevel: 'Director',
      urgency: 'High'
    },
    {
      id: 'SET-004',
      debtorId: 'ACC-10008',
      debtorName: 'Lisa Anderson',
      outstandingBalance: 9500,
      settlementAmount: 6650,
      discountPercent: 30,
      status: 'Completed',
      requestedBy: 'Mike Wilson',
      requestDate: '2025-01-10',
      approvedBy: 'Michael Davis',
      approvalDate: '2025-01-11',
      paymentTerms: 'Lump Sum',
      paidAmount: 6650,
      paidDate: '2025-01-13'
    },
    {
      id: 'SET-005',
      debtorId: 'ACC-10015',
      debtorName: 'Robert Taylor',
      outstandingBalance: 11000,
      settlementAmount: 8800,
      discountPercent: 20,
      status: 'Rejected',
      requestedBy: 'Sarah Johnson',
      requestDate: '2025-01-14',
      rejectedBy: 'Michael Davis',
      rejectionDate: '2025-01-14',
      rejectionReason: 'Discount too low for debtor ability'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Pending Approval': 'warning',
      'Approved': 'success',
      'Rejected': 'error',
      'Completed': 'success',
      'Cancelled': 'default'
    };
    return colors[status] || 'default';
  };

  const calculateSettlement = (balance, discount) => {
    return balance * (1 - discount / 100);
  };

  const handleDiscountChange = (event, newValue) => {
    const discountPercent = newValue;
    const settlementAmount = calculateSettlement(settlement.outstandingBalance, discountPercent);
    setSettlement({
      ...settlement,
      discountPercent,
      settlementAmount
    });
  };

  const approvalLimits = [
    { level: 'Agent', maxDiscount: 20, label: 'Up to 20% discount' },
    { level: 'Supervisor', maxDiscount: 40, label: '20-40% discount' },
    { level: 'Manager', maxDiscount: 60, label: '40-60% discount' },
    { level: 'Director', maxDiscount: 80, label: 'Over 60% discount' }
  ];

  const currentUser = 'Current User'; // In production, get from auth context

  // Bulk Selection Handlers
  const handleSelectSettlement = (settlementId) => {
    const newSelected = selectedSettlements.includes(settlementId)
      ? selectedSettlements.filter(id => id !== settlementId)
      : [...selectedSettlements, settlementId];
    setSelectedSettlements(newSelected);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allSettlementIds = filteredSettlements.map(s => s.id);
      setSelectedSettlements(allSettlementIds);
    } else {
      setSelectedSettlements([]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedSettlements.length === 0) {
      setSnackbar({ open: true, message: 'Please select settlements to approve', severity: 'warning' });
      return;
    }

    selectedSettlements.forEach(settlementId => {
      const settlement = mockSettlements.find(s => s.id === settlementId);
      if (settlement) {
        addLog({
          user: currentUser,
          action: 'Settlement Approved',
          entity: 'Settlement',
          entityId: settlement.id,
          entityName: `${settlement.debtorName} - ${settlement.id}`,
          details: `Approved settlement of $${settlement.settlementAmount} (${settlement.discountPercent}% discount)`,
          category: 'approval',
          status: 'success'
        });
      }
    });

    setSnackbar({
      open: true,
      message: `${selectedSettlements.length} settlement(s) approved successfully`,
      severity: 'success'
    });
    setSelectedSettlements([]);
  };

  const handleBulkReject = () => {
    if (selectedSettlements.length === 0) {
      setSnackbar({ open: true, message: 'Please select settlements to reject', severity: 'warning' });
      return;
    }

    if (window.confirm(`Are you sure you want to reject ${selectedSettlements.length} settlement(s)?`)) {
      selectedSettlements.forEach(settlementId => {
        const settlement = mockSettlements.find(s => s.id === settlementId);
        if (settlement) {
          addLog({
            user: currentUser,
            action: 'Settlement Rejected',
            entity: 'Settlement',
            entityId: settlement.id,
            entityName: `${settlement.debtorName} - ${settlement.id}`,
            details: `Rejected settlement request`,
            category: 'approval',
            status: 'warning'
          });
        }
      });

      setSnackbar({
        open: true,
        message: `${selectedSettlements.length} settlement(s) rejected`,
        severity: 'info'
      });
      setSelectedSettlements([]);
    }
  };

  // Filtering Logic
  const filteredSettlements = mockSettlements.filter(settlement => {
    const matchesSearch = settlement.debtorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.debtorId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'all' || settlement.status === filters.status;

    const matchesDiscount = (
      (filters.discountMin === '' || settlement.discountPercent >= parseFloat(filters.discountMin)) &&
      (filters.discountMax === '' || settlement.discountPercent <= parseFloat(filters.discountMax))
    );

    const matchesAmount = (
      (filters.amountMin === '' || settlement.settlementAmount >= parseFloat(filters.amountMin)) &&
      (filters.amountMax === '' || settlement.settlementAmount <= parseFloat(filters.amountMax))
    );

    const matchesApprovalLevel = filters.approvalLevel === 'all' || settlement.approvalLevel === filters.approvalLevel;

    const matchesPaymentTerms = filters.paymentTerms === 'all' || settlement.paymentTerms.includes(filters.paymentTerms);

    return matchesSearch && matchesStatus && matchesDiscount && matchesAmount && matchesApprovalLevel && matchesPaymentTerms;
  });

  const stats = {
    total: mockSettlements.length,
    pending: mockSettlements.filter(s => s.status === 'Pending Approval').length,
    approved: mockSettlements.filter(s => s.status === 'Approved').length,
    completed: mockSettlements.filter(s => s.status === 'Completed').length,
    totalOutstanding: mockSettlements.reduce((sum, s) => sum + s.outstandingBalance, 0),
    totalSettlementValue: mockSettlements
      .filter(s => s.status === 'Approved' || s.status === 'Completed')
      .reduce((sum, s) => sum + s.settlementAmount, 0),
    totalRecovered: mockSettlements
      .filter(s => s.status === 'Completed')
      .reduce((sum, s) => sum + (s.paidAmount || 0), 0)
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Debtor Account ID"
                value={settlement.debtorId}
                onChange={(e) => setSettlement({ ...settlement, debtorId: e.target.value })}
                placeholder="ACC-10001"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Outstanding Balance"
                type="number"
                value={settlement.outstandingBalance}
                onChange={(e) => setSettlement({
                  ...settlement,
                  outstandingBalance: parseFloat(e.target.value) || 0
                })}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Outstanding Balance: ${settlement.outstandingBalance.toLocaleString()}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Settlement Amount: ${settlement.settlementAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Discount: {settlement.discountPercent}%
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Discount Percentage</Typography>
              <Slider
                value={settlement.discountPercent}
                onChange={handleDiscountChange}
                valueLabelDisplay="on"
                step={5}
                marks
                min={0}
                max={80}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Terms</InputLabel>
                <Select
                  value={settlement.paymentTerms}
                  label="Payment Terms"
                  onChange={(e) => setSettlement({ ...settlement, paymentTerms: e.target.value })}
                >
                  <MenuItem value="lump_sum">Lump Sum</MenuItem>
                  <MenuItem value="2_installments">2 Installments</MenuItem>
                  <MenuItem value="3_installments">3 Installments</MenuItem>
                  <MenuItem value="6_installments">6 Installments</MenuItem>
                  <MenuItem value="12_installments">12 Installments</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Settlement Reason / Notes"
                multiline
                rows={3}
                value={settlement.reason}
                onChange={(e) => setSettlement({ ...settlement, reason: e.target.value })}
              />
            </Grid>
          </Grid>
        );

      case 2:
        const requiredApproval = approvalLimits.find(
          limit => settlement.discountPercent <= limit.maxDiscount
        ) || approvalLimits[approvalLimits.length - 1];

        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              This settlement requires approval from: <strong>{requiredApproval.level}</strong>
            </Alert>
            <List>
              <ListItem>
                <ListItemText
                  primary="Outstanding Balance"
                  secondary={`$${settlement.outstandingBalance.toLocaleString()}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Settlement Amount"
                  secondary={`$${settlement.settlementAmount.toLocaleString()}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Discount"
                  secondary={`${settlement.discountPercent}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Payment Terms"
                  secondary={settlement.paymentTerms}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Required Approval Level"
                  secondary={requiredApproval.level}
                />
              </ListItem>
            </List>
          </Box>
        );

      case 3:
        return (
          <Box textAlign="center" py={4}>
            <ApproveIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Settlement Agreement Ready
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              The settlement agreement will be generated and sent for approval
            </Typography>
            <Box mt={3}>
              <Button variant="contained" startIcon={<PrintIcon />} sx={{ mr: 1 }}>
                Print Agreement
              </Button>
              <Button variant="contained" color="secondary" startIcon={<SendIcon />}>
                Send to Debtor
              </Button>
            </Box>
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
            Settlement Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Negotiate and manage debt settlements
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setActiveDialog('create')}
        >
          Create Settlement
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Approvals
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Approved Settlements
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Settlement Value
              </Typography>
              <Typography variant="h4" color="primary.main">
                ${stats.totalSettlementValue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Recovered Amount
              </Typography>
              <Typography variant="h4" color="success.main">
                ${stats.totalRecovered.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Levels Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Settlement Approval Levels
          </Typography>
          <Grid container spacing={2}>
            {approvalLimits.map((limit, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Box p={2} border={1} borderColor="divider" borderRadius={2}>
                  <Typography variant="subtitle2" color="primary.main">
                    {limit.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {limit.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search settlements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Discount Min (%)"
                type="number"
                value={filters.discountMin}
                onChange={(e) => setFilters({ ...filters, discountMin: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Discount Max (%)"
                type="number"
                value={filters.discountMax}
                onChange={(e) => setFilters({ ...filters, discountMax: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => setFilters({
                  status: 'all',
                  discountMin: '',
                  discountMax: '',
                  amountMin: '',
                  amountMax: '',
                  approvalLevel: 'all',
                  paymentTerms: 'all'
                })}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Settlements Table */}
      <Card>
        <CardContent>
          {/* Bulk Action Bar */}
          {selectedSettlements.length > 0 && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body1" fontWeight="600">
                {selectedSettlements.length} settlement(s) selected
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ApproveIcon />}
                  onClick={handleBulkApprove}
                  color="success"
                >
                  Bulk Approve
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RejectIcon />}
                  onClick={handleBulkReject}
                  color="error"
                >
                  Bulk Reject
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setSelectedSettlements([])}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSettlements.length === filteredSettlements.length && filteredSettlements.length > 0}
                      indeterminate={selectedSettlements.length > 0 && selectedSettlements.length < filteredSettlements.length}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>Settlement ID</TableCell>
                  <TableCell>Debtor</TableCell>
                  <TableCell>Outstanding</TableCell>
                  <TableCell>Settlement Amount</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Payment Terms</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSettlements.map((set) => (
                  <TableRow key={set.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedSettlements.includes(set.id)}
                        onChange={() => handleSelectSettlement(set.id)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {set.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {set.requestDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {set.debtorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {set.debtorId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${set.outstandingBalance.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        ${set.settlementAmount.toLocaleString()}
                      </Typography>
                      {set.paidAmount && (
                        <Typography variant="caption" color="success.main">
                          Paid: ${set.paidAmount.toLocaleString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${set.discountPercent}%`}
                        size="small"
                        color={
                          set.discountPercent > 50 ? 'error' :
                          set.discountPercent > 30 ? 'warning' : 'success'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {set.paymentTerms}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={set.status}
                        size="small"
                        color={getStatusColor(set.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {set.requestedBy}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                      {set.status === 'Pending Approval' && (
                        <>
                          <IconButton size="small" color="success">
                            <ApproveIcon />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                      {set.status === 'Approved' && (
                        <IconButton size="small" color="primary">
                          <PrintIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Settlement Dialog */}
      <Dialog
        open={activeDialog === 'create'}
        onClose={() => setActiveDialog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Settlement</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveDialog(null)}>Cancel</Button>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={() => setActiveDialog(null)}>
              Submit for Approval
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)}>
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettlementManagement;
