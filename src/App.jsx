import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout';
import WelcomeModal from './components/common/WelcomeModal';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import CaseTracking from './pages/CaseTracking';
import ClosedCases from './pages/ClosedCases';
import PolicyTimeline from './pages/PolicyTimeline';
import CaseDetails from './pages/CaseDetails';
import CommunicationDetails from './pages/CommunicationDetails';
import Logs from './pages/Logs';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Users from './pages/Users';
import EmailDashboard from './pages/EmailDashboard';
import EmailInbox from './pages/Email';
import EmailDetail from './pages/EmailDetail';
import EmailAnalytics from './pages/EmailAnalytics';
import BulkEmail from './pages/BulkEmail';

import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import TemplateManager from './pages/TemplateManager';
import Feedback from './pages/Feedback';
import SurveyDesigner from './pages/SurveyDesigner';
import Claims from './pages/Claims';
import ClaimsHistory from './pages/ClaimsHistory';
import PolicyServicing from './pages/PolicyServicing';
import NewBusiness from './pages/NewBusiness';
import MedicalManagement from './pages/MedicalManagement';
import WhatsappFlow from './pages/WhatsappFlow';
import RenewalEmailManager from './pages/RenewalEmailManager';
import RenewalWhatsAppManager from './pages/RenewalWhatsAppManager';
import DNCManagement from './pages/DNCManagement';
import LeadManagement from './pages/LeadManagement';
import LeadDetails from './pages/LeadDetails';
import LeadAnalytics from './pages/LeadAnalytics';
import AssignedLeads from './pages/AssignedLeads';
import ClosedLeads from './pages/ClosedLeads';
import LostLeads from './pages/LostLeads';
import ArchivedLeads from './pages/ArchivedLeads';
import LeadMIS from './pages/LeadMIS';
import QuoteManagement from './pages/QuoteManagement';
import LeaveManagement from './pages/LeaveManagement';
import SalesPipeline from './pages/SalesPipeline';
import AttendanceManagement from './pages/AttendanceManagement';
import KPIManagement from './pages/KPIManagement';
import QRCManagement from './pages/QRCManagement';
import ContactDatabase from './pages/ContactDatabase';
import CustomerDatabase from './pages/CustomerDatabase';
import CustomerDetails from './pages/CustomerDetails';
import CustomerProfile from './pages/CustomerProfile';
import AIAgent from './pages/AIAgent';
import InboundCustomerService from './pages/InboundCustomerService';
import PolicyDocumentsTest from './pages/PolicyDocumentsTest';
import InboundCallTest from './pages/InboundCallTest';
import AutoQuoteSharingSettings from './pages/AutoQuoteSharingSettings';
import PolicyProposalGeneration from './pages/PolicyProposalGeneration';
import TemplateDownloads from './pages/TemplateDownloads';
import WhatsAppBotManagement from './pages/WhatsAppBotManagement';
import CustomerServiceEmail from './pages/CustomerServiceEmail';
import ComplaintsManagement from './pages/ComplaintsManagement';
import CustomerFeedback from './pages/CustomerFeedback';
import TrainingAnalysis from './pages/TrainingAnalysis';


import SLAMonitoring from './pages/SLAMonitoring';
import SLASettings from './components/settings/SLASettings';
import AutoAssignmentMonitoring from './pages/AutoAssignmentMonitoring';
import AutoAssignmentSettings from './components/settings/AutoAssignmentSettings';
import TaskManagement from './pages/TaskManagement';
import CommissionTracking from './pages/CommissionTracking';
import WorkflowBuilder from './pages/WorkflowBuilder';

import CallRecording from './pages/CallRecording';
import CallDetails from './pages/CallDetails';
import CallQualityMonitoring from './pages/CallQualityMonitoring';
import CallQualityDetails from './pages/CallQualityDetails';
import CallQualityAnalytics from './pages/CallQualityAnalytics';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardRedirect from './components/common/DashboardRedirect';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext.js';
import { NotificationsProvider } from './context/NotificationsContext.js';
import { PermissionsProvider } from './context/PermissionsContext.jsx';
import SettingsProvider from './context/SettingsContext';
import { ProvidersProvider } from './context/ProvidersContext.jsx';
import { LeadProvider } from './context/LeadContext.js';
import { AttendanceProvider } from './context/AttendanceContext.js';
import { CustomerManagementProvider } from './context/CustomerManagementContext.jsx';
import { DedupeProvider } from './context/DedupeContext.jsx';
import { SLAProvider } from './context/SLAContext.jsx';
import { LeadScoringProvider } from './context/LeadScoringContext.jsx';
import { AutoAssignmentProvider } from './context/AutoAssignmentContext.jsx';
import { TaskManagementProvider } from './context/TaskManagementContext.jsx';
import { CommissionProvider } from './context/CommissionContext.jsx';
import { WorkflowProvider } from './context/WorkflowContext.jsx';
import './i18n'; // Initialize i18n

function AppWithTheme() {
  const { mode } = useThemeMode();
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  
  // Check if the user is a first-time user
  useEffect(() => {
    const hasSeenWelcomeScreen = localStorage.getItem('welcomeScreenSeen');
    if (!hasSeenWelcomeScreen) {
      setWelcomeModalOpen(true);
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    setWelcomeModalOpen(false);
  };
  
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      // Calming Pastel Healthcare Theme - Primary (Soft Blue)
      primary: {
        light: mode === 'dark' ? '#A4D7E1' : '#A4D7E1',
        main: mode === 'dark' ? '#7BC5D3' : '#6B8E23',
        dark: mode === 'dark' ? '#5BA3B5' : '#4A6B1A',
        contrastText: '#ffffff',
      },
      // Calming Pastel Healthcare Theme - Secondary (Soft Mint Green)
      secondary: {
        light: mode === 'dark' ? '#B3EBD5' : '#B3EBD5',
        main: mode === 'dark' ? '#9AE5C7' : '#8BC34A',
        dark: mode === 'dark' ? '#7DD4B3' : '#689F38',
        contrastText: '#ffffff',
      },
      // Success (Soft Green)
      success: {
        main: mode === 'dark' ? '#B3EBD5' : '#4CAF50',
        light: mode === 'dark' ? '#D4F4E3' : '#81C784',
        dark: mode === 'dark' ? '#8BC34A' : '#388E3C',
        contrastText: mode === 'dark' ? '#000000' : '#ffffff',
      },
      // Info (Soft Blue)
      info: {
        main: mode === 'dark' ? '#A4D7E1' : '#2196F3',
        light: mode === 'dark' ? '#C7E8F0' : '#64B5F6',
        dark: mode === 'dark' ? '#7BC5D3' : '#1976D2',
        contrastText: mode === 'dark' ? '#000000' : '#ffffff',
      },
      // Warning (Soft Yellow)
      warning: {
        main: mode === 'dark' ? '#F2C94C' : '#FF9800',
        light: mode === 'dark' ? '#F7D97A' : '#FFB74D',
        dark: mode === 'dark' ? '#E6B845' : '#F57C00',
        contrastText: mode === 'dark' ? '#000000' : '#ffffff',
      },
      // Error (Soft Red)
      error: {
        main: mode === 'dark' ? '#FF8A80' : '#F44336',
        light: mode === 'dark' ? '#FFB3B3' : '#EF5350',
        dark: mode === 'dark' ? '#E57373' : '#D32F2F',
        contrastText: '#ffffff',
      },
      // Grey (Soft Grey)
      grey: {
        main: mode === 'dark' ? '#424242' : '#E0F7FA',
        contrastText: mode === 'dark' ? '#ffffff' : '#000000',
      },
      // Background (Soft Pastel)
      background: {
        default: mode === 'dark' ? '#0a1929' : '#E0F7FA',
        paper: mode === 'dark' ? '#101f33' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.2px',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.1px',
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 16, // More curved edges for a modern look
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'dark' ? '#1e1e1e' : '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'dark' ? '#555' : '#ccc',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'dark' ? '#777' : '#aaa',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: mode === 'dark' ? 'none' : '0 4px 14px 0 rgba(0,118,255,0.15)',
            transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.4)' : '0 6px 20px rgba(0,118,255,0.25)',
            }
          },
          contained: {
            fontWeight: 600,
          },
          outlined: {
            fontWeight: 600,
          }
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'dark' 
              ? '0 8px 24px rgba(0,0,0,0.5)' 
              : '0 10px 28px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 10px 30px rgba(0,0,0,0.7)' 
                : '0 14px 40px rgba(0,0,0,0.12)',
            }
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            overflow: 'hidden',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: mode === 'dark' 
                ? '0 8px 24px rgba(0,0,0,0.6)' 
                : '0 12px 32px rgba(0,0,0,0.1)',
            }
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
          },
          head: {
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
            }
          }
        }
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <PermissionsProvider>
            <ProvidersProvider>
              <SettingsProvider>
                <DedupeProvider>
                  <SLAProvider>
                    <LeadScoringProvider>
                      <AutoAssignmentProvider>
                        <TaskManagementProvider>
                          <CommissionProvider>
                            <WorkflowProvider>
                              <CustomerManagementProvider>
                                <LeadProvider>
                                  <AttendanceProvider>
                                    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/renewals" element={
              <ProtectedRoute requiredPermission="dashboard">
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/upload" element={
              <ProtectedRoute>
                <Layout>
                  <Upload />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases" element={
              <ProtectedRoute>
                <Layout>
                  <CaseTracking />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/closed-cases" element={
              <ProtectedRoute>
                <Layout>
                  <ClosedCases />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/policy-timeline" element={
              <ProtectedRoute>
                <Layout>
                  <PolicyTimeline />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases/:caseId" element={
              <ProtectedRoute>
                <Layout>
                  <CaseDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/communication-details/:caseId" element={
              <ProtectedRoute>
                <Layout>
                  <CommunicationDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/claims-history/:caseId" element={
              <ProtectedRoute>
                <Layout>
                  <ClaimsHistory />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/logs" element={
              <ProtectedRoute>
                <Layout>
                  <Logs />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/billing" element={
              <ProtectedRoute>
                <Layout>
                  <Billing />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect any unknown routes to dashboard */}
            <Route path="/users" element={
              <ProtectedRoute>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/emails" element={
              <ProtectedRoute>
                <Layout>
                  <EmailInbox />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/emails/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <EmailDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/emails/detail/:emailId" element={
              <ProtectedRoute>
                <Layout>
                  <EmailDetail />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/emails/analytics" element={
              <ProtectedRoute>
                <Layout>
                  <EmailAnalytics />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/emails/bulk" element={
              <ProtectedRoute>
                <Layout>
                  <BulkEmail />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/emails/settings" element={<Navigate to="/settings?tab=email" replace />} />
            
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Layout>
                  <Campaigns />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/campaigns/:campaignId" element={
              <ProtectedRoute>
                <Layout>
                  <CampaignDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/templates" element={
              <ProtectedRoute>
                <Layout>
                  <TemplateManager />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Layout>
                  <Feedback />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/survey-designer" element={
              <ProtectedRoute>
                <SurveyDesigner />
              </ProtectedRoute>
            } />
            
            <Route path="/survey-designer/:surveyId" element={
              <ProtectedRoute>
                <SurveyDesigner />
              </ProtectedRoute>
            } />
            
            <Route path="/claims" element={
              <ProtectedRoute>
                <Layout>
                  <Claims />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/policy-servicing" element={
              <ProtectedRoute>
                <Layout>
                  <PolicyServicing />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/new-business" element={
              <ProtectedRoute>
                <Layout>
                  <NewBusiness />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/medical-management" element={
              <ProtectedRoute>
                <Layout>
                  <MedicalManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/whatsapp-flow" element={
              <ProtectedRoute>
                <Layout>
                  <WhatsappFlow />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dnc-management" element={
              <ProtectedRoute requiredPermission="settings">
                <Layout>
                  <DNCManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/renewals/email-manager" element={
              <ProtectedRoute requiredPermission="renewal-email-manager">
                <Layout>
                  <RenewalEmailManager />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/renewals/whatsapp-manager" element={
              <ProtectedRoute requiredPermission="renewal-whatsapp-manager">
                <Layout>
                  <RenewalWhatsAppManager />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/lead-management" element={
              <ProtectedRoute requiredPermission="leads">
                <Layout>
                  <LeadManagement />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/lead-management/:leadId" element={
              <ProtectedRoute requiredPermission="leads">
                <Layout>
                  <LeadDetails />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/assigned-leads" element={
              <ProtectedRoute requiredPermission="leads">
                <Layout>
                  <AssignedLeads />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/closed-leads" element={
              <ProtectedRoute requiredPermission="leads">
                <Layout>
                  <ClosedLeads />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/lost-leads" element={
              <ProtectedRoute requiredPermission="leads">
                <Layout>
                  <LostLeads />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/archived-leads" element={
              <ProtectedRoute requiredPermission="leads">
                <Layout>
                  <ArchivedLeads />
                </Layout>
              </ProtectedRoute>
            } />

                <Route path="/leads/analytics" element={
                  <ProtectedRoute requiredPermission="lead-analytics">
                    <Layout>
                      <LeadAnalytics />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/leads/mis" element={
                  <ProtectedRoute requiredPermission="leads">
                    <Layout>
                      <LeadMIS />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/quote-management" element={
                  <ProtectedRoute requiredPermission="leads">
                    <Layout>
                      <QuoteManagement />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/leave-management" element={
                  <ProtectedRoute requiredPermission="attendance">
                    <Layout>
                      <LeaveManagement />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/pipeline" element={
                  <ProtectedRoute requiredPermission="leads">
                    <Layout>
                      <SalesPipeline />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/qrc-management" element={
                  <ProtectedRoute requiredPermission="leads">
                    <Layout>
                      <QRCManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/attendance" element={
                  <ProtectedRoute requiredPermission="attendance">
                    <Layout>
                      <AttendanceManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/kpi" element={
                  <ProtectedRoute requiredPermission="kpi">
                    <Layout>
                      <KPIManagement />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Customer Management Module */}
                <Route path="/customer-management/contact-database" element={
                  <ProtectedRoute requiredPermission="contact-database">
                    <Layout>
                      <ContactDatabase />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/customer-database" element={
                  <ProtectedRoute requiredPermission="customer-database">
                    <Layout>
                      <CustomerDatabase />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/customer-database/:id" element={
                  <ProtectedRoute requiredPermission="customer-database">
                    <Layout>
                      <CustomerDetails />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Customer Profile (standalone view) */}
                <Route path="/customer-management/customer-profile" element={
                  <ProtectedRoute requiredPermission="customer-database">
                    <Layout>
                      <CustomerProfile />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/customer-profile/:id" element={
                  <ProtectedRoute requiredPermission="customer-database">
                    <Layout>
                      <CustomerProfile />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/inbound-service" element={
                  <ProtectedRoute requiredPermission="inbound-service">
                    <Layout>
                      <InboundCustomerService />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/service-email" element={
                  <ProtectedRoute requiredPermission="service-email">
                    <Layout>
                      <CustomerServiceEmail />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/complaints" element={
                  <ProtectedRoute requiredPermission="complaints">
                    <Layout>
                      <ComplaintsManagement />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/feedback" element={
                  <ProtectedRoute requiredPermission="feedback">
                    <Layout>
                      <CustomerFeedback />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/customer-management/training-analysis" element={
                  <ProtectedRoute requiredPermission="training-analysis">
                    <Layout>
                      <TrainingAnalysis />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* SLA Tracking */}
                <Route path="/sla-monitoring" element={
                  <ProtectedRoute requiredPermission="sla_monitoring">
                    <Layout>
                      <SLAMonitoring />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/settings/sla" element={
                  <ProtectedRoute requiredPermission="settings">
                    <Layout>
                      <SLASettings />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Auto-Assignment */}
                <Route path="/auto-assignment" element={
                  <ProtectedRoute requiredPermission="auto_assignment">
                    <Layout>
                      <AutoAssignmentMonitoring />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/settings/auto-assignment" element={
                  <ProtectedRoute requiredPermission="settings">
                    <Layout>
                      <AutoAssignmentSettings />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Task Management */}
                <Route path="/tasks" element={
                  <ProtectedRoute requiredPermission="tasks">
                    <Layout>
                      <TaskManagement />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Commission Tracking */}
                <Route path="/commissions" element={
                  <ProtectedRoute requiredPermission="commissions">
                    <Layout>
                      <CommissionTracking />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Workflow Builder */}
                <Route path="/workflows" element={
                  <ProtectedRoute requiredPermission="workflows">
                    <Layout>
                      <WorkflowBuilder />
                    </Layout>
                  </ProtectedRoute>
                } />



                {/* Call Recording */}
                <Route path="/call-recording" element={
                  <ProtectedRoute requiredPermission="call_recording">
                    <Layout>
                      <CallRecording />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Call Details */}
                <Route path="/call-details/:callId" element={
                  <ProtectedRoute requiredPermission="call_recording">
                    <Layout>
                      <CallDetails />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Call Quality Monitoring */}
                <Route path="/call-quality-monitoring" element={
                  <ProtectedRoute requiredPermission="call_quality_monitoring">
                    <Layout>
                      <CallQualityMonitoring />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/call-quality-details/:callId" element={
                  <ProtectedRoute requiredPermission="call_quality_monitoring">
                    <Layout>
                      <CallQualityDetails />
                    </Layout>
                  </ProtectedRoute>
                } />

                <Route path="/call-quality-analytics" element={
                  <ProtectedRoute requiredPermission="call_quality_monitoring">
                    <Layout>
                      <CallQualityAnalytics />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* AI Assistant */}
                <Route path="/ai-agent" element={
                  <ProtectedRoute>
                    <Layout>
                      <AIAgent />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Policy Documents Test */}
                <Route path="/test-policy-documents" element={
                  <ProtectedRoute>
                    <Layout>
                      <PolicyDocumentsTest />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Inbound Call Test */}
                <Route path="/test-inbound-call" element={
                  <ProtectedRoute>
                    <Layout>
                      <InboundCallTest />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Auto-Quote Sharing Settings */}
                <Route path="/settings/auto-quotes" element={
                  <ProtectedRoute requiredPermission="settings">
                    <Layout>
                      <AutoQuoteSharingSettings />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Auto Quote Sharing - Standalone page */}
                <Route path="/auto-quote-sharing" element={
                  <ProtectedRoute>
                    <Layout>
                      <AutoQuoteSharingSettings />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* WhatsApp Bot Management */}
                <Route path="/whatsapp-bot-management" element={
                  <ProtectedRoute requiredPermission="whatsapp-flow">
                    <Layout>
                      <WhatsAppBotManagement />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Policy Proposal Generation */}
                <Route path="/policy-proposal" element={
                  <ProtectedRoute>
                    <Layout>
                      <PolicyProposalGeneration />
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Template Downloads */}
                <Route path="/template-downloads" element={
                  <ProtectedRoute>
                    <Layout>
                      <TemplateDownloads />
                    </Layout>
                  </ProtectedRoute>
                } />





            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <WelcomeModal open={welcomeModalOpen} onClose={handleCloseWelcomeModal} />
                                    </Router>
                                  </AttendanceProvider>
                                </LeadProvider>
                              </CustomerManagementProvider>
                            </WorkflowProvider>
                          </CommissionProvider>
                        </TaskManagementProvider>
                      </AutoAssignmentProvider>
                    </LeadScoringProvider>
                  </SLAProvider>
                </DedupeProvider>
              </SettingsProvider>
            </ProvidersProvider>
          </PermissionsProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeModeProvider>
      <NotificationsProvider>
        <AppWithTheme />
      </NotificationsProvider>
    </ThemeModeProvider>
  );
}

export default App;