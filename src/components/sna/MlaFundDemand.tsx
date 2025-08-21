// src/components/DashboardMLADemand.tsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent
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
  status: "Approved" | "Pending";
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
    vendor: {
      id: "1189",
      name: "Shree Ganesh Constructions Pvt. Ltd.",
      aadhar: "123412341234",
    },
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
    vendor: {
      id: "1189",
      name: "Maratha Nirman & Co.",
      aadhar: "987654321098",
    },
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
    vendor: {
      id: "1189",
      name: "Sadguru Infrastructure Ltd.",
      aadhar: "456789123456",
    },
  },
  {
    id: 470,
    workCode: "ML/2425/0325",
    name: "ML/2425/0325 मौजे वेहेरगाव येथे भैरवनाथ मंदिरासमोरील ग्रामपंचायतीच्या मोकळ्या जागेत सभामंडप बांधणे.ता.मावळ.जि.पुणे ग्रामपंचायत वेहेरगाव मालमत्ता क्रमांक 120 Lat18.784103 Long73.465508",
    district: "Pune",
    constituency: "Maval",
    mlaName: "Sunil Shankarrao Shelke",
    financialYear: "2024-25",
    adminApprovedAmount: 1600,
    workPortionAmount: 1400,
    taxDeductionAmount: 100,
    vendor: {
      id: "1189",
      name: "Maharashtra Builders & Developers",
      aadhar: "321098765432",
    },
  },
];

const initialDemands: Demand[] = [
  { id: "MLD-467-1", workId: 467, amount: 500, date: "2025-02-01", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-468-1", workId: 468, amount: 500, date: "2025-02-02", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-469-1", workId: 469, amount: 500, date: "2025-02-03", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-470-1", workId: 470, amount: 500, date: "2025-02-04", status: "Pending",  remarks: "First Installment"  },

  // These refer to works not present; they’ll be ignored automatically by our filter
  { id: "MLD-473-1", workId: 473, amount: 500, date: "2025-02-05", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-473-2", workId: 473, amount: 500, date: "2025-03-05", status: "Approved", remarks: "Second Installment" },
  { id: "MLD-474-1", workId: 474, amount: 500, date: "2025-02-06", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-475-1", workId: 475, amount: 500, date: "2025-02-07", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-475-2", workId: 475, amount: 500, date: "2025-03-07", status: "Approved", remarks: "Second Installment" },
  { id: "MLD-476-1", workId: 476, amount: 500, date: "2025-02-08", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-476-2", workId: 476, amount: 500, date: "2025-03-08", status: "Approved", remarks: "Second Installment" },
  { id: "MLD-477-1", workId: 477, amount: 500, date: "2025-02-09", status: "Pending",  remarks: "First Installment"  },
  { id: "MLD-477-2", workId: 477, amount: 500, date: "2025-03-09", status: "Approved", remarks: "Second Installment" },
];

/* ----------------------------------------------------------------------------
 * SMALL UTILS
 * --------------------------------------------------------------------------*/

function uniq<T>(arr: T[]) { return Array.from(new Set(arr)); }

function toCurrency(n: number) {
  return `₹${(n || 0).toLocaleString()}`;
}

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ----------------------------------------------------------------------------
 * SEARCHABLE SELECT (Combobox)
 * --------------------------------------------------------------------------*/

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(
    () => [...options].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
    [options]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}
          className={cn("w-full justify-between h-9 text-xs", className)}>
          <span className={cn(!value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[200px]" align="start">
        <Command>
          <CommandInput placeholder="Type to search…" className="h-9 text-xs" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {sorted.map(opt => {
              const selected = value === opt;
              return (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={(val) => { onChange(val); setOpen(false); }}
                  className="text-xs"
                >
                  <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
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
 * MAIN COMPONENT
 * --------------------------------------------------------------------------*/

export default function DashboardMLADemand() {
  // Local state for demands (so that Approve updates UI)
  const [demandList, setDemandList] = useState<Demand[]>(initialDemands);

  // Filters
  const [fyFilter, setFyFilter] = useState<string>("All");
  const [planFilter, setPlanFilter] = useState<string>("All"); // "All" | "MLA" | "MLC" | "HADP"
  const [districtFilter, setDistrictFilter] = useState<string>("All");
  const [mlaFilter, setMlaFilter] = useState<string>("All");

  // Details dialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDemandId, setDetailDemandId] = useState<string | null>(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allSelected = useMemo(
    () => selectedIds.size > 0 && filteredDemands().every(d => selectedIds.has(d.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, fyFilter, planFilter, districtFilter, mlaFilter, demandList]
  );

  // Options
  const fyOptions = useMemo(() => ["All", ...uniq(works.map(w => w.financialYear))], []);
  const planOptions = ["All", "MLA", "MLC", "HADP"];
  const districtOptions = useMemo(() => ["All", ...uniq(works.map(w => w.district))], []);
  const mlaOptions = useMemo(() => ["All", ...uniq(works.map(w => w.mlaName))], []);

  // Helper: derive plan type for a work (dummy -> MLA for all in our data)
  const getWorkPlan = (w: Work): "MLA" | "MLC" | "HADP" => {
    // In provided dummy data, all are MLA. Adjust as needed if you add more.
    return "MLA";
  };

  // Filtered demands (only those whose work exists)
  const filteredDemands = () => {
    return demandList.filter(d => {
      const w = works.find(wk => wk.id === d.workId);
      if (!w) return false; // ignore orphaned records

      if (fyFilter !== "All" && w.financialYear !== fyFilter) return false;
      if (planFilter !== "All" && getWorkPlan(w) !== planFilter) return false;
      if (districtFilter !== "All" && w.district !== districtFilter) return false;
      if (mlaFilter !== "All" && w.mlaName !== mlaFilter) return false;

      return true;
    });
  };

  // Metrics (based on current filtered demands)
  const totalDemandAmount = useMemo(
    () => filteredDemands().reduce((s, d) => s + d.amount, 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fyFilter, planFilter, districtFilter, mlaFilter, demandList]
  );
  const totalDemandsCount = useMemo(
    () => filteredDemands().length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fyFilter, planFilter, districtFilter, mlaFilter, demandList]
  );
  const totalPendingInFilter = useMemo(
    () => filteredDemands().filter(d => d.status === "Pending").length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fyFilter, planFilter, districtFilter, mlaFilter, demandList]
  );

  // Actions
  const openDetails = (id: string) => {
    setDetailDemandId(id);
    setDetailOpen(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const visible = filteredDemands();
    setSelectedIds(prev => {
      const next = new Set(prev);
      const everySelected = visible.every(d => next.has(d.id));
      if (everySelected) {
        visible.forEach(d => next.delete(d.id));
      } else {
        visible.forEach(d => next.add(d.id));
      }
      return next;
    });
  };

  const approveSelected = () => {
    if (selectedIds.size === 0) return;
    setDemandList(list =>
      list.map(d => (selectedIds.has(d.id) ? { ...d, status: "Approved" } : d))
    );
    setSelectedIds(new Set()); // clear selection
  };

  /* ---------------------------------------------------------------------- */
  /*                                   UI                                   */
  /* ---------------------------------------------------------------------- */

  const rows = filteredDemands();

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
        {/* Total Demand Amount */}
        <motion.div
          className="rounded-md p-4 shadow-sm border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold text-blue-700 uppercase">Total Demand Amount</p>
                    <p className="text-[11px] text-blue-700/70 mt-1">Pending At State For Approval</p>

          <p className="mt-1 text-2xl font-bold text-blue-900">{toCurrency(totalDemandAmount)}</p>
        </motion.div>

        {/* Total Number Of Demands */}
        <motion.div
          className="rounded-md p-4 shadow-sm border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        >
          <p className="text-xs font-semibold text-emerald-700 uppercase">Total Number of Demands</p>
                    <p className="text-[11px] text-emerald-700/70 mt-1">Pending At State For Approval</p>

          <p className="mt-1 text-2xl font-bold text-emerald-900">{rows.length}</p>
        </motion.div>

        {/* Fund Demands Pending On District */}
        <motion.div
  className="rounded-md p-4 shadow-sm border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100"
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  <p className="text-xs font-semibold text-blue-700 uppercase">Fund Demands Amount</p>
  <p className="text-[11px] text-blue-700/70 mt-1">
    {districtFilter === "All" ? "Pending at All districts For Approval" : `District: ${districtFilter}`}
  </p>
  <p className="mt-1 text-2xl font-bold text-blue-900">{toCurrency(1000)}</p>
  
</motion.div>
        <motion.div
          className="rounded-md p-4 shadow-sm border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-90"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <p className="text-xs font-semibold text-emerald-700 uppercase">total No of  Demands</p>
          <p className="text-[11px] text-emerald-700/70 mt-1">
            {districtFilter === "All" ? "Pending at All districts" : `District: ${districtFilter}`}
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{totalPendingInFilter}</p>
          
        </motion.div>


      </div>

      {/* Filters (compact, searchable) */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
              <span className="block text-[11px] text-gray-600 mb-1">Financial Year</span>
              <SearchableSelect value={fyFilter} onChange={setFyFilter} options={fyOptions} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
              <span className="block text-[11px] text-gray-600 mb-1">Plan Type</span>
              <SearchableSelect value={planFilter} onChange={setPlanFilter} options={planOptions} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
              <span className="block text-[11px] text-gray-600 mb-1">District</span>
              <SearchableSelect value={districtFilter} onChange={setDistrictFilter} options={districtOptions} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
              <span className="block text-[11px] text-gray-600 mb-1">MLA/MLC Name</span>
              <SearchableSelect value={mlaFilter} onChange={setMlaFilter} options={mlaOptions} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base text-gray-800">MLA/MLC Fund Demands</CardTitle>
              <span className="text-xs text-red-600 italic">*All Amounts Are in Thousands</span>
            </div>

            {/* Bulk actions (Select all + Approve) */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span>Select all</span>
              </label>
              <Button
                size="sm"
                className={cn(
                  "h-8",
                  selectedIds.size === 0 && "opacity-50 pointer-events-none"
                )}
                onClick={approveSelected}
              >
                Approve Selected ({selectedIds.size})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="border px-3 py-2 text-center w-10">Sel</th>
                <th className="border px-3 py-2 text-left">Sr No</th>
                <th className="border px-3 py-2 text-left">District</th>
                <th className="border px-3 py-2 text-left">Demand ID</th>
                <th className="border px-3 py-2 text-left">MLA/MLC Account Name</th>
                <th className="border px-3 py-2 text-right">AA Amount</th>
                <th className="border px-3 py-2 text-right">Gross Work Order Amt</th>
                <th className="border px-3 py-2 text-right">Demand Amount</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-gray-500">No records found</td>
                </tr>
              ) : (
                rows.map((d, idx) => {
                  const w = works.find(wk => wk.id === d.workId)!;
                  const gross = w.workPortionAmount + w.taxDeductionAmount;
                  const selected = selectedIds.has(d.id);

                  return (
                    <tr key={d.id} className={cn("hover:bg-gray-50", d.status === "Approved" && "bg-green-50/50")}>
                      <td className="border px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-blue-600"
                          checked={selected}
                          onChange={() => toggleSelect(d.id)}
                        />
                      </td>
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{w.district}</td>
                      <td className="border px-3 py-2">{d.id}</td>
                      <td className="border px-3 py-2">{w.mlaName}</td>
                      <td className="border px-3 py-2 text-right">{w.adminApprovedAmount}</td>
                      <td className="border px-3 py-2 text-right">{gross}</td>
                      <td className="border px-3 py-2 text-right">{d.amount.toLocaleString()}</td>
                      <td className="border px-3 py-2 text-center">
                        <Dialog open={detailOpen && detailDemandId === d.id} onOpenChange={setDetailOpen}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => openDetails(d.id)}>
                              <Eye className="w-5 h-5 text-blue-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[90vw] max-w-[1200px]">
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
    </div>
  );
}
