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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Visibility as ViewIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const PaymentReconciliation = () => {
  const [tabValue, setTabValue] = useState(0);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [matchDialog, setMatchDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [uploadFile, setUploadFile] = useState(null);

  // Mock data for bank payments
  const mockBankPayments = [
    {
      id: 'BP-001',
      transactionDate: '2025-01-17',
      transactionRef: 'TXN-7889234',
      amount: 5000.00,
      payerName: 'John Smith',
      payerAccount: 'XXXX1234',
      status: 'Matched',
      matchedAccount: 'ACC-10001',
      matchedDate: '2025-01-17',
      matchType: 'Auto',
      confidence: 100
    },
    {
      id: 'BP-002',
      transactionDate: '2025-01-17',
      transactionRef: 'TXN-7889240',
      amount: 1200.00,
      payerName: 'Maria G',
      payerAccount: 'XXXX5678',
      status: 'Matched',
      matchedAccount: 'ACC-10004',
      matchedDate: '2025-01-17',
      matchType: 'Auto',
      confidence: 95
    },
    {
      id: 'BP-003',
      transactionDate: '2025-01-17',
      transactionRef: 'TXN-7889256',
      amount: 2100.00,
      payerName: 'R Taylor',
      payerAccount: 'XXXX9012',
      status: 'Unmatched',
      matchType: null,
      confidence: 0,
      possibleMatches: [
        { accountId: 'ACC-10015', accountName: 'Robert Taylor', outstandingBalance: 11000, confidence: 85 },
        { accountId: 'ACC-10022', accountName: 'Ryan Taylor', outstandingBalance: 2500, confidence: 60 }
      ]
    },
    {
      id: 'BP-004',
      transactionDate: '2025-01-16',
      transactionRef: 'TXN-7885123',
      amount: 750.00,
      payerName: 'Unknown',
      payerAccount: 'XXXX4567',
      status: 'Unmatched',
      matchType: null,
      confidence: 0,
      possibleMatches: []
    },
    {
      id: 'BP-005',
      transactionDate: '2025-01-16',
      transactionRef: 'TXN-7885200',
      amount: 3500.00,
      payerName: 'James Wilson',
      payerAccount: 'XXXX7890',
      status: 'Matched',
      matchedAccount: 'ACC-10012',
      matchedDate: '2025-01-16',
      matchType: 'Manual',
      confidence: 100,
      matchedBy: 'Sarah Johnson'
    }
  ];

  // Mock data for reconciliation summary
  const reconciliationStats = {
    date: '2025-01-17',
    totalPayments: 25,
    totalAmount: 125000.00,
    matchedPayments: 20,
    matchedAmount: 110000.00,
    unmatchedPayments: 5,
    unmatchedAmount: 15000.00,
    matchRate: 80.0,
    autoMatched: 18,
    manualMatched: 2
  };

  // Mock data for recent reconciliation history
  const reconciliationHistory = [
    {
      date: '2025-01-17',
      totalPayments: 25,
      totalAmount: 125000.00,
      matchedPayments: 20,
      unmatchedPayments: 5,
      status: 'In Progress',
      reconciledBy: 'System',
      lastUpdated: '2025-01-17 14:30'
    },
    {
      date: '2025-01-16',
      totalPayments: 32,
      totalAmount: 156000.00,
      matchedPayments: 32,
      unmatchedPayments: 0,
      status: 'Completed',
      reconciledBy: 'Sarah Johnson',
      lastUpdated: '2025-01-16 18:00'
    },
    {
      date: '2025-01-15',
      totalPayments: 28,
      totalAmount: 142000.00,
      matchedPayments: 26,
      unmatchedPayments: 2,
      status: 'Completed',
      reconciledBy: 'Mike Wilson',
      lastUpdated: '2025-01-15 17:45'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Matched': 'success',
      'Unmatched': 'warning',
      'Disputed': 'error',
      'In Progress': 'info',
      'Completed': 'success'
    };
    return colors[status] || 'default';
  };

  const getMatchTypeIcon = (matchType) => {
    if (matchType === 'Auto') return <CheckIcon fontSize="small" />;
    if (matchType === 'Manual') return <LinkIcon fontSize="small" />;
    return null;
  };

  const handleManualMatch = (payment) => {
    setSelectedPayment(payment);
    setMatchDialog(true);
  };

  const handleConfirmMatch = () => {
    console.log('Matching payment:', selectedPayment.id, 'to account:', selectedAccount);
    setMatchDialog(false);
    setSelectedPayment(null);
    setSelectedAccount('');
  };

  const handleUploadStatement = () => {
    console.log('Uploading bank statement:', uploadFile);
    setUploadDialog(false);
    setUploadFile(null);
  };

  const filterPayments = (status) => {
    if (status === 'all') return mockBankPayments;
    return mockBankPayments.filter(payment => payment.status === status);
  };

  const getCurrentTabPayments = () => {
    const statusMap = ['all', 'Matched', 'Unmatched'];
    return filterPayments(statusMap[tabValue]);
  };

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" gutterBottom>
            Payment Reconciliation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Match and reconcile incoming payments with debtor accounts
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ mr: 1 }}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialog(true)}
          >
            Upload Bank Statement
          </Button>
        </Box>
      </Box>

      {/* Reconciliation Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Payments Today
              </Typography>
              <Typography variant="h4">
                {reconciliationStats.totalPayments}
              </Typography>
              <Typography variant="body2" color="primary.main" mt={1}>
                Amount: ${reconciliationStats.totalAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Matched Payments
              </Typography>
              <Typography variant="h4" color="success.main">
                {reconciliationStats.matchedPayments}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Amount: ${reconciliationStats.matchedAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Unmatched Payments
              </Typography>
              <Typography variant="h4" color="warning.main">
                {reconciliationStats.unmatchedPayments}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Amount: ${reconciliationStats.unmatchedAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Match Rate
              </Typography>
              <Typography variant="h4" color="primary.main">
                {reconciliationStats.matchRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Auto: {reconciliationStats.autoMatched} | Manual: {reconciliationStats.manualMatched}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payments Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="All Payments" />
            <Tab label="Matched" />
            <Tab label="Unmatched" />
          </Tabs>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction Ref</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Payer Details</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Matched Account</TableCell>
                  <TableCell>Match Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentTabPayments().map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {payment.transactionRef}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {payment.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.transactionDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {payment.payerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Account: {payment.payerAccount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        ${payment.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        size="small"
                        color={getStatusColor(payment.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {payment.matchedAccount ? (
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {payment.matchedAccount}
                          </Typography>
                          {payment.confidence && (
                            <Typography variant="caption" color="text.secondary">
                              Confidence: {payment.confidence}%
                            </Typography>
                          )}
                        </Box>
                      ) : payment.possibleMatches && payment.possibleMatches.length > 0 ? (
                        <Chip label={`${payment.possibleMatches.length} Possible`} size="small" color="info" />
                      ) : (
                        <Chip label="No Match" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.matchType && (
                        <Chip
                          label={payment.matchType}
                          size="small"
                          icon={getMatchTypeIcon(payment.matchType)}
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.status === 'Unmatched' ? (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<LinkIcon />}
                          onClick={() => handleManualMatch(payment)}
                        >
                          Match
                        </Button>
                      ) : (
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {getCurrentTabPayments().length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No payments found in this category
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Reconciliation History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reconciliation History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Payments</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Matched</TableCell>
                  <TableCell>Unmatched</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reconciled By</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reconciliationHistory.map((record, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {record.date}
                      </Typography>
                    </TableCell>
                    <TableCell>{record.totalPayments}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ${record.totalAmount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={record.matchedPayments} size="small" color="success" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.unmatchedPayments}
                        size="small"
                        color={record.unmatchedPayments === 0 ? 'default' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        size="small"
                        color={getStatusColor(record.status)}
                      />
                    </TableCell>
                    <TableCell>{record.reconciledBy}</TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {record.lastUpdated}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Upload Bank Statement Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Bank Statement</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Upload today's bank statement to automatically match payments with debtor accounts.
            Supported formats: CSV, Excel, PDF
          </Alert>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input
              id="file-upload"
              type="file"
              hidden
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              CSV, Excel or PDF (Max 10MB)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUploadStatement} disabled={!uploadFile}>
            Upload & Process
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Match Dialog */}
      <Dialog open={matchDialog} onClose={() => setMatchDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Manual Payment Matching</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Match this payment to a debtor account manually
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Payment Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Transaction Ref</Typography>
                          <Typography variant="body1" fontWeight="bold">{selectedPayment.transactionRef}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Amount</Typography>
                          <Typography variant="h6" color="success.main">
                            ${selectedPayment.amount.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Payer Name</Typography>
                          <Typography variant="body1">{selectedPayment.payerName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Date</Typography>
                          <Typography variant="body1">{selectedPayment.transactionDate}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {selectedPayment.possibleMatches && selectedPayment.possibleMatches.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Possible Matches
                    </Typography>
                    <List>
                      {selectedPayment.possibleMatches.map((match, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                          onClick={() => setSelectedAccount(match.accountId)}
                          selected={selectedAccount === match.accountId}
                        >
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body1" fontWeight="bold">
                                  {match.accountId}
                                </Typography>
                                <Typography variant="body1">
                                  - {match.accountName}
                                </Typography>
                                <Chip
                                  label={`${match.confidence}% match`}
                                  size="small"
                                  color={match.confidence > 80 ? 'success' : 'warning'}
                                />
                              </Box>
                            }
                            secondary={`Outstanding Balance: $${match.outstandingBalance.toLocaleString()}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Or Select Account Manually</InputLabel>
                    <Select
                      value={selectedAccount}
                      label="Or Select Account Manually"
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                      <MenuItem value="">-- Select Account --</MenuItem>
                      <MenuItem value="ACC-10001">ACC-10001 - John Smith</MenuItem>
                      <MenuItem value="ACC-10002">ACC-10002 - Emily Davis</MenuItem>
                      <MenuItem value="ACC-10003">ACC-10003 - Robert Brown</MenuItem>
                      <MenuItem value="ACC-10004">ACC-10004 - Maria Garcia</MenuItem>
                      <MenuItem value="ACC-10015">ACC-10015 - Robert Taylor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={2}
                    placeholder="Add any notes about this manual match..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMatchDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmMatch}
            disabled={!selectedAccount}
          >
            Confirm Match
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentReconciliation;
