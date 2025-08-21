// src/components/DashboardMLADemand.tsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogTrigger, DialogContent
} from "@/components/ui/dialog";
import { Eye, ChevronsUpDown, Check } from "lucide-react";
import MlaFundDemandDetails from "./MlaFundDemandDetails";

// Searchable combobox primitives (shadcn/ui)
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

/* ----------------------------------------------------------------------------
 * MOCK DATA
 * --------------------------------------------------------------------------*/
interface Work {
  id: number;
  workCode: string;
  name: string;
  district: string;
  constituency: string;
  mlaName: string;
  financialYear: string;
  adminApprovedAmount: number;
  workPortionAmount: number;
  taxDeductionAmount: number;
  vendor: {
    id: string;
    name: string;
    aadhar: string;
  };
}
interface Demand {
  id: string;
  workId: number;
  amount: number;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
  remarks: string;
}

const works: Work[] = [
  {
    id: 467,
    workCode: "ML/2425/2572",
    name: "ML/2425/2572 आमदार स्थानिक विकास कार्यक्रम सन २०२४-२५ अंतर्गत बारामती येथे होणाऱ्या शिवछत्रपती राज्य स्तरीय कबड्डी स्पर्धेकरिता निधी उपलब्ध करणेबाबत",
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
    id: 468,
    workCode: "ML/2425/2151",
    name: "ML/2425/2151 जांबूत येथे जांबूत चोंभूत रोड ते कळमजाई मंदिर रस्ता करणे ता.शिरुर",
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
    id: 469,
    workCode: "ML/2425/2569",
    name: "ML/2425/2569 आमदार स्थानिक विकास कार्यक्रम सन २०२४-२५ अंतर्गत बारामती येथे होणाऱ्या शिवछत्रपती राज्य स्तरीय कबड्डी स्पर्धेकरिता निधी उपलब्ध करणेबाबत",
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
    id: 470,
    workCode: "ML/2425/0325",
    name: "ML/2425/0325 मौजे वेहेरगाव येथे भैरवनाथ मंदिरासमोरील ग्रामपंचायतीच्या मोकळ्या जागेत सभामंडप बांधणे.ता.मावळ.जि.पुणे",
    district: "Pune",
    constituency: "Maval",
    mlaName: "Sunil Shankarrao Shelke",
    financialYear: "2024-25",
    adminApprovedAmount: 1600,
    workPortionAmount: 1400,
    taxDeductionAmount: 100,
    vendor: { id: "1189", name: "Maharashtra Builders & Developers", aadhar: "321098765432" },
  },
];

const initialDemands: Demand[] = [
  { id: "MLD-467-1", workId: 467, amount: 500, date: "2025-02-01", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-468-1", workId: 468, amount: 500, date: "2025-02-02", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-469-1", workId: 469, amount: 500, date: "2025-02-03", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-470-1", workId: 470, amount: 500, date: "2025-02-04", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-477-1", workId: 467, amount: 400, date: "2025-03-01", status: "Approved", remarks: "Second Installment" },
];

/* ----------------------------------------------------------------------------
 * UTILS
 * --------------------------------------------------------------------------*/
function uniq<T>(arr: T[]) { return Array.from(new Set(arr)); }
function toCurrency(n: number) { return `₹${(n || 0).toLocaleString()}`; }
function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" "); }

/* ----------------------------------------------------------------------------
 * COMPACT KPI CARD
 * --------------------------------------------------------------------------*/
function KpiMini({
  title, amount, caption, tone
}: {
  title: string; amount: number | string; caption?: string; tone: "blue" | "emerald" | "rose" | "amber" | "indigo" | "green";
}) {
  const tones: Record<string, { border: string; from: string; to: string; title: string; value: string; caption: string }> = {
    blue:   { border: "border-blue-500",   from: "from-blue-50",   to: "to-blue-100",   title: "text-blue-700",   value: "text-blue-900",   caption: "text-blue-700/70" },
    emerald:{ border: "border-emerald-500",from: "from-emerald-50",to: "to-emerald-100",title: "text-emerald-700",value: "text-emerald-900",caption: "text-emerald-700/70" },
    rose:   { border: "border-rose-500",   from: "from-rose-50",   to: "to-rose-100",   title: "text-rose-700",   value: "text-rose-900",   caption: "text-rose-700/70" },
    amber:  { border: "border-amber-500",  from: "from-amber-50",  to: "to-amber-100",  title: "text-amber-700",  value: "text-amber-900",  caption: "text-amber-700/70" },
    indigo: { border: "border-indigo-500", from: "from-indigo-50", to: "to-indigo-100", title: "text-indigo-700", value: "text-indigo-900", caption: "text-indigo-700/70" },
    green:  { border: "border-green-500",  from: "from-green-50",  to: "to-green-100",  title: "text-green-700",  value: "text-green-900",  caption: "text-green-700/70" },
  };
  const t = tones[tone];
  return (
    <motion.div
      className={cn("rounded-md p-3 shadow-sm border-l-4 text-[11px] bg-gradient-to-br", t.border, t.from, t.to)}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    >
      <p className={cn("font-semibold uppercase leading-none", t.title)}>{title}</p>
      <p className={cn("mt-1 text-xl font-bold", t.value)}>{amount}</p>
      {caption && <p className={cn("mt-0.5", t.caption)}>{caption}</p>}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * SEARCHABLE SELECT (compact)
 * --------------------------------------------------------------------------*/
function SearchableSelect({
  value, onChange, options, placeholder = "Select…", className,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(() => [...options].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })), [options]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}
          className={cn("w-full justify-between h-8 text-[11px] px-2", className)}>
          <span className={cn(!value && "text-muted-foreground")}>{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[180px]" align="start">
        <Command>
          <CommandInput placeholder="Type to search…" className="h-8 text-[11px]" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {sorted.map(opt => {
              const selected = value === opt;
              return (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={(val) => { onChange(val); setOpen(false); }}
                  className="text-[11px]"
                >
                  <Check className={cn("mr-2 h-3.5 w-3.5", selected ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{opt}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ----------------------------------------------------------------------------
 * MAIN — Compact layout with BOTH card groups shown (top & bottom)
 * --------------------------------------------------------------------------*/
export default function DashboardMLADemand({ district = "Pune" }: { district?: string }) {
  // Local state
  const [demandList, setDemandList] = useState<Demand[]>(initialDemands);

  // Filters (district locked)
  const [fyFilter, setFyFilter] = useState<string>("All");
  const [planFilter, setPlanFilter] = useState<string>("All");
  const [mlaFilter, setMlaFilter] = useState<string>("All");

  // Dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDemandId, setDetailDemandId] = useState<string | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Options
  const fyOptions = useMemo(() => ["All", ...uniq(works.map(w => w.financialYear))], []);
  const planOptions = ["All", "MLA", "MLC", "HADP"];
  const mlaOptions = useMemo(() => ["All", ...uniq(works.filter(w => w.district === district).map(w => w.mlaName))], [district]);

  // Helper
  const getWorkPlan = (w: Work): "MLA" | "MLC" | "HADP" => "MLA";

  // Rows (scoped to district + filters)
  const rows = useMemo(() => {
    return demandList.filter(d => {
      const w = works.find(wk => wk.id === d.workId);
      if (!w) return false;
      if (w.district !== district) return false;
      if (fyFilter !== "All" && w.financialYear !== fyFilter) return false;
      if (planFilter !== "All" && getWorkPlan(w) !== planFilter) return false;
      if (mlaFilter !== "All" && w.mlaName !== mlaFilter) return false;
      return true;
    });
  }, [demandList, fyFilter, planFilter, mlaFilter, district]);

  // Metrics
  const sumAmount = (list: Demand[]) => list.reduce((s, d) => s + d.amount, 0);
  const isApproved = (d: Demand) => d.status === "Approved";
  const isPending  = (d: Demand) => d.status === "Pending";
  const isRejected = (d: Demand) => d.status === "Rejected";

  // Submitted to State Admin
  const submittedTotalAmt   = sumAmount(rows);
  const submittedApprovedCt = rows.filter(isApproved).length;
  const submittedApprovedAmt= sumAmount(rows.filter(isApproved));
  const submittedRejectedCt = rows.filter(isRejected).length;
  const submittedRejectedAmt= sumAmount(rows.filter(isRejected));
  const submittedPendingCt  = rows.filter(isPending).length;
  const submittedPendingAmt = sumAmount(rows.filter(isPending));

  // Received from IA (same dataset perspective)
  const receivedCt          = rows.length;
  const receivedAmt         = sumAmount(rows);
  const receivedApprovedCt  = submittedApprovedCt;
  const receivedApprovedAmt = submittedApprovedAmt;
  const receivedRejectedCt  = submittedRejectedCt;
  const receivedRejectedAmt = submittedRejectedAmt;
  const receivedPendingCt   = submittedPendingCt;
  const receivedPendingAmt  = submittedPendingAmt;

  // Bulk select
  const allSelected = useMemo(() => rows.length > 0 && rows.every(d => selectedIds.has(d.id)), [rows, selectedIds]);
  const toggleSelect = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSelectAll = () => setSelectedIds(prev => {
    const n = new Set(prev);
    const all = rows.every(d => n.has(d.id));
    rows.forEach(d => all ? n.delete(d.id) : n.add(d.id));
    return n;
  });
  const approveSelected = () => {
    if (selectedIds.size === 0) return;
    setDemandList(list => list.map(d => (selectedIds.has(d.id) ? { ...d, status: "Approved" } : d)));
    setSelectedIds(new Set());
  };
  const openDetails = (id: string) => { setDetailDemandId(id); setDetailOpen(true); };

  /* ---------------------------------- UI ---------------------------------- */
  return (
    <div className="p-5 space-y-4 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">District Fund Demands</h2>
        <span className="px-2.5 py-1 text-[11px] rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          District: <b className="ml-1">{district}</b>
        </span>
      </div>

      {/* ===== TOP KPI BLOCKS (both groups) ===== */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-gray-600">Submitted to State Admin</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <KpiMini title="Total Fund Demands Forwarded" tone="blue"   amount={toCurrency(submittedTotalAmt)}   caption={`Count: ${rows.length}`} />
          <KpiMini title="Total Demands Approved by State" tone="emerald" amount={toCurrency(submittedApprovedAmt)} caption={`Approved: ${submittedApprovedCt}`} />
          <KpiMini title="Rejected by State" tone="rose" amount={toCurrency(submittedRejectedAmt)} caption={`Rejected: ${submittedRejectedCt}`} />
          <KpiMini title="Pending at State for Approval" tone="amber" amount={toCurrency(submittedPendingAmt)} caption={`Pending: ${submittedPendingCt}`} />
        </div>
        <div className="text-[11px] font-medium text-gray-600 mt-2">Received from IA</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <KpiMini title="Demands Received" tone="indigo" amount={toCurrency(receivedAmt)} caption={`Count: ${receivedCt}`} />
          <KpiMini title="Approved Demands" tone="green" amount={toCurrency(receivedApprovedAmt)} caption={`Approved: ${receivedApprovedCt}`} />
          <KpiMini title="Rejected Demands" tone="rose" amount={toCurrency(receivedRejectedAmt)} caption={`Rejected: ${receivedRejectedCt}`} />
          <KpiMini title="Pending for Approval" tone="amber" amount={toCurrency(receivedPendingAmt)} caption={`Pending: ${receivedPendingCt}`} />
        </div>
      </div>

      {/* Filters (compact) */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="py-2">
          <CardTitle className="text-xs">Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-12 gap-2 items-end text-[11px]">
            <div className="col-span-12 sm:col-span-3">
              <span className="block text-[10px] text-gray-600 mb-1">Financial Year</span>
              <SearchableSelect value={fyFilter} onChange={setFyFilter} options={fyOptions} />
            </div>
            <div className="col-span-12 sm:col-span-3">
              <span className="block text-[10px] text-gray-600 mb-1">Plan Type</span>
              <SearchableSelect value={planFilter} onChange={setPlanFilter} options={planOptions} />
            </div>
            <div className="col-span-12 sm:col-span-4">
              <span className="block text-[10px] text-gray-600 mb-1">MLA/MLC Name</span>
              <SearchableSelect value={mlaFilter} onChange={setMlaFilter} options={mlaOptions} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-sm text-gray-800">MLA/MLC Fund Demands</CardTitle>
              <span className="text-[10px] text-red-600 italic">*All Amounts Are in Thousands</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-[11px]">
                <input type="checkbox" className="h-3.5 w-3.5 accent-indigo-600" checked={allSelected} onChange={toggleSelectAll} />
                <span>Select all</span>
              </label>
              <Button
                size="sm"
                className={cn("h-8 text-xs", selectedIds.size === 0 && "opacity-50 pointer-events-none")}
                onClick={approveSelected}
              >
                Approve Selected ({selectedIds.size})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border border-gray-200 text-[12px]">
            <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] sticky top-0">
              <tr>
                <th className="border px-2 py-2 text-center w-10">Sel</th>
                <th className="border px-2 py-2 text-left">Sr No</th>
                <th className="border px-2 py-2 text-left">District</th>
                <th className="border px-2 py-2 text-left">Demand ID</th>
                <th className="border px-2 py-2 text-left">MLA/MLC Account Name</th>
                <th className="border px-2 py-2 text-right">AA Amount</th>
                <th className="border px-2 py-2 text-right">Gross Work Order Amt</th>
                <th className="border px-2 py-2 text-right">Demand Amount</th>
                <th className="border px-2 py-2 text-center">Status</th>
                <th className="border px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-500 text-xs">No records found</td>
                </tr>
              ) : (
                rows.map((d, idx) => {
                  const w = works.find(wk => wk.id === d.workId)!;
                  const gross = w.workPortionAmount + w.taxDeductionAmount;
                  const selected = selectedIds.has(d.id);
                  const chip = (s: Demand["status"]) =>
                    s === "Approved" ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>
                    ) : s === "Rejected" ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
                    );

                  return (
                    <tr key={d.id} className={cn("hover:bg-gray-50", d.status === "Approved" && "bg-emerald-50/40")}>
                      <td className="border px-2 py-2 text-center">
                        <input type="checkbox" className="h-3.5 w-3.5 accent-indigo-600" checked={selected} onChange={() => toggleSelect(d.id)} />
                      </td>
                      <td className="border px-2 py-2">{idx + 1}</td>
                      <td className="border px-2 py-2">{w.district}</td>
                      <td className="border px-2 py-2">{d.id}</td>
                      <td className="border px-2 py-2">{w.mlaName}</td>
                      <td className="border px-2 py-2 text-right">{w.adminApprovedAmount}</td>
                      <td className="border px-2 py-2 text-right">{gross}</td>
                      <td className="border px-2 py-2 text-right">{d.amount.toLocaleString()}</td>
                      <td className="border px-2 py-2 text-center">{chip(d.status)}</td>
                      <td className="border px-2 py-2 text-center">
                        <Dialog open={detailOpen && detailDemandId === d.id} onOpenChange={setDetailOpen}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => openDetails(d.id)}>
                              <Eye className="w-4 h-4 text-indigo-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[90vw] max-w-[1100px]">
                            <MlaFundDemandDetails
                              open={detailOpen && detailDemandId === d.id}
                              onClose={() => setDetailOpen(false)}
                              demand={d}
                              work={w}
                              demands={demandList}
                            />
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ===== BOTTOM KPI BLOCKS (same two groups again) ===== */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-gray-600">Submitted to State Admin</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <KpiMini title="Total Fund Demands Forwarded" tone="blue"   amount={toCurrency(submittedTotalAmt)}   caption={`Count: ${rows.length}`} />
          <KpiMini title="Total Demands Approved by State" tone="emerald" amount={toCurrency(submittedApprovedAmt)} caption={`Approved: ${submittedApprovedCt}`} />
          <KpiMini title="Rejected by State" tone="rose" amount={toCurrency(submittedRejectedAmt)} caption={`Rejected: ${submittedRejectedCt}`} />
          <KpiMini title="Pending at State for Approval" tone="amber" amount={toCurrency(submittedPendingAmt)} caption={`Pending: ${submittedPendingCt}`} />
        </div>
        <div className="text-[11px] font-medium text-gray-600 mt-2">Received from IA</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <KpiMini title="Demands Received" tone="indigo" amount={toCurrency(receivedAmt)} caption={`Count: ${receivedCt}`} />
          <KpiMini title="Approved Demands" tone="green" amount={toCurrency(receivedApprovedAmt)} caption={`Approved: ${receivedApprovedCt}`} />
          <KpiMini title="Rejected Demands" tone="rose" amount={toCurrency(receivedRejectedAmt)} caption={`Rejected: ${receivedRejectedCt}`} />
          <KpiMini title="Pending for Approval" tone="amber" amount={toCurrency(receivedPendingAmt)} caption={`Pending: ${receivedPendingCt}`} />
        </div>
      </div>
    </div>
  );
}
