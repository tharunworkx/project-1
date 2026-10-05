import React, { useState } from 'react';
import { Plus, Building2, Users, DollarSign, Edit2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const mockDepartments = [
  { id: 'DEP-1', name: 'Engineering & DevOps', lead: 'Sarah Jenkins', employees: 42, budget: 100000 },
  { id: 'DEP-2', name: 'Growth & Marketing', lead: 'Marcus Vance', employees: 18, budget: 50000 },
  { id: 'DEP-3', name: 'Enterprise Sales', lead: 'Michael Brown', employees: 24, budget: 60000 },
  { id: 'DEP-4', name: 'Product & Design', lead: 'Emily Stone', employees: 14, budget: 30000 },
  { id: 'DEP-5', name: 'People & Operations', lead: 'David Kim', employees: 9, budget: 20000 },
];

export const Departments = () => {
  const [departments, setDepartments] = useState(mockDepartments);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', lead: '', employees: '', budget: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    const newDept = {
      id: `DEP-${departments.length + 1}`,
      name: formData.name,
      lead: formData.lead,
      employees: parseInt(formData.employees) || 1,
      budget: parseFloat(formData.budget) || 10000,
    };
    setDepartments([...departments, newDept]);
    setModalOpen(false);
    setFormData({ name: '', lead: '', employees: '', budget: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Departments
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Configure corporate organizational units and spending authorities.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
          New Department
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {departments.map((dept) => (
          <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#eef2ff',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>{dept.name}</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Lead: {dept.lead}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: '#64748b' }}>Team Size:</span>
              <strong style={{ color: '#0f172a' }}>{dept.employees} Members</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: '#64748b' }}>Q1 Budget Limit:</span>
              <strong style={{ color: 'var(--primary-600)' }}>${dept.budget.toLocaleString()}</strong>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Department">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Department Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g. Legal & Compliance"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Department Head / Manager *</label>
            <input
              type="text"
              required
              value={formData.lead}
              onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
              className="form-input"
              placeholder="e.g. Jessica Pearson"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Staff Count</label>
              <input
                type="number"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                className="form-input"
                placeholder="10"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="form-input"
                placeholder="25000"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Save Department</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
