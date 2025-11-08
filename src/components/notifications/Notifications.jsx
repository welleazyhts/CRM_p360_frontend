import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItem,
  Divider,
  Box,
  Chip,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  Description as DocumentIcon,
  Alarm as ReminderIcon,
  Assessment as ReportIcon,
  MarkEmailRead as MarkReadIcon,
  DoneAll as DoneAllIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationsContext';
import { alpha } from '@mui/material/styles';

const Notifications = ({ open, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };
  
  const handleMarkAsRead = (notificationId, event) => {
    if (event) {
      event.stopPropagation();
    }
    markAsRead(notificationId);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <AssignmentIcon />;
      case 'update':
        return <UpdateIcon />;
      case 'system':
        return <InfoIcon />;
      case 'document':
        return <DocumentIcon />;
      case 'reminder':
        return <ReminderIcon />;
      case 'report':
        return <ReportIcon />;
      default:
        return <InfoIcon />;
    }
  };
  
  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'assignment': return 'Assignment';
      case 'update': return 'Update';
      case 'system': return 'System';
      case 'document': return 'Document';
      case 'reminder': return 'Reminder';
      case 'report': return 'Report';
      default: return 'Other';
    }
  };
  
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'assignment': return 'primary';
      case 'update': return 'info';
      case 'system': return 'warning';
      case 'document': return 'success';
      case 'reminder': return 'error';
      case 'report': return 'secondary';
      default: return 'default';
    }
  };
  
  // Filter notifications based on tab and type filter
  const filteredNotifications = notifications.filter(notification => {
    // Filter by read/unread status (tab)
    if (tabValue === 1 && notification.read) return false;
    if (tabValue === 2 && !notification.read) return false;
    
    // Filter by type
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    return true;
  });
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        pb: 1,
        borderBottom: '1px solid', 
        borderColor: 'divider' 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Notifications</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {notifications.filter(n => !n.read).length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose} 
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Box sx={{ 
        px: { xs: 2, sm: 3 }, 
        py: 2, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            minHeight: 'unset',
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          <Tab 
            label="All" 
            sx={{ 
              fontWeight: tabValue === 0 ? 600 : 400,
              minHeight: 'unset',
              px: { xs: 1, sm: 2 }
            }} 
          />
          <Tab 
            label={
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error" max={99}>
                <Box sx={{ pr: 1 }}>Unread</Box>
              </Badge>
            } 
            sx={{ 
              fontWeight: tabValue === 1 ? 600 : 400,
              minHeight: 'unset',
              px: { xs: 1, sm: 2 }
            }}
          />
          <Tab 
            label="Read" 
            sx={{ 
              fontWeight: tabValue === 2 ? 600 : 400,
              minHeight: 'unset',
              px: { xs: 1, sm: 2 }
            }}
          />
        </Tabs>
        
        <Box>
          <Button
            size="small"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "contained" : "outlined"}
            color="primary"
          >
            Filters
          </Button>
        </Box>
      </Box>
      
      {showFilters && (
        <Box sx={{ 
          px: 3, 
          pb: 2, 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2,
          borderBottom: '1px solid', 
          borderColor: 'divider' 
        }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={typeFilter}
              label="Filter by Type"
              onChange={handleTypeFilterChange}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="assignment">Assignment</MenuItem>
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="document">Document</MenuItem>
              <MenuItem value="reminder">Reminder</MenuItem>
              <MenuItem value="report">Report</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      
      <DialogContent sx={{ pt: 2, px: { xs: 1, sm: 2 } }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No notifications found
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => (
              <Paper
                key={notification.id}
                elevation={0}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderLeft: notification.read ? '1px solid' : '4px solid',
                  borderLeftColor: notification.read 
                    ? 'divider' 
                    : (theme) => theme.palette[getNotificationTypeColor(notification.type)].main,
                  backgroundColor: notification.read 
                    ? 'transparent' 
                    : (theme) => alpha(theme.palette[getNotificationTypeColor(notification.type)].main, 0.04)
                }}
              >
                <ListItem 
                  alignItems="flex-start"
                  sx={{ py: 2 }}
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ 
                      mr: 2, 
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: (theme) => alpha(theme.palette[getNotificationTypeColor(notification.type)].main, 0.12),
                      color: (theme) => theme.palette[getNotificationTypeColor(notification.type)].main
                    }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        gap: { xs: 1, sm: 0 }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={getNotificationTypeLabel(notification.type)} 
                            color={getNotificationTypeColor(notification.type)}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                          {!notification.read && (
                            <Chip 
                              label="New" 
                              color="error"
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          {new Date(notification.timestamp).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {notification.message}
                      </Typography>
                      
                      {!notification.read && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            startIcon={<MarkReadIcon />}
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            variant="text"
                          >
                            Mark as read
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Notifications;