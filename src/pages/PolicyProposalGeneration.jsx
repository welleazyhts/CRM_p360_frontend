import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Description as ProposalIcon,
  Download as DownloadIcon,
  Visibility as PreviewIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const PolicyProposalGeneration = () => {
  const theme = useTheme();
  const [proposalDialog, setProposalDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [proposalForm, setProposalForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    policyType: '',
    coverageAmount: '',
    premium: '',
    tenure: '',
    startDate: '',
    endDate: '',
    agentName: '',
    agentCode: '',
    remarks: ''
  });

  const [proposals, setProposals] = useState([
    {
      id: 1,
      proposalNumber: 'PROP-2024-001',
      customerName: 'Rajesh Sharma',
      policyType: 'Vehicle Insurance',
      coverageAmount: 500000,
      premium: 25000,
      status: 'Generated',
      generatedDate: '2024-01-15',
      agentName: 'Priya Patel'
    },
    {
      id: 2,
      proposalNumber: 'PROP-2024-002',
      customerName: 'Anita Verma',
      policyType: 'Health Insurance',
      coverageAmount: 1000000,
      premium: 45000,
      status: 'Sent',
      generatedDate: '2024-01-14',
      agentName: 'Amit Kumar'
    }
  ]);

  const policyTypes = [
    'Vehicle Insurance',
    'Health Insurance',
    'Life Insurance',
    'Property Insurance',
    'Travel Insurance'
  ];

  const handleGenerateProposal = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newProposal = {
        id: proposals.length + 1,
        proposalNumber: `PROP-2024-${String(proposals.length + 1).padStart(3, '0')}`,
        customerName: proposalForm.customerName,
        policyType: proposalForm.policyType,
        coverageAmount: parseInt(proposalForm.coverageAmount),
        premium: parseInt(proposalForm.premium),
        status: 'Generated',
        generatedDate: new Date().toISOString().split('T')[0],
        agentName: proposalForm.agentName
      };

      setProposals([newProposal, ...proposals]);
      setProposalDialog(false);
      setProposalForm({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        policyType: '',
        coverageAmount: '',
        premium: '',
        tenure: '',
        startDate: '',
        endDate: '',
        agentName: '',
        agentCode: '',
        remarks: ''
      });

      setSnackbar({
        open: true,
        message: 'Proposal generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate proposal',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (proposal) => {
    setSelectedProposal(proposal);
    setPreviewDialog(true);
  };

  const handleDownload = (proposal) => {
    // Simulate PDF download
    setSnackbar({
      open: true,
      message: `Downloading proposal ${proposal.proposalNumber}`,
      severity: 'info'
    });
  };

  const handleSend = (proposal) => {
    setSnackbar({
      open: true,
      message: `Proposal ${proposal.proposalNumber} sent to customer`,
      severity: 'success'
    });
    
    // Update status
    setProposals(prev => prev.map(p => 
      p.id === proposal.id ? { ...p, status: 'Sent' } : p
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Generated': return 'primary';
      case 'Sent': return 'success';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Policy Proposal Generation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate, manage and track policy proposals for customers
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Proposals
                  </Typography>
                  <Typography variant="h4" fontWeight="600">
                    {proposals.length}
                  </Typography>
                </Box>
                <ProposalIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Generated Today
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="success.main">
                    {proposals.filter(p => p.generatedDate === new Date().toISOString().split('T')[0]).length}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Sent Proposals
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="info.main">
                    {proposals.filter(p => p.status === 'Sent').length}
                  </Typography>
                </Box>
                <SendIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="h4" fontWeight="600" color="warning.main">
                    ₹{proposals.reduce((sum, p) => sum + p.premium, 0).toLocaleString()}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="600">
              Policy Proposals
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setProposalDialog(true)}
            >
              Generate New Proposal
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal Number</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Policy Type</TableCell>
                  <TableCell>Coverage Amount</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Generated Date</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="primary">
                        {proposal.proposalNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{proposal.customerName}</TableCell>
                    <TableCell>{proposal.policyType}</TableCell>
                    <TableCell>₹{proposal.coverageAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        ₹{proposal.premium.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={proposal.status}
                        size="small"
                        color={getStatusColor(proposal.status)}
                      />
                    </TableCell>
                    <TableCell>{new Date(proposal.generatedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{proposal.agentName}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Preview">
                        <IconButton size="small" onClick={() => handlePreview(proposal)}>
                          <PreviewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton size="small" onClick={() => handleDownload(proposal)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      {proposal.status === 'Generated' && (
                        <Tooltip title="Send to Customer">
                          <IconButton size="small" onClick={() => handleSend(proposal)}>
                            <SendIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Generate Proposal Dialog */}
      <Dialog open={proposalDialog} onClose={() => setProposalDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ProposalIcon color="primary" />
            <Typography variant="h6" fontWeight="600">Generate Policy Proposal</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Customer Information */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="600">Customer Information</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={proposalForm.customerName}
                onChange={(e) => setProposalForm({ ...proposalForm, customerName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={proposalForm.email}
                onChange={(e) => setProposalForm({ ...proposalForm, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={proposalForm.phone}
                onChange={(e) => setProposalForm({ ...proposalForm, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={proposalForm.address}
                onChange={(e) => setProposalForm({ ...proposalForm, address: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BusinessIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="600">Policy Details</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Policy Type</InputLabel>
                <Select
                  value={proposalForm.policyType}
                  label="Policy Type"
                  onChange={(e) => setProposalForm({ ...proposalForm, policyType: e.target.value })}
                >
                  {policyTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coverage Amount (₹)"
                type="number"
                value={proposalForm.coverageAmount}
                onChange={(e) => setProposalForm({ ...proposalForm, coverageAmount: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Premium Amount (₹)"
                type="number"
                value={proposalForm.premium}
                onChange={(e) => setProposalForm({ ...proposalForm, premium: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tenure (Years)"
                type="number"
                value={proposalForm.tenure}
                onChange={(e) => setProposalForm({ ...proposalForm, tenure: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Start Date"
                type="date"
                value={proposalForm.startDate}
                onChange={(e) => setProposalForm({ ...proposalForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy End Date"
                type="date"
                value={proposalForm.endDate}
                onChange={(e) => setProposalForm({ ...proposalForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>Agent Information</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Agent Name"
                value={proposalForm.agentName}
                onChange={(e) => setProposalForm({ ...proposalForm, agentName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Agent Code"
                value={proposalForm.agentCode}
                onChange={(e) => setProposalForm({ ...proposalForm, agentCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                value={proposalForm.remarks}
                onChange={(e) => setProposalForm({ ...proposalForm, remarks: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProposalDialog(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateProposal}
            variant="contained"
            disabled={loading || !proposalForm.customerName || !proposalForm.policyType}
            startIcon={loading ? null : <ProposalIcon />}
          >
            {loading ? 'Generating...' : 'Generate Proposal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Proposal Preview - {selectedProposal?.proposalNumber}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Policy Proposal
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Customer:</Typography>
                  <Typography variant="body1" fontWeight="600">{selectedProposal.customerName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Policy Type:</Typography>
                  <Typography variant="body1">{selectedProposal.policyType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Coverage Amount:</Typography>
                  <Typography variant="body1">₹{selectedProposal.coverageAmount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Premium:</Typography>
                  <Typography variant="body1" fontWeight="600">₹{selectedProposal.premium.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default PolicyProposalGeneration;