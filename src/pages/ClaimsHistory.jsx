import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  ArrowBack as ArrowBackIcon,
  Gavel as ClaimIcon,
  DirectionsCar as CarIcon,
  Home as HomeIcon,
  LocalHospital as HealthIcon,
  Flight as TravelIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  HourglassEmpty as PendingIcon,
  Assignment as DocumentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`claims-tabpanel-${index}`}
      aria-labelledby={`claims-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ClaimsHistory = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Mock claims data
  const claimsData = {
    caseId: caseId,
    customerName: "Rajesh Kumar",
    totalClaims: 5,
    totalClaimAmount: 125000,
    approvedAmount: 98500,
    rejectedAmount: 26500,
    pendingAmount: 0,
    lastClaim: "2024-02-15T10:30:00Z",
    claims: [
      {
        id: 1,
        claimNumber: "CLM-2024-001234",
        type: "vehicle",
        category: "Accident",
        title: "Vehicle Collision Damage",
        description: "Front-end collision damage due to road accident. Airbags deployed, bumper and headlights damaged.",
        dateReported: "2024-02-15T10:30:00Z",
        dateOfIncident: "2024-02-14T18:45:00Z",
        status: "approved",
        priority: "high",
        claimAmount: 45000,
        approvedAmount: 42000,
        rejectedAmount: 3000,
        rejectionReason: "Betterment charges not covered",
        assignedAdjuster: "Priya Sharma",
        documents: ["police_report.pdf", "photos.zip", "estimate.pdf"],
        timeline: [
          { date: "2024-02-15T10:30:00Z", event: "Claim Reported", status: "info" },
          { date: "2024-02-16T14:00:00Z", event: "Initial Assessment", status: "info" },
          { date: "2024-02-18T09:00:00Z", event: "Site Inspection", status: "info" },
          { date: "2024-02-20T11:30:00Z", event: "Claim Approved", status: "success" },
          { date: "2024-02-22T16:00:00Z", event: "Payment Processed", status: "success" }
        ],
        starred: true
      },
      {
        id: 2,
        claimNumber: "CLM-2023-009876",
        type: "home",
        category: "Water Damage",
        title: "Plumbing Leak Water Damage",
        description: "Water damage to living room and bedroom due to burst pipe in bathroom. Flooring and furniture affected.",
        dateReported: "2023-11-20T08:15:00Z",
        dateOfIncident: "2023-11-19T22:30:00Z",
        status: "approved",
        priority: "medium",
        claimAmount: 35000,
        approvedAmount: 32000,
        rejectedAmount: 3000,
        rejectionReason: "Preventive maintenance not done",
        assignedAdjuster: "Amit Singh",
        documents: ["damage_photos.zip", "repair_estimate.pdf", "plumber_report.pdf"],
        timeline: [
          { date: "2023-11-20T08:15:00Z", event: "Claim Reported", status: "info" },
          { date: "2023-11-21T10:00:00Z", event: "Documentation Received", status: "info" },
          { date: "2023-11-23T14:30:00Z", event: "Assessment Completed", status: "info" },
          { date: "2023-11-25T09:45:00Z", event: "Claim Approved", status: "success" },
          { date: "2023-11-27T12:00:00Z", event: "Payment Released", status: "success" }
        ],
        starred: false
      },
      {
        id: 3,
        claimNumber: "CLM-2023-007654",
        type: "health",
        category: "Hospitalization",
        title: "Emergency Surgery",
        description: "Emergency appendectomy surgery with 3-day hospital stay. Pre-authorization obtained.",
        dateReported: "2023-08-10T06:00:00Z",
        dateOfIncident: "2023-08-09T20:00:00Z",
        status: "approved",
        priority: "high",
        claimAmount: 25000,
        approvedAmount: 24500,
        rejectedAmount: 500,
        rejectionReason: "Room upgrade charges",
        assignedAdjuster: "Dr. Sarah Johnson",
        documents: ["medical_reports.pdf", "hospital_bills.pdf", "discharge_summary.pdf"],
        timeline: [
          { date: "2023-08-10T06:00:00Z", event: "Claim Reported", status: "info" },
          { date: "2023-08-10T08:30:00Z", event: "Pre-authorization", status: "info" },
          { date: "2023-08-12T16:00:00Z", event: "Medical Review", status: "info" },
          { date: "2023-08-14T11:00:00Z", event: "Claim Approved", status: "success" },
          { date: "2023-08-16T14:30:00Z", event: "Settlement Completed", status: "success" }
        ],
        starred: true
      },
      {
        id: 4,
        claimNumber: "CLM-2023-005432",
        type: "travel",
        category: "Trip Cancellation",
        title: "Flight Cancellation",
        description: "International flight cancelled due to airline strike. Trip expenses and hotel bookings affected.",
        dateReported: "2023-06-05T12:00:00Z",
        dateOfIncident: "2023-06-04T16:00:00Z",
        status: "rejected",
        priority: "low",
        claimAmount: 15000,
        approvedAmount: 0,
        rejectedAmount: 15000,
        rejectionReason: "Airline strike not covered under policy terms",
        assignedAdjuster: "Ravi Patel",
        documents: ["flight_cancellation.pdf", "hotel_bookings.pdf", "policy_terms.pdf"],
        timeline: [
          { date: "2023-06-05T12:00:00Z", event: "Claim Reported", status: "info" },
          { date: "2023-06-06T09:00:00Z", event: "Documentation Review", status: "info" },
          { date: "2023-06-08T15:00:00Z", event: "Policy Terms Check", status: "warning" },
          { date: "2023-06-10T10:30:00Z", event: "Claim Rejected", status: "error" }
        ],
        starred: false
      },
      {
        id: 5,
        claimNumber: "CLM-2022-003210",
        type: "vehicle",
        category: "Theft",
        title: "Vehicle Theft",
        description: "Two-wheeler stolen from parking area. Police complaint filed. Vehicle recovered after 2 weeks.",
        dateReported: "2022-12-15T07:30:00Z",
        dateOfIncident: "2022-12-14T19:00:00Z",
        status: "approved",
        priority: "high",
        claimAmount: 5000,
        approvedAmount: 0,
        rejectedAmount: 0,
        rejectionReason: "Vehicle recovered, no loss incurred",
        assignedAdjuster: "Meera Gupta",
        documents: ["police_complaint.pdf", "vehicle_recovery.pdf", "inspection_report.pdf"],
        timeline: [
          { date: "2022-12-15T07:30:00Z", event: "Theft Reported", status: "error" },
          { date: "2022-12-16T10:00:00Z", event: "Police Verification", status: "info" },
          { date: "2022-12-28T14:00:00Z", event: "Vehicle Recovered", status: "success" },
          { date: "2022-12-30T11:00:00Z", event: "Claim Closed", status: "success" }
        ],
        starred: false
      }
    ],
    summary: {
      totalVehicleClaims: 2,
      totalHomeClaims: 1,
      totalHealthClaims: 1,
      totalTravelClaims: 1,
      averageProcessingTime: "8 days",
      approvalRate: "80%",
      customerSatisfaction: 4.1
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vehicle': return <CarIcon />;
      case 'home': return <HomeIcon />;
      case 'health': return <HealthIcon />;
      case 'travel': return <TravelIcon />;
      default: return <ClaimIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'vehicle': return 'primary';
      case 'home': return 'secondary';
      case 'health': return 'error';
      case 'travel': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <ApprovedIcon />;
      case 'rejected': return <RejectedIcon />;
      case 'pending': return <PendingIcon />;
      default: return <PendingIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getTimelineStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="600">
            Claims History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Case #{caseId} • {claimsData.customerName}
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {claimsData.totalClaims}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Claims
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                ₹{(claimsData.approvedAmount / 1000).toFixed(0)}K
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {claimsData.summary.averageProcessingTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Processing Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {claimsData.summary.approvalRate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approval Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Claims Breakdown */}
      <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
            Claims Breakdown by Type
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
                <CarIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{claimsData.summary.totalVehicleClaims}</Typography>
                <Typography variant="body2" color="text.secondary">Vehicle</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: 1 }}>
                <HomeIcon color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{claimsData.summary.totalHomeClaims}</Typography>
                <Typography variant="body2" color="text.secondary">Home</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 1 }}>
                <HealthIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{claimsData.summary.totalHealthClaims}</Typography>
                <Typography variant="body2" color="text.secondary">Health</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                <TravelIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">{claimsData.summary.totalTravelClaims}</Typography>
                <Typography variant="body2" color="text.secondary">Travel</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Claims History */}
      <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
            Detailed Claims History
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="All Claims" />
            <Tab label="Timeline View" />
            <Tab label="By Status" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <List>
              {claimsData.claims.map((claim, index) => (
                <React.Fragment key={claim.id}>
                  {index > 0 && <Divider />}
                  <ListItem alignItems="flex-start" sx={{ py: 3 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getTypeColor(claim.type)}.main`, width: 56, height: 56 }}>
                        {getTypeIcon(claim.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" fontWeight="600">
                            {claim.title}
                          </Typography>
                          <Chip 
                            label={claim.status} 
                            size="small" 
                            color={getStatusColor(claim.status)}
                            sx={{ borderRadius: 5 }}
                          />
                          <Chip 
                            label={claim.priority} 
                            size="small" 
                            color={getPriorityColor(claim.priority)}
                            variant="outlined"
                            sx={{ borderRadius: 5 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {claim.description}
                          </Typography>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="caption" color="text.secondary">Claim Number</Typography>
                              <Typography variant="body2" fontWeight="medium">{claim.claimNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="caption" color="text.secondary">Incident Date</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {new Date(claim.dateOfIncident).toLocaleDateString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="caption" color="text.secondary">Claim Amount</Typography>
                              <Typography variant="body2" fontWeight="medium" color="primary.main">
                                ₹{claim.claimAmount.toLocaleString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="caption" color="text.secondary">Approved Amount</Typography>
                              <Typography variant="body2" fontWeight="medium" color="success.main">
                                ₹{claim.approvedAmount.toLocaleString()}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Adjuster: {claim.assignedAdjuster}
                            </Typography>
                            {claim.documents && claim.documents.length > 0 && (
                              <Chip 
                                icon={<DownloadIcon />}
                                label={`${claim.documents.length} document(s)`}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 5 }}
                              />
                            )}
                          </Box>
                          {claim.rejectionReason && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 1 }}>
                              <Typography variant="caption" color="error.main" sx={{ fontWeight: 'medium' }}>
                                Rejection Reason: {claim.rejectionReason}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        onClick={() => {/* Handle star toggle */}}
                        color={claim.starred ? "warning" : "default"}
                      >
                        {claim.starred ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Timeline>
              {claimsData.claims.map((claim) => (
                <TimelineItem key={claim.id}>
                  <TimelineOppositeContent color="text.secondary">
                    {new Date(claim.dateReported).toLocaleDateString()}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getTypeColor(claim.type)}>
                      {getTypeIcon(claim.type)}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {claim.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {claim.category} • ₹{claim.claimAmount.toLocaleString()}
                    </Typography>
                    <Chip 
                      label={claim.status} 
                      size="small" 
                      color={getStatusColor(claim.status)}
                      sx={{ mt: 1, borderRadius: 5 }}
                    />
                    {/* Mini timeline for this claim */}
                    <Box sx={{ mt: 2, ml: 2 }}>
                      {claim.timeline.map((event, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              bgcolor: `${getTimelineStatusColor(event.status)}.main`,
                              mr: 1
                            }} 
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(event.date).toLocaleDateString()} - {event.event}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {['approved', 'rejected', 'pending'].map((status) => (
                <Grid item xs={12} md={4} key={status}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getStatusIcon(status)}
                        <Typography variant="h6" sx={{ ml: 1, textTransform: 'capitalize' }}>
                          {status} Claims
                        </Typography>
                      </Box>
                      <List dense>
                        {claimsData.claims
                          .filter(claim => claim.status === status)
                          .map((claim) => (
                            <ListItem key={claim.id}>
                              <ListItemText
                                primary={claim.title}
                                secondary={`${new Date(claim.dateReported).toLocaleDateString()} • ₹${claim.claimAmount.toLocaleString()}`}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClaimsHistory; 