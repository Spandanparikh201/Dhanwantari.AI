# Database Setup Instructions

## Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Navigate to server directory
cd server

# Run the setup script
mysql -u root -p < migrations/001_multi_role_system.sql
```

### Option 2: Manual Setup
```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Create database
CREATE DATABASE dhanwantari CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Exit and run migration
exit
mysql -u root -p dhanwantari < migrations/001_multi_role_system.sql
```

## Default Test Accounts

After running the migration, you'll have these test accounts:

### Admin Account
- **Email**: admin@dhanwantari.com
- **Password**: Admin@123
- **Role**: Administrator

### Doctor Account
- **Email**: doctor@dhanwantari.com
- **Password**: Doctor@123
- **Role**: BHMS Doctor (Verified)

### Patient Account
- **Email**: patient@dhanwantari.com
- **Password**: Patient@123
- **Role**: Patient

> ⚠️ **IMPORTANT**: Change these passwords in production!

## Verify Installation

```sql
-- Check database
SHOW DATABASES LIKE 'dhanwantari';

-- Check tables
USE dhanwantari;
SHOW TABLES;

-- Check users
SELECT id, name, email, role, status FROM users;

-- Check verified doctors
SELECT * FROM active_doctors;
```

## Troubleshooting

### Error: Database already exists
```sql
DROP DATABASE dhanwantari;
-- Then run the migration script again
```

### Error: Access denied
```bash
# Grant privileges
mysql -u root -p
GRANT ALL PRIVILEGES ON dhanwantari.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: Foreign key constraint fails
- Ensure you're running the complete script from scratch
- Drop the database and recreate it

## Next Steps

1. Update `.env` file with database credentials
2. Start the server: `npm run dev`
3. Test login with default accounts
4. Create your own admin account and delete test accounts
