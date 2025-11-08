# Py360 Insurance Policy Renewal Management System - Backend Development Guide

**Version:** 2.1  
**Last Updated:** January 2025  
**Target Architecture:** Microservices with API Gateway

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Requirements](#architecture-requirements)
3. [Database Schema](#database-schema)
4. [API Specifications](#api-specifications)
5. [Authentication & Authorization](#authentication--authorization)
6. [Core Modules](#core-modules)
7. [Integration Requirements](#integration-requirements)
8. [Deployment Guide](#deployment-guide)
9. [Security Specifications](#security-specifications)
10. [Performance Requirements](#performance-requirements)

## System Overview

### Purpose
The Py360 Insurance Policy Renewal Management System is a comprehensive platform for managing insurance policy renewals, customer communications, multi-channel campaign management, email automation, surveys, claims processing, and real-time analytics. The system supports advanced upload workflows with integrated campaign creation, multi-channel communication (Email, WhatsApp, SMS), and sophisticated user management.

### Current Frontend Implementation Status
The frontend application is fully implemented with the following enhanced features:
- **30+ Pages**: Complete UI implementation including Dashboard, Upload, Campaigns, Case Management, Email Management, Settings, and User Management
- **Outstanding Amounts Management**: Complete payment tracking system with dual view support
- **Social Media Integrations**: Multi-platform customer engagement capabilities
- **AI-Powered Policy Recommendations**: Enhanced customer profiling with intelligent recommendations
- **Channel & Hierarchy Management**: Advanced organizational management systems
- **Enhanced Analytics**: Comprehensive billing, vendor, and delivery status tracking
- **React 18**: Modern React application with hooks, context, and Material-UI components
- **Advanced Upload System**: Multi-file upload with progress tracking and campaign integration
- **Multi-Channel Campaigns**: Email, WhatsApp, and SMS campaign management
- **Role-Based Access Control**: Comprehensive RBAC system with 20+ configurable permissions
- **Real-time Features**: WebSocket integration for live updates and notifications
- **Responsive Design**: Mobile-optimized interface with dark/light theme support
- **Security Features**: Input validation, XSS protection, and secure authentication

### Technology Stack Recommendations
- **Backend Framework**: Node.js with Express.js / Python Django/FastAPI / Java Spring Boot
- **Database**: PostgreSQL (Primary) + Redis (Cache/Sessions)
- **File Storage**: AWS S3 / Azure Blob Storage
- **Real-time**: Socket.IO / WebSocket
- **Queue System**: Redis Bull Queue / RabbitMQ
- **Search Engine**: Elasticsearch (optional)
- **AI Integration**: OpenAI API / Azure OpenAI
- **Email Service**: AWS SES / SendGrid
- **SMS Service**: Twilio / AWS SNS
- **WhatsApp**: WhatsApp Business API

## Architecture Requirements

### Microservices Architecture (Recommended)
```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (NGINX/Kong)                 │
├─────────────────────────────────────────────────────────────┤
│  Auth Service │ Renewal Service │ Email Service │ AI Service │
├─────────────────────────────────────────────────────────────┤
│ Campaign Svc  │ Survey Service  │ Claims Svc    │ File Svc   │
├─────────────────────────────────────────────────────────────┤
│           Notification Service │ Analytics Service          │
├─────────────────────────────────────────────────────────────┤
│              PostgreSQL │ Redis │ File Storage              │
└─────────────────────────────────────────────────────────────┘
```

### Core Services Required

#### 1. Authentication Service
- JWT token management
- Role-based access control (RBAC)
- Multi-factor authentication
- Session management
- Password policies

#### 2. Upload & Data Management Service
- Advanced file upload with validation (Excel, CSV)
- Real-time progress tracking and status updates
- Upload history and audit trail management
- Batch data processing with error handling
- Template generation and download
- Integration with campaign creation workflow

#### 3. Email Management Service
- IMAP/SMTP integration
- Email categorization and tagging
- AI-powered sentiment analysis
- Email templates and automation
- Bulk email processing

#### 4. AI Assistant Service
- OpenAI/Azure OpenAI integration
- Context management
- Rate limiting
- Knowledge base management
- Response caching

#### 5. Multi-Channel Communication Service
- WhatsApp Business API integration with flow builder
- SMS gateway integration (Twilio/AWS SNS)
- Unified messaging across channels
- Template management for all communication types
- Message scheduling and automation
- Delivery status tracking and analytics

#### 6. Advanced Campaign Management Service
- Multi-channel campaign creation (Email, WhatsApp, SMS)
- Integrated campaign creation from uploaded data
- Advanced audience segmentation and targeting
- Campaign scheduling (immediate and future)
- Real-time performance tracking and analytics
- Campaign control (pause, resume, stop)
- A/B testing and optimization
- Template library management

#### 7. Survey & Feedback Service
- Survey builder
- Response collection
- Analytics and reporting
- Feedback categorization

#### 8. Claims Processing Service
- Claim submission and tracking
- Document management
- Approval workflows
- Status notifications

#### 9. File Management Service
- Document upload/download
- File type validation
- Virus scanning
- Thumbnail generation
- Storage optimization

#### 10. Notification Service
- Real-time notifications
- Email notifications
- In-app notifications
- Push notifications
- Notification preferences

#### 11. Outstanding Amounts & Payment Service (NEW - January 2025)
- Outstanding amounts tracking and calculation
- Payment processing integration (Razorpay/Stripe)
- Installment management and scheduling
- Payment history and audit trails
- Overdue calculations and notifications
- Bulk payment processing capabilities

#### 12. Social Media Integration Service (NEW - January 2025)
- Multi-platform social media connections (Facebook, Twitter, LinkedIn, Telegram)
- OAuth flow management and token handling
- Customer presence verification across platforms
- Platform-specific API integrations
- Connection status monitoring and management

#### 13. AI Recommendations Service (NEW - January 2025)
- Customer profiling and risk assessment
- AI-powered policy recommendations
- Machine learning model integration
- Personalized recommendation generation
- Recommendation tracking and effectiveness analysis

#### 14. Channel & Hierarchy Management Service (NEW - January 2025)
- Organizational structure management
- Channel performance tracking and analytics
- Hierarchy node management (Region → State → Branch → Department → Team)
- Performance metrics and KPI tracking
- Budget allocation and utilization monitoring

#### 15. Enhanced Analytics Service (NEW - January 2025)
- Vendor communication analytics
- Delivery status tracking across all channels
- Advanced reporting and dashboard capabilities
- Performance comparison and trend analysis
- Custom analytics and metric generation

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    job_title VARCHAR(100),
    role_id INTEGER REFERENCES roles(id),
    status VARCHAR(20) DEFAULT 'active',
    avatar_url VARCHAR(500),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP
);
```

#### Roles Table
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Policies Table
```sql
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id),
    policy_type VARCHAR(50) NOT NULL,
    premium_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    renewal_date DATE,
    grace_period_days INTEGER DEFAULT 30,
    agent_id INTEGER REFERENCES users(id),
    branch_id INTEGER REFERENCES branches(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Customers Table
```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    address JSONB,
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_documents JSONB,
    communication_preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### File Uploads Table
```sql
CREATE TABLE file_uploads (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    upload_status VARCHAR(20) DEFAULT 'processing',
    total_records INTEGER,
    successful_records INTEGER,
    failed_records INTEGER,
    uploaded_by INTEGER REFERENCES users(id),
    upload_path VARCHAR(500),
    download_url VARCHAR(500),
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    error_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Campaigns Table
```sql
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(20) NOT NULL, -- 'email', 'whatsapp', 'sms'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'
    upload_id INTEGER REFERENCES file_uploads(id),
    template_id INTEGER REFERENCES templates(id),
    target_audience_filter JSONB,
    target_count INTEGER,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    replied_count INTEGER DEFAULT 0,
    converted_count INTEGER DEFAULT 0,
    schedule_type VARCHAR(20) DEFAULT 'immediate', -- 'immediate', 'scheduled'
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Templates Table
```sql
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(20) NOT NULL, -- 'email', 'whatsapp', 'sms'
    subject VARCHAR(500), -- for email templates
    content TEXT NOT NULL,
    variables JSONB, -- available variables for template
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Campaign Recipients Table
```sql
CREATE TABLE campaign_recipients (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id),
    customer_id INTEGER REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'failed'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    replied_at TIMESTAMP,
    error_message TEXT,
    tracking_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Renewal Cases Table
```sql
CREATE TABLE renewal_cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,
    policy_id INTEGER REFERENCES policies(id),
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id),
    batch_id INTEGER REFERENCES upload_batches(id),
    renewal_amount DECIMAL(12,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    communication_attempts INTEGER DEFAULT 0,
    last_contact_date TIMESTAMP,
    notes TEXT,
    escalated_to INTEGER REFERENCES users(id),
    escalation_reason TEXT,
    escalated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Upload Batches Table
```sql
CREATE TABLE upload_batches (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    total_records INTEGER NOT NULL,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processing',
    file_path VARCHAR(500),
    error_log JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Emails Table
```sql
CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    thread_id VARCHAR(255),
    account_id INTEGER REFERENCES email_accounts(id),
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    cc_emails TEXT[],
    bcc_emails TEXT[],
    subject TEXT NOT NULL,
    body_text TEXT,
    body_html TEXT,
    attachments JSONB,
    category VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'new',
    assigned_to INTEGER REFERENCES users(id),
    sentiment_score DECIMAL(3,2),
    sentiment_label VARCHAR(20),
    ai_intent JSONB,
    read_status BOOLEAN DEFAULT FALSE,
    escalated_to INTEGER REFERENCES users(id),
    escalation_reason TEXT,
    received_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Email Accounts Table
```sql
CREATE TABLE email_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    imap_server VARCHAR(255) NOT NULL,
    imap_port INTEGER NOT NULL,
    smtp_server VARCHAR(255) NOT NULL,
    smtp_port INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    password_encrypted VARCHAR(500) NOT NULL,
    use_ssl BOOLEAN DEFAULT TRUE,
    auto_sync BOOLEAN DEFAULT TRUE,
    sync_interval INTEGER DEFAULT 5,
    last_sync TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Campaigns Table
```sql
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_by INTEGER REFERENCES users(id),
    target_audience JSONB,
    content JSONB,
    schedule_type VARCHAR(20) DEFAULT 'immediate',
    scheduled_at TIMESTAMP,
    channels VARCHAR(50)[] NOT NULL,
    budget DECIMAL(12,2),
    metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Surveys Table
```sql
CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft',
    questions JSONB NOT NULL,
    settings JSONB,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    response_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Survey Responses Table
```sql
CREATE TABLE survey_responses (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER REFERENCES surveys(id),
    customer_id INTEGER REFERENCES customers(id),
    responses JSONB NOT NULL,
    completion_time INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Claims Table
```sql
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    policy_id INTEGER REFERENCES policies(id),
    claim_type VARCHAR(50) NOT NULL,
    claim_amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id),
    documents JSONB,
    incident_date DATE NOT NULL,
    reported_date DATE NOT NULL,
    settlement_amount DECIMAL(12,2),
    settlement_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### WhatsApp Templates Table
```sql
CREATE TABLE whatsapp_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(20) DEFAULT 'pending',
    template_data JSONB NOT NULL,
    created_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Files Table
```sql
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    entity_type VARCHAR(50),
    entity_id INTEGER,
    is_public BOOLEAN DEFAULT FALSE,
    virus_scan_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_status BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'medium',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### AI Settings Table
```sql
CREATE TABLE ai_settings (
    id SERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    api_key_encrypted VARCHAR(500) NOT NULL,
    model VARCHAR(100) NOT NULL,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 1000,
    response_timeout INTEGER DEFAULT 30,
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    features JSONB NOT NULL,
    knowledge_base JSONB,
    fallback_enabled BOOLEAN DEFAULT TRUE,
    fallback_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Outstanding Amounts Table (NEW - January 2025)
```sql
CREATE TABLE outstanding_amounts (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES renewal_cases(id),
    policy_id INTEGER REFERENCES policies(id),
    period VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'partial'
    description TEXT,
    payment_method VARCHAR(50),
    paid_amount DECIMAL(12,2) DEFAULT 0,
    paid_date TIMESTAMP,
    payment_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Social Media Integrations Table (NEW - January 2025)
```sql
CREATE TABLE social_media_integrations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'twitter', 'linkedin', 'telegram', 'wechat'
    platform_user_id VARCHAR(255),
    platform_username VARCHAR(255),
    connection_status VARCHAR(20) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'pending', 'expired'
    access_token_encrypted VARCHAR(1000),
    refresh_token_encrypted VARCHAR(1000),
    token_expires_at TIMESTAMP,
    verification_status VARCHAR(20) DEFAULT 'unverified', -- 'verified', 'unverified', 'failed'
    verification_data JSONB,
    connected_at TIMESTAMP,
    last_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Customer Profiles Table (Enhanced - January 2025)
```sql
CREATE TABLE customer_profiles (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    annual_income DECIMAL(15,2),
    income_capture_date DATE,
    vehicles JSONB, -- [{"type": "car", "model": "Honda City", "year": 2020}]
    residence_type VARCHAR(20), -- 'owned', 'rented'
    property_type VARCHAR(20), -- 'villa', 'apartment'
    location_rating VARCHAR(10), -- 'good', 'average', 'low'
    risk_profile VARCHAR(20), -- 'safe', 'medium', 'high'
    policy_preferences JSONB, -- {"ulip": true, "term": true, "traditional": false}
    family_history JSONB, -- Medical and family history data
    policy_capacity JSONB, -- {"max_capacity": 500000, "utilized": 200000}
    ai_recommendations JSONB, -- Stored AI recommendations
    last_profile_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Channels Table (NEW - January 2025)
```sql
CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'online', 'mobile', 'offline', 'phone', 'agent'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
    description TEXT,
    target_audience TEXT,
    cost_per_lead DECIMAL(10,2),
    conversion_rate DECIMAL(5,2),
    manager_id INTEGER REFERENCES users(id),
    budget DECIMAL(15,2),
    current_cases INTEGER DEFAULT 0,
    renewed_cases INTEGER DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    settings JSONB, -- Channel-specific settings
    performance_metrics JSONB, -- Efficiency, satisfaction, response time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Organizational Hierarchy Table (NEW - January 2025)
```sql
CREATE TABLE organizational_hierarchy (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'region', 'state', 'branch', 'department', 'team'
    parent_id INTEGER REFERENCES organizational_hierarchy(id),
    manager_id INTEGER REFERENCES users(id),
    manager_name VARCHAR(255),
    description TEXT,
    budget DECIMAL(15,2),
    target_cases INTEGER,
    current_cases INTEGER DEFAULT 0,
    renewed_cases INTEGER DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'restructuring'
    performance_metrics JSONB, -- Efficiency, budget utilization, target achievement
    team_members JSONB, -- For team-level nodes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Vendor Communications Table (NEW - January 2025)
```sql
CREATE TABLE vendor_communications (
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    communication_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'whatsapp', 'call'
    total_communications INTEGER DEFAULT 0,
    successful_communications INTEGER DEFAULT 0,
    failed_communications INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    total_cost DECIMAL(12,2),
    average_cost_per_communication DECIMAL(8,2),
    performance_rating DECIMAL(3,2),
    last_communication_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Communication Delivery Status Table (NEW - January 2025)
```sql
CREATE TABLE communication_delivery_status (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES renewal_cases(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    communication_type VARCHAR(50) NOT NULL,
    recipient_contact VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'opened', 'clicked'
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    error_message TEXT,
    vendor_name VARCHAR(255),
    cost DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes and Performance Optimization

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role_id, status);

-- Policy indexes
CREATE INDEX idx_policies_customer ON policies(customer_id);
CREATE INDEX idx_policies_renewal_date ON policies(renewal_date);
CREATE INDEX idx_policies_status ON policies(status);

-- Renewal cases indexes
CREATE INDEX idx_renewal_cases_policy ON renewal_cases(policy_id);
CREATE INDEX idx_renewal_cases_status ON renewal_cases(status);
CREATE INDEX idx_renewal_cases_assigned ON renewal_cases(assigned_to);
CREATE INDEX idx_renewal_cases_batch ON renewal_cases(batch_id);

-- Email indexes
CREATE INDEX idx_emails_account ON emails(account_id);
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_category ON emails(category);
CREATE INDEX idx_emails_received_at ON emails(received_at);
CREATE INDEX idx_emails_thread ON emails(thread_id);

-- Campaign indexes
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Notification indexes
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## Enhanced API Specifications

### Frontend Integration Requirements
The backend APIs must support the following frontend features:
- **Real-time Updates**: WebSocket support for live notifications and status updates
- **File Upload Progress**: Chunked upload with progress tracking
- **Campaign Management**: Multi-channel campaign creation and monitoring
- **Permission-based Access**: API endpoints must respect RBAC permissions
- **Pagination Support**: All list endpoints must support pagination, filtering, and sorting
- **Export Functionality**: Support for PDF, Excel, and CSV exports
- **Search Capabilities**: Advanced search across all data entities
- **Audit Logging**: Complete activity tracking for compliance

### Upload & File Management APIs

#### POST /api/upload/file
Upload policy data file with validation
```json
Request:
- Content-Type: multipart/form-data
- file: Excel/CSV file
- metadata: { "description": "Upload description" }

Response:
{
  "success": true,
  "data": {
    "uploadId": "upload-123",
    "filename": "policies.xlsx",
    "status": "processing",
    "totalRecords": 150,
    "estimatedProcessingTime": "2-3 minutes"
  }
}
```

#### GET /api/upload/status/{uploadId}
Get upload processing status
```json
Response:
{
  "success": true,
  "data": {
    "uploadId": "upload-123",
    "status": "completed",
    "totalRecords": 150,
    "successfulRecords": 142,
    "failedRecords": 8,
    "processingTime": "2m 15s",
    "downloadUrl": "/api/upload/download/upload-123"
  }
}
```

#### GET /api/upload/history
Get upload history with pagination
```json
Response:
{
  "success": true,
  "data": {
    "uploads": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### GET /api/upload/template
Download template file
```json
Response:
- Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Content-Disposition: attachment; filename="policy_upload_template.xlsx"
```

### Campaign Management APIs

#### POST /api/campaigns
Create new campaign
```json
Request:
{
  "name": "May Renewals Campaign",
  "type": ["email", "whatsapp"],
  "uploadId": "upload-123",
  "templates": {
    "email": "template-1",
    "whatsapp": "template-2"
  },
  "scheduleType": "scheduled",
  "scheduledAt": "2024-05-15T14:00:00Z",
  "targetAudience": "all"
}

Response:
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "campaign-456",
        "name": "May Renewals Campaign (Email)",
        "type": "email",
        "status": "scheduled",
        "targetCount": 142,
        "scheduledAt": "2024-05-15T14:00:00Z"
      }
    ]
  }
}
```

#### GET /api/campaigns
Get all campaigns with filtering
```json
Query Parameters:
- status: active,paused,completed
- type: email,whatsapp,sms
- page: 1
- limit: 20

Response:
{
  "success": true,
  "data": {
    "campaigns": [...],
    "pagination": {...}
  }
}
```

#### PUT /api/campaigns/{campaignId}/status
Update campaign status
```json
Request:
{
  "status": "paused"
}

Response:
{
  "success": true,
  "data": {
    "campaignId": "campaign-456",
    "status": "paused",
    "updatedAt": "2024-05-15T10:30:00Z"
  }
}
```

#### GET /api/campaigns/{campaignId}/analytics
Get campaign analytics
```json
Response:
{
  "success": true,
  "data": {
    "campaignId": "campaign-456",
    "metrics": {
      "sent": 142,
      "delivered": 138,
      "opened": 89,
      "clicked": 34,
      "converted": 12,
      "openRate": 64.5,
      "clickRate": 24.6,
      "conversionRate": 8.7
    },
    "timeline": [...],
    "topPerformingContent": [...]
  }
}
```

### Template Management APIs

#### GET /api/templates
Get all templates by type
```json
Query Parameters:
- type: email,whatsapp,sms
- active: true/false

Response:
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template-1",
        "name": "Renewal Reminder - 30 Days",
        "type": "email",
        "subject": "Your Policy Renewal is Due Soon",
        "content": "Dear {name}, your policy expires in 30 days...",
        "variables": ["name", "policy_number", "expiry_date"]
      }
    ]
  }
}
```

#### POST /api/templates
Create new template
```json
Request:
{
  "name": "Custom Renewal Template",
  "type": "email",
  "subject": "Policy Renewal Notice",
  "content": "Dear {name}, please renew your policy...",
  "variables": ["name", "policy_number"]
}

Response:
{
  "success": true,
  "data": {
    "templateId": "template-789",
    "message": "Template created successfully"
  }
}
```

### Multi-Channel Communication APIs

#### POST /api/communication/whatsapp/send
Send WhatsApp message
```json
Request:
{
  "to": "+919876543210",
  "templateId": "renewal_reminder",
  "parameters": {
    "name": "John Doe",
    "policy_number": "POL123456",
    "expiry_date": "2024-06-15"
  }
}

Response:
{
  "success": true,
  "data": {
    "messageId": "wa-msg-123",
    "status": "sent",
    "timestamp": "2024-05-15T10:30:00Z"
  }
}
```

#### POST /api/communication/sms/send
Send SMS message
```json
Request:
{
  "to": "+919876543210",
  "message": "Dear John, your policy POL123456 expires on 2024-06-15. Renew now: https://example.com/renew"
}

Response:
{
  "success": true,
  "data": {
    "messageId": "sms-msg-456",
    "status": "sent",
    "cost": 0.05
  }
}
```

#### GET /api/communication/delivery-status/{messageId}
Get message delivery status
```json
Response:
{
  "success": true,
  "data": {
    "messageId": "wa-msg-123",
    "status": "delivered",
    "deliveredAt": "2024-05-15T10:32:00Z",
    "readAt": "2024-05-15T10:35:00Z"
  }
}
```

## Third-Party API Integration Requirements

### Overview
The Insurance Policy Renewal System requires integration with multiple third-party services to provide comprehensive functionality including multi-channel communication, file storage, payment processing, and analytics.

### 1. Multi-Channel Communication Services

#### WhatsApp Business API Integration
**Service Provider**: Meta (Facebook)
**Priority**: High (Essential for campaign functionality)

```javascript
// Configuration
const whatsappConfig = {
  baseURL: 'https://graph.facebook.com/v17.0',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
};

// Required Environment Variables
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_token
WHATSAPP_APP_SECRET=your_app_secret
```

**Required Endpoints**:
- Send Messages: `POST /{phone-number-id}/messages`
- Get Message Status: `GET /{message-id}`
- Webhook for Status Updates: `POST /webhook`

**Features Needed**:
- Template message sending
- Message delivery status tracking
- Media message support (images, documents)
- Flow builder integration
- Webhook handling for real-time updates

**Cost**: ~$0.005-$0.009 per message (varies by country)
**Documentation**: https://developers.facebook.com/docs/whatsapp

#### SMS Gateway Integration
**Service Provider Options**:

**Option 1: Twilio (Recommended for Global)**
```javascript
const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID
};

// Environment Variables
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid
```

**Option 2: AWS SNS (Cost-effective)**
```javascript
const snsConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
```

**Option 3: TextLocal (India-specific)**
```javascript
const textlocalConfig = {
  apiKey: process.env.TEXTLOCAL_API_KEY,
  baseURL: 'https://api.textlocal.in'
};
```

**Cost Comparison**:
- Twilio: ~$0.0075 per SMS
- AWS SNS: ~$0.00645 per SMS
- TextLocal: ~₹0.15 per SMS (India)

### 2. Email Services Integration

#### Email Sending Service
**Service Provider Options**:

**Option 1: AWS SES (Recommended)**
```javascript
const sesConfig = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  fromEmail: process.env.SES_FROM_EMAIL
};

// Environment Variables
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
SES_FROM_EMAIL=noreply@yourcompany.com
```

**Option 2: SendGrid**
```javascript
const sendgridConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL,
  fromName: process.env.SENDGRID_FROM_NAME
};
```

**Features Required**:
- Bulk email sending
- Email templates
- Delivery tracking
- Bounce and complaint handling
- Analytics and reporting

**Cost**:
- AWS SES: $0.10 per 1,000 emails (after free tier)
- SendGrid: $19.95/month for 100K emails

#### Email Management (IMAP/SMTP)
```javascript
const imapConfig = {
  host: process.env.IMAP_HOST,
  port: process.env.IMAP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Environment Variables
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your_email@company.com
EMAIL_PASS=your_app_password
```

### 3. File Storage & Management

#### Cloud Storage Integration
**Service Provider Options**:

**Option 1: AWS S3 (Recommended)**
```javascript
const s3Config = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.S3_BUCKET_NAME
};

// Environment Variables
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
S3_UPLOAD_FOLDER=uploads/
S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com/
```

**Option 2: Azure Blob Storage**
```javascript
const azureConfig = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  containerName: process.env.AZURE_CONTAINER_NAME
};
```

**Features Required**:
- File upload with validation
- Secure file storage
- File download with authentication
- Virus scanning integration
- CDN integration for performance

**Cost**:
- AWS S3: $0.023 per GB/month (Standard)
- Azure Blob: $0.018 per GB/month (Hot tier)

### 4. Payment Gateway Integration

#### Payment Processing
**Service Provider Options**:

**Option 1: Razorpay (India-focused)**
```javascript
const razorpayConfig = {
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
};

// Environment Variables
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Option 2: Stripe (Global)**
```javascript
const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
};
```

**Features Required**:
- Policy renewal payments
- Subscription management
- Payment status tracking
- Refund processing
- Webhook handling for payment updates

### 5. AI & Machine Learning Services

#### AI Assistant Integration
**Service Provider Options**:

**Option 1: OpenAI API**
```javascript
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
  model: 'gpt-4',
  maxTokens: 150
};

// Environment Variables
OPENAI_API_KEY=your_api_key
OPENAI_ORGANIZATION=your_org_id
OPENAI_MODEL=gpt-4
```

**Option 2: Azure OpenAI**
```javascript
const azureOpenAIConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT
};
```

**Features Required**:
- Customer query assistance
- Email content generation
- Sentiment analysis
- Document summarization

**Cost**:
- OpenAI GPT-4: ~$0.03 per 1K tokens (input)
- Azure OpenAI: Similar pricing with enterprise features

### 6. Analytics & Monitoring Services

#### Application Performance Monitoring
**Service Provider Options**:

**Option 1: New Relic**
```javascript
const newrelicConfig = {
  licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
  appName: process.env.NEW_RELIC_APP_NAME
};
```

**Option 2: DataDog**
```javascript
const datadogConfig = {
  apiKey: process.env.DATADOG_API_KEY,
  appKey: process.env.DATADOG_APP_KEY,
  site: process.env.DATADOG_SITE
};
```

#### Web Analytics
**Google Analytics 4**
```javascript
const ga4Config = {
  measurementId: process.env.GA4_MEASUREMENT_ID,
  apiSecret: process.env.GA4_API_SECRET
};

// Environment Variables
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_api_secret
```

### 7. Authentication & Security Services

#### Multi-Factor Authentication
**Service Provider Options**:

**Option 1: Auth0**
```javascript
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE
};
```

**Option 2: AWS Cognito**
```javascript
const cognitoConfig = {
  region: process.env.AWS_REGION,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID
};
```

### 8. Search & Data Processing

#### Search Engine Integration
**Elasticsearch**
```javascript
const elasticsearchConfig = {
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD
  }
};

// Environment Variables
ELASTICSEARCH_URL=https://your-cluster.es.region.aws.com
ELASTICSEARCH_USERNAME=your_username
ELASTICSEARCH_PASSWORD=your_password
```

### 9. Notification Services

#### Push Notifications
**Firebase Cloud Messaging (FCM)**
```javascript
const fcmConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

// Environment Variables
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## Implementation Strategy

### Phase 1: Core Functionality (MVP)
**Priority: High - Essential for basic operations**
1. **File Storage** (AWS S3) - Upload functionality
2. **Email Service** (AWS SES) - Email campaigns
3. **SMS Gateway** (Twilio/AWS SNS) - SMS campaigns
4. **Payment Gateway** (Razorpay/Stripe) - Policy renewals

### Phase 2: Enhanced Communication
**Priority: Medium - Enhanced user experience**
5. **WhatsApp Business API** - WhatsApp campaigns
6. **Push Notifications** (FCM) - Real-time notifications
7. **AI Assistant** (OpenAI) - Customer support

### Phase 3: Advanced Features
**Priority: Low - Advanced analytics and optimization**
8. **Analytics** (Google Analytics) - Performance tracking
9. **APM** (New Relic/DataDog) - System monitoring
10. **Search Engine** (Elasticsearch) - Advanced search

## Security & Compliance Requirements

### API Security Standards
- **Encryption**: All API communications must use HTTPS/TLS 1.2+
- **Authentication**: Implement proper API key management and rotation
- **Rate Limiting**: Implement rate limiting for all external API calls
- **Error Handling**: Secure error handling without exposing sensitive data
- **Logging**: Log all API interactions for audit purposes

### Compliance Requirements
- **Data Protection**: GDPR, CCPA compliance for customer data
- **Financial Regulations**: PCI DSS for payment processing
- **Industry Standards**: Insurance industry-specific compliance
- **Data Retention**: Implement proper data retention policies

### Environment Configuration Template
```bash
# Core Application
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/renewal_db
REDIS_URL=redis://localhost:6379

# File Storage (AWS S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=renewal-system-uploads

# Email Service (AWS SES)
SES_FROM_EMAIL=noreply@yourcompany.com
SES_REPLY_TO_EMAIL=support@yourcompany.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_MESSAGING_SERVICE_SID=your_messaging_service_sid

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_token

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# AI Service (OpenAI)
OPENAI_API_KEY=your_api_key
OPENAI_ORGANIZATION=your_org_id

# Analytics
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_api_secret

# Authentication (Auth0)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# Monitoring (New Relic)
NEW_RELIC_LICENSE_KEY=your_license_key
NEW_RELIC_APP_NAME=Renewal Management System
```

## Cost Estimation

### Monthly Cost Breakdown (Estimated for 10,000 active users)
- **File Storage (AWS S3)**: ~$25/month (100GB storage)
- **Email Service (AWS SES)**: ~$10/month (100K emails)
- **SMS Service (Twilio)**: ~$75/month (10K SMS)
- **WhatsApp Business API**: ~$50/month (10K messages)
- **Payment Gateway**: ~2.5% transaction fee
- **AI Service (OpenAI)**: ~$100/month (moderate usage)
- **Monitoring (New Relic)**: ~$99/month
- **Authentication (Auth0)**: ~$23/month (1K MAU)

**Total Estimated Monthly Cost**: ~$382 + transaction fees

### Free Tier Benefits
- **AWS S3**: 5GB free for 12 months
- **AWS SES**: 62,000 emails/month free
- **Firebase FCM**: Unlimited free notifications
- **Google Analytics**: Free tier available

This comprehensive integration guide provides all the necessary information for implementing third-party API services required by the application. 