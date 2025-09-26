-- Sample data for Nexus Bank Employee Management
-- Insert test employees and their performance data

USE nexus_bank;

-- Insert sample employees
INSERT INTO employees (id, name, role, department, status, email, phone, hire_date) VALUES
('EMP001', 'Sarah Johnson', 'Senior Developer', 'IT', 'Active', 'sarah.johnson@nexusbank.com', '+1-555-0123', '2022-03-15'),
('EMP002', 'Michael Chen', 'Customer Service Rep', 'Customer Service', 'Active', 'michael.chen@nexusbank.com', '+1-555-0124', '2023-01-10'),
('EMP003', 'Emily Rodriguez', 'Risk Analyst', 'Risk Management', 'Active', 'emily.rodriguez@nexusbank.com', '+1-555-0125', '2021-08-20'),
('EMP004', 'David Thompson', 'Operations Manager', 'Operations', 'Active', 'david.thompson@nexusbank.com', '+1-555-0126', '2020-05-12'),
('EMP005', 'Lisa Wang', 'HR Specialist', 'HR', 'Active', 'lisa.wang@nexusbank.com', '+1-555-0127', '2023-02-28'),
('EMP006', 'James Wilson', 'DevOps Engineer', 'IT', 'Active', 'james.wilson@nexusbank.com', '+1-555-0128', '2022-11-15'),
('EMP007', 'Maria Garcia', 'Compliance Officer', 'Risk Management', 'Active', 'maria.garcia@nexusbank.com', '+1-555-0129', '2021-12-03'),
('EMP008', 'Robert Brown', 'Operations Analyst', 'Operations', 'Active', 'robert.brown@nexusbank.com', '+1-555-0130', '2023-04-20'),
('EMP009', 'Jennifer Davis', 'HR Manager', 'HR', 'Active', 'jennifer.davis@nexusbank.com', '+1-555-0131', '2020-09-10'),
('EMP010', 'Christopher Lee', 'Junior Developer', 'IT', 'Active', 'christopher.lee@nexusbank.com', '+1-555-0132', '2023-06-01');

-- Insert sample employee performance data
INSERT INTO employee_performance (employee_id, absences, late, tickets_closed, avg_lead_time_days, bug_rate, peer_review_score, csat, complaints, policy_violations, security_incidents, productivity_score, team_collaboration, innovation_score) VALUES
('EMP001', 2, 1, 85, 3.0, 0.03, 4.2, 4.5, 0, 0, 0, 4.3, 4.1, 4.0),
('EMP002', 1, 2, 95, 2.0, 0.02, 4.5, 4.8, 0, 0, 0, 4.6, 4.4, 3.8),
('EMP003', 0, 0, 78, 4.0, 0.01, 4.8, 4.7, 0, 0, 0, 4.7, 4.3, 4.2),
('EMP004', 3, 5, 65, 5.0, 0.08, 3.2, 3.5, 2, 1, 0, 3.1, 3.8, 2.9),
('EMP005', 1, 1, 88, 2.0, 0.02, 4.6, 4.6, 0, 0, 0, 4.4, 4.7, 3.9),
('EMP006', 0, 0, 92, 2.0, 0.01, 4.7, 4.8, 0, 0, 0, 4.7, 4.5, 4.3),
('EMP007', 1, 1, 76, 4.0, 0.02, 4.4, 4.6, 0, 0, 0, 4.4, 4.2, 4.0),
('EMP008', 2, 3, 82, 3.0, 0.04, 4.1, 4.3, 1, 0, 0, 4.1, 4.0, 3.7),
('EMP009', 0, 0, 94, 2.0, 0.01, 4.9, 4.9, 0, 0, 0, 4.9, 4.8, 4.5),
('EMP010', 1, 2, 68, 4.0, 0.06, 3.8, 4.1, 0, 0, 0, 3.8, 4.2, 3.5);
