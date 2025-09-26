-- Common queries for Nexus Bank Customer Management
-- Useful SQL queries for customer-manager page functionality

USE nexus_bank;

-- ========================================
-- CUSTOMER LISTING QUERIES
-- ========================================

-- Get all customers with their related data
SELECT c.*, sc.*, du.*
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
ORDER BY c.name;

-- Get customers by segment
SELECT c.*, sc.travel, sc.shopping, sc.groceries, du.app_logins, du.notifications_enabled
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE c.segment = 'Premium'
ORDER BY c.name;

-- Search customers by name or ID
SELECT c.*, sc.travel, sc.shopping, du.app_logins
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE c.name LIKE '%John%' 
   OR c.id LIKE '%CUST%'
ORDER BY c.name;

-- ========================================
-- CHURN RISK FILTERING QUERIES
-- ========================================

-- Low risk customers (≤30%)
SELECT c.id, c.name, c.segment, c.churn_risk, c.nps, c.account_balance
FROM customers c
WHERE c.churn_risk <= 0.30
ORDER BY c.churn_risk ASC;

-- Medium risk customers (31-70%)
SELECT c.id, c.name, c.segment, c.churn_risk, c.nps, c.account_balance
FROM customers c
WHERE c.churn_risk > 0.30 AND c.churn_risk <= 0.70
ORDER BY c.churn_risk ASC;

-- High risk customers (>70%)
SELECT c.id, c.name, c.segment, c.churn_risk, c.nps, c.account_balance
FROM customers c
WHERE c.churn_risk > 0.70
ORDER BY c.churn_risk DESC;

-- ========================================
-- ANALYTICS QUERIES
-- ========================================

-- Total customers count
SELECT COUNT(*) as total_customers FROM customers;

-- Total balance across all customers
SELECT SUM(account_balance) as total_balance FROM customers;

-- Average churn risk
SELECT AVG(churn_risk) as avg_churn_risk FROM customers;

-- Average NPS score
SELECT AVG(nps) as avg_nps FROM customers;

-- Segment statistics
SELECT 
    c.segment,
    COUNT(*) as customer_count,
    AVG(c.account_balance) as avg_balance,
    AVG(c.churn_risk) as avg_churn_risk,
    AVG(c.nps) as avg_nps,
    SUM(c.account_balance) as total_balance
FROM customers c
GROUP BY c.segment
ORDER BY avg_balance DESC;

-- Churn risk distribution
SELECT 
    CASE 
        WHEN churn_risk <= 0.30 THEN 'Low Risk (≤30%)'
        WHEN churn_risk > 0.30 AND churn_risk <= 0.70 THEN 'Medium Risk (31-70%)'
        ELSE 'High Risk (>70%)'
    END as risk_category,
    COUNT(*) as customer_count
FROM customers
GROUP BY risk_category
ORDER BY 
    CASE 
        WHEN churn_risk <= 0.30 THEN 1
        WHEN churn_risk > 0.30 AND churn_risk <= 0.70 THEN 2
        ELSE 3
    END;

-- ========================================
-- INDIVIDUAL CUSTOMER QUERIES
-- ========================================

-- Get single customer with full details
SELECT c.*, sc.*, du.*
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE c.id = 'CUST001';

-- Get customer data for next best action analysis
SELECT 
    c.name,
    c.segment,
    c.consent,
    c.account_balance,
    c.monthly_income,
    c.complaints,
    c.nps,
    c.churn_risk,
    c.missed_payments,
    sc.travel,
    sc.shopping,
    sc.groceries,
    sc.bills,
    sc.entertainment,
    du.app_logins,
    du.notifications_enabled
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE c.id = 'CUST001';

-- ========================================
-- CHART DATA QUERIES
-- ========================================

-- Segment performance for bar chart
SELECT 
    c.segment,
    AVG(c.account_balance) as avg_balance,
    AVG(c.churn_risk) as avg_churn_risk,
    COUNT(*) as customer_count
FROM customers c
GROUP BY c.segment
ORDER BY avg_balance DESC;

-- Spending categories for stacked bar chart
SELECT 
    c.name,
    sc.travel,
    sc.shopping,
    sc.groceries,
    sc.bills,
    sc.entertainment
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
ORDER BY c.id
LIMIT 6;

-- Digital usage trends for line chart
SELECT 
    c.name,
    du.app_logins,
    c.nps,
    c.churn_risk
FROM customers c
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
ORDER BY c.id
LIMIT 8;

-- ========================================
-- SPENDING ANALYSIS QUERIES
-- ========================================

-- Top spenders by category
SELECT 
    c.name,
    c.segment,
    sc.travel,
    sc.shopping,
    sc.groceries,
    sc.bills,
    sc.entertainment,
    (sc.travel + sc.shopping + sc.groceries + sc.bills + sc.entertainment) as total_spending
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
ORDER BY total_spending DESC;

-- Average spending by segment
SELECT 
    c.segment,
    AVG(sc.travel) as avg_travel,
    AVG(sc.shopping) as avg_shopping,
    AVG(sc.groceries) as avg_groceries,
    AVG(sc.bills) as avg_bills,
    AVG(sc.entertainment) as avg_entertainment
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
GROUP BY c.segment;

-- ========================================
-- DIGITAL ENGAGEMENT QUERIES
-- ========================================

-- Digital engagement vs churn risk
SELECT 
    c.name,
    c.segment,
    du.app_logins,
    du.notifications_enabled,
    c.churn_risk,
    c.nps
FROM customers c
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
ORDER BY du.app_logins DESC;

-- High engagement customers
SELECT 
    c.name,
    c.segment,
    du.app_logins,
    c.churn_risk
FROM customers c
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE du.app_logins > 40
ORDER BY du.app_logins DESC;

-- Low engagement customers (at risk)
SELECT 
    c.name,
    c.segment,
    du.app_logins,
    c.churn_risk,
    c.nps
FROM customers c
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE du.app_logins < 20
ORDER BY c.churn_risk DESC;

-- ========================================
-- ADMIN QUERIES
-- ========================================

-- Customer summary for admin dashboard
SELECT 
    c.id,
    c.name,
    c.segment,
    c.account_balance,
    c.churn_risk,
    c.nps,
    c.complaints,
    du.app_logins,
    (sc.travel + sc.shopping + sc.groceries + sc.bills + sc.entertainment) as total_spending
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
ORDER BY c.segment, c.account_balance DESC;

-- Risk assessment summary
SELECT 
    c.segment,
    COUNT(*) as total_customers,
    AVG(c.churn_risk) as avg_churn_risk,
    COUNT(CASE WHEN c.churn_risk > 0.70 THEN 1 END) as high_risk_count,
    AVG(c.nps) as avg_nps,
    AVG(c.account_balance) as avg_balance
FROM customers c
GROUP BY c.segment
ORDER BY avg_churn_risk DESC;
