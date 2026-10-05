import React, { useState } from 'react';
import { Plus, ShieldCheck, AlertCircle, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const defaultPolicies = [
  {
    id: 'POL-01',
    title: 'Mandatory Receipt Requirement',
    description: 'Requires an itemized merchant receipt for any single expense transaction exceeding $25.00.',
    scope: 'All Departments',
    severity: 'Hard Block (Cannot Submit)',
    enabled: true,
  },
  {
    id: 'POL-02',
    title: 'Daily Meal & Per-Diem Cap',
    description: 'Caps individual daily meal expenses at $75.00 per employee. Overage triggers automated manager review.',
    scope: 'All Employees',
    severity: 'Warning / Soft Check',
    enabled: true,
  },
  {
    id: 'POL-03',
    title: 'Executive VP Sign-off Threshold',
    description: 'Any single expenditure claim greater than $1,000.00 mandates secondary sign-off from the Finance VP.',
    scope: 'Enterprise Wide',
    severity: 'Hard Block (Secondary Routing)',
    enabled: true,
  },
  {
    id: 'POL-04',
    title: 'Advance Travel Booking Policy',
    description: 'Domestic flights and rail must be booked at least 7 days in advance of departure date.',
    scope: 'Sales & Executive',
    severity: 'Soft Flag',
    enabled: true,
  },
  {
    id: 'POL-05',
    title: 'Alcohol Expense Exclusions',
    description: 'Alcohol purchases are non-reimbursable unless designated under pre-approved client entertainment accounts.',
    scope: 'All Employees',
    severity: 'Audit Review',
    enabled: false,
  },
];

export const Policies = () => {
  const [policies, setPolicies] = useState(defaultPolicies);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', scope: 'All Departments', severity: 'Warning / Soft Check' });

  const togglePolicy = (id) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newPolicy = {
      id: `POL-0${policies.length + 1}`,
      title: formData.title,
      description: formData.description,
      scope: formData.scope,
      severity: formData.severity,
      enabled: true,
    };
    setPolicies([...policies, newPolicy]);
    setModalOpen(false);
    setFormData({ title: '', description: '', scope: 'All Departments', severity: 'Warning / Soft Check' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Expense Policies & Governance
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Establish automated validation guardrails, per-diem caps, and multi-tier approval rules.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
          New Rule
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {policies.map((p) => (
          <div
            key={p.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              opacity: p.enabled ? 1 : 0.6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: p.enabled ? '#eef2ff' : '#f1f5f9',
                  color: p.enabled ? 'var(--primary-600)' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{p.title}</h3>
                  <Badge variant={p.severity.includes('Hard') ? 'danger' : 'warning'} size="sm">
                    {p.severity}
                  </Badge>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.25rem 0' }}>{p.description}</p>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Applied to: {p.scope}</span>
              </div>
            </div>

            <button
              onClick={() => togglePolicy(p.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: p.enabled ? '#059669' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              {p.enabled ? (
                <>
                  <ToggleRight size={32} />
                  <span>Enforced</span>
                </>
              ) : (
                <>
                  <ToggleLeft size={32} />
                  <span>Disabled</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Define Expense Policy Rule">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Rule Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="e.g. Rideshare Surge Fare Restriction"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Policy Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              placeholder="State clear parameters under which this rule fires..."
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Scope</label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                className="form-select"
              >
                <option value="All Departments">All Departments</option>
                <option value="Sales Only">Sales Only</option>
                <option value="Engineering">Engineering</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Rule Action</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="form-select"
              >
                <option value="Warning / Soft Check">Warning / Soft Check</option>
                <option value="Hard Block (Cannot Submit)">Hard Block (Cannot Submit)</option>
                <option value="Audit Review">Flag for Manual Audit</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Save Policy Rule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Policies;
