import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const mockExpenses = [
  {
    id: 'EXP-2026-081',
    merchant: 'Delta Airlines',
    title: 'Flight to Q1 Tech Summit',
    category: 'Travel',
    claimant: 'Sarah Jenkins',
    department: 'Engineering',
    amount: 642.50,
    currency: 'USD',
    date: '2026-03-28',
    status: 'Approved',
    receipt: true,
  },
  {
    id: 'EXP-2026-080',
    merchant: 'Amazon Web Services',
    title: 'Production Cluster Compute',
    category: 'Software',
    claimant: 'David Kim',
    department: 'DevOps',
    amount: 1249.00,
    currency: 'USD',
    date: '2026-03-27',
    status: 'Pending',
    receipt: true,
  },
  {
    id: 'EXP-2026-079',
    merchant: 'Hilton Downtown Austin',
    title: '3 Nights Lodging - Client Meeting',
    category: 'Lodging',
    claimant: 'Michael Brown',
    department: 'Sales',
    amount: 412.30,
    currency: 'USD',
    date: '2026-03-26',
    status: 'Approved',
    receipt: true,
  },
  {
    id: 'EXP-2026-078',
    merchant: 'The Capital Grille',
    title: 'Executive Team Dinner',
    category: 'Meals',
    claimant: 'Emily Stone',
    department: 'Executive',
    amount: 320.00,
    currency: 'USD',
    date: '2026-03-25',
    status: 'Rejected',
    receipt: false,
  },
  {
    id: 'EXP-2026-077',
    merchant: 'Apple Store NYC',
    title: 'M3 USB-C Power Adapter & Cables',
    category: 'Hardware',
    claimant: 'Alex Morgan',
    department: 'Product',
    amount: 129.00,
    currency: 'USD',
    date: '2026-03-24',
    status: 'Reimbursed',
    receipt: true,
  },
  {
    id: 'EXP-2026-076',
    merchant: 'Uber Technologies',
    title: 'Airport Transit to Conference',
    category: 'Travel',
    claimant: 'Marcus Vance',
    department: 'Marketing',
    amount: 54.20,
    currency: 'USD',
    date: '2026-03-22',
    status: 'Approved',
    receipt: true,
  },
  {
    id: 'EXP-2026-075',
    merchant: 'JetBrains',
    title: 'All Products Pack Renewal',
    category: 'Software',
    claimant: 'Elena Rostova',
    department: 'Engineering',
    amount: 289.00,
    currency: 'USD',
    date: '2026-03-21',
    status: 'Pending',
    receipt: true,
  },
];

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'success';
    case 'pending': return 'warning';
    case 'rejected': return 'danger';
    case 'reimbursed': return 'purple';
    default: return 'neutral';
  }
};

export const Expenses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredExpenses = mockExpenses.filter((item) => {
    const matchesTab = activeTab === 'All' || item.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.claimant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const tabs = ['All', 'Pending', 'Approved', 'Reimbursed', 'Rejected'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Expense Claims
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Submit, monitor, and audit corporate claims across departments
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="md" icon={Download}>
            Export CSV
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={() => navigate('/expenses/new')}>
            New Claim
          </Button>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab ? 'var(--primary-600)' : '#f8fafc',
                  color: activeTab === tab ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.75rem',
                gap: '0.5rem',
              }}
            >
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search merchant, claim ID, staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.8125rem',
                  background: 'transparent',
                  width: '200px',
                }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                color: '#334155',
                outline: 'none',
              }}
            >
              <option value="All">All Categories</option>
              <option value="Travel">Travel</option>
              <option value="Software">Software</option>
              <option value="Meals">Meals</option>
              <option value="Lodging">Lodging</option>
              <option value="Hardware">Hardware</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Merchant & Purpose</th>
                <th>Claimant</th>
                <th>Category</th>
                <th>Date</th>
                <th>Receipt</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No expense claims found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                        {exp.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{exp.merchant}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.title}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: '#334155' }}>{exp.claimant}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{exp.department}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          color: '#475569',
                          fontWeight: 500,
                        }}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>{exp.date}</td>
                    <td>
                      {exp.receipt ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Attached
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>
                          <XCircle size={14} /> Missing
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                      ${exp.amount.toFixed(2)}
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(exp.status)} dot>
                        {exp.status}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => navigate(`/expenses/${exp.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
