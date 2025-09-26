# Nexus Bank Customer Database Schema

Database schema for customer management and analytics in the customer-manager page.

## 📊 Database Structure

### Tables

#### `customers` Table
- `id` - Primary key (VARCHAR 20)
- `name` - Customer full name
- `segment` - Customer segment (Premium, Standard, At-risk)
- `consent` - Data processing consent
- `account_balance` - Current account balance
- `monthly_income` - Monthly income amount
- `complaints` - Number of complaints received
- `nps` - Net Promoter Score (0-10)
- `churn_risk` - Churn risk percentage (0.00-1.00)
- `missed_payments` - Number of missed payments

#### `customer_spend_categories` Table
- `customer_id` - Foreign key to customers table
- `travel` - Travel spending amount
- `shopping` - Shopping spending amount
- `groceries` - Groceries spending amount
- `bills` - Bills spending amount
- `entertainment` - Entertainment spending amount

#### `customer_digital_usage` Table
- `customer_id` - Foreign key to customers table
- `app_logins` - Number of app logins
- `notifications_enabled` - Notification preferences

## 🚀 Setup Instructions

### 1. Create Customer Tables
```bash
# Connect to MySQL
mysql -u root -p

# Run the customer database creation script
source schema/customer_database.sql
```

### 2. Insert Sample Data
```bash
# Run the customer sample data script
source schema/customer_sample_data.sql
```

### 3. Verify Setup
```sql
-- Check if tables were created
SHOW TABLES;

-- Check sample customers
SELECT * FROM customers;

-- Check sample spending data
SELECT * FROM customer_spend_categories;

-- Check sample digital usage
SELECT * FROM customer_digital_usage;

-- Check joined data
SELECT c.name, c.segment, c.churn_risk, sc.travel, du.app_logins 
FROM customers c 
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id;
```

## 📋 Sample Customer Data

### Premium Customers (3)
- **John Smith** (CUST001) - Balance: $125K, Churn Risk: 15%, NPS: 9
- **Michael Brown** (CUST003) - Balance: $250K, Churn Risk: 10%, NPS: 10
- **David Wilson** (CUST005) - Balance: $750K, Churn Risk: 12%, NPS: 9
- **Jennifer Taylor** (CUST008) - Balance: $180K, Churn Risk: 18%, NPS: 9

### Standard Customers (2)
- **Sarah Johnson** (CUST002) - Balance: $45K, Churn Risk: 25%, NPS: 7
- **Lisa Garcia** (CUST006) - Balance: $32K, Churn Risk: 30%, NPS: 8

### At-risk Customers (2)
- **Emily Davis** (CUST004) - Balance: $2.5K, Churn Risk: 75%, NPS: 4
- **Robert Chen** (CUST007) - Balance: $8.5K, Churn Risk: 65%, NPS: 5

## 🔧 Common Database Operations

### Get All Customers with Full Data
```sql
SELECT c.*, sc.*, du.*
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
ORDER BY c.name;
```

### Filter by Segment
```sql
SELECT c.*, sc.travel, sc.shopping, du.app_logins
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE c.segment = 'Premium';
```

### Filter by Churn Risk
```sql
SELECT c.name, c.segment, c.churn_risk, c.nps
FROM customers c
WHERE c.churn_risk > 0.70;
```

### Get Analytics Data
```sql
-- Total customers
SELECT COUNT(*) as total_customers FROM customers;

-- Total balance
SELECT SUM(account_balance) as total_balance FROM customers;

-- Average churn risk
SELECT AVG(churn_risk) as avg_churn_risk FROM customers;

-- Segment statistics
SELECT 
    segment,
    COUNT(*) as customer_count,
    AVG(account_balance) as avg_balance,
    AVG(churn_risk) as avg_churn_risk
FROM customers
GROUP BY segment;
```

### Get Single Customer Details
```sql
SELECT c.*, sc.*, du.*
FROM customers c
LEFT JOIN customer_spend_categories sc ON c.id = sc.customer_id
LEFT JOIN customer_digital_usage du ON c.id = du.customer_id
WHERE c.id = 'CUST001';
```

## 📊 What This Supports

### ✅ Customer Manager Page Features:
- **Customer Grid** - All customer information display
- **Segment Filtering** - Premium, Standard, At-risk filtering
- **Churn Risk Analysis** - Risk level filtering and visualization
- **Spending Analysis** - All 5 spending categories with charts
- **Digital Usage Tracking** - App logins and notification preferences
- **NPS Scoring** - Customer satisfaction metrics
- **Analytics Dashboard** - Statistics and performance charts
- **Search Functionality** - Name and ID searching
- **Next Best Action** - AI analysis based on all customer data
- **Charts and Visualizations** - All data needed for charts

### ✅ Data Relationships:
- **One-to-One** - Each customer has one spend category record and one digital usage record
- **Foreign Keys** - Both tables reference customers.id
- **Indexes** - Optimized for common queries and filtering

## 📝 Notes

- **Simple Structure** - Only 3 tables, no complex relations
- **No Timestamps** - No created_at, updated_at fields
- **Essential Data Only** - Just what the customer-manager page needs
- **Prototype Ready** - Perfect for development and testing
- **Chart-Ready** - All data formatted for easy chart integration
- **Filter-Friendly** - Indexed for fast filtering operations
