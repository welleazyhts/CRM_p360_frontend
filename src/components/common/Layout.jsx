import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Box, Drawer, Toolbar, Typography, Divider,
  List, ListItem, ListItemIcon, ListItemText, IconButton,
  Avatar, Menu, MenuItem, Tooltip, Badge, useTheme,
  ListItemButton, styled, Button, Collapse,
  Snackbar, Alert, alpha
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  CloudUpload as UploadIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Info as InfoIcon,

  Timeline as TimelineIcon,
  DoneAll as DoneAllIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  Alarm as ReminderIcon,
  Assessment as ReportIcon,
  Assessment as AssessmentIcon,
  RateReview as RateReviewIcon,
  Person as PersonIcon,
  List as ListIcon,
  QuestionAnswer as QRCIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Receipt as ReceiptIcon,
  Group as GroupIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Autorenew as AutorenewIcon,
  Email as EmailIcon,
  Campaign as CampaignIcon,
  Feedback as FeedbackIcon,
  Gavel as GavelIcon,
  WhatsApp as WhatsAppIcon,

  PersonAdd as LeadManagementIcon,
  AccountTree as PipelineIcon,
  AccessTime as AttendanceIcon,
  Assessment as KPIIcon,
  PlayArrow as CheckInIcon,
  Stop as CheckOutIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  ContactPhone as ContactPhoneIcon,
  SupportAgent as SupportAgentIcon,
  MailOutline as CustomerEmailIcon,
  ReportProblem as ComplaintsIcon,
  ThumbsUpDown as FeedbackManagementIcon,
  School as TrainingIcon,
  Phone as PhoneIcon,
  Timer as TimerIcon,
  Schedule as ScheduleIcon,
  AssignmentInd as AutoAssignIcon,
  Task as TaskIcon,
  AttachMoney as CommissionIcon,
  AccountTree as WorkflowIcon,
  Archive as ArchiveIcon,
  ThumbDown as LostLeadsIcon,
  BarChart as MISIcon,
  RecordVoiceOver as CallRecordingIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.js';
import { useThemeMode } from '../../context/ThemeModeContext.js';
import { useNotifications } from '../../context/NotificationsContext.js';
import { usePermissions } from '../../context/PermissionsContext.jsx';
import { useAttendance } from '../../context/AttendanceContext.js';
import NotificationsDialog from '../notifications/Notifications';
import { useTranslation } from 'react-i18next';
import QRCDialog from '../leads/QRCDialog';
import AIBotIcon from './AIBotIcon';


const drawerWidth = 260;

// Styled components for modern navigation
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(164, 215, 225, 0.16)' 
      : 'rgba(164, 215, 225, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(164, 215, 225, 0.24)' 
        : 'rgba(164, 215, 225, 0.12)',
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.04)',
  },
}));

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  const [renewalMenuOpen, setRenewalMenuOpen] = useState(false);
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const [leadMenuOpen, setLeadMenuOpen] = useState(false);
  const [customerMenuOpen, setCustomerMenuOpen] = useState(false);
  const [automationMenuOpen, setAutomationMenuOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [qrcDialog, setQrcDialog] = useState(false);
  const [qrcSnackbar, setQrcSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [expiryWarning, setExpiryWarning] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, getDaysUntilExpiry } = useAuth();
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { hasPermission, hasModuleAccess } = usePermissions();
  const { t } = useTranslation();
  const { 
    isClockedIn, 
    clockInTime, 
    snackbar, 
    handleClockIn, 
    handleClockOut, 
    handleCloseSnackbar 
  } = useAttendance();




  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for account expiry warnings
  useEffect(() => {
    if (currentUser && getDaysUntilExpiry) {
      const daysLeft = getDaysUntilExpiry(currentUser);
      if (daysLeft !== null && daysLeft <= 7 && daysLeft > 0) {
        setExpiryWarning(daysLeft);
      } else {
        setExpiryWarning(null);
      }
    }
  }, [currentUser, getDaysUntilExpiry]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleOpenNotificationsDialog = () => {
    handleNotificationsClose();
    setNotificationsDialogOpen(true);
  };
  
  const handleCloseNotificationsDialog = () => {
    setNotificationsDialogOpen(false);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleRenewalMenuClick = () => {
    setRenewalMenuOpen(!renewalMenuOpen);
  };

  const handleEmailMenuClick = () => {
    setEmailMenuOpen(!emailMenuOpen);
  };

  const handleLeadMenuClick = () => {
    setLeadMenuOpen(!leadMenuOpen);
  };

  const handleCustomerMenuClick = () => {
    setCustomerMenuOpen(!customerMenuOpen);
  };

  const handleAutomationMenuClick = () => {
    setAutomationMenuOpen(!automationMenuOpen);
  };



  const handleQRCOpen = () => {
    setQrcDialog(true);
  };

  const handleQRCSubmit = (data) => {
    setQrcSnackbar({
      open: true,
      message: `${data.type} registered successfully!`,
      severity: 'success'
    });
  };

  const handleCloseQrcSnackbar = () => {
    setQrcSnackbar({ ...qrcSnackbar, open: false });
  };









  // Helper function to determine if an email menu item should be selected
  const isEmailMenuItemSelected = (itemPath) => {
    if (itemPath === '/emails/dashboard') {
      return location.pathname === '/emails/dashboard';
    } else if (itemPath === '/emails/analytics') {
      return location.pathname === '/emails/analytics';
    } else if (itemPath === '/emails/bulk') {
      return location.pathname === '/emails/bulk';
    } else if (itemPath === '/emails') {
      // Select Email Inbox for /emails and email detail routes only
      return location.pathname === '/emails' || 
             location.pathname.startsWith('/emails/detail/');
    }
    return location.pathname === itemPath;
  };

  // Define all menu modules with strict permission checking
  const menuModules = {
    business: {
      items: [
        { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance', permission: 'attendance' },
        { text: 'Leave Management', icon: <CalendarIcon />, path: '/leave-management', permission: 'attendance' },
        { text: 'KPI Management', icon: <KPIIcon />, path: '/kpi', permission: 'kpi' },
      ],
      permissions: ['policy-servicing', 'new-business', 'medical-management', 'leads', 'attendance', 'kpi']
    },
    marketing: {
      items: [
        { text: t('navigation.campaigns'), icon: <CampaignIcon />, path: '/campaigns', permission: 'campaigns' },
      ],
      permissions: ['campaigns', 'templates']
    },
    survey: {
      items: [
        { text: 'Feedback & Surveys', icon: <FeedbackIcon />, path: '/feedback', permission: 'feedback' },
      ],
      permissions: ['feedback', 'survey-designer']
    },
    whatsapp: {
      items: [
        { text: t('navigation.whatsapp'), icon: <WhatsAppIcon />, path: '/whatsapp-flow', permission: 'whatsapp-flow' },
      ],
      permissions: ['whatsapp-flow']
    }
  };

  // Filter menu items based on strict permission checking
  const menuItems = Object.values(menuModules)
    .flatMap(module => module.items)
    .filter(item => hasPermission(item.permission));

  const renewalMenuItems = [
    { text: t('navigation.dashboard'), icon: <DashboardIcon />, path: '/dashboard/renewals', permission: 'dashboard' },
    { text: 'Campaign Management', icon: <UploadIcon />, path: '/upload', permission: 'upload' },
    { text: 'Case Tracking', icon: <AssignmentIcon />, path: '/cases', permission: 'cases' },
    { text: 'Closed Cases', icon: <AssignmentTurnedInIcon />, path: '/closed-cases', permission: 'closed-cases' },
    { text: 'Policy Timeline', icon: <TimelineIcon />, path: '/policy-timeline', permission: 'policy-timeline' },
    { text: 'Policy Proposal Generation', icon: <DocumentIcon />, path: '/policy-proposal', permission: 'cases' },
    { text: 'Template Downloads', icon: <DownloadIcon />, path: '/template-downloads', permission: 'cases' },
    { text: 'Case Logs', icon: <ListIcon />, path: '/logs', permission: 'logs' },
    { text: 'Email Manager', icon: <EmailIcon />, path: '/renewals/email-manager', permission: 'renewal-email-manager' },
    { text: 'WhatsApp Manager', icon: <WhatsAppIcon />, path: '/renewals/whatsapp-manager', permission: 'renewal-whatsapp-manager' },
  ].filter(item => hasPermission(item.permission));

  const emailMenuItems = [
    { text: t('navigation.email') + ' Dashboard', icon: <DashboardIcon />, path: '/emails/dashboard', permission: 'email-dashboard' },
    { text: t('navigation.email') + ' Inbox', icon: <EmailIcon />, path: '/emails', permission: 'emails' },
    { text: 'Bulk ' + t('navigation.email'), icon: <CampaignIcon />, path: '/emails/bulk', permission: 'bulk-email' },
    { text: t('navigation.email') + ' Analytics', icon: <ReportIcon />, path: '/emails/analytics', permission: 'email-analytics' },
  ].filter(item => hasPermission(item.permission));

  const leadMenuItems = [
    { text: 'All Leads', icon: <LeadManagementIcon />, path: '/lead-management', permission: 'leads' },
    { text: 'Assigned Leads', icon: <PersonIcon />, path: '/assigned-leads', permission: 'leads' },
    { text: 'Closed Leads', icon: <CheckCircleIcon />, path: '/closed-leads', permission: 'leads' },
    { text: 'Lost Leads', icon: <LostLeadsIcon />, path: '/lost-leads', permission: 'leads' },
    { text: 'Archived Leads', icon: <ArchiveIcon />, path: '/archived-leads', permission: 'leads' },
    { text: 'Lead Analytics', icon: <AssessmentIcon />, path: '/leads/analytics', permission: 'lead-analytics' },
    { text: 'MIS', icon: <MISIcon />, path: '/leads/mis', permission: 'leads' },
    { text: 'Quote Management', icon: <ReceiptIcon />, path: '/quote-management', permission: 'leads' },
    { text: 'Sales Pipeline', icon: <PipelineIcon />, path: '/pipeline', permission: 'leads' },
    { text: 'QRC Management', icon: <QRCIcon />, path: '/qrc-management', permission: 'leads' },
  ].filter(item => hasPermission(item.permission));

  const customerMenuItems = [
    { text: 'Contact Database', icon: <ContactPhoneIcon />, path: '/customer-management/contact-database', permission: 'contact-database' },
    { text: 'Customer Database', icon: <PeopleIcon />, path: '/customer-management/customer-database', permission: 'customer-database' },
    { text: 'Inbound Service', icon: <SupportAgentIcon />, path: '/customer-management/inbound-service', permission: 'inbound-service' },
    { text: 'Service Email', icon: <CustomerEmailIcon />, path: '/customer-management/service-email', permission: 'service-email' },
    { text: 'Complaints', icon: <ComplaintsIcon />, path: '/customer-management/complaints', permission: 'complaints' },
    { text: 'Feedback', icon: <FeedbackManagementIcon />, path: '/customer-management/feedback', permission: 'feedback' },
    { text: 'Training & Analysis', icon: <TrainingIcon />, path: '/customer-management/training-analysis', permission: 'training-analysis' },
  ].filter(item => hasPermission(item.permission));

  const automationMenuItems = [
    { text: 'Auto-Assignment', icon: <AutoAssignIcon />, path: '/auto-assignment', permission: 'auto_assignment' },
    { text: 'Auto Quote Sharing', icon: <ScheduleIcon />, path: '/auto-quote-sharing', permission: 'settings' },
    { text: 'Workflow Builder', icon: <WorkflowIcon />, path: '/workflows', permission: 'workflows' },
    { text: 'Task Management', icon: <TaskIcon />, path: '/tasks', permission: 'tasks' },
    { text: 'SLA Monitoring', icon: <TimerIcon />, path: '/sla-monitoring', permission: 'sla_monitoring' },
    { text: 'Commission Tracking', icon: <CommissionIcon />, path: '/commissions', permission: 'commissions' },
    { text: 'Call Recording', icon: <CallRecordingIcon />, path: '/call-recording', permission: 'call_recording' },
    { text: 'Call Quality Monitoring', icon: <RateReviewIcon />, path: '/call-quality-monitoring', permission: 'call_quality_monitoring' },
  ].filter(item => hasPermission(item.permission));

  const secondaryMenuItems = [
    { text: t('navigation.profile'), icon: <PersonIcon />, path: '/profile', permission: 'profile' },
    { text: t('navigation.settings'), icon: <SettingsIcon />, path: '/settings', permission: 'settings' },
    { text: 'Billing', icon: <ReceiptIcon />, path: '/billing', permission: 'billing' },
    { text: t('navigation.users'), icon: <GroupIcon />, path: '/users', permission: 'users' },
  ].filter(item => hasPermission(item.permission));

  const drawer = (
    <div>
      <DrawerHeader>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
          Py360
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ px: 1 }}>
        {/* Lead Management Menu - Only show if user has leads permission */}
        {hasPermission('leads') && leadMenuItems.length > 0 && (
          <>
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleLeadMenuClick}>
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  <LeadManagementIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Lead Management"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                />
                {leadMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </StyledListItemButton>
            </ListItem>

            {/* Lead Management Submenu */}
            <Collapse in={leadMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {leadMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <StyledListItemButton
                      onClick={() => handleNavigate(item.path)}
                      selected={location.pathname === item.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 40,
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 600 : 400,
                          color: location.pathname === item.path
                            ? theme.palette.primary.main
                            : theme.palette.text.primary
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

          </>
        )}

        {/* Case Management Menu - Only show if user has renewals module access */}
        {hasModuleAccess('renewals') && (
          <>
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleRenewalMenuClick}>
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  <AutorenewIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('navigation.renewals', 'Case Management')}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                />
                {renewalMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </StyledListItemButton>
            </ListItem>

            {/* Case Management Submenu */}
            <Collapse in={renewalMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renewalMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <StyledListItemButton
                      onClick={() => handleNavigate(item.path)}
                      selected={location.pathname === item.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 40,
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 600 : 400,
                          color: location.pathname === item.path
                            ? theme.palette.primary.main
                            : theme.palette.text.primary
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Email Management Menu - Only show if user has email module access */}
        {hasModuleAccess('email') && (
          <>
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleEmailMenuClick}>
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('navigation.email', 'Emails')}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                />
                {emailMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </StyledListItemButton>
            </ListItem>

            {/* Email Management Submenu */}
            <Collapse in={emailMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {emailMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <StyledListItemButton
                      onClick={() => handleNavigate(item.path)}
                      selected={isEmailMenuItemSelected(item.path)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 40,
                        color: isEmailMenuItemSelected(item.path)
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isEmailMenuItemSelected(item.path) ? 600 : 400,
                          color: isEmailMenuItemSelected(item.path)
                            ? theme.palette.primary.main
                            : theme.palette.text.primary
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Customer Management Menu - Only show if user has any customer management permission */}
        {customerMenuItems.length > 0 && (
          <>
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleCustomerMenuClick}>
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Customer Management"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                />
                {customerMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </StyledListItemButton>
            </ListItem>

            {/* Customer Management Submenu */}
            <Collapse in={customerMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {customerMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <StyledListItemButton
                      onClick={() => handleNavigate(item.path)}
                      selected={location.pathname === item.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 40,
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 600 : 400,
                          color: location.pathname === item.path
                            ? theme.palette.primary.main
                            : theme.palette.text.primary
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {/* Automation Menu - Only show if user has any automation permission */}
        {automationMenuItems.length > 0 && (
          <>
            <ListItem disablePadding>
              <StyledListItemButton onClick={handleAutomationMenuClick}>
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  <WorkflowIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Automation & Tools"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
                />
                {automationMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </StyledListItemButton>
            </ListItem>

            {/* Automation Submenu */}
            <Collapse in={automationMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {automationMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <StyledListItemButton
                      onClick={() => handleNavigate(item.path)}
                      selected={location.pathname === item.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{
                        minWidth: 40,
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 600 : 400,
                          color: location.pathname === item.path
                            ? theme.palette.primary.main
                            : theme.palette.text.primary
                        }}
                      />
                    </StyledListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}





        {/* Main Menu Items */}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{
                minWidth: 40,
                color: location.pathname === item.path
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.primary
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List sx={{ px: 1 }}>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const drawerCollapsed = (
    <div>
      <DrawerHeader>
        <IconButton onClick={handleDrawerOpen}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {/* Lead Management Section - Only show if user has leads permission */}
        {hasPermission('leads') && leadMenuItems.length > 0 && (
          <>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title="Lead Management" placement="right">
                <StyledListItemButton
                  onClick={handleLeadMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary
                    }}
                  >
                    <LeadManagementIcon />
                  </ListItemIcon>
                </StyledListItemButton>
              </Tooltip>
            </ListItem>

            {/* Show lead items */}
            {leadMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'center',
                    px: 2.5,
                    ml: 1,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: '1.2rem'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                </StyledListItemButton>
              </ListItem>
            ))}
          </>
        )}

        {/* Case Management Section - Only show if user has renewals module access */}
        {hasModuleAccess('renewals') && (
          <>
            <ListItem disablePadding sx={{ display: 'block', mt: 1 }}>
              <Tooltip title="Case Management" placement="right">
                <StyledListItemButton
                  onClick={handleRenewalMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary
                    }}
                  >
                    <AutorenewIcon />
                  </ListItemIcon>
                </StyledListItemButton>
              </Tooltip>
            </ListItem>

            {/* Show renewal items when expanded or show main dashboard */}
            {renewalMenuItems.slice(0, 3).map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'center',
                    px: 2.5,
                    ml: 1,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: '1.2rem'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                </StyledListItemButton>
              </ListItem>
            ))}
          </>
        )}

        {/* Emails Section - Only show if user has email module access */}
        {hasModuleAccess('email') && (
          <>
            <ListItem disablePadding sx={{ display: 'block', mt: 1 }}>
              <Tooltip title="Emails" placement="right">
                <StyledListItemButton
                  onClick={handleEmailMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary
                    }}
                  >
                    <EmailIcon />
                  </ListItemIcon>
                </StyledListItemButton>
              </Tooltip>
            </ListItem>

            {/* Show email items */}
            {emailMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={isEmailMenuItemSelected(item.path)}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'center',
                    px: 2.5,
                    ml: 1,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 'auto',
                        justifyContent: 'center',
                        color: isEmailMenuItemSelected(item.path)
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: '1.2rem'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                </StyledListItemButton>
              </ListItem>
            ))}
          </>
        )}

        {/* Customer Management Section - Only show if user has any customer management permission */}
        {customerMenuItems.length > 0 && (
          <>
            <ListItem disablePadding sx={{ display: 'block', mt: 1 }}>
              <Tooltip title="Customer Management" placement="right">
                <StyledListItemButton
                  onClick={handleCustomerMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary
                    }}
                  >
                    <PeopleIcon />
                  </ListItemIcon>
                </StyledListItemButton>
              </Tooltip>
            </ListItem>

            {/* Show customer items */}
            {customerMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'center',
                    px: 2.5,
                    ml: 1,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: '1.2rem'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                </StyledListItemButton>
              </ListItem>
            ))}
          </>
        )}

        {/* Automation Section - Only show if user has any automation permission */}
        {automationMenuItems.length > 0 && (
          <>
            <ListItem disablePadding sx={{ display: 'block', mt: 1 }}>
              <Tooltip title="Automation & Tools" placement="right">
                <StyledListItemButton
                  onClick={handleAutomationMenuClick}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 'auto',
                      justifyContent: 'center',
                      color: theme.palette.text.secondary
                    }}
                  >
                    <WorkflowIcon />
                  </ListItemIcon>
                </StyledListItemButton>
              </Tooltip>
            </ListItem>

            {/* Show automation items */}
            {automationMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <StyledListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'center',
                    px: 2.5,
                    ml: 1,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        fontSize: '1.2rem'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                </StyledListItemButton>
              </ListItem>
            ))}

          </>
        )}





        {/* Main Menu Items */}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mt: 1 }}>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <Tooltip title={item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <StyledListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <Tooltip title={item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 70px)` },
          ml: { sm: open ? `${drawerWidth}px` : 70 },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Clock In/Out Section */}
            {hasPermission('attendance') && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mr: 2,
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                backdropFilter: 'blur(10px)'
              }}>
                {/* Current Time Display */}
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  minWidth: '60px',
                  textAlign: 'center',
                  fontFamily: 'monospace'
                }}>
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true 
                  })}
                </Typography>
                
                {/* Status Divider */}
                <Box sx={{ 
                  width: '1px', 
                  height: '20px', 
                  bgcolor: alpha(theme.palette.divider, 0.3),
                  mx: 1
                }} />
                
                {/* Clock In/Out Button with Status */}
                {!isClockedIn ? (
                  <Tooltip title="Clock In - Click to start your work day">
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      cursor: 'pointer',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`
                      }
                    }} onClick={handleClockIn}>
                      <CheckInIcon sx={{ color: 'success.main', fontSize: 18 }} />
                      <Typography variant="body2" color="success.main" fontWeight="600" sx={{ fontSize: '0.75rem' }}>
                        Clock In
                      </Typography>
                    </Box>
                  </Tooltip>
                ) : (
                  <Tooltip title={`Clock Out - You clocked in at ${clockInTime}`}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      cursor: 'pointer',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`
                      }
                    }} onClick={handleClockOut}>
                      <CheckOutIcon sx={{ color: 'error.main', fontSize: 18 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="body2" color="error.main" fontWeight="600" sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
                          Clock Out
                        </Typography>
                        <Typography variant="caption" color="error.main" sx={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1 }}>
                          In: {clockInTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Tooltip>
                )}
              </Box>
            )}

            {/* Expiry Warning */}
            {expiryWarning && (
              <Tooltip title={`Your account expires in ${expiryWarning} day${expiryWarning > 1 ? 's' : ''}`}>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  sx={{ mr: 2, fontSize: '0.75rem' }}
                >
                  {expiryWarning} day{expiryWarning > 1 ? 's' : ''} left
                </Button>
              </Tooltip>
            )}

            {/* QRC Button - Add Inbound Call */}
            {hasPermission('leads') && (
              <Tooltip title="Add Inbound Call Details">
                <IconButton
                  color="inherit"
                  onClick={handleQRCOpen}
                  sx={{ mr: 1 }}
                >
                  <PhoneIcon />
                </IconButton>
              </Tooltip>
            )}

            <IconButton
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton 
              color="inherit" 
              onClick={() => toggleMode(mode === 'light' ? 'dark' : 'light')}
              sx={{ mr: 2 }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            {currentUser && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  {currentUser.name}
                </Typography>
                
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    edge="end"
                    color="inherit"
                  >
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: theme.palette.primary.main,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentUser.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          
          <Menu
            anchorEl={profileMenuAnchorEl}
            open={Boolean(profileMenuAnchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 180 }
            }}
          >
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/profile');
            }}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => {
              handleProfileMenuClose();
              navigate('/settings');
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { 
                mt: 1.5, 
                width: 350,
                borderRadius: 2,
                overflow: 'hidden'
              }
            }}
          >
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Button 
                  size="small" 
                  onClick={() => handleOpenNotificationsDialog()}
                  startIcon={<DoneAllIcon fontSize="small" />}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Mark all read
                </Button>
              )}
            </Box>
            
            {notifications.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
                  {notifications.slice(0, 5).map((notification) => (
                    <MenuItem 
                      key={notification.id} 
                      sx={{ 
                        py: 1.5,
                        px: 2,
                        borderLeft: notification.read ? 'none' : `4px solid ${theme.palette.primary.main}`,
                        backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.04)
                      }}
                    >
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box 
                          sx={{ 
                            mr: 1.5, 
                            mt: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: alpha(
                              notification.type === 'assignment' ? theme.palette.primary.main :
                              notification.type === 'update' ? theme.palette.info.main :
                              notification.type === 'system' ? theme.palette.warning.main :
                              notification.type === 'document' ? theme.palette.success.main :
                              notification.type === 'reminder' ? theme.palette.error.main :
                              notification.type === 'report' ? theme.palette.secondary.main :
                              theme.palette.grey[500],
                              0.12
                            ),
                            color: 
                              notification.type === 'assignment' ? theme.palette.primary.main :
                              notification.type === 'update' ? theme.palette.info.main :
                              notification.type === 'system' ? theme.palette.warning.main :
                              notification.type === 'document' ? theme.palette.success.main :
                              notification.type === 'reminder' ? theme.palette.error.main :
                              notification.type === 'report' ? theme.palette.secondary.main :
                              theme.palette.grey[500]
                          }}
                        >
                          {notification.type === 'assignment' && <AssignmentIcon fontSize="small" />}
                          {notification.type === 'update' && <UpdateIcon fontSize="small" />}
                          {notification.type === 'system' && <InfoIcon fontSize="small" />}
                          {notification.type === 'document' && <DocumentIcon fontSize="small" />}
                          {notification.type === 'reminder' && <ReminderIcon fontSize="small" />}
                          {notification.type === 'report' && <ReportIcon fontSize="small" />}
                        </Box>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Box 
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: theme.palette.error.main,
                                  ml: 1
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notification.timestamp).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                            {!notification.read && (
                              <Button 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                sx={{ fontSize: '0.7rem', p: 0, minWidth: 'auto', color: theme.palette.text.secondary }}
                              >
                                Mark read
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Box>
                
                <Box sx={{ 
                  p: 1.5, 
                  borderTop: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center' 
                }}>
                  <Button 
                    onClick={handleOpenNotificationsDialog}
                    fullWidth
                    color="primary"
                    size="small"
                  >
                    View all notifications
                  </Button>
                </Box>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: open ? drawerWidth : 70 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: open ? drawerWidth : 70,
              borderRadius: 0,
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {open ? drawer : drawerCollapsed}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${open ? drawerWidth : 70}px)` },
          marginTop: '64px',
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
      
      {/* Notifications Dialog */}
      <NotificationsDialog 
        open={notificationsDialogOpen} 
        onClose={handleCloseNotificationsDialog} 
      />

      {/* AI Bot Icon - Show on all pages */}
      <AIBotIcon />



      {/* Attendance Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* QRC Dialog */}
      <QRCDialog
        open={qrcDialog}
        onClose={() => setQrcDialog(false)}
        onSubmit={handleQRCSubmit}
      />

      {/* QRC Snackbar */}
      <Snackbar
        open={qrcSnackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseQrcSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseQrcSnackbar}
          severity={qrcSnackbar.severity}
          sx={{ width: '100%' }}
        >
          {qrcSnackbar.message}
        </Alert>
      </Snackbar>


    </Box>
  );
};

export default Layout;