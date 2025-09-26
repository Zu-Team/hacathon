# Nexus Bank Employee Database Schema

Simple database schema for employee management prototype.

## 📊 Database Structure

### Tables

#### `employees` Table
- `id` - Primary key (VARCHAR 20)
- `name` - Employee full name
- `role` - Job title/position
- `department` - Department (IT, Customer Service, Risk Management, Operations, HR)
- `status` - Employment status (Active, On Leave, Terminated)
- `email` - Employee email address
- `phone` - Contact phone number
- `hire_date` - Date when employee was hired

#### `employee_performance` Table
- `employee_id` - Foreign key to employees table
- `absences` - Number of absences
- `late` - Number of late arrivals
- `tickets_closed` - Number of tickets/responses completed
- `avg_lead_time_days` - Average response time in days
- `bug_rate` - Bug rate percentage
- `peer_review_score` - Peer review score (0-5)
- `csat` - Customer satisfaction score (0-5)
- `complaints` - Number of complaints received
- `policy_violations` - Number of policy violations
- `security_incidents` - Number of security incidents
- `productivity_score` - Productivity score (0-5)
- `team_collaboration` - Team collaboration score (0-5)
- `innovation_score` - Innovation score (0-5)

## 🚀 Setup Instructions

### 1. Create Employee Database
```bash
# Connect to MySQL
mysql -u root -p

# Run the employee database creation script
source schema/employee_database.sql
```

### 2. Insert Sample Data
```bash
# Run the employee sample data script
source schema/employee_sample_data.sql
```

### 3. Verify Setup
```sql
-- Check if tables were created
SHOW TABLES;

-- Check sample employees
SELECT * FROM employees;

-- Check sample performance data
SELECT * FROM employee_performance;

-- Check joined data
SELECT e.name, e.role, e.department, ep.peer_review_score 
FROM employees e 
JOIN employee_performance ep ON e.id = ep.employee_id;
```

## 📋 Sample Employee Data

### IT Department
- **Sarah Johnson** - Senior Developer (EMP001) - Performance: 4.2/5
- **James Wilson** - DevOps Engineer (EMP006) - Performance: 4.7/5
- **Christopher Lee** - Junior Developer (EMP010) - Performance: 3.8/5

### Customer Service
- **Michael Chen** - Customer Service Rep (EMP002) - Performance: 4.5/5

### Risk Management
- **Emily Rodriguez** - Risk Analyst (EMP003) - Performance: 4.8/5
- **Maria Garcia** - Compliance Officer (EMP007) - Performance: 4.4/5

### Operations
- **David Thompson** - Operations Manager (EMP004) - Performance: 3.2/5
- **Robert Brown** - Operations Analyst (EMP008) - Performance: 4.1/5

### HR
- **Lisa Wang** - HR Specialist (EMP005) - Performance: 4.6/5
- **Jennifer Davis** - HR Manager (EMP009) - Performance: 4.9/5

## 🔧 Common Database Operations

### Get All Employees
```sql
SELECT e.*, ep.peer_review_score, ep.productivity_score, ep.team_collaboration
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
ORDER BY e.name;
```

### Filter by Department
```sql
SELECT e.*, ep.peer_review_score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.department = 'IT';
```

### Filter by Performance
```sql
SELECT e.name, e.role, ep.peer_review_score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE ep.peer_review_score >= 4.5;
```

### Get Analytics Data
```sql
-- Total employees
SELECT COUNT(*) as total_employees FROM employees;

-- Active employees
SELECT COUNT(*) as active_employees FROM employees WHERE status = 'Active';

-- Average performance
SELECT AVG(ep.peer_review_score) as avg_performance 
FROM employee_performance ep;

-- Department stats
SELECT 
    e.department,
    COUNT(*) as employee_count,
    AVG(ep.peer_review_score) as avg_performance
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
GROUP BY e.department;
```

### Get Single Employee Details
```sql
SELECT e.*, ep.*
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.id = 'EMP001';
```

## 📊 What This Supports

### ✅ Employee Manager Page Features:
- **Employee Listing** - Grid view with cards
- **Employee Details** - Full profile view
- **Performance Metrics** - All 13 performance indicators
- **Analytics Dashboard** - Statistics and charts
- **Filtering** - By department, status, performance
- **Search** - By name, role, email
- **AI Analysis** - Performance data for analysis
- **Charts** - Performance breakdown, department stats

### ✅ Data Relationships:
- **One-to-One** - Each employee has one performance record
- **Foreign Key** - employee_performance.employee_id → employees.id
- **Indexes** - Optimized for common queries

## 📝 Notes

- **Simple Structure** - Only 2 tables, no complex relations
- **No Timestamps** - No created_at, updated_at fields
- **Essential Data Only** - Just what the page needs to work
- **Prototype Ready** - Perfect for development and testing
