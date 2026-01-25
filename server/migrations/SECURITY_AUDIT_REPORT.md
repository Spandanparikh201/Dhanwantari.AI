# Security Audit Report - Dhanwantari Database Schema
**Date:** 2026-01-22  
**Auditors:** Red Team + Blue Team  
**Schema Version:** 2.0  

---

## 🔴 RED TEAM FINDINGS (Attack Vectors)

### CRITICAL Vulnerabilities

#### 1. **SQL Injection Risk via Application Layer**
**Severity:** CRITICAL (CVSS 9.8)
- **Issue:** Schema doesn't enforce parameterization (application-level issue)
- **Attack Vector:** If application uses string concatenation for queries
```sql
-- VULNERABLE (Application Code):
"SELECT * FROM users WHEReemail = '" + userInput + "'"
-- Exploit: userInput = "' OR '1'='1'; DROP TABLE users; --"
```
- **Recommendation:** Enforce prepared statements/parameterized queries in ALL database access code

#### 2. **Weak Password Storage Documentation**
**Severity:** HIGH (CVSS 8.1)
- **Issue:** Sample data uses placeholder hashes `$2a$10$YourHashedPasswordHere`
- **Attack Vector:** If deployed with these defaults, instant compromise
- **Recommendation:** Remove sample passwords entirely; force admin to set on first boot

#### 3. **Missing Encryption for Sensitive Data**
**Severity:** HIGH (CVSS 7.5)
- **Issue:** No encryption for:
  - Patient medical records (`chronic_conditions`, `allergies`)
  - Doctor notes (`doctor_notes` in consultations)
  - Payment transaction IDs
- **Attack Vector:** Database breach exposes HIPAA/GDPR protected data in plaintext
- **Recommendation:** Implement column-level encryption or application-level encryption

#### 4. **Insufficient Rate Limiting for Login Attempts**
**Severity:** MEDIUM (CVSS 6.5)
- **Issue:** `failed_login_attempts` tracks but schema doesn't enforce auto-lock
- **Attack Vector:** Brute force attacks can continue indefinitely if app doesn't implement lockout
- **Recommendation:** Add trigger or application logic to auto-lock after 5 failed attempts

#### 5. **Email Enumeration via Registration**
**Severity:** MEDIUM (CVSS 5.3)
- **Issue:** `UNIQUE` constraint on email allows attackers to enumerate registered users
- **Attack Vector:** Try registering with target email; if error says "email exists", user is registered
- **Recommendation:** Return generic "check your email" message for both existing and new users

---

### MEDIUM Vulnerabilities

#### 6. **Insufficient Input Validation Constraints**
**Severity:** MEDIUM (CVSS 5.8)
- **Issue:** No CHECK constraints for:
  - Email format validation
  - Phone number format
  - File size limits in `file_uploads`
  - Rating range (partially addressed but could be stricter)
- **Attack Vector:** Store malicious data, cause application crashes
- **Recommendation:** Add regex validation constraints

#### 7. **No Data Retention Policy Enforcement**
**Severity:** MEDIUM (CVSS 4.9)
- **Issue:** No automatic deletion of old records (GDPR "right to be forgotten")
- **Attack Vector:** GDPR compliance violation, potential fines
- **Recommendation:** Add scheduled job to purge old `deleted_at` records after 30 days

#### 8. **Stored XSS via File Upload `description` Field**
**Severity:** MEDIUM (CVSS 6.1)
- **Issue:** `TEXT` fields like `description`, `bio`, `doctor_notes` don't prevent HTML/JS
- **Attack Vector:** Store `<script>alert('XSS')</script>` in description, execute when displayed
- **Recommendation:** Sanitize on input; escape on output (application layer)

---

### LOW Vulnerabilities

#### 9. **Admin Logs Don't Capture Query Failures**
**Severity:** LOW (CVSS 3.1)
- **Issue:** Only successful admin actions logged, not failed attempts
- **Attack Vector:** Attacker probing admin panel goes undetected
- **Recommendation:** Log all attempts, including failures

#### 10. **Weak Token Expiry Defaults**
**Severity:** LOW (CVSS 3.7)
- **Issue:** No default expiry time for `password_reset_tokens` or `email_verification_tokens`
- **Attack Vector:** Tokens could remain valid indefinitely
- **Recommendation:** Add DEFAULT expiry (15 minutes for password, 24 hours for email)

---

## 🔵 BLUE TEAM HARDENING RECOMMENDATIONS

### Immediate Actions (High Priority)

1. **Remove Default Credentials**
   - Delete all INSERT statements with sample users
   - Force first-time setup wizard

2. **Implement Column Encryption**
   - Use MySQL AES_ENCRYPT for sensitive columns
   - Store encryption keys in hardware security module (HSM) or key vault

3. **Add CHECK Constraints**
```sql
ALTER TABLE users ADD CONSTRAINT chk_email_format 
  CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$');

ALTER TABLE file_uploads ADD CONSTRAINT chk_file_size 
  CHECK (file_size_bytes <= 10485760); -- 10MB limit
```

4. **Enforce Token Expiry**
```sql
ALTER TABLE password_reset_tokens 
  MODIFY expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL 15 MINUTE);

ALTER TABLE email_verification_tokens 
  MODIFY expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL 24 HOUR);
```

5. **Add Audit Logging Trigger**
```sql
CREATE TRIGGER log_user_modifications
AFTER UPDATE ON users
FOR EACH ROW
INSERT INTO admin_logs (admin_id, action, resource_type, resource_id, changes)
VALUES ('system', 'user_modified', 'user', NEW.id, 
        JSON_OBJECT('old', ROW(OLD.*), 'new', ROW(NEW.*)));
```

---

### Medium Priority Actions

6. **Create Rate Limiting View**
```sql
CREATE VIEW users_suspicious_activity AS
SELECT 
    id, 
    email, 
    failed_login_attempts,
    locked_until,
    CASE 
        WHEN failed_login_attempts >= 5 THEN 'LOCKED'
        WHEN failed_login_attempts >= 3 THEN 'WARNING'
        ELSE 'OK'
    END AS threat_level
FROM users
WHERE failed_login_attempts > 0;
```

7. **Implement Soft Delete Cleanup Job**
```sql
-- Schedule this via cron/scheduler
CREATE EVENT cleanup_old_deleted_users
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM users 
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - INTERVAL 30 DAY;
```

8. **Add Database User Roles**
```sql
-- Read-only user (for reporting)
CREATE USER 'dhanwantari_readonly'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT ON dhanwantari.* TO 'dhanwantari_readonly'@'localhost';

-- Application user (limited privileges)
CREATE USER 'dhanwantari_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON dhanwantari.* TO 'dhanwantari_app'@'localhost';
-- No DELETE or DROP privileges for app user
```

---

### Long-Term Hardening

9. **Enable MySQL Audit Plugin**
```ini
# my.cnf
[mysqld]
plugin-load-add=audit_log.so
audit_log_file=/var/log/mysql/audit.log
audit_log_policy=ALL
audit_log_rotate_on_size=100M
```

10. **Implement Row-Level Security (RLS)**
```sql
-- Patients can only see their own consultations
CREATE VIEW patient_own_consultations AS
SELECT * FROM consultations
WHERE patient_id = CURRENT_USER();
```

11. **Add Encryption Functions**
```sql
-- Function to encrypt sensitive data
DELIMITER $$
CREATE FUNCTION encrypt_sensitive(data TEXT, key_id VARCHAR(50))
RETURNS BLOB
DETERMINISTIC
BEGIN
    RETURN AES_ENCRYPT(data, key_id);
END$$
DELIMITER ;
```

---

## 📋 COMPLIANCE CHECKLIST

### HIPAA Compliance
- [ ] Encrypt all PHI (Protected Health Information) at rest
- [ ] Implement audit logging for all PHI access
- [ ] Enforce minimum necessary access principle
- [ ] Add automatic session timeout (application layer)
- [ ] Implement data backup and disaster recovery

### GDPR Compliance
- [✅] Right to be forgotten (soft delete implemented)
- [ ] Data portability (export user data feature needed)
- [ ] Data minimization (remove unused fields)
- [ ] Consent tracking (add consent_given field to users)
- [ ] Breach notification (logging system needed)

---

## 🎯 PENETRATION TEST RECOMMENDATIONS

Before production deployment, conduct:

1. **SQL Injection Testing**
   - Use SQLMap against all API endpoints
   - Test stored procedures and functions

2. **Authentication Testing**
   - Brute force login page
   - Test password reset flow for token reuse
   - Verify email enumeration is prevented

3. **Authorization Testing**
   - Attempt IDOR (access other user's consultations)
   - Test privilege escalation (patient → doctor)

4. **Data Leakage Testing**
   - Check if error messages reveal schema info
   - Test if file uploads expose paths

---

## 📊 SECURITY SCORE

| Category | Score | Status |
|----------|-------|--------|
| Authentication | 6/10 | ⚠️ Needs MFA, stronger lockout |
| Authorization | 7/10 | ⚠️ Add row-level security |
| Data Protection | 5/10 | 🔴 No encryption for PHI |
| Audit Logging | 8/10 | ✅ Good coverage, add failures |
| Input Validation | 6/10 | ⚠️ Add CHECK constraints |
| Compliance (GDPR) | 7/10 | ⚠️ Add consent tracking |
| Compliance (HIPAA) | 4/10 | 🔴 Encryption required |

**Overall Score:** 6.1/10 (MEDIUM RISK)

---

## 🚨 CRITICAL NEXT STEPS

1. **IMMEDIATE:** Remove sample passwords from migration script
2. **IMMEDIATE:** Implement prepared statements in application code
3. **HIGH:** Add column encryption for PHI
4. **HIGH:** Add CHECK constraints for input validation
5. **MEDIUM:** Implement MFA for doctors/admins
6. **MEDIUM:** Create security incident response plan
