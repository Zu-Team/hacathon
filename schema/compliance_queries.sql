-- Compliance Manager Common Queries
-- Nexus Bank Compliance & Risk Management System

USE nexus_bank_compliance;

-- ========================================
-- BASIC QUERIES
-- ========================================

-- Get all compliance incidents with their details
SELECT 
    ci.id,
    ci.type,
    ci.timestamp,
    ci.amount,
    ci.description,
    ci.risk_score,
    ci.country,
    ci.customer_id,
    ci.entity_type,
    ci.audit_status,
    cc.aml_score,
    cc.kyc_status,
    cc.gdpr_compliance,
    cc.pci_dss_flag,
    cc.suspicious_pattern
FROM compliance_incidents ci
LEFT JOIN compliance_checks cc ON ci.id = cc.incident_id
ORDER BY ci.timestamp DESC;

-- Get incidents by risk level
SELECT 
    ci.id,
    ci.type,
    ci.risk_score,
    ci.audit_status,
    CASE 
        WHEN ci.risk_score <= 5.0 THEN 'Low Risk'
        WHEN ci.risk_score <= 7.5 THEN 'Medium Risk'
        ELSE 'High Risk'
    END as risk_level
FROM compliance_incidents ci
ORDER BY ci.risk_score DESC;

-- ========================================
-- ANALYTICS QUERIES
-- ========================================

-- Get compliance statistics summary
SELECT 
    COUNT(*) as total_incidents,
    SUM(CASE WHEN audit_status = 'violation' THEN 1 ELSE 0 END) as violations_count,
    SUM(CASE WHEN audit_status = 'warning' THEN 1 ELSE 0 END) as warnings_count,
    SUM(CASE WHEN audit_status = 'clear' THEN 1 ELSE 0 END) as clear_count,
    AVG(risk_score) as avg_risk_score,
    SUM(CASE WHEN risk_score > 7.5 THEN 1 ELSE 0 END) as high_risk_count,
    SUM(CASE WHEN risk_score > 5.0 AND risk_score <= 7.5 THEN 1 ELSE 0 END) as medium_risk_count,
    SUM(CASE WHEN risk_score <= 5.0 THEN 1 ELSE 0 END) as low_risk_count
FROM compliance_incidents;

-- Get risk distribution by category
SELECT 
    CASE 
        WHEN risk_score <= 5.0 THEN 'Low Risk (≤5.0)'
        WHEN risk_score <= 7.5 THEN 'Medium Risk (5.1-7.5)'
        ELSE 'High Risk (>7.5)'
    END as risk_category,
    COUNT(*) as incident_count,
    AVG(risk_score) as avg_risk_score
FROM compliance_incidents
GROUP BY 
    CASE 
        WHEN risk_score <= 5.0 THEN 'Low Risk (≤5.0)'
        WHEN risk_score <= 7.5 THEN 'Medium Risk (5.1-7.5)'
        ELSE 'High Risk (>7.5)'
    END;

-- Get incident types analysis
SELECT 
    type,
    COUNT(*) as count,
    AVG(risk_score) as avg_risk_score,
    SUM(CASE WHEN audit_status = 'violation' THEN 1 ELSE 0 END) as violations,
    SUM(CASE WHEN audit_status = 'warning' THEN 1 ELSE 0 END) as warnings,
    SUM(CASE WHEN audit_status = 'clear' THEN 1 ELSE 0 END) as clear
FROM compliance_incidents
GROUP BY type
ORDER BY count DESC;

-- ========================================
-- FILTERING QUERIES
-- ========================================

-- Search incidents by description or ID
SELECT ci.*, cc.*
FROM compliance_incidents ci
LEFT JOIN compliance_checks cc ON ci.id = cc.incident_id
WHERE ci.description LIKE '%search_term%' 
   OR ci.id LIKE '%search_term%'
   OR ci.customer_id LIKE '%search_term%'
ORDER BY ci.timestamp DESC;

-- Filter by incident type
SELECT ci.*, cc.*
FROM compliance_incidents ci
LEFT JOIN compliance_checks cc ON ci.id = cc.incident_id
WHERE ci.type = 'transaction'
ORDER BY ci.timestamp DESC;

-- Filter by audit status
SELECT ci.*, cc.*
FROM compliance_incidents ci
LEFT JOIN compliance_checks cc ON ci.id = cc.incident_id
WHERE ci.audit_status = 'violation'
ORDER BY ci.timestamp DESC;

-- Filter by risk level
SELECT ci.*, cc.*
FROM compliance_incidents ci
LEFT JOIN compliance_checks cc ON ci.id = cc.incident_id
WHERE ci.risk_score > 7.5
ORDER BY ci.timestamp DESC;

-- ========================================
-- ALERT QUERIES
-- ========================================

-- Get active alerts
SELECT 
    ca.id,
    ca.incident_id,
    ca.alert_type,
    ca.severity,
    ca.message,
    ca.created_at,
    ci.type as incident_type,
    ci.risk_score
FROM compliance_alerts ca
JOIN compliance_incidents ci ON ca.incident_id = ci.id
WHERE ca.status = 'active'
ORDER BY ca.created_at DESC;

-- Get alerts by severity
SELECT 
    severity,
    COUNT(*) as alert_count
FROM compliance_alerts
WHERE status = 'active'
GROUP BY severity
ORDER BY 
    CASE severity 
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END;

-- ========================================
-- METRICS QUERIES
-- ========================================

-- Get daily metrics for the last 30 days
SELECT 
    metric_date,
    total_incidents,
    violations_count,
    warnings_count,
    clear_count,
    avg_risk_score
FROM compliance_metrics
WHERE metric_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY metric_date DESC;

-- Get compliance trends (weekly summary)
SELECT 
    WEEK(metric_date) as week_number,
    YEAR(metric_date) as year,
    SUM(total_incidents) as total_incidents,
    SUM(violations_count) as total_violations,
    AVG(avg_risk_score) as avg_risk_score
FROM compliance_metrics
GROUP BY YEAR(metric_date), WEEK(metric_date)
ORDER BY year DESC, week_number DESC;

-- ========================================
-- COMPLIANCE CHECKS QUERIES
-- ========================================

-- Get KYC status summary
SELECT 
    kyc_status,
    COUNT(*) as count,
    AVG(ci.risk_score) as avg_risk_score
FROM compliance_checks cc
JOIN compliance_incidents ci ON cc.incident_id = ci.id
GROUP BY kyc_status;

-- Get GDPR compliance status
SELECT 
    gdpr_compliance,
    COUNT(*) as count,
    AVG(ci.risk_score) as avg_risk_score
FROM compliance_checks cc
JOIN compliance_incidents ci ON cc.incident_id = ci.id
GROUP BY gdpr_compliance;

-- Get PCI DSS flagged incidents
SELECT 
    ci.id,
    ci.type,
    ci.amount,
    ci.risk_score,
    ci.audit_status
FROM compliance_incidents ci
JOIN compliance_checks cc ON ci.id = cc.incident_id
WHERE cc.pci_dss_flag = TRUE
ORDER BY ci.risk_score DESC;

-- Get suspicious pattern incidents
SELECT 
    ci.id,
    ci.type,
    ci.description,
    ci.risk_score,
    ci.audit_status,
    cc.aml_score
FROM compliance_incidents ci
JOIN compliance_checks cc ON ci.id = cc.incident_id
WHERE cc.suspicious_pattern = TRUE
ORDER BY ci.risk_score DESC;

-- ========================================
-- RISK ANALYSIS QUERIES
-- ========================================

-- Get top 10 highest risk incidents
SELECT 
    ci.id,
    ci.type,
    ci.risk_score,
    ci.audit_status,
    ci.amount,
    ci.customer_id
FROM compliance_incidents ci
ORDER BY ci.risk_score DESC
LIMIT 10;

-- Get incidents by country
SELECT 
    country,
    COUNT(*) as incident_count,
    AVG(risk_score) as avg_risk_score,
    SUM(CASE WHEN audit_status = 'violation' THEN 1 ELSE 0 END) as violations
FROM compliance_incidents
WHERE country IS NOT NULL
GROUP BY country
ORDER BY avg_risk_score DESC;

-- Get entity type analysis
SELECT 
    entity_type,
    COUNT(*) as count,
    AVG(risk_score) as avg_risk_score,
    SUM(CASE WHEN audit_status = 'violation' THEN 1 ELSE 0 END) as violations
FROM compliance_incidents
GROUP BY entity_type
ORDER BY avg_risk_score DESC;

-- ========================================
-- MAINTENANCE QUERIES
-- ========================================

-- Clean up old resolved alerts (older than 90 days)
DELETE FROM compliance_alerts 
WHERE status = 'resolved' 
  AND resolved_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Update daily metrics (run this daily)
INSERT INTO compliance_metrics (
    metric_date, 
    total_incidents, 
    violations_count, 
    warnings_count, 
    clear_count, 
    avg_risk_score,
    high_risk_count,
    medium_risk_count,
    low_risk_count
)
SELECT 
    CURDATE() as metric_date,
    COUNT(*) as total_incidents,
    SUM(CASE WHEN audit_status = 'violation' THEN 1 ELSE 0 END) as violations_count,
    SUM(CASE WHEN audit_status = 'warning' THEN 1 ELSE 0 END) as warnings_count,
    SUM(CASE WHEN audit_status = 'clear' THEN 1 ELSE 0 END) as clear_count,
    AVG(risk_score) as avg_risk_score,
    SUM(CASE WHEN risk_score > 7.5 THEN 1 ELSE 0 END) as high_risk_count,
    SUM(CASE WHEN risk_score > 5.0 AND risk_score <= 7.5 THEN 1 ELSE 0 END) as medium_risk_count,
    SUM(CASE WHEN risk_score <= 5.0 THEN 1 ELSE 0 END) as low_risk_count
FROM compliance_incidents
WHERE DATE(timestamp) = CURDATE()
ON DUPLICATE KEY UPDATE
    total_incidents = VALUES(total_incidents),
    violations_count = VALUES(violations_count),
    warnings_count = VALUES(warnings_count),
    clear_count = VALUES(clear_count),
    avg_risk_score = VALUES(avg_risk_score),
    high_risk_count = VALUES(high_risk_count),
    medium_risk_count = VALUES(medium_risk_count),
    low_risk_count = VALUES(low_risk_count);
