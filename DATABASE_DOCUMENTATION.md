# Database Documentation - Intelipro Insurance Policy Renewal System

**Version:** 2.1  
**Last Updated:** January 2025  
**Database Engine:** PostgreSQL 14+  
**Architecture:** Primary Database + Redis Cache

## Overview

The database is designed to support a comprehensive insurance policy renewal management system with advanced features including multi-channel campaigns, real-time analytics, case management, user administration, outstanding amounts tracking, social media integrations, AI-powered recommendations, and organizational hierarchy management.

## Core Tables

### 1. User Management
- **users**: Core user information and authentication
- **roles**: Role definitions and RBAC permissions
- **user_sessions**: Active session tracking

### 2. Customer and Policy Management
- **customers**: Customer information and profiles
- **policies**: Insurance policy information
- **policy_types**: Policy type definitions

### 3. Campaign Management
- **campaigns**: Marketing campaign information
- **templates**: Communication templates
- **campaign_recipients**: Individual message tracking

### 4. File Management
- **file_uploads**: File upload tracking and processing
- **upload_batches**: Batch processing management
- **files**: General file storage

### 5. Case Management
- **renewal_cases**: Policy renewal case tracking
- **case_history**: Case status change history

### 6. Email Management
- **emails**: Email communication tracking
- **email_accounts**: IMAP/SMTP account configuration
- **email_threads**: Conversation threading

### 7. Survey and Feedback
- **surveys**: Survey definitions
- **survey_responses**: Customer response data

### 8. Claims Processing
- **claims**: Insurance claim processing
- **claim_history**: Claim status tracking

### 9. WhatsApp Integration
- **whatsapp_templates**: WhatsApp Business API templates
- **whatsapp_messages**: Message tracking

### 10. Notifications
- **notifications**: In-app notifications
- **system_alerts**: System monitoring alerts

### 11. Audit and Compliance
- **audit_logs**: Complete system audit trail
- **data_retention_policies**: Data retention management

### 12. Outstanding Amounts Management (NEW - January 2025)
- **outstanding_amounts**: Payment tracking and installment management
- **customer_profiles**: Enhanced customer profiling with AI insights

### 13. Social Media Integration (NEW - January 2025)
- **social_media_integrations**: Multi-platform social media connections
- **platform_verifications**: Customer presence verification

### 14. Organizational Management (NEW - January 2025)
- **channels**: Customer acquisition channel management
- **organizational_hierarchy**: Multi-level organizational structure

### 15. Enhanced Analytics (NEW - January 2025)
- **vendor_communications**: Vendor performance tracking
- **communication_delivery_status**: Delivery status across all channels

## Setup Instructions

### Prerequisites
- PostgreSQL 14+ installed and running
- Sufficient disk space (minimum 10GB for development)
- Database user with CREATE DATABASE privileges

### Quick Setup
`ash
# 1. Navigate to database directory
cd database/

# 2. Set environment variables
export DB_NAME="intelipro_renewal"
export DB_USER="intelipro_user"
export DB_PASSWORD="SecurePassword123!"

# 3. Run the setup script
chmod +x setup_database.sh
./setup_database.sh
`

### Manual Setup
`ash
# 1. Create database
createdb intelipro_renewal

# 2. Run main schema script
psql -d intelipro_renewal -f create_database.sql
`

## Default Credentials
- **Admin Email**: admin@intelipro.com
- **Admin Password**: Admin123!

## Security Features
- Row-level security (RLS) enabled
- Encrypted password storage
- Audit logging for all operations
- Role-based access control (RBAC)

## Performance Optimization
- 50+ optimized indexes
- Partial indexes for active records
- Composite indexes for complex queries
- Query performance monitoring

## Backup and Recovery
- Daily automated backups
- Point-in-time recovery capability
- Cross-region replication
- Automated integrity checks

This database supports the complete Intelipro Insurance Policy Renewal Management System with enterprise-grade security, performance, and compliance features.
