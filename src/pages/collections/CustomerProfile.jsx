import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Chip, Button, IconButton, Alert, Card, CardContent,
  Stack, Avatar, Tooltip, TextField, Tabs, Tab, Paper, Divider, List, ListItem,
  ListItemText, ListItemIcon, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Edit as EditIcon, Phone as PhoneIcon,
  Email as EmailIcon, Person as PersonIcon, Business as BusinessIcon,
  CreditCard as CreditCardIcon, Home as HomeIcon, Work as WorkIcon,
  AccountBalance as AccountBalanceIcon, Timeline as TimelineIcon,
  Receipt as ReceiptIcon, MonetizationOn as MonetizationOnIcon,
  TrendingUp as TrendingUpIcon, Assessment as AssessmentIcon,
  Message as MessageIcon, Call as CallIcon, Save as SaveIcon,
  Cancel as CancelIcon, AttachMoney as AttachMoneyIcon,
  History as HistoryIcon, Description as DescriptionIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CustomerProfile = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock customer data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomerData({
        id: customerId || 'CUST-001',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91-98765-43210',
        alternatePhone: '+91-98765-43299',
        type: 'Individual',
        status: 'Active',

        // Personal Information
        dateOfBirth: '1985-05-15',
        gender: 'Male',
        maritalStatus: 'Married',
        nationality: 'Indian',

        // Address
        address: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',

        // Employment
        occupation: 'Software Engineer',
        employerName: 'Tech Solutions Pvt Ltd',
        employmentStatus: 'Employed',
        yearsEmployed: 8,
        annualIncome: 1200000,

        // Financial Information
        creditScore: 720,
        totalAccounts: 3,
        activeDebts: 1,
        totalDebtAmount: 12500,
        totalCreditLimit: 150000,
        utilization: 8.3,

        // Account Information
        joinDate: '2022-03-15',
        lastTransaction: '2025-01-15',
        customerSince: '2 years 10 months',

        // Accounts
        accounts: [
          {
            id: 'ACC-2024-001',
            type: 'Personal Loan',
            accountNumber: 'PL****1234',
            status: 'Active',
            balance: 12500,
            creditLimit: 50000,
            openDate: '2023-06-01',
            lastPayment: '2025-01-15',
            lastPaymentAmount: 5000
          },
          {
            id: 'ACC-2023-102',
            type: 'Credit Card',
            accountNumber: 'CC****5678',
            status: 'Active',
            balance: 0,
            creditLimit: 75000,
            openDate: '2022-03-15',
            lastPayment: '2025-01-10',
            lastPaymentAmount: 15000
          },
          {
            id: 'ACC-2024-205',
            type: 'Auto Loan',
            accountNumber: 'AL****9012',
            status: 'Closed',
            balance: 0,
            creditLimit: 250000,
            openDate: '2020-09-01',
            closeDate: '2024-09-01',
            lastPayment: '2024-09-01',
            lastPaymentAmount: 25000
          }
        ],

        // Transaction History
        transactions: [
          { date: '2025-01-15', type: 'Payment', account: 'PL****1234', amount: 5000, status: 'Completed', method: 'UPI' },
          { date: '2025-01-10', type: 'Payment', account: 'CC****5678', amount: 15000, status: 'Completed', method: 'Net Banking' },
          { date: '2024-12-15', type: 'Payment', account: 'PL****1234', amount: 5000, status: 'Completed', method: 'UPI' },
          { date: '2024-12-10', type: 'Payment', account: 'CC****5678', amount: 12000, status: 'Completed', method: 'Cheque' },
          { date: '2024-11-15', type: 'Disbursement', account: 'PL****1234', amount: -50000, status: 'Completed', method: 'Bank Transfer' }
        ],

        // Communication History
        communications: [
          { date: '2025-01-15', type: 'Call', subject: 'Payment Reminder', agent: 'Priya Patel', duration: '5:32', outcome: 'Payment committed' },
          { date: '2025-01-10', type: 'Email', subject: 'Monthly Statement', agent: 'System', status: 'Opened' },
          { date: '2025-01-05', type: 'SMS', subject: 'Payment Reminder', agent: 'System', status: 'Delivered' },
          { date: '2024-12-28', type: 'WhatsApp', subject: 'Account Update', agent: 'Rahul Kumar', status: 'Read' }
        ],

        // Documents
        documents: [
          { name: 'Aadhaar Card', type: 'Identity', uploadDate: '2022-03-15', status: 'Verified' },
          { name: 'PAN Card', type: 'Identity', uploadDate: '2022-03-15', status: 'Verified' },
          { name: 'Salary Slip', type: 'Income', uploadDate: '2024-12-01', status: 'Verified' },
          { name: 'Bank Statement', type: 'Financial', uploadDate: '2024-11-15', status: 'Verified' }
        ]
      });
      setLoading(false);
    }, 500);
  }, [customerId]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'success',
      'Inactive': 'default',
      'Closed': 'error'
    };
    return colors[status] || 'default';
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'success';
    if (score >= 650) return 'info';
    if (score >= 550) return 'warning';
    return 'error';
  };

  if (loading || !customerData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/collections/customer-database')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
              Customer Profile - {customerData.id}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={customerData.status}
                color={getStatusColor(customerData.status)}
                sx={{ fontWeight: 500 }}
              />
              <Chip
                label={customerData.type}
                icon={customerData.type === 'Business' ? <BusinessIcon /> : <PersonIcon />}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              <Typography variant="body2" color="text.secondary">
                Customer since: {customerData.joinDate}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <Tooltip title="Call Customer">
            <Button variant="outlined" startIcon={<PhoneIcon />}>
              Call
            </Button>
          </Tooltip>
          <Tooltip title="Send Message">
            <Button variant="outlined" startIcon={<MessageIcon />}>
              Message
            </Button>
          </Tooltip>
          <Tooltip title="Edit Profile">
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* Customer Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mr: 2 }}>
                    {customerData.type === 'Business' ? <BusinessIcon /> : customerData.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>{customerData.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{customerData.occupation}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center">
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">{customerData.phone}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">{customerData.email}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        {customerData.address}, {customerData.city}, {customerData.state} {customerData.zipCode}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">{customerData.employerName}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Credit Score
                  </Typography>
                  <Chip
                    label={customerData.creditScore}
                    color={getCreditScoreColor(customerData.creditScore)}
                    sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Accounts
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">{customerData.totalAccounts}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Debts
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={customerData.activeDebts > 0 ? 'error.main' : 'success.main'}>
                    {customerData.activeDebts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Debt
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    ₹{customerData.totalDebtAmount.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Credit Limit
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{customerData.totalCreditLimit.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Utilization
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {customerData.utilization}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Annual Income
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{customerData.annualIncome.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Accounts" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Transactions" icon={<ReceiptIcon />} iconPosition="start" />
          <Tab label="Communications" icon={<MessageIcon />} iconPosition="start" />
          <Tab label="Documents" icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label="Personal Info" icon={<PersonIcon />} iconPosition="start" />
        </Tabs>

        {/* Accounts Tab */}
        <TabPanel value={currentTab} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Credit Limit</TableCell>
                  <TableCell>Open Date</TableCell>
                  <TableCell>Last Payment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerData.accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>
                    <TableCell>{account.type}</TableCell>
                    <TableCell>{account.accountNumber}</TableCell>
                    <TableCell>
                      <Chip label={account.status} size="small" color={getStatusColor(account.status)} />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600} color={account.balance > 0 ? 'error.main' : 'success.main'}>
                        ₹{account.balance.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>₹{account.creditLimit.toLocaleString()}</TableCell>
                    <TableCell>{account.openDate}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{account.lastPayment}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{account.lastPaymentAmount?.toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Transactions Tab */}
        <TabPanel value={currentTab} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerData.transactions.map((txn, index) => (
                  <TableRow key={index}>
                    <TableCell>{txn.date}</TableCell>
                    <TableCell>{txn.type}</TableCell>
                    <TableCell>{txn.account}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600} color={txn.amount > 0 ? 'success.main' : 'error.main'}>
                        {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{txn.method}</TableCell>
                    <TableCell>
                      <Chip label={txn.status} size="small" color="success" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Communications Tab */}
        <TabPanel value={currentTab} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerData.communications.map((comm, index) => (
                  <TableRow key={index}>
                    <TableCell>{comm.date}</TableCell>
                    <TableCell>
                      <Chip label={comm.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{comm.subject}</TableCell>
                    <TableCell>{comm.agent}</TableCell>
                    <TableCell>
                      {comm.duration && `Duration: ${comm.duration}`}
                      {comm.outcome && ` - ${comm.outcome}`}
                      {comm.status && `Status: ${comm.status}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={currentTab} index={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerData.documents.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      <Chip label={doc.status} size="small" color="success" />
                    </TableCell>
                    <TableCell>
                      <Button size="small">View</Button>
                      <Button size="small">Download</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Personal Info Tab */}
        <TabPanel value={currentTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                      <Typography variant="body1">{customerData.dateOfBirth}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Gender</Typography>
                      <Typography variant="body1">{customerData.gender}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Marital Status</Typography>
                      <Typography variant="body1">{customerData.maritalStatus}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Nationality</Typography>
                      <Typography variant="body1">{customerData.nationality}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Employment Information</Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Occupation</Typography>
                      <Typography variant="body1">{customerData.occupation}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Employer</Typography>
                      <Typography variant="body1">{customerData.employerName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Employment Status</Typography>
                      <Typography variant="body1">{customerData.employmentStatus}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Years Employed</Typography>
                      <Typography variant="body1">{customerData.yearsEmployed} years</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default CustomerProfile;
