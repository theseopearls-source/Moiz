'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function PharmacyPage() {
  const [pharmacy, setPharmacy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    stock_quantity: '',
    unit_price: '',
    manufacturer: '',
    expiry_date: '',
    description: ''
  });

  useEffect(() => {
    loadPharmacy();
  }, []);

  const loadPharmacy = async () => {
    try {
      const data = await api.getPharmacy();
      setPharmacy(data);
    } catch (error) {
      console.error('Failed to load pharmacy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        stock_quantity: parseInt(formData.stock_quantity),
        unit_price: parseFloat(formData.unit_price)
      };
      
      if (editingItem) {
        await api.updatePharmacyItem(editingItem.id, dataToSend);
      } else {
        await api.createPharmacyItem(dataToSend);
      }
      
      setShowModal(false);
      setFormData({
        name: '',
        generic_name: '',
        category: '',
        stock_quantity: '',
        unit_price: '',
        manufacturer: '',
        expiry_date: '',
        description: ''
      });
      setEditingItem(null);
      loadPharmacy();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      generic_name: item.generic_name || '',
      category: item.category || '',
      stock_quantity: item.stock_quantity?.toString() || '',
      unit_price: item.unit_price?.toString() || '',
      manufacturer: item.manufacturer || '',
      expiry_date: item.expiry_date || '',
      description: item.description || ''
    });
    setShowModal(true);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { badge: 'badge-danger', text: 'Out of Stock' };
    if (quantity < 20) return { badge: 'badge-warning', text: 'Low Stock' };
    return { badge: 'badge-success', text: 'In Stock' };
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div><p>Loading pharmacy...</p></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748' }}>Pharmacy Management</h1>
        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
          + Add Medicine
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Generic Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pharmacy.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                    No medicines in inventory.
                  </td>
                </tr>
              ) : (
                pharmacy.map((item) => {
                  const stockStatus = getStockStatus(item.stock_quantity);
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.generic_name}</td>
                      <td>{item.category}</td>
                      <td>{item.stock_quantity}</td>
                      <td>${item.unit_price?.toFixed(2)}</td>
                      <td>{item.expiry_date}</td>
                      <td>
                        <span className={`badge ${stockStatus.badge}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-small" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingItem ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Medicine Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Generic Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.generic_name}
                    onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Painkillers">Painkillers</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Antiseptics">Antiseptics</option>
                    <option value="Antiviral">Antiviral</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Manufacturer</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Usage instructions, side effects, etc."
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
