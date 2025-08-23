// src/components/Dashboard.tsx
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

// If using lodash: import { uniq } from "lodash";
const uniq = (arr: any[]) => Array.from(new Set(arr));

import { hadpMock } from "@/components/data/mlaData";
const mlaMlcData = {
  financialYear: "2025-2026",
  planType: "ML",
  data: [
    { district: "PUNE", taluka: "Pimpri", type: "MLA", term: 15, name: "Anna Dadu Bansode", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 20000 },
    { district: "PUNE", taluka: "Baramati", type: "MLA", term: 14, name: "Ajit Anantrao Pawar", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 10000 },
    { district: "PUNE", taluka: "Khed Alandi", type: "MLA", term: 15, name: "Babaji Ramchandra Kale", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 10000 },
    { district: "PUNE", taluka: "Vadgaon Sheri", type: "MLA", term: 14, name: "Bapusaheb Tukaram Pathare", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Khadakwasala", type: "MLA", term: 14, name: "Bhimrao Dhondiba Tapkir", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Bhosari", type: "MLA", term: 15, name: "Mahesh Landge", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Hadapsar", type: "MLA", term: 15, name: "Chetan Tupe", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Kothrud", type: "MLA", term: 15, name: "Chandrakant Bachhu Patil", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Indapur", type: "MLA", term: 15, name: "Dattatraya Vithoba Bharne", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Shirur", type: "MLA", term: 14, name: "Dnyaneshwar Katke", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Ambegaon", type: "MLA", term: 14, name: "Dilip Walse-Patil", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Kasba Peth", type: "MLA", term: 15, name: "Hemant Narayan Rasane", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Chinchwad", type: "MLA", term: 14, name: "Shankar Jagtap", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Bhor", type: "MLA", term: 15, name: "Shankar Hiraman Mandekar", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Shivajinagar", type: "MLA", term: 15, name: "Siddharth Shirole", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Pune Cantonment", type: "MLA", term: 14, name: "Suni Dnyandev Kamble", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Maval", type: "MLA", term: 15, name: "Sunil Shankarrao Shelke", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Parvati", type: "MLA", term: 15, name: "Madhuri Satish Misal", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Daund", type: "MLA", term: 14, name: "Rahul Subhashrao Kul", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Junnar", type: "MLA", term: 14, name: "Sharad Sonavane", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    { district: "PUNE", taluka: "Purandar", type: "MLA", term: 14, name: "Vijay Shivtare", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 },
    // one MLC sample (you can add more real MLC entries)
    { district: "PUNE", taluka: "Purandar", type: "MLC", term: 14, name: "Vijay Shivtare", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: "150000" as any, fundUtilized: 0, balance: 70000, pendingDemands: 0 }
  ]
};

type Plan = "ML-MLA" | "ML-MLC" | "HADP";

/** simple cn helper */
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Reusable searchable combobox powered by shadcn Command + Popover */
function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // ensure stable option display order (alphabetical), but keep "All" first if present
  const sorted = useMemo(() => {
    const arr = [...options];
    const hasAll = arr.includes("All");
    const rest = arr.filter((o) => o !== "All").sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    return hasAll ? ["All", ...rest] : rest;
  }, [options]);

  const currentLabel = value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {currentLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[220px]">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {sorted.map((opt) => {
              const selected = value === opt;
              return (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={(val) => {
                    onValueChange(val);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                  <span>{opt}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const Dashboard: React.FC = () => {
  // — State
  const [fy, setFy] = useState<string>(mlaMlcData.financialYear);
  const [planType, setPlanType] = useState<Plan>("ML-MLA");

  // MLA filters
  const [mlaDistrict, setMlaDistrict] = useState<string>("All");
  const [mlaName, setMlaName] = useState<string>("All");

  // MLC filters
  const [mlcDistrict, setMlcDistrict] = useState<string>("All");
  const [mlcName, setMlcName] = useState<string>("All");

  // HADP-specific filters
  const [hadpDistrict, setHadpDistrict] = useState("All");
  const [hadpTaluka, setHadpTaluka] = useState("All");

  const [showPendingOnly, setShowPendingOnly] = useState<boolean>(false);

  // — Reset on plan change
  useEffect(() => {
    setShowPendingOnly(false);
    setMlaDistrict("All");
    setMlaName("All");
    setMlcDistrict("All");
    setMlcName("All");
    setHadpDistrict("All");
    setHadpTaluka("All");
  }, [planType]);

  useEffect(() => { setMlaName("All"); setShowPendingOnly(false); }, [mlaDistrict]);
  useEffect(() => { setMlcName("All"); setShowPendingOnly(false); }, [mlcDistrict]);
  useEffect(() => { setHadpTaluka("All"); }, [hadpDistrict]);

  // — Dropdown options
  const fyOptions = useMemo(() => ["All", mlaMlcData.financialYear], []);
  const planOptions: Plan[] = ["ML-MLA", "ML-MLC", "HADP"];

  // MLA
  const mlaData = useMemo(() => mlaMlcData.data.filter(d => d.type === "MLA"), []);
  const mlaDistrictOptions = useMemo(() => ["All", ...uniq(mlaData.map(d => d.district))], [mlaData]);
  const mlaNameOptions = useMemo(() => {
    const arr = mlaData
      .filter(d => mlaDistrict === "All" || d.district === mlaDistrict)
      .map(d => d.name);
    return ["All", ...uniq(arr)];
  }, [mlaData, mlaDistrict]);

  // MLC
  const mlcData = useMemo(() => mlaMlcData.data.filter(d => d.type === "MLC"), []);
  const mlcDistrictOptions = useMemo(() => ["All", ...uniq(mlcData.map(d => d.district))], [mlcData]);
  const mlcNameOptions = useMemo(() => {
    const arr = mlcData
      .filter(d => mlcDistrict === "All" || d.district === mlcDistrict)
      .map(d => d.name);
    return ["All", ...uniq(arr)];
  }, [mlcData, mlcDistrict]);

  // HADP filter options
  const hadpDistrictOptions = useMemo(
    () => ["All", ...uniq(hadpMock.map(d => d.district || "Unknown"))],
    []
  );
  const hadpTalukaOptions = useMemo(() => {
    if (hadpDistrict === "All") {
      return ["All", ...uniq(hadpMock.map(d => d.taluka || "Unknown"))];
    }
    return ["All", ...uniq(hadpMock.filter(d => d.district === hadpDistrict).map(d => d.taluka || "Unknown"))];
  }, [hadpDistrict]);

  // — Filtered & SORTED MLA (alphabetical by MLA Name)
  const rowsMLA = useMemo(() => {
    let filtered = mlaData
      .filter(d => fy === "All" || mlaMlcData.financialYear === fy)
      .filter(d => mlaDistrict === "All" || d.district === mlaDistrict)
      .filter(d => mlaName === "All" || d.name === mlaName)
      .filter(d => !showPendingOnly || d.pendingDemands > 0);
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
    return filtered;
  }, [mlaData, fy, mlaDistrict, mlaName, showPendingOnly]);

  // — Filtered & SORTED MLC (alphabetical by MLC Name)
  const rowsMLC = useMemo(() => {
    let filtered = mlcData
      .filter(d => fy === "All" || mlaMlcData.financialYear === fy)
      .filter(d => mlcDistrict === "All" || d.district === mlcDistrict)
      .filter(d => mlcName === "All" || d.name === mlcName)
      .filter(d => !showPendingOnly || d.pendingDemands > 0);
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
    return filtered;
  }, [mlcData, fy, mlcDistrict, mlcName, showPendingOnly]);

  // — Aggregated HADP rows
  const rowsH = useMemo(() => {
    let filtered = hadpMock;
    if (hadpDistrict !== "All") filtered = filtered.filter(r => r.district === hadpDistrict);
    if (hadpTaluka !== "All") filtered = filtered.filter(r => r.taluka === hadpTaluka);

    const map: Record<string, { budget: number; utilized: number; balance: number; pendingDemands: number; demandCode: string }> = {};
    filtered.forEach(r => {
      if (!map[r.demandCode])
        map[r.demandCode] = { budget: 0, utilized: 0, balance: 0, pendingDemands: 0, demandCode: r.demandCode };
      map[r.demandCode].budget += r.demandAmount;
      if (r.status === "Approved") map[r.demandCode].utilized += r.demandAmount;
      else map[r.demandCode].balance += r.demandAmount;
      if (r.status !== "Approved") map[r.demandCode].pendingDemands += r.demandAmount;
    });
    let arr = Object.values(map);
    arr = arr.sort((a, b) => a.demandCode.localeCompare(b.demandCode, "en", { sensitivity: "base" }));
    return arr;
  }, [hadpDistrict, hadpTaluka, showPendingOnly]);

  // — Metrics & helpers
  const toK = (v: number) => (v / 1).toFixed(1);
  const pct = (p: number, t: number) => (t > 0 ? `${((p / t) * 100).toFixed(1)}%` : "0%");

  // Totals
  const allMLA = useMemo(() => mlaData.reduce((s, r) => s + r.budget, 0), [mlaData]);
  const allMLC = useMemo(() => mlcData.reduce((s, r) => s + r.budget, 0), [mlcData]);
  const allHD = useMemo(() => hadpMock.reduce((s, r) => s + r.demandAmount, 0), []);

  // Footers (within filters)
  const footerMLA = useMemo(() =>
    rowsMLA.reduce((a, r) => {
      a.budget += r.budget;
      a.utilized += r.fundUtilized;
      a.pendingDemands += r.pendingDemands;
      a.balance += r.balance;
      return a;
    }, { budget: 0, utilized: 0, pendingDemands: 0, balance: 0 }),
    [rowsMLA]
  );

  const footerMLC = useMemo(() =>
    rowsMLC.reduce((a, r) => {
      a.budget += r.budget;
      a.utilized += r.fundUtilized;
      a.pendingDemands += r.pendingDemands;
      a.balance += r.balance;
      return a;
    }, { budget: 0, utilized: 0, pendingDemands: 0, balance: 0 }),
    [rowsMLC]
  );

  const footerH = useMemo(() =>
    rowsH.reduce((a, r) => {
      a.budget += r.budget;
      a.utilized += r.utilized;
      a.balance += r.balance;
      a.pendingDemands += r.pendingDemands;
      return a;
    }, { budget: 0, utilized: 0, pendingDemands: 0, balance: 0 }),
    [rowsH]
  );

  // >>> New counts for MLA cards (per your request)
  const totalMLAsCount = useMemo(() => mlaData.length, [mlaData]); // 21
  const disbursedDemandsCount = 0;   // as requested
  const pendingDemandsCount = 13;    // as requested

  // — Cards (dynamic) with subtitles
  const metricCards = useMemo(() => {
    if (planType === "ML-MLA") {
      return [
        {
          title: "Total MLA Budget Sanctioned",
          value: footerMLA.budget,
          whole: footerMLA.budget,
          color: "green",
          sub: `Total MLAs: ${totalMLAsCount}`
        },
        {
          title: "Disbursed Amount",
          value: footerMLA.utilized,
          whole: footerMLA.budget,
          color: "yellow",
          sub: `Demands: ${disbursedDemandsCount}`
        },
        {
          title: "MLA Balance Amount",
          value: footerMLA.balance,
          whole: footerMLA.budget,
          color: "red",
          sub: "" // no changes requested
        },
        {
          title: "MLA Pending Demands",
          value: footerMLA.pendingDemands,
          whole: footerMLA.budget,
          color: "orange",
          sub: `No. of Demands: ${pendingDemandsCount}`
        }
      ] as const;
    }
    if (planType === "ML-MLC") {
      return [
        { title: "Total MLC Budget", value: footerMLC.budget, whole: footerMLC.budget, color: "blue", sub: "" },
        { title: "MLC Total Funds Disbursed", value: footerMLC.utilized, whole: footerMLC.budget, color: "green", sub: "" },
        { title: "MLC Balance Budget Amount", value: footerMLC.balance, whole: footerMLC.budget, color: "red", sub: "" },
        { title: "Pending Demand Amount", value: footerMLC.pendingDemands, whole: footerMLC.budget, color: "yellow", sub: "" }
      ] as const;
    }
    return [
      { title: "Total HADP Budget", value: footerH.budget, whole: footerH.budget, color: "blue", sub: "" },
      { title: "Total Funds Approved", value: footerH.utilized, whole: footerH.budget, color: "green", sub: "" },
      { title: "HADP Balance Budget ", value: footerH.balance, whole: footerH.budget, color: "red", sub: "" },
      { title: "HADP Pending Demand Amount", value: footerH.pendingDemands, whole: footerH.budget, color: "yellow", sub: "" }
    ] as const;
  }, [planType, footerMLA, footerMLC, footerH, totalMLAsCount]);

  // — Main Dashboard
  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="flex-1 min-w-[200px]">
          <Label className="mb-1 block" htmlFor="fy">Financial Year</Label>
          <SearchableSelect
            value={fy}
            onValueChange={setFy}
            options={fyOptions}
            placeholder="Select Financial Year"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <Label className="mb-1 block" htmlFor="plan">Plan Type</Label>
          <SearchableSelect
            value={planType}
            onValueChange={(v) => setPlanType(v as Plan)}
            options={planOptions as unknown as string[]}
            placeholder="Select Plan Type"
          />
        </div>

        {planType === "ML-MLA" && (
          <>
            <div className="flex-1 min-w-[220px]">
              <Label className="mb-1 block" htmlFor="mlaDistrict">District</Label>
              <SearchableSelect
                value={mlaDistrict}
                onValueChange={setMlaDistrict}
                options={mlaDistrictOptions}
                placeholder="Select District"
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <Label className="mb-1 block" htmlFor="mlaname">MLA Name</Label>
              <SearchableSelect
                value={mlaName}
                onValueChange={setMlaName}
                options={mlaNameOptions}
                placeholder="Select MLA"
              />
            </div>
          </>
        )}

        {planType === "ML-MLC" && (
          <>
            <div className="flex-1 min-w-[220px]">
              <Label className="mb-1 block" htmlFor="mlcDistrict">Nodal District</Label>
              <SearchableSelect
                value={mlcDistrict}
                onValueChange={setMlcDistrict}
                options={mlcDistrictOptions}
                placeholder="Select District"
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <Label className="mb-1 block" htmlFor="mlcname">MLC Name</Label>
              <SearchableSelect
                value={mlcName}
                onValueChange={setMlcName}
                options={mlcNameOptions}
                placeholder="Select MLC"
              />
            </div>
          </>
        )}

        {planType === "HADP" && (
          <>
            <div className="flex-1 min-w-[220px]">
              <Label className="mb-1 block" htmlFor="hadpDistrict">District</Label>
              <SearchableSelect
                value={hadpDistrict}
                onValueChange={setHadpDistrict}
                options={hadpDistrictOptions}
                placeholder="Select District"
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <Label className="mb-1 block" htmlFor="hadpTaluka">Taluka</Label>
              <SearchableSelect
                value={hadpTaluka}
                onValueChange={setHadpTaluka}
                options={hadpTalukaOptions}
                placeholder="Select Taluka"
              />
            </div>
          </>
        )}
      </div>

      {/* Overview */}
      <div className="grid grid-cols-6 gap-3">
        <motion.div
          className="col-span-6 sm:col-span-3 lg:col-span-2 border-l-4 border-purple-600 bg-white p-3 rounded-md shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold text-purple-600 uppercase">Overview</p>
          <div className="mt-1 text-xs space-y-0.5">
            {[
              { label: "Total MLA Fund", val: allMLA },
              { label: "Total MLC Fund", val: allMLC },
              { label: "HADP", val: allHD }
            ].map((b, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex justify-between">
                  <span>{b.label}</span>
                  <span>₹{toK(b.val)}</span>
                </div>
                <div className="flex justify-end">
                  <small className="text-gray-500">
                    {pct(b.val, allMLA + allMLC + allHD)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Metric Cards (now with subtitles) */}
        {metricCards.map((c, i) => (
          <motion.div
            key={i}
            className={`col-span-6 sm:col-span-3 lg:col-span-1 border-l-4 border-${c.color}-500 bg-${c.color}-50 p-2 rounded-md shadow-sm cursor-pointer`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (String(c.title).toLowerCase().includes("pending")) {
                setShowPendingOnly(x => !x);
              } else {
                setShowPendingOnly(false);
              }
            }}
          >
            <p className={`text-xs font-semibold text-${c.color}-700`}>{c.title}</p>
            <p className={`mt-1 text-lg font-bold text-${c.color}-900`}>
              {String(c.title).toLowerCase().includes("pending")
                ? c.value
                : `₹${toK(c.value)}`}
            </p>
            {c.sub ? (
              <p className={`mt-0.5 text-[11px] text-${c.color}-700/80`}>{c.sub}</p>
            ) : null}
            <div className="flex justify-end">
              <small className={`text-${c.color}-700 opacity-80`}>{pct(c.value, c.whole)}</small>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MLA Table (sorted A→Z by MLA Name) */}
      {planType === "ML-MLA" && (
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">
              MLA Details
              <div className="flex gap-2 text-right">
                <span className="text-[10px] text-red-500">*Balance = Budget Amount - Fund Distributed |</span>
                <span className="text-[10px] text-red-500">*Amounts In Thousand</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                <TableRow>
                  <TableHead className="border px-2 py-1">S.No</TableHead>
                  
                  <TableHead className="border px-2 py-1">MLA Name</TableHead>
                  <TableHead className="border px-2 py-1">Assembly Constituency</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Budgeted Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Funds Disbursed</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Balance Funds</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Pending Demands</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsMLA.map((r, idx) => (
                  <TableRow key={`${r.name}|${idx}`}>
                    <TableCell className="border px-2 py-1 text-xs">{idx + 1}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.name}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.taluka}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.budget)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.fundUtilized)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.balance)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">
                      <Button
                        variant="link"
                        className="text-blue-600 underline p-0 h-auto"
                        onClick={() => handlePendingClick("ML-MLA", r)}
                      >
                        {toK(r.pendingDemands)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="border px-2 py-1 font-semibold">Total</TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLA.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLA.utilized.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLA.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLA.pendingDemands.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MLC Table */}
      {planType === "ML-MLC" && (
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">
              MLC Details
              <div className="flex gap-2 text-right">
                <span className="text-[10px] text-red-500">*Balance = Budget Amount - Fund Distributed |</span>
                <span className="text-[10px] text-red-500">*Amounts In Thousand</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                <TableRow>
                  <TableHead className="border px-2 py-1">Sr No</TableHead>
                  <TableHead className="border px-2 py-1">MLC NAME</TableHead>
                  <TableHead className="border px-2 py-1">Nodal District</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Budget Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Total funds disbursed</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Balance Funds</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Pending Demands</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsMLC.map((r, idx) => (
                  <TableRow key={`${r.name}|${idx}`}>
                    <TableCell className="border px-2 py-1 text-xs">{idx + 1}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.name}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.district}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.budget)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.fundUtilized)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.balance)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">
                      <Button
                        variant="link"
                        className="text-blue-600 underline p-0 h-auto"
                        onClick={() => handlePendingClick("ML-MLC", r)}
                      >
                        {toK(r.pendingDemands)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="border px-2 py-1 font-semibold">Total</TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLC.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLC.utilized.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLC.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLC.pendingDemands.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* HADP Table */}
      {planType === "HADP" && (
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">
              HADP Summary <span className="text-xs text-red-300 italic">*Amounts In Thousands</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                <TableRow>
                  <TableHead className="border px-2 py-1">S.No</TableHead>
                  <TableHead className="border px-2 py-1">Taluka / Demand Code</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Budget Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Disbursed Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Balance Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Pending Demand Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsH.map((r, idx) => (
                  <TableRow key={r.demandCode}>
                    <TableCell className="border px-2 py-1 text-xs">{idx + 1}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.demandCode}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.budget)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.utilized)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.balance)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">
                      <Button
                        variant="link"
                        className="text-blue-600 underline p-0 h-auto"
                        onClick={() => handlePendingClick("HADP", r)}
                      >
                        {toK(r.pendingDemands)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="border px-2 py-1 font-semibold">Total</TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.utilized.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.pendingDemands.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
