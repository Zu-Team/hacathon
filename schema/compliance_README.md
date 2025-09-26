# Compliance Manager Database Schema

This document describes the database schema for the Nexus Bank Compliance & Risk Management System.

## Database Overview

The compliance system uses MySQL and consists of 6 main tables designed to handle compliance incidents, risk assessments, alerts, and analytics.

## Tables

### 1. compliance_incidents
**Purpose**: Stores all compliance incidents and risk assessments

**Key Fields**:
- `id`: Unique incident identifier
- `type`: Incident type (transaction, document, customer, communication)
- `timestamp`: When the incident occurred
- `amount`: Transaction amount (if applicable)
- `description`: Detailed incident description
- `risk_score`: Risk score from 0-10
- `country`: Country where incident occurred
- `customer_id`: Associated customer ID
- `entity_type`: Type of entity (Individual, Corporate)
- `audit_status`: Current status (clear, warning, violation)

### 2. compliance_checks
**Purpose**: Stores detailed compliance check results for each incident

**Key Fields**:
- `incident_id`: Links to compliance_incidents table
- `aml_score`: Anti-Money Laundering score (0-10)
- `kyc_status`: Know Your Customer status (verified, unverified, expired)
- `gdpr_compliance`: GDPR compliance status
- `pci_dss_flag`: PCI DSS flag status
- `suspicious_pattern`: Suspicious pattern detection flag

### 3. risk_categories
**Purpose**: Defines risk level categories and thresholds

**Key Fields**:
- `name`: Category name (Low Risk, Medium Risk, High Risk)
- `min_score`: Minimum risk score for category
- `max_score`: Maximum risk score for category
- `color_code`: Hex color code for UI display
- `priority`: Priority level (low, medium, high, critical)

### 4. compliance_alerts
**Purpose**: Stores automated alerts and notifications

**Key Fields**:
- `incident_id`: Links to compliance_incidents table
- `alert_type`: Type of alert (AML, KYC, GDPR, PCI, SUSPICIOUS, RISK_THRESHOLD)
- `severity`: Alert severity (low, medium, high, critical)
- `message`: Alert message
- `status`: Alert status (active, acknowledged, resolved)

### 5. compliance_metrics
**Purpose**: Stores calculated metrics and KPIs for analytics

**Key Fields**:
- `metric_date`: Date for the metrics
- `total_incidents`: Total incidents for the day
- `violations_count`: Number of violations
- `warnings_count`: Number of warnings
- `clear_count`: Number of clear incidents
- `avg_risk_score`: Average risk score for the day
- `high_risk_count`: High risk incidents count
- `medium_risk_count`: Medium risk incidents count
- `low_risk_count`: Low risk incidents count

### 6. compliance_rules
**Purpose**: Stores business rules and thresholds

**Key Fields**:
- `rule_name`: Name of the rule
- `rule_type`: Type of rule (risk_threshold, amount_limit, frequency_limit, pattern_detection)
- `threshold_value`: Threshold value for the rule
- `is_active`: Whether the rule is active
- `description`: Rule description

## Setup Instructions

### 1. Create Database
```bash
mysql -u root -p < compliance_database.sql
```

### 2. Load Sample Data
```bash
mysql -u root -p nexus_bank_compliance < compliance_sample_data.sql
```

### 3. Test Queries
```bash
mysql -u root -p nexus_bank_compliance < compliance_queries.sql
```

## Sample Data

The database comes with sample data including:
- 16 compliance incidents with various risk levels
- Complete compliance check results for all incidents
- Active alerts for high-risk incidents
- Daily metrics for analytics
- Risk categories and business rules

## Common Use Cases

### 1. Dashboard Overview
```sql
-- Get compliance statistics summary
SELECT 
    COUNT(*) as total_incidents,
    SUM(CASE WHEN audit_status = 'violation' THEN 1 ELSE 0 END) as violations_count,
    SUM(CASE WHEN audit_status = 'warning' THEN 1 ELSE 0 END) as warnings_count,
    AVG(risk_score) as avg_risk_score
FROM compliance_incidents;
```

### 2. Risk Analysis
```sql
-- Get risk distribution
SELECT 
    CASE 
        WHEN risk_score <= 5.0 THEN 'Low Risk'
        WHEN risk_score <= 7.5 THEN 'Medium Risk'
        ELSE 'High Risk'
    END as risk_category,
    COUNT(*) as incident_count
FROM compliance_incidents
GROUP BY risk_category;
```

### 3. Incident Filtering
```sql
-- Filter by type and status
SELECT * FROM compliance_incidents 
WHERE type = 'transaction' AND audit_status = 'violation'
ORDER BY risk_score DESC;
```

### 4. Alert Management
```sql
-- Get active alerts
SELECT ca.*, ci.type, ci.risk_score
FROM compliance_alerts ca
JOIN compliance_incidents ci ON ca.incident_id = ci.id
WHERE ca.status = 'active'
ORDER BY ca.severity DESC;
```

## Performance Optimization

The database includes indexes on frequently queried fields:
- `compliance_incidents.type`
- `compliance_incidents.risk_score`
- `compliance_incidents.audit_status`
- `compliance_incidents.timestamp`
- `compliance_checks.kyc_status`
- `compliance_alerts.status`

## Data Relationships

```
compliance_incidents (1) ←→ (1) compliance_checks
compliance_incidents (1) ←→ (*) compliance_alerts
compliance_incidents → risk_categories (via risk_score ranges)
compliance_metrics (aggregated from compliance_incidents)
```

## Maintenance

### Daily Tasks
- Run metrics update query to calculate daily statistics
- Clean up old resolved alerts (older than 90 days)

### Weekly Tasks
- Review and update compliance rules
- Analyze risk trends and patterns

### Monthly Tasks
- Archive old incident data
- Review and optimize database performance
- Update risk category thresholds if needed

## Security Considerations

- All tables include `created_at` and `updated_at` timestamps for audit trails
- Foreign key constraints ensure data integrity
- Risk scores are validated with CHECK constraints
- Sensitive data should be encrypted in production

## Integration with Frontend

The database schema matches the data structure used in the compliance-manager page:
- `ComplianceData` interface maps to `compliance_incidents` table
- `compliance_checks` table provides additional compliance details
- Analytics queries support the charts and metrics displayed in the UI
- Filtering queries support the search and filter functionality
