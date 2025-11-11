# Hospital Management System - API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication

All endpoints (except login and health check) require authentication via Bearer token.

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Authentication Endpoints

### Health Check
Check if the API is running.

**Endpoint:** `GET /api/health`  
**Authentication:** Not required

**Response:**
```json
{
  "status": "healthy"
}
```

---

### Login
Authenticate user and receive token.

**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "token": "secure_token_here",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@hospital.com",
    "role": "admin",
    "full_name": "System Administrator",
    "phone": "",
    "created_at": "2025-11-11T00:00:00.000000",
    "active": true
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Logout
End current session.

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User
Retrieve authenticated user information.

**Endpoint:** `GET /api/auth/me`  
**Authentication:** Required

**Success Response (200):**
```json
{
  "id": "uuid",
  "username": "admin",
  "email": "admin@hospital.com",
  "role": "admin",
  "full_name": "System Administrator",
  "phone": "",
  "created_at": "2025-11-11T00:00:00.000000",
  "active": true
}
```

---

## Patient Endpoints

### Get All Patients
Retrieve list of all patients.

**Endpoint:** `GET /api/patients`  
**Authentication:** Required  
**Permissions:** admin, doctor, nurse, receptionist

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "full_name": "John Doe",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "phone": "+1234567890",
    "email": "john@example.com",
    "address": "123 Main St",
    "blood_group": "O+",
    "emergency_contact": "+0987654321",
    "medical_history": "No known allergies",
    "created_at": "2025-11-11T00:00:00.000000",
    "created_by": "admin_uuid"
  }
]
```

---

### Get Single Patient
Retrieve specific patient by ID.

**Endpoint:** `GET /api/patients/{id}`  
**Authentication:** Required  
**Permissions:** admin, doctor, nurse, receptionist

**Success Response (200):**
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "blood_group": "O+",
  "emergency_contact": "+0987654321",
  "medical_history": "No known allergies",
  "created_at": "2025-11-11T00:00:00.000000",
  "created_by": "admin_uuid"
}
```

**Error Response (404):**
```json
{
  "error": "Patient not found"
}
```

---

### Create Patient
Register a new patient.

**Endpoint:** `POST /api/patients`  
**Authentication:** Required  
**Permissions:** admin, receptionist

**Request Body:**
```json
{
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "blood_group": "O+",
  "emergency_contact": "+0987654321",
  "medical_history": "No known allergies"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "blood_group": "O+",
  "emergency_contact": "+0987654321",
  "medical_history": "No known allergies",
  "created_at": "2025-11-11T00:00:00.000000",
  "created_by": "admin_uuid"
}
```

---

### Update Patient
Update patient information.

**Endpoint:** `PUT /api/patients/{id}`  
**Authentication:** Required  
**Permissions:** admin, doctor, nurse, receptionist

**Request Body:**
```json
{
  "phone": "+1111111111",
  "email": "newemail@example.com",
  "address": "456 New St"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "phone": "+1111111111",
  "email": "newemail@example.com",
  "address": "456 New St",
  "blood_group": "O+",
  "emergency_contact": "+0987654321",
  "medical_history": "No known allergies",
  "created_at": "2025-11-11T00:00:00.000000",
  "updated_at": "2025-11-11T01:00:00.000000",
  "created_by": "admin_uuid"
}
```

---

### Delete Patient
Delete a patient record.

**Endpoint:** `DELETE /api/patients/{id}`  
**Authentication:** Required  
**Permissions:** admin

**Success Response (200):**
```json
{
  "message": "Patient deleted"
}
```

---

## Appointment Endpoints

### Get All Appointments
Retrieve all appointments.

**Endpoint:** `GET /api/appointments`  
**Authentication:** Required  
**Permissions:** admin, doctor, nurse, receptionist

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "patient_id": "patient_uuid",
    "date": "2025-11-15",
    "time": "10:00",
    "doctor_name": "Dr. Smith",
    "department": "Cardiology",
    "reason": "Chest pain",
    "notes": "First visit",
    "status": "scheduled",
    "created_at": "2025-11-11T00:00:00.000000",
    "created_by": "admin_uuid"
  }
]
```

---

### Create Appointment
Schedule a new appointment.

**Endpoint:** `POST /api/appointments`  
**Authentication:** Required  
**Permissions:** admin, receptionist, doctor

**Request Body:**
```json
{
  "patient_id": "patient_uuid",
  "date": "2025-11-15",
  "time": "10:00",
  "doctor_name": "Dr. Smith",
  "department": "Cardiology",
  "reason": "Chest pain",
  "notes": "First visit"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "patient_id": "patient_uuid",
  "date": "2025-11-15",
  "time": "10:00",
  "doctor_name": "Dr. Smith",
  "department": "Cardiology",
  "reason": "Chest pain",
  "notes": "First visit",
  "status": "scheduled",
  "created_at": "2025-11-11T00:00:00.000000",
  "created_by": "admin_uuid"
}
```

**Note:** Creates WhatsApp notification automatically if enabled.

---

### Update Appointment
Update appointment details.

**Endpoint:** `PUT /api/appointments/{id}`  
**Authentication:** Required  
**Permissions:** admin, doctor, receptionist

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Patient seen, follow-up needed"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "patient_id": "patient_uuid",
  "date": "2025-11-15",
  "time": "10:00",
  "doctor_name": "Dr. Smith",
  "department": "Cardiology",
  "reason": "Chest pain",
  "notes": "Patient seen, follow-up needed",
  "status": "completed",
  "created_at": "2025-11-11T00:00:00.000000",
  "updated_at": "2025-11-15T10:30:00.000000",
  "created_by": "admin_uuid"
}
```

---

### Delete Appointment
Cancel/delete an appointment.

**Endpoint:** `DELETE /api/appointments/{id}`  
**Authentication:** Required  
**Permissions:** admin, receptionist

**Success Response (200):**
```json
{
  "message": "Appointment deleted"
}
```

---

## Billing Endpoints

### Get All Bills
Retrieve all billing records.

**Endpoint:** `GET /api/billing`  
**Authentication:** Required  
**Permissions:** admin, receptionist

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "patient_id": "patient_uuid",
    "description": "Consultation",
    "amount": 150.00,
    "insurance_provider": "Blue Cross",
    "insurance_claim_number": "BC123456",
    "payment_method": "insurance",
    "notes": "",
    "status": "pending",
    "created_at": "2025-11-11T00:00:00.000000",
    "created_by": "admin_uuid"
  }
]
```

---

### Create Bill
Create a new billing record.

**Endpoint:** `POST /api/billing`  
**Authentication:** Required  
**Permissions:** admin, receptionist

**Request Body:**
```json
{
  "patient_id": "patient_uuid",
  "description": "Consultation",
  "amount": 150.00,
  "insurance_provider": "Blue Cross",
  "insurance_claim_number": "BC123456",
  "payment_method": "insurance",
  "notes": ""
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "patient_id": "patient_uuid",
  "description": "Consultation",
  "amount": 150.00,
  "insurance_provider": "Blue Cross",
  "insurance_claim_number": "BC123456",
  "payment_method": "insurance",
  "notes": "",
  "status": "pending",
  "created_at": "2025-11-11T00:00:00.000000",
  "created_by": "admin_uuid"
}
```

---

### Update Bill
Update billing information.

**Endpoint:** `PUT /api/billing/{id}`  
**Authentication:** Required  
**Permissions:** admin, receptionist

**Request Body:**
```json
{
  "status": "paid"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "patient_id": "patient_uuid",
  "description": "Consultation",
  "amount": 150.00,
  "insurance_provider": "Blue Cross",
  "insurance_claim_number": "BC123456",
  "payment_method": "insurance",
  "notes": "",
  "status": "paid",
  "created_at": "2025-11-11T00:00:00.000000",
  "updated_at": "2025-11-11T02:00:00.000000",
  "created_by": "admin_uuid"
}
```

---

## Pharmacy Endpoints

### Get All Medicines
Retrieve pharmacy inventory.

**Endpoint:** `GET /api/pharmacy`  
**Authentication:** Required  
**Permissions:** admin, doctor, nurse

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Amoxicillin",
    "generic_name": "Amoxicillin Trihydrate",
    "category": "Antibiotics",
    "stock_quantity": 100,
    "unit_price": 12.50,
    "manufacturer": "PharmaCo",
    "expiry_date": "2026-12-31",
    "description": "Broad-spectrum antibiotic",
    "created_at": "2025-11-11T00:00:00.000000"
  }
]
```

---

### Create Medicine
Add new medicine to inventory.

**Endpoint:** `POST /api/pharmacy`  
**Authentication:** Required  
**Permissions:** admin

**Request Body:**
```json
{
  "name": "Amoxicillin",
  "generic_name": "Amoxicillin Trihydrate",
  "category": "Antibiotics",
  "stock_quantity": 100,
  "unit_price": 12.50,
  "manufacturer": "PharmaCo",
  "expiry_date": "2026-12-31",
  "description": "Broad-spectrum antibiotic"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "name": "Amoxicillin",
  "generic_name": "Amoxicillin Trihydrate",
  "category": "Antibiotics",
  "stock_quantity": 100,
  "unit_price": 12.50,
  "manufacturer": "PharmaCo",
  "expiry_date": "2026-12-31",
  "description": "Broad-spectrum antibiotic",
  "created_at": "2025-11-11T00:00:00.000000"
}
```

---

### Update Medicine
Update medicine information.

**Endpoint:** `PUT /api/pharmacy/{id}`  
**Authentication:** Required  
**Permissions:** admin

**Request Body:**
```json
{
  "stock_quantity": 150,
  "unit_price": 13.00
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "name": "Amoxicillin",
  "generic_name": "Amoxicillin Trihydrate",
  "category": "Antibiotics",
  "stock_quantity": 150,
  "unit_price": 13.00,
  "manufacturer": "PharmaCo",
  "expiry_date": "2026-12-31",
  "description": "Broad-spectrum antibiotic",
  "created_at": "2025-11-11T00:00:00.000000",
  "updated_at": "2025-11-11T03:00:00.000000"
}
```

---

## Prescription Endpoints

### Get All Prescriptions
Retrieve all prescriptions.

**Endpoint:** `GET /api/prescriptions`  
**Authentication:** Required  
**Permissions:** admin, doctor, nurse

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "patient_id": "patient_uuid",
    "doctor_id": "doctor_uuid",
    "diagnosis": "Bacterial infection",
    "medicines": [
      {
        "medicine_id": "medicine_uuid",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "duration": "7 days"
      }
    ],
    "notes": "Complete full course",
    "created_at": "2025-11-11T00:00:00.000000"
  }
]
```

---

### Create Prescription
Create a new prescription.

**Endpoint:** `POST /api/prescriptions`  
**Authentication:** Required  
**Permissions:** admin, doctor

**Request Body:**
```json
{
  "patient_id": "patient_uuid",
  "diagnosis": "Bacterial infection",
  "medicines": [
    {
      "medicine_id": "medicine_uuid",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days"
    }
  ],
  "notes": "Complete full course"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "patient_id": "patient_uuid",
  "doctor_id": "doctor_uuid",
  "diagnosis": "Bacterial infection",
  "medicines": [
    {
      "medicine_id": "medicine_uuid",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days"
    }
  ],
  "notes": "Complete full course",
  "created_at": "2025-11-11T00:00:00.000000"
}
```

---

## Settings Endpoints

### Get Settings
Retrieve system settings.

**Endpoint:** `GET /api/settings`  
**Authentication:** Required  
**Permissions:** admin

**Success Response (200):**
```json
{
  "features": {
    "patient_management": true,
    "appointment_scheduling": true,
    "billing": true,
    "insurance": true,
    "pharmacy": true,
    "prescriptions": true,
    "reporting": true,
    "whatsapp_notifications": true,
    "medical_history": true
  },
  "whatsapp": {
    "api_key": "",
    "phone_number": "",
    "enabled": false
  },
  "system": {
    "hospital_name": "General Hospital",
    "timezone": "UTC",
    "currency": "USD"
  }
}
```

---

### Update Settings
Update system configuration.

**Endpoint:** `PUT /api/settings`  
**Authentication:** Required  
**Permissions:** admin

**Request Body:**
```json
{
  "features": {
    "patient_management": true,
    "whatsapp_notifications": false
  },
  "system": {
    "hospital_name": "City Hospital",
    "timezone": "America/New_York"
  },
  "whatsapp": {
    "enabled": true,
    "api_key": "your_api_key",
    "phone_number": "+1234567890"
  }
}
```

**Success Response (200):**
```json
{
  "features": {
    "patient_management": true,
    "appointment_scheduling": true,
    "billing": true,
    "insurance": true,
    "pharmacy": true,
    "prescriptions": true,
    "reporting": true,
    "whatsapp_notifications": false,
    "medical_history": true
  },
  "whatsapp": {
    "api_key": "your_api_key",
    "phone_number": "+1234567890",
    "enabled": true
  },
  "system": {
    "hospital_name": "City Hospital",
    "timezone": "America/New_York",
    "currency": "USD"
  }
}
```

---

## User Management Endpoints

### Get All Users
Retrieve all users (Admin only).

**Endpoint:** `GET /api/users`  
**Authentication:** Required  
**Permissions:** admin

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "username": "admin",
    "email": "admin@hospital.com",
    "role": "admin",
    "full_name": "System Administrator",
    "phone": "",
    "created_at": "2025-11-11T00:00:00.000000",
    "active": true
  }
]
```

**Note:** Passwords are never included in responses.

---

### Create User
Create a new user account.

**Endpoint:** `POST /api/users`  
**Authentication:** Required  
**Permissions:** admin

**Request Body:**
```json
{
  "username": "doctor1",
  "password": "secure_password",
  "email": "doctor1@hospital.com",
  "full_name": "Dr. Jane Smith",
  "phone": "+1234567890",
  "role": "doctor"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "username": "doctor1",
  "email": "doctor1@hospital.com",
  "role": "doctor",
  "full_name": "Dr. Jane Smith",
  "phone": "+1234567890",
  "created_at": "2025-11-11T00:00:00.000000",
  "active": true
}
```

---

## Reports Endpoints

### Get Dashboard Report
Retrieve dashboard statistics.

**Endpoint:** `GET /api/reports/dashboard`  
**Authentication:** Required  
**Permissions:** admin, doctor

**Success Response (200):**
```json
{
  "total_patients": 150,
  "total_appointments": 300,
  "today_appointments": 12,
  "total_revenue": 45000,
  "pending_bills": 5
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Not found"
}
```

### 404 Resource Not Found
```json
{
  "error": "Patient not found"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing:
- Rate limiting per IP
- Rate limiting per user
- API quotas

---

## CORS

CORS is enabled for all origins (`*`). For production, restrict to specific origins:

```python
self.send_header('Access-Control-Allow-Origin', 'https://yourdomain.com')
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (localStorage in frontend)
3. **Set appropriate CORS headers**
4. **Implement rate limiting**
5. **Use environment variables** for sensitive data
6. **Regular security audits**
7. **Input validation** on all endpoints
8. **SQL injection prevention** (not applicable with JSON DB)

---

## Testing the API

### Using curl

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Patients (with token):**
```bash
curl -X GET http://localhost:8000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Frontend (Recommended)
The Next.js frontend provides a complete UI for testing all API endpoints.

---

**API Version:** 1.0  
**Last Updated:** 2025-11-11
