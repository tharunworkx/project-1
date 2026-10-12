import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Building,
  Receipt,
  FileText,
  Send,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";
import { CustomDatePicker } from "@/components/ui/date-picker";
import expenseService from '../../services/expenseService';
import expenseStore from '../../services/expenseStore';
import notificationMockService from '../../services/mock/notificationMockService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { processReceiptImage, formatFileSize } from '../../utils/imageUtils';
import { cn } from 'cn';

export const CreateExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const fileInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [formError, setFormError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [proofData, setProofData] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  const initialFormData = {
    merchant: '',
    title: '',
    category: 'Travel & Flights',
    amount: '',
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
    department: user?.department || 'Engineering',
    project: 'PRJ-Alpha (Cloud Migration)',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormData,
        department: user?.department || 'Engineering',
      });
      setFormError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleFileProcess = async (file) => {
    if (!file) return;
    try {
      const processed = await processReceiptImage(file);
      setReceiptFile(file);
      setProofData(processed);
      toastSuccess('Receipt attached successfully.', 'File Attached');
    } catch (err) {
      console.error('File process error:', err);
      toastError('Could not process this file. Please choose an image or PDF.', 'Upload Error');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!formData.merchant?.trim()) {
      setFormError('Please enter the merchant or vendor name.');
      return false;
    }
    if (!formData.title?.trim()) {
      setFormError('Please enter the purpose or claim title.');
      return false;
    }
    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      setFormError('Please enter a valid expense amount greater than 0.');
      return false;
    }
    if (!proofData || (!proofData.dataUrl && !proofData.file)) {
      setFormError('Receipt upload is mandatory. Please upload an invoice photo, image, or PDF before submitting.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const numAmount = parseFloat(formData.amount);
      const payload = {
        title: formData.merchant.trim(),
        description: formData.title.trim(),
        amount: numAmount,
        category: formData.category,
        department: formData.department,
        project: formData.project,
        justification: formData.description,
        date: formData.date,
        currency: 'INR',
        status: 'PENDING',
        receiptUrl: proofData?.dataUrl || null,
        proofImage: proofData?.dataUrl || null,
        receiptName: proofData?.name || null,
        receiptSize: proofData?.size || null,
        submittedBy: user?.email || user?.name || 'Employee',
      };

      // 1. Send to Spring Boot backend
      try {
        await expenseService.createExpense(payload);
      } catch (apiErr) {
        console.warn('Backend API createExpense offline, saving to store:', apiErr);
      }

      // 2. Also record in local store for instantaneous reactivity
      const newStored = expenseStore.addExpense({
        ...payload,
        merchant: formData.merchant.trim(),
        title: formData.title.trim(),
        status: 'Pending',
        claimant: user?.name || 'Employee',
      });

      // 3. Trigger instant real-time notification
      try {
        await notificationMockService.addNotification({
          title: 'New Expense Claim Submitted',
          message: `${user?.name || 'Employee'} submitted claim for ${formData.merchant.trim()} (₹${numAmount.toLocaleString('en-IN')})`,
          type: 'Expense Submission',
          relatedModule: 'Expenses',
          link: '/expenses',
          path: '/expenses',
          priority: 'high',
        });
      } catch (notifErr) {
        console.warn('Realtime notification trigger error:', notifErr);
      }

      toastSuccess('New expense claim submitted for approval successfully.', 'Claim Submitted');
      if (onSuccess) onSuccess(newStored);
      onClose();
    } catch (err) {
      console.error('Submit expense error:', err);
      setFormError(typeof err === 'string' ? err : 'Failed to submit claim. Please try again.');
      toastError('Could not submit claim. Please check details.', 'Submission Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setFormError('');
    if (!formData.merchant?.trim() && !formData.title?.trim()) {
      setFormError('Please enter at least a merchant or title to save a draft.');
      return;
    }

    setSavingDraft(true);
    try {
      const numAmount = parseFloat(formData.amount) || 0;
      const draftPayload = {
        merchant: formData.merchant.trim() || 'Untitled Draft',
        title: formData.title.trim() || 'Draft Claim',
        description: formData.title.trim() || 'Draft Claim',
        amount: numAmount,
        category: formData.category,
        department: formData.department,
        project: formData.project,
        justification: formData.description,
        date: formData.date,
        currency: 'INR',
        status: 'Draft',
        claimant: user?.name || 'Employee',
        submittedBy: user?.email || user?.name || 'Employee',
      };

      expenseStore.addExpense(draftPayload);
      toastSuccess('Claim saved as draft. You can complete it anytime.', 'Draft Saved');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Draft error:', err);
      toastError('Could not save draft.', 'Draft Error');
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-card text-card-foreground rounded-2xl border border-border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 4 */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border/80">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              New Expense Claim
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submit an invoice with proof of purchase for audit and reimbursement sign-off.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body matching Image 4 */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {formError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Bordered Card: Expense Information */}
          <div className="rounded-xl border border-border/80 p-5 bg-card/40 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Expense Information
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Basic merchant, project code and purpose specifics
              </p>
            </div>

            {/* Row 1: Merchant & Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="merchant">
                  Merchant / Vendor *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="merchant"
                    name="merchant"
                    type="text"
                    required
                    placeholder="e.g. Delta Airlines, AWS Cloud, Uber"
                    value={formData.merchant}
                    onChange={handleChange}
                    className="pl-9 h-10 text-xs sm:text-sm bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="title">
                  Purpose / Claim Title *
                </label>
                <div className="relative">
                  <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. Q1 Onsite Client Meeting Travel"
                    value={formData.title}
                    onChange={handleChange}
                    className="pl-9 h-10 text-xs sm:text-sm bg-background border-border"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Category, Amount, Expense Date */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="category">
                  Category *
                </label>
                <CustomSelect
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-xl text-xs sm:text-sm bg-background border-border"
                  options={[
                    { value: "Travel & Flights", label: "Travel & Flights" },
                    { value: "Accommodation", label: "Accommodation" },
                    { value: "Food & Dining", label: "Food & Dining" },
                    { value: "Software & Cloud", label: "Software & Cloud" },
                    { value: "Office Equipment", label: "Office Equipment" },
                    { value: "Fuel & Transit", label: "Fuel & Transit" },
                    { value: "General", label: "General & Miscellaneous" },
                  ]}
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="amount">
                  Amount (INR ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="pl-8 h-10 text-xs sm:text-sm font-semibold bg-background border-border font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="date">
                  Expense Date *
                </label>
                <CustomDatePicker
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  maxDate={new Date().toISOString().split('T')[0]}
                  triggerClassName="h-10 rounded-xl text-xs sm:text-sm bg-background border-border"
                />
              </div>
            </div>

            {/* Row 3: Department & Project Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="department">
                  Department
                </label>
                <CustomSelect
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-xl text-xs sm:text-sm bg-background border-border"
                  options={[
                    { value: "Engineering", label: "Engineering" },
                    { value: "Engineering & DevOps", label: "Engineering & DevOps" },
                    { value: "Finance & Accounts", label: "Finance & Accounts" },
                    { value: "Growth & Marketing", label: "Growth & Marketing" },
                    { value: "Enterprise Sales", label: "Enterprise Sales" },
                    { value: "People & Operations", label: "People & Operations" },
                    { value: "Executive Management", label: "Executive Management" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="project">
                  Project Code / Cost Allocation
                </label>
                <CustomSelect
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-xl text-xs sm:text-sm bg-background border-border"
                  options={[
                    { value: "PRJ-Alpha (Cloud Migration)", label: "PRJ-Alpha (Cloud Migration)" },
                    { value: "PRJ-Beta (Marketing Q3)", label: "PRJ-Beta (Marketing Q3)" },
                    { value: "PRJ-Gamma (Sales Expansion)", label: "PRJ-Gamma (Sales Expansion)" },
                    { value: "Internal Operations", label: "Internal Operations" },
                    { value: "Client Engagement Direct", label: "Client Engagement Direct" },
                  ]}
                />
              </div>
            </div>

            {/* Row 4: Business Justification / Notes */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="description">
                Business Justification / Notes
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Explain how this expense benefits company operations, customer success, or project delivery..."
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none"
              />
            </div>
          </div>

          {/* Bordered Card: Receipt & Proof Document (Reference Image 3) */}
          <div className="rounded-xl border border-border/80 p-5 bg-card/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span>Receipt & Proof Document</span>
                  <span className="text-destructive font-bold text-sm">*</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    Mandatory
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upload invoice or receipt photo to show as proof to the manager during audit review
                </p>
              </div>
            </div>

            {!proofData ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3",
                  formError && formError.toLowerCase().includes('receipt')
                    ? "border-destructive bg-destructive/5 ring-1 ring-destructive/40"
                    : isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="size-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow-2xs">
                  <UploadCloud className="size-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-foreground">
                    Click to upload receipt photo or PDF, or drag and drop
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    PNG, JPG, JPEG, WEBP or PDF up to 10MB
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {proofData.isImage && proofData.dataUrl ? (
                    <img
                      src={proofData.dataUrl}
                      alt="Receipt proof"
                      className="size-12 rounded-lg object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border">
                      <FileText className="size-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {proofData.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{formatFileSize(proofData.size)}</span>
                      <span className="text-emerald-500 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="size-3" /> Ready
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setProofData(null);
                    setReceiptFile(null);
                  }}
                  className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                  title="Remove file"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer matching Image 4 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/80 bg-card/60">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs px-4 rounded-xl cursor-pointer"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={savingDraft || submitting}
              onClick={handleSaveDraft}
              className="text-xs px-4 rounded-xl gap-2 cursor-pointer"
            >
              <Bookmark className="size-3.5" />
              <span>{savingDraft ? 'Saving Draft...' : 'Save as Draft'}</span>
            </Button>

            <Button
              type="button"
              disabled={submitting || savingDraft}
              onClick={handleSubmit}
              className="text-xs px-5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold gap-2 shadow-xs cursor-pointer"
            >
              <Send className="size-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Claim for Approval'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExpenseModal;
