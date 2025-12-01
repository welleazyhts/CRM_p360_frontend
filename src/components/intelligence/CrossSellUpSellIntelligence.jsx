import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Avatar,
  Stack
} from '@mui/material';
import {
  TrendingUp as UpSellIcon,
  TrendingFlat as CrossSellIcon,
  LocalHospital as HealthIcon,
  DirectionsCar as CarIcon,
  Person as LifeIcon,
  Security as AccidentIcon,
  Star as PremiumIcon,
  Group as FamilyIcon,
  Build as ServiceIcon,
  SupportAgent as AssistanceIcon,
  AttachMoney as MoneyIcon,
  Lightbulb as IntelligenceIcon
} from '@mui/icons-material';

const CrossSellUpSellIntelligence = ({ customer, onRecommendationSelect }) => {
  const theme = useTheme();
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Mock customer policies for demonstration
  const customerPolicies = [
    { type: 'Health Insurance', coverage: '₹2 lakh', premium: '₹12,000/year' },
    { type: 'Car Insurance', coverage: 'Comprehensive', premium: '₹8,500/year' }
  ];

  // Cross-sell recommendations based on existing policies
  const crossSellRecommendations = [
    {
      id: 1,
      type: 'cross-sell',
      title: 'Life Insurance Policy',
      description: 'Protect your family\'s financial future',
      reason: 'Customer has Health Insurance - Life Insurance is complementary',
      currentPolicy: 'Health Insurance',
      suggestedProduct: 'Term Life Insurance',
      coverage: '₹50 lakh',
      premium: '₹15,000/year',
      potentialRevenue: '₹15,000',
      confidence: 85,
      icon: <LifeIcon />,
      benefits: [
        'Financial security for family',
        'Tax benefits under 80C',
        'Affordable premium rates',
        'Easy claim process'
      ]
    },
    {
      id: 2,
      type: 'cross-sell',
      title: 'Accidental Coverage Plan',
      description: 'Additional protection against accidents',
      reason: 'Customer has Health Insurance - Accident coverage fills gaps',
      currentPolicy: 'Health Insurance',
      suggestedProduct: 'Personal Accident Insurance',
      coverage: '₹10 lakh',
      premium: '₹3,500/year',
      potentialRevenue: '₹3,500',
      confidence: 78,
      icon: <AccidentIcon />,
      benefits: [
        'Coverage for accidental injuries',
        'Disability benefits',
        'Low premium cost',
        'Quick claim settlement'
      ]
    },
    {
      id: 3,
      type: 'cross-sell',
      title: 'Roadside Assistance Plan',
      description: '24/7 emergency roadside support',
      reason: 'Customer has Car Insurance - Roadside assistance adds value',
      currentPolicy: 'Car Insurance',
      suggestedProduct: 'Premium Roadside Assistance',
      coverage: 'Unlimited calls',
      premium: '₹2,500/year',
      potentialRevenue: '₹2,500',
      confidence: 72,
      icon: <AssistanceIcon />,
      benefits: [
        '24/7 emergency support',
        'Towing services',
        'Battery jump-start',
        'Flat tire assistance'
      ]
    }
  ];

  // Up-sell recommendations for better versions
  const upSellRecommendations = [
    {
      id: 4,
      type: 'up-sell',
      title: 'Premium Health Policy',
      description: 'Upgrade to higher coverage with better benefits',
      reason: 'Current Basic Health Policy (₹2 lakh) can be upgraded',
      currentPolicy: 'Basic Health Insurance (₹2 lakh)',
      suggestedProduct: 'Premium Health Insurance (₹5 lakh)',
      coverage: '₹5 lakh',
      premium: '₹22,000/year',
      additionalRevenue: '₹10,000',
      potentialRevenue: '₹22,000',
      confidence: 90,
      icon: <PremiumIcon />,
      benefits: [
        'Higher coverage amount',
        'Pre and post hospitalization',
        'Day care procedures',
        'No claim bonus protection'
      ]
    },
    {
      id: 5,
      type: 'up-sell',
      title: 'Family Floater Plan',
      description: 'Extend coverage to entire family',
      reason: 'Individual policy can be upgraded to family coverage',
      currentPolicy: 'Individual Health Insurance',
      suggestedProduct: 'Family Floater Health Insurance',
      coverage: '₹10 lakh (Family)',
      premium: '₹35,000/year',
      additionalRevenue: '₹23,000',
      potentialRevenue: '₹35,000',
      confidence: 88,
      icon: <FamilyIcon />,
      benefits: [
        'Covers entire family',
        'Shared sum insured',
        'Cost-effective solution',
        'Maternity benefits included'
      ]
    }
  ];

  const allRecommendations = [...crossSellRecommendations, ...upSellRecommendations];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return theme.palette.success.main;
    if (confidence >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getTypeColor = (type) => {
    return type === 'cross-sell' ? theme.palette.info.main : theme.palette.secondary.main;
  };

  const handleViewDetails = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setDetailsOpen(true);
  };

  const handleSelectRecommendation = (recommendation) => {
    if (onRecommendationSelect) {
      onRecommendationSelect(recommendation);
    }
    setDetailsOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          <IntelligenceIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="600">
            Cross-Sell / Up-Sell Intelligence
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered product recommendations based on customer profile
          </Typography>
        </Box>
      </Box>

      {/* Current Policies */}
      <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Current Policies
          </Typography>
          <Grid container spacing={2}>
            {customerPolicies.map((policy, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{
                  p: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper
                }}>
                  <Typography variant="body2" fontWeight="600">
                    {policy.type}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Coverage: {policy.coverage} | Premium: {policy.premium}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Grid container spacing={3}>
        {allRecommendations.map((recommendation) => (
          <Grid item xs={12} md={6} key={recommendation.id}>
            <Card sx={{
              height: '100%',
              border: `2px solid ${alpha(getTypeColor(recommendation.type), 0.2)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                borderColor: getTypeColor(recommendation.type)
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Avatar sx={{
                    bgcolor: alpha(getTypeColor(recommendation.type), 0.1),
                    color: getTypeColor(recommendation.type)
                  }}>
                    {recommendation.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        icon={recommendation.type === 'cross-sell' ? <CrossSellIcon /> : <UpSellIcon />}
                        label={recommendation.type === 'cross-sell' ? 'Cross-Sell' : 'Up-Sell'}
                        size="small"
                        sx={{
                          bgcolor: alpha(getTypeColor(recommendation.type), 0.1),
                          color: getTypeColor(recommendation.type)
                        }}
                      />
                      <Chip
                        label={`${recommendation.confidence}% Match`}
                        size="small"
                        sx={{
                          bgcolor: alpha(getConfidenceColor(recommendation.confidence), 0.1),
                          color: getConfidenceColor(recommendation.confidence)
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {recommendation.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {recommendation.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Details */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Recommendation Reason:
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                    {recommendation.reason}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Coverage
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {recommendation.coverage}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Premium
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        {recommendation.premium}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Revenue Impact */}
                <Box sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  borderRadius: 2,
                  mb: 3
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="600" color="success.main">
                      Revenue Impact: {recommendation.potentialRevenue}
                      {recommendation.additionalRevenue && ` (+${recommendation.additionalRevenue})`}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(recommendation)}
                    sx={{ flex: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSelectRecommendation(recommendation)}
                    sx={{ flex: 1 }}
                  >
                    Recommend
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedRecommendation?.icon}
            <Box>
              <Typography variant="h6" fontWeight="600">
                {selectedRecommendation?.title}
              </Typography>
              <Chip
                label={selectedRecommendation?.type === 'cross-sell' ? 'Cross-Sell Opportunity' : 'Up-Sell Opportunity'}
                size="small"
                color={selectedRecommendation?.type === 'cross-sell' ? 'info' : 'secondary'}
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Product Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Current Policy"
                    secondary={selectedRecommendation?.currentPolicy}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Suggested Product"
                    secondary={selectedRecommendation?.suggestedProduct}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Coverage"
                    secondary={selectedRecommendation?.coverage}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Premium"
                    secondary={selectedRecommendation?.premium}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Key Benefits
              </Typography>
              <List dense>
                {selectedRecommendation?.benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Chip label="✓" size="small" color="success" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box sx={{
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            borderRadius: 2
          }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              AI Recommendation Reason
            </Typography>
            <Typography variant="body2">
              {selectedRecommendation?.reason}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSelectRecommendation(selectedRecommendation)}
          >
            Proceed with Recommendation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CrossSellUpSellIntelligence;