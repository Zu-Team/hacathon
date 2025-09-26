# Nexus Bank Database Schema

Simple database schema for login and session management prototype.

## 📊 Database Structure

### Tables

#### `users` Table
- `id` - Primary key (auto increment)
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Hashed password (using MD5 for simplicity)
- `role` - User role: 'admin' or 'customer'

#### `sessions` Table
- `id` - Primary key (auto increment)
- `user_id` - Foreign key to users table
- `session_token` - Unique session identifier
- `expires_at` - Session expiration datetime

## 🚀 Setup Instructions

### 1. Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Run the database creation script
source schema/database.sql
```

### 2. Insert Sample Data
```bash
# Run the sample data script
source schema/sample_data.sql
```

### 3. Verify Setup
```sql
-- Check if tables were created
SHOW TABLES;

-- Check sample users
SELECT * FROM users;

-- Check sample sessions
SELECT * FROM sessions;
```

## 🔑 Default Login Credentials

### Admin User
- **Username:** admin
- **Email:** admin@nexusbank.com
- **Password:** admin123
- **Role:** admin

### Customer Users
- **Username:** customer1
- **Email:** customer1@nexusbank.com
- **Password:** customer123
- **Role:** customer

- **Username:** customer2
- **Email:** customer2@nexusbank.com
- **Password:** password123
- **Role:** customer

## 📝 Notes

- This is a **prototype database** - not production ready
- Passwords are hashed with MD5 for simplicity
- Session tokens should be cryptographically secure in production
- Sessions expire after 24 hours by default
- No complex security features included

## 🔧 Database Operations

### Create New User
```sql
INSERT INTO users (username, email, password_hash, role) 
VALUES ('newuser', 'newuser@nexusbank.com', MD5('password'), 'customer');
```

### Create New Session
```sql
INSERT INTO sessions (user_id, session_token, expires_at) 
VALUES (1, 'new_session_token', DATE_ADD(NOW(), INTERVAL 24 HOUR));
```

### Clean Expired Sessions
```sql
DELETE FROM sessions WHERE expires_at < NOW();
```

### Find User by Username
```sql
SELECT * FROM users WHERE username = 'admin';
```

### Find Active Session
```sql
SELECT s.*, u.username, u.role 
FROM sessions s 
JOIN users u ON s.user_id = u.id 
WHERE s.session_token = 'session_token_here' 
AND s.expires_at > NOW();
```
