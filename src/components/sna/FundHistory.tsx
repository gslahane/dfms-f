// src/components/WorkDemandTable.tsx
import React, { useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { ChevronRight, ChevronDown, Eye, FileDown, X, RefreshCcw, Search } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* --------------------------------- Types --------------------------------- */
type PlanType = "MLA" | "MLC";

interface Work {
  id: number;
  planType: PlanType;                 // NEW: Plan type for filtering
  workCode: string;
  name: string;
  district: string;
  constituency: string;
  mlaName: string;                    // For MLC, this is the member's name too
  financialYear: string;
  adminApprovedAmount: number;        // Total Work Amount (admin approved)
  workPortionAmount: number;
  taxDeductionAmount: number;
  vendor: { id: string; name: string; aadhar: string };
}

interface Demand {
  id: string;
  workId: number;
  amount: number;
  date: string; // yyyy-mm-dd
  status: "Pending" | "Approved";
  remarks: string;
}

/* ------------------------------ Mocked Data ------------------------------ */
const works: Work[] = [
  {
    id: 467,
    planType: "MLA",
    workCode: "ML/2425/2572",
    name: "Baramati - State Level Kabaddi Tournament Support",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    financialYear: "2024-25",
    adminApprovedAmount: 2999,
    workPortionAmount: 2800,
    taxDeductionAmount: 100,
    vendor: { id: "1189", name: "Shree Ganesh Constructions Pvt. Ltd.", aadhar: "123412341234" },
  },
  {
    id: 469,
    planType: "MLA",
    workCode: "ML/2425/2569",
    name: "Baramati - State Level Kabaddi Tournament Support (Phase 2)",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    financialYear: "2024-25",
    adminApprovedAmount: 1990,
    workPortionAmount: 1800,
    taxDeductionAmount: 100,
    vendor: { id: "1189", name: "Sadguru Infrastructure Ltd.", aadhar: "456789123456" },
  },
  {
    id: 477,
    planType: "MLA",
    workCode: "ML/2425/2561",
    name: "Baramati - Kabaddi Tournament Grant",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    financialYear: "2024-25",
    adminApprovedAmount: 1000,
    workPortionAmount: 1000,
    taxDeductionAmount: 0,
    vendor: { id: "1189", name: "Sahyadri Construction Co.", aadhar: "147852369258" },
  },
  {
    id: 468,
    planType: "MLA",
    workCode: "ML/2425/2151",
    name: "Shirur - Road to Kalamjai Mandir",
    district: "Pune",
    constituency: "Shirur",
    mlaName: "Dnyaneshwar Katke",
    financialYear: "2024-25",
    adminApprovedAmount: 1400,
    workPortionAmount: 1200,
    taxDeductionAmount: 110,
    vendor: { id: "1189", name: "Maratha Nirman & Co.", aadhar: "987654321098" },
  },
  {
    id: 470,
    planType: "MLA",
    workCode: "ML/2425/0325",
    name: "Maval - Sabha Mandap Construction",
    district: "Pune",
    constituency: "Maval",
    mlaName: "Sunil Shankarrao Shelke",
    financialYear: "2024-25",
    adminApprovedAmount: 1600,
    workPortionAmount: 1400,
    taxDeductionAmount: 100,
    vendor: { id: "1189", name: "Maharashtra Builders & Developers", aadhar: "321098765432" },
  },
  // Optional MLC sample to demonstrate Plan Type filter
  {
    id: 9001,
    planType: "MLC",
    workCode: "MLC/2425/0001",
    name: "Pune Division – Library Renovation Grant",
    district: "Pune",
    constituency: "Pune Division",
    mlaName: "Yogesh Tilekar",      // Member (MLC) name
    financialYear: "2024-25",
    adminApprovedAmount: 1200,
    workPortionAmount: 1150,
    taxDeductionAmount: 50,
    vendor: { id: "V-9001", name: "Sahyog Infra", aadhar: "111122223333" },
  },
];

const demands: Demand[] = [
  { id: "MLD-467-1", workId: 467, amount: 500, date: "2025-02-01", status: "Approved",  remarks: "First Installment" },
  { id: "MLD-469-1", workId: 469, amount: 500, date: "2025-02-03", status: "Approved",  remarks: "First Installment" },
  { id: "MLD-477-1", workId: 477, amount: 500, date: "2025-02-09", status: "Approved",  remarks: "First Installment" },
  { id: "MLD-477-2", workId: 477, amount: 500, date: "2025-03-09", status: "Approved", remarks: "Second Installment" },
  { id: "MLD-468-1", workId: 468, amount: 500, date: "2025-02-02", status: "Approved",  remarks: "First Installment" },
  { id: "MLD-470-1", workId: 470, amount: 500, date: "2025-02-04", status: "Approved",  remarks: "First Installment" },
  { id: "MLC-9001-1", workId: 9001, amount: 400, date: "2025-02-10", status: "Approved", remarks: "First Installment" },
];

/* ------------------------------- Utilities ------------------------------- */
const INR = (n: number | string) => "₹" + Number(n || 0).toLocaleString("en-IN");
const maskAadhar = (a?: string) => (a ? a.replace(/^(\d{8})(\d{4})$/, "********$2") : "********0000");

// Optional: MLA/MLC limits (fallback → sum of Work Amounts)
const MEMBER_LIMITS: Record<string, number> = {
  "Ajit Anantrao Pawar": 18000,
  "Dnyaneshwar Katke": 18000,
  "Sunil Shankarrao Shelke": 18000,
  "Yogesh Tilekar": 18000,
};

/* -------------------------------- Component ------------------------------- */
export default function WorkDemandTable() {
  /* ------------------------------- Filters -------------------------------- */
  const [fy, setFy] = useState<string>("");
  const [planType, setPlanType] = useState<"" | PlanType>("");
  const [district, setDistrict] = useState<string>("");
  const [member, setMember] = useState<string>(""); // MLA/MLC name
  const [applied, setApplied] = useState({ fy: "", planType: "" as "" | PlanType, district: "", member: "" });

  const fyOptions        = useMemo(() => Array.from(new Set(works.map(w => w.financialYear))), []);
  const planTypeOptions  = useMemo(() => Array.from(new Set(works.map(w => w.planType))), []);
  const districtOptions  = useMemo(() => Array.from(new Set(works.map(w => w.district))), []);
  const memberOptions    = useMemo(() => Array.from(new Set(works.map(w => w.mlaName))).sort(), []);

  const applyFilters = () => setApplied({ fy, planType, district, member });
  const resetFilters = () => {
    setFy(""); setPlanType(""); setDistrict(""); setMember("");
    setApplied({ fy: "", planType: "", district: "", member: "" });
  };

  /* ----------------------------- Filtered Data ---------------------------- */
  const filteredWorks = useMemo(() => {
    return works.filter(w =>
      (!applied.fy || w.financialYear === applied.fy) &&
      (!applied.planType || w.planType === applied.planType) &&
      (!applied.district || w.district === applied.district) &&
      (!applied.member || w.mlaName === applied.member)
    );
  }, [applied]);

  const workIdSet = useMemo(() => new Set(filteredWorks.map(w => w.id)), [filteredWorks]);
  const filteredDemands = useMemo(() => demands.filter(d => workIdSet.has(d.workId)), [workIdSet]);

  /* ---------------------------- Grouped by Member ------------------------- */
  const byMember = useMemo(() => {
    const map = new Map<string, Work[]>();
    for (const w of filteredWorks) {
      const list = map.get(w.mlaName) || [];
      list.push(w);
      map.set(w.mlaName, list);
    }
    return map;
  }, [filteredWorks]);

  const memberSummary = useMemo(() => {
    return Array.from(byMember.entries())
      .map(([name, list]) => ({
        name,
        works: list,
        noOfWorks: list.length,
        totalWorkAmount: list.reduce((s, w) => s + (w.adminApprovedAmount || 0), 0),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  }, [byMember]);

  /* ------------------------------- Expand UX ------------------------------ */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (name: string) => setExpanded(prev => ({ ...prev, [name]: !prev[name] }));

  /* ------------------------------- Modals --------------------------------- */
  const [voucherForWork, setVoucherForWork] = useState<Work | null>(null);
  const [receipt, setReceipt] = useState<{ demand: Demand; work: Work } | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  /* --------------------------- Export Functions --------------------------- */
  const exportWorksCSVForMember = (name: string) => {
    const list = byMember.get(name) || [];
    const header = ["Member Name", "Plan Type", "Work Code", "Work Name", "District", "Constituency", "FY", "Total Work Amount"];
    const rows = list.map(w => [name, w.planType, w.workCode, w.name, w.district, w.constituency, w.financialYear, w.adminApprovedAmount]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name.replace(/\s+/g, "_")}_works.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportVouchersCSV = (work: Work) => {
    const list = filteredDemands.filter(d => d.workId === work.id);
    const header = ["Demand ID", "Amount", "Date", "Status", "Remarks", "Work Code", "Work Name", "Member", "Plan Type"];
    const rows = list.map(d => [d.id, d.amount, d.date, d.status, d.remarks, work.workCode, work.name, work.mlaName, work.planType]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${work.workCode}_vouchers.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReceiptPDF = async () => {
    if (!receiptRef.current || !receipt) return;
    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 20;
    const w = pdf.internal.pageSize.getWidth() - margin * 2;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", margin, margin, w, h);
    pdf.save(`${receipt.demand.id}.pdf`);
  };

  /* -------------------------------- Render -------------------------------- */
  return (
    <div className="p-6 space-y-6">
      {/* FILTER BAR */}
      <Card className="border rounded shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-12 sm:col-span-3">
              <label className="text-xs font-medium mb-1 block">Financial Year</label>
              <Select value={fy} onValueChange={setFy}>
                <SelectTrigger><SelectValue placeholder="All FYs" /></SelectTrigger>
                <SelectContent>
                  {fyOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-12 sm:col-span-3">
              <label className="text-xs font-medium mb-1 block">Plan Type</label>
              <Select value={planType} onValueChange={(v: PlanType | "") => setPlanType(v)}>
                <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  {planTypeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-12 sm:col-span-3">
              <label className="text-xs font-medium mb-1 block">District</label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger><SelectValue placeholder="All Districts" /></SelectTrigger>
                <SelectContent>
                  {districtOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-12 sm:col-span-3">
              <label className="text-xs font-medium mb-1 block">MLA/MLC</label>
              <Select value={member} onValueChange={setMember}>
                <SelectTrigger><SelectValue placeholder="All Members" /></SelectTrigger>
                <SelectContent>
                  {memberOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-12 sm:col-span-6 flex gap-2">
              <Button className="flex-1" onClick={applyFilters}>
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                <RefreshCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOP TABLE: Sr No | Mla Name | No of works | Total Work Amount | action (View more) */}
      <Card className="border rounded shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Transactions – Member Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {["Sr No", "Mla Name", "No of works", "Total Work Amount", "Action (View more)"].map(h => (
                    <th key={h} className="border px-3 py-2 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberSummary.length === 0 && (
                  <tr>
                    <td className="border px-3 py-6 text-center text-sm text-gray-500" colSpan={5}>
                      No records match the selected filters.
                    </td>
                  </tr>
                )}

                {memberSummary.map((row, idx) => {
                  const isOpen = !!expanded[row.name];
                  return (
                    <React.Fragment key={row.name}>
                      <tr className="hover:bg-gray-50">
                        <td className="border px-3 py-2 text-xs">{idx + 1}</td>
                        <td className="border px-3 py-2 text-xs">{row.name}</td>
                        <td className="border px-3 py-2 text-xs">{row.noOfWorks}</td>
                        <td className="border px-3 py-2 text-xs">{INR(row.totalWorkAmount)}</td>
                        <td className="border px-3 py-2 text-xs">
                          <Button size="sm" variant="outline" onClick={() => toggle(row.name)}>
                            {isOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                            {isOpen ? "Hide" : "View more"}
                          </Button>
                        </td>
                      </tr>

                      {/* EXPANDED CONTENT UNDER MEMBER ROW */}
                      {isOpen && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="p-4 border-t bg-white">
                              {/* OVERVIEW CARDS: Mla Name | Total works | Total amount disbursed | MLa limit */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="rounded-md p-4 shadow-sm border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
                                  <p className="text-[11px] font-semibold text-blue-700 uppercase">Mla Name</p>
                                  <p className="mt-1 text-base font-bold text-blue-900">{row.name}</p>
                                </div>
                                <div className="rounded-md p-4 shadow-sm border-l-4 border-violet-500 bg-gradient-to-br from-violet-50 to-violet-100">
                                  <p className="text-[11px] font-semibold text-violet-700 uppercase">Total works</p>
                                  <p className="mt-1 text-2xl font-bold text-violet-900">{row.noOfWorks}</p>
                                </div>
                                <div className="rounded-md p-4 shadow-sm border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100">
                                  <p className="text-[11px] font-semibold text-emerald-700 uppercase">Total amount disbursed</p>
                                  <p className="mt-1 text-xl font-bold text-emerald-900">
                                    {INR(
                                      filteredDemands
                                        .filter(d => row.works.some(w => w.id === d.workId) && d.status === "Approved")
                                        .reduce((s, d) => s + d.amount, 0)
                                    )}
                                  </p>
                                </div>
                                <div className="rounded-md p-4 shadow-sm border-l-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100">
                                  <p className="text-[11px] font-semibold text-amber-700 uppercase">MLa limit</p>
                                  <p className="mt-1 text-xl font-bold text-amber-900">
                                    {INR(MEMBER_LIMITS[row.name] ?? row.totalWorkAmount)}
                                  </p>
                                </div>
                              </div>

                              {/* INNER TABLE: Sr No | Work Name | Total No Of Demands | Total Amount Dirsbursed | Amount Pending | View Vouchers */}
                              <div className="mt-4 overflow-x-auto">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs text-gray-600">
                                    Showing works under <span className="font-medium">{row.name}</span>
                                  </p>
                                  <Button variant="outline" size="sm" onClick={() => exportWorksCSVForMember(row.name)}>
                                    <FileDown className="w-4 h-4 mr-2" /> Download Works CSV
                                  </Button>
                                </div>

                                <table className="min-w-full border-collapse">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      {[
                                        "Sr No",
                                        "Work Name",
                                        "Total No Of Demands",
                                        "Total Amount Dirsbursed",
                                        "Amount Pending",
                                        "View Vouchers",
                                      ].map(h => (
                                        <th key={h} className="border px-3 py-2 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {row.works.map((w, i) => {
                                      const ds = filteredDemands.filter(d => d.workId === w.id);
                                      const totalDemands = ds.length;
                                      const disbursed = ds.filter(d => d.status === "Approved").reduce((s, d) => s + d.amount, 0);
                                      const pending = ds.filter(d => d.status === "Pending").reduce((s, d) => s + d.amount, 0);
                                      return (
                                        <tr key={w.id} className="hover:bg-gray-50">
                                          <td className="border px-3 py-2 text-xs">{i + 1}</td>
                                          <td className="border px-3 py-2 text-xs">
                                            <div className="font-medium">{w.name}</div>
                                            <div className="text-[11px] text-gray-500">
                                              <span className="font-mono">{w.workCode}</span> • {w.constituency}, {w.district} • {w.planType}
                                            </div>
                                          </td>
                                          <td className="border px-3 py-2 text-xs">{totalDemands}</td>
                                          <td className="border px-3 py-2 text-xs">{INR(disbursed)}</td>
                                          <td className="border px-3 py-2 text-xs">{INR(pending)}</td>
                                          <td className="border px-3 py-2 text-xs">
                                            <Button size="sm" variant="outline" onClick={() => setVoucherForWork(w)}>
                                              <Eye className="w-4 h-4 mr-2" /> View Vouchers
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                    {row.works.length === 0 && (
                                      <tr>
                                        <td className="border px-3 py-4 text-center text-sm text-gray-500" colSpan={6}>
                                          No works under this member for selected filters.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* VOUCHERS MODAL (Demands & vouchers list with download options) */}
      {voucherForWork && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setVoucherForWork(null)}>
          <div className="bg-white rounded-md shadow-lg w-full max-w-4xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold">Vouchers – {voucherForWork.name}</h3>
                <p className="text-xs text-gray-600">
                  Work Code: <span className="font-mono">{voucherForWork.workCode}</span> • Member: {voucherForWork.mlaName} • {voucherForWork.planType}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => exportVouchersCSV(voucherForWork)}>
                  <FileDown className="w-4 h-4 mr-2" /> Export CSV
                </Button>
                <button className="p-1 rounded hover:bg-gray-100" aria-label="Close" onClick={() => setVoucherForWork(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Small overview inside modal */}
            {(() => {
              const list = filteredDemands.filter(d => d.workId === voucherForWork.id);
              const disbursed = list.filter(d => d.status === "Approved").reduce((s, d) => s + d.amount, 0);
              const pending   = list.filter(d => d.status === "Pending").reduce((s, d) => s + d.amount, 0);
              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="rounded-md p-3 shadow-sm border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <p className="text-[11px] font-semibold text-emerald-700 uppercase">Total Amount Dirsbursed</p>
                    <p className="mt-1 text-lg font-bold text-emerald-900">{INR(disbursed)}</p>
                  </div>
                  <div className="rounded-md p-3 shadow-sm border-l-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100">
                    <p className="text-[11px] font-semibold text-amber-700 uppercase">Amount Pending</p>
                    <p className="mt-1 text-lg font-bold text-amber-900">{INR(pending)}</p>
                  </div>
                  <div className="rounded-md p-3 shadow-sm border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
                    <p className="text-[11px] font-semibold text-blue-700 uppercase">Vendor</p>
                    <p className="mt-1 text-sm font-semibold text-blue-900">{voucherForWork.vendor.name}</p>
                    <p className="text-[11px] text-blue-700/70">Aadhar: {maskAadhar(voucherForWork.vendor.aadhar)}</p>
                  </div>
                </div>
              );
            })()}

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {["Demand ID", "Amount", "Date", "Status", "Remarks", "Receipt"].map(h => (
                      <th key={h} className="border px-3 py-2 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDemands.filter(d => d.workId === voucherForWork.id).map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2 text-xs font-mono">{d.id}</td>
                      <td className="border px-3 py-2 text-xs">{INR(d.amount)}</td>
                      <td className="border px-3 py-2 text-xs">{d.date}</td>
                      <td className="border px-3 py-2 text-xs">
                        <Badge variant={d.status === "Approved" ? "default" : "secondary"}>{d.status}</Badge>
                      </td>
                      <td className="border px-3 py-2 text-xs">{d.remarks}</td>
                      <td className="border px-3 py-2 text-xs">
                        <Button size="sm" variant="outline" onClick={() => setReceipt({ demand: d, work: voucherForWork })}>
                          <Eye className="w-4 h-4 mr-2" /> View / PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredDemands.filter(d => d.workId === voucherForWork.id).length === 0 && (
                    <tr><td className="border px-3 py-4 text-center text-sm text-gray-500" colSpan={6}>No vouchers.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL (per voucher PDF) */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setReceipt(null)}>
          <div className="bg-white rounded-md shadow-lg w-full max-w-3xl p-6 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full" onClick={() => setReceipt(null)} aria-label="Close">
              <X size={18} />
            </button>

            <div ref={receiptRef} className="space-y-4 text-sm">
              {/* Header */}
              <div className="text-center space-y-1">
                <img src="./logo.png" alt="Gov Seal" className="h-12 mx-auto" />
                <h2 className="text-base font-bold">Government of Maharashtra</h2>
                <p className="text-xs text-gray-600 -mt-1">Finance Department</p>
                <p className="text-xs font-medium">Work Payment Receipt</p>
              </div>

              {/* Meta */}
              <div className="flex justify-between text-xs text-gray-700 border-y py-1">
                <span><strong>Voucher ID:</strong> {receipt.demand.id}</span>
                <span><strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}</span>
                <span><strong>Time:</strong> {new Date().toLocaleTimeString("en-IN")}</span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="border rounded p-3 bg-gray-50">
                  <p><strong>Work Code:</strong> <span className="font-mono">{receipt.work.workCode}</span></p>
                  <p><strong>Work Title:</strong> {receipt.work.name}</p>
                  <p><strong>Member:</strong> {receipt.work.mlaName} • {receipt.work.planType}</p>
                  <p><strong>District:</strong> {receipt.work.district}</p>
                  <p><strong>Constituency:</strong> {receipt.work.constituency}</p>
                </div>
                <div className="border rounded p-3 bg-gray-50">
                  <p><strong>Admin Approved Amount:</strong> {INR(receipt.work.adminApprovedAmount)}</p>
                  <p><strong>Disbursed Now:</strong> {INR(receipt.demand.amount)}</p>
                  <p><strong>Status:</strong> {receipt.demand.status}</p>
                  <p><strong>Remarks:</strong> {receipt.demand.remarks}</p>
                </div>
              </div>

              {/* Vendor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="border rounded p-3 bg-gray-50">
                  <p><strong>Vendor:</strong> {receipt.work.vendor.name}</p>
                  <p><strong>Aadhar:</strong> {maskAadhar(receipt.work.vendor.aadhar)}</p>
                </div>
                <div className="border rounded p-3 bg-gray-50">
                  <p><strong>Bank:</strong> State Bank of India</p>
                  <p><strong>IFSC:</strong> SBIN0000456</p>
                  <p><strong>UTR No:</strong> UTR20250717001</p>
                </div>
              </div>

              {/* Signature */}
              <div className="pt-3 border-t text-right text-xs">
                <p className="text-gray-600">Authorized Signatory</p>
                <div className="h-10 border-b w-40 ml-auto mt-1" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => setReceipt(null)}>Close</Button>
              <Button size="sm" onClick={downloadReceiptPDF}>
                <FileDown className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
