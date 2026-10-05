import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  AlertCircle,
  Building,
  User,
  Calendar,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [status, setStatus] = useState('Pending');

  // Mock details for the selected expense
  const expense = {
    id: id || 'EXP-2026-080',
    merchant: 'Amazon Web Services',
    title: 'Production Cluster Compute & Storage',
    amount: 1249.00,
    currency: 'USD',
    date: '2026-03-27',
    category: 'Software & Cloud',
    department: 'DevOps & Infrastructure',
    project: 'PRJ-Alpha (Cloud Migration)',
    claimant: {
      name: 'David Kim',
      email: 'david.kim@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      role: 'Senior DevOps Lead',
    },
    justification: 'Quarterly compute overage charges for multi-region active replication cluster supporting enterprise onboarding phase.',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    auditHistory: [
      { step: 'Claim Submitted', user: 'David Kim', time: 'March 27, 2026, 09:14 AM', status: 'completed' },
      { step: 'Automated Policy Screening', user: 'System Bot', time: 'March 27, 2026, 09:15 AM', status: 'completed' },
      { step: 'Manager Review', user: 'Sarah Connor', time: 'March 27, 2026, 02:40 PM', status: 'completed' },
      { step: 'Finance VP Approval', user: 'Alex Morgan', time: 'Awaiting Sign-off', status: 'current' },
      { step: 'Payout Disbursement', user: 'Automated Batch', time: 'Pending prior sign-offs', status: 'upcoming' },
    ],
  };

  const handleApprove = () => {
    setStatus('Approved');
  };

  const handleConfirmReject = () => {
    setStatus('Rejected');
    setRejectModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }} className="animate-fade-in">
      {/* Header Bar */}
      <div>
        <button
          onClick={() => navigate('/expenses')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
          }}
        >
          <ArrowLeft size={16} />
          Back to Expenses
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              {expense.id}
            </h2>
            <Badge variant={status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'} dot size="lg">
              {status}
            </Badge>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {status === 'Pending' && (
              <>
                <Button variant="danger" size="md" icon={XCircle} onClick={() => setRejectModalOpen(true)}>
                  Reject Claim
                </Button>
                <Button variant="success" size="md" icon={CheckCircle2} onClick={handleApprove}>
                  Approve Claim
                </Button>
              </>
            )}
            <Button variant="secondary" size="md" icon={Download}>
              Download Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Details & Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Summary Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Merchant & Purpose
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.1rem 0' }}>
                  {expense.merchant}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>{expense.title}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Amount
                </span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                  ${expense.amount.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Claimant</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <img src={expense.claimant.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{expense.claimant.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{expense.claimant.role}</div>
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Department</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                  {expense.department}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Category</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                  {expense.category}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Expense Date</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                  {expense.date}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Business Justification
              </span>
              <p style={{ fontSize: '0.875rem', color: '#334155', marginTop: '0.35rem', lineHeight: '1.6' }}>
                {expense.justification}
              </p>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Approval Workflow & Audit Trail</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {expense.auditHistory.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: item.status === 'completed' ? '#ecfdf5' : item.status === 'current' ? '#eff6ff' : '#f8fafc',
                      color: item.status === 'completed' ? '#059669' : item.status === 'current' ? '#2563eb' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.status === 'completed' ? <CheckCircle2 size={16} /> : <Clock size={14} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{item.step}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.time}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned / Handled by: {item.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Receipt Preview & Compliance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Policy Compliance Checklist */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Policy Checklist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669' }}>
                <CheckCircle2 size={16} /> Valid tax invoice attached
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669' }}>
                <CheckCircle2 size={16} /> Within project allocation limits
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706' }}>
                <AlertCircle size={16} /> Over $1,000 threshold (Requires VP)
              </div>
            </div>
          </div>

          {/* Receipt Preview */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Receipt Document</h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>invoice-aws-10294.pdf</span>
            </div>
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#f8fafc',
                position: 'relative',
              }}
            >
              <img
                src={expense.receiptUrl}
                alt="Receipt Scan"
                style={{ width: '100%', height: '260px', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Verified OCR Scan</span>
                <a href={expense.receiptUrl} target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontWeight: 600 }}>
                  View Full
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Expense Claim"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
          Please state the reason for rejecting claim <strong>{expense.id}</strong>. The employee will receive an automated notification.
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. Missing detailed itemized invoice breakdown; Please re-submit with merchant VAT number."
          className="form-textarea"
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default ExpenseDetails;
