import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Mock users data
const mockUsers = [
  {
    id: 'sarah.johnson',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Sales Manager',
    avatar: null,
    currentLeads: 12,
    closedThisMonth: 8,
    performance: 'High'
  },
  {
    id: 'mike.wilson',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'Sales Representative',
    avatar: null,
    currentLeads: 8,
    closedThisMonth: 5,
    performance: 'Medium'
  },
  {
    id: 'lisa.chen',
    name: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    role: 'Senior Sales Rep',
    avatar: null,
    currentLeads: 15,
    closedThisMonth: 12,
    performance: 'High'
  },
  {
    id: 'david.kumar',
    name: 'David Kumar',
    email: 'david.kumar@company.com',
    role: 'Sales Representative',
    avatar: null,
    currentLeads: 6,
    closedThisMonth: 3,
    performance: 'Low'
  }
];

const LeadAssignment = ({ open, onClose, lead, onAssign, currentAssignee = null }) => {
  const theme = useTheme();
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSelectedUser(currentAssignee);
      setSearchTerm('');
    }
  }, [open, currentAssignee]);

  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'High':
        return theme.palette.success.main;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Low':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) {
      setError('Please select a user to assign the lead to');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAssign(selectedUser);
      onClose();
    } catch (err) {
      setError('Failed to assign lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onAssign(null);
      onClose();
    } catch (err) {
      setError('Failed to unassign lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="h6">
            Assign Lead
          </Typography>
        </Box>
        {lead && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Assigning: {lead.firstName} {lead.lastName} from {lead.company}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Available Team Members ({filteredUsers.length})
        </Typography>

        <List>
          {filteredUsers.map((user, index) => (
            <React.Fragment key={user.id}>
              <ListItem
                button
                selected={selectedUser?.id === user.id}
                onClick={() => setSelectedUser(user)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {user.name}
                      </Typography>
                      <Chip
                        label={user.performance}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getPerformanceColor(user.performance), 0.1),
                          color: getPerformanceColor(user.performance),
                          border: `1px solid ${alpha(getPerformanceColor(user.performance), 0.3)}`,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {user.role} • {user.email}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Current Leads: {user.currentLeads}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Closed This Month: {user.closedThisMonth}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  {selectedUser?.id === user.id && (
                    <CheckCircleIcon color="primary" />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              {index < filteredUsers.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No users found matching your search
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {currentAssignee && (
          <Button
            onClick={handleUnassign}
            color="warning"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Unassigning...' : 'Unassign'}
          </Button>
        )}
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={!selectedUser || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AssignmentIcon />}
        >
          {loading ? 'Assigning...' : 'Assign Lead'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadAssignment;
