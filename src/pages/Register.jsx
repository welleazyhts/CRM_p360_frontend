import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  CircularProgress, Alert, Container,
  Card, CardContent, InputAdornment, IconButton,
  alpha, useTheme, Fade, Grow, MenuItem,
  Select, FormControl, InputLabel, Checkbox,
  FormControlLabel, Grid, Stepper, Step, StepLabel,
  Paper, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { getIndustries, getIndustryFields, industryConfig } from '../config/industryConfig';
import { registerUser } from '../services/api';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    numberOfUsers: '',
    industry: '',
    password: '',
    confirmPassword: '',
    additionalFields: {}
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const steps = ['Basic Information', 'Company Details', 'Security'];
  const industries = getIndustries();

  // Handle input change
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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

  // Handle additional field change
  const handleAdditionalFieldChange = (fieldName) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      additionalFields: {
        ...prev.additionalFields,
        [fieldName]: value
      }
    }));
  };

  // Validate step
  const validateStep = (step) => {
    const errors = {};

    if (step === 0) {
      // Basic Information validation
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
      }
    } else if (step === 1) {
      // Company Details validation
      if (!formData.companyName.trim()) {
        errors.companyName = 'Company name is required';
      }
      if (!formData.numberOfUsers) {
        errors.numberOfUsers = 'Number of users is required';
      } else if (formData.numberOfUsers < 1) {
        errors.numberOfUsers = 'Number of users must be at least 1';
      }
      if (!formData.industry) {
        errors.industry = 'Industry is required';
      }

      // Validate industry-specific additional fields
      if (formData.industry) {
        const additionalFields = getIndustryFields(formData.industry);
        additionalFields.forEach(field => {
          if (field.required && !formData.additionalFields[field.name]) {
            errors[`additional_${field.name}`] = `${field.label} is required`;
          }
        });
      }
    } else if (step === 2) {
      // Security validation
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
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
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration. Please try again.');
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
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={Boolean(validationErrors.firstName)}
                  helperText={validationErrors.firstName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  error={Boolean(validationErrors.lastName)}
                  helperText={validationErrors.lastName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
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
                  label="Company Name"
                  fullWidth
                  variant="outlined"
                  value={formData.companyName}
                  onChange={handleChange('companyName')}
                  error={Boolean(validationErrors.companyName)}
                  helperText={validationErrors.companyName}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Users"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.numberOfUsers}
                  onChange={handleChange('numberOfUsers')}
                  error={Boolean(validationErrors.numberOfUsers)}
                  helperText={validationErrors.numberOfUsers}
                  required
                  inputProps={{ min: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={Boolean(validationErrors.industry)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                >
                  <InputLabel>Industry *</InputLabel>
                  <Select
                    value={formData.industry}
                    onChange={handleChange('industry')}
                    label="Industry *"
                    startAdornment={
                      <InputAdornment position="start">
                        <CategoryIcon color="primary" />
                      </InputAdornment>
                    }
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.industry && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {validationErrors.industry}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Industry-specific additional fields */}
              {formData.industry && (
                <>
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CategoryIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="600" color="primary">
                          {industryConfig[formData.industry]?.name} Specific Information
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {getIndustryFields(formData.industry).map((field) => (
                          <Grid item xs={12} key={field.name}>
                            {field.type === 'select' ? (
                              <FormControl fullWidth variant="outlined">
                                <InputLabel>{field.label} {field.required && '*'}</InputLabel>
                                <Select
                                  value={formData.additionalFields[field.name] || ''}
                                  onChange={handleAdditionalFieldChange(field.name)}
                                  label={`${field.label} ${field.required ? '*' : ''}`}
                                  error={Boolean(validationErrors[`additional_${field.name}`])}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                    }
                                  }}
                                >
                                  {field.options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {validationErrors[`additional_${field.name}`] && (
                                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                    {validationErrors[`additional_${field.name}`]}
                                  </Typography>
                                )}
                              </FormControl>
                            ) : field.type === 'checkbox' ? (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.additionalFields[field.name] || false}
                                    onChange={handleAdditionalFieldChange(field.name)}
                                    color="primary"
                                  />
                                }
                                label={field.label}
                              />
                            ) : (
                              <TextField
                                label={field.label}
                                type={field.type}
                                fullWidth
                                variant="outlined"
                                value={formData.additionalFields[field.name] || ''}
                                onChange={handleAdditionalFieldChange(field.name)}
                                required={field.required}
                                error={Boolean(validationErrors[`additional_${field.name}`])}
                                helperText={validationErrors[`additional_${field.name}`]}
                                inputProps={field.type === 'number' ? { min: 0 } : {}}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  }
                                }}
                              />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                </>
              )}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={Boolean(validationErrors.confirmPassword)}
                  helperText={validationErrors.confirmPassword}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
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
                        {formData.firstName} {formData.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography variant="body2" fontWeight="600">{formData.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Company</Typography>
                      <Typography variant="body2" fontWeight="600">{formData.companyName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Industry</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {industryConfig[formData.industry]?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Number of Users</Typography>
                      <Typography variant="body2" fontWeight="600">{formData.numberOfUsers}</Typography>
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
              Join Py360 and start managing your business
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
