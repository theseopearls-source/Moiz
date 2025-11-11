#!/usr/bin/env python3
"""
WhatsApp Notification Service
Handles sending notifications via WhatsApp API
"""

import json
import os
import time
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError

DB_DIR = 'database'
NOTIFICATIONS_DB = os.path.join(DB_DIR, 'notifications.json')
SETTINGS_DB = os.path.join(DB_DIR, 'settings.json')
PATIENTS_DB = os.path.join(DB_DIR, 'patients.json')

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

def send_whatsapp_message(phone_number, message, api_key):
    """
    Send WhatsApp message using API
    This is a generic implementation that can work with various WhatsApp APIs
    (Twilio, WhatsApp Business API, etc.)
    """
    # Example implementation - adjust based on your WhatsApp API provider
    # This uses a generic REST API pattern
    
    api_url = "https://api.whatsapp.example.com/send"  # Replace with actual API
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    
    data = {
        'phone': phone_number,
        'message': message
    }
    
    try:
        request = Request(
            api_url,
            data=json.dumps(data).encode(),
            headers=headers,
            method='POST'
        )
        
        with urlopen(request, timeout=10) as response:
            result = json.loads(response.read().decode())
            return True, result
    except URLError as e:
        return False, str(e)
    except Exception as e:
        return False, str(e)

def format_appointment_message(appointment, patient):
    """Format appointment notification message"""
    message = f"""
🏥 Hospital Appointment Reminder

Dear {patient.get('full_name', 'Patient')},

This is a reminder about your upcoming appointment:

📅 Date: {appointment.get('date')}
🕐 Time: {appointment.get('time')}
👨‍⚕️ Doctor: {appointment.get('doctor_name', 'TBD')}
📍 Department: {appointment.get('department', 'General')}

Please arrive 15 minutes early.

If you need to reschedule, please contact us.

Thank you!
    """.strip()
    return message

def format_followup_message(patient):
    """Format follow-up notification message"""
    message = f"""
🏥 Follow-up Reminder

Dear {patient.get('full_name', 'Patient')},

This is a reminder to schedule your follow-up appointment.

Please contact us at your earliest convenience to book your next visit.

Thank you for choosing our hospital!
    """.strip()
    return message

def process_notifications():
    """Process pending notifications"""
    settings = load_db(SETTINGS_DB, {})
    whatsapp = settings.get('whatsapp', {})
    
    if not whatsapp.get('enabled'):
        print("WhatsApp notifications are disabled")
        return
    
    api_key = whatsapp.get('api_key')
    if not api_key:
        print("WhatsApp API key not configured")
        return
    
    notifications = load_db(NOTIFICATIONS_DB, [])
    patients = load_db(PATIENTS_DB, [])
    
    for notification in notifications:
        if notification.get('status') != 'pending':
            continue
        
        # Get patient information
        data = notification.get('data', {})
        patient_id = data.get('patient_id')
        
        patient = next((p for p in patients if p.get('id') == patient_id), None)
        if not patient:
            notification['status'] = 'failed'
            notification['error'] = 'Patient not found'
            continue
        
        phone = patient.get('phone')
        if not phone:
            notification['status'] = 'failed'
            notification['error'] = 'No phone number'
            continue
        
        # Format message based on notification type
        notification_type = notification.get('type')
        if notification_type == 'appointment_scheduled':
            message = format_appointment_message(data, patient)
        elif notification_type == 'followup_reminder':
            message = format_followup_message(patient)
        else:
            message = f"Hospital notification: {notification_type}"
        
        # Send message
        success, result = send_whatsapp_message(phone, message, api_key)
        
        if success:
            notification['status'] = 'sent'
            notification['sent_at'] = datetime.now().isoformat()
        else:
            notification['status'] = 'failed'
            notification['error'] = str(result)
        
        print(f"Notification {notification['id']}: {notification['status']}")
    
    save_db(NOTIFICATIONS_DB, notifications)

def run_notification_service(interval=60):
    """Run notification service continuously"""
    print("WhatsApp Notification Service started")
    print(f"Checking for notifications every {interval} seconds")
    
    while True:
        try:
            process_notifications()
        except Exception as e:
            print(f"Error processing notifications: {e}")
        
        time.sleep(interval)

if __name__ == '__main__':
    run_notification_service()
