import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography,
  Card, 
  CardContent, 
  TextField,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  InputAdornment,
  Avatar,
  Tab,
  Tabs,
  Stack,
  useTheme,
  alpha,
  Fade,
  Grow,
} from '@mui/material';

import { 
  Search as SearchIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Autorenew as AutorenewIcon,
  Create as CreateIcon,
  Policy as PolicyIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedUserIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  AccessTime as AccessTimeIcon,
  Payments as PaymentsIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  MailOutline as MailOutlineIcon,
  WhatsApp as WhatsAppIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  Sms as SmsIcon,
  SmartToy as SmartToyIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  DirectionsCar as DirectionsCarIcon,
  TwoWheeler as TwoWheelerIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  LocalHospital as LocalHospitalIcon,
  Security as SecurityIcon,
  Apartment as ApartmentIcon,
  Villa as VillaIcon,
  LocationOn as LocationOnIcon,
  MonetizationOn as MonetizationOnIcon,
  Psychology as PsychologyIcon,
  Recommend as RecommendIcon,
  Assessment as AssessmentIcon,
  HealthAndSafety as HealthAndSafetyIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const PolicyTimeline = () => {
  const location = useLocation();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [aiSummary, setAiSummary] = useState(null);
  
  // Extract customer data from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const customerNameFromUrl = queryParams.get('customerName');
  const customerIdFromUrl = queryParams.get('customerId');

  // Sample policy timeline data - wrapped in useMemo to prevent re-creation on every render
  const mockPolicyData = useMemo(() => ({
    customerId: customerIdFromUrl || "CUST-12345",
    customerName: customerNameFromUrl || "Arjun Sharma",
    // Enhanced Customer Profile
    customerProfile: {
      annualIncome: {
        amount: 1250000,
        currency: 'INR',
        dateCaptured: '2024-01-15',
        source: 'Self-declared',
        lastUpdated: '2024-01-15'
      },
      demographics: {
        age: 34,
        gender: 'Male',
        maritalStatus: 'Married',
        dependents: 2,
        occupation: 'Software Engineer',
        employer: 'Tech Solutions Pvt Ltd'
      },
      location: {
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        residentialArea: 'Koregaon Park',
        areaRating: 'good', // good, average, low
        coordinates: { lat: 18.5204, lng: 73.8567 }
      },
      residence: {
        ownership: 'owned', // owned, rented
        type: 'apartment', // villa, apartment, independent_house, row_house
        builtUpArea: 1200,
        ageOfProperty: 8,
        securityFeatures: ['CCTV', 'Security Guard', 'Gated Community'],
        parkingType: 'Covered'
      },
      vehicles: [
        {
          type: 'Car',
          make: 'Honda',
          model: 'City',
          year: 2020,
          registrationNumber: 'MH12AB1234',
          fuelType: 'Petrol',
          cc: 1498,
          currentValue: 850000
        },
        {
          type: 'Two Wheeler',
          make: 'Honda',
          model: 'Activa 6G',
          year: 2022,
          registrationNumber: 'MH12CD5678',
          fuelType: 'Petrol',
          cc: 109,
          currentValue: 75000
        }
      ],
      riskProfile: {
        category: 'medium', // safe, medium, high
        riskTolerance: 6, // Scale of 1-10
        investmentHorizon: 'long_term', // short_term, medium_term, long_term
        previousClaims: 1,
        drivingRecord: 'clean',
        healthConditions: 'minor', // none, minor, major
        lifestyle: 'active' // sedentary, moderate, active
      },
      policyPreferences: {
        preferredTypes: ['Term Life', 'Health Insurance', 'Motor Insurance'],
        avoidedTypes: ['ULIP'],
        preferredPremiumFrequency: 'annual',
        maxBudget: 150000,
        priorityFeatures: ['High Coverage', 'Quick Claim Settlement', 'Cashless Benefits']
      },
      familyHistory: {
        medicalHistory: {
          diabetes: { present: true, relation: 'Father', ageOfOnset: 55 },
          heartDisease: { present: false, relation: null, ageOfOnset: null },
          cancer: { present: false, relation: null, ageOfOnset: null },
          hypertension: { present: true, relation: 'Mother', ageOfOnset: 48 }
        },
        lifeExpectancy: 78,
        geneticRiskFactors: ['Type 2 Diabetes', 'Hypertension']
      },
      otherPolicies: [
        {
          policyNumber: 'EXT-HDFC-789',
          policyType: 'Home Loan Insurance',
          provider: 'HDFC Life',
          source: 'Bank Channel',
          premium: 25000,
          coverage: 5000000,
          startDate: '2019-03-15',
          status: 'Active'
        },
        {
          policyNumber: 'EXT-ICICI-456',
          policyType: 'Personal Accident',
          provider: 'ICICI Lombard',
          source: 'Online Portal',
          premium: 3500,
          coverage: 500000,
          startDate: '2021-07-20',
          status: 'Active'
        }
      ],
      policyCapacity: {
        maxRecommended: 8,
        currentlyHeld: 4,
        utilizationPercentage: 50,
        availableCapacity: 4,
        recommendedNextPolicy: 'Critical Illness'
      }
    },
    policies: [
      {
        policyId: "POL-VEHICLE-987",
        policyType: "Vehicle Insurance",
        currentPremium: 1250.00,
        startDate: "2018-06-15",
        events: [
          {
            id: "ev-001",
            date: "2018-06-15",
            type: "policy_created",
            title: "Policy Created",
            description: "Vehicle insurance policy initiated with basic coverage",
            details: {
              premium: 980.00,
              coverage: "Basic coverage with ₹25,000 deductible",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-002",
            date: "2019-05-30",
            type: "renewal",
            title: "Coverage Update",
            description: "Added comprehensive coverage to the policy",
            details: {
              premium: 1120.00,
              coverage: "Comprehensive coverage with ₹15,000 deductible",
              agent: "Rajesh Kumar"
            }
          },
          {
            id: "ev-003",
            date: "2020-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with 5% loyalty discount",
            details: {
              premium: 1064.00,
              coverage: "Comprehensive coverage with ₹15,000 deductible",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-004",
            date: "2021-03-22",
            type: "claim",
            title: "Claim Filed",
            description: "Claim filed for minor accident - dent repair",
            details: {
              claimAmount: 1200.00,
              status: "Approved",
              deductible: 15000.00,
              handledBy: "Ananya Reddy"
            }
          },
          {
            id: "ev-005",
            date: "2021-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with adjusted premium after claim",
            details: {
              premium: 1150.00,
              coverage: "Comprehensive coverage with ₹15,000 deductible",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-006",
            date: "2022-01-10",
            type: "payment",
            title: "Payment Method Updated",
            description: "Switched to quarterly payment schedule",
            details: {
              method: "Auto-debit",
              schedule: "Quarterly",
              nextPayment: "2022-04-10"
            }
          },
          {
            id: "ev-007",
            date: "2022-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with added roadside assistance",
            details: {
              premium: 1195.00,
              coverage: "Comprehensive coverage with roadside assistance",
              agent: "Amit Shah"
            }
          },
          {
            id: "ev-008",
            date: "2023-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with multi-policy discount",
            details: {
              premium: 1135.00,
              discount: "5% multi-policy discount applied",
              coverage: "Comprehensive coverage with roadside assistance",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-009",
            date: "2023-10-05",
            type: "communication",
            title: "Coverage Review",
            description: "Scheduled call to review current coverage options",
            details: {
              agent: "Priya Patel",
              outcome: "No changes requested by customer",
              followUp: "Annual review scheduled for same time next year"
            }
          },
          {
            id: "ev-010",
            date: "2024-06-15",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with loyalty discount",
            details: {
              premium: 1250.00,
              coverage: "Comprehensive coverage with roadside assistance and rental car service",
              agent: "Priya Patel"
            }
          }
        ]
      },
      {
        policyId: "POL-LIFE-456",
        policyType: "Life Insurance",
        currentPremium: 950.00,
        startDate: "2020-09-22",
        events: [
          {
            id: "ev-101",
            date: "2020-09-22",
            type: "policy_created",
            title: "Policy Created",
            description: "Life insurance policy initiated with standard coverage",
            details: {
              premium: 850.00,
              coverage: "Standard Life coverage with ₹50,000 deductible",
              agent: "Rajesh Kumar"
            }
          },
          {
            id: "ev-102",
            date: "2021-08-15",
            type: "modification",
            title: "Coverage Update",
            description: "Added critical illness coverage",
            details: {
              premium: 925.00,
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Ananya Reddy"
            }
          },
          {
            id: "ev-103",
            date: "2021-09-22",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with bundle discount",
            details: {
              premium: 879.00,
              discount: "5% bundle discount with Vehicle policy",
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Rajesh Kumar"
            }
          },
          {
            id: "ev-104",
            date: "2022-09-22",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with loyalty discount",
            details: {
              premium: 850.00,
              discount: "Added 3% loyalty discount",
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Priya Patel"
            }
          },
          {
            id: "ev-105",
            date: "2023-04-18",
            type: "claim",
            title: "Claim Filed",
            description: "Claim filed for critical illness coverage",
            details: {
              claimAmount: 3200.00,
              status: "Approved",
              deductible: 50000.00,
              handledBy: "Amit Shah"
            }
          },
          {
            id: "ev-106",
            date: "2023-09-22",
            type: "renewal",
            title: "Policy Renewed",
            description: "Annual policy renewal with premium adjustment after claim",
            details: {
              premium: 950.00,
              coverage: "Enhanced coverage with critical illness protection",
              agent: "Ananya Reddy"
            }
          }
        ]
      }
    ]
  }), [customerIdFromUrl, customerNameFromUrl]);

  useEffect(() => {
    // This would be replaced with actual API call in a real app
    const fetchPolicyData = async () => {
      try {
        // In a real app, you would fetch data based on customerIdFromUrl
        // For example: const response = await api.getPolicyData(customerIdFromUrl);
        
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use the customer data from URL if available
        const policyDataToUse = {
          ...mockPolicyData,
          customerId: customerIdFromUrl || mockPolicyData.customerId,
          customerName: customerNameFromUrl || mockPolicyData.customerName
        };
        
        setPolicyData(policyDataToUse);
        setLoading(false);
        // Set loaded state for animations after a brief delay
        setTimeout(() => {
          setLoaded(true);
        }, 100);
      } catch (err) {
        setError("Failed to load policy data");
        setLoading(false);
      }
    };
    
    fetchPolicyData();
  }, [customerIdFromUrl, customerNameFromUrl, mockPolicyData]);

  // Fix tab indicator alignment on mount
  useEffect(() => {
    if (policyData && policyData.policies && policyData.policies.length > 0) {
      // Force tab indicator recalculation after component mounts
      const timer = setTimeout(() => {
        // Trigger a window resize event to force tabs to recalculate
        window.dispatchEvent(new Event('resize'));
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [policyData]);

  useEffect(() => {
    if (policyData) {
      const totalPolicies = policyData.policies.length;
      const eventTypeCounts = {};
      let earliestStartDate = new Date(); // Initialize with a future date

      policyData.policies.forEach(policy => {
        if (new Date(policy.startDate) < earliestStartDate) {
          earliestStartDate = new Date(policy.startDate);
        }
        policy.events.forEach(event => {
          eventTypeCounts[event.type] = (eventTypeCounts[event.type] || 0) + 1;
        });
      });

      const customerTenureYears = Math.floor((new Date() - earliestStartDate) / (365.25 * 24 * 60 * 60 * 1000));



      // AI Summary Generation (Simulated)
      const numClaims = eventTypeCounts.claim || 0;
      let claimLikelihood = "Low";
      if (numClaims > 2) claimLikelihood = "High";
      else if (numClaims > 0) claimLikelihood = "Moderate";

      let customerProfile = "Good";
      if (customerTenureYears > 5 && totalPolicies >= 2 && numClaims <= 1) {
        customerProfile = "Excellent";
      } else if (customerTenureYears >= 2 && numClaims < 3) {
        customerProfile = "Good";
      } else {
        customerProfile = "Average";
      }

      const observations = [
        `Customer has been with us for ${customerTenureYears} years across ${totalPolicies} policies.`,
      ];
      if (numClaims > 0) {
        observations.push(`They have filed ${numClaims} claim(s) in total.`);
      }
      if (eventTypeCounts.renewal > 0) {
        observations.push(`Regular renewals indicate high retention.`);
      }
      if (eventTypeCounts.communication > 0) {
        observations.push(`Engaged customer with ${eventTypeCounts.communication} communication events.`);
      }
      if (eventTypeCounts.payment > 0) {
        observations.push(`There are ${eventTypeCounts.payment} payment-related events recorded.`);
      }

      // AI Policy Recommendations based on customer profile
      const generatePolicyRecommendations = () => {
        const profile = policyData.customerProfile;
        const recommendations = [];

        // Income-based recommendations
        if (profile.annualIncome.amount > 1000000) {
          if (!policyData.policies.find(p => p.policyType.includes('Critical Illness'))) {
            recommendations.push({
              type: 'Critical Illness Insurance',
              priority: 'High',
              reason: 'High income bracket - should protect against critical illness',
              suggestedCoverage: profile.annualIncome.amount * 5,
              estimatedPremium: profile.annualIncome.amount * 0.015
            });
          }
        }

        // Family history-based recommendations
        if (profile.familyHistory.medicalHistory.diabetes.present || profile.familyHistory.medicalHistory.hypertension.present) {
          if (!policyData.policies.find(p => p.policyType.includes('Health'))) {
            recommendations.push({
              type: 'Comprehensive Health Insurance',
              priority: 'Critical',
              reason: 'Family history of diabetes and hypertension requires comprehensive health coverage',
              suggestedCoverage: 1000000,
              estimatedPremium: 35000
            });
          }
        }

        // Vehicle-based recommendations
        if (profile.vehicles.length > 0 && !policyData.policies.find(p => p.policyType.includes('Vehicle'))) {
          recommendations.push({
            type: 'Motor Insurance',
            priority: 'High',
            reason: 'Vehicle ownership requires mandatory motor insurance',
            suggestedCoverage: profile.vehicles.reduce((sum, v) => sum + v.currentValue, 0),
            estimatedPremium: 15000
          });
        }

        // Home-based recommendations
        if (profile.residence.ownership === 'owned' && !policyData.policies.find(p => p.policyType.includes('Home'))) {
          recommendations.push({
            type: 'Home Insurance',
            priority: 'Medium',
            reason: 'Property ownership in good area requires home insurance protection',
            suggestedCoverage: profile.residence.builtUpArea * 3000,
            estimatedPremium: 8000
          });
        }

        // Risk profile-based recommendations
        if (profile.riskProfile.category === 'safe' && profile.riskProfile.investmentHorizon === 'long_term') {
          if (profile.policyPreferences.avoidedTypes.includes('ULIP')) {
            recommendations.push({
              type: 'Term Life Insurance',
              priority: 'High',
              reason: 'Conservative investor profile - term life provides maximum coverage at lowest cost',
              suggestedCoverage: profile.annualIncome.amount * 10,
              estimatedPremium: profile.annualIncome.amount * 0.008
            });
          }
        }

        // Age and dependents-based recommendations
        if (profile.demographics.dependents > 0 && profile.demographics.age < 40) {
          if (!policyData.policies.find(p => p.policyType.includes('Child'))) {
            recommendations.push({
              type: 'Child Education Plan',
              priority: 'Medium',
              reason: 'Young parent with dependents should secure children\'s education future',
              suggestedCoverage: 2000000,
              estimatedPremium: 50000
            });
          }
        }

        return recommendations.slice(0, 3); // Top 3 recommendations
      };

      const policyRecommendations = generatePolicyRecommendations();

      setAiSummary({
        claimLikelihood,
        customerProfile,
        observations: observations.join(" "),
        policyRecommendations
      });
    }
  }, [policyData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  

  
  const handleFilterTypeChange = (type) => {
    setFilterType(type);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getEventIcon = (type) => {
    switch (type) {
      case 'policy_created':
        return <CreateIcon />;
      case 'renewal':
        return <AutorenewIcon />;
      case 'modification':
        return <DescriptionIcon />;
      case 'claim':
        return <WarningIcon />;
      case 'payment':
        return <PaymentIcon />;
      case 'communication':
        return <PhoneIcon />;
      default:
        return <InfoIcon />;
    }
  };



  const getBrandColor = (type) => {
    switch (type) {
      case 'policy_created': return theme.palette.primary.main;
      case 'payment': return theme.palette.success.main;
      case 'renewal': return theme.palette.warning.main;
      case 'claim': return theme.palette.error.main;
      case 'communication': return theme.palette.info.main;
      case 'document': return theme.palette.secondary.main;
      default: return theme.palette.primary.main;
    }
  };

  const getEventLabel = (type) => {
    switch (type) {
      case 'policy_created': return 'Policy Created';
      case 'payment': return 'Payment';
      case 'renewal': return 'Renewal';
      case 'claim': return 'Claim';
      case 'communication': return 'Communication';
      case 'document': return 'Document';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get currently selected policy based on tab
  const getCurrentPolicy = () => {
    if (!policyData || !policyData.policies || policyData.policies.length === 0) {
      return null;
    }
    return policyData.policies[tabValue];
  };
  
  // Filter events based on filterType
  const getFilteredEvents = () => {
    const currentPolicy = getCurrentPolicy();
    if (!currentPolicy || !currentPolicy.events) return [];
    
    return currentPolicy.events
      .filter(event => filterType === 'all' || event.type === filterType)
      .filter(event => !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));  // Sort by date descending
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h5">Loading policy data...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h5" color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ borderRadius: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }
  
  const currentPolicy = getCurrentPolicy();
  const filteredEvents = getFilteredEvents();

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600">
            Policy Timeline
          </Typography>
          

        </Box>
        
        {/* Customer Information */}
        <Grow in={loaded} timeout={400}>
          <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    width: 60, 
                    height: 60,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    mr: 2 
                  }}
                >
                  {policyData?.customerName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    {policyData?.customerName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer ID: {policyData?.customerId}
                  </Typography>
                </Box>
              </Box>
              
              {/* Policy Tabs */}
              <Box sx={{ mt: 3 }}>
                <Tabs 
                  key={`tabs-${policyData?.policies?.length || 0}`}
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    '& .MuiTab-root': {
                      fontWeight: 500,
                      borderRadius: '8px 8px 0 0',
                      minHeight: 48,
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    },
                    '& .Mui-selected': {
                      fontWeight: 600,
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                      transition: 'all 0.3s ease',
                    }
                  }}
                >
                  {policyData?.policies.map((policy, _index) => (
                    <Tab 
                      key={policy.policyId} 
                      label={
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: 1,
                          width: '100%'
                        }}>
                          <PolicyIcon fontSize="small" />
                          <Typography component="span" sx={{ display: { xs: 'none', sm: 'inline' }}}>
                            {policy.policyType}
                          </Typography>
                          <Typography component="span" sx={{ display: { xs: 'inline', sm: 'none' }}}>
                            {policy.policyType.split(' ')[0]}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </Tabs>
              </Box>
            </CardContent>
          </Card>
        </Grow>
        
        {/* Enhanced Customer Profile */}
        {policyData?.customerProfile && (
          <Grow in={loaded} timeout={600}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Financial Profile */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MonetizationOnIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                      <Typography variant="h6" fontWeight="600">Financial Profile</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Annual Income</Typography>
                      <Typography variant="h5" fontWeight="600" color="success.main">
                        ₹{policyData.customerProfile.annualIncome.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Captured on {formatDate(policyData.customerProfile.annualIncome.dateCaptured)} 
                        • {policyData.customerProfile.annualIncome.source}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Policy Capacity Utilization</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ flex: 1, bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                          <Box 
                            sx={{ 
                              width: `${policyData.customerProfile.policyCapacity.utilizationPercentage}%`,
                              height: '100%',
                              bgcolor: 'primary.main',
                              borderRadius: 1
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="600">
                          {policyData.customerProfile.policyCapacity.utilizationPercentage}%
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {policyData.customerProfile.policyCapacity.currentlyHeld} of {policyData.customerProfile.policyCapacity.maxRecommended} recommended policies
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Risk Profile</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {policyData.customerProfile.riskProfile.category === 'safe' && <TrendingDownIcon color="success" />}
                        {policyData.customerProfile.riskProfile.category === 'medium' && <TrendingFlatIcon color="warning" />}
                        {policyData.customerProfile.riskProfile.category === 'high' && <TrendingUpIcon color="error" />}
                        <Chip 
                          label={`${policyData.customerProfile.riskProfile.category.charAt(0).toUpperCase() + policyData.customerProfile.riskProfile.category.slice(1)} Risk`}
                          color={
                            policyData.customerProfile.riskProfile.category === 'safe' ? 'success' : 
                            policyData.customerProfile.riskProfile.category === 'medium' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          Tolerance: {policyData.customerProfile.riskProfile.riskTolerance}/10
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Location & Assets */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                      <Typography variant="h6" fontWeight="600">Location & Assets</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {/* Location */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Residence</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {policyData.customerProfile.residence.type === 'apartment' && <ApartmentIcon color="primary" />}
                        {policyData.customerProfile.residence.type === 'villa' && <VillaIcon color="primary" />}
                        <Typography variant="body1" fontWeight="500">
                          {policyData.customerProfile.residence.type.charAt(0).toUpperCase() + policyData.customerProfile.residence.type.slice(1)} 
                          ({policyData.customerProfile.residence.ownership === 'owned' ? 'Owned' : 'Rented'})
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {policyData.customerProfile.location.residentialArea}, {policyData.customerProfile.location.city}
                      </Typography>
                      <Chip 
                        label={`${policyData.customerProfile.location.areaRating.charAt(0).toUpperCase() + policyData.customerProfile.location.areaRating.slice(1)} Area`}
                        color={
                          policyData.customerProfile.location.areaRating === 'good' ? 'success' : 
                          policyData.customerProfile.location.areaRating === 'average' ? 'warning' : 'error'
                        }
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>

                    {/* Vehicles */}
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Vehicles Owned</Typography>
                      {policyData.customerProfile.vehicles.map((vehicle, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {vehicle.type === 'Car' && <DirectionsCarIcon color="primary" />}
                          {vehicle.type === 'Two Wheeler' && <TwoWheelerIcon color="secondary" />}
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Value: ₹{vehicle.currentValue.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Policy Preferences */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssessmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight="600">Policy Preferences</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Preferred Policy Types</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {policyData.customerProfile.policyPreferences.preferredTypes.map((type, index) => (
                          <Chip key={index} label={type} color="success" size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Avoided Types</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {policyData.customerProfile.policyPreferences.avoidedTypes.map((type, index) => (
                          <Chip key={index} label={type} color="error" size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">Max Budget</Typography>
                      <Typography variant="h6" fontWeight="600" color="primary.main">
                        ₹{policyData.customerProfile.policyPreferences.maxBudget.toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Family History */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <HealthAndSafetyIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                      <Typography variant="h6" fontWeight="600">Family Medical History</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Medical Conditions</Typography>
                      {Object.entries(policyData.customerProfile.familyHistory.medicalHistory).map(([condition, data]) => (
                        <Box key={condition} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocalHospitalIcon 
                            color={data.present ? 'error' : 'disabled'} 
                            sx={{ fontSize: 16 }} 
                          />
                          <Typography variant="body2" fontWeight="500">
                            {condition.charAt(0).toUpperCase() + condition.slice(1).replace(/([A-Z])/g, ' $1')}
                          </Typography>
                          {data.present ? (
                            <Chip 
                              label={`${data.relation} (Age ${data.ageOfOnset})`} 
                              color="error" 
                              size="small" 
                              variant="outlined" 
                            />
                          ) : (
                            <Chip label="Not Present" color="success" size="small" variant="outlined" />
                          )}
                        </Box>
                      ))}
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">Life Expectancy</Typography>
                      <Typography variant="h6" fontWeight="600" color="info.main">
                        {policyData.customerProfile.familyHistory.lifeExpectancy} years
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Other Policies */}
              <Grid item xs={12}>
                <Card sx={{ boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      <Typography variant="h6" fontWeight="600">Other Insurance Policies</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {policyData.customerProfile.otherPolicies.map((policy, _index) => (
                        <Grid item xs={12} sm={6} md={4} key={_index}>
                          <Box 
                            sx={{ 
                              p: 2, 
                              border: '1px solid', 
                              borderColor: 'divider', 
                              borderRadius: 2,
                              bgcolor: alpha(theme.palette.secondary.main, 0.05)
                            }}
                          >
                            <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                              {policy.policyType}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                              {policy.policyNumber} • {policy.provider}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2">Premium:</Typography>
                              <Typography variant="body2" fontWeight="500">₹{policy.premium.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2">Coverage:</Typography>
                              <Typography variant="body2" fontWeight="500">₹{policy.coverage.toLocaleString()}</Typography>
                            </Box>
                            <Chip 
                              label={policy.source} 
                              size="small" 
                              color={policy.source === 'Bank Channel' ? 'primary' : 'secondary'}
                              variant="outlined"
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grow>
        )}
        
        {/* AI Powered Summary Card */}
        {aiSummary && (
          <Grow in={loaded} timeout={700}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* AI Insights */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PsychologyIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" fontWeight="600">AI Insights</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Claim Likelihood:</Typography>
                        <Typography variant="h6" fontWeight="600" color={aiSummary.claimLikelihood === 'High' ? 'error.main' : aiSummary.claimLikelihood === 'Moderate' ? 'warning.main' : 'success.main'}>
                          {aiSummary.claimLikelihood}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Customer Profile:</Typography>
                        <Typography variant="h6" fontWeight="600" color={aiSummary.customerProfile === 'Excellent' ? 'success.main' : aiSummary.customerProfile === 'Average' ? 'warning.main' : 'primary.main'}>
                          {aiSummary.customerProfile}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Key Observations:</Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
                          {aiSummary.observations}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* AI Policy Recommendations */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <RecommendIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                      <Typography variant="h6" fontWeight="600">AI Policy Recommendations</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {aiSummary.policyRecommendations && aiSummary.policyRecommendations.length > 0 ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {aiSummary.policyRecommendations.map((recommendation, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              p: 2, 
                              border: '1px solid', 
                              borderColor: recommendation.priority === 'Critical' ? 'error.main' : 
                                          recommendation.priority === 'High' ? 'warning.main' : 'success.main',
                              borderRadius: 2,
                              bgcolor: alpha(
                                recommendation.priority === 'Critical' ? theme.palette.error.main : 
                                recommendation.priority === 'High' ? theme.palette.warning.main : theme.palette.success.main, 
                                0.05
                              )
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" fontWeight="600">
                                {recommendation.type}
                              </Typography>
                              <Chip 
                                label={recommendation.priority}
                                color={
                                  recommendation.priority === 'Critical' ? 'error' : 
                                  recommendation.priority === 'High' ? 'warning' : 'success'
                                }
                                size="small"
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                              {recommendation.reason}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2">
                                Coverage: ₹{recommendation.suggestedCoverage.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="primary.main" fontWeight="500">
                                ~₹{recommendation.estimatedPremium.toLocaleString()}/year
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No additional policy recommendations at this time. Current portfolio appears well-balanced.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grow>
        )}

        {/* Customer Preferences */}
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Grow in={loaded} timeout={800}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                overflow: 'visible',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SettingsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="600">Customer Preferences</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  {/* Communication Preferences */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ChatIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Communication Preferences
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">Email</Typography>
                          </Box>
                          <Chip 
                            label="Preferred" 
                            size="small" 
                            color="primary" 
                            sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">Phone Call</Typography>
                          </Box>
                          <Chip 
                            label="Backup" 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WhatsAppIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">WhatsApp</Typography>
                          </Box>
                          <Chip 
                            label="Accepted" 
                            size="small" 
                            variant="outlined"
                            color="success" 
                            sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SmsIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">SMS</Typography>
                          </Box>
                          <Chip 
                            label="Preferred" 
                            size="small" 
                            color="primary" 
                            sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SmartToyIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">AI Call</Typography>
                          </Box>
                          <Chip 
                            label="Accepted" 
                            size="small" 
                            variant="outlined"
                            color="info" 
                            sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MailOutlineIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">Postal Mail</Typography>
                          </Box>
                          <Chip 
                            label="Opted Out" 
                            size="small" 
                            variant="outlined"
                            color="error" 
                            sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Renewal Timeline Preferences */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Renewal Timeline
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Typical Renewal Pattern:
                            </Typography>
                          </Box>
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              bgcolor: alpha(theme.palette.primary.main, 0.1), 
                              color: theme.palette.primary.main, 
                              borderRadius: 2, 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <ArrowCircleUpIcon />
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              Pays 7-14 days before due date
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Reminder Schedule:
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2">• 30 days before due date (Email)</Typography>
                            <Typography variant="body2">• 14 days before due date (Email)</Typography>
                            <Typography variant="body2">• 7 days before due date (Phone)</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Payment Method Preferences */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PaymentsIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Payment Methods
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Primary Payment Method:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
                              <CreditCardIcon color="primary" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                Credit Card
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                **** **** **** 5678 • Expires 06/26
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Alternate Methods Used:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              avatar={<Avatar sx={{ bgcolor: 'transparent !important' }}><AccountBalanceIcon fontSize="small" /></Avatar>}
                              label="Bank Transfer"
                              size="small"
                              sx={{ borderRadius: 5 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Language Preferences */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LanguageIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Language Preferences
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Preferred Language:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                p: 1.5, 
                                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.2)
                              }}
                            >
                              <span style={{ fontSize: '20px' }}>🇮🇳</span>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  हिन्दी (Hindi)
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Primary communication language
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Alternative Languages:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label="🇬🇧 English"
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 5, fontWeight: 'medium' }}
                            />
                            <Chip 
                              label="🇮🇳 मराठी"
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 5, fontWeight: 'medium' }}
                            />
                          </Box>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Document Language:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label="Hindi & English"
                              size="small"
                              color="primary"
                              sx={{ borderRadius: 5, fontWeight: 'medium' }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Customer Payment Schedule */}
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Grow in={loaded} timeout={850}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                overflow: 'visible',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="600">Customer Payment Schedule</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  {/* Upcoming Payments */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EventIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Upcoming Payments
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Next Payment */}
                        <Box 
                          sx={{ 
                            p: 2, 
                            bgcolor: alpha(theme.palette.success.main, 0.1), 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.2)
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              Next Payment Due
                            </Typography>
                            <Chip 
                              label="7 days" 
                              size="small" 
                              color="success"
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ₹12,500
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Due Date: March 15, 2024
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Policy: Health Insurance Premium
                          </Typography>
                        </Box>
                        
                        {/* Subsequent Payments */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                ₹8,750
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Motor Insurance - Apr 20, 2024
                              </Typography>
                            </Box>
                            <Chip 
                              label="43 days" 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                ₹15,200
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Life Insurance - Jun 10, 2024
                              </Typography>
                            </Box>
                            <Chip 
                              label="94 days" 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Payment History & Patterns */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PendingIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Payment Patterns & History
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Payment Statistics */}
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Payment Statistics (Last 12 Months):
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                  11/12
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  On-time Payments
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                                  ₹42,650
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Total Paid
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                        
                        {/* Payment Behavior */}
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Payment Behavior:
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Average Payment Timing</Typography>
                              <Chip 
                                label="5 days early" 
                                size="small" 
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Preferred Payment Method</Typography>
                              <Chip 
                                label="Auto-debit" 
                                size="small" 
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2">Late Payment History</Typography>
                              <Chip 
                                label="1 instance" 
                                size="small" 
                                color="warning"
                                variant="outlined"
                                sx={{ fontWeight: 'medium', borderRadius: 5 }} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
        
        {/* Search and Filter */}
        <Grow in={loaded} timeout={600}>
          <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <TextField
                placeholder="Search in timeline events"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    '&:hover': {
                      backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                    },
                    transition: 'background-color 0.3s'
                  }
                }}
              />
              
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="All Events" 
                  color={filterType === 'all' ? 'primary' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('all')}
                  variant={filterType === 'all' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'all' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Creation" 
                  icon={<CreateIcon />}
                  color={filterType === 'creation' ? 'success' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('creation')}
                  variant={filterType === 'creation' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'creation' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Renewal" 
                  icon={<AutorenewIcon />}
                  color={filterType === 'renewal' ? 'primary' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('renewal')}
                  variant={filterType === 'renewal' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'renewal' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Modification" 
                  icon={<DescriptionIcon />}
                  color={filterType === 'modification' ? 'info' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('modification')}
                  variant={filterType === 'modification' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'modification' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Claim" 
                  icon={<WarningIcon />}
                  color={filterType === 'claim' ? 'warning' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('claim')}
                  variant={filterType === 'claim' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'claim' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Payment" 
                  icon={<PaymentIcon />}
                  color={filterType === 'payment' ? 'secondary' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('payment')}
                  variant={filterType === 'payment' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'payment' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
                <Chip 
                  label="Communication" 
                  icon={<PhoneIcon />}
                  color={filterType === 'communication' ? 'info' : 'default'}
                  clickable
                  onClick={() => handleFilterTypeChange('communication')}
                  variant={filterType === 'communication' ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 500,
                    boxShadow: filterType === 'communication' ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grow>
        
        {/* Policy Information Summary */}
        {currentPolicy && (
          <Grow in={loaded} timeout={800}>
            <Card sx={{ mb: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.05)', borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Policy ID
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {currentPolicy.policyId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Current Premium
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="primary.main">
                      ₹{currentPolicy.currentPremium.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="h6" fontWeight="500">
                      {formatDate(currentPolicy.startDate)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Policy Age
                    </Typography>
                    <Typography variant="h6" fontWeight="500">
                      {Math.floor((new Date() - new Date(currentPolicy.startDate)) / (365.25 * 24 * 60 * 60 * 1000))} years
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        )}
        
        {/* Timeline */}
        <Grow in={loaded} timeout={1000}>
          <Grid container spacing={3}>
            {/* Timeline Section */}
            <Grid item xs={12} lg={8}>
              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)', 
                  borderRadius: 3, 
                  mb: 4 
                }}
              >
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Policy Event Timeline
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Complete timeline of policy events, communications, and changes
                </Typography>
                
                {filteredEvents.length === 0 ? (
                  <Box sx={{ 
                    py: 5, 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 2
                  }}>
                    <InfoIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No events found matching your criteria
                    </Typography>
                    <Button 
                      variant="outlined" 
                      sx={{ mt: 2, borderRadius: 2 }}
                      onClick={() => {
                        setFilterType('all');
                        setSearchTerm('');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ position: 'relative', pl: 4 }}>
                    {/* Vertical Line */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 20,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                        borderRadius: 1
                      }}
                    />

                    {filteredEvents.map((event, _index) => (
                      <Box key={event.id} sx={{ position: 'relative', mb: 4 }}>
                        {/* Timeline Dot with Brand Colors */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: -28,
                            top: 8,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: getBrandColor(event.type),
                            boxShadow: `0 4px 12px ${alpha(getBrandColor(event.type), 0.3)}`,
                            border: `3px solid ${theme.palette.background.paper}`,
                            zIndex: 1
                          }}
                        >
                          {getEventIcon(event.type)}
                        </Box>

                        {/* Timeline Content Card */}
                        <Card
                          sx={{
                            ml: 3,
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: `1px solid ${alpha(getBrandColor(event.type), 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Chip
                                    label={getEventLabel(event.type)}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha(getBrandColor(event.type), 0.1),
                                      color: getBrandColor(event.type),
                                      fontWeight: 600,
                                      mr: 1
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                                  {event.title}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Content */}
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {event.description}
                            </Typography>

                            {/* Event Details */}
                            {event.details && (
                              <Box
                                sx={{
                                  bgcolor: alpha(getBrandColor(event.type), 0.05),
                                  borderRadius: 2,
                                  p: 2,
                                  border: `1px solid ${alpha(getBrandColor(event.type), 0.1)}`
                                }}
                              >
                                <Grid container spacing={2}>
                                  {Object.entries(event.details).map(([key, value]) => (
                                    <Grid item xs={12} sm={6} key={key}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: 100, mr: 2 }}>
                                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                                        </Typography>
                                        <Typography variant="body2" fontWeight="500">
                                          {typeof value === 'number' && key.toLowerCase().includes('premium') 
                                            ? `₹${value.toLocaleString()}`
                                            : value.toString()}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Customer Details Panel */}
            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  position: 'sticky',
                  top: 24,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight="600">Customer Details</Typography>
                  </Box>

                  {policyData && (
                    <>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: theme.palette.primary.main,
                            fontSize: '2rem',
                            fontWeight: 600,
                            mx: 'auto',
                            mb: 2,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                          }}
                        >
                          {policyData.customerName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                          {policyData.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Customer ID: {policyData.customerId}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Policy Summary */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2, color: theme.palette.primary.main }}>
                          Policy Summary
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                            <PolicyIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Active Policies</Typography>
                              <Typography variant="body2" fontWeight="500">{policyData.policies?.length || 0}</Typography>
                            </Box>
                          </Box>
                          {currentPolicy && (
                            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                              <VerifiedUserIcon sx={{ mr: 2, color: theme.palette.success.main }} />
                              <Box>
                                <Typography variant="body2" color="text.secondary">Current Policy</Typography>
                                <Typography variant="body2" fontWeight="500">{currentPolicy.policyNumber}</Typography>
                              </Box>
                            </Box>
                          )}
                        </Stack>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Event Stats */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2, color: theme.palette.primary.main }}>
                          Timeline Summary
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                              <Typography variant="h6" color="info.main" fontWeight="bold">
                                {filteredEvents.length}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">Total Events</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
                              <Typography variant="h6" color="success.main" fontWeight="bold">
                                {currentPolicy?.status === 'Active' ? 'Active' : 'Inactive'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">Status</Typography>
                            </Box>
                          </Grid>
                          {currentPolicy && (
                            <Grid item xs={12}>
                              <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2 }}>
                                <Typography variant="body2" color="warning.main" fontWeight="bold">
                                  ₹{currentPolicy.premium?.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Annual Premium</Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grow>
      </Box>
    </Fade>
  );
};

export default PolicyTimeline;
