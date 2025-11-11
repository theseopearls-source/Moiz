#!/usr/bin/env python3
"""
Hospital Management System - Main Server
Handles all API endpoints and business logic
"""

import json
import os
import hashlib
import secrets
import uuid
from datetime import datetime, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import re

# Database file paths
DB_DIR = 'database'
USERS_DB = os.path.join(DB_DIR, 'users.json')
PATIENTS_DB = os.path.join(DB_DIR, 'patients.json')
APPOINTMENTS_DB = os.path.join(DB_DIR, 'appointments.json')
BILLING_DB = os.path.join(DB_DIR, 'billing.json')
PHARMACY_DB = os.path.join(DB_DIR, 'pharmacy.json')
PRESCRIPTIONS_DB = os.path.join(DB_DIR, 'prescriptions.json')
SETTINGS_DB = os.path.join(DB_DIR, 'settings.json')
SESSIONS_DB = os.path.join(DB_DIR, 'sessions.json')
NOTIFICATIONS_DB = os.path.join(DB_DIR, 'notifications.json')

# Initialize database directory
os.makedirs(DB_DIR, exist_ok=True)

# Database helper functions
def load_db(db_path, default=None):
    """Load database from JSON file"""
    if default is None:
        default = []
    if not os.path.exists(db_path):
        return default
    try:
        with open(db_path, 'r') as f:
            return json.load(f)
    except:
        return default

def save_db(db_path, data):
    """Save database to JSON file"""
    with open(db_path, 'w') as f:
        json.dump(data, f, indent=2)

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token():
    """Generate secure random token"""
    return secrets.token_urlsafe(32)

# Initialize default data
def initialize_database():
    """Initialize database with default data"""
    
    # Initialize settings with all features enabled by default
    if not os.path.exists(SETTINGS_DB):
        default_settings = {
            "features": {
                "patient_management": True,
                "appointment_scheduling": True,
                "billing": True,
                "insurance": True,
                "pharmacy": True,
                "prescriptions": True,
                "reporting": True,
                "whatsapp_notifications": True,
                "medical_history": True
            },
            "whatsapp": {
                "api_key": "",
                "phone_number": "",
                "enabled": False
            },
            "system": {
                "hospital_name": "General Hospital",
                "timezone": "UTC",
                "currency": "USD"
            }
        }
        save_db(SETTINGS_DB, default_settings)
    
    # Initialize users with default admin
    if not os.path.exists(USERS_DB):
        default_admin = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "password": hash_password("admin123"),
            "email": "admin@hospital.com",
            "role": "admin",
            "full_name": "System Administrator",
            "phone": "",
            "created_at": datetime.now().isoformat(),
            "active": True
        }
        save_db(USERS_DB, [default_admin])
    
    # Initialize other databases
    for db_path in [PATIENTS_DB, APPOINTMENTS_DB, BILLING_DB, PHARMACY_DB, 
                    PRESCRIPTIONS_DB, SESSIONS_DB, NOTIFICATIONS_DB]:
        if not os.path.exists(db_path):
            save_db(db_path, [])

class HospitalAPIHandler(BaseHTTPRequestHandler):
    """HTTP Request Handler for Hospital Management System"""
    
    def _set_headers(self, status=200, content_type='application/json'):
        """Set response headers"""
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self._set_headers()
    
    def _send_json(self, data, status=200):
        """Send JSON response"""
        self._set_headers(status)
        self.wfile.write(json.dumps(data).encode())
    
    def _get_body(self):
        """Get request body"""
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        return json.loads(body.decode()) if body else {}
    
    def _get_auth_token(self):
        """Extract auth token from Authorization header"""
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header[7:]
        return None
    
    def _verify_token(self, token):
        """Verify authentication token"""
        if not token:
            return None
        sessions = load_db(SESSIONS_DB, [])
        for session in sessions:
            if session.get('token') == token:
                # Check if session is still valid (24 hours)
                created_at = datetime.fromisoformat(session.get('created_at'))
                if datetime.now() - created_at < timedelta(hours=24):
                    return session.get('user_id')
        return None
    
    def _get_current_user(self):
        """Get current authenticated user"""
        token = self._get_auth_token()
        user_id = self._verify_token(token)
        if not user_id:
            return None
        users = load_db(USERS_DB, [])
        for user in users:
            if user.get('id') == user_id:
                return user
        return None
    
    def _check_permission(self, required_roles):
        """Check if current user has required role"""
        user = self._get_current_user()
        if not user:
            return False
        return user.get('role') in required_roles
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Public endpoints
        if path == '/api/health':
            self._send_json({"status": "healthy"})
            return
        
        # Authentication required endpoints
        user = self._get_current_user()
        if not user:
            self._send_json({"error": "Unauthorized"}, 401)
            return
        
        # User info
        if path == '/api/auth/me':
            user_copy = user.copy()
            user_copy.pop('password', None)
            self._send_json(user_copy)
            return
        
        # Patients
        if path == '/api/patients':
            if self._check_permission(['admin', 'doctor', 'nurse', 'receptionist']):
                patients = load_db(PATIENTS_DB, [])
                self._send_json(patients)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        if path.startswith('/api/patients/'):
            patient_id = path.split('/')[-1]
            if self._check_permission(['admin', 'doctor', 'nurse', 'receptionist']):
                patients = load_db(PATIENTS_DB, [])
                patient = next((p for p in patients if p.get('id') == patient_id), None)
                if patient:
                    self._send_json(patient)
                else:
                    self._send_json({"error": "Patient not found"}, 404)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Appointments
        if path == '/api/appointments':
            if self._check_permission(['admin', 'doctor', 'nurse', 'receptionist']):
                appointments = load_db(APPOINTMENTS_DB, [])
                self._send_json(appointments)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Billing
        if path == '/api/billing':
            if self._check_permission(['admin', 'receptionist']):
                billing = load_db(BILLING_DB, [])
                self._send_json(billing)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Pharmacy
        if path == '/api/pharmacy':
            if self._check_permission(['admin', 'doctor', 'nurse']):
                pharmacy = load_db(PHARMACY_DB, [])
                self._send_json(pharmacy)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Prescriptions
        if path == '/api/prescriptions':
            if self._check_permission(['admin', 'doctor', 'nurse']):
                prescriptions = load_db(PRESCRIPTIONS_DB, [])
                self._send_json(prescriptions)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Settings (Admin only)
        if path == '/api/settings':
            if self._check_permission(['admin']):
                settings = load_db(SETTINGS_DB, {})
                self._send_json(settings)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Users (Admin only)
        if path == '/api/users':
            if self._check_permission(['admin']):
                users = load_db(USERS_DB, [])
                # Remove passwords from response
                users_safe = []
                for u in users:
                    u_copy = u.copy()
                    u_copy.pop('password', None)
                    users_safe.append(u_copy)
                self._send_json(users_safe)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Reports
        if path == '/api/reports/dashboard':
            if self._check_permission(['admin', 'doctor']):
                patients = load_db(PATIENTS_DB, [])
                appointments = load_db(APPOINTMENTS_DB, [])
                billing = load_db(BILLING_DB, [])
                
                report = {
                    "total_patients": len(patients),
                    "total_appointments": len(appointments),
                    "today_appointments": len([a for a in appointments if a.get('date') == datetime.now().strftime('%Y-%m-%d')]),
                    "total_revenue": sum([b.get('amount', 0) for b in billing]),
                    "pending_bills": len([b for b in billing if b.get('status') == 'pending'])
                }
                self._send_json(report)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        self._send_json({"error": "Not found"}, 404)
    
    def do_POST(self):
        """Handle POST requests"""
        path = self.path
        body = self._get_body()
        
        # Login (public)
        if path == '/api/auth/login':
            username = body.get('username')
            password = body.get('password')
            
            users = load_db(USERS_DB, [])
            user = next((u for u in users if u.get('username') == username), None)
            
            if user and user.get('password') == hash_password(password):
                if not user.get('active', True):
                    self._send_json({"error": "Account disabled"}, 403)
                    return
                
                # Create session
                token = generate_token()
                sessions = load_db(SESSIONS_DB, [])
                session = {
                    "token": token,
                    "user_id": user.get('id'),
                    "created_at": datetime.now().isoformat()
                }
                sessions.append(session)
                save_db(SESSIONS_DB, sessions)
                
                user_copy = user.copy()
                user_copy.pop('password', None)
                
                self._send_json({
                    "token": token,
                    "user": user_copy
                })
            else:
                self._send_json({"error": "Invalid credentials"}, 401)
            return
        
        # All other endpoints require authentication
        user = self._get_current_user()
        if not user:
            self._send_json({"error": "Unauthorized"}, 401)
            return
        
        # Logout
        if path == '/api/auth/logout':
            token = self._get_auth_token()
            sessions = load_db(SESSIONS_DB, [])
            sessions = [s for s in sessions if s.get('token') != token]
            save_db(SESSIONS_DB, sessions)
            self._send_json({"message": "Logged out successfully"})
            return
        
        # Create patient
        if path == '/api/patients':
            if self._check_permission(['admin', 'receptionist']):
                patients = load_db(PATIENTS_DB, [])
                patient = {
                    "id": str(uuid.uuid4()),
                    "created_at": datetime.now().isoformat(),
                    "created_by": user.get('id'),
                    **body
                }
                patients.append(patient)
                save_db(PATIENTS_DB, patients)
                self._send_json(patient, 201)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Create appointment
        if path == '/api/appointments':
            if self._check_permission(['admin', 'receptionist', 'doctor']):
                appointments = load_db(APPOINTMENTS_DB, [])
                appointment = {
                    "id": str(uuid.uuid4()),
                    "created_at": datetime.now().isoformat(),
                    "created_by": user.get('id'),
                    "status": "scheduled",
                    **body
                }
                appointments.append(appointment)
                save_db(APPOINTMENTS_DB, appointments)
                
                # Send WhatsApp notification if enabled
                self._send_whatsapp_notification(appointment, 'appointment_scheduled')
                
                self._send_json(appointment, 201)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Create billing
        if path == '/api/billing':
            if self._check_permission(['admin', 'receptionist']):
                billing = load_db(BILLING_DB, [])
                bill = {
                    "id": str(uuid.uuid4()),
                    "created_at": datetime.now().isoformat(),
                    "created_by": user.get('id'),
                    "status": "pending",
                    **body
                }
                billing.append(bill)
                save_db(BILLING_DB, billing)
                self._send_json(bill, 201)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Create pharmacy item
        if path == '/api/pharmacy':
            if self._check_permission(['admin']):
                pharmacy = load_db(PHARMACY_DB, [])
                item = {
                    "id": str(uuid.uuid4()),
                    "created_at": datetime.now().isoformat(),
                    **body
                }
                pharmacy.append(item)
                save_db(PHARMACY_DB, pharmacy)
                self._send_json(item, 201)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Create prescription
        if path == '/api/prescriptions':
            if self._check_permission(['admin', 'doctor']):
                prescriptions = load_db(PRESCRIPTIONS_DB, [])
                prescription = {
                    "id": str(uuid.uuid4()),
                    "created_at": datetime.now().isoformat(),
                    "doctor_id": user.get('id'),
                    **body
                }
                prescriptions.append(prescription)
                save_db(PRESCRIPTIONS_DB, prescriptions)
                self._send_json(prescription, 201)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Create user (Admin only)
        if path == '/api/users':
            if self._check_permission(['admin']):
                users = load_db(USERS_DB, [])
                new_user = {
                    "id": str(uuid.uuid4()),
                    "created_at": datetime.now().isoformat(),
                    "password": hash_password(body.get('password', 'password123')),
                    "active": True,
                    **{k: v for k, v in body.items() if k != 'password'}
                }
                users.append(new_user)
                save_db(USERS_DB, users)
                
                new_user_copy = new_user.copy()
                new_user_copy.pop('password', None)
                self._send_json(new_user_copy, 201)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        self._send_json({"error": "Not found"}, 404)
    
    def do_PUT(self):
        """Handle PUT requests"""
        path = self.path
        body = self._get_body()
        
        user = self._get_current_user()
        if not user:
            self._send_json({"error": "Unauthorized"}, 401)
            return
        
        # Update settings (Admin only)
        if path == '/api/settings':
            if self._check_permission(['admin']):
                settings = load_db(SETTINGS_DB, {})
                settings.update(body)
                save_db(SETTINGS_DB, settings)
                self._send_json(settings)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Update patient
        if path.startswith('/api/patients/'):
            patient_id = path.split('/')[-1]
            if self._check_permission(['admin', 'doctor', 'nurse', 'receptionist']):
                patients = load_db(PATIENTS_DB, [])
                for i, p in enumerate(patients):
                    if p.get('id') == patient_id:
                        patients[i].update(body)
                        patients[i]['updated_at'] = datetime.now().isoformat()
                        save_db(PATIENTS_DB, patients)
                        self._send_json(patients[i])
                        return
                self._send_json({"error": "Patient not found"}, 404)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Update appointment
        if path.startswith('/api/appointments/'):
            appointment_id = path.split('/')[-1]
            if self._check_permission(['admin', 'doctor', 'receptionist']):
                appointments = load_db(APPOINTMENTS_DB, [])
                for i, a in enumerate(appointments):
                    if a.get('id') == appointment_id:
                        appointments[i].update(body)
                        appointments[i]['updated_at'] = datetime.now().isoformat()
                        save_db(APPOINTMENTS_DB, appointments)
                        self._send_json(appointments[i])
                        return
                self._send_json({"error": "Appointment not found"}, 404)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Update billing
        if path.startswith('/api/billing/'):
            bill_id = path.split('/')[-1]
            if self._check_permission(['admin', 'receptionist']):
                billing = load_db(BILLING_DB, [])
                for i, b in enumerate(billing):
                    if b.get('id') == bill_id:
                        billing[i].update(body)
                        billing[i]['updated_at'] = datetime.now().isoformat()
                        save_db(BILLING_DB, billing)
                        self._send_json(billing[i])
                        return
                self._send_json({"error": "Bill not found"}, 404)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Update pharmacy item
        if path.startswith('/api/pharmacy/'):
            item_id = path.split('/')[-1]
            if self._check_permission(['admin']):
                pharmacy = load_db(PHARMACY_DB, [])
                for i, item in enumerate(pharmacy):
                    if item.get('id') == item_id:
                        pharmacy[i].update(body)
                        pharmacy[i]['updated_at'] = datetime.now().isoformat()
                        save_db(PHARMACY_DB, pharmacy)
                        self._send_json(pharmacy[i])
                        return
                self._send_json({"error": "Item not found"}, 404)
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        self._send_json({"error": "Not found"}, 404)
    
    def do_DELETE(self):
        """Handle DELETE requests"""
        path = self.path
        
        user = self._get_current_user()
        if not user:
            self._send_json({"error": "Unauthorized"}, 401)
            return
        
        # Delete patient
        if path.startswith('/api/patients/'):
            patient_id = path.split('/')[-1]
            if self._check_permission(['admin']):
                patients = load_db(PATIENTS_DB, [])
                patients = [p for p in patients if p.get('id') != patient_id]
                save_db(PATIENTS_DB, patients)
                self._send_json({"message": "Patient deleted"})
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        # Delete appointment
        if path.startswith('/api/appointments/'):
            appointment_id = path.split('/')[-1]
            if self._check_permission(['admin', 'receptionist']):
                appointments = load_db(APPOINTMENTS_DB, [])
                appointments = [a for a in appointments if a.get('id') != appointment_id]
                save_db(APPOINTMENTS_DB, appointments)
                self._send_json({"message": "Appointment deleted"})
            else:
                self._send_json({"error": "Forbidden"}, 403)
            return
        
        self._send_json({"error": "Not found"}, 404)
    
    def _send_whatsapp_notification(self, data, notification_type):
        """Send WhatsApp notification"""
        settings = load_db(SETTINGS_DB, {})
        whatsapp = settings.get('whatsapp', {})
        
        if not whatsapp.get('enabled'):
            return
        
        # Store notification for processing
        notifications = load_db(NOTIFICATIONS_DB, [])
        notification = {
            "id": str(uuid.uuid4()),
            "type": notification_type,
            "data": data,
            "created_at": datetime.now().isoformat(),
            "status": "pending"
        }
        notifications.append(notification)
        save_db(NOTIFICATIONS_DB, notifications)

def run_server(port=8000):
    """Run the HTTP server"""
    initialize_database()
    server_address = ('', port)
    httpd = HTTPServer(server_address, HospitalAPIHandler)
    print(f'Hospital Management System Server running on port {port}...')
    print(f'Default login: username=admin, password=admin123')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
