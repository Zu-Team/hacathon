-- Nexus Bank Customer Database Schema
-- Customer management tables for customer-manager page

USE nexus_bank;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    segment ENUM('Premium', 'Standard', 'At-risk') NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    account_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    monthly_income DECIMAL(15,2) NOT NULL DEFAULT 0,
    complaints INT DEFAULT 0,
    nps INT DEFAULT 0,
    churn_risk DECIMAL(3,2) DEFAULT 0,
    missed_payments INT DEFAULT 0
);

-- Customer spend categories table
CREATE TABLE IF NOT EXISTS customer_spend_categories (
    customer_id VARCHAR(20) PRIMARY KEY,
    travel DECIMAL(10,2) DEFAULT 0,
    shopping DECIMAL(10,2) DEFAULT 0,
    groceries DECIMAL(10,2) DEFAULT 0,
    bills DECIMAL(10,2) DEFAULT 0,
    entertainment DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Customer digital usage table
CREATE TABLE IF NOT EXISTS customer_digital_usage (
    customer_id VARCHAR(20) PRIMARY KEY,
    app_logins INT DEFAULT 0,
    notifications_enabled BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(segment);
CREATE INDEX IF NOT EXISTS idx_customers_churn_risk ON customers(churn_risk);
CREATE INDEX IF NOT EXISTS idx_customers_nps ON customers(nps);
CREATE INDEX IF NOT EXISTS idx_customers_balance ON customers(account_balance);
CREATE INDEX IF NOT EXISTS idx_customer_spend_travel ON customer_spend_categories(travel);
CREATE INDEX IF NOT EXISTS idx_customer_spend_shopping ON customer_spend_categories(shopping);
CREATE INDEX IF NOT EXISTS idx_customer_digital_app_logins ON customer_digital_usage(app_logins);
