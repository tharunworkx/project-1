import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Check,
  X,
  Eye,
  AlertTriangle,
  FileText,
  Filter,
  CheckCircle2
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const pendingApprovalsData = [
  {
    id: 'EXP-2026-085',
    claimant: 'Lisa Ray',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    department: 'Sales',
    merchant: 'United Airlines',
    title: 'Roundtrip Flights to Enterprise Client Workshop',
    category: 'Travel',
    amount: 720.00,
    date: '2026-03-29',
    policyFlag: null,
  },
  {
    id: 'EXP-2026-084',
    claimant: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    department: 'Marketing',
    merchant: 'Metropolitan Bistro',
    title: 'Q1 Partner Dinner',
    category: 'Meals',
    amount: 145.50,
    date: '2026-03-28',
    policyFlag: 'Per-diem Meal Limit Exceeded ($75)',
  },
  {
    id: 'EXP-2026-083',
    claimant: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    department: 'Engineering',
    merchant: 'JetBrains Inc',
    title: 'All Products Pack Annual Team Licenses',
    category: 'Software',
    amount: 1140.00,
    date: '2026-03-28',
    policyFlag: 'Requires Secondary VP Sign-off (> $1,000)',
  },
  {
    id: 'EXP-2026-082',
    claimant: 'Carlos Gomez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
    department: 'Operations',
    merchant: 'Staples Store',
    title: 'Ergonomic Standing Desk Accessories',
    category: 'Hardware',
    amount: 215.00,
    date: '2026-03-27',
    policyFlag: null,
  },
];

export const ApprovalQueue = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(pendingApprovalsData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [notification, setNotification] = useState('');

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleApprove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setNotification(`Claim ${id} approved successfully`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleReject = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setNotification(`Claim ${id} rejected`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleBatchApprove = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setNotification(`Batch approved ${selectedIds.length} expense claims`);
    setSelectedIds([]);
    setTimeout(() => setNotification(''), 4000);
  };

  const totalPendingValue = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Manager Approval Queue
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Review pending employee submissions, evaluate compliance warnings, and sign off.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Queue Total
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              ${totalPendingValue.toFixed(2)} ({items.length} claims)
            </div>
          </div>

          {selectedIds.length > 0 && (
            <Button variant="success" size="md" icon={Check} onClick={handleBatchApprove}>
              Batch Approve ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {notification && (
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
          {notification}
        </div>
      )}

      {/* Main List */}
      <div className="card" style={{ padding: '0.5rem 0' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedIds.length === items.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Claim & Merchant</th>
                <th>Claimant</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Policy Compliance</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={36} color="#10b981" />
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Queue is completely cleared!</div>
                      <span style={{ fontSize: '0.85rem' }}>No pending expense claims requiring your review.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} style={{ backgroundColor: isChecked ? '#f8fafc' : 'transparent' }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.merchant}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.title}</div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8' }}>{item.id}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={item.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                          <div>
                            <div style={{ fontWeight: 600, color: '#334155' }}>{item.claimant}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.department}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#475569' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        ${item.amount.toFixed(2)}
                      </td>
                      <td>
                        {item.policyFlag ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              color: '#d97706',
                              backgroundColor: '#fffbeb',
                              border: '1px solid #fde68a',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                            }}
                          >
                            <AlertTriangle size={13} />
                            {item.policyFlag}
                          </span>
                        ) : (
                          <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={14} /> Passed All Checks
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={Eye}
                            onClick={() => navigate(`/expenses/${item.id}`)}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            icon={X}
                            onClick={() => handleReject(item.id)}
                          />
                          <Button
                            variant="success"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApprove(item.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovalQueue;
