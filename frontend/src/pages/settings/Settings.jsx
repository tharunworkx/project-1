import React, { useState } from 'react';
import { Save, User, Bell, Shield, Globe, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@company.com',
    department: user?.department || 'Finance & Operations',
    currency: 'USD ($)',
    notifyApproval: true,
    notifyThreshold: true,
    weeklyReport: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      email: formData.email,
      department: formData.department,
    });
    setSuccess('Settings and preferences saved successfully.');
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          System & Account Settings
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Manage your personal workspace preferences and security configurations.
        </p>
      </div>

      {success && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            color: '#059669',
            border: '1px solid #a7f3d0',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>User Profile</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        {/* Currency & Localization */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Localization & Currency</h3>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Preferred Reporting Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="form-select"
            >
              <option value="USD ($)">USD - US Dollar ($)</option>
              <option value="EUR (€)">EUR - Euro (€)</option>
              <option value="GBP (£)">GBP - British Pound (£)</option>
              <option value="CAD ($)">CAD - Canadian Dollar ($)</option>
              <option value="JPY (¥)">JPY - Japanese Yen (¥)</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Notification Alerts</h3>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={formData.notifyApproval}
              onChange={(e) => setFormData({ ...formData, notifyApproval: e.target.checked })}
            />
            <span>Email me immediately when an expense claim requires my sign-off</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={formData.notifyThreshold}
              onChange={(e) => setFormData({ ...formData, notifyThreshold: e.target.checked })}
            />
            <span>Alert when departmental budget reaches &gt; 85% capacity threshold</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={formData.weeklyReport}
              onChange={(e) => setFormData({ ...formData, weeklyReport: e.target.checked })}
            />
            <span>Deliver automated weekly executive expenditure summary report</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
