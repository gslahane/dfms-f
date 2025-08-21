// src/components/TaxMaster.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Plus, Trash2, Pencil } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const TAX_TYPES = ['PERCENTAGE', 'FIXED'] as const;
type TaxType = typeof TAX_TYPES[number] | 'All';

interface Tax {
  id: number | string;
  code: string;
  taxName: string;
  taxType: "PERCENTAGE" | "FIXED";
  taxPercentage: number;
  fixedAmount: number;
  status: "ACTIVE" | "INACTIVE";
}

export default function TaxMaster() {
  const { toast } = useToast();
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // filter
  const [filterType, setFilterType] = useState<TaxType>('All');

  // dialog + form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [form, setForm] = useState<Partial<Tax>>({
    code: '',
    taxName: '',
    taxType: 'PERCENTAGE',
    taxPercentage: 0,
    fixedAmount: 0,
    status: "ACTIVE",
  });

  useEffect(() => { fetchTaxes(); }, []);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/tax-master`);
      setTaxes(res.data || []);
    } catch (err) {
      toast({
        title: "Error fetching taxes",
        description: "Could not load tax data. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const filtered = useMemo(
    () =>
      taxes.filter(t =>
        filterType === 'All' ? true : t.taxType === filterType
      ),
    [taxes, filterType]
  );

  const resetForm = () => {
    setForm({
      code: '',
      taxName: '',
      taxType: 'PERCENTAGE',
      taxPercentage: 0,
      fixedAmount: 0,
      status: "ACTIVE",
    });
    setIsEdit(false);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setIsEdit(false);
    setDialogOpen(true);
  };

  const openEdit = (t: Tax) => {
    setForm({
      id: t.id,
      code: t.code,
      taxName: t.taxName,
      taxType: t.taxType,
      taxPercentage: t.taxPercentage,
      fixedAmount: t.fixedAmount,
      status: t.status,
    });
    setIsEdit(true);
    setEditingId(t.id);
    setDialogOpen(true);
  };

  const numberOrZero = (val: any) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
    };

  const handleSave = async () => {
    if (!form.code || !form.taxName || !form.taxType) {
      toast({
        title: "Missing Fields",
        description: "Code, Name and Type are required.",
        variant: "destructive"
      });
      return;
    }

    if (form.taxType === 'PERCENTAGE' && (form.taxPercentage === undefined || form.taxPercentage === null)) {
      toast({
        title: "Percentage required",
        description: "Please enter tax percentage.",
        variant: "destructive"
      });
      return;
    }
    if (form.taxType === 'FIXED' && (form.fixedAmount === undefined || form.fixedAmount === null)) {
      toast({
        title: "Fixed amount required",
        description: "Please enter fixed amount.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: String(form.code || '').trim().toUpperCase(),
        taxName: String(form.taxName || '').trim(),
        taxType: form.taxType,
        taxPercentage: form.taxType === 'PERCENTAGE' ? numberOrZero(form.taxPercentage) : 0,
        fixedAmount: form.taxType === 'FIXED' ? numberOrZero(form.fixedAmount) : 0,
        // for create we keep ACTIVE; for edit we keep current form.status (toggle still exists in table)
        status: isEdit ? (form.status || "ACTIVE") : "ACTIVE",
      };

      if (isEdit && editingId !== null) {
        await axios.put(`${baseURL}/api/tax-master/${editingId}`, payload);
        toast({ title: "Tax Updated", description: "Tax updated successfully." });
      } else {
        await axios.post(`${baseURL}/api/tax-master`, payload);
        toast({ title: "Tax Added", description: "New tax added successfully." });
      }

      setDialogOpen(false);
      resetForm();
      fetchTaxes();
    } catch {
      toast({
        title: isEdit ? "Error Updating Tax" : "Error Adding Tax",
        description: isEdit ? "Could not update tax." : "Could not add new tax.",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const removeTax = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this tax?")) return;
    try {
      await axios.delete(`${baseURL}/api/tax-master/${id}`);
      toast({ title: "Tax Deleted", description: "Tax deleted successfully." });
      fetchTaxes();
    } catch {
      toast({
        title: "Error Deleting Tax",
        description: "Could not delete tax.",
        variant: "destructive"
      });
    }
  };

  // Use status string instead of isActive boolean
  const toggleStatus = async (id: number | string, currentStatus: "ACTIVE" | "INACTIVE") => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await axios.put(`${baseURL}/api/tax-master/${id}/status?status=${newStatus}`);
      fetchTaxes();
      toast({
        title: "Status Changed",
        description: `Tax is now ${newStatus}.`
      });
    } catch {
      toast({
        title: "Status Change Failed",
        description: "Could not update status.",
        variant: "destructive"
      });
    }
  };

  const handleFormChange = (key: keyof Tax, value: any) => {
    setForm((f) => {
      // when switching type, clear the other numeric field to avoid stale values
      if (key === "taxType") {
        if (value === "PERCENTAGE") {
          return { ...f, taxType: value, fixedAmount: 0 };
        } else if (value === "FIXED") {
          return { ...f, taxType: value, taxPercentage: 0 };
        }
      }
      return { ...f, [key]: value };
    });
  };

  return (
    <div className="p-2 bg-gray-50 min-h-[calc(100vh-64px)]">
      <Card className="border border-gray-100 rounded-xl shadow-sm max-w-6xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-6 pt-6 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Tax-Deduction Master</CardTitle>
            <p className="mt-1 text-gray-500 text-sm">Define & Manage Tax Codes & Rates</p>
          </div>
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Filter Type</label>
              <select
                className="w-40 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-100"
                value={filterType}
                onChange={e => setFilterType(e.target.value as TaxType)}
              >
                <option>All</option>
                {TAX_TYPES.map(tt => (
                  <option key={tt}>{tt}</option>
                ))}
              </select>
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" variant="default" onClick={openCreate}>
                  <Plus className="w-4 h-4" /> Add Tax
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg w-full p-0">
                <DialogHeader className="bg-blue-50 rounded-t-lg px-6 py-4 border-b">
                  <DialogTitle className="text-lg font-semibold">
                    {isEdit ? "Edit Tax" : "Add New Tax"}
                  </DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                  className="p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Tax Code <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={form.code || ""}
                        onChange={e => handleFormChange('code', e.target.value)}
                        placeholder="e.g. CGST"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Tax Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={form.taxName || ""}
                        onChange={e => handleFormChange('taxName', e.target.value)}
                        placeholder="e.g. Central GST"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                        value={form.taxType || 'PERCENTAGE'}
                        onChange={e => handleFormChange('taxType', e.target.value)}
                        required
                      >
                        {TAX_TYPES.map(tt => (
                          <option key={tt}>{tt}</option>
                        ))}
                      </select>
                    </div>

                    {form.taxType === 'PERCENTAGE' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Percentage (%)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.taxPercentage ?? 0}
                          onChange={e => handleFormChange('taxPercentage', parseFloat(e.target.value))}
                          placeholder="e.g. 9"
                          required
                        />
                      </div>
                    )}

                    {form.taxType === 'FIXED' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Fixed Amount (₹)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.fixedAmount ?? 0}
                          onChange={e => handleFormChange('fixedAmount', parseFloat(e.target.value))}
                          placeholder="e.g. 1000"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => { setDialogOpen(false); resetForm(); }}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update" : "Save")}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <div className="overflow-x-auto">
            <Table className="min-w-full border border-gray-300 rounded-md">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  {['S.No', 'Code', 'Name', 'Type', 'Rate/Amount', 'Status', 'Actions'].map(h => (
                    <TableHead
                      key={h}
                      className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-400 text-sm border">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-400 text-sm border">
                      No taxes available.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((t, idx) => (
                    <TableRow key={t.id} className="hover:bg-blue-50 transition-all">
                      <TableCell className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="border border-gray-300 px-4 py-3 text-sm font-medium">
                        {t.code}
                      </TableCell>
                      <TableCell className="border border-gray-300 px-4 py-3 text-sm">
                        {t.taxName}
                      </TableCell>
                      <TableCell className="border border-gray-300 px-4 py-3 text-sm">
                        {t.taxType}
                      </TableCell>
                      <TableCell className="border border-gray-300 px-4 py-3 text-sm">
                        {t.taxType === 'PERCENTAGE' ? `${t.taxPercentage}%` : `₹${t.fixedAmount}`}
                      </TableCell>
                      <TableCell className="border border-gray-300 px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-bold rounded-full cursor-pointer border ${
                            t.status === "ACTIVE"
                              ? "bg-green-50 text-green-800 border-green-200"
                              : "bg-red-50 text-red-800 border-red-200"
                          }`}
                          title="Toggle Status"
                          onClick={() => toggleStatus(t.id, t.status)}
                        >
                          {t.status}
                        </span>
                      </TableCell>
                      <TableCell className="border border-gray-300 px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={() => openEdit(t)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={() => removeTax(t.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}