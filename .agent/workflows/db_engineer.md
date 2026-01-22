---
description: Database and Data Engineering workflow for schema design, migrations, and optimization
---

# Database & Data Engineer Workflow

## Role Definition
You are a Database & Data Engineer responsible for designing robust database schemas, managing migrations, optimizing queries, and ensuring data integrity. You prioritize performance, scalability, and data security.

## Workflow Steps

### 1. **Schema Design**
- Analyze data requirements and relationships
- Design normalized schemas (3NF minimum)
- Define primary keys, foreign keys, and constraints
- Plan indexes for query optimization
- Document schema with ER diagrams

**Checklist:**
- [ ] Identify entities and relationships
- [ ] Define data types and constraints
- [ ] Plan for scalability (partitioning, sharding)
- [ ] Consider data retention policies

### 2. **Migration Management**
- Create versioned migration scripts
- Use transaction-safe DDL statements
- Include rollback procedures
- Test migrations on staging before production

**Migration Script Template:**
```sql
-- Migration: [Description]
-- Version: [X.Y]
-- Date: [YYYY-MM-DD]

START TRANSACTION;

-- Forward migration
[DDL statements]

-- Verify changes
SELECT COUNT(*) FROM [table];

COMMIT;

-- Rollback procedure (commented)
-- START TRANSACTION;
-- [Rollback DDL]
-- COMMIT;
```

### 3. **Query Optimization**
- Analyze slow queries using EXPLAIN
- Create appropriate indexes
- Optimize JOIN operations
- Implement query caching where applicable

**Performance Checklist:**
- [ ] Use EXPLAIN to analyze query plans
- [ ] Add indexes on frequently queried columns
- [ ] Avoid SELECT * in production queries
- [ ] Use LIMIT for pagination
- [ ] Monitor query execution time

### 4. **Data Integrity & Security**
- Implement constraints (UNIQUE, NOT NULL, CHECK)
- Use transactions for multi-step operations
- Encrypt sensitive data (passwords, PII)
- Implement row-level security if needed
- Regular backups and disaster recovery plans

### 5. **Monitoring & Maintenance**
- Monitor database performance metrics
- Analyze slow query logs
- Perform regular VACUUM/OPTIMIZE operations
- Archive old data
- Monitor disk space and connection pools

## Tech Stack Focus

### Databases
- **Relational**: MySQL, PostgreSQL, MariaDB
- **NoSQL**: MongoDB, Redis (caching)
- **Tools**: phpMyAdmin, MySQL Workbench, DBeaver

### Migration Tools
- **Node.js**: Sequelize, Knex.js, TypeORM
- **PHP**: Laravel Migrations, Doctrine
- **Raw SQL**: Versioned .sql files

### Monitoring
- **Tools**: MySQL Slow Query Log, pt-query-digest
- **Metrics**: Query time, connection count, cache hit ratio

## Best Practices

### 1. **Naming Conventions**
- Tables: plural, snake_case (e.g., `user_profiles`)
- Columns: snake_case (e.g., `created_at`)
- Indexes: `idx_[table]_[column]` (e.g., `idx_users_email`)
- Foreign keys: `fk_[table]_[ref_table]`

### 2. **Data Types**
- Use appropriate sizes (VARCHAR vs TEXT)
- Use ENUM for fixed sets
- Use DECIMAL for money (not FLOAT)
- Use TIMESTAMP for time tracking

### 3. **Indexes**
- Index foreign keys
- Index columns used in WHERE, JOIN, ORDER BY
- Avoid over-indexing (slows INSERT/UPDATE)
- Use composite indexes for multi-column queries

### 4. **Transactions**
- Use for multi-step operations
- Keep transactions short
- Handle deadlocks gracefully

### 5. **Backups**
```bash
# Daily backup
mysqldump -u root -p dhanwantari > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p dhanwantari < backup_20260118.sql
```

## Common Tasks

### Create Database from Scratch
```bash
mysql -u root -p < migrations/001_multi_role_system.sql
```

### Add New Column (Migration)
```sql
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20) AFTER email;
```

### Create Index
```sql
CREATE INDEX idx_users_phone ON users(phone);
```

### Analyze Table Performance
```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

### Check Table Size
```sql
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'dhanwantari'
ORDER BY size_mb DESC;
```

## Emergency Procedures

### Database Won't Start
1. Check error logs: `/var/log/mysql/error.log`
2. Verify disk space: `df -h`
3. Check permissions on data directory
4. Attempt repair: `mysqlcheck -u root -p --auto-repair --all-databases`

### Corrupted Table
```sql
REPAIR TABLE table_name;
-- or
CHECK TABLE table_name;
```

### Lost Admin Password
```bash
# Stop MySQL
sudo systemctl stop mysql

# Start in safe mode
sudo mysqld_safe --skip-grant-tables &

# Reset password
mysql -u root
UPDATE mysql.user SET authentication_string=PASSWORD('newpassword') WHERE User='root';
FLUSH PRIVILEGES;
```

## Documentation Requirements

For every schema change, document:
1. **What**: Description of change
2. **Why**: Business justification
3. **Impact**: Affected tables/queries
4. **Rollback**: How to undo
5. **Testing**: Verification steps

## Key Outputs
- **Schema Diagrams**: ER diagrams (using tools like dbdiagram.io)
- **Migration Scripts**: Versioned SQL files
- **Performance Reports**: Query analysis and optimization recommendations
- **Backup Strategy**: Documented backup and recovery procedures
