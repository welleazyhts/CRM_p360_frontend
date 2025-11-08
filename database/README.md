# Database Setup Guide

## Overview
This directory contains all database-related files for the Py360 Insurance Policy Renewal Management System.

## Files Structure
`
database/
 create_database.sql          # Main database creation script
 setup_database.sh           # Automated setup script (Linux/Mac)
 migrations/                 # Database migration files
    001_initial_schema.sql
 README.md                   # This file
`

## Quick Setup

### Prerequisites
- PostgreSQL 14+ installed and running
- Database admin credentials
- Sufficient disk space (minimum 10GB)

### Setup Steps

#### Option 1: Automated Setup (Linux/Mac)
`ash
# Make script executable
chmod +x setup_database.sh

# Run setup
./setup_database.sh
`

#### Option 2: Manual Setup
`ash
# 1. Create database
createdb renewiq_renewal

# 2. Create user
psql -c "CREATE USER renewiq_user WITH PASSWORD 'SecurePassword123!';"

# 3. Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE renewiq_renewal TO renewiq_user;"

# 4. Run schema script
psql -d renewiq_renewal -f create_database.sql
`

#### Option 3: Windows PowerShell
`powershell
# 1. Set environment variables
 = "renewiq_renewal"
 = "renewiq_user"
 = "SecurePassword123!"

# 2. Create database
psql -U postgres -c "CREATE DATABASE renewiq_renewal;"

# 3. Create user
psql -U postgres -c "CREATE USER renewiq_user WITH PASSWORD 'SecurePassword123!';"

# 4. Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE renewiq_renewal TO renewiq_user;"

# 5. Run schema script
psql -U renewiq_user -d renewiq_renewal -f create_database.sql
`

## Database Schema

### Core Tables (15+)
1. **User Management**: users, roles, user_sessions
2. **Customer Management**: customers, policies, policy_types
3. **Campaign Management**: campaigns, templates
4. **File Management**: file_uploads
5. **Case Management**: renewal_cases
6. **Email Management**: emails
7. **Survey Management**: surveys, survey_responses
8. **Claims Management**: claims
9. **Notifications**: notifications
10. **Audit**: audit_logs

### Features
- **25+ Performance Indexes**: Optimized for fast queries
- **5 Automatic Triggers**: Updated timestamps and data validation
- **Row-Level Security**: Enterprise-grade data protection
- **JSONB Support**: Flexible data storage for complex objects
- **Audit Logging**: Complete activity tracking

## Default Credentials
- **Admin Email**: admin@renewiq.com
- **Admin Password**: Admin123!

 **Important**: Change the default password after first login!

## Environment Variables
`ash
DB_NAME=renewiq_renewal
DB_USER=renewiq_user
DB_PASSWORD=SecurePassword123!
DB_HOST=localhost
DB_PORT=5432
`

## Connection String
`
postgresql://renewiq_user:SecurePassword123!@localhost:5432/renewiq_renewal
`

## Verification
After setup, verify the installation:
`sql
-- Check tables created
\dt

-- Check admin user
SELECT email, first_name, last_name FROM users WHERE email = 'admin@renewiq.com';

-- Check roles
SELECT name, display_name FROM roles;

-- Check database size
SELECT pg_size_pretty(pg_database_size('renewiq_renewal'));
`

## Backup and Maintenance

### Create Backup
`ash
pg_dump -h localhost -U renewiq_user -d renewiq_renewal > backup_.sql
`

### Restore Backup
`ash
psql -h localhost -U renewiq_user -d renewiq_renewal < backup_20240101.sql
`

### Regular Maintenance
`sql
-- Update statistics
ANALYZE;

-- Vacuum database
VACUUM;

-- Check database size
SELECT pg_size_pretty(pg_database_size('renewiq_renewal'));
`

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check user privileges and database ownership
2. **Connection Refused**: Verify PostgreSQL is running and accessible
3. **Disk Space**: Ensure sufficient disk space for database operations
4. **Encoding Issues**: Use UTF-8 encoding for all operations

### Performance Monitoring
`sql
-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'renewiq_renewal';

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
`

## Security Best Practices
1. **Change Default Passwords**: Update all default credentials
2. **Use SSL/TLS**: Enable encrypted connections in production
3. **Regular Backups**: Implement automated backup procedures
4. **Access Control**: Use role-based permissions
5. **Audit Logging**: Monitor all database activities
6. **Network Security**: Restrict database access to authorized IPs

## Support
For database-related issues:
1. Check the troubleshooting section above
2. Review PostgreSQL logs for detailed error messages
3. Consult the main project documentation
4. Contact the development team for assistance

---
**Note**: This database schema supports the complete Py360 Insurance Policy Renewal Management System with enterprise-grade features for security, performance, and compliance.
