# Hospital Management System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Backend (30 seconds)

Open a terminal and run:
```bash
cd backend
chmod +x start.sh
./start.sh
```

✅ Backend is now running on `http://localhost:8000`

### Step 2: Start the Frontend (2 minutes)

Open a new terminal and run:
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend is now running on `http://localhost:3000`

### Step 3: Login (30 seconds)

1. Open your browser and go to: `http://localhost:3000`
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`

✅ You're now in the Hospital Management System!

---

## 📱 What Can You Do?

### As Admin (Full Access)

1. **👥 Manage Patients**
   - Click "Patients" in sidebar
   - Click "+ Add Patient"
   - Fill in patient details
   - Save!

2. **📅 Schedule Appointments**
   - Click "Appointments"
   - Click "+ Schedule Appointment"
   - Select patient, date, time, and doctor
   - Save!

3. **💰 Create Bills**
   - Click "Billing"
   - Click "+ Create Bill"
   - Enter amount and details
   - Save!

4. **💊 Manage Pharmacy**
   - Click "Pharmacy"
   - Click "+ Add Medicine"
   - Enter medicine details
   - Save!

5. **📋 Write Prescriptions**
   - Click "Prescriptions"
   - Click "+ Create Prescription"
   - Select patient and medicines
   - Save!

6. **📊 View Reports**
   - Click "Reports"
   - See all statistics and analytics

7. **⚙️ Configure System**
   - Click "Settings"
   - Toggle features on/off
   - Configure WhatsApp notifications
   - Save changes!

8. **👤 Manage Users**
   - Click "Users"
   - Click "+ Add User"
   - Create accounts for doctors, nurses, receptionists

---

## 🎯 Common Tasks

### Register a New Patient
1. Sidebar → Patients
2. "+ Add Patient"
3. Fill: Name, DOB, Gender, Phone
4. Add medical history
5. Click "Add Patient"

### Book an Appointment
1. Sidebar → Appointments
2. "+ Schedule Appointment"
3. Select patient
4. Pick date and time
5. Choose department and doctor
6. Click "Schedule Appointment"

### Create a Bill
1. Sidebar → Billing
2. "+ Create Bill"
3. Select patient
4. Enter description and amount
5. Add insurance if applicable
6. Click "Create Bill"

### Add Medicine to Inventory
1. Sidebar → Pharmacy
2. "+ Add Medicine"
3. Enter medicine name and details
4. Set stock quantity and price
5. Click "Add Medicine"

### Create a Prescription
1. Sidebar → Prescriptions
2. "+ Create Prescription"
3. Select patient
4. Add diagnosis
5. Add medicines with dosage
6. Click "Create Prescription"

---

## 🔐 User Roles & Access

### Admin
- ✅ Everything (all modules)

### Doctor
- ✅ Patients
- ✅ Appointments
- ✅ Prescriptions
- ✅ Pharmacy
- ✅ Reports
- ❌ Billing
- ❌ Users
- ❌ Settings

### Nurse
- ✅ Patients
- ✅ Appointments
- ✅ Prescriptions
- ✅ Pharmacy
- ❌ Billing
- ❌ Reports
- ❌ Users
- ❌ Settings

### Receptionist
- ✅ Patients
- ✅ Appointments
- ✅ Billing
- ❌ Prescriptions
- ❌ Pharmacy
- ❌ Reports
- ❌ Users
- ❌ Settings

---

## 📱 WhatsApp Notifications Setup

### Quick Setup (5 minutes)

1. **Get WhatsApp Business API**
   - Sign up at Twilio, MessageBird, or WhatsApp
   - Get your API key

2. **Configure in System**
   - Login as Admin
   - Go to Settings
   - Scroll to "WhatsApp Notifications"
   - Enter API Key and Phone Number
   - Toggle "Enable WhatsApp Notifications" ON
   - Click "Save Changes"

3. **Test It**
   - Create a test appointment
   - Notification will be queued automatically
   - Check your WhatsApp notification service logs

---

## 🎨 Interface Overview

### Dashboard
- **Top Bar:** Hospital name, user info, logout
- **Left Sidebar:** Navigation menu
- **Main Area:** Content and forms
- **Stats Cards:** Key metrics at a glance

### Navigation
- Click menu items in sidebar
- Use breadcrumbs (future)
- Press "Logout" to sign out

---

## 💡 Pro Tips

1. **Quick Navigation**
   - Use sidebar for fast access
   - Dashboard has quick action cards

2. **Search Features**
   - Most tables have built-in search
   - Filter by status, date, etc.

3. **Keyboard Shortcuts**
   - Tab to navigate forms
   - Enter to submit
   - Esc to close modals

4. **Mobile Friendly**
   - Works on tablets
   - Responsive design
   - (Full mobile app coming soon)

5. **Data Safety**
   - System auto-saves
   - Backups recommended
   - Don't share passwords

---

## 🐛 Something Not Working?

### Backend Issues

**Port already in use?**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
# Restart backend
cd backend && ./start.sh
```

**Database issues?**
```bash
# Reset database (WARNING: deletes data)
rm -rf backend/database
# Restart - will create fresh database
cd backend && python3 server.py
```

### Frontend Issues

**Module not found?**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

**Build errors?**
```bash
cd frontend
npm run build
# Check error messages
```

### Still Stuck?

1. Check the logs
2. Read the error message
3. Consult README.md
4. Check USER_MANUAL.md
5. Ask your system administrator

---

## 📚 Learn More

- **README.md** - Complete system overview
- **USER_MANUAL.md** - Detailed user guide
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_PLAN.md** - Project details
- **DEPLOYMENT_GUIDE.md** - Production deployment

---

## ✅ Your First 10 Minutes Checklist

- [x] Backend running ✅
- [x] Frontend running ✅
- [x] Logged in as admin ✅
- [ ] Create a test patient
- [ ] Schedule a test appointment
- [ ] Create a test bill
- [ ] Add a medicine to pharmacy
- [ ] Create a test prescription
- [ ] Check the reports
- [ ] Explore settings
- [ ] Create a doctor user account

---

## 🎉 You're Ready!

You now have a fully functional Hospital Management System running locally.

**Next Steps:**
1. Create your real users (doctors, nurses, receptionists)
2. Start adding real patients
3. Configure system settings (hospital name, timezone)
4. Set up WhatsApp notifications
5. Train your staff
6. Deploy to production (see DEPLOYMENT_GUIDE.md)

---

## 🆘 Need Help?

- **Documentation:** Check the docs folder
- **Issues:** Common problems and solutions in USER_MANUAL.md
- **API:** Full API docs in API_DOCUMENTATION.md
- **Deployment:** Production guide in DEPLOYMENT_GUIDE.md

---

**Version:** 1.0.0  
**Status:** Ready to Use  
**Updated:** 2025-11-11

---

## 🚀 Happy Hospital Managing! 🏥
