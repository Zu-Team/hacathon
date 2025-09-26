-- Common queries for Nexus Bank Employee Management
-- Useful SQL queries for employee-manager page functionality

USE nexus_bank;

-- ========================================
-- EMPLOYEE LISTING QUERIES
-- ========================================

-- Get all employees with their performance data
SELECT e.*, ep.*
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
ORDER BY e.name;

-- Get employees by department
SELECT e.*, ep.peer_review_score, ep.productivity_score, ep.team_collaboration
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.department = 'IT'
ORDER BY e.name;

-- Get employees by status
SELECT e.*, ep.peer_review_score, ep.productivity_score, ep.team_collaboration
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.status = 'Active'
ORDER BY e.name;

-- Search employees by name, role, or email
SELECT e.*, ep.peer_review_score, ep.productivity_score, ep.team_collaboration
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.name LIKE '%Sarah%' 
   OR e.role LIKE '%Developer%' 
   OR e.email LIKE '%@nexusbank.com'
ORDER BY e.name;

-- ========================================
-- PERFORMANCE FILTERING QUERIES
-- ========================================

-- Excellent performers (4.5+)
SELECT e.id, e.name, e.role, e.department, ep.peer_review_score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE ep.peer_review_score >= 4.5
ORDER BY ep.peer_review_score DESC;

-- Good performers (4.0-4.4)
SELECT e.id, e.name, e.role, e.department, ep.peer_review_score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE ep.peer_review_score >= 4.0 AND ep.peer_review_score < 4.5
ORDER BY ep.peer_review_score DESC;

-- Average performers (3.0-3.9)
SELECT e.id, e.name, e.role, e.department, ep.peer_review_score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE ep.peer_review_score >= 3.0 AND ep.peer_review_score < 4.0
ORDER BY ep.peer_review_score DESC;

-- Poor performers (<3.0)
SELECT e.id, e.name, e.role, e.department, ep.peer_review_score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE ep.peer_review_score < 3.0
ORDER BY ep.peer_review_score DESC;

-- ========================================
-- ANALYTICS QUERIES
-- ========================================

-- Total employees count
SELECT COUNT(*) as total_employees FROM employees;

-- Active employees count
SELECT COUNT(*) as active_employees FROM employees WHERE status = 'Active';

-- Average performance across all employees
SELECT AVG(ep.peer_review_score) as avg_performance 
FROM employee_performance ep;

-- Department statistics
SELECT 
    e.department,
    COUNT(*) as employee_count,
    AVG(ep.peer_review_score) as avg_performance,
    SUM(ep.peer_review_score) as total_performance
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
GROUP BY e.department
ORDER BY avg_performance DESC;

-- Performance distribution
SELECT 
    CASE 
        WHEN ep.peer_review_score >= 4.5 THEN 'Excellent (4.5+)'
        WHEN ep.peer_review_score >= 4.0 THEN 'Good (4.0-4.4)'
        WHEN ep.peer_review_score >= 3.0 THEN 'Average (3.0-3.9)'
        ELSE 'Poor (<3.0)'
    END as performance_category,
    COUNT(*) as employee_count
FROM employee_performance ep
GROUP BY performance_category
ORDER BY 
    CASE 
        WHEN ep.peer_review_score >= 4.5 THEN 1
        WHEN ep.peer_review_score >= 4.0 THEN 2
        WHEN ep.peer_review_score >= 3.0 THEN 3
        ELSE 4
    END;

-- ========================================
-- INDIVIDUAL EMPLOYEE QUERIES
-- ========================================

-- Get single employee with full details
SELECT e.*, ep.*
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.id = 'EMP001';

-- Get employee performance for AI analysis
SELECT 
    e.name,
    e.role,
    e.department,
    ep.peer_review_score,
    ep.productivity_score,
    ep.team_collaboration,
    ep.innovation_score,
    ep.policy_violations,
    ep.security_incidents,
    ep.complaints,
    (ep.peer_review_score + ep.productivity_score + ep.team_collaboration) / 3 as avg_score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.id = 'EMP001';

-- ========================================
-- CHART DATA QUERIES
-- ========================================

-- Performance breakdown for charts
SELECT 
    'Peer Review' as metric,
    ep.peer_review_score as score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.id = 'EMP001'

UNION ALL

SELECT 
    'Productivity' as metric,
    ep.productivity_score as score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.id = 'EMP001'

UNION ALL

SELECT 
    'Team Work' as metric,
    ep.team_collaboration as score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.id = 'EMP001'

UNION ALL

SELECT 
    'Leadership' as metric,
    ep.innovation_score as score
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
WHERE e.id = 'EMP001';

-- Department performance for bar chart
SELECT 
    e.department,
    AVG(ep.peer_review_score) as avg_performance,
    COUNT(*) as employee_count
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
GROUP BY e.department
ORDER BY avg_performance DESC;

-- Performance trends for line chart
SELECT 
    SUBSTRING(e.id, 4) as employee_number,
    e.name,
    ep.peer_review_score as performance,
    ep.productivity_score as productivity,
    ep.team_collaboration as collaboration
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
ORDER BY e.id
LIMIT 10;

-- ========================================
-- ADMIN QUERIES
-- ========================================

-- List all employees with performance summary
SELECT 
    e.id,
    e.name,
    e.role,
    e.department,
    e.status,
    ep.peer_review_score,
    ep.productivity_score,
    ep.team_collaboration,
    ep.tickets_closed,
    ep.complaints
FROM employees e
LEFT JOIN employee_performance ep ON e.id = ep.employee_id
ORDER BY e.department, e.name;

-- Performance summary by department
SELECT 
    e.department,
    COUNT(*) as total_employees,
    AVG(ep.peer_review_score) as avg_peer_review,
    AVG(ep.productivity_score) as avg_productivity,
    AVG(ep.team_collaboration) as avg_collaboration,
    SUM(ep.tickets_closed) as total_tickets,
    SUM(ep.complaints) as total_complaints
FROM employees e
JOIN employee_performance ep ON e.id = ep.employee_id
GROUP BY e.department
ORDER BY avg_peer_review DESC;
