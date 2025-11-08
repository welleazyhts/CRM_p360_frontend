import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';

const QuoteManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productPlan: '',
    quoteAmount: '',
    validityPeriod: '30',
    remarks: ''
  });

  const [quotes, setQuotes] = useState([
    {
      id: 'Q001',
      customerName: 'Rajesh Kumar',
      productPlan: 'Health Insurance Premium',
      quoteAmount: '₹12,000',
      status: 'Pending',
      raisedDate: '2025-01-15'
    },
    {
      id: 'Q002',
      customerName: 'Priya Sharma',
      productPlan: 'Life Insurance Gold',
      quoteAmount: '₹25,000',
      status: 'Approved',
      raisedDate: '2025-01-16'
    },
    {
      id: 'Q003',
      customerName: 'Amit Singh',
      productPlan: 'Motor Insurance',
      quoteAmount: '₹8,500',
      status: 'Rejected',
      raisedDate: '2025-01-14'
    }
  ]);

  const mockHistory = [
    {
      id: 1,
      quoteId: 'Q001',
      action: 'Quote Created',
      user: 'Admin',
      timestamp: '2025-01-15 10:30 AM',
      details: 'Initial quote raised for Health Insurance'
    },
    {
      id: 2,
      quoteId: 'Q002',
      action: 'Status Changed',
      user: 'Manager',
      timestamp: '2025-01-16 02:15 PM',
      details: 'Status updated from Pending to Approved'
    },
    {
      id: 3,
      quoteId: 'Q003',
      action: 'Quote Rejected',
      user: 'Underwriter',
      timestamp: '2025-01-17 11:45 AM',
      details: 'Quote rejected due to high risk profile'
    }
  ];

  // Statistics
  const stats = {
    totalQuotes: quotes.length,
    raisedQuotes: quotes.filter(q => q.status === 'Pending').length,
    historyCount: mockHistory.length
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newQuote = {
      id: `Q${String(quotes.length + 1).padStart(3, '0')}`,
      customerName: formData.customerName,
      productPlan: formData.productPlan,
      quoteAmount: formData.quoteAmount.startsWith('₹') ? formData.quoteAmount : `₹${formData.quoteAmount}`,
      status: 'Pending',
      raisedDate: new Date().toISOString().split('T')[0]
    };
    
    setQuotes([...quotes, newQuote]);
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      productPlan: '',
      quoteAmount: '',
      validityPeriod: '30',
      remarks: ''
    });
  };

  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const renderQuoteList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Quote ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Product/Plan Name</TableCell>
            <TableCell>Quote Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Raised Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell>{quote.id}</TableCell>
              <TableCell>{quote.customerName}</TableCell>
              <TableCell>{quote.productPlan}</TableCell>
              <TableCell>{quote.quoteAmount}</TableCell>
              <TableCell>
                <Chip
                  label={quote.status}
                  color={getStatusColor(quote.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{quote.raisedDate}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewQuote(quote)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderRaiseQuoteForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Raise New Quote
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Name"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Email"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Phone"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Product / Plan</InputLabel>
              <Select
                value={formData.productPlan}
                onChange={(e) => handleInputChange('productPlan', e.target.value)}
              >
                <MenuItem value="Health Insurance Premium">Health Insurance Premium</MenuItem>
                <MenuItem value="Life Insurance Gold">Life Insurance Gold</MenuItem>
                <MenuItem value="Motor Insurance">Motor Insurance</MenuItem>
                <MenuItem value="Travel Insurance">Travel Insurance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quote Amount"
              value={formData.quoteAmount}
              onChange={(e) => handleInputChange('quoteAmount', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Validity Period</InputLabel>
              <Select
                value={formData.validityPeriod}
                onChange={(e) => handleInputChange('validityPeriod', e.target.value)}
              >
                <MenuItem value="15">15 days</MenuItem>
                <MenuItem value="30">30 days</MenuItem>
                <MenuItem value="45">45 days</MenuItem>
                <MenuItem value="60">60 days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Remarks / Notes"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit Quote
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderQuoteHistory = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Quote ID</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockHistory.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.quoteId}</TableCell>
              <TableCell>{entry.action}</TableCell>
              <TableCell>{entry.user}</TableCell>
              <TableCell>{entry.timestamp}</TableCell>
              <TableCell>{entry.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quote Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="primary">
                {stats.totalQuotes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Quotes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="warning.main">
                {stats.raisedQuotes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Raised Quotes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="600" color="info.main">
                {stats.historyCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                History Quotes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Quote List" />
          <Tab label="Raise New Quote" />
          <Tab label="Quote History" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && renderQuoteList()}
          {currentTab === 1 && renderRaiseQuoteForm()}
          {currentTab === 2 && renderQuoteHistory()}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Quote Details</DialogTitle>
        <DialogContent>
          {selectedQuote && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Quote ID:</Typography>
                <Typography>{selectedQuote.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Customer Name:</Typography>
                <Typography>{selectedQuote.customerName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Product/Plan:</Typography>
                <Typography>{selectedQuote.productPlan}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Quote Amount:</Typography>
                <Typography>{selectedQuote.quoteAmount}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Status:</Typography>
                <Chip
                  label={selectedQuote.status}
                  color={getStatusColor(selectedQuote.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Raised Date:</Typography>
                <Typography>{selectedQuote.raisedDate}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuoteManagement;