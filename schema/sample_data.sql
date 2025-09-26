-- Sample data for Nexus Bank prototype
-- Insert test users and sessions

USE nexus_bank;

-- Insert sample users
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@nexusbank.com', MD5('admin123'), 'admin'),
('customer1', 'customer1@nexusbank.com', MD5('customer123'), 'customer'),
('customer2', 'customer2@nexusbank.com', MD5('password123'), 'customer'),
('john_doe', 'john@nexusbank.com', MD5('john123'), 'customer'),
('jane_smith', 'jane@nexusbank.com', MD5('jane123'), 'customer');

-- Insert sample sessions (optional - these will be created when users log in)
-- Session tokens are typically generated dynamically, but here are examples:
INSERT INTO sessions (user_id, session_token, expires_at) VALUES
(1, 'admin_session_token_12345', DATE_ADD(NOW(), INTERVAL 24 HOUR)),
(2, 'customer1_session_token_67890', DATE_ADD(NOW(), INTERVAL 24 HOUR));

-- Note: In real implementation, session tokens should be:
-- - Cryptographically secure random strings
-- - Generated when user logs in
-- - Stored with proper expiration times
-- - Cleaned up when user logs out or session expires
