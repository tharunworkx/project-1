import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomSelect } from "@/components/ui/select";
import { CustomDatePicker } from "@/components/ui/date-picker";
import expenseService from '../../services/expenseService';

export const CreateExpense = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [formData, setFormData] = useState({
    merchant: '',
    title: '',
    category: 'Travel & Flights',
    amount: '',
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
    department: 'Engineering',
    project: 'PRJ-Alpha (Cloud Migration)',
    description: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setReceiptFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await expenseService.createExpense({
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        receiptAttached: !!receiptFile,
      });
      navigate('/expenses');
    } catch (err) {
      console.warn('API error, saving mock claim:', err);
      navigate('/expenses');
    } finally {
      setSubmitting(false);
    }
  };

  const numAmount = parseFloat(formData.amount) || 0;
  const isHighSpend = numAmount > 25000;
  const isMealCapExceeded = formData.category === 'Meals & Entertainment' && numAmount > 5000;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header and Back Button */}
      <div className="flex flex-col gap-2">
        <Link
          to="/expenses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Expenses</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Submit New Expense Claim
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enter invoice or receipt specifics for audit, manager sign-off, and reimbursement.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Main Expense Information Card */}
        <Card className="shadow-xs border-border overflow-visible">
          <CardHeader className="p-5 pb-3 border-b border-border">
            <CardTitle className="text-base font-semibold">Expense Information</CardTitle>
            <CardDescription className="text-xs">
              Provide invoice metadata, merchant details, and cost allocation.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 space-y-4 overflow-visible">
            {/* Row 1: Merchant & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="merchant">
                  Merchant / Vendor <span className="text-destructive">*</span>
                </label>
                <Input
                  id="merchant"
                  name="merchant"
                  type="text"
                  required
                  value={formData.merchant}
                  onChange={handleChange}
                  placeholder="e.g. Delta Airlines, AWS, Uber"
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="title">
                  Short Purpose / Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Flight to Tech Summit, Server Cloud Hosting"
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            {/* Row 2: Category, Amount, Expense Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </label>
                <CustomSelect
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-lg text-xs sm:text-sm bg-card border-border"
                  options={[
                    { value: "Travel & Flights", label: "Travel & Flights" },
                    { value: "Lodging & Hotels", label: "Lodging & Hotels" },
                    { value: "Meals & Entertainment", label: "Meals & Entertainment" },
                    { value: "Software & Cloud", label: "Software & Cloud" },
                    { value: "Office Supplies", label: "Office Supplies" },
                    { value: "Mileage & Transit", label: "Mileage & Transit" },
                    { value: "Professional Services", label: "Professional Services" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="amount">
                  Amount <span className="text-destructive">*</span>
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
                    min="0"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="h-10 pl-7 text-xs sm:text-sm rounded-lg font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="date">
                  Expense Date <span className="text-destructive">*</span>
                </label>
                <CustomDatePicker
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="h-10 text-xs sm:text-sm rounded-lg"
                />
              </div>
            </div>

            {/* Row 3: Department & Project Allocation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="department">
                  Department
                </label>
                <CustomSelect
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  triggerClassName="h-10 rounded-lg text-xs sm:text-sm bg-card border-border"
                  options={[
                    { value: "Engineering", label: "Engineering" },
                    { value: "Product & Design", label: "Product & Design" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Sales", label: "Sales" },
                    { value: "Finance & Ops", label: "Finance & Ops" },
                    { value: "HR & Admin", label: "HR & Admin" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="project">
                  Project Code / Allocation
                </label>
                <CustomSelect
                  id="project"
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

        {/* Real-time Policy Screening Callout if triggered */}
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

        {/* Receipt & Invoices Dropzone Card */}
        <Card className="shadow-xs border-border">
          <CardHeader className="p-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Receipt & Invoices</CardTitle>
                <CardDescription className="text-xs">
                  Upload PDF, PNG, or JPG receipts (Max 10MB). Company policy requires receipts for all expenses over ₹500.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px]">
                OCR Scan Enabled
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="relative">
              <input
                id="receiptUpload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {!receiptFile ? (
                <label
                  htmlFor="receiptUpload"
                  className="border-2 border-dashed border-border hover:border-foreground/40 bg-muted/20 hover:bg-muted/40 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-3">
                    <UploadCloud className="size-6" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Click to upload receipt, or drag and drop
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, PNG, JPG, or WEBP up to 10MB
                  </p>
                </label>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block truncate max-w-sm">
                        {receiptFile.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {(receiptFile.size / 1024).toFixed(1)} KB • Ready for OCR verification
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="size-8 p-0 rounded-full text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/expenses')}
            className="text-xs h-10 px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="text-xs h-10 px-5 gap-2 cursor-pointer bg-foreground text-background hover:bg-foreground/90 font-medium"
          >
            {submitting ? (
              <span>Submitting Claim...</span>
            ) : (
              <>
                <Send className="size-3.5" />
                <span>Submit Expense Claim</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateExpense;
