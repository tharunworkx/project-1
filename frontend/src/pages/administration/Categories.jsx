import React, { useState } from 'react';
import { Plus, FolderTree, Check, X, ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const mockCategories = [
  { id: 'CAT-1', name: 'Travel & Transport', cap: 1500, requireReceiptAbove: 25, taxDeductible: true },
  { id: 'CAT-2', name: 'Software & Cloud', cap: 5000, requireReceiptAbove: 0, taxDeductible: true },
  { id: 'CAT-3', name: 'Meals & Dining', cap: 75, requireReceiptAbove: 25, taxDeductible: false },
  { id: 'CAT-4', name: 'Hotel & Lodging', cap: 350, requireReceiptAbove: 0, taxDeductible: true },
  { id: 'CAT-5', name: 'Hardware & Devices', cap: 2500, requireReceiptAbove: 50, taxDeductible: true },
  { id: 'CAT-6', name: 'Office Supplies', cap: 200, requireReceiptAbove: 25, taxDeductible: true },
];

export const Categories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', cap: '', requireReceiptAbove: '25', taxDeductible: true });

  const handleCreate = (e) => {
    e.preventDefault();
    const newCat = {
      id: `CAT-${categories.length + 1}`,
      name: formData.name,
      cap: parseFloat(formData.cap) || 500,
      requireReceiptAbove: parseFloat(formData.requireReceiptAbove) || 25,
      taxDeductible: formData.taxDeductible,
    };
    setCategories([...categories, newCat]);
    setModalOpen(false);
    setFormData({ name: '', cap: '', requireReceiptAbove: '25', taxDeductible: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Expense Categories
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Configure spending categories, single-claim caps, and receipt requirement thresholds.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
          New Category
        </Button>
      </div>

      <div className="card" style={{ padding: '0.5rem 0' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Standard Single Cap</th>
                <th>Receipt Required Above</th>
                <th>Tax Deductible</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a' }}>
                      <FolderTree size={16} color="var(--primary-600)" />
                      {c.name}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>
                    ${c.cap.toLocaleString()}
                  </td>
                  <td style={{ color: '#475569' }}>
                    {c.requireReceiptAbove === 0 ? 'All Amounts (No threshold)' : `> $${c.requireReceiptAbove}`}
                  </td>
                  <td>
                    {c.taxDeductible ? (
                      <Badge variant="success" dot>Eligible (100%)</Badge>
                    ) : (
                      <Badge variant="neutral">Non-deductible</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Expense Category">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g. Training & Certifications"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Single Claim Cap ($)</label>
              <input
                type="number"
                value={formData.cap}
                onChange={(e) => setFormData({ ...formData, cap: e.target.value })}
                className="form-input"
                placeholder="1000"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Receipt Threshold ($)</label>
              <input
                type="number"
                value={formData.requireReceiptAbove}
                onChange={(e) => setFormData({ ...formData, requireReceiptAbove: e.target.value })}
                className="form-input"
                placeholder="25"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Save Category</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
