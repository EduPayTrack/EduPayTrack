import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

import { apiFetch } from '../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '../../../components/ui/dialog';
import { formatCurrency, formatDate } from '../../lib/utils';

const FEE_TYPES = [
  { value: 'tuition', label: 'Tuition' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'exam', label: 'Exam' },
  { value: 'library', label: 'Library' },
  { value: 'other', label: 'Other' },
];

export function FeeStructurePage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [program, setProgram] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [feeType, setFeeType] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('TERTIARY');

  const loadFees = async () => {
    setLoading(true);
    try {
      const result = await apiFetch<any[]>('/admin/fee-structures');
      setFees(result || []);
    } catch {
      toast.error('Failed to load fee structures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFees(); }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setAmount('');
    setProgram('');
    setAcademicYear('');
    setDueDate('');
    setFeeType('');
    setSchoolLevel('TERTIARY');
  };

  const handleEditClick = (fee: any) => {
    setEditId(fee.id);
    setTitle(fee.title || '');
    setAmount(fee.amount?.toString() || '');
    setProgram(fee.program || '');
    setAcademicYear(fee.academicYear || '');
    setDueDate(fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '');
    setFeeType(fee.feeType || '');
    setSchoolLevel(fee.schoolLevel || 'TERTIARY');
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!title || !amount) {
      toast.error('Title and amount are required');
      return;
    }
    setCreating(true);
    try {
      const payload: Record<string, any> = {
        title,
        amount: Number(amount),
        program: program && program !== 'none' ? program : undefined,
        academicYear: academicYear && academicYear !== 'none' ? academicYear : undefined,
        dueDate: dueDate || null,
        feeType: feeType && feeType !== 'none' ? feeType : null,
        schoolLevel,
      };

      if (editId) {
        await apiFetch(`/admin/fee-structures/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast.success('Fee structure updated');
      } else {
        await apiFetch('/admin/fee-structures', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Fee structure created');
      }
      setShowCreate(false);
      resetForm();
      loadFees();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/admin/fee-structures/${id}`, { method: 'DELETE' });
      toast.success('Fee structure deleted');
      setDeletingId(null);
      loadFees();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1000px] animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Fee Structure</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage tuition and fee schedules with payment deadlines</p>
        </div>
        <Button size="sm" className="gap-1.5 h-8" onClick={() => { resetForm(); setShowCreate(true); }}>
          <Plus className="h-3.5 w-3.5" /> Add Fee
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 rounded" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((f: any) => (
                  <TableRow key={f.id}>
                    <TableCell className="text-[13px] font-medium">{f.title}</TableCell>
                    <TableCell className="text-[13px]"><Badge variant="secondary" className="text-[10px]">{f.schoolLevel}</Badge></TableCell>
                    <TableCell className="text-[13px]">
                      {f.feeType ? (
                        <Badge variant="outline" className="text-[11px] capitalize">{f.feeType}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px]">{f.program || 'All'}</TableCell>
                    <TableCell className="text-[13px]">{f.academicYear || f.classLevel || '—'}</TableCell>
                    <TableCell className="text-[13px]">
                      {f.dueDate ? (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {formatDate(f.dueDate)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No deadline</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px] font-medium">{formatCurrency(Number(f.amount))}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEditClick(f)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeletingId(f.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {fees.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No fee structures defined</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Fee Structure' : 'Add Fee Structure'}</DialogTitle>
            <DialogDescription>
              Define the amount, criteria, and payment deadline for this fee schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[13px] font-medium">Title *</label><Input value={title} onChange={(e: any) => setTitle(e.target.value)} placeholder="Semester 1 Tuition" className="h-10" /></div>
              <div>
                <label className="text-[13px] font-medium">School Level</label>
                <Select value={schoolLevel} onValueChange={setSchoolLevel}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIMARY">Primary</SelectItem>
                    <SelectItem value="SECONDARY">Secondary</SelectItem>
                    <SelectItem value="TERTIARY">Tertiary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><label className="text-[13px] font-medium">Amount (MWK) *</label><Input type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder="0" className="h-10" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[13px] font-medium">Program</label><Input value={program} onChange={(e: any) => setProgram(e.target.value)} placeholder="All Programs" className="h-10" /></div>
              <div><label className="text-[13px] font-medium">Year</label><Input value={academicYear} onChange={(e: any) => setAcademicYear(e.target.value)} placeholder="All Years" className="h-10" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Payment Deadline
                </label>
                <Input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e: any) => setDueDate(e.target.value)} 
                  className="h-10" 
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Shows on student payment calendar
                </p>
              </div>
              <div>
                <label className="text-[13px] font-medium">Fee Type</label>
                <Select value={feeType || 'none'} onValueChange={(v) => setFeeType(v === 'none' ? '' : v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No type</SelectItem>
                    {FEE_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Categorizes fee on calendar
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={creating}>{creating ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Fee Structure</DialogTitle>
            <DialogDescription>
              Delete this fee structure? This will recalculate all student balances.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
