import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Avatar, 
  TextField, Button, Divider, Card, CardContent,
  List, ListItem, ListItemText, ListItemIcon,
  Chip, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, useTheme, alpha, Fade, Grow, InputAdornment
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Client Admin',
    email: currentUser?.email || 'admin@client.com',
    phone: '+1 (555) 123-4567',
    company: 'Insurance Company Name',
    role: 'Client Administrator',
    department: 'Policy Management',
    joinDate: '2024-01-15',
    lastLoginDate: '2024-07-14'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state for animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the profile
    setEditMode(false);
    setSuccessMessage('Profile updated successfully!');
    
    // Auto-dismiss success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleChangePassword = () => {
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    // In a real app, this would call an API to change the password
    setPasswordDialogOpen(false);
    setSuccessMessage('Password changed successfully!');
    
    // Auto-dismiss success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ px: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" fontWeight="600">
            My Profile
          </Typography>
        </Box>
        
        {successMessage && (
          <Grow in={!!successMessage}>
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              {successMessage}
            </Alert>
          </Grow>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Grow in={loaded} timeout={400}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      fontSize: 48,
                      bgcolor: theme.palette.primary.main,
                      mb: 2,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                    }}
                  >
                    {profileData.name.charAt(0).toUpperCase()}
                  </Avatar>
                  
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {profileData.role}
                  </Typography>
                  <Chip 
                    label={profileData.department} 
                    color="primary" 
                    sx={{ 
                      mt: 1,
                      fontWeight: 500,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  
                  <Box sx={{ mt: 3, width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Member since
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, width: '100%' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last login date
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {new Date(profileData.lastLoginDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grow in={loaded} timeout={600}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                  mb: 3
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">Profile Information</Typography>
                    <Button
                      startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                      onClick={editMode ? handleSaveProfile : handleEditToggle}
                      color="primary"
                      variant={editMode ? "contained" : "outlined"}
                      sx={{ 
                        borderRadius: 2,
                        px: 2,
                        boxShadow: editMode ? 2 : 0,
                        transition: 'transform 0.15s',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {editMode ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company"
                        name="company"
                        value={profileData.company}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="action" />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {editMode && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleEditToggle}
                        sx={{ borderRadius: 2 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grow>

            <Grow in={loaded} timeout={800}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Account Security
                  </Typography>
                  <List>
                    <ListItem sx={{ 
                      borderRadius: 2, 
                      bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                      mb: 1,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.03)',
                      }
                    }}>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight="500">Password</Typography>}
                        secondary="Last changed 30 days ago"
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => {
                          setPasswordDialogOpen(true);
                          setPasswordError('');
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        sx={{ 
                          borderRadius: 2,
                          transition: 'transform 0.15s',
                          '&:hover': {
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Change Password
                      </Button>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>

        {/* Password Change Dialog */}
        <Dialog 
          open={passwordDialogOpen} 
          onClose={() => setPasswordDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Change Password</DialogTitle>
          <DialogContent dividers>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {passwordError}
              </Alert>
            )}
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button 
              onClick={() => setPasswordDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangePassword}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Profile;