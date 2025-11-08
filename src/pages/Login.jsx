import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, 
  CircularProgress, Alert, Container, Link,
  Card, CardContent, InputAdornment, IconButton,
  alpha, useTheme, Fade, Grow, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Email as EmailIcon, 
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  
  // Password reset state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  
  const { login, verifyMfaOtp } = useAuth();
  const navigate = useNavigate();

  // Load MFA setting on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setMfaEnabled(settings.mfaEnabled);
      } catch (error) {
        // Failed to parse settings, using defaults
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Check if OTP is required (MFA enabled) but not provided
    if (mfaEnabled && !otp) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // First, authenticate with email and password
      const result = await login(email, password);
      // Login successful
      
      if (result.success) {
        // If MFA is enabled, verify the OTP code
        if (mfaEnabled) {
          const otpResult = await verifyMfaOtp(otp);
          // OTP verification completed
          
          if (otpResult.success) {
            // Navigating to dashboard after OTP verification
            // Add a small delay to ensure auth state is updated
            setTimeout(() => {
              try {
                navigate('/');
              } catch (navError) {
                // Fallback to direct page navigation
                window.location.href = '/';
              }
            }, 100);
          } else {
            setError(otpResult.message || 'Invalid verification code. Please try again.');
          }
        } else {
          // If MFA is not enabled, proceed to dashboard
          // Navigating to dashboard (no MFA)
          // Add a small delay to ensure auth state is updated
          setTimeout(() => {
            try {
              navigate('/');
            } catch (navError) {
              console.error('Navigation error:', navError);
              // Fallback to direct page navigation
              window.location.href = '/';
            }
          }, 100);
        }
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleResetDialogOpen = () => {
    setResetDialogOpen(true);
    setResetEmail(email || '');
    setResetError('');
    setResetSuccess(false);
  };
  
  const handleResetDialogClose = () => {
    setResetDialogOpen(false);
    if (resetSuccess) {
      setResetEmail('');
      setResetSuccess(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }
    
    setResetLoading(true);
    setResetError('');
    
    // In a real app, this would call an API to send a reset link
    // For demo purposes, we'll simulate a successful API call
    setTimeout(() => {
      setResetSuccess(true);
      setResetLoading(false);
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.6)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
        backgroundSize: 'cover',
        padding: 2
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
            }}
          >
            <SecurityIcon 
              sx={{ 
                fontSize: 60, 
                color: theme.palette.primary.main,
                mb: 2
              }}
            />
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                  : `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Py360
            </Typography>
          </Box>
          
          <Grow in={true} timeout={1000}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(164, 215, 225, 0.15)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                    Welcome
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to access your account
                  </Typography>
                </Box>
                
                {error && (
                  <Grow in={Boolean(error)}>
                    <Alert 
                      severity={error.includes('expired') ? 'warning' : 'error'}
                      sx={{ 
                        mb: 3, 
                        borderRadius: 2,
                        boxShadow: error.includes('expired') 
                          ? '0 4px 12px rgba(255, 152, 0, 0.1)'
                          : '0 4px 12px rgba(244, 67, 54, 0.1)'
                      }}
                    >
                      {error}
                    </Alert>
                  </Grow>
                )}
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      mb: mfaEnabled ? 2 : 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  {mfaEnabled && (
                    <TextField
                      label="6-Digit Verification Code"
                      type="text"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      inputProps={{ maxLength: 6 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SecurityIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  )}
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      mb: 3,
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(164, 215, 225, 0.25)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(164, 215, 225, 0.35)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(90deg, transparent, ${alpha('#ffffff', 0.2)}, transparent)`,
                        animation: loading ? 'none' : 'shine 1.5s infinite',
                      },
                      '@keyframes shine': {
                        '0%': {
                          left: '-100%',
                        },
                        '100%': {
                          left: '100%',
                        },
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Sign In'}
                  </Button>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                      onClick={handleResetDialogOpen}
                      variant="body2"
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          color: theme.palette.primary.dark,
                          textDecoration: 'underline',
                        }
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Don't have an account?
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/register')}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(164, 215, 225, 0.2)',
                        }
                      }}
                    >
                      Create New Account
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grow>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Veriright Management Solutions Private Limited. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Fade>
      
      {/* Password Reset Dialog */}
      <Dialog 
        open={resetDialogOpen} 
        onClose={handleResetDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(164, 215, 225, 0.15)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            px: 3, 
            pt: 3, 
            pb: 1,
            fontWeight: 600
          }}
        >
          Reset Password
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          {resetSuccess ? (
            <Box>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.1)'
                }}
              >
                Password reset link sent successfully!
              </Alert>
              <DialogContentText>
                We've sent a password reset link to <strong>{resetEmail}</strong>. 
                Please check your email and follow the instructions to reset your password.
              </DialogContentText>
            </Box>
          ) : (
            <Box>
              <DialogContentText sx={{ mb: 2 }}>
                Enter your email address below and we'll send you a link to reset your password.
              </DialogContentText>
              
              {resetError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.1)'
                  }}
                >
                  {resetError}
                </Alert>
              )}
              
              <form onSubmit={handleResetPassword}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </form>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleResetDialogClose} 
            color={resetSuccess ? "primary" : "secondary"}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            {resetSuccess ? 'Close' : 'Cancel'}
          </Button>
          
          {!resetSuccess && (
            <Button 
              onClick={handleResetPassword}
              color="primary"
              variant="contained"
              disabled={resetLoading}
              sx={{ 
                borderRadius: 2,
                px: 3
              }}
            >
              {resetLoading ? (
                <CircularProgress size={24} thickness={4} sx={{ color: 'white' }} />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;