import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';

const UserForm = ({ open, onClose, onSave, user, isEditMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'User',
    active: true,
    expiryDate: '',
    neverExpires: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        neverExpires: !user.expiryDate
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'User',
        active: true,
        expiryDate: '',
        neverExpires: false
      });
    }
    setErrors({});
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'neverExpires') {
      setFormData(prev => ({
        ...prev,
        neverExpires: checked,
        expiryDate: checked ? '' : prev.expiryDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'active' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.neverExpires && formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        ...formData,
        expiryDate: formData.neverExpires ? null : formData.expiryDate || null
      };
      delete userData.neverExpires;
      
      onSave(userData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Edit User' : 'Add New User'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            
            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            
            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
              }
              label="Active User"
            />
            
            <FormControlLabel
              control={
                <Switch
                  name="neverExpires"
                  checked={formData.neverExpires}
                  onChange={handleChange}
                />
              }
              label="Account Never Expires"
            />
            
            {!formData.neverExpires && (
              <TextField
                name="expiryDate"
                label="Account Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;