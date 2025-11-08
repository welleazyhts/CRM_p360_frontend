import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Chip, Divider, Button, useTheme
} from '@mui/material';
import FamilyRecordTree from '../components/common/FamilyRecordTree';
import { FamilyRestroom, History as HistoryIcon } from '@mui/icons-material';
import { useCustomerManagement } from '../context/CustomerManagementContext.jsx';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { customers } = useCustomerManagement();

  // Pick customer by id if provided otherwise fallback to first customer
  const customer = useMemo(() => {
    if (!customers || customers.length === 0) return null;
    if (id) return customers.find(c => String(c.id) === String(id)) || customers[0];
    return customers[0];
  }, [id, customers]);

  // Helper: compute latest date from an array of items using common date fields
  const getLatestDateFromItems = (items = [], fields = ['lastCapturedDate', 'lastUpdated', 'capturedAt', 'updatedAt', 'recordedAt']) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    let latest = null;
    items.forEach((it) => {
      for (const f of fields) {
        if (it && it[f]) {
          const d = new Date(it[f]);
          if (!isNaN(d)) {
            if (!latest || d > latest) latest = d;
          }
        }
      }
    });
    return latest ? latest.toISOString().split('T')[0] : null;
  };

  // Compute a "last captured" date for the overall customer (fallbacks)
  const lastCaptured = useMemo(() => {
    if (!customer) return '-';
    return customer.lastCapturedDate || customer.lastContact || customer.registrationDate || '-';
  }, [customer]);

  // Compute category-specific Last Captured Dates
  const vehicleLastCaptured = useMemo(() => {
    const fromCustomer = getLatestDateFromItems(customer.vehicles || []);
    return fromCustomer || customer.vehicleLastCaptured || '-';
  }, [customer]);

  const familyLastCaptured = useMemo(() => {
    const fromMembers = getLatestDateFromItems(customer.familyMembers || []);
    return fromMembers || customer.familyLastCaptured || '-';
  }, [customer]);

  const policyLastCaptured = useMemo(() => {
    const fromPolicies = getLatestDateFromItems(customer.policies || []);
    return fromPolicies || customer.policyLastCaptured || '-';
  }, [customer]);

  if (!customer) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No customer data available</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Please open a customer from the Customer Database.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/customer-management/customer-database')}>Open Customer Database</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={600}>Customer Profile</Typography>
          <Typography variant="body2" color="text.secondary">Profile summary and family tree</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">Last Captured</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="action" />
            <Typography variant="body2" fontWeight={600}>{lastCaptured}</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ width: 84, height: 84, bgcolor: theme.palette.primary.main, fontSize: '2rem' }}>{customer.name?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>{customer.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{customer.email} • {customer.phone}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip label={customer.status || 'Unknown'} color={customer.status === 'Active' ? 'success' : 'default'} />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">Registration Date</Typography>
                <Typography variant="body2">{customer.registrationDate || '-'}</Typography>

                <Typography variant="caption" color="text.secondary">Last Contact</Typography>
                <Typography variant="body2">{customer.lastContact || '-'}</Typography>

                <Typography variant="caption" color="text.secondary">Address</Typography>
                <Typography variant="body2">{customer.address ? `${customer.address}, ${customer.city || ''} ${customer.state || ''}` : '-'}</Typography>

                <Divider sx={{ my: 1 }} />

                {/* Category-level Last Captured Dates */}
                <Typography variant="subtitle2" sx={{ mt: 1 }}>Last Captured Dates</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Vehicle Information</Typography>
                    <Typography variant="body2" fontWeight={600}>{vehicleLastCaptured || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Family Details</Typography>
                    <Typography variant="body2" fontWeight={600}>{familyLastCaptured || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Policy Records</Typography>
                    <Typography variant="body2" fontWeight={600}>{policyLastCaptured || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FamilyRestroom color="action" />
                <Typography variant="h6" fontWeight={600}>Family Record Tree</Typography>
              </Box>

              <FamilyRecordTree
                customer={customer}
                onViewPolicy={(p) => {
                  const id = p?.policyNumber || p?.id || p;
                  navigate(`/cases?policy=${encodeURIComponent(id)}`);
                }}
                onViewVehicle={(v) => {
                  const vin = v?.vin || v?.id || '';
                  navigate(`/customer-management/customer-database?vehicle=${encodeURIComponent(vin)}`);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerProfile;
