'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function BillingPage() {
  const [billing, setBilling] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    description: '',
    amount: '',
    insurance_provider: '',
    insurance_claim_number: '',
    payment_method: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [billingData, patientsData] = await Promise.all([
        api.getBilling(),
        api.getPatients()
      ]);
      setBilling(billingData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBilling({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setShowModal(false);
      setFormData({
        patient_id: '',
        description: '',
        amount: '',
        insurance_provider: '',
        insurance_claim_number: '',
        payment_method: '',
        notes: ''
      });
      loadData();
    } catch (error) {
      console.error('Failed to create bill:', error);
      alert('Failed to create bill');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.updateBilling(id, { status });
      loadData();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.full_name || 'Unknown';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const totalRevenue = billing.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const paidRevenue = billing.filter(b => b.status === 'paid').reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const pendingRevenue = billing.filter(b => b.status === 'pending').reduce((sum, bill) => sum + (bill.amount || 0), 0);

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div><p>Loading billing...</p></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748' }}>Billing & Insurance</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create Bill
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-icon purple">💰</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Paid</div>
            <div className="stat-value">${paidRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-icon green">✓</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending</div>
            <div className="stat-value">${pendingRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-icon orange">⏳</div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Insurance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billing.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                    No billing records found.
                  </td>
                </tr>
              ) : (
                billing.map((bill) => (
                  <tr key={bill.id}>
                    <td>{getPatientName(bill.patient_id)}</td>
                    <td>{bill.description}</td>
                    <td>${bill.amount?.toLocaleString()}</td>
                    <td>{bill.insurance_provider || 'None'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {bill.status === 'pending' && (
                          <button 
                            className="btn btn-success btn-small" 
                            onClick={() => handleStatusUpdate(bill.id, 'paid')}
                          >
                            Mark Paid
                          </button>
                        )}
                        {bill.status !== 'cancelled' && (
                          <button 
                            className="btn btn-danger btn-small" 
                            onClick={() => handleStatusUpdate(bill.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Bill</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Patient *</label>
                <select
                  className="form-input"
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Consultation, Surgery, Lab Test"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Insurance Provider</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.insurance_provider}
                    onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Claim Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.insurance_claim_number}
                    onChange={(e) => setFormData({ ...formData, insurance_claim_number: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-input"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
