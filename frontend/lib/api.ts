/**
 * API Client for Hospital Management System
 * Uses native fetch API (no Axios as per requirements)
 */

const API_URL = process.env.API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: string;
  body?: any;
  requiresAuth?: boolean;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, requiresAuth = true } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
      requiresAuth: false,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async logout() {
    await this.request('/api/auth/logout', { method: 'POST' });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me');
  }

  // Patients
  async getPatients() {
    return this.request<any[]>('/api/patients');
  }

  async getPatient(id: string) {
    return this.request<any>(`/api/patients/${id}`);
  }

  async createPatient(data: any) {
    return this.request<any>('/api/patients', {
      method: 'POST',
      body: data,
    });
  }

  async updatePatient(id: string, data: any) {
    return this.request<any>(`/api/patients/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deletePatient(id: string) {
    return this.request<any>(`/api/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments
  async getAppointments() {
    return this.request<any[]>('/api/appointments');
  }

  async createAppointment(data: any) {
    return this.request<any>('/api/appointments', {
      method: 'POST',
      body: data,
    });
  }

  async updateAppointment(id: string, data: any) {
    return this.request<any>(`/api/appointments/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteAppointment(id: string) {
    return this.request<any>(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Billing
  async getBilling() {
    return this.request<any[]>('/api/billing');
  }

  async createBilling(data: any) {
    return this.request<any>('/api/billing', {
      method: 'POST',
      body: data,
    });
  }

  async updateBilling(id: string, data: any) {
    return this.request<any>(`/api/billing/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  // Pharmacy
  async getPharmacy() {
    return this.request<any[]>('/api/pharmacy');
  }

  async createPharmacyItem(data: any) {
    return this.request<any>('/api/pharmacy', {
      method: 'POST',
      body: data,
    });
  }

  async updatePharmacyItem(id: string, data: any) {
    return this.request<any>(`/api/pharmacy/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  // Prescriptions
  async getPrescriptions() {
    return this.request<any[]>('/api/prescriptions');
  }

  async createPrescription(data: any) {
    return this.request<any>('/api/prescriptions', {
      method: 'POST',
      body: data,
    });
  }

  // Settings
  async getSettings() {
    return this.request<any>('/api/settings');
  }

  async updateSettings(data: any) {
    return this.request<any>('/api/settings', {
      method: 'PUT',
      body: data,
    });
  }

  // Users
  async getUsers() {
    return this.request<any[]>('/api/users');
  }

  async createUser(data: any) {
    return this.request<any>('/api/users', {
      method: 'POST',
      body: data,
    });
  }

  // Reports
  async getDashboardReport() {
    return this.request<any>('/api/reports/dashboard');
  }
}

export const api = new ApiClient();
