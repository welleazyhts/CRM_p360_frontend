-- =====================================================================================
-- DNC (Do Not Call) System Database Migration
-- Version: 1.0
-- Created: 2024-01-15
-- Description: Complete DNC management system with client-wise registry, override management, and compliance tracking
-- =====================================================================================

-- Create clients table if it doesn't exist (for client-wise DNC management)
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    client_code VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DNC Registry Table - Main table for storing DNC entries
CREATE TABLE dnc_registry (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    dnc_type VARCHAR(20) NOT NULL CHECK (dnc_type IN ('phone', 'email', 'both')),
    dnc_source VARCHAR(30) NOT NULL CHECK (dnc_source IN ('government', 'customer', 'manual', 'system', 'complaint')),
    reason VARCHAR(500),
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    override_allowed BOOLEAN DEFAULT FALSE,
    override_reason VARCHAR(500),
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT dnc_registry_contact_check CHECK (
        (dnc_type = 'phone' AND customer_phone IS NOT NULL) OR
        (dnc_type = 'email' AND customer_email IS NOT NULL) OR
        (dnc_type = 'both' AND customer_phone IS NOT NULL AND customer_email IS NOT NULL)
    ),
    
    -- Unique constraint to prevent duplicate entries
    CONSTRAINT dnc_registry_unique_client_contact UNIQUE (client_id, customer_phone, customer_email, dnc_type)
);

-- DNC Override Logs Table - Track all override requests and approvals
CREATE TABLE dnc_override_logs (
    id SERIAL PRIMARY KEY,
    dnc_registry_id INTEGER REFERENCES dnc_registry(id) ON DELETE CASCADE,
    override_type VARCHAR(20) NOT NULL CHECK (override_type IN ('temporary', 'permanent')),
    override_reason VARCHAR(500) NOT NULL,
    requested_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    authorized_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    override_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    override_end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'revoked')),
    approval_reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DNC Blocked Messages Table - Log all blocked message attempts
CREATE TABLE dnc_blocked_messages (
    id SERIAL PRIMARY KEY,
    dnc_registry_id INTEGER REFERENCES dnc_registry(id) ON DELETE CASCADE,
    campaign_id INTEGER, -- References campaigns(id) if from campaign
    case_id VARCHAR(100), -- References renewal_cases(case_number) if from case
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('email', 'sms', 'whatsapp', 'call')),
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(255),
    message_content TEXT,
    blocked_reason VARCHAR(500),
    attempted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE
);

-- DNC Compliance Reports Table - Store compliance report data
CREATE TABLE dnc_compliance_reports (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    report_type VARCHAR(30) NOT NULL CHECK (report_type IN ('monthly', 'quarterly', 'annual', 'custom')),
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    total_messages_sent INTEGER DEFAULT 0,
    total_messages_blocked INTEGER DEFAULT 0,
    total_overrides_requested INTEGER DEFAULT 0,
    total_overrides_approved INTEGER DEFAULT 0,
    compliance_score DECIMAL(5,2), -- Compliance score as percentage
    report_data JSONB, -- Detailed report data in JSON format
    generated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DNC Government Sync Log Table - Track government DNC registry synchronization
CREATE TABLE dnc_government_sync_log (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(20) NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual')),
    sync_status VARCHAR(20) NOT NULL CHECK (sync_status IN ('started', 'completed', 'failed', 'partial')),
    records_processed INTEGER DEFAULT 0,
    records_added INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    sync_source VARCHAR(255), -- URL or source of government data
    error_details TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    started_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- DNC Deduplication Log Table - Track deduplication operations
CREATE TABLE dnc_deduplication_log (
    id SERIAL PRIMARY KEY,
    operation_type VARCHAR(30) NOT NULL CHECK (operation_type IN ('upload', 'campaign', 'manual')),
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    upload_id INTEGER, -- References file_uploads(id) if from upload
    campaign_id INTEGER, -- References campaigns(id) if from campaign
    total_contacts INTEGER DEFAULT 0,
    duplicate_contacts INTEGER DEFAULT 0,
    dnc_blocked_contacts INTEGER DEFAULT 0,
    clean_contacts INTEGER DEFAULT 0,
    deduplication_rules JSONB, -- Rules used for deduplication
    processed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================================================

-- Primary indexes for DNC registry
CREATE INDEX idx_dnc_registry_client_phone ON dnc_registry(client_id, customer_phone) WHERE customer_phone IS NOT NULL;
CREATE INDEX idx_dnc_registry_client_email ON dnc_registry(client_id, customer_email) WHERE customer_email IS NOT NULL;
CREATE INDEX idx_dnc_registry_active ON dnc_registry(is_active, effective_date);
CREATE INDEX idx_dnc_registry_source ON dnc_registry(dnc_source);
CREATE INDEX idx_dnc_registry_type ON dnc_registry(dnc_type);
CREATE INDEX idx_dnc_registry_expiry ON dnc_registry(expiry_date) WHERE expiry_date IS NOT NULL;

-- Indexes for override logs
CREATE INDEX idx_dnc_override_logs_registry ON dnc_override_logs(dnc_registry_id);
CREATE INDEX idx_dnc_override_logs_status ON dnc_override_logs(status);
CREATE INDEX idx_dnc_override_logs_requested_by ON dnc_override_logs(requested_by);
CREATE INDEX idx_dnc_override_logs_dates ON dnc_override_logs(override_start_date, override_end_date);

-- Indexes for blocked messages
CREATE INDEX idx_dnc_blocked_messages_registry ON dnc_blocked_messages(dnc_registry_id);
CREATE INDEX idx_dnc_blocked_messages_client ON dnc_blocked_messages(client_id);
CREATE INDEX idx_dnc_blocked_messages_campaign ON dnc_blocked_messages(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_dnc_blocked_messages_case ON dnc_blocked_messages(case_id) WHERE case_id IS NOT NULL;
CREATE INDEX idx_dnc_blocked_messages_attempted_at ON dnc_blocked_messages(attempted_at);

-- Indexes for compliance reports
CREATE INDEX idx_dnc_compliance_reports_client ON dnc_compliance_reports(client_id);
CREATE INDEX idx_dnc_compliance_reports_period ON dnc_compliance_reports(report_period_start, report_period_end);
CREATE INDEX idx_dnc_compliance_reports_type ON dnc_compliance_reports(report_type);

-- Indexes for government sync log
CREATE INDEX idx_dnc_government_sync_log_status ON dnc_government_sync_log(sync_status);
CREATE INDEX idx_dnc_government_sync_log_started_at ON dnc_government_sync_log(started_at);

-- Indexes for deduplication log
CREATE INDEX idx_dnc_deduplication_log_client ON dnc_deduplication_log(client_id);
CREATE INDEX idx_dnc_deduplication_log_upload ON dnc_deduplication_log(upload_id) WHERE upload_id IS NOT NULL;
CREATE INDEX idx_dnc_deduplication_log_campaign ON dnc_deduplication_log(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_dnc_deduplication_log_processed_at ON dnc_deduplication_log(processed_at);

-- =====================================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================================================

-- Trigger to update updated_at timestamp for DNC registry
CREATE OR REPLACE FUNCTION update_dnc_registry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dnc_registry_updated_at
    BEFORE UPDATE ON dnc_registry
    FOR EACH ROW
    EXECUTE FUNCTION update_dnc_registry_updated_at();

-- Trigger to update updated_at timestamp for override logs
CREATE TRIGGER update_dnc_override_logs_updated_at
    BEFORE UPDATE ON dnc_override_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at timestamp for clients
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================================================

-- View for active DNC entries with client information
CREATE VIEW active_dnc_entries AS
SELECT 
    dr.id,
    dr.client_id,
    c.client_name,
    c.client_code,
    dr.customer_phone,
    dr.customer_email,
    dr.customer_name,
    dr.dnc_type,
    dr.dnc_source,
    dr.reason,
    dr.effective_date,
    dr.expiry_date,
    dr.override_allowed,
    dr.created_at,
    dr.updated_at
FROM dnc_registry dr
JOIN clients c ON dr.client_id = c.id
WHERE dr.is_active = TRUE
    AND (dr.expiry_date IS NULL OR dr.expiry_date > CURRENT_DATE);

-- View for DNC compliance summary by client
CREATE VIEW dnc_compliance_summary AS
SELECT 
    c.id as client_id,
    c.client_name,
    c.client_code,
    COUNT(dr.id) as total_dnc_entries,
    COUNT(CASE WHEN dr.dnc_source = 'government' THEN 1 END) as government_dnc_entries,
    COUNT(CASE WHEN dr.dnc_source = 'customer' THEN 1 END) as customer_dnc_entries,
    COUNT(CASE WHEN dr.dnc_type = 'phone' THEN 1 END) as phone_dnc_entries,
    COUNT(CASE WHEN dr.dnc_type = 'email' THEN 1 END) as email_dnc_entries,
    COUNT(CASE WHEN dr.dnc_type = 'both' THEN 1 END) as both_dnc_entries,
    COUNT(CASE WHEN dr.override_allowed = TRUE THEN 1 END) as override_allowed_entries
FROM clients c
LEFT JOIN dnc_registry dr ON c.id = dr.client_id AND dr.is_active = TRUE
GROUP BY c.id, c.client_name, c.client_code;

-- View for recent DNC activities
CREATE VIEW recent_dnc_activities AS
SELECT 
    'DNC_ADDED' as activity_type,
    dr.id as reference_id,
    dr.client_id,
    c.client_name,
    dr.customer_name,
    dr.customer_phone,
    dr.customer_email,
    dr.dnc_source,
    dr.reason as activity_reason,
    u.name as performed_by,
    dr.created_at as activity_date
FROM dnc_registry dr
JOIN clients c ON dr.client_id = c.id
LEFT JOIN users u ON dr.created_by = u.id
WHERE dr.created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'OVERRIDE_REQUESTED' as activity_type,
    dol.id as reference_id,
    dr.client_id,
    c.client_name,
    dr.customer_name,
    dr.customer_phone,
    dr.customer_email,
    'override' as dnc_source,
    dol.override_reason as activity_reason,
    u.name as performed_by,
    dol.created_at as activity_date
FROM dnc_override_logs dol
JOIN dnc_registry dr ON dol.dnc_registry_id = dr.id
JOIN clients c ON dr.client_id = c.id
LEFT JOIN users u ON dol.requested_by = u.id
WHERE dol.created_at >= CURRENT_DATE - INTERVAL '30 days'

ORDER BY activity_date DESC;

-- =====================================================================================
-- FUNCTIONS FOR DNC OPERATIONS
-- =====================================================================================

-- Function to check if a contact is in DNC registry
CREATE OR REPLACE FUNCTION check_dnc_status(
    p_client_id INTEGER,
    p_phone VARCHAR(20) DEFAULT NULL,
    p_email VARCHAR(255) DEFAULT NULL,
    p_channel VARCHAR(20) DEFAULT 'phone'
)
RETURNS TABLE (
    is_blocked BOOLEAN,
    dnc_id INTEGER,
    dnc_type VARCHAR(20),
    dnc_source VARCHAR(30),
    reason VARCHAR(500),
    override_allowed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TRUE as is_blocked,
        dr.id as dnc_id,
        dr.dnc_type,
        dr.dnc_source,
        dr.reason,
        dr.override_allowed
    FROM dnc_registry dr
    WHERE dr.client_id = p_client_id
        AND dr.is_active = TRUE
        AND (dr.expiry_date IS NULL OR dr.expiry_date > CURRENT_DATE)
        AND (
            (p_channel IN ('sms', 'whatsapp', 'call') AND dr.dnc_type IN ('phone', 'both') AND dr.customer_phone = p_phone) OR
            (p_channel = 'email' AND dr.dnc_type IN ('email', 'both') AND dr.customer_email = p_email)
        )
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to add DNC entry
CREATE OR REPLACE FUNCTION add_dnc_entry(
    p_client_id INTEGER,
    p_customer_phone VARCHAR(20),
    p_customer_email VARCHAR(255),
    p_customer_name VARCHAR(255),
    p_dnc_type VARCHAR(20),
    p_dnc_source VARCHAR(30),
    p_reason VARCHAR(500),
    p_override_allowed BOOLEAN DEFAULT FALSE,
    p_created_by INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_dnc_id INTEGER;
BEGIN
    INSERT INTO dnc_registry (
        client_id, customer_phone, customer_email, customer_name,
        dnc_type, dnc_source, reason, override_allowed, created_by
    ) VALUES (
        p_client_id, p_customer_phone, p_customer_email, p_customer_name,
        p_dnc_type, p_dnc_source, p_reason, p_override_allowed, p_created_by
    ) RETURNING id INTO v_dnc_id;
    
    RETURN v_dnc_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log blocked message
CREATE OR REPLACE FUNCTION log_blocked_message(
    p_dnc_registry_id INTEGER,
    p_campaign_id INTEGER DEFAULT NULL,
    p_case_id VARCHAR(100) DEFAULT NULL,
    p_message_type VARCHAR(20),
    p_recipient_phone VARCHAR(20) DEFAULT NULL,
    p_recipient_email VARCHAR(255) DEFAULT NULL,
    p_message_content TEXT DEFAULT NULL,
    p_blocked_reason VARCHAR(500),
    p_attempted_by INTEGER DEFAULT NULL,
    p_client_id INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_log_id INTEGER;
BEGIN
    INSERT INTO dnc_blocked_messages (
        dnc_registry_id, campaign_id, case_id, message_type,
        recipient_phone, recipient_email, message_content,
        blocked_reason, attempted_by, client_id
    ) VALUES (
        p_dnc_registry_id, p_campaign_id, p_case_id, p_message_type,
        p_recipient_phone, p_recipient_email, p_message_content,
        p_blocked_reason, p_attempted_by, p_client_id
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================================================

-- Insert sample clients
INSERT INTO clients (client_code, client_name, industry, contact_email, contact_phone) VALUES
('CLIENT-001', 'HDFC Life Insurance', 'Insurance', 'contact@hdfclife.com', '1800-266-9777'),
('CLIENT-002', 'ICICI Prudential', 'Insurance', 'contact@iciciprulife.com', '1800-222-999'),
('CLIENT-003', 'SBI Life Insurance', 'Insurance', 'contact@sbilife.co.in', '1800-267-9090')
ON CONFLICT (client_code) DO NOTHING;

-- Insert sample DNC entries
INSERT INTO dnc_registry (client_id, customer_phone, customer_email, customer_name, dnc_type, dnc_source, reason, override_allowed) VALUES
(1, '9876543210', 'arjun.sharma@gmail.com', 'Arjun Sharma', 'phone', 'customer', 'Customer requested to be removed from marketing calls', FALSE),
(2, '9876543211', 'meera.kapoor@gmail.com', 'Meera Kapoor', 'both', 'government', 'Registered in TRAI DNC Registry', TRUE),
(1, '9876543212', 'vikram.singh@gmail.com', 'Vikram Singh', 'email', 'manual', 'Compliance team added - multiple complaints', TRUE)
ON CONFLICT (client_id, customer_phone, customer_email, dnc_type) DO NOTHING;

-- =====================================================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================================================

COMMENT ON TABLE dnc_registry IS 'Main DNC registry table storing all Do Not Call entries by client';
COMMENT ON TABLE dnc_override_logs IS 'Logs all DNC override requests and their approval status';
COMMENT ON TABLE dnc_blocked_messages IS 'Logs all message attempts that were blocked due to DNC restrictions';
COMMENT ON TABLE dnc_compliance_reports IS 'Stores compliance reports for regulatory purposes';
COMMENT ON TABLE dnc_government_sync_log IS 'Tracks synchronization with government DNC registries';
COMMENT ON TABLE dnc_deduplication_log IS 'Logs deduplication operations for campaigns and uploads';

COMMENT ON COLUMN dnc_registry.dnc_type IS 'Type of DNC restriction: phone, email, or both';
COMMENT ON COLUMN dnc_registry.dnc_source IS 'Source of DNC entry: government, customer, manual, system, or complaint';
COMMENT ON COLUMN dnc_registry.override_allowed IS 'Whether this DNC entry can be overridden with proper authorization';
COMMENT ON COLUMN dnc_override_logs.override_type IS 'Type of override: temporary or permanent';
COMMENT ON COLUMN dnc_override_logs.status IS 'Status of override request: pending, approved, rejected, expired, or revoked';

-- =====================================================================================
-- GRANT PERMISSIONS
-- =====================================================================================

-- Grant permissions to application roles (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON dnc_registry TO renewal_app_role;
-- GRANT SELECT, INSERT, UPDATE ON dnc_override_logs TO renewal_app_role;
-- GRANT SELECT, INSERT ON dnc_blocked_messages TO renewal_app_role;
-- GRANT SELECT, INSERT ON dnc_compliance_reports TO renewal_app_role;
-- GRANT SELECT, INSERT, UPDATE ON dnc_government_sync_log TO renewal_app_role;
-- GRANT SELECT, INSERT ON dnc_deduplication_log TO renewal_app_role;

-- =====================================================================================
-- MIGRATION COMPLETE
-- =====================================================================================

-- Log the migration completion
INSERT INTO migration_log (migration_name, migration_version, applied_at) VALUES
('DNC System Migration', '002', CURRENT_TIMESTAMP)
ON CONFLICT (migration_name) DO UPDATE SET 
    migration_version = EXCLUDED.migration_version,
    applied_at = EXCLUDED.applied_at; 