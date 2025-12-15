# PY360 CRM - Complete Feature List with Fields

## System Overview
**PY360** is an enterprise-grade Customer Relationship Management (CRM) system designed for insurance renewals, lead management, customer service, and comprehensive business operations. Built with React 18+, Material-UI, and supporting 13 Indian languages.

---

# TABLE OF CONTENTS

1. [Authentication & Security](#1-authentication--security)
2. [Renewal Management Module](#2-renewal-management-module)
3. [Lead Management Module](#3-lead-management-module)
4. [Customer Management Module](#4-customer-management-module)
5. [Email Management Module](#5-email-management-module)
6. [Campaigns & Marketing Module](#6-campaigns--marketing-module)
7. [Policy & Insurance Operations](#7-policy--insurance-operations)
8. [Communication & Messaging](#8-communication--messaging)
9. [Sales Pipeline Management](#9-sales-pipeline-management)
10. [Task & Workflow Automation](#10-task--workflow-automation)
11. [Human Resources & Attendance](#11-human-resources--attendance)
12. [Performance & KPI Management](#12-performance--kpi-management)
13. [Call Center Management](#13-call-center-management)
14. [Settings & Administration](#14-settings--administration)
15. [AI & Intelligent Features](#15-ai--intelligent-features)
16. [Integrations](#16-integrations)
17. [User Interface & Experience](#17-user-interface--experience)
18. [Internationalization](#18-internationalization)

---

# 1. AUTHENTICATION & SECURITY

## 1.1 Login Page

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Email/Password Login | Standard credential-based authentication | Users enter their registered email and password to access the system |
| Session Persistence | Maintains user login state across browser sessions | Authentication tokens are stored in localStorage |
| Account Expiry Checking | Monitors and enforces account validity periods | System checks if user accounts have an expiry date |
| Expiry Warning Banner | Visual notification for accounts nearing expiration | Warning banner appears when accounts will expire within 7 days |

### Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| email | Email | Yes | User's registered email address |
| password | Password | Yes | User's password (masked input) |
| rememberMe | Checkbox | No | Keep user logged in on this device |

---

## 1.2 MFA/OTP Verification

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| OTP Verification | Two-factor authentication via one-time password | 6-digit OTP code required after password verification |
| MFA Enable/Disable | User-configurable MFA settings | Users can toggle MFA from profile settings |

### Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| otpCode | Number (6 digits) | Yes | One-time password sent via email/SMS |

---

## 1.3 User Registration

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| New User Registration | Self-service account creation | New users can create accounts by providing their details |
| Form Validation | Input validation for registration data | All fields validated for proper format |

### Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| firstName | Text | Yes | User's first name |
| lastName | Text | Yes | User's last name |
| email | Email | Yes | Valid email address |
| password | Password | Yes | Minimum 8 characters with complexity |
| confirmPassword | Password | Yes | Must match password field |
| phone | Phone | No | Contact phone number |
| acceptTerms | Checkbox | Yes | Agreement to terms and conditions |

---

## 1.4 User Profile

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| View Profile | Display user account information | View personal details, role, and status |
| Edit Profile | Update personal information | Modify name, contact information, preferences |
| Language Preference | Per-user language setting | Select interface language from 13 options |
| Password Change | Update account password | Change password with verification |

### Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| firstName | Text | Yes | User's first name |
| lastName | Text | Yes | User's last name |
| email | Email | Yes | Email address (read-only) |
| phone | Phone | No | Contact phone number |
| avatar | Image | No | Profile picture |
| language | Dropdown | No | Preferred interface language |
| timezone | Dropdown | No | User's timezone |
| currentPassword | Password | Yes* | Required for password change |
| newPassword | Password | Yes* | New password (min 8 chars) |
| confirmNewPassword | Password | Yes* | Confirm new password |

---

## 1.5 Role & Permission Configuration

### User Roles
| Role | Description | Access Level |
|------|-------------|--------------|
| admin | Full system administrator | All modules and settings |
| client_admin | Client-level administrator | All client modules, limited settings |
| manager | Team manager | Team modules, reports, assignments |
| renewals_specialist | Renewal operations specialist | Renewals module, cases, policies |
| all_modules_manager | Cross-module manager | All operational modules |
| agent | Field/call center agent | Assigned cases, leads, communications |
| viewer | Read-only access | View-only access to assigned modules |

### Permission Groups
| Group | Permissions Included |
|-------|---------------------|
| renewals | view_renewals, edit_renewals, delete_renewals, export_renewals |
| email | view_emails, send_emails, manage_templates |
| business | view_business, edit_business, reports |
| marketing | campaigns, surveys, templates |
| survey | create_surveys, view_responses, analyze_surveys |
| whatsapp | send_whatsapp, manage_templates, view_chats |
| admin | user_management, settings, billing, audit_logs |
| core | dashboard, profile, notifications |

---

# 2. RENEWAL MANAGEMENT MODULE

## 2.1 Renewals Dashboard

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| KPI Overview Cards | Key performance indicators display | Shows total renewals, pending, success rate, SLA compliance |
| Batch Status Tracking | Monitor bulk processing operations | View batch upload progress and status |
| Team Performance Metrics | Agent and team analytics | Performance rankings and statistics |
| Date Range Filtering | Time-based data filtering | Filter by today, week, month, custom range |
| Chart Visualizations | Graphical data display | Line, bar, pie charts for trends |
| Customer Retention Analysis | Retention metrics | Overall retention rate, trends, segments |
| Channel Performance | Distribution channel analytics | Performance by channel type |
| MIS Export | Management reports | Export comprehensive reports |

### Dashboard Statistics Fields
| Field Name | Type | Description |
|------------|------|-------------|
| totalCases | Number | Total renewal cases count |
| inProgress | Number | Cases currently being worked |
| renewed | Number | Successfully renewed cases |
| pendingAction | Number | Cases awaiting action |
| errors | Number | Cases with errors |
| paymentCollected | Currency | Total payment collected |
| paymentPending | Currency | Payment still pending |

### Filter Fields
| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| dateRange | Dropdown | today, week, month, quarter, year, custom | Time period filter |
| startDate | Date | - | Custom start date |
| endDate | Date | - | Custom end date |
| policyType | Dropdown | all, motor, health, life, property | Policy category filter |
| caseStatus | Dropdown | all, new, inProgress, renewed, failed | Status filter |
| selectedTeam | Dropdown | Dynamic list | Team filter |
| selectedTeamMember | Dropdown | Dynamic list | Individual agent filter |
| selectedBatch | Dropdown | Dynamic list | Batch filter |

### MIS Export Fields
| Field Name | Type | Description |
|------------|------|-------------|
| exportDateRange | Dropdown | month, quarter, year, custom |
| exportDataType | Dropdown | all, cases, payments, performance |
| exportFormat | Dropdown | excel, csv, pdf |
| exportPolicyType | Dropdown | Policy type to export |
| exportCaseStatus | Dropdown | Status to export |

### Channel Management Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| channelName | Text | Yes | Channel name |
| channelType | Dropdown | Yes | online, offline, partner |
| status | Dropdown | Yes | active, inactive |
| description | Textarea | No | Channel description |
| targetAudience | Text | No | Target audience |
| costPerLead | Number | No | Cost per lead |
| conversionRate | Number | No | Conversion percentage |
| manager | Dropdown | No | Channel manager |
| budget | Currency | No | Allocated budget |
| autoAssignment | Boolean | No | Enable auto-assignment |
| priority | Dropdown | No | low, medium, high |
| workingHours | Text | No | Operating hours |
| maxCapacity | Number | No | Maximum capacity |

### Hierarchy Management Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| nodeName | Text | Yes | Node name |
| nodeType | Dropdown | Yes | region, state, branch, department, team |
| parentId | Dropdown | No | Parent node |
| managerId | Dropdown | No | Manager assignment |
| description | Textarea | No | Node description |
| budget | Currency | No | Allocated budget |
| targetCases | Number | No | Target case count |
| status | Dropdown | Yes | active, inactive |

### Distribution Channel Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| channelName | Text | Yes | Distribution channel name |
| channelType | Dropdown | Yes | agent, broker, bank, corporate, online, direct |
| status | Dropdown | Yes | active, inactive |
| description | Textarea | No | Channel description |
| contactPerson | Text | No | Primary contact |
| contactEmail | Email | No | Contact email |
| contactPhone | Phone | No | Contact phone |
| commissionRate | Percentage | No | Commission percentage |
| targetRevenue | Currency | No | Revenue target |
| region | Dropdown | No | Geographic region |
| partnerSince | Date | No | Partnership start date |
| agreementType | Dropdown | No | exclusive, non-exclusive |
| validUntil | Date | No | Agreement validity |
| renewalTerms | Textarea | No | Renewal conditions |

---

## 2.2 Case Tracking

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Case List View | Tabular display of all renewal cases | Paginated table with sorting |
| Status Filtering | Filter cases by status | Quick filters for each status |
| Search Functionality | Find specific cases | Search by policy, name, phone, email |
| Bulk Selection | Select multiple cases for actions | Checkbox selection for bulk operations |
| Export to Excel | Download case data | Export filtered data to spreadsheet |
| DNC Check | Do Not Call verification | Check if customer is on DNC list |
| Bulk Status Update | Mass status change | Update multiple cases at once |
| Bulk Assignment | Mass agent assignment | Assign multiple cases to agents |

### Case List Table Columns
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| Case ID | id | Text | Unique case identifier |
| Customer Name | customerName | Text | Policyholder name (clickable) |
| Policy Number | policyNumber | Text | Policy number |
| Status | status | Chip | Current case status |
| Sub-Status | subStatus | Text | Detailed status |
| Policy Status | policyStatus | Text | Pre Due, Due, Lapsed, etc. |
| Agent | agent | Text | Assigned agent name |
| Upload Date | uploadDate | Date | When case was uploaded |
| Priority | isPriority | Boolean | Priority flag |
| Batch ID | batchId | Text | Batch reference |
| Next Follow-Up | nextFollowUpDate | Date | Scheduled follow-up |
| Next Action | nextActionPlan | Text | Planned next action |
| Current Step | currentWorkStep | Text | Workflow step |
| Customer Profile | customerProfile | Text | Normal, HNI |
| Mobile | customerMobile | Phone | Customer phone |
| Language | preferredLanguage | Text | Preferred language |
| Product | productName | Text | Insurance product |
| Category | productCategory | Text | Motor, Health, Life, etc. |
| Channel | channel | Text | Sales channel |
| Sub-Channel | subChannel | Text | Channel detail |
| Comm Channel | currentCommunicationChannel | Text | email, sms, whatsapp, call |
| Last Action | lastActionDate | Date | Last activity date |
| Total Calls | totalCalls | Number | Call attempt count |

### Case Object Fields (Complete)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| id | Text | Auto | Case ID (e.g., CASE-001) |
| customerName | Text | Yes | Customer full name |
| policyNumber | Text | Yes | Policy number |
| status | Dropdown | Yes | Uploaded, Assigned, In Progress, Renewed, Failed, Pending |
| subStatus | Dropdown | Yes | Document Pending, Ready for Renewal, Payment Processing, etc. |
| policyStatus | Dropdown | Yes | Pre Due Stage, Policy Due, Reinstatement |
| agent | Dropdown | No | Assigned agent |
| uploadDate | Date | Auto | Upload timestamp |
| isPriority | Boolean | No | Priority flag |
| batchId | Text | Auto | Batch reference |
| nextFollowUpDate | Date | No | Next follow-up scheduled |
| nextActionPlan | Text | No | Planned action description |
| currentWorkStep | Text | No | Workflow step name |
| customerProfile | Dropdown | No | Normal, HNI (High Net-worth) |
| customerMobile | Phone | Yes | Primary phone |
| preferredLanguage | Dropdown | No | Language preference |
| assignedAgent | Text | No | Assigned agent name |
| productName | Text | Yes | Product name |
| productCategory | Dropdown | Yes | Motor, Health, Life, Property |
| channel | Dropdown | No | Online, Branch, Telecalling, Partner |
| subChannel | Dropdown | No | Website, Mobile App, RM, Inbound |
| currentCommunicationChannel | Dropdown | No | email, sms, whatsapp, call |
| lastActionDate | Date | Auto | Last activity timestamp |
| totalCalls | Number | Auto | Call count |

### Contact Info Object
| Field Name | Type | Description |
|------------|------|-------------|
| email | Email | Customer email |
| phone | Phone | Primary phone |
| alternatePhone | Phone | Secondary phone |

### Policy Details Object
| Field Name | Type | Description |
|------------|------|-------------|
| type | Text | Policy type (Vehicle, Home, Life, Health) |
| expiryDate | Date | Policy expiry date |
| premium | Currency | Premium amount |
| renewalDate | Date | Renewal due date |
| sumInsured | Currency | Coverage amount |

### Comments/Notes Object
| Field Name | Type | Description |
|------------|------|-------------|
| id | Text | Comment ID |
| text | Textarea | Comment content |
| user | Text | Comment author |
| timestamp | DateTime | When posted |
| status | Text | Status at time of comment |
| subStatus | Text | Sub-status at time of comment |

### Filter Options
| Filter | Options |
|--------|---------|
| Status | All, Uploaded, Assigned, In Progress, Renewed, Failed, Pending |
| Policy Status | All, Pre Due Stage, Policy Due, Reinstatement |
| Priority | All, Priority Only, Non-Priority |
| Agent | All, Unassigned, [Agent List] |
| Batch | All, [Batch List] |
| Date Range | Today, This Week, This Month, Custom |

---

## 2.3 Case Details

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Policy Information Display | Complete policy data | All policy details in structured layout |
| Customer Information | Policyholder details | Contact, address, preferences |
| Communication History | Log of all interactions | Timeline of all communications |
| Activity Timeline | Chronological case events | All activities in order |
| Notes & Comments | Case annotations | Internal notes and history |
| Document Attachments | Associated files | Policy copies, proofs, etc. |
| Status Update | Change case status | With disposition and notes |
| Send Renewal Notice | Multi-channel notification | Email, SMS, WhatsApp |
| Send Payment Link | Payment collection | Secure payment link generation |
| Verification Status | Email/Phone/PAN verification | Verify customer details |

### Case Detail Tabs
| Tab | Description |
|-----|-------------|
| Overview | Case summary and quick info |
| Policy | Full policy details |
| Customer | Customer information |
| Communication | Interaction history |
| Documents | Attached files |
| History | Activity timeline |
| Notes | Internal comments |

### Renewal Notice Message Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| selectedChannel | Dropdown | Yes | whatsapp, sms, email |
| messageType | Dropdown | Yes | renewal_notice, payment_link |
| customMessage | Textarea | No | Custom message content |

### Payment Link Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| amount | Currency | Yes | Payment amount |
| purpose | Text | No | Payment purpose |
| expiryDays | Number | No | Link validity (days) |
| sendVia.email | Boolean | No | Send via email |
| sendVia.sms | Boolean | No | Send via SMS |
| sendVia.whatsapp | Boolean | No | Send via WhatsApp |

### Verification Status Object
| Field Name | Type | Description |
|------------|------|-------------|
| email.verified | Boolean | Email verification status |
| email.verifiedAt | DateTime | Verification timestamp |
| phone.verified | Boolean | Phone verification status |
| phone.verifiedAt | DateTime | Verification timestamp |
| pan.verified | Boolean | PAN verification status |
| pan.verifiedAt | DateTime | Verification timestamp |

---

## 2.4 Data Upload (Bulk Upload)

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| File Upload | Upload Excel/CSV files | Drag-drop or file browser |
| Template Download | Get upload format | Pre-formatted template |
| Column Mapping | Field alignment | Map file columns to system |
| Validation Report | Upload error details | Row-level error display |
| Error Correction | Fix upload issues | Download failed records |
| Upload History | Past upload records | History with statistics |

### Upload Template Columns (Required)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| Policy Number | Text | Yes | Unique policy identifier |
| Customer Name | Text | Yes | Full name |
| Phone | Phone | Yes | Contact number |
| Email | Email | No | Email address |
| Policy Type | Text | Yes | Policy category |
| Expiry Date | Date | Yes | Policy expiry |
| Premium Amount | Number | Yes | Premium value |
| Sum Insured | Number | No | Coverage amount |

### Upload Template Columns (Optional)
| Column | Type | Description |
|--------|------|-------------|
| Address | Text | Customer address |
| City | Text | City name |
| State | Text | State name |
| Pincode | Text | Postal code |
| Vehicle Number | Text | For motor policies |
| Make | Text | Vehicle make |
| Model | Text | Vehicle model |
| Year | Number | Manufacturing year |
| Agent Code | Text | Assigned agent |
| Channel | Text | Source channel |
| Batch Reference | Text | Custom batch ID |

---

## 2.5 Renewal Email Manager

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Email Campaign Creation | Design campaigns | Create targeted email campaigns |
| Template Selection | Choose templates | Pre-designed email templates |
| Recipient Filtering | Target segments | Filter by criteria |
| Schedule Campaigns | Time delivery | Set send date/time |
| Performance Tracking | Monitor metrics | Open, click, response rates |
| A/B Testing | Compare versions | Test different content |

### Campaign Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| campaignName | Text | Yes | Campaign name |
| templateId | Dropdown | Yes | Email template |
| subject | Text | Yes | Email subject line |
| fromName | Text | No | Sender name |
| replyTo | Email | No | Reply address |
| sendDate | DateTime | Yes | Scheduled send time |
| status | Dropdown | Auto | Draft, Scheduled, Sent |

### Recipient Filter Fields
| Field Name | Type | Description |
|------------|------|-------------|
| policyType | Multi-select | Policy types to include |
| expiryDateFrom | Date | Expiry start range |
| expiryDateTo | Date | Expiry end range |
| status | Multi-select | Case statuses |
| channel | Multi-select | Source channels |
| excludeDNC | Boolean | Exclude DNC list |

---

## 2.6 Renewal WhatsApp Manager

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| WhatsApp Campaign Creation | Design campaigns | Create WhatsApp campaigns |
| Template Management | Manage templates | WhatsApp API templates |
| Bulk Messaging | Mass dispatch | Send to multiple recipients |
| Response Handling | Manage replies | View and respond to messages |
| Delivery Reports | Track status | Delivery and read status |
| Rich Media Support | Attach files | Images, documents, links |

### WhatsApp Campaign Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| campaignName | Text | Yes | Campaign name |
| templateId | Dropdown | Yes | Approved template |
| mediaUrl | URL | No | Media attachment |
| scheduleDate | DateTime | Yes | Send date/time |
| status | Dropdown | Auto | Draft, Scheduled, Sent |

### WhatsApp Template Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| templateName | Text | Yes | Template name |
| language | Dropdown | Yes | Template language |
| category | Dropdown | Yes | Marketing, Transactional, OTP |
| headerType | Dropdown | No | None, Text, Image, Video, Document |
| headerContent | Text/URL | No | Header content |
| bodyText | Textarea | Yes | Message body with variables |
| footerText | Text | No | Footer text |
| buttons | Array | No | Button configurations |
| sampleValues | Array | No | Variable samples for approval |

---

## 2.7 System Logs

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Activity Logs | System event history | All system activities |
| User Action Tracking | Who did what when | User actions logged |
| Audit Trail | Compliance logging | Immutable audit records |
| Log Filtering | Search and filter | By user, action, date |
| Export Logs | Download log data | Export to CSV |

### Log Entry Fields
| Field Name | Type | Description |
|------------|------|-------------|
| timestamp | DateTime | Event timestamp |
| userId | Text | User who performed action |
| userName | Text | User display name |
| action | Text | Action type |
| module | Text | Module name |
| entityType | Text | Entity type affected |
| entityId | Text | Entity identifier |
| details | JSON | Action details |
| ipAddress | Text | User IP address |
| userAgent | Text | Browser/device info |

---

# 3. LEAD MANAGEMENT MODULE

## 3.1 Lead Management Dashboard

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Lead List View | Comprehensive lead display | Paginated table with all leads |
| Quick Search | Fast lead lookup | Search by name, phone, email |
| Advanced Filters | Multi-criteria filtering | Multiple filter combinations |
| Bulk Operations | Mass lead actions | Assign, status change, export |
| Lead Import | Upload lead files | Excel/CSV import |
| Quick Add Lead | Fast lead creation | Minimal field quick add |
| Column Customization | Personalize display | Choose visible columns |
| Saved Views | Store filter configs | Save frequently used filters |
| Lead Scoring Display | Quality indicator | Visual score display |
| Duplicate Detection | Find duplicates | Identify potential duplicates |
| Vahan Integration | Vehicle data fetch | Get vehicle details |

### Lead List Table Columns
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| ID | id | Number | Lead ID |
| Name | firstName + lastName | Text | Full name |
| Email | email | Email | Email address |
| Phone | phone | Phone | Contact number |
| Company | company | Text | Company name |
| Position | position | Text | Job title |
| Source | source | Text | Lead source |
| Status | status | Chip | Lead status |
| Priority | priority | Chip | Hot, Warm, Cold |
| Lead Type | leadType | Chip | Premium, Regular |
| Assigned To | assignedTo | Text | Agent name |
| Value | value | Currency | Expected value |
| Score | score | Number | Lead score |
| Close Date | expectedCloseDate | Date | Expected close |
| Last Contact | lastContactDate | Date | Last interaction |
| Language | preferredLanguage | Text | Preferred language |
| Total Calls | totalCalls | Number | Call count |
| Created | createdAt | Date | Creation date |

### Lead Object Fields (Complete)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| id | Number | Auto | Lead ID |
| firstName | Text | Yes | First name |
| lastName | Text | Yes | Last name |
| email | Email | Yes | Email address |
| phone | Phone | Yes | Primary phone |
| alternatePhone | Phone | No | Secondary phone |
| company | Text | No | Company name |
| position | Text | No | Job title/position |
| source | Dropdown | Yes | Website, Referral, Cold Call, Email Campaign, LinkedIn, Trade Show, Partner |
| status | Dropdown | Yes | New, Contacted, Qualified, Proposal, Negotiation, Won, Lost |
| priority | Dropdown | No | Hot, Warm, Cold, High, Medium, Low |
| leadType | Dropdown | No | Premium, Regular |
| assignedTo | Dropdown | No | Assigned agent |
| assignedToId | Text | No | Agent ID |
| value | Currency | No | Expected deal value |
| score | Number | Auto | Lead score (0-100) |
| expectedCloseDate | Date | No | Expected close date |
| lastContactDate | Date | Auto | Last contact date |
| notes | Textarea | No | General notes |
| tags | Multi-select | No | Lead tags |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |
| preferredLanguage | Dropdown | No | Communication language |
| totalCalls | Number | Auto | Call attempt count |
| product | Text | No | Product of interest |
| subProduct | Text | No | Sub-product |
| vehicleRegistrationNumber | Text | No | For motor leads |
| vehicleType | Dropdown | No | Private Car, Commercial, Two Wheeler |

### Filter Fields
| Field Name | Type | Options |
|------------|------|---------|
| status | Multi-select | All statuses |
| priority | Multi-select | Hot, Warm, Cold |
| leadType | Dropdown | All, Premium, Regular |
| source | Multi-select | All sources |
| assignedTo | Dropdown | All agents |
| dateRange | Dropdown | Today, Week, Month, Custom |
| valueMin | Currency | Minimum value |
| valueMax | Currency | Maximum value |
| tags | Multi-select | Available tags |

### Quick Add Lead Fields
| Field Name | Type | Required |
|------------|------|----------|
| firstName | Text | Yes |
| lastName | Text | Yes |
| phone | Phone | Yes |
| email | Email | No |
| source | Dropdown | Yes |
| assignedTo | Dropdown | No |

---

## 3.2 Lead Details

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Contact Information | Lead's personal details | View and edit contact info |
| Multi-Contact Manager | Multiple phone numbers | Manage multiple numbers |
| Lead Scoring | Quality indicator | Score breakdown and history |
| Activity Feed | Lead interaction history | Chronological activities |
| Notes System | Lead annotations | Add and view notes |
| Task Association | Related tasks | Tasks linked to lead |
| Document Tracker | Required documents | Track document collection |
| Policy History | Previous policies | Historical policy data |
| Nominee Details | Beneficiary info | Nominee information |
| Call Logs | Call history | Call records and notes |
| Claims Management | Claims tracking | Claims associated with lead |
| Follow-up Scheduling | Schedule follow-ups | Set reminders |
| Payment Link Generation | Collect payments | Generate payment links |
| Lead Conversion | Convert to customer | Convert with policy details |
| Customer Feedback | Feedback recording | NPS, satisfaction scores |

### Lead Detail Tabs
| Tab | Description |
|-----|-------------|
| Overview | Lead summary and key info |
| Contact | Contact information management |
| Activities | Activity timeline and logs |
| Tasks | Associated tasks |
| Documents | Document collection tracker |
| Policy History | Previous policies |
| Notes | Internal notes |
| Feedback | Customer feedback |

### Contact Information Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| firstName | Text | Yes | First name |
| lastName | Text | Yes | Last name |
| email | Email | Yes | Primary email |
| phone | Phone | Yes | Primary phone |
| alternatePhone | Phone | No | Secondary phone |
| company | Text | No | Company name |
| position | Text | No | Job title |
| address | Textarea | No | Full address |
| city | Text | No | City |
| state | Dropdown | No | State |
| pincode | Text | No | Postal code |

### Multi-Contact Number Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| number | Phone | Yes | Phone number |
| type | Dropdown | Yes | Mobile, Home, Office, WhatsApp |
| isPrimary | Boolean | No | Mark as primary |
| isVerified | Boolean | Auto | Verification status |
| notes | Text | No | Number notes |

### Policy Details Fields (View)
| Field Name | Type | Description |
|------------|------|-------------|
| policyNumber | Text | Policy number |
| policyType | Text | Insurance type |
| policyStatus | Text | Active, Pending, Expired |
| idv | Currency | Insured Declared Value |
| odPremium | Currency | Own Damage premium |
| liabilityPremium | Currency | TP premium |
| addOnPremium | Currency | Add-on premium |
| netPremium | Currency | Net premium |
| gst | Currency | GST amount |
| finalPremium | Currency | Total premium |
| referenceId | Text | Reference ID |
| policyStartDate | Date | Start date |
| policyEndDate | Date | End date |
| paymentFrequency | Dropdown | Annual, Semi-Annual, Quarterly |
| nextPaymentDue | Date | Next payment date |

### Nominee Details Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| nomineeName | Text | Yes | Nominee full name |
| relationship | Dropdown | Yes | Spouse, Child, Parent, Other |
| dateOfBirth | Date | No | Nominee DOB |
| contactNumber | Phone | No | Nominee phone |
| email | Email | No | Nominee email |
| address | Textarea | No | Nominee address |
| nomineePercentage | Number | Yes | Percentage share |

### Task Form Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| task | Text | Yes | Task description |
| dueDate | Date | Yes | Due date |
| assignedTo | Dropdown | No | Assigned agent |
| priority | Dropdown | No | High, Medium, Low |
| status | Dropdown | Auto | Pending, In Progress, Completed |

### Call Log Form Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| type | Dropdown | Yes | Inbound, Outbound |
| duration | Text | Yes | Call duration |
| status | Dropdown | Yes | Completed, No Answer, Busy, Failed |
| notes | Textarea | No | Call notes |
| followUpRequired | Boolean | No | Needs follow-up |
| callRating | Number | No | Call quality (1-5) |

### Claim Form Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| customerName | Text | Yes | Claimant name |
| mobileNumber | Phone | Yes | Contact number |
| emailId | Email | No | Email address |
| insuranceCompany | Text | Yes | Insurance company |
| policyNumber | Text | Yes | Policy number |
| expiryDate | Date | No | Policy expiry |
| claimNumber | Text | Auto | Claim reference |
| claimStatus | Dropdown | Yes | Pending, Processing, Approved, Rejected |
| remarks | Textarea | No | Claim notes |

### Document Types
| Document Type | Description |
|---------------|-------------|
| Registration Certificate | Vehicle RC |
| Previous Policy Copy | Last policy document |
| Inspection Report | Vehicle inspection |
| CKYC Document | KYC verification |
| Customer Declaration | Signed declaration |
| Aadhaar Card | Identity proof |
| PAN Card | Tax ID |
| Driving License | License copy |
| Passport | Passport copy |
| Voter ID | Voter card |
| Bank Statement | Bank records |
| Salary Certificate | Employment proof |
| Income Tax Return | ITR document |
| Address Proof | Residence proof |

### Document Tracker Fields
| Field Name | Type | Description |
|------------|------|-------------|
| documentType | Dropdown | Document category |
| status | Dropdown | Pending, Uploaded, Verified, Rejected |
| uploadedBy | Text | Who uploaded |
| uploadedAt | DateTime | Upload timestamp |
| verifiedBy | Text | Verifier name |
| verifiedAt | DateTime | Verification timestamp |
| notes | Text | Document notes |
| fileUrl | URL | File location |

### Follow-Up Form Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| date | Date | Yes | Follow-up date |
| time | Time | Yes | Follow-up time |
| type | Dropdown | Yes | Call, Email, Meeting, WhatsApp |
| priority | Dropdown | No | High, Medium, Low |
| notes | Textarea | No | Follow-up notes |
| assignedTo | Dropdown | No | Assigned agent |

### Payment Link Form Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| amount | Currency | Yes | Payment amount |
| purpose | Text | No | Payment purpose |
| expiryDays | Number | No | Link validity days |
| sendVia.email | Boolean | No | Send via email |
| sendVia.sms | Boolean | No | Send via SMS |
| sendVia.whatsapp | Boolean | No | Send via WhatsApp |

### Lead Conversion Form Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| productType | Dropdown | Yes | Product type |
| policyNumber | Text | Yes | New policy number |
| premiumAmount | Currency | Yes | Premium amount |
| age | Number | No | Customer age |
| gender | Dropdown | No | Male, Female, Other |
| policyStartDate | Date | Yes | Policy start date |
| policyEndDate | Date | Yes | Policy end date |

### Customer Feedback Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| rating | Number | Yes | Overall rating (1-5) |
| feedback | Textarea | No | Written feedback |
| feedbackDate | Date | Auto | Feedback date |
| feedbackBy | Text | Auto | Collected by |
| recommendationScore | Number | No | NPS score (0-10) |
| satisfactionAreas | Multi-select | No | Satisfied with |
| improvementAreas | Multi-select | No | Needs improvement |
| additionalComments | Textarea | No | Extra comments |

---

## 3.3 Lead Analytics

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Conversion Funnel | Stage-by-stage analysis | Visual funnel with rates |
| Source Performance | Lead origin analysis | Compare source quality |
| Agent Performance | Individual metrics | Per-agent statistics |
| Time-based Analysis | Trend tracking | Metrics over time |
| Custom Reports | Flexible reporting | Build custom reports |
| Dashboard Widgets | KPI visualization | Configurable widgets |

### Analytics Metrics
| Metric | Description |
|--------|-------------|
| Total Leads | Count of all leads |
| New Leads | Leads created in period |
| Qualified Leads | Leads qualified |
| Conversion Rate | Percentage converted |
| Average Deal Value | Average lead value |
| Average Time to Close | Days to conversion |
| Lead Response Time | First contact time |
| Win Rate | Percentage won |
| Loss Rate | Percentage lost |
| By Source | Breakdown by source |
| By Agent | Breakdown by agent |
| By Status | Breakdown by status |

---

## 3.4 Duplicate Lead Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Duplicate Detection | Find potential duplicates | Identify matching leads |
| Duplicate Review | Manual verification | Confirm or dismiss matches |
| Merge Duplicates | Combine records | Merge into single lead |
| Deduplication Rules | Matching criteria | Configure match rules |
| Bulk Deduplication | Mass processing | Process multiple at once |

### Duplicate Match Fields
| Field Name | Type | Description |
|------------|------|-------------|
| matchType | Text | Exact, Fuzzy, Partial |
| matchScore | Number | Similarity percentage |
| matchedFields | Array | Fields that matched |
| lead1 | Object | First lead record |
| lead2 | Object | Second lead record |
| suggestedAction | Text | Merge, Review, Dismiss |
| status | Dropdown | Pending, Reviewed, Merged, Dismissed |

---

# 4. CUSTOMER MANAGEMENT MODULE

## 4.1 Contact Database

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Contact List | All contacts view | Comprehensive contact list |
| Contact Search | Find contacts | Search by any field |
| Contact Filtering | Segment contacts | Filter by type, status |
| Contact Groups | Organize contacts | Create and manage groups |
| Import/Export | Bulk operations | Upload/download contacts |

### Contact Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| firstName | Text | Yes | First name |
| lastName | Text | Yes | Last name |
| email | Email | No | Email address |
| phone | Phone | Yes | Primary phone |
| alternatePhone | Phone | No | Secondary phone |
| type | Dropdown | Yes | Lead, Prospect, Customer, Partner |
| company | Text | No | Company name |
| designation | Text | No | Job title |
| address | Textarea | No | Full address |
| city | Text | No | City |
| state | Dropdown | No | State |
| pincode | Text | No | Postal code |
| status | Dropdown | Yes | Active, Inactive |
| source | Dropdown | No | Contact source |
| groups | Multi-select | No | Contact groups |
| tags | Multi-select | No | Contact tags |
| notes | Textarea | No | General notes |
| createdAt | DateTime | Auto | Creation date |
| updatedAt | DateTime | Auto | Last updated |

---

## 4.2 Customer Database

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Customer List | Active customers view | All active customers |
| Customer Search | Find customers | Search by name, policy, phone |
| Customer Segments | Group customers | Segment by value, product |
| 360-Degree View | Complete picture | All customer data in one place |
| Customer Value Analysis | Value calculation | Lifetime value, premium |

### Customer Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| customerId | Text | Auto | Customer ID |
| firstName | Text | Yes | First name |
| lastName | Text | Yes | Last name |
| email | Email | Yes | Primary email |
| phone | Phone | Yes | Primary phone |
| dateOfBirth | Date | No | Date of birth |
| gender | Dropdown | No | Male, Female, Other |
| maritalStatus | Dropdown | No | Single, Married, Other |
| occupation | Text | No | Occupation |
| annualIncome | Currency | No | Annual income |
| address | Textarea | Yes | Full address |
| city | Text | Yes | City |
| state | Dropdown | Yes | State |
| pincode | Text | Yes | Postal code |
| kycStatus | Dropdown | No | Pending, Verified, Rejected |
| kycType | Dropdown | No | Aadhaar, PAN, Passport |
| kycNumber | Text | No | KYC document number |
| segment | Dropdown | No | Premium, Standard, Basic |
| customerSince | Date | Auto | Registration date |
| totalPolicies | Number | Auto | Policy count |
| totalPremium | Currency | Auto | Total premium paid |
| lifetimeValue | Currency | Auto | CLV calculation |
| status | Dropdown | Yes | Active, Inactive, Churned |
| preferredLanguage | Dropdown | No | Communication language |
| communicationPreference | Multi-select | No | Email, SMS, WhatsApp, Call |
| doNotContact | Boolean | No | DNC flag |

---

## 4.3 Customer Profile

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Profile Overview | Customer summary | Key metrics and status |
| KYC Information | Know Your Customer | Verification details |
| Policy Portfolio | All policies | Customer's policies |
| Claims History | Past claims | All claims filed |
| Communication Log | Interaction history | All communications |
| Family Tree | Relationships | Family members |
| Preferences | Customer preferences | Communication prefs |
| Relationship History | Customer journey | Timeline of relationship |

### KYC Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| kycType | Dropdown | Yes | Aadhaar, PAN, Passport, Voter ID |
| kycNumber | Text | Yes | Document number |
| kycStatus | Dropdown | Yes | Pending, Verified, Rejected |
| verificationDate | Date | Auto | When verified |
| verifiedBy | Text | Auto | Verifier name |
| expiryDate | Date | No | Document expiry |
| documentUrl | URL | No | Document file |

### Family Member Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| name | Text | Yes | Full name |
| relationship | Dropdown | Yes | Spouse, Child, Parent, Sibling |
| dateOfBirth | Date | No | Date of birth |
| phone | Phone | No | Contact number |
| email | Email | No | Email address |
| isDependent | Boolean | No | Dependent status |
| hasPolicy | Boolean | Auto | Has own policy |

---

## 4.4 Inbound Customer Service

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Inbound Call Screen | Caller info display | Auto-display customer profile |
| Screen Pop | Automatic data display | CTI integration |
| Quick Access | Fast navigation | One-click to records |
| Call Logging | Record call details | Log during/after call |
| Ticket Creation | Create service tickets | Auto-populate from call |

### Inbound Call Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| callerId | Phone | Auto | Calling number |
| customerName | Text | Auto | Matched customer |
| callType | Dropdown | Yes | Query, Complaint, Request, Information |
| callPurpose | Dropdown | Yes | Specific purpose |
| callNotes | Textarea | No | Call notes |
| callDuration | Time | Auto | Call duration |
| callDisposition | Dropdown | Yes | Disposition code |
| followUpRequired | Boolean | No | Needs follow-up |
| createTicket | Boolean | No | Create ticket |
| ticketPriority | Dropdown | No | High, Medium, Low |

---

## 4.5 Complaints Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Complaint Registration | Log complaints | Register new complaints |
| Complaint Tracking | Monitor resolution | Track through stages |
| Escalation Workflow | Escalate issues | Auto/manual escalation |
| Resolution Documentation | Record outcomes | Document resolution |
| Complaint Analytics | Issue analysis | Pattern analysis |

### Complaint Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| complaintId | Text | Auto | Complaint ID |
| customerId | Text | Yes | Customer ID |
| customerName | Text | Auto | Customer name |
| category | Dropdown | Yes | Policy, Claim, Service, Billing, Other |
| subCategory | Dropdown | Yes | Specific issue type |
| priority | Dropdown | Yes | Critical, High, Medium, Low |
| severity | Dropdown | Yes | Major, Minor |
| description | Textarea | Yes | Complaint details |
| attachments | File[] | No | Supporting documents |
| status | Dropdown | Yes | New, Investigating, Resolved, Closed |
| assignedTo | Dropdown | No | Assigned agent |
| dueDate | Date | Auto | Resolution deadline |
| escalationLevel | Number | Auto | Escalation tier |
| escalatedTo | Text | Auto | Escalated to whom |
| resolutionNotes | Textarea | No | Resolution details |
| resolutionDate | Date | Auto | When resolved |
| customerSatisfaction | Number | No | CSAT score (1-5) |
| rootCause | Dropdown | No | Cause category |
| preventiveMeasures | Textarea | No | Prevention steps |
| createdAt | DateTime | Auto | Registration date |
| updatedAt | DateTime | Auto | Last updated |

---

## 4.6 Customer Feedback

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Feedback Collection | Gather customer input | Multiple collection channels |
| NPS Tracking | Net Promoter Score | Track and analyze NPS |
| CSAT Measurement | Customer satisfaction | Satisfaction scores |
| Feedback Analysis | Insights from feedback | Theme and sentiment analysis |
| Closed-Loop Feedback | Follow-up on feedback | Act on negative feedback |

### Feedback Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| feedbackId | Text | Auto | Feedback ID |
| customerId | Text | Yes | Customer ID |
| customerName | Text | Auto | Customer name |
| feedbackType | Dropdown | Yes | Survey, Call, Email, In-App |
| npsScore | Number | No | NPS (0-10) |
| csatScore | Number | No | CSAT (1-5) |
| overallRating | Number | No | Overall rating (1-5) |
| comments | Textarea | No | Open feedback |
| touchpoint | Dropdown | No | Where collected |
| productFeedback | Textarea | No | Product comments |
| serviceFeedback | Textarea | No | Service comments |
| processFeedback | Textarea | No | Process comments |
| wouldRecommend | Boolean | No | Would recommend |
| followUpRequired | Boolean | Auto | Needs follow-up |
| followUpStatus | Dropdown | No | Pending, Completed |
| sentiment | Dropdown | Auto | Positive, Neutral, Negative |
| collectedAt | DateTime | Auto | Collection date |
| collectedBy | Text | Auto | Collector name |

---

# 5. EMAIL MANAGEMENT MODULE

## 5.1 Email Inbox

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Unified Inbox | All emails in one place | View from connected accounts |
| Email Threading | Conversation grouping | Group related emails |
| Folder Management | Organize emails | Standard + custom folders |
| Email Tagging | Categorize emails | Apply tags/labels |
| Search Functionality | Find emails | Full-text search |
| Bulk Actions | Mass operations | Mark, archive, delete |

### Email Fields
| Field Name | Type | Description |
|------------|------|-------------|
| messageId | Text | Email message ID |
| subject | Text | Email subject |
| from | Email | Sender address |
| to | Email[] | Recipients |
| cc | Email[] | CC recipients |
| bcc | Email[] | BCC recipients |
| date | DateTime | Send/receive date |
| body | HTML | Email content |
| attachments | File[] | Attached files |
| isRead | Boolean | Read status |
| isStarred | Boolean | Starred flag |
| folder | Dropdown | Folder location |
| tags | Multi-select | Email tags |
| linkedEntity | Object | Linked CRM record |

### Email Settings Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| accountName | Text | Yes | Account display name |
| emailAddress | Email | Yes | Email address |
| imapHost | Text | Yes | IMAP server |
| imapPort | Number | Yes | IMAP port |
| smtpHost | Text | Yes | SMTP server |
| smtpPort | Number | Yes | SMTP port |
| username | Text | Yes | Login username |
| password | Password | Yes | Login password |
| useSsl | Boolean | Yes | Use SSL |
| pollingInterval | Number | No | Sync frequency (minutes) |
| autoTagging | Boolean | No | Enable auto-tagging |
| aiClassification | Boolean | No | Enable AI classification |
| sentimentAnalysis | Boolean | No | Enable sentiment |
| signature | HTML | No | Email signature |

---

## 5.2 Email Analytics

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Campaign Analytics | Email campaign metrics | Opens, clicks, conversions |
| Engagement Analysis | Recipient behavior | How recipients engage |
| Time Analysis | Optimal timing | Best send times |
| A/B Test Results | Comparison analysis | Version comparison |
| Deliverability Reports | Delivery status | Bounces, spam |

### Email Analytics Metrics
| Metric | Description |
|--------|-------------|
| Total Sent | Emails sent |
| Delivered | Successfully delivered |
| Bounced | Failed delivery |
| Opened | Emails opened |
| Open Rate | % opened |
| Clicked | Links clicked |
| Click Rate | % clicked |
| Replied | Replies received |
| Reply Rate | % replied |
| Unsubscribed | Opt-outs |
| Spam Reports | Marked as spam |
| Conversion Rate | % converted |

---

## 5.3 Bulk Email

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Mass Email Creation | Build bulk campaigns | Create multi-recipient emails |
| Recipient Selection | Target audience | Select from CRM |
| Template Usage | Pre-designed emails | Use templates |
| Personalization | Dynamic content | Merge fields |
| Scheduling | Timed delivery | Set send time |
| Throttling | Sending rate control | Control pace |

### Bulk Email Campaign Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| campaignName | Text | Yes | Campaign name |
| subject | Text | Yes | Email subject |
| template | Dropdown | No | Email template |
| fromName | Text | Yes | Sender name |
| fromEmail | Email | Yes | Sender email |
| replyTo | Email | No | Reply address |
| recipients | Object | Yes | Recipient selection |
| content | HTML | Yes | Email body |
| personalizations | Object | No | Merge fields |
| scheduleDate | DateTime | No | Scheduled send |
| sendImmediately | Boolean | No | Send now |
| throttleRate | Number | No | Emails per hour |
| trackOpens | Boolean | No | Track opens |
| trackClicks | Boolean | No | Track clicks |
| status | Dropdown | Auto | Draft, Scheduled, Sending, Sent |

---

# 6. CAMPAIGNS & MARKETING MODULE

## 6.1 Campaign Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Campaign Creation | Build marketing campaigns | Multi-channel campaigns |
| Campaign Types | Various formats | Email, SMS, WhatsApp, Call |
| Audience Selection | Target definition | Filters, segments, lists |
| Campaign Scheduling | Timing control | Set schedule |
| Campaign Status | Lifecycle management | Track status |
| Campaign Cloning | Duplicate campaigns | Quick duplication |

### Campaign Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| campaignId | Text | Auto | Campaign ID |
| name | Text | Yes | Campaign name |
| type | Dropdown | Yes | Email, SMS, WhatsApp, Multi-channel, Calling |
| objective | Dropdown | No | Awareness, Conversion, Retention |
| status | Dropdown | Yes | Draft, Scheduled, Active, Paused, Completed |
| startDate | Date | Yes | Start date |
| endDate | Date | No | End date |
| budget | Currency | No | Campaign budget |
| targetAudience | Object | Yes | Audience criteria |
| audienceSize | Number | Auto | Estimated reach |
| channels | Multi-select | Yes | Channels to use |
| content | Object | Yes | Channel content |
| schedule | Object | No | Send schedule |
| goals | Object | No | Campaign goals |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

### Audience Selection Fields
| Field Name | Type | Description |
|------------|------|-------------|
| type | Dropdown | All, Segment, Custom, Upload |
| segment | Dropdown | Pre-defined segment |
| filters | Object | Custom filter criteria |
| uploadFile | File | Uploaded list |
| excludeDNC | Boolean | Exclude DNC |
| excludeOptOut | Boolean | Exclude opt-outs |

---

## 6.2 Template Manager

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Template Library | All templates view | Browse all templates |
| Template Creation | Build new templates | Rich editor |
| Template Editing | Modify templates | Version tracking |
| Template Categories | Organize templates | Category grouping |
| Template Variables | Dynamic content | Placeholder variables |
| Template Preview | Test appearance | Preview with data |
| Template Approval | Approval workflow | WhatsApp approval |

### Template Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| templateId | Text | Auto | Template ID |
| name | Text | Yes | Template name |
| type | Dropdown | Yes | Email, SMS, WhatsApp |
| category | Dropdown | Yes | Renewal, Welcome, Follow-up, Promotional |
| subject | Text | Email only | Email subject |
| content | HTML/Text | Yes | Template content |
| variables | Array | No | Variable placeholders |
| language | Dropdown | No | Template language |
| status | Dropdown | Yes | Draft, Active, Archived |
| approvalStatus | Dropdown | WhatsApp | Pending, Approved, Rejected |
| previewUrl | URL | Auto | Preview link |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |
| updatedAt | DateTime | Auto | Last update |

### Template Variable Fields
| Field Name | Type | Description |
|------------|------|-------------|
| name | Text | Variable name |
| type | Dropdown | Text, Number, Date, Currency |
| defaultValue | Text | Default value |
| required | Boolean | Is required |
| sampleValue | Text | Sample for preview |

---

## 6.3 Survey Designer

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Survey Builder | Create surveys | Drag-and-drop builder |
| Question Types | Diverse questions | Multiple choice, rating, text |
| Conditional Logic | Smart surveys | Skip logic, branching |
| Survey Branding | Customize appearance | Logo, colors, styling |
| Survey Distribution | Send surveys | Email, SMS, WhatsApp |
| Response Collection | Gather answers | Real-time results |
| Survey Preview | Test surveys | Preview flow |
| Multi-language | Localized surveys | Multiple languages |

### Survey Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| surveyId | Text | Auto | Survey ID |
| title | Text | Yes | Survey title |
| description | Textarea | No | Survey description |
| type | Dropdown | Yes | NPS, CSAT, Custom |
| status | Dropdown | Yes | Draft, Active, Closed |
| startDate | Date | No | Active from |
| endDate | Date | No | Active until |
| targetResponses | Number | No | Goal responses |
| currentResponses | Number | Auto | Received count |
| questions | Array | Yes | Survey questions |
| branding | Object | No | Visual settings |
| thankYouMessage | Text | No | Completion message |
| redirectUrl | URL | No | Post-survey redirect |
| allowAnonymous | Boolean | No | Anonymous responses |
| languages | Multi-select | No | Available languages |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

### Question Types & Fields
| Question Type | Fields |
|---------------|--------|
| Multiple Choice | question, options, allowMultiple, required |
| Single Choice | question, options, required |
| Rating Scale | question, minValue, maxValue, labels, required |
| NPS | question, required (0-10 scale) |
| Text (Short) | question, maxLength, required |
| Text (Long) | question, maxLength, required |
| Matrix | question, rows, columns, required |
| Ranking | question, items, required |
| Date | question, required |
| File Upload | question, allowedTypes, maxSize, required |

---

# 7. POLICY & INSURANCE OPERATIONS

## 7.1 Claims Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Claims List | All claims view | View all claims with filters |
| Claim Registration | Log new claims | Register new claims |
| Claim Workflow | Status progression | Track through stages |
| Document Upload | Claim evidence | Upload supporting docs |
| Surveyor Assignment | Allocate assessors | Assign for inspection |
| Settlement Processing | Claim payout | Process approved claims |
| Claim Timeline | Activity history | Chronological events |

### Claim Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| claimId | Text | Auto | Claim ID |
| claimNumber | Text | Auto | Claim reference |
| policyNumber | Text | Yes | Policy number |
| policyType | Dropdown | Auto | Policy type |
| customerId | Text | Yes | Customer ID |
| customerName | Text | Auto | Customer name |
| claimType | Dropdown | Yes | Accident, Theft, Fire, Health, Death |
| claimSubType | Dropdown | No | Specific type |
| incidentDate | Date | Yes | When incident occurred |
| reportedDate | Date | Auto | When reported |
| description | Textarea | Yes | Incident description |
| location | Text | No | Incident location |
| estimatedAmount | Currency | No | Estimated claim |
| approvedAmount | Currency | No | Approved amount |
| settledAmount | Currency | No | Settled amount |
| status | Dropdown | Yes | Registered, Under Investigation, Approved, Rejected, Settled |
| surveyorId | Dropdown | No | Assigned surveyor |
| surveyorReport | File | No | Survey report |
| surveyDate | Date | No | Survey date |
| documents | File[] | No | Claim documents |
| photos | File[] | No | Incident photos |
| rejectionReason | Textarea | No | If rejected |
| settlementDate | Date | No | When settled |
| paymentMode | Dropdown | No | NEFT, Cheque, UPI |
| paymentReference | Text | No | Payment reference |
| priority | Dropdown | No | High, Medium, Low |
| assignedTo | Dropdown | No | Claim handler |
| remarks | Textarea | No | Internal remarks |
| createdAt | DateTime | Auto | Registration date |
| updatedAt | DateTime | Auto | Last updated |

---

## 7.2 Policy Servicing

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Endorsements | Policy changes | Add/remove coverage |
| Cancellations | Cancel policies | Process cancellations |
| Reinstatement | Restore lapsed | Handle reinstatements |
| Document Issuance | Generate documents | Issue certificates |
| Premium Calculator | Calculate premiums | Tool for calculations |

### Endorsement Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| endorsementId | Text | Auto | Endorsement ID |
| policyNumber | Text | Yes | Policy number |
| endorsementType | Dropdown | Yes | Addition, Deletion, Modification |
| endorsementCategory | Dropdown | Yes | Coverage, Nominee, Address, Vehicle |
| currentValue | Text | Auto | Current value |
| newValue | Text | Yes | New value |
| reason | Textarea | Yes | Reason for change |
| effectiveDate | Date | Yes | When effective |
| premiumImpact | Currency | Auto | Premium change |
| status | Dropdown | Yes | Pending, Approved, Rejected, Processed |
| approvedBy | Text | Auto | Approver |
| approvalDate | Date | Auto | When approved |
| documents | File[] | No | Supporting documents |
| createdBy | Text | Auto | Requester |
| createdAt | DateTime | Auto | Request date |

### Cancellation Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| cancellationId | Text | Auto | Cancellation ID |
| policyNumber | Text | Yes | Policy number |
| cancellationType | Dropdown | Yes | Customer Request, Non-Payment, Fraud |
| reason | Dropdown | Yes | Reason category |
| reasonDetails | Textarea | No | Detailed reason |
| effectiveDate | Date | Yes | Cancellation date |
| refundAmount | Currency | Auto | Refund calculation |
| refundMode | Dropdown | No | NEFT, Cheque, UPI |
| status | Dropdown | Yes | Pending, Approved, Processed |
| approvedBy | Text | Auto | Approver |
| createdBy | Text | Auto | Requester |
| createdAt | DateTime | Auto | Request date |

---

## 7.3 New Business

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Proposal Entry | New policy applications | Enter new proposals |
| Underwriting Workflow | Risk assessment | Route through underwriting |
| Quote Generation | Premium quotation | Generate quotes |
| Policy Issuance | Create new policies | Issue after approval |
| Document Generation | Create policy docs | Auto-generate documents |

### Proposal Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| proposalId | Text | Auto | Proposal ID |
| proposalNumber | Text | Auto | Proposal reference |
| productType | Dropdown | Yes | Insurance product |
| productSubType | Dropdown | Yes | Specific product |
| proposerName | Text | Yes | Proposer name |
| proposerDob | Date | Yes | Date of birth |
| proposerGender | Dropdown | Yes | Gender |
| proposerPhone | Phone | Yes | Contact number |
| proposerEmail | Email | Yes | Email address |
| proposerAddress | Textarea | Yes | Full address |
| sumInsured | Currency | Yes | Coverage amount |
| premiumType | Dropdown | Yes | Annual, Half-yearly, Quarterly, Monthly |
| proposedPremium | Currency | Auto | Calculated premium |
| riskDetails | Object | Yes | Risk-specific fields |
| nomineeDetails | Object | No | Nominee information |
| paymentMode | Dropdown | Yes | Payment method |
| status | Dropdown | Yes | Draft, Submitted, Under Review, Approved, Rejected |
| underwriterRemarks | Textarea | No | UW comments |
| underwriterDecision | Dropdown | No | Accept, Decline, Refer |
| documents | File[] | Yes | Required documents |
| createdBy | Text | Auto | Agent/creator |
| createdAt | DateTime | Auto | Creation date |

---

# 8. COMMUNICATION & MESSAGING

## 8.1 WhatsApp Flow Builder

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Flow Designer | Visual flow creation | Drag-and-drop interface |
| Message Nodes | Define messages | Text, buttons, lists |
| Condition Nodes | Branch logic | Conditional branching |
| Action Nodes | Trigger actions | Update records, send emails |
| Flow Testing | Test conversations | Simulation mode |
| Flow Analytics | Measure performance | Completion rates |

### Flow Node Types
| Node Type | Fields | Description |
|-----------|--------|-------------|
| Message | text, buttons, listItems | Send a message |
| Condition | field, operator, value | Branch based on condition |
| Wait | duration, unit | Pause execution |
| Action | actionType, parameters | Execute system action |
| Human Handoff | agentGroup, priority | Transfer to agent |
| End | status | End flow |

### Flow Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| flowId | Text | Auto | Flow ID |
| name | Text | Yes | Flow name |
| description | Textarea | No | Flow description |
| triggerType | Dropdown | Yes | Keyword, Message, Webhook |
| triggerKeywords | Text[] | No | Trigger keywords |
| nodes | Array | Yes | Flow nodes |
| connections | Array | Yes | Node connections |
| status | Dropdown | Yes | Draft, Active, Paused |
| testMode | Boolean | No | Enable test mode |
| analytics | Object | Auto | Performance data |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

---

## 8.2 WhatsApp Bot Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Bot Configuration | Set up chatbot | Configure behavior |
| Intent Recognition | Understand messages | Configure intents |
| Response Management | Bot replies | Define responses |
| Human Handoff | Agent transfer | Configure handoff rules |
| Bot Analytics | Performance metrics | Track performance |

### Bot Configuration Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| botName | Text | Yes | Bot display name |
| welcomeMessage | Textarea | Yes | Initial greeting |
| fallbackMessage | Textarea | Yes | Unknown intent response |
| handoffKeywords | Text[] | No | Agent transfer triggers |
| handoffMessage | Textarea | No | Handoff announcement |
| operatingHours | Object | No | Active hours |
| language | Dropdown | No | Primary language |
| responseDelay | Number | No | Delay in seconds |
| status | Dropdown | Yes | Active, Inactive |

### Intent Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| intentName | Text | Yes | Intent name |
| trainingPhrases | Text[] | Yes | Example phrases |
| response | Textarea | Yes | Bot response |
| actions | Object[] | No | Actions to execute |
| confidence | Number | Auto | Match confidence |

---

# 9. SALES PIPELINE MANAGEMENT

## 9.1 Sales Pipeline

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Kanban View | Visual pipeline | Drag-and-drop board |
| Stage Configuration | Pipeline stages | Configure stages |
| Card Details | Opportunity info | Key info on cards |
| Drag to Update | Move between stages | Drag to change status |
| Pipeline Filtering | Focus views | Filter by criteria |
| Pipeline Metrics | Stage analytics | Metrics per stage |

### Pipeline Stage Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| stageId | Text | Auto | Stage ID |
| name | Text | Yes | Stage name |
| order | Number | Yes | Stage order |
| probability | Number | No | Win probability % |
| color | Color | No | Stage color |
| description | Text | No | Stage description |

### Opportunity Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| opportunityId | Text | Auto | Opportunity ID |
| title | Text | Yes | Opportunity name |
| value | Currency | Yes | Deal value |
| stage | Dropdown | Yes | Pipeline stage |
| probability | Number | Auto | Win probability |
| expectedCloseDate | Date | No | Expected close |
| leadId | Text | No | Associated lead |
| customerId | Text | No | Associated customer |
| productType | Dropdown | No | Product interest |
| assignedTo | Dropdown | Yes | Owner |
| notes | Textarea | No | Notes |
| activities | Array | Auto | Activity log |
| createdAt | DateTime | Auto | Creation date |
| updatedAt | DateTime | Auto | Last updated |

---

## 9.2 Quote Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Quote Creation | Generate quotes | Create premium quotes |
| Quote Templates | Standard formats | Product templates |
| Quote Comparison | Compare options | Multiple options |
| Quote Sending | Digital delivery | Email/WhatsApp |
| Quote Tracking | Monitor status | Track responses |
| Quote Expiry | Validity management | Expiry tracking |

### Quote Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| quoteId | Text | Auto | Quote ID |
| quoteNumber | Text | Auto | Quote reference |
| customerId | Text | Yes | Customer ID |
| customerName | Text | Auto | Customer name |
| productType | Dropdown | Yes | Insurance product |
| productDetails | Object | Yes | Product configuration |
| sumInsured | Currency | Yes | Coverage amount |
| premium | Currency | Auto | Calculated premium |
| premiumBreakdown | Object | Auto | Premium components |
| addOns | Array | No | Selected add-ons |
| discounts | Array | No | Applied discounts |
| validFrom | Date | Auto | Quote date |
| validUntil | Date | Yes | Expiry date |
| status | Dropdown | Yes | Draft, Sent, Viewed, Accepted, Expired, Rejected |
| sentVia | Multi-select | No | Email, SMS, WhatsApp |
| sentAt | DateTime | Auto | When sent |
| viewedAt | DateTime | Auto | When viewed |
| acceptedAt | DateTime | Auto | When accepted |
| rejectionReason | Text | No | If rejected |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

---

## 9.3 Payment Link Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Link Generation | Create payment links | Generate secure links |
| Link Customization | Configure links | Amount, expiry, options |
| Link Distribution | Send links | SMS, Email, WhatsApp |
| Payment Tracking | Monitor payments | Track link status |
| Payment Reconciliation | Match payments | Match to records |

### Payment Link Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| linkId | Text | Auto | Link ID |
| linkUrl | URL | Auto | Payment link URL |
| amount | Currency | Yes | Payment amount |
| currency | Dropdown | No | INR default |
| description | Text | No | Payment description |
| referenceId | Text | No | Custom reference |
| customerName | Text | Yes | Customer name |
| customerEmail | Email | No | Customer email |
| customerPhone | Phone | No | Customer phone |
| expiryDate | DateTime | Yes | Link expiry |
| status | Dropdown | Auto | Created, Sent, Clicked, Paid, Expired, Cancelled |
| sendVia | Object | No | Channels to send |
| sentAt | DateTime | Auto | When sent |
| clickedAt | DateTime | Auto | When clicked |
| paidAt | DateTime | Auto | When paid |
| paymentId | Text | Auto | Payment reference |
| paymentMode | Text | Auto | Payment method used |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

---

# 10. TASK & WORKFLOW AUTOMATION

## 10.1 Task Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Task Dashboard | Task overview | Central task hub |
| Multiple Views | List, Kanban, Calendar | Different displays |
| Task Creation | Add new tasks | Create with details |
| Task Templates | Predefined tasks | Task templates |
| Subtasks | Break down tasks | Hierarchical tasks |
| Task Dependencies | Linked tasks | Define dependencies |
| Recurring Tasks | Repeating tasks | Auto-recurring |
| Task Reminders | Notification alerts | Set reminders |
| Task Completion | Mark done | Complete with notes |

### Task Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| taskId | Text | Auto | Task ID |
| title | Text | Yes | Task title |
| description | Textarea | No | Task description |
| type | Dropdown | Yes | Call, Email, Meeting, Follow-up, Document, Other |
| priority | Dropdown | Yes | Urgent, High, Medium, Low |
| status | Dropdown | Yes | Todo, In Progress, On Hold, Completed, Cancelled |
| dueDate | Date | Yes | Due date |
| dueTime | Time | No | Due time |
| assignedTo | Dropdown | No | Assigned to |
| relatedEntity | Object | No | Linked record |
| parentTaskId | Text | No | Parent task |
| subtasks | Array | No | Subtask list |
| dependencies | Array | No | Dependent tasks |
| estimatedTime | Number | No | Estimated hours |
| actualTime | Number | No | Actual hours |
| isRecurring | Boolean | No | Recurring task |
| recurringPattern | Object | No | Recurrence settings |
| reminders | Array | No | Reminder settings |
| attachments | File[] | No | Attached files |
| notes | Textarea | No | Task notes |
| completedAt | DateTime | Auto | Completion time |
| completionNotes | Textarea | No | Completion notes |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |
| updatedAt | DateTime | Auto | Last updated |

### Task Status Options
| Status | Description |
|--------|-------------|
| todo | Not started |
| in_progress | Currently working |
| on_hold | Temporarily paused |
| completed | Finished successfully |
| cancelled | Cancelled/abandoned |

### Task Priority Options
| Priority | Description |
|----------|-------------|
| urgent | Immediate attention |
| high | High priority |
| medium | Normal priority |
| low | Low priority |

### Task Type Options
| Type | Description |
|------|-------------|
| call | Phone call task |
| email | Email task |
| meeting | Meeting/appointment |
| follow_up | Follow-up action |
| document | Document related |
| review | Review task |
| other | Other task type |

---

## 10.2 Workflow Builder

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Visual Designer | Build workflows | Drag-and-drop interface |
| Trigger Configuration | Start conditions | Define triggers |
| Action Nodes | Workflow steps | Add actions |
| Condition Nodes | Decision logic | Branching conditions |
| Delay Nodes | Wait steps | Time delays |
| Workflow Templates | Pre-built workflows | Template library |
| Workflow Execution | Run workflows | Execute automatically |
| Execution Monitoring | Track progress | Monitor status |

### Workflow Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| workflowId | Text | Auto | Workflow ID |
| name | Text | Yes | Workflow name |
| description | Textarea | No | Description |
| triggerType | Dropdown | Yes | Manual, Scheduled, Event |
| triggerConfig | Object | Yes | Trigger settings |
| nodes | Array | Yes | Workflow nodes |
| connections | Array | Yes | Node connections |
| status | Dropdown | Yes | Draft, Active, Paused |
| executionCount | Number | Auto | Times executed |
| lastExecuted | DateTime | Auto | Last run time |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

### Workflow Node Types
| Node Type | Description | Fields |
|-----------|-------------|--------|
| Trigger | Start workflow | type, config |
| Action | Execute action | actionType, parameters |
| Condition | Branch logic | field, operator, value |
| Delay | Wait period | duration, unit |
| Email | Send email | template, recipient |
| SMS | Send SMS | template, phone |
| WhatsApp | Send WhatsApp | template, phone |
| Task | Create task | taskConfig |
| Update | Update record | entity, field, value |
| Assign | Assign to agent | agentId, round-robin |
| End | End workflow | status |

---

# 11. HUMAN RESOURCES & ATTENDANCE

## 11.1 Attendance Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Clock In/Out | Time tracking | Punch in/out |
| Real-time Status | Current attendance | Who is present |
| Attendance History | Past records | Historical data |
| Attendance Reports | Summary reports | Attendance analytics |
| Location Tracking | Work location | Optional GPS |
| Shift Management | Work schedules | Define shifts |

### Attendance Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| attendanceId | Text | Auto | Attendance ID |
| userId | Text | Yes | User ID |
| userName | Text | Auto | User name |
| date | Date | Auto | Attendance date |
| checkIn | DateTime | Auto | Clock in time |
| checkOut | DateTime | No | Clock out time |
| checkInLocation | GeoPoint | No | Check-in location |
| checkOutLocation | GeoPoint | No | Check-out location |
| workHours | Number | Auto | Total hours worked |
| breakDuration | Number | No | Break time |
| netHours | Number | Auto | Work hours minus break |
| status | Dropdown | Auto | Present, Absent, Half-day, Leave |
| shiftId | Text | No | Assigned shift |
| overtime | Number | Auto | Overtime hours |
| notes | Text | No | Attendance notes |

### Shift Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| shiftId | Text | Auto | Shift ID |
| name | Text | Yes | Shift name |
| startTime | Time | Yes | Shift start |
| endTime | Time | Yes | Shift end |
| breakDuration | Number | No | Break minutes |
| workingDays | Multi-select | Yes | Active days |
| graceMinutes | Number | No | Late grace period |
| overtimeAfter | Number | No | Hours before OT |

---

## 11.2 Leave Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Leave Request | Apply for leave | Submit leave applications |
| Leave Types | Various categories | Multiple leave types |
| Approval Workflow | Manager approval | Multi-level approval |
| Leave Balance | Available leaves | Track balances |
| Leave Calendar | Team calendar | Team leave view |
| Leave Reports | Leave analytics | Usage reports |

### Leave Request Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| leaveId | Text | Auto | Leave request ID |
| userId | Text | Yes | Employee ID |
| userName | Text | Auto | Employee name |
| leaveType | Dropdown | Yes | Leave category |
| startDate | Date | Yes | Leave start |
| endDate | Date | Yes | Leave end |
| isHalfDay | Boolean | No | Half-day leave |
| halfDayType | Dropdown | No | First half, Second half |
| duration | Number | Auto | Leave days |
| reason | Textarea | Yes | Leave reason |
| status | Dropdown | Auto | Pending, Approved, Rejected, Cancelled |
| approver | Text | Auto | Approving manager |
| approverComments | Textarea | No | Approval notes |
| approvedAt | DateTime | Auto | Approval time |
| attachments | File[] | No | Supporting documents |
| createdAt | DateTime | Auto | Request date |

### Leave Type Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| typeId | Text | Auto | Type ID |
| name | Text | Yes | Leave type name |
| code | Text | Yes | Short code |
| description | Text | No | Description |
| annualAllowance | Number | Yes | Days per year |
| carryForward | Boolean | No | Allow carry forward |
| maxCarryForward | Number | No | Max carry days |
| requiresApproval | Boolean | Yes | Needs approval |
| requiresDocument | Boolean | No | Needs documents |
| minDays | Number | No | Minimum days |
| maxDays | Number | No | Maximum consecutive |
| isPaid | Boolean | Yes | Paid leave |
| isActive | Boolean | Yes | Active type |

### Leave Types Available
| Type | Code | Description |
|------|------|-------------|
| Casual Leave | CL | Personal time off |
| Sick Leave | SL | Medical leave |
| Earned Leave | EL | Accumulated leave |
| Maternity Leave | ML | Maternity period |
| Paternity Leave | PL | Paternity period |
| Bereavement Leave | BL | Family bereavement |
| Unpaid Leave | UL | Leave without pay |
| Compensatory Off | CO | Comp time off |

---

## 11.3 Training Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Training Programs | Learning initiatives | Define programs |
| Training Assignment | Assign training | Assign to employees |
| Progress Tracking | Monitor completion | Track progress |
| Training Materials | Learning content | Upload materials |
| Certification | Training completion | Issue certificates |
| Training Calendar | Schedule training | Calendar view |

### Training Program Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| programId | Text | Auto | Program ID |
| name | Text | Yes | Program name |
| description | Textarea | No | Description |
| category | Dropdown | Yes | Technical, Soft Skills, Compliance, Product |
| duration | Number | Yes | Duration in hours |
| mode | Dropdown | Yes | Online, Classroom, Hybrid |
| modules | Array | Yes | Training modules |
| targetAudience | Multi-select | No | Target roles |
| prerequisites | Text | No | Prerequisites |
| instructor | Text | No | Trainer name |
| materials | File[] | No | Training materials |
| assessmentType | Dropdown | No | Quiz, Assignment, None |
| passingScore | Number | No | Minimum pass score |
| certificate | Boolean | No | Issue certificate |
| status | Dropdown | Yes | Draft, Active, Archived |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

### Training Assignment Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| assignmentId | Text | Auto | Assignment ID |
| programId | Text | Yes | Training program |
| userId | Text | Yes | Assigned employee |
| assignedBy | Text | Auto | Assigned by |
| assignedAt | DateTime | Auto | Assignment date |
| dueDate | Date | Yes | Completion deadline |
| startedAt | DateTime | Auto | When started |
| completedAt | DateTime | Auto | When completed |
| progress | Number | Auto | Completion % |
| score | Number | Auto | Assessment score |
| status | Dropdown | Auto | Assigned, In Progress, Completed, Overdue |
| certificateUrl | URL | Auto | Certificate link |

---

# 12. PERFORMANCE & KPI MANAGEMENT

## 12.1 KPI Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| KPI Definition | Create KPIs | Define performance indicators |
| KPI Assignment | Assign to employees | Set individual targets |
| KPI Tracking | Monitor performance | Real-time tracking |
| KPI Dashboard | Performance overview | Visual dashboard |
| Trend Analysis | Performance over time | Historical trends |
| Target Setting | Goal configuration | Set targets |

### KPI Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| kpiId | Text | Auto | KPI ID |
| name | Text | Yes | KPI name |
| description | Textarea | No | Description |
| category | Dropdown | Yes | Sales, Service, Quality, Productivity |
| metric | Dropdown | Yes | Count, Currency, Percentage, Score |
| formula | Text | No | Calculation formula |
| target | Number | Yes | Target value |
| weight | Number | No | Weight percentage |
| frequency | Dropdown | Yes | Daily, Weekly, Monthly, Quarterly |
| dataSource | Text | No | Data source |
| owner | Dropdown | No | KPI owner |
| status | Dropdown | Yes | Active, Inactive |

### KPI Assignment Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| assignmentId | Text | Auto | Assignment ID |
| kpiId | Text | Yes | KPI reference |
| userId | Text | Yes | Assigned user |
| period | Text | Yes | Measurement period |
| target | Number | Yes | Individual target |
| actual | Number | Auto | Actual value |
| achievement | Number | Auto | Achievement % |
| status | Dropdown | Auto | On Track, At Risk, Behind |

---

## 12.2 Commission Tracking

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Commission Rules | Define calculations | Set commission rules |
| Commission Calculation | Compute earnings | Auto-calculate |
| Commission Dashboard | Earnings overview | View commissions |
| Commission Statements | Detailed statements | Transaction details |
| Payout Processing | Commission payment | Process payouts |
| Commission History | Past commissions | Historical data |

### Commission Rule Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| ruleId | Text | Auto | Rule ID |
| name | Text | Yes | Rule name |
| productType | Dropdown | Yes | Product type |
| agentRole | Dropdown | No | Agent role |
| commissionType | Dropdown | Yes | Percentage, Fixed, Slab |
| commissionValue | Number | Yes | Commission % or amount |
| slabs | Array | No | Slab-based rules |
| minPremium | Currency | No | Minimum premium |
| maxPremium | Currency | No | Maximum premium |
| effectiveFrom | Date | Yes | Start date |
| effectiveTo | Date | No | End date |
| status | Dropdown | Yes | Active, Inactive |

### Commission Transaction Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| transactionId | Text | Auto | Transaction ID |
| agentId | Text | Yes | Agent ID |
| agentName | Text | Auto | Agent name |
| policyNumber | Text | Yes | Policy reference |
| productType | Text | Auto | Product type |
| premium | Currency | Yes | Premium amount |
| commissionRate | Number | Auto | Applied rate |
| commissionAmount | Currency | Auto | Commission earned |
| status | Dropdown | Auto | Pending, Approved, Paid |
| transactionDate | Date | Auto | Transaction date |
| payoutDate | Date | No | When paid |
| payoutReference | Text | No | Payment reference |

---

# 13. CALL CENTER MANAGEMENT

## 13.1 Call Recording

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Recording Storage | Store call recordings | Secure storage |
| Recording Playback | Listen to calls | Playback with controls |
| Recording Search | Find recordings | Search by criteria |
| Recording Download | Export recordings | Download files |
| Recording Tagging | Categorize calls | Apply tags |

### Call Recording Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| recordingId | Text | Auto | Recording ID |
| callId | Text | Yes | Call reference |
| agentId | Text | Yes | Agent ID |
| agentName | Text | Auto | Agent name |
| customerPhone | Phone | Yes | Customer number |
| customerId | Text | No | Customer ID |
| callType | Dropdown | Yes | Inbound, Outbound |
| callDirection | Text | Auto | Direction |
| duration | Number | Auto | Duration seconds |
| recordingUrl | URL | Auto | Recording file |
| recordingDuration | Number | Auto | Recording length |
| disposition | Dropdown | No | Call outcome |
| tags | Multi-select | No | Recording tags |
| transcript | Text | No | Call transcript |
| sentiment | Dropdown | No | Positive, Neutral, Negative |
| quality Score | Number | No | Quality rating |
| callDate | DateTime | Auto | Call timestamp |
| evaluatedBy | Text | No | QA evaluator |
| evaluatedAt | DateTime | No | Evaluation date |

---

## 13.2 Call Quality Monitoring

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Quality Scorecard | Evaluation criteria | Define QA criteria |
| Call Evaluation | Score calls | Evaluate recordings |
| Agent Performance | Quality metrics | Track agent quality |
| Calibration | Scorer alignment | Calibrate evaluators |

### Quality Scorecard Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| scorecardId | Text | Auto | Scorecard ID |
| name | Text | Yes | Scorecard name |
| description | Text | No | Description |
| categories | Array | Yes | Evaluation categories |
| totalPoints | Number | Auto | Total possible points |
| passingScore | Number | Yes | Minimum passing |
| status | Dropdown | Yes | Active, Inactive |

### Scorecard Category Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| categoryName | Text | Yes | Category name |
| weight | Number | Yes | Category weight % |
| criteria | Array | Yes | Evaluation criteria |

### Evaluation Criteria Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| criterionName | Text | Yes | Criterion name |
| description | Text | No | Description |
| maxPoints | Number | Yes | Maximum points |
| isRequired | Boolean | No | Required criterion |
| scoringGuide | Text | No | Scoring guidelines |

### Call Evaluation Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| evaluationId | Text | Auto | Evaluation ID |
| recordingId | Text | Yes | Recording reference |
| scorecardId | Text | Yes | Scorecard used |
| evaluatorId | Text | Auto | Evaluator ID |
| agentId | Text | Auto | Agent evaluated |
| scores | Object | Yes | Category scores |
| totalScore | Number | Auto | Calculated score |
| percentage | Number | Auto | Score percentage |
| passed | Boolean | Auto | Pass/fail |
| strengths | Textarea | No | Agent strengths |
| improvements | Textarea | No | Areas to improve |
| feedback | Textarea | No | Overall feedback |
| disputeStatus | Dropdown | No | None, Disputed, Resolved |
| disputeNotes | Textarea | No | Dispute details |
| evaluatedAt | DateTime | Auto | Evaluation date |

---

## 13.3 Dialer Configuration

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Dialer Setup | Configure auto-dialer | Dialer settings |
| Calling Rules | Dial parameters | Set calling rules |
| DNC Compliance | Avoid blocked numbers | DNC integration |
| Pacing Controls | Call rate management | Control pace |
| Scheduled Dialer | Timed campaigns | Schedule campaigns |

### Dialer Configuration Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| configId | Text | Auto | Configuration ID |
| name | Text | Yes | Configuration name |
| dialerType | Dropdown | Yes | Progressive, Predictive, Preview |
| paceRatio | Number | No | Calls per agent |
| maxAttempts | Number | Yes | Max attempts per number |
| attemptInterval | Number | Yes | Minutes between attempts |
| callTimeout | Number | Yes | Ring timeout seconds |
| wrapUpTime | Number | Yes | Agent wrap-up seconds |
| callingHoursStart | Time | Yes | Calling start time |
| callingHoursEnd | Time | Yes | Calling end time |
| callingDays | Multi-select | Yes | Active days |
| timezone | Dropdown | Yes | Timezone |
| dncCheck | Boolean | Yes | Check DNC before dial |
| voicemailDetection | Boolean | No | Detect voicemail |
| status | Dropdown | Yes | Active, Inactive |

---

# 14. SETTINGS & ADMINISTRATION

## 14.1 General Settings

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Theme Settings | Appearance configuration | Light/dark mode |
| Language Selection | Localization | 13 languages |
| Timezone Configuration | Time settings | Set timezone |
| Notification Preferences | Alert settings | Configure notifications |
| Data Display Settings | View preferences | Items per page, formats |

### Settings Fields
| Field Name | Type | Options | Description |
|------------|------|---------|-------------|
| theme | Toggle | light, dark | Interface theme |
| language | Dropdown | 13 languages | Interface language |
| timezone | Dropdown | All timezones | User timezone |
| dateFormat | Dropdown | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD | Date format |
| timeFormat | Dropdown | 12h, 24h | Time format |
| currency | Dropdown | INR, USD, etc. | Default currency |
| itemsPerPage | Dropdown | 10, 25, 50, 100 | List pagination |
| notifications.email | Boolean | - | Email notifications |
| notifications.inApp | Boolean | - | In-app notifications |
| notifications.sms | Boolean | - | SMS notifications |
| notifications.browser | Boolean | - | Browser notifications |

---

## 14.2 User Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| User List | All users view | View all system users |
| Add User | Create new users | Create user accounts |
| Edit User | Modify users | Edit user details |
| Deactivate User | Disable accounts | Deactivate accounts |
| Password Reset | Reset credentials | Admin password reset |
| Role Assignment | Set user roles | Assign roles |
| Team Assignment | Organize users | Assign to teams |

### User Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| userId | Text | Auto | User ID |
| firstName | Text | Yes | First name |
| lastName | Text | Yes | Last name |
| email | Email | Yes | Email address |
| phone | Phone | No | Contact phone |
| role | Dropdown | Yes | User role |
| team | Dropdown | No | Assigned team |
| manager | Dropdown | No | Reporting manager |
| status | Dropdown | Yes | Active, Inactive, Suspended |
| employeeId | Text | No | Employee ID |
| department | Dropdown | No | Department |
| location | Dropdown | No | Work location |
| joinDate | Date | No | Start date |
| permissions | Multi-select | No | Additional permissions |
| accountExpiry | Date | No | Account expiry date |
| mfaEnabled | Boolean | No | MFA status |
| lastLogin | DateTime | Auto | Last login time |
| createdAt | DateTime | Auto | Account creation |
| updatedAt | DateTime | Auto | Last updated |

---

## 14.3 SLA Settings

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| SLA Template Creation | Define SLAs | Create SLA templates |
| SLA Assignment | Apply SLAs | Assign to case types |
| Escalation Rules | Breach actions | Configure escalations |
| Business Hours | Work time definition | Define business hours |
| Holiday Calendar | Non-working days | Set up holidays |

### SLA Template Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| slaId | Text | Auto | SLA ID |
| name | Text | Yes | SLA name |
| description | Textarea | No | Description |
| responseTime | Number | Yes | Response time (hours) |
| resolutionTime | Number | Yes | Resolution time (hours) |
| priority | Dropdown | No | Applicable priority |
| caseType | Dropdown | No | Case type |
| productType | Dropdown | No | Product type |
| escalationRules | Array | No | Escalation configuration |
| businessHoursOnly | Boolean | No | Count business hours only |
| status | Dropdown | Yes | Active, Inactive |

### Escalation Rule Fields
| Field Name | Type | Description |
|------------|------|-------------|
| level | Number | Escalation level |
| triggerPercent | Number | % of SLA before trigger |
| actions | Multi-select | Notification, Reassign, Alert |
| notifyRoles | Multi-select | Roles to notify |
| reassignTo | Dropdown | Reassign target |

---

## 14.4 Auto-Assignment Settings

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Assignment Rules | Distribution logic | Configure rules |
| Round-Robin | Equal distribution | Fair distribution |
| Skill-Based Routing | Match expertise | Route by skills |
| Capacity Limits | Workload limits | Set max capacity |
| Priority Rules | High-value handling | Special routing |

### Auto-Assignment Rule Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| ruleId | Text | Auto | Rule ID |
| name | Text | Yes | Rule name |
| ruleType | Dropdown | Yes | Round-Robin, Load-Balance, Skill-Based, Geography |
| priority | Number | Yes | Rule priority |
| conditions | Array | No | Match conditions |
| targetAgents | Multi-select | No | Eligible agents |
| targetTeams | Multi-select | No | Eligible teams |
| maxCapacity | Number | No | Max per agent |
| isActive | Boolean | Yes | Rule active |

### Condition Fields
| Field Name | Type | Description |
|------------|------|-------------|
| field | Dropdown | Field to check |
| operator | Dropdown | equals, contains, greater, less |
| value | Text | Value to match |

---

## 14.5 DNC Management

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| DNC List Management | Blocked numbers | View and manage DNC |
| DNC Import | Upload blocked numbers | Import DNC list |
| Government DNC Sync | Regulatory compliance | Sync with TRAI |
| DNC Override | Exception handling | Override with approval |
| DNC Logging | Audit trail | Log all checks |
| Compliance Reporting | Regulatory reports | Generate reports |

### DNC Entry Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| dncId | Text | Auto | DNC entry ID |
| phoneNumber | Phone | Yes | Blocked number |
| source | Dropdown | Yes | Customer Request, TRAI, Complaint, Legal |
| addedDate | Date | Auto | When added |
| expiryDate | Date | No | Expiry if temporary |
| reason | Text | No | Block reason |
| isActive | Boolean | Yes | Currently active |
| createdBy | Text | Auto | Added by |
| overrideAllowed | Boolean | No | Can be overridden |

---

# 15. AI & INTELLIGENT FEATURES

## 15.1 AI Agent

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| AI Assistant | Intelligent chatbot | AI-powered assistant |
| Natural Language | Conversational interface | Understand natural language |
| Task Automation | AI-driven actions | Execute tasks |
| Context Awareness | Understand context | Maintain context |

---

## 15.2 Email AI Features

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Intent Classification | Detect email purpose | Auto-classify emails |
| Sentiment Analysis | Tone detection | Analyze sentiment |
| Auto-Suggestions | Response recommendations | Suggest responses |
| Summary Generation | Email summaries | Summarize threads |

### AI Classification Results
| Field | Type | Description |
|-------|------|-------------|
| intent | Dropdown | Query, Complaint, Request, Feedback, Other |
| confidence | Number | Classification confidence % |
| sentiment | Dropdown | Positive, Neutral, Negative |
| sentimentScore | Number | Sentiment score (-1 to 1) |
| suggestedResponse | Text | AI-suggested response |
| summary | Text | Email summary |
| keyPoints | Text[] | Key points extracted |

---

## 15.3 Lead Scoring AI

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Predictive Scoring | Quality prediction | AI-based scoring |
| Conversion Probability | Likelihood to convert | Predict conversion |
| Score Factors | Contributing elements | Show score factors |

### Lead Score Fields
| Field | Type | Description |
|-------|------|-------------|
| overallScore | Number | Total score (0-100) |
| qualityTier | Dropdown | Hot, Warm, Cold |
| conversionProbability | Number | % likely to convert |
| scoreFactors | Object | Factor breakdown |
| scoreHistory | Array | Score changes over time |
| lastUpdated | DateTime | Score calculation date |

---

## 15.4 Propensity AI

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Payment Propensity | Payment likelihood | Predict payment |
| Best Contact Time | Optimal timing | AI-recommended time |
| Contact Method | Best channel | Recommended channel |
| Settlement Probability | Settlement likelihood | Settlement prediction |

### Propensity Score Fields
| Field | Type | Description |
|-------|------|-------------|
| propensityScore | Number | Overall score (0-100) |
| propensityLevel | Dropdown | High, Medium, Low |
| paymentProbability | Number | % likely to pay |
| settlementProbability | Number | % likely to settle |
| bestContactTime | Text | Optimal time window |
| preferredContactMethod | Dropdown | Phone, Email, SMS |
| riskScore | Number | Default risk |
| factorsPositive | Text[] | Positive indicators |
| factorsNegative | Text[] | Negative indicators |

---

# 16. INTEGRATIONS

## 16.1 Vahan Integration

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Vehicle Data Fetch | Get vehicle info | Fetch from Vahan |
| Ownership Verification | Confirm owner | Verify ownership |
| Insurance Status | Check coverage | Check current insurance |
| Auto-Fill | Populate fields | Auto-fill vehicle details |

### Vahan Request Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| registrationNumber | Text | Yes | Vehicle registration |
| chassisNumber | Text | No | Chassis number |
| engineNumber | Text | No | Engine number |

### Vahan Response Fields
| Field | Type | Description |
|-------|------|-------------|
| registrationNumber | Text | Registration number |
| ownerName | Text | Owner name |
| vehicleClass | Text | Vehicle class |
| maker | Text | Manufacturer |
| model | Text | Model name |
| fuelType | Text | Fuel type |
| color | Text | Vehicle color |
| registrationDate | Date | Registration date |
| fitness | Date | Fitness validity |
| insurance | Object | Insurance details |
| puc | Object | PUC details |
| tax | Object | Tax details |

---

# 17. USER INTERFACE & EXPERIENCE

## 17.1 Theme System

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Light Mode | Bright theme | Clean, bright interface |
| Dark Mode | Dark theme | Reduced eye strain |
| Theme Toggle | Switch themes | Easy toggle switch |
| Persistent Preference | Remember choice | Saved preference |

---

## 17.2 Layout & Navigation

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Collapsible Sidebar | Expandable menu | Collapsible navigation |
| Nested Navigation | Hierarchical menu | Expandable sections |
| Breadcrumbs | Location indicator | Path display |
| Quick Actions | Shortcut buttons | Common actions |
| Responsive Design | Mobile-friendly | Adapts to screen size |

### Navigation Sections
| Section | Modules |
|---------|---------|
| Dashboard | Renewals |
| Renewals | Cases, Closed, Failed, Timeline |
| Leads | Management, Assigned, Closed, Lost |
| Customers | Contacts, Database, Service |
| Policies | Claims, Servicing, New Business |
| Communications | Email, WhatsApp, Campaigns |
| Operations | Tasks, Workflows, SLA |
| HR | Attendance, Leave, Training |
| Reports | Analytics, KPIs, MIS |
| Settings | Users, Configuration |

---

## 17.3 Notification System

### Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Notification Bell | Alert indicator | Unread count badge |
| Notification Panel | View notifications | Dropdown panel |
| Notification Dialog | Full notifications | Full view dialog |
| Mark as Read | Clear notifications | Mark read |
| Notification Types | Various alerts | Different types |

### Notification Types
| Type | Description |
|------|-------------|
| Task | Task assignments and reminders |
| Lead | Lead assignments and updates |
| Case | Case status changes |
| System | System announcements |
| Alert | Important alerts |
| Approval | Approval requests |

---

# 18. INTERNATIONALIZATION

## 18.1 Supported Languages

| Code | Language | RTL Support |
|------|----------|-------------|
| en | English | No |
| hi | Hindi | No |
| bn | Bengali | No |
| te | Telugu | No |
| mr | Marathi | No |
| ta | Tamil | No |
| gu | Gujarati | No |
| ml | Malayalam | No |
| kn | Kannada | No |
| pa | Punjabi | No |
| as | Assamese | No |
| or | Odia | No |
| ur | Urdu | Yes |

---

# INDUSTRY CONFIGURATION

## Supported Industries

The system supports multiple industry configurations with customizable terminology and fields:

| Industry | Code | Description |
|----------|------|-------------|
| Insurance | insurance | Insurance CRM with policy-specific terminology |
| Automotive | automotive | Vehicle sales and service management |
| Real Estate | realestate | Property sales and management |
| Healthcare | healthcare | Patient management and appointments |
| Retail | retail | Product sales and inventory |
| Banking | banking | Account and loan management |
| Education | education | Student and course management |
| Hospitality | hospitality | Guest and reservation management |
| Other | other | Generic CRM configuration |

### Industry-Specific Terminology (Insurance Example)
| Generic Term | Insurance Term |
|--------------|----------------|
| Customer | Policyholder |
| Case | Policy |
| Lead | Prospect |
| Deal | Policy Sale |
| Value | Premium Amount |

---

# SUMMARY

This comprehensive feature list documents:

- **200+ Individual Features** across all modules
- **500+ Data Fields** with types and requirements
- **19 Major Sections** covering entire system
- **13 Languages** supported with RTL
- **10 Industries** supported with configurations
- **Complete Field Definitions** for all pages

All fields include:
- Field name
- Data type
- Required/Optional status
- Description
- Options (for dropdowns)
- Validation rules (where applicable)

This documentation serves as the complete reference for the PY360 CRM system capabilities and data structure.
