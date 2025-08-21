import React, { useEffect, useState } from "react";
import {
  Card, CardHeader, CardContent, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import axios from "axios";
import WorkModal from "./WorkModal";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function WorkSchemeMaster() {
  const [records, setRecords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Dropdown data
  const [financialYears, setFinancialYears] = useState([]);
  const [planTypes] = useState([
    { label: "DAP", value: "DAP" },
    { label: "MLA", value: "MLA" },
    { label: "MLC", value: "MLC" },
    { label: "HADP", value: "HADP" },
  ]);
  const [schemes, setSchemes] = useState([]);
  const [iaUsers, setIaUsers] = useState([]);
  const [mlas, setMlas] = useState([]);
  const [mlcs, setMlcs] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [districtId] = useState(1);

  // Filters
  const [filter, setFilter] = useState({
    financialYearId: "",
    planType: "",
    schemeId: "",
    iaUserId: "",
    workTitle: "",
    mlaId: "",
    mlcId: "",
    talukaId: "",
  });

  const getToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    fetchFinancialYears();
    fetchMLAs();
    fetchMLCs();
    fetchSchemes();
    fetchIaUsers();
  }, []);

  useEffect(() => {
    if (filter.planType === "HADP" && districtId) fetchTalukas(districtId);
  }, [filter.planType, districtId]);

  useEffect(() => {
    fetchWorks();
    // eslint-disable-next-line
  }, [filter]);

  async function fetchWorks() {
    try {
      const params = {};
      if (filter.financialYearId) params.financialYearId = filter.financialYearId;
      if (filter.planType) params.planType = filter.planType;
      if (filter.schemeId) params.schemeId = filter.schemeId;
      if (filter.iaUserId) params.iaUserId = filter.iaUserId;
      if (filter.workTitle) params.search = filter.workTitle;
      if (filter.mlaId) params.mlaId = filter.mlaId;
      if (filter.mlcId) params.mlcId = filter.mlcId;
      if (filter.talukaId) params.talukaId = filter.talukaId;

      const res = await axios.get(`${API_BASE}/api/scheme-work-master/works`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params
      });
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch {
      setRecords([]);
    }
  }

  async function fetchFinancialYears() {
    try {
      const res = await axios.get(`${API_BASE}/api/dropdown/financial-years`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFinancialYears(Array.isArray(res.data) ? res.data : []);
    } catch {
      setFinancialYears([]);
    }
  }

  async function fetchSchemes() {
    try {
      const res = await axios.get(`${API_BASE}/api/scheme-work-master/schemes`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setSchemes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setSchemes([]);
    }
  }

  async function fetchIaUsers() {
    try {
      const res = await axios.get(`${API_BASE}/api/scheme-work-master/ia-users`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setIaUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setIaUsers([]);
    }
  }

  async function fetchMLAs() {
    try {
      const res = await axios.get(`${API_BASE}/api/mlas/names`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMlas(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMlas([]);
    }
  }

  async function fetchMLCs() {
    try {
      const res = await axios.get(`${API_BASE}/api/mlcs/all`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMlcs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMlcs([]);
    }
  }

  async function fetchTalukas(districtId) {
    try {
      const res = await axios.get(`${API_BASE}/api/dropdown/talukas/by-district/${districtId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setTalukas(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTalukas([]);
    }
  }

  function getAmount(r) {
    return Number(r.adminApprovedAmount ?? r.aaAmount ?? 0);
  }

  // Table columns for each Plan Type
  function getTableColumns() {
    switch (filter.planType) {
      case "MLA":
        return [
          { key: "srno", label: "Sr No", className: "text-left w-16" },
          { key: "workName", label: "Work Title", className: "text-left" },
          { key: "schemeName", label: "Scheme", className: "text-left" },
          { key: "iaName", label: "IA", className: "text-left" },
          { key: "mlaName", label: "MLA Name", className: "text-left" },
          { key: "aaAmount", label: "AA Amount", className: "text-right" },
          { key: "aaLetterFile", label: "AA Letter", className: "text-left" },
        ];
      case "MLC":
        return [
          { key: "srno", label: "Sr No", className: "text-left w-16" },
          { key: "workName", label: "Work Title", className: "text-left" },
          { key: "schemeName", label: "Scheme", className: "text-left" },
          { key: "iaName", label: "IA", className: "text-left" },
          { key: "mlcName", label: "MLC Name", className: "text-left" },
          { key: "aaAmount", label: "AA Amount", className: "text-right" },
          { key: "aaLetterFile", label: "AA Letter", className: "text-left" },
        ];
      case "HADP":
        return [
          { key: "srno", label: "Sr No", className: "text-left w-16" },
          { key: "talukaName", label: "Taluka", className: "text-left" },
          { key: "workName", label: "Work Title", className: "text-left" },
          { key: "schemeName", label: "Scheme", className: "text-left" },
          { key: "iaName", label: "IA", className: "text-left" },
          { key: "aaAmount", label: "AA Amount", className: "text-right" },
          { key: "aaLetterFile", label: "AA Letter", className: "text-left" },
        ];
      default:
        return [
          { key: "srno", label: "Sr No", className: "text-left w-16" },
          { key: "workName", label: "Work Title", className: "text-left" },
          { key: "schemeName", label: "Scheme", className: "text-left" },
          { key: "iaName", label: "IA", className: "text-left" },
          { key: "aaAmount", label: "AA Amount", className: "text-right" },
          { key: "aaLetterFile", label: "AA Letter", className: "text-left" },
        ];
    }
  }

  // For a possible future "total" row if needed, sum numeric columns:
  function getTotalAmount() {
    return records.reduce((sum, r) => sum + getAmount(r), 0);
  }

  // For demonstration: could add more totals if needed

  return (
    <div className="p-2 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold mb-3 sm:mb-0 text-blue-900">
          Scheme-Work-IA Mapping
        </h2>
        <Button onClick={() => setDialogOpen(true)} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg">
          + Assign New Work
        </Button>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-4">
        <Select value={filter.financialYearId} onValueChange={v => setFilter(f => ({ ...f, financialYearId: v }))}>
          <SelectTrigger><SelectValue placeholder="Financial Year" /></SelectTrigger>
          <SelectContent>
            {financialYears.map(y => (
              <SelectItem key={y.id} value={String(y.id)}>{y.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filter.planType} onValueChange={v => setFilter(f => ({
          ...f, planType: v, schemeId: "", iaUserId: "", mlaId: "", mlcId: "", talukaId: ""
        }))}>
          <SelectTrigger><SelectValue placeholder="Plan Type" /></SelectTrigger>
          <SelectContent>
            {planTypes.map(pt => <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filter.schemeId} onValueChange={v => setFilter(f => ({ ...f, schemeId: v }))}>
          <SelectTrigger><SelectValue placeholder="Scheme" /></SelectTrigger>
          <SelectContent>
            {schemes.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filter.iaUserId} onValueChange={v => setFilter(f => ({ ...f, iaUserId: v }))}>
          <SelectTrigger><SelectValue placeholder="Implementing Agency" /></SelectTrigger>
          <SelectContent>
            {iaUsers.map(i => <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {(filter.planType === "MLA") && (
          <Select value={filter.mlaId} onValueChange={v => setFilter(f => ({ ...f, mlaId: v }))}>
            <SelectTrigger><SelectValue placeholder="MLA Name" /></SelectTrigger>
            <SelectContent>
              {mlas.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {(filter.planType === "MLC") && (
          <Select value={filter.mlcId} onValueChange={v => setFilter(f => ({ ...f, mlcId: v }))}>
            <SelectTrigger><SelectValue placeholder="MLC Name" /></SelectTrigger>
            <SelectContent>
              {mlcs.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {(filter.planType === "HADP") && (
          <Select value={filter.talukaId} onValueChange={v => setFilter(f => ({ ...f, talukaId: v }))}>
            <SelectTrigger><SelectValue placeholder="Taluka" /></SelectTrigger>
            <SelectContent>
              {talukas.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Input placeholder="Search Work" value={filter.workTitle} onChange={e => setFilter(f => ({ ...f, workTitle: e.target.value }))} />
      </div>
      {/* Table */}
    <Card className="rounded-md shadow-sm">
  <CardHeader className="flex justify-between items-center">
    <CardTitle className="text-base font-semibold text-gray-900 px-2">
      Assigned Works
    </CardTitle>
  </CardHeader>
  <CardContent className="overflow-x-auto p-0">
    <div className="p-0">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-[#F7F9FB]">
            <th className="border px-2 py-1">SrNo</th>
            <th className="border px-2 py-1">Scheme Name</th>
            <th className="border px-2 py-1">Work Title</th>
            <th className="border px-2 py-1">Implementing Agency</th>
            <th className="border px-2 py-1">AA Amount</th>
            <th className="border px-2 py-1">AA Letter</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">No works assigned.</td>
            </tr>
          ) : (
            <>
              {records.map((r, i) => (
                <tr
                  key={r.workId || i}
                  className="border-b last:border-b-0 border-[#E4E8EE] bg-white"
                >
                  <td className="border px-2 py-1 text-xs">{i + 1}</td>
                  <td className="border px-2 py-1 text-xs">{r.schemeName || "-"}</td>
                  <td className="border px-2 py-1 text-xs">{r.workName || "-"}</td>
                  
                  <td className="border px-2 py-1 text-xs">{r.name || "-"}</td>
<td className="px-5 py-4 text-right font-mono text-[#232B3E]">
  {r.adminApprovedAmount }
</td>
                  <td className="border px-2 py-1 text-xs">{r.aaLetterFile || "-"}</td>
                </tr>
              ))}
              {/* Optional: Total Row */}
              <tr className="bg-[#F7F9FB] border-t border-[#E4E8EE]">
                <td className="px-5 py-3 font-bold text-[#232B3E]" colSpan={4}>Total</td>
                <td className="border px-2 py-1 text-sm font-mono">
                  {records
                    .reduce((sum, r) => sum + Number(r.adminApprovedAmount || r.aaAmount || 0), 0)
                    .toFixed(0)}
                </td>
                <td className="px-5 py-3"></td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>

      <WorkModal
        open={dialogOpen}
        setOpen={setDialogOpen}
        planTypes={planTypes}
        financialYears={financialYears}
        schemes={schemes}
        iaUsers={iaUsers}
        mlas={mlas}
        mlcs={mlcs}
        talukas={talukas}
        districtId={districtId}
        refresh={fetchWorks}
      />
    </div>
  );
}
