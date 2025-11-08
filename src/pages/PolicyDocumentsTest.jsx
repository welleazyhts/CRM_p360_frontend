import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import PreviousPolicyDocuments from '../components/common/PreviousPolicyDocuments';

const PolicyDocumentsTest = () => {
  // Test policies with the same structure as in documentService
  const testPolicies = [
    {
      id: 1,
      policyNumber: 'POL-2024-001',
      type: 'Health Insurance',
      status: 'Active'
    },
    {
      id: 2,
      policyNumber: 'POL-2023-458',
      type: 'Life Insurance',
      status: 'Active'
    },
    {
      id: 3,
      policyNumber: 'POL-2022-789',
      type: 'Vehicle Insurance',
      status: 'Expired'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Previous Policy Records - Test Page
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page demonstrates the Previous Policy Records Enhancement feature.
        Click on each policy below to expand and view related documents.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Test Policies with Document Records
        </Typography>
        
        {testPolicies.map((policy) => (
          <PreviousPolicyDocuments key={policy.id} policy={policy} />
        ))}
      </Paper>
      <Box sx={{ mt: 4, p: 3, bgcolor: 'info.light', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          How to Access in Main Application:
        </Typography>
        <Typography variant="body2">
          1. Go to Customer Management → Customer Database<br/>
          2. Click on any customer (ID: 1, 2, or CUST-1001)<br/>
          3. Navigate to the "Policies" tab<br/>
          4. Scroll down to "Previous Policy Records & Documents"<br/>
          5. Click on policy cards to expand and view documents
        </Typography>
      </Box>
    </Container>
  );
};

export default PolicyDocumentsTest;