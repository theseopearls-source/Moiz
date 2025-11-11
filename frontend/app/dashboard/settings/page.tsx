'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureName: string) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [featureName]: !settings.features[featureName]
      }
    });
  };

  const handleSystemUpdate = (field: string, value: string) => {
    setSettings({
      ...settings,
      system: {
        ...settings.system,
        [field]: value
      }
    });
  };

  const handleWhatsAppUpdate = (field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      whatsapp: {
        ...settings.whatsapp,
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.updateSettings(settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div><p>Loading settings...</p></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748' }}>System Settings</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          background: message.includes('success') ? '#c6f6d5' : '#fed7d7',
          color: message.includes('success') ? '#22543d' : '#742a2a',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          {message}
        </div>
      )}

      {/* Feature Toggles */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Feature Management</h2>
        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
          Enable or disable system features. Disabled features will not be accessible to any user.
        </p>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {settings?.features && Object.entries(settings.features).map(([key, value]: any) => (
            <div key={key} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '8px',
              border: '2px solid #e2e8f0'
            }}>
              <div>
                <strong style={{ textTransform: 'capitalize', color: '#2d3748' }}>
                  {key.replace(/_/g, ' ')}
                </strong>
                <div style={{ fontSize: '14px', color: '#718096', marginTop: '0.25rem' }}>
                  {getFeatureDescription(key)}
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleFeatureToggle(key)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: value ? '#48bb78' : '#cbd5e0',
                  transition: '.4s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '26px',
                    width: '26px',
                    left: value ? '30px' : '4px',
                    bottom: '4px',
                    backgroundColor: 'white',
                    transition: '.4s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* System Settings */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>System Configuration</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hospital Name</label>
            <input
              type="text"
              className="form-input"
              value={settings?.system?.hospital_name || ''}
              onChange={(e) => handleSystemUpdate('hospital_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Timezone</label>
            <select
              className="form-input"
              value={settings?.system?.timezone || 'UTC'}
              onChange={(e) => handleSystemUpdate('timezone', e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">EST (America/New_York)</option>
              <option value="America/Chicago">CST (America/Chicago)</option>
              <option value="America/Los_Angeles">PST (America/Los_Angeles)</option>
              <option value="Europe/London">GMT (Europe/London)</option>
              <option value="Asia/Tokyo">JST (Asia/Tokyo)</option>
              <option value="Asia/Dubai">GST (Asia/Dubai)</option>
              <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            className="form-input"
            value={settings?.system?.currency || 'USD'}
            onChange={(e) => handleSystemUpdate('currency', e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="AED">AED - UAE Dirham</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
      </div>

      {/* WhatsApp Integration */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>WhatsApp Notifications</h2>
        <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
          Configure WhatsApp API for automatic notifications and follow-up reminders.
        </p>
        
        <div className="form-group">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div>
              <strong>Enable WhatsApp Notifications</strong>
              <div style={{ fontSize: '14px', color: '#718096', marginTop: '0.25rem' }}>
                Send appointment reminders and follow-ups via WhatsApp
              </div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings?.whatsapp?.enabled || false}
                onChange={(e) => handleWhatsAppUpdate('enabled', e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings?.whatsapp?.enabled ? '#48bb78' : '#cbd5e0',
                transition: '.4s',
                borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '26px',
                  width: '26px',
                  left: settings?.whatsapp?.enabled ? '30px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }} />
              </span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp API Key</label>
          <input
            type="text"
            className="form-input"
            value={settings?.whatsapp?.api_key || ''}
            onChange={(e) => handleWhatsAppUpdate('api_key', e.target.value)}
            placeholder="Enter your WhatsApp Business API key"
          />
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp Phone Number</label>
          <input
            type="tel"
            className="form-input"
            value={settings?.whatsapp?.phone_number || ''}
            onChange={(e) => handleWhatsAppUpdate('phone_number', e.target.value)}
            placeholder="+1234567890"
          />
        </div>

        <div style={{ padding: '1rem', background: '#e6f2ff', borderRadius: '8px', borderLeft: '4px solid #4299e1' }}>
          <strong style={{ color: '#2b6cb0' }}>ℹ️ Setup Instructions:</strong>
          <ol style={{ margin: '0.5rem 0 0 1.25rem', color: '#718096' }}>
            <li>Sign up for WhatsApp Business API (Twilio, MessageBird, or official API)</li>
            <li>Obtain your API key and phone number</li>
            <li>Enter the credentials above</li>
            <li>Enable WhatsApp notifications</li>
            <li>Test the integration by scheduling an appointment</li>
          </ol>
        </div>
      </div>

      {/* Save Button (bottom) */}
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save All Settings'}
        </button>
      </div>
    </div>
  );
}

function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    patient_management: 'Manage patient records, registration, and medical history',
    appointment_scheduling: 'Schedule and manage patient appointments',
    billing: 'Handle billing, invoices, and payments',
    insurance: 'Process insurance claims and coverage',
    pharmacy: 'Manage medication inventory and stock',
    prescriptions: 'Create and manage patient prescriptions',
    reporting: 'Access analytics and generate reports',
    whatsapp_notifications: 'Send automated WhatsApp notifications',
    medical_history: 'Track and maintain patient medical history'
  };
  return descriptions[feature] || 'Feature configuration';
}
