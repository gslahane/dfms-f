import React, { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function WorkModal({
  open, setOpen, planTypes, financialYears, schemes, iaUsers, mlas, mlcs, talukas, districtId, refresh
}) {
  const [form, setForm] = useState({
    financialYearId: "",
    planType: "",
    schemeId: "",
    iaUserId: "",
    workTitle: "",
    aaAmount: "",
    aaLetterFile: "",
    mlaId: "",
    mlcId: "",
    talukaId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({
        financialYearId: "",
        planType: "",
        schemeId: "",
        iaUserId: "",
        workTitle: "",
        aaAmount: "",
        aaLetterFile: "",
        mlaId: "",
        mlcId: "",
        talukaId: "",
      });
    }
  }, [open]);

  const onChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  // This should be replaced with real upload logic.
  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // For demo, just set filename. In real: Upload file, get path/url and set here.
    setForm(f => ({ ...f, aaLetterFile: file.name }));
  };

  const onAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Construct request payload
    const payload = {
      schemeId: Number(form.schemeId),
      aaAmount: Number(form.aaAmount),
      workTitle: form.workTitle,
      aaLetterFile: form.aaLetterFile,
      financialYearId: Number(form.financialYearId),
      mlaId: form.planType === "MLA" ? Number(form.mlaId) : null,
      mlcId: form.planType === "MLC" ? Number(form.mlcId) : null,
      districtId: Number(districtId),
      talukaId: form.planType === "HADP" ? Number(form.talukaId) : null,
    };

    try {
      await axios.post(`${API_BASE}/api/scheme-work-master/assign-work`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      setOpen(false);
      refresh();
    } catch (err) {
      alert("Failed to assign work!");
    } finally {
      setLoading(false);
    }
  };

  // UI: Render dynamic fields
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl w-full rounded-2xl p-0 shadow-2xl">
        <DialogHeader className="bg-blue-50 rounded-t-2xl p-6 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-blue-900">Assign New Work</DialogTitle>
        </DialogHeader>
        <form onSubmit={onAssign} className="px-8 pt-6 pb-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Financial Year */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Financial Year <span className="text-red-500">*</span></label>
              <Select value={form.financialYearId} onValueChange={v => onChange("financialYearId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYears.map(y => (
                    <SelectItem key={y.id} value={String(y.id)}>{y.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Plan Type <span className="text-red-500">*</span></label>
              <Select value={form.planType} onValueChange={v => onChange("planType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Plan Type" />
                </SelectTrigger>
                <SelectContent>
                  {planTypes.map(pt => (
                    <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Scheme <span className="text-red-500">*</span></label>
              <Select value={form.schemeId} onValueChange={v => onChange("schemeId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Scheme" />
                </SelectTrigger>
                <SelectContent>
                  {schemes.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* IA */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Implementing Agency <span className="text-red-500">*</span></label>
              <Select value={form.iaUserId} onValueChange={v => onChange("iaUserId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select IA" />
                </SelectTrigger>
                <SelectContent>
                  {iaUsers.map(i => (
                    <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Work Title */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Work Title <span className="text-red-500">*</span></label>
              <Input placeholder="Work Title" value={form.workTitle} onChange={e => onChange("workTitle", e.target.value)} />
            </div>
            {/* AA Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">AA Amount <span className="text-red-500">*</span></label>
              <Input type="number" min={0} placeholder="AA Amount" value={form.aaAmount} onChange={e => onChange("aaAmount", e.target.value)} />
            </div>
            {/* AA Letter File (File picker, just shows filename in this mock) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">AA Letter (file name only here)<span className="text-red-500">*</span></label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={onFile} className="w-full text-sm text-gray-500 bg-blue-50 border rounded-md p-2" />
              {form.aaLetterFile && (
                <div className="mt-1 text-xs text-blue-700">{form.aaLetterFile}</div>
              )}
            </div>

            {/* MLA/MLC/HADP fields */}
            {form.planType === "MLA" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">MLA Name <span className="text-red-500">*</span></label>
                <Select value={form.mlaId} onValueChange={v => onChange("mlaId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select MLA" /></SelectTrigger>
                  <SelectContent>
                    {mlas.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.planType === "MLC" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">MLC Name <span className="text-red-500">*</span></label>
                <Select value={form.mlcId} onValueChange={v => onChange("mlcId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select MLC" /></SelectTrigger>
                  <SelectContent>
                    {mlcs.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.planType === "HADP" && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Taluka <span className="text-red-500">*</span></label>
                <Select value={form.talukaId} onValueChange={v => onChange("talukaId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Taluka" /></SelectTrigger>
                  <SelectContent>
                    {talukas.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-3 mt-10">
            <Button
              variant="outline"
              type="button"
              className="rounded-lg px-6 py-2 border-gray-300"
              onClick={() => setOpen(false)}
              disabled={loading}
            >Cancel</Button>
            <Button
              type="submit"
              className="rounded-lg px-8 py-2 text-base font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow transition-all duration-150"
              disabled={loading}
            >{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
