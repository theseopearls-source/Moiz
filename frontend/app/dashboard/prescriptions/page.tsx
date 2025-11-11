'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [pharmacy, setPharmacy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    medicines: [{ medicine_id: '', dosage: '', frequency: '', duration: '' }],
    diagnosis: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prescriptionsData, patientsData, pharmacyData] = await Promise.all([
        api.getPrescriptions(),
        api.getPatients(),
        api.getPharmacy()
      ]);
      setPrescriptions(prescriptionsData);
      setPatients(patientsData);
      setPharmacy(pharmacyData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPrescription(formData);
      setShowModal(false);
      setFormData({
        patient_id: '',
        medicines: [{ medicine_id: '', dosage: '', frequency: '', duration: '' }],
        diagnosis: '',
        notes: ''
      });
      loadData();
    } catch (error) {
      console.error('Failed to create prescription:', error);
      alert('Failed to create prescription');
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { medicine_id: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const removeMedicine = (index: number) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: newMedicines });
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index] = { ...newMedicines[index], [field]: value };
    setFormData({ ...formData, medicines: newMedicines });
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.full_name || 'Unknown';
  };

  const getMedicineName = (medicineId: string) => {
    const medicine = pharmacy.find(m => m.id === medicineId);
    return medicine?.name || 'Unknown';
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div><p>Loading prescriptions...</p></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748' }}>Prescriptions</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create Prescription
        </button>
      </div>

      <div className="card">
        {prescriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📋</div>
            <p>No prescriptions found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {prescriptions.map((prescription) => (
              <div key={prescription.id} style={{
                padding: '1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                background: '#f7fafc'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>Patient:</strong> {getPatientName(prescription.patient_id)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>Date:</strong> {new Date(prescription.created_at).toLocaleDateString()}
                  </div>
                  {prescription.diagnosis && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </div>
                  )}
                </div>
                
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Medicines:</strong>
                  {prescription.medicines?.map((med: any, idx: number) => (
                    <div key={idx} style={{
                      padding: '0.75rem',
                      background: '#f7fafc',
                      borderRadius: '6px',
                      marginBottom: '0.5rem'
                    }}>
                      <div><strong>{getMedicineName(med.medicine_id)}</strong></div>
                      <div style={{ fontSize: '14px', color: '#718096' }}>
                        Dosage: {med.dosage} | Frequency: {med.frequency} | Duration: {med.duration}
                      </div>
                    </div>
                  ))}
                </div>

                {prescription.notes && (
                  <div style={{ marginTop: '1rem', fontSize: '14px', color: '#718096' }}>
                    <strong>Notes:</strong> {prescription.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Prescription</h2>
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
                <label className="form-label">Diagnosis</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Patient diagnosis"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medicines *</label>
                {formData.medicines.map((medicine, index) => (
                  <div key={index} style={{
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <strong>Medicine {index + 1}</strong>
                      {formData.medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e53e3e',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <select
                        className="form-input"
                        value={medicine.medicine_id}
                        onChange={(e) => updateMedicine(index, 'medicine_id', e.target.value)}
                        required
                      >
                        <option value="">Select Medicine</option>
                        {pharmacy.map(item => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>
                      
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Dosage (e.g., 500mg)"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        required
                      />
                      
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Frequency (e.g., Twice daily)"
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                        required
                      />
                      
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Duration (e.g., 7 days)"
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={addMedicine}
                >
                  + Add Another Medicine
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional instructions or precautions"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
