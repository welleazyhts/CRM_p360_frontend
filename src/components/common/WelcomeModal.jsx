import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  useTheme,
  IconButton,
  Divider,
  alpha,
  Fade,
  Grow,
  Zoom
} from '@mui/material';
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Assignment as CasesIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

const WelcomeModal = ({ open, onClose }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when step changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    // Save to localStorage that the user has seen the welcome screen
    localStorage.setItem('welcomeScreenSeen', 'true');
    // Save that user has responded to permission request
    localStorage.setItem('permissionRequestSeen', 'true');
    onClose();
  };

  const handleNotNow = () => {
    // Save that user has responded to permission request but declined
    localStorage.setItem('permissionRequestSeen', 'true');
    localStorage.setItem('permissionRequestDeclined', 'true');
    onClose();
  };

  // Dashboard Animation Component
  const DashboardAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%' }}>
          {/* Header */}
          <Fade in={true} timeout={800}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Dashboard Overview</Typography>
          </Fade>
          
          {/* Stats Cards */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {[
              { color: theme.palette.primary.main, delay: 300 },
              { color: theme.palette.warning.main, delay: 500 },
              { color: theme.palette.success.main, delay: 700 },
              { color: theme.palette.error.main, delay: 900 }
            ].map((item, index) => (
              <Grow 
                key={`${animationKey}-card-${index}`} 
                in={true} 
                style={{ transformOrigin: '0 0 0', transitionDelay: `${item.delay}ms` }}
                timeout={1000}
              >
                <Box sx={{ 
                  height: 60, 
                  width: 60, 
                  bgcolor: alpha(item.color, 0.2), 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{ 
                    height: 30, 
                    width: 30, 
                    bgcolor: item.color,
                    borderRadius: 1
                  }} />
                </Box>
              </Grow>
            ))}
          </Box>
          
          {/* Charts */}
          <Box sx={{ display: 'flex', gap: 1, height: 80 }}>
            <Fade in={true} timeout={1200} style={{ transitionDelay: '800ms' }}>
              <Box sx={{ 
                flex: 1, 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChartIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              </Box>
            </Fade>
            <Fade in={true} timeout={1200} style={{ transitionDelay: '1000ms' }}>
              <Box sx={{ 
                flex: 1, 
                bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PieChartIcon sx={{ fontSize: 32, color: theme.palette.secondary.main }} />
              </Box>
            </Fade>
          </Box>
        </Box>
      </Box>
    );
  };

  // Upload Animation Component
  const UploadAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Fade in={true} timeout={800}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Upload Policies</Typography>
          </Fade>
          
          {/* Upload Area */}
          <Zoom in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ 
              flex: 1,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2
            }}>
              <UploadIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="body2" color="textSecondary">Drag & Drop Files Here</Typography>
              
              <Fade in={true} timeout={1000} style={{ transitionDelay: '1200ms' }}>
                <Button 
                  variant="contained" 
                  size="small" 
                  sx={{ mt: 1, borderRadius: 4, px: 2 }}
                >
                  Browse Files
                </Button>
              </Fade>
            </Box>
          </Zoom>
        </Box>
      </Box>
    );
  };

  // Case Tracking Animation Component
  const CaseTrackingAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Fade in={true} timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Case Tracking</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Zoom in={true} timeout={800} style={{ transitionDelay: '500ms' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SearchIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  </Box>
                </Zoom>
                <Zoom in={true} timeout={800} style={{ transitionDelay: '700ms' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FilterListIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  </Box>
                </Zoom>
                <Zoom in={true} timeout={800} style={{ transitionDelay: '900ms' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <RefreshIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  </Box>
                </Zoom>
              </Box>
            </Box>
          </Fade>
          
          {/* Table Header */}
          <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ 
              display: 'flex', 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: '4px 4px 0 0',
              p: 1
            }}>
              <Box sx={{ flex: 2, fontWeight: 'bold', fontSize: '0.75rem' }}>Policy ID</Box>
              <Box sx={{ flex: 3, fontWeight: 'bold', fontSize: '0.75rem' }}>Customer</Box>
              <Box sx={{ flex: 2, fontWeight: 'bold', fontSize: '0.75rem' }}>Status</Box>
              <Box sx={{ flex: 2, fontWeight: 'bold', fontSize: '0.75rem' }}>Due Date</Box>
            </Box>
          </Fade>
          
          {/* Table Rows */}
          {[
            { delay: 600, status: 'success' },
            { delay: 800, status: 'warning' },
            { delay: 1000, status: 'error' },
            { delay: 1200, status: 'default' }
          ].map((row, index) => (
            <Fade 
              key={`${animationKey}-row-${index}`} 
              in={true} 
              timeout={800} 
              style={{ transitionDelay: `${row.delay}ms` }}
            >
              <Box sx={{ 
                display: 'flex', 
                borderBottom: `1px solid ${theme.palette.divider}`,
                p: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.02)
                }
              }}>
                <Box sx={{ flex: 2, fontSize: '0.75rem' }}>POL-{10000 + index}</Box>
                <Box sx={{ flex: 3, fontSize: '0.75rem' }}>Customer {index + 1}</Box>
                <Box sx={{ flex: 2, fontSize: '0.75rem' }}>
                  <Box sx={{ 
                    display: 'inline-block',
                    px: 1,
                    borderRadius: 4,
                    fontSize: '0.65rem',
                    bgcolor: alpha(
                      row.status === 'success' ? theme.palette.success.main : 
                      row.status === 'warning' ? theme.palette.warning.main : 
                      row.status === 'error' ? theme.palette.error.main : 
                      theme.palette.grey[500],
                      0.1
                    ),
                    color: 
                      row.status === 'success' ? theme.palette.success.main : 
                      row.status === 'warning' ? theme.palette.warning.main : 
                      row.status === 'error' ? theme.palette.error.main : 
                      theme.palette.grey[500]
                  }}>
                    {row.status === 'success' ? 'Renewed' : 
                     row.status === 'warning' ? 'In Progress' : 
                     row.status === 'error' ? 'Failed' : 'Pending'}
                  </Box>
                </Box>
                <Box sx={{ flex: 2, fontSize: '0.75rem' }}>
                  {new Date(2025, 3, 10 + index).toLocaleDateString()}
                </Box>
              </Box>
            </Fade>
          ))}
        </Box>
      </Box>
    );
  };

  // Timeline Animation Component
  const TimelineAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%' }}>
          <Fade in={true} timeout={800}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Policy Timeline</Typography>
          </Fade>
          
          {/* Timeline */}
          <Box sx={{ position: 'relative', ml: 2, mt: 1 }}>
            {/* Vertical line */}
            <Box sx={{ 
              position: 'absolute', 
              left: 0, 
              top: 0, 
              bottom: 0, 
              width: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.2),
              ml: -1
            }} />
            
            {/* Timeline Items */}
            {[
              { delay: 400, color: theme.palette.primary.main, text: 'Policy Created' },
              { delay: 800, color: theme.palette.info.main, text: 'Documents Verified' },
              { delay: 1200, color: theme.palette.warning.main, text: 'Payment Pending' },
              { delay: 1600, color: theme.palette.success.main, text: 'Renewal Complete' }
            ].map((item, index) => (
              <Fade 
                key={`${animationKey}-timeline-${index}`} 
                in={true} 
                timeout={800} 
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: item.color,
                    mr: 2,
                    ml: -1.25,
                    zIndex: 1,
                    boxShadow: `0 0 0 3px ${alpha(item.color, 0.2)}`
                  }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.text}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(2025, 3, 1 + index * 2).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Settings Animation Component
  const SettingsAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%' }}>
          <Fade in={true} timeout={800}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Settings & Preferences</Typography>
          </Fade>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { delay: 400, icon: <NotificationsIcon fontSize="small" />, text: 'Notification Preferences' },
              { delay: 700, icon: <DashboardIcon fontSize="small" />, text: 'Dashboard Layout' },
              { delay: 1000, icon: <SettingsIcon fontSize="small" />, text: 'Account Settings' },
              { delay: 1300, icon: <TimelineIcon fontSize="small" />, text: 'Help & Resources' }
            ].map((item, index) => (
              <Fade 
                key={`${animationKey}-setting-${index}`} 
                in={true} 
                timeout={800} 
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: index === 0 ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  border: `1px solid ${index === 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent'}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body2">{item.text}</Typography>
                  </Box>
                  <Box sx={{ 
                    width: 32, 
                    height: 16, 
                    bgcolor: index === 0 ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.2),
                    borderRadius: 8,
                    position: 'relative',
                    transition: 'background-color 0.3s'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      top: 2,
                      left: index === 0 ? 18 : 2,
                      transition: 'left 0.3s'
                    }} />
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Closed Cases Animation Component
  const ClosedCasesAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Fade in={true} timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Closed Cases</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Zoom in={true} timeout={800} style={{ transitionDelay: '500ms' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SearchIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  </Box>
                </Zoom>
                <Zoom in={true} timeout={800} style={{ transitionDelay: '700ms' }}>
                  <Box sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1), 
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FilterListIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                  </Box>
                </Zoom>
              </Box>
            </Box>
          </Fade>
          
          {/* Table Header */}
          <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ 
              display: 'flex', 
              bgcolor: alpha(theme.palette.success.main, 0.05),
              borderRadius: '4px 4px 0 0',
              p: 1
            }}>
              <Box sx={{ flex: 2, fontWeight: 'bold', fontSize: '0.75rem' }}>Policy ID</Box>
              <Box sx={{ flex: 3, fontWeight: 'bold', fontSize: '0.75rem' }}>Customer</Box>
              <Box sx={{ flex: 2, fontWeight: 'bold', fontSize: '0.75rem' }}>Completion Date</Box>
              <Box sx={{ flex: 2, fontWeight: 'bold', fontSize: '0.75rem' }}>Status</Box>
            </Box>
          </Fade>
          
          {/* Table Rows */}
          {[
            { delay: 600, status: 'success' },
            { delay: 800, status: 'success' },
            { delay: 1000, status: 'error' },
            { delay: 1200, status: 'success' }
          ].map((row, index) => (
            <Fade 
              key={`${animationKey}-closed-row-${index}`} 
              in={true} 
              timeout={800} 
              style={{ transitionDelay: `${row.delay}ms` }}
            >
              <Box sx={{ 
                display: 'flex', 
                borderBottom: `1px solid ${theme.palette.divider}`,
                p: 1,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.02)
                }
              }}>
                <Box sx={{ flex: 2, fontSize: '0.75rem' }}>POL-{20000 + index}</Box>
                <Box sx={{ flex: 3, fontSize: '0.75rem' }}>Customer {index + 1}</Box>
                <Box sx={{ flex: 2, fontSize: '0.75rem' }}>
                  {new Date(2025, 2, 10 + index).toLocaleDateString()}
                </Box>
                <Box sx={{ flex: 2, fontSize: '0.75rem' }}>
                  <Box sx={{ 
                    display: 'inline-block',
                    px: 1,
                    borderRadius: 4,
                    fontSize: '0.65rem',
                    bgcolor: alpha(
                      row.status === 'success' ? theme.palette.success.main : 
                      theme.palette.error.main,
                      0.1
                    ),
                    color: 
                      row.status === 'success' ? theme.palette.success.main : 
                      theme.palette.error.main
                  }}>
                    {row.status === 'success' ? 'Renewed' : 'Declined'}
                  </Box>
                </Box>
              </Box>
            </Fade>
          ))}
        </Box>
      </Box>
    );
  };

  // Case Logs Animation Component
  const CaseLogsAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%' }}>
          <Fade in={true} timeout={800}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Case Logs</Typography>
          </Fade>
          
          {/* Logs */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { delay: 400, user: 'System', action: 'Case created from batch upload', time: '10:30 AM' },
              { delay: 800, user: 'Ravi Sharma', action: 'Updated customer contact information', time: '11:45 AM' },
              { delay: 1200, user: 'System', action: 'Document verification completed', time: '2:15 PM' },
              { delay: 1600, user: 'Priya Patel', action: 'Payment processed', time: '4:30 PM' }
            ].map((item, index) => (
              <Fade 
                key={`${animationKey}-log-${index}`} 
                in={true} 
                timeout={800} 
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: index % 2 === 0 ? alpha(theme.palette.primary.main, 0.03) : 'transparent',
                  border: `1px solid ${index % 2 === 0 ? alpha(theme.palette.primary.main, 0.08) : 'transparent'}`
                }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: index % 2 === 0 ? theme.palette.primary.main : theme.palette.info.main,
                    mt: 0.8,
                    mr: 1.5
                  }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.user}</Typography>
                      <Typography variant="caption" color="textSecondary">{item.time}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">{item.action}</Typography>
                  </Box>
                </Box>
              </Fade>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Profile Animation Component
  const ProfileAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%' }}>
          <Fade in={true} timeout={800}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Zoom in={true} timeout={1000}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>RS</Typography>
                </Box>
              </Zoom>
              <Box>
                <Fade in={true} timeout={800} style={{ transitionDelay: '400ms' }}>
                  <Typography variant="h6">Rahul Singh</Typography>
                </Fade>
                <Fade in={true} timeout={800} style={{ transitionDelay: '600ms' }}>
                  <Typography variant="body2" color="textSecondary">Insurance Agent</Typography>
                </Fade>
              </Box>
            </Box>
          </Fade>
          
          {/* Profile Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { delay: 800, label: 'Email', value: 'rahul.singh@example.com' },
              { delay: 1000, label: 'Phone', value: '+91 98765 43210' },
              { delay: 1200, label: 'Branch', value: 'Mumbai Central' }
            ].map((item, index) => (
              <Fade 
                key={`${animationKey}-profile-${index}`} 
                in={true} 
                timeout={800} 
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ width: 80, color: theme.palette.text.secondary }}>{item.label}:</Typography>
                  <Typography variant="body2">{item.value}</Typography>
                </Box>
              </Fade>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Billing Animation Component
  const BillingAnimation = () => {
    return (
      <Box sx={{ position: 'relative', height: 200, mt: 2, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper, height: '100%' }}>
          <Fade in={true} timeout={800}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Billing & Subscription</Typography>
          </Fade>
          
          {/* Current Plan */}
          <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.success.main, 0.05), 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              mb: 2
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">Current Plan</Typography>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  px: 1,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  ACTIVE
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Enterprise Plan</Typography>
              <Typography variant="body2" color="textSecondary">₹25,000 / month</Typography>
            </Box>
          </Fade>
          
          {/* Payment Method */}
          <Fade in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                width: 50,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.7rem' }}>VISA</Typography>
              </Box>
              <Box>
                <Typography variant="body2">•••• •••• •••• 4242</Typography>
                <Typography variant="caption" color="textSecondary">Expires 12/2026</Typography>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Box>
    );
  };

  const steps = [
    {
      label: 'Welcome to the Insurance Policy Renewal Portal',
      icon: <CheckCircleIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            Welcome to our Insurance Policy Renewal Portal! This platform is designed to help you efficiently manage and track insurance policy renewals.
          </Typography>
          <Typography variant="body1" paragraph>
            This quick tour will guide you through the main features of the portal to help you get started.
          </Typography>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.05), 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              mt: 2
            }}
          >
            <Typography variant="body2" color="text.secondary">
              You can access this guide anytime from the Help section in the Settings menu.
            </Typography>
          </Box>
        </>
      ),
      animation: null
    },
    {
      label: 'Dashboard',
      icon: <DashboardIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Dashboard provides an overview of all your renewal activities:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              View key metrics like total cases, in-progress renewals, and completed renewals
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Monitor payment collections and pending amounts
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Track success rates and case volumes through interactive charts
            </Typography>
            <Typography component="li" variant="body1">
              Filter data by date range, policy type, and case status
            </Typography>
          </Box>
          <DashboardAnimation />
        </>
      ),
      animation: DashboardAnimation
    },
    {
      label: 'Upload Policies',
      icon: <UploadIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Upload section allows you to add new policies for renewal processing:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Upload policy data in bulk using Excel or CSV files
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Add individual policies manually with the form
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Track upload history and validation results
            </Typography>
            <Typography component="li" variant="body1">
              View detailed error reports for failed uploads
            </Typography>
          </Box>
          <UploadAnimation />
        </>
      ),
      animation: UploadAnimation
    },
    {
      label: 'Case Tracking',
      icon: <CasesIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Case Tracking section helps you monitor all your renewal cases:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              View all cases in a sortable and filterable table
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Track case status from upload to completion
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Access detailed case information by clicking on any case
            </Typography>
            <Typography component="li" variant="body1">
              Flag priority cases for urgent attention
            </Typography>
          </Box>
          <CaseTrackingAnimation />
        </>
      ),
      animation: CaseTrackingAnimation
    },
    {
      label: 'Policy Timeline',
      icon: <TimelineIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Policy Timeline provides a comprehensive view of a policy's history:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              View all events related to a policy in chronological order
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Track communications, payments, and status changes
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Filter timeline events by type or date
            </Typography>
            <Typography component="li" variant="body1">
              Access detailed information about each event
            </Typography>
          </Box>
          <TimelineAnimation />
        </>
      ),
      animation: TimelineAnimation
    },
    {
      label: 'Settings & Customization',
      icon: <SettingsIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Settings section allows you to personalize your experience:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Configure notification preferences
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Toggle between light and dark mode
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Update your profile information
            </Typography>
            <Typography component="li" variant="body1">
              Manage billing and subscription details
            </Typography>
          </Box>
          <SettingsAnimation />
        </>
      ),
      animation: SettingsAnimation
    },
    {
      label: 'Closed Cases',
      icon: <CheckCircleIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Closed Cases section shows you all the cases that have been closed:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              View all closed cases in a sortable and filterable table
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Track case status from upload to completion
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Access detailed case information by clicking on any case
            </Typography>
            <Typography component="li" variant="body1">
              Flag priority cases for urgent attention
            </Typography>
          </Box>
          <ClosedCasesAnimation />
        </>
      ),
      animation: ClosedCasesAnimation
    },
    {
      label: 'Case Logs',
      icon: <TimelineIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Case Logs section shows you all the case-related activities:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              View all case-related activities in a sortable and filterable table
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Track case-related activities from creation to completion
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Access detailed case-related activity information by clicking on any activity
            </Typography>
            <Typography component="li" variant="body1">
              Flag priority case-related activities for urgent attention
            </Typography>
          </Box>
          <CaseLogsAnimation />
        </>
      ),
      animation: CaseLogsAnimation
    },
    {
      label: 'Profile Management',
      icon: <SettingsIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Profile section shows your personal information:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              View your name, email, and phone number
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Manage your branch information
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Access detailed profile information
            </Typography>
            <Typography component="li" variant="body1">
              Manage your profile settings
            </Typography>
          </Box>
          <ProfileAnimation />
        </>
      ),
      animation: ProfileAnimation
    },
    {
      label: 'Billing & Subscription',
      icon: <AccountBalanceIcon color="primary" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            The Billing section shows your billing and subscription details:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              View your current plan and subscription details
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Manage your payment method
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Access detailed billing and subscription information
            </Typography>
            <Typography component="li" variant="body1">
              Manage your billing and subscription settings
            </Typography>
          </Box>
          <BillingAnimation />
        </>
      ),
      animation: BillingAnimation
    },
    {
      label: 'Ready to Start!',
      icon: <CheckCircleIcon color="success" />,
      description: (
        <>
          <Typography variant="body1" paragraph>
            You're all set to start using the Insurance Policy Renewal Portal!
          </Typography>
          <Typography variant="body1" paragraph>
            Remember, you can always access help resources from the Settings menu if you need assistance.
          </Typography>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: alpha(theme.palette.success.main, 0.05), 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2">
              Click "Get Started" below to begin exploring the portal!
            </Typography>
          </Box>
        </>
      ),
      animation: null
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div" fontWeight="600">
            {steps[activeStep].label}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ width: { xs: '100%', md: 240 }, flexShrink: 0 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel 
                    StepIconProps={{ 
                      icon: step.icon || index + 1,
                    }}
                  >
                    <Typography variant="subtitle2">{step.label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.01)',
                borderRadius: 2,
                minHeight: 250
              }}
            >
              {steps[activeStep].description}
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onClose} 
          color="inherit" 
          sx={{ borderRadius: 2 }}
        >
          Not Now
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button 
            onClick={handleFinish} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
              px: 3
            }}
          >
            Get Started
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(0,118,255,0.25)',
              px: 3
            }}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeModal; 