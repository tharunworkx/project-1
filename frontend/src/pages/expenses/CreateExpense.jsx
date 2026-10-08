import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  ArrowLeft,
  DollarSign,
  Receipt,
  Building,
  Calendar,
  Layers,
  Send,
  Bookmark,
  ShieldCheck,
  ZoomIn,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomSelect } from "@/components/ui/select";
import { CustomDatePicker } from "@/components/ui/date-picker";
import Modal from '../../components/common/Modal';
import expenseService from '../../services/expenseService';
import expenseStore from '../../services/expenseStore';
import { useAuth } from '../../context/AuthContext';
import { processReceiptImage, formatFileSize } from '../../utils/imageUtils';
import { uploadReceiptToSupabase, supabase } from '../../services/supabaseStorage';

export const CreateExpense = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftIdParam = searchParams.get('draftId');
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [existingDraftId, setExistingDraftId] = useState(null);

  // Proof state
  const [receiptFile, setReceiptFile] = useState(null);
  const [proofData, setProofData] = useState(null);
  const [imagePreviewModalOpen, setImagePreviewModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [receiptError, setReceiptError] = useState('');

  const [formData, setFormData] = useState({
    merchant: '',
    title: '',
    category: 'Travel & Flights',
    amount: '',
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
    department: user?.department || 'Engineering & DevOps',
    project: 'PRJ-Alpha (Cloud Migration)',
    description: '',
  });

  // Pre-populate if editing a draft
  useEffect(() => {
    if (draftIdParam) {
      const draft = expenseStore.getExpenseById(draftIdParam);
      if (draft) {
        setExistingDraftId(draft.id);
        setFormData({
          merchant: draft.merchant || '',
          title: draft.title || '',
          category: draft.category || 'Travel & Flights',
          amount: draft.numericAmount?.toString() || (draft.amount ? draft.amount.replace(/[^0.0-9.]/g, '') : ''),
          currency: draft.currency || 'INR',
          date: draft.date ? (draft.date.includes('-') ? draft.date : new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
          department: draft.department || 'Engineering',
          project: draft.project || 'PRJ-Alpha (Cloud Migration)',
          description: draft.justification || draft.description || '',
        });

        if (draft.proofImage || draft.receiptUrl) {
          setProofData({
            dataUrl: draft.proofImage || draft.receiptUrl,
            previewUrl: draft.proofImage || draft.receiptUrl,
            name: draft.receiptName || 'Attached_Receipt_Proof.jpg',
            size: draft.receiptSize || 150000,
            isImage: true,
          });
        }
      }
    }
  }, [draftIdParam]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptError('');
      try {
        const processed = await processReceiptImage(file);
        setProofData(processed);
      } catch (err) {
        console.warn('Failed to process image preview:', err);
        setProofData({
          dataUrl: null,
          previewUrl: null,
          name: file.name,
          size: file.size,
          isImage: file.type.startsWith('image/'),
        });
      }
    }
  };

  const removeFile = (e) => {
    if (e) e.stopPropagation();
    setReceiptFile(null);
    setProofData(null);
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    if (!formData.merchant && !formData.title) {
      alert('Please enter at least a merchant name or title to save a draft.');
      return;
    }

    setSavingDraft(true);
    try {
      let finalReceiptUrl = proofData?.dataUrl || null;
      if (receiptFile) {
        try {
          const uploadRes = await uploadReceiptToSupabase(receiptFile);
          if (uploadRes?.url) {
            finalReceiptUrl = uploadRes.url;
          }
        } catch (storageErr) {
          console.warn('Supabase Storage upload warning (falling back to dataUrl):', storageErr);
        }
      }

      await expenseService.createExpense(
        {
          ...formData,
          id: existingDraftId || undefined,
          status: 'Draft',
          numericAmount: parseFloat(formData.amount) || 0,
          amount: parseFloat(formData.amount) || 0,
          receiptAttached: !!proofData,
          proofImage: finalReceiptUrl,
          receiptUrl: finalReceiptUrl,
          receiptName: proofData?.name || null,
          receiptSize: proofData?.size || 0,
        },
        user
      );

      setFeedbackMessage('Expense saved as draft successfully!');
      setTimeout(() => {
        navigate('/expenses');
      }, 800);
    } catch (err) {
      console.error('Error saving draft:', err);
      navigate('/expenses');
    } finally {
      setSavingDraft(false);
    }
  };

  // Submit Claim
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mandatory receipt validation
    if (!receiptFile && !proofData?.dataUrl && !proofData?.previewUrl) {
      setReceiptError('Receipt and proof document is mandatory. Please attach an invoice or receipt image before submitting your claim.');
      const el = document.getElementById('receiptCard');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      let finalReceiptUrl = proofData?.dataUrl || null;
      if (receiptFile) {
        try {
          const uploadRes = await uploadReceiptToSupabase(receiptFile);
          if (uploadRes?.url) {
            finalReceiptUrl = uploadRes.url;
          }
        } catch (storageErr) {
          console.warn('Supabase Storage upload warning (falling back to dataUrl):', storageErr);
        }
      }

      const numAmount = parseFloat(formData.amount) || 0;
      const claimantEmail = user?.email || 'employee@company.com';
      const expenseTitle = formData.title || formData.merchant || 'Expense Claim';

      // 1. Direct Supabase insert (ensures immediate persistence and Supabase status tracking)
      let createdDbId = null;
      try {
        const { data: insertedExpense, error: insertErr } = await supabase
          .from('expenses')
          .insert({
            title: expenseTitle,
            description: formData.description || '',
            amount: numAmount,
            category: formData.category || 'General',
            department: user?.department || formData.department || 'Engineering',
            submitted_by: claimantEmail,
            status: 'PENDING',
            currency: formData.currency || 'INR',
            date: formData.date || new Date().toISOString().split('T')[0],
            receipt_url: finalReceiptUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertErr) {
          console.warn('Supabase expense insert warning:', insertErr);
        } else if (insertedExpense?.id) {
          createdDbId = insertedExpense.id;
        }
      } catch (dbErr) {
        console.warn('Supabase expense insert error:', dbErr);
      }

      // 2. Also notify Spring Boot backend if server is reachable
      try {
        await expenseService.createExpense(
          {
            ...formData,
            title: expenseTitle,
            submittedBy: claimantEmail,
            id: createdDbId || existingDraftId || undefined,
            status: 'PENDING',
            numericAmount: numAmount,
            amount: numAmount,
            receiptAttached: !!proofData,
            proofImage: finalReceiptUrl,
            receiptUrl: finalReceiptUrl,
            receiptName: proofData?.name || null,
            receiptSize: proofData?.size || 0,
          },
          user
        );
      } catch (apiErr) {
        console.warn('Backend API createExpense offline/skipped:', apiErr);
      }

      // 3. Keep local store synchronized
      try {
        expenseStore.addExpense(
          {
            ...formData,
            id: createdDbId ? `EXP-${createdDbId}` : (existingDraftId || `EXP-${Date.now()}`),
            dbId: createdDbId,
            title: expenseTitle,
            claimant: user?.name || user?.email?.split('@')[0] || 'Employee',
            email: claimantEmail,
            submittedBy: claimantEmail,
            department: user?.department || formData.department || 'Engineering',
            status: 'Pending',
            numericAmount: numAmount,
            amount: `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            receiptAttached: !!proofData || !!finalReceiptUrl,
            receiptUrl: finalReceiptUrl,
            proofImage: finalReceiptUrl,
            receiptName: proofData?.name || (finalReceiptUrl ? 'receipt_proof.jpg' : null),
            receiptSize: proofData?.size || 0,
            createdAt: new Date().toISOString(),
          },
          user
        );
      } catch (storeErr) {
        console.warn('expenseStore error:', storeErr);
      }

      navigate('/expenses');
    } catch (err) {
      console.warn('Submission fallback completed:', err);
      navigate('/expenses');
    } finally {
      setSubmitting(false);
    }
  };

  // Policy Checks
  const numAmount = parseFloat(formData.amount) || 0;
  const isHighSpend = numAmount > 25000;
  const isMealCapExceeded = formData.category.includes('Dining') && numAmount > 5000;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <Check className="size-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header & Back Action */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigate('/expenses')}
              className="size-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {existingDraftId ? `Editing Draft Claim (${existingDraftId})` : 'New Expense Claim'}
            </h1>
            {existingDraftId && (
              <Badge variant="outline" className="text-xs font-semibold bg-slate-100 dark:bg-slate-800">
                Draft Mode
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-10">
            Submit an invoice with proof of purchase for audit and reimbursement sign-off.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Claim Information Card */}
        <Card className="shadow-xs border-border">
          <CardHeader className="p-5 pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Expense Information</CardTitle>
            <CardDescription className="text-xs">
              Basic merchant, project code and purpose specifics
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Row 1: Merchant & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="merchant">
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
                    className="pl-9 h-10 text-xs sm:text-sm bg-card"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="title">
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
                    className="pl-9 h-10 text-xs sm:text-sm bg-card"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Category, Amount, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="category">
                  Category *
                </label>
                <CustomSelect
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-lg text-xs sm:text-sm bg-card border-border"
                  options={[
                    { value: "Travel & Flights", label: "Travel & Flights" },
                    { value: "Accommodation", label: "Accommodation" },
                    { value: "Food & Dining", label: "Food & Dining" },
                    { value: "Software & Cloud", label: "Software & Cloud" },
                    { value: "Office Equipment", label: "Office Equipment" },
                    { value: "Fuel & Transit", label: "Fuel & Transit" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="amount">
                  Amount (INR ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
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
                    className="pl-8 h-10 text-xs sm:text-sm font-semibold bg-card font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="date">
                  Expense Date *
                </label>
                <CustomDatePicker
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  maxDate={new Date().toISOString().split('T')[0]}
                  triggerClassName="h-10 rounded-lg text-xs sm:text-sm bg-card border-border"
                />
              </div>
            </div>

            {/* Row 3: Department & Project Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="department">
                  Department
                </label>
                <CustomSelect
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-lg text-xs sm:text-sm bg-card border-border"
                  options={[
                    { value: "Engineering & DevOps", label: "Engineering & DevOps" },
                    { value: "Finance & Accounts", label: "Finance & Accounts" },
                    { value: "Growth & Marketing", label: "Growth & Marketing" },
                    { value: "Enterprise Sales", label: "Enterprise Sales" },
                    { value: "People & Operations", label: "People & Operations" },
                    { value: "Executive Management", label: "Executive Management" },
                    { value: "Engineering", label: "Engineering" },
                    { value: "Finance", label: "Finance & Operations" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="project">
                  Project Code / Cost Allocation
                </label>
                <CustomSelect
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-lg text-xs sm:text-sm bg-card border-border"
                  options={[
                    { value: "PRJ-Alpha (Cloud Migration)", label: "PRJ-Alpha (Cloud Migration)" },
                    { value: "PRJ-Beta (Mobile App Redesign)", label: "PRJ-Beta (Mobile App Redesign)" },
                    { value: "PRJ-Gamma (Enterprise Onboarding)", label: "PRJ-Gamma (Enterprise Onboarding)" },
                    { value: "PRJ-Internal (General Operations)", label: "PRJ-Internal (General Operations)" },
                  ]}
                />
              </div>
            </div>

            {/* Row 4: Business Justification */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="description">
                Business Justification / Notes
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain how this expense benefits company operations, customer success, or project delivery..."
                className="w-full p-3 rounded-lg border border-border bg-card text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Real-time Policy Screening Callout */}
        {(isHighSpend || isMealCapExceeded) && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-3 animate-in fade-in">
            <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <span className="font-bold block">Policy Flag Notice</span>
              {isHighSpend && (
                <p>Expenses exceeding ₹25,000 require dual approval from Department Head and Finance VP.</p>
              )}
              {isMealCapExceeded && (
                <p>Meal claim exceeds standard single-meal limit of ₹5,000. Please attach an itemized guest list in notes.</p>
              )}
            </div>
          </div>
        )}

        {/* Receipt Proof Upload Dropzone Card */}
        <Card id="receiptCard" className={`shadow-xs border-border transition-all ${receiptError ? 'ring-2 ring-destructive/80' : ''}`}>
          <CardHeader className="p-5 pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span>Receipt & Proof Document</span>
                <span className="text-destructive font-bold text-sm">*</span>
                <Badge variant="outline" className="text-[10px] font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400">
                  Mandatory
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Upload invoice or receipt photo as mandatory proof for manager audit and sign-off
              </CardDescription>
            </div>
            {proofData && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={14} />
                Proof Ready for Manager
              </span>
            )}
          </CardHeader>

          <CardContent className="p-5">
            {receiptError && (
              <div className="mb-4 p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-medium animate-in fade-in">
                <AlertTriangle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{receiptError}</span>
              </div>
            )}

            <div className="relative">
              <input
                id="receiptUpload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {!proofData ? (
                <label
                  htmlFor="receiptUpload"
                  className="border-2 border-dashed border-border hover:border-foreground/40 bg-muted/20 hover:bg-muted/40 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-3">
                    <UploadCloud className="size-6" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Click to upload receipt photo or PDF, or drag and drop
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, JPEG, WEBP or PDF up to 10MB <strong className="text-destructive font-semibold">(Mandatory)</strong>
                  </p>
                </label>
              ) : (
                <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    {proofData.previewUrl ? (
                      <div
                        className="size-16 rounded-lg overflow-hidden border border-border shrink-0 cursor-pointer relative group"
                        onClick={() => setImagePreviewModalOpen(true)}
                        title="Click to view full receipt image"
                      >
                        <img
                          src={proofData.previewUrl}
                          alt="Receipt Preview"
                          className="size-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <ZoomIn className="size-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText className="size-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-foreground block truncate max-w-sm">
                        {proofData.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono block">
                        {formatFileSize(proofData.size)} • Proof ready for manager review
                      </span>
                      {proofData.previewUrl && (
                        <button
                          type="button"
                          onClick={() => setImagePreviewModalOpen(true)}
                          className="text-[11px] text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <ZoomIn className="size-3" /> Enlarge Proof
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="receiptUpload"
                      className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
                    >
                      Change
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="size-8 p-0 rounded-full text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Remove Receipt"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons: Responsive & Mobile Friendly Sticky Bar */}
        <div className="sticky bottom-0 sm:static bg-background/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-3.5 sm:p-0 -mx-4 sm:mx-0 border-t border-border sm:border-0 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shadow-lg sm:shadow-none">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/expenses')}
            className="text-xs h-10 px-4 cursor-pointer w-full sm:w-auto order-3 sm:order-none"
          >
            Cancel
          </Button>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              disabled={savingDraft || submitting}
              onClick={handleSaveDraft}
              className="text-xs h-10 px-4 gap-2 cursor-pointer w-full sm:w-auto font-medium"
            >
              <Bookmark className="size-3.5" />
              <span>{savingDraft ? 'Saving Draft...' : 'Save as Draft'}</span>
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              className="text-xs sm:text-sm h-11 sm:h-10 px-6 gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-semibold w-full sm:w-auto shadow-md"
            >
              {submitting ? (
                <span>Submitting Claim...</span>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>{existingDraftId ? 'Submit Draft for Approval' : 'Submit Claim for Approval'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Lightbox Modal */}
      {proofData?.previewUrl && (
        <Modal
          isOpen={imagePreviewModalOpen}
          onClose={() => setImagePreviewModalOpen(false)}
          title="Receipt Proof Preview (Manager Review)"
          maxWidth="700px"
          footer={
            <Button variant="secondary" size="sm" onClick={() => setImagePreviewModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b">
              <span><strong>File:</strong> {proofData.name} ({formatFileSize(proofData.size)})</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> Visible to manager during approval
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border bg-muted/30 flex items-center justify-center p-2">
              <img
                src={proofData.previewUrl}
                alt="Proof Preview"
                className="max-h-[500px] w-auto max-w-full rounded object-contain shadow-sm"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateExpense;
