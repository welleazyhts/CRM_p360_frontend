import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, Button, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const LeaveManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [leaveForm, setLeaveForm] = useState({
    fromDate: null,
    toDate: null,
    leaveType: '',
    reason: ''
  });
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      cscName: 'Priya Patel',
      fromDate: '2025-02-01',
      toDate: '2025-02-03',
      leaveType: 'Casual',
      status: 'Pending',
      reason: 'Personal work'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSubmitLeave = () => {
    const newLeave = {
      id: leaves.length + 1,
      cscName: 'Current User',
      fromDate: leaveForm.fromDate?.toISOString().split('T')[0],
      toDate: leaveForm.toDate?.toISOString().split('T')[0],
      leaveType: leaveForm.leaveType,
      status: 'Pending',
      reason: leaveForm.reason
    };
    setLeaves([...leaves, newLeave]);
    setLeaveForm({ fromDate: null, toDate: null, leaveType: '', reason: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const renderLeaveForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          CSC Leave Request Form
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="From Date"
              value={leaveForm.fromDate}
              onChange={(date) => setLeaveForm({ ...leaveForm, fromDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="To Date"
              value={leaveForm.toDate}
              onChange={(date) => setLeaveForm({ ...leaveForm, toDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={leaveForm.leaveType}
                onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
              >
                <MenuItem value="Casual">Casual Leave</MenuItem>
                <MenuItem value="Sick">Sick Leave</MenuItem>
                <MenuItem value="Emergency">Emergency Leave</MenuItem>
                <MenuItem value="Annual">Annual Leave</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason (Optional)"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSubmitLeave}>
                Submit
              </Button>
              <Button variant="outlined" onClick={() => setLeaveForm({ fromDate: null, toDate: null, leaveType: '', reason: '' })}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderAdminDashboard = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>CSC Name</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Leave Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.cscName}</TableCell>
              <TableCell>{leave.fromDate}</TableCell>
              <TableCell>{leave.toDate}</TableCell>
              <TableCell>{leave.leaveType}</TableCell>
              <TableCell>
                <Chip
                  label={leave.status}
                  color={getStatusColor(leave.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button size="small" color="success" sx={{ mr: 1 }}>
                  Approve
                </Button>
                <Button size="small" color="error">
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Leave Management
        </Typography>

        <Paper sx={{ width: '100%' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Leave Request" />
            <Tab label="Admin Dashboard" />
            <Tab label="Calendar View" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {currentTab === 0 && renderLeaveForm()}
            {currentTab === 1 && renderAdminDashboard()}
            {currentTab === 2 && (
              <Typography variant="h6">Calendar View - Coming Soon</Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveManagement;