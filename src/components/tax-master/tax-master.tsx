// src/components/TaxMaster.tsx

import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Tax {
  id: string;
  code: string;
  name: string;
  rate: number;
  type: "PERCENTAGE" | "FIXED";
  isActive: boolean;
}

// Initial tax definitions
const INITIAL_TAXES: Tax[] = [
  { id: 'T-01', code: 'CGST', name: 'Central GST', rate: 9,  type: 'PERCENTAGE', isActive: true },
  { id: 'T-02', code: 'SGST', name: 'State GST',   rate: 9,  type: 'PERCENTAGE', isActive: true },
  { id: 'T-03', code: 'CC',   name: 'Consultancy Charges', rate: 2, type: 'FIXED',      isActive: true },
  { id: 'T-04', code: 'ROY',  name: 'Royalty',       rate: 5,  type: 'PERCENTAGE', isActive: false },
  { id: 'T-05', code: 'ITDS', name: 'Income Tax (TDS)', rate: 10, type: 'PERCENTAGE', isActive: true },
];

const TAX_TYPES = ['PERCENTAGE', 'FIXED'] as const;

type TaxType = typeof TAX_TYPES[number] | 'All';

export default function TaxMaster() {
  const [taxes, setTaxes] = useState<Tax[]>(INITIAL_TAXES);
  const [filterType, setFilterType] = useState<TaxType>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<Tax>>({ code: '', name: '', rate: 0, type: 'PERCENTAGE', isActive: true });

  const filtered = useMemo(
    () =>
      taxes.filter(t =>
        filterType === 'All' ? true : t.type === filterType
      ),
    [taxes, filterType]
  );

  const handleFormChange = (key: keyof Tax, value: any) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.code || !form.name || form.rate == null) return;
    const newTax: Tax = {
      id: `T-${Date.now().toString().slice(-4)}`,
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      rate: Number(form.rate),
      type: form.type!,
      isActive: form.isActive ?? true,
    };
    setTaxes(ts => [newTax, ...ts]);
    setDialogOpen(false);
    setForm({ code: '', name: '', rate: 0, type: 'PERCENTAGE', isActive: true });
  };

  const toggleActive = (id: string) =>
    setTaxes(ts =>
      ts.map(t => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );

  const removeTax = (id: string) =>
    setTaxes(ts => ts.filter(t => t.id !== id));

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <Card className="border border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold">Tax Master</CardTitle>
            <p className="mt-1 text-gray-500">Define and manage tax codes & rates</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40">
              <label className="block text-xs font-medium text-gray-600 mb-1">Filter Type</label>
              <select
                className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm"
                value={filterType}
                onChange={e => setFilterType(e.target.value as TaxType)}
              >
                <option>All</option>
                {TAX_TYPES.map(tt => (
                  <option key={tt}>{tt}</option>
                ))}
              </select>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="primary" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Tax
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Tax</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <Input
                      value={form.code}
                      onChange={e => handleFormChange('code', e.target.value)}
                      placeholder="e.g. CGST"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Input
                      value={form.name}
                      onChange={e => handleFormChange('name', e.target.value)}
                      placeholder="e.g. Central GST"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate (%)</label>
                    <Input
                      type="number"
                      value={form.rate}
                      onChange={e => handleFormChange('rate', parseFloat(e.target.value))}
                      placeholder="e.g. 9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-sm px-2 py-1 text-sm"
                      value={form.type}
                      onChange={e => handleFormChange('type', e.target.value)}
                    >
                      {TAX_TYPES.map(tt => (
                        <option key={tt}>{tt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {['S.No','Code','Name','Rate (%)','Type','Status','Actions'].map(h => (
                  <th
                    key={h}
                    className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase"
                  >{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">{idx+1}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-800 font-medium">{t.code}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-800">{t.name}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600 text-right">{t.rate}%</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">{t.type}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                        t.isActive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}
                      onClick={() => toggleActive(t.id)}
                    >{t.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeTax(t.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="border border-gray-200 py-6 text-center text-gray-400 text-sm">
                    No taxes available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
