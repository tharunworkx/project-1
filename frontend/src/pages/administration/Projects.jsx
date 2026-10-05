import React, { useState } from 'react';
import { Plus, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const mockProjects = [
  {
    id: 'PRJ-101',
    code: 'PRJ-Alpha',
    title: 'Enterprise Cloud Migration',
    client: 'Acme Global Corp',
    budget: 45000,
    spent: 31200,
    status: 'Active',
  },
  {
    id: 'PRJ-102',
    code: 'PRJ-Beta',
    title: 'Mobile Banking iOS/Android Rewrite',
    client: 'Fintech Partners UK',
    budget: 65000,
    spent: 58900,
    status: 'Active',
  },
  {
    id: 'PRJ-103',
    code: 'PRJ-Gamma',
    title: 'Internal SOC2 & ISO Compliance Audit',
    client: 'Internal Enterprise',
    budget: 25000,
    spent: 24800,
    status: 'Completed',
  },
];

export const Projects = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', title: '', client: '', budget: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    const newProj = {
      id: `PRJ-${Date.now()}`,
      code: formData.code,
      title: formData.title,
      client: formData.client,
      budget: parseFloat(formData.budget) || 10000,
      spent: 0,
      status: 'Active',
    };
    setProjects([...projects, newProj]);
    setModalOpen(false);
    setFormData({ code: '', title: '', client: '', budget: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Projects & Cost Centers
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Attribute billable and non-billable employee expenditures to customer projects.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
          New Project Code
        </Button>
      </div>

      <div className="card" style={{ padding: '0.5rem 0' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Project Code</th>
                <th>Project Name</th>
                <th>Client / Account</th>
                <th>Expense Budget</th>
                <th>Spent to Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => {
                const pct = Math.round((proj.spent / proj.budget) * 100);
                return (
                  <tr key={proj.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-600)' }}>
                        {proj.code}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{proj.title}</div>
                    </td>
                    <td style={{ color: '#475569' }}>{proj.client}</td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>
                      ${proj.budget.toLocaleString()}
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>${proj.spent.toLocaleString()}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.35rem' }}>({pct}%)</span>
                      </div>
                    </td>
                    <td>
                      <Badge variant={proj.status === 'Active' ? 'success' : 'neutral'} dot>
                        {proj.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Project Code">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Project Code *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="form-input"
              placeholder="e.g. PRJ-Delta"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="e.g. Customer Portal Redesign"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Client Name</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="form-input"
                placeholder="e.g. Globex Corp"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Expense Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="form-input"
                placeholder="20000"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Save Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
