import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme
} from '@mui/material';
import {
  PhoneInTalk as DialerIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Coffee as CoffeeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import DialerConfiguration from './DialerConfiguration';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dialer-tabpanel-${index}`}
      aria-labelledby={`dialer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ScheduledDialerSettingsTab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dialerStatus, setDialerStatus] = useState(true);
  const theme = useTheme();

  // Example scheduled calls data
  const scheduledCalls = [
    {
      id: 1,
      leadName: 'Rajesh Kumar',
      phoneNumber: '+91 98765 43210',
      scheduledDateTime: '2024-01-15 10:30 AM',
      status: 'Pending'
    },
    {
      id: 2,
      leadName: 'Priya Sharma',
      phoneNumber: '+91 87654 32109',
      scheduledDateTime: '2024-01-15 11:00 AM',
      status: 'Completed'
    },
    {
      id: 3,
      leadName: 'Amit Patel',
      phoneNumber: '+91 76543 21098',
      scheduledDateTime: '2024-01-15 11:30 AM',
      status: 'Skipped'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Completed': return 'success';
      case 'Skipped': return 'error';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Scheduled Dialer Settings
      </Typography>

      <Paper sx={{ p: 0, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab 
            icon={<DialerIcon />} 
            label="General" 
            iconPosition="start"
          />
          <Tab
            icon={<AccessTimeIcon />}
            label="Office Hours"
            iconPosition="start"
          />
          <Tab
            icon={<EventIcon />}
            label="Holidays"
            iconPosition="start"
          />
          <Tab
            icon={<CoffeeIcon />}
            label="Breaks"
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? (
            // General Settings Tab
            <Grid container spacing={3}>
              {/* Dialer Status */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DialerIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" fontWeight="600">Dialer Status</Typography>
                      </Box>
                      <Chip
                        label={dialerStatus ? 'Active' : 'Paused'}
                        color={dialerStatus ? 'success' : 'error'}
                        icon={dialerStatus ? <CheckCircleIcon /> : <ErrorIcon />}
                      />
                    </Box>

                    <Button
                      variant={dialerStatus ? 'outlined' : 'contained'}
                      color={dialerStatus ? 'error' : 'success'}
                      onClick={() => setDialerStatus(!dialerStatus)}
                      fullWidth
                    >
                      {dialerStatus ? 'Pause Dialer' : 'Start Dialer'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Current Statistics */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Today's Statistics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Scheduled Calls
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {scheduledCalls.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {scheduledCalls.filter(call => call.status === 'Completed').length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Scheduled Calls */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Scheduled Calls
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Lead Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Scheduled Time</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {scheduledCalls.map((call) => (
                            <TableRow key={call.id}>
                              <TableCell>{call.leadName}</TableCell>
                              <TableCell>{call.phoneNumber}</TableCell>
                              <TableCell>{call.scheduledDateTime}</TableCell>
                              <TableCell>
                                <Chip
                                  label={call.status}
                                  color={getStatusColor(call.status)}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            // Configuration Tabs
            <DialerConfiguration defaultTab={
              activeTab === 1 ? 'office-hours' :
              activeTab === 2 ? 'holidays' :
              'breaks'
            } />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ScheduledDialerSettingsTab;