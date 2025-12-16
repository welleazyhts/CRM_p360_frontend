import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  CircularProgress, Alert, Container,
  Card, CardContent, InputAdornment, IconButton,
  alpha, useTheme, Fade, Grow, Stepper, Step, StepLabel,
  Paper, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    job_title: '',
    employee_id: '',
    password: '',
    password_confirm: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const steps = ['Personal Information', 'Professional Details', 'Security'];

  // Handle input change
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate step
  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      // Personal Information validation
      if (!formData.first_name.trim()) {
        errors.first_name = 'First name is required';
      }
      if (!formData.last_name.trim()) {
        errors.last_name = 'Last name is required';
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone)) { // Simple 10-digit validation
        errors.phone = 'Phone number must be 10 digits';
      }
    } else if (step === 1) {
      // Professional Details validation
      if (!formData.department.trim()) {
        errors.department = 'Department is required';
      }
      if (!formData.job_title.trim()) {
        errors.job_title = 'Job title is required';
      }
      if (!formData.employee_id.trim()) {
        errors.employee_id = 'Employee ID is required';
      }
    } else if (step === 2) {
      // Security validation
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (!formData.password_confirm) {
        errors.password_confirm = 'Please confirm your password';
      } else if (formData.password !== formData.password_confirm) {
        errors.password_confirm = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);  
    setError('');

    try {
<<<<<<< HEAD
      const result = await register(formData);

      if (result.success) {
        // Registration successful
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
=======
      // Call the registration API
      const result = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        companyName: formData.companyName,
        numberOfUsers: formData.numberOfUsers,
        industry: formData.industry,
        password: formData.password,
        additionalFields: formData.additionalFields  
      });

      if (result.success) {
        // Registration successful
        // Show success message and redirect to login
        alert(result.message || 'Registration successful! Please login with your credentials.');
        navigate('/login');      
>>>>>>> 0f0db02199acd11bdcb8309679f62aa88a7a39ee
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  value={formData.first_name}
                  onChange={handleChange('first_name')}
                  error={Boolean(validationErrors.first_name)}
                  helperText={validationErrors.first_name}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  value={formData.last_name}
                  onChange={handleChange('last_name')}
                  error={Boolean(validationErrors.last_name)}
                  helperText={validationErrors.last_name}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={Boolean(validationErrors.email)}
                  helperText={validationErrors.email}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={Boolean(validationErrors.phone)}
                  helperText={validationErrors.phone}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Department"
                  fullWidth
                  variant="outlined"
                  value={formData.department}
                  onChange={handleChange('department')}
                  error={Boolean(validationErrors.department)}
                  helperText={validationErrors.department}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  fullWidth
                  variant="outlined"
                  value={formData.job_title}
                  onChange={handleChange('job_title')}
                  error={Boolean(validationErrors.job_title)}
                  helperText={validationErrors.job_title}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee ID"
                  fullWidth
                  variant="outlined"
                  value={formData.employee_id}
                  onChange={handleChange('employee_id')}
                  error={Boolean(validationErrors.employee_id)}
                  helperText={validationErrors.employee_id}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true} timeout={500}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange('password')}
                  error={Boolean(validationErrors.password)}
                  helperText={validationErrors.password || 'Password must be at least 8 characters'}
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
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  value={formData.password_confirm}
                  onChange={handleChange('password_confirm')}
                  error={Boolean(validationErrors.password_confirm)}
                  helperText={validationErrors.password_confirm}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Summary */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mt: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2" fontWeight="600" color="success.main">
                      Registration Summary
                    </Typography>
                  </Box>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Name</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {formData.first_name} {formData.last_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body2" fontWeight="600">{formData.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Department</Typography>
                      <Typography variant="body2" fontWeight="600">{formData.department}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Role</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {formData.job_title}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Fade>
        );

      default:
        return null;
    }
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
        padding: 2,
        pt: 4,
        pb: 4
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
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
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join Py360 and start managing your workflow
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
                {/* Stepper */}
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {error && (
                  <Grow in={Boolean(error)}>
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.1)'
                      }}
                    >
                      {error}
                    </Alert>
                  </Grow>
                )}

                <form onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
                  {renderStepContent(activeStep)}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      onClick={() => navigate('/login')}
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        borderRadius: 2,
                        visibility: activeStep === 0 ? 'visible' : 'hidden'
                      }}
                    >
                      Back to Login
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {activeStep > 0 && (
                        <Button
                          onClick={handleBack}
                          variant="outlined"
                          sx={{ borderRadius: 2, px: 3 }}
                        >
                          Back
                        </Button>
                      )}

                      {activeStep === steps.length - 1 ? (
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            px: 4,
                            borderRadius: 2,
                            fontWeight: 600,
                            boxShadow: '0 4px 14px rgba(164, 215, 225, 0.25)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(164, 215, 225, 0.35)',
                            }
                          }}
                        >
                          {loading ? <CircularProgress size={24} /> : 'Create Account'}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          variant="contained"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            px: 4,
                            borderRadius: 2,
                            fontWeight: 600,
                            boxShadow: '0 4px 14px rgba(164, 215, 225, 0.25)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(164, 215, 225, 0.35)',
                            }
                          }}
                        >
                          Next
                        </Button>
                      )}
                    </Box>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grow>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Veriright Management Solutions Private Limited. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Fade>
    </Box>
  );
};

export default Register;
