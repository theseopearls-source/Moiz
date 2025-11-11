'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reportData, patientsData, appointmentsData, billingData] = await Promise.all([
        api.getDashboardReport(),
        api.getPatients(),
        api.getAppointments(),
        api.getBilling()
      ]);
      setReport(reportData);
      setPatients(patientsData);
      setAppointments(appointmentsData);
      setBilling(billingData);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div><p>Loading reports...</p></div>;
  }

  // Calculate additional statistics
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  const paidBills = billing.filter(b => b.status === 'paid').length;
  const pendingBills = billing.filter(b => b.status === 'pending').length;
  const totalRevenue = billing.reduce((sum, b) => sum + (b.amount || 0), 0);
  const paidRevenue = billing.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
  const pendingRevenue = billing.filter(b => b.status === 'pending').reduce((sum, b) => sum + (b.amount || 0), 0);

  // Department statistics
  const departmentStats = appointments.reduce((acc: any, app) => {
    const dept = app.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Recent patients by month
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const newPatientsThisMonth = patients.filter(p => {
    const createdDate = new Date(p.created_at);
    return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
  }).length;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '28px', fontWeight: '700', color: '#2d3748' }}>
        Analytics & Reports
      </h1>

      {/* Overview Stats */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Overview Statistics</h2>
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
              <div className="stat-label">New This Month</div>
              <div className="stat-value">{newPatientsThisMonth}</div>
            </div>
            <div className="stat-icon green">📈</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Total Appointments</div>
              <div className="stat-value">{report?.total_appointments || 0}</div>
            </div>
            <div className="stat-icon orange">📅</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Today's Appointments</div>
              <div className="stat-value">{report?.today_appointments || 0}</div>
            </div>
            <div className="stat-icon purple">⏰</div>
          </div>
        </div>
      </div>

      {/* Appointment Statistics */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Appointment Statistics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', background: '#f7fafc', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#667eea', marginBottom: '0.5rem' }}>
              {appointments.length}
            </div>
            <div style={{ color: '#718096' }}>Total Appointments</div>
          </div>
          <div style={{ padding: '1.5rem', background: '#f7fafc', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#48bb78', marginBottom: '0.5rem' }}>
              {completedAppointments}
            </div>
            <div style={{ color: '#718096' }}>Completed</div>
          </div>
          <div style={{ padding: '1.5rem', background: '#f7fafc', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#f56565', marginBottom: '0.5rem' }}>
              {cancelledAppointments}
            </div>
            <div style={{ color: '#718096' }}>Cancelled</div>
          </div>
        </div>
      </div>

      {/* Revenue Statistics */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Revenue Statistics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '0.5rem' }}>
              ${totalRevenue.toLocaleString()}
            </div>
            <div style={{ opacity: 0.9 }}>Total Revenue</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '0.5rem' }}>
              ${paidRevenue.toLocaleString()}
            </div>
            <div style={{ opacity: 0.9 }}>Collected ({paidBills} bills)</div>
          </div>
          <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '0.5rem' }}>
              ${pendingRevenue.toLocaleString()}
            </div>
            <div style={{ opacity: 0.9 }}>Pending ({pendingBills} bills)</div>
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Appointments by Department</h2>
        {Object.keys(departmentStats).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            No appointment data available
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(departmentStats).sort((a: any, b: any) => b[1] - a[1]).map(([dept, count]: any) => {
              const percentage = ((count / appointments.length) * 100).toFixed(1);
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{dept}</strong>
                    <span style={{ color: '#718096' }}>{count} appointments ({percentage}%)</span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1rem' }}>Export Reports</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary">📊 Export Patient Report</button>
          <button className="btn btn-secondary">📅 Export Appointment Report</button>
          <button className="btn btn-secondary">💰 Export Financial Report</button>
          <button className="btn btn-secondary">📈 Export Analytics Summary</button>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#718096' }}>
          Note: Export functionality requires additional backend implementation
        </p>
      </div>
    </div>
  );
}
