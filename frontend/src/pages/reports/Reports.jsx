import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download, Calendar, Filter, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';

const departmentSpendData = [
  { name: 'Engineering', q1: 82500, q2: 74000 },
  { name: 'Marketing', q1: 47200, q2: 52000 },
  { name: 'Sales', q1: 34100, q2: 41000 },
  { name: 'Product', q1: 18300, q2: 21500 },
  { name: 'Operations', q1: 9800, q2: 11200 },
];

export const Reports = () => {
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const triggerExport = (format) => {
    setDownloadSuccess(`Exporting financial report in ${format} format...`);
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Financial Reports & Analytics
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Comprehensive analytics on corporate expenditures, quarterly variance, and tax deductions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="md" icon={FileSpreadsheet} onClick={() => triggerExport('Excel (.xlsx)')}>
            Export Excel
          </Button>
          <Button variant="primary" size="md" icon={Download} onClick={() => triggerExport('PDF')}>
            Generate PDF Summary
          </Button>
        </div>
      </div>

      {downloadSuccess && (
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
          {downloadSuccess}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Average Claim Size</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
            $328.40
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669' }}>-4.2% reduction in unitemized costs</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Tax Deductible Spend</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-600)', margin: '0.25rem 0' }}>
            $142,390.00
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estimated tax write-off: ~$31,300</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Compliance Accuracy</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>
            98.6%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Receipts verified via OCR</span>
        </div>
      </div>

      {/* Department Comparison Chart */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Quarterly Spend by Department</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Comparison of Q1 actuals vs Q2 forecast</p>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentSpendData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#f1f5f9' }} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={{ stroke: '#f1f5f9' }} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip
                formatter={(val) => [`$${val.toLocaleString()}`, 'Spend']}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.75rem' }}
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
              <Bar dataKey="q1" name="Q1 Actual Spend" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="q2" name="Q2 Forecast" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
