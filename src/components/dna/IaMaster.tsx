import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, X, Eye, Trash2 } from "lucide-react";

interface IARecord {
  agencyCode: string;
  iaName: string;
  officerName: string;
  designation: string;
  email: string;
}

// Actual Implementing Agencies
const initialIAs: IARecord[] = [
  {
    agencyCode: "7023",
    iaName: "MSEB Mulshi Division",
    officerName: "Rakesh Patil",
    designation: "Executive Engineer",
    email: "rakesh.patil@maha.gov.in"
  },
  {
    agencyCode: "1880",
    iaName: "Chief Officer, Saswad Municipal Council, District-Pune",
    officerName: "Jyoti Deshmukh",
    designation: "Chief Officer",
    email: "jyoti.deshmukh@saswadmc.in"
  },
  {
    agencyCode: "931",
    iaName: "Executive Engineer, Public Works, Pune Division, Pune",
    officerName: "Manoj Kulkarni",
    designation: "Executive Engineer",
    email: "manoj.kulkarni@pwdpune.gov.in"
  },
  {
    agencyCode: "1133",
    iaName: "Divisional Forest Officer, Social Forestry Department, Pune",
    officerName: "Sunita More",
    designation: "Divisional Forest Officer",
    email: "sunita.more@forest.maharashtra.gov.in"
  },
  {
    agencyCode: "1083",
    iaName: "Deputy Chief Executive Officer (Village Panchayat), Zillha Parishad, Pune",
    officerName: "Vijay Bhosale",
    designation: "Deputy CEO",
    email: "vijay.bhosale@zppune.gov.in"
  }
];
export default function ImplementingAgencyMaster() {
  const [iaList, setIaList] = useState<IARecord[]>(initialIAs);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<IARecord>>({});
  const [errors, setErrors] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = () => {
    if (!form.iaName || !form.agencyCode) {
      setErrors("Agency Name and Code are required.");
      return;
    }
    setErrors("");
    setIaList(list => [{ ...(form as IARecord) }, ...list]);
    setForm({});
    setModalOpen(false);
  };

  const handleRemove = (code: string) => {
    setIaList(list => list.filter(i => i.agencyCode !== code));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-semibold">Implementing Agency Master</CardTitle>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add Agency
        </Button>
      </div>

      <Card className="border border-gray-300 rounded-lg shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {['Sr No','IA Name','Officer Name','Designation','Email','Actions'].map((h, idx) => (
                    <TableHead key={idx} className="border border-gray-200 px-4 py-2 text-left text-xs font-semibold text-gray-700">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {iaList.map((ia, idx) => (
                  <TableRow key={ia.agencyCode} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{idx + 1}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{ia.iaName}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{ia.officerName || '-'}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{ia.designation || '-'}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{ia.email || '-'}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm space-x-2">
                      <Button size="icon" variant="ghost"><Eye className="h-5 w-5 text-blue-600"/></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleRemove(ia.agencyCode)}><Trash2 className="h-5 w-5 text-red-600"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {iaList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="border border-gray-200 py-6 text-center text-gray-500">No agencies found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Implementing Agency</DialogTitle>
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4">
              <X className="h-5 w-5 text-gray-500 hover:text-red-600" />
            </button>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Agency Code</label>
                <Input name="agencyCode" value={form.agencyCode||''} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Agency Name</label>
                <Input name="iaName" value={form.iaName||''} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Officer Name</label>
                <Input name="officerName" value={form.officerName||''} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
                <Input name="designation" value={form.designation||''} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <Input name="email" value={form.email||''} onChange={handleChange} />
              </div>
            </div>
            {errors && <div className="text-xs text-red-600">{errors}</div>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}