import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  useTheme,
  alpha,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as ScoringIcon,
  LocalFireDepartment as PriorityIcon,
  AccountTree as HierarchyIcon,
  Event as LeaveIcon,
} from '@mui/icons-material';

// Import the new components
import LeadScoringIndicator from '../components/leads/LeadScoringIndicator';
import PriorityIndicator from '../components/leads/PriorityIndicator';
import OrganizationHierarchy from '../components/organization/OrganizationHierarchy';
import LeaveManagementCalendar from '../components/leave/LeaveManagementCalendar';

const FeaturesShowcase = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          }}
        >
          <Typography variant="h3" fontWeight="700" gutterBottom>
            New Features Showcase
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Lead Scoring, Priority Indicators, Organization Hierarchy & Leave Management
          </Typography>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                py: 2,
              },
            }}
          >
            <Tab icon={<ScoringIcon />} iconPosition="start" label="Lead Scoring" />
            <Tab icon={<PriorityIcon />} iconPosition="start" label="Priority Indicators" />
            <Tab icon={<HierarchyIcon />} iconPosition="start" label="Organization Hierarchy" />
            <Tab icon={<LeaveIcon />} iconPosition="start" label="Leave Management" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box>
          {/* Tab 1: Lead Scoring */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                Lead Scoring Display & Indicators
              </Typography>

              <Grid container spacing={3}>
                {/* Compact View Examples */}
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        Compact Score Badges
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Hover over badges to see details
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <LeadScoringIndicator score={92} stage="Opportunity" showDetails={false} />
                        <LeadScoringIndicator score={75} stage="Enquiry" showDetails={false} />
                        <LeadScoringIndicator score={58} stage="Prospect" showDetails={false} />
                        <LeadScoringIndicator score={35} stage="Cold Lead" showDetails={false} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Detailed Views */}
                <Grid item xs={12} md={6}>
                  <LeadScoringIndicator score={85} stage="Opportunity - Hot Lead" showDetails={true} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LeadScoringIndicator score={45} stage="Prospect - Nurturing" showDetails={true} />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab 2: Priority Indicators */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                Priority Indicators (Hot, Warm, Cold Leads)
              </Typography>

              <Grid container spacing={3}>
                {/* Compact Badges */}
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        Compact Priority Badges
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <PriorityIndicator priority="Hot" compact={true} />
                        <PriorityIndicator priority="Warm" compact={true} />
                        <PriorityIndicator priority="Cold" compact={true} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Detailed Cards */}
                <Grid item xs={12} md={4}>
                  <PriorityIndicator priority="Hot" compact={false} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <PriorityIndicator priority="Warm" compact={false} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <PriorityIndicator priority="Cold" compact={false} />
                </Grid>

                {/* Stats Dashboard */}
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mt: 2, mb: 2 }}>
                    Priority Distribution Dashboard
                  </Typography>
                  <PriorityIndicator
                    showStats={true}
                    leadData={{
                      hotCount: 45,
                      warmCount: 128,
                      coldCount: 67,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab 3: Organization Hierarchy */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                Organization Hierarchy Tree View
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manager → Team Leaders → Customer Service Consultants (CSC)
              </Typography>
              <OrganizationHierarchy />
            </Box>
          )}

          {/* Tab 4: Leave Management */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                Leave Management Calendar
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage team leaves with auto-reassignment capabilities
              </Typography>
              <LeaveManagementCalendar />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesShowcase;
