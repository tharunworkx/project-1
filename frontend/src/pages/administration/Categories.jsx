import React, { useState } from 'react';
import {
  Plus,
  FolderTree,
  Check,
  X,
  Search,
  Download,
  EllipsisVertical,
  Edit2,
  Archive,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Tag,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Modal from '../../components/common/Modal';

const initialCategories = [
  { id: 'CAT-1', name: 'Travel & Flight', cap: '₹50,000.00', requireReceiptAbove: '₹500.00', taxDeductible: true, status: 'Active' },
  { id: 'CAT-2', name: 'Food & Dining', cap: '₹5,000.00', requireReceiptAbove: '₹200.00', taxDeductible: false, status: 'Active' },
  { id: 'CAT-3', name: 'Fuel & Transit', cap: '₹8,000.00', requireReceiptAbove: '₹300.00', taxDeductible: true, status: 'Active' },
  { id: 'CAT-4', name: 'Software & Tools', cap: '₹1,00,000.00', requireReceiptAbove: 'Always Required', taxDeductible: true, status: 'Active' },
  { id: 'CAT-5', name: 'Office Equipment', cap: '₹25,000.00', requireReceiptAbove: '₹500.00', taxDeductible: true, status: 'Active' },
  { id: 'CAT-6', name: 'Accommodation', cap: '₹35,000.00', requireReceiptAbove: 'Always Required', taxDeductible: true, status: 'Active' },
  { id: 'CAT-7', name: 'Client Entertainment', cap: '₹15,000.00', requireReceiptAbove: '₹500.00', taxDeductible: false, status: 'Active' },
];

export const Categories = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    cap: '',
    requireReceiptAbove: '500',
    taxDeductible: true,
  });

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    const numCap = parseFloat(formData.cap) || 10000;
    const newCat = {
      id: `CAT-${categories.length + 1}`,
      name: formData.name,
      cap: `₹${numCap.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      requireReceiptAbove: formData.requireReceiptAbove ? `> ₹${formData.requireReceiptAbove}` : 'Always Required',
      taxDeductible: formData.taxDeductible,
      status: 'Active',
    };
    setCategories([...categories, newCat]);
    setModalOpen(false);
    setFormData({ name: '', cap: '', requireReceiptAbove: '500', taxDeductible: true });
    setNotification(`Category "${formData.name}" created successfully`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleToggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Archived' : 'Active' } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Datatable Card matching Image 2 */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Expense Categories
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Configure spending categories, single-claim caps, and receipt requirement thresholds
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background shadow-xs"
              />
            </div>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xs"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="size-3.5" />
              <span>New Category</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs">
              <Download className="size-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">CATEGORY NAME</TableHead>
                <TableHead>SINGLE CLAIM CAP</TableHead>
                <TableHead>RECEIPT REQUIRED</TableHead>
                <TableHead>TAX DEDUCTIBLE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No categories found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                          <Tag className="size-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {cat.cap}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {cat.requireReceiptAbove}
                    </TableCell>
                    <TableCell>
                      {cat.taxDeductible ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium">
                          Eligible (100%)
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-medium text-muted-foreground">
                          Non-deductible
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {cat.status === 'Active' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-medium text-muted-foreground">
                          Archived
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                            <EllipsisVertical className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <Edit2 className="size-4" />
                            <span>Edit Thresholds</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-muted-foreground flex items-center gap-2"
                            onClick={() => handleToggleStatus(cat.id)}
                          >
                            <Archive className="size-4" />
                            <span>{cat.status === 'Active' ? 'Archive Category' : 'Restore Category'}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Datatable Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Showing 1 to {filtered.length} of {categories.length} categories
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs" disabled>
                <ChevronLeft className="size-3.5" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs" disabled={filtered.length <= 10}>
                <ChevronRight className="size-3.5" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Expense Category"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Category Name *</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Training & Certifications"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Single Claim Cap (₹) *</label>
              <Input
                type="number"
                required
                value={formData.cap}
                onChange={(e) => setFormData({ ...formData, cap: e.target.value })}
                placeholder="e.g. 20000"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Receipt Required Above (₹)</label>
              <Input
                type="number"
                value={formData.requireReceiptAbove}
                onChange={(e) => setFormData({ ...formData, requireReceiptAbove: e.target.value })}
                placeholder="e.g. 500"
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="taxDeductible"
              checked={formData.taxDeductible}
              onCheckedChange={(checked) => setFormData({ ...formData, taxDeductible: checked })}
            />
            <label htmlFor="taxDeductible" className="text-xs text-foreground font-medium cursor-pointer">
              Eligible for corporate tax deduction (100%)
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
