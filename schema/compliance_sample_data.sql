-- Compliance Manager Sample Data
-- Nexus Bank Compliance & Risk Management System

USE nexus_bank_compliance;

-- Insert risk categories
INSERT INTO risk_categories (name, min_score, max_score, color_code, priority) VALUES
('Low Risk', 0.0, 5.0, '#10B981', 'low'),
('Medium Risk', 5.1, 7.5, '#F59E0B', 'medium'),
('High Risk', 7.6, 10.0, '#EF4444', 'high');

-- Insert compliance rules
INSERT INTO compliance_rules (rule_name, rule_type, threshold_value, description) VALUES
('High Risk Threshold', 'risk_threshold', 7.5, 'Flag incidents with risk score above 7.5'),
('Large Transaction Amount', 'amount_limit', 100000.00, 'Flag transactions above $100,000'),
('Suspicious Pattern Detection', 'pattern_detection', 1.0, 'Flag any detected suspicious patterns'),
('KYC Expiration Alert', 'frequency_limit', 365.0, 'Alert when KYC verification expires');

-- Insert compliance incidents
INSERT INTO compliance_incidents (id, type, timestamp, amount, description, risk_score, country, customer_id, entity_type, audit_status) VALUES
('COMP-001', 'transaction', '2024-01-15 09:30:00', 25000.00, 'Large cash withdrawal from high-risk customer account', 8.2, 'US', 'CUST-001', 'Individual', 'violation'),
('COMP-002', 'document', '2024-01-15 14:15:00', NULL, 'Missing KYC documentation for new customer onboarding', 6.8, 'UK', 'CUST-002', 'Corporate', 'warning'),
('COMP-003', 'customer', '2024-01-16 10:45:00', NULL, 'Customer profile shows multiple address changes in short period', 7.1, 'CA', 'CUST-003', 'Individual', 'warning'),
('COMP-004', 'communication', '2024-01-16 16:20:00', NULL, 'Suspicious communication pattern detected in customer emails', 9.0, 'US', 'CUST-004', 'Individual', 'violation'),
('COMP-005', 'transaction', '2024-01-17 11:30:00', 150000.00, 'International wire transfer to high-risk country', 8.8, 'MX', 'CUST-005', 'Corporate', 'violation'),
('COMP-006', 'document', '2024-01-17 13:45:00', NULL, 'GDPR consent form missing for EU customer', 5.5, 'DE', 'CUST-006', 'Individual', 'warning'),
('COMP-007', 'customer', '2024-01-18 09:15:00', NULL, 'Customer ID verification failed multiple times', 6.2, 'FR', 'CUST-007', 'Individual', 'warning'),
('COMP-008', 'transaction', '2024-01-18 15:30:00', 50000.00, 'Multiple small transactions to same beneficiary', 7.9, 'US', 'CUST-008', 'Individual', 'violation');

-- Insert compliance checks
INSERT INTO compliance_checks (incident_id, aml_score, kyc_status, gdpr_compliance, pci_dss_flag, suspicious_pattern) VALUES
('COMP-001', 8.5, 'verified', TRUE, FALSE, TRUE),
('COMP-002', 6.0, 'unverified', TRUE, FALSE, FALSE),
('COMP-003', 7.2, 'expired', FALSE, FALSE, TRUE),
('COMP-004', 9.2, 'verified', TRUE, FALSE, TRUE),
('COMP-005', 8.8, 'verified', TRUE, TRUE, TRUE),
('COMP-006', 5.0, 'verified', FALSE, FALSE, FALSE),
('COMP-007', 6.5, 'unverified', TRUE, FALSE, FALSE),
('COMP-008', 8.0, 'verified', TRUE, FALSE, TRUE);

-- Insert compliance alerts
INSERT INTO compliance_alerts (incident_id, alert_type, severity, message, status) VALUES
('COMP-001', 'AML', 'high', 'High-risk customer making large cash withdrawal', 'active'),
('COMP-002', 'KYC', 'medium', 'KYC documentation incomplete for customer onboarding', 'active'),
('COMP-003', 'SUSPICIOUS', 'medium', 'Multiple address changes detected in customer profile', 'active'),
('COMP-004', 'SUSPICIOUS', 'critical', 'Suspicious communication patterns detected', 'active'),
('COMP-005', 'AML', 'critical', 'Large international transfer to high-risk jurisdiction', 'active'),
('COMP-006', 'GDPR', 'medium', 'GDPR consent missing for EU customer', 'active'),
('COMP-007', 'KYC', 'medium', 'Customer ID verification failures', 'active'),
('COMP-008', 'AML', 'high', 'Potential structuring activity detected', 'active');

-- Insert compliance metrics (daily summary)
INSERT INTO compliance_metrics (metric_date, total_incidents, violations_count, warnings_count, clear_count, avg_risk_score, high_risk_count, medium_risk_count, low_risk_count) VALUES
('2024-01-15', 2, 1, 1, 0, 7.5, 1, 1, 0),
('2024-01-16', 2, 1, 1, 0, 8.05, 1, 1, 0),
('2024-01-17', 2, 1, 1, 0, 7.15, 1, 1, 0),
('2024-01-18', 2, 1, 1, 0, 7.05, 1, 1, 0);

-- Insert additional sample incidents for better testing
INSERT INTO compliance_incidents (id, type, timestamp, amount, description, risk_score, country, customer_id, entity_type, audit_status) VALUES
('COMP-009', 'transaction', '2024-01-19 08:30:00', 7500.00, 'Regular business transaction within normal parameters', 3.2, 'US', 'CUST-009', 'Corporate', 'clear'),
('COMP-010', 'document', '2024-01-19 12:15:00', NULL, 'Standard document verification completed successfully', 2.1, 'UK', 'CUST-010', 'Individual', 'clear'),
('COMP-011', 'customer', '2024-01-19 15:45:00', NULL, 'Customer profile update with new employment information', 4.8, 'CA', 'CUST-011', 'Individual', 'clear'),
('COMP-012', 'communication', '2024-01-20 10:20:00', NULL, 'Customer inquiry about account services', 1.5, 'US', 'CUST-012', 'Individual', 'clear'),
('COMP-013', 'transaction', '2024-01-20 14:30:00', 45000.00, 'Medium-sized transaction requiring additional review', 6.5, 'MX', 'CUST-013', 'Corporate', 'warning'),
('COMP-014', 'document', '2024-01-20 16:00:00', NULL, 'PCI DSS compliance documentation review', 5.8, 'DE', 'CUST-014', 'Corporate', 'warning'),
('COMP-015', 'customer', '2024-01-21 09:45:00', NULL, 'Customer risk assessment update', 7.3, 'FR', 'CUST-015', 'Individual', 'warning'),
('COMP-016', 'transaction', '2024-01-21 11:30:00', 200000.00, 'Very large transaction triggering enhanced due diligence', 9.1, 'US', 'CUST-016', 'Corporate', 'violation');

-- Insert corresponding compliance checks for new incidents
INSERT INTO compliance_checks (incident_id, aml_score, kyc_status, gdpr_compliance, pci_dss_flag, suspicious_pattern) VALUES
('COMP-009', 3.0, 'verified', TRUE, FALSE, FALSE),
('COMP-010', 2.0, 'verified', TRUE, FALSE, FALSE),
('COMP-011', 4.5, 'verified', TRUE, FALSE, FALSE),
('COMP-012', 1.0, 'verified', TRUE, FALSE, FALSE),
('COMP-013', 6.8, 'verified', TRUE, FALSE, FALSE),
('COMP-014', 5.5, 'verified', TRUE, TRUE, FALSE),
('COMP-015', 7.5, 'verified', TRUE, FALSE, FALSE),
('COMP-016', 9.0, 'verified', TRUE, TRUE, TRUE);

-- Insert corresponding alerts for new incidents
INSERT INTO compliance_alerts (incident_id, alert_type, severity, message, status) VALUES
('COMP-013', 'RISK_THRESHOLD', 'medium', 'Transaction amount exceeds normal threshold', 'active'),
('COMP-014', 'PCI', 'medium', 'PCI DSS documentation requires review', 'active'),
('COMP-015', 'RISK_THRESHOLD', 'medium', 'Customer risk score increased significantly', 'active'),
('COMP-016', 'AML', 'critical', 'Very large transaction requires immediate review', 'active');

-- Update metrics for additional days
INSERT INTO compliance_metrics (metric_date, total_incidents, violations_count, warnings_count, clear_count, avg_risk_score, high_risk_count, medium_risk_count, low_risk_count) VALUES
('2024-01-19', 3, 0, 0, 3, 3.37, 0, 0, 3),
('2024-01-20', 2, 0, 2, 0, 4.0, 0, 2, 0),
('2024-01-21', 2, 1, 1, 0, 8.2, 1, 1, 0);
