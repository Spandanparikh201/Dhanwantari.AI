# MySQL Workbench Setup Guide for Dhanwantari Database

## Prerequisites
- MySQL Workbench installed on your computer
- MySQL Server running (XAMPP, WAMP, or standalone MySQL)
- Root password (empty based on your `.env` file)

---

## Step-by-Step Instructions

### Step 1: Launch MySQL Workbench
1. Open **MySQL Workbench** from your applications
2. You should see the home screen with MySQL Connections

### Step 2: Connect to MySQL Server
1. Click on your existing connection (usually named **"Local instance MySQL"** or **"localhost"**)
2. If prompted for password:
   - Leave it **blank** (your `.env` shows `DB_PASSWORD=`)
   - Click **OK**

**Troubleshooting:**
- If no connection exists, click **"+ New Connection"**
- Set hostname: `localhost`
- Port: `3306`
- Username: `root`
- Password: (leave empty)

---

### Step 3: Open the SQL Script
1. Once connected, click **File** → **Open SQL Script**
2. Navigate to: `C:\Users\Spandan\Desktop\Projects\Dhanwantari\server\migrations\`
3. Select **`003_security_hardened_schema.sql`**
4. Click **Open**

**Alternative method:**
- Copy the entire content of `003_security_hardened_schema.sql`
- Click the **new query tab** icon (📄+)
- Paste the SQL code

---

### Step 4: Execute the Script
1. You'll see the SQL code in the editor
2. Look for the **⚡ Lightning bolt** icon in the toolbar
3. Click the **⚡ Execute** button (or press `Ctrl + Shift + Enter`)

**What to expect:**
- The script will run for a few seconds
- You'll see output in the "Action Output" panel at the bottom
- Look for confirmation messages

---

### Step 5: Verify Database Creation
1. In the **Navigator** panel (left side), look for "SCHEMAS"
2. Click the **🔄 Refresh** button (circular arrows icon)
3. You should see **`dhanwantari`** database appear
4. Click the **▶** arrow next to `dhanwantari` to expand it
5. You should see **14 tables**:
   - admin_logs
   - consultations
   - doctor_profiles
   - doctor_reviews
   - email_verification_tokens
   - file_uploads
   - messages
   - notifications
   - password_reset_tokens
   - patient_profiles
   - prescription_items
   - prescriptions
   - users
   - (and 3 views: active_doctors, patient_consultation_history, users_suspicious_activity)

---

### Step 6: Check the Output Panel
Look at the bottom panel for messages like:
```
Creating database dhanwantari... ✓
Creating table users... ✓
Creating table patient_profiles... ✓
...
Database Setup Complete (Security Hardened)!
```

---

### Step 7: Verify the Setup
Run this test query to confirm:
```sql
USE dhanwantari;
SELECT COUNT(*) as total_tables 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'dhanwantari';
```

Expected result: **17** (14 tables + 3 views)

---

## Troubleshooting

### Error: "Access denied for user 'root'"
- **Solution:** Your MySQL root account has a password
- Update your `.env` file:
  ```
  DB_PASSWORD=your_actual_password
  ```

### Error: "Can't connect to MySQL server"
- **Solution:** MySQL Server is not running
- **XAMPP:** Start Apache and MySQL from XAMPP Control Panel
- **WAMP:** Start WAMP services
- **Standalone:** Start MySQL service from Windows Services

### Error: "Database already exists"
- **Solution:** The script tries to drop and recreate
- This is normal if you're re-running the script
- Check if tables were created successfully

### Script runs but no database appears
- Click the **🔄 Refresh** icon in the Schemas panel
- Right-click on "SCHEMAS" → "Refresh All"

---

## Next Steps After Setup

1. **Test Registration:**
   - Go to your app: `http://localhost:5173`
   - Click "Register"
   - Create a new account
   - Should work without errors now!

2. **Verify in MySQL Workbench:**
   ```sql
   USE dhanwantari;
   SELECT * FROM users;
   ```
   You should see your newly created user!

---

## Important Notes

⚠️ **No Sample Users Created**
- For security, the production schema doesn't include default users
- You must register through the web app

🔒 **Security Features Enabled**
- Input validation constraints
- Rate limiting fields
- Audit logging
- Token expiry enforcement
- GDPR compliance tracking

📊 **Database Statistics**
After setup, check the stats:
```sql
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM consultations) as consultations,
    (SELECT COUNT(*) FROM doctor_profiles WHERE verified=TRUE) as verified_doctors;
```

---

## Visual Guide Summary

📁 **File Location:**
```
C:\Users\Spandan\Desktop\Projects\Dhanwantari\server\migrations\003_security_hardened_schema.sql
```

🔌 **Connection Details:**
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: (empty)

⚡ **Execute Button:**
Look for the lightning bolt (⚡) in the toolbar

🔄 **Refresh Schemas:**
Click the circular arrows in the Navigator panel

---

## Need Help?

If you encounter any issues:
1. Check the "Action Output" panel for error messages
2. Copy the exact error message
3. Let me know and I'll help troubleshoot!

Good luck! 🚀
