-- Create Default Admin User
-- Email: admin@dhanwantari.com
-- Password: Admin@123

INSERT INTO users (id, email, password_hash, role, status, email_verified)
VALUES (
    'admin_001', 
    'admin@dhanwantari.com', 
    '$2a$10$rKZv4FZ.vU4QJ9kGxJ5kZOXxJ5kZOXxJ5kZOXxJ5kZOXxJ', 
    'admin', 
    'active',
    TRUE
) ON DUPLICATE KEY UPDATE id=id;
