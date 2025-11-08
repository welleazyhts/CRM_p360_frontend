import React from 'react';
import { Box, Typography, Alert, Paper } from '@mui/material';
import PreviousPolicyDocuments from './PreviousPolicyDocuments';

/**
 * Demo component to showcase the Previous Policy Records functionality
 * This can be used for testing and demonstration purposes
 */
const PolicyDocumentsDemo = () => {
  // Sample policies for demonstration
  const samplePolicies = [
    {
      id: 1,
      policyNumber: 'POL-2024-001',
      type: 'Health Insurance',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      premium: 15000,
      sumAssured: 500000
    },
    {
      id: 2,
      policyNumber: 'POL-2023-458',
      type: 'Life Insurance',
      status: 'Active',
      startDate: '2023-06-15',
      endDate: '2033-06-15',
      premium: 25000,
      sumAssured: 1000000
    },
    {
      id: 3,
      policyNumber: 'POL-2022-789',
      type: 'Vehicle Insurance',
      status: 'Expired',
      startDate: '2022-03-20',
      endDate: '2024-03-20',
      premium: 12000,
      sumAssured: 500000
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Previous Policy Records Demo
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This demo showcases the Previous Policy Record Enhancements feature. 
        Click on each policy to expand and view related documents including:
        Premium Certificates, Health Cards, Policy Documents, and Renewal Notices.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Customer Policies with Document Records
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Each policy below contains different types of documents. Expand to explore:
        </Typography>

        {samplePolicies.map((policy) => (
          <PreviousPolicyDocuments key={policy.id} policy={policy} />
        ))}
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Features Included:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>
            <Typography variant="body2">
              <strong>Premium Paid Certificates:</strong> Downloadable proof of premium payments with verification status
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Health Cards:</strong> Digital health cards for family members with QR codes and validity information
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Policy Documents:</strong> Master policy documents, schedules, and terms & conditions
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Renewal Notices:</strong> Renewal notifications with delivery status and communication channels
            </Typography>
          </li>
        </Box>
      </Box>
    </Box>
  );
};

export default PolicyDocumentsDemo;