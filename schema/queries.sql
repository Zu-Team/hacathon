-- Common queries for Nexus Bank prototype
-- Useful SQL queries for login and session management

USE nexus_bank;

-- ========================================
-- USER AUTHENTICATION QUERIES
-- ========================================

-- Check user login credentials
SELECT id, username, email, role 
FROM users 
WHERE username = 'admin' 
AND password_hash = MD5('admin123');

-- Find user by username only
SELECT id, username, email, role 
FROM users 
WHERE username = 'admin';

-- Find user by email only
SELECT id, username, email, role 
FROM users 
WHERE email = 'admin@nexusbank.com';

-- ========================================
-- SESSION MANAGEMENT QUERIES
-- ========================================

-- Create new session (insert new session)
INSERT INTO sessions (user_id, session_token, expires_at) 
VALUES (1, 'new_unique_token_12345', DATE_ADD(NOW(), INTERVAL 24 HOUR));

-- Validate session token
SELECT s.id, s.user_id, s.session_token, s.expires_at, u.username, u.role
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.session_token = 'admin_session_token_12345'
AND s.expires_at > NOW();

-- Get user info from session token
SELECT u.id, u.username, u.email, u.role
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.session_token = 'admin_session_token_12345'
AND s.expires_at > NOW();

-- Delete session (logout)
DELETE FROM sessions 
WHERE session_token = 'admin_session_token_12345';

-- Delete all sessions for a user
DELETE FROM sessions 
WHERE user_id = 1;

-- ========================================
-- CLEANUP QUERIES
-- ========================================

-- Clean expired sessions
DELETE FROM sessions 
WHERE expires_at < NOW();

-- Count active sessions
SELECT COUNT(*) as active_sessions 
FROM sessions 
WHERE expires_at > NOW();

-- List all active sessions with user info
SELECT s.session_token, u.username, u.role, s.expires_at
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > NOW()
ORDER BY s.expires_at DESC;

-- ========================================
-- ADMIN QUERIES
-- ========================================

-- List all users
SELECT id, username, email, role 
FROM users 
ORDER BY id;

-- List all sessions (including expired)
SELECT s.id, s.session_token, u.username, s.expires_at,
       CASE 
           WHEN s.expires_at > NOW() THEN 'Active'
           ELSE 'Expired'
       END as status
FROM sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.expires_at DESC;

-- Count users by role
SELECT role, COUNT(*) as user_count
FROM users
GROUP BY role;

-- ========================================
-- TEST QUERIES
-- ========================================

-- Test login flow (step by step)
-- Step 1: Find user
SELECT id, username, role FROM users WHERE username = 'admin';

-- Step 2: Verify password
SELECT id FROM users WHERE username = 'admin' AND password_hash = MD5('admin123');

-- Step 3: Create session
INSERT INTO sessions (user_id, session_token, expires_at) 
VALUES (1, 'test_session_12345', DATE_ADD(NOW(), INTERVAL 24 HOUR));

-- Step 4: Verify session
SELECT s.*, u.username, u.role
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.session_token = 'test_session_12345'
AND s.expires_at > NOW();
