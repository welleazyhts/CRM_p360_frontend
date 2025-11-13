import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Switch, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Chip, Tabs, Tab } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon, People as PeopleIcon, AccountTree as HierarchyIcon } from '@mui/icons-material';
import OrganizationHierarchy from '../components/organization/OrganizationHierarchy';

const Users = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Mock user data with expiry dates
    setUsers([
      { id: 1, name: 'Admin User', email: 'admin@example.com', phone: '123-456-7890', role: 'Admin', active: true, expiryDate: null },
      { id: 2, name: 'Regular User', email: 'user@example.com', phone: '098-765-4321', role: 'User', active: true, expiryDate: '2025-12-31' },
      { id: 3, name: 'Inactive User', email: 'inactive@example.com', phone: '555-555-5555', role: 'User', active: false, expiryDate: '2024-06-30' },
      { id: 4, name: 'Expired User', email: 'expired@example.com', phone: '111-222-3333', role: 'User', active: true, expiryDate: '2024-01-15' },
    ]);
  }, []);

  const handleAddUser = () => {
    setCurrentUser({ id: users.length + 1, name: '', email: '', phone: '', role: 'User', active: true, expiryDate: '' });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const getUserStatus = (user) => {
    if (!user.active) return 'inactive';
    if (!user.expiryDate) return 'active';
    
    const today = new Date();
    const expiryDate = new Date(user.expiryDate);
    
    if (today > expiryDate) return 'expired';
    
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7) return 'expiring';
    
    return 'active';
  };

  const getStatusChip = (user) => {
    const status = getUserStatus(user);
    const statusConfig = {
      active: { label: 'Active', color: 'success' },
      inactive: { label: 'Inactive', color: 'default' },
      expired: { label: 'Expired', color: 'error' },
      expiring: { label: 'Expiring Soon', color: 'warning' }
    };
    
    return (
      <Chip 
        label={statusConfig[status].label} 
        color={statusConfig[status].color} 
        size="small"
      />
    );
  };

  const handleEditUser = (user) => {
    setCurrentUser({ ...user });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleActive = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const handleSaveUser = () => {
    if (isEditMode) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      setUsers([...users, currentUser]);
    }
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User & Team Management
      </Typography>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
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
          <Tab icon={<PeopleIcon />} iconPosition="start" label="User Management" />
          <Tab icon={<HierarchyIcon />} iconPosition="start" label="Organization Hierarchy" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser} sx={{ mb: 2 }}>
            Add New User
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : 'No Expiry'}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(user)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditUser(user)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <OrganizationHierarchy />
        </Box>
      )}

      {/* User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {currentUser && (
            <Box component="form" sx={{ pt: 2 }}>
              <TextField
                name="name"
                label="Name"
                value={currentUser.name || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                autoComplete="off"
              />
              <TextField
                name="email"
                label="Email"
                value={currentUser.email || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                autoComplete="off"
              />
              <TextField
                name="phone"
                label="Phone"
                value={currentUser.phone || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                autoComplete="off"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={currentUser.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="expiryDate"
                label="Expiry Date"
                type="date"
                value={currentUser.expiryDate || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                helperText="Leave empty for no expiry"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;