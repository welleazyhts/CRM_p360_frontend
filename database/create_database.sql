-- =====================================================================================
-- Py360 Insurance Policy Renewal Management System - Database Creation Script
-- =====================================================================================
-- Version: 2.0
-- Created: January 2024
-- Database: PostgreSQL 14+
-- Purpose: Complete database schema creation for the renewal management system
-- =====================================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =====================================================================================
-- 1. USER MANAGEMENT TABLES
-- =====================================================================================

-- Roles table for RBAC system
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table for authentication and user management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    job_title VARCHAR(100),
    role_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url VARCHAR(500),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP
);

-- User sessions for tracking active sessions
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 2. CUSTOMER AND POLICY MANAGEMENT TABLES
-- =====================================================================================

-- Customers table for customer information
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address JSONB,
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    kyc_documents JSONB,
    communication_preferences JSONB DEFAULT '{"email": true, "sms": true, "whatsapp": false}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Policy types lookup table
CREATE TABLE policy_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    base_premium DECIMAL(12,2),
    coverage_details JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Policies table for insurance policies
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id) ON DELETE RESTRICT,
    policy_type_id INTEGER REFERENCES policy_types(id) ON DELETE RESTRICT,
    policy_type VARCHAR(50) NOT NULL,
    premium_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
    renewal_date DATE,
    grace_period_days INTEGER DEFAULT 30,
    agent_id INTEGER REFERENCES users(id),
    coverage_details JSONB,
    auto_renewal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 3. FILE MANAGEMENT TABLES
-- =====================================================================================

-- File uploads table for tracking uploaded files
CREATE TABLE file_uploads (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    upload_status VARCHAR(20) DEFAULT 'processing' CHECK (upload_status IN ('processing', 'completed', 'failed', 'cancelled')),
    total_records INTEGER,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    upload_path VARCHAR(500),
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    error_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 4. CAMPAIGN MANAGEMENT TABLES
-- =====================================================================================

-- Templates for communication
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(20) NOT NULL CHECK (template_type IN ('email', 'whatsapp', 'sms')),
    category VARCHAR(50),
    subject VARCHAR(500),
    content TEXT NOT NULL,
    variables JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns for marketing and communication
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(20) NOT NULL CHECK (campaign_type IN ('email', 'whatsapp', 'sms', 'multi-channel')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
    upload_id INTEGER REFERENCES file_uploads(id) ON DELETE SET NULL,
    template_id INTEGER REFERENCES templates(id) ON DELETE SET NULL,
    target_count INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    schedule_type VARCHAR(20) DEFAULT 'immediate' CHECK (schedule_type IN ('immediate', 'scheduled')),
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 5. CASE MANAGEMENT TABLES
-- =====================================================================================

-- Renewal cases for policy renewal tracking
CREATE TABLE renewal_cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,
    policy_id INTEGER REFERENCES policies(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE RESTRICT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'pending_payment', 'completed', 'cancelled', 'expired')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    renewal_amount DECIMAL(12,2),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP,
    communication_attempts INTEGER DEFAULT 0,
    last_contact_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 6. EMAIL MANAGEMENT TABLES
-- =====================================================================================

-- Emails for email communication tracking
CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(255) UNIQUE NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    body_text TEXT,
    body_html TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    received_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 7. SURVEY TABLES
-- =====================================================================================

-- Surveys for customer feedback collection
CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'paused', 'closed')),
    questions JSONB NOT NULL,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    response_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Survey responses for storing customer responses
CREATE TABLE survey_responses (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER REFERENCES surveys(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    responses JSONB NOT NULL,
    completion_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 8. CLAIMS MANAGEMENT TABLES
-- =====================================================================================

-- Claims for insurance claim processing
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    policy_id INTEGER REFERENCES policies(id) ON DELETE RESTRICT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE RESTRICT,
    claim_type VARCHAR(50) NOT NULL,
    claim_amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'settled')),
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    incident_date DATE NOT NULL,
    reported_date DATE NOT NULL,
    settlement_amount DECIMAL(12,2),
    settlement_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 9. NOTIFICATIONS TABLES
-- =====================================================================================

-- Notifications for in-app notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- 10. AUDIT TABLES
-- =====================================================================================

-- Audit logs for compliance and tracking
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================================================

-- User Management Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role_id, status);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);

-- Customer and Policy Indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_policies_customer ON policies(customer_id);
CREATE INDEX idx_policies_number ON policies(policy_number);
CREATE INDEX idx_policies_renewal_date ON policies(renewal_date);
CREATE INDEX idx_policies_status ON policies(status);

-- Campaign Management Indexes
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_type ON campaigns(campaign_type);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);

-- Case Management Indexes
CREATE INDEX idx_renewal_cases_policy ON renewal_cases(policy_id);
CREATE INDEX idx_renewal_cases_status ON renewal_cases(status);
CREATE INDEX idx_renewal_cases_assigned ON renewal_cases(assigned_to);

-- Email Management Indexes
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_assigned_to ON emails(assigned_to);
CREATE INDEX idx_emails_received_at ON emails(received_at);

-- File Management Indexes
CREATE INDEX idx_file_uploads_status ON file_uploads(upload_status);
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);

-- Audit Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS UTF8
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
UTF8 language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_renewal_cases_updated_at BEFORE UPDATE ON renewal_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- INITIAL DATA SEEDING
-- =====================================================================================

-- Insert default roles
INSERT INTO roles (name, display_name, description, permissions) VALUES
('super_admin', 'Super Administrator', 'Full system access', '["dashboard", "upload", "cases", "closed-cases", "policy-timeline", "logs", "claims", "emails", "email-dashboard", "email-analytics", "bulk-email", "campaigns", "templates", "feedback", "survey-designer", "whatsapp-flow", "settings", "billing", "users", "profile"]'),
('campaign_manager', 'Campaign Manager', 'Campaign and communication management', '["dashboard", "upload", "cases", "closed-cases", "policy-timeline", "emails", "email-dashboard", "email-analytics", "bulk-email", "campaigns", "templates", "feedback", "survey-designer", "whatsapp-flow", "profile"]'),
('operations_manager', 'Operations Manager', 'Operational management and case handling', '["dashboard", "upload", "cases", "closed-cases", "policy-timeline", "emails", "email-dashboard", "campaigns", "templates", "feedback", "profile"]'),
('agent', 'Agent', 'Standard operational tasks', '["dashboard", "cases", "closed-cases", "policy-timeline", "logs", "emails", "email-dashboard", "profile"]'),
('viewer', 'Viewer', 'Read-only access', '["dashboard", "cases", "closed-cases", "policy-timeline", "profile"]');

-- Insert default policy types
INSERT INTO policy_types (name, description, base_premium, coverage_details) VALUES
('Auto Insurance', 'Comprehensive automobile insurance coverage', 1200.00, '{"liability": "300000", "collision": "500", "comprehensive": "250"}'),
('Home Insurance', 'Residential property insurance coverage', 950.00, '{"dwelling": "500000", "personal_property": "250000", "liability": "300000"}'),
('Life Insurance', 'Term life insurance coverage', 2400.00, '{"death_benefit": "500000", "term": "20_years"}'),
('Health Insurance', 'Medical and health coverage', 3600.00, '{"deductible": "2000", "out_of_pocket_max": "8000"}');

-- Insert default admin user (password: Admin123!)
INSERT INTO users (email, password_hash, first_name, last_name, role_id, status) VALUES
('admin@renewiq.com', crypt('Admin123!', gen_salt('bf', 10)), 'System', 'Administrator', 1, 'active');

-- Insert default templates
INSERT INTO templates (name, template_type, category, subject, content, variables, created_by) VALUES
('Renewal Reminder - 30 Days', 'email', 'renewal', 'Your Policy Renewal is Due Soon', 'Dear {customer_name}, your policy {policy_number} expires in 30 days. Please renew to continue your coverage.', '["customer_name", "policy_number", "expiry_date", "renewal_amount"]', 1),
('Payment Confirmation', 'email', 'payment', 'Payment Received - Policy Renewed', 'Thank you {customer_name}! We have received your payment of  for policy {policy_number}.', '["customer_name", "policy_number", "payment_amount", "payment_date"]', 1),
('Welcome Message', 'whatsapp', 'welcome', NULL, 'Welcome to Py360 Insurance! Your policy {policy_number} is now active.', '["customer_name", "policy_number"]', 1);

-- =====================================================================================
-- COMPLETION MESSAGE
-- =====================================================================================

-- Display completion message
DO UTF8
BEGIN
    RAISE NOTICE '=====================================================================================';
    RAISE NOTICE 'Py360 Insurance Policy Renewal Management System Database';
    RAISE NOTICE 'Database schema creation completed successfully!';
    RAISE NOTICE 'Version: 2.0';
    RAISE NOTICE 'Created: %', CURRENT_TIMESTAMP;
    RAISE NOTICE '=====================================================================================';
    RAISE NOTICE 'Tables created: 15+ core tables';
    RAISE NOTICE 'Indexes created: 25+ performance indexes';
    RAISE NOTICE 'Triggers created: 5 automatic update triggers';
    RAISE NOTICE '=====================================================================================';
    RAISE NOTICE 'Default admin user: admin@renewiq.com (password: Admin123!)';
    RAISE NOTICE 'Default roles: 5 roles created';
    RAISE NOTICE 'Default templates: 3 templates created';
    RAISE NOTICE '=====================================================================================';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Review and customize security policies';
    RAISE NOTICE '2. Configure backup and monitoring';
    RAISE NOTICE '3. Set up connection pooling';
    RAISE NOTICE '4. Configure environment-specific settings';
    RAISE NOTICE '=====================================================================================';
END UTF8;
