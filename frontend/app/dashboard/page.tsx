'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await api.getDashboardReport();
        setReport(data);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '28px', fontWeight: '700', color: '#2d3748' }}>
        Dashboard Overview
      </h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{report?.total_patients || 0}</div>
          </div>
          <div className="stat-icon blue">👥</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Appointments</div>
            <div className="stat-value">{report?.total_appointments || 0}</div>
          </div>
          <div className="stat-icon green">📅</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Today's Appointments</div>
            <div className="stat-value">{report?.today_appointments || 0}</div>
          </div>
          <div className="stat-icon orange">⏰</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">${report?.total_revenue?.toLocaleString() || 0}</div>
          </div>
          <div className="stat-icon purple">💰</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <a href="/dashboard/patients" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>👥</div>
              <div style={{ fontWeight: '600' }}>Manage Patients</div>
            </div>
          </a>

          <a href="/dashboard/appointments" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📅</div>
              <div style={{ fontWeight: '600' }}>Book Appointment</div>
            </div>
          </a>

          <a href="/dashboard/billing" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontWeight: '600' }}>Billing</div>
            </div>
          </a>

          <a href="/dashboard/pharmacy" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
              color: 'white',
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>💊</div>
              <div style={{ fontWeight: '600' }}>Pharmacy</div>
            </div>
          </a>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">System Information</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
            <span style={{ fontWeight: '600' }}>Pending Bills:</span>
            <span>{report?.pending_bills || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
            <span style={{ fontWeight: '600' }}>System Status:</span>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
