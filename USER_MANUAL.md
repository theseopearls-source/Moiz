# Hospital Management System - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Patient Management](#patient-management)
5. [Appointment Scheduling](#appointment-scheduling)
6. [Billing & Insurance](#billing--insurance)
7. [Pharmacy Management](#pharmacy-management)
8. [Prescriptions](#prescriptions)
9. [Reports & Analytics](#reports--analytics)
10. [User Management](#user-management)
11. [System Settings](#system-settings)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Recommended screen resolution: 1366x768 or higher

### Accessing the System
1. Open your web browser
2. Navigate to the system URL (e.g., `http://localhost:3000`)
3. You will be redirected to the login page

### Default Credentials
- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change your password after first login!

---

## Login & Authentication

### Logging In
1. Enter your username
2. Enter your password
3. Click "Sign In"
4. You will be redirected to the dashboard

### Session Management
- Sessions automatically expire after 24 hours
- You will be logged out automatically
- Click "Logout" in the top-right corner to manually log out

### Forgot Password
Contact your system administrator to reset your password.

---

## Dashboard Overview

The dashboard is your home screen after logging in.

### Key Metrics
- **Total Patients:** Count of all registered patients
- **Total Appointments:** All scheduled appointments
- **Today's Appointments:** Appointments scheduled for today
- **Total Revenue:** Sum of all billing transactions

### Quick Actions
Four quick action cards provide shortcuts to common tasks:
- 👥 Manage Patients
- 📅 Book Appointment
- 💰 Billing
- 💊 Pharmacy

### Navigation
The left sidebar contains links to all system modules based on your role.

---

## Patient Management

### Viewing Patients
1. Click "Patients" in the sidebar
2. All registered patients are displayed in a table
3. Use the search feature to find specific patients

### Adding a New Patient
1. Click the "+ Add Patient" button
2. Fill in the required information:
   - Full Name *
   - Date of Birth *
   - Gender *
   - Phone *
   - Blood Group
   - Email
   - Address
   - Emergency Contact
   - Medical History
3. Click "Add Patient" to save

### Editing Patient Information
1. Find the patient in the list
2. Click the "Edit" button
3. Update the information
4. Click "Update Patient" to save changes

### Deleting a Patient
1. Find the patient in the list
2. Click the "Delete" button
3. Confirm the deletion
4. ⚠️ This action cannot be undone

### Best Practices
- Always verify patient information before saving
- Keep emergency contacts up to date
- Document medical history thoroughly
- Update records after each visit

---

## Appointment Scheduling

### Viewing Appointments
1. Click "Appointments" in the sidebar
2. All appointments are displayed with:
   - Patient name
   - Date and time
   - Doctor name
   - Department
   - Status

### Scheduling an Appointment
1. Click "+ Schedule Appointment"
2. Fill in the appointment details:
   - Select Patient *
   - Date *
   - Time *
   - Doctor Name *
   - Department *
   - Reason for Visit *
   - Additional Notes
3. Click "Schedule Appointment"
4. A WhatsApp notification will be queued (if enabled)

### Departments Available
- General
- Cardiology
- Orthopedics
- Pediatrics
- Neurology
- Dermatology
- ENT
- Ophthalmology

### Appointment Status
- **Scheduled:** Appointment is confirmed
- **Completed:** Patient has been seen
- **Cancelled:** Appointment was cancelled

### Updating Appointment Status
1. Find the appointment
2. Click "Edit"
3. Change the status
4. Click "Update Appointment"

### Cancelling an Appointment
1. Find the appointment
2. Click "Delete"
3. Confirm cancellation

---

## Billing & Insurance

### Viewing Bills
1. Click "Billing" in the sidebar
2. View all billing records with:
   - Patient name
   - Description
   - Amount
   - Insurance information
   - Payment status

### Revenue Overview
Three key metrics are displayed:
- **Total Revenue:** All billing transactions
- **Paid:** Collected payments
- **Pending:** Outstanding bills

### Creating a Bill
1. Click "+ Create Bill"
2. Fill in the billing information:
   - Select Patient *
   - Description * (e.g., Consultation, Surgery)
   - Amount (USD) *
   - Insurance Provider (optional)
   - Insurance Claim Number (optional)
   - Payment Method
   - Notes
3. Click "Create Bill"

### Payment Methods
- Cash
- Credit/Debit Card
- Insurance
- Bank Transfer

### Marking a Bill as Paid
1. Find the bill with "pending" status
2. Click "Mark Paid"
3. Status updates to "paid"

### Cancelling a Bill
1. Find the bill
2. Click "Cancel"
3. Confirm cancellation

### Insurance Claims
- Enter insurance provider name
- Add claim number if available
- Track claim status in notes field

---

## Pharmacy Management

### Viewing Inventory
1. Click "Pharmacy" in the sidebar
2. View all medicines with:
   - Name
   - Generic name
   - Category
   - Stock quantity
   - Price
   - Expiry date
   - Stock status

### Stock Status Indicators
- 🟢 **In Stock:** 20+ units available
- 🟡 **Low Stock:** Less than 20 units
- 🔴 **Out of Stock:** 0 units

### Adding Medicine
1. Click "+ Add Medicine"
2. Fill in the information:
   - Medicine Name *
   - Generic Name
   - Category *
   - Manufacturer
   - Stock Quantity *
   - Unit Price (USD) *
   - Expiry Date *
   - Description
3. Click "Add Medicine"

### Medicine Categories
- Antibiotics
- Painkillers
- Vitamins
- Antiseptics
- Antiviral
- Cardiovascular
- Other

### Updating Stock
1. Find the medicine
2. Click "Edit"
3. Update the stock quantity
4. Click "Update Medicine"

### Best Practices
- Monitor expiry dates regularly
- Reorder when stock is low
- Keep accurate inventory records
- Document all stock changes

---

## Prescriptions

### Viewing Prescriptions
1. Click "Prescriptions" in the sidebar
2. View all prescriptions with:
   - Patient name
   - Date created
   - Diagnosis
   - Medicines prescribed
   - Doctor information

### Creating a Prescription
1. Click "+ Create Prescription"
2. Fill in the details:
   - Select Patient *
   - Enter Diagnosis
   - Add Medicines:
     - Select Medicine *
     - Dosage * (e.g., 500mg)
     - Frequency * (e.g., Twice daily)
     - Duration * (e.g., 7 days)
3. Click "+ Add Another Medicine" for multiple medicines
4. Add any additional notes
5. Click "Create Prescription"

### Multi-Medicine Prescriptions
- Click "Add Another Medicine" to add more
- Click "Remove" to delete a medicine entry
- Each medicine has its own dosage instructions

### Prescription Information
Each prescription displays:
- Patient name and date
- Diagnosis
- All prescribed medicines
- Dosage instructions
- Additional notes from doctor

### Best Practices
- Be specific with dosage instructions
- Include duration clearly
- Note any precautions
- Document allergies in patient records

---

## Reports & Analytics

### Accessing Reports
1. Click "Reports" in the sidebar
2. View comprehensive analytics

### Overview Statistics
Four key metrics:
- Total Patients
- New Patients This Month
- Total Appointments
- Today's Appointments

### Appointment Statistics
- Total appointments
- Completed appointments
- Cancelled appointments

### Revenue Statistics
- Total revenue (all time)
- Collected revenue (paid bills)
- Pending revenue (outstanding bills)

### Department Distribution
- Visual breakdown of appointments by department
- Percentage distribution
- Appointment counts

### Export Reports (Future Feature)
Planned export options:
- Patient Report
- Appointment Report
- Financial Report
- Analytics Summary

---

## User Management

**Admin Access Only**

### Viewing Users
1. Click "Users" in the sidebar
2. View all system users with:
   - Username
   - Full name
   - Email
   - Phone
   - Role
   - Status
   - Created date

### User Roles

#### 🔴 Admin
- Full system access
- Can manage all modules
- User management
- System settings
- Feature toggles

#### 🟢 Doctor
- Patient records
- Appointments
- Prescriptions
- Pharmacy
- Reports

#### 🔵 Nurse
- Patient records
- Appointments
- Prescriptions
- Pharmacy

#### 🟡 Receptionist
- Patient registration
- Appointments
- Billing

### Creating a New User
1. Click "+ Add User"
2. Fill in user information:
   - Username *
   - Password *
   - Full Name *
   - Email
   - Phone
   - Role *
3. Click "Create User"

### User Status
- **Active:** Can log in and use the system
- **Inactive:** Cannot log in

### Security Best Practices
- Use strong passwords
- Change default passwords
- Review user access regularly
- Disable inactive accounts
- Use principle of least privilege

---

## System Settings

**Admin Access Only**

### Accessing Settings
1. Click "Settings" in the sidebar
2. Configure system options

### Feature Management

Enable or disable system features:
- ✅ Patient Management
- ✅ Appointment Scheduling
- ✅ Billing
- ✅ Insurance
- ✅ Pharmacy
- ✅ Prescriptions
- ✅ Reporting
- ✅ WhatsApp Notifications
- ✅ Medical History

**Note:** Disabled features are not accessible to any user.

### System Configuration

#### Hospital Name
Set your hospital's name for display throughout the system.

#### Timezone
Select your timezone for accurate date/time display:
- UTC
- EST (America/New_York)
- CST (America/Chicago)
- PST (America/Los_Angeles)
- GMT (Europe/London)
- JST (Asia/Tokyo)
- GST (Asia/Dubai)
- IST (Asia/Kolkata)

#### Currency
Select your billing currency:
- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- JPY - Japanese Yen
- AED - UAE Dirham
- INR - Indian Rupee
- AUD - Australian Dollar
- CAD - Canadian Dollar

### WhatsApp Notifications

#### Enable/Disable
Toggle WhatsApp notifications on or off.

#### Configuration
1. **WhatsApp API Key**
   - Enter your API key from your provider
   - Keep this secure and confidential

2. **WhatsApp Phone Number**
   - Enter your WhatsApp Business number
   - Format: +1234567890

#### Setup Instructions
1. Sign up for WhatsApp Business API
   - Twilio
   - MessageBird
   - Official WhatsApp Business API
2. Obtain API credentials
3. Enter credentials in settings
4. Enable notifications
5. Test with a sample appointment

#### Notification Types
- **Appointment Scheduled:** Sent immediately when appointment is created
- **Appointment Reminder:** Sent before appointment (future)
- **Follow-up Reminder:** Sent after treatment (future)

### Saving Settings
1. Make your changes
2. Click "💾 Save Changes" or "Save All Settings"
3. Confirmation message will appear
4. Settings are applied immediately

---

## Troubleshooting

### Cannot Log In
**Problem:** Invalid credentials error
**Solution:**
- Verify username and password
- Check for caps lock
- Contact administrator for password reset

**Problem:** Session expired
**Solution:**
- Sessions last 24 hours
- Log in again with your credentials

### Page Not Loading
**Problem:** Blank or loading screen
**Solution:**
- Refresh the page (F5 or Ctrl+R)
- Clear browser cache
- Try a different browser
- Check internet connection

### Cannot Create Patient/Appointment
**Problem:** Form won't submit
**Solution:**
- Check all required fields (marked with *)
- Verify date formats
- Check for error messages
- Ensure you have permission for this action

### Data Not Appearing
**Problem:** Empty tables or missing information
**Solution:**
- Verify you have the correct permissions
- Check if feature is enabled in settings (Admin)
- Refresh the page
- Contact system administrator

### WhatsApp Notifications Not Working
**Problem:** Notifications not being sent
**Solution:**
1. Check if WhatsApp is enabled in Settings
2. Verify API key is correct
3. Verify phone number format
4. Check with your API provider
5. Review notification queue in backend

### Billing Issues
**Problem:** Revenue not calculating correctly
**Solution:**
- Verify bill amounts are entered correctly
- Check bill status (only 'paid' bills count toward collected revenue)
- Refresh the reports page

### Permission Denied
**Problem:** "Forbidden" or "403" error
**Solution:**
- You may not have permission for this action
- Contact your administrator
- Verify your user role

### Performance Issues
**Problem:** System is slow
**Solution:**
- Close unnecessary browser tabs
- Clear browser cache
- Check internet connection speed
- Contact system administrator if persistent

### Getting Help
If you encounter issues not covered here:
1. Note the exact error message
2. Note what you were trying to do
3. Contact your system administrator
4. Provide screenshots if possible

---

## Keyboard Shortcuts

### Global
- **Tab:** Navigate between form fields
- **Enter:** Submit forms
- **Esc:** Close modals/dialogs

### Forms
- **Tab:** Move to next field
- **Shift+Tab:** Move to previous field
- **Enter:** Submit form

---

## Tips & Best Practices

### General
- Log out when finished
- Don't share your credentials
- Keep patient information confidential
- Double-check data before saving
- Use strong passwords

### Patient Management
- Verify patient identity
- Keep emergency contacts current
- Document thoroughly
- Update after each visit

### Appointments
- Confirm appointments with patients
- Allow time between appointments
- Note no-shows
- Update status promptly

### Billing
- Create bills promptly
- Verify insurance information
- Keep accurate payment records
- Follow up on pending bills

### Pharmacy
- Monitor expiry dates
- Maintain adequate stock
- Order before running out
- Keep inventory accurate

### Prescriptions
- Be clear and specific
- Include duration
- Note allergies
- Verify dosage

---

## Glossary

**Admin:** System administrator with full access

**RBAC:** Role-Based Access Control - security model based on user roles

**Session:** Period of time you're logged in (24 hours)

**Token:** Secure code used for authentication

**Prescription:** Doctor's order for medicine

**Billing:** Invoice for medical services

**Insurance Claim:** Request for payment from insurance provider

**Inventory:** List of available medicines

**Department:** Hospital division (e.g., Cardiology)

**Status:** Current state (e.g., Scheduled, Completed)

---

## Contact & Support

For technical support or questions:
- Contact your system administrator
- Refer to this manual
- Check PROJECT_PLAN.md for detailed information

---

**User Manual Version:** 1.0  
**Last Updated:** 2025-11-11  
**System Version:** 1.0.0
