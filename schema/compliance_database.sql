-- Compliance Manager Database Schema
-- Nexus Bank Compliance & Risk Management System

CREATE DATABASE IF NOT EXISTS nexus_bank_compliance;
USE nexus_bank_compliance;

-- Compliance Incidents Table
-- Stores all compliance incidents and risk assessments
CREATE TABLE compliance_incidents (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('transaction', 'document', 'customer', 'communication') NOT NULL,
    timestamp DATETIME NOT NULL,
    amount DECIMAL(15,2) NULL,
    description TEXT NOT NULL,
    risk_score DECIMAL(3,1) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 10),
    country VARCHAR(100) NULL,
    customer_id VARCHAR(50) NULL,
    entity_type VARCHAR(100) NOT NULL,
    audit_status ENUM('clear', 'warning', 'violation') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Compliance Checks Table
-- Stores detailed compliance check results for each incident
CREATE TABLE compliance_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id VARCHAR(50) NOT NULL,
    aml_score DECIMAL(3,1) NOT NULL CHECK (aml_score >= 0 AND aml_score <= 10),
    kyc_status ENUM('verified', 'unverified', 'expired') NOT NULL,
    gdpr_compliance BOOLEAN NOT NULL DEFAULT FALSE,
    pci_dss_flag BOOLEAN NOT NULL DEFAULT FALSE,
    suspicious_pattern BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES compliance_incidents(id) ON DELETE CASCADE
);

-- Risk Categories Table
-- Defines risk level categories and thresholds
CREATE TABLE risk_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    min_score DECIMAL(3,1) NOT NULL,
    max_score DECIMAL(3,1) NOT NULL,
    color_code VARCHAR(7) NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Alerts Table
-- Stores automated alerts and notifications
CREATE TABLE compliance_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id VARCHAR(50) NOT NULL,
    alert_type ENUM('AML', 'KYC', 'GDPR', 'PCI', 'SUSPICIOUS', 'RISK_THRESHOLD') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('active', 'acknowledged', 'resolved') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (incident_id) REFERENCES compliance_incidents(id) ON DELETE CASCADE
);

-- Compliance Metrics Table
-- Stores calculated metrics and KPIs
CREATE TABLE compliance_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_date DATE NOT NULL,
    total_incidents INT NOT NULL DEFAULT 0,
    violations_count INT NOT NULL DEFAULT 0,
    warnings_count INT NOT NULL DEFAULT 0,
    clear_count INT NOT NULL DEFAULT 0,
    avg_risk_score DECIMAL(3,1) NOT NULL DEFAULT 0,
    high_risk_count INT NOT NULL DEFAULT 0,
    medium_risk_count INT NOT NULL DEFAULT 0,
    low_risk_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (metric_date)
);

-- Compliance Rules Table
-- Stores business rules and thresholds
CREATE TABLE compliance_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    rule_type ENUM('risk_threshold', 'amount_limit', 'frequency_limit', 'pattern_detection') NOT NULL,
    threshold_value DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_compliance_incidents_type ON compliance_incidents(type);
CREATE INDEX idx_compliance_incidents_risk_score ON compliance_incidents(risk_score);
CREATE INDEX idx_compliance_incidents_audit_status ON compliance_incidents(audit_status);
CREATE INDEX idx_compliance_incidents_timestamp ON compliance_incidents(timestamp);
CREATE INDEX idx_compliance_incidents_customer_id ON compliance_incidents(customer_id);
CREATE INDEX idx_compliance_checks_incident_id ON compliance_checks(incident_id);
CREATE INDEX idx_compliance_checks_kyc_status ON compliance_checks(kyc_status);
CREATE INDEX idx_compliance_alerts_incident_id ON compliance_alerts(incident_id);
CREATE INDEX idx_compliance_alerts_status ON compliance_alerts(status);
CREATE INDEX idx_compliance_alerts_alert_type ON compliance_alerts(alert_type);
CREATE INDEX idx_compliance_metrics_date ON compliance_metrics(metric_date);
CREATE INDEX idx_compliance_rules_type ON compliance_rules(rule_type);
CREATE INDEX idx_compliance_rules_active ON compliance_rules(is_active);
