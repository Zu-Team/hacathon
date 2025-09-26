-- Nexus Bank Employee Database Schema
-- Simple employee and performance management for prototype

-- Create database
CREATE DATABASE IF NOT EXISTS nexus_bank;
USE nexus_bank;

-- Employees table
CREATE TABLE employees (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    status ENUM('Active', 'On Leave', 'Terminated') NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    hire_date DATE NOT NULL
);

-- Employee performance table
CREATE TABLE employee_performance (
    employee_id VARCHAR(20) PRIMARY KEY,
    absences INT DEFAULT 0,
    late INT DEFAULT 0,
    tickets_closed INT DEFAULT 0,
    avg_lead_time_days DECIMAL(3,1) DEFAULT 0,
    bug_rate DECIMAL(3,2) DEFAULT 0,
    peer_review_score DECIMAL(2,1) DEFAULT 0,
    csat DECIMAL(2,1) DEFAULT 0,
    complaints INT DEFAULT 0,
    policy_violations INT DEFAULT 0,
    security_incidents INT DEFAULT 0,
    productivity_score DECIMAL(2,1) DEFAULT 0,
    team_collaboration DECIMAL(2,1) DEFAULT 0,
    innovation_score DECIMAL(2,1) DEFAULT 0,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employee_performance_peer_review ON employee_performance(peer_review_score);
CREATE INDEX idx_employee_performance_productivity ON employee_performance(productivity_score);
