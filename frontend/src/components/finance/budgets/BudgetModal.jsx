import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockDepartments, mockCategories } from '@/services/mock/financeMockData';

export const BudgetModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: '',
    department: 'Engineering',
    project: '',
    category: 'Travel',
    period: 'Q1 2026',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    allocatedAmount: '',
    currency: 'INR',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        department: initialData.department || 'Engineering',
        project: initialData.project || '',
        category: initialData.category || 'Travel',
        period: initialData.period || 'Q1 2026',
        startDate: initialData.startDate || '2026-01-01',
        endDate: initialData.endDate || '2026-03-31',
        allocatedAmount: initialData.allocated || '',
        currency: initialData.currency || 'INR',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        department: 'Engineering',
        project: '',
        category: 'Travel',
        period: 'Q1 2026',
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        allocatedAmount: '',
        currency: 'INR',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Budget title is required';
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.allocatedAmount || Number(formData.allocatedAmount) <= 0) {
      errs.allocatedAmount = 'Valid allocated amount greater than 0 is required';
    }
    if (!formData.startDate) errs.startDate = 'Start date is required';
    if (!formData.endDate) errs.endDate = 'End date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Budget: ${initialData.id}` : 'Create New Department Budget'}
      maxWidth="580px"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Budget'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Title / Name */}
        <div>
          <label className="block font-semibold text-foreground mb-1">
            Budget Name / Initiative <span className="text-destructive">*</span>
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Travel & Client On-site Engagements"
            className="h-9 text-xs"
          />
          {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
        </div>

        {/* Department & Project row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Department <span className="text-destructive">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {mockDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              Associated Project
            </label>
            <Input
              name="project"
              value={formData.project}
              onChange={handleChange}
              placeholder="e.g. Cloud Modernization"
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Category & Budget Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Expense Category <span className="text-destructive">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {mockCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              Budget Period
            </label>
            <select
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Q1 2026">Q1 2026 (Jan–Mar)</option>
              <option value="Q2 2026">Q2 2026 (Apr–Jun)</option>
              <option value="Q3 2026">Q3 2026 (Jul–Sep)</option>
              <option value="Q4 2026">Q4 2026 (Oct–Dec)</option>
              <option value="Annual 2026">Annual 2026</option>
            </select>
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Start Date <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="h-9 text-xs"
            />
            {errors.startDate && <p className="text-rose-500 text-[11px] mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              End Date <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="h-9 text-xs"
            />
            {errors.endDate && <p className="text-rose-500 text-[11px] mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Allocated Amount & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Allocated Amount (₹) <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              name="allocatedAmount"
              value={formData.allocatedAmount}
              onChange={handleChange}
              placeholder="e.g. 500000"
              className="h-9 text-xs font-mono"
            />
            {errors.allocatedAmount && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.allocatedAmount}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-foreground mb-1">
            Description / Business Scope
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain the strategic justification, team allocations, or constraints..."
            className="w-full p-2.5 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;

