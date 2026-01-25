# Dhanwantari Database Schema Documentation

## Version 2.0 - Comprehensive Production Schema

### Overview
This schema is designed for a production-ready homeopathy consultation platform with support for:
- Multi-role authentication (Patient, Doctor, Admin)
- AI-powered consultations
- Doctor consultations (online/in-person)
- Prescription management
- File uploads and medical records
- Real-time messaging
- Payment tracking
- Email/Phone verification
- Audit logging

---

## Tables Summary

| Table | Purpose | Key Features |
|-------|---------|-------------|
| `users` | Authentication & user management | Soft delete, account locking, login tracking |
| `patient_profiles` | Patient medical information | Computed BMI & age, structured JSON data |
| `doctor_profiles` | Doctor credentials & availability | Geolocation, rating system, verification |
| `consultations` | Consultation sessions | Multi-mode (chat/video/audio), payment tracking |
| `messages` | Chat history | File attachments, read receipts |
| `prescriptions` | Prescription headers | Multiple prescription types |
| `prescription_items` | Individual remedies | Detailed dosage instructions |
| `file_uploads` | Medical documents/files | OCR support, metadata |
| `notifications` | User notifications | Unread tracking, deeplinks |
| `admin_logs` | Audit trail | Complete change history |
| `password_reset_tokens` | Password recovery | Expiry & usage tracking |
| `email_verification_tokens` | Email verification | Expiry tracking |
| `doctor_reviews` | Doctor ratings & reviews | Verified reviews only |

---

## Entity Relationships

```
users (1) ----< (∞) patient_profiles
users (1) ----< (∞) doctor_profiles
users (1) ----< (∞) consultations [as patient]
users (1) ----< (∞) consultations [as doctor]
consultations (1) ----< (∞) messages
consultations (1) ----< (∞) prescriptions
prescriptions (1) ----< (∞) prescription_items
consultations (1) ----< (∞) file_uploads
users (1) ----< (∞) notifications
users (1) ----< (∞) admin_logs
doctors (1) ----< (∞) doctor_reviews
```

---

## Key Features

### 1. Security Features
- **Soft Deletes**: Uses `deleted_at` column instead of hard deletes
- **Account Locking**: Prevents brute force attacks with `failed_login_attempts` and `locked_until`
- **Email/Phone Verification**: Separate token tables for verification
- **Audit Logging**: Complete admin action history with IP tracking

### 2. Computed Columns
- **Age**: Auto-calculated from `date_of_birth`
- **BMI**: Auto-calculated from height and weight
- Uses MySQL GENERATED ALWAYS AS for automatic updates

### 3. Structured Data (JSON)
- **Allergies**: `[{"name": "Pollen", "severity": "moderate"}]`
- **Medications**: `[{"name": "XYZ", "dosage": "5mg", "frequency": "daily"}]`
- **Symptoms**: Structured symptom reporting
- **Availability**: Doctor schedule in JSON format

### 4. Indexing Strategy
- Foreign keys indexed for JOIN performance
- Composite indexes for common query patterns
- Date/timestamp fields indexed for range queries
- Email and phone indexed for lookups

### 5. Views
- `active_doctors`: Quick list of verified, active doctors
- `patient_consultation_history`: Joined view of consultations with patient/doctor names

---

## Sample Queries

### Get patient's consultation history
```sql
SELECT * FROM patient_consultation_history 
WHERE patient_id = 'patient_001'
ORDER BY created_at DESC;
```

### Get unread notifications
```sql
SELECT * FROM notifications 
WHERE user_id = 'patient_001' AND read_at IS NULL
ORDER BY created_at DESC;
```

### Get doctor's upcoming appointments
```sql
SELECT c.*, pp.full_name as patient_name
FROM consultations c
JOIN patient_profiles pp ON c.patient_id = pp.user_id
WHERE c.doctor_id = 'doctor_001'
  AND c.status = 'scheduled'
  AND c.scheduled_at > NOW()
ORDER BY c.scheduled_at ASC;
```

### Calculate doctor rating
```sql
SELECT 
    doctor_id,
    AVG(rating) as avg_rating,
    COUNT(*) as total_reviews
FROM doctor_reviews
WHERE is_visible = TRUE
GROUP BY doctor_id;
```

---

## Migration Instructions

### Initial Setup
```bash
# Create database
mysql -u root -p < migrations/002_comprehensive_schema.sql

# Verify setup
mysql -u root -p dhanwantari -e "SHOW TABLES;"
```

### Update .env file
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dhanwantari
DB_PORT=3306
```

### Backup Database
```bash
# Daily backup
mysqldump -u root -p dhanwantari > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p dhanwantari < backup_20260122.sql
```

---

## Performance Optimization

### Recommended Indexes (already created)
✅ All foreign keys indexed  
✅ Email, phone indexed for auth  
✅ Status fields indexed for filtering  
✅ Timestamps indexed for date ranges  
✅ Composite indexes for common joins  

### Query Optimization Tips
1. Use `EXPLAIN` to analyze slow queries
2. Limit result sets with `LIMIT`
3. Avoid `SELECT *` in production
4. Use indexes for WHERE, JOIN, ORDER BY clauses
5. Consider partitioning for large tables (consultations, messages)

---

## Security Best Practices

### Before Production
- [ ] Change all default passwords
- [ ] Generate proper bcrypt hashes for sample users
- [ ] Configure SSL for MySQL connections
- [ ] Set up regular automated backups
- [ ] Enable MySQL slow query log
- [ ] Implement database user roles (read-only, read-write)
- [ ] Configure connection pooling limits
- [ ] Enable binary logging for point-in-time recovery

### GDPR/HIPAA Compliance
- [ ] Implement data retention policies
- [ ] Add data export functionality
- [ ] Implement right to be forgotten (soft deletes)
- [ ] Encrypt sensitive columns (consider MySQL encryption)
- [ ] Audit access to medical records
- [ ] Implement row-level security if needed

---

## Next Steps

1. **Backend Integration**: Update API routes to use new schema
2. **Migration Script**: Create data migration from v1 to v2
3. **Seed Data**: Add comprehensive test data
4. **API Documentation**: Update API docs with new fields
5. **Frontend Updates**: Update forms/components for new fields
6. **Testing**: Write integration tests for new features

---

## Support

For questions or issues with the database schema, contact the dev team or refer to:
- Schema diagram: `docs/er-diagram.png` (to be generated)
- API Documentation: `docs/api-docs.md`
- Migration Guide: `docs/migration-v1-to-v2.md` (to be created)
