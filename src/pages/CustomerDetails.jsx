import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid, Avatar,
  Chip, Divider, List, ListItem, ListItemIcon, ListItemText,
  Paper, Tab, Tabs, IconButton, useTheme, Fade
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Policy as PolicyIcon,
  DirectionsCar as VehicleIcon,
  Edit as EditIcon,
  AccountTree as FamilyTreeIcon
} from '@mui/icons-material';
import { useCustomerManagement } from '../context/CustomerManagementContext';
import FamilyRecordTree from '../components/customer/FamilyRecordTree';
import customers from '../mock/customerMocks';

const CustomerDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers: contextCustomers } = useCustomerManagement();
  const [customer, setCustomer] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Try to find customer in context first, then fallback to mock data
    let foundCustomer = contextCustomers.find(c => c.id.toString() === id);
    if (!foundCustomer) {
      foundCustomer = customers.find(c => c.id.toString() === id);
    }
    setCustomer(foundCustomer);
  }, [id, contextCustomers]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error';
  };

  const getPolicyStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  if (!customer) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Customer not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customer-management/customer-database')}
          sx={{ mt: 2 }}
        >
          Back to Customer Database
        </Button>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/customer-management/customer-database')}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              Customer Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete customer information and family records
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/customer-management/customer-database`)}
          >
            Edit Customer
          </Button>
        </Box>

        {/* Customer Overview Card */}
        <Card sx={{ mb: 3, border: `2px solid ${theme.palette.primary.main}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 80,
                  height: 80,
                  mr: 3,
                  fontSize: '2rem'
                }}
              >
                {customer.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight="600" gutterBottom>
                  {customer.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label="Primary Customer"
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={customer.status}
                    color={getStatusColor(customer.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Customer ID: {customer.id} • Registered: {new Date(customer.registrationDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={customer.email}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={customer.phone}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={`${customer.city}, ${customer.state}`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PersonIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Age & Gender"
                      secondary={`${customer.age} years, ${customer.gender}`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PolicyIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Policies"
                      secondary={`${customer.policies?.length || 0} active policies`}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <VehicleIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Vehicles"
                      secondary={`${customer.vehicles?.length || 0} registered vehicles`}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Personal Details" />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FamilyTreeIcon fontSize="small" />
                  Family Record Tree
                </Box>
              } 
            />
            <Tab label="Policies & Vehicles" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Age
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.age} years
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.gender}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Marital Status
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.maritalStatus || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Occupation
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.occupation || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Annual Income
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        ₹{customer.annualIncome?.toLocaleString() || 'Not specified'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.city}, {customer.state}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* KYC & Documents */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    KYC & Documents
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        KYC Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={customer.kycStatus || 'Pending'}
                          color={customer.kycStatus === 'Verified' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    {customer.kycDocuments && customer.kycDocuments.map((doc, index) => (
                      <Grid item xs={12} key={index}>
                        <Typography variant="caption" color="text.secondary">
                          {doc.type}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Typography variant="body2" fontWeight="500">
                            {doc.number}
                          </Typography>
                          <Chip
                            label={doc.verified ? 'Verified' : 'Pending'}
                            color={doc.verified ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Bank Details */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Bank Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {customer.bankDetails ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Bank Name
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {customer.bankDetails.bankName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Account Number
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {customer.bankDetails.accountNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          IFSC Code
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {customer.bankDetails.ifscCode}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Branch
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {customer.bankDetails.branch}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No bank details available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Medical Information */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Medical Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {customer.medicalHistory ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Blood Group
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {customer.medicalHistory.bloodGroup}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Last Checkup
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {new Date(customer.medicalHistory.lastCheckup).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Allergies
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {customer.medicalHistory.allergies}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Chronic Conditions
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {customer.medicalHistory.chronicConditions}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No medical information available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Customer Preferences */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Customer Profile
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Risk Profile
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={customer.riskProfile || 'Not assessed'}
                          color={customer.riskProfile === 'Low' ? 'success' : customer.riskProfile === 'Medium' ? 'warning' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Customer Segment
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={customer.customerSegment || 'Standard'}
                          color={customer.customerSegment === 'Premium' ? 'primary' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Loyalty Points
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.loyaltyPoints || 0} points
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Referral Code
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {customer.referralCode || 'Not assigned'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Registration Details */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Registration & Activity Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Registration Date
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {new Date(customer.registrationDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Last Contact
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {new Date(customer.lastContact).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Last Captured
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {new Date(customer.lastCapturedDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Customer Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={customer.status}
                          color={getStatusColor(customer.status)}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <FamilyRecordTree customer={customer} />
        )}

        {tabValue === 2 && (
          <Grid container spacing={3}>
            {/* Policies */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Insurance Policies ({customer.policies?.length || 0})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {customer.policies && customer.policies.length > 0 ? (
                    customer.policies.map((policy, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {policy.type}
                          </Typography>
                          <Chip
                            label={policy.status}
                            color={getPolicyStatusColor(policy.status)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Policy #: {policy.policyNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No policies found
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Vehicles */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Registered Vehicles ({customer.vehicles?.length || 0})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {customer.vehicles && customer.vehicles.length > 0 ? (
                    customer.vehicles.map((vehicle, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {vehicle.make} {vehicle.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          VIN: {vehicle.vin}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last Updated: {new Date(vehicle.lastUpdated).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No vehicles found
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Fade>
  );
};

export default CustomerDetails;