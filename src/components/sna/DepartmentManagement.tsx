// src/components/DistrictManagement.tsx

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface DistrictRecord {
  id: string;
  district: string;
  collector: string;
  email: string;
  mobile: string;
  isActive: boolean;
}

const initialData: DistrictRecord[] = [
  {
    id: 'D-01',
    district: 'Pune',
    collector: 'Shri. Jitendra Dudi',
    email: 'collector.pune@maharashtra.gov.in',
    mobile: '9876543211',
    isActive: true
  }
];

export default function DistrictManagement() {
  const [data, setData] = useState<DistrictRecord[]>(initialData);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<DistrictRecord>>({
    district: '',
    collector: '',
    email: '',
    mobile: '',
    isActive: true
  });

  const districtOptions = useMemo(
    () => ['All', ...new Set(data.map(d => d.district))],
    [data]
  );

  const rows = useMemo(
    () =>
      data.filter(d =>
        selectedDistrict === 'All' ? true : d.district === selectedDistrict
      ),
    [data, selectedDistrict]
  );

  const total = rows.length;
  const active = rows.filter(d => d.isActive).length;
  const inactive = total - active;

  const handleFormChange = (key: keyof DistrictRecord, value: any) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.district || !form.collector) return;
    const newRecord: DistrictRecord = {
      id: 'D-' + Date.now().toString().slice(-4),
      district: form.district!,
      collector: form.collector!,
      email: form.email!,
      mobile: form.mobile!,
      isActive: form.isActive ?? true
    };
    setData(d => [newRecord, ...d]);
    setDialogOpen(false);
    setForm({ district: '', collector: '', email: '', mobile: '', isActive: true });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">District Management</h1>
          <p className="text-gray-600">Manage collectors and contact info</p>
        </div>
        <div className="flex gap-3 items-end">
          <div className="w-48">
            <Label htmlFor="district">Filter by District</Label>
            <Select
              id="district"
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
            >
              <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {districtOptions.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" className="flex items-center px-4 py-2 rounded-sm shadow">
                <Plus className="mr-2 h-4 w-4"/> Create District
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New District</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label>District Name</Label>
                  <Input
                    value={form.district}
                    onChange={e => handleFormChange('district', e.target.value)}
                    placeholder="e.g. Pune"
                  />
                </div>
                <div>
                  <Label>Collector Name</Label>
                  <Input
                    value={form.collector}
                    onChange={e => handleFormChange('collector', e.target.value)}
                    placeholder="e.g. Dr. Vinod Patil"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => handleFormChange('email', e.target.value)}
                    placeholder="collector@example.gov"
                  />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input
                    value={form.mobile}
                    onChange={e => handleFormChange('mobile', e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <p className="text-sm font-medium text-gray-600">Total Districts</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
        </motion.div>
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-medium text-gray-600">Active</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{active}</p>
        </motion.div>
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-medium text-gray-600">Inactive</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{inactive}</p>
        </motion.div>
      </div>

      {/* Data Table */}
      <Card className="border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Collectors Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {['S.No','District','Collector','Email','Mobile','Status','Actions'].map(h => (
                  <th
                    key={h}
                    className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 text-sm">{idx + 1}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.district}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.collector}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.email}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.mobile}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        r.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="border border-gray-200 py-4 text-center text-gray-400 text-sm">
                    No records found.
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
