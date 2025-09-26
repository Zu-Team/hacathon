-- Sample data for Nexus Bank Customer Management
-- Insert test customers and their related data

USE nexus_bank;

-- Insert sample customers
INSERT INTO customers (id, name, segment, consent, account_balance, monthly_income, complaints, nps, churn_risk, missed_payments) VALUES
('CUST001', 'John Smith', 'Premium', true, 125000.50, 8500.00, 0, 9, 0.15, 0),
('CUST002', 'Sarah Johnson', 'Standard', true, 45000.25, 5200.00, 1, 7, 0.25, 0),
('CUST003', 'Michael Brown', 'Premium', true, 250000.00, 12500.00, 0, 10, 0.10, 0),
('CUST004', 'Emily Davis', 'At-risk', false, 2500.75, 2200.00, 3, 4, 0.75, 2),
('CUST005', 'David Wilson', 'Premium', true, 750000.00, 18500.00, 0, 9, 0.12, 0),
('CUST006', 'Lisa Garcia', 'Standard', true, 32000.00, 4800.00, 0, 8, 0.30, 0),
('CUST007', 'Robert Chen', 'At-risk', false, 8500.00, 3800.00, 2, 5, 0.65, 1),
('CUST008', 'Jennifer Taylor', 'Premium', true, 180000.00, 9800.00, 0, 9, 0.18, 0);

-- Insert sample customer spend categories
INSERT INTO customer_spend_categories (customer_id, travel, shopping, groceries, bills, entertainment) VALUES
('CUST001', 2500.00, 1800.00, 600.00, 1200.00, 800.00),
('CUST002', 800.00, 1200.00, 400.00, 900.00, 300.00),
('CUST003', 4500.00, 2200.00, 800.00, 1800.00, 1200.00),
('CUST004', 200.00, 400.00, 300.00, 800.00, 150.00),
('CUST005', 8000.00, 3500.00, 1200.00, 2500.00, 2000.00),
('CUST006', 600.00, 900.00, 350.00, 750.00, 250.00),
('CUST007', 300.00, 600.00, 280.00, 650.00, 200.00),
('CUST008', 3200.00, 1900.00, 700.00, 1400.00, 900.00);

-- Insert sample customer digital usage
INSERT INTO customer_digital_usage (customer_id, app_logins, notifications_enabled) VALUES
('CUST001', 45, true),
('CUST002', 28, true),
('CUST003', 62, true),
('CUST004', 8, false),
('CUST005', 78, true),
('CUST006', 35, true),
('CUST007', 12, false),
('CUST008', 52, true);
