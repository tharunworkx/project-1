import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle2, ArrowUpRight, Send, Clock, Building } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const mockReimbursements = [
  {
    id: 'RMB-2026-042',
    claimId: 'EXP-2026-079',
    employee: 'Michael Brown',
    department: 'Sales',
    method: 'Direct Deposit (ACH)',
    accountLast4: '4821',
    amount: 412.30,
    status: 'Ready',
    approvedDate: '2026-03-27',
  },
  {
    id: 'RMB-2026-041',
    claimId: 'EXP-2026-076',
    employee: 'Marcus Vance',
    department: 'Marketing',
    method: 'Direct Deposit (ACH)',
    accountLast4: '9012',
    amount: 54.20,
    status: 'Ready',
    approvedDate: '2026-03-26',
  },
  {
    id: 'RMB-2026-040',
    claimId: 'EXP-2026-081',
    employee: 'Sarah Jenkins',
    department: 'Engineering',
    method: 'Wire Transfer',
    accountLast4: '1149',
    amount: 642.50,
    status: 'In Transit',
    approvedDate: '2026-03-25',
  },
  {
    id: 'RMB-2026-039',
    claimId: 'EXP-2026-077',
    employee: 'Alex Morgan',
    department: 'Product',
    method: 'Direct Deposit (ACH)',
    accountLast4: '7723',
    amount: 129.00,
    status: 'Disbursed',
    approvedDate: '2026-03-24',
  },
];

export const Reimbursements = () => {
  const [list, setList] = useState(mockReimbursements);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const readyItems = list.filter((item) => item.status === 'Ready');
  const readyTotal = readyItems.reduce((acc, item) => acc + item.amount, 0);

  const handleDisburseAll = () => {
    setProcessing(true);
    setTimeout(() => {
      setList((prev) =>
        prev.map((item) => (item.status === 'Ready' ? { ...item, status: 'Disbursed' } : item))
      );
      setProcessing(false);
      setSuccessMsg(`Successfully disbursed ${readyItems.length} reimbursements ($${readyTotal.toFixed(2)}) via ACH batch`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1000);
  };

  const handleDisburseSingle = (id) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Disbursed' } : item))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Reimbursement Disbursements
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Execute direct deposit payouts for authorized employee expenditures.
          </p>
        </div>

        {readyItems.length > 0 && (
          <Button
            variant="primary"
            size="md"
            icon={Send}
            loading={processing}
            onClick={handleDisburseAll}
          >
            Disburse Batch (${readyTotal.toFixed(2)})
          </Button>
        )}
      </div>

      {successMsg && (
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
          {successMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Ready for Payout</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
            ${readyTotal.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{readyItems.length} claims cleared for ACH</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>In Transit (ACH Rails)</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7', margin: '0.25rem 0' }}>
            $642.50
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated settlement: 1-2 business days</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Completed YTD</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>
            $192,840.00
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>100% on-time disbursement compliance</span>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '0.5rem 0' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Reimbursement ID</th>
                <th>Employee / Recipient</th>
                <th>Payment Method</th>
                <th>Approved Date</th>
                <th>Disbursement Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                      {item.id}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Claim: {item.claimId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.employee}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.department}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
                      <CreditCard size={15} color="#64748b" />
                      <span>{item.method} (••{item.accountLast4})</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>{item.approvedDate}</td>
                  <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    ${item.amount.toFixed(2)}
                  </td>
                  <td>
                    <Badge
                      variant={item.status === 'Disbursed' ? 'success' : item.status === 'Ready' ? 'warning' : 'info'}
                      dot
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {item.status === 'Ready' && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Send}
                        onClick={() => handleDisburseSingle(item.id)}
                      >
                        Pay
                      </Button>
                    )}
                    {item.status === 'Disbursed' && (
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reimbursements;
