import React, { useState } from 'react';
import { Plus, PieChart, AlertTriangle, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const mockBudgets = [
  {
    id: 'BDG-001',
    name: 'Engineering & Infrastructure',
    code: 'ENG-2026',
    allocated: 100000,
    spent: 82500,
    owner: 'Alex Morgan',
    period: 'Q1 2026',
  },
  {
    id: 'BDG-002',
    name: 'Marketing & Digital Acquisition',
    code: 'MKT-2026',
    allocated: 50000,
    spent: 47200,
    owner: 'Sarah Jenkins',
    period: 'Q1 2026',
  },
  {
    id: 'BDG-003',
    name: 'Enterprise Sales & BD',
    code: 'SLS-2026',
    allocated: 60000,
    spent: 34100,
    owner: 'Michael Brown',
    period: 'Q1 2026',
  },
  {
    id: 'BDG-004',
    name: 'Product Design & Research',
    code: 'PRD-2026',
    allocated: 30000,
    spent: 18300,
    owner: 'Emily Stone',
    period: 'Q1 2026',
  },
  {
    id: 'BDG-005',
    name: 'People Operations & HR',
    code: 'HR-2026',
    allocated: 20000,
    spent: 9800,
    owner: 'David Kim',
    period: 'Q1 2026',
  },
];

export const Budgets = () => {
  const [budgets, setBudgets] = useState(mockBudgets);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    allocated: '',
    owner: 'Alex Morgan',
    period: 'Q2 2026',
  });

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const remaining = totalAllocated - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  const handleCreateBudget = (e) => {
    e.preventDefault();
    const newBudget = {
      id: `BDG-${String(budgets.length + 1).padStart(3, '0')}`,
      name: formData.name,
      code: formData.code,
      allocated: parseFloat(formData.allocated),
      spent: 0,
      owner: formData.owner,
      period: formData.period,
    };
    setBudgets([newBudget, ...budgets]);
    setModalOpen(false);
    setFormData({ name: '', code: '', allocated: '', owner: 'Alex Morgan', period: 'Q2 2026' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Budgets & Spend Caps
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Configure and audit spending caps across business units and quarterly cycles.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
          New Budget Pool
        </Button>
      </div>

      {/* Aggregate Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Total Allocated Pool</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
            ${totalAllocated.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Across 5 active departments</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Actual Spend to Date</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-600)', margin: '0.25rem 0' }}>
            ${totalSpent.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{overallPercentage}% of total company pool</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Remaining Balance</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>
            ${remaining.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{100 - overallPercentage}% remaining headroom</span>
        </div>
      </div>

      {/* Budgets List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {budgets.map((budget) => {
          const pct = Math.min(100, Math.round((budget.spent / budget.allocated) * 100));
          const isDanger = pct >= 90;
          const isWarn = pct >= 80;

          return (
            <div key={budget.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--primary-600)', fontWeight: 600 }}>
                    {budget.code}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.1rem 0' }}>
                    {budget.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Owner: {budget.owner} • {budget.period}</span>
                </div>

                <Badge variant={isDanger ? 'danger' : isWarn ? 'warning' : 'success'} dot>
                  {pct}%
                </Badge>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#475569' }}>Spent: <strong>${budget.spent.toLocaleString()}</strong></span>
                  <span style={{ color: '#64748b' }}>Cap: ${budget.allocated.toLocaleString()}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: isDanger ? '#ef4444' : isWarn ? '#f59e0b' : '#6366f1',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.75rem' }}>
                <span style={{ color: '#64748b' }}>
                  Remaining: <strong>${(budget.allocated - budget.spent).toLocaleString()}</strong>
                </span>
                {isWarn && (
                  <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <AlertTriangle size={13} /> Threshold Alert
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Budget Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Department Budget Pool"
      >
        <form onSubmit={handleCreateBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Department / Unit Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. AI Research Lab"
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Budget Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. AI-2026"
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Allocation Amount ($) *</label>
              <input
                type="number"
                required
                value={formData.allocated}
                onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                placeholder="50000"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Budget Owner</label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Create Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;
