# User Management System Guide - Intelipro Renewal System

**Last Updated:** January 2025  
**Version:** 2.1 (includes Outstanding Amounts, Social Media Integrations, and Enhanced Analytics)

## Overview
The User Management system provides comprehensive role-based access control (RBAC) for the Intelipro Insurance Policy Renewal System with permissions mapped to actual pages and features. This system ensures secure access control, compliance with industry standards, and efficient user administration.

## Features
- Create and manage users with detailed profiles
- Define custom roles with specific permissions  
- Control access to actual pages and features
- Assign granular permissions to individual users
- Multi-channel campaign management access control
- Upload and data management permissions
- Outstanding amounts and payment management access
- Social media integration permissions
- AI recommendations and customer profiling access
- Channel and hierarchy management controls
- Enhanced analytics and vendor management permissions

## Available Pages & Permissions

### Core Pages
- **Dashboard** (`/`): View main dashboard with analytics and overview
- **Upload Data** (`/upload`): Upload policy data files and create campaigns
- **Case Tracking** (`/cases`): View and manage active cases
- **Closed Cases** (`/closed-cases`): View and manage closed cases
- **Policy Timeline** (`/policy-timeline`): View policy timeline and history
- **Case Logs** (`/logs`): View system and case logs
- **Claims Management** (`/claims`): Manage insurance claims processing

### Enhanced Upload & Campaign Management
- **Data Upload** (`/upload`): 
  - Bulk policy data upload with validation
  - Real-time progress tracking
  - Upload history and audit trail
  - Template download functionality
- **Campaign Creation** (`/upload` - Campaign Dialog):
  - Multi-channel campaign creation (Email, WhatsApp, SMS)
  - Template selection and customization
  - Campaign scheduling and automation
  - Target audience segmentation
- **Campaign Management** (`/campaigns`): 
  - Active campaign monitoring
  - Performance analytics and reporting
  - Campaign pause/resume controls
  - Multi-type campaign support

### Email Management
- **Email Inbox** (`/emails`): Access email inbox and management
- **Email Dashboard** (`/emails/dashboard`): View email analytics and dashboard
- **Email Analytics** (`/emails/analytics`): View detailed email analytics and reports
- **Bulk Email** (`/emails/bulk`): Send bulk emails and campaigns
- **Template Manager** (`/templates`): Manage email and document templates

### Communication Channels
- **WhatsApp Flow** (`/whatsapp-flow`): WhatsApp Business API integration and flow management
- **SMS Campaigns**: Bulk SMS messaging and automation
- **Multi-Channel Campaigns**: Unified campaigns across email, WhatsApp, and SMS

### Survey & Feedback
- **Feedback & Surveys** (`/feedback`): Manage customer feedback and surveys
- **Survey Designer** (`/survey-designer`): Create and design custom surveys

### Administrative Pages
- **Settings** (`/settings`): Access system settings and configuration
- **Billing** (`/billing`): View billing information and invoices
- **User Management** (`/users`): Manage users and permissions

### Personal Pages
- **Profile** (`/profile`): Manage personal profile and account settings

## Enhanced User Roles

### Super Administrator
- **Full Access** to all 22 pages/features
- Can manage users, roles, and system settings
- Full campaign management and analytics access
- **Pages**: All pages including system administration and advanced features

### Campaign Manager
- **Access to 18 pages** - comprehensive campaign and communication management
- Can create, manage, and analyze all types of campaigns
- Full upload and data management capabilities
- **Pages**: All core, email, campaign, communication, and survey pages + profile
- **Excludes**: Settings, Billing, User Management, Advanced System Logs

### Operations Manager
- **Access to 16 pages** - operational management and case handling
- Can manage cases, uploads, and basic campaigns
- Limited administrative access
- **Pages**: All core, email, and basic campaign pages + profile
- **Excludes**: Settings, Billing, User Management, Advanced Campaign Analytics

### Senior Agent
- **Access to 12 pages** - enhanced operational capabilities
- Can handle uploads, create basic campaigns, and manage cases
- **Pages**: Dashboard, Upload, Cases, Closed Cases, Policy Timeline, Email Inbox, Email Dashboard, Basic Campaigns, Profile
- **Excludes**: Advanced analytics, system settings, user management

### Agent
- **Access to 8 pages** - standard operational tasks
- Limited to day-to-day case and email management
- **Pages**: Dashboard, Cases, Closed Cases, Policy Timeline, Logs, Email Inbox, Email Dashboard, Profile

### Viewer
- **Access to 5 pages** - read-only access to basic features
- Cannot modify data or access admin features
- **Pages**: Dashboard, Cases, Closed Cases, Policy Timeline, Profile

## Usage Instructions

### Adding Users
1. Navigate to Settings → User Management tab
2. Click "Add User" button
3. Fill in user details:
   - Personal information (name, email, phone)
   - Department and job title
   - Role assignment
   - Avatar upload (optional)
4. User automatically gets access to pages based on role
5. Click "Create User"

### Creating Custom Roles
1. Click "Create Role" in Roles & Permissions section
2. Enter role details:
   - Role name and display name
   - Unique role ID
   - Description of role purpose
3. Select specific pages by category:
   - Core Operations
   - Upload & Campaign Management
   - Email & Communication
   - Survey & Feedback
   - Administrative Functions
4. Click "Create Role"

### Managing Campaign Permissions
1. Select user from user list
2. Click permissions button
3. Configure campaign-specific permissions:
   - **Upload Access**: File upload and processing
   - **Campaign Creation**: Multi-channel campaign creation
   - **Campaign Management**: Active campaign monitoring
   - **Analytics Access**: Performance metrics and reporting
   - **Template Management**: Email and communication templates
4. Set channel-specific permissions:
   - Email campaign access
   - WhatsApp campaign access
   - SMS campaign access
5. Click "Update Permissions"

### Managing Individual Page Access
1. Click permissions button for any user
2. Select/deselect specific pages by category
3. See exact page routes and descriptions
4. Configure feature-level permissions within pages
5. Changes take effect immediately
6. Click "Update Permissions"

## Enhanced Permission Mapping

Each permission ID directly maps to an actual page route and feature set:

| Permission ID | Page Route | Description | Features |
|---------------|------------|-------------|----------|
| `dashboard` | `/` | Main dashboard | Analytics, KPIs, trends |
| `upload` | `/upload` | Data upload & campaigns | File upload, campaign creation, history |
| `cases` | `/cases` | Case tracking | Case management, status updates |
| `closed-cases` | `/closed-cases` | Closed cases view | Historical case data |
| `policy-timeline` | `/policy-timeline` | Policy timeline | Policy lifecycle tracking |
| `logs` | `/logs` | System logs | Activity monitoring |
| `claims` | `/claims` | Claims management | Claims processing |
| `emails` | `/emails` | Email inbox | Email management |
| `email-dashboard` | `/emails/dashboard` | Email dashboard | Email analytics |
| `email-analytics` | `/emails/analytics` | Email analytics | Detailed email reports |
| `bulk-email` | `/emails/bulk` | Bulk email sender | Mass email campaigns |
| `campaigns` | `/campaigns` | Marketing campaigns | Campaign management |
| `templates` | `/templates` | Template manager | Email/SMS templates |
| `feedback` | `/feedback` | Feedback & surveys | Customer feedback |
| `survey-designer` | `/survey-designer` | Survey designer | Survey creation |
| `whatsapp-flow` | `/whatsapp-flow` | WhatsApp Flow Management | WhatsApp Business API |
| `settings` | `/settings` | System settings | Configuration |
| `billing` | `/billing` | Billing information | Financial data |
| `users` | `/users` | User management | User administration |
| `profile` | `/profile` | User profile | Personal settings |

## Feature-Level Permissions

### Upload System Permissions
- **File Upload**: Basic file upload capability
- **Campaign Creation**: Create campaigns from uploaded data
- **Multi-Channel Access**: Create email, WhatsApp, and SMS campaigns
- **Template Selection**: Access to template library
- **Scheduling**: Schedule campaigns for future execution
- **Analytics View**: View campaign performance metrics

### Campaign Management Permissions
- **Campaign Creation**: Create new campaigns
- **Campaign Editing**: Modify existing campaigns
- **Campaign Control**: Pause, resume, stop campaigns
- **Performance Analytics**: View detailed campaign metrics
- **Audience Segmentation**: Create targeted campaigns
- **Multi-Channel Management**: Manage across email, WhatsApp, SMS

### Email System Permissions
- **Inbox Access**: View and manage email inbox
- **Email Composition**: Create and send emails
- **Template Management**: Create and edit email templates
- **Bulk Operations**: Send bulk emails
- **Analytics Access**: View email performance metrics

## Developer Integration

### Using Permission Guards
```jsx
import PermissionGuard from '../components/common/PermissionGuard';

// Protect specific features
<PermissionGuard permission="upload" feature="campaign-creation">
  <CampaignCreationButton />
</PermissionGuard>

// Protect multi-channel features
<PermissionGuard permission="campaigns" feature="multi-channel">
  <MultiChannelCampaignOptions />
</PermissionGuard>
```

### Using Permission Hooks
```jsx
import { usePermissions } from '../context/PermissionsContext';

const { hasPermission, canAccessFeature } = usePermissions();

// Check page access
if (hasPermission('upload')) {
  // Show upload page
}

// Check feature access
if (canAccessFeature('upload', 'campaign-creation')) {
  // Show campaign creation features
}

// Check multi-channel permissions
if (canAccessFeature('campaigns', 'whatsapp')) {
  // Show WhatsApp campaign options
}
```

### Campaign Permission Validation
```jsx
const CampaignCreationDialog = () => {
  const { canAccessFeature } = usePermissions();
  
  const availableChannels = [
    canAccessFeature('campaigns', 'email') && 'email',
    canAccessFeature('campaigns', 'whatsapp') && 'whatsapp',
    canAccessFeature('campaigns', 'sms') && 'sms'
  ].filter(Boolean);
  
  return (
    <Dialog>
      <ChannelSelector channels={availableChannels} />
    </Dialog>
  );
};
```

## Security Features

### Page-Level Protection
- **Route Guards**: Each route requires specific permission
- **Real Page Mapping**: Permissions directly correspond to actual application pages
- **Dynamic Navigation**: Menu automatically adapts to user permissions
- **Feature Toggles**: Granular control over page features

### Feature-Level Security
- **Upload Restrictions**: File type and size validation based on permissions
- **Campaign Limits**: Channel access based on user role
- **Template Access**: Restricted template library based on permissions
- **Analytics Filtering**: Data visibility based on user role

### Advanced Security
- **Multi-Factor Authentication**: Enhanced security for admin users
- **Session Management**: Secure token handling and refresh
- **Audit Logging**: Complete activity tracking for compliance
- **IP Restrictions**: Optional IP-based access control
- **Rate Limiting**: API call limits based on user role

## Compliance & Auditing

### Activity Tracking
- User login/logout events
- Page access attempts
- Feature usage patterns
- Campaign creation and modifications
- File upload activities
- Permission changes

### Compliance Features
- **GDPR Compliance**: Data protection and privacy controls
- **SOX Compliance**: Financial data access controls
- **Industry Standards**: Insurance industry compliance features
- **Data Retention**: Configurable data retention policies

## Best Practices

### Role Design
1. **Principle of Least Privilege**: Grant minimum necessary permissions
2. **Role Hierarchy**: Create logical role progression
3. **Regular Review**: Periodic permission audits
4. **Documentation**: Clear role descriptions and responsibilities

### User Management
1. **Onboarding**: Structured user creation process
2. **Training**: Role-specific training programs
3. **Monitoring**: Regular activity monitoring
4. **Offboarding**: Secure user deactivation process

### Security Maintenance
1. **Regular Audits**: Quarterly permission reviews
2. **Access Reviews**: Monthly access validation
3. **Security Updates**: Timely security patch application
4. **Incident Response**: Clear security incident procedures

---

**Comprehensive user management for secure and efficient insurance policy renewal operations** 