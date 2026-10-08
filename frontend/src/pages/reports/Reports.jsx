import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  FileCode,
  RotateCcw,
  Eye,
  ArrowUpDown,
  Search,
  Building,
  User,
  PieChart,
  ShieldAlert,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterSelect from '@/components/common/FilterSelect';
import { useAuth } from '@/context/AuthContext';
import { useFinanceRole } from '@/hooks/useFinanceRole';
import { useToast } from '@/context/ToastContext';
import reportMockService, { REPORT_TYPES } from '@/services/mock/reportMockService';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/currency';
import { mockDepartments, mockEmployees, mockCategories } from '@/services/mock/financeMockData';
import FinanceDashboard from '../finance/FinanceDashboard';

export const Reports = () => {
  const { user } = useAuth();
  const { isEmployee, canGenerateAllReports, role } = useFinanceRole();
  const { toastSuccess, toastInfo, toastError } = useToast();

  const [activeTab, setActiveTab] = useState('generator'); // 'generator' or 'analytics'

  // Generation Criteria Form
  const [formData, setFormData] = useState({
    reportType: 'Expense Report',
    dateRange: 'This Month (Oct 2026)',
    department: 'All',
    employee: 'All',
    category: 'All',
    project: 'All Projects',
    status: 'All Statuses',
    currency: 'INR',
  });

  const [generating, setGenerating] = useState(false);
  const [reportResult, setReportResult] = useState(null);

  // Pagination for report preview table
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Search within generated preview
  const [previewSearch, setPreviewSearch] = useState('');

  const handleGenerate = async (e) => {
    e?.preventDefault?.();
    setGenerating(true);
    try {
      const generated = await reportMockService.generateReport({
        ...formData,
        user: user?.name,
      });
      setReportResult(generated);
      setCurrentPage(1);
      toastSuccess(`Generated ${formData.reportType} with ${generated.records?.length || 0} records`, 'Report Ready');
    } catch (err) {
      toastError('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    // Generate initial default report on page load
    handleGenerate();
  }, []);

  const handleResetFilters = () => {
    setFormData({
      reportType: 'Expense Report',
      dateRange: 'This Month (Oct 2026)',
      department: 'All',
      employee: 'All',
      category: 'All',
      project: 'All Projects',
      status: 'All Statuses',
      currency: 'INR',
    });
    setPreviewSearch('');
    toastInfo('Report filters reset to standard defaults');
  };

  const handleExport = async (format) => {
    if (!reportResult) return;
    try {
      await reportMockService.exportReport(reportResult, format);
      if (format === 'pdf') {
        window.print();
      } else {
        toastSuccess(`Successfully downloaded ${reportResult.title} as .${format === 'excel' ? 'xlsx / csv' : 'csv'}`);
      }
    } catch (e) {
      toastError(`Failed to export report in ${format} format`);
    }
  };

  // Filter preview records by local search
  const filteredRecords = (reportResult?.records || []).filter((r) => {
    if (!previewSearch) return true;
    const q = previewSearch.toLowerCase();
    return (
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.primaryText && r.primaryText.toLowerCase().includes(q)) ||
      (r.secondaryText && r.secondaryText.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q)) ||
      (r.department && r.department.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full min-w-0 space-y-6 animate-fade-in">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Financial Report and Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit-grade reporting engine for statutory filings, departmental spend allocations, and treasury exports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Report Generator & Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Analytics Overview
          </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <FinanceDashboard />
      ) : (
        <div className="w-full min-w-0 space-y-6">
          {/* 1. Report Generation Interface Form Card */}
          <Card className="shadow-xs border-border/80 w-full min-w-0 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Filter className="size-4 text-primary" />
                <span>Configure Report Criteria</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Select category, timeline, dimensions, and currency to compile audit records
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Report Type */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Report Category <span className="text-destructive">*</span>
                    </label>
                    <FilterSelect
                      value={formData.reportType}
                      onChange={(val) => setFormData({ ...formData, reportType: val })}
                      options={REPORT_TYPES}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Date Range
                    </label>
                    <FilterSelect
                      value={formData.dateRange}
                      onChange={(val) => setFormData({ ...formData, dateRange: val })}
                      options={[
                        { value: 'This Month (Oct 2026)', label: 'This Month (Oct 2026)' },
                        { value: 'Last Month (Sep 2026)', label: 'Last Month (Sep 2026)' },
                        { value: 'Q3 2026 (Jul–Sep)', label: 'Q3 2026 (Jul–Sep)' },
                        { value: 'Q4 2026 (Oct–Dec)', label: 'Q4 2026 (Oct–Dec)' },
                        { value: 'Annual FY 2026', label: 'Annual FY 2026' },
                        { value: 'Custom Range', label: 'Custom Audit Interval' },
                      ]}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Department
                    </label>
                    <FilterSelect
                      value={formData.department}
                      onChange={(val) => setFormData({ ...formData, department: val })}
                      options={[
                        { value: 'All', label: 'All Departments' },
                        ...mockDepartments.map((d) => ({ value: d, label: d })),
                      ]}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Employee */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Employee
                    </label>
                    <FilterSelect
                      value={formData.employee}
                      onChange={(val) => setFormData({ ...formData, employee: val })}
                      options={[
                        { value: 'All', label: 'All Employees' },
                        ...mockEmployees.map((emp) => ({
                          value: emp.name,
                          label: `${emp.name} (${emp.id})`,
                        })),
                      ]}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Expense Category */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Expense Category
                    </label>
                    <FilterSelect
                      value={formData.category}
                      onChange={(val) => setFormData({ ...formData, category: val })}
                      options={[
                        { value: 'All', label: 'All Categories' },
                        ...mockCategories.map((c) => ({ value: c, label: c })),
                      ]}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Project */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Project Allocation
                    </label>
                    <FilterSelect
                      value={formData.project}
                      onChange={(val) => setFormData({ ...formData, project: val })}
                      options={[
                        { value: 'All Projects', label: 'All Projects' },
                        { value: 'Cloud Modernization', label: 'Cloud Modernization' },
                        { value: 'APAC Expansion', label: 'APAC Expansion' },
                        { value: 'Core Platform v4', label: 'Core Platform v4' },
                        { value: 'General Operations', label: 'General Operations' },
                      ]}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Expense / Claim Status
                    </label>
                    <FilterSelect
                      value={formData.status}
                      onChange={(val) => setFormData({ ...formData, status: val })}
                      options={[
                        { value: 'All Statuses', label: 'All Statuses' },
                        { value: 'Approved', label: 'Approved' },
                        { value: 'Reimbursed', label: 'Reimbursed' },
                        { value: 'Pending', label: 'Pending Audit' },
                        { value: 'Flagged', label: 'Policy Flagged' },
                      ]}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Reporting Currency
                    </label>
                    <FilterSelect
                      value={formData.currency}
                      onChange={(val) => setFormData({ ...formData, currency: val })}
                      options={[
                        { value: 'INR', label: 'INR (₹ - Indian Rupee)' },
                        { value: 'USD', label: 'USD ($ - US Dollar)' },
                        { value: 'EUR', label: 'EUR (€ - Euro)' },
                      ]}
                      buttonClassName="h-8.5 bg-background border-border text-xs"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleResetFilters}
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Reset Filters</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="gap-1.5 text-xs shadow-xs"
                      disabled={generating}
                    >
                      <Eye className="size-3.5" />
                      <span>{generating ? 'Compiling Report...' : 'Generate Report'}</span>
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 2. Professional Report Preview Table Card */}
          {reportResult && (
            <Card className="shadow-xs border-border/80 w-full min-w-0 overflow-hidden">
              <CardHeader className="space-y-3 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-bold text-foreground">
                        {reportResult.title}
                      </CardTitle>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                        Generated Live
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Compiled at {formatDateTime(reportResult.generatedAt)} by {reportResult.generatedBy}
                    </CardDescription>
                  </div>

                  {/* Export Options: CSV, Excel, PDF */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 sm:flex-initial gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs cursor-pointer"
                      onClick={() => handleExport('csv')}
                    >
                      <Download className="size-3" />
                      <span>Export CSV</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 sm:flex-initial gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs cursor-pointer"
                      onClick={() => handleExport('excel')}
                    >
                      <FileSpreadsheet className="size-3" />
                      <span>Export Excel</span>
                    </Button>

                    <Button
                      size="sm"
                      className="h-8 flex-1 sm:flex-initial gap-1.5 text-xs rounded-full shadow-2xs bg-primary text-primary-foreground cursor-pointer"
                      onClick={() => handleExport('pdf')}
                    >
                      <Printer className="size-3" />
                      <span>Print / PDF</span>
                    </Button>
                  </div>
                </div>

                {/* Applied Filters Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Applied Criteria:
                  </span>
                  {Object.entries(reportResult.filtersApplied || {}).map(([key, val]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className="text-[10px] font-normal px-2 py-0.5 bg-muted/30"
                    >
                      <span className="text-muted-foreground mr-1 capitalize">{key}:</span>
                      <strong className="text-foreground">{val}</strong>
                    </Badge>
                  ))}
                </div>

                {/* Summary Metrics Row */}
                {reportResult.summaryMetrics && (
                  <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Total Records
                      </span>
                      <span className="text-base font-bold text-foreground mt-0.5 block">
                        {reportResult.summaryMetrics.totalRecords || 0}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Total Amount
                      </span>
                      <span className="text-base font-bold text-foreground mt-0.5 block">
                        {formatCurrency(reportResult.summaryMetrics.totalAmount || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Settled / Approved
                      </span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                        {reportResult.summaryMetrics.settledCount || reportResult.summaryMetrics.approvedCount || 0} Records
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Average Item Size
                      </span>
                      <span className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                        {formatCurrency(reportResult.summaryMetrics.averageClaimAmount || 0)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Search within report preview */}
                <div className="pt-1 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between w-full">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Filter records..."
                      value={previewSearch}
                      onChange={(e) => {
                        setPreviewSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 pl-8 text-xs bg-muted/50 border-border/80 w-full"
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground self-start sm:self-auto shrink-0">
                    Showing {paginatedRecords.length} of {filteredRecords.length} records
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <Table className="w-full min-w-[750px]">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-6">IDENTIFIER</TableHead>
                        <TableHead>PRIMARY ENTITY</TableHead>
                        <TableHead>DIMENSION / NOTE</TableHead>
                        <TableHead>CATEGORY</TableHead>
                        <TableHead>DEPARTMENT</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="pr-6 text-right">AMOUNT (₹)</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                            No records in this report preview.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRecords.map((row, idx) => (
                          <TableRow key={row.id || idx}>
                            <TableCell className="pl-6 font-mono text-xs font-semibold text-foreground">
                              {row.id}
                            </TableCell>

                            <TableCell className="text-xs font-semibold text-foreground">
                              {row.primaryText}
                            </TableCell>

                            <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                              {row.secondaryText || row.notes || '—'}
                            </TableCell>

                            <TableCell className="text-xs font-medium text-foreground">
                              {row.category || 'General'}
                            </TableCell>

                            <TableCell className="text-xs text-muted-foreground">
                              {row.department || '—'}
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline" className="text-[10px] font-normal">
                                {row.status || 'Verified'}
                              </Badge>
                            </TableCell>

                            <TableCell className="pr-6 text-right font-mono text-xs font-bold text-foreground">
                              {formatCurrency(row.amount || row.spent || 0)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Report Total Footer & Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">
                      Grand Total Amount:
                    </span>
                    <span className="text-sm font-bold text-primary font-mono">
                      {formatCurrency(reportResult.totalAmount || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs cursor-pointer"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      >
                        <ChevronLeft className="size-3.5" />
                        <span className="sr-only">Previous page</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs cursor-pointer"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      >
                        <ChevronRight className="size-3.5" />
                        <span className="sr-only">Next page</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
